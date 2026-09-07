"use client";

import React from "react";
import { DATASETS } from "@/lib/data/datasets";
import { Key, Link as LinkIcon, Table as TableIcon, GitFork } from "lucide-react";

interface SchemaVisualizerProps {
  datasetId: string;
}

export function SchemaVisualizer({ datasetId }: SchemaVisualizerProps) {
  const dataset = DATASETS[datasetId] || DATASETS["ecommerce"];

  // Find all foreign key relationships
  const relationships: { fromTable: string; fromCol: string; toTable: string; toCol: string }[] = [];
  dataset.tables.forEach((table) => {
    table.columns.forEach((col) => {
      if (col.isForeign && col.references) {
        relationships.push({
          fromTable: table.name,
          fromCol: col.name,
          toTable: col.references.table,
          toCol: col.references.column,
        });
      }
    });
  });

  return (
    <div className="p-4 bg-[#141210] h-full overflow-y-auto space-y-6 select-none custom-scrollbar">
      {/* Visual Relationship Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <GitFork className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#e6e0d6]">
            Tablo İlişkileri (Foreign Key Haritası)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {relationships.map((rel, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-[#2c2823] bg-[#1a1816] flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-1.5 text-amber-300">
                <span className="font-semibold text-[#f6f3ee]">{rel.toTable}</span>
                <span className="text-[#736c61]">.</span>
                <span className="text-amber-400">{rel.toCol}</span>
              </div>
              <div className="px-2 text-[#736c61] font-sans flex items-center gap-1">
                <span className="text-[10px] text-amber-400 font-mono">1 : N</span>
                <span>⟶</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-300">
                <span className="font-semibold text-[#f6f3ee]">{rel.fromTable}</span>
                <span className="text-[#736c61]">.</span>
                <span className="text-orange-400">{rel.fromCol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Table Entity Diagram Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TableIcon className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#e6e0d6]">
            Tablo Şemaları & Varlık Yapısı
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataset.tables.map((table) => (
            <div
              key={table.name}
              className="rounded-lg border border-[#2c2823] bg-[#1a1816] overflow-hidden shadow-sm"
            >
              <div className="px-3 py-2 bg-[#221f1b] border-b border-[#2c2823] flex items-center justify-between">
                <span className="font-mono font-bold text-amber-300 text-xs">{table.name}</span>
                <span className="text-[10px] text-[#8c8477] font-mono">
                  {table.columns.length} Kolon
                </span>
              </div>

              <div className="p-2 space-y-1 font-mono text-[11px]">
                {table.columns.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#221f1b] text-[#c8c1b5]"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.isPrimary && (
                        <span title="Primary Key">
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        </span>
                      )}
                      {col.isForeign && (
                        <span title="Foreign Key">
                          <LinkIcon className="w-3 h-3 text-orange-400 shrink-0" />
                        </span>
                      )}
                      {!col.isPrimary && !col.isForeign && (
                        <span className="w-3 h-3 block shrink-0" />
                      )}
                      <span className={col.isPrimary ? "font-bold text-[#f6f3ee]" : ""}>
                        {col.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#736c61]">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
