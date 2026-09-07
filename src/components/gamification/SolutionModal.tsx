"use client";

import React, { useState } from "react";
import { Eye, AlertTriangle, X, Copy, Check, ArrowRight } from "lucide-react";

interface SolutionModalProps {
  solutionQuery: string;
  onApplyToEditor: (sql: string) => void;
  onClose: () => void;
}

export function SolutionModal({ solutionQuery, onApplyToEditor, onClose }: SolutionModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyToEditor(solutionQuery);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Eye className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Resmi Çözüm Sorgusu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Note */}
        <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2 text-xs text-indigo-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
          <p>
            Çözümü incelediğiniz için bu görevden alacağınız deneyim puanı (XP) %25 oranına düşecektir.
          </p>
        </div>

        {/* Code Snippet */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div className="p-3 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {solutionQuery}
          </div>

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Panoya Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Kapat
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>Editöre Yapıştır ve Çalıştır</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
