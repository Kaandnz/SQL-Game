"use client";

import React, { useState } from "react";
import { DATASETS } from "@/lib/data/datasets";
import {
  Database,
  Table as TableIcon,
  Key,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  Layers,
  Search,
  X,
  Info,
} from "lucide-react";

interface DatabaseExplorerProps {
  datasetId: string;
  onSelectTable?: (tableName: string) => void;
}

export function DatabaseExplorer({ datasetId }: DatabaseExplorerProps) {
  const dataset = DATASETS[datasetId] || DATASETS["ecommerce"];
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [dataset.tables[0]?.name || ""]: true,
    [dataset.tables[1]?.name || ""]: true,
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const filteredTables = dataset.tables.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTableName = t.name.toLowerCase().includes(q);
    const matchesCol = t.columns.some((c) => c.name.toLowerCase().includes(q));
    return matchesTableName || matchesCol;
  });

  return (
    <div className="flex flex-col h-full bg-[#161412] select-none text-xs">
      {/* Header */}
      <div className="p-3 border-b border-[#282420] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-[#f6f3ee] tracking-wide">VERİTABANI</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#221f1b] border border-[#2e2a24] text-[#a8a196]">
          PostgreSQL (WASM)
        </span>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-[#24201c] bg-[#1a1816]/70">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#736c61] absolute left-2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tablo veya kolon ara..."
            className="w-full pl-7 pr-7 py-1.5 bg-[#121110] text-[#f6f3ee] placeholder-[#736c61] rounded-md border border-[#2c2823] text-[11px] focus:outline-none focus:border-amber-500/80 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-[#736c61] hover:text-[#f6f3ee]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Dataset Info */}
      <div className="px-3 py-2 bg-[#1a1816]/40 border-b border-[#24201c]">
        <div className="font-medium text-[#e6e0d6] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{dataset.name}</span>
        </div>
        <p className="text-[11px] text-[#8c8477] mt-0.5 line-clamp-2">
          {dataset.description}
        </p>
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {filteredTables.map((table) => {
          const isExpanded = !!expandedTables[table.name] || searchQuery.length > 0;
          return (
            <div
              key={table.name}
              className="rounded-md border border-[#2c2823] bg-[#1a1816] overflow-hidden"
            >
              {/* Table Header */}
              <button
                onClick={() => toggleTable(table.name)}
                className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-[#221f1b] transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8c8477]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#8c8477]" />
                  )}
                  <TableIcon className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
                  <span className="font-mono font-medium text-[#f6f3ee]">{table.name}</span>
                </div>
                <span className="text-[10px] text-[#736c61] font-mono">
                  {table.columns.length} kol
                </span>
              </button>

              {/* Table Columns */}
              {isExpanded && (
                <div className="px-2.5 pb-2 pt-1 border-t border-[#24201c] space-y-1 bg-[#141210]/60 font-mono text-[11px]">
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-[#221f1b] text-[#c8c1b5]"
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {col.isPrimary && (
                          <span title="Primary Key (Birincil Anahtar)">
                            <Key className="w-3 h-3 text-amber-400 shrink-0" />
                          </span>
                        )}
                        {col.isForeign && (
                          <span
                            title={`Foreign Key -> ${col.references?.table}.${col.references?.column}`}
                          >
                            <LinkIcon className="w-3 h-3 text-orange-400 shrink-0" />
                          </span>
                        )}
                        {!col.isPrimary && !col.isForeign && (
                          <span className="w-3 h-3 block shrink-0" />
                        )}
                        <span className="truncate">{col.name}</span>
                      </div>
                      <span className="text-[10px] text-[#736c61] shrink-0 font-mono">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schema Tips / Foreign Key helper */}
      <div className="p-2.5 border-t border-[#282420] bg-[#1a1816]/70 text-[11px] text-[#8c8477] flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-amber-400">🔑 PK:</span> Birincil,{" "}
          <span className="text-orange-400">🔗 FK:</span> İlişki
        </div>
      </div>
    </div>
  );
}
