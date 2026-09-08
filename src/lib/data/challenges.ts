import { Challenge } from "@/types";

export const CHALLENGES: Challenge[] = [
  // ==========================================
  // WORLD 1: Temel Veri Sorgulama & Projeksiyon
  // ==========================================
  {
    id: "w1-c1",
    worldId: 1,
    order: 1,
    title: "Müşteri Kayıt Havuzu Dökümü",
    subtitle: "Tüm müşteri profil kayıtlarını sorgulama",
    story: "TechStore veri altyapısında kullanıcı tabanı migrasyonu yürütülüyor. Veri kalitesi ve eksiklik kontrolleri için sistemdeki tüm müşteri profillerinin eksiksiz dökümü talep edilmektedir.",
    objective: "customers tablosundaki tüm sütun ve satırları listeleyen temel bir sorgu yürütün.",
    difficulty: "easy",
    concepts: ["SELECT", "FROM", "SELECT *"],
    databaseId: "ecommerce",
    baseXp: 50,
    solutionQuery: "SELECT * FROM customers;",
    hints: {
      level1: "Bir tablodaki tüm sütunları eksiksiz listelemek için SELECT yanına asterisk (*) sembolü yerleştirilir.",
      level2: "SELECT * FROM [tablo_adi]; yapısını kullanmalısınız.",
      level3: "SELECT * FROM customers;",
    },
    learningNotes: "SELECT * ifadesi tablodaki tüm sütunları getirir. FROM yan tümcesi ise sorgulanacak hedef veri kümesini belirler.",
  },
  {
    id: "w1-c2",
    worldId: 1,
    order: 2,
    title: "E-Posta Kampanya Segmentasyonu",
    subtitle: "Hedef sütun projeksiyonu",
    story: "Pazarlama otomasyonu için e-posta gönderim listesi hazırlanıyor. Ağ ve bellek tüketimini optimize etmek adına yalnızca ad, soyad ve e-posta adreslerini içeren veri seti talep edilmektedir.",
    objective: "customers tablosundan first_name, last_name ve email sütunlarını getirin.",
    difficulty: "easy",
    concepts: ["SELECT Specific Columns"],
    databaseId: "ecommerce",
    baseXp: 50,
    solutionQuery: "SELECT first_name, last_name, email FROM customers;",
    hints: {
      level1: "Hedef sütun isimlerini aralarına virgül koyarak SELECT yanına ekleyin.",
      level2: "SELECT sutun1, sutun2, sutun3 FROM tablo_adi;",
      level3: "SELECT first_name, last_name, email FROM customers;",
    },
  },
  {
    id: "w1-c3",
    worldId: 1,
    order: 3,
    title: "Envanter Raporu & Kolon Başlıkları",
    subtitle: "Sütun Takma Adları (Column Alias / AS)",
    story: "Finans ve operasyon departmanına sunulacak ürün envanteri raporunda standart yerel başlıklar talep edilmektedir. Ürün adı ve birim fiyat sütunlarını kurumsal raporlama formatına uygun takma adlarla (alias) projelendirin.",
    objective: "products tablosundan name sütununu 'urun_adi', price sütununu 'fiyat' takma adıyla (AS) listeleyin.",
    difficulty: "easy",
    concepts: ["Column Alias", "AS"],
    databaseId: "ecommerce",
    baseXp: 60,
    solutionQuery: "SELECT name AS urun_adi, price AS fiyat FROM products;",
    hints: {
      level1: "Sorgu çıktısındaki sütun başlığını yeniden adlandırmak için AS anahtar sözcüğünü kullanın.",
      level2: "SELECT sutun AS yeni_ad FROM tablo;",
      level3: "SELECT name AS urun_adi, price AS fiyat FROM products;",
    },
  },
  {
    id: "w1-c4",
    worldId: 1,
    order: 4,
    title: "Lojistik Ağı: Benzersiz Şehir Dağılımı",
    subtitle: "DISTINCT ile mükerrer kayıtları ayıklama",
    story: "Lojistik ve kargo planlama departmanı, operasyonun aktif olduğu teslimat lokasyonlarını belirlemek istiyor. Şehir listesinde yinelenen kayıtların filtrelenmesi gerekmektedir.",
    objective: "customers tablosundaki tekil (DISTINCT) şehirleri (city) listeleyin.",
    difficulty: "easy",
    concepts: ["DISTINCT"],
    databaseId: "ecommerce",
    baseXp: 70,
    solutionQuery: "SELECT DISTINCT city FROM customers;",
    hints: {
      level1: "Sonuç kümesindeki mükerrer satırları tekilleştirmek için SELECT ifadesinden hemen sonra DISTINCT kullanılır.",
      level2: "SELECT DISTINCT sutun_adi FROM tablo_adi;",
      level3: "SELECT DISTINCT city FROM customers;",
    },
  },

  // ==========================================
  // WORLD 2: Koşullu Filtreleme & Mantıksal İfadeler
  // ==========================================
  {
    id: "w2-c1",
    worldId: 2,
    order: 1,
    title: "Yüksek Değerli Envanter Filtresi",
    subtitle: "WHERE ve Sayısal Karşılaştırma (>)",
    story: "Envanter ve sigorta değerlendirmesi: Birim satış fiyatı 20.000 TL üzerinde olan yüksek değerli ürünlerin listesi talep edilmektedir.",
    objective: "products tablosundan price değeri 20000'den büyük olan tüm ürünleri (SELECT *) listeleyin.",
    difficulty: "easy",
    concepts: ["WHERE", ">"],
    databaseId: "ecommerce",
    baseXp: 80,
    solutionQuery: "SELECT * FROM products WHERE price > 20000;",
    hints: {
      level1: "Satır bazında koşul belirtmek için WHERE yan tümcesi kullanılır.",
      level2: "SELECT * FROM products WHERE price > ...;",
      level3: "SELECT * FROM products WHERE price > 20000;",
    },
  },
  {
    id: "w2-c2",
    worldId: 2,
    order: 2,
    title: "Bölgesel Kullanıcı Filtresi: İstanbul",
    subtitle: "WHERE ile Metin Karşılaştırması (=)",
    story: "Marmara Bölgesi lojistik merkezi açılışı için İstanbul lokasyonundaki kayıtlı kullanıcı profillerinin iletişim listesi talep edilmektedir.",
    objective: "customers tablosundan city değeri 'Istanbul' olan kullanıcıların first_name, last_name ve email bilgilerini getirin.",
    difficulty: "easy",
    concepts: ["WHERE", "Text Filtering", "Single Quotes"],
    databaseId: "ecommerce",
    baseXp: 80,
    solutionQuery: "SELECT first_name, last_name, email FROM customers WHERE city = 'Istanbul';",
    hints: {
      level1: "SQL'de metin (string) filtreleri tek tırnak ('...') içinde tanımlanır.",
      level2: "WHERE city = 'Istanbul'",
      level3: "SELECT first_name, last_name, email FROM customers WHERE city = 'Istanbul';",
    },
  },
  {
    id: "w2-c3",
    worldId: 2,
    order: 3,
    title: "Kritik Stok & Değer Eşiği Uyarısı",
    subtitle: "AND Mantıksal Operatörü ile Çoklu Koşul",
    story: "Tedarik zinciri risk yönetimi: Birim fiyatı 10.000 TL üzerinde olup stok adedi kritik eşiğin (20 adet altı) altına inen ürünlerin tespit edilmesi gerekmektedir.",
    objective: "products tablosunda price > 10000 VE stock_quantity < 20 koşulunu sağlayan ürünlerin name, price ve stock_quantity sütunlarını listeleyin.",
    difficulty: "medium",
    concepts: ["WHERE", "AND", "Multiple Conditions"],
    databaseId: "ecommerce",
    baseXp: 90,
    solutionQuery: "SELECT name, price, stock_quantity FROM products WHERE price > 10000 AND stock_quantity < 20;",
    hints: {
      level1: "Her iki filtreleme koşulunun da aynı anda geçerli olması için araya AND operatörü ekleyin.",
      level2: "WHERE kosul1 AND kosul2",
      level3: "SELECT name, price, stock_quantity FROM products WHERE price > 10000 AND stock_quantity < 20;",
    },
  },
  {
    id: "w2-c4",
    worldId: 2,
    order: 4,
    title: "Orta Segment Fiyat Bandı Analizi",
    subtitle: "BETWEEN ile Aralık Belirleme",
    story: "Fiyat elastikiyeti araştırması: 5.000 TL ile 20.000 TL aralığında (sınırlar dahil) konumlanan ürün portföyünün dökümü istenmektedir.",
    objective: "products tablosundan price değeri 5000 ile 20000 arasında olan ürünlerin adını (name) ve fiyatını (price) BETWEEN kullanarak listeleyin.",
    difficulty: "medium",
    concepts: ["BETWEEN"],
    databaseId: "ecommerce",
    baseXp: 90,
    solutionQuery: "SELECT name, price FROM products WHERE price BETWEEN 5000 AND 20000;",
    hints: {
      level1: "Kapalı aralık sorgularında BETWEEN min AND max sözdizimi kullanılır.",
      level2: "WHERE price BETWEEN 5000 AND 20000",
      level3: "SELECT name, price FROM products WHERE price BETWEEN 5000 AND 20000;",
    },
  },
  {
    id: "w2-c5",
    worldId: 2,
    order: 5,
    title: "Bölgesel Sevkiyat Dağıtım Listesi",
    subtitle: "IN Operatörü ile Liste Eşleştirme",
    story: "Bölgesel sevkiyat optimizasyonu: Ege ve Akdeniz dağıtım hatları için yalnızca İzmir, Antalya ve Bursa lokasyonundaki müşterilerin adres profilleri hedeflenmektedir.",
    objective: "customers tablosundan city değeri 'Izmir', 'Antalya' veya 'Bursa' olan müşterilerin first_name, last_name ve city sütunlarını IN kullanarak getirin.",
    difficulty: "medium",
    concepts: ["IN", "List Matching"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT first_name, last_name, city FROM customers WHERE city IN ('Izmir', 'Antalya', 'Bursa');",
    hints: {
      level1: "Birden çok olası değeri tek bir koşulda eşleştirmek için IN ('deger1', 'deger2') yapısı kullanılır.",
      level2: "WHERE city IN ('Izmir', 'Antalya', 'Bursa')",
      level3: "SELECT first_name, last_name, city FROM customers WHERE city IN ('Izmir', 'Antalya', 'Bursa');",
    },
  },
  {
    id: "w2-c6",
    worldId: 2,
    order: 6,
    title: "Model Adı Deseni: 'Pro' Segmenti",
    subtitle: "LIKE Operatörü ve Joker Karakter (%)",
    story: "Katalog incelemesi: Ürün adında 'Pro' ibaresi geçen tüm profesyonel donanım ve yazılım modellerinin fiyatlandırma dökümü gerekmektedir.",
    objective: "products tablosundan adı (name) 'Pro' metnini içeren ürünlerin name ve price sütunlarını LIKE kullanarak listeleyin.",
    difficulty: "medium",
    concepts: ["LIKE", "Wildcard %"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT name, price FROM products WHERE name LIKE '%Pro%';",
    hints: {
      level1: "Metin içinde herhangi bir konumda geçen deseni bulmak için LIKE '%ifade%' yapısını kullanın.",
      level2: "WHERE name LIKE '%Pro%'",
      level3: "SELECT name, price FROM products WHERE name LIKE '%Pro%';",
    },
  },

  // ==========================================
  // WORLD 3: Sıralama & Sayfalama Mimarisi
  // ==========================================
  {
    id: "w3-c1",
    worldId: 3,
    order: 1,
    title: "En Yüksek Fiyatlı Varlıklar",
    subtitle: "ORDER BY DESC & LIMIT ile Üst Segment",
    story: "Finansal özet vitrini: Envanterde kayıtlı en yüksek birim fiyatlı ilk 3 ürünün azalan sırada listesi istenmektedir.",
    objective: "products tablosundan name ve price sütunlarını, fiyata göre en yüksekten en düşüğe (azalan/DESC) sıralayarak ilk 3 kaydı getirin.",
    difficulty: "easy",
    concepts: ["ORDER BY", "DESC", "LIMIT"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 90,
    solutionQuery: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    hints: {
      level1: "Büyükten küçüğe sıralama için DESC, dönen satır adedini kısıtlamak için LIMIT kullanın.",
      level2: "ORDER BY price DESC LIMIT 3",
      level3: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    },
  },
  {
    id: "w3-c2",
    worldId: 3,
    order: 2,
    title: "Sorgu Sonucu Sayfalama (Pagination)",
    subtitle: "LIMIT & OFFSET ile Veri Dilimleme",
    story: "Arayüz optimizasyonu: Sayfa başına 4 kayıt gösteren bir veri akışında, 2. sayfaya tekabül eden 5, 6, 7 ve 8. ürünlerin sorgulanması gerekmektedir.",
    objective: "products tablosundan id ve name sütunlarını id'ye göre artan (ASC) sırada sıralayarak ilk 4 ürünü atlayıp sonraki 4 kaydı (OFFSET 4 LIMIT 4) getirin.",
    difficulty: "medium",
    concepts: ["LIMIT", "OFFSET", "Pagination"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 100,
    solutionQuery: "SELECT id, name FROM products ORDER BY id ASC LIMIT 4 OFFSET 4;",
    hints: {
      level1: "OFFSET belirtilen satır adedini atlar, LIMIT ise kaç satırın seçileceğini belirler.",
      level2: "ORDER BY id ASC LIMIT 4 OFFSET 4",
      level3: "SELECT id, name FROM products ORDER BY id ASC LIMIT 4 OFFSET 4;",
    },
  },

  // ==========================================
  // WORLD 4: Skaler Fonksiyonlar & Veri Temizleme
  // ==========================================
  {
    id: "w4-c1",
    worldId: 4,
    order: 1,
    title: "Profil Normalizasyonu & Adres Formatı",
    subtitle: "CONCAT ve LOWER ile Metin Standartlaştırma",
    story: "Kullanıcı veri tabanı entegrasyonu: Dağınık ad ve soyad alanlarını tek bir 'full_name' sütununda birleştirip, e-posta adreslerini küçük harfe normalize edin.",
    objective: "customers tablosundan first_name ve last_name'i aralarında bir boşlukla birleştirip 'full_name', email sütununu ise LOWER fonksiyonuyla 'clean_email' olarak listeleyin.",
    difficulty: "medium",
    concepts: ["CONCAT", "LOWER", "String Functions"],
    databaseId: "ecommerce",
    baseXp: 100,
    solutionQuery: "SELECT CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email FROM customers;",
    hints: {
      level1: "Metin birleştirme için CONCAT(a, ' ', b) fonksiyonu kullanılır.",
      level2: "CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email",
      level3: "SELECT CONCAT(first_name, ' ', last_name) AS full_name, LOWER(email) AS clean_email FROM customers;",
    },
  },
  {
    id: "w4-c2",
    worldId: 4,
    order: 2,
    title: "Finansal Simülasyon: İskonto Uygulaması",
    subtitle: "ROUND ve Aritmetik İfadeler",
    story: "Fiyatlandırma politikası simülasyonu: Tüm ürünlere %15 indirim uygulandığında oluşacak birim tutarları muhasebe standardı gereği 2 ondalık basamağa yuvarlayarak raporlayın.",
    objective: "products tablosundan name, price ve fiyata %15 indirim uygulayıp 2 basamağa yuvarlayan ROUND(price * 0.85, 2) AS discounted_price sütununu listeleyin.",
    difficulty: "medium",
    concepts: ["ROUND", "Math Operators"],
    databaseId: "ecommerce",
    baseXp: 110,
    solutionQuery: "SELECT name, price, ROUND(price * 0.85, 2) AS discounted_price FROM products;",
    hints: {
      level1: "Sayısal yuvarlama için ROUND(ifade, 2) fonksiyonu kullanılır.",
      level2: "ROUND(price * 0.85, 2) AS discounted_price",
      level3: "SELECT name, price, ROUND(price * 0.85, 2) AS discounted_price FROM products;",
    },
  },

  // ==========================================
  // WORLD 5: Agregasyon & Metrik Modelleme
  // ==========================================
  {
    id: "w5-c1",
    worldId: 5,
    order: 1,
    title: "Yönetici Özeti: Toplam Hacim & Ciro",
    subtitle: "COUNT, SUM, AVG ile Makro Metrikler",
    story: "Üst yönetim performans raporlaması: Sistem genelindeki tamamlanmış siparişlerin adedi, toplam işlem hacmi ve ortalama sepet büyüklüğü tek bir konsolide satırda talep edilmektedir.",
    objective: "orders tablosundaki tüm siparişler için toplam sipariş adedini 'total_orders', toplam işlem tutarını 'total_revenue' ve ortalama sipariş tutarını 'avg_order_value' olarak hesaplayın.",
    difficulty: "medium",
    concepts: ["COUNT", "SUM", "AVG", "Aggregate Functions"],
    databaseId: "ecommerce",
    baseXp: 110,
    solutionQuery: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
    hints: {
      level1: "COUNT(*), SUM(total_amount) ve AVG(total_amount) fonksiyonlarını tek bir SELECT projeksiyonunda çalıştırın.",
      level2: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
      level3: "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS avg_order_value FROM orders;",
    },
  },

  // ==========================================
  // WORLD 6: Kümeler, Gruplama & Koşullar (GROUP BY)
  // ==========================================
  {
    id: "w6-c1",
    worldId: 6,
    order: 1,
    title: "Bölgesel Müşteri Yoğunluğu Dağılımı",
    subtitle: "GROUP BY ve COUNT Agregasyonu",
    story: "Pazar dağılımı analizi: Müşteri tabanının şehirlere göre yoğunluğunu belirlemek amacıyla her şehirdeki kayıtlı kullanıcı adedini hesaplayıp sıralayın.",
    objective: "customers tablosunda her city için müşteri sayısını (COUNT(*) AS customer_count) hesaplayın. Sonuçları müşteri adedine göre azalan (DESC) sırada listeleyin.",
    difficulty: "medium",
    concepts: ["GROUP BY", "COUNT", "ORDER BY"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 120,
    solutionQuery: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
    hints: {
      level1: "Kayıtları şehirlere göre kümelemek için GROUP BY city yan tümcesini kullanın.",
      level2: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
      level3: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC;",
    },
  },
  {
    id: "w6-c2",
    worldId: 6,
    order: 2,
    title: "Büyük Lokasyon Eşiği Filtresi",
    subtitle: "HAVING ile Agregasyon Koşulu",
    story: "Bölge müdürlüğü kurulum fizibilitesi: Sistemde en az 2 veya daha fazla kayıtlı müşteriye sahip olan şehirlerin listesini çıkarın.",
    objective: "customers tablosunda müşteri sayısı >= 2 olan şehirleri ve müşteri sayılarını (customer_count) HAVING kullanarak listeleyin.",
    difficulty: "medium",
    concepts: ["GROUP BY", "HAVING"],
    databaseId: "ecommerce",
    baseXp: 130,
    solutionQuery: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city HAVING COUNT(*) >= 2;",
    hints: {
      level1: "Agregasyon (özetleme) sonuçlarını filtrelemek için WHERE yerine HAVING kullanılır.",
      level2: "GROUP BY city HAVING COUNT(*) >= 2",
      level3: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city HAVING COUNT(*) >= 2;",
    },
  },

  // ==========================================
  // WORLD 7: İlişkisel Modelleme & Tablo Birleştirme (JOIN)
  // ==========================================
  {
    id: "w7-c1",
    worldId: 7,
    order: 1,
    title: "Müşteri & Sipariş İlişkisel Mutabakatı",
    subtitle: "INNER JOIN ile Bütünleşik Raporlama",
    story: "Finansal denetim: Gerçekleşen her bir siparişin hangi müşteri tarafından verildiğini ve işlem tutarını tek bir konsolide raporda bağlayın.",
    objective: "customers ve orders tablolarını customer_id üzerinden INNER JOIN ile bağlayın. customers.first_name, customers.last_name, orders.id AS order_id ve orders.total_amount sütunlarını listeleyin.",
    difficulty: "medium",
    concepts: ["INNER JOIN", "ON Clause", "Table Linking"],
    databaseId: "ecommerce",
    baseXp: 140,
    solutionQuery: `SELECT customers.first_name, customers.last_name, orders.id AS order_id, orders.total_amount
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;`,
    hints: {
      level1: "customers tablosu ile orders tablosunu customers.id = orders.customer_id eşitliğiyle INNER JOIN yapın.",
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
    title: "Tüm Kullanıcı Portföyü & Sipariş Durumu",
    subtitle: "LEFT JOIN ile Kayıpsız Eşleştirme",
    story: "Müşteri tutundurma analitiği: Aktif siparişi olan veya henüz sipariş vermemiş tüm müşterileri kapsayan bir rapor oluşturun; siparişi olmayan kullanıcılarda NULL değerini koruyun.",
    objective: "customers tablosunu orders tablosuyla LEFT JOIN yaparak bağlayın. first_name, last_name, email ve orders.total_amount sütunlarını listeleyin.",
    difficulty: "medium",
    concepts: ["LEFT JOIN", "NULL Preservation"],
    databaseId: "ecommerce",
    baseXp: 150,
    solutionQuery: `SELECT customers.first_name, customers.last_name, customers.email, orders.total_amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;`,
    hints: {
      level1: "Sol tablodaki (customers) tüm satırların sipariş kaydı olmasa bile korunması için LEFT JOIN kullanılır.",
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
    title: "Uçtan Uca Sipariş ve Envanter Zinciri",
    subtitle: "4 Tablolu İlişkisel Normalizasyon Zinciri",
    story: "Tedarik zinciri denetimi: Sipariş dökümünü kalemlerine, ilgili ürüne ve ürün kategorisine kadar bağlayan kapsamlı mutabakat sorgusu hazırlayın.",
    objective: "orders, order_items, products ve categories tablolarını bağlayın. orders.id AS order_id, products.name AS product_name, categories.name AS category_name ve order_items.quantity sütunlarını listeleyin.",
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
      level1: "Sırayla orders -> order_items -> products -> categories tablolarını ilişkisel anahtarları üzerinden INNER JOIN ile zincirleyin.",
      level2: "orders.id = order_items.order_id AND order_items.product_id = products.id AND products.category_id = categories.id",
      level3: `SELECT orders.id AS order_id, products.name AS product_name, categories.name AS category_name, order_items.quantity
FROM orders
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id
INNER JOIN categories ON products.category_id = categories.id;`,
    },
  },

  // ==========================================
  // WORLD 8: Koşullu Mantık & Dinamik Sınıflandırma (CASE WHEN)
  // ==========================================
  {
    id: "w8-c1",
    worldId: 8,
    order: 1,
    title: "Müşteri & Ürün Fiyat Kademelendirmesi",
    subtitle: "CASE WHEN ile Dinamik Sınıflandırma",
    story: "Katalog yönetimi: Ürün envanterini birim fiyatlarına göre 'Premium' (>= 40.000 TL), 'Mid-Range' (>= 10.000 TL) ve 'Budget' (< 10.000 TL) segmentlerine ayırın.",
    objective: "products tablosundan name, price sütunlarını ve bu mantıksal koşullarla türetilen 'price_tier' sütununu getirin.",
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
      level1: "CASE WHEN kosul1 THEN 'deger1' WHEN kosul2 THEN 'deger2' ELSE 'deger3' END AS price_tier sözdizimini kullanın.",
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
  // WORLD 9: İç İçe Sorgular & Türetilmiş Tablolar (Subqueries)
  // ==========================================
  {
    id: "w9-c1",
    worldId: 9,
    order: 1,
    title: "Genel Ortalamanın Üzerindeki Ürünler",
    subtitle: "Skaler Alt Sorgu (Scalar Subquery)",
    story: "Fiyatlandırma analitiği: Mağazanın genel ürün fiyat ortalamasını dinamik olarak hesaplayıp, bu ortalamanın üzerinde kalan ürünleri filtreleyin.",
    objective: "products tablosundan price değeri mağazanın ortalama ürün fiyatından (SELECT AVG(price) FROM products) yüksek olan ürünlerin name ve price sütunlarını listeleyin.",
    difficulty: "medium",
    concepts: ["Scalar Subquery", "WHERE Subquery"],
    databaseId: "ecommerce",
    baseXp: 150,
    solutionQuery: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
    hints: {
      level1: "WHERE price > (SELECT AVG(price) FROM products) yapısını oluşturun.",
      level2: "Parantez içindeki skaler alt sorgu tek bir ortalama değer döner ve dış sorgunun filtresi olarak çalışır.",
      level3: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
    },
  },

  // ==========================================
  // WORLD 10: Küme Operasyonları (SET Operations)
  // ==========================================
  {
    id: "w10-c1",
    worldId: 10,
    order: 1,
    title: "Farklı Kaynak Havuzlarını Konsolide Etme",
    subtitle: "UNION ile Küme Birleştirme ve Tekilleştirme",
    story: "Veri ambarı entegrasyonu: Farklı operasyonel veri kaynaklarındaki ülke listelerini tek bir tekil havuzda birleştirin.",
    objective: "customers tablosundaki country sütununu ve 'Germany' değerini UNION ile birleştirerek tekil ülke listesini getirin.",
    difficulty: "medium",
    concepts: ["UNION", "Set Operations"],
    databaseId: "ecommerce",
    baseXp: 160,
    solutionQuery: "SELECT country FROM customers UNION SELECT 'Germany' AS country;",
    hints: {
      level1: "SELECT country FROM customers UNION SELECT 'Germany' AS country; sözdizimini kullanın.",
      level2: "UNION operatörü iki sorgunun sonuç kümesini dikey olarak birleştirir ve tekrarları otomatik ayıklar.",
      level3: "SELECT country FROM customers UNION SELECT 'Germany' AS country;",
    },
  },

  // ==========================================
  // WORLD 11: Zaman Serisi Analitiği & Tarih İşleme
  // ==========================================
  {
    id: "w11-c1",
    worldId: 11,
    order: 1,
    title: "Aylık Sipariş Hacmi & Zaman Serisi",
    subtitle: "DATE_TRUNC ile Zaman Damgası Normalizasyonu",
    story: "Sezonsallık ve büyüme analitiği: Sipariş işlemlerinin tarihlerini ay başlangıcına yuvarlayarak aylık işlem frekansını hesaplayın.",
    objective: "orders tablosunda DATE_TRUNC('month', order_date) AS order_month bazında gruplama yaparak aylık sipariş adedini (COUNT(*) AS order_count) hesaplayın ve kronolojik sıralayın.",
    difficulty: "hard",
    concepts: ["DATE_TRUNC", "Date Functions", "Time Series"],
    databaseId: "ecommerce",
    orderMatters: true,
    baseXp: 170,
    solutionQuery: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
    hints: {
      level1: "DATE_TRUNC('month', order_date) ifadesini hem SELECT projeksiyonuna hem de GROUP BY bloğuna ekleyin.",
      level2: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
      level3: "SELECT DATE_TRUNC('month', order_date) AS order_month, COUNT(*) AS order_count FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY order_month;",
    },
  },

  // ==========================================
  // WORLD 12: Ortak Tablo İfadeleri: CTE (WITH)
  // ==========================================
  {
    id: "w12-c1",
    worldId: 12,
    order: 1,
    title: "Modüler Analitik: Yüksek Hacimli Müşteri Segmenti",
    subtitle: "WITH (Ortak Tablo İfadesi - CTE) Mimarisi",
    story: "Analitik sorgu mimarisi: Karmaşık iç içe sorgular yerine WITH ifadesiyle müşteri harcama özetini ara tablo olarak tanımlayın; ardından 50.000 TL üzerindeki hesapları filtreleyin.",
    objective: "WITH customer_spending AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) CTE'si tanımlayarak, total_spent > 50000 olan müşteri ID ve harcama tutarlarını getirin.",
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
      level1: "WITH cte_adi AS (...) SELECT ... FROM cte_adi yapısını kullanın.",
      level2: "İlk blokta müşteri bazında toplam tutarı hesaplayıp gruplayın, ana sorguda bu geçici tablodan filtreleme yapın.",
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
  // WORLD 13: Analitik Fonksiyonlar: Window Functions
  // ==========================================
  {
    id: "w13-c1",
    worldId: 13,
    order: 1,
    title: "Kategori İçi Fiyat Sıralaması (DENSE_RANK)",
    subtitle: "Pencere Fonksiyonu & PARTITION BY",
    story: "Kategori içi ürün rekabet analizi: Satır bağlamını kaybetmeden, her kategori penceresi içinde ürünleri fiyatlarına göre azalan sırada derecelendirin.",
    objective: "products tablosundan name, category_id, price ve kategori bazında fiyata göre azalan sıralama yapan DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS price_rank sütununu getirin.",
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
      level1: "DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) ifadesini kullanın.",
      level2: "PARTITION BY her kategoriyi bağımsız bir pencereye böler ve sıralama o pencere içinde yeniden başlar.",
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
  // WORLD 14: Uygulamalı İş Analitiği & Kohort Modelleri
  // ==========================================
  {
    id: "w14-c1",
    worldId: 14,
    order: 1,
    title: "Kronolojik Nakit Akışı: Kümülatif Toplam",
    subtitle: "SUM() OVER (ORDER BY) ile Running Total",
    story: "Finansal denetim ve nakit akışı modellemesi: Siparişlerin kronolojik akışında kasaya giren kümülatif işlem toplamını (Running Total) hesaplayın.",
    objective: "orders tablosundan id, order_date, total_amount ve sipariş tarihine göre kümülatif toplam alan SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total sütununu getirin.",
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
      level1: "SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total yapısını kullanın.",
      level2: "OVER içindeki ORDER BY her satır için o ana kadarki toplamı kümülatif olarak biriktirir.",
      level3: `SELECT id, order_date, total_amount,
  SUM(total_amount) OVER (ORDER BY order_date, id) AS running_total
FROM orders
ORDER BY order_date, id;`,
    },
  },

  // ==========================================
  // WORLD 15: Adli Bilişim & Finansal Denetim Vakaları
  // ==========================================
  {
    id: "w15-c1",
    worldId: 15,
    order: 1,
    title: "ADLİ VAKA 01: Gece Yarısı Şüpheli Transfer Anomalisi",
    subtitle: "Fintech Kara Para Aklama & Transfer Güvenliği Denetimi",
    story: "Finansal İstihbarat & Risk Birimi Denetim Kaydı: SafeBank transfer veritabanında gece saatlerinde tek seferde 150.000 TL ve üzeri şüpheli para çıkışları raporlandı. Kara para aklama (AML) ve yetkisiz işlem protokolü kapsamında; transferi gerçekleştiren hesap sahibinin kimliğini, çıkış hesabını, alıcı hesabı ve işlem tutarını korele edin.",
    objective: "fintech veritabanında transactions, accounts ve users tablolarını birleştirerek; amount >= 150000 olan transferlerin users.full_name, transactions.from_account_id, transactions.to_account_id, transactions.amount ve transactions.created_at sütunlarını listeleyin.",
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
      level1: "transactions tablosundaki from_account_id üzerinden accounts tablosuna, oradan da users tablosuna bağlanmalısınız.",
      level2: "WHERE t.amount >= 150000 koşulunu uygulayın.",
      level3: `SELECT users.full_name, t.from_account_id, t.to_account_id, t.amount, t.created_at
FROM transactions t
INNER JOIN accounts a ON t.from_account_id = a.id
INNER JOIN users ON a.user_id = users.id
WHERE t.amount >= 150000
ORDER BY t.created_at;`,
    },
    learningNotes: "Adli Denetim Raporu: Şüpheli transferlerin Volkan Demirtaş ve Hakan Güler profillerine bağlı hesaplardan çıktığı tespit edilerek transfer blokajı uygulandı.",
  },
  {
    id: "w15-c2",
    worldId: 15,
    order: 2,
    title: "ADLİ VAKA 02: Siber Plaza Güvenlik & Log Korelasyonu",
    subtitle: "Fiziksel Güvenlik ve Erişim Logları Çapraz Analizi",
    story: "Adli Bilişim & Olay Yeri Veri İnceleme Raporu: Grand Cyber Plaza'da gerçekleşen adli vaka sonrasında toplanan delillere göre failin: Siyah saçlı ('black'), boyu 180 cm veya üzeri, ve olay gecesi 'Parking B2' turnikesinden giriş yaptığı tespit edilmiştir. Şüpheliler veritabanı ile geçiş kontrol loglarını birleştirerek failin kimliğini, mesleğini ve araç plakasını saptayın.",
    objective: "murder_mystery veritabanında suspects ve security_logs tablolarını bağlayarak, boyu >= 180, saç rengi 'black' olan ve 'Parking B2' noktasından geçen şüphelinin adını (name), mesleğini (occupation) ve plakasını (plate_number) getirin.",
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
      level1: "suspects ile security_logs tablosunu s.id = log.suspect_id koşuluyla birleştirin.",
      level2: "WHERE s.hair_color = 'black' AND s.height_cm >= 180 AND log.checkpoint = 'Parking B2'",
      level3: `SELECT s.name, s.occupation, s.plate_number
FROM suspects s
INNER JOIN security_logs log ON s.id = log.suspect_id
WHERE s.hair_color = 'black'
  AND s.height_cm >= 180
  AND log.checkpoint = 'Parking B2';`,
    },
    learningNotes: "Adli Tahkikat Sonucu: Olay yerindeki fiziksel ve dijital kayıtlarla eşleşen şüphelinin Sistem Yöneticisi Tarik Menguc (Plaka: 34 HCK 999) olduğu doğrulanmıştır.",
  },
];
