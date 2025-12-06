/**
 * Notes persistence module
 *
 * Stores per-challenge notes in localStorage using the same patterns as progress.ts
 */

export interface ChallengeNotes {
  packId: string;
  challengeId: string;
  content: string;
  updatedAt: string;
}

const STORAGE_KEY = "sql-learn-notes";

// Pending writes for debouncing
let pendingWrite: ChallengeNotes | null = null;
let writeTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Get all notes records
 */
export function getAllNotes(): ChallengeNotes[] {
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
 * Get notes for a specific challenge
 */
export function getNotes(packId: string, challengeId: string): ChallengeNotes | null {
  const all = getAllNotes();
  return all.find((n) => n.packId === packId && n.challengeId === challengeId) || null;
}

/**
 * Flush pending write to localStorage
 */
function flushNotesWrite(): void {
  if (typeof window === "undefined" || !pendingWrite) return;

  const all = getAllNotes();
  const index = all.findIndex(
    (n) => n.packId === pendingWrite!.packId && n.challengeId === pendingWrite!.challengeId
  );

  if (index >= 0) {
    all[index] = pendingWrite;
  } else {
    all.push(pendingWrite);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }

  pendingWrite = null;
  writeTimerId = null;
}

/**
 * Save notes for a challenge (debounced for performance during typing)
 */
export function saveNotes(packId: string, challengeId: string, content: string): void {
  if (typeof window === "undefined") return;

  pendingWrite = {
    packId,
    challengeId,
    content,
    updatedAt: new Date().toISOString(),
  };

  // Debounce writes - 500ms for typing
  if (writeTimerId !== null) {
    clearTimeout(writeTimerId);
  }

  writeTimerId = setTimeout(() => {
    flushNotesWrite();
  }, 500);
}

/**
 * Save notes immediately (for blur events)
 */
export function saveNotesSync(packId: string, challengeId: string, content: string): void {
  if (typeof window === "undefined") return;

  // Clear any pending debounced write
  if (writeTimerId !== null) {
    clearTimeout(writeTimerId);
    writeTimerId = null;
  }
  pendingWrite = null;

  const all = getAllNotes();
  const notes: ChallengeNotes = {
    packId,
    challengeId,
    content,
    updatedAt: new Date().toISOString(),
  };

  const index = all.findIndex(
    (n) => n.packId === packId && n.challengeId === challengeId
  );

  if (index >= 0) {
    all[index] = notes;
  } else {
    all.push(notes);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
}

/**
 * Delete notes for a challenge
 */
export function deleteNotes(packId: string, challengeId: string): void {
  if (typeof window === "undefined") return;

  const all = getAllNotes();
  const filtered = all.filter(
    (n) => !(n.packId === packId && n.challengeId === challengeId)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Export all notes as JSON
 */
export function exportNotes(): string {
  const all = getAllNotes();
  return JSON.stringify(all, null, 2);
}

/**
 * Import notes from JSON
 */
export function importNotes(json: string): void {
  if (typeof window === "undefined") return;

  try {
    const imported = JSON.parse(json);
    if (!Array.isArray(imported)) {
      throw new Error("Invalid notes data");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
  } catch (error) {
    throw new Error("Failed to import notes: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}
