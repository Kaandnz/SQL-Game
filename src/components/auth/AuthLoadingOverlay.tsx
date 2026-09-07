"use client";

import React from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { Shield, Sparkles } from "lucide-react";

export function AuthLoadingOverlay() {
  const { isSyncing, user } = useAuth();

  // Show only when syncing during active authentication
  if (!isSyncing || !user) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none pointer-events-auto">
      <div className="relative flex flex-col items-center gap-4 px-8 py-7 rounded-3xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] shadow-2xl backdrop-blur-xl max-w-xs w-full text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Shield Radar */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-emerald-500/20 border-b-emerald-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <Shield className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-sm tracking-tight">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Dedektif Profili Yükleniyor</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Çözülmüş görevleriniz ve XP verileriniz eşitleniyor...
          </p>
        </div>

        {/* Subtle Progress Bar */}
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
