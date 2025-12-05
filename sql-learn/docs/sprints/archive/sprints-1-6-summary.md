# Sprints 1-6 Summary

**Period:** October - November 2025
**Project:** SQL Learn Platform - Meta Interview Pack Development

## Overview

Sprints 1-6 focused on building the Meta Interview SQL Pack from scratch, including dataset generation, challenge creation, and interview-specific features.

---

## Sprint 1: Initial Setup & Core Architecture

**Goal:** Set up DuckDB-WASM and basic challenge infrastructure

**Completed:**
- DuckDB-WASM integration with Web Worker
- Basic grading system with ROWCOUNT and SQL assertions
- Pack schema v1.0
- Monaco Editor integration
- localStorage progress tracking

---

## Sprint 2: Grading System Enhancements

**Goal:** Improve grading accuracy and flexibility

**Completed:**
- Added SCHEMA_EQ assertion type
- Added SET_EQ assertion type (order-insensitive comparison)
- Added NEAR assertion for floating-point tolerance
- SQL normalization (trailing semicolons)
- Better error messages

---

## Sprint 3: Category System

**Goal:** Organize challenges by skill categories

**Completed:**
- Tag-based categorization
- Collapsible sections on pack page
- Category icons and descriptions
- Progress indicators per category

---

## Sprint 4: Pack Schema v1.2

**Goal:** Support richer challenge metadata

**Completed:**
- `conceptExplanation` field for educational content
- `skill` and `relatedSkills` for granular categorization
- `metadata.author` and `metadata.lastUpdated`
- Schema validation improvements

---

## Sprint 5: Interview Tips & Meta Context

**Goal:** Add interview-specific guidance

**Completed:**
- `InterviewTips` component
- Tips sections: Think Out Loud, Details to Check, Meta Product Context
- Expandable tip panels
- Based on Meta's official DS interview guide

---

## Sprint 6: Meta Interview Pack (20 Questions)

**Goal:** Create comprehensive Meta SQL interview prep pack

**Completed:**
- Generated 20 interview-style challenges
- Created `meta_engagement.parquet` dataset (1M rows)
- Added `conceptExplanation` for each challenge
- Balanced difficulty distribution (easy/medium/hard)
- Skills coverage: aggregations, window functions, JOINs, subqueries

**Dataset Structure:**
- `users` - User profiles with regions and account dates
- `posts` - Content with engagement metrics
- `likes`, `comments`, `shares` - Interaction data
- `sessions` - User activity logs
- `ads` - Advertisement performance

---

## Key Files Created

| Sprint | Key Files |
|--------|-----------|
| 1 | `app/lib/duck.ts`, `app/lib/grader.ts` |
| 2 | `app/lib/types.ts` (assert types) |
| 3 | `app/packs/[packId]/page.tsx` (categories) |
| 4 | Pack schema v1.2 spec |
| 5 | `app/components/InterviewTips.tsx` |
| 6 | `public/packs/pack_meta_interview/` |

---

## Lessons Learned

1. **Pack Schema Evolution:** Started simple, added fields as needed
2. **DuckDB Performance:** Parquet + Web Worker = excellent client-side performance
3. **Interview Focus:** Tips and context add significant educational value
4. **Testing Challenges:** Script to validate all challenges (`scripts/test-challenges.js`)

---

## Migration to Sprint System

Starting Sprint 7, we adopted a structured sprint documentation system:
- Individual `docs/sprints/sprint-N/` folders
- `STATUS.md` at project root for quick context
- This archive file for historical reference

See `docs/sprints/README.md` for conventions.
