"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WORLDS } from "@/lib/data/worlds";
import { CHALLENGES } from "@/lib/data/challenges";
import { useUserStore } from "@/lib/state/user-store";
import {
  Play,
  CheckCircle2,
  Lock,
  Zap,
  Flame,
  Trophy,
  ArrowRight,
  Compass,
  Filter,
  ArrowDownUp,
  Sparkles,
  Calculator,
  Layers,
  GitFork,
  Sliders,
  Boxes,
  GitMerge,
  Calendar,
  Network,
  Gauge,
  TrendingUp,
  Skull,
  BookOpen,
  Terminal,
  Cpu,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Compass,
  Filter,
  ArrowDownUp,
  Sparkles,
  Calculator,
  Layers,
  GitFork,
  Sliders,
  Boxes,
  Intersect: GitMerge,
  Calendar,
  Network,
  Gauge,
  TrendingUp,
  Skull,
};

const WORKSTATION_SCENARIOS = [
  {
    id: "fraud",
    title: "01. Finansal Transfer Anomalisi",
    badge: "Fintech Forensics",
    sql: `SELECT u.full_name, t.amount, t.created_at
FROM transactions t
INNER JOIN accounts a ON t.from_account_id = a.id
INNER JOIN users u ON a.user_id = u.id
WHERE t.amount >= 150000;`,
    execTime: "4ms",
    resultRows: [
      { name: "Volkan Demirtaş", amount: "₺220,000.00", time: "03:10:00" },
      { name: "Hakan Güler", amount: "₺350,000.00", time: "03:45:00" },
    ],
  },
  {
    id: "vip",
    title: "02. Müşteri Segmentasyonu",
    badge: "E-Commerce Analytics",
    sql: `WITH customer_spent AS (
  SELECT customer_id, SUM(total_amount) AS total
  FROM orders GROUP BY customer_id
)
SELECT * FROM customer_spent
WHERE total > 50000;`,
    execTime: "6ms",
    resultRows: [
      { name: "Müşteri #1 (Ahmet Yılmaz)", amount: "₺94,300.00", time: "3 Sipariş" },
      { name: "Müşteri #7 (Burak Koç)", amount: "₺99,000.00", time: "1 Sipariş" },
    ],
  },
  {
    id: "murder",
    title: "03. Erişim Günlükleri & Güvenlik",
    badge: "Forensic Audit",
    sql: `SELECT s.name, s.plate_number
FROM suspects s
JOIN security_logs l ON s.id = l.suspect_id
WHERE s.hair_color = 'black'
  AND l.checkpoint = 'Parking B2';`,
    execTime: "3ms",
    resultRows: [
      { name: "Tarik Menguc (Admin)", amount: "Boy: 185cm", time: "Plaka: 34 HCK 999" },
    ],
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const { xp, level, currentStreak, completedChallenges, unlockedWorlds } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scenario = WORKSTATION_SCENARIOS[selectedScenarioIdx];
  const solvedIds = Object.keys(completedChallenges || {});
  const totalChallengesCount = CHALLENGES.length;
  const solvedCount = solvedIds.length;
  const overallProgressPercent = Math.round((solvedCount / totalChallengesCount) * 100);

  const nextChallenge = CHALLENGES.find((c) => !solvedIds.includes(c.id)) || CHALLENGES[0];

  const chapters = [
    {
      act: "BÖLÜM I",
      category: "Fundamentals",
      title: "TEMEL VERİ SORGULAMA & PROJEKSİYON",
      desc: "SELECT, WHERE koşullu filtreleme, sıralama ve veri temizleme temelleri.",
    },
    {
      act: "BÖLÜM II",
      category: "Intermediate",
      title: "İLİŞKİSEL MODELLEME & AGREGASYON",
      desc: "Metrik agregasyonu, GROUP BY, çoklu JOIN mimarisi, CASE WHEN ve alt sorgular.",
    },
    {
      act: "BÖLÜM III",
      category: "Advanced",
      title: "İLERİ DÜZEY ANALİTİK & PENCERE FONKSİYONLARI",
      desc: "SET küme operatörleri, zaman serisi analitiği, CTE (WITH) ve Window Functions.",
    },
    {
      act: "BÖLÜM IV",
      category: "Mastery",
      title: "ADLİ BİLİŞİM & KURUMSAL DENETİM VAKALARI",
      desc: "Çok tablolu fintech transfer anomalileri, siber güvenlik logları ve adli vaka çözümü.",
    },
  ];

  return (
    <div className="flex-1 bg-ambient-theme min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-12 select-none animate-fade-in-up">
        {/* HERO WORKSTATION */}
        <section className="relative rounded-3xl glass-panel p-6 md:p-10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-[var(--accent-color)] text-xs font-mono font-bold shadow-sm">
                <Cpu className="w-3.5 h-3.5" />
                <span>POSTGRESQL 16 WASM ENGINE ACTIVE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.1]">
                Veriyi Pasif İzleme. <br />
                <span className="bg-gradient-to-r from-[var(--accent-color)] via-[var(--text-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                  Doğrudan Sorgula.
                </span>
              </h1>

              <p className="text-sm md:text-base text-[var(--text-muted)] max-w-lg leading-relaxed font-sans">
                PostgreSQL 16 WASM çekirdeği üzerinde çalışan etkileşimli vakalar: E-ticaret metriklerinden adli bilişim loglarına ve fintech anomali tespitine kadar sektörel senaryolarla sorgulama yetkinliğinizi geliştirin.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href={`/play/${nextChallenge.id}`}
                  className="px-6 py-3.5 rounded-xl btn-glow-theme flex items-center gap-2 text-xs transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{solvedCount > 0 ? "Kaldığın Yerden Devam Et" : "İlk Senaryoyu Başlat"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/academy"
                  className="px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-primary)] border border-white/[0.1] text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>SQL Akademisi</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Workstation Live Preview */}
            <div className="lg:col-span-6 rounded-2xl border border-white/[0.1] bg-black/40 backdrop-blur-md p-4 shadow-2xl space-y-3 font-mono text-xs">
              {/* Interactive Scenario Tabs */}
              <div className="flex items-center justify-between gap-1 pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {WORKSTATION_SCENARIOS.map((sc, idx) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenarioIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                        selectedScenarioIdx === idx
                          ? "bg-white/[0.12] text-[var(--accent-color)] border border-white/[0.2] font-bold shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                      }`}
                    >
                      {sc.title}
                    </button>
                  ))}
                </div>
                <span className="text-[var(--accent-color)] text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] shrink-0">
                  {scenario.execTime}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-[var(--text-primary)] leading-relaxed text-[11px] overflow-x-auto whitespace-pre">
                {scenario.sql}
              </div>

              {/* Live Output Simulation */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold pb-1 border-b border-white/[0.06]">
                  <span className="flex items-center gap-1 text-[var(--accent-color)]">
                    <CheckCircle2 className="w-3 h-3" />
                    CANLI ÇIKTI TABLOSU
                  </span>
                  <span>{scenario.badge}</span>
                </div>

                {scenario.resultRows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[var(--text-primary)] py-0.5">
                    <span className="font-semibold">{row.name}</span>
                    <span className="text-[var(--accent-color)] font-bold">{row.amount}</span>
                    <span className="text-[var(--text-muted)] text-[10px]">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* High-Density Metric Strip */}
          {mounted && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/[0.08] text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] text-[var(--accent-color)] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">ANALİST KADEMESİ</span>
                  <span className="text-base font-extrabold text-[var(--text-primary)]">Lvl {level}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] text-[var(--accent-color)] flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">ANALİTİK SKOR</span>
                  <span className="text-base font-extrabold text-[var(--accent-color)]">{xp} XP</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">ÇALIŞMA SERİSİ</span>
                  <span className="text-base font-extrabold text-amber-400">{currentStreak} Gün</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] text-[var(--accent-secondary)] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">MÜFREDAT İLERLEMESİ</span>
                  <span className="text-base font-extrabold text-[var(--text-primary)]">
                    {solvedCount}/{totalChallengesCount} ({overallProgressPercent}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4 NARRATIVE ACTS & MISSIONS */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-wide font-sans">
                15 DÜZEYLİ UYGULAMALI SQL MÜFREDATI
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Aşamalı zorluk, endüstri standardı ilişkisel şemalar ve adli vaka analizleri
              </p>
            </div>
            <Link
              href="/skill-tree"
              className="text-xs font-bold text-[var(--accent-color)] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>Beceri Ağacı Haritası</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-10">
            {chapters.map((chap) => {
              const chapWorlds = WORLDS.filter((w) => w.category === chap.category);

              return (
                <div key={chap.category} className="space-y-4">
                  {/* Act Header */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-md bg-white/[0.08] border border-white/[0.12] text-[var(--accent-color)]">
                      {chap.act}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-wide">
                        {chap.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">{chap.desc}</p>
                    </div>
                  </div>

                  {/* World Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapWorlds.map((world) => {
                      const Icon = ICON_MAP[world.icon] || Compass;
                      const isUnlocked = mounted ? unlockedWorlds.includes(world.id) : world.id === 1;
                      const worldChallenges = CHALLENGES.filter((c) => c.worldId === world.id);
                      const solvedInWorld = worldChallenges.filter((c) => solvedIds.includes(c.id)).length;
                      const isWorldCompleted = worldChallenges.length > 0 && solvedInWorld === worldChallenges.length;

                      return (
                        <div
                          key={world.id}
                          className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                            isUnlocked
                              ? isWorldCompleted
                                ? "glass-card border-[var(--accent-color)]/40"
                                : "glass-card"
                              : "bg-black/30 border-white/[0.04] opacity-50"
                          }`}
                        >
                          <div className="p-5 space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isUnlocked
                                    ? isWorldCompleted
                                      ? "bg-white/[0.12] text-[var(--accent-color)] border border-white/[0.2]"
                                      : "bg-white/[0.06] text-[var(--accent-color)] border border-white/[0.1]"
                                    : "bg-black/40 text-slate-600 border border-white/[0.04]"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isUnlocked ? (
                                  isWorldCompleted ? (
                                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--accent-color)] bg-white/[0.08] px-2 py-0.5 rounded border border-white/[0.15]">
                                      <CheckCircle2 className="w-3 h-3" /> TAMAMLANDI
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                                      {solvedInWorld}/{worldChallenges.length} GÖREV
                                    </span>
                                  )
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/[0.04]">
                                    <Lock className="w-2.5 h-2.5" /> KİLİTLİ
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-mono text-[var(--accent-color)] font-extrabold tracking-wider">
                                WORLD {world.id}
                              </div>
                              <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{world.title}</h4>
                              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                                {world.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Challenge List in Card */}
                          <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] bg-black/20 space-y-1.5">
                            {worldChallenges.map((challenge) => {
                              const isSolved = solvedIds.includes(challenge.id);
                              return (
                                <Link
                                  key={challenge.id}
                                  href={isUnlocked ? `/play/${challenge.id}` : "#"}
                                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                                    isUnlocked
                                      ? isSolved
                                        ? "bg-white/[0.06] border-white/[0.12] text-[var(--accent-color)] hover:bg-white/[0.1]"
                                        : "bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] hover:bg-white/[0.06] hover:border-white/[0.2]"
                                      : "pointer-events-none text-slate-600 border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {isSolved ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                                    ) : (
                                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                                    )}
                                    <span className="truncate font-medium">{challenge.title}</span>
                                  </div>

                                  <span
                                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 uppercase ${
                                      challenge.difficulty === "easy"
                                        ? "text-emerald-400 bg-emerald-500/10"
                                        : challenge.difficulty === "medium"
                                        ? "text-amber-400 bg-amber-500/10"
                                        : challenge.difficulty === "hard"
                                        ? "text-rose-400 bg-rose-500/10"
                                        : "text-purple-400 bg-purple-500/15 border border-purple-500/30"
                                    }`}
                                  >
                                    {challenge.difficulty}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
