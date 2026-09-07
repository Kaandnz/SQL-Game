import { Dataset } from "@/types";

export const DATASETS: Record<string, Dataset> = {
  ecommerce: {
    id: "ecommerce",
    name: "TechStore E-Ticaret",
    description: "Elektronik ve yazılım ürünleri satan global bir e-ticaret platformunun veritabanı.",
    icon: "ShoppingCart",
    tables: [
      {
        name: "customers",
        description: "Kayıtlı müşteriler ve iletişim bilgileri",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Benzersiz müşteri no" },
          { name: "first_name", type: "VARCHAR(50)", description: "Müşteri adı" },
          { name: "last_name", type: "VARCHAR(50)", description: "Müşteri soyadı" },
          { name: "email", type: "VARCHAR(100)", description: "E-posta adresi" },
          { name: "phone", type: "VARCHAR(50)", description: "İletişim telefon numarası (boş bırakılabilir)" },
          { name: "city", type: "VARCHAR(50)", description: "Yaşadığı şehir" },
          { name: "country", type: "VARCHAR(50)", description: "Ülke" },
          { name: "created_at", type: "DATE", description: "Kayıt tarihi" },
        ],
      },
      {
        name: "categories",
        description: "Ürün ana ve alt kategorileri",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Kategori ID" },
          { name: "name", type: "VARCHAR(50)", description: "Kategori adı" },
        ],
      },
      {
        name: "products",
        description: "Mağazada satışta olan teknolojik ürünler",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Ürün ID" },
          { name: "name", type: "VARCHAR(100)", description: "Ürün adı" },
          { name: "price", type: "NUMERIC(10,2)", description: "Satış fiyatı (TL)" },
          { name: "stock_quantity", type: "INTEGER", description: "Mevcut stok miktarı" },
          { name: "category_id", type: "INTEGER", isForeign: true, references: { table: "categories", column: "id" }, description: "Bağlı kategori" },
        ],
      },
      {
        name: "orders",
        description: "Müşteriler tarafından verilen sipariş başlıkları",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Sipariş ID" },
          { name: "customer_id", type: "INTEGER", isForeign: true, references: { table: "customers", column: "id" }, description: "Siparişi veren müşteri" },
          { name: "order_date", type: "DATE", description: "Sipariş verilme tarihi" },
          { name: "status", type: "VARCHAR(20)", description: "Durum ('completed', 'cancelled', 'processing')" },
          { name: "total_amount", type: "NUMERIC(10,2)", description: "Toplam fatura tutarı" },
        ],
      },
      {
        name: "order_items",
        description: "Siparişlerdeki her bir ürün kalemi",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Kalem ID" },
          { name: "order_id", type: "INTEGER", isForeign: true, references: { table: "orders", column: "id" }, description: "İlgili sipariş" },
          { name: "product_id", type: "INTEGER", isForeign: true, references: { table: "products", column: "id" }, description: "Satın alınan ürün" },
          { name: "quantity", type: "INTEGER", description: "Adet" },
          { name: "unit_price", type: "NUMERIC(10,2)", description: "Birim fiyat" },
        ],
      },
    ],
    seedSql: `
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;

      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(50),
        city VARCHAR(50),
        country VARCHAR(50) DEFAULT 'Turkey',
        created_at DATE DEFAULT CURRENT_DATE
      );

      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id)
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        order_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'completed',
        total_amount NUMERIC(10,2) NOT NULL
      );

      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL
      );


      INSERT INTO customers (id, first_name, last_name, email, phone, city, country, created_at) VALUES
        (1, 'Ahmet', 'Yılmaz', 'ahmet.yilmaz@email.com', '0532 111 2233', 'Istanbul', 'Turkey', '2023-01-15'),
        (2, 'Ayşe', 'Kaya', 'ayse.kaya@email.com', NULL, 'Ankara', 'Turkey', '2023-02-10'),
        (3, 'Mehmet', 'Demir', 'mehmet.demir@email.com', '0544 222 3344', 'Izmir', 'Turkey', '2023-03-05'),
        (4, 'Fatma', 'Çelik', 'fatma.celik@email.com', NULL, 'Istanbul', 'Turkey', '2023-04-12'),
        (5, 'Can', 'Öztürk', 'can.ozturk@email.com', '0555 333 4455', 'Bursa', 'Turkey', '2023-05-20'),
        (6, 'Zeynep', 'Aydın', 'zeynep.aydin@email.com', '0533 444 5566', 'Antalya', 'Turkey', '2023-06-18'),
        (7, 'Burak', 'Koç', 'burak.koc@email.com', NULL, 'Istanbul', 'Turkey', '2023-07-22'),
        (8, 'Elif', 'Şahin', 'elif.sahin@email.com', '0505 555 6677', 'Ankara', 'Turkey', '2023-08-14'),
        (9, 'Murat', 'Arslan', 'murat.arslan@email.com', NULL, 'Izmir', 'Turkey', '2023-09-01'),
        (10, 'Selin', 'Yıldız', 'selin.yildiz@email.com', '0542 666 7788', 'Eskişehir', 'Turkey', '2023-10-11'),
        (11, 'Deniz', 'Kurt', 'deniz.kurt@email.com', NULL, 'Istanbul', 'Turkey', '2023-11-04'),
        (12, 'Emre', 'Kara', 'emre.kara@email.com', '0530 777 8899', 'Trabzon', 'Turkey', '2023-12-01');

      INSERT INTO categories (id, name) VALUES
        (1, 'Laptops & Computers'),
        (2, 'Smartphones'),
        (3, 'Accessories'),
        (4, 'Audio & Sound'),
        (5, 'Gaming');

      INSERT INTO products (id, name, price, stock_quantity, category_id) VALUES
        (1, 'MacBook Pro 16', 75000.00, 15, 1),
        (2, 'Dell XPS 15', 52000.00, 8, 1),
        (3, 'iPhone 15 Pro', 65000.00, 25, 2),
        (4, 'Samsung Galaxy S24', 45000.00, 18, 2),
        (5, 'Sony WH-1000XM5', 12500.00, 40, 4),
        (6, 'AirPods Pro 2', 8500.00, 60, 4),
        (7, 'Logitech MX Master 3S', 3400.00, 75, 3),
        (8, 'Keychron K2 Mechanical Keyboard', 4200.00, 30, 3),
        (9, 'PlayStation 5 Console', 24000.00, 12, 5),
        (10, 'Nintendo Switch OLED', 14500.00, 20, 5),
        (11, 'LG 27" 4K Monitor', 16000.00, 14, 1),
        (12, 'Anker USB-C Hub 7-in-1', 1200.00, 100, 3);

      INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES
        (101, 1, '2024-01-10', 'completed', 78400.00),
        (102, 2, '2024-01-14', 'completed', 65000.00),
        (103, 3, '2024-01-20', 'completed', 12500.00),
        (104, 1, '2024-02-05', 'completed', 3400.00),
        (105, 4, '2024-02-12', 'cancelled', 52000.00),
        (106, 5, '2024-02-18', 'completed', 38500.00),
        (107, 6, '2024-03-01', 'completed', 8500.00),
        (108, 7, '2024-03-10', 'completed', 99000.00),
        (109, 2, '2024-03-15', 'completed', 16000.00),
        (110, 8, '2024-03-22', 'completed', 45000.00),
        (111, 9, '2024-04-05', 'completed', 24000.00),
        (112, 1, '2024-04-12', 'completed', 12500.00),
        (113, 10, '2024-04-20', 'processing', 14500.00),
        (114, 3, '2024-05-02', 'completed', 65000.00),
        (115, 11, '2024-05-15', 'completed', 75000.00);

      INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
        (1, 101, 1, 1, 75000.00),
        (2, 101, 7, 1, 3400.00),
        (3, 102, 3, 1, 65000.00),
        (4, 103, 5, 1, 12500.00),
        (5, 104, 7, 1, 3400.00),
        (6, 105, 2, 1, 52000.00),
        (7, 106, 9, 1, 24000.00),
        (8, 106, 10, 1, 14500.00),
        (9, 107, 6, 1, 8500.00),
        (10, 108, 1, 1, 75000.00),
        (11, 108, 9, 1, 24000.00),
        (12, 109, 11, 1, 16000.00),
        (13, 110, 4, 1, 45000.00),
        (14, 111, 9, 1, 24000.00),
        (15, 112, 5, 1, 12500.00),
        (16, 113, 10, 1, 14500.00),
        (17, 114, 3, 1, 65000.00),
        (18, 115, 1, 1, 75000.00);
    `,
  },
  fintech: {
    id: "fintech",
    name: "SafeBank & Fraud Detective",
    description: "Finansal transferler, şüpheli hesap aktiviteleri ve güvenlik logları içeren bankacılık veritabanı.",
    icon: "ShieldAlert",
    tables: [
      {
        name: "users",
        description: "Banka müşterileri",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Kullanıcı ID" },
          { name: "full_name", type: "VARCHAR(100)", description: "Müşteri tam adı" },
          { name: "risk_level", type: "VARCHAR(20)", description: "Risk skoru ('low', 'medium', 'high', 'critical')" },
          { name: "country", type: "VARCHAR(50)", description: "Kayıtlı ülke" },
        ],
      },
      {
        name: "accounts",
        description: "Müşteri banka hesapları",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Hesap no" },
          { name: "user_id", type: "INTEGER", isForeign: true, references: { table: "users", column: "id" }, description: "Hesap sahibi" },
          { name: "account_type", type: "VARCHAR(20)", description: "Hesap türü ('checking', 'savings', 'crypto')" },
          { name: "balance", type: "NUMERIC(15,2)", description: "Mevcut bakiye (TL)" },
          { name: "is_frozen", type: "BOOLEAN", description: "Hesap dondurulmuş mu?" },
        ],
      },
      {
        name: "transactions",
        description: "Para transferleri ve ödemeler",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "İşlem ID" },
          { name: "from_account_id", type: "INTEGER", isForeign: true, references: { table: "accounts", column: "id" }, description: "Gönderen hesap" },
          { name: "to_account_id", type: "INTEGER", isForeign: true, references: { table: "accounts", column: "id" }, description: "Alıcı hesap" },
          { name: "amount", type: "NUMERIC(15,2)", description: "Transfer tutarı" },
          { name: "created_at", type: "TIMESTAMP", description: "İşlem zamanı" },
          { name: "ip_address", type: "VARCHAR(45)", description: "İşlemin yapıldığı IP" },
        ],
      },
      {
        name: "login_history",
        description: "Kullanıcı oturum açma kayıtları ve cihaz bilgileri",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Log ID" },
          { name: "user_id", type: "INTEGER", isForeign: true, references: { table: "users", column: "id" }, description: "Giriş yapan kullanıcı" },
          { name: "country", type: "VARCHAR(50)", description: "Giriş yapılan ülke" },
          { name: "device_type", type: "VARCHAR(50)", description: "Cihaz türü / Tarayıcı" },
          { name: "login_time", type: "TIMESTAMP", description: "Giriş anı" },
          { name: "is_successful", type: "BOOLEAN", description: "Giriş başarılı mı?" },
        ],
      },
    ],
    seedSql: `
      DROP TABLE IF EXISTS login_history CASCADE;
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS accounts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        risk_level VARCHAR(20) DEFAULT 'low',
        country VARCHAR(50) DEFAULT 'Turkey'
      );

      CREATE TABLE accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        account_type VARCHAR(20) DEFAULT 'checking',
        balance NUMERIC(15,2) DEFAULT 0,
        is_frozen BOOLEAN DEFAULT false
      );

      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        from_account_id INTEGER REFERENCES accounts(id),
        to_account_id INTEGER REFERENCES accounts(id),
        amount NUMERIC(15,2) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45)
      );

      CREATE TABLE login_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        country VARCHAR(50) NOT NULL,
        device_type VARCHAR(50) NOT NULL,
        login_time TIMESTAMP NOT NULL,
        is_successful BOOLEAN DEFAULT true
      );

      INSERT INTO users (id, full_name, risk_level, country) VALUES
        (1, 'Serkan Erdem', 'low', 'Turkey'),
        (2, 'Volkan Demirtaş', 'high', 'Turkey'),
        (3, 'Dmitri Ivanov', 'critical', 'Russia'),
        (4, 'Merve Aksoy', 'low', 'Turkey'),
        (5, 'Alex Müller', 'medium', 'Germany'),
        (6, 'Hakan Güler', 'critical', 'Turkey');

      INSERT INTO accounts (id, user_id, account_type, balance, is_frozen) VALUES
        (201, 1, 'checking', 45000.00, false),
        (202, 1, 'savings', 120000.00, false),
        (203, 2, 'checking', 850000.00, false),
        (204, 3, 'crypto', 2400000.00, true),
        (205, 4, 'checking', 32000.00, false),
        (206, 5, 'savings', 78000.00, false),
        (207, 6, 'checking', 920000.00, false);

      INSERT INTO transactions (id, from_account_id, to_account_id, amount, created_at, ip_address) VALUES
        (501, 201, 205, 1500.00, '2024-05-01 10:15:00', '192.168.1.10'),
        (502, 203, 204, 180000.00, '2024-05-01 02:40:00', '185.220.101.5'),
        (503, 203, 207, 220000.00, '2024-05-01 03:10:00', '185.220.101.5'),
        (504, 207, 204, 350000.00, '2024-05-01 03:45:00', '185.220.101.8'),
        (505, 205, 201, 400.00, '2024-05-02 14:20:00', '88.240.55.12'),
        (506, 206, 201, 12000.00, '2024-05-03 09:30:00', '195.175.22.4');

      INSERT INTO login_history (id, user_id, country, device_type, login_time, is_successful) VALUES
        (1, 1, 'Turkey', 'iPhone 15', '2024-05-01 09:00:00', true),
        (2, 2, 'Turkey', 'Windows Chrome', '2024-05-01 01:00:00', true),
        (3, 2, 'Netherlands', 'Tor Browser / Linux', '2024-05-01 02:30:00', true),
        (4, 3, 'Russia', 'MacBook Safari', '2024-05-01 02:50:00', true),
        (5, 6, 'Turkey', 'Android App', '2024-05-01 03:00:00', true),
        (6, 6, 'Seychelles', 'Unknown Linux Node', '2024-05-01 03:35:00', true);
    `,
  },
  murder_mystery: {
    id: "murder_mystery",
    name: "SQL Cinayet Soruşturması",
    description: "Karanlık bir gecede Grand Cyber Plaza'da işlenen cinayeti aydınlatacak şüpheliler ve deliller.",
    icon: "Search",
    tables: [
      {
        name: "suspects",
        description: "Olay gecesi binada olan tüm şüpheliler",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Şüpheli ID" },
          { name: "name", type: "VARCHAR(100)", description: "Ad Soyad" },
          { name: "gender", type: "VARCHAR(10)", description: "Cinsiyet" },
          { name: "height_cm", type: "INTEGER", description: "Boy (cm)" },
          { name: "hair_color", type: "VARCHAR(30)", description: "Saç rengi" },
          { name: "occupation", type: "VARCHAR(50)", description: "Meslek" },
          { name: "plate_number", type: "VARCHAR(20)", description: "Araç plaka no" },
        ],
      },
      {
        name: "crime_scene_reports",
        description: "Polis ve olay yeri inceleme tutanakları",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Tutanak ID" },
          { name: "date", type: "DATE", description: "Olay tarihi" },
          { name: "location", type: "VARCHAR(100)", description: "Olay yeri" },
          { name: "description", type: "TEXT", description: "Tutanak detayları" },
        ],
      },
      {
        name: "security_logs",
        description: "Otopark ve kapı turnike geçiş kayıtları",
        columns: [
          { name: "id", type: "INTEGER", isPrimary: true, description: "Log no" },
          { name: "suspect_id", type: "INTEGER", isForeign: true, references: { table: "suspects", column: "id" }, description: "Geçiş yapan şüpheli" },
          { name: "checkpoint", type: "VARCHAR(50)", description: "Turnike / Kapı" },
          { name: "entry_time", type: "TIMESTAMP", description: "Giriş saati" },
          { name: "exit_time", type: "TIMESTAMP", description: "Çıkış saati" },
        ],
      },
    ],
    seedSql: `
      DROP TABLE IF EXISTS security_logs CASCADE;
      DROP TABLE IF EXISTS crime_scene_reports CASCADE;
      DROP TABLE IF EXISTS suspects CASCADE;

      CREATE TABLE suspects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        height_cm INTEGER,
        hair_color VARCHAR(30),
        occupation VARCHAR(50),
        plate_number VARCHAR(20)
      );

      CREATE TABLE crime_scene_reports (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        location VARCHAR(100) NOT NULL,
        description TEXT NOT NULL
      );

      CREATE TABLE security_logs (
        id SERIAL PRIMARY KEY,
        suspect_id INTEGER REFERENCES suspects(id),
        checkpoint VARCHAR(50) NOT NULL,
        entry_time TIMESTAMP NOT NULL,
        exit_time TIMESTAMP
      );

      INSERT INTO suspects (id, name, gender, height_cm, hair_color, occupation, plate_number) VALUES
        (1, 'Kemal Vural', 'male', 182, 'black', 'Security Guard', '34 ABC 123'),
        (2, 'Gizem Bulut', 'female', 168, 'blonde', 'Software Engineer', '06 DEF 456'),
        (3, 'Sinan Kaya', 'male', 178, 'brown', 'Data Analyst', '35 GHI 789'),
        (4, 'Tarik Menguc', 'male', 185, 'black', 'System Admin', '34 HCK 999'),
        (5, 'Bahar Sevim', 'female', 172, 'red', 'Financial Advisor', '16 JKL 321');

      INSERT INTO crime_scene_reports (id, date, location, description) VALUES
        (1, '2024-04-15', 'Grand Cyber Plaza Floor 7', 'Cinayet saat 23:15 civarında işlendi. Görgü tanığı siyah saçlı, 180 cm üzeri erkek bir şüphelinin 34 plakalı siyah bir araçla otoparktan hızla kaçtığını bildirdi.');

      INSERT INTO security_logs (id, suspect_id, checkpoint, entry_time, exit_time) VALUES
        (1, 1, 'Gate 1', '2024-04-15 18:00:00', '2024-04-16 06:00:00'),
        (2, 2, 'Gate 2', '2024-04-15 09:00:00', '2024-04-15 18:30:00'),
        (3, 3, 'Gate 2', '2024-04-15 14:00:00', '2024-04-15 21:00:00'),
        (4, 4, 'Parking B2', '2024-04-15 22:45:00', '2024-04-15 23:25:00'),
        (5, 5, 'Gate 1', '2024-04-15 10:00:00', '2024-04-15 17:00:00');
    `,
  },
};
