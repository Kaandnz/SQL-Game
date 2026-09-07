"use client";

import React, { useState } from "react";
import {
  FileText,
  X,
  Copy,
  Check,
  Search,
  Code2,
  Terminal,
  Zap,
  BookOpen,
} from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";

interface CheatSheetItem {
  title: string;
  category: "DQL" | "Functions" | "Joins" | "Advanced" | "Performance";
  syntax: string;
  example: string;
  tip: string;
}

const CHEAT_SHEET_DATA: CheatSheetItem[] = [
  {
    title: "SELECT Temel Kalıp",
    category: "DQL",
    syntax: "SELECT col1 AS a, col2 FROM table_name WHERE condition ORDER BY col1 DESC LIMIT 10;",
    example: "SELECT name, price FROM products WHERE price > 1000 ORDER BY price DESC LIMIT 5;",
    tip: "Üretim ortamlarında asla SELECT * kullanmayın, kolonları açıkça belirtin.",
  },
  {
    title: "Tekil Kayıtlar (DISTINCT)",
    category: "DQL",
    syntax: "SELECT DISTINCT col1, col2 FROM table_name;",
    example: "SELECT DISTINCT city FROM customers;",
    tip: "DISTINCT tüm seçilen kolonların kombinasyonunu tekilleştirir.",
  },
  {
    title: "Aralık ve Liste Filtresi (BETWEEN & IN)",
    category: "DQL",
    syntax: "WHERE col BETWEEN min AND max\n  AND col IN (val1, val2, val3);",
    example: "WHERE price BETWEEN 100 AND 500 AND status IN ('active', 'pending');",
    tip: "BETWEEN sınır değerleri de (min ve max) dahil eder.",
  },
  {
    title: "NULL Kontrolü & COALESCE",
    category: "DQL",
    syntax: "WHERE col IS NULL / IS NOT NULL\nSELECT COALESCE(col, 'Varsayılan');",
    example: "SELECT first_name, COALESCE(phone, 'Yok') AS tel FROM customers WHERE phone IS NOT NULL;",
    tip: "Asla 'col = NULL' yazmayın, her zaman 'IS NULL' kullanın.",
  },
  {
    title: "Metin Arama (LIKE & ILIKE)",
    category: "DQL",
    syntax: "WHERE col LIKE '%pattern%'   -- Harf duyarlı\nWHERE col ILIKE '%pattern%'  -- Harf duyarsız",
    example: "WHERE email LIKE '%@gmail.com' AND name ILIKE 'ahmet%';",
    tip: "'%kelime' aramaları B-Tree indeksini kullanamaz ve tabloyu tarar.",
  },
  {
    title: "Tarih Kırpma (DATE_TRUNC & EXTRACT)",
    category: "Functions",
    syntax: "DATE_TRUNC('month', date_col)\nEXTRACT(DOW FROM date_col)",
    example: "SELECT DATE_TRUNC('month', created_at) AS ay, COUNT(*) FROM orders GROUP BY 1;",
    tip: "DATE_TRUNC zaman serisi analizinde gün/ay/yıl başlarına eşitlemek için idealdir.",
  },
  {
    title: "Gruplama & Filtreleme (GROUP BY & HAVING)",
    category: "Functions",
    syntax: "SELECT col, COUNT(*), SUM(tutar) FROM tbl\nWHERE satir_sarti\nGROUP BY col\nHAVING COUNT(*) > 5;",
    example: "SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) >= 2;",
    tip: "WHERE gruplamadan önce satırları, HAVING gruplamadan sonra grup toplamlarını eler.",
  },
  {
    title: "INNER JOIN (Kesişim Kümesi)",
    category: "Joins",
    syntax: "SELECT a.*, b.* FROM table_a a\nINNER JOIN table_b b ON a.fk_id = b.id;",
    example: "SELECT o.id, c.first_name FROM orders o JOIN customers c ON o.customer_id = c.id;",
    tip: "Yalnızca her iki tabloda da eşleşen ortak kayıtları getirir.",
  },
  {
    title: "LEFT JOIN (Sol Tabloyu Koru)",
    category: "Joins",
    syntax: "SELECT a.*, b.* FROM table_a a\nLEFT JOIN table_b b ON a.fk_id = b.id\nWHERE b.id IS NULL; -- Anti-Join",
    example: "SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;",
    tip: "Eşleşmeyen sağ kayıtlar NULL olur. İlişkisi olmayanları bulmak için Anti-Join kullanılır.",
  },
  {
    title: "Küme Birleştirme (UNION ALL)",
    category: "Joins",
    syntax: "SELECT c1, c2 FROM tbl1\nUNION ALL\nSELECT c1, c2 FROM tbl2;",
    example: "SELECT email FROM customers UNION ALL SELECT email FROM leads;",
    tip: "UNION ALL tekrarları silmez ve gizli sıralama yapmadığı için UNION'dan çok daha hızlıdır.",
  },
  {
    title: "Koşullu Mantık (CASE WHEN)",
    category: "Advanced",
    syntax: "CASE\n  WHEN cond1 THEN 'A'\n  WHEN cond2 THEN 'B'\n  ELSE 'C'\nEND",
    example: "SELECT name, CASE WHEN price > 10000 THEN 'VIP' ELSE 'Standart' END AS seg FROM products;",
    tip: "CASE WHEN, SUM() içinde koşullu toplam almak için de kullanılabilir.",
  },
  {
    title: "Ortak Tablo İfadeleri (CTE - WITH)",
    category: "Advanced",
    syntax: "WITH cte_adi AS (\n  SELECT col1, SUM(col2) AS total FROM tbl GROUP BY col1\n)\nSELECT * FROM cte_adi WHERE total > 1000;",
    example: "WITH aylik AS (SELECT DATE_TRUNC('month', created_at) AS ay, SUM(amount) AS ciro FROM transactions GROUP BY 1) SELECT * FROM aylik;",
    tip: "İç içe spagetti alt sorguları okunabilir, modüler adımlara böler.",
  },
  {
    title: "Pencere Fonksiyonu: Sıralama (DENSE_RANK)",
    category: "Advanced",
    syntax: "DENSE_RANK() OVER (PARTITION BY grup_col ORDER BY sira_col DESC)",
    example: "SELECT name, price, DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS rnk FROM products;",
    tip: "Satırları daraltmadan her kategorinin en pahalı ilk N ürününü bulur.",
  },
  {
    title: "Pencere Fonksiyonu: Değer Kaydırma (LAG & LEAD)",
    category: "Advanced",
    syntax: "LAG(col, 1) OVER (ORDER BY tarih_col)",
    example: "SELECT ay, ciro, ciro - LAG(ciro, 1) OVER (ORDER BY ay) AS ciro_artisi FROM aylik_ciro;",
    tip: "Önceki satırın değerine erişerek Month-over-Month (MoM) büyüme hesaplatır.",
  },
  {
    title: "Pencere Fonksiyonu: Kümülatif Toplam (Running Total)",
    category: "Advanced",
    syntax: "SUM(tutar) OVER (ORDER BY tarih_col)",
    example: "SELECT id, amount, SUM(amount) OVER (ORDER BY created_at) AS biriken_toplam FROM transactions;",
    tip: "OVER parantezine ORDER BY eklendiğinde SUM otomatik kümülatif toplama dönüşür.",
  },
  {
    title: "SARGable Sorgu Kuralı (İndeks Dostu)",
    category: "Performance",
    syntax: "-- YANLIŞ: WHERE price * 1.2 > 100\n-- DOĞRU:   WHERE price > 100 / 1.2",
    example: "WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';",
    tip: "WHERE sol tarafındaki kolonu fonksiyona sokmayın, çıplak bırakın.",
  },
];

interface SqlCheatSheetDrawerProps {
  onClose: () => void;
}

export function SqlCheatSheetDrawer({ onClose }: SqlCheatSheetDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const categories = ["ALL", "DQL", "Functions", "Joins", "Advanced", "Performance"];

  const filteredItems = CHEAT_SHEET_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, idx: number) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-[#161412] border-l border-white/[0.1] w-full max-w-2xl h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-6 animate-slide-in-right">
        {/* Header */}
        <div className="space-y-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--accent-color)]">
              <FileText className="w-5 h-5" />
              <h2 className="font-extrabold text-base text-[var(--text-primary)] font-mono tracking-wider uppercase">
                SQL HIZLI SÖZDİZİMİ KOPYA KAĞIDI (CHEAT SHEET)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Tüm temel ve ileri SQL yapıları, kalıpları, örnekleri ve performans ipuçları.
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sözdizimi, fonksiyon veya ipucu ara... (ör: CTE, JOIN, DENSE_RANK)"
              className="w-full pl-9 pr-4 py-2 bg-black/40 text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl border border-white/[0.1] text-xs focus:outline-none focus:border-[var(--accent-color)] transition-colors font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/40 font-bold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2.5 relative group hover:border-[var(--accent-color)]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[var(--accent-color)] border border-white/[0.08]">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-[var(--text-primary)] font-sans">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopy(item.example, idx)}
                  className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-white/[0.08] text-[11px] flex items-center gap-1 transition-all active:scale-95"
                  title="Örnek Kodu Kopyala"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              {/* Syntax */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-[11px] text-[var(--accent-color)] overflow-x-auto whitespace-pre leading-relaxed">
                {item.syntax}
              </div>

              {/* Example */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] font-mono text-[11px] text-[var(--text-primary)] overflow-x-auto whitespace-pre leading-relaxed">
                <span className="text-[var(--text-muted)] block text-[10px] mb-0.5 font-sans">Örnek Kullanım:</span>
                {item.example}
              </div>

              {/* Tip */}
              <p className="text-[11px] text-[var(--text-muted)] italic font-sans flex items-center gap-1.5 pt-0.5">
                <Zap className="w-3 h-3 text-[var(--accent-color)] shrink-0" />
                <span>{item.tip}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>Toplam {filteredItems.length} Kalıp Listelendi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[var(--text-primary)] font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
