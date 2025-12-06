# Sprint 12: Notes Feature

**Status:** Complete
**Duration:** 2025-12-06

## Goals
Add per-challenge notes with localStorage persistence so users can take notes while solving challenges.

## Tasks

### Task 1: Create Notes Persistence Module
**Status:** Complete

**New File:** `app/lib/notes.ts`

**Features:**
- `getNotes(packId, challengeId)` - Get notes for a challenge
- `saveNotes(packId, challengeId, content)` - Debounced save (500ms)
- `saveNotesSync(packId, challengeId, content)` - Immediate save (for blur)
- `deleteNotes(packId, challengeId)` - Delete notes
- `exportNotes()` / `importNotes()` - Export/import as JSON

**Data Structure:**
```typescript
interface ChallengeNotes {
  packId: string;
  challengeId: string;
  content: string;
  updatedAt: string; // ISO timestamp
}
```

**Storage Key:** `"sql-learn-notes"`

### Task 2: Add Notes Tab to ChallengeTabs
**Status:** Complete

**Changes to `app/components/ChallengeTabs.tsx`:**
- Extended `TabId` type to include "notes"
- Added Notes tab button with dot indicator when notes exist
- Added Notes tab content with:
  - Textarea for writing notes
  - Character count
  - Clear notes button
  - Auto-save indicator

**UX Features:**
- Notes saved on every keystroke (debounced 500ms)
- Immediate save on blur (no data loss)
- Badge indicator when notes exist
- Placeholder with suggested note structure

## Files Modified
- `app/lib/notes.ts` (NEW)
- `app/components/ChallengeTabs.tsx`

## Design Decisions
- **Plain text only** - Simpler than markdown, sufficient for quick notes
- **No cloud sync** - localStorage only for v1 (privacy-first)
- **Per-challenge** - Each challenge has independent notes
- **Debounced saves** - Prevents excessive localStorage writes during typing
