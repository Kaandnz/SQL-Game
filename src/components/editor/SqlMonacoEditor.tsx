"use client";

import React, { useRef, useEffect } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { DATASETS } from "@/lib/data/datasets";
import { useUserStore, isLightTheme } from "@/lib/state/user-store";

interface SqlMonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRunQuery?: () => void;
  datasetId?: string;
  readOnly?: boolean;
}

export function SqlMonacoEditor({
  value,
  onChange,
  onRunQuery,
  datasetId = "ecommerce",
  readOnly = false,
}: SqlMonacoEditorProps) {
  const { theme } = useUserStore();
  const isLight = isLightTheme(theme);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add keyboard shortcut for Run Query (Ctrl+Enter / Cmd+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunQuery) {
        onRunQuery();
      }
    });

    // Provide custom auto-completion for SQL keywords & dataset tables/columns
    const dataset = DATASETS[datasetId] || DATASETS["ecommerce"];

    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // Dataset tables & columns
        dataset.tables.forEach((tbl) => {
          suggestions.push({
            label: tbl.name,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: tbl.name,
            detail: `Table: ${tbl.description}`,
            range,
          });

          tbl.columns.forEach((col) => {
            suggestions.push({
              label: col.name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: col.name,
              detail: `${tbl.name}.${col.name} (${col.type})`,
              range,
            });
          });
        });

        // PostgreSQL Common Keywords
        const keywords = [
          "SELECT",
          "FROM",
          "WHERE",
          "GROUP BY",
          "HAVING",
          "ORDER BY",
          "LIMIT",
          "OFFSET",
          "INNER JOIN",
          "LEFT JOIN",
          "RIGHT JOIN",
          "FULL OUTER JOIN",
          "ON",
          "AS",
          "DISTINCT",
          "AND",
          "OR",
          "NOT",
          "IN",
          "BETWEEN",
          "LIKE",
          "ILIKE",
          "IS NULL",
          "IS NOT NULL",
          "CASE",
          "WHEN",
          "THEN",
          "ELSE",
          "END",
          "WITH",
          "UNION",
          "UNION ALL",
          "EXCEPT",
          "INTERSECT",
          "COUNT",
          "SUM",
          "AVG",
          "MIN",
          "MAX",
          "COALESCE",
          "CONCAT",
          "LOWER",
          "UPPER",
          "DATE_TRUNC",
          "EXTRACT",
          "OVER",
          "PARTITION BY",
          "ROW_NUMBER",
          "RANK",
          "DENSE_RANK",
          "LAG",
          "LEAD",
        ];

        keywords.forEach((kw) => {
          suggestions.push({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range,
          });
        });

        return { suggestions };
      },
    });
  };

  return (
    <div className="w-full h-full min-h-[180px] bg-[var(--bg-surface)] rounded-b-lg overflow-hidden border border-[var(--border-color)] transition-colors duration-200">
      <Editor
        height="100%"
        defaultLanguage="sql"
        language="sql"
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        theme={isLight ? "vs" : "vs-dark"}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
          fontLigatures: true,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
        }}
      />
    </div>
  );
}
