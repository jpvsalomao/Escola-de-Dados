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
          // Continue Learning Card
          <Link
            href={`/challenges/${pack.id}/${nextChallengeInfo.challenge.id}`}
            className="block group mb-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-4 rounded-2xl"
            aria-label={`Continue with challenge ${nextChallengeInfo.index}: ${nextChallengeInfo.challenge.title}`}
          >
            <article className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border-2 border-orange-200 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-orange-300 hover-glow-coral">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Continue Learning</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    Challenge #{nextChallengeInfo.index}: {nextChallengeInfo.challenge.title}
                  </h2>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {nextChallengeInfo.challenge.prompt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {nextChallengeInfo.section && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSectionColorClasses(nextChallengeInfo.section.color)}`}>
                        {nextChallengeInfo.section.title}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getDifficultyColorClasses(nextChallengeInfo.challenge.difficulty)}`}>
                      {nextChallengeInfo.challenge.difficulty}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 text-orange-600 font-semibold text-lg group-hover:gap-3 transition-all">
                    <span>Start Challenge</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="text-center bg-white rounded-xl p-4 shadow-md min-w-[120px]">
                    <p className="text-sm text-gray-600 mb-1">Your Progress</p>
                    <div className="text-4xl font-bold text-orange-600 mb-1">{completionPercentage}%</div>
                    <p className="text-xs text-gray-500">
                      {completedChallenges.size}/{pack.challenges.length} completed
                    </p>
                  </div>
                </div>
              </div>
            </article>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-semibold text-gray-900">{pack.metadata.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Challenges</p>
                <p className="font-semibold text-gray-900">{pack.challenges.length} exercises</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Time</p>
                <p className="font-semibold text-gray-900">
                  {pack.metadata.estimatedTimeMinutes ? `~${pack.metadata.estimatedTimeMinutes} min` : 'Self-paced'}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {pack.metadata.learningObjectives && pack.metadata.learningObjectives.length > 0 && (
            <div className="pt-6 border-t border-gray-200 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-2">
                {pack.metadata.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {pack.metadata.prerequisites && pack.metadata.prerequisites.length > 0 && (
            <div className="pt-6 border-t border-gray-200 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {pack.metadata.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Info */}
          {(pack.metadata.authorBio || pack.metadata.authorLinks) && (
            <div className="pt-6 border-t border-gray-200 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About the Author
              </h3>
              {pack.metadata.authorBio && (
                <p className="text-gray-700 mb-3">{pack.metadata.authorBio}</p>
              )}
              {pack.metadata.authorLinks && (
                <div className="flex flex-wrap gap-3">
                  {pack.metadata.authorLinks.website && (
                    <a
                      href={pack.metadata.authorLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website
                    </a>
                  )}
                  {pack.metadata.authorLinks.github && (
                    <a
                      href={pack.metadata.authorLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {pack.metadata.authorLinks.twitter && (
                    <a
                      href={pack.metadata.authorLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </a>
                  )}
                  {pack.metadata.authorLinks.linkedin && (
                    <a
                      href={pack.metadata.authorLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

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
