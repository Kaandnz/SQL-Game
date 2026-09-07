"use client";

import React, { useState, useMemo } from "react";
import { Clock, CheckCircle2, AlertCircle, Hash, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ResultDataGridProps {
  rows: Record<string, any>[];
  columns: string[];
  executionTimeMs: number;
  rowCount: number;
  isCorrect?: boolean;
}

export function ResultDataGrid({
  rows,
  columns,
  executionTimeMs,
  rowCount,
  isCorrect,
}: ResultDataGridProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortCol) return rows;
    return [...rows].sort((a, b) => {
      const vA = a[sortCol];
      const vB = b[sortCol];
      if (vA === null || vA === undefined) return sortDir === "asc" ? 1 : -1;
      if (vB === null || vB === undefined) return sortDir === "asc" ? -1 : 1;
      if (typeof vA === "number" && typeof vB === "number") {
        return sortDir === "asc" ? vA - vB : vB - vA;
      }
      return sortDir === "asc"
        ? String(vA).localeCompare(String(vB))
        : String(vB).localeCompare(String(vA));
    });
  }, [rows, sortCol, sortDir]);

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    const header = columns.join(",");
    const csvRows = rows.map((r) =>
      columns
        .map((c) => {
          const val = r[c];
          if (val === null || val === undefined) return "";
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sql_result_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#141210] border border-[#2c2823] rounded-lg overflow-hidden select-none font-mono text-xs shadow-xl">
      {/* Top Status & Metrics Bar */}
      <div className="h-9 px-3 bg-[#1a1816] border-b border-[#2c2823] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#e6e0d6] font-semibold font-sans text-xs">
            <span>SONUÇ TABLOSU</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#a8a196] bg-[#221f1b] px-2 py-0.5 rounded border border-[#2e2a24]">
            <Hash className="w-3 h-3 text-amber-400" />
            <span>{rowCount} satır</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#a8a196] bg-[#221f1b] px-2 py-0.5 rounded border border-[#2e2a24]">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{executionTimeMs} ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rows.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="p-1 px-2.5 rounded bg-[#221f1b] hover:bg-[#2c2823] text-[#e6e0d6] text-[11px] font-sans font-medium flex items-center gap-1 border border-[#2e2a24] transition-colors"
              title="CSV Olarak İndir"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>CSV İndir</span>
            </button>
          )}

          {isCorrect !== undefined && (
            <div>
              {isCorrect ? (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-sans font-semibold rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Doğru Sonuç
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-sans font-semibold rounded">
                  <AlertCircle className="w-3 h-3" />
                  Eşleşmedi
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {rows.length === 0 ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-[#736c61] p-6 text-center font-sans">
            <p className="text-xs">Sorgu çalıştırıldığında dönen veriler burada listelenecektir.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1a1816] text-[#e6e0d6] border-b border-[#2c2823] text-[11px]">
              <tr>
                <th className="py-2 px-3 text-[#736c61] w-10 font-medium text-center border-r border-[#26221d]">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="py-2 px-3 font-semibold tracking-wide border-r border-[#26221d] last:border-r-0 whitespace-nowrap cursor-pointer hover:bg-[#221f1b] transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 justify-between">
                      <span>{col}</span>
                      {sortCol === col ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-amber-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 text-[#5a5349] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24201c] text-[#e6e0d6]">
              {sortedRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-[#1f1c19] transition-colors odd:bg-[#141210] even:bg-[#181614]"
                >
                  <td className="py-1.5 px-3 text-[#736c61] text-center text-[10px] border-r border-[#24201c] font-mono">
                    {rowIdx + 1}
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    const isNull = val === null || val === undefined;
                    return (
                      <td
                        key={col}
                        className="py-1.5 px-3 border-r border-[#24201c] last:border-r-0 whitespace-nowrap text-[11px]"
                      >
                        {isNull ? (
                          <span className="text-[#5a5349] italic">null</span>
                        ) : typeof val === "boolean" ? (
                          <span
                            className={val ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}
                          >
                            {String(val)}
                          </span>
                        ) : typeof val === "number" ? (
                          <span className="text-amber-300">{val}</span>
                        ) : (
                          <span>{String(val)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
