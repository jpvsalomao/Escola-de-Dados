"use client";

import { cn } from "@/app/lib/utils";

interface ResultGridProps {
  data: Record<string, unknown>[];
  className?: string;
}

export function ResultGrid({ data, className }: ResultGridProps) {
  if (data.length === 0) {
    return (
      <div className={cn("p-4 text-gray-500 text-center border rounded-lg", className)}>
        No results
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className={cn("overflow-auto border rounded-lg", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return "NULL";
  if (value === undefined) return "";

  // Detect Unix timestamp in milliseconds (dates from 2000-2100)
  if (typeof value === "number") {
    const MIN_TIMESTAMP = 946684800000; // 2000-01-01
    const MAX_TIMESTAMP = 4102444800000; // 2100-01-01
    if (value >= MIN_TIMESTAMP && value <= MAX_TIMESTAMP) {
      return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    }
  }

  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
