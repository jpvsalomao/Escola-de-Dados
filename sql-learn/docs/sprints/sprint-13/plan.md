# Sprint 13: LLM Answer Review

**Status:** Complete
**Duration:** 2025-12-06

## Goals
Add AI-powered answer review using Claude API so users can get feedback on their SQL approach before/after submitting.

## Tasks

### Task 1: Create API Route
**Status:** Complete

**New File:** `app/api/review/route.ts`

**Endpoint:** `POST /api/review`

**Request:**
```typescript
{
  userSql: string;
  challengePrompt: string;
  solutionSql: string;
  tables: string[];
  hint?: string;
}
```

**Response:**
```typescript
interface ReviewResponse {
  correctness: "correct" | "partially_correct" | "incorrect";
  summary: string;
  issues: Array<{
    type: "logic" | "syntax" | "efficiency" | "edge_case";
    description: string;
    suggestion: string;
  }>;
  strengths: string[];
  actionItems: string[];
}
```

**Features:**
- Uses Claude claude-sonnet-4-20250514 for cost/quality balance
- Rate limiting: 10 requests per minute per IP
- API key validation
- Error handling for common API errors

### Task 2: Create AnswerReview Component
**Status:** Complete

**New File:** `app/components/AnswerReview.tsx`

**Features:**
- "Review My Answer with AI" button
- Loading state with spinner
- Error display
- Structured review display:
  - Correctness badge (correct/partially correct/incorrect)
  - Summary
  - Strengths section
  - Issues section with type icons
  - Action items

### Task 3: Integrate into Help Tab
**Status:** Complete

**Changes to `app/components/ChallengeTabs.tsx`:**
- Added `userSql` prop to pass current SQL
- Added import for AnswerReview component
- Added AI Review section in Help tab

**Changes to `app/challenges/[packId]/[challengeId]/page.tsx`:**
- Pass `userSql={sql}` to ChallengeTabs

## Files Modified/Created
- `app/api/review/route.ts` (NEW)
- `app/components/AnswerReview.tsx` (NEW)
- `app/components/ChallengeTabs.tsx`
- `app/challenges/[packId]/[challengeId]/page.tsx`

## Setup Required
1. Add `ANTHROPIC_API_KEY` to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Install Anthropic SDK (already done):
   ```bash
   pnpm add @anthropic-ai/sdk
   ```

## Prompt Engineering

**System prompt focuses on:**
- Concise feedback (max 150 words)
- Actionable suggestions
- Not revealing the full solution
- Considering DuckDB syntax

**Structured JSON response** ensures consistent UI rendering.

## Rate Limiting
- In-memory rate limit: 10 requests/minute per IP
- Resets on server restart
- Returns 429 Too Many Requests when exceeded
