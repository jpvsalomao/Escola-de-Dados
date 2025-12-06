"use client";

import { useState, useEffect } from "react";
import type { Challenge, PackSchema } from "@/app/lib/types";
import { useTranslation } from "@/app/lib/useTranslation";
import ConceptExplanation from "./ConceptExplanation";
import InterviewTips from "./InterviewTips";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { CopyButton } from "./concepts/CopyButton";
import { getNotes, saveNotes, saveNotesSync } from "@/app/lib/notes";
import { AnswerReview } from "./AnswerReview";

type TabId = "challenge" | "strategy" | "help" | "notes";

interface ChallengeTabsProps {
  challenge: Challenge;
  pack: PackSchema;
  packId: string;
  challengeId: string;
  // User's current SQL (for AI review)
  userSql: string;
  // Table expansion state (managed by parent)
  expandedTables: Set<string>;
  tableSchemas: Record<string, Array<{ name: string; type: string }>>;
  duckdbReady: boolean;
  onToggleTable: (tableName: string) => void;
  // Hint state (managed by parent)
  hintLevel: number;
  onSetHintLevel: (level: number) => void;
  // Solution state (managed by parent)
  showSolution: boolean;
  onSetShowSolution: (show: boolean) => void;
  // Progress info
  bestTime?: number;
  completed?: boolean;
}

export function ChallengeTabs({
  challenge,
  pack,
  packId,
  challengeId,
  userSql,
  expandedTables,
  tableSchemas,
  duckdbReady,
  onToggleTable,
  hintLevel,
  onSetHintLevel,
  showSolution,
  onSetShowSolution,
  bestTime,
  completed,
}: ChallengeTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("challenge");
  const [notes, setNotes] = useState("");
  const [hasNotes, setHasNotes] = useState(false);

  // Determine if Strategy tab should be visible
  const hasStrategyContent = !!(challenge.conceptExplanation || challenge.interviewTips);

  // Load persisted tab and notes from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(`activeTab_${packId}_${challengeId}`);
    if (savedTab && ["challenge", "strategy", "help", "notes"].includes(savedTab)) {
      // Only restore strategy if content exists
      if (savedTab === "strategy" && !hasStrategyContent) {
        setActiveTab("challenge");
      } else {
        setActiveTab(savedTab as TabId);
      }
    } else {
      setActiveTab("challenge");
    }

    // Load notes
    const savedNotes = getNotes(packId, challengeId);
    if (savedNotes) {
      setNotes(savedNotes.content);
      setHasNotes(savedNotes.content.trim().length > 0);
    }
  }, [packId, challengeId, hasStrategyContent]);

  // Handle notes change with debounced save
  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasNotes(value.trim().length > 0);
    saveNotes(packId, challengeId, value);
  };

  // Save notes immediately on blur
  const handleNotesBlur = () => {
    saveNotesSync(packId, challengeId, notes);
  };

  // Persist tab selection
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    localStorage.setItem(`activeTab_${packId}_${challengeId}`, tab);
  };

  // Get tables to display (filtered by challenge.tables if specified)
  const tablesToShow = challenge.tables
    ? pack.datasets.filter((ds) => challenge.tables?.includes(ds.name))
    : pack.datasets;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <TabButton
          active={activeTab === "challenge"}
          onClick={() => handleTabChange("challenge")}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          Challenge
        </TabButton>

        {hasStrategyContent && (
          <TabButton
            active={activeTab === "strategy"}
            onClick={() => handleTabChange("strategy")}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          >
            Strategy
          </TabButton>
        )}

        <TabButton
          active={activeTab === "help"}
          onClick={() => handleTabChange("help")}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          badge={hintLevel > 0 ? `${hintLevel}/3` : undefined}
        >
          Help
        </TabButton>

        <TabButton
          active={activeTab === "notes"}
          onClick={() => handleTabChange("notes")}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          badge={hasNotes ? "•" : undefined}
        >
          Notes
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="tab-content-container">
        {/* Challenge Tab */}
        {activeTab === "challenge" && (
          <div className="p-6 space-y-6 tab-content-fade">
            {/* Challenge Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Challenge</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{challenge.prompt}</p>

              {completed && bestTime && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-700 font-medium">
                    Best time: {bestTime.toFixed(0)}ms
                  </span>
                </div>
              )}
            </div>

            {/* Before You Code */}
            {challenge.beforeYouCode && challenge.beforeYouCode.length > 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Before You Code</h3>
                    <p className="text-xs text-amber-700">Consider these questions first</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {challenge.beforeYouCode.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border-2 border-amber-300 bg-white"></span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Available Tables */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{t("challenge.available_tables")}</h3>
              </div>
              <div className="space-y-2">
                {tablesToShow.map((ds) => (
                  <div key={ds.name} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onToggleTable(ds.name)}
                      disabled={!duckdbReady}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 text-indigo-600 transition-transform ${expandedTables.has(ds.name) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-mono font-medium text-gray-900 text-sm">{ds.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {expandedTables.has(ds.name) && tableSchemas[ds.name] && (
                          <span>{tableSchemas[ds.name].length} columns</span>
                        )}
                      </div>
                    </button>

                    {expandedTables.has(ds.name) && (
                      <div className="border-t border-gray-200 bg-gray-50 slide-down">
                        {tableSchemas[ds.name] ? (
                          <div className="p-3">
                            <div className="space-y-1.5">
                              {tableSchemas[ds.name].map((column, idx) => (
                                <div
                                  key={column.name}
                                  className="flex items-center justify-between text-sm bg-white rounded px-3 py-1.5 border border-gray-200 stagger-fade-in"
                                  style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                  <span className="font-mono font-medium text-gray-900 text-xs">{column.name}</span>
                                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-mono">{column.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center">
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            <p className="text-xs text-gray-500 mt-2">Loading schema...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Strategy Tab */}
        {activeTab === "strategy" && hasStrategyContent && (
          <div className="p-6 space-y-6 tab-content-fade">
            {/* Concept Explanation */}
            {challenge.conceptExplanation && (
              <ConceptExplanation concept={challenge.conceptExplanation} />
            )}

            {/* Interview Tips */}
            {challenge.interviewTips && (
              <InterviewTips tips={challenge.interviewTips} defaultExpanded />
            )}

            {/* Empty state if somehow we got here without content */}
            {!challenge.conceptExplanation && !challenge.interviewTips && (
              <div className="text-center py-8 text-gray-500">
                <p>No strategy content available for this challenge.</p>
              </div>
            )}
          </div>
        )}

        {/* Help Tab */}
        {activeTab === "help" && (
          <div className="p-6 space-y-6 tab-content-fade">
            {/* Progressive Hints */}
            {(challenge.hints || challenge.hint) && (
              <div>
                <div className="flex items-center gap-2 text-amber-600 font-semibold mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{t("challenge.hints_title")}</span>
                </div>

                {challenge.hints ? (
                  <div className="space-y-3">
                    {/* Tier 1 */}
                    {challenge.hints.tier1 && (
                      <div>
                        {hintLevel < 1 ? (
                          <button
                            onClick={() => onSetHintLevel(1)}
                            className="w-full px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium text-sm transition-colors"
                          >
                            {t("challenge.hint_tier1")}
                          </button>
                        ) : (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">💡</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{challenge.hints.tier1}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 2 */}
                    {challenge.hints.tier2 && hintLevel >= 1 && (
                      <div>
                        {hintLevel < 2 ? (
                          <button
                            onClick={() => onSetHintLevel(2)}
                            className="w-full px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium text-sm transition-colors"
                          >
                            {t("challenge.hint_tier2")}
                          </button>
                        ) : (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🎯</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{challenge.hints.tier2}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 3 */}
                    {challenge.hints.tier3 && hintLevel >= 2 && (
                      <div>
                        {hintLevel < 3 ? (
                          <button
                            onClick={() => onSetHintLevel(3)}
                            className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium text-sm transition-colors"
                          >
                            {t("challenge.hint_tier3")}
                          </button>
                        ) : (
                          <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🔥</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{challenge.hints.tier3}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reset hints */}
                    {hintLevel > 0 && (
                      <button
                        onClick={() => onSetHintLevel(0)}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                      >
                        {t("challenge.hide_hints")}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Fallback for old single-hint format */
                  <div>
                    {hintLevel === 0 ? (
                      <button
                        onClick={() => onSetHintLevel(1)}
                        className="w-full px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium text-sm transition-colors"
                      >
                        💡 Show Hint
                      </button>
                    ) : (
                      <>
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg slide-down">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap">{challenge.hint}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onSetHintLevel(0)}
                          className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                        >
                          Hide hint
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Solution */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => onSetShowSolution(!showSolution)}
                className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold w-full text-left"
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${showSolution ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showSolution ? t("challenge.hide_solution") : t("challenge.view_solution")}
                </span>
              </button>
              {showSolution && (
                <div className="mt-4 animate-in fade-in duration-300">
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-amber-900">
                        💡 <strong>{t("challenge.solution_warning_title")}</strong> {t("challenge.solution_warning")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span className="text-xs text-gray-400 font-mono">SQL Solution</span>
                      <CopyButton text={challenge.solution_sql} />
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-gray-100 font-mono text-sm whitespace-pre">{challenge.solution_sql}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* AI Answer Review */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">AI Review</h3>
                  <p className="text-xs text-gray-500">Get feedback on your approach</p>
                </div>
              </div>
              <AnswerReview
                userSql={userSql}
                challengePrompt={challenge.prompt}
                solutionSql={challenge.solution_sql}
                tables={pack.datasets.map((ds) => ds.name)}
                hint={challenge.hints?.tier1 || challenge.hint}
              />
            </div>

            {/* Keyboard Shortcuts */}
            <div className="border-t border-gray-200 pt-6">
              <KeyboardShortcuts />
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="p-6 tab-content-fade">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Notes</h2>
                <p className="text-xs text-gray-500">Notes are saved automatically</p>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Write your notes here...

Ideas for this challenge:
• Key concepts to remember
• Approach you tried
• Edge cases to consider
• Things learned"
              className="w-full h-64 p-4 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{notes.length} characters</span>
              {hasNotes && (
                <button
                  onClick={() => {
                    setNotes("");
                    setHasNotes(false);
                    saveNotesSync(packId, challengeId, "");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear notes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}

function TabButton({ active, onClick, icon, children, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "text-teal-700 border-teal-600 bg-white"
          : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
      }`}
    >
      {icon}
      <span>{children}</span>
      {badge && (
        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
          active ? "bg-teal-100 text-teal-700" : "bg-gray-200 text-gray-600"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
