"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "../lib/useTranslation";

export function WelcomeModal() {
  const { t } = useTranslation();
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
      title: t("welcome.step1.title"),
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {t("welcome.step1.intro")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-200">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step1.feature1_title")}</h4>
              <p className="text-sm text-gray-600">{t("welcome.step1.feature1_desc")}</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-xl border border-cyan-200">
              <div className="text-3xl mb-2">💻</div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step1.feature2_title")}</h4>
              <p className="text-sm text-gray-600">{t("welcome.step1.feature2_desc")}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step1.feature3_title")}</h4>
              <p className="text-sm text-gray-600">{t("welcome.step1.feature3_desc")}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("welcome.step2.title"),
      content: (
        <div className="space-y-6">
          <div className="flex gap-4 items-start p-4 bg-teal-50 rounded-xl border border-teal-200">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">{t("welcome.step2.path1_title")}</h4>
              <p className="text-gray-700 text-sm mb-3">
                {t("welcome.step2.path1_desc")}
              </p>
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                <span>{t("welcome.step2.path1_button")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-cyan-50 rounded-xl border border-cyan-200">
            <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">{t("welcome.step2.path2_title")}</h4>
              <p className="text-gray-700 text-sm mb-3">
                {t("welcome.step2.path2_desc")}
              </p>
              <Link
                href="/packs/pack_basics"
                className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-800 font-medium text-sm"
              >
                <span>{t("welcome.step2.path2_button")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("welcome.step3.title"),
      content: (
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step3.tip1_title")}</h4>
              <p className="text-gray-700 text-sm">
                {t("welcome.step3.tip1_desc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step3.tip2_title")}</h4>
              <p className="text-gray-700 text-sm">
                {t("welcome.step3.tip2_desc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step3.tip3_title")}</h4>
              <p className="text-gray-700 text-sm">
                {t("welcome.step3.tip3_desc")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">4</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{t("welcome.step3.tip4_title")}</h4>
              <p className="text-gray-700 text-sm">
                {t("welcome.step3.tip4_desc")}
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {steps[currentStep].title}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-teal-600 w-6"
                      : index < currentStep
                      ? "bg-teal-300"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t("welcome.previous")}
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
              >
                {currentStep === steps.length - 1 ? t("welcome.get_started") : t("welcome.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
