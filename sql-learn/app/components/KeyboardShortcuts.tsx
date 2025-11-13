"use client";

import { useState } from "react";

export function KeyboardShortcuts() {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortcuts = [
    { 
      keys: ["Ctrl", "+", "Enter"], 
      macKeys: ["⌘", "+", "Enter"],
      description: "Run SQL query",
      tip: "Test your query without submitting for grading"
    },
    { 
      keys: ["Esc"], 
      macKeys: ["Esc"],
      description: "Clear results and errors",
      tip: "Quick way to reset your workspace"
    },
  ];

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 -m-1"
        aria-expanded={isExpanded}
        aria-controls="shortcuts-content"
        aria-label={isExpanded ? "Hide keyboard shortcuts" : "Show keyboard shortcuts"}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="font-semibold text-gray-900 text-sm">Keyboard Shortcuts</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div 
          id="shortcuts-content" 
          className="mt-4 space-y-3 border-t border-gray-200 pt-4 animate-in fade-in duration-300"
          role="region"
          aria-label="Keyboard shortcuts details"
        >
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {(isMac ? shortcut.macKeys : shortcut.keys).map((key, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono font-semibold text-gray-800 shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">{shortcut.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
