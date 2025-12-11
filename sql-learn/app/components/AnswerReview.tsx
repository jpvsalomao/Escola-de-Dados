"use client";

import { useState } from "react";

interface ReviewIssue {
  type: "logic" | "syntax" | "efficiency" | "edge_case";
  description: string;
  suggestion: string;
}

interface ReviewResponse {
  correctness: "correct" | "partially_correct" | "incorrect";
  summary: string;
  issues: ReviewIssue[];
  strengths: string[];
  actionItems: string[];
}

interface AnswerReviewProps {
  userSql: string;
  challengePrompt: string;
  solutionSql: string;
  tables: string[];
  hint?: string;
}

const correctnessConfig: Record<string, { border: string; bg: string; text: string; label: string }> = {
  correct: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Correct Approach",
  },
  partially_correct: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Partially Correct",
  },
  incorrect: {
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Needs Revision",
  },
};

export function AnswerReview({
  userSql,
  challengePrompt,
  solutionSql,
  tables,
  hint,
}: AnswerReviewProps) {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!userSql.trim()) {
      setError("Please write some SQL before requesting a review.");
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userSql,
          challengePrompt,
          solutionSql,
          tables,
          hint,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get review");
      }

      const data: ReviewResponse = await response.json();
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const config = review ? correctnessConfig[review.correctness] : null;

  return (
    <div className="space-y-4">
      {/* Review Button */}
      <button
        onClick={handleReview}
        disabled={loading}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2
          ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          }
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Analyzing your query...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Review My Answer with AI</span>
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Review Results */}
      {review && config && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* Verdict */}
          <div className={`p-4 rounded-lg border ${config.border} ${config.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              {review.correctness === "correct" && (
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {review.correctness === "partially_correct" && (
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {review.correctness === "incorrect" && (
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`font-semibold ${config.text}`}>{config.label}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.summary}</p>
          </div>

          {/* Strengths */}
          {review.strengths.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">What you did well</h4>
              <ul className="space-y-1.5">
                {review.strengths.map((strength, i) => (
                  <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {review.issues.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-3">Areas to improve</h4>
              <div className="space-y-4">
                {review.issues.map((issue, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs capitalize">
                        {issue.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1.5">{issue.description}</p>
                    <p className="text-teal-700 bg-teal-50 px-2 py-1.5 rounded text-xs border border-teal-100">
                      <span className="font-medium">Tip:</span> {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {review.actionItems.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Next steps</h4>
              <ol className="space-y-1.5">
                {review.actionItems.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="font-medium text-gray-500">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Clear button */}
          <button
            onClick={() => setReview(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear review
          </button>
        </div>
      )}
    </div>
  );
}
