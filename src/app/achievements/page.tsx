"use client";

import React, { useEffect, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { useUserStore } from "@/lib/state/user-store";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Footprints,
  Compass,
  ShieldAlert,
  GitFork,
  Brain,
  Crown,
  RotateCcw,
} from "lucide-react";

const ICON_LOOKUP: Record<string, any> = {
  Footprints,
  Compass,
  ShieldAlert,
  GitFork,
  Brain,
  Flame,
  Zap,
  Crown,
  Award,
};

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);
  const { xp, level, currentStreak, unlockedAchievements, completedChallenges, resetProgress } =
    useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const unlockedCount = mounted ? unlockedAchievements.length : 0;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const handleReset = () => {
    if (
      window.confirm(
        "Tüm analitik çalışma verilerinizi, yetkinlik puanlarınızı ve başarımları sıfırlamak istediğinizden emin misiniz?"
      )
    ) {
      resetProgress();
    }
  };

  return (
    <div className="flex-1 bg-warm-ambient min-h-[calc(100vh-4rem)] select-none">
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl glass-panel border border-[#2c2823] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-6 h-6" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase">
                YETKİNLİK & BAŞARIM VİTRİNİ
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#f6f3ee]">
              Kazanılan Yetkinlik Başarımları
            </h1>
            <p className="text-xs md:text-sm text-[#a8a196]">
              İlişkisel veritabanı senaryolarını ve adli analizleri tamamlayarak yetkinlik rozetlerinizi edinin.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141210] p-4 rounded-2xl border border-[#26221d]">
            <div className="text-center">
              <div className="text-xl font-bold text-amber-400">
                {unlockedCount} / {totalCount}
              </div>
              <div className="text-[10px] text-[#736c61] uppercase font-mono">Kazanılan Rozet</div>
            </div>
            <div className="w-px h-8 bg-[#282420]" />
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">%{progressPercent}</div>
              <div className="text-[10px] text-[#736c61] uppercase font-mono">Yetkinlik Oranı</div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ICON_LOOKUP[ach.icon] || Trophy;
            const isUnlocked = mounted && unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? "glass-card border-amber-500/40"
                    : "bg-[#141210]/60 border-[#221e1a] opacity-50"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/35"
                          : "bg-[#1c1a17] text-[#5a5349] border border-[#282420]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                        <CheckCircle2 className="w-3 h-3" /> AÇILDI
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#736c61] bg-[#1c1a17] px-2 py-0.5 rounded border border-[#24201c]">
                        <Lock className="w-3 h-3" /> KİLİTLİ
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#f6f3ee]">{ach.title}</h3>
                    <p className="text-xs text-[#a8a196] mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#26221d] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#736c61] uppercase">{ach.category}</span>
                  <span className="text-amber-400 font-bold">Özel Rozet</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Progress Danger Zone */}
        <div className="p-4 rounded-2xl bg-[#141210] border border-[#2c2823] flex items-center justify-between">
          <div className="text-xs text-[#8c8477]">
            Tüm ilerlemenizi ve kazanılan verileri sıfırlamak için:
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-rose-950/25 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>İlerlemeyi Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
}
