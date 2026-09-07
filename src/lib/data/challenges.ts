import { Challenge } from "@/types";

export const CHALLENGES: Challenge[] = [
  // ==========================================
  // WORLD 1: SQL'e Giriş & Temel Sorgular
  // ==========================================
  {
    id: "w1-c1",
    worldId: 1,
    order: 1,
    title: "İlk Dedektiflik Görevi: Müşteri Listesi",
    subtitle: "Tüm müşteri kayıtlarını çek",
    story: "Data Detective Ajansı'na hoş geldin acemi! TechStore e-ticaret şirketinin veri tabanına ilk erişim sağlandı. Şirket yöneticisi senden sistemde kayıtlı olan tüm müşterileri listelemeni istiyor.",
    objective: "customers tablosundaki TÜM satır ve kolonları getiren bir sorgu yaz.",
    difficulty: "easy",
    concepts: ["SELECT", "FROM", "SELECT *"],
    databaseId: "ecommerce",
    baseXp: 50,
    solutionQuery: "SELECT * FROM customers;",
    hints: {
      level1: "Bir tablodaki tüm kolonları çekmek için yıldız (*) sembolü kullanılır.",
      level2: "SELECT * FROM [tablo_adi]; yapısını kullanmalısın.",
      level3: "SELECT * FROM customers;",
    },
    learningNotes: "SELECT * ifadesi tablodaki tüm kolonları getirir. FROM ifadesi ise verinin hangi tablodan alınacağını belirtir.",
  },
  {
    id: "w1-c2",
    worldId: 1,
    order: 2,
    title: "Hedefe Odaklan: İsim ve E-posta",
    subtitle: "Belirli kolonları seçme",
    story: "Pazarlama ekibi yeni bir bülten gönderecek. Gereksiz kolonlarla veritabanını yormak istemiyorlar. Sadece müşterilerin ad, soyad ve e-posta bilgilerine ihtiyaçları var.",
    objective: "customers tablosundan first_name, last_name ve email kolonlarını seç.",
    difficulty: "easy",
    concepts: ["SELECT Specific Columns"],
    databaseId: "ecommerce",
    baseXp: 50,
    solutionQuery: "SELECT first_name, last_name, email FROM customers;",
    hints: {
      level1: "İstediğin kolon isimlerini virgülle ayırarak SELECT yanına yaz.",
      level2: "SELECT kolon1, kolon2, kolon3 FROM tablo_adi;",
      level3: "SELECT first_name, last_name, email FROM customers;",
    },
  },
  {
    id: "w1-c3",
    worldId: 1,
    order: 3,
    title: "Raporu Şıklaştır: Kolon İsimlerini Değiştir",
    subtitle: "Column Alias (AS)",
    story: "Müdürün İngilizce kolon isimlerini Türkçe rapor formatında görmek istiyor. Ürünler tablosundaki ad ve fiyat kolonlarını daha okunaklı takma adlarla (alias) listele.",
    objective: "products tablosundan name kolonunu 'urun_adi', price kolonunu 'fiyat' takma adıyla (AS) getir.",
    difficulty: "easy",
    concepts: ["Column Alias", "AS"],
    databaseId: "ecommerce",
    baseXp: 60,
    solutionQuery: "SELECT name AS urun_adi, price AS fiyat FROM products;",
    hints: {
      level1: "Bir kolona yeni isim vermek için AS anahtar kelimesini kullan.",
      level2: "SELECT kolon AS yeni_isim FROM tablo;",
      level3: "SELECT name AS urun_adi, price AS fiyat FROM products;",
    },
  },
  {
    id: "w1-c4",
    worldId: 1,
    order: 4,
    title: "Tekrarları Yok Et: Benzersiz Şehirler",
    subtitle: "DISTINCT ile benzersiz kayıtlar",
    story: "Lojistik departmanı hangi şehirlere kargo gönderimi yapıldığını öğrenmek istiyor. Aynı şehir isminin listede defalarca tekrar etmesini istemiyorlar.",
    objective: "customers tablosundaki benzersiz (tekrar etmeyen) şehirleri (city) listele.",
    difficulty: "easy",
    concepts: ["DISTINCT"],
    databaseId: "ecommerce",
    baseXp: 70,
    solutionQuery: "SELECT DISTINCT city FROM customers;",
    hints: {
      level1: "Yinelenen değerleri teke düşürmek için DISTINCT kullanılır.",
      level2: "SELECT DISTINCT kolon_adi FROM tablo_adi;",
      level3: "SELECT DISTINCT city FROM customers;",
    },
  },

  // ==========================================
  // WORLD 2: Veriyi Filtreleme Sanatı (WHERE)
  // ==========================================
  {
    id: "w2-c1",
    worldId: 2,
    order: 1,
    title: "Lüks Ürünleri Tespit Et",
    subtitle: "WHERE ve Karşılaştırma (>)",
    story: "Mağaza müdürü premium müşterilere özel bir kampanya planlıyor. Fiyatı 20.000 TL'den yüksek olan tüm ürünleri tespit etmen gerekiyor.",
    objective: "products tablosundan price değeri 20000'den büyük olan tüm ürünleri (SELECT *) listele.",
    difficulty: "easy",
    concepts: ["WHERE", ">"],
    databaseId: "ecommerce",
    baseXp: 80,
    solutionQuery: "SELECT * FROM products WHERE price > 20000;",
    hints: {
      level1: "Satırları filtrelemek için WHERE yan tümcesi kullanılır.",
      level2: "SELECT * FROM products WHERE price > ...;",
      level3: "SELECT * FROM products WHERE price > 20000;",
    },
  },
  {
    id: "w2-c2",
    worldId: 2,
    order: 2,
    title: "İstanbul'daki Müşterileri Bul",
    subtitle: "WHERE metin filtresi (=)",
    story: "İstanbul ofisindeki açılış kokteyline sadece İstanbul'da ikamet eden müşteriler davet edilecek.",
    objective: "customers tablosundan city değeri 'Istanbul' olan müşterilerin first_name, last_name ve email bilgilerini listele.",
    difficulty: "easy",
    concepts: ["WHERE", "Text Filtering", "Single Quotes"],
    databaseId: "ecommerce",
    baseXp: 80,
    solutionQuery: "SELECT first_name, last_name, email FROM customers WHERE city = 'Istanbul';",
    hints: {
      level1: "Metin filtrelerinde tek tırnak ('...') kullanmayı unutma.",
      level2: "WHERE city = 'Istanbul'",
      level3: "SELECT first_name, last_name, email FROM customers WHERE city = 'Istanbul';",
    },
  },
  {
    id: "w2-c3",
    worldId: 2,
    order: 3,
    title: "İkili Koşul: Hem Fiyat Hem Stok",
    subtitle: "AND Operatörü",
    story: "Depo sorumlusu acil uyarı geçti: 'Fiyatı 10.000 TL üzerinde olan ve stok miktarı (stock_quantity) 20'nin altında kalan kritik ürünleri derhal bulmamız lazım!'",
    objective: "products tablosunda price > 10000 VE stock_quantity < 20 olan ürünlerin name, price, stock_quantity kolonlarını getir.",
    difficulty: "medium",
    concepts: ["WHERE", "AND", "Multiple Conditions"],
    databaseId: "ecommerce",
    baseXp: 90,
    solutionQuery: "SELECT name, price, stock_quantity FROM products WHERE price > 10000 AND stock_quantity < 20;",
    hints: {
      level1: "İki koşulun aynı anda sağlanması için AND kullanılır.",
      level2: "WHERE kosul1 AND kosul2",
      level3: "SELECT name, price, stock_quantity FROM products WHERE price > 10000 AND stock_quantity < 20;",
    },
  },
  {
    id: "w2-c4",
    worldId: 2,
    order: 4,
    title: "Fiyat Aralığı Avı",
    subtitle: "BETWEEN Operatörü",
    story: "Orta segment bir reklam kampanyası için fiyatı 5.000 TL ile 20.000 TL (sınırlar dahil) arasındaki ürünlerin listesi isteniyor.",
    objective: "products tablosundan price değeri 5000 ile 20000 arasında olan ürünlerin adını (name) ve fiyatını (price) BETWEEN kullanarak listele.",
    difficulty: "medium",
    concepts: ["BETWEEN"],
    databaseId: "ecommerce",
    baseXp: 90,
    solutionQuery: "SELECT name, price FROM products WHERE price BETWEEN 5000 AND 20000;",
    hints: {
      level1: "Aralık filtrelemek için BETWEEN min AND max yapısı kullanılır.",
      level2: "WHERE price BETWEEN 5000 AND 20000",
      level3: "SELECT name, price FROM products WHERE price BETWEEN 5000 AND 20000;",
    },
  },
  {
    id: "w2-c5",
    worldId: 2,
    order: 5,
    title: "Hedef Şehirler Listesi",
    subtitle: "IN Operatörü",
    story: "Ege ve Akdeniz bölgesine özel lojistik indirimi başlıyor. Sadece 'Izmir', 'Antalya' ve 'Bursa' şehirlerindeki müşterileri hedeflemeliyiz.",
    objective: "customers tablosundan city değeri 'Izmir', 'Antalya' veya 'Bursa' olan müşterilerin first_name, last_name ve city kolonlarını IN kullanarak getir.",
    difficulty: "medium",
    concepts: ["IN", "List Matching"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT first_name, last_name, city FROM customers WHERE city IN ('Izmir', 'Antalya', 'Bursa');",
    hints: {
      level1: "Birden fazla değere eşitlik kontrolü için IN ('deger1', 'deger2') kullanılır.",
      level2: "WHERE city IN ('Izmir', 'Antalya', 'Bursa')",
      level3: "SELECT first_name, last_name, city FROM customers WHERE city IN ('Izmir', 'Antalya', 'Bursa');",
    },
  },
  {
    id: "w2-c6",
    worldId: 2,
    order: 6,
    title: "Apple Ürünlerini Bul",
    subtitle: "LIKE ve Joker Karakter (%)",
    story: "Teknik servis ekibi ismi 'Pro' kelimesi içeren tüm ürünleri incelemek istiyor.",
    objective: "products tablosundan adı (name) 'Pro' içeren tüm ürünlerin name ve price kolonlarını LIKE kullanarak listele.",
    difficulty: "medium",
    concepts: ["LIKE", "Wildcard %"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT name, price FROM products WHERE name LIKE '%Pro%';",
    hints: {
      level1: "Metin içinde geçen kelimeleri aramak için LIKE '%aranan%' kalıbı kullanılır.",
      level2: "WHERE name LIKE '%Pro%'",
      level3: "SELECT name, price FROM products WHERE name LIKE '%Pro%';",
    },
  },

  // ==========================================
  // WORLD 3: Sıralama ve Sonuç Kontrolü
  // ==========================================
  {
    id: "w3-c1",
    worldId: 3,
    order: 1,
    title: "En Pahalı 3 Ürün",
    subtitle: "ORDER BY DESC & LIMIT",
    story: "Ana sayfa vitrini için mağazanın en pahalı 3 amiral gemisi ürününü sergilemek istiyoruz.",
    objective: "products tablosundan name ve price kolonlarını, fiyata göre en yüksekten en düşüğe (azalan) sıralayarak ilk 3 tanesini getir.",
    difficulty: "easy",
    concepts: ["ORDER BY", "DESC", "LIMIT"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 90,
    solutionQuery: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    hints: {
      level1: "Büyükten küçüğe sıralamak için DESC, satır sayısını sınırlamak için LIMIT kullan.",
      level2: "ORDER BY price DESC LIMIT 3",
      level3: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    },
  },
  {
    id: "w3-c2",
    worldId: 3,
    order: 2,
    title: "Sayfalama: İkinci Sayfa Ürünleri",
    subtitle: "LIMIT & OFFSET ile Pagination",
    story: "Web sitesinde her sayfada 4 ürün listeleniyor. Kullanıcı 2. sayfaya geçtiğinde 5, 6, 7 ve 8. ürünleri göstermelisin.",
    objective: "products tablosundan id ve name kolonlarını id'ye göre artan (ASC) sırada sıralayarak ilk 4 ürünü atlayıp sonraki 4 ürünü (OFFSET 4 LIMIT 4) getir.",
    difficulty: "medium",
    concepts: ["LIMIT", "OFFSET", "Pagination"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 100,
    solutionQuery: "SELECT id, name FROM products ORDER BY id ASC LIMIT 4 OFFSET 4;",
    hints: {
      level1: "OFFSET belirli sayıda satırı atlar, LIMIT ise kaç satır alınacağını belirler.",
      level2: "ORDER BY id ASC LIMIT 4 OFFSET 4",
      level3: "SELECT id, name FROM products ORDER BY id ASC LIMIT 4 OFFSET 4;",
    },
  },

  // ==========================================
  // WORLD 4: SQL Fonksiyonları & Temizleme
  // ==========================================
  {
    id: "w4-c1",
    worldId: 4,
    order: 1,
    title: "Tam İsim Birleştirme ve Büyük Harf",
    subtitle: "CONCAT, UPPER ve LOWER",
    story: "Müşteri paneli için ad ve soyadı aralarında bir boşluk bırakarak tek bir 'full_name' kolonunda ve e-postayı küçük harflerle göstermeliyiz.",
    objective: "customers tablosundan first_name ve last_name'i birleştirip 'full_name', email kolonunu ise LOWER fonksiyonuyla 'clean_email' olarak listele.",
    difficulty: "medium",
    concepts: ["CONCAT", "LOWER", "String Functions"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email FROM customers;",
    hints: {
      level1: "Metinleri birleştirmek için CONCAT(a, ' ', b) kullanabilirsin.",
      level2: "CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email",
      level3: "SELECT CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email FROM customers;",
    },
  },
  {
    id: "w4-c2",
    worldId: 4,
    order: 2,
    title: "Fiyat Yuvarlama ve İndirim Simülasyonu",
    subtitle: "ROUND ve Matematiksel İfadeler",
    story: "Finans departmanı tüm ürünlerde %15 indirim yapıldığında oluşacak yeni fiyatları 2 ondalık basamağa yuvarlanmış olarak görmek istiyor.",
    objective: "products tablosundan name, price ve fiyata %15 indirim uygulayıp 2 basamağa yuvarlayan ROUND(price * 0.85, 2) AS discounted_price kolonunu listele.",
    difficulty: "medium",
    concepts: ["ROUND", "Math Operators"],
    databaseId: "ecommerce",
    baseXp: 110,
    solutionQuery: "SELECT name, price, ROUND(price * 0.85, 2) AS discounted_price FROM products;",
    hints: {
      level1: "Yuvarlama için ROUND(ifade, 2) fonksiyonunu kullan.",
      level2: "ROUND(price * 0.85, 2) AS discounted_price",
      level3: "SELECT name, price, ROUND(price * 0.85, 2) AS discounted_price FROM products;",
    },
  },

  // ==========================================
  // WORLD 5: Veri Özetleme & Aggregation
  // ==========================================
  {
    id: "w5-c1",
    worldId: 5,
    order: 1,
    title: "Finansal Metrikler: Ciro ve Ortalama",
    subtitle: "COUNT, SUM, AVG, MIN, MAX",
    story: "Şirket CEO'su yönetim kuruluna sunum yapacak. Tamamlanan siparişlerin toplam sayısını, toplam gelirini (SUM) ve ortalama sipariş tutarını (AVG) tek satırda istiyor.",
    objective: "orders tablosundaki tüm siparişler için toplam sipariş adedini 'total_orders', toplam tutarı 'total_revenue' ve ortalama tutarı 'avg_order_value' olarak hesapla.",
    difficulty: "medium",
    concepts: ["COUNT", "SUM", "AVG", "Aggregate Functions"],
    databaseId: "ecommerce",
    baseXp: 110,
    solutionQuery: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
    hints: {
      level1: "COUNT(*), SUM(total_amount) ve AVG(total_amount) fonksiyonlarını tek bir SELECT içinde yaz.",
      level2: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
      level3: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
    },
  },

  // ==========================================
  // WORLD 6: Gruplama ve Koşullar (GROUP BY)
  // ==========================================
  {
    id: "w6-c1",
    worldId: 6,
    order: 1,
    title: "Şehir Bazında Müşteri Dağılımı",
    subtitle: "GROUP BY ve COUNT",
    story: "Pazarlama stratejisi belirlemek amacıyla her şehirde kaç kayıtlı müşterimiz olduğunu öğrenmek istiyoruz.",
    objective: "customers tablosunda her city için müşteri sayısını (COUNT(*) AS customer_count) hesapla. Sonuçları müşteri sayısına göre çoktan aza (DESC) sırala.",
    difficulty: "medium",
    concepts: ["GROUP BY", "COUNT", "ORDER BY"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 120,
    solutionQuery: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
    hints: {
      level1: "Gruplama yapmak için sorgunun sonuna GROUP BY city ekle.",
      level2: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
      level3: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
    },
  },
  {
    id: "w6-c2",
    worldId: 6,
    order: 2,
    title: "Popüler Şehirleri Filtrele",
    subtitle: "HAVING Koşulu",
    story: "Sadece 2 veya daha fazla müşteriye sahip olan büyük şehirleri raporlamamız gerekiyor.",
    objective: "customers tablosunda müşteri sayısı >= 2 olan şehirleri ve müşteri sayılarını (customer_count) HAVING kullanarak listele.",
    difficulty: "medium",
    concepts: ["GROUP BY", "HAVING"],
    databaseId: "ecommerce",
    baseXp: 130,
    solutionQuery: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city HAVING COUNT(*) >= 2;",
    hints: {
      level1: "Gruplanmış verilerde filtreleme yapmak için WHERE değil, HAVING kullanılır.",
      level2: "GROUP BY city HAVING COUNT(*) >= 2",
      level3: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city HAVING COUNT(*) >= 2;",
    },
  },

  // ==========================================
  // WORLD 7: JOIN Krallığı
  // ==========================================
  {
    id: "w7-c1",
    worldId: 7,
    order: 1,
    title: "Müşteri ve Siparişlerini Eşleştir",
    subtitle: "INNER JOIN",
    story: "Sipariş veren müşterilerin adlarını ve verdikleri siparişlerin tutarlarını tek bir raporda birleştirmemiz gerekiyor.",
    objective: "customers ve orders tablolarını customer_id üzerinden INNER JOIN ile bağla. Çıktıda customers.first_name, customers.last_name, orders.id AS order_id ve orders.total_amount kolonlarını listele.",
    difficulty: "medium",
    concepts: ["INNER JOIN", "ON Clause", "Table Linking"],
    databaseId: "ecommerce",
    baseXp: 140,
    solutionQuery: `SELECT customers.first_name, customers.last_name, orders.id AS order_id, orders.total_amount
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;`,
    hints: {
      level1: "customers tablosu ile orders tablosunu customers.id = orders.customer_id şartıyla bağla.",
      level2: "FROM customers INNER JOIN orders ON customers.id = orders.customer_id",
      level3: `SELECT customers.first_name, customers.last_name, orders.id AS order_id, orders.total_amount
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;`,
    },
  },
  {
    id: "w7-c2",
    worldId: 7,
    order: 2,
    title: "Hiç Sipariş Vermeyenleri de Gör",
    subtitle: "LEFT JOIN",
    story: "Müşteri ilişkileri ekibi tüm müşterilerin durumunu görmek istiyor. Siparişi olanların sipariş tutarı gelsin, hiç sipariş vermemiş olanların karşısında ise NULL görünsün.",
    objective: "customers tablosunu orders tablosuyla LEFT JOIN yaparak bağla. first_name, last_name, email ve orders.total_amount kolonlarını listele.",
    difficulty: "medium",
    concepts: ["LEFT JOIN", "NULL Preservation"],
    databaseId: "ecommerce",
    baseXp: 150,
    solutionQuery: `SELECT customers.first_name, customers.last_name, customers.email, orders.total_amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;`,
    hints: {
      level1: "Sol tablodaki (customers) tüm kayıtları korumak için LEFT JOIN kullanılır.",
      level2: "FROM customers LEFT JOIN orders ON customers.id = orders.customer_id",
      level3: `SELECT customers.first_name, customers.last_name, customers.email, orders.total_amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;`,
    },
  },
  {
    id: "w7-c3",
    worldId: 7,
    order: 3,
    title: "Ürün ve Kategori Raporu",
    subtitle: "3 Tablolu Zincirleme JOIN",
    story: "Detaylı sipariş analizi için hangi siparişte hangi ürünün hangi kategoride olduğunu gösteren uçtan uca bir rapor hazırlamalısın.",
    objective: "orders, order_items, products ve categories tablolarını bağla. orders.id AS order_id, products.name AS product_name, categories.name AS category_name, order_items.quantity kolonlarını listele.",
    difficulty: "hard",
    concepts: ["Multi-table JOIN", "INNER JOIN Chain"],
    databaseId: "ecommerce",
    baseXp: 175,
    solutionQuery: `SELECT orders.id AS order_id, products.name AS product_name, categories.name AS category_name, order_items.quantity
FROM orders
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id
INNER JOIN categories ON products.category_id = categories.id;`,
    hints: {
      level1: "Sırayla orders -> order_items -> products -> categories tablolarını INNER JOIN ile zincirle.",
      level2: "orders.id = order_items.order_id AND order_items.product_id = products.id AND products.category_id = categories.id",
      level3: `SELECT orders.id AS order_id, products.name AS product_name, categories.name AS category_name, order_items.quantity
FROM orders
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id
INNER JOIN categories ON products.category_id = categories.id;`,
    },
  },

  // ==========================================
  // WORLD 8: CASE WHEN
  // ==========================================
  {
    id: "w8-c1",
    worldId: 8,
    order: 1,
    title: "Ürün Fiyat Segmentasyonu",
    subtitle: "CASE WHEN Mantığı",
    story: "Kullanıcı deneyimi için ürünleri fiyatlarına göre 'Premium' (>= 40000), 'Mid-Range' (>= 10000) ve 'Budget' (< 10000) olarak etiketlememiz gerekiyor.",
    objective: "products tablosundan name, price kolonlarını ve bu koşullara göre oluşturulan 'price_tier' kolonunu getir.",
    difficulty: "medium",
    concepts: ["CASE WHEN", "THEN", "ELSE", "END"],
    databaseId: "ecommerce",
    baseXp: 140,
    solutionQuery: `SELECT name, price,
  CASE
    WHEN price >= 40000 THEN 'Premium'
    WHEN price >= 10000 THEN 'Mid-Range'
    ELSE 'Budget'
  END AS price_tier
FROM products;`,
    hints: {
      level1: "CASE WHEN kosul1 THEN 'deger1' WHEN kosul2 THEN 'deger2' ELSE 'deger3' END AS price_tier kalıbını kullan.",
      level2: "WHEN price >= 40000 THEN 'Premium' WHEN price >= 10000 THEN 'Mid-Range' ELSE 'Budget'",
      level3: `SELECT name, price,
  CASE
    WHEN price >= 40000 THEN 'Premium'
    WHEN price >= 10000 THEN 'Mid-Range'
    ELSE 'Budget'
  END AS price_tier
FROM products;`,
    },
  },

  // ==========================================
  // WORLD 9: Subqueries
  // ==========================================
  {
    id: "w9-c1",
    worldId: 9,
    order: 1,
    title: "Ortalamanın Üzerindeki Ürünler",
    subtitle: "Scalar Subquery",
    story: "Piyasa analistimiz mağazadaki genel ortalama fiyatın üzerinde kalan tüm ürünleri merak ediyor.",
    objective: "products tablosundan price değeri mağazanın ortalama ürün fiyatından (SELECT AVG(price) FROM products) yüksek olan ürünlerin name ve price kolonlarını listele.",
    difficulty: "medium",
    concepts: ["Scalar Subquery", "WHERE Subquery"],
    databaseId: "ecommerce",
    baseXp: 150,
    solutionQuery: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
    hints: {
      level1: "WHERE price > (SELECT AVG(price) FROM products) yapısını kur.",
      level2: "İçteki sorgu tüm ürünlerin ortalama fiyatını döner.",
      level3: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
    },
  },

  // ==========================================
  // WORLD 10: SET Operations (UNION, INTERSECT)
  // ==========================================
  {
    id: "w10-c1",
    worldId: 10,
    order: 1,
    title: "Banka ve E-Ticaret Müşteri Havuzunu Birleştir",
    subtitle: "UNION ile Küme Birleştirme",
    story: "Global bir şirket birleşmesi sonrası iki farklı veri kaynağındaki ülkeleri tek bir benzersiz listede toplamak istiyoruz.",
    objective: "customers tablosundaki country kolonunu ve 'Germany' değerini UNION ile birleştirerek benzersiz ülke listesini getir.",
    difficulty: "medium",
    concepts: ["UNION", "Set Operations"],
    databaseId: "ecommerce",
    baseXp: 160,
    solutionQuery: "SELECT country FROM customers UNION SELECT 'Germany' AS country;",
    hints: {
      level1: "SELECT country FROM customers UNION SELECT 'Germany' AS country; yapısını kullan.",
      level2: "UNION iki sorgunun sonuçlarını dikey olarak birleştirir ve tekilleştirir.",
      level3: "SELECT country FROM customers UNION SELECT 'Germany' AS country;",
    },
  },

  // ==========================================
  // WORLD 11: Date & Time Analitiği
  // ==========================================
  {
    id: "w11-c1",
    worldId: 11,
    order: 1,
    title: "Aylık Sipariş Hacmi Analizi",
    subtitle: "DATE_TRUNC & EXTRACT",
    story: "Finans direktörü 2024 yılındaki siparişlerin ay bazında dağılımını incelemek istiyor.",
    objective: "orders tablosunda DATE_TRUNC('month', order_date) AS order_month bazında gruplama yaparak her ay için sipariş adedini (COUNT(*) AS order_count) hesapla ve order_month'a göre sırala.",
    difficulty: "hard",
    concepts: ["DATE_TRUNC", "Date Functions", "Time Series"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 170,
    solutionQuery: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
    hints: {
      level1: "DATE_TRUNC('month', order_date) fonksiyonunu hem SELECT hem de GROUP BY kısmına ekle.",
      level2: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
      level3: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
    },
  },

  // ==========================================
  // WORLD 12: CTE (WITH)
  // ==========================================
  {
    id: "w12-c1",
    worldId: 12,
    order: 1,
    title: "CTE ile Müşteri Harcama Analizi",
    subtitle: "WITH Clause",
    story: "Karmaşık sorguları temiz yazmak için CTE (Common Table Expression) kullan. Müşteri bazında toplam harcamayı hesaplayan bir CTE oluşturup, toplam harcaması 50.000 TL'den fazla olan müşterileri çek.",
    objective: "WITH customer_spending AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) CTE'si oluşturup, total_spent > 50000 olan müşteri ID ve harcamalarını getir.",
    difficulty: "hard",
    concepts: ["CTE", "WITH", "Modular SQL"],
    databaseId: "ecommerce",
    baseXp: 180,
    solutionQuery: `WITH customer_spending AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, total_spent
FROM customer_spending
WHERE total_spent > 50000;`,
    hints: {
      level1: "WITH cte_name AS (...) SELECT ... FROM cte_name yapısını kullan.",
      level2: "Önce müşteri ID ve toplam tutarı grupla, ardından bu geçici tablodan > 50000 olanları filtrele.",
      level3: `WITH customer_spending AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT customer_id, total_spent
FROM customer_spending
WHERE total_spent > 50000;`,
    },
  },

  // ==========================================
  // WORLD 13: Window Functions
  // ==========================================
  {
    id: "w13-c1",
    worldId: 13,
    order: 1,
    title: "Kategori İçi Fiyat Sıralaması",
    subtitle: "DENSE_RANK() & PARTITION BY",
    story: "Her ürün kategorisi içinde, ürünlerin en pahalıdan en ucuza sıralamasını (rank) hesaplamak istiyoruz.",
    objective: "products tablosundan name, category_id, price ve kategori bazında fiyata göre azalan sıralama yapan DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS price_rank kolonunu listele.",
    difficulty: "hard",
    concepts: ["Window Functions", "DENSE_RANK", "PARTITION BY", "OVER"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 200,
    solutionQuery: `SELECT name, category_id, price,
  DENSE_RANK() OVER (
    PARTITION BY category_id
    ORDER BY price DESC
  ) AS price_rank
FROM products
ORDER BY category_id, price_rank;`,
    hints: {
      level1: "DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) ifadesini kullan.",
      level2: "PARTITION BY her kategoriyi bağımsız bir pencere olarak ele alır.",
      level3: `SELECT name, category_id, price,
  DENSE_RANK() OVER (
    PARTITION BY category_id
    ORDER BY price DESC
  ) AS price_rank
FROM products
ORDER BY category_id, price_rank;`,
    },
  },

  // ==========================================
  // WORLD 14: İleri Seviye Veri Analitiği (LAG & Kümülatif)
  // ==========================================
  {
    id: "w14-c1",
    worldId: 14,
    order: 1,
    title: "Sipariş Akışında Kümülatif Gelir (Running Total)",
    subtitle: "SUM() OVER (ORDER BY)",
    story: "Mali analist siparişlerin kronolojik akışında kasanın toplam bakiyesinin nasıl büyüdüğünü (kümülatif toplam) görmek istiyor.",
    objective: "orders tablosundan id, order_date, total_amount ve sipariş tarihine göre kümülatif toplam alan SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total kolonunu listele.",
    difficulty: "hard",
    concepts: ["Running Total", "SUM OVER", "Cumulative Analytics"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 220,
    solutionQuery: `SELECT id, order_date, total_amount,
  SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total
FROM orders
ORDER BY order_date, id;`,
    hints: {
      level1: "SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total yapısını kur.",
      level2: "Pencere fonksiyonu satır satır kümülatif toplam hesaplar.",
      level3: `SELECT id, order_date, total_amount,
  SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total
FROM orders
ORDER BY order_date, id;`,
    },
  },

  // ==========================================
  // WORLD 15: Boss Fight Soruşturmaları
  // ==========================================
  {
    id: "w15-c1",
    worldId: 15,
    order: 1,
    title: "BOSS FIGHT: Şüpheli Finansal Vurgun",
    subtitle: "SafeBank Fraud Detection Investigation",
    story: "ALARM! SafeBank siber güvenlik radarına gece saatlerinde yapılan şüpheli para transferleri takıldı. Güvenlik şefi senden acil soruşturma talep ediyor: Gece 02:00 ile 04:00 arasında gerçekleşen ve tek seferde 150.000 TL'den fazla olan transferleri gönderen hesabın sahibi olan kullanıcıyı, transfer tutarını ve hedef hesabı bul!",
    objective: "fintech veritabanında transactions, accounts ve users tablolarını birleştirerek; amount >= 150000 olan ve created_at saat aralığı gece olan transferlerin users.full_name, transactions.from_account_id, transactions.to_account_id, transactions.amount, transactions.created_at kolonlarını listele.",
    difficulty: "boss",
    concepts: ["Multi-Table Join", "Financial Forensics", "Complex Filtering", "Boss Clearance"],
    databaseId: "fintech",
    baseXp: 500,
    solutionQuery: `SELECT users.full_name, t.from_account_id, t.to_account_id, t.amount, t.created_at
FROM transactions t
INNER JOIN accounts a ON t.from_account_id = a.id
INNER JOIN users ON a.user_id = users.id
WHERE t.amount >= 150000
ORDER BY t.created_at;`,
    hints: {
      level1: "transactions tablosundaki from_account_id üzerinden accounts tablosuna, oradan da users tablosuna bağlanmalısın.",
      level2: "WHERE t.amount >= 150000 koşulunu uygula.",
      level3: `SELECT users.full_name, t.from_account_id, t.to_account_id, t.amount, t.created_at
FROM transactions t
INNER JOIN accounts a ON t.from_account_id = a.id
INNER JOIN users ON a.user_id = users.id
WHERE t.amount >= 150000
ORDER BY t.created_at;`,
    },
    learningNotes: "Tebrikler Dedektif! Şüpheli transferlerin Volkan Demirtaş ve Hakan Güler hesaplarından çıktığını tespit ettin.",
  },
  {
    id: "w15-c2",
    worldId: 15,
    order: 2,
    title: "BOSS FIGHT: SQL Cinayet Soruşturması",
    subtitle: "Grand Cyber Plaza Cinayeti",
    story: "Olay Yeri İnceleme Tutanakları incelendiğinde katilin: Siyah saçlı ('black'), boyu 180 cm veya üzeri, ve olay gecesi 'Parking B2' otopark turnikesinden 22:00 sonrası giriş yapmış bir şüpheli olduğu belirlendi. Katili tespit et!",
    objective: "murder_mystery veritabanında suspects ve security_logs tablolarını bağlayarak, boyu >= 180, saç rengi 'black' olan ve 'Parking B2' noktasından geçen şüphelinin adını (name), mesleğini (occupation) ve plakasını (plate_number) getir.",
    difficulty: "boss",
    concepts: ["Detective Forensics", "INNER JOIN", "Multi-condition WHERE", "Murder Mystery Solve"],
    databaseId: "murder_mystery",
    baseXp: 500,
    solutionQuery: `SELECT s.name, s.occupation, s.plate_number
FROM suspects s
INNER JOIN security_logs log ON s.id = log.suspect_id
WHERE s.hair_color = 'black'
  AND s.height_cm >= 180
  AND log.checkpoint = 'Parking B2';`,
    hints: {
      level1: "suspects ile security_logs tablosunu s.id = log.suspect_id ile birleştir.",
      level2: "WHERE s.hair_color = 'black' AND s.height_cm >= 180 AND log.checkpoint = 'Parking B2'",
      level3: `SELECT s.name, s.occupation, s.plate_number
FROM suspects s
INNER JOIN security_logs log ON s.id = log.suspect_id
WHERE s.hair_color = 'black'
  AND s.height_cm >= 180
  AND log.checkpoint = 'Parking B2';`,
    },
    learningNotes: "Vaka Çözüldü! Katil System Admin Tarik Menguc çıktı. Plakası: 34 HCK 999.",
  },
];
