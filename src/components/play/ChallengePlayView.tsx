"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CHALLENGES } from "@/lib/data/challenges";
import { WORLDS } from "@/lib/data/worlds";
import { evaluateChallengeQuery } from "@/lib/engine/challenge-evaluator";
import { useUserStore } from "@/lib/state/user-store";
import { soundEffects } from "@/lib/audio/sound-effects";
import { EvaluationResult } from "@/types";

import { SqlMonacoEditor } from "@/components/editor/SqlMonacoEditor";
import { QueryToolbar } from "@/components/editor/QueryToolbar";
import { DatabaseExplorer } from "@/components/explorer/DatabaseExplorer";
import { SchemaVisualizer } from "@/components/explorer/SchemaVisualizer";
import { TheoryDrawer } from "@/components/explorer/TheoryDrawer";
import { ResultDataGrid } from "@/components/results/ResultDataGrid";
import { ErrorCoachCard } from "@/components/results/ErrorCoachCard";
import { SuccessModal } from "@/components/gamification/SuccessModal";
import { HintModal } from "@/components/gamification/HintModal";
import { SolutionModal } from "@/components/gamification/SolutionModal";

import {
  ArrowLeft,
  ChevronRight,
  Database,
  GitFork,
  Zap,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";

export function ChallengePlayView() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params?.challengeId as string;

  const challenge = CHALLENGES.find((c) => c.id === challengeId) || CHALLENGES[0];
  const world = WORLDS.find((w) => w.id === challenge.worldId);

  const { completedChallenges, recordChallengeSuccess, level } = useUserStore();

  const prevSavedSql = completedChallenges[challenge.id]?.userSql || challenge.starterQuery || "";
  const [userSql, setUserSql] = useState<string>(prevSavedSql || "SELECT * \nFROM ");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const [hintsUsed, setHintsUsed] = useState<number>(
    completedChallenges[challenge.id]?.hintsUsed || 0
  );
  const [viewedSolution, setViewedSolution] = useState<boolean>(
    completedChallenges[challenge.id]?.viewedSolution || false
  );

  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showTheoryDrawer, setShowTheoryDrawer] = useState<boolean>(false);

  const [successMeta, setSuccessMeta] = useState<{
    newLevelUnlocked: boolean;
    newLevel: number;
    newAchievements: string[];
    xpEarned: number;
  }>({ newLevelUnlocked: false, newLevel: level, newAchievements: [], xpEarned: challenge.baseXp });

  const [explorerTab, setExplorerTab] = useState<"tables" | "schema">("tables");

  // Reset or initialize when challenge changes
  useEffect(() => {
    const saved = completedChallenges[challenge.id]?.userSql;
    setUserSql(saved || challenge.starterQuery || "SELECT * \nFROM ");
    setEvaluation(null);
    setHintsUsed(completedChallenges[challenge.id]?.hintsUsed || 0);
    setViewedSolution(completedChallenges[challenge.id]?.viewedSolution || false);
    setShowSuccessModal(false);
  }, [challenge.id]);

  const handleRunQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      const result = await evaluateChallengeQuery(
        challenge,
        userSql,
        hintsUsed,
        viewedSolution
      );

      setEvaluation(result);

      if (result.isCorrect) {
        const xpEarned = result.xpEarned || challenge.baseXp;
        const rewardResult = recordChallengeSuccess(
          challenge.id,
          xpEarned,
          hintsUsed,
          viewedSolution,
          userSql
        );

        setSuccessMeta({
          newLevelUnlocked: rewardResult.newLevelUnlocked,
          newLevel: useUserStore.getState().level,
          newAchievements: rewardResult.newAchievements,
          xpEarned,
        });

        setShowSuccessModal(true);
      } else {
        soundEffects.playError();
      }
    } catch (err: any) {
      console.error(err);
      soundEffects.playError();
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setUserSql(challenge.starterQuery || "SELECT * \nFROM ");
    setEvaluation(null);
  };

  const handleUnlockNextHint = () => {
    const nextLevel = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextLevel);
    soundEffects.playHint();
  };

  const handleApplySolution = (sql: string) => {
    setUserSql(sql);
    setViewedSolution(true);
  };

  const currentIndex = CHALLENGES.findIndex((c) => c.id === challenge.id);
  const nextChallengeItem =
    currentIndex >= 0 && currentIndex < CHALLENGES.length - 1
      ? CHALLENGES[currentIndex + 1]
      : null;

  const handleNextChallenge = () => {
    setShowSuccessModal(false);
    if (nextChallengeItem) {
      router.push(`/play/${nextChallengeItem.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-[#121110] select-none">
      {/* LEFT PANEL: Database Explorer & ER Visualizer */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-[#26221d] bg-[#161412] shrink-0 h-1/3 md:h-full">
        {/* Tab switch */}
        <div className="flex items-center border-b border-[#26221d] bg-[#110f0e] p-1.5 gap-1">
          <button
            onClick={() => setExplorerTab("tables")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              explorerTab === "tables"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-[#8c8477] hover:text-[#f6f3ee]"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Tablolar</span>
          </button>
          <button
            onClick={() => setExplorerTab("schema")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              explorerTab === "schema"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-[#8c8477] hover:text-[#f6f3ee]"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>ER Şeması</span>
          </button>
        </div>

        {/* Explorer Content */}
        <div className="flex-1 overflow-hidden">
          {explorerTab === "tables" ? (
            <DatabaseExplorer datasetId={challenge.databaseId} />
          ) : (
            <SchemaVisualizer datasetId={challenge.databaseId} />
          )}
        </div>
      </div>

      {/* RIGHT/CENTER MAIN AREA: Mission Brief + SQL Editor + Results */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar h-2/3 md:h-full">
        {/* Mission Brief Header */}
        <div className="p-4 md:p-6 border-b border-[#26221d] bg-[#181614]/80 space-y-3.5">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#8c8477]">
              <Link href="/" className="hover:text-[#f6f3ee] flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Harita</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-[#4a443b]" />
              <span className="font-mono font-bold text-amber-400">World {world?.id || 1}</span>
              <ChevronRight className="w-3 h-3 text-[#4a443b]" />
              <span className="text-[#c8c1b5] font-semibold truncate max-w-[200px]">
                {challenge.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTheoryDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-[0_0_12px_-3px_rgba(245,158,11,0.2)]"
                title="Konu anlatımını ve sözdizimi rehberini aç"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Konu Anlatımı</span>
              </button>

              <span
                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md ${
                  challenge.difficulty === "easy"
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : challenge.difficulty === "medium"
                    ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    : challenge.difficulty === "hard"
                    ? "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                    : "text-purple-400 bg-purple-500/20 border border-purple-500/30 animate-pulse"
                }`}
              >
                {challenge.difficulty}
              </span>

              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>+{challenge.baseXp} XP</span>
              </span>
            </div>
          </div>

          {/* Story & Problem */}
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#f6f3ee] tracking-tight">
              {challenge.title}
            </h1>
            <p className="text-xs md:text-sm text-[#c8c1b5] leading-relaxed bg-[#110f0e]/80 p-3.5 rounded-xl border border-[#24201c]">
              🕵️ <span className="font-bold text-amber-400">Vaka Dosyası: </span>
              {challenge.story}
            </p>
          </div>

          {/* Objective Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-orange-950/20 border border-amber-500/30 flex items-start gap-2.5 shadow-sm">
            <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-amber-300 block mb-0.5">Hedef SQL Sorgusu:</span>
              <p className="text-[#e6e0d6] leading-normal">{challenge.objective}</p>
            </div>
          </div>

          {/* Concepts Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#736c61] font-bold uppercase font-mono">İlgili Konular:</span>
            {challenge.concepts.map((concept, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#181614] text-[#c8c1b5] border border-[#2c2823]"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Middle Section: Monaco SQL Editor */}
        <div className="p-4 md:p-6 flex flex-col gap-4">
          <div className="flex flex-col h-[290px] shadow-2xl">
            <QueryToolbar
              onRunQuery={handleRunQuery}
              onReset={handleReset}
              onShowHint={() => setShowHintModal(true)}
              onShowSolution={() => setShowSolutionModal(true)}
              isRunning={isRunning}
              hintsUsed={hintsUsed}
              totalHints={3}
              viewedSolution={viewedSolution}
            />
            <div className="flex-1">
              <SqlMonacoEditor
                value={userSql}
                onChange={setUserSql}
                onRunQuery={handleRunQuery}
                datasetId={challenge.databaseId}
              />
            </div>
          </div>

          {/* Error Coach Banner (if error occurred) */}
          {evaluation?.error && (
            <ErrorCoachCard
              error={evaluation.error}
              onOpenHints={() => setShowHintModal(true)}
            />
          )}

          {/* Bottom Section: Result DataGrid */}
          <div className="h-[270px] shadow-2xl">
            <ResultDataGrid
              rows={evaluation?.userRows || []}
              columns={evaluation?.userColumns || []}
              executionTimeMs={evaluation?.executionTimeMs || 0}
              rowCount={evaluation?.rowCount || 0}
              isCorrect={evaluation?.isCorrect}
            />
          </div>
        </div>
      </div>

      {/* IN-GAME THEORY DRAWER */}
      {showTheoryDrawer && (
        <TheoryDrawer
          worldId={challenge.worldId}
          onClose={() => setShowTheoryDrawer(false)}
        />
      )}

      {/* MODALS */}
      {showHintModal && (
        <HintModal
          hints={challenge.hints}
          currentHintLevel={hintsUsed}
          onUnlockNextHint={handleUnlockNextHint}
          onClose={() => setShowHintModal(false)}
        />
      )}

      {showSolutionModal && (
        <SolutionModal
          solutionQuery={challenge.solutionQuery}
          onApplyToEditor={handleApplySolution}
          onClose={() => setShowSolutionModal(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          challenge={challenge}
          xpEarned={successMeta.xpEarned}
          newLevelUnlocked={successMeta.newLevelUnlocked}
          newLevel={successMeta.newLevel}
          newAchievements={successMeta.newAchievements}
          onNextChallenge={handleNextChallenge}
          onRetry={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
