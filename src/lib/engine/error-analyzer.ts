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
      let suggestion = "Sorgunuzdaki sözdizimi sırasını, anahtar sözcükleri ve noktalama işaretlerini gözden geçirin.";

      if (/=\s*>/.test(userSql)) {
        suggestion = "'>=' karşılaştırma operatörü bitişik yazılmalıdır (arada boşluk olmadan): '>= 18'";
      } else if (/=\s*</.test(userSql)) {
        suggestion = "'<=' karşılaştırma operatörü bitişik yazılmalıdır (arada boşluk olmadan): '<= 10'";
      } else if (rawError.includes("unterminated quoted string") || userSql.split("'").length % 2 === 0) {
        suggestion = "Açılan tek tırnak işareti (') kapatılmamış. SQL metin filtrelerini 'Istanbul' şeklinde tek tırnak içine alın.";
      } else if (cleanSql.includes("select") && !cleanSql.includes("from")) {
        suggestion = "SELECT projeksiyonundan sonra hedef veritabanı tablosunu belirtmek için 'FROM [tablo_adi]' eklemelisiniz.";
      } else if (cleanSql.includes("where") && cleanSql.includes("group by") && cleanSql.indexOf("group by") < cleanSql.indexOf("where")) {
        suggestion = "SQL mantıksal yürütme sırası gereği WHERE koşulu, GROUP BY ifadesinden ÖNCE yer almalıdır.";
      }

      return {
        type: "SYNTAX_ERROR",
        message: "SQL Sözdizimi (Syntax Error) tespit edildi.",
        suggestion,
      };
    }

    if (rawError.includes("column") && rawError.includes("does not exist")) {
      const match = rawError.match(/column "(.*?)" does not exist/);
      const colName = match ? match[1] : "belirtilen";
      return {
        type: "EXECUTION_ERROR",
        message: `'${colName}' adında bir sütun şemada bulunamadı.`,
        suggestion: "Sol paneldeki Veritabanı Gezgininden hedef tablonun sütun isimlerini ve yazılışlarını kontrol edin.",
      };
    }

    if (rawError.includes("relation") && rawError.includes("does not exist")) {
      const match = rawError.match(/relation "(.*?)" does not exist/);
      const tblName = match ? match[1] : "belirtilen";
      return {
        type: "EXECUTION_ERROR",
        message: `'${tblName}' adında bir tablo şemada bulunamadı.`,
        suggestion: "FROM veya JOIN ifadesinde tanımlanan tablo adının doğruluğunu ve şema eşleşmesini kontrol edin.",
      };
    }

    if (rawError.includes("must appear in the GROUP BY clause or be used in an aggregate function")) {
      return {
        type: "EXECUTION_ERROR",
        message: "PostgreSQL Gruplama Kuralı İhlali: Agregasyon fonksiyonu (SUM, COUNT, AVG vb.) içinde yer almayan tüm SELECT sütunları GROUP BY ifadesinde tanımlanmalıdır.",
        suggestion: "SELECT projeksiyonunda seçilen ancak aggregate edilmeyen sütunları GROUP BY listesine dahil edin.",
      };
    }

    return {
      type: "EXECUTION_ERROR",
      message: "Sorgu yürütülürken veritabanı motoru hatası oluştu.",
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
      message: `Sonuç kümesinde beklenen bazı sütunlar eksik: [${missingCols.join(", ")}]`,
      suggestion: "SELECT projeksiyonunda talep edilen tüm sütunların (ve tanımlıysa 'AS takma_ad' etiketlerinin) eksiksiz eklendiğinden emin olun.",
    };
  }

  if (extraCols.length > 0 && normExpCols.length > 0) {
    return {
      type: "COLUMN_MISMATCH",
      message: `Sonuç kümesinde talep edilmeyen fazladan sütunlar mevcut: [${extraCols.join(", ")}]`,
      suggestion: "Yalnızca brifingde talep edilen sütunları SELECT projeksiyonuna dahil edin.",
    };
  }

  // 3. Row Count and Dataset Content Checks
  if (userRows.length === 0 && expectedRows.length > 0) {
    return {
      type: "EMPTY_RESULT",
      message: "Boş Sonuç Kümesi: Sorgu başarıyla çalıştı ancak 0 satır kayıt döndü.",
      suggestion: "WHERE koşullarınızın aşırı kısıtlayıcı olup olmadığını, metin filtrelerindeki harf duyarlılığını veya JOIN anahtarlarının eşleşmesini kontrol edin.",
    };
  }

  if (userRows.length !== expectedRows.length) {
    if (userRows.length < expectedRows.length) {
      return {
        type: "ROW_COUNT_MISMATCH",
        message: `Eksik Kayıt: Sorgunuz ${userRows.length} satır döndürdü; beklenen çıktı ${expectedRows.length} satır.`,
        suggestion: "WHERE filtrelerinizin gereğinden fazla satırı eleyip elemediğini veya ilişkisiz kayıtlar için INNER JOIN yerine LEFT JOIN gerekip gerekmediğini değerlendirin.",
      };
    } else {
      return {
        type: "ROW_COUNT_MISMATCH",
        message: `Fazla Kayıt: Sorgunuz ${userRows.length} satır döndürdü; beklenen çıktı ${expectedRows.length} satır.`,
        suggestion: "WHERE filtreleme koşullarınızın eksiksiz olduğunu veya JOIN bağlantısında kartezyen çarpım (çift satır) oluşup oluşmadığını inceleyin.",
      };
    }
  }

  // 4. Ordering Mismatch
  if (orderMatters) {
    return {
      type: "ORDERING_MISMATCH",
      message: "Sıralama Uyuşmazlığı: Kayıt sayısı ve içerik doğru, ancak satır sıralaması beklenen düzenle eşleşmiyor.",
      suggestion: "ORDER BY yan tümcesinde ASC (artan) veya DESC (azalan) yönlendirmesini ve sıralama yapılan sütunları kontrol edin.",
    };
  }

  // 5. Data Content Mismatch
  return {
    type: "DATA_MISMATCH",
    message: "Veri Doğrulama Hatası: Dönen tablodaki bazı hücre değerleri beklenen analitik sonuçla eşleşmiyor.",
    suggestion: "Hesaplama mantığınızı, agregasyon formüllerinizi (SUM/AVG) veya CASE WHEN koşul dallarınızı gözden geçirin.",
  };
}
