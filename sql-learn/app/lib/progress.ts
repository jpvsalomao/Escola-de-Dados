import type { Progress } from "./types";

const STORAGE_KEY = "sql-learn-progress";

/**
 * Get all progress records
 */
export function getAllProgress(): Progress[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Get progress for a specific challenge
 */
export function getProgress(packId: string, challengeId: string): Progress | null {
  const all = getAllProgress();
  return all.find((p) => p.packId === packId && p.challengeId === challengeId) || null;
}

/**
 * Save progress for a challenge
 */
export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;

  const all = getAllProgress();
  const index = all.findIndex(
    (p) => p.packId === progress.packId && p.challengeId === progress.challengeId
  );

  if (index >= 0) {
    all[index] = progress;
  } else {
    all.push(progress);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Mark a challenge as completed
 */
export function markCompleted(
  packId: string,
  challengeId: string,
  elapsedMs: number
): void {
  const existing = getProgress(packId, challengeId);

  const progress: Progress = {
    packId,
    challengeId,
    completed: true,
    attempts: (existing?.attempts || 0) + 1,
    lastAttempt: new Date().toISOString(),
    bestTime: existing?.bestTime
      ? Math.min(existing.bestTime, elapsedMs)
      : elapsedMs,
  };

  saveProgress(progress);
}

/**
 * Record a failed attempt
 */
export function recordAttempt(packId: string, challengeId: string): void {
  const existing = getProgress(packId, challengeId);

  const progress: Progress = {
    packId,
    challengeId,
    completed: existing?.completed || false,
    attempts: (existing?.attempts || 0) + 1,
    lastAttempt: new Date().toISOString(),
    bestTime: existing?.bestTime,
  };

  saveProgress(progress);
}

/**
 * Get completion percentage for a pack
 */
export function getPackCompletionPercentage(
  packId: string,
  totalChallenges: number
): number {
  const all = getAllProgress();
  const completed = all.filter((p) => p.packId === packId && p.completed).length;
  return totalChallenges > 0 ? Math.round((completed / totalChallenges) * 100) : 0;
}

/**
 * Clear all progress
 */
export function clearAllProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export progress as JSON
 */
export function exportProgress(): string {
  const all = getAllProgress();
  return JSON.stringify(all, null, 2);
}

/**
 * Import progress from JSON
 */
export function importProgress(json: string): void {
  if (typeof window === "undefined") return;

  try {
    const imported = JSON.parse(json);
    if (!Array.isArray(imported)) {
      throw new Error("Invalid progress data");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
  } catch (error) {
    throw new Error("Failed to import progress: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}
