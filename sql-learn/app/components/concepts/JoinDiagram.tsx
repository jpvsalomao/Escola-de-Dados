"use client";

import { useState } from "react";
import type { SampleTable } from "@/app/lib/concept-examples";
import { CopyButton } from "./CopyButton";

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";

interface JoinDiagramProps {
  leftTable: SampleTable;
  rightTable: SampleTable;
  leftJoinColumn?: string; // Column name in left table (defaults to joinColumn)
  rightJoinColumn?: string; // Column name in right table (defaults to joinColumn)
  joinColumn?: string; // Fallback if leftJoinColumn/rightJoinColumn not specified
  className?: string;
}

export function JoinDiagram({
  leftTable,
  rightTable,
  leftJoinColumn,
  rightJoinColumn,
  joinColumn,
  className = "",
}: JoinDiagramProps) {
  const [activeJoinType, setActiveJoinType] = useState<JoinType>("INNER");

  // Determine actual column names to use
  const leftCol = leftJoinColumn || joinColumn || "id";
  const rightCol = rightJoinColumn || joinColumn || "customer_id";

  // Calculate which rows match for each join type
  const getMatchInfo = () => {
    const matchedLeft: number[] = [];
    const matchedRight: number[] = [];
    const unmatchedLeft: number[] = [];
    const unmatchedRight: number[] = [];

    // Build a map of right table values for efficient lookup
    const rightValueToIndices = new Map<any, number[]>();
    rightTable.rows.forEach((rightRow, rightIdx) => {
      const rightValue = rightRow[rightCol];
      if (!rightValueToIndices.has(rightValue)) {
        rightValueToIndices.set(rightValue, []);
      }
      rightValueToIndices.get(rightValue)!.push(rightIdx);
    });

    // Check left table rows
    leftTable.rows.forEach((leftRow, leftIdx) => {
      const leftValue = leftRow[leftCol];
      const hasMatch = rightValueToIndices.has(leftValue) && rightValueToIndices.get(leftValue)!.length > 0;

      if (hasMatch) {
        matchedLeft.push(leftIdx);
      } else {
        unmatchedLeft.push(leftIdx);
      }
    });

    // Build a map of left table values for efficient lookup
    const leftValueToIndices = new Map<any, number[]>();
    leftTable.rows.forEach((leftRow, leftIdx) => {
      const leftValue = leftRow[leftCol];
      if (!leftValueToIndices.has(leftValue)) {
        leftValueToIndices.set(leftValue, []);
      }
      leftValueToIndices.get(leftValue)!.push(leftIdx);
    });

    // Check right table rows
    rightTable.rows.forEach((rightRow, rightIdx) => {
      const rightValue = rightRow[rightCol];
      const hasMatch = leftValueToIndices.has(rightValue) && leftValueToIndices.get(rightValue)!.length > 0;

      if (hasMatch) {
        matchedRight.push(rightIdx);
      } else {
        unmatchedRight.push(rightIdx);
      }
    });

    return { matchedLeft, matchedRight, unmatchedLeft, unmatchedRight };
  };

  const { matchedLeft, matchedRight, unmatchedLeft, unmatchedRight } = getMatchInfo();

  // Determine which rows to include based on join type
  const includeLeftRow = (idx: number) => {
    if (activeJoinType === "INNER") return matchedLeft.includes(idx);
    if (activeJoinType === "LEFT" || activeJoinType === "FULL") return true;
    if (activeJoinType === "RIGHT") return matchedLeft.includes(idx);
    return false;
  };

  const includeRightRow = (idx: number) => {
    if (activeJoinType === "INNER") return matchedRight.includes(idx);
    if (activeJoinType === "RIGHT" || activeJoinType === "FULL") return true;
    if (activeJoinType === "LEFT") return matchedRight.includes(idx);
    return false;
  };

  const getRowColor = (isLeft: boolean, idx: number) => {
    const matched = isLeft ? matchedLeft.includes(idx) : matchedRight.includes(idx);
    const included = isLeft ? includeLeftRow(idx) : includeRightRow(idx);

    if (!included) return "bg-gray-100 text-gray-400 opacity-50";
    if (matched) return "bg-emerald-50 border-emerald-500 text-emerald-900";
    return "bg-amber-50 border-amber-400 text-amber-900";
  };

  // Calculate result row count for JOINs
  const calculateResultRows = () => {
    if (activeJoinType === "INNER") {
      // INNER JOIN: Each matched row from left table gets combined with ALL matching rows from right table
      let total = 0;
      leftTable.rows.forEach((leftRow, leftIdx) => {
        if (matchedLeft.includes(leftIdx)) {
          const leftValue = leftRow[leftCol];
          const matchingRightRows = rightTable.rows.filter(rightRow => rightRow[rightCol] === leftValue);
          total += matchingRightRows.length;
        }
      });
      return total;
    } else if (activeJoinType === "LEFT") {
      // LEFT JOIN: Each left row appears once for each matching right row (or once with NULL if no match)
      let total = 0;
      leftTable.rows.forEach((leftRow) => {
        const leftValue = leftRow[leftCol];
        const matchingRightRows = rightTable.rows.filter(rightRow => rightRow[rightCol] === leftValue);
        total += Math.max(1, matchingRightRows.length); // At least 1 row per left row
      });
      return total;
    } else if (activeJoinType === "RIGHT") {
      // RIGHT JOIN: Each right row appears once for each matching left row (or once with NULL if no match)
      let total = 0;
      rightTable.rows.forEach((rightRow) => {
        const rightValue = rightRow[rightCol];
        const matchingLeftRows = leftTable.rows.filter(leftRow => leftRow[leftCol] === rightValue);
        total += Math.max(1, matchingLeftRows.length); // At least 1 row per right row
      });
      return total;
    } else { // FULL
      // FULL OUTER JOIN: All matched combinations + unmatched from both sides
      let total = 0;
      const processedRightRows = new Set<number>();

      leftTable.rows.forEach((leftRow) => {
        const leftValue = leftRow[leftCol];
        const matchingRightIndices: number[] = [];
        rightTable.rows.forEach((rightRow, rightIdx) => {
          if (rightRow[rightCol] === leftValue) {
            matchingRightIndices.push(rightIdx);
          }
        });

        if (matchingRightIndices.length > 0) {
          total += matchingRightIndices.length;
          matchingRightIndices.forEach(idx => processedRightRows.add(idx));
        } else {
          total += 1; // Unmatched left row
        }
      });

      // Add unmatched right rows
      rightTable.rows.forEach((_, rightIdx) => {
        if (!processedRightRows.has(rightIdx)) {
          total += 1;
        }
      });

      return total;
    }
  };

  const joinExamples: Record<JoinType, { query: string; description: string; color: string }> = {
    INNER: {
      query: `SELECT *\nFROM ${leftTable.name}\nINNER JOIN ${rightTable.name}\n  ON ${leftTable.name}.${leftCol} = ${rightTable.name}.${rightCol}`,
      description: "Returns only rows with matching values in both tables",
      color: "emerald",
    },
    LEFT: {
      query: `SELECT *\nFROM ${leftTable.name}\nLEFT JOIN ${rightTable.name}\n  ON ${leftTable.name}.${leftCol} = ${rightTable.name}.${rightCol}`,
      description: "Returns all rows from left table, with matches from right (NULL if no match)",
      color: "blue",
    },
    RIGHT: {
      query: `SELECT *\nFROM ${leftTable.name}\nRIGHT JOIN ${rightTable.name}\n  ON ${leftTable.name}.${leftCol} = ${rightTable.name}.${rightCol}`,
      description: "Returns all rows from right table, with matches from left (NULL if no match)",
      color: "purple",
    },
    FULL: {
      query: `SELECT *\nFROM ${leftTable.name}\nFULL OUTER JOIN ${rightTable.name}\n  ON ${leftTable.name}.${leftCol} = ${rightTable.name}.${rightCol}`,
      description: "Returns all rows from both tables (NULL where no match)",
      color: "indigo",
    },
  };

  const currentExample = joinExamples[activeJoinType];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* JOIN Type Selector */}
      <div className="flex flex-wrap gap-2">
        {(["INNER", "LEFT", "RIGHT", "FULL"] as JoinType[]).map((joinType) => (
          <button
            key={joinType}
            onClick={() => setActiveJoinType(joinType)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              activeJoinType === joinType
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-teal-400"
            }`}
          >
            {joinType} JOIN
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-blue-900 text-sm font-medium break-words">
          <strong className="text-lg">{activeJoinType} JOIN:</strong> {currentExample.description}
        </p>
        <p className="text-blue-800 text-xs mt-2 break-words">
          💡 Tip: The join columns ({leftCol} in {leftTable.name}, {rightCol} in {rightTable.name}) are highlighted with colored badges. Rows with matching values connect between tables.
        </p>
      </div>

      {/* Visual Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-mono font-bold text-gray-900">{leftTable.name}</h4>
          </div>
          <div className="space-y-1">
            {leftTable.rows.map((row, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-2 transition-all ${getRowColor(true, idx)}`}
              >
                <div className="space-y-1">
                  {leftTable.columns.map((col) => (
                    <div key={col.name} className="font-mono text-xs flex items-center gap-1 flex-wrap">
                      <span className={`text-gray-600 ${col.name === leftCol ? 'font-bold' : ''}`}>{col.name}:</span>
                      <span className={col.name === leftCol ? 'font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded break-all' : 'break-all'}>
                        {row[col.name]?.toString() || 'NULL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-mono font-bold text-gray-900">{rightTable.name}</h4>
          </div>
          <div className="space-y-1">
            {rightTable.rows.map((row, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-2 transition-all ${getRowColor(false, idx)}`}
              >
                <div className="space-y-1">
                  {rightTable.columns.map((col) => (
                    <div key={col.name} className="font-mono text-xs flex items-center gap-1 flex-wrap">
                      <span className={`text-gray-600 ${col.name === rightCol ? 'font-bold' : ''}`}>{col.name}:</span>
                      <span className={col.name === rightCol ? 'font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded break-all' : 'break-all'}>
                        {row[col.name]?.toString() || 'NULL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-500 rounded"></div>
          <span className="text-sm text-gray-700">Matched rows (included)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-50 border-2 border-amber-400 rounded"></div>
          <span className="text-sm text-gray-700">Unmatched (included with NULL)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded opacity-50"></div>
          <span className="text-sm text-gray-700">Excluded from result</span>
        </div>
      </div>

      {/* SQL Query */}
      <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">SQL Query</span>
          <CopyButton text={currentExample.query} />
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-gray-100 font-mono text-sm whitespace-pre">{currentExample.query}</code>
        </pre>
      </div>

      {/* Result Count */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-teal-900 font-medium text-sm">
            Result: {calculateResultRows()} row(s)
          </span>
        </div>
      </div>
    </div>
  );
}
