"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ACADEMY_LESSONS, ACADEMY_MODULES } from "@/lib/data/academy-lessons";
import { CHALLENGES } from "@/lib/data/challenges";
import { executeUserQuery } from "@/lib/db/pglite-engine";
import { soundEffects } from "@/lib/audio/sound-effects";
import { SqlCheatSheetDrawer } from "@/components/academy/SqlCheatSheetDrawer";
import { AcademyVisualizer } from "@/components/academy/AcademyVisualizer";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Code2,
  Database,
  Sparkles,
  ChevronRight,
  Terminal,
  Search,
  FileText,
  HelpCircle,
  X,
  Workflow,
  Check,
  RotateCcw,
  Copy,
  ExternalLink,
  Layers,
  Flame,
  BarChart3,
} from "lucide-react";

export default function AcademyPage() {
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<"ALL" | "VISUAL" | "DEEP_DIVE" | "EXAMPLES" | "QUIZ">("ALL");

  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [editedSqls, setEditedSqls] = useState<Record<number, string>>({});
  const [copiedExampleIdx, setCopiedExampleIdx] = useState<number | null>(null);
  const [liveOutputs, setLiveOutputs] = useState<
    Record<number, { isRunning: boolean; rows: any[]; columns: string[]; error?: string }>
  >({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("academy_completed_lessons");
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleLessonComplete = (lessonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId];
      try {
        localStorage.setItem("academy_completed_lessons", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const filteredLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((l) => {
      const matchesModule = selectedModuleId === "ALL" || l.moduleId === selectedModuleId;
      const matchesCategory = selectedCategory === "ALL" || l.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.whatItDoes.toLowerCase().includes(q) ||
        l.content.syntaxDiagram.toLowerCase().includes(q);
      return matchesModule && matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedModuleId, selectedCategory]);

  const lesson =
    ACADEMY_LESSONS.find((l) => l.id === activeLessonId) ||
    filteredLessons[0] ||
    ACADEMY_LESSONS[0];

  useEffect(() => {
    setEditedSqls({});
    setLiveOutputs({});
  }, [activeLessonId]);

  const relatedChallenges = CHALLENGES.filter((c) => c.worldId === lesson.worldId);
  const firstChallenge = relatedChallenges[0];

  const handleRunLiveExample = async (exampleIdx: number, sql: string, datasetId: string) => {
    soundEffects.playClick();
    setLiveOutputs((prev) => ({
      ...prev,
      [exampleIdx]: { isRunning: true, rows: [], columns: [] },
    }));

    try {
      const output = await executeUserQuery(datasetId, sql);
      if (output.success) {
        soundEffects.playSuccess();
        setLiveOutputs((prev) => ({
          ...prev,
          [exampleIdx]: {
            isRunning: false,
            rows: output.rows,
            columns: output.columns,
          },
        }));
      } else {
        soundEffects.playError();
        setLiveOutputs((prev) => ({
          ...prev,
          [exampleIdx]: {
            isRunning: false,
            rows: [],
            columns: [],
            error: output.error,
          },
        }));
      }
    } catch (e: any) {
      setLiveOutputs((prev) => ({
        ...prev,
        [exampleIdx]: {
          isRunning: false,
          rows: [],
          columns: [],
          error: e.message || "Bilinmeyen hata",
        },
      }));
    }
  };

  const handleCopySql = (text: string, idx: number) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedExampleIdx(idx);
    setTimeout(() => setCopiedExampleIdx(null), 1500);
  };

  const handleSelectQuizAnswer = (lessonId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [lessonId]: optionIdx }));
    const currentLesson = ACADEMY_LESSONS.find((l) => l.id === lessonId);
    if (currentLesson?.content.quickCheck?.correctIndex === optionIdx) {
      soundEffects.playSuccess();
      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons((prev) => {
          const next = [...prev, lessonId];
          try {
            localStorage.setItem("academy_completed_lessons", JSON.stringify(next));
          } catch (err) {}
          return next;
        });
      }
    } else {
      soundEffects.playError();
    }
  };

  const completionPercent = Math.round((completedLessons.length / ACADEMY_LESSONS.length) * 100);

  return (
    <div className="flex-1 bg-[#121110] min-h-[calc(100vh-4rem)] select-none text-[#f6f3ee]">
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 animate-fade-in-up">
        {/* LEFT: Modules & Search Sidebar */}
        <aside className="w-full md:w-80 shrink-0 space-y-4">
          <div className="p-4 rounded-2xl bg-[#181614] border border-[#2c2823] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--accent-color)]">
                <GraduationCap className="w-5 h-5" />
                <h2 className="font-extrabold text-xs text-[#f6f3ee] tracking-wider font-mono uppercase">
                  SQL ANSİKLOPEDİSİ
                </h2>
              </div>

              <button
                onClick={() => setShowCheatSheet(true)}
                className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)]/15 hover:bg-[var(--accent-color)]/25 text-[var(--accent-color)] border border-[var(--accent-color)]/30 text-[11px] font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
                title="Hızlı Sözdizimi Kopya Kağıdını Aç"
              >
                <FileText className="w-3 h-3" />
                <span>Cheat Sheet</span>
              </button>
            </div>

            <p className="text-xs text-[#a8a196] leading-relaxed">
              5 Ana Modül, 25 Kapsamlı Bölüm, İnteraktif Görsel Stüdyo ve 4 Kademeli Canlı Örnekler.
            </p>

            <div className="pt-1 pb-1 border-t border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#a8a196]">Öğrenme İlerlemesi</span>
                <span className="text-[var(--accent-color)] font-bold">
                  {completedLessons.length} / {ACADEMY_LESSONS.length} (%{completionPercent})
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <Search className="w-3.5 h-3.5 text-[#a8a196] absolute left-3 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Konu, fonksiyon veya kural ara..."
                className="w-full pl-8 pr-7 py-2 bg-black/50 text-[#f6f3ee] placeholder-[#736c61] rounded-xl border border-[#2c2823] text-xs focus:outline-none focus:border-[var(--accent-color)] transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-3.5 text-[#a8a196] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs custom-scrollbar">
            <button
              onClick={() => setSelectedModuleId("ALL")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all shrink-0 ${
                selectedModuleId === "ALL"
                  ? "bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/40 font-bold"
                  : "text-[#a8a196] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Tümü ({ACADEMY_LESSONS.length})
            </button>
            {ACADEMY_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all shrink-0 ${
                  selectedModuleId === mod.id
                    ? "bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/40 font-bold"
                    : "text-[#a8a196] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                M{mod.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {["ALL", "Fundamentals", "Intermediate", "Advanced", "Mastery"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-white/[0.12] text-white font-bold border border-white/[0.15]"
                    : "text-[#736c61] hover:text-[#a8a196]"
                }`}
              >
                {cat === "ALL" ? "Tüm Düzeyler" : cat}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#2c2823] bg-[#181614] p-2 space-y-1 max-h-[620px] overflow-y-auto custom-scrollbar shadow-inner">
            {filteredLessons.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#a8a196] font-mono">
                Aramanızla eşleşen ders bulunamadı.
              </div>
            ) : (
              filteredLessons.map((item) => {
                const isActive = item.id === lesson.id;
                const isDone = completedLessons.includes(item.id);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveLessonId(item.id);
                      soundEffects.playClick();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveLessonId(item.id);
                        soundEffects.playClick();
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer select-none ${
                      isActive
                        ? "bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/40 text-[var(--accent-color)] shadow-sm"
                        : "text-[#a8a196] hover:text-[#f6f3ee] hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <button
                        type="button"
                        onClick={(e) => toggleLessonComplete(item.id, e)}
                        className="shrink-0 text-white/30 hover:text-emerald-400 transition-colors p-1"
                        title={isDone ? "Tamamlandı olarak işaretlendi" : "Tamamlandı olarak işaretle"}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded border border-white/20 hover:border-white/50" />
                        )}
                      </button>

                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-[var(--accent-color)]">
                            #{item.id}
                          </span>
                          <span className={`text-xs font-bold truncate ${isDone ? "line-through opacity-70" : ""}`}>
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#736c61] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? "text-[var(--accent-color)] translate-x-0.5" : "text-white/20"
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT: Active Lesson Content */}
        <main className="flex-1 space-y-6">
          <div className="rounded-3xl bg-[#181614] border border-[#2c2823] p-6 md:p-8 space-y-6 shadow-2xl">
            {/* Lesson Title & Meta Header */}
            <div className="space-y-3 pb-5 border-b border-[#2c2823]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/25 text-[var(--accent-color)]">
                    {lesson.moduleName} • BÖLÜM {lesson.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-[#a8a196]">
                    {lesson.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => toggleLessonComplete(lesson.id, e)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      completedLessons.includes(lesson.id)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/[0.04] text-[#a8a196] hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedLessons.includes(lesson.id) ? "Tamamlandı" : "Tamamla"}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-[#a8a196] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>{lesson.readTime} Okuma</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#f6f3ee] tracking-tight font-sans">
                {lesson.title}
              </h1>
              <p className="text-sm text-[#a8a196] leading-relaxed font-sans">
                {lesson.subtitle}
              </p>
            </div>

            {/* NE İŞE YARAR? HERO CARD */}
            <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-[var(--accent-color)] font-bold text-xs uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4 fill-current" />
                <span>Ne İşe Yarar ve Neden Var?</span>
              </div>
              <p className="text-xs md:text-sm text-[#f6f3ee] leading-relaxed font-sans font-medium">
                {lesson.whatItDoes}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/[0.06] text-xs font-mono">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "ALL"
                    ? "bg-white/[0.1] text-white font-bold border border-white/[0.15]"
                    : "text-[#a8a196] hover:text-white"
                }`}
              >
                Tüm Görünüm
              </button>
              <button
                onClick={() => setActiveTab("VISUAL")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "VISUAL"
                    ? "bg-[var(--accent-color)] text-black font-bold"
                    : "text-[#a8a196] hover:text-white"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Görsel Stüdyo & Şema</span>
              </button>
              <button
                onClick={() => setActiveTab("DEEP_DIVE")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "DEEP_DIVE"
                    ? "bg-[var(--accent-color)] text-black font-bold"
                    : "text-[#a8a196] hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Derin Anlatım & Mekanizma</span>
              </button>
              <button
                onClick={() => setActiveTab("EXAMPLES")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "EXAMPLES"
                    ? "bg-[var(--accent-color)] text-black font-bold"
                    : "text-[#a8a196] hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Canlı Örnekler ({lesson.content.examples.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("QUIZ")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === "QUIZ"
                    ? "bg-[var(--accent-color)] text-black font-bold"
                    : "text-[#a8a196] hover:text-white"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bilgi Pekiştirme (Quiz)</span>
              </button>
            </div>

            {/* 1. VISUALIZER STUDIO */}
            {(activeTab === "ALL" || activeTab === "VISUAL") && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#f6f3ee] font-mono">
                  <Workflow className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>İnteraktif Görsel Mantık & Simülasyon:</span>
                </div>
                <AcademyVisualizer type={lesson.visualType || "syntax_anatomy"} title={lesson.title} />
              </div>
            )}

            {/* 2. DEEP-DIVE PEDAGOGICAL BREAKDOWN */}
            {(activeTab === "ALL" || activeTab === "DEEP_DIVE") && (
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-xs md:text-sm text-[#f6f3ee] leading-relaxed font-sans">
                    {lesson.content.introduction}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#221f1b] border border-[#332e28] space-y-2">
                    <div className="flex items-center gap-2 text-[var(--accent-color)] font-bold text-xs uppercase tracking-wider font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>Zihinsel Model (Nasıl Düşünmeliyiz?)</span>
                    </div>
                    <p className="text-xs md:text-sm text-[#f6f3ee] leading-relaxed whitespace-pre-line font-sans">
                      {lesson.content.mentalModel}
                    </p>
                  </div>
                </div>

                {lesson.deepDive?.howItWorksStepByStep && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-color)] uppercase tracking-wide">
                      <Layers className="w-4 h-4" />
                      <span>Veritabanı Motorunun Adım Adım Çalışma Mekanizması:</span>
                    </div>
                    <div className="space-y-2 text-xs font-sans text-[#f6f3ee]">
                      {lesson.deepDive.howItWorksStepByStep.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02]">
                          <span className="w-5 h-5 rounded-full bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {lesson.deepDive?.comparisonTable && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#f6f3ee]">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-[var(--accent-color)]" />
                        Karşılaştırmalı Fark Matrisi
                      </span>
                    </div>
                    <div className="overflow-x-auto text-xs font-mono">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.1] text-[#a8a196] text-[11px]">
                            <th className="p-2">Kriter</th>
                            <th className="p-2 text-amber-400">{lesson.deepDive.comparisonTable.titleA}</th>
                            <th className="p-2 text-orange-400">{lesson.deepDive.comparisonTable.titleB}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {lesson.deepDive.comparisonTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.02]">
                              <td className="p-2 font-bold text-white font-sans">{row.aspect}</td>
                              <td className="p-2 text-[#f6f3ee]">{row.itemA}</td>
                              <td className="p-2 text-[#f6f3ee]">{row.itemB}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.deepDive?.whenToUse && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <Check className="w-4 h-4" />
                        <span>Ne Zaman Kesinlikle Kullanılmalı?</span>
                      </div>
                      <div className="text-xs text-emerald-100 leading-relaxed space-y-1.5 font-sans">
                        {lesson.deepDive.whenToUse.map((u, idx) => (
                          <p key={idx}>✓ {u}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {lesson.deepDive?.whenNotToUse && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                        <X className="w-4 h-4" />
                        <span>Ne Zaman Kaçınılmalı? (Antipatterns)</span>
                      </div>
                      <div className="text-xs text-rose-100 leading-relaxed space-y-1.5 font-sans">
                        {lesson.deepDive.whenNotToUse.map((nu, idx) => (
                          <p key={idx}>✗ {nu}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#f6f3ee] font-mono">
                    <Code2 className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Sözdizimi Şablonu (Syntax):</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-xs text-[var(--accent-color)] leading-relaxed overflow-x-auto whitespace-pre">
                    {lesson.content.syntaxDiagram}
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRO TIPS & PITFALLS */}
            {(activeTab === "ALL" || activeTab === "DEEP_DIVE") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <div className="flex items-center gap-1.5 text-[var(--accent-color)] font-bold text-xs">
                    <Lightbulb className="w-4 h-4" />
                    <span>Kıdemli Mühendis İpuçları</span>
                  </div>
                  <div className="text-xs text-[#a8a196] leading-relaxed space-y-1.5 font-sans">
                    {lesson.content.proTips.map((tip, idx) => (
                      <p key={idx}>• {tip}</p>
                    ))}
                  </div>
                </div>

                {lesson.content.commonPitfalls && lesson.content.commonPitfalls.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Sık Yapılan Acemi Hataları</span>
                    </div>
                    <div className="text-xs text-rose-200 leading-relaxed space-y-1.5 font-sans">
                      {lesson.content.commonPitfalls.map((pit, idx) => (
                        <p key={idx}>• {pit}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. LIVE EXAMPLES */}
            {(activeTab === "ALL" || activeTab === "EXAMPLES") && (
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[var(--accent-color)]" />
                    <h3 className="font-extrabold text-sm text-[#f6f3ee] tracking-wide font-sans">
                      CANLI SQL DENEY ALANI ({lesson.content.examples.length} Kademeli Örnek)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--accent-color)] bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/[0.1]">
                    Tarayıcı İçi WASM PostgreSQL • Doğrudan Düzenlenebilir
                  </span>
                </div>

                <div className="space-y-5">
                  {lesson.content.examples.map((example, idx) => {
                    const currentSql = editedSqls[idx] !== undefined ? editedSqls[idx] : example.sql;
                    const output = liveOutputs[idx];
                    const isCopied = copiedExampleIdx === idx;

                    const levelColors: Record<string, string> = {
                      "Temel (Giriş)": "bg-sky-500/20 text-sky-300 border-sky-500/30",
                      "İş Senaryosu": "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      "İleri Seviye": "bg-purple-500/20 text-purple-300 border-purple-500/30",
                      "Hata Avcısı": "bg-rose-500/20 text-rose-300 border-rose-500/30",
                    };

                    const badgeClass = example.level ? levelColors[example.level] || "bg-white/[0.06] text-white" : "bg-white/[0.06] text-white";

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#2c2823] bg-[#121110] overflow-hidden space-y-3 p-4 md:p-5 shadow-lg relative"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {example.level && (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                                {example.level}
                              </span>
                            )}
                            <span className="text-xs md:text-sm font-bold text-[#f6f3ee] font-sans">
                              {example.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#a8a196] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                              {lesson.datasetId} db
                            </span>

                            <button
                              onClick={() => handleCopySql(currentSql, idx)}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#a8a196] hover:text-white border border-white/[0.06] text-[11px] flex items-center gap-1 transition-all"
                              title="Sorguyu Kopyala"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span className="text-[10px] font-mono">{isCopied ? "Kopyalandı" : "Kopyala"}</span>
                            </button>

                            <Link
                              href={`/playground?query=${encodeURIComponent(currentSql)}`}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#a8a196] hover:text-white border border-white/[0.06] text-[11px] flex items-center gap-1 transition-all"
                              title="Playground'da Aç"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="text-[10px] font-mono">Playground</span>
                            </Link>
                          </div>
                        </div>

                        <p className="text-xs text-[#a8a196] font-sans leading-relaxed">
                          {example.description}
                        </p>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#736c61]">
                            <span>SQL Editörü (Düzenleyip çalıştırabilirsiniz):</span>
                            {editedSqls[idx] !== undefined && editedSqls[idx] !== example.sql && (
                              <button
                                onClick={() => setEditedSqls((prev) => ({ ...prev, [idx]: example.sql }))}
                                className="text-[var(--accent-color)] hover:underline flex items-center gap-1"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                                Orijinale Sıfırla
                              </button>
                            )}
                          </div>
                          <textarea
                            value={currentSql}
                            onChange={(e) => setEditedSqls((prev) => ({ ...prev, [idx]: e.target.value }))}
                            rows={currentSql.split("\n").length + 1}
                            className="w-full p-3 rounded-xl bg-black/80 border border-[#332e28] font-mono text-xs text-[var(--accent-color)] leading-relaxed focus:outline-none focus:border-[var(--accent-color)] resize-y custom-scrollbar"
                            spellCheck={false}
                          />
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => handleRunLiveExample(idx, currentSql, lesson.datasetId)}
                            disabled={output?.isRunning}
                            className="px-4 py-2 rounded-xl btn-glow-theme text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 font-sans font-bold"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{output?.isRunning ? "Çalışıyor..." : "Canlı Çalıştır"}</span>
                          </button>

                          <div className="text-xs text-[#a8a196] font-sans flex items-center gap-2">
                            <span>Açıklama: {example.explanation}</span>
                          </div>
                        </div>

                        {output && (
                          <div className="mt-2 pt-3 border-t border-white/[0.08] animate-fade-in-up space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Sorgu Başarıyla Yürütüldü
                              </span>
                              <span className="text-[#a8a196]">
                                {output.rows.length} satır döndü
                              </span>
                            </div>

                            {output.error ? (
                              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                                Hata: {output.error}
                              </div>
                            ) : output.rows.length > 0 ? (
                              <div className="max-h-56 overflow-auto custom-scrollbar rounded-xl border border-white/[0.08] font-mono text-[11px] bg-black/60">
                                <table className="w-full text-left border-collapse">
                                  <thead className="bg-white/[0.06] text-white sticky top-0 border-b border-white/[0.08]">
                                    <tr>
                                      {output.columns.map((c) => (
                                        <th key={c} className="p-2 border-r border-white/[0.06] last:border-r-0 font-bold">
                                          {c}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/[0.04] text-[#f6f3ee]">
                                    {output.rows.slice(0, 10).map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-white/[0.04] odd:bg-transparent even:bg-white/[0.02]">
                                        {output.columns.map((c) => (
                                          <td key={c} className="p-2 border-r border-white/[0.04] last:border-r-0">
                                            {String(row[c] ?? "null")}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-xs text-[#a8a196] italic py-1 font-mono">
                                Sonuç kümesi boş (0 satır döndü).
                              </div>
                            )}

                            {example.outputNotes && (
                              <p className="text-[11px] text-[var(--accent-color)] font-mono bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                                💡 Çıktı Analizi: {example.outputNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. INTERACTIVE QUICK CHECK */}
            {(activeTab === "ALL" || activeTab === "QUIZ") && lesson.content.quickCheck && (
              <div className="p-5 rounded-2xl bg-[#221f1b] border border-[#332e28] space-y-3 pt-4">
                <div className="flex items-center gap-2 text-[var(--accent-color)] font-bold text-xs uppercase tracking-wider font-mono">
                  <HelpCircle className="w-4 h-4" />
                  <span>Bilgi Pekiştirme (Quick Check)</span>
                </div>

                <p className="text-xs md:text-sm font-semibold text-[#f6f3ee] font-sans">
                  {lesson.content.quickCheck.question}
                </p>

                <div className="space-y-2 pt-1">
                  {lesson.content.quickCheck.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[lesson.id] === optIdx;
                    const isCorrect = lesson.content.quickCheck?.correctIndex === optIdx;
                    const hasAnswered = quizAnswers[lesson.id] !== undefined;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizAnswer(lesson.id, optIdx)}
                        className={`w-full p-3 rounded-xl text-left text-xs font-sans flex items-center justify-between transition-all ${
                          hasAnswered
                            ? isCorrect
                              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold"
                              : isSelected
                              ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                              : "bg-white/[0.02] border border-white/[0.06] text-[#a8a196] opacity-60"
                            : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#f6f3ee]"
                        }`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {quizAnswers[lesson.id] !== undefined && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#a8a196] space-y-1 animate-fade-in-up">
                    <span className="font-bold text-[var(--accent-color)] block text-[11px]">Açıklama:</span>
                    <p>{lesson.content.quickCheck.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Jump to Game Challenge CTA */}
            {firstChallenge && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#2c2823] flex items-center justify-between flex-wrap gap-4 shadow-lg">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#f6f3ee] block font-sans">
                    Bu Konudaki Adli Soruşturmaya Geç: {firstChallenge.title}
                  </span>
                  <span className="text-xs text-[#a8a196] font-sans">
                    Öğrendiklerinizi gerçek adli soruşturma ve dedektiflik vakası üzerinde uygulayın.
                  </span>
                </div>

                <Link
                  href={`/play/${firstChallenge.id}`}
                  className="px-5 py-2.5 rounded-xl btn-glow-theme text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 font-sans font-bold"
                >
                  <span>Soruşturmaya Başla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {showCheatSheet && (
        <SqlCheatSheetDrawer onClose={() => setShowCheatSheet(false)} />
      )}
    </div>
  );
}
