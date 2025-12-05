"use client";

import { useState } from "react";
import type { QueryExample } from "@/app/lib/concept-examples";
import { SampleDataTable } from "./SampleDataTable";
import { CopyButton } from "./CopyButton";

interface InteractiveExampleProps {
  example: QueryExample;
  className?: string;
}

export function InteractiveExample({ example, className = "" }: InteractiveExampleProps) {
  const [showQuery, setShowQuery] = useState(true);

  // Create output table structure
  const outputTable = {
    name: "result",
    columns: Object.keys(example.outputRows[0] || {}).map((key) => ({
      name: key,
      type: typeof example.outputRows[0][key] === "number" ? "NUMBER" : "TEXT",
    })),
    rows: example.outputRows,
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{example.title}</h3>
          <p className="text-sm text-gray-600">{example.description}</p>
        </div>
      </div>

      {/* Step 1: Input Data */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
            1
          </div>
          <h4 className="font-semibold text-gray-900">Input Data</h4>
        </div>
        <div className="pl-10">
          <SampleDataTable table={example.inputTable} maxRows={5} />
        </div>
      </div>

      {/* Arrow Down */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Step 2: Query */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
              2
            </div>
            <h4 className="font-semibold text-gray-900">SQL Query</h4>
          </div>
          <button
            onClick={() => setShowQuery(!showQuery)}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            {showQuery ? "Hide" : "Show"}
          </button>
        </div>

        {showQuery && (
          <div className="pl-10">
            <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">SQL</span>
                <CopyButton text={example.query} />
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-gray-100 font-mono text-sm whitespace-pre">{example.query}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Arrow Down */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Step 3: Output Data */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
            3
          </div>
          <h4 className="font-semibold text-gray-900">Result</h4>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-300">
            {example.outputRows.length} {example.outputRows.length === 1 ? "row" : "rows"}
          </span>
        </div>
        <div className="pl-10">
          <SampleDataTable
            table={outputTable}
            highlightedRows={example.highlightedRows}
          />
        </div>
      </div>
    </div>
  );
}
