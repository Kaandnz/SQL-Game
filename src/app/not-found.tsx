"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
        <FileQuestion className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Sayfa veya Dosya Bulunamadı</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Aradığınız dedektiflik soruşturması veya sayfa veritabanında mevcut değil.
        </p>
      </div>

      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Ana Merkeze Dön</span>
      </Link>
    </div>
  );
}
