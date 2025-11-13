# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SQL Learn is an interactive SQL learning platform that runs entirely in the browser using DuckDB-WASM. Users solve SQL challenges with immediate feedback through a comprehensive grading system.

**Key Characteristics:**
- Client-side SQL execution (no backend required in v1)
- Pack-based challenge organization with real datasets
- Next.js 15 App Router with TypeScript
- DuckDB-WASM for SQL execution
- Monaco Editor for SQL editing

## Development Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server

# Code Quality
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Testing
npm test             # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:e2e -- --headed  # Run E2E tests with browser UI
npm run test:e2e -- --debug   # Run E2E tests in debug mode
```

**Note:** This project uses npm as the package manager.

## Architecture

### Three-Layer Architecture

1. **Presentation Layer** (`/app`, `/app/components`)
   - Next.js pages and React components
   - User interactions and routing

2. **Business Logic Layer** (`/app/lib`)
   - `pack.ts` - Pack loading and validation
   - `grader.ts` - Challenge grading with multiple assertion types
   - `progress.ts` - localStorage-based progress tracking
   - `duck.ts` - DuckDB wrapper (data access layer)

3. **Data Layer**
   - DuckDB-WASM running in Web Worker
   - localStorage for progress persistence
   - Static files (Parquet datasets, pack.json)

### Key Data Flow

**Challenge Loading:**
```
Page load → loadPack() → Fetch pack.json → loadPackDatasets() → Load .parquet files into DuckDB
```

**Query Grading:**
```
User SQL → gradeQuery() → Execute query → Run test assertions → Compare results → Display GradeResult
```

## Pack System

Packs are self-contained challenge collections with datasets.

**Location:** `/public/packs/<pack_id>/`

**Structure:**
```
public/packs/pack_basics/
├── pack.json           # Pack metadata and challenges
├── customers.parquet   # Dataset files
└── orders.parquet
```

### Pack Schema (v1.1)

See `app/lib/types.ts` for TypeScript interfaces and `docs/ADR/ADR-0002-pack-schema.md` for detailed specification.

**Key Pack Configuration:**
- `schema_version`: "1.1" or "1.2"
- `challenges[]`: Array of challenge definitions
- `datasets[]`: Dataset file references
- `metadata`: Author info, difficulty, learning objectives

### Challenge Test Assertions

The grading system supports multiple assertion types (see `app/lib/grader.ts`):

1. **ROWCOUNT** - Check number of rows returned
2. **SQL** - Run SQL assertion using `{{USER_SQL}}` placeholder
3. **SCHEMA_EQ** - Validate output schema (column names and types)
4. **SET_EQ** - Compare result sets (order-insensitive)
5. **NEAR** - Compare numeric values with tolerance

### Category System

Challenges are automatically grouped by tags in the pack page (`app/packs/[packId]/page.tsx`):

- **Basic Queries** - tags: select, basics, where, filter
- **JOINs** - tags: join, inner join, left join, right join, outer join
- **Advanced Queries** - tags: subquery, case, conditional
- **Aggregations** - tags: aggregate, count, group by, sum, avg, having
- **Sorting** - tags: order by, sorting
- **Other** - Fallback for uncategorized challenges

**Important:** Always add appropriate tags to challenges to ensure they appear in the correct category. The categorization logic is in the pack page component, not in the pack schema itself.

## Adding New Packs

1. Create directory: `public/packs/<pack_id>/`
2. Add `pack.json` with schema v1.1 or v1.2 structure
3. Add `.parquet` dataset files
4. Register pack in `app/lib/pack.ts`:
   ```typescript
   export async function getAvailablePacks() {
     return [
       { id: "pack_basics", path: "/packs/pack_basics" },
       { id: "your_pack", path: "/packs/your_pack" },  // Add here
     ];
   }
   ```

### Creating Parquet Files

Use Python with pandas:
```python
import pandas as pd

df = pd.DataFrame({
    "id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"]
})

df.to_parquet("output.parquet", index=False)
```

**Dataset Script:**
The project includes `scripts/generate-sample-data.py` for generating sample datasets.

## DuckDB Integration

**Key Module:** `app/lib/duck.ts`

The DuckDB wrapper handles:
- WASM initialization in Web Worker
- Query execution with timeout protection
- Parquet file loading
- Schema introspection

**Important Functions:**
- `initDuckDB()` - Initialize WASM instance (called once)
- `executeQuery(sql)` - Execute SQL, returns array of objects
- `executeQueryWithTimeout(sql, timeout)` - Execute with timeout
- `loadParquet(tableName, url)` - Load Parquet into table
- `getTableSchema(tableName)` - Get column names and types

**Critical:** DuckDB runs in a Web Worker and requires these headers (configured in `next.config.js`):
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Content-Security-Policy: script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; worker-src 'self' blob:;
```

These headers are ESSENTIAL for DuckDB-WASM to function. Do not remove them.

## Component Organization

### Reusable Components (`app/components/`)

- `Editor.tsx` - Monaco-based SQL editor (lazy loaded)
- `ResultGrid.tsx` - Displays query results in table format
- `ChallengeCard.tsx` - Challenge preview card
- `PackCard.tsx` - Pack preview card with progress
- `ProgressBadge.tsx` - Circular progress indicator
- `Breadcrumb.tsx` - Navigation breadcrumbs
- `KeyboardShortcuts.tsx` - Collapsible keyboard shortcuts panel
- `PackCardSkeleton.tsx` - Loading skeleton for pack cards
- `ChallengeCardSkeleton.tsx` - Loading skeleton for challenge cards
- `AnimatedNumber.tsx` - Animated number transitions
- `Confetti.tsx` - Celebration animation
- `Icon.tsx` - Icon component wrapper

### Page Structure

- `app/page.tsx` - Homepage with pack browser
- `app/packs/[packId]/page.tsx` - Pack detail with challenge list
- `app/challenges/[packId]/[challengeId]/page.tsx` - Challenge workspace

## Important Patterns

### Monaco Editor Lazy Loading

The Monaco Editor is dynamically imported to reduce initial bundle size. It's loaded when the challenge page is opened.

### Loading States

Use skeleton screens instead of spinners for better UX. Import and use the skeleton components during loading states.

### Keyboard Shortcuts

Implemented in challenge page:
- **Ctrl + Enter** - Run SQL query (works on all platforms)
- **Esc** - Clear results and errors

### Progress Tracking

Progress is stored in localStorage using `app/lib/progress.ts`:
- `markCompleted(packId, challengeId)` - Mark challenge as complete
- `recordAttempt(packId, challengeId, elapsedMs)` - Record attempt with time
- `getProgress(packId, challengeId)` - Get challenge progress
- `getAllProgress()` - Get all progress
- `getPackCompletionPercentage(packId)` - Get pack completion percentage

### Collapsible Sections

Pack pages support collapsible sections. The collapsed state is persisted in localStorage per pack using the key `collapsedSections_${packId}`.

## Testing Strategy

### Unit Tests (Vitest)

Located in `tests/unit/`, cover core library functions:
- Grader logic and assertions
- Pack utilities
- Utility functions

### E2E Tests (Playwright)

Located in `tests/e2e/`, test critical flows:
- Challenge loading
- Query execution
- Grading workflows
- Accessibility checks

## Configuration

**Runtime config:** `app/config.json`

Key settings:
- `limits.timeoutMs` - Query timeout (default: 1500ms)
- `limits.maxRowsLoadedPerPack` - Max rows per query (default: 200,000)
- `limits.maxBytesPerDataset` - Max dataset file size (default: 5MB)
- `flags.enableTelemetry` - Enable event logging
- `flags.allowPackUpload` - Enable user pack uploads (future)
- `flags.enableSetEqAssert` - Enable SET_EQ assert type

## Common Pitfalls

1. **Parquet Files Location:** Datasets must be in `public/packs/<pack_id>/`, not `app/packs/`
2. **Pack Registration:** New packs must be registered in `getAvailablePacks()` in `app/lib/pack.ts`
3. **Category Tags:** Challenges without matching category tags will appear in "Other" section
4. **DuckDB Initialization:** Always check if DuckDB is ready before executing queries
5. **Solution SQL:** Must be valid and return expected results for all tests to pass
6. **Headers Configuration:** The CORS and CSP headers in `next.config.js` are critical for DuckDB-WASM
7. **SQL Normalization:** The grader automatically removes trailing semicolons from queries

## Debugging Tips

1. **DuckDB Errors:** Check browser console for detailed WASM errors
2. **Pack Loading Issues:** Verify pack.json schema version and structure
3. **Test Failures:** Run solution_sql manually to verify expected results
4. **Progress Not Saving:** Check localStorage in browser DevTools
5. **DuckDB Not Loading:** Check that headers are correctly configured in browser Network tab
6. **Category Issues:** Verify challenge tags match the category definitions in the pack page component

## Documentation

Key docs to reference:
- `docs/ARCHITECTURE.md` - Detailed system architecture
- `docs/ADR/ADR-0002-pack-schema.md` - Pack schema specification
- `docs/PLAYBOOKS/iteration-playbook.md` - Development workflow
- `docs/CONTEXT_INDEX.md` - Module overview and recent changes
- `docs/CHANGELOG.md` - Version history
- `README.md` - Setup and quick start

## TypeScript Types

Core types in `app/lib/types.ts`:
- `PackSchema` - Pack configuration structure (supports v1.1 and v1.2)
- `Challenge` - Challenge definition
- `Test` - Test assertion configuration
- `AssertType` - Union type of assertion types
- `GradeResult` - Grading output
- `GradeOptions` - Grading configuration options
- `Progress` - Progress tracking data
- `AppConfig` - Application configuration

## Security Considerations

- All SQL execution is client-side (no server injection risks in v1)
- DuckDB runs in sandboxed Web Worker
- Query timeouts prevent runaway queries
- File size limits enforced for datasets
- No remote data loading (same-origin only)
- Pack integrity checking via SHA-256 hashes (optional)

## Performance

### Optimizations
- Parquet format for efficient data loading
- Monaco Editor lazy loaded
- Code splitting with Next.js
- Pack metadata caching (5 minute TTL)
- DuckDB runs in Web Worker (off main thread)

### Bundle Size
- Total: ~4-5 MB (including DuckDB-WASM)
- DuckDB-WASM: ~2-3 MB
- Monaco Editor: ~1 MB (lazy loaded)
- App Code: ~500 KB

## Styling

The project uses Tailwind CSS with custom utility functions:
- `getSectionColorClasses(section)` - Returns color classes for sections
- `getDifficultyColorClasses(difficulty)` - Returns color classes for difficulty levels

These are defined in `app/lib/ui-constants.tsx`.
