"use client";

import React from "react";
import { Play, RotateCcw, Lightbulb, CheckCircle2, Eye, Sparkles, Command } from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";

interface QueryToolbarProps {
  onRunQuery: () => void;
  onReset: () => void;
  onShowHint: () => void;
  onShowSolution: () => void;
  isRunning: boolean;
  hintsUsed: number;
  totalHints: number;
  viewedSolution: boolean;
}

export function QueryToolbar({
  onRunQuery,
  onReset,
  onShowHint,
  onShowSolution,
  isRunning,
  hintsUsed,
  totalHints = 3,
  viewedSolution,
}: QueryToolbarProps) {
  const handleRun = () => {
    soundEffects.playClick();
    onRunQuery();
  };

  const handleHint = () => {
    soundEffects.playHint();
    onShowHint();
  };

  return (
    <div className="h-12 px-3.5 bg-[#171513] border-t border-x border-[#2c2823] rounded-t-xl flex items-center justify-between select-none">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg shadow-[0_0_15px_-2px_rgba(245,158,11,0.4)] transition-all btn-glow-warm"
          title="Sorguyu Çalıştır (Ctrl+Enter / Cmd+Enter)"
        >
          {isRunning ? (
            <>
              <span className="w-3 h-3 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              <span>Yürütülüyor...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Sorguyu Çalıştır</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.2 bg-slate-950/25 rounded text-[10px] font-mono text-slate-950 font-bold">
                <Command className="w-2.5 h-2.5" />
                <span>Enter</span>
              </kbd>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#221f1b] hover:bg-[#2c2823] text-[#c8c1b5] text-xs font-medium rounded-lg border border-[#2e2a24] transition-colors active:scale-95"
          title="Editörü Sıfırla"
        >
          <RotateCcw className="w-3 h-3 text-[#8c8477]" />
          <span className="hidden sm:inline">Sıfırla</span>
        </button>
      </div>

      {/* Right Hint & Solution Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleHint}
          disabled={hintsUsed >= totalHints || viewedSolution}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
            hintsUsed > 0
              ? "bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30 shadow-[0_0_10px_-2px_rgba(245,158,11,0.25)]"
              : "bg-[#221f1b] border-[#2e2a24] text-[#c8c1b5] hover:text-amber-300 hover:bg-amber-500/10"
          }`}
          title="İpucu Al (-%10 XP)"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {hintsUsed > 0 ? `İpucu (${hintsUsed}/${totalHints})` : "İpucu Al"}
          </span>
        </button>

        <button
          onClick={onShowSolution}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
            viewedSolution
              ? "bg-orange-500/20 border-orange-500/30 text-orange-200"
              : "bg-[#221f1b] border-[#2e2a24] text-[#8c8477] hover:text-[#f6f3ee] hover:bg-[#2c2823]"
          }`}
          title="Çözümü İncele (Kazanılan XP %25'e düşer)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Çözüm</span>
        </button>
      </div>
    </div>
  );
}
