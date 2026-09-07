"use client";

import React, { useState } from "react";
import {
  Workflow,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Zap,
  HelpCircle,
  Database,
  Search,
  Filter,
  Eye,
  GitMerge,
  GitPullRequest,
  Clock,
  ChevronRight,
  Activity,
  Sliders,
  Award,
} from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";

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

interface AcademyVisualizerProps {
  type?: VisualizerType;
  title?: string;
}

export function AcademyVisualizer({ type = "syntax_anatomy", title }: AcademyVisualizerProps) {
  switch (type) {
    case "joins":
      return <JoinsVisualizer />;
    case "lifecycle":
      return <LifecycleVisualizer />;
    case "groupby":
      return <GroupByVisualizer />;
    case "window":
    case "ranking":
      return <WindowFunctionsVisualizer initialTab={type === "ranking" ? "ranking" : "preserve"} />;
    case "laglead":
      return <LagLeadVisualizer />;
    case "btree":
      return <BTreeVisualizer />;
    case "sargable":
      return <SargableVisualizer />;
    case "null_logic":
      return <NullLogicVisualizer />;
    case "casewhen":
      return <CaseWhenVisualizer />;
    case "sets":
      return <SetOperatorsVisualizer />;
    case "text_functions":
      return <TextFunctionsVisualizer />;
    case "date_functions":
      return <DateFunctionsVisualizer />;
    case "syntax_anatomy":
    default:
      return <SyntaxAnatomyVisualizer />;
  }
}

// ============================================================================
// 1. JOINS VISUALIZER (Venn Diagram + Interactive Row Matcher)
// ============================================================================
function JoinsVisualizer() {
  type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL" | "ANTI" | "CROSS";
  const [activeJoin, setActiveJoin] = useState<JoinType>("INNER");

  const customers = [
    { id: 1, name: "Ahmet", hasOrder: true },
    { id: 2, name: "Ayşe", hasOrder: true },
    { id: 3, name: "Mehmet (Siparişi Yok)", hasOrder: false },
  ];

  const orders = [
    { id: 101, customerId: 1, product: "MacBook", amount: "75.000 TL" },
    { id: 102, customerId: 2, product: "iPhone", amount: "65.000 TL" },
    { id: 103, customerId: 99, product: "Kulaklık (Müşterisi Silinmiş)", amount: "8.500 TL" },
  ];

  const joinDescriptions: Record<JoinType, { badge: string; desc: string; sqlSnippet: string }> = {
    INNER: {
      badge: "Kesişim Kümesi (A ∩ B)",
      desc: "Yalnızca her iki tabloda da karşılığı olan (eşleşen) kayıtları getirir. Siparişi olmayan Mehmet ve müşterisi silinmiş Sipariş #103 elenir.",
      sqlSnippet: "SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;",
    },
    LEFT: {
      badge: "Sol Tabloyu Koru (A)",
      desc: "Sol tablodaki (Müşteriler) TÜM kayıtları korur. Sağ tabloda eşleşme yoksa (Mehmet gibi) sipariş kolonlarına otomatik NULL yazar.",
      sqlSnippet: "SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;",
    },
    RIGHT: {
      badge: "Sağ Tabloyu Koru (B)",
      desc: "Sağ tablodaki (Siparişler) TÜM kayıtları korur. Müşterisi silinmiş olan Sipariş #103 kaybolmaz, müşteri kolonları NULL gelir.",
      sqlSnippet: "SELECT * FROM customers c RIGHT JOIN orders o ON c.id = o.customer_id;",
    },
    FULL: {
      badge: "Tam Birleşim (A ∪ B)",
      desc: "İki tablodaki HER ŞEYİ birleştirir. Eşleşenler yan yana gelir, eşleşmeyen taraflar NULL ile tamamlanır. Hiçbir veri kaybolmaz.",
      sqlSnippet: "SELECT * FROM customers c FULL OUTER JOIN orders o ON c.id = o.customer_id;",
    },
    ANTI: {
      badge: "Anti-Join (İlişkisi Olmayanlar)",
      desc: "Sol tabloda olup sağda HİÇ eşleşmesi bulunmayanları ('Hiç sipariş vermemiş müşteriler') bulur. WHERE o.id IS NULL filtresiyle elde edilir.",
      sqlSnippet: "SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;",
    },
    CROSS: {
      badge: "Kartezyen Çarpım (A x B)",
      desc: "Sol tablodaki her bir satırı sağ tablodaki HER satırla çarpar (3 x 3 = 9 satır). ON koşulu yoktur; tüm permütasyonları türetir.",
      sqlSnippet: "SELECT * FROM customers CROSS JOIN orders;",
    },
  };

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <GitMerge className="w-5 h-5" />
          <span className="font-extrabold text-xs font-mono uppercase tracking-wider">
            İnteraktif JOIN Görselleştirici & Satır Eşleştirici
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[var(--text-muted)] border border-white/[0.08]">
          {joinDescriptions[activeJoin].badge}
        </span>
      </div>

      {/* Join Type Switcher Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs font-mono font-bold">
        {(["INNER", "LEFT", "RIGHT", "FULL", "ANTI", "CROSS"] as JoinType[]).map((j) => (
          <button
            key={j}
            onClick={() => {
              setActiveJoin(j);
              soundEffects.playClick();
            }}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              activeJoin === j
                ? "bg-[var(--accent-color)] text-black shadow-lg shadow-[var(--accent-color)]/20 scale-[1.02]"
                : "bg-white/[0.04] text-[var(--text-muted)] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
            }`}
          >
            {j} JOIN
          </button>
        ))}
      </div>

      {/* Visual Venn / Concept Card */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <p className="text-[var(--text-primary)] leading-relaxed font-sans">
          {joinDescriptions[activeJoin].desc}
        </p>
        <code className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.1] text-[var(--accent-color)] font-mono text-[11px] whitespace-nowrap shrink-0">
          {joinDescriptions[activeJoin].sqlSnippet}
        </code>
      </div>

      {/* Interactive Tables & Connector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Table: Customers */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--accent-color)] pb-1 border-b border-white/[0.06]">
            <span>Sol Tablo: customers (A)</span>
            <span className="text-[10px] text-[var(--text-muted)]">3 Kayıt</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {customers.map((c) => {
              const isIncluded =
                activeJoin === "INNER"
                  ? c.hasOrder
                  : activeJoin === "LEFT" || activeJoin === "FULL" || activeJoin === "CROSS"
                  ? true
                  : activeJoin === "RIGHT"
                  ? c.hasOrder
                  : !c.hasOrder; // ANTI

              return (
                <div
                  key={c.id}
                  className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                    isIncluded
                      ? "bg-amber-500/15 border-amber-500/40 text-[var(--text-primary)]"
                      : "bg-white/[0.02] border-white/[0.04] text-[var(--text-muted)] opacity-40 line-through"
                  }`}
                >
                  <span>
                    id: <strong>{c.id}</strong> | {c.name}
                  </span>
                  {isIncluded ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Dahil
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      Elendi
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Table: Orders */}
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-400 pb-1 border-b border-white/[0.06]">
            <span>Sağ Tablo: orders (B)</span>
            <span className="text-[10px] text-[var(--text-muted)]">3 Kayıt</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {orders.map((o) => {
              const hasCustomer = o.customerId !== 99;
              const isIncluded =
                activeJoin === "INNER"
                  ? hasCustomer
                  : activeJoin === "LEFT"
                  ? hasCustomer
                  : activeJoin === "RIGHT" || activeJoin === "FULL" || activeJoin === "CROSS"
                  ? true
                  : false; // ANTI keeps orders as NULL

              return (
                <div
                  key={o.id}
                  className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                    isIncluded
                      ? "bg-orange-500/15 border-orange-500/40 text-[var(--text-primary)]"
                      : "bg-white/[0.02] border-white/[0.04] text-[var(--text-muted)] opacity-40 line-through"
                  }`}
                >
                  <span>
                    #{o.id} (cust:{o.customerId}) | {o.product}
                  </span>
                  {isIncluded ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      Dahil
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      Elendi
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulated Output Table */}
      <div className="p-3.5 rounded-xl bg-black/80 border border-white/[0.1] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
          <span>{activeJoin} JOIN Sonuç Çıktısı (Simülasyon):</span>
          <span className="text-[10px] text-[var(--text-muted)]">Canlı Eşleşme</span>
        </div>
        <div className="overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.1] text-[var(--text-muted)] text-[11px]">
                <th className="p-1.5">c.id</th>
                <th className="p-1.5">c.name</th>
                <th className="p-1.5">o.id</th>
                <th className="p-1.5">o.product</th>
                <th className="p-1.5">o.amount</th>
                <th className="p-1.5">Eşleşme Notu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[var(--text-primary)]">
              {(activeJoin === "INNER" || activeJoin === "LEFT" || activeJoin === "FULL") && (
                <>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-1.5 text-amber-400 font-bold">1</td>
                    <td className="p-1.5">Ahmet</td>
                    <td className="p-1.5 text-orange-400 font-bold">#101</td>
                    <td className="p-1.5">MacBook</td>
                    <td className="p-1.5">75.000 TL</td>
                    <td className="p-1.5 text-emerald-400 text-[10px]">Tam Eşleşti</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-1.5 text-amber-400 font-bold">2</td>
                    <td className="p-1.5">Ayşe</td>
                    <td className="p-1.5 text-orange-400 font-bold">#102</td>
                    <td className="p-1.5">iPhone</td>
                    <td className="p-1.5">65.000 TL</td>
                    <td className="p-1.5 text-emerald-400 text-[10px]">Tam Eşleşti</td>
                  </tr>
                </>
              )}

              {(activeJoin === "LEFT" || activeJoin === "FULL" || activeJoin === "ANTI") && (
                <tr className="hover:bg-white/[0.02] bg-amber-500/5">
                  <td className="p-1.5 text-amber-400 font-bold">3</td>
                  <td className="p-1.5">Mehmet</td>
                  <td className="p-1.5 text-rose-400 italic">NULL</td>
                  <td className="p-1.5 text-rose-400 italic">NULL</td>
                  <td className="p-1.5 text-rose-400 italic">NULL</td>
                  <td className="p-1.5 text-amber-400 text-[10px]">Sol korundu, sipariş yok</td>
                </tr>
              )}

              {(activeJoin === "RIGHT" || activeJoin === "FULL") && (
                <>
                  {activeJoin === "RIGHT" && (
                    <>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-1.5 text-amber-400 font-bold">1</td>
                        <td className="p-1.5">Ahmet</td>
                        <td className="p-1.5 text-orange-400 font-bold">#101</td>
                        <td className="p-1.5">MacBook</td>
                        <td className="p-1.5">75.000 TL</td>
                        <td className="p-1.5 text-emerald-400 text-[10px]">Tam Eşleşti</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-1.5 text-amber-400 font-bold">2</td>
                        <td className="p-1.5">Ayşe</td>
                        <td className="p-1.5 text-orange-400 font-bold">#102</td>
                        <td className="p-1.5">iPhone</td>
                        <td className="p-1.5">65.000 TL</td>
                        <td className="p-1.5 text-emerald-400 text-[10px]">Tam Eşleşti</td>
                      </tr>
                    </>
                  )}
                  <tr className="hover:bg-white/[0.02] bg-orange-500/5">
                    <td className="p-1.5 text-rose-400 italic">NULL</td>
                    <td className="p-1.5 text-rose-400 italic">NULL</td>
                    <td className="p-1.5 text-orange-400 font-bold">#103</td>
                    <td className="p-1.5">Kulaklık</td>
                    <td className="p-1.5">8.500 TL</td>
                    <td className="p-1.5 text-orange-400 text-[10px]">Sağ korundu, müşteri yok</td>
                  </tr>
                </>
              )}

              {activeJoin === "CROSS" && (
                <tr>
                  <td colSpan={6} className="p-2 text-center text-[var(--accent-color)] text-xs">
                    3 müşteri x 3 sipariş = Toplam <strong>9 kartezyen satır</strong> üretilir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. LIFECYCLE PIPELINE VISUALIZER (Query Execution Order)
// ============================================================================
function LifecycleVisualizer() {
  const steps = [
    {
      num: 1,
      clause: "FROM & JOIN",
      title: "Veri Kaynağı Masaya Yatırılır",
      desc: "Disk veya bellekten tablolar okunur, JOIN koşullarına göre birleştirilir. Henüz hiçbir filtre uygulanmamıştır.",
      memoryState: "Tüm satırlar ve kolonlar ham haliyle hafızadadır.",
      whyRule: "Veritabanı önce 'Ben hangi verilerle konuşuyorum?' sorusunu cevaplamak zorundadır.",
    },
    {
      num: 2,
      clause: "WHERE",
      title: "Satır Bazlı Filtreleme (Elek)",
      desc: "Tek tek satırlar test edilir. Koşulu sağlamayanlar (FALSE veya NULL) anında elenir ve sonraki adımlara aktarılmaz.",
      memoryState: "Yalnızca şartı sağlayan filtrelenmiş satırlar kalır.",
      whyRule: "SELECT henüz çalışmadığı için WHERE içinde kolon ALIAS (takma adı) KULLANILAMAZ!",
    },
    {
      num: 3,
      clause: "GROUP BY",
      title: "Kovalara Ayırma (Gruplama)",
      desc: "Kalan satırlar belirtilen kolonların (ör: sehir, kategori) ortak değerlerine göre kovalara (kümelere) bölünür.",
      memoryState: "Bireysel satırlar kovalara girer; doğrudan tekil satır detayları saklanmaz.",
      whyRule: "SELECT listesindeki aggregate edilmemiş tüm kolonlar GROUP BY'da olmak zorundadır.",
    },
    {
      num: 4,
      clause: "HAVING",
      title: "Grup Özetlerini Filtreleme",
      desc: "Gruplama tamamlandıktan sonra grup toplamları/ortalamaları test edilir (ör: COUNT(*) >= 5).",
      memoryState: "Kriteri sağlamayan koca kümeler çöpe atılır.",
      whyRule: "WHERE satırları, HAVING ise küme toplamlarını eler.",
    },
    {
      num: 5,
      clause: "SELECT & WINDOW",
      title: "Projeksiyon & Hesaplama",
      desc: "Hangi kolonların ekrana basılacağı nihayet belirlenir. Fonksiyonlar, matematik ve Window Functions hesaplanır. ALIAS'lar burada doğar!",
      memoryState: "Yalnızca ekrana yansıtılacak nihai kolonlar seçilir.",
      whyRule: "Tanımlanan takma adlar (AS ciro_tl) bu adımdan itibaren belleğe yazılır.",
    },
    {
      num: 6,
      clause: "DISTINCT",
      title: "Tekilleştirme",
      desc: "SELECT çıktısındaki satırlardan birbirinin tıpatıp aynısı olan kopyalar elenir (gizli SORT maliyeti).",
      memoryState: "Benzersiz satır kümesi kalır.",
      whyRule: "Tüm seçilen kolonların kombinasyonunu tekilleştirir.",
    },
    {
      num: 7,
      clause: "ORDER BY",
      title: "Sıralama",
      desc: "Çıktı küçükten büyüğe (ASC) veya büyükten küçüğe (DESC) dizilir.",
      memoryState: "Sıralı sonuç dizisi oluşturulur.",
      whyRule: "SELECT'ten sonra çalıştığı için SELECT'te tanımlanan ALIAS'lar burada KULLANILABİLİR!",
    },
    {
      num: 8,
      clause: "LIMIT / OFFSET",
      title: "Sayfalama & Dilim Kesme",
      desc: "Sıralanmış listenin başından N kayıt alınır (LIMIT) veya ilk K kayıt atlanır (OFFSET).",
      memoryState: "İstemciye yalnızca istenen sayfa dilimi gönderilir.",
      whyRule: "Tüm işlemler bittikten sonra en son uygulandığı için ağ trafiğini düşürür.",
    },
  ];

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = steps[activeStepIdx];

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Workflow className="w-5 h-5" />
          <span className="font-extrabold text-xs font-mono uppercase tracking-wider">
            Sorgu Yürütme Sırası (Query Execution Lifecycle)
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          Yazma Sırası ≠ Motorun Çalıştırma Sırası
        </span>
      </div>

      {/* Interactive Horizontal Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === activeStepIdx;
          const isPassed = idx < activeStepIdx;

          return (
            <button
              key={s.num}
              onClick={() => {
                setActiveStepIdx(idx);
                soundEffects.playClick();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                isActive
                  ? "bg-[var(--accent-color)] text-black border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/25 scale-[1.03] z-10"
                  : isPassed
                  ? "bg-white/[0.06] text-white border-white/[0.15]"
                  : "bg-black/40 text-[var(--text-muted)] border-white/[0.06] hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>Adım {s.num}</span>
                {isPassed && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-xs font-bold font-mono truncate">{s.clause}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] space-y-3 animate-fade-in-up">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-black font-mono font-extrabold text-xs">
              {activeStep.num}. ADIM: {activeStep.clause}
            </span>
            <h4 className="font-extrabold text-sm text-[var(--text-primary)] font-sans">
              {activeStep.title}
            </h4>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={activeStepIdx === 0}
              onClick={() => setActiveStepIdx((p) => p - 1)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono disabled:opacity-30"
            >
              ← Önceki
            </button>
            <button
              disabled={activeStepIdx === steps.length - 1}
              onClick={() => setActiveStepIdx((p) => p + 1)}
              className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/30 text-[var(--accent-color)] text-xs font-mono font-bold disabled:opacity-30"
            >
              Sonraki →
            </button>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed font-sans">
          {activeStep.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <Database className="w-3.5 h-3.5" />
              <span>Hafızadaki Durum:</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">{activeStep.memoryState}</p>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Kritik Kural / Püf Noktası:</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">{activeStep.whyRule}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. GROUP BY & HAVING BUCKETING SIMULATOR
// ============================================================================
function GroupByVisualizer() {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Layers className="w-5 h-5" />
          <span className="font-extrabold text-xs font-mono uppercase tracking-wider">
            GROUP BY & HAVING: Verilerin Kovalara Ayrılma Aşamaları
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStage(s as any);
                soundEffects.playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                stage === s
                  ? "bg-[var(--accent-color)] text-black"
                  : "bg-white/[0.04] text-[var(--text-muted)] hover:bg-white/[0.08]"
              }`}
            >
              Aşama {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Explanations */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-sans">
        {stage === 1 && (
          <p>
            <strong>Aşama 1 (Ham Tablo):</strong> 6 farklı ürün masada duruyor. Farklı kategorilerde ve farklı fiyatlarda.
          </p>
        )}
        {stage === 2 && (
          <p>
            <strong>Aşama 2 (WHERE price &gt;= 10.000):</strong> Satır bazlı filtre çalıştı. 10.000 TL altındaki ucuz ürünler (AirPods ve Mouse) gruplamaya bile girmeden anında elendi!
          </p>
        )}
        {stage === 3 && (
          <p>
            <strong>Aşama 3 (GROUP BY category_id):</strong> Kalan ürünler kategorilerine göre ayrı kovalara (buckets) dağıtıldı.
          </p>
        )}
        {stage === 4 && (
          <p>
            <strong>Aşama 4 (Aggregate & HAVING COUNT(*) &gt;= 2):</strong> Her kovadaki ürünler toplanıp tek satıra indirgendi. HAVING yalnızca en az 2 ürünü olan kategorileri korudu!
          </p>
        )}
      </div>

      {/* Buckets Simulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bucket 1: Laptops */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 pb-1 border-b border-amber-500/20">
            <span>Kategori 1: Laptop & Bilgisayar</span>
            <span className="text-[11px]">2 Ürün</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>MacBook Pro 16</span>
              <span className="text-emerald-400">75.000 TL</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>Dell XPS 15</span>
              <span className="text-emerald-400">52.000 TL</span>
            </div>
          </div>
          {stage === 4 && (
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono mt-2">
              ✓ ÖZET: Toplam 2 Ürün | Toplam Ciro: 127.000 TL (HAVING'i Geçti)
            </div>
          )}
        </div>

        {/* Bucket 2: Audio */}
        <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-400 pb-1 border-b border-orange-500/20">
            <span>Kategori 4: Ses & Kulaklık</span>
            <span className="text-[11px]">{stage >= 2 ? "1 Ürün (1'i Elendi)" : "2 Ürün"}</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between">
              <span>Sony WH-1000XM5</span>
              <span className="text-emerald-400">12.500 TL</span>
            </div>
            <div
              className={`p-2 rounded bg-black/40 border border-white/[0.04] flex justify-between ${
                stage >= 2 ? "opacity-30 line-through text-rose-400" : ""
              }`}
            >
              <span>AirPods Pro 2</span>
              <span>8.500 TL (WHERE ile Elendi)</span>
            </div>
          </div>
          {stage === 4 && (
            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono mt-2">
              ✗ ELENDİ: Yalnızca 1 ürünü kaldığı için 'HAVING COUNT(*) &gt;= 2' şartını sağlayamadı!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. WINDOW FUNCTIONS VISUALIZER (Preserve Rows vs Collapse + Ranking)
// ============================================================================
function WindowFunctionsVisualizer({ initialTab = "preserve" }: { initialTab?: "preserve" | "ranking" }) {
  const [tab, setTab] = useState<"preserve" | "ranking">(initialTab);

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Award className="w-5 h-5" />
          <span className="font-extrabold text-xs font-mono uppercase tracking-wider">
            Window Functions: Satır Koruma ve Sıralama Matrisi
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
          <button
            onClick={() => setTab("preserve")}
            className={`px-3 py-1 rounded-lg transition-all ${
              tab === "preserve"
                ? "bg-[var(--accent-color)] text-black"
                : "bg-white/[0.04] text-[var(--text-muted)]"
            }`}
          >
            Satır Koruma Mantığı
          </button>
          <button
            onClick={() => setTab("ranking")}
            className={`px-3 py-1 rounded-lg transition-all ${
              tab === "ranking"
                ? "bg-[var(--accent-color)] text-black"
                : "bg-white/[0.04] text-[var(--text-muted)]"
            }`}
          >
            Olimpiyat Sıralaması (Rank vs Dense)
          </button>
        </div>
      </div>

      {tab === "preserve" ? (
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-sans">
            <strong>Altın Kural:</strong> GROUP BY yaptığınızda 100 satırlık tablo 5 satıra düşer ve tekil satır bilgilerini kaybedersiniz. Window Functions ise TÜM satırları korur, her satırın yanına hesaplanmış analitik pencere kolonunu ekler.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GROUP BY Example */}
            <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/5 space-y-2 font-mono text-xs">
              <span className="font-bold text-rose-400 block">GROUP BY category_id</span>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                Satırlar birleşir, tek tek ürün adları kaybolur:
              </p>
              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-white/[0.1] text-[10px] text-[var(--text-muted)]">
                    <th className="p-1">category_id</th>
                    <th className="p-1">AVG(price)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 text-amber-400 font-bold">1 (Laptops)</td>
                    <td className="p-1">63.500 TL</td>
                  </tr>
                  <tr>
                    <td className="p-1 text-orange-400 font-bold">2 (Phones)</td>
                    <td className="p-1">55.000 TL</td>
                  </tr>
                </tbody>
              </table>
              <span className="text-[10px] text-rose-300 block pt-1">
                ⚠️ Hangi ürünün kaç para olduğunu artık göremiyoruz!
              </span>
            </div>

            {/* Window Functions Example */}
            <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-2 font-mono text-xs">
              <span className="font-bold text-emerald-400 block">AVG(price) OVER (PARTITION BY category_id)</span>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                Tüm ürünler korunur, yanlarına kategori ortalaması ve fark eklenir:
              </p>
              <table className="w-full text-left border-collapse mt-2 text-[11px]">
                <thead>
                  <tr className="border-b border-white/[0.1] text-[10px] text-[var(--text-muted)]">
                    <th className="p-1">Ürün</th>
                    <th className="p-1">Fiyat</th>
                    <th className="p-1">Kat. Ort.</th>
                    <th className="p-1">Fark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 font-bold text-white">MacBook 16</td>
                    <td className="p-1">75.000</td>
                    <td className="p-1 text-emerald-400">63.500</td>
                    <td className="p-1 text-emerald-300">+11.500</td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold text-white">Dell XPS 15</td>
                    <td className="p-1">52.000</td>
                    <td className="p-1 text-emerald-400">63.500</td>
                    <td className="p-1 text-rose-300">-11.500</td>
                  </tr>
                </tbody>
              </table>
              <span className="text-[10px] text-emerald-300 block pt-1">
                ✓ Hem ürünün kendi fiyatı hem grup ortalaması aynı satırda!
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-sans">
            İki yarışmacı aynı puanı aldığında (Örn: 90 puan eşitliği) üç fonksiyonun nasıl davrandığına dikkat edin:
          </p>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.1] text-[var(--text-muted)] text-[11px]">
                  <th className="p-2">Yarışmacı</th>
                  <th className="p-2">Puan</th>
                  <th className="p-2 text-sky-400">ROW_NUMBER()</th>
                  <th className="p-2 text-amber-400">RANK()</th>
                  <th className="p-2 text-emerald-400">DENSE_RANK()</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[var(--text-primary)]">
                <tr>
                  <td className="p-2 font-bold">1. Can (Altın)</td>
                  <td className="p-2">100</td>
                  <td className="p-2 text-sky-400 font-bold">1</td>
                  <td className="p-2 text-amber-400 font-bold">1</td>
                  <td className="p-2 text-emerald-400 font-bold">1</td>
                </tr>
                <tr className="bg-amber-500/10">
                  <td className="p-2 font-bold">2. Ahmet (Gümüş)</td>
                  <td className="p-2">90</td>
                  <td className="p-2 text-sky-400 font-bold">2</td>
                  <td className="p-2 text-amber-400 font-bold">2</td>
                  <td className="p-2 text-emerald-400 font-bold">2</td>
                </tr>
                <tr className="bg-amber-500/10">
                  <td className="p-2 font-bold">3. Mehmet (Gümüş - Eşitlik)</td>
                  <td className="p-2">90</td>
                  <td className="p-2 text-sky-400 font-bold">3 (Foto-finiş)</td>
                  <td className="p-2 text-amber-400 font-bold">2 (Paylaştı)</td>
                  <td className="p-2 text-emerald-400 font-bold">2 (Paylaştı)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">4. Zeynep</td>
                  <td className="p-2">80</td>
                  <td className="p-2 text-sky-400 font-bold">4</td>
                  <td className="p-2 text-amber-400 font-bold text-rose-400">4 (3 Atlandı!)</td>
                  <td className="p-2 text-emerald-400 font-bold">3 (Atlamadı)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. LAG / LEAD VISUALIZER
// ============================================================================
function LagLeadVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Activity className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
            Zaman Makinesi: LAG (Geçmiş) & LEAD (Gelecek) Mantığı
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">Month-over-Month (MoM) Analitiği</span>
      </div>

      <p className="text-xs text-[var(--text-primary)] font-sans leading-relaxed">
        LAG fonksiyonu kendinden önceki satıra bakar. Tabloları kendiyle zorla bağlamadan (Self Join yapmadan) geçen ayın cirosuna anında erişir:
      </p>

      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between">
          <span>Ocak 2024: 100.000 TL</span>
          <span className="text-[var(--text-muted)] italic">LAG(ciro, 1) = NULL (Öncesi yok)</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-white">Baz Ay</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <span className="font-bold text-white">Şubat 2024: 150.000 TL</span>
          <span className="text-amber-400 font-bold">LAG(ciro, 1) = 100.000 TL ➔ Fark: +50.000 TL</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
            +%50 Büyüme
          </span>
        </div>

        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
          <span className="font-bold text-white">Mart 2024: 180.000 TL</span>
          <span className="text-orange-400 font-bold">LAG(ciro, 1) = 150.000 TL ➔ Fark: +30.000 TL</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
            +%20 Büyüme
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. B-TREE INDEX VISUALIZER
// ============================================================================
function BTreeVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Search className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
            B-Tree İndeks vs Seq Scan: 1 Milyon Satırda Arama Farkı
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
          O(log N) vs O(N)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Seq Scan */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
          <div className="flex items-center justify-between text-rose-400 font-bold">
            <span>İndekssiz (Sequential Scan)</span>
            <span>2.500 ms</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
            Kitabın fihristi yoktur. 'Zeynep' ismini bulmak için 1. sayfadan başlar, 1.000.000 sayfanın hepsini tek tek okur. Disk I/O tavan yapar, sunucu kilitlenir.
          </p>
          <div className="p-2 rounded bg-black/40 border border-white/[0.06] text-rose-300 text-[11px]">
            1.000.000 Blok Okundu ➔ YAVAŞ!
          </div>
        </div>

        {/* Index Scan */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>B-Tree (Index Scan)</span>
            <span>1.2 ms</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
            Kök düğümden [N-Z] dalına, oradan [U-Z] yaprağına ve doğrudan Zeynep'in disk işaretçisine (TID) 3 zıplamada ulaşır.
          </p>
          <div className="p-2 rounded bg-black/40 border border-white/[0.06] text-emerald-300 text-[11px]">
            Sadece 3 Disk Okuması ➔ IŞIK HIZINDA!
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. SARGABLE QUERY VISUALIZER
// ============================================================================
function SargableVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Zap className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
            SARGable Kuralı: İndeksi Öldüren ve İndeksi Yaşatan Yazımlar
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-400">Search Argument Able</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <X className="w-4 h-4" />
            <span>NON-SARGABLE (İndeksi Devre Dışı Bırakır)</span>
          </div>
          <div className="p-2.5 rounded bg-black/70 text-rose-200 text-[11px] leading-relaxed">
            WHERE YEAR(created_at) = 2024<br />
            WHERE price * 1.2 &gt; 12000<br />
            WHERE email LIKE '%@gmail.com'
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            Kolon fonksiyona sokulduğu için motor her bir satırı hesaplamak zorundadır ve B-Tree indeksini çöpe atar.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Check className="w-4 h-4" />
            <span>SARGABLE (İndeksi Tam Güçle Kullanır)</span>
          </div>
          <div className="p-2.5 rounded bg-black/70 text-emerald-200 text-[11px] leading-relaxed">
            WHERE created_at &gt;= '2024-01-01' AND created_at &lt; '2025-01-01'<br />
            WHERE price &gt; 12000 / 1.2<br />
            WHERE email LIKE 'ahmet%'
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            Sol taraftaki kolon çıplak bırakılmıştır; matematik sağ taraftaki sabite uygulanmıştır. İndeks anında tetiklenir!
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. 3-VALUED NULL LOGIC VISUALIZER
// ============================================================================
function NullLogicVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <HelpCircle className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
            SQL Üç Değerli Mantık Matrisi (TRUE, FALSE, UNKNOWN)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">NULL = Bilinmeyen</span>
      </div>

      <p className="text-xs text-[var(--text-primary)] font-sans leading-relaxed">
        NULL bir 'değer' (0 veya boşluk) değildir. 'Bilinmeyen' bir durumdur. Bu yüzden iki bilinmeyenin eşitliği de bilinemez:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
          <span className="text-rose-400 font-bold block">SELECT NULL = NULL;</span>
          <span className="text-amber-400 font-bold block">Sonuç: UNKNOWN (NULL)</span>
          <p className="text-[10px] text-[var(--text-muted)] font-sans">İki kapalı kutunun içi bilinemez.</p>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
          <span className="text-emerald-400 font-bold block">SELECT NULL IS NULL;</span>
          <span className="text-emerald-400 font-bold block">Sonuç: TRUE (Doğru)</span>
          <p className="text-[10px] text-[var(--text-muted)] font-sans">Kutunun kapalı olduğu gerçektir.</p>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
          <span className="text-sky-400 font-bold block">COALESCE(NULL, 'Yok')</span>
          <span className="text-sky-400 font-bold block">Sonuç: 'Yok'</span>
          <p className="text-[10px] text-[var(--text-muted)] font-sans">İlk NULL olmayan değeri döner.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. CASE WHEN DECISION TREE VISUALIZER
// ============================================================================
function CaseWhenVisualizer() {
  const [testAmount, setTestAmount] = useState(35000);

  const getTier = (amt: number) => {
    if (amt >= 50000) return { label: "VIP Platinum Müşteri", color: "text-amber-400", bg: "bg-amber-500/10" };
    if (amt >= 15000) return { label: "Orta Ölçek Kurumsal", color: "text-orange-400", bg: "bg-orange-500/10" };
    return { label: "Standart Bireysel", color: "text-emerald-400", bg: "bg-emerald-500/10" };
  };

  const tier = getTier(testAmount);

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Sliders className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
            İnteraktif CASE WHEN Karar Ağacı Simülatörü
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">Yukarıdan Aşağıya Değerlendirme</span>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-xs font-mono text-[var(--text-muted)]">Harcama Tutarı: {testAmount.toLocaleString("tr-TR")} TL</label>
        <input
          type="range"
          min="1000"
          max="80000"
          step="1000"
          value={testAmount}
          onChange={(e) => setTestAmount(Number(e.target.value))}
          className="flex-1 accent-[var(--accent-color)]"
        />
      </div>

      <div className={`p-4 rounded-xl border border-white/[0.1] ${tier.bg} flex items-center justify-between font-mono text-xs`}>
        <span>Sorgu Çıktı Etiketi:</span>
        <span className={`font-bold text-sm ${tier.color}`}>{tier.label}</span>
      </div>
    </div>
  );
}

// ============================================================================
// 10. SET OPERATORS (UNION vs UNION ALL)
// ============================================================================
function SetOperatorsVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <GitPullRequest className="w-5 h-5" />
          <span className="font-extrabold text-xs uppercase tracking-wider">
            Küme Operatörleri: UNION vs UNION ALL Hız Karşılaştırması
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
          <span className="font-bold text-amber-400 block">UNION (Tekrarsız - Yavaş)</span>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            İki sorgunun sonucunu birleştirir, ardına gizli bir SORT + DISTINCT çalıştırarak kopyaları eler. Büyük tablolarda belleği zorlar.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2">
          <span className="font-bold text-emerald-400 block">UNION ALL (Tüm Satırlar - Hızlı!)</span>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            Tekilleştirme yapmaz, iki listenin satırlarını doğrudan alt alta yapıştırır. Hiçbir sıralama maliyeti yoktur, 10 kat daha hızlıdır.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. TEXT & STRING FUNCTIONS VISUALIZER
// ============================================================================
function TextFunctionsVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-[var(--accent-color)] pb-2 border-b border-white/[0.08]">
        <Sparkles className="w-4 h-4" />
        <span className="font-extrabold text-xs uppercase tracking-wider">
          Metin Manipülasyon Fabrikası (String Pipeline)
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        <span className="p-2 rounded bg-black/60 border border-white/[0.1] text-[var(--text-muted)]">
          Ham Giriş: &quot;  ahmet YILMAZ  &quot;
        </span>
        <ArrowRight className="w-4 h-4 text-[var(--accent-color)]" />
        <span className="p-2 rounded bg-black/60 border border-white/[0.1] text-amber-400">
          TRIM(...) ➔ &quot;ahmet YILMAZ&quot;
        </span>
        <ArrowRight className="w-4 h-4 text-[var(--accent-color)]" />
        <span className="p-2 rounded bg-black/60 border border-white/[0.1] text-emerald-400">
          INITCAP(...) ➔ &quot;Ahmet Yılmaz&quot;
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// 12. DATE & TIME FUNCTIONS VISUALIZER
// ============================================================================
function DateFunctionsVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-[var(--accent-color)] pb-2 border-b border-white/[0.08]">
        <Clock className="w-4 h-4" />
        <span className="font-extrabold text-xs uppercase tracking-wider">
          Tarih Budama Makası (DATE_TRUNC Mantığı)
        </span>
      </div>

      <p className="text-xs text-[var(--text-primary)] font-sans">
        DATE_TRUNC belirtilen zaman seviyesinin altındaki gün, saat ve dakikayı sıfırlayarak dönemin 1. anına kilitler:
      </p>

      <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] space-y-1">
        <div>Ham Tarih: <span className="text-[var(--text-muted)]">2026-09-15 14:35:22</span></div>
        <div>DATE_TRUNC(&apos;month&apos;, ...) ➔ <span className="text-amber-400 font-bold">2026-09-01 00:00:00</span></div>
        <div>DATE_TRUNC(&apos;year&apos;, ...)  ➔ <span className="text-emerald-400 font-bold">2026-01-01 00:00:00</span></div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. SYNTAX ANATOMY VISUALIZER (Default)
// ============================================================================
function SyntaxAnatomyVisualizer() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-black/50 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-[var(--accent-color)]">
          <Workflow className="w-5 h-5" />
          <span className="font-extrabold text-xs font-mono uppercase tracking-wider">
            SQL Sorgusunun Anatomisi & Renk Kodlu Parçaları
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">Temel Yapı Taşları</span>
      </div>

      <div className="p-4 rounded-xl bg-black/70 border border-white/[0.08] font-mono text-xs leading-loose space-y-1">
        <div>
          <span className="text-amber-400 font-bold">SELECT</span> name, price, stock_quantity{" "}
          <span className="text-[var(--text-muted)] text-[10px]">-- 1. Projeksiyon (Hangi kolonlar gelsin?)</span>
        </div>
        <div>
          <span className="text-orange-400 font-bold">FROM</span> products{" "}
          <span className="text-[var(--text-muted)] text-[10px]">-- 2. Veri Kaynağı (Hangi tablodan?)</span>
        </div>
        <div>
          <span className="text-emerald-400 font-bold">WHERE</span> price &gt;= 5000 AND is_active = true{" "}
          <span className="text-[var(--text-muted)] text-[10px]">-- 3. Satır Filtresi (Kimler geçsin?)</span>
        </div>
        <div>
          <span className="text-sky-400 font-bold">ORDER BY</span> price DESC{" "}
          <span className="text-[var(--text-muted)] text-[10px]">-- 4. Sıralama (Pahalıdan ucuza)</span>
        </div>
        <div>
          <span className="text-purple-400 font-bold">LIMIT</span> 5;{" "}
          <span className="text-[var(--text-muted)] text-[10px]">-- 5. Kesme (İlk 5 ürünü getir)</span>
        </div>
      </div>
    </div>
  );
}

