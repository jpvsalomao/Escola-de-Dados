"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Welcome to SQL Learn!",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            Master SQL through interactive challenges with instant feedback, all running in your browser. No setup required!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="font-bold text-gray-900 mb-2">Interactive Challenges</h4>
              <p className="text-sm text-gray-600">Learn by doing with real SQL queries and instant validation</p>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">💻</div>
              <h4 className="font-bold text-gray-900 mb-2">Browser-Based SQL</h4>
              <p className="text-sm text-gray-600">Powered by DuckDB-WASM - no installation needed</p>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="font-bold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor your learning journey and celebrate wins</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Learning Path",
      content: (
        <div className="space-y-5">
          <p className="text-gray-700 leading-relaxed mb-6">
            Pick the path that works best for you. You can switch between them anytime!
          </p>

          <Link
            href="/concepts"
            onClick={handleClose}
            className="group block p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:shadow-lg transition-all"
          >
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">📚 Start with Concepts</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Learn SQL fundamentals through clear explanations and examples
                </p>
                <span className="text-teal-600 font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore Concepts
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            onClick={handleClose}
            className="group block p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all"
          >
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">⚡ Jump into Challenges</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Dive straight in and learn by solving real-world SQL problems
                </p>
                <span className="text-orange-600 font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Challenges
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      ),
    },
    {
      title: "Pro Tips for Success",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed mb-4">
            Make the most of your SQL learning experience with these tips:
          </p>

          <div className="flex gap-3 items-start p-4 bg-teal-50 rounded-lg border border-teal-100">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">💡</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Use the Hints System</h4>
              <p className="text-gray-700 text-sm">
                Stuck? Click the hint button for guidance without seeing the full solution
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔍</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Read Error Messages</h4>
              <p className="text-gray-700 text-sm">
                Our intelligent error messages point you in the right direction
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🎯</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Practice Makes Perfect</h4>
              <p className="text-gray-700 text-sm">
                Review completed challenges to reinforce your learning
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Check the Schema</h4>
              <p className="text-gray-700 text-sm">
                View table structures to understand what data you're working with
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {steps[currentStep].title}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-2" aria-label="Progress indicator">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    index === currentStep
                      ? "bg-teal-600 w-8"
                      : index < currentStep
                      ? "bg-teal-300 w-2"
                      : "bg-gray-300 w-2"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                  aria-current={index === currentStep ? "step" : undefined}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ripple"
              >
                {currentStep === steps.length - 1 ? "Get Started!" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
