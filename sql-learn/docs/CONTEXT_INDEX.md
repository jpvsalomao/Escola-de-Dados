# Context Index

**Last Updated:** 2025-12-05
**Version:** 2.1.0

## Active Sprint

| Sprint | Title | Status | Plan |
|--------|-------|--------|------|
| 9 | Challenge Validation & Ordering | Complete | [docs/sprints/sprint-9/plan.md](sprints/sprint-9/plan.md) |

**Quick Context:** See `STATUS.md` at project root for current state.

## Purpose

This document serves as the central index for understanding the SQL Learn platform's codebase. It describes modules, their responsibilities, and recent changes.

## Module Overview

### `/app/lib/`

Core business logic and utilities.

#### `types.ts`
- **Purpose:** TypeScript type definitions for the entire application
- **Key Types:** PackSchema, Challenge, Test, GradeResult, Progress, AppConfig
- **Last Changed:** 2025-11-05 - Initial implementation

#### `config.ts`
- **Purpose:** Application configuration loader
- **Reads From:** `/app/config.json`
- **Last Changed:** 2025-11-05 - Initial implementation

#### `duck.ts`
- **Purpose:** DuckDB-WASM integration layer
- **Key Functions:**
  - `initDuckDB()` - Initialize DuckDB instance
  - `executeQuery()` - Run SQL queries
  - `executeQueryWithTimeout()` - Run queries with timeout enforcement
  - `loadParquet()` - Load Parquet files into tables
  - `getTableSchema()` - Retrieve table schema information
- **Last Changed:** 2025-11-05 - Initial implementation

#### `grader.ts`
- **Purpose:** Challenge grading engine
- **Key Functions:**
  - `gradeQuery()` - Grade user SQL against test suite
  - Supports assert types: ROWCOUNT, SQL, SCHEMA_EQ, SET_EQ, NEAR
- **Dependencies:** duck.ts, types.ts, config.ts
- **Last Changed:** 2025-11-05 - Initial implementation

#### `pack.ts`
- **Purpose:** Pack loading and validation
- **Key Functions:**
  - `loadPack()` - Load pack.json from path
  - `loadPackDatasets()` - Load all Parquet datasets into DuckDB
  - `validatePackIntegrity()` - Verify dataset SHA-256 hashes
  - `getChallengeById()` - Retrieve specific challenge
- **Last Changed:** 2025-11-05 - Initial implementation

#### `progress.ts`
- **Purpose:** User progress tracking via localStorage
- **Key Functions:**
  - `getAllProgress()` - Get all progress records
  - `getProgress()` - Get progress for specific challenge
  - `saveProgress()` - Save progress record
  - `markCompleted()` - Mark challenge as completed
  - `recordAttempt()` - Record failed attempt
  - `exportProgress()` / `importProgress()` - Data portability
- **Last Changed:** 2025-11-05 - Initial implementation

#### `telemetry.ts`
- **Purpose:** Event logging (currently console-only)
- **Key Functions:**
  - `logEvent()` - Generic event logger
  - `logChallengeAttempt()` - Log challenge attempts
  - `logPackLoad()` - Log pack loads
  - `logError()` - Log errors
- **Note:** Respects `config.flags.enableTelemetry`
- **Last Changed:** 2025-11-05 - Initial implementation

#### `utils.ts`
- **Purpose:** Utility functions
- **Key Functions:**
  - `cn()` - Tailwind class name merger
- **Last Changed:** 2025-11-05 - Initial implementation

### `/app/components/`

React UI components.

#### `Editor.tsx`
- **Purpose:** SQL code editor using Monaco
- **Props:** value, onChange, className, readOnly
- **Last Changed:** 2025-11-05 - Initial implementation

#### `ResultGrid.tsx`
- **Purpose:** Display query results in a table
- **Props:** data, className
- **Last Changed:** 2025-11-05 - Initial implementation

#### `ChallengeCard.tsx`
- **Purpose:** Challenge preview card with metadata
- **Props:** challenge, packId, completed, className
- **Last Changed:** 2025-11-05 - Initial implementation

#### `ProgressBadge.tsx`
- **Purpose:** Visual progress indicator
- **Props:** percentage, className
- **Last Changed:** 2025-11-05 - Initial implementation

### `/app/`

Pages and application entry points.

#### `layout.tsx`
- **Purpose:** Root layout for Next.js App Router
- **Last Changed:** 2025-11-05 - Initial implementation

#### `page.tsx`
- **Purpose:** Home page - pack browser
- **Features:** Lists all challenges, shows completion progress
- **Last Changed:** 2025-11-05 - Initial implementation

#### `challenges/[packId]/[challengeId]/page.tsx`
- **Purpose:** Challenge detail page
- **Features:**
  - SQL editor
  - Run query / Submit for grading
  - Show/hide hints and solutions
  - Display results and grading feedback
- **Last Changed:** 2025-11-05 - Initial implementation

### `/app/packs/`

Challenge packs with datasets.

#### `pack_basics/`
- **Files:** pack.json, customers.parquet, orders.parquet
- **Challenges:** 5 easy-to-medium SQL challenges
- **Last Changed:** 2025-11-05 - Initial implementation

### `/tests/`

Test suites.

#### `unit/grader.test.ts`
- **Purpose:** Unit tests for grading logic
- **Framework:** Vitest
- **Last Changed:** 2025-11-05 - Basic placeholder

#### `e2e/basic.spec.ts`
- **Purpose:** End-to-end tests for critical user flows
- **Framework:** Playwright
- **Scenarios:** Home page load, challenge navigation
- **Last Changed:** 2025-11-05 - Initial implementation

### `/scripts/`

Build and utility scripts.

#### `generate-sample-data.py`
- **Purpose:** Generate Parquet sample datasets
- **Last Changed:** 2025-11-05 - Initial implementation

#### `check-docs.js`
- **Purpose:** CI check to enforce docs updates when code changes
- **Last Changed:** 2025-11-05 - Initial implementation

## Design Decisions

See `/docs/ADR/` for detailed Architecture Decision Records.

- **ADR-0001:** Tech stack choices (Next.js, DuckDB-WASM, Monaco)
- **ADR-0002:** Pack schema design v1.1

## Design System

See `/docs/DESIGN_SYSTEM.md` for comprehensive visual design guidelines.

**Version 2.0 (November 2025):**
- **Distinctive Color Palette:** Teal/coral signature theme (moved from generic blue)
- **Typography Enhancements:** Gradient text for heroes and headings
- **Component Updates:** Gradient borders, status strips, enhanced animations
- **Accessibility:** WCAG AA compliance with improved contrast ratios
- **Educational Focus:** Colors and patterns inspired by database/data themes

## Key Patterns

1. **Client-Side Only:** All SQL execution happens in the browser via DuckDB-WASM
2. **Pack-Based Content:** Challenges organized into packs with versioned schemas
3. **localStorage Persistence:** Progress stored locally, exportable as JSON
4. **Grader Flexibility:** Multiple assert types for diverse validation needs
5. **Accessibility First:** ARIA labels, keyboard navigation, semantic HTML

## Future Work

See `/docs/ROADMAP.md` for detailed plans.
