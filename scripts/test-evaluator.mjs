import { PGlite } from "@electric-sql/pglite";

// 1. Security guard logic test
function validateSafeQuery(sql) {
  if (!sql || !sql.trim()) return { isSafe: false, violationMessage: "Boş sorgu." };
  const sanitized = sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  if (!sanitized) return { isSafe: false, violationMessage: "Boş sorgu." };
  if (!/^(SELECT|WITH|EXPLAIN)\b/i.test(sanitized)) {
    return { isSafe: false, violationMessage: "Sadece SELECT / WITH sorguları çalıştırılabilir." };
  }
  const BLOCKED = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "TRUNCATE", "CREATE", "GRANT", "REVOKE"];
  for (const cmd of BLOCKED) {
    if (new RegExp(`\\b${cmd}\\b`, "i").test(sanitized)) {
      return { isSafe: false, violationMessage: `'${cmd}' komutu engellendi.` };
    }
  }
  return { isSafe: true };
}

async function main() {
  console.log("🐘 PGlite WebAssembly Engine & Dataset Testleri Başlıyor...\n");

  // Test Security Guard
  console.log("🔒 1. Güvenlik Denetimleri...");
  const malicious = ["DROP TABLE products;", "DELETE FROM orders;", "UPDATE users SET risk_level = 'low';"];
  for (const q of malicious) {
    const res = validateSafeQuery(q);
    if (res.isSafe) throw new Error(`Güvenlik açığı: ${q} engellenemedi!`);
    console.log(`  ✅ Başarıyla engellendi: "${q}" -> ${res.violationMessage}`);
  }

  // Test PGlite In-Memory Postgres Instance
  console.log("\n🧪 2. E-Ticaret Veritabanı Testleri...");
  const db = new PGlite();

  await db.exec(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100),
      city VARCHAR(50)
    );
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      total_amount NUMERIC(10,2) NOT NULL
    );
    INSERT INTO customers (id, first_name, last_name, email, city) VALUES
      (1, 'Ahmet', 'Yılmaz', 'ahmet@email.com', 'Istanbul'),
      (2, 'Ayşe', 'Kaya', 'ayse@email.com', 'Ankara'),
      (3, 'Mehmet', 'Demir', 'mehmet@email.com', 'Istanbul');
    INSERT INTO orders (id, customer_id, total_amount) VALUES
      (101, 1, 75000.00),
      (102, 2, 65000.00),
      (103, 1, 3400.00);
  `);

  console.log("  ✅ Tablolar oluşturuldu ve veriler tohumlandı.");

  // Test SELECT query
  const res1 = await db.query("SELECT * FROM customers WHERE city = 'Istanbul';");
  console.log(`  ✅ WHERE sorgusu çalıştı: ${res1.rows.length} satır döndü (Beklenen: 2 satır).`);
  if (res1.rows.length !== 2) throw new Error("Satır sayısı uyuşmuyor!");

  // Test JOIN query
  const res2 = await db.query(`
    SELECT c.first_name, o.total_amount
    FROM customers c
    INNER JOIN orders o ON c.id = o.customer_id
    WHERE c.city = 'Istanbul';
  `);
  console.log(`  ✅ INNER JOIN sorgusu çalıştı: ${res2.rows.length} satır döndü (Beklenen: 2 sipariş).`);
  if (res2.rows.length !== 2) throw new Error("JOIN sonucu uyuşmuyor!");

  // Test Aggregate query
  const res3 = await db.query(`
    SELECT city, COUNT(*) as cust_count
    FROM customers
    GROUP BY city
    HAVING COUNT(*) > 1;
  `);
  console.log(`  ✅ GROUP BY + HAVING çalıştı: ${res3.rows.length} grup döndü (Istanbul: ${res3.rows[0].cust_count}).`);

  // Test CTE query
  const res4 = await db.query(`
    WITH big_orders AS (
      SELECT * FROM orders WHERE total_amount > 10000
    )
    SELECT * FROM big_orders;
  `);
  console.log(`  ✅ CTE (WITH) sorgusu çalıştı: ${res4.rows.length} satır döndü.`);

  console.log("\n✨ BÜTÜN DOĞRULAMA TESTLERİ %100 BAŞARIYLA TAMAMLANDI!");
}

main().catch((e) => {
  console.error("Test hatası:", e);
  process.exit(1);
});
