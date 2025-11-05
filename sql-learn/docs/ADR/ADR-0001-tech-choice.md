# ADR-0001: Technology Stack Selection

**Status:** Accepted
**Date:** 2025-11-05
**Deciders:** Escola de Dados Team
**Context:** Selecting the core technologies for SQL Learn v1.0

## Context and Problem Statement

We need to build an interactive SQL learning platform that allows users to write and execute SQL queries directly in the browser, with immediate feedback. The platform must be accessible, performant, and easy to maintain.

### Key Requirements
1. Execute SQL queries client-side (no backend initially)
2. Support real datasets (not just mock data)
3. Syntax-highlighted code editor with IntelliSense
4. Fast, responsive UI
5. Easy to extend with new challenges and datasets
6. Modern developer experience (TypeScript, tooling)

## Decision Drivers

- **User Experience:** Fast feedback, no setup required
- **Cost:** Minimize infrastructure costs (v1 is static-only)
- **Developer Productivity:** Modern tools, good documentation
- **Scalability:** Should be possible to add backend later (v2+)
- **Accessibility:** Must support keyboard navigation and screen readers
- **Performance:** Sub-second query execution for typical challenges

## Considered Options

### Frontend Framework

**Option A: React (Next.js)**
- ✅ Large ecosystem, great documentation
- ✅ Next.js provides excellent DX and SSG/SSR flexibility
- ✅ App Router for clean routing
- ✅ Strong TypeScript support
- ✅ Easy to add backend API later
- ❌ Larger bundle size than alternatives

**Option B: Svelte/SvelteKit**
- ✅ Smaller bundle size
- ✅ Simpler syntax
- ❌ Smaller ecosystem
- ❌ Team less familiar

**Option C: Vue/Nuxt**
- ✅ Good balance of features and simplicity
- ❌ Team less familiar
- ❌ Smaller ecosystem than React

**Decision:** **Next.js + React**
- Team expertise
- Ecosystem maturity
- Future backend integration path

---

### SQL Engine

**Option A: DuckDB-WASM**
- ✅ Full-featured SQL engine in browser
- ✅ Native Parquet support
- ✅ Fast analytical queries
- ✅ Active development
- ✅ Standard SQL syntax
- ❌ ~2-3 MB WASM binary
- ❌ Requires SharedArrayBuffer (COOP/COEP headers)

**Option B: sql.js (SQLite WASM)**
- ✅ Smaller bundle (~800 KB)
- ✅ Mature, stable
- ❌ No native Parquet support
- ❌ Limited analytical SQL features
- ❌ Slower for complex queries

**Option C: alasql (Pure JS)**
- ✅ Lightweight
- ✅ No WASM required
- ❌ Incomplete SQL support
- ❌ Poor performance on large datasets
- ❌ Inconsistent syntax

**Decision:** **DuckDB-WASM**
- Best SQL feature set for learning platform
- Native Parquet support = efficient data loading
- Trade-off: larger initial load is acceptable for richer functionality

---

### Code Editor

**Option A: Monaco Editor (@monaco-editor/react)**
- ✅ Powers VS Code
- ✅ Excellent IntelliSense
- ✅ SQL syntax support
- ✅ Accessible keyboard navigation
- ❌ Larger bundle (~1 MB)

**Option B: CodeMirror 6**
- ✅ Lightweight (~200 KB)
- ✅ Modular architecture
- ❌ Requires custom SQL mode setup
- ❌ Less polished IntelliSense

**Option C: Ace Editor**
- ✅ Lightweight
- ❌ Less active maintenance
- ❌ Weaker TypeScript support

**Decision:** **Monaco Editor**
- Best-in-class editing experience
- Users expect VS Code-like experience
- Bundle size acceptable given lazy loading

---

### Styling

**Option A: Tailwind CSS**
- ✅ Utility-first, fast prototyping
- ✅ Excellent with Next.js
- ✅ Tree-shaking = small production bundle
- ✅ Accessible design patterns
- ❌ Verbose HTML

**Option B: CSS Modules**
- ✅ Scoped styles
- ✅ Simple
- ❌ More boilerplate

**Option C: Styled Components / Emotion**
- ✅ CSS-in-JS, dynamic styles
- ❌ Runtime overhead
- ❌ Larger bundle

**Decision:** **Tailwind CSS**
- Speed of development
- Excellent documentation
- Minimal runtime overhead

---

### Dataset Format

**Option A: Parquet**
- ✅ Columnar, compressed
- ✅ Native DuckDB support
- ✅ Industry standard for analytics
- ❌ Requires tooling to generate

**Option B: CSV**
- ✅ Human-readable
- ✅ Easy to create
- ❌ Larger file size
- ❌ Slower to parse
- ❌ Type ambiguity

**Option C: JSON**
- ✅ Easy to generate
- ❌ Inefficient for tabular data
- ❌ Large file size

**Decision:** **Parquet**
- Best fit for DuckDB
- Performance and file size benefits
- Tooling (Python script) is simple

---

### State Management

**Option A: React useState/useEffect (no library)**
- ✅ Simple, no dependencies
- ✅ Sufficient for v1 scope
- ❌ May need refactor for v2

**Option B: Zustand**
- ✅ Simple API
- ✅ Small bundle
- ❌ Overkill for v1

**Option C: Redux Toolkit**
- ✅ Mature, well-documented
- ❌ Boilerplate
- ❌ Overkill for v1

**Decision:** **useState/useEffect (v1), revisit for v2**
- YAGNI principle
- Can migrate later if needed

---

### Testing

**Option A: Vitest + Playwright**
- ✅ Fast, modern
- ✅ Vitest: drop-in for Jest, faster
- ✅ Playwright: reliable e2e testing
- ✅ Great TypeScript support

**Option B: Jest + Cypress**
- ✅ Mature, widely used
- ❌ Slower than Vitest
- ❌ Cypress startup time

**Decision:** **Vitest + Playwright**
- Modern, fast tooling
- Better DX

---

## Consequences

### Positive

- Modern, productive development experience
- Client-side execution = zero infrastructure cost
- Scalable architecture for future backend integration
- Rich SQL feature set for learners
- Professional code editor experience

### Negative

- Larger initial bundle size (~4-5 MB total)
- Requires COOP/COEP headers for SharedArrayBuffer (DuckDB)
- DuckDB-WASM is less mature than alternatives (accept some bugs)

### Neutral

- Next.js App Router is newer (less Stack Overflow answers)
- Parquet generation requires Python tooling

## Follow-up Actions

- [ ] Optimize bundle size with code splitting (lazy load Monaco)
- [ ] Set up CDN for Parquet files if needed
- [ ] Monitor DuckDB-WASM releases for performance improvements

## References

- [DuckDB-WASM Docs](https://duckdb.org/docs/api/wasm)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Monaco Editor for React](https://github.com/suren-atoyan/monaco-react)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
