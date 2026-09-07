"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Challenge } from "@/types";
import { soundEffects } from "@/lib/audio/sound-effects";
import { Trophy, Zap, ArrowRight, RotateCcw, CheckCircle2, Flame, Award } from "lucide-react";

interface SuccessModalProps {
  challenge: Challenge;
  xpEarned: number;
  newLevelUnlocked?: boolean;
  newLevel?: number;
  newAchievements?: string[];
  onNextChallenge?: () => void;
  onRetry?: () => void;
}

export function SuccessModal({
  challenge,
  xpEarned,
  newLevelUnlocked,
  newLevel,
  newAchievements = [],
  onNextChallenge,
  onRetry,
}: SuccessModalProps) {
  useEffect(() => {
    // Play sound and trigger confetti
    if (newLevelUnlocked) {
      soundEffects.playLevelUp();
    } else {
      soundEffects.playSuccess();
    }

    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#06b6d4", "#f59e0b", "#a855f7"],
    });
  }, [newLevelUnlocked]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-emerald-500/10 text-center space-y-5">
        {/* Badge Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-110">
          <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
            GÖREV BAŞARIYLA TAMAMLANDI
          </span>
          <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
          <p className="text-xs text-slate-400">{challenge.subtitle}</p>
        </div>

        {/* Rewards Box */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>+{xpEarned} XP</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Deneyim Puanı</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Seri Devam Ediyor</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Günlük Streak</span>
          </div>
        </div>

        {/* Level Up Announcement */}
        {newLevelUnlocked && (
          <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 fill-amber-400" />
            <span>TEBRİKLER! Seviye {newLevel} Dedektifliğe Yükseldin!</span>
          </div>
        )}

        {/* Learning Notes if available */}
        {challenge.learningNotes && (
          <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 text-left">
            💡 <span className="font-semibold text-emerald-400">Not: </span>
            {challenge.learningNotes}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tekrar Dene
            </button>
          )}

          {onNextChallenge && (
            <button
              onClick={onNextChallenge}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Sonraki Göreve Geç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
