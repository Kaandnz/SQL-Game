import { PGlite } from "@electric-sql/pglite";
import { DATASETS } from "../src/lib/data/datasets.js";
import { validateSafeQuery } from "../src/lib/db/security-guard.js";

async function runTests() {
  console.log("🚀 SQL Quest Engine Automated Test Suite başlatılıyor...\n");

  // 1. Test Security Guard
  console.log("🔒 1. Güvenlik ve Yetkilendirme Testleri (Security Guard)...");
  const dangerousQueries = [
    "DROP TABLE customers;",
    "DELETE FROM orders WHERE id = 1;",
    "UPDATE products SET price = 0;",
    "INSERT INTO customers (name) VALUES ('Hacker');",
    "ALTER TABLE accounts ADD COLUMN hacked text;",
    "TRUNCATE TABLE users;",
    "SELECT pg_read_file('/etc/passwd');",
  ];

  for (const sql of dangerousQueries) {
    const check = validateSafeQuery(sql);
    if (check.isSafe) {
      throw new Error(`❌ Güvenlik Hatası: Zararlı sorgu engellenemedi: ${sql}`);
    } else {
      console.log(`  ✅ Engellendi: "${sql}" -> ${check.violationMessage}`);
    }
  }

  const safeQueries = [
    "SELECT * FROM customers;",
    "SELECT first_name, email FROM customers WHERE city = 'Istanbul';",
    "WITH sales AS (SELECT * FROM orders) SELECT * FROM sales;",
  ];

  for (const sql of safeQueries) {
    const check = validateSafeQuery(sql);
    if (!check.isSafe) {
      throw new Error(`❌ Güvenlik Hatası: Güvenli sorgu yanlışlıkla engellendi: ${sql}`);
    } else {
      console.log(`  ✅ Onaylandı: "${sql}"`);
    }
  }

  // 2. Test In-Memory PGlite Database Seeding & Execution
  console.log("\n🐘 2. WebAssembly In-Memory PostgreSQL Veritabanı Testleri...");
  for (const [key, ds] of Object.entries(DATASETS)) {
    console.log(`  📦 '${ds.name}' (${key}) veritabanı tohumlanıyor...`);
    const db = new PGlite();
    await db.exec(ds.seedSql);

    const checkRes = await db.query(`SELECT count(*) as count FROM ${ds.tables[0].name};`);
    const count = checkRes.rows[0].count;
    console.log(`  ✅ '${ds.tables[0].name}' tablosunda ${count} satır başarıyla oluşturuldu.`);
  }

  console.log("\n🎉 TÜM MOTOR TESTLERİ BAŞARIYLA GEÇTİ!");
}

runTests().catch((err) => {
  console.error("Test başarısız oldu:", err);
  process.exit(1);
});
