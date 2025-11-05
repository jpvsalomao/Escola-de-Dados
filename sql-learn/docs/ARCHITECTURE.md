# Architecture

## Overview

SQL Learn is a **client-side-first**, **pack-based** SQL learning platform built with Next.js and DuckDB-WASM.

### Design Principles

1. **No Server Required (v1):** All SQL execution and data processing happens in the browser
2. **Progressive Enhancement:** Works offline after initial load
3. **Modular Content:** Packs are self-contained with datasets and challenges
4. **Type Safety:** Full TypeScript coverage
5. **Accessibility First:** WCAG AA compliance target

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js App (React)                      │  │
│  │                                                        │  │
│  │  ┌──────────────┐       ┌────────────────────┐      │  │
│  │  │   Home Page  │       │   Challenge Page   │      │  │
│  │  │  (page.tsx)  │       │ ([challengeId]/)   │      │  │
│  │  └──────┬───────┘       └─────────┬──────────┘      │  │
│  │         │                          │                  │  │
│  │         ├──────────────────────────┤                  │  │
│  │         │                          │                  │  │
│  │  ┌──────▼──────────────────────────▼──────────────┐  │  │
│  │  │           React Components                      │  │  │
│  │  │  • Editor (Monaco)                              │  │  │
│  │  │  • ResultGrid                                   │  │  │
│  │  │  • ChallengeCard                                │  │  │
│  │  │  • ProgressBadge                                │  │  │
│  │  └──────────────────┬──────────────────────────────┘  │  │
│  │                     │                                  │  │
│  │  ┌──────────────────▼──────────────────────────────┐  │  │
│  │  │              Core Libraries                      │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │  │  │
│  │  │  │  pack   │  │ grader  │  │   progress   │   │  │  │
│  │  │  │  .ts    │  │  .ts    │  │    .ts       │   │  │  │
│  │  │  └────┬────┘  └────┬────┘  └──────┬───────┘   │  │  │
│  │  │       │            │               │            │  │  │
│  │  │       └────────────┴───────────────┘            │  │  │
│  │  │                    │                            │  │  │
│  │  │         ┌──────────▼──────────┐                │  │  │
│  │  │         │      duck.ts        │                │  │  │
│  │  │         │  (DuckDB Wrapper)   │                │  │  │
│  │  │         └──────────┬──────────┘                │  │  │
│  │  └────────────────────┼────────────────────────────┘  │  │
│  └───────────────────────┼────────────────────────────────┘  │
│                          │                                    │
│  ┌───────────────────────▼────────────────────────────────┐  │
│  │             DuckDB-WASM (Web Worker)                   │  │
│  │  • SQL Engine                                          │  │
│  │  • Parquet Reader                                      │  │
│  │  • In-Memory Tables                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              localStorage                              │  │
│  │  • Progress data                                       │  │
│  │  • User preferences                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                          │
                          ▼
                  ┌───────────────┐
                  │  Static Files │
                  │  (Public CDN) │
                  │               │
                  │  • pack.json  │
                  │  • *.parquet  │
                  └───────────────┘
```

## Component Layers

### 1. Presentation Layer

**Location:** `/app/`, `/app/components/`

**Responsibilities:**
- Render UI
- Handle user interactions
- Route between pages
- Display feedback (errors, success, loading states)

**Key Files:**
- `page.tsx` - Home page with pack browser
- `challenges/[packId]/[challengeId]/page.tsx` - Challenge detail view
- `components/Editor.tsx` - SQL editor
- `components/ResultGrid.tsx` - Query results display
- `components/ChallengeCard.tsx` - Challenge preview
- `components/ProgressBadge.tsx` - Progress visualization

### 2. Business Logic Layer

**Location:** `/app/lib/`

**Responsibilities:**
- Pack loading and validation
- Query execution orchestration
- Challenge grading
- Progress management
- Configuration management

**Key Files:**
- `pack.ts` - Pack loading, validation, integrity checks
- `grader.ts` - Test execution and assertion logic
- `progress.ts` - localStorage-based progress tracking
- `telemetry.ts` - Event logging
- `config.ts` - Configuration loading

### 3. Data Access Layer

**Location:** `/app/lib/duck.ts`

**Responsibilities:**
- DuckDB-WASM initialization
- Query execution with timeout
- Parquet file loading
- Schema introspection
- Connection management

**Abstractions:**
- `initDuckDB()` - Initialize WASM instance
- `getConnection()` - Get/create connection
- `executeQuery()` - Execute SQL
- `executeQueryWithTimeout()` - Execute with timeout enforcement
- `loadParquet()` - Load Parquet into table
- `getTableSchema()` - Retrieve schema

### 4. Storage Layer

**Technologies:**
- **localStorage:** User progress, preferences
- **DuckDB in-memory:** Loaded datasets during session
- **Static files:** Parquet datasets, pack metadata

## Data Flow

### Challenge Load Flow

```
User navigates to challenge
         │
         ▼
Page loads → loadPack(packId)
         │       │
         │       ▼
         │   Fetch pack.json
         │       │
         │       ▼
         │   Validate schema version
         │       │
         │       ▼
         │   loadPackDatasets()
         │       │
         │       ▼
         │   For each dataset:
         │     - Fetch .parquet
         │     - Load into DuckDB
         │       │
         │       ▼
         └──> Render challenge UI
```

### Query Execution Flow

```
User writes SQL → Click "Run"
                      │
                      ▼
              executeQuery(sql)
                      │
                      ▼
            DuckDB-WASM executes
                      │
                      ▼
              Return results
                      │
                      ▼
             Display in ResultGrid
```

### Grading Flow

```
User writes SQL → Click "Submit"
                      │
                      ▼
              gradeQuery(sql, tests)
                      │
                      ▼
       ┌──────────────┴──────────────┐
       │                             │
       ▼                             ▼
Execute user query          For each test:
       │                      - Run assertion
       │                      - Compare expected vs actual
       │                             │
       └──────────────┬──────────────┘
                      │
                      ▼
              Aggregate results
                      │
                      ▼
         ┌────────────┴───────────┐
         │                        │
         ▼                        ▼
      Pass?                    Fail?
    Mark completed         Record attempt
         │                        │
         └────────────┬───────────┘
                      │
                      ▼
            Display GradeResult
```

## Module Dependencies

```
page.tsx
  └─> pack.ts
  └─> progress.ts
  └─> ChallengeCard

challenges/[id]/page.tsx
  └─> pack.ts
  |     └─> duck.ts
  |           └─> @duckdb/duckdb-wasm
  └─> grader.ts
  |     └─> duck.ts
  └─> progress.ts
  └─> Editor (Monaco)
  └─> ResultGrid

grader.ts
  └─> duck.ts
  └─> types.ts
  └─> config.ts

pack.ts
  └─> duck.ts
  └─> types.ts
  └─> config.ts
```

## State Management

**v1 Approach:** React useState/useEffect

- **Local component state:** SQL input, results, errors, loading flags
- **localStorage:** Progress data (persisted across sessions)
- **DuckDB session state:** Loaded tables (ephemeral, per browser session)

**Future (v2+):** Consider Zustand or Redux for global state if adding auth/sync features.

## Security Model

### v1 Security Boundaries

1. **Client-Side Only:** No server = no server-side attacks
2. **Sandboxed WASM:** DuckDB runs in Web Worker, isolated from main thread
3. **Input Validation:**
   - Parquet files validated before load
   - CSV imports sanitized (no formula injection)
   - File size limits enforced
4. **No Remote Data:** Pack datasets must be local/same-origin
5. **Timeout Protection:** Runaway queries killed after timeout

### Future Considerations (v2+)

- Content Security Policy (CSP) headers
- User-uploaded packs: virus scanning, content moderation
- Rate limiting on server APIs

## Performance Considerations

### Optimizations

1. **Parquet Format:** Columnar, compressed, fast to load
2. **Web Worker:** DuckDB runs off main thread, UI stays responsive
3. **Lazy Loading:** Datasets loaded only when pack is opened
4. **Static Generation:** Next.js SSG for fast initial load
5. **Code Splitting:** Dynamic imports for Monaco editor

### Bottlenecks

- **Initial DuckDB Load:** ~2-3 MB WASM binary
- **Dataset Size:** Large Parquet files slow to fetch/parse
- **Query Complexity:** Complex joins/aggregations can be slow in WASM

### Mitigation

- Row limits (200k)
- Dataset size limits (5 MB)
- Query timeouts (1500ms)
- CDN for static assets

## Accessibility

- **Semantic HTML:** Proper heading hierarchy, landmarks
- **ARIA:** Labels, live regions for dynamic content
- **Keyboard Navigation:** Tab order, focus management
- **Screen Reader Support:** Descriptive labels, status announcements
- **Color Contrast:** WCAG AA compliant

## Error Handling

### Error Categories

1. **Pack Load Errors:** Missing/invalid pack.json, network failures
2. **Query Errors:** Syntax errors, invalid table references
3. **Grading Errors:** Timeout, assertion failures, unexpected results
4. **System Errors:** DuckDB initialization failures, out of memory

### Error Display

- User-friendly messages in UI
- Technical details in console (dev mode)
- Error boundaries for React component crashes

## Testing Strategy

### Unit Tests (Vitest)

- Core library functions (grader, pack utilities)
- Utility functions
- Component logic (where applicable)

### E2E Tests (Playwright)

- Critical user flows (challenge load, query execution, grading)
- Accessibility checks
- Cross-browser compatibility

### Manual Testing

- Lighthouse audits (performance, accessibility)
- Real-device testing (mobile, tablet)

## Deployment

### v1 Deployment

- **Platform:** Vercel, Netlify, or any static host
- **Build:** `pnpm build` → static Next.js export
- **Assets:** Packs served from `/public/packs/`
- **CDN:** Optional for Parquet files

### Headers Required

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

(For SharedArrayBuffer support in DuckDB-WASM)

## Future Architecture (v2+)

### Planned Additions

- **Backend API:** Node.js/Deno for auth, leaderboards, pack registry
- **Database:** PostgreSQL for user data, progress sync
- **Pack CDN:** S3/R2 for community-uploaded packs
- **Real-time Features:** WebSockets for multiplayer challenges

### Diagram (v2)

```
Browser ←→ Next.js SSR ←→ API (tRPC/GraphQL)
                               │
                               ├─> PostgreSQL (user data)
                               ├─> S3 (pack storage)
                               └─> Redis (sessions, leaderboard cache)
```

## Configuration

See `/app/config.json` for runtime configuration.

Key settings:
- `flags.allowPackUpload` - Enable user pack uploads (future)
- `flags.enableSetEqAssert` - Enable SET_EQ assert type
- `flags.enableTelemetry` - Enable event logging
- `limits.timeoutMs` - Query timeout
- `limits.maxRowsLoadedPerPack` - Max rows per query
- `limits.maxBytesPerDataset` - Max dataset file size

## Observability

### v1

- Client-side telemetry (console logs)
- LocalStorage inspection for progress
- Browser DevTools for debugging

### v2+ (Planned)

- Server-side logging (structured logs)
- Error tracking (Sentry)
- Analytics (Plausible, Fathom)
- Performance monitoring (Web Vitals)
