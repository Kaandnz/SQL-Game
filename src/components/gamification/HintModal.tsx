"use client";

import React from "react";
import { HintTiers } from "@/types";
import { Lightbulb, AlertTriangle, X, ChevronRight, Check } from "lucide-react";

interface HintModalProps {
  hints: HintTiers;
  currentHintLevel: number;
  onUnlockNextHint: () => void;
  onClose: () => void;
}

export function HintModal({
  hints,
  currentHintLevel,
  onUnlockNextHint,
  onClose,
}: HintModalProps) {
  const hintList = [
    { level: 1, title: "1. Aşama: Kavramsal İpucu", text: hints.level1, penalty: "-%10 XP" },
    { level: 2, title: "2. Aşama: SQL Yapı Yardımı", text: hints.level2, penalty: "-%25 XP" },
    { level: 3, title: "3. Aşama: Kod & Sözdizimi İpucu", text: hints.level3, penalty: "-%50 XP" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Lightbulb className="w-5 h-5 fill-amber-400/20" />
            <h3 className="font-bold text-sm text-white">Dedektif İpucu Sistemi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Note */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <p>
            Her açılan ipucu görevin bitiminde kazanacağınız XP miktarını kademeli olarak azaltır.
          </p>
        </div>

        {/* Hint Tiers */}
        <div className="space-y-3">
          {hintList.map((item) => {
            const isUnlocked = currentHintLevel >= item.level;
            return (
              <div
                key={item.level}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? "bg-slate-950/80 border-slate-700 text-slate-200"
                    : "bg-slate-950/30 border-slate-800/60 opacity-60 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isUnlocked ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />
                    )}
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80">{item.penalty}</span>
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-2 rounded border border-slate-800 mt-2">
                    {item.text}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 italic mt-1">
                    Bu ipucu henüz açılmadı.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Kapat
          </button>

          {currentHintLevel < 3 && (
            <button
              onClick={onUnlockNextHint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>{currentHintLevel + 1}. İpucunu Aç</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
