"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/state/user-store";
import {
  Trophy,
  Flame,
  Zap,
  Shield,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Crown,
  Medal,
  Award,
  Sparkles,
  Play,
} from "lucide-react";

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all">("weekly");
  const [mounted, setMounted] = useState(false);
  const { xp, level, currentStreak, completedChallenges } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const ranks = [
    { name: "Çaylak Dedektif", range: "Lvl 1 - 3", icon: Award, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { name: "Adli Bilişim Analisti", range: "Lvl 4 - 7", icon: Medal, color: "text-slate-300 bg-slate-500/10 border-slate-500/20" },
    { name: "Kıdemli SQL Dedektifi", range: "Lvl 8 - 12", icon: Shield, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    { name: "Baş Müfettiş", range: "Lvl 13 - 17", icon: Crown, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    { name: "Büyük Veri Efsanesi", range: "Lvl 18+", icon: Sparkles, color: "text-amber-300 bg-amber-500/15 border-amber-500/30" },
  ];

  const currentRank =
    level >= 18
      ? ranks[4]
      : level >= 13
      ? ranks[3]
      : level >= 8
      ? ranks[2]
      : level >= 4
      ? ranks[1]
      : ranks[0];

  const solvedCount = Object.keys(completedChallenges || {}).length;

  const mockLeaderboard = [
    { rank: 1, name: "selim_forensics", level: 21, xp: 5450, solved: 32, streak: 28, badge: "Büyük Veri Efsanesi" },
    { rank: 2, name: "elif_sql_ninja", level: 19, xp: 4890, solved: 29, streak: 19, badge: "Büyük Veri Efsanesi" },
    { rank: 3, name: "data_sherlock", level: 16, xp: 4120, solved: 26, streak: 14, badge: "Baş Müfettiş" },
    { rank: 4, name: "berk_db", level: 14, xp: 3600, solved: 22, streak: 11, badge: "Baş Müfettiş" },
    { rank: 5, name: "zeynep_analyst", level: 11, xp: 2850, solved: 18, streak: 8, badge: "Kıdemli SQL Dedektifi" },
  ];

  return (
    <div className="flex-1 bg-warm-ambient min-h-[calc(100vh-4rem)] select-none">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl glass-panel border border-[#2c2823] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#f6f3ee] tracking-tight">
                DEDEKTİF LİDERLİK TABLOSU
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#a8a196] max-w-xl">
              SQL sorgularınızı en hızlı ve sıfır ipucuyla çözerek puanınızı katlayın, rütbenizi yükseltin.
            </p>
          </div>

          {/* User Active Rank Card */}
          {mounted && (
            <div className="p-4 rounded-2xl bg-[#181614] border border-[#2c2823] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <currentRank.icon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#736c61] uppercase tracking-wider block">
                  Mevcut Rütbeniz
                </span>
                <p className="text-sm font-bold text-[#f6f3ee]">{currentRank.name}</p>
                <p className="text-xs text-amber-400 font-mono">
                  Lvl {level} • {xp} XP
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Daily Challenge Spotlight */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GÜNÜN SORUŞTURMASI
              </span>
              <span className="text-xs text-[#a8a196] font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> 14s 22d kaldı
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-[#f6f3ee]">
              Gece Yarısı Şüpheli Havale Trafiği (SafeBank)
            </h3>
            <p className="text-xs text-[#c8c1b5] max-w-xl">
              Saat 03:00 - 04:00 arasındaki 100.000 TL üzeri tüm işlemleri listeleyin. Ekstra <span className="text-amber-400 font-bold">+250 Bonus XP</span> kazanın!
            </p>
          </div>

          <Link
            href="/play/c_medium_01"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md btn-glow-warm active:scale-95 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Günün Vakasına Başla</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Rank Tiers & Global Leaderboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rank Tiers (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl glass-panel border border-[#2c2823] space-y-3">
              <h3 className="font-extrabold text-sm text-[#f6f3ee] tracking-wide font-sans">
                DEDEKTİF RÜTBE KADEMELERİ
              </h3>
              <p className="text-xs text-[#a8a196]">
                Çözdüğünüz her vaka ile XP kazanın ve rütbe atlayın.
              </p>

              <div className="space-y-2 pt-2">
                {ranks.map((r, idx) => {
                  const Icon = r.icon;
                  const isCurrent = currentRank.name === r.name;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-amber-500/15 border-amber-500/35 shadow-sm"
                          : "bg-[#181614] border-[#26221d]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#221f1b] flex items-center justify-center text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#f6f3ee] block">{r.name}</span>
                          <span className="text-[10px] text-[#736c61] font-mono">{r.range}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          SİZ
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Global Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl glass-panel border border-[#2c2823] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#26221d]">
                <h3 className="font-extrabold text-sm text-[#f6f3ee] tracking-wide font-sans">
                  KÜRESEL SIRALAMA
                </h3>

                <div className="flex items-center gap-1 bg-[#141210] p-1 rounded-xl border border-[#26221d]">
                  <button
                    onClick={() => setTimeframe("weekly")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeframe === "weekly"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-[#8c8477] hover:text-[#f6f3ee]"
                    }`}
                  >
                    Bu Hafta
                  </button>
                  <button
                    onClick={() => setTimeframe("monthly")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeframe === "monthly"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-[#8c8477] hover:text-[#f6f3ee]"
                    }`}
                  >
                    Bu Ay
                  </button>
                  <button
                    onClick={() => setTimeframe("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeframe === "all"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-[#8c8477] hover:text-[#f6f3ee]"
                    }`}
                  >
                    Tüm Zamanlar
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="text-[#8c8477] text-[11px] border-b border-[#26221d]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Dedektif</th>
                      <th className="py-2.5 px-3">Seviye</th>
                      <th className="py-2.5 px-3">Vaka</th>
                      <th className="py-2.5 px-3">Seri</th>
                      <th className="py-2.5 px-3 text-right">XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24201c] text-[#e6e0d6]">
                    {mockLeaderboard.map((user) => (
                      <tr key={user.rank} className="hover:bg-[#201d19] transition-colors">
                        <td className="py-3 px-3 font-bold">
                          {user.rank === 1 ? (
                            <span className="text-amber-400 font-extrabold flex items-center gap-1">
                              👑 1
                            </span>
                          ) : user.rank === 2 ? (
                            <span className="text-slate-300 font-extrabold">🥈 2</span>
                          ) : user.rank === 3 ? (
                            <span className="text-amber-600 font-extrabold">🥉 3</span>
                          ) : (
                            <span className="text-[#736c61]">#{user.rank}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#f6f3ee]">{user.name}</div>
                          <div className="text-[10px] text-[#736c61]">{user.badge}</div>
                        </td>
                        <td className="py-3 px-3 text-amber-300">Lvl {user.level}</td>
                        <td className="py-3 px-3 text-[#c8c1b5]">{user.solved} çözüldü</td>
                        <td className="py-3 px-3 text-amber-400 font-bold">🔥 {user.streak}g</td>
                        <td className="py-3 px-3 text-right font-extrabold text-amber-400">
                          {user.xp.toLocaleString()} XP
                        </td>
                      </tr>
                    ))}

                    {/* Current User Row */}
                    {mounted && (
                      <tr className="bg-amber-500/10 border-t-2 border-amber-500/40 text-amber-300 font-bold">
                        <td className="py-3 px-3">#42</td>
                        <td className="py-3 px-3">
                          <div className="text-[#f6f3ee]">siz (data_detective)</div>
                          <div className="text-[10px] text-amber-400">{currentRank.name}</div>
                        </td>
                        <td className="py-3 px-3">Lvl {level}</td>
                        <td className="py-3 px-3 text-[#f6f3ee]">{solvedCount} çözüldü</td>
                        <td className="py-3 px-3 text-amber-400">🔥 {currentStreak}g</td>
                        <td className="py-3 px-3 text-right text-amber-400">
                          {xp.toLocaleString()} XP
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
