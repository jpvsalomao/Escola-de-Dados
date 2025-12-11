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
  label: string;
  emoji: string;
  description: string;
}

const tipSections: TipSection[] = [
  {
    key: "thinkOutLoud",
    label: "Think Out Loud",
    emoji: "🗣️",
    description: "What to verbalize as you code",
  },
  {
    key: "detailsToCheck",
    label: "Details to Check",
    emoji: "✅",
    description: "Verify before coding",
  },
  {
    key: "metaProductContext",
    label: "Meta Product Context",
    emoji: "📱",
    description: "Real-world application",
  },
  {
    key: "avoidGeneric",
    label: "Avoid Generic",
    emoji: "⚠️",
    description: "Specific pitfalls",
  },
  {
    key: "followUpQuestion",
    label: "Likely Follow-up",
    emoji: "🔮",
    description: "Prepare for this",
  },
];

export default function InterviewTips({ tips, defaultExpanded = false }: InterviewTipsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="text-left">
            <span className="font-medium text-gray-900 text-sm">Interview Strategy</span>
            <span className="text-xs text-gray-500 ml-2">Plan your approach before coding</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{availableTips.length} tips</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-2 slide-down">
          {availableTips.map((section) => (
            <div
              key={section.key}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.has(section.key) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm">{section.emoji}</span>
                  <span className="font-medium text-gray-700 text-sm">{section.label}</span>
                  <span className="text-xs text-gray-500">{section.description}</span>
                </div>
              </button>

              {expandedSections.has(section.key) && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed pl-6">
                    {tips[section.key]}
                  </p>
                </div>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-500 text-center pt-2">
            Based on Meta&apos;s official DS interview guide
          </p>
        </div>
      )}
    </div>
  );
}
