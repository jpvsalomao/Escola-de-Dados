"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChallengeCard } from "@/app/components/ChallengeCard";
import { ChallengeCardSkeleton } from "@/app/components/ChallengeCardSkeleton";
import { ProgressBadge } from "@/app/components/ProgressBadge";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { Icon } from "@/app/components/Icon";
import SkillsChecklist from "@/app/components/SkillsChecklist";
import InterviewCheatsheet from "@/app/components/InterviewCheatsheet";
import { loadPack } from "@/app/lib/pack";
import { getAllProgress, getPackCompletionPercentage } from "@/app/lib/progress";
import type { PackSchema } from "@/app/lib/types";
import { getSectionColorClasses, getDifficultyColorClasses } from "@/app/lib/ui-constants";

export default function PackPage() {
  const params = useParams();
  const packId = params.packId as string;

  const [pack, setPack] = useState<PackSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    // Load collapsed sections from localStorage (per-pack)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`collapsedSections_${packId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Save collapsed sections to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && packId) {
      localStorage.setItem(`collapsedSections_${packId}`, JSON.stringify([...collapsedSections]));
    }
  }, [collapsedSections, packId]);

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const loadedPack = await loadPack(`/packs/${packId}`);
        setPack(loadedPack);

        const percentage = getPackCompletionPercentage(
          loadedPack.id,
          loadedPack.challenges.length
        );
        setCompletionPercentage(percentage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pack");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [packId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-48 relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>

          {/* Pack Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-10 bg-gray-200 rounded w-64 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-96 max-w-full mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-80 max-w-full relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
              </div>
            </div>

            {/* Stats Row Skeleton */}
            <div className="flex gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Skeleton */}
          <div className="mb-6">
            <div className="h-7 bg-gray-200 rounded w-48 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <ChallengeCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Error Loading Pack</h2>
          </div>
          <p className="text-red-600 mb-4">{error || "Pack not found"}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Packs
          </Link>
        </div>
      </div>
    );
  }

  const progress = getAllProgress();
  const completedChallenges = new Set(
    progress.filter((p) => p.completed).map((p) => p.challengeId)
  );

  // Organize challenges by sections (v1.2+) or as a single sequential list
  type SectionGroup = {
    id: string;
    title: string;
    icon: string;
    description: string;
    color: string;
    challenges: typeof pack.challenges;
  };

  const challengesBySection: SectionGroup[] = [];

  // Check if pack uses section-based organization (v1.2+)
  const usesSections = pack.sections && pack.challenges.some(c => c.section);

  if (usesSections && pack.sections) {
    // Pack Schema v1.2: Use section-based organization
    // Group challenges by their section field
    const sectionMap = new Map<string, typeof pack.challenges>();

    pack.challenges.forEach(challenge => {
      const sectionId = challenge.section || 'unsectioned';
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, []);
      }
      sectionMap.get(sectionId)!.push(challenge);
    });

    // Create section groups in order they appear in pack.sections
    const sectionOrder = Object.keys(pack.sections);

    sectionOrder.forEach(sectionId => {
      const sectionDef = pack.sections![sectionId];
      const challenges = sectionMap.get(sectionId) || [];

      if (challenges.length > 0) {
        challengesBySection.push({
          id: sectionId,
          title: sectionDef.title,
          icon: sectionDef.icon || 'collection',
          description: sectionDef.description || '',
          color: sectionDef.color || 'blue',
          challenges
        });
      }
    });

    // Add any unsectioned challenges at the end
    const unsectioned = sectionMap.get('unsectioned');
    if (unsectioned && unsectioned.length > 0) {
      challengesBySection.push({
        id: 'unsectioned',
        title: 'Other Challenges',
        icon: 'collection',
        description: 'Additional challenges',
        color: 'gray',
        challenges: unsectioned
      });
    }
  } else {
    // Pack Schema v1.1 or earlier: Display as single sequential list
    challengesBySection.push({
      id: 'all',
      title: 'Challenges',
      icon: 'collection',
      description: `All ${pack.challenges.length} challenges in order`,
      color: 'blue',
      challenges: pack.challenges
    });
  }

  // Calculate section progress
  const getSectionProgress = (challenges: typeof pack.challenges) => {
    const completed = challenges.filter(c => completedChallenges.has(c.id)).length;
    const total = challenges.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Find next recommended challenge
  const getNextChallenge = () => {
    // Find the first uncompleted challenge in the original pack order
    const nextChallenge = pack.challenges.find(c => !completedChallenges.has(c.id));
    if (!nextChallenge) return null;

    // Find which section this challenge belongs to
    let sectionInfo = null;
    for (const section of challengesBySection) {
      if (section.challenges.some(c => c.id === nextChallenge.id)) {
        sectionInfo = section;
        break;
      }
    }

    return {
      challenge: nextChallenge,
      section: sectionInfo,
      index: pack.challenges.findIndex(c => c.id === nextChallenge.id) + 1
    };
  };

  const nextChallengeInfo = getNextChallenge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Hero Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Return to home"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </Link>
            <div>
              <Link href="/" className="text-4xl font-bold text-gray-900 tracking-tight hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded">
                SQL Learn
              </Link>
              <p className="text-gray-600 mt-1 text-lg">Interactive SQL challenges from Escola de Dados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: pack.title }]} />

        {/* Continue Learning Section */}
        {completionPercentage === 100 ? (
          // Celebration Message for 100% completion
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border-2 border-green-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Congratulations!</h2>
                  <p className="text-gray-700">You&apos;ve completed all {pack.challenges.length} challenges in this pack!</p>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end">
                <div className="text-6xl font-bold text-green-600 mb-1">100%</div>
                <p className="text-sm text-gray-600">Pack Completed</p>
              </div>
            </div>
          </div>
        ) : nextChallengeInfo ? (
          // Compact Continue Learning Bar
          <Link
            href={`/challenges/${pack.id}/${nextChallengeInfo.challenge.id}`}
            className="block group mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl"
            aria-label={`Continue with challenge ${nextChallengeInfo.index}: ${nextChallengeInfo.challenge.title}`}
          >
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-all hover:bg-orange-100 hover:border-orange-300">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-orange-600 font-medium">Continue where you left off</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    #{nextChallengeInfo.index} {nextChallengeInfo.challenge.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-gray-500 hidden sm:block">
                  {completedChallenges.size}/{pack.challenges.length} done
                </span>
                <svg className="w-5 h-5 text-orange-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ) : null}

        {/* Pack Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{pack.title}</h2>
              {pack.description && (
                <p className="text-gray-600 text-lg mb-4">{pack.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {pack.metadata.difficulty && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColorClasses(pack.metadata.difficulty)}`}
                  >
                    {pack.metadata.difficulty}
                  </span>
                )}
                {pack.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ProgressBadge percentage={completionPercentage} />
            </div>
          </div>

          {/* Compact Stats Row */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{pack.metadata.author}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{pack.challenges.length} exercises</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{pack.metadata.estimatedTimeMinutes ? `~${pack.metadata.estimatedTimeMinutes} min` : 'Self-paced'}</span>
            </div>
          </div>
        </div>

        {/* Interview Cheatsheet - Only for packs with conceptExplanation */}
        {pack.challenges.some(c => c.conceptExplanation) && (
          <InterviewCheatsheet
            challenges={pack.challenges}
            completedChallengeIds={completedChallenges}
            packId={pack.id}
          />
        )}

        {/* Skills Mastery Checklist - Only for packs with conceptExplanation */}
        {pack.challenges.some(c => c.conceptExplanation) && (
          <SkillsChecklist
            challenges={pack.challenges}
            completedChallengeIds={completedChallenges}
            packId={pack.id}
          />
        )}

        {/* Challenges by Section - Only for packs WITHOUT skills-based organization */}
        {!pack.challenges.some(c => c.conceptExplanation) && (
          <div className="space-y-8">
            {challengesBySection.map((section) => {
              if (section.challenges.length === 0) return null;

              const sectionProgress = getSectionProgress(section.challenges);

              return (
                <div key={section.id} className="space-y-4">
                  {/* Section Header - Clickable */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    aria-expanded={!collapsedSections.has(section.id)}
                    aria-controls={`section-${section.id}-content`}
                    aria-label={`${collapsedSections.has(section.id) ? 'Expand' : 'Collapse'} ${section.title} section`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Chevron Icon */}
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${collapsedSections.has(section.id) ? '' : 'rotate-90'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>

                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSectionColorClasses(section.color)}`}
                        aria-hidden="true"
                      >
                        <Icon name={section.icon} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>

                    {/* Section Progress */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {sectionProgress.completed}/{sectionProgress.total} completed
                        </p>
                        <p className="text-xs text-gray-500">{sectionProgress.percentage}%</p>
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="transform -rotate-90 w-16 h-16" viewBox="0 0 36 36">
                          {/* Background circle */}
                          <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            fill="none"
                            stroke={sectionProgress.percentage === 100 ? '#10b981' : '#0D9488'}
                            strokeWidth="3"
                            strokeDasharray={`${(sectionProgress.percentage / 100) * 97.4}, 97.4`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Percentage text in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-700">{sectionProgress.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Challenges Grid - Collapsible */}
                  {!collapsedSections.has(section.id) && (
                    <div
                      id={`section-${section.id}-content`}
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300"
                      role="list"
                      aria-label={`${section.title} challenges`}
                    >
                      {section.challenges.map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          packId={pack.id}
                          completed={completedChallenges.has(challenge.id)}
                          index={pack.challenges.findIndex(c => c.id === challenge.id) + 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-200 bg-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              SQL Learn v1.0.0 - Built with Next.js, DuckDB-WASM, and Monaco Editor
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Practice SQL queries in your browser with instant feedback
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
