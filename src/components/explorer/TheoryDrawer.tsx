"use client";

import React from "react";
import { ACADEMY_LESSONS } from "@/lib/data/academy-lessons";
import {
  BookOpen,
  X,
  Code2,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface TheoryDrawerProps {
  worldId: number;
  onClose: () => void;
}

export function TheoryDrawer({ worldId, onClose }: TheoryDrawerProps) {
  const lesson =
    ACADEMY_LESSONS.find((l) => l.worldId === worldId) || ACADEMY_LESSONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-[#181614] border-l border-[#2c2823] w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-6">
        {/* Header */}
        <div className="space-y-3 pb-4 border-b border-[#26221d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Konu Anlatımı & Sözdizimi
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8c8477] hover:text-[#f6f3ee] hover:bg-[#221f1b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#f6f3ee]">{lesson.title}</h2>
            <p className="text-xs text-[#a8a196] mt-0.5">{lesson.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {/* Mental Model */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-[#e6e0d6] leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zihinsel Model:</span>
            </div>
            <p className="whitespace-pre-line">{lesson.content.mentalModel}</p>
          </div>

          {/* Syntax Template */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#e6e0d6]">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Sözdizimi Şablonu:</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#110f0e] border border-[#24201c] font-mono text-xs text-amber-200 overflow-x-auto whitespace-pre leading-relaxed">
              {lesson.content.syntaxDiagram}
            </pre>
          </div>

          {/* Pro Tips */}
          <div className="p-3.5 rounded-xl bg-[#1e1b17] border border-[#2e2a24] text-xs text-[#c8c1b5] leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Profesyonel İpuçları:</span>
            </div>
            <div className="space-y-1">
              {lesson.content.proTips.map((tip, idx) => (
                <p key={idx}>• {tip}</p>
              ))}
            </div>
          </div>

          {/* Common Pitfalls */}
          {lesson.content.commonPitfalls && lesson.content.commonPitfalls.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Sık Yapılan Hatalar:</span>
              </div>
              <div className="space-y-1">
                {lesson.content.commonPitfalls.map((pit, idx) => (
                  <p key={idx}>• {pit}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#26221d]">
          <Link
            href="/academy"
            className="w-full py-2.5 px-4 rounded-xl bg-[#221f1b] hover:bg-[#2c2823] text-[#f6f3ee] text-xs font-semibold flex items-center justify-center gap-2 border border-[#2e2a24] transition-colors"
          >
            <span>Akademide Tüm Bölümleri İncele</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
