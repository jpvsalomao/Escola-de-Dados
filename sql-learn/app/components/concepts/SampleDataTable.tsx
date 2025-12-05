"use client";

import type { SampleTable, TableRow } from "@/app/lib/concept-examples";

interface SampleDataTableProps {
  table: SampleTable;
  highlightedRows?: number[]; // Row indices to highlight
  highlightedColumns?: string[]; // Column names to highlight
  maxRows?: number; // Limit rows displayed
  className?: string;
}

export function SampleDataTable({
  table,
  highlightedRows = [],
  highlightedColumns = [],
  maxRows,
  className = "",
}: SampleDataTableProps) {
  const displayRows = maxRows ? table.rows.slice(0, maxRows) : table.rows;
  const hasMore = maxRows && table.rows.length > maxRows;

  return (
    <div className={`overflow-x-auto ${className}`}>
      {/* Table Name */}
      <div className="mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="font-mono text-sm font-semibold text-teal-600">{table.name}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                {table.columns.map((column) => (
                  <th
                    key={column.name}
                    className={`px-4 py-3 text-left font-semibold text-gray-900 ${
                      highlightedColumns.includes(column.name)
                        ? "bg-teal-100 border-l-4 border-teal-500"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono">{column.name}</span>
                      <span className="text-xs text-gray-500 font-normal">{column.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayRows.map((row, rowIndex) => {
                const isHighlighted = highlightedRows.includes(rowIndex);
                return (
                  <tr
                    key={rowIndex}
                    className={`${
                      isHighlighted
                        ? "bg-emerald-50 border-l-4 border-emerald-500"
                        : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    {table.columns.map((column) => {
                      const value = row[column.name];
                      const isHighlightedCell =
                        isHighlighted || highlightedColumns.includes(column.name);

                      return (
                        <td
                          key={column.name}
                          className={`px-4 py-3 font-mono text-gray-700 ${
                            isHighlightedCell ? "font-semibold" : ""
                          }`}
                        >
                          {value === null ? (
                            <span className="text-gray-400 italic">NULL</span>
                          ) : typeof value === "number" ? (
                            <span className="text-indigo-600">{value}</span>
                          ) : (
                            <span className="text-gray-900">{String(value)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Show "more rows" indicator if truncated */}
        {hasMore && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-center">
            <span className="text-xs text-gray-500">
              ... and {table.rows.length - maxRows} more {table.rows.length - maxRows === 1 ? "row" : "rows"}
            </span>
          </div>
        )}
      </div>

      {/* Row count */}
      <div className="mt-2 text-xs text-gray-500">
        {displayRows.length} {displayRows.length === 1 ? "row" : "rows"} displayed
        {hasMore && ` of ${table.rows.length} total`}
      </div>
    </div>
  );
}
