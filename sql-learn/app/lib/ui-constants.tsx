import React from "react";

/**
 * Shared UI constants and utilities for consistent theming
 */

// Section/Category color mappings
export const SECTION_COLORS = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  green: "bg-green-100 text-green-700 border-green-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
} as const;

export type SectionColorKey = keyof typeof SECTION_COLORS;

// Difficulty level colors
export const DIFFICULTY_COLORS = {
  easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  hard: "bg-rose-100 text-rose-800 border-rose-200",
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_COLORS;

// Icon names - centralized registry
export const ICON_NAMES = {
  "document-text": "document-text",
  "calculator": "calculator",
  "sort-ascending": "sort-ascending",
  "link": "link",
  "lightning": "lightning",
  "collection": "collection",
  "database": "database",
  "check-circle": "check-circle",
} as const;

export type IconName = keyof typeof ICON_NAMES;

// SVG icon paths
export const ICON_PATHS: Record<IconName, React.ReactNode> = {
  "document-text": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  ),
  "calculator": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  ),
  "sort-ascending": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  ),
  "link": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  ),
  "lightning": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  "collection": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  ),
  "database": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  ),
  "check-circle": (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
};

/**
 * Get Tailwind classes for a section color
 */
export function getSectionColorClasses(color: SectionColorKey | string): string {
  return SECTION_COLORS[color as SectionColorKey] || SECTION_COLORS.gray;
}

/**
 * Get Tailwind classes for a difficulty level
 */
export function getDifficultyColorClasses(difficulty: DifficultyLevel | string): string {
  return DIFFICULTY_COLORS[difficulty as DifficultyLevel] || DIFFICULTY_COLORS.medium;
}

/**
 * Get SVG path for an icon
 */
export function getIconPath(iconName: IconName | string): React.ReactNode {
  return ICON_PATHS[iconName as IconName] || ICON_PATHS.collection;
}
