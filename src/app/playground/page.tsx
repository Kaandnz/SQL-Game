"use client";

import React, { useState } from "react";
import { DATASETS } from "@/lib/data/datasets";
import { executeUserQuery, QueryExecutionOutput } from "@/lib/db/pglite-engine";
import { SqlMonacoEditor } from "@/components/editor/SqlMonacoEditor";
import { DatabaseExplorer } from "@/components/explorer/DatabaseExplorer";
import { SchemaVisualizer } from "@/components/explorer/SchemaVisualizer";
import { ResultDataGrid } from "@/components/results/ResultDataGrid";
import { soundEffects } from "@/lib/audio/sound-effects";
import {
  Terminal,
  Play,
  RotateCcw,
  Database,
  GitFork,
  AlertTriangle,
  Layers,
} from "lucide-react";

export default function PlaygroundPage() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("ecommerce");
  const [userSql, setUserSql] = useState<string>(
    "SELECT * \nFROM customers \nLIMIT 10;"
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<QueryExecutionOutput | null>(null);
  const [explorerTab, setExplorerTab] = useState<"tables" | "schema">("tables");

  const sampleQueries = [
    { label: "Müşteriler (Limit 10)", sql: "SELECT * FROM customers LIMIT 10;" },
    { label: "Pahalı Ürünler (>20.000 TL)", sql: "SELECT name, price FROM products WHERE price > 20000 ORDER BY price DESC;" },
    { label: "Müşteri & Sipariş INNER JOIN", sql: "SELECT c.first_name, c.last_name, o.id AS order_id, o.total_amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;" },
    { label: "Kategori Bazında Ürün Sayısı", sql: "SELECT c.name AS category_name, COUNT(p.id) AS product_count, AVG(p.price) AS avg_price\nFROM categories c\nLEFT JOIN products p ON c.id = p.category_id\nGROUP BY c.name;" },
  ];

  const handleRunQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);
    soundEffects.playClick();

    try {
      const output = await executeUserQuery(selectedDatasetId, userSql);
      setResult(output);
      if (output.success) {
        soundEffects.playSuccess();
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

  const handleDatasetChange = (newDatasetId: string) => {
    setSelectedDatasetId(newDatasetId);
    setResult(null);
    if (newDatasetId === "ecommerce") {
      setUserSql("SELECT * FROM customers LIMIT 10;");
    } else if (newDatasetId === "fintech") {
      setUserSql("SELECT * FROM transactions WHERE amount > 10000;");
    } else {
      setUserSql("SELECT * FROM crime_scene_reports;");
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-[#121110] select-none">
      {/* LEFT: Schema & Tables */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-[#26221d] bg-[#161412] shrink-0 h-1/3 md:h-full">
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

        <div className="flex-1 overflow-hidden">
          {explorerTab === "tables" ? (
            <DatabaseExplorer datasetId={selectedDatasetId} />
          ) : (
            <SchemaVisualizer datasetId={selectedDatasetId} />
          )}
        </div>
      </div>

      {/* RIGHT: Editor + Results */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar h-2/3 md:h-full p-4 md:p-6 space-y-4">
        {/* Top Controls */}
        <div className="p-4 rounded-2xl glass-panel border border-[#2c2823] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
              <Terminal className="w-4 h-4" />
              <span>SQL SANDBOX & SORGULAMA KONSOLU</span>
            </div>
            <p className="text-xs text-[#a8a196]">
              İlişkisel veritabanı şemalarını doğrudan sorgulayın, özel metrikler türetin ve indeks davranışlarını test edin.
            </p>
          </div>

          {/* Dataset Selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <select
              value={selectedDatasetId}
              onChange={(e) => handleDatasetChange(e.target.value)}
              className="bg-[#141210] text-[#f6f3ee] text-xs font-mono py-1.5 px-3 rounded-xl border border-[#2c2823] focus:outline-none focus:border-amber-500/80"
            >
              {Object.entries(DATASETS).map(([id, ds]) => (
                <option key={id} value={id}>
                  {ds.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-[#736c61] font-mono shrink-0">Örnekler:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setUserSql(q.sql)}
              className="px-2.5 py-1 rounded-lg bg-[#1a1816] hover:bg-[#24201c] text-[#c8c1b5] border border-[#2c2823] whitespace-nowrap text-[11px] transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Monaco Editor Container */}
        <div className="flex flex-col h-[280px] rounded-xl overflow-hidden border border-[#2c2823] shadow-2xl">
          <div className="h-10 px-3 bg-[#181614] border-b border-[#26221d] flex items-center justify-between">
            <span className="text-xs font-mono text-[#a8a196]">sandbox_query.sql</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunQuery}
                disabled={isRunning}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md btn-glow-warm active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>{isRunning ? "Yürütülüyor..." : "Çalıştır (Ctrl+Enter)"}</span>
              </button>
              <button
                onClick={() => setUserSql("SELECT * \nFROM ")}
                className="p-1 rounded-lg bg-[#221f1b] hover:bg-[#2c2823] text-[#8c8477] border border-[#2e2a24]"
                title="Temizle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <SqlMonacoEditor
              value={userSql}
              onChange={setUserSql}
              onRunQuery={handleRunQuery}
              datasetId={selectedDatasetId}
            />
          </div>
        </div>

        {/* Error Notification */}
        {result && !result.success && (
          <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">PostgreSQL Hatası:</span>
              <p className="font-mono">{result.error}</p>
            </div>
          </div>
        )}

        {/* Result Table */}
        <div className="h-[260px] shadow-2xl">
          <ResultDataGrid
            rows={result?.rows || []}
            columns={result?.columns || []}
            executionTimeMs={result?.executionTimeMs || 0}
            rowCount={result?.rowCount || 0}
          />
        </div>
      </div>
    </div>
  );
}
