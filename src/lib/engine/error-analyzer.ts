import { ErrorType } from "@/types";

export interface AnalyzedError {
  type: ErrorType;
  message: string;
  suggestion: string;
}

export function analyzeSqlError(
  rawError: string,
  userSql: string,
  userRows: Record<string, any>[],
  userColumns: string[],
  expectedRows: Record<string, any>[],
  expectedColumns: string[],
  orderMatters: boolean
): AnalyzedError {
  const cleanSql = userSql.toLowerCase();

  // 1. Raw Database / Syntax Errors
  if (rawError) {
    if (rawError.includes("syntax error")) {
      let suggestion = "Sorgunuzdaki yazım sırasını ve noktalama işaretlerini gözden geçirin.";

      if (/=\s*>/.test(userSql)) {
        suggestion = "'>=' operatörünü arada boşluk bırakmadan birleşik yazmalısınız: '>= 18'";
      } else if (/=\s*</.test(userSql)) {
        suggestion = "'<=' operatörünü arada boşluk bırakmadan birleşik yazmalısınız: '<= 10'";
      } else if (rawError.includes("unterminated quoted string") || userSql.split("'").length % 2 === 0) {
        suggestion = "Açtığınız tek tırnak işaretini (') kapatmayı unutmuş olabilirsiniz. Metin filtrelerini 'Istanbul' gibi tek tırnak arasına alın.";
      } else if (cleanSql.includes("select") && !cleanSql.includes("from")) {
        suggestion = "SELECT ifadesinden sonra verinin hangi tablodan çekileceğini belirtmek için 'FROM [tablo_adi]' eklemelisiniz.";
      } else if (cleanSql.includes("where") && cleanSql.includes("group by") && cleanSql.indexOf("group by") < cleanSql.indexOf("where")) {
        suggestion = "SQL sözdiziminde WHERE koşulu GROUP BY ifadesinden ÖNCE yazılmalıdır.";
      }

      return {
        type: "SYNTAX_ERROR",
        message: "SQL Sözdizimi (Syntax) Hatası tespit edildi.",
        suggestion,
      };
    }

    if (rawError.includes("column") && rawError.includes("does not exist")) {
      const match = rawError.match(/column "(.*?)" does not exist/);
      const colName = match ? match[1] : "belirtilen";
      return {
        type: "EXECUTION_ERROR",
        message: `'${colName}' adında bir kolon tabloda bulunamadı.`,
        suggestion: "Sol paneldeki Veritabanı Gezgininden tablo şemasındaki kolon isimlerini tam olarak kontrol edin.",
      };
    }

    if (rawError.includes("relation") && rawError.includes("does not exist")) {
      const match = rawError.match(/relation "(.*?)" does not exist/);
      const tblName = match ? match[1] : "belirtilen";
      return {
        type: "EXECUTION_ERROR",
        message: `'${tblName}' adında bir tablo bulunamadı.`,
        suggestion: "FROM veya JOIN yanına yazdığınız tablo adının doğru yazıldığından emin olun.",
      };
    }

    if (rawError.includes("must appear in the GROUP BY clause or be used in an aggregate function")) {
      return {
        type: "EXECUTION_ERROR",
        message: "Gruplama kuralı ihlali: Aggregation fonksiyonu (SUM, COUNT vb.) dışında kalan tüm SELECT kolonları GROUP BY içinde yer almalıdır.",
        suggestion: "SELECT kısmında seçtiğiniz fakat aggregate etmediğiniz kolonları GROUP BY listesine ekleyin.",
      };
    }

    return {
      type: "EXECUTION_ERROR",
      message: "Sorgu çalıştırılırken bir veritabanı hatası oluştu.",
      suggestion: rawError,
    };
  }

  // 2. Column Mismatch Checks
  const normUserCols = userColumns.map((c) => c.toLowerCase());
  const normExpCols = expectedColumns.map((c) => c.toLowerCase());

  const missingCols = normExpCols.filter((c) => !normUserCols.includes(c));
  const extraCols = normUserCols.filter((c) => !normExpCols.includes(c));

  if (missingCols.length > 0 && normExpCols.length > 0) {
    return {
      type: "COLUMN_MISMATCH",
      message: `Beklenen çıktıdaki bazı kolonlar eksik: [${missingCols.join(", ")}]`,
      suggestion: "SELECT kısmında istenen tüm kolonları (veya varsa takma adları / AS) doğru eklediğinizden emin olun.",
    };
  }

  if (extraCols.length > 0 && normExpCols.length > 0) {
    return {
      type: "COLUMN_MISMATCH",
      message: `Sonuçta istenmeyen fazla kolonlar mevcut: [${extraCols.join(", ")}]`,
      suggestion: "Yalnızca görevde talep edilen kolonları SELECT ifadesine dahil edin.",
    };
  }

  // 3. Row Count and Dataset Content Checks
  if (userRows.length === 0 && expectedRows.length > 0) {
    return {
      type: "EMPTY_RESULT",
      message: "Sorgunuz 0 satır döndürdü (Boş sonuç kümesi).",
      suggestion: "WHERE filtrenizin çok katı olup olmadığını veya JOIN şartındaki anahtarların doğru eşleştiğini kontrol edin.",
    };
  }

  if (userRows.length !== expectedRows.length) {
    if (userRows.length < expectedRows.length) {
      return {
        type: "ROW_COUNT_MISMATCH",
        message: `Çok az satır geldi: Sorgunuz ${userRows.length} satır üretti, ancak beklenen sonuç ${expectedRows.length} satır içeriyor.`,
        suggestion: "WHERE filtrelerinizin gereğinden fazla satırı eleyip elemediğini veya INNER JOIN yerine LEFT JOIN gerekip gerekmediğini kontrol edin.",
      };
    } else {
      return {
        type: "ROW_COUNT_MISMATCH",
        message: `Fazla satır geldi: Sorgunuz ${userRows.length} satır üretti, ancak beklenen sonuç ${expectedRows.length} satır içeriyor.`,
        suggestion: "Filtreleme (WHERE) koşullarınızı eksiksiz eklediğinizden veya JOIN bağlantısında kartezyen çarpım (çift satır) oluşmadığından emin olun.",
      };
    }
  }

  // 4. Ordering Mismatch
  if (orderMatters) {
    return {
      type: "ORDERING_MISMATCH",
      message: "Dönen satır sayıları ve veriler doğru, ancak satırların SIRALAMASI beklenenle uyuşmuyor.",
      suggestion: "ORDER BY yan tümcesinde ASC (artan) veya DESC (azalan) yönlendirmesini ve sıralama kolonunu kontrol edin.",
    };
  }

  // 5. Data Content Mismatch
  return {
    type: "DATA_MISMATCH",
    message: "Dönen tablodaki bazı hücre değerleri beklenen sonuçla eşleşmiyor.",
    suggestion: "Hesaplama formüllerinizi (SUM/AVG), koşul mantığınızı veya CASE WHEN kurallarınızı gözden geçirin.",
  };
}
