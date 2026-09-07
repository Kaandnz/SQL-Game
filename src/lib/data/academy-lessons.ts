export type VisualizerType =
  | "joins"
  | "lifecycle"
  | "groupby"
  | "window"
  | "ranking"
  | "laglead"
  | "btree"
  | "sargable"
  | "null_logic"
  | "casewhen"
  | "sets"
  | "text_functions"
  | "date_functions"
  | "syntax_anatomy";

export interface AcademyExample {
  title: string;
  description: string;
  sql: string;
  explanation: string;
  level?: "Temel (Giriş)" | "İş Senaryosu" | "İleri Seviye" | "Hata Avcısı";
  outputNotes?: string;
}

export interface AcademyQuickCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyComparisonRow {
  aspect: string;
  itemA: string;
  itemB: string;
}

export interface AcademyLesson {
  id: number;
  worldId: number;
  moduleId: number;
  moduleName: string;
  title: string;
  subtitle: string;
  category: "Fundamentals" | "Intermediate" | "Advanced" | "Mastery";
  readTime: string;
  summary: string;
  datasetId: "ecommerce" | "fintech" | "murder_mystery";
  visualType?: VisualizerType;
  whatItDoes: string;
  deepDive: {
    whyNeeded: string;
    howItWorksStepByStep: string[];
    whenToUse: string[];
    whenNotToUse: string[];
    comparisonTable?: {
      titleA: string;
      titleB: string;
      rows: AcademyComparisonRow[];
    };
  };
  content: {
    introduction: string;
    mentalModel: string;
    lifecycleDiagram?: string;
    syntaxDiagram: string;
    examples: AcademyExample[];
    proTips: string[];
    commonPitfalls: string[];
    quickCheck?: AcademyQuickCheck;
  };
}

export const ACADEMY_MODULES = [
  { id: 1, name: "Modül 1: Temel DQL & Veri Alma", desc: "SELECT, WHERE, Sıralama, Sayfalama ve NULL yönetimi" },
  { id: 2, name: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü", desc: "Metin/Tarih analitiği, GROUP BY, HAVING ve Sorgu Yürütme Sırası" },
  { id: 3, name: "Modül 3: Çoklu Tablo, İlişkiler & Kümeler", desc: "JOIN türleri, ilişkisel zincirler ve Küme Operatörleri" },
  { id: 4, name: "Modül 4: İleri Analitik & Pencere Fonksiyonları", desc: "CASE WHEN, Subquery, CTE, Recursive WITH ve Window Functions" },
  { id: 5, name: "Modül 5: Performans, İndeksleme & Adli Bilişim", desc: "B-Tree indeksler, SARGable sorgular, EXPLAIN ve Fraud Analizi" },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // =========================================================================
  // MODÜL 1: TEMEL DQL & VERİ ALMA (1 - 5)
  // =========================================================================
  {
    id: 1,
    worldId: 1,
    moduleId: 1,
    moduleName: "Modül 1: Temel DQL & Veri Alma",
    title: "SELECT, DISTINCT ve Kolon Alias (AS) Mantığı",
    subtitle: "İlişkisel veritabanından veri çekmenin temel yapı taşları ve projeksiyon.",
    category: "Fundamentals",
    readTime: "5 Dakika",
    summary: "SELECT ifadesi tablodan hangi kolonların çekileceğini belirler. DISTINCT tekrarlayanları eler, AS ise çıktı kolonunu yeniden adlandırır.",
    datasetId: "ecommerce",
    visualType: "syntax_anatomy",
    whatItDoes:
      "Veritabanı tablosundaki milyonlarca dikey veriden sadece işinize yarayan sütunları seçip filtreler. DISTINCT satır tekrarlarını süzer, AS (Alias) ise teknik kolon adlarını (örn: created_at) insan dostu etiketlere (Kayıt Tarihi) dönüştürür.",
    deepDive: {
      whyNeeded:
        "İlişkisel veritabanlarında tablolar onlarca farklı kolon barındırabilir. Bir web sayfasında sadece müşteri adı ve e-postası gerekiyorsa tüm tabloyu (SELECT *) istemek bant genişliğini, RAM tüketimini ve disk I/O maliyetini katlar. Projeksiyon (SELECT) tam olarak bu israfı önler.",
      howItWorksStepByStep: [
        "1. FROM tablosu (customers) disktan belleğe alınır.",
        "2. SELECT projeksiyon aşamasında yalnızca belirtilen kolonlar (first_name, email) süzülür.",
        "3. DISTINCT varsa, seçilen tüm kolonların kombinasyonu sıralanarak mükerrer kayıtlar atılır.",
        "4. AS ile belirtilen yeni takma isimler sonuç başlıklarına yazılır.",
      ],
      whenToUse: [
        "Bir kullanıcı arayüzü veya rapor için belirli kolonlara ihtiyaç duyulduğunda.",
        "Müşterilerin yaşadığı tekil şehirleri veya benzersiz kategorileri tespit etmek istediğinizde (DISTINCT).",
        "Frontend veya API'ye gönderilecek JSON çıktısında kolon isimlerini standartlaştırmak için (AS).",
      ],
      whenNotToUse: [
        "Üretim ortamlarında doğrudan 'SELECT *' kullanmaktan kaçının; şema değiştikçe uygulama kodunuz patlayabilir.",
        "Tüm kolonları DISTINCT yapmaya çalışmayın; DISTINCT arka planda ağır bir sıralama (SORT) algoritması çalıştırır.",
      ],
      comparisonTable: {
        titleA: "SELECT *",
        titleB: "SELECT col1, col2 (Projeksiyon)",
        rows: [
          { aspect: "Ağ Trafiği", itemA: "Tüm kolonlar taşınır (Yüksek maliyet)", itemB: "Yalnızca istenen baytlar taşınır (Minimum maliyet)" },
          { aspect: "İndeks Verimi", itemA: "Index-Only Scan yapılamaz", itemB: "İndeks üzerinden disk okumadan dönebilir" },
          { aspect: "Kod Dayanıklılığı", itemA: "Tabloya yeni kolon eklenirse API bozulabilir", itemB: "Şema değişikliklerinden etkilenmez" },
        ],
      },
    },
    content: {
      introduction:
        "SQL (Structured Query Language), ilişkisel veritabanlarındaki tablolarla konuşma dilidir. Veri çekmek için kullanılan en temel komut SELECT'tir. SELECT ile tablonun tamamı (* ile) veya yalnızca ihtiyaç duyulan belirli kolonları çekilebilir.",
      mentalModel:
        "Bir Excel tablosunu gözünüzün önüne getirin. SELECT komutu, tablonun hangi dikey sütunlarını (kolonlarını) kesip önünüze getireceğinizi seçmektir. FROM ise bu sütunların hangi sayfadan (tablodan) alınacağını belirtir.",
      lifecycleDiagram:
        "[1. FROM: customers tablosu belleğe alınır]\n       ⬇\n[2. SELECT: first_name ve email kolonları seçilir]\n       ⬇\n[3. DISTINCT: Tekrarlayan satır kombinasyonları elenir]\n       ⬇\n[4. ÇIKTI: Yalnızca istenen alias başlıkları döner]",
      syntaxDiagram:
        "SELECT [DISTINCT] column1 AS alias_name, column2\nFROM table_name;",
      examples: [
        {
          title: "Seviye 1: Temel Projeksiyon ve İsimlendirme (AS)",
          description: "Müşterilerin ad, soyad ve e-posta adreslerini anlamlı başlıklarla getirir.",
          sql: "SELECT first_name AS ad, last_name AS soyad, email AS iletisim\nFROM customers\nLIMIT 5;",
          explanation: "AS sözcüğü ile kolon başlıkları 'ad', 'soyad' ve 'iletisim' olarak Türkçeleştirilmiştir. LIMIT 5 sadece ilk 5 satırı alır.",
          level: "Temel (Giriş)",
          outputNotes: "Çıktıda yalnızca 3 kolon görülür, id ve created_at belleğe taşınmaz.",
        },
        {
          title: "Seviye 2: Benzersiz Şehirleri Çekme (DISTINCT)",
          description: "Müşterilerin kayıtlı olduğu şehirlerdeki tekrarları temizleyerek tekil liste üretir.",
          sql: "SELECT DISTINCT city AS benzersiz_sehirler\nFROM customers\nORDER BY benzersiz_sehirler ASC;",
          explanation: "İstanbul veya Ankara'da birden çok müşteri olsa dahi DISTINCT her şehri yalnızca 1 kez listeler.",
          level: "İş Senaryosu",
          outputNotes: "Şehirler alfabetik sıralı ve tekil olarak döner.",
        },
        {
          title: "Seviye 3: Dinamik Hesaplama Kolonu ile Alias",
          description: "Ürünlerin birim fiyatını ve %20 KDV eklenmiş satış fiyatını hesaplayıp alias verir.",
          sql: "SELECT name AS urun_adi, price AS ham_fiyat, ROUND(price * 1.20, 2) AS kdv_dahil_fiyat\nFROM products\nLIMIT 5;",
          explanation: "Matematiksel bir formül (price * 1.20) yeni bir sanal kolon olarak çıktıda adlandırılmıştır.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Çoklu Kolonda DISTINCT Yanılgısı",
          description: "Acemi geliştiriciler DISTINCT'in sadece yanındaki ilk kolona etki ettiğini sanır.",
          sql: "SELECT DISTINCT city, first_name\nFROM customers\nORDER BY city\nLIMIT 6;",
          explanation: "DISTINCT tek bir kolona değil; (city + first_name) ikilisinin tamamına uygulanır. Aynı şehirde iki farklı Ahmet varsa ikisi de listelenir!",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Canlı üretim ortamlarında (Production) ASLA 'SELECT *' kullanmayın; yalnızca ihtiyacınız olan kolonları açıkça belirtin. Bu durum bellek kullanımını ve network I/O maliyetini ciddi oranda düşürür.",
        "Kolon alias'larında boşluk veya özel karakter varsa çift tırnak kullanabilirsiniz: SELECT first_name AS \"Müşteri Adı\".",
      ],
      commonPitfalls: [
        "DISTINCT tek bir kolona değil, SELECT listesindeki TÜM kolonların kombinasyonuna uygulanır.",
        "SQL anahtar sözcükleri büyük/küçük harfe duyarsızdır fakat standart olarak büyük harfle yazılması okunabilirliği artırır.",
      ],
      quickCheck: {
        question: "Aşağıdakilerden hangisi SELECT * kullanımının üretim sistemlerinde önerilmeme nedenlerinden biri DEĞİLDİR?",
        options: [
          "Gereksiz ağ trafiği ve bellek yükü oluşturması",
          "İndeks taramalarını (Index Only Scan) engellemesi",
          "Tabloya yeni kolon eklendiğinde uygulama kodunu bozabilmesi",
          "SQL dilinde 'SELECT *' yazmanın syntax hatası vermesi",
        ],
        correctIndex: 3,
        explanation: "SELECT * geçerli bir SQL sözdizimidir fakat performans ve güvenilirlik nedenleriyle önerilmez.",
      },
    },
  },

  {
    id: 2,
    worldId: 2,
    moduleId: 1,
    moduleName: "Modül 1: Temel DQL & Veri Alma",
    title: "WHERE Filtreleme & Mantıksal Operatörler",
    subtitle: "AND, OR, NOT, BETWEEN ve IN ile satır seviyesinde hassas veri filtreleme.",
    category: "Fundamentals",
    readTime: "6 Dakika",
    summary: "WHERE koşulu, tablodaki satırları belirli kriterlere göre filtreler. Yalnızca koşulu TRUE (Doğru) olan satırlar döner.",
    datasetId: "ecommerce",
    visualType: "syntax_anatomy",
    whatItDoes:
      "Tüm tablonun üzerine hassas bir filtre koyarak sadece belirlediğiniz koşullara uyan (örneğin: 'İstanbul\'da yaşayan ve son 30 günde alışveriş yapmış') satırların gelmesini sağlar. Gereksiz milyonlarca satırı veritabanı motoru seviyesinde eler.",
    deepDive: {
      whyNeeded:
        "Bir e-ticaret sitesinde 10 milyon ürün varken kullanıcı sadece 'Fiyatı 5000 ile 15000 TL arasındaki Laptoplar'ı görmek ister. WHERE olmadan tüm veri sunucuya akar ve sistem çöker.",
      howItWorksStepByStep: [
        "1. FROM ile hedef tablo açılır.",
        "2. Her bir satır WHERE mantıksal ifadesine sokulur.",
        "3. İfade TRUE dönerse satır kabul edilir; FALSE veya NULL (UNKNOWN) dönerse satır anında çöpe atılır.",
        "4. Kalan satırlar sonraki aşamalara (SELECT, ORDER BY) iletilir.",
      ],
      whenToUse: [
        "Aralık filtrelemeleri için: BETWEEN min AND max.",
        "Belirli bir liste eşleşmesi için: IN ('değer1', 'değer2').",
        "Çoklu mantıksal birleşimler için: AND, OR ve parantezli gruplamalar.",
      ],
      whenNotToUse: [
        "Gruplanmış verileri filtrelemek için WHERE KULLANILAMAZ! (Örn: 'Toplam satışı 100.000 TL üzeri kategoriler' için HAVING gerekir).",
      ],
      comparisonTable: {
        titleA: "AND Operatörü",
        titleB: "OR Operatörü",
        rows: [
          { aspect: "Koşul Kriteri", itemA: "Her iki taraf da TRUE olmak zorundadır", itemB: "Taraflardan birinin TRUE olması yeterlidir" },
          { aspect: "Öncelik (Precedence)", itemA: "Daha yüksek önceliğe sahiptir", itemB: "Daha düşük önceliğe sahiptir (Parantez şarttır)" },
          { aspect: "Sonuç Kümesi", itemA: "Kümeyi daraltır (Kesişim)", itemB: "Kümeyi genişletir (Birleşim)" },
        ],
      },
    },
    content: {
      introduction:
        "İlişkisel veritabanlarında milyonlarca satır bulunabilir. WHERE tüm tablodan yalnızca şartımızı sağlayan satırları süzmemizi sağlar. Karşılaştırma (=, !=, <, >, <=, >=) ve Mantıksal (AND, OR, NOT, IN, BETWEEN) operatörlerle zenginleştirilir.",
      mentalModel:
        "WHERE, tablonun üzerine konulmuş bir elek gibidir. Tablodaki her bir satır bu elekten geçer. Eğer şart 'TRUE' sonucunu verirse satır eleğin altına düşer (çıktıya dahil olur); 'FALSE' veya 'NULL' verirse elenir.",
      lifecycleDiagram:
        "[1. FROM: products]\n       ⬇\n[2. WHERE: price >= 5000 AND stock_quantity > 0] (Filtreleme)\n       ⬇\n[3. SELECT: name, price]",
      syntaxDiagram:
        "SELECT column1, column2\nFROM table_name\nWHERE condition1 AND (condition2 OR condition3)\n  AND column4 IN (val1, val2)\n  AND column5 BETWEEN min_val AND max_val;",
      examples: [
        {
          title: "Seviye 1: Sayısal ve Mantıksal Filtreleme (BETWEEN & AND)",
          description: "Fiyatı 5.000 TL ile 30.000 TL arasında olan ve stokta bulunan ürünler.",
          sql: "SELECT name, price, stock_quantity\nFROM products\nWHERE price BETWEEN 5000 AND 30000\n  AND stock_quantity > 0;",
          explanation: "BETWEEN min AND max ifadesi sınır değerleri de dahil eder. AND ile her iki şartın da sağlanması zorunlu tutulmuştur.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Çoklu Değer Eşleme (IN Operatörü)",
          description: "Kategori ID'si 1 (Laptops) veya 2 (Smartphones) olan ürünleri getirir.",
          sql: "SELECT name, category_id, price\nFROM products\nWHERE category_id IN (1, 2)\nORDER BY price DESC;",
          explanation: "IN (1, 2), 'category_id = 1 OR category_id = 2' ifadesinin çok daha temiz ve optimize halidir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Parantez ile Mantıksal Öncelik Yönetimi",
          description: "Stok miktarı 20'den fazla olan YA DA 50.000 TL üzeri olup Laptop kategorisindeki ürünler.",
          sql: "SELECT name, price, stock_quantity\nFROM products\nWHERE (price >= 50000 OR stock_quantity > 20)\n  AND category_id = 1;",
          explanation: "Parantez kullanılmazsa AND operatörü OR'dan önce çalışır ve sorgunun mantığı tamamen sapar.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — NOT IN ve NULL Tuzağı",
          description: "NOT IN listesinde tek bir NULL bulunursa sorgu beklenmedik şekilde 0 satır döner.",
          sql: "SELECT id, name\nFROM categories\nWHERE id NOT IN (1, 2, 99);",
          explanation: "Eğer listede 'NULL' olsaydı SQL 3-Valued Logic gereği hiçbir kayıt dönemezdi. Bu yüzden varlık kontrollerinde NOT EXISTS tercih edilir.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "AND operatörü OR operatöründen daha yüksek işlem önceliğine (precedence) sahiptir. Karmaşık şartlarda karışıklığı önlemek için mutlaka parantez () kullanın: WHERE (a OR b) AND c.",
        "BETWEEN operatörü her zaman küçük değerden büyük değere doğru yazılmalıdır: BETWEEN 10 AND 20.",
      ],
      commonPitfalls: [
        "WHERE ifadesinde eşitlik kontrolü için tek eşittir '=' kullanılır, '==' yazımı SQL standardında hatalıdır.",
        "NOT IN operatörü kullanırken liste içinde 'NULL' bir değer varsa tüm sorgu beklenmedik şekilde 0 satır döndürebilir.",
      ],
      quickCheck: {
        question: "WHERE category_id = 1 OR category_id = 2 AND price > 1000 ifadesinde ilk hangi işlem değerlendirilir?",
        options: [
          "Önce soldan sağa doğru category_id = 1 OR category_id = 2 çalışır.",
          "AND önceliğinden dolayı önce 'category_id = 2 AND price > 1000' değerlendirilir.",
          "Veritabanı rastgele birini seçer.",
          "Sorgu syntax hatası verir.",
        ],
        correctIndex: 1,
        explanation: "SQL'de mantıksal AND operatörü, OR operatöründen daha yüksek önceliğe sahiptir.",
      },
    },
  },

  {
    id: 3,
    worldId: 3,
    moduleId: 1,
    moduleName: "Modül 1: Temel DQL & Veri Alma",
    title: "ORDER BY Sıralama & LIMIT / OFFSET Sayfalama",
    subtitle: "Verileri artan (ASC) veya azalan (DESC) sıralama ve sayfalama (Pagination) mimarisi.",
    category: "Fundamentals",
    readTime: "5 Dakika",
    summary: "İlişkisel veritabanları sıralama garantisi vermez. Sıralı çıktı için ORDER BY, ilk N kaydı almak için LIMIT, atlamak için OFFSET kullanılır.",
    datasetId: "ecommerce",
    visualType: "lifecycle",
    whatItDoes:
      "Veritabanında rastgele duran kayıtları istediğiniz düzende (en yeni, en pahalı, alfabetik) dizer. LIMIT ve OFFSET ise web sitelerindeki 'Sayfa 1, Sayfa 2, Sayfa 3' sayfalama mekanizmasını inşa eder.",
    deepDive: {
      whyNeeded:
        "İlişkisel veritabanları disk bloklarına en hızlı şekilde yazar; bu yüzden ORDER BY yazılmadığı sürece verilerin sırası rastgeledir. Ayrıca bir sayfada 100.000 ürünü birden yükleyemezsiniz; 20'şerli paketler halinde sayfalama zorunludur.",
      howItWorksStepByStep: [
        "1. WHERE ile elenen kayıtlar SELECT projeksiyonuna girer.",
        "2. ORDER BY ifadesi belirtilen kolonlara göre sıralama yapar (QuickSort / External Merge Sort).",
        "3. OFFSET değeri kadar satır baştan atlanır.",
        "4. Takip eden LIMIT adedi kadar satır kesilerek istemciye yollanır.",
      ],
      whenToUse: [
        "En yüksek cirolu müşteriler, en çok satan ilk 10 ürün (Leaderboard).",
        "Tarihe göre yeniden eskiye kronolojik akışlar (Feed / Timeline).",
        "Mobil veya web tablolarında sayfalama (Pagination).",
      ],
      whenNotToUse: [
        "Milyonlarca satırlık tablolarda yüksek OFFSET (OFFSET 500000) kullanmak korkunç yavaştır. Bunun yerine Keyset Pagination (WHERE id > son_id) kullanılmalıdır.",
      ],
      comparisonTable: {
        titleA: "OFFSET Sayfalama",
        titleB: "Keyset (Cursor) Sayfalama",
        rows: [
          { aspect: "Yöntem", itemA: "LIMIT 10 OFFSET 1000", itemB: "WHERE id > 1000 LIMIT 10" },
          { aspect: "Derin Sayfa Hızı", itemA: "Sayfa ilerledikçe yavaşlar (O(N))", itemB: "Her zaman sabit milisaniye (O(log N))" },
          { aspect: "Veri Kayması Riski", itemA: "Araya yeni veri girerse satırlar kayar", itemB: "Asla mükerrer veya atlanan satır olmaz" },
        ],
      },
    },
    content: {
      introduction:
        "Veritabanı motoru satırları diskte en verimli şekilde saklar ve ORDER BY belirtilmedikçe kayıtların sırası belirsizdir. ORDER BY ile tek veya birden fazla kolona göre ASC (küçükten büyüğe) veya DESC (büyükten küçüğe) sıralama yapılır.",
      mentalModel:
        "Bir kütüphanedeki kitapları önce yazarına göre A'dan Z'ye, aynı yazarın kitaplarını ise basım yılına göre yeniden eskiye dizdiğinizi düşünün. LIMIT ise kütüphaneden sadece ilk 10 kitabı ödünç almaktır.",
      lifecycleDiagram:
        "[1. FROM & WHERE: Satırlar filtrelenir]\n       ⬇\n[2. SELECT: İlgili kolonlar çekilir]\n       ⬇\n[3. ORDER BY: Çıktı sıralanır]\n       ⬇\n[4. LIMIT & OFFSET: İstenen sayfa dilimi kesilir]",
      syntaxDiagram:
        "SELECT column1, column2\nFROM table_name\nORDER BY column1 DESC, column2 ASC\nLIMIT page_size OFFSET (page_number - 1) * page_size;",
      examples: [
        {
          title: "Seviye 1: En Pahalı 5 Ürünü Getirme (Top-N)",
          description: "Fiyatı en yüksekten en düşüğe doğru sıralayarak ilk 5 ürünü çeker.",
          sql: "SELECT name, price, stock_quantity\nFROM products\nORDER BY price DESC\nLIMIT 5;",
          explanation: "ORDER BY price DESC en pahalı ürünleri tepeye taşır, LIMIT 5 sadece ilk 5 satırı döndürür.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Çok Kolonlu Sıralama (Kategoriye Göre Artan, Fiyata Göre Azalan)",
          description: "Önce kategoriye göre dizer, aynı kategorideki ürünleri ise fiyata göre en pahalıdan sıralar.",
          sql: "SELECT category_id, name, price\nFROM products\nORDER BY category_id ASC, price DESC\nLIMIT 8;",
          explanation: "Çok kolonlu sıralamada soldaki kural önceliklidir; eşitlik durumunda sağdaki kolona bakılır.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Sayfalama (2. Sayfa, Her Sayfada 3 Kayıt)",
          description: "İlk 3 kaydı atlayarak sonraki 3 kaydı getirir.",
          sql: "SELECT id, name, price\nFROM products\nORDER BY id ASC\nLIMIT 3 OFFSET 3;",
          explanation: "OFFSET 3 ilk 3 kaydı atlar, LIMIT 3 takip eden 3 kaydı getirir. Formül: OFFSET = (SayfaNo - 1) * SayfaBoyutu.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Deterministik Olmayan Sıralama",
          description: "Benzersiz olmayan bir kolona göre sıralama yapıldığında aynı sayfa farklı sıralar dönebilir.",
          sql: "SELECT id, name, price\nFROM products\nORDER BY price DESC, id ASC\nLIMIT 5;",
          explanation: "İki ürünün fiyatı eşit olduğunda 'id ASC' gibi benzersiz bir kolon eklemek sonucun her yenilemede deterministik (tutarlı) kalmasını sağlar.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "LIMIT ve OFFSET kullanırken deterministik (tutarlı) bir sonuç elde etmek için mutlaka benzersiz bir kolona (Primary Key gibi) göre ORDER BY yapın.",
        "Büyük tablolarda (milyonlarca satır) yüksek OFFSET değerleri (OFFSET 1000000 gibi) performans düşürebilir; bunun yerine 'Keyset Pagination' (WHERE id > last_seen_id) tercih edilir.",
      ],
      commonPitfalls: [
        "ORDER BY yazılmadığında veritabanının verileri her zaman aynı sırada döndüreceğini varsaymak büyük bir yanılgıdır.",
      ],
      quickCheck: {
        question: "10'ar kayıtlık sayfalama yaparken 4. sayfayı getirmek için LIMIT ve OFFSET değerleri ne olmalıdır?",
        options: [
          "LIMIT 10 OFFSET 40",
          "LIMIT 10 OFFSET 30",
          "LIMIT 4 OFFSET 10",
          "LIMIT 30 OFFSET 10",
        ],
        correctIndex: 1,
        explanation: "Formül: OFFSET = (SayfaNo - 1) * SayfaBoyutu => (4 - 1) * 10 = 30. LIMIT = 10.",
      },
    },
  },

  {
    id: 4,
    worldId: 4,
    moduleId: 1,
    moduleName: "Modül 1: Temel DQL & Veri Alma",
    title: "NULL Yönetimi & Üç Değerli Mantık (Three-Valued Logic)",
    subtitle: "Bilinmeyen değerler, IS NULL / IS NOT NULL ve COALESCE fonksiyonu.",
    category: "Fundamentals",
    readTime: "6 Dakika",
    summary: "NULL bir değer değil, 'bilinmeyen/mevcut olmayan' durumdur. NULL ile yapılan eşitlikler (= NULL) her zaman UNKNOWN döner.",
    datasetId: "ecommerce",
    visualType: "null_logic",
    whatItDoes:
      "Eksik veya henüz girilmemiş verileri temsil eder. Sıfır (0) ya da boş metin ('') değildir. SQL'de eşitlik (=) yerine IS NULL / IS NOT NULL ile sorgulanır ve COALESCE ile eksik verilere varsayılan yedek değerler atanır.",
    deepDive: {
      whyNeeded:
        "Kullanıcı kayıt olurken telefon numarasını girmek zorunda olmayabilir. O haneyi '0' veya boşluk yapmak veri bozulmasına (Data Corruption) yol açar. NULL, 'bu bilgi şu an bilinmiyor' durumunu güvenle saklar.",
      howItWorksStepByStep: [
        "1. NULL bir bellek hücresinde özel bir işaretçi (NULL bitmap) ile tutulur.",
        "2. NULL ile yapılan her türlü matematik (+, -, *) veya karşılaştırma (=, !=) UNKNOWN sonucunu üretir.",
        "3. WHERE şartı UNKNOWN sonucunu kabul etmez (yalnızca TRUE geçer).",
        "4. Bu yüzden 'WHERE col = NULL' her zaman 0 kayıt döndürür.",
      ],
      whenToUse: [
        "Opsiyonel iletişim bilgileri (ikincil telefon, teslimat notu).",
        "Tamamlanmamış işlemler (teslim_tarihi henüz gerçekleşmemiş siparişler).",
        "COALESCE ile ekranda 'Belirtilmedi' gibi şık varsayılanlar göstermek için.",
      ],
      whenNotToUse: [
        "Asla '= NULL' veya '!= NULL' yazmayın! Her zaman 'IS NULL' ve 'IS NOT NULL' yazılmalıdır.",
      ],
      comparisonTable: {
        titleA: "col = NULL",
        titleB: "col IS NULL",
        rows: [
          { aspect: "Mantıksal Sonuç", itemA: "Her zaman UNKNOWN döner (Asla çalışmaz)", itemB: "TRUE veya FALSE döner (Doğru çalışır)" },
          { aspect: "WHERE Davranışı", itemA: "Tüm satırları eler (0 satır döner)", itemB: "Boş satırları yakalar" },
        ],
      },
    },
    content: {
      introduction:
        "Veritabanlarında NULL, sıfır (0) veya boş string ('') demek değildir. NULL, 'bilinmeyen' (unknown) ya da 'henüz girilmemiş' veridir. SQL bu sebeple İki Değerli Mantık (TRUE/FALSE) yerine Üç Değerli Mantık (TRUE, FALSE, UNKNOWN) kullanır.",
      mentalModel:
        "Kapalı bir hediye kutusu düşünün. İçinde ne olduğunu bilmiyorsunuz (NULL). Başka bir kapalı hediye kutusuyla karşılaştırdığınızda 'İçindekiler aynı mıdır?' sorusunun cevabı 'Evet' ya da 'Hayır' değil, 'Bilemiyorum' (UNKNOWN)'dur. Bu yüzden NULL = NULL ifadesi TRUE değil, UNKNOWN üretir.",
      lifecycleDiagram:
        "[Değer: NULL] ──> (= NULL) ──> [Sonuç: UNKNOWN (Elenir)]\n[Değer: NULL] ──> (IS NULL) ──> [Sonuç: TRUE (Kabul Edilir)]",
      syntaxDiagram:
        "SELECT column1, COALESCE(nullable_col, 'Varsayılan Değer') AS cleaned_col\nFROM table_name\nWHERE nullable_col IS NULL OR nullable_col IS NOT NULL;",
      examples: [
        {
          title: "Seviye 1: Telefon Numarası Eksik Müşterileri Bulma",
          description: "Telefon alanı boş bırakılmış kayıtları IS NULL ile tespit eder.",
          sql: "SELECT first_name, last_name, email, phone\nFROM customers\nWHERE phone IS NULL;",
          explanation: "'WHERE phone = NULL' yazsaydık hiçbir kayıt dönmezdi. Doğru sözdizimi 'IS NULL'dır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: COALESCE ile Eksik Alanlara Varsayılan Değer Basma",
          description: "Telefonu olmayan müşterilere 'Telefon Belirtilmedi' metni basar.",
          sql: "SELECT first_name, last_name, COALESCE(phone, 'Telefon Belirtilmedi') AS iletisim_no\nFROM customers\nLIMIT 6;",
          explanation: "COALESCE parametre olarak verilen listedeki ilk NULL olmayan değeri döndürür.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Sıfıra Bölme Hatasını NULLIF ile Engelleme",
          description: "İptal edilen siparişlerde bölme hatasını önleme tekniği.",
          sql: "SELECT id, total_amount, \n  ROUND(total_amount / NULLIF(1, 0), 2) AS guvenli_bolum\nFROM orders\nLIMIT 5;",
          explanation: "NULLIF(val1, val2) iki değer eşitse NULL döner. SQL'de sayı / NULL işlemi çökmez, güvenle NULL döner.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — 'WHERE col = NULL' Tuzağı",
          description: "Eşittir ile kontrol etmeye çalışıldığında hiçbir kayıt dönmez.",
          sql: "SELECT * FROM customers WHERE phone = NULL;",
          explanation: "Bu sorgu SQL kuralları gereği hata vermez ama 0 satır döndürür; çünkü NULL = NULL UNKNOWN'dur.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "COALESCE birden fazla alternatif alabilir: COALESCE(mobile_phone, home_phone, work_phone, 'Ulaşılamıyor').",
        "NULLIF(val1, val2) fonksiyonu ise iki değer eşitse NULL, değilse ilk değeri döner. Sıfıra bölme hatasını önlemek için kullanılır: total / NULLIF(count, 0).",
      ],
      commonPitfalls: [
        "Asla 'WHERE column = NULL' veya 'WHERE column != NULL' yazmayın. Her zaman 'IS NULL' ve 'IS NOT NULL' kullanın.",
      ],
      quickCheck: {
        question: "SQL'de 'SELECT NULL = NULL;' sorgusunun sonucu nedir?",
        options: [
          "TRUE (Doğru)",
          "FALSE (Yanlış)",
          "NULL / UNKNOWN (Bilinmiyor)",
          "Syntax Error",
        ],
        correctIndex: 2,
        explanation: "NULL bir değer olmadığı için başka bir NULL ile eşitliği bilinemez (UNKNOWN / NULL).",
      },
    },
  },

  {
    id: 5,
    worldId: 2,
    moduleId: 1,
    moduleName: "Modül 1: Temel DQL & Veri Alma",
    title: "Metin Arama: LIKE, ILIKE ve Joker Karakterler",
    subtitle: "% ve _ joker karakterleriyle kalıp eşleştirme ve arama.",
    category: "Fundamentals",
    readTime: "5 Dakika",
    summary: "LIKE metinler içinde kalıp araması yapar. '%' sıfır veya daha fazla karakteri, '_' ise tek bir karakteri temsil eder. ILIKE büyük/küçük harf duyarsızdır.",
    datasetId: "ecommerce",
    visualType: "text_functions",
    whatItDoes:
      "Arama kutularında tam kelimeyi bilmediğiniz durumlarda 'içinde laptop geçen', '@email.com ile biten' veya 'A harfi ile başlayan' kayıtları bulmanızı sağlar. % ve _ jokerleriyle esnek filtreler kurar.",
    deepDive: {
      whyNeeded:
        "Kullanıcılar arama çubuğuna 'pro' yazdığında hem 'MacBook Pro' hem 'AirPods Pro' gelmelidir. Birebir eşitlik (=) bu aramalarda yetersiz kalır.",
      howItWorksStepByStep: [
        "1. LIKE operatörü dizeyi karakter karakter desenle karşılaştırır.",
        "2. % sembolü gördüğü yerde 0 veya sonsuz sayıda karakteri kabul eder.",
        "3. _ sembolü gördüğü yerde tam olarak 1 karakteri kabul eder.",
        "4. ILIKE ise karşılaştırmadan önce her iki tarafı da küçük harfe dönüştürür (Case-Insensitive).",
      ],
      whenToUse: [
        "E-posta sağlayıcısına göre filtreleme: WHERE email LIKE '%@email.com'.",
        "Adı belirli bir harfle başlayanları çekme: WHERE name LIKE 'A%'.",
        "Büyük/küçük harf fark etmeksizin arama yapma: ILIKE '%arama%'.",
      ],
      whenNotToUse: [
        "'%kelime' (başında yüzde olan) aramaları standart B-Tree indeksini kullanamaz; tüm tabloyu tarar. Yüksek trafikte Trigram (pg_trgm) veya Full-Text Search kullanılmalıdır.",
      ],
      comparisonTable: {
        titleA: "LIKE",
        titleB: "ILIKE (PostgreSQL)",
        rows: [
          { aspect: "Harf Duyarlılığı", itemA: "Case-Sensitive ('Apple' != 'apple')", itemB: "Case-Insensitive ('Apple' == 'apple')" },
          { aspect: "Standartlık", itemA: "ANSI SQL standardı", itemB: "PostgreSQL eklentisi (diğerlerinde LOWER() kullanılır)" },
        ],
      },
    },
    content: {
      introduction:
        "Tam eşitlik yerine 'Ahmet ile başlayan', 'gmail.com ile biten' veya 'içinde Pro geçen' kayıtları aramak için LIKE ve ILIKE operatörleri kullanılır. % (herhangi bir sayıda karakter) ve _ (tam olarak 1 karakter) jokerleri ile kalıplar tanımlanır.",
      mentalModel:
        "Kelime bulmaca oynadığınızı düşünün. 'K_T_P' yazdığınızda _ yerlerine tek harf gelir (KİTAP, KUTUP). 'SQL%' yazdığınızda ise SQL ile başlayan her şey uyar (SQL, SQLITE, SQL SERVER).",
      syntaxDiagram:
        "SELECT * FROM table_name\nWHERE column LIKE 'Kalıp%'    -- Büyük/küçük harfe duyarlı\n   OR column ILIKE '%kalıp%'; -- Büyük/küçük harfe duyarsız (PostgreSQL)",
      examples: [
        {
          title: "Seviye 1: Gmail Kullanan Müşterileri Bulma (% Jokeri)",
          description: "E-posta adresi '@email.com' ile biten tüm kayıtları listeler.",
          sql: "SELECT first_name, last_name, email\nFROM customers\nWHERE email LIKE '%@email.com'\nLIMIT 5;",
          explanation: "%@email.com deseni, başında ne olursa olsun sonu @email.com ile biten metinleri yakalar.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: İçinde 'Pro' Geçen Ürünler (ILIKE - Harf Duyarsız)",
          description: "Büyük/küçük harf fark etmeksizin adında 'pro' geçen ürünler.",
          sql: "SELECT name, price, stock_quantity\nFROM products\nWHERE name ILIKE '%pro%';",
          explanation: "ILIKE operatörü 'PRO', 'Pro' ve 'pro' kelimelerinin hepsini yakalar.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Sabit Karakter Uzunluğu Eşleştirme (_ Jokeri)",
          description: "Adı tam olarak 4 harften oluşan müşterileri bulma.",
          sql: "SELECT first_name, city\nFROM customers\nWHERE first_name LIKE '____';",
          explanation: "4 adet alt çizgi (_) tam olarak 4 karakter uzunluğundaki isimleri (örn: Ayşe) filtreler.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Özel Karakter Kaçırma (Escape)",
          description: "Metin içinde gerçek yüzde (%) veya alt çizgi (_) karakterini aramak.",
          sql: "SELECT name FROM products WHERE name LIKE '%\\%%' ESCAPE '\\';",
          explanation: "% işaretinin kendisini aramak için önüne kaçış karakteri (Escape) koymak gerekir.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Başında % olan aramalar ('%arama') veritabanındaki standart B-Tree indeksleri kullanamaz ve tam tablo taraması (Seq Scan) yapar. Yüksek performans için PostgreSQL'de Trigram (pg_trgm) veya Full-Text Search indeksleri kullanılır.",
      ],
      commonPitfalls: [
        "Standart SQL'de LIKE büyük/küçük harfe duyarlıdır. PostgreSQL'de duyarsız arama için ILIKE veya LOWER(col) LIKE LOWER('...') kullanılır.",
      ],
      quickCheck: {
        question: "Hangi kalıp tam olarak 5 harften oluşan ve 'A' ile başlayan kelimeleri eşleştirir?",
        options: [
          "'A%'",
          "'A____' (A ve ardından 4 adet alt çizgi)",
          "'A%%%%'",
          "'A_5'",
        ],
        correctIndex: 1,
        explanation: "'_' tam olarak tek bir karakteri temsil eder. 'A' + 4 adet '_' toplam 5 harf eder.",
      },
    },
  },

  // =========================================================================
  // MODÜL 2: FONKSİYONLAR, GRUPLAMA & SORGUNUN YAŞAM DÖNGÜSÜ (6 - 11)
  // =========================================================================
  {
    id: 6,
    worldId: 4,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "Skaler Metin (String) Fonksiyonları",
    subtitle: "CONCAT, UPPER/LOWER, SUBSTRING, LENGTH, TRIM ve REPLACE manipülasyonları.",
    category: "Fundamentals",
    readTime: "5 Dakika",
    summary: "Metin kolonlarını birleştirmek, kırpmak, harf büyüklüğünü değiştirmek ve parçalamak için yerleşik SQL metin fonksiyonları kullanılır.",
    datasetId: "ecommerce",
    visualType: "text_functions",
    whatItDoes:
      "Ham metin verilerini biçimlendirir. Ayrı duran ad ve soyadı birleştirir (CONCAT), harfleri büyütüp küçültür (UPPER/LOWER), kenardaki boşlukları budar (TRIM) veya metnin içinden belirli bir parçayı kesip alır (SUBSTRING).",
    deepDive: {
      whyNeeded:
        "Kullanıcılar formları doldururken başa ve sona gereksiz boşluk bırakabilir, isimlerini küçük harfle yazabilir. Veriyi temizleyip profesyonel bir rapora dönüştürmek için metin fonksiyonları şarttır.",
      howItWorksStepByStep: [
        "1. Her satırdaki metin hücresi fonksiyona parametre olarak girer.",
        "2. Karakter dizisi üzerinde belirtilen dönüşüm (ör: büyük harf) uygulanır.",
        "3. Yeni üretilen dize sonuç hücresine yazılır.",
      ],
      whenToUse: [
        "Tam ad oluşturma: CONCAT(first_name, ' ', last_name).",
        "E-posta veya kullanıcı adı standartlaştırma: LOWER(TRIM(email)).",
        "Telefon alan kodu çıkarma: SUBSTRING(phone FROM 1 FOR 4).",
      ],
      whenNotToUse: [
        "WHERE sol tarafında 'WHERE LOWER(email) = ...' yazmak indeksi düşürebilir (Function-based index gerekir).",
      ],
    },
    content: {
      introduction:
        "Ham veritabanı verisi çoğunlukla doğrudan raporlanmaya uygun değildir. Ad ve soyadı birleştirmek, gereksiz boşlukları temizlemek veya telefon formatını standartlaştırmak için metin fonksiyonları kullanılır.",
      mentalModel:
        "Metin fonksiyonları dize fabrikasındaki aletler gibidir. UPPER her harfi büyütür, TRIM kenardaki çapakları (boşlukları) keser, CONCAT iki parçayı birbirine yapıştırır.",
      syntaxDiagram:
        "SELECT \n  CONCAT(first_name, ' ', last_name) AS full_name,\n  UPPER(city) AS upper_city,\n  SUBSTRING(email FROM 1 FOR 5) AS prefix\nFROM customers;",
      examples: [
        {
          title: "Seviye 1: Ad ve Soyadı Birleştirme (CONCAT)",
          description: "Müşterinin tam adını ve büyük harflerle şehrini getirir.",
          sql: "SELECT \n  CONCAT(first_name, ' ', last_name) AS musteri_tam_ad,\n  UPPER(city) AS sehir\nFROM customers\nLIMIT 5;",
          explanation: "CONCAT araya boşluk koyarak iki kolonu birleştirir, UPPER tüm harfleri büyütür.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Karakter Sayısı ve Kırpma (LENGTH & SUBSTRING)",
          description: "E-postanın karakter uzunluğunu ve kullanıcı adı ön ekini çıkarma.",
          sql: "SELECT \n  email,\n  LENGTH(email) AS karakter_sayisi,\n  SUBSTRING(email FROM 1 FOR 6) AS baslangic\nFROM customers\nLIMIT 5;",
          explanation: "SUBSTRING(email FROM 1 FOR 6) 1. karakterden başlayarak 6 karakter alır.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Metin Değiştirme (REPLACE)",
          description: "Ürün adlarındaki 'Pro' ibaresini 'Professional Edition' olarak değiştirme.",
          sql: "SELECT \n  name AS orijinal,\n  REPLACE(name, 'Pro', 'Professional Edition') AS guncel_ad\nFROM products\nWHERE name LIKE '%Pro%';",
          explanation: "REPLACE dize içerisindeki hedef kelimeleri anında yenisiyle ikame eder.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Pipe (||) ile Birleştirmede NULL Çökmesi",
          description: "Standart pipe (||) birleştirmesinde tek bir NULL tüm sonucu NULL yapar.",
          sql: "SELECT first_name || ' ' || COALESCE(phone, 'Numara Yok') AS musteri_kart\nFROM customers\nLIMIT 5;",
          explanation: "first_name || phone yazılsaydı telefonu NULL olan müşterilerin tam metni NULL olurdu! COALESCE veya CONCAT() kurtarıcıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "PostgreSQL ve modern SQL'de CONCAT yerine '||' (pipe operatörü) de kullanılabilir: first_name || ' ' || last_name.",
        "CONCAT_WS(ayrac, val1, val2) fonksiyonu, araya otomatik ayraç koyar ve NULL olan parametreleri güvenle atlar.",
      ],
      commonPitfalls: [
        "'||' operatörü ile birleştirme yaparken kolonlardan biri NULL ise sonuç tamamen NULL olabilir. CONCAT fonksiyonu ise NULL değerleri boş string kabul ederek güvenle çalışır.",
      ],
      quickCheck: {
        question: "CONCAT('SQL', NULL, ' ', 'Dersi') ifadesinin sonucu nedir?",
        options: [
          "NULL",
          "'SQL Dersi'",
          "Syntax Error",
          "'SQLNULL Dersi'",
        ],
        correctIndex: 1,
        explanation: "CONCAT fonksiyonu NULL parametreleri yoksayar ve metinleri birleştirir.",
      },
    },
  },

  {
    id: 7,
    worldId: 4,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "Sayısal & Matematiksel Fonksiyonlar",
    subtitle: "ROUND, CEIL, FLOOR, ABS, POWER, MOD ve aritmetik hesaplamalar.",
    category: "Fundamentals",
    readTime: "5 Dakika",
    summary: "Fiyat yuvarlama, KDV hesaplama, mutlak değer alma ve üs/mod işlemleri için yerleşik matematiksel fonksiyonlar kullanılır.",
    datasetId: "ecommerce",
    visualType: "syntax_anatomy",
    whatItDoes:
      "Finansal hesaplamaları, KDV oranlarını, indirim yüzdelerini ve stok koli bölmelerini veritabanı motoru üzerinde güvenli biçimde gerçekleştirir. Küsüratları en yakın değere yuvarlar veya tavan/taban sınırlarına çeker.",
    deepDive: {
      whyNeeded:
        "Finans ve muhasebe sistemlerinde ondalık kuruş hataları kabul edilemez. Bir ürünün %20 KDV'si hesaplanırken virgülden sonra 6 basamak çıkabilir; bunu standart kuruş formatına (ROUND 2 basamak) indirmek gerekir.",
      howItWorksStepByStep: [
        "1. Sayısal kolonlar ve sabitler aritmetik işleme alınır.",
        "2. ROUND en yakın tam sayıya veya virgülden sonraki N basamağa yuvarlar.",
        "3. CEIL yukarı tam sayıya, FLOOR ise aşağı tam sayıya tamamlar.",
      ],
      whenToUse: [
        "Fatura toplamı ve KDV hesaplama.",
        "Ortalama sepet tutarı yuvarlama.",
        "Mod (kalan) hesabı ile koli/paket bölme.",
      ],
      whenNotToUse: [
        "Parasal işlemlerde FLOAT/DOUBLE kullanmaktan kaçının; IEEE-754 yuvarlama kayıpları yaratır. Daima NUMERIC/DECIMAL tercih edin.",
      ],
    },
    content: {
      introduction:
        "Finansal ve e-ticaret hesaplamalarında ondalık basamakları yuvarlamak (ROUND), aşağı/yukarı tam sayıya tamamlamak (FLOOR/CEIL) ve indirim oranları hesaplamak için matematik fonksiyonları kritik rol oynar.",
      mentalModel:
        "ROUND en yakın değere yuvarlar (12.4 -> 12, 12.6 -> 13). CEIL tavana yuvarlar (12.1 -> 13), FLOOR tabana yuvarlar (12.9 -> 12).",
      syntaxDiagram:
        "SELECT \n  ROUND(price * 1.20, 2) AS kdv_dahil_fiyat,\n  CEIL(price) AS yukari_yuvarlama,\n  MOD(stock_quantity, 12) AS koli_artigi\nFROM products;",
      examples: [
        {
          title: "Seviye 1: KDV ve İndirimli Fiyat Hesaplama (ROUND)",
          description: "%20 KDV eklenmiş ve %15 indirim uygulanmış fiyatları 2 ondalık basamağa yuvarlar.",
          sql: "SELECT \n  name,\n  price AS ham_fiyat,\n  ROUND(price * 1.20, 2) AS kdvli_fiyat,\n  ROUND(price * 0.85, 2) AS indirimli_fiyat\nFROM products\nLIMIT 5;",
          explanation: "ROUND(sayi, 2) virgülden sonra tam 2 basamak kalacak şekilde yuvarlar.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Tavan ve Taban Yuvarlama (CEIL & FLOOR)",
          description: "Fiyat küsüratlarını yukarı ve aşağı tam sayıya tamamlama.",
          sql: "SELECT \n  name,\n  price / 3 AS ham_taksit,\n  CEIL(price / 3) AS tavan_taksit,\n  FLOOR(price / 3) AS taban_taksit\nFROM products\nLIMIT 5;",
          explanation: "CEIL en ufak kesirde bile bir üst tam sayıya atar, FLOOR ise kesri atarak alt tam sayıda tutar.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Koli ve Paket Kalan Hesabı (MOD)",
          description: "Ürünlerin 12'şerli koliye konulduğunda açıkta kalan adetleri.",
          sql: "SELECT \n  name,\n  stock_quantity,\n  MOD(stock_quantity, 12) AS acikta_kalan_adet\nFROM products\nLIMIT 6;",
          explanation: "MOD(a, b) fonksiyonu a'nın b'ye bölümünden kalanı verir.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Tamsayı Bölme Tuzağı (Integer Division)",
          description: "İki integer bölündüğünde kesir kaybolur; 5 / 2 = 2 olur.",
          sql: "SELECT 5 / 2 AS yanlis_bolum, 5.0 / 2 AS dogru_bolum;",
          explanation: "Kesirli sonuç almak için sayılardan en az birinin ondalıklı (.0) veya NUMERIC tipine cast edilmesi gerekir.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Parasal işlemlerde FLOAT/DOUBLE yerine her zaman kesin ondalık tutan NUMERIC veya DECIMAL veri tipi kullanılmalıdır; floating-point kayıpları engellenir.",
      ],
      commonPitfalls: [
        "Tamsayı bölmelerinde (integer division): 'SELECT 5 / 2;' sonucu 2.5 değil 2 dönebilir. Kesirli sonuç için '5.0 / 2' veya '5::numeric / 2' yazılmalıdır.",
      ],
      quickCheck: {
        question: "PostgreSQL'de 'SELECT CEIL(4.01);' sorgusunun sonucu nedir?",
        options: ["4", "4.0", "5", "4.1"],
        correctIndex: 2,
        explanation: "CEIL fonksiyonu en ufak kesirde dahi sayıyı bir üst tam sayıya yuvarlar.",
      },
    },
  },

  {
    id: 8,
    worldId: 11,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "Tarih & Zaman Analitiği: DATE_TRUNC, EXTRACT ve INTERVAL",
    subtitle: "Zaman serisi gruplama, ay/yıl kırpma ve tarih aritmetiği.",
    category: "Advanced",
    readTime: "6 Dakika",
    summary: "DATE_TRUNC tarihleri gün/ay/yıl başlangıcına yuvarlar. EXTRACT gün/saat/yıl bileşenini çeker. INTERVAL ile tarihler toplanıp çıkarılır.",
    datasetId: "fintech",
    visualType: "date_functions",
    whatItDoes:
      "Zaman boyutundaki verileri analiz etmeyi sağlar. 'Aylık Ciro Raporu', 'Haftanın Günlerine Göre Sahtekarlık Dağılımı' veya 'Son 30 Günlük İşlemler' gibi iş zekası raporlarının temel motorudur.",
    deepDive: {
      whyNeeded:
        "Kayıtların her birinde farklı bir saniye ve dakika damgası bulunur. Bunları doğrudan gruplarsanız her satır tek bir grup olur! DATE_TRUNC o ayın tüm işlemlerini ayın 1. gününe eşitleyerek gruplamayı mümkün kılar.",
      howItWorksStepByStep: [
        "1. DATE_TRUNC('month', timestamp) çağrıldığında ayın altındaki gün, saat, dakika ve saniye sıfırlanır.",
        "2. Artık Mart ayındaki tüm işlemler '2024-03-01 00:00:00' damgasına sahip olur.",
        "3. GROUP BY bu damgayı tek bir ay grubu olarak toplar.",
      ],
      whenToUse: [
        "Aylık, haftalık veya yıllık kohort analizleri.",
        "Haftanın gününü bulma: EXTRACT(DOW FROM created_at).",
        "Tarih aritmetiği: created_at + INTERVAL '7 days'.",
      ],
      whenNotToUse: [
        "WHERE DATE_TRUNC('year', created_at) = '2024-01-01' yazmak indeksi felç eder. Bunun yerine SARGable aralık yazılmalıdır.",
      ],
    },
    content: {
      introduction:
        "İş zekası ve kohort raporlamasında 'Aylık Ciro', 'Haftalık Kayıtlar' veya 'Son 30 Günlük İşlemler' analizi yapılırken tarih fonksiyonları vazgeçilmezdir.",
      mentalModel:
        "DATE_TRUNC('month', '2024-03-18 15:45:00') komutu bir budama makası gibidir. Ay seviyesinin altındaki tüm detayları (gün, saat, dakika) budar ve o ayın 1. gününün başlangıcını bırakır: '2024-03-01 00:00:00'.",
      syntaxDiagram:
        "SELECT \n  DATE_TRUNC('month', created_at) AS ay_basi,\n  EXTRACT(DOW FROM created_at) AS haftanin_gunu,\n  created_at + INTERVAL '7 days' AS bir_hafta_sonrasi\nFROM table_name;",
      examples: [
        {
          title: "Seviye 1: Aylık Finansal Hacim ve İşlem Adedi",
          description: "İşlemleri aylara göre kırpıp gruplayarak ciro özeti çıkarır.",
          sql: "SELECT \n  DATE_TRUNC('month', created_at) AS islem_ayi,\n  COUNT(id) AS toplam_islem_adedi,\n  SUM(amount) AS toplam_hacim\nFROM transactions\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY islem_ayi DESC;",
          explanation: "Tüm tarihler ayın 1. gününe eşitlendiği için GROUP BY her ayı tek bir grup olarak ele alır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Giriş Yapılan Saati Çıkarma (EXTRACT)",
          description: "Kullanıcıların oturum açtığı saat dilimlerini analiz eder.",
          sql: "SELECT \n  user_id,\n  country,\n  EXTRACT(HOUR FROM login_time) AS giris_saati\nFROM login_history\nLIMIT 6;",
          explanation: "EXTRACT(HOUR FROM ...) timestamp içinden yalnızca 0-23 arası saat değerini çeker.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Tarih Aritmetiği (INTERVAL)",
          description: "İşlem tarihine 30 gün ekleyerek vade sonunu bulma.",
          sql: "SELECT \n  id,\n  created_at AS islem_ani,\n  created_at + INTERVAL '30 days' AS vade_tarihi\nFROM transactions\nLIMIT 5;",
          explanation: "INTERVAL 'X days' veya 'X hours' tarih damgalarına süre ekleyip çıkarmayı sağlar.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — SARGable Olmayan Tarih Filtresi",
          description: "WHERE içinde DATE_TRUNC kullanmak indeksi devre dışı bırakır.",
          sql: "SELECT id, amount, created_at\nFROM transactions\nWHERE created_at >= '2024-05-01 00:00:00'\n  AND created_at < '2024-05-02 00:00:00';",
          explanation: "WHERE DATE_TRUNC('day', created_at) = ... yerine bu şekilde aralık yazmak indeksi tam güçle çalıştırır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "EXTRACT(DOW FROM tarih) haftanın gününü döner (0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi).",
        "NOW() veya CURRENT_TIMESTAMP o anki tarih ve saati verir. 'NOW() - INTERVAL '30 days'' son 30 günü filtrelemek için idealdir.",
      ],
      commonPitfalls: [
        "WHERE DATE_TRUNC('year', created_at) = '2024-01-01' yazmak kolondaki indeksi devre dışı bırakır. Bunun yerine 'WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'' yazılmalıdır (SARGable).",
      ],
      quickCheck: {
        question: "DATE_TRUNC('month', '2026-09-15 14:30:00'::timestamp) ifadesinin çıktısı nedir?",
        options: [
          "'2026-09-01 00:00:00'",
          "'2026-09-15 00:00:00'",
          "'2026-01-01 00:00:00'",
          "'2026-09-30 23:59:59'",
        ],
        correctIndex: 0,
        explanation: "DATE_TRUNC belirtilen hassasiyetten (month) daha küçük tüm alanları sıfırlar ve ayın ilk anına döner.",
      },
    },
  },

  {
    id: 9,
    worldId: 5,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "Toplama Fonksiyonları: COUNT, SUM, AVG, MIN ve MAX",
    subtitle: "Çoklu satırları tek bir özet değere indirgeme ve NULL davranışları.",
    category: "Intermediate",
    readTime: "5 Dakika",
    summary: "Toplama (Aggregate) fonksiyonları birden fazla satırdaki değerleri alır ve tek bir skaler sonuç üretir. COUNT(*) ile COUNT(kolon) arasındaki NULL farkı çok önemlidir.",
    datasetId: "ecommerce",
    visualType: "groupby",
    whatItDoes:
      "Yüz binlerce satırı tek bir özet sayıya indirger. Toplam ciro (SUM), ortalama fiyat (AVG), kayıtlı müşteri adedi (COUNT), en pahalı ürün (MAX) ve en ucuz ürün (MIN) metriklerini saniyeler içinde hesaplar.",
    deepDive: {
      whyNeeded:
        "Yöneticiler 500.000 satırlık sipariş listesini tek tek okuyamaz. Karar vericilerin 'Bu ayki toplam ciro ne kadar ve ortalama sepet büyüklüğü nedir?' gibi özet metrikleri görmesi gerekir.",
      howItWorksStepByStep: [
        "1. Filtrelenen tüm satırlar toplayıcı akümülatöre aktarılır.",
        "2. SUM ve AVG NULL olan hücreleri atlar ve paydadan düşer.",
        "3. COUNT(*) tüm satırları sayarken, COUNT(kolon) yalnızca o kolonu NULL OLMAYAN satırları sayar.",
        "4. Tek bir özet satır üretilir.",
      ],
      whenToUse: [
        "Şirket KPI ve dashboard göstergeleri.",
        "Envanter stok toplamları.",
        "Kategori bazlı ortalama fiyatlandırma.",
      ],
      whenNotToUse: [
        "Aggregate fonksiyonları doğrudan WHERE bloğunda KULLANILAMAZ! (Subquery gerekir).",
      ],
      comparisonTable: {
        titleA: "COUNT(*)",
        titleB: "COUNT(kolon)",
        rows: [
          { aspect: "NULL Davranışı", itemA: "NULL olanlar dahil tüm satırları sayar", itemB: "Yalnızca NULL OLMAYAN satırları sayar" },
          { aspect: "Kullanım Amacı", itemA: "Tabloda kaç satır olduğunu bulmak", itemB: "Belirli bir bilginin kaç müşteride dolu olduğunu bulmak" },
        ],
      },
    },
    content: {
      introduction:
        "İş kararları çoğunlukla tek tek satırlar yerine özet metriklere dayanır: Toplam Ciro (SUM), Ortalama Sepet Tutarı (AVG), En Yüksek Satış (MAX) ve Müşteri Sayısı (COUNT).",
      mentalModel:
        "Bir hesap makinesine bir sütundaki tüm sayıları tek tek girip en sonunda '=' tuşuna bastığınızı düşünün. 100 satırlık veri makineye girer, tek bir özet sayı çıkar.",
      syntaxDiagram:
        "SELECT \n  COUNT(*) AS toplam_satir,\n  COUNT(column1) AS null_olmayan_sayi,\n  SUM(price) AS toplam_tutar,\n  AVG(price) AS ortalama_fiyat,\n  MIN(price) AS en_ucuz,\n  MAX(price) AS en_pahali\nFROM products;",
      examples: [
        {
          title: "Seviye 1: Ürün Kataloğu Genel Metrikleri",
          description: "Tüm ürünlerin toplam stok adedini, ortalama fiyatını ve min/max fiyat aralığını hesaplar.",
          sql: "SELECT \n  COUNT(*) AS toplam_urun_cesidi,\n  SUM(stock_quantity) AS toplam_stok_adedi,\n  ROUND(AVG(price), 2) AS ortalama_fiyat,\n  MIN(price) AS en_dusuk_fiyat,\n  MAX(price) AS en_yuksek_fiyat\nFROM products;",
          explanation: "5 farklı metrik tek bir sorguda tüm tablo üzerinden özetlenmiştir.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: COUNT(*) ile COUNT(kolon) Arasındaki NULL Farkı",
          description: "Telefonu kayıtlı olan müşteri sayısı ile toplam müşteri sayısını karşılaştırır.",
          sql: "SELECT \n  COUNT(*) AS toplam_musteri,\n  COUNT(phone) AS telefonu_olan_musteri\nFROM customers;",
          explanation: "COUNT(phone) telefon kolonu NULL olan müşterileri hesaba katmaz.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Koşullu Toplama (Conditional Aggregation)",
          description: "CASE WHEN ile tek sorguda tamamlanan ve iptal edilen sipariş tutarlarını ayırma.",
          sql: "SELECT \n  SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) AS tamamlanan_ciro,\n  SUM(CASE WHEN status = 'cancelled' THEN total_amount ELSE 0 END) AS iptal_ciro\nFROM orders;",
          explanation: "Aggregate fonksiyonu içine CASE WHEN koyarak yan yana farklı KPI sütunları üretilebilir.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — WHERE İçinde AVG() Kullanma Hatası",
          description: "'WHERE price > AVG(price)' yazmak syntax hatası verir.",
          sql: "SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);",
          explanation: "WHERE çalıştığında henüz AVG hesaplanmamıştır! Bu yüzden parantez içinde alt sorgu (Subquery) yazılmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "COUNT(*) tablodaki toplam satır sayısını sayar (NULL olanlar dahil). COUNT(kolon_adi) ise yalnızca o kolonu NULL OLMAYAN satırları sayar.",
        "AVG(kolon) hesaplanırken NULL olan satırlar paydadan düşülür. Eğer NULL olanların 0 sayılmasını istiyorsanız AVG(COALESCE(kolon, 0)) yazmalısınız.",
      ],
      commonPitfalls: [
        "Aggregate fonksiyonları doğrudan WHERE koşulunda kullanılamaz: 'WHERE price > AVG(price)' syntax hatası verir. Bu karşılaştırma için alt sorgu (Subquery) gerekir.",
      ],
      quickCheck: {
        question: "Bir kolonda [10, 20, NULL] değerleri varsa, AVG(kolon) sonucu ne olur?",
        options: [
          "10 (Çünkü (10+20+0)/3)",
          "15 (Çünkü (10+20)/2, NULL yoksayılır)",
          "NULL (Çünkü NULL ile toplama NULL yapar)",
          "Hata verir",
        ],
        correctIndex: 1,
        explanation: "SQL Aggregate fonksiyonları (COUNT(*) hariç) NULL değerleri tamamen yoksayar ve hesaba katmaz.",
      },
    },
  },

  {
    id: 10,
    worldId: 6,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "GROUP BY ve HAVING Ayrımı",
    subtitle: "Verileri kategorilere ayırma ve gruplanmış sonuçları filtreleme kuralları.",
    category: "Intermediate",
    readTime: "6 Dakika",
    summary: "GROUP BY satırları ortak değere göre gruplara böler. WHERE satırları gruplamadan ÖNCE eler, HAVING ise gruplama yapıldıktan SONRA grup özetlerini eler.",
    datasetId: "ecommerce",
    visualType: "groupby",
    whatItDoes:
      "Tüm şirketin genel toplamı yerine 'Kategori bazında ciro', 'Şehir bazında müşteri sayısı' gibi kırılımlar üretir. WHERE tek tek satırları elerken, HAVING ise gruplar oluştuktan sonra 'toplam cirosu 100.000 TL üzeri olan grupları' filtreler.",
    deepDive: {
      whyNeeded:
        "Tüm müşteriler tek bir torbaya atılamaz. Hangi şehirde kaç müşterimiz olduğunu veya hangi kategoriden ne kadar kazandığımızı bilmeden pazarlama bütçesi yönetilemez.",
      howItWorksStepByStep: [
        "1. FROM ve WHERE satır bazlı filtreleme yapar.",
        "2. GROUP BY kalan satırları kovalara (buckets) dağıtır.",
        "3. Her kova için SUM, COUNT, AVG özetleri hesaplanır.",
        "4. HAVING bu hesaplanmış grup özetlerini filtreler.",
      ],
      whenToUse: [
        "Kategori, şehir, departman veya statü bazında raporlama.",
        "Belirli bir adedin üzerinde sipariş veren VIP müşterileri bulma (HAVING COUNT(*) >= 5).",
      ],
      whenNotToUse: [
        "HAVING yerine satır filtresi yazmayın; bireysel kolon filtreleri mutlaka WHERE içinde yazılmalıdır.",
      ],
      comparisonTable: {
        titleA: "WHERE",
        titleB: "HAVING",
        rows: [
          { aspect: "Çalışma Zamanı", itemA: "Gruplamadan ÖNCE çalışır", itemB: "Gruplamadan SONRA çalışır" },
          { aspect: "Filtre Hedefi", itemA: "Tek tek satırları eler", itemB: "Grup özetlerini (SUM, COUNT) eler" },
          { aspect: "Aggregate Kullanımı", itemA: "SUM(), COUNT() yazılamaz", itemB: "SUM(), COUNT() şartları yazılır" },
        ],
      },
    },
    content: {
      introduction:
        "Tüm şirketin cirosu yerine 'Kategori bazında ciro' veya 'Şehir bazında müşteri sayısı' görmek istediğimizde GROUP BY kullanırız. Filtreleme aşamasında WHERE satırları kontrol ederken, HAVING grup toplamlarını kontrol eder.",
      mentalModel:
        "Bir madeni para yığınını önce masaya döküp sahteleri ayıklıyorsunuz (WHERE). Sonra paraları 1 TL, 50 Kuruş ve 25 Kuruş olarak kümelere ayırıyorsunuz (GROUP BY). En son sadece toplam değeri 50 TL'yi geçen kümeleri çantaya atıyorsunuz (HAVING).",
      lifecycleDiagram:
        "[1. FROM: Tablo]\n       ⬇\n[2. WHERE: Bireysel satırlar elenir]\n       ⬇\n[3. GROUP BY: Kümeler oluşturulur]\n       ⬇\n[4. HAVING: Kümelerin toplam/ortalama değerleri elenir]\n       ⬇\n[5. SELECT & ORDER BY: Sonuç döner]",
      syntaxDiagram:
        "SELECT category_id, COUNT(*) AS urun_sayisi, SUM(price * stock_quantity) AS toplam_envanter\nFROM products\nWHERE stock_quantity > 0      -- 1. Satır filtresi\nGROUP BY category_id          -- 2. Gruplama\nHAVING COUNT(*) >= 2          -- 3. Grup filtresi\nORDER BY toplam_envanter DESC;-- 4. Sıralama",
      examples: [
        {
          title: "Seviye 1: Şehirlere Göre Müşteri Sayısı (GROUP BY)",
          description: "Müşterilerin hangi şehirlerde yoğunlaştığını gruplar.",
          sql: "SELECT city, COUNT(id) AS musteri_sayisi\nFROM customers\nGROUP BY city\nORDER BY musteri_sayisi DESC;",
          explanation: "Her şehir tek bir satıra indirgenmiş ve müşteri adedi hesaplanmıştır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Grup Özeti Filtresi (HAVING COUNT >= 2)",
          description: "Yalnızca en az 2 müşterisi olan kalabalık şehirleri filtreler.",
          sql: "SELECT city, COUNT(id) AS musteri_sayisi\nFROM customers\nGROUP BY city\nHAVING COUNT(id) >= 2\nORDER BY musteri_sayisi DESC;",
          explanation: "HAVING COUNT(id) >= 2 ifadesi, müşteri sayısı 1 olan küçük şehirleri çıktıdan temizler.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Kategori Bazlı Envanter Değeri ve Filtreleme",
          description: "Stokta bulunan ürünlerin kategori bazında toplam değerini ve ortalama fiyatını bulur.",
          sql: "SELECT \n  category_id,\n  COUNT(*) AS urun_adedi,\n  ROUND(AVG(price), 2) AS ortalama_fiyat,\n  SUM(price * stock_quantity) AS envanter_degeri\nFROM products\nWHERE stock_quantity > 0\nGROUP BY category_id\nHAVING SUM(price * stock_quantity) > 100000\nORDER BY envanter_degeri DESC;",
          explanation: "Önce stokta olmayanlar WHERE ile elenir, sonra kategorilere ayrılır, en son 100.000 TL üzeri envanterler HAVING ile süzülür.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — GROUP BY Eksik Kolon Hatası",
          description: "SELECT listesinde olup GROUP BY'a yazılmayan kolon hatası.",
          sql: "SELECT category_id, COUNT(*) AS adet\nFROM products\nGROUP BY category_id;",
          explanation: "SELECT listesinde aggregate edilmemiş her kolon mutlaka GROUP BY cümlesine eklenmelidir.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Altın Kural: SELECT listesinde aggregate fonksiyonuna (SUM, COUNT vb.) sarılmamış TÜM kolonlar mutlaka GROUP BY cümlesinde yer almak zorundadır.",
      ],
      commonPitfalls: [
        "HAVING yerine WHERE içinde SUM() veya COUNT() yazmaya çalışmak en yaygın SQL hatasıdır. Unutmayın: WHERE satırları, HAVING grupları filtreler.",
      ],
      quickCheck: {
        question: "Aşağıdakilerden hangisi WHERE ile HAVING arasındaki temel farktır?",
        options: [
          "WHERE gruplamadan önce satırları eler; HAVING gruplamadan sonra grup özetlerini eler.",
          "HAVING sadece sayılarla çalışır, WHERE metinlerle çalışır.",
          "WHERE ve HAVING tamamen aynıdır, istenen tercih edilebilir.",
          "HAVING her zaman WHERE'den önce çalışır.",
        ],
        correctIndex: 0,
        explanation: "WHERE satır bazlı filtreleme yapar, HAVING ise gruplanmış aggregate sonuçlarını filtreler.",
      },
    },
  },

  {
    id: 11,
    worldId: 6,
    moduleId: 2,
    moduleName: "Modül 2: Fonksiyonlar, Gruplama & Yaşam Döngüsü",
    title: "SQL Sorgusunun Yaşam Döngüsü & Yürütme Sırası (Query Lifecycle)",
    subtitle: "Sorgu motoru kodunuzu hangi sırayla çalıştırır? (FROM -> WHERE -> GROUP BY -> SELECT)",
    category: "Intermediate",
    readTime: "6 Dakika",
    summary: "SQL kodunu SELECT ile yazmaya başlarız fakat veritabanı motoru sorguyu tamamen farklı bir mantıksal sırayla yürütür. Bu sırayı bilmek SQL uzmanlığının temelidir.",
    datasetId: "ecommerce",
    visualType: "lifecycle",
    whatItDoes:
      "SQL motorunun kodu hangi sırayla işlediğini (1. FROM -> 2. WHERE -> 3. GROUP BY -> 4. HAVING -> 5. SELECT -> 6. ORDER BY -> 7. LIMIT) netleştirir. 'Neden WHERE içinde alias kullanamıyorum ama ORDER BY içinde kullanabiliyorum?' sorusunun mutlak cevabıdır.",
    deepDive: {
      whyNeeded:
        "İngilizce konuşurken 'Bana X ver Y tablosundan' (SELECT X FROM Y) deriz. Fakat motor çalışırken önce tabloyu bulmak (FROM), sonra satırları filtrelemek (WHERE) ve en son kolonları hesaplamak (SELECT) zorundadır.",
      howItWorksStepByStep: [
        "1. FROM & JOIN: Tablolar diskten okunur ve birleştirilir.",
        "2. WHERE: Satırlar tek tek filtrelenir.",
        "3. GROUP BY: Kalan satırlar kümelere ayrılır.",
        "4. HAVING: Grup özetleri test edilir.",
        "5. SELECT & Window: Kolonlar seçilir, hesaplamalar yapılır ve ALIAS'lar üretilir.",
        "6. DISTINCT: Mükerrerler elenir.",
        "7. ORDER BY: Çıktı sıralanır (SELECT'ten sonra çalıştığı için ALIAS'ları tanır!).",
        "8. LIMIT: Sayfa dilimi kesilir.",
      ],
      whenToUse: [
        "Karmaşık sorgularda optimizasyon ve hata ayıklama yaparken.",
        "Kolon alias kurallarını doğru kurgulamak için.",
      ],
      whenNotToUse: [
        "WHERE içinde SELECT'te verdiğiniz takma adı (Alias) asla kullanmayın; motor henüz o satıra gelmemiştir.",
      ],
    },
    content: {
      introduction:
        "Birçok geliştirici WHERE içinde SELECT'te tanımladığı Alias'ı (takma adı) kullanamadığında şaşırır. Bunun sebebi SQL motorunun SELECT satırını WHERE ve GROUP BY bittikten sonra çalıştırmasıdır.",
      mentalModel:
        "Yemek tarifini okuma sırası ile yemeği pişirme sırası farklıdır. Tarif '1 porsiyon leziz çorba' (SELECT) başlığıyla başlar ama aşçı önce tencereyi ocağa koyar (FROM), çürük sebzeleri ayıklar (WHERE) ve en son çorbayı kaseye doldurup süsler (SELECT).",
      lifecycleDiagram:
        "YAZMA SIRASI:              YÜRÜTME SIRASI (LIFECYCLE):\n1. SELECT                 1. FROM & JOIN (Veri kaynağı hazırlanır)\n2. FROM                   2. WHERE (Satırlar filtrelenir)\n3. WHERE                  3. GROUP BY (Gruplar oluşturulur)\n4. GROUP BY               4. HAVING (Grup toplamları elenir)\n5. HAVING                 5. SELECT & Window Functions (Kolonlar hesaplanır)\n6. ORDER BY               6. DISTINCT (Tekrarlar temizlenir)\n7. LIMIT                  7. ORDER BY (Çıktı sıralanır)\n                          8. LIMIT / OFFSET (Dilim kesilir)",
      syntaxDiagram:
        "-- Mantıksal Yürütme Sırası Adımları:\n-- (1) FROM -> (2) WHERE -> (3) GROUP BY -> (4) HAVING -> (5) SELECT -> (6) ORDER BY -> (7) LIMIT",
      examples: [
        {
          title: "Seviye 1: Yürütme Sırasını Kanıtlayan Tam Kapsamlı Sorgu",
          description: "Filtrelenen, gruplanan, havuzlanan ve sıralanan tam kapsamlı sorgu.",
          sql: "SELECT category_id, COUNT(*) AS adet, AVG(price) AS ort_fiyat\nFROM products\nWHERE price > 1000\nGROUP BY category_id\nHAVING COUNT(*) >= 1\nORDER BY ort_fiyat DESC\nLIMIT 3;",
          explanation: "Motor önce products'a bakar, price > 1000 satırlarını seçer, category_id'ye göre gruplar, HAVING ile test eder, SELECT ile ort_fiyat'ı hesaplar ve en son sıralayıp 3 satır verir.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: ORDER BY'da Alias Kullanımı (Neden Çalışır?)",
          description: "SELECT'te türetilen bir alias'ın ORDER BY'da sorunsuz çalışması.",
          sql: "SELECT name, price * 1.20 AS kdvli_fiyat\nFROM products\nORDER BY kdvli_fiyat DESC\nLIMIT 5;",
          explanation: "ORDER BY sorgu motorunda SELECT'ten SONRA çalıştığı için 'kdvli_fiyat' alias'ını tanır ve sıralar.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: WHERE Yerine CTE ile Alias'ı Filtreleme",
          description: "WHERE içinde alias kullanmak istediğimizde CTE kullanımı.",
          sql: "WITH hesaplama AS (\n  SELECT name, price * 1.20 AS kdvli_fiyat\n  FROM products\n)\nSELECT * FROM hesaplama WHERE kdvli_fiyat > 30000;",
          explanation: "CTE kullanarak hesaplamayı bir önceki mantıksal adıma taşıdık; böylece WHERE içinde güvenle filtreleyebiliriz.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — WHERE İçinde Alias Çağırma Hatası",
          description: "'WHERE kdvli_fiyat > 5000' yazıldığında alınan 'column does not exist' hatası.",
          sql: "SELECT name, price * 1.20 AS kdvli_fiyat\nFROM products\nWHERE price * 1.20 > 50000;",
          explanation: "WHERE çalıştığında henüz SELECT ve aliaslar var olmadığından formülü WHERE içine açıkça yazmak zorundayız.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "SELECT'te tanımladığınız bir alias'ı WHERE içinde kullanamazsınız çünkü WHERE çalıştığında SELECT henüz çalışmamıştır! Fakat ORDER BY içinde güvenle kullanabilirsiniz çünkü ORDER BY, SELECT'ten sonra çalışır.",
      ],
      commonPitfalls: [
        "WHERE cift_fiyat > 5000 yazmaya çalışmak (Syntax Error: column does not exist). Doğrusu WHERE price * 2 > 5000 yazmaktır.",
      ],
      quickCheck: {
        question: "Bir SQL sorgusunda SELECT ifadesinde verilen bir Alias (AS takma ad) aşağıdaki alanların hangisinde KULLANILABİLİR?",
        options: [
          "WHERE cümlesinde",
          "HAVING cümlesinde",
          "ORDER BY cümlesinde",
          "GROUP BY cümlesinde",
        ],
        correctIndex: 2,
        explanation: "ORDER BY sorgu yaşam döngüsünde SELECT'ten SONRA çalıştığı için SELECT'te tanımlanan alias'ları tanır.",
      },
    },
  },

  // =========================================================================
  // MODÜL 3: ÇOKLU TABLO, İLİŞKİLER & KÜME OPERATÖRLERİ (12 - 15)
  // =========================================================================
  {
    id: 12,
    worldId: 7,
    moduleId: 3,
    moduleName: "Modül 3: Çoklu Tablo, İlişkiler & Kümeler",
    title: "Görsel INNER JOIN Mantığı & İlişkisel Bağlantılar",
    subtitle: "İki tabloda yalnızca ortak eşleşen kayıtları birleştirme ve Primary/Foreign Key mimarisi.",
    category: "Intermediate",
    readTime: "6 Dakika",
    summary: "INNER JOIN, iki tablonun kesişim kümesini alır. Yalnızca ON koşulunu sağlayan ve her iki tarafta da karşılığı olan satırlar çıktıda yer alır.",
    datasetId: "ecommerce",
    visualType: "joins",
    whatItDoes:
      "Ayrı tablolarda duran verileri ortak bir anahtar (Foreign Key -> Primary Key) üzerinden yapboz parçaları gibi birleştirir. Yalnızca her iki tarafta da tam eşleşen kayıtları getirir; siparişi olmayan müşteri veya müşterisi silinmiş sipariş elenir.",
    deepDive: {
      whyNeeded:
        "Tüm müşteri bilgilerini sipariş tablosunun içine kopyalamak veri tekrarına ve güncelleme anomalilerine yol açar. Veri ayrıştırılır ve gerektiğinde INNER JOIN ile birleştirilir.",
      howItWorksStepByStep: [
        "1. Sol tablo (orders) taranır.",
        "2. Her bir siparişin customer_id değeri Sağ tablonun (customers) id kolonunda aranır.",
        "3. Eşleşme bulunursa iki satır yan yana yapıştırılıp tek bir geniş satır olarak çıktıya verilir.",
        "4. Karşılığı bulunamayan satırlar sessizce elenir.",
      ],
      whenToUse: [
        "Siparişlerin müşteri adı ve e-postasıyla birlikte listelenmesi.",
        "Satış kalemlerinin ürün adlarıyla eşleştirilmesi.",
        "İki tablo arasında kesin ilişki garantisi olduğunda.",
      ],
      whenNotToUse: [
        "İlişkisi olmayan verileri (örn: 'Hiç sipariş vermemiş müşteriler') görmek istiyorsanız INNER JOIN KULLANILAMAZ; LEFT JOIN gerekir.",
      ],
    },
    content: {
      introduction:
        "İlişkisel veritabanlarının gücü veriyi tekrar etmeden farklı tablolara bölmekten (Normalizasyon) ve gerektiğinde JOIN ile birleştirmekten gelir. En yaygın kullanılan birleştirme türü INNER JOIN'dir.",
      mentalModel:
        "İki parçalı bir yapboz düşünün. Sol parçada sipariş var (müşteri_id = 5), sağ parçada müşteri kartı var (id = 5). İki parça birbirine tam uyuyorsa masaya konur. Eğer bir siparişin müşterisi yoksa veya hiç sipariş vermemiş bir müşteri varsa masaya konmaz.",
      lifecycleDiagram:
        "Tablo A (Siparişler)         Tablo B (Müşteriler)\n┌──────────┬─────────────┐  ┌──────────┬────────────┐\n│ Siparis  │ Musteri_ID  │  │ ID       │ Ad         │\n├──────────┼─────────────┤  ├──────────┼────────────┤\n│ #101     │ 1           │  │ 1        │ Ahmet      │ ──> (Eşleşti: Çıktıya girer)\n│ #102     │ 2           │  │ 2        │ Ayşe       │ ──> (Eşleşti: Çıktıya girer)\n│ #103     │ 99 (Yok)    │  │ 3        │ Mehmet     │ ──> (Eşleşmedi: Elenir)\n└──────────┴─────────────┘  └──────────┴────────────┘",
      syntaxDiagram:
        "SELECT a.col1, b.col2\nFROM table_a a\nINNER JOIN table_b b ON a.foreign_key = b.primary_key;",
      examples: [
        {
          title: "Seviye 1: Siparişleri ve Siparişi Veren Müşterileri Getirme",
          description: "Orders tablosundaki müşteri ID'leri ile Customers tablosunu eşleştirir.",
          sql: "SELECT \n  o.id AS siparis_no,\n  c.first_name AS musteri_adi,\n  c.last_name AS musteri_soyadi,\n  o.total_amount AS siparis_tutari\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nLIMIT 5;",
          explanation: "Yalnızca veritabanında müşterisi kayıtlı olan siparişler listelenir.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Üçlü Tablo Zinciri (Orders -> Order Items -> Products)",
          description: "Kimin hangi üründen kaç adet aldığını 3 tabloyu bağlayarak çıkarma.",
          sql: "SELECT \n  o.id AS siparis_no,\n  p.name AS urun_adi,\n  oi.quantity AS adet,\n  oi.unit_price AS birim_fiyat\nFROM orders o\nINNER JOIN order_items oi ON o.id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.id\nLIMIT 5;",
          explanation: "Birden fazla INNER JOIN peş peşe zincirlenerek ilişkisel ağaç boyunca ilerlenebilir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: JOIN ve GROUP BY ile Müşteri Ciro Liderliği",
          description: "Müşterileri bağlayıp toplam yaptıkları harcamayı hesaplar.",
          sql: "SELECT \n  c.id,\n  c.first_name,\n  c.last_name,\n  COUNT(o.id) AS siparis_adedi,\n  SUM(o.total_amount) AS toplam_harcama\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.first_name, c.last_name\nORDER BY toplam_harcama DESC\nLIMIT 5;",
          explanation: "JOIN ile genişletilen tablo müşteriye göre gruplanıp toplam harcamalar sıralanmıştır.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — ON Koşulunun Unutulması",
          description: "ON koşulu yazılmazsa veya eksik yazılırsa milyonlarca sahte satır oluşur.",
          sql: "SELECT o.id, c.first_name\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id\nWHERE o.status = 'completed'\nLIMIT 5;",
          explanation: "ON koşuluna ilişki bağı, WHERE koşuluna ise iş filtresi yazılmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Her zaman tablolara kısa ve anlamlı takma adlar (Alias) verin (orders -> o, customers -> c). Bu durum okunabilirliği ciddi şekilde artırır.",
        "JOIN koşulunu (ON) dikkatli yazın; yanlış birleştirme koşulu Kartezyen Çarpım (Cartesian Product) yaratarak veritabanını kilitleyebilir.",
      ],
      commonPitfalls: [
        "WHERE ile JOIN filtrelemesini karıştırmak. İlişki bağlama koşulu her zaman 'ON' bloğuna yazılmalıdır.",
      ],
      quickCheck: {
        question: "INNER JOIN yapıldığında A tablosunda olup B tablosunda eşleşmesi olmayan satırlara ne olur?",
        options: [
          "NULL değerlerle listelenirler.",
          "Çıktıdan tamamen elenirler ve listelenmezler.",
          "Hata fırlatılır.",
          "B tablosundaki ilk satırla rastgele eşleşirler.",
        ],
        correctIndex: 1,
        explanation: "INNER JOIN sadece ve sadece her iki tabloda da karşılığı olan kesişim satırlarını getirir.",
      },
    },
  },

  {
    id: 13,
    worldId: 7,
    moduleId: 3,
    moduleName: "Modül 3: Çoklu Tablo, İlişkiler & Kümeler",
    title: "LEFT & RIGHT OUTER JOIN: Kayıp Verileri Koruma",
    subtitle: "Eşleşmeyen satırları kaybetmeden NULL ile koruyarak birleştirme.",
    category: "Intermediate",
    readTime: "6 Dakika",
    summary: "LEFT JOIN, sol tablodaki TÜM satırları korur. Sağ tabloda eşleşme yoksa o kolonlar NULL olarak doldurulur. 'Hiç sipariş vermemiş müşterileri' bulmak için harikadır.",
    datasetId: "ecommerce",
    visualType: "joins",
    whatItDoes:
      "Sol tablodaki hiçbir verinin kaybolmamasını garanti eder. Örneğin: Bir şirketteki tüm müşterileri listelemek istiyorsunuz; henüz sipariş vermemiş olanlar da silinmesin istiyorsunuz. LEFT JOIN siparişi olmayanların yanına NULL basarak tüm müşterileri korur.",
    deepDive: {
      whyNeeded:
        "Pazarlama departmanı 'Kayıt olmuş ama son 6 aydır hiç sipariş vermemiş kullanıcılar kimler?' diye sorduğunda INNER JOIN bu kişileri eler! Onları görebilmenin tek yolu LEFT JOIN yapıp sipariş kolonu NULL olanları filtrelemektir (Anti-Join).",
      howItWorksStepByStep: [
        "1. Sol tablodaki (customers) tüm satırlar garanti olarak çıktıya alınır.",
        "2. Sağ tabloda (orders) eşleşen siparişler varsa yanlarına eklenir.",
        "3. Sağ tabloda eşleşme yoksa sağ tarafın tüm kolonlarına NULL atanır.",
        "4. 'WHERE o.id IS NULL' eklenirse yalnızca eşleşmeyen kayıp satırlar süzülür (Anti-Join).",
      ],
      whenToUse: [
        "Tüm müşteriler ve varsa siparişleri.",
        "Tüm kategoriler ve varsa altındaki ürünler (hiç ürünü olmayan boş kategorileri bulmak).",
        "İlişkisi olmayan yetim kayıtları yakalamak (Anti-Join kalıbı).",
      ],
      whenNotToUse: [
        "LEFT JOIN yaptıktan sonra WHERE bloğuna sağ tablodan filtre koyarsanız, sorgu istemeden INNER JOIN'e dönüşür!",
      ],
      comparisonTable: {
        titleA: "INNER JOIN",
        titleB: "LEFT JOIN",
        rows: [
          { aspect: "Eşleşmeyen Satırlar", itemA: "Tamamen elenir ve silinir", itemB: "Sol tablo korunur, sağ taraf NULL dolar" },
          { aspect: "Kullanım Amacı", itemA: "Yalnızca ilişkisi olanlar", itemB: "İlişkisi olsun ya da olmasın tüm ana liste" },
        ],
      },
    },
    content: {
      introduction:
        "Bazen ilişkisi olmayan verileri de görmek isteriz: 'Sisteme kayıtlı ama henüz hiç sipariş vermemiş kullanıcılar kimler?' INNER JOIN bu kullanıcıları elerdi; LEFT JOIN ise onları korur ve sipariş kolonlarını NULL yapar.",
      mentalModel:
        "Yoklama alan bir öğretmeni düşünün (LEFT TABLE: Öğrenciler). Öğretmen sınıftaki her öğrencinin adını okur. Eğer öğrenci ödevini teslim ettiyse ödev notu yazılır (RIGHT TABLE), teslim etmediyse hanesine 'Teslim Edilmedi' (NULL) yazılır ama öğrencinin adı yoklama listesinden silinmez.",
      lifecycleDiagram:
        "Sol Tablo (Müşteriler)         Sağ Tablo (Siparişler)       LEFT JOIN Çıktısı\n[Müşteri 1: Ahmet]      <───>  [Sipariş #101]         ==>   Ahmet - Sipariş #101\n[Müşteri 2: Mehmet]     <───>  (Siparişi Yok)         ==>   Mehmet - NULL (KORUNDU!)",
      syntaxDiagram:
        "SELECT c.first_name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL; -- 'Hiç siparişi olmayanlar' filtresi (Anti-Join)",
      examples: [
        {
          title: "Seviye 1: Tüm Müşteriler ve Varsa Siparişleri",
          description: "Siparişi olsun ya da olmasın tüm müşterileri listeler.",
          sql: "SELECT \n  c.first_name,\n  c.last_name,\n  o.id AS siparis_id,\n  COALESCE(o.total_amount, 0) AS harcama\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nLIMIT 6;",
          explanation: "Siparişi olmayan müşterilerin siparis_id alanı NULL döner, harcama COALESCE ile 0 basılır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Anti-Join — Hiç Sipariş Vermemiş Müşterileri Yakalama",
          description: "Sisteme kayıtlı fakat henüz 1 tane bile sipariş vermemiş pasif kullanıcılar.",
          sql: "SELECT \n  c.id,\n  c.first_name,\n  c.last_name,\n  c.email\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;",
          explanation: "o.id IS NULL şartı sayesinde yalnızca sağ tabloda karşılığı olmayan yetim satırlar filtrelenir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Boş Kategorileri Tespit Etme",
          description: "Mağazada tanımlanmış fakat altında henüz hiçbir ürün bulunmayan kategoriler.",
          sql: "SELECT c.id, c.name AS kategori_adi\nFROM categories c\nLEFT JOIN products p ON c.id = p.category_id\nWHERE p.id IS NULL;",
          explanation: "E-ticaret envanter yönetiminde boş kategorileri temizlemek veya ürün eklemek için kullanılır.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — WHERE ile LEFT JOIN'i Kazara INNER JOIN Yapma",
          description: "Sağ tablo filtresi WHERE yerine ON içine yazılmalıdır.",
          sql: "SELECT c.first_name, o.id, o.status\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'\nLIMIT 6;",
          explanation: "Eğer 'WHERE o.status = completed' yazılsaydı siparişi olmayan müşteriler elenir ve sorgu INNER JOIN'e dönüşürdü! Koşul ON içine yazılmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Anti-Join Kalıbı: 'LEFT JOIN ... WHERE sag_tablo.id IS NULL' deseni, ilişkisi olmayan kayıtları bulmanın en hızlı ve standart yoludur.",
        "RIGHT JOIN teorik olarak vardır ancak okunabilirlik standartları gereği sektörde neredeyse her zaman LEFT JOIN tercih edilir.",
      ],
      commonPitfalls: [
        "LEFT JOIN yaptıktan sonra WHERE bloğuna sağ tablodan bir filtre yazarsanız (ör: WHERE o.status = 'completed'), bu sorgu farkında olmadan INNER JOIN'e dönüşür! Sağ tablo filtreleri ON içine yazılmalıdır.",
      ],
      quickCheck: {
        question: "'Hiç siparişi bulunmayan müşterileri' listelemek için hangi yöntem kullanılır?",
        options: [
          "INNER JOIN orders ON c.id = o.customer_id",
          "LEFT JOIN orders ON c.id = o.customer_id WHERE o.id IS NULL",
          "CROSS JOIN orders",
          "RIGHT JOIN customers ON c.id = o.customer_id WHERE c.id IS NOT NULL",
        ],
        correctIndex: 1,
        explanation: "LEFT JOIN ile sağ tabloyu bağlayıp sağ tablonun Primary Key'inin IS NULL olduğu satırları filtrelemek Anti-Join üretir.",
      },
    },
  },

  {
    id: 14,
    worldId: 7,
    moduleId: 3,
    moduleName: "Modül 3: Çoklu Tablo, İlişkiler & Kümeler",
    title: "FULL OUTER JOIN, CROSS JOIN ve SELF JOIN",
    subtitle: "Kartezyen çarpımlar, hiyerarşik yönetici-çalışan eşleşmeleri ve tam birleşim.",
    category: "Intermediate",
    readTime: "6 Dakika",
    summary: "FULL OUTER JOIN iki taraftaki tüm kayıtları korur. CROSS JOIN her satırı diğerinin her satırıyla çarpar. SELF JOIN tablonun kendisiyle birleştirilmesidir.",
    datasetId: "ecommerce",
    visualType: "joins",
    whatItDoes:
      "Standart iki tablolu ilişkilerin ötesinde; tüm olasılık kombinasyonlarını üretmek (CROSS JOIN - örn: 3 Beden x 4 Renk = 12 Varyant), tablonun kendi içindeki hiyerarşiyi çözmek (SELF JOIN - çalışan ile yöneticisi) veya her iki tablodaki tüm verileri kayıpsız birleştirmek (FULL JOIN) için kullanılır.",
    deepDive: {
      whyNeeded:
        "Bazen tabloda dış bir tabloya değil, kendi içine işaret eden bir anahtar vardır. Ya da bir promosyon matrisi için her müşteriyi her ürünle eşleştirmek gerekir.",
      howItWorksStepByStep: [
        "1. FULL JOIN: Sol ve sağın kesişimini alır, solun artıklarını NULL ile, sağın artıklarını da NULL ile çıktıda toplar.",
        "2. CROSS JOIN: Sol tablodaki her satır için sağ tablonun tamamını kopyalar (N x M satır).",
        "3. SELF JOIN: Aynı tabloya iki farklı alias (e1, e2) verilerek sanki iki ayrı tabloymuş gibi bağlanır.",
      ],
      whenToUse: [
        "Ürün varyant matrisleri (Beden x Renk x Kumaş).",
        "Organizasyon şemaları ve ast-üst ilişkileri.",
        "İki sistem arasındaki veri mutabakatı (Reconciliation).",
      ],
      whenNotToUse: [
        "Büyük tablolarda CROSS JOIN felakettir (10.000 x 10.000 = 100 milyon satır!).",
      ],
    },
    content: {
      introduction:
        "Temel JOIN'lerin ötesinde; organizasyon şemalarında bir çalışanın yöneticisini bulmak için SELF JOIN, tüm olasılık kombinasyonlarını üretmek için CROSS JOIN kullanılır.",
      mentalModel:
        "SELF JOIN, tablonun bir fotokopisini çekip yan yana koymaktır. Soldaki tabloda 'Çalışan', sağdaki fotokopide 'Yönetici' olarak bakarız.",
      syntaxDiagram:
        "-- SELF JOIN:\nSELECT e.name AS calisan, m.name AS yonetici\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n\n-- CROSS JOIN (Kartezyen Çarpım):\nSELECT p.name, c.name\nFROM products p CROSS JOIN categories c;",
      examples: [
        {
          title: "Seviye 1: CROSS JOIN ile Kategori x Müşteri Kombinasyon Matrisi",
          description: "Her müşteriyi her kategoriyle eşleştirerek kampanya hedefleme listesi üretir.",
          sql: "SELECT c.first_name, cat.name AS kategori\nFROM customers c\nCROSS JOIN categories cat\nLIMIT 6;",
          explanation: "Her müşteri her kategoriyle tek tek eşleştirilerek tüm kartezyen permütasyonlar türetilir.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: FULL OUTER JOIN ile İki Taraflı Veri Mutabakatı",
          description: "Müşteriler ve siparişlerdeki tüm kayıtları eşleşmeyenler dahil listeler.",
          sql: "SELECT \n  c.first_name,\n  o.id AS siparis_id,\n  o.total_amount\nFROM customers c\nFULL OUTER JOIN orders o ON c.id = o.customer_id\nLIMIT 8;",
          explanation: "Hem siparişi olmayan müşteriler hem müşterisi silinmiş siparişler NULL ile korunarak tek tabloda görünür.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: SELF JOIN ile Aynı Şehirdeki Müşteri Çiftlerini Bulma",
          description: "Customers tablosunu kendisiyle bağlayarak aynı şehirde yaşayan müşteri ikililerini eşleştirir.",
          sql: "SELECT \n  a.first_name AS musteri_1,\n  b.first_name AS musteri_2,\n  a.city\nFROM customers a\nINNER JOIN customers b ON a.city = b.city AND a.id < b.id\nLIMIT 5;",
          explanation: "'a.id < b.id' şartı bir kişinin kendisiyle eşleşmesini ve tekrarları engeller.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Eski Virgüllü Sözdizimi Tuzağı",
          description: "Eski tip 'FROM t1, t2' yazımı kazara CROSS JOIN patlamasına yol açar.",
          sql: "SELECT p.name, c.name\nFROM products p, categories c\nWHERE p.category_id = c.id\nLIMIT 5;",
          explanation: "WHERE şartı unutulursa motor anında tüm tabloyu çarpar. Bu yüzden her zaman modern 'INNER JOIN ... ON' yazılmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "CROSS JOIN büyük tablolarda felakete yol açabilir. Yalnızca kontrollü küçük referans tablolarında kullanılmalıdır.",
      ],
      commonPitfalls: [
        "ON koşulu yazılmayan virgüllü eski SQL sözdizimleri ('FROM table1, table2') yanlışlıkla CROSS JOIN üretir.",
      ],
      quickCheck: {
        question: "Bir şirkette çalışanların yöneticilerini aynı 'employees' tablosundan eşleştirmek için hangi JOIN türü kullanılır?",
        options: ["CROSS JOIN", "SELF JOIN", "NATURAL JOIN", "OUTER UNION"],
        correctIndex: 1,
        explanation: "Tablonun kendi kendine foreign key üzerinden bağlanması işlemine SELF JOIN denir.",
      },
    },
  },

  {
    id: 15,
    worldId: 10,
    moduleId: 3,
    moduleName: "Modül 3: Çoklu Tablo, İlişkiler & Kümeler",
    title: "Küme Operatörleri: UNION, UNION ALL, INTERSECT ve EXCEPT",
    subtitle: "Sorgu sonuçlarını alt alta birleştirme, kesişim ve fark kümeleri.",
    category: "Advanced",
    readTime: "5 Dakika",
    summary: "JOIN tabloları yatay (kolon bazında) birleştirirken, Küme Operatörleri dikey (satır bazında) birleştirir. UNION ALL tekrarları silmez ve çok daha hızlıdır.",
    datasetId: "ecommerce",
    visualType: "sets",
    whatItDoes:
      "İki veya daha fazla bağımsız sorgunun sonucunu alt alta tek bir liste halinde birleştirir (UNION), ortak kesişimlerini alır (INTERSECT) veya birinci listede olup ikincide olmayanları ayıklar (EXCEPT).",
    deepDive: {
      whyNeeded:
        "JOIN iki tabloyu yan yana yapıştırarak kolon sayısını artırır. Ancak bazen 'Aktif Müşteriler' ile 'Arşivlenmiş Eski Müşteriler' gibi iki ayrı tablonun satırlarını tek bir liste halinde alt alta eklemek gerekir.",
      howItWorksStepByStep: [
        "1. Birinci SELECT sorgusu çalıştırılır.",
        "2. İkinci SELECT sorgusu çalıştırılır.",
        "3. UNION ALL: Satırlar doğrudan alt alta yapıştırılır (Çok hızlı).",
        "4. UNION: Tüm satırlar belleğe alınıp SORT + DISTINCT yapılarak mükerrerler temizlenir.",
      ],
      whenToUse: [
        "Farklı tablolardan gelen logları veya iletişim listelerini tek potada eritmek.",
        "UNION ALL ile yüksek performanslı veri birleştirme.",
      ],
      whenNotToUse: [
        "Tekrarları ayıklama zorunluluğu yoksa asla 'UNION' kullanmayın; 'UNION ALL' kat kat daha hızlıdır.",
      ],
      comparisonTable: {
        titleA: "UNION",
        titleB: "UNION ALL",
        rows: [
          { aspect: "Tekrarlayan Kayıtlar", itemA: "Mükerrer satırları siler (DISTINCT)", itemB: "Tüm satırları olduğu gibi korur" },
          { aspect: "Performans", itemA: "Sıralama maliyeti vardır (Yavaş)", itemB: "Sıfır sıralama maliyeti (Işık hızında)" },
        ],
      },
    },
    content: {
      introduction:
        "Matematiksel küme teorisini sorgulara uygularız. İki farklı tablodan gelen sonuçları tek bir liste halinde alt alta birleştirmek için UNION kullanılır.",
      mentalModel:
        "JOIN iki tabloyu yan yana yapıştırarak enlemesine genişletir. UNION ise iki listenin alt alta dizilerek boylamasına uzatılmasıdır.",
      lifecycleDiagram:
        "[Sorgu 1: 100 Satır]          [Sorgu 2: 50 Satır]\n          │                           │\n          └───► [ UNION ALL ] ◄───────┘\n                      │\n             [Çıktı: 150 Satır (Hızlı)]\n\n          └───► [ UNION (Tekrarsız) ] ◄──┘\n                      │\n             [Çıktı: 120 Satır (Sıralama Maliyetli)]",
      syntaxDiagram:
        "SELECT col1, col2 FROM table1\nUNION ALL -- veya UNION / INTERSECT / EXCEPT\nSELECT col1, col2 FROM table2;",
      examples: [
        {
          title: "Seviye 1: İki Farklı Şehri Alt Alta Birleştirme (UNION ALL)",
          description: "İstanbul ve Ankara'daki müşterileri tek bir liste halinde birleştirir.",
          sql: "SELECT first_name, email, city FROM customers WHERE city = 'Istanbul'\nUNION ALL\nSELECT first_name, email, city FROM customers WHERE city = 'Ankara'\nLIMIT 6;",
          explanation: "Her iki sorgudan gelen kayıtlar alt alta tek bir sonuç tablosunda toplanır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Tekil Liste Üretme (UNION)",
          description: "Ortak elemanları temizleyerek tekilleştirilmiş liste çıkarır.",
          sql: "SELECT city FROM customers WHERE id <= 5\nUNION\nSELECT city FROM customers WHERE id > 5\nORDER BY city;",
          explanation: "UNION arka planda DISTINCT çalıştırarak mükerrer şehirleri teke indirir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Kesişim Kümesi (INTERSECT)",
          description: "Hem 2024 başında hem de 2024 baharında sipariş vermiş sadık müşterileri bulma.",
          sql: "SELECT customer_id FROM orders WHERE order_date < '2024-03-01'\nINTERSECT\nSELECT customer_id FROM orders WHERE order_date >= '2024-03-01';",
          explanation: "INTERSECT yalnızca her iki sorgunun sonucunda da ortak bulunan kayıtları getirir.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Kolon Sayısı ve Tipi Uyuşmazlığı",
          description: "İki SELECT sorgusunun kolon adedi uyuşmadığında motor syntax hatası fırlatır.",
          sql: "SELECT id, name FROM categories\nUNION ALL\nSELECT id, name FROM products\nLIMIT 6;",
          explanation: "Her iki taraf da tam olarak 2 kolon (INTEGER, VARCHAR) döndürdüğü için sorgu başarıyla birleşir.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Tekrarlayan satırları temizleme zorunluluğunuz yoksa her zaman 'UNION ALL' kullanın. 'UNION' arka planda gizli bir DISTINCT ve SORT çalıştırdığı için büyük verilerde çok yavaştır.",
        "Küme işlemlerinde her iki SELECT sorgusunun kolon sayısı ve veri tipleri birebir uyumlu olmak zorundadır.",
      ],
      commonPitfalls: [
        "UNION ile birleştirilen iki sorguda kolon adları farklıysa, nihai çıktının başlıkları ilk SELECT sorgusundaki adları alır.",
      ],
      quickCheck: {
        question: "UNION ile UNION ALL arasındaki temel performans ve işlev farkı nedir?",
        options: [
          "UNION sadece sayıları birleştirir, UNION ALL metinleri birleştirir.",
          "UNION tekrarlayan kayıtları ayıklar (DISTINCT yapar); UNION ALL tüm satırları olduğu gibi birleştirir ve çok daha hızlıdır.",
          "UNION ALL yalnızca 2 tablo ile çalışabilir.",
          "Hiçbir fark yoktur.",
        ],
        correctIndex: 1,
        explanation: "UNION tekilleştirme için ekstra sıralama/eleme yapar, UNION ALL ise doğrudan alt alta ekler.",
      },
    },
  },

  // =========================================================================
  // MODÜL 4: İLERİ ANALİTİK, KOŞULLU MANTIK & WINDOW FUNCTIONS (16 - 22)
  // =========================================================================
  {
    id: 16,
    worldId: 8,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Koşullu Mantık: CASE WHEN THEN ELSE END",
    subtitle: "SQL içinde IF-ELSE dallanmaları, dinamik segmentasyon ve pivotlama.",
    category: "Intermediate",
    readTime: "5 Dakika",
    summary: "CASE ifadesi SQL'in IF-THEN-ELSE mantığıdır. Satırları şartlara göre dinamik olarak etiketlemek, kategorize etmek veya değer dönüştürmek için kullanılır.",
    datasetId: "ecommerce",
    visualType: "casewhen",
    whatItDoes:
      "SQL içindeki IF-ELSE mekanizmasıdır. Veritabanındaki ham sayılara veya durumlara bakarak satırları anında etiketler: Örneğin sipariş tutarı 50.000 TL üzeri ise 'VIP Sipariş', 10.000 TL üzeri ise 'Orta Ölçek', altı ise 'Standart' rozeti takar.",
    deepDive: {
      whyNeeded:
        "Veritabanında 'VIP Müşteri' diye ayrı bir kolon olmayabilir. İş kuralları değiştikçe tabloyu güncellemek yerine sorgu anında dinamik segmentasyon yapmak gerekir.",
      howItWorksStepByStep: [
        "1. Her bir satır için CASE ifadesi yukarıdan aşağıya değerlendirilir.",
        "2. İlk sağlanan WHEN koşulunun THEN değeri anında sonuç olarak atanır ve çıkılır (Short-circuit).",
        "3. Hiçbir WHEN tutmazsa ELSE değeri atanır.",
        "4. ELSE yazılmamışsa ve hiçbir şart tutmamışsa sonuç NULL döner.",
      ],
      whenToUse: [
        "Müşteri ve sipariş segmentasyonu.",
        "Aggregate fonksiyonu içinde koşullu toplama: SUM(CASE WHEN ...).",
        "Durum kodlarını Türkçeleştirme (completed -> 'Tamamlandı').",
      ],
      whenNotToUse: [
        "Sonlandırırken 'END' anahtar kelimesini unutmayın.",
      ],
    },
    content: {
      introduction:
        "Müşterileri harcama tutarına göre 'VIP', 'Standart' veya 'Düşük Hacimli' olarak etiketlemek, ya da stok durumuna göre 'Tükendi', 'Kritik Seviye', 'Yeterli' durumları üretmek için CASE yapısı kullanılır.",
      mentalModel:
        "Trafik ışığı kontrolörü düşünün. Işık kırmızıysa DUR, sarıysa HAZIRLAN, yeşilse GEÇ. CASE ifadesi her bir satırın değerini yukarıdan aşağıya kontrol eder, ilk eşleşen WHEN bloğunun sonucunu döner.",
      syntaxDiagram:
        "SELECT column1,\n  CASE\n    WHEN price >= 20000 THEN 'Premium Ürün'\n    WHEN price >= 5000  THEN 'Orta Segment'\n    ELSE 'Ekonomik'\n  END AS fiyat_segmenti\nFROM products;",
      examples: [
        {
          title: "Seviye 1: Müşteri Siparişlerini Tutar Segmentlerine Ayırma",
          description: "Sipariş tutarını 3 kademeli iş segmentine dönüştürür.",
          sql: "SELECT \n  id AS siparis_id,\n  total_amount,\n  CASE \n    WHEN total_amount >= 50000 THEN 'VIP Yüksek Hacim'\n    WHEN total_amount >= 15000 THEN 'Orta Ölçek'\n    ELSE 'Standart Sipariş'\n  END AS siparis_kategorisi\nFROM orders\nLIMIT 6;",
          explanation: "Her satır kendi total_amount değerine göre anında dinamik bir etiket kazanır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Stok Durumu Uyarı Sistemi",
          description: "Stok miktarına göre lojistik uyarı etiketleri üretir.",
          sql: "SELECT \n  name,\n  stock_quantity,\n  CASE \n    WHEN stock_quantity = 0  THEN 'TÜKENDİ'\n    WHEN stock_quantity < 20 THEN 'KRİTİK STOK'\n    ELSE 'YETERLİ'\n  END AS stok_durumu\nFROM products\nLIMIT 6;",
          explanation: "Stok durumuna göre anlık operasyonel alarm etiketi oluşturulur.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Koşullu Toplama (Pivot Mantığı)",
          description: "Farklı statüdeki sipariş tutarlarını tek satırda sütunlara ayırma.",
          sql: "SELECT \n  COUNT(*) AS toplam_siparis,\n  SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) AS basarili_ciro,\n  SUM(CASE WHEN status = 'cancelled' THEN total_amount ELSE 0 END) AS kayip_ciro\nFROM orders;",
          explanation: "SUM içine CASE koymak raporlamada pivot tablolara can verir.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — ELSE Yazılmadığında NULL Dönmesi",
          description: "ELSE belirtilmezse ve hiçbir WHEN tutmazsa değer sessizce NULL olur.",
          sql: "SELECT name, price,\n  CASE \n    WHEN price > 50000 THEN 'Pahalı'\n    ELSE 'Normal'\n  END AS etiket\nFROM products\nLIMIT 5;",
          explanation: "Varsayılan bir ELSE belirlemek verinin beklenmedik şekilde NULL dönmesini engeller.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "CASE WHEN ifadeleri GROUP BY içinde ve Aggregate fonksiyonlarının içinde de kullanılabilir: SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS tamamlanan_ciro (Koşullu Toplama).",
        "Koşullarda ELSE yazılmazsa ve hiçbir WHEN tutmazsa sonuç NULL döner.",
      ],
      commonPitfalls: [
        "CASE yapısını sonlandırırken 'END' anahtar kelimesini unutmak yaygın bir syntax hatasıdır.",
      ],
      quickCheck: {
        question: "Bir CASE ifadesinde hiçbir WHEN koşulu sağlanmazsa ve ELSE belirtilmemişse dönen değer nedir?",
        options: ["0", "Boş String ('')", "NULL", "Syntax Error"],
        correctIndex: 2,
        explanation: "SQL standardında ELSE yazılmadığında örtük olarak 'ELSE NULL' kabul edilir.",
      },
    },
  },

  {
    id: 17,
    worldId: 9,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Alt Sorgular (Subqueries): Skaler, IN ve EXISTS Mantığı",
    subtitle: "Sorgu içinde sorgu mimarisi, ilişkili (correlated) alt sorgular ve performans.",
    category: "Advanced",
    readTime: "6 Dakika",
    summary: "Bir SQL sorgusunun çıktısını başka bir sorgunun girdisi olarak kullanma tekniğidir. WHERE, FROM ve SELECT bloklarında yer alabilir.",
    datasetId: "ecommerce",
    visualType: "lifecycle",
    whatItDoes:
      "Tek adımda çözülemeyen problemleri çözer. Örneğin: 'Katalogdaki ortalama ürün fiyatından daha pahalı olan ürünler hangileri?' sorusunda motor önce ortalamayı hesaplar (İç sorgu), ardından bu ortalamadan büyük olan ürünleri listeler (Dış sorgu).",
    deepDive: {
      whyNeeded:
        "Veritabanında dinamik eşik değerleri vardır. Ortalama fiyat her yeni ürün eklendiğinde değişir. Alt sorgu bu eşiği sorgu anında dinamik olarak hesaplar.",
      howItWorksStepByStep: [
        "1. Parantez içindeki alt sorgu (Subquery) çalışır ve bir sonuç kümesi üretir.",
        "2. Skaler alt sorgu ise tek bir hücre döner.",
        "3. Dış sorgu bu değeri WHERE koşulunda bir sabit gibi kullanır.",
        "4. EXISTS alt sorgularında ise motor ilk eşleşmeyi bulduğu anda aramayı durdurur (Early Exit).",
      ],
      whenToUse: [
        "Dinamik ortalamalara veya sınırlara göre filtreleme yaparken.",
        "Varlık kontrolü: WHERE EXISTS (SELECT 1 FROM ...).",
        "FROM bloğunda geçici türetilmiş tablolar oluştururken.",
      ],
      whenNotToUse: [
        "Her satır için tekrar çalışan Correlated Subquery'ler büyük tablolarda çok yavaşlayabilir; yerine JOIN tercih edilmelidir.",
      ],
    },
    content: {
      introduction:
        "'Ortalama fiyattan daha pahalı olan ürünler hangileri?' sorusunu tek adımda cevaplayamayız; önce ortalama fiyatı bulmalı, sonra ürünleri filtrelemeliyiz. Alt sorgular bu çok adımlı mantığı tek sorguda çözer.",
      mentalModel:
        "Matematikteki parantez içi işlemler gibidir: 5 * (2 + 3). Önce parantez içindeki alt sorgu çalışır ve bir sonuç üretir, ardından dıştaki ana sorgu bu sonucu kullanır.",
      syntaxDiagram:
        "-- Skaler Alt Sorgu:\nSELECT name, price FROM products\nWHERE price > (SELECT AVG(price) FROM products);\n\n-- EXISTS Alt Sorgusu:\nSELECT * FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);",
      examples: [
        {
          title: "Seviye 1: Ortalama Fiyatın Üzerindeki Ürünler (Skaler Alt Sorgu)",
          description: "Katalogdaki ortalama fiyatı hesaplayıp bu fiyattan pahalı ürünleri filtreler.",
          sql: "SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products)\nORDER BY price ASC;",
          explanation: "İçteki '(SELECT AVG(price) FROM products)' tek bir sayı döner ve dıştaki WHERE bu sayıdan büyükleri seçer.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Sipariş Vermiş Müşterileri Bulma (IN Alt Sorgusu)",
          description: "Orders tablosunda kaydı bulunan müşteri ID'lerini süzerek müşteri detaylarını çeker.",
          sql: "SELECT id, first_name, last_name, email\nFROM customers\nWHERE id IN (SELECT customer_id FROM orders)\nLIMIT 5;",
          explanation: "İç sorgu bir ID listesi üretir, dış sorgu bu listedeki müşterileri listeler.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Performans Şampiyonu: EXISTS ile Varlık Kontrolü",
          description: "En az 1 siparişi olan müşterileri erken çıkış (Early Exit) ile tespit eder.",
          sql: "SELECT c.first_name, c.email\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n)\nLIMIT 5;",
          explanation: "EXISTS ilk eşleşen siparişi bulduğu anda o müşteri için taramayı bitirir; tüm siparişleri saymaz.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — 'Subquery returned more than 1 row'",
          description: "Tekil eşittir (=) ile çoklu satır dönen alt sorgu çağrıldığında sistem çöker.",
          sql: "SELECT name, price\nFROM products\nWHERE category_id IN (SELECT id FROM categories WHERE name LIKE '%s%');",
          explanation: "Eğer birden fazla kategori dönebilirse '=' yerine daima 'IN' kullanılmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Varlık kontrolü yaparken 'IN (SELECT ...)' yerine çoğunlukla 'EXISTS (SELECT 1 FROM ...)' tercih edilir. EXISTS ilk eşleşmeyi bulduğu anda taramayı durdurur (Early Exit) ve çok daha performanslıdır.",
      ],
      commonPitfalls: [
        "WHERE column = (SELECT ...) şeklinde tekil karşılaştırma operatörü (=) kullanıldığında, alt sorgu birden fazla satır dönerse 'Subquery returned more than 1 row' çalışma zamanı hatası alınır. Çoklu satır için 'IN' kullanılmalıdır.",
      ],
      quickCheck: {
        question: "Bir alt sorgunun tek bir değer (1 satır, 1 kolon) döndürdüğü yapılara ne ad verilir?",
        options: [
          "Skaler Alt Sorgu (Scalar Subquery)",
          "Vektörel Alt Sorgu",
          "Kartezyen Sorgu",
          "Recursive Sorgu",
        ],
        correctIndex: 0,
        explanation: "Tek bir hücre (1 satır, 1 kolon) döndüren alt sorgulara Skaler (Scalar) Alt Sorgu denir.",
      },
    },
  },

  {
    id: 18,
    worldId: 12,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Ortak Tablo İfadeleri (CTE - WITH Cümlesi)",
    subtitle: "Okunabilir, modüler ve geçici sonuç kümeleri tanımlama sanatı.",
    category: "Advanced",
    readTime: "6 Dakika",
    summary: "WITH anahtar kelimesi ile karmaşık sorguları geçici adlandırılmış tablolara (CTE) bölerek kodun okunabilirliğini ve yönetilebilirliğini artırırız.",
    datasetId: "ecommerce",
    visualType: "syntax_anatomy",
    whatItDoes:
      "İç içe geçmiş spagetti alt sorguları okunabilir, tertemiz adımlara böler. 'WITH musteri_harcamalari AS (...)' diyerek geçici sanal bir tablo tanımlar, ana sorguda bu sanal tabloyu gerçek bir tabloymuş gibi kullanırsınız.",
    deepDive: {
      whyNeeded:
        "4 katmanlı iç içe alt sorgular yazıldığında kodu yazan kişi bile 2 hafta sonra ne yaptığını anlayamaz. CTE sorguyu tıpkı bir yemek tarifi gibi adım 1, adım 2, adım 3 şeklinde modülerleştirir.",
      howItWorksStepByStep: [
        "1. WITH bloğundaki alt sorgu bellekte geçici bir sonuç kümesi (CTE) oluşturur.",
        "2. Takip eden ana SELECT sorgusu bu CTE'yi sanki veritabanında kayıtlı gerçek bir tabloymuş gibi çağırır.",
        "3. Ana sorgu tamamlandığında geçici CTE belleği anında serbest bırakılır.",
      ],
      whenToUse: [
        "Karmaşık çok adımlı raporlamalar.",
        "Window Functions sonuçlarını WHERE ile filtrelemek gerektiğinde.",
        "Kodun bakımını ve okunabilirliğini artırmak için.",
      ],
      whenNotToUse: [
        "CTE kalıcı bir tablo değildir; yalnızca tanımlandığı TEK bir SQL cümlesi boyunca yaşar.",
      ],
    },
    content: {
      introduction:
        "İç içe geçmiş 4-5 katmanlı alt sorgular (Subqueries) kodu okunamaz bir 'SQL Spagettisi' haline getirir. CTE (Common Table Expression), sorgunun başında geçici sanal tablolar tanımlayarak sorguyu adım adım inşa etmemizi sağlar.",
      mentalModel:
        "Yemek yaparken malzemeleri önceden doğrayıp kaselere koymak (Mise en place) gibidir. Önce 'WITH dogranmis_soganlar AS (...)', sonra 'WITH marine_tavuk AS (...)', en son ana tencerede hepsini birleştirirsiniz.",
      lifecycleDiagram:
        "WITH musteri_harcamalari AS (\n  SELECT customer_id, SUM(total_amount) AS toplam\n  FROM orders GROUP BY customer_id\n)\nSELECT * FROM musteri_harcamalari WHERE toplam > 50000;",
      syntaxDiagram:
        "WITH cte_bir AS (\n  SELECT col1, col2 FROM table1\n),\ncte_iki AS (\n  SELECT col1, SUM(col2) AS total FROM cte_bir GROUP BY col1\n)\nSELECT * FROM cte_iki WHERE total > 1000;",
      examples: [
        {
          title: "Seviye 1: Müşteri Harcama Özetini CTE ile Çıkarma",
          description: "Önce müşteri toplam harcamalarını hesaplar, sonra 30.000 TL üzeri olanları çeker.",
          sql: "WITH musteri_ozeti AS (\n  SELECT customer_id, COUNT(id) AS siparis_adedi, SUM(total_amount) AS toplam_harcama\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT \n  c.first_name,\n  c.last_name,\n  m.siparis_adedi,\n  m.toplam_harcama\nFROM musteri_ozeti m\nJOIN customers c ON m.customer_id = c.id\nWHERE m.toplam_harcama >= 30000;",
          explanation: "musteri_ozeti CTE'si ana sorguda sanki gerçek bir tabloymuş gibi JOIN ile bağlanmıştır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Zincirleme Çoklu CTE (Chained CTEs)",
          description: "Bir CTE'nin çıktısını bir sonraki CTE'de kullanarak adım adım ciro hesaplama.",
          sql: "WITH siparis_kalemleri AS (\n  SELECT order_id, SUM(quantity * unit_price) AS kalem_toplam\n  FROM order_items\n  GROUP BY order_id\n),\nyuksek_siparisler AS (\n  SELECT order_id, kalem_toplam\n  FROM siparis_kalemleri\n  WHERE kalem_toplam > 50000\n)\nSELECT * FROM yuksek_siparisler;",
          explanation: "Virgülle ayrılarak birden fazla CTE birbirini besleyecek şekilde zincirlenebilir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Kategori Ortalaması Üzerindeki Ürünleri CTE ile Bulma",
          description: "Ortalamayı CTE'de saklayıp ana tabloda kıyaslama.",
          sql: "WITH kategori_istatistik AS (\n  SELECT category_id, AVG(price) AS kat_ort\n  FROM products\n  GROUP BY category_id\n)\nSELECT p.name, p.price, ROUND(k.kat_ort, 2) AS ortalama\nFROM products p\nJOIN kategori_istatistik k ON p.category_id = k.category_id\nWHERE p.price > k.kat_ort;",
          explanation: "Kategori ortalamasını önceden hesaplayıp her ürünle temiz bir JOIN ile eşleştirdik.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — CTE Sonrası Virgül Unutulması",
          description: "Birden fazla CTE tanımlanırken araya virgül konur fakat 'WITH' kelimesi tekrarlanmaz.",
          sql: "WITH birinci AS (SELECT id, name FROM categories),\nikinci AS (SELECT id, name FROM products)\nSELECT * FROM birinci LIMIT 3;",
          explanation: "'WITH' sadece en başta bir kez yazılır, sonraki CTE'ler sadece virgül ile bağlanır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Birden fazla CTE tanımlanırken aralarına virgül konur; 'WITH' kelimesi yalnızca en başta bir kez yazılır.",
        "PostgreSQL 12+ sürümlerinde CTE'ler varsayılan olarak inline (inlined) edilir, bu sayede alt sorgular kadar hızlı optimize edilir.",
      ],
      commonPitfalls: [
        "CTE'ler yalnızca tanımlandıkları TEK bir ana sorgu boyunca yaşar; sonraki bağımsız bir sorguda çağrılamazlar.",
      ],
      quickCheck: {
        question: "Aşağıdakilerden hangisi CTE (WITH) kullanmanın en büyük avantajıdır?",
        options: [
          "Veritabanında kalıcı tablo oluşturması",
          "Karmaşık sorguları parçalayarak okunabilirliği ve modülerliği artırması",
          "İndeks kullanımını zorunlu kılması",
          "Sadece SELECT komutlarında çalışabilmesi",
        ],
        correctIndex: 1,
        explanation: "CTE'lerin temel amacı spagetti alt sorguları okunabilir, temiz mantıksal bloklara bölmektir.",
      },
    },
  },

  {
    id: 19,
    worldId: 13,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Pencere Fonksiyonları (Window Functions): Giriş & OVER() Mantığı",
    subtitle: "Satırları daraltmadan (GROUP BY yapmadan) analitik hesaplama yapma gücü.",
    category: "Advanced",
    readTime: "7 Dakika",
    summary: "Window Functions, GROUP BY'ın aksine satırları tek bir satıra indirgemez. Her satırın yanında tüm tablonun veya bölümün (PARTITION BY) toplamını/sırasını görmemizi sağlar.",
    datasetId: "ecommerce",
    visualType: "window",
    whatItDoes:
      "SQL'in süper gücüdür. GROUP BY yaptığınızda 100 satır 5 satıra düşer ve bireysel satır detaylarını kaybedersiniz. Window Functions ise 100 satırın 100'ünü de korur, her ürünün yanına ait olduğu kategorinin ortalamasını veya genel toplamdaki payını yeni bir kolon olarak ekler.",
    deepDive: {
      whyNeeded:
        "Bir e-ticaret tablosunda her ürünün kendi fiyatını, ait olduğu kategorinin ortalama fiyatını ve bu ortalamadan kaç TL daha pahalı olduğunu tek satırda görmek istersiniz. GROUP BY ürün detayını yok eder; Window Functions ise satırı korur.",
      howItWorksStepByStep: [
        "1. FROM ve WHERE aşamaları tamamlanır.",
        "2. PARTITION BY ile veriler görünmez pencerelere (gruplara) bölünür.",
        "3. Her pencere için AVG, SUM veya COUNT hesaplanır.",
        "4. Hesaplanan değer o pencereye ait TÜM satırların yanına yeni bir kolon olarak yazıştırılır.",
      ],
      whenToUse: [
        "Her satırın grup ortalamasıyla kıyaslanması.",
        "Kümülatif toplamlar ve hareketli ortalamalar.",
        "Genel toplam içerisindeki yüzde pay hesabı.",
      ],
      whenNotToUse: [
        "Window Functions WHERE veya HAVING içinde DOĞRUDAN çağrılamaz. Filtrelemek için CTE içine alınmalıdır.",
      ],
      comparisonTable: {
        titleA: "GROUP BY",
        titleB: "Window Function (OVER)",
        rows: [
          { aspect: "Satır Sayısı", itemA: "Grup sayısı kadar satıra daralır (Azalır)", itemB: "Tüm satırlar birebir korunur (Değişmez)" },
          { aspect: "Bireysel Detay", itemA: "Tek tek ürün/müşteri adları kaybolur", itemB: "Hem bireysel detay hem grup metriği aynı satırdadır" },
        ],
      },
    },
    content: {
      introduction:
        "GROUP BY yaptığınızda 100 satırlık tablo 5 satıra düşer ve bireysel satır detaylarını kaybedersiniz. Window Functions ise 100 satırın 100'ünü de korur, her satırın yanına yeni bir hesaplanmış analitik pencere kolonu ekler.",
      mentalModel:
        "Bir sınıftaki öğrencilerin sınav sonuç belgesi düşünün. Belgede öğrencinin kendi notu (85) yazarken, hemen yanında sınıfın ortalaması (72) da yazar. Öğrenci satırı kaybolmaz ama grup metriği yanına eklenir.",
      lifecycleDiagram:
        "Satır 1: [Ürün A | 100 TL] ── OVER (PARTITION BY Kat) ──> Kat Ort: 120 TL (Satır Korundu)\nSatır 2: [Ürün B | 140 TL] ── OVER (PARTITION BY Kat) ──> Kat Ort: 120 TL (Satır Korundu)",
      syntaxDiagram:
        "SELECT column1, column2,\n  FUNCTION() OVER (\n    PARTITION BY partition_col \n    ORDER BY sort_col\n  ) AS window_col\nFROM table_name;",
      examples: [
        {
          title: "Seviye 1: Her Ürünün Yanına Kategori Ortalamasını Ekleme",
          description: "Ürünün kendi fiyatını ve ait olduğu kategorinin ortalama fiyatını yan yana listeler.",
          sql: "SELECT \n  id,\n  name,\n  category_id,\n  price,\n  ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS kategori_ortalama_fiyat,\n  price - ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS fark\nFROM products\nLIMIT 6;",
          explanation: "Satırlar kaybolmadan her ürünün kategori ortalamasından ne kadar pahalı/ucuz olduğu anında hesaplanmıştır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Ürünün Tüm Envanterdeki Yüzde Payı (% Share)",
          description: "Her ürünün fiyatının mağazanın toplam envanter cirosundaki payını hesaplar.",
          sql: "SELECT \n  name,\n  price,\n  ROUND(price / SUM(price) OVER () * 100, 2) AS genel_fiyat_yuzdesi\nFROM products\nORDER BY price DESC\nLIMIT 5;",
          explanation: "OVER() içi boş bırakıldığında tüm tablo tek bir pencere kabul edilir ve genel toplam hesaplanır.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Kategori İçi En Yüksek Fiyat ile Kıyaslama",
          description: "Kategorinin lider ürünü ile aradaki fiyat farkını her satırda gösterme.",
          sql: "SELECT \n  name,\n  category_id,\n  price,\n  MAX(price) OVER (PARTITION BY category_id) AS kategorinin_zirve_fiyati\nFROM products\nLIMIT 6;",
          explanation: "MAX(price) OVER (PARTITION BY ...) her kategorinin tepe fiyatını her satırın yanına basar.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — WHERE İçinde Window Function Çağırma",
          description: "WHERE OVER(...) yazıldığında 'window functions are not allowed in WHERE' hatası alınır.",
          sql: "WITH analiz AS (\n  SELECT name, price, AVG(price) OVER () AS genel_ort\n  FROM products\n)\nSELECT * FROM analiz WHERE price > genel_ort;",
          explanation: "Window fonksiyonunun sonucunu filtrelemek için CTE ile sarmalayıp dış sorguda WHERE yazmak zorunludur.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "PARTITION BY: Veriyi hangi gruplara böleceğinizi belirler (GROUP BY'ın satırları yok etmeyen hali).",
        "ORDER BY (OVER içinde): Pencere içindeki hesaplamanın hangi sırada akacağını belirler (Kümülatif hesaplamalar için şarttır).",
      ],
      commonPitfalls: [
        "Window fonksiyonları WHERE veya HAVING bloklarında doğrudan çalıştırılamaz çünkü WHERE, Window Functions'tan ÖNCE yürütülür! Filtrelemek için CTE içine almak gerekir.",
      ],
      quickCheck: {
        question: "GROUP BY ile Window Functions (OVER) arasındaki en belirgin fark nedir?",
        options: [
          "GROUP BY satırları birleştirip daraltır; Window Functions tüm satırları koruyarak yanına hesaplama ekler.",
          "Window Functions sadece PostgreSQL'de vardır.",
          "GROUP BY daha hızlı çalışmak zorundadır.",
          "Window Functions matematiksel işlem yapamaz.",
        ],
        correctIndex: 0,
        explanation: "Window fonksiyonları satır sayısını azaltmadan analitik pencere hesaplamaları ekler.",
      },
    },
  },

  {
    id: 20,
    worldId: 13,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Sıralama Pencere Fonksiyonları: ROW_NUMBER, RANK ve DENSE_RANK",
    subtitle: "Liderlik tabloları, eşitlik durumları ve 'Her kategorinin en pahalı ilk 3 ürünü' analitiği.",
    category: "Advanced",
    readTime: "6 Dakika",
    summary: "ROW_NUMBER her satıra benzersiz sıra numarası (1,2,3,4) verir. RANK eşitlikte sıra atlar (1,2,2,4). DENSE_RANK eşitlikte sıra atlamaz (1,2,2,3).",
    datasetId: "ecommerce",
    visualType: "ranking",
    whatItDoes:
      "Satırlara dinamik sıra numarası (1., 2., 3.) verir. İki ürün veya yarışmacı aynı puana sahip olduğunda sıralamanın nasıl davranacağını yönetir. 'Her kategorinin en çok satan ilk 2 ürünü' raporlarının mimarıdır.",
    deepDive: {
      whyNeeded:
        "Tüm mağazanın en pahalı 3 ürününü LIMIT 3 ile bulabilirsiniz. Fakat 'HER kategorinin kendi içindeki en pahalı 2 ürününü' LIMIT ile bulamazsınız! Bunun için her kategori içinde DENSE_RANK hesaplayıp 'WHERE rank <= 2' demek gerekir.",
      howItWorksStepByStep: [
        "1. PARTITION BY ile satırlar kategorilere bölünür.",
        "2. ORDER BY ile her grup kendi içinde puana/fiyata göre dizilir.",
        "3. ROW_NUMBER: Eşitlik olsa bile her satıra benzersiz ardışık numara basar.",
        "4. RANK: Eşit puan alanlara aynı dereceyi verir ama sonrakini atlar.",
        "5. DENSE_RANK: Eşit puan alanlara aynı dereceyi verir ama sayı atlamaz.",
      ],
      whenToUse: [
        "Oyun ve satış liderlik tabloları (Leaderboard).",
        "Her kategorinin Top-N ürününü çekme.",
        "Mükerrer verileri temizleme (Deduplication - ROW_NUMBER > 1 olanları silme).",
      ],
      whenNotToUse: [
        "Sıralama fonksiyonunu doğrudan WHERE içinde çağıramazsınız; daima bir CTE ile sarmalanmalıdır.",
      ],
      comparisonTable: {
        titleA: "RANK()",
        titleB: "DENSE_RANK()",
        rows: [
          { aspect: "Eşitlik Davranışı", itemA: "Dereceyi paylaşır (2, 2)", itemB: "Dereceyi paylaşır (2, 2)" },
          { aspect: "Sonraki Numara", itemA: "Sırayı atlar (1, 2, 2, 4) — 3 atlandı", itemB: "Sıkışık devam eder (1, 2, 2, 3) — Atlamaz" },
        ],
      },
    },
    content: {
      introduction:
        "E-ticaret ve oyun liderlik tablolarında en çok kullanılan üçüz sıralama fonksiyonlarıdır. Eşit puan alan iki kullanıcı olduğunda sıralamanın nasıl davranacağını RANK ve DENSE_RANK belirler.",
      mentalModel:
        "Olimpiyat koşusu düşünün. İki koşucu 2.liği paylaştı. RANK sistemi: 1. (Altın), 2. (Gümüş), 2. (Gümüş), 4. (Sıradaki 3.lük atlandı!). DENSE_RANK sistemi: 1. (Altın), 2. (Gümüş), 2. (Gümüş), 3. (Sıra atlanmadı). ROW_NUMBER sistemi: Foto-finişle mutlaka birine 2, diğerine 3 der.",
      lifecycleDiagram:
        "Değerler: [100, 90, 90, 80]\nROW_NUMBER: 1,   2,  3,  4 (Her zaman ardışık)\nRANK:       1,   2,  2,  4 (3 atlandı!)\nDENSE_RANK: 1,   2,  2,  3 (Sıkışık sıralama)",
      syntaxDiagram:
        "SELECT name, price,\n  ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num,\n  RANK()       OVER (ORDER BY price DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rnk\nFROM products;",
      examples: [
        {
          title: "Seviye 1: Üç Fonksiyonun Yan Yana Karşılaştırması",
          description: "Fiyata göre sıralamada eşitliklerin nasıl derecelendirildiğini gösterir.",
          sql: "SELECT \n  name,\n  price,\n  ROW_NUMBER() OVER (ORDER BY price DESC) AS rn,\n  RANK()       OVER (ORDER BY price DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rnk\nFROM products\nLIMIT 6;",
          explanation: "Üç fonksiyonun aynı veriler üzerindeki farklı sıra üretme stratejileri yan yana görülür.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Her Kategorinin En Pahalı İlk 2 Ürünü (Top-N Per Group)",
          description: "CTE ve DENSE_RANK kullanarak her kategorinin lider 2 ürününü bulur.",
          sql: "WITH sirali_urunler AS (\n  SELECT \n    name, category_id, price,\n    DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS sira\n  FROM products\n)\nSELECT * FROM sirali_urunler WHERE sira <= 2;",
          explanation: "DENSE_RANK her kategoride fiyatı en yüksek üründen başlayarak 1, 2 verir. Dış sorgu 'sira <= 2' ile ilk 2'yi süzer.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Tekrarlayan Kayıtları Temizleme (Deduplication Kalıbı)",
          description: "Aynı müşteri birden çok kez eklenmişse en eski kaydı koruyup kopyaları ayıklama mantığı.",
          sql: "WITH benzersiz AS (\n  SELECT id, first_name, email,\n    ROW_NUMBER() OVER (PARTITION BY email ORDER BY id ASC) AS rn\n  FROM customers\n)\nSELECT * FROM benzersiz WHERE rn = 1;",
          explanation: "rn = 1 ilk özgün kaydı seçer, rn > 1 olanlar silinecek kopyalardır.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — OVER İçinde ORDER BY Unutulması",
          description: "Sıralama fonksiyonlarında parantez içinde ORDER BY yazılmazsa motor sıra veremez.",
          sql: "SELECT name, price,\n  ROW_NUMBER() OVER (ORDER BY id ASC) AS sira_no\nFROM products\nLIMIT 5;",
          explanation: "Sıralama fonksiyonlarının doğası gereği pencere içinde mutlaka açık bir ORDER BY bulunmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Tekrarlayan verileri silerken (Deduplication): 'ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn' yapıp 'WHERE rn > 1' olanları silmek endüstri standardıdır.",
      ],
      commonPitfalls: [
        "Pencere fonksiyonunu doğrudan WHERE içinde filtrelemeye çalışmak (WHERE ROW_NUMBER() = 1). Mutlaka bir CTE veya alt sorgu ile sarmalanmalıdır.",
      ],
      quickCheck: {
        question: "Değerler [50, 40, 40, 30] olduğunda DENSE_RANK() çıktısı ne olur?",
        options: [
          "1, 2, 3, 4",
          "1, 2, 2, 4",
          "1, 2, 2, 3",
          "1, 1, 2, 3",
        ],
        correctIndex: 2,
        explanation: "DENSE_RANK eşitliklerde aynı sırayı verir fakat sonraki sayıyı atlamadan ardışık devam ettirir (1, 2, 2, 3).",
      },
    },
  },

  {
    id: 21,
    worldId: 14,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Değer Kaydırma: LAG, LEAD ve MoM Büyüme Analitiği",
    subtitle: "Önceki ve sonraki satır değerlerini getirme, Month-over-Month (MoM) ciro artışı.",
    category: "Mastery",
    readTime: "6 Dakika",
    summary: "LAG(kolon, N) geçerli satırdan N önceki satırın değerini, LEAD(kolon, N) ise N sonraki satırın değerini getirir. Dönemsel büyüme hesaplamalarında vazgeçilmezdir.",
    datasetId: "fintech",
    visualType: "laglead",
    whatItDoes:
      "SQL'de zamanda yolculuk yaptırır. Bir satırdayken kendinden önceki satırın (LAG) veya kendinden sonraki satırın (LEAD) değerini çekip getirir. 'Geçen aya göre ciro yüzde kaç arttı?' hesabını tek satırda çözdürür.",
    deepDive: {
      whyNeeded:
        "Geleneksel SQL'de önceki ayın cirosuna erişmek için tabloyu kendiyle tarihler üzerinden bağlamak gerekirdi; bu çok yavaş ve zordur. LAG fonksiyonu bellek işaretçisi ile bir önceki satıra doğrudan uzanır.",
      howItWorksStepByStep: [
        "1. ORDER BY ile satırlar kronolojik sıraya dizilir.",
        "2. LAG(ciro, 1) mevcut satırın bir üstündeki satırın ciro değerini okur.",
        "3. İlk satırdan önce bir satır olmadığı için varsayılan olarak NULL döner.",
        "4. (bu_ay - gecen_ay) / gecen_ay formülü ile yüzde büyüme anında hesaplanır.",
      ],
      whenToUse: [
        "Finansal büyüme analizleri (MoM, YoY).",
        "İki ardışık olay arasındaki geçen süreyi hesaplama.",
        "Sensör verilerinde bir önceki ölçüme göre ani sıçramaları yakalama.",
      ],
      whenNotToUse: [
        "OVER() parantezi içine ORDER BY koymazsanız hangi satırın önce geldiği bilinemez ve hatalı veri döner.",
      ],
    },
    content: {
      introduction:
        "Finansal analizlerin kalbi 'Geçen aya göre ne kadar büyüdük?' sorusudur. SQL'de önceki ayın cirosuna erişmek için tabloları kendiyle zorla bağlamak yerine LAG() fonksiyonu kullanılır.",
      mentalModel:
        "Bir kuyrukta duruyorsunuz. LAG(1) arkanıza bakıp bir önceki kişinin omzuna dokunmaktır. LEAD(1) ise önünüzdeki kişinin omzuna dokunup değerini sormaktır.",
      syntaxDiagram:
        "SELECT \n  islem_tarihi,\n  ciro,\n  LAG(ciro, 1) OVER (ORDER BY islem_tarihi) AS onceki_gun_ciro,\n  ciro - LAG(ciro, 1) OVER (ORDER BY islem_tarihi) AS gunluk_fark\nFROM gunluk_finans;",
      examples: [
        {
          title: "Seviye 1: İşlemlerde Bir Önceki Transfer Tutarını Getirme",
          description: "Her finansal işlemin yanına kendinden bir önceki işlemin tutarını ekler.",
          sql: "SELECT \n  id,\n  amount,\n  created_at,\n  LAG(amount, 1) OVER (ORDER BY created_at) AS onceki_islem_tutari\nFROM transactions\nORDER BY created_at\nLIMIT 6;",
          explanation: "LAG(amount, 1) bir önceki transfer tutarını çekerek karşılaştırma imkanı verir.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Günlük Ciro Değişimi ve Büyüme Oranı",
          description: "CTE ve LAG ile ardışık işlemler arasındaki farkı hesaplar.",
          sql: "SELECT \n  id,\n  amount AS guncel_tutar,\n  LAG(amount, 1, 0) OVER (ORDER BY created_at) AS onceki_tutar,\n  amount - LAG(amount, 1, 0) OVER (ORDER BY created_at) AS fark\nFROM transactions\nORDER BY created_at\nLIMIT 6;",
          explanation: "LAG(amount, 1, 0) ilk satırda NULL yerine 0 dönmesini sağlayarak matematiksel farkı korur.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Gelecekteki Değeri Okuma (LEAD Fonksiyonu)",
          description: "Bir sonraki işlemin ne zaman ve ne kadar yapıldığını önceden görme.",
          sql: "SELECT \n  id,\n  amount,\n  created_at,\n  LEAD(amount, 1) OVER (ORDER BY created_at) AS sonraki_islem_tutari\nFROM transactions\nORDER BY created_at\nLIMIT 6;",
          explanation: "LEAD bir sonraki satıra bakar; son satırda kendisinden sonrası olmadığı için NULL döner.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — ORDER BY Eksikliği",
          description: "Zaman bazlı kaydırmalarda OVER içinde kronolojik ORDER BY yazılmazsa sonuç anlamsızlaşır.",
          sql: "SELECT id, amount, LAG(amount, 1) OVER (ORDER BY created_at, id) AS onceki\nFROM transactions\nLIMIT 5;",
          explanation: "Aynı saniyede gerçekleşen işlemler için 'created_at, id' çifti ile tam deterministik sıra kurulmalıdır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "LAG ve LEAD fonksiyonlarına varsayılan değer verilebilir: LAG(ciro, 1, 0) ilk satırda NULL yerine 0 döndürür.",
      ],
      commonPitfalls: [
        "LAG ve LEAD fonksiyonlarında OVER() parantezi içine mutlaka mantıklı bir 'ORDER BY' yazılmalıdır; aksi takdirde hangi satırın önce geldiği bilinemez.",
      ],
      quickCheck: {
        question: "İlk satır için LAG(kolon, 1) çağrıldığında ve varsayılan değer verilmediğinde dönen sonuç nedir?",
        options: ["0", "NULL", "İlk satırın kendi değeri", "Syntax Error"],
        correctIndex: 1,
        explanation: "İlk satırdan önce bir satır bulunmadığı için varsayılan olarak NULL döner.",
      },
    },
  },

  {
    id: 22,
    worldId: 14,
    moduleId: 4,
    moduleName: "Modül 4: İleri Analitik & Pencere Fonksiyonları",
    title: "Kümülatif Toplam (Running Totals) & Hareketli Ortalamalar",
    subtitle: "Zaman içinde biriken ciro (SUM OVER ORDER BY) ve kayan pencereler (ROWS BETWEEN).",
    category: "Mastery",
    readTime: "6 Dakika",
    summary: "OVER (ORDER BY tarih) yazıldığında SUM fonksiyonu kümülatif toplam (Running Total) moduna geçer ve her satırda o ana kadar biriken toplamı verir.",
    datasetId: "fintech",
    visualType: "laglead",
    whatItDoes:
      "Bir kumbarada biriken para gibi zamanla katlanarak büyüyen toplamı (Running Total) her satırda hesaplar. Ayrıca son 3 işlemin hareketli ortalamasını (Moving Average) alarak trend çizgilerini pürüzsüzleştirir.",
    deepDive: {
      whyNeeded:
        "Banka hesap ekstrelerinde her para transferinin ardından müşteriye 'İşlem Sonrası Güncel Bakiye' gösterilmek zorundadır. Tek tek bakiye güncellemek yerine kümülatif SUM penceresi anında bakiye akışını çizer.",
      howItWorksStepByStep: [
        "1. SUM(amount) OVER (ORDER BY created_at) yazıldığında varsayılan pencere çerçevesi 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' olur.",
        "2. Bu kural motorun 'Tablonun en başından şu anki satıra kadar olan tüm sayıları topla' demesidir.",
        "3. Her satır bir öncekinin üzerine eklenerek kartopu gibi büyür.",
      ],
      whenToUse: [
        "Banka hesap ekstreleri ve kalan bakiye gösterimi.",
        "Yıl başından bu yana biriken toplam ciro (Year-to-Date YTD Revenue).",
        "Borsa ve hisse senedi 7 günlük hareketli ortalamaları.",
      ],
      whenNotToUse: [
        "SUM OVER () içine ORDER BY yazmazsanız kümülatif toplam yapmaz; tüm tablonun sabit genel toplamını basar.",
      ],
    },
    content: {
      introduction:
        "Banka hesap hareketlerinde her işlemden sonra 'Kalan Bakiye'yi göstermek veya yıl başından bu yana biriken toplam geliri (YTD Revenue) çizdirmek için Kümülatif Toplam kullanılır.",
      mentalModel:
        "Kumbaraya para atıyorsunuz. 1. gün 10 TL attınız (Küm: 10), 2. gün 20 TL attınız (Küm: 30), 3. gün 15 TL attınız (Küm: 45). Kümülatif toplam her satırda kumbaradaki güncel toplam parayı söyler.",
      lifecycleDiagram:
        "Gün 1: 100 TL ──> Kümülatif: 100 TL\nGün 2: 250 TL ──> Kümülatif: 350 TL (100 + 250)\nGün 3:  50 TL ──> Kümülatif: 400 TL (350 + 50)",
      syntaxDiagram:
        "SELECT \n  created_at,\n  amount,\n  SUM(amount) OVER (ORDER BY created_at) AS kumulatif_toplam,\n  AVG(amount) OVER (\n    ORDER BY created_at \n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS hareketli_3_islem_ortalama\nFROM transactions;",
      examples: [
        {
          title: "Seviye 1: İşlem Bazında Kümülatif Finansal Hacim",
          description: "İşlemler gerçekleştikçe biriken toplam hacmi anlık olarak hesaplar.",
          sql: "SELECT \n  id,\n  amount,\n  created_at,\n  SUM(amount) OVER (ORDER BY created_at, id) AS anlik_biriken_hacim\nFROM transactions\nORDER BY created_at\nLIMIT 6;",
          explanation: "OVER(ORDER BY created_at) ifadesi SUM'ı bir kümülatif akışa dönüştürmüştür.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Kayan Pencere (Son 3 İşlemin Hareketli Ortalaması)",
          description: "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW kalıbı.",
          sql: "SELECT \n  id,\n  amount,\n  ROUND(AVG(amount) OVER (\n    ORDER BY created_at\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ), 2) AS hareketli_ortalama\nFROM transactions\nORDER BY created_at\nLIMIT 6;",
          explanation: "Her satırda kendisi ve kendinden önceki 2 işlemin ortalamasını alarak dalgalanmaları törpüler.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Hesap Bazında Ayrı Kümülatif Bakiye (PARTITION BY)",
          description: "Her banka hesabının kendi bakiyesini bağımsız olarak biriktirme.",
          sql: "SELECT \n  from_account_id,\n  id AS islem_id,\n  amount,\n  SUM(amount) OVER (\n    PARTITION BY from_account_id \n    ORDER BY created_at\n  ) AS hesaptan_cikan_toplam\nFROM transactions\nORDER BY from_account_id, created_at\nLIMIT 6;",
          explanation: "PARTITION BY from_account_id sayesinde hesaplar birbirine karışmaz; her hesabın bakiyesi sıfırdan başlar.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — ORDER BY Olmadığında Genel Toplam Basılması",
          description: "OVER() içine ORDER BY konulmadığında kümülatif akış durur.",
          sql: "SELECT id, amount, \n  SUM(amount) OVER () AS tum_tablo_genel_toplam,\n  SUM(amount) OVER (ORDER BY id) AS kumulatif\nFROM transactions\nLIMIT 5;",
          explanation: "ORDER BY olmadan SUM OVER () tüm tablonun statik toplamını her satıra yapıştırır.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW' ifadesi son 7 günün hareketli ortalamasını (7-day Moving Average) hesaplamak için kullanılır.",
      ],
      commonPitfalls: [
        "SUM(amount) OVER () yazarsanız tablonun genel toplamını verir. Kümülatif akış için parantez içinde mutlaka 'ORDER BY' bulunmalıdır.",
      ],
      quickCheck: {
        question: "SUM(tutar) OVER (ORDER BY tarih) ifadesinde 'ORDER BY' bulunması fonksiyonu nasıl etkiler?",
        options: [
          "Tüm tablonun sabit genel toplamını her satıra basar.",
          "O satıra kadar biriken kümülatif toplamı (Running Total) hesaplar.",
          "Sadece en yüksek tutarı döner.",
          "Syntax hatası verir.",
        ],
        correctIndex: 1,
        explanation: "Pencere fonksiyonunda ORDER BY belirtildiğinde varsayılan pencere çerçevesi 'UNBOUNDED PRECEDING TO CURRENT ROW' olur ve kümülatif toplam üretir.",
      },
    },
  },

  // =========================================================================
  // MODÜL 5: PERFORMANS, İNDEKSLEME & ADLİ BİLİŞİM (23 - 25)
  // =========================================================================
  {
    id: 23,
    worldId: 15,
    moduleId: 5,
    moduleName: "Modül 5: Performans, İndeksleme & Adli Bilişim",
    title: "Veritabanı İndeksleri & B-Tree Çalışma Mantığı",
    subtitle: "Milyonlarca satırda milisaniyelik aramalar nasıl yapılır? Index Scan vs Seq Scan.",
    category: "Mastery",
    readTime: "6 Dakika",
    summary: "İndeks, kitabın arkasındaki 'Fihrist' gibidir. Tablodaki tüm satırları tek tek taramak (Full Table Scan) yerine O(log N) sürede doğrudan hedefe ulaşmayı sağlar.",
    datasetId: "ecommerce",
    visualType: "btree",
    whatItDoes:
      "Milyonlarca satırlık tablolarda bir aramayı 3 saniyeden 1 milisaniyeye indirir. Tıpkı kalın bir ansiklopedinin arkasındaki fihrist gibi, aradığınız bilginin diskte tam olarak hangi blokta olduğunu işaret eder.",
    deepDive: {
      whyNeeded:
        "100 milyon müşterisi olan bir bankada 'WHERE email = ...' aradığınızda indekssiz arama diskin tüm gigabaytlarını baştan sona okur (Seq Scan) ve dakikalar sürer. B-Tree indeks bu aramayı sadece 3-4 disk sıçramasına (Index Scan) indirir.",
      howItWorksStepByStep: [
        "1. İndeks oluşturulduğunda kolon değerleri dengeli bir ağaç (Balanced Tree - B-Tree) yapısında sıralı saklanır.",
        "2. Kök düğümden başlanarak aranan değerin hangi dalda olduğu ikili arama mantığıyla (O(log N)) bulunur.",
        "3. Yaprak düğümdeki disk işaretçisine (Tuple ID - TID) ulaşılır.",
        "4. Yalnızca hedef satır diskten çekilir.",
      ],
      whenToUse: [
        "Primary Key ve Foreign Key kolonlarında.",
        "WHERE ve JOIN koşullarında sürekli kullanılan arama kolonlarında.",
        "Sıkça ORDER BY yapılan kolonlarda.",
      ],
      whenNotToUse: [
        "Her kolona rastgele indeks eklemeyin! İndeksler okumayı hızlandırırken, her INSERT/UPDATE işleminde yazma hızını düşürür.",
      ],
      comparisonTable: {
        titleA: "Sequential Scan (İndekssiz)",
        titleB: "Index Scan (B-Tree)",
        rows: [
          { aspect: "Arama Süresi", itemA: "Tablo boyutuyla doğru orantılı artar O(N) — YAVAŞ", itemB: "Logaritmik hızda sabit kalır O(log N) — ANLIK" },
          { aspect: "Disk I/O Yükü", itemA: "Milyonlarca blok okunur", itemB: "Yalnızca 3-4 blok okunur" },
        ],
      },
    },
    content: {
      introduction:
        "100 milyon satırlık bir tabloda 'WHERE email = ...' aradığınızda indekssiz arama saatler sürebilir. B-Tree (Balanced Tree) indeksler bu aramayı 3-4 disk okumasına (1-2 milisaniye) indirir.",
      mentalModel:
        "1.000 sayfalık bir tıp ansiklopedisinde 'Aspirin' kelimesini arıyorsunuz. Sayfa 1'den başlayıp tek tek okursanız (Sequential Scan) saatler sürer. Kitabın arkasındaki fihriste (İndeks) bakıp 'Sayfa 412'ye giderseniz (Index Scan) 2 saniye sürer.",
      lifecycleDiagram:
        "Arama: 'Zeynep'\n[A - M] ───► [N - Z]\n                 │\n          [N - T] ───► [U - Z] ───► [Zeynep -> Satır İşaretçisi (TID)] (O(log N))",
      syntaxDiagram:
        "CREATE INDEX idx_customers_email ON customers(email);\nCREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date DESC);",
      examples: [
        {
          title: "Seviye 1: Primary Key Üzerinden Nokta Atışı Erişim (O(log N))",
          description: "Primary Key (id) otomatik B-Tree indeksine sahiptir ve doğrudan hedefe zıplar.",
          sql: "SELECT id, first_name, email\nFROM customers\nWHERE id = 1;",
          explanation: "Primary Key indeksi sayesinde tablo taranmaz, 1 milisaniyede döner.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Kompozit İndeks (Çok Kolonlu Arama)",
          description: "Hem müşteri hem tarih bazlı aramalarda iki kolonlu kompozit indeks mantığı.",
          sql: "SELECT id, total_amount, order_date\nFROM orders\nWHERE customer_id = 1 AND order_date >= '2024-01-01';",
          explanation: "(customer_id, order_date) kompozit indeksi hem müşteriyi hem tarihi tek ağaçta çözer.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Index-Only Scan (Diske Hiç Gitmeden Çözme)",
          description: "Sorgulanan tüm kolonlar indeksin içindeyse tablo diskine hiç dokunulmaz.",
          sql: "SELECT id FROM customers WHERE id BETWEEN 1 AND 5;",
          explanation: "id zaten indeks ağacında saklandığı için ana tablo sayfalarına gitmeden sonuç döner.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — İndeksli Kolona Fonksiyon Uygulama Tuzağı",
          description: "WHERE LOWER(email) yazıldığında standart B-Tree indeksi devre dışı kalır.",
          sql: "SELECT id, first_name FROM customers WHERE email = 'ahmet.yilmaz@email.com';",
          explanation: "Kolonu çıplak bırakmak indeksin devrede kalmasını sağlar; fonksiyona sokulursa tam tablo taraması başlar.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Her kolona rastgele indeks eklemeyin! İndeksler okumayı (SELECT) hızlandırırken, her INSERT/UPDATE/DELETE işleminde indeks ağacının yeniden düzenlenmesi gerektiği için yazma maliyetini artırır.",
        "Kompozit (Çok Kolonlu) İndekslerde kolon sırası hayati önem taşır: (sehir, yas) indeksi 'WHERE sehir = ...' aramasını hızlandırır ama 'WHERE yas = ...' aramasını hızlandırmaz (Sol Kuralı / Leftmost Prefix).",
      ],
      commonPitfalls: [
        "İndeksli kolona fonksiyon uygulamak: 'WHERE LOWER(email) = ...' yazdığınızda standart email indeksi KULLANILAMAZ! Bunun için Function-Based Index gerekir.",
      ],
      quickCheck: {
        question: "Bir veritabanında gereksiz çok sayıda indeks oluşturmanın en belirgin dezavantajı nedir?",
        options: [
          "SELECT sorgularını yavaşlatması",
          "INSERT, UPDATE ve DELETE (yazma) işlemlerini yavaşlatması ve disk alanı tüketmesi",
          "Veritabanının kapanmasına yol açması",
          "Syntax hatası vermesi",
        ],
        correctIndex: 1,
        explanation: "Her yeni veri eklendiğinde veya güncellendiğinde tüm indeks ağaçlarının da güncellenmesi gerekir.",
      },
    },
  },

  {
    id: 24,
    worldId: 15,
    moduleId: 5,
    moduleName: "Modül 5: Performans, İndeksleme & Adli Bilişim",
    title: "SARGable Sorgular & EXPLAIN Sorgu Planı İnceleme",
    subtitle: "Search Argument Able: İndeksleri öldürmeden sorgu yazma kuralları.",
    category: "Mastery",
    readTime: "7 Dakika",
    summary: "SARGable (Search Argument Able), veritabanı motorunun indeksten yararlanabilmesini sağlayan doğru sorgu yazım biçimidir. Fonksiyonları kolon tarafına değil değer tarafına yazmak esastır.",
    datasetId: "ecommerce",
    visualType: "sargable",
    whatItDoes:
      "Yazdığınız bir sorgunun veritabanındaki indeksleri kullanıp kullanmadığını (SARGable olup olmadığını) belirler. Yanlış yazılmış tek bir WHERE koşulu 10 milyon satırlık indeksi çöpe atıp sunucuyu kilitleyebilir.",
    deepDive: {
      whyNeeded:
        "Harika indeksler kursanız bile acemi bir yazılımcı 'WHERE price * 1.2 > 1000' yazdığı anda motor kolondaki indeksi terk eder ve 10 milyon satırı tek tek çarpmaya başlar. SARGable kuralı kolonu daima çıplak bırakmayı emreder.",
      howItWorksStepByStep: [
        "1. Motor WHERE koşulunu inceler.",
        "2. Sol taraftaki kolon tek başına çıplaksa (fonksiyonsuz ve işlemsiz) B-Tree aralığı tetiklenir (Index Scan).",
        "3. Sol tarafta bir fonksiyon (LOWER, YEAR, SUBSTRING) varsa motor her satırı hesaplamak zorunda kalır (Seq Scan).",
      ],
      whenToUse: [
        "Tarih filtrelemelerinde: WHERE tarih >= '2024-01-01' AND tarih < '2025-01-01'.",
        "Matematiksel eşiklerde: WHERE price > 1000 / 1.2.",
      ],
      whenNotToUse: [
        "LIKE '%kelime' aramaları asla SARGable olamaz.",
      ],
      comparisonTable: {
        titleA: "Non-SARGable (Yavaş)",
        titleB: "SARGable (Hızlı)",
        rows: [
          { aspect: "Tarih Filtresi", itemA: "WHERE YEAR(created_at) = 2024", itemB: "WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'" },
          { aspect: "Matematik Filtresi", itemA: "WHERE price * 1.2 > 12000", itemB: "WHERE price > 12000 / 1.2" },
          { aspect: "Metin Filtresi", itemA: "WHERE SUBSTRING(phone, 1, 3) = '053'", itemB: "WHERE phone LIKE '053%'" },
        ],
      },
    },
    content: {
      introduction:
        "Harika indeksler kursanız bile yanlış yazılmış bir WHERE koşulu indeksi çöpe atabilir. 'WHERE YEAR(created_at) = 2024' yazdığınızda motor her satır için fonksiyon çalıştırmak zorunda kalır ve indeksi terk eder.",
      mentalModel:
        "Fihristte 'Ahmet' ismini arıyorsunuz. Biri size 'İsminin ilk harfi A olanları bul' derse fihristi kullanırsınız (SARGable). Ama 'İsminin harf sayısı 5 olanları bul' derse tüm fihristi baştan sona tek tek saymak zorunda kalırsınız (Non-SARGable).",
      lifecycleDiagram:
        "NON-SARGABLE (YAVAŞ): WHERE price * 1.2 > 12000 (Kolona matematik yapıldı -> Seq Scan)\nSARGABLE (HIZLI):     WHERE price > 12000 / 1.2  (Kolon çıplak bırakıldı -> Index Scan)",
      syntaxDiagram:
        "-- SARGable Doğru Tarih Aralığı Filtresi:\nSELECT * FROM orders \nWHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';",
      examples: [
        {
          title: "Seviye 1: SARGable Tarih Aralığı Filtresi",
          description: "İndeksi tam verimle kullanan doğru tarih filtreleme kalıbı.",
          sql: "SELECT id, total_amount, order_date\nFROM orders\nWHERE order_date >= '2024-01-01'\n  AND order_date < '2024-04-01'\nORDER BY order_date ASC;",
          explanation: "order_date kolonu fonksiyona sokulmadan çıplak bırakıldığı için B-Tree Range Scan çalışır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Matematiksel Sabiti Sağa Taşıma Kuralı",
          description: "Kolonu matematikten arındırıp işlemi karşı taraftaki sabite uygulama.",
          sql: "SELECT name, price\nFROM products\nWHERE price > 60000 / 1.20;",
          explanation: "'WHERE price * 1.2 > 60000' yerine bu şekilde yazmak price kolonundaki indeksi kurtarır.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Metin Başlangıç Filtresi (SARGable Prefix)",
          description: "SUBSTRING yerine LIKE 'önek%' kullanımı.",
          sql: "SELECT first_name, email\nFROM customers\nWHERE email LIKE 'ahmet%';",
          explanation: "LIKE 'ahmet%' B-Tree indeksinde 'a' harfine doğrudan zıplayabilir; ama '%ahmet' zıplayamaz.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Sol Tarafta Fonksiyon Kullanma Felaketi",
          description: "WHERE EXTRACT(YEAR FROM order_date) = 2024 yazımı.",
          sql: "SELECT id, total_amount, order_date\nFROM orders\nWHERE order_date >= '2024-01-01' AND order_date <= '2024-12-31';",
          explanation: "EXTRACT yerine aralık filtreleme yazıldığında veritabanı tam tablo taramasından kurtulur.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Altın Kural: WHERE sol tarafındaki kolon her zaman çıplak (fonksiyonsuz ve matematiksiz) kalmalıdır. Hesaplamaları sağ taraftaki sabite uygulayın.",
      ],
      commonPitfalls: [
        "LIKE '%kelime' (başında yüzde olan aramalar) asla SARGable değildir.",
      ],
      quickCheck: {
        question: "Aşağıdaki WHERE koşullarından hangisi SARGable'dır (İndeksi verimli kullanır)?",
        options: [
          "WHERE UPPER(name) = 'AHMET'",
          "WHERE price + 500 > 2000",
          "WHERE created_at >= '2024-01-01'",
          "WHERE SUBSTRING(phone, 1, 3) = '555'",
        ],
        correctIndex: 2,
        explanation: "Yalnızca 3. seçenekte kolon herhangi bir fonksiyona veya matematik işlemine sokulmadan çıplak bırakılmıştır.",
      },
    },
  },

  {
    id: 25,
    worldId: 15,
    moduleId: 5,
    moduleName: "Modül 5: Performans, İndeksleme & Adli Bilişim",
    title: "Adli Bilişim & Finansal Fraud Soruşturmaları (Forensic Querying)",
    subtitle: "Zaman pencereleri, şüpheli IP korelasyonları ve SQL ile anomali tespiti.",
    category: "Mastery",
    readTime: "7 Dakika",
    summary: "Adli bilişim sorguları; log kayıtları, işlem anomalileri, yetkisiz erişimler ve zaman korelasyonlarını birbirine bağlayarak kanıt zinciri oluşturur.",
    datasetId: "murder_mystery",
    visualType: "joins",
    whatItDoes:
      "Siber saldırıları, kredi kartı dolandırıcılıklarını veya olay yeri şüphelilerini ortaya çıkarmak için tüm SQL tekniklerini (JOIN, Window Functions, CTE) birleştirir. Giriş logları, güvenlik kameraları ve araç plakaları arasında çapraz kanıt zinciri kurar.",
    deepDive: {
      whyNeeded:
        "Bir suçlu banka hesabını boşaltırken veya sisteme sızarken arkasında dijital ayak izleri bırakır. Tek bir tabloya bakarak suçlu anlaşılamaz; saat, IP adresi, fiziksel özellikler ve transfer hacimleri korele edilmelidir.",
      howItWorksStepByStep: [
        "1. Olay yeri inceleme tutanağındaki kritik ipuçları (saç rengi, boy, mekan) süzülür.",
        "2. Güvenlik geçiş logları şüpheli profilleriyle INNER JOIN edilir.",
        "3. Zaman pencereleri (±15 dakika) daraltılarak fail tek kişiye indirgenir.",
      ],
      whenToUse: [
        "Siber güvenlik log incelemesi (Brute Force tespiti).",
        "Banka kara para aklama (AML) ve fraud tespiti.",
        "SQL Dedektiflik soruşturmaları.",
      ],
      whenNotToUse: [
        "Zaman dilimlerini (Timezone) hesaba katmadan sorgu yazmayın; UTC ve yerel saat farkları delili bozabilir.",
      ],
    },
    content: {
      introduction:
        "Siber güvenlik analistleri ve adli bilişim uzmanları saldırganların izini sürmek için gelişmiş SQL tekniklerini birleştirir: CTE zincirleri, Window Functions ile ardışık denemelerin tespiti ve çok tablolu korelasyonlar.",
      mentalModel:
        "Bir dedektif masasında olay yeri fotoğrafları, şüpheli ifadeleri ve kamera kayıtlarını kırmızı iplerle birbirine bağlar. SQL'deki her JOIN ve CTE bu kırmızı iplerden biridir; sonunda tek bir şüpheliye işaret eder.",
      syntaxDiagram:
        "SELECT s.name, s.plate_number, l.checkpoint, l.entry_time\nFROM suspects s\nINNER JOIN security_logs l ON s.id = l.suspect_id\nWHERE s.hair_color = 'black'\nORDER BY l.entry_time DESC;",
      examples: [
        {
          title: "Seviye 1: Cinayet Mahalli Güvenlik Logları & Şüpheli Eşleşmesi",
          description: "Olay yerinde bulunan siyah saçlı şüphelilerin plaka ve güvenlik kayıtlarını korele eder.",
          sql: "SELECT \n  s.name AS supheli_ad,\n  s.hair_color,\n  s.plate_number,\n  l.checkpoint,\n  l.entry_time\nFROM suspects s\nINNER JOIN security_logs l ON s.id = l.suspect_id\nWHERE s.hair_color = 'black'\nORDER BY l.entry_time DESC;",
          explanation: "Fiziksel delil (siyah saç) ile dijital delil (güvenlik logu) INNER JOIN ile birleştirilerek şüpheli daraltılmıştır.",
          level: "Temel (Giriş)",
        },
        {
          title: "Seviye 2: Olay Saati Penceresinde Geçiş Yapanları Süzme",
          description: "Gece yarısı 23:00 ile 02:00 arasında turnikeden geçen şüpheliler.",
          sql: "SELECT \n  s.name,\n  s.occupation,\n  l.checkpoint,\n  l.entry_time\nFROM suspects s\nJOIN security_logs l ON s.id = l.suspect_id\nWHERE l.entry_time >= '2024-05-01 23:00:00'\n  AND l.entry_time <= '2024-05-02 02:00:00'\nORDER BY l.entry_time ASC;",
          explanation: "Cinayetin işlendiği kritik zaman penceresi adli kronolojiyle eşleştirilmiştir.",
          level: "İş Senaryosu",
        },
        {
          title: "Seviye 3: Boy ve Araç Plakası Eşleşmeli Çapraz Sorgu",
          description: "Tutanakta belirtilen 180 cm üzeri ve VIP Otopark'ı kullanan şüpheliyi bulma.",
          sql: "SELECT \n  s.name,\n  s.height_cm,\n  s.plate_number,\n  l.checkpoint,\n  l.entry_time\nFROM suspects s\nJOIN security_logs l ON s.id = l.suspect_id\nWHERE s.height_cm >= 180\n  AND l.checkpoint LIKE '%VIP%'\nORDER BY s.height_cm DESC;",
          explanation: "Çoklu delil kombinasyonu suçlunun çemberini daraltarak tek kişiye odaklar.",
          level: "İleri Seviye",
        },
        {
          title: "Seviye 4: Hata Avcısı — Kolon Adı ve Zaman Damgası Uyuşmazlığı",
          description: "security_logs tablosunda kolonun adı 'timestamp' değil 'entry_time'dır.",
          sql: "SELECT s.name, l.entry_time, l.exit_time\nFROM suspects s\nJOIN security_logs l ON s.id = l.suspect_id\nWHERE l.exit_time IS NOT NULL\nLIMIT 5;",
          explanation: "Şema tanımlarına sadık kalmak adli bilişim analizlerinde sorgu çökmelerini engeller.",
          level: "Hata Avcısı",
        },
      ],
      proTips: [
        "Adli bilişimde 'Zaman Penceresi Korelasyonu' esastır. Olay anının ±15 dakikasındaki tüm aktiviteler (giriş, transfer, yetki değişimi) taranmalıdır.",
      ],
      commonPitfalls: [
        "Zaman dilimi (Timezone) farklarını hesaba katmamak (UTC vs Yerel Saat). Her zaman UTC standardında çalışın.",
      ],
      quickCheck: {
        question: "5 dakika içinde aynı hesaba 10'dan fazla başarısız giriş denemesini (Brute Force) tespit etmek için en uygun yöntem nedir?",
        options: [
          "Sadece basit bir SELECT * FROM users",
          "Window Function (COUNT OVER RANGE BETWEEN INTERVAL '5 minutes') veya GROUP BY HAVING",
          "DISTINCT email",
          "LIMIT 5",
        ],
        correctIndex: 1,
        explanation: "Zaman pencereli hareketli toplamlar (Window Range) veya zaman dilimine göre gruplama anomaliyi anında yakalar.",
      },
    },
  },
];
