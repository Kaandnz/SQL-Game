"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WORLDS } from "@/lib/data/worlds";
import { CHALLENGES } from "@/lib/data/challenges";
import { useUserStore } from "@/lib/state/user-store";
import {
  GitBranch,
  Lock,
  CheckCircle2,
  Play,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function SkillTreePage() {
  const [mounted, setMounted] = useState(false);
  const { unlockedWorlds, completedChallenges } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const solvedIds = Object.keys(completedChallenges || {});

  return (
    <div className="flex-1 bg-warm-ambient min-h-[calc(100vh-4rem)] select-none">
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <GitBranch className="w-3.5 h-3.5" />
            <span>SQL YETENEK & BECERİ AĞACI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f6f3ee]">
            SQL Ustalık Haritası
          </h1>
          <p className="text-xs md:text-sm text-[#a8a196]">
            Temel sorgulardan başlayarak ön koşulları tamamla ve ileri seviye SQL düğümlerini aç.
          </p>
        </div>

        {/* Visual Tree */}
        <div className="relative space-y-6">
          {WORLDS.map((world, index) => {
            const isUnlocked = mounted ? unlockedWorlds.includes(world.id) : world.id === 1;
            const worldChallenges = CHALLENGES.filter((c) => c.worldId === world.id);
            const solvedInWorld = worldChallenges.filter((c) => solvedIds.includes(c.id)).length;
            const isCompleted = worldChallenges.length > 0 && solvedInWorld === worldChallenges.length;
            const firstChallenge = worldChallenges[0];

            return (
              <div key={world.id} className="relative flex items-start gap-4">
                {/* Node Connector Line */}
                {index < WORLDS.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-6 ${
                      isCompleted ? "bg-amber-500" : isUnlocked ? "bg-[#332e28]" : "bg-[#221f1b]"
                    }`}
                  />
                )}

                {/* Status Dot / Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 z-10 border transition-all ${
                    isCompleted
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                      : isUnlocked
                      ? "bg-[#221f1b] text-amber-400 border-amber-500/30"
                      : "bg-[#141210] text-[#5a5349] border-[#24201c]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  ) : isUnlocked ? (
                    world.id
                  ) : (
                    <Lock className="w-4 h-4 text-[#5a5349]" />
                  )}
                </div>

                {/* World Node Card */}
                <div
                  className={`flex-1 p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? "glass-card border-amber-500/40"
                      : isUnlocked
                      ? "glass-card border-[#2c2823]"
                      : "bg-[#141210]/60 border-[#221e1a] opacity-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          WORLD {world.id}
                        </span>
                        <span className="text-xs text-[#736c61] font-mono">•</span>
                        <span className="text-xs text-[#a8a196] font-mono">
                          {worldChallenges.length} Görev ({solvedInWorld} Tamamlandı)
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#f6f3ee]">{world.title}</h3>
                      <p className="text-xs text-[#a8a196] leading-relaxed max-w-xl">
                        {world.subtitle}
                      </p>
                    </div>

                    {isUnlocked && firstChallenge && (
                      <Link
                        href={`/play/${firstChallenge.id}`}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                          isCompleted
                            ? "bg-[#221f1b] hover:bg-[#2c2823] text-amber-300 border border-[#2e2a24]"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md btn-glow-warm"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? "Tekrar İncele" : "Bölümü Oyna"}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
