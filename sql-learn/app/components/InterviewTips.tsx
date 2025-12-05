"use client";

import { useState } from "react";

export interface InterviewTipsData {
  thinkOutLoud?: string;
  detailsToCheck?: string;
  metaProductContext?: string;
  avoidGeneric?: string;
  followUpQuestion?: string;
}

interface InterviewTipsProps {
  tips: InterviewTipsData;
  defaultExpanded?: boolean;
}

interface TipSection {
  key: keyof InterviewTipsData;
  icon: string;
  label: string;
  description: string;
  color: string;
}

const tipSections: TipSection[] = [
  {
    key: "thinkOutLoud",
    icon: "🗣️",
    label: "Think Out Loud",
    description: "What to verbalize as you code",
    color: "teal",
  },
  {
    key: "detailsToCheck",
    icon: "🔍",
    label: "Details to Check",
    description: "Verify before coding",
    color: "blue",
  },
  {
    key: "metaProductContext",
    icon: "📱",
    label: "Meta Product Context",
    description: "Real-world application",
    color: "indigo",
  },
  {
    key: "avoidGeneric",
    icon: "⚠️",
    label: "Avoid Generic",
    description: "Specific pitfalls",
    color: "amber",
  },
  {
    key: "followUpQuestion",
    icon: "❓",
    label: "Likely Follow-up",
    description: "Prepare for this",
    color: "orange",
  },
];

export default function InterviewTips({ tips, defaultExpanded = false }: InterviewTipsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // Auto-expand "Think Out Loud" section by default (Meta: "Think out loud, explain thought process while coding")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(tips.thinkOutLoud ? ["thinkOutLoud"] : [])
  );

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const availableTips = tipSections.filter((section) => tips[section.key]);

  if (availableTips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-indigo-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Interview Strategy</h3>
            <p className="text-xs text-indigo-600">
              Plan your approach before coding
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-indigo-600 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-2 slide-down border-t border-indigo-100">
          {availableTips.map((section) => (
            <div
              key={section.key}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.icon}</span>
                  <div className="text-left">
                    <span className="font-medium text-gray-800 text-sm">
                      {section.label}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {section.description}
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    expandedSections.has(section.key) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedSections.has(section.key) && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {tips[section.key]}
                  </p>
                </div>
              )}
            </div>
          ))}

          <div className="mt-3 pt-3 border-t border-indigo-100">
            <p className="text-xs text-indigo-600 text-center">
              💡 Based on Meta&apos;s official DS interview guide
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
