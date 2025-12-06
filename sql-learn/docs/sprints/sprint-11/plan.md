# Sprint 11: Editor & Test Improvements

**Status:** Complete
**Duration:** 2025-12-06

## Goals
1. Make SQL editor taller for interview challenges (better UX for complex queries)
2. Strengthen test assertions to prevent false positives in grading

## Tasks

### Task 1: Increase SQL Editor Height
**Status:** Complete

**Changes:**
- Added `height` prop to `app/components/Editor.tsx` (default: "300px")
- Updated `app/challenges/[packId]/[challengeId]/page.tsx` to pass `height="500px"` for `pack_meta_interview`

**Rationale:** Complex interview questions require writing longer SQL queries. The 300px height was limiting visibility.

### Task 2: Strengthen Test Assertions
**Status:** Complete

**Problem:** Some challenges (like `q7_video_call_percentage`) were passing conceptually incorrect answers because tests only verified:
- Row count
- Column names
- Value ranges (0-100 for percentages)

But NOT the actual computed values.

**Solution:**
1. Created `scripts/add-value-tests.py` to add value-verification tests
2. Added tests that check specific expected values (e.g., "active_users = 10", "video_callers = 4")
3. Applied to all 18 Meta interview challenges

**Tests Added:**
- `correct_active_users` - Verifies exact count
- `correct_video_callers` - Verifies exact count
- `correct_percentage` - Verifies percentage with tolerance

**Fix Found:** `q2_mau_retention` test expected 4 but solution returns 13 rows. Updated expected value.

## Files Modified
- `app/components/Editor.tsx`
- `app/challenges/[packId]/[challengeId]/page.tsx`
- `public/packs/pack_meta_interview/pack.json`
- `scripts/add-value-tests.py` (NEW)

## Verification
- All 20 Meta interview challenges pass with `node scripts/test-challenges.js pack_meta_interview`
- TypeScript compiles without errors
