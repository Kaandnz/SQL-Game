"use client";

import React from "react";
import { ErrorType } from "@/types";
import { AlertTriangle, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface ErrorCoachCardProps {
  error: {
    type: ErrorType;
    message: string;
    suggestion?: string;
  };
  onOpenHints?: () => void;
}

export function ErrorCoachCard({ error, onOpenHints }: ErrorCoachCardProps) {
  const getBadgeDetails = () => {
    switch (error.type) {
      case "SECURITY_VIOLATION":
        return { label: "Güvenlik Engeli", bg: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
      case "SYNTAX_ERROR":
        return { label: "Sözdizimi (Syntax) Hatası", bg: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
      case "COLUMN_MISMATCH":
        return { label: "Kolon Uyuşmazlığı", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "ROW_COUNT_MISMATCH":
        return { label: "Satır Sayısı Eşleşmedi", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "ORDERING_MISMATCH":
        return { label: "Sıralama (ORDER BY) Uyuşmazlığı", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
      case "EMPTY_RESULT":
        return { label: "Boş Sonuç (0 Satır)", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
      default:
        return { label: "Sonuç Eşleşmedi", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    }
  };

  const badge = getBadgeDetails();

  return (
    <div className="p-3.5 rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md shadow-xl text-xs space-y-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {error.type === "SECURITY_VIOLATION" ? (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span className="font-bold text-[var(--text-primary)]">DEDEKTİF HATA KOÇU</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {/* Main Error Message */}
      <p className="text-[var(--text-primary)] font-medium leading-relaxed">{error.message}</p>

      {/* Actionable Suggestion */}
      {error.suggestion && (
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-[var(--text-primary)] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[var(--accent-color)] block text-[11px]">Koç Tavsiyesi:</span>
            <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">{error.suggestion}</p>
          </div>
        </div>
      )}

      {/* Action Hint Prompt */}
      {onOpenHints && (
        <div className="flex items-center justify-between pt-1 text-[11px] border-t border-white/[0.06]">
          <span className="text-[var(--text-muted)]">Nereden başlayacağınızı bilemediniz mi?</span>
          <button
            onClick={onOpenHints}
            className="text-[var(--accent-color)] font-bold hover:underline flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kademeli İpucu İncele</span>
          </button>
        </div>
      )}
    </div>
  );
}
