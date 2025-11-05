# Changelog

All notable changes to the SQL Learn platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### Added

#### Core Features
- **DuckDB-WASM Integration:** Client-side SQL execution with full DuckDB SQL support
- **Pack System:** Versioned challenge packs with datasets and metadata
- **Challenge Grading:** Comprehensive test framework with 5 assert types (ROWCOUNT, SQL, SCHEMA_EQ, SET_EQ, NEAR)
- **Progress Tracking:** Local storage-based progress with import/export functionality
- **Monaco Editor:** Syntax-highlighted SQL editor with IntelliSense

#### UI Components
- **Home Page:** Pack browser with completion progress visualization
- **Challenge Page:** Interactive challenge interface with editor, results, hints, and solutions
- **Result Grid:** Responsive table for query results
- **Challenge Cards:** Visual challenge previews with difficulty and tags
- **Progress Badge:** Animated progress indicator

#### Content
- **pack_basics:** 5 introductory SQL challenges covering SELECT, COUNT, WHERE, ORDER BY, and GROUP BY
- **Sample Data:** customers and orders tables (Parquet format)

#### Developer Experience
- **TypeScript:** Full type safety across the codebase
- **Vitest:** Unit testing framework configured
- **Playwright:** End-to-end testing setup
- **ESLint + Prettier:** Code quality and formatting tools
- **Documentation:** Context index, changelog, architecture docs, and ADRs
- **CI Workflow:** GitHub Actions with docs-touch enforcement

#### Configuration & Limits
- Query timeout: 1500ms
- Max rows per query: 200,000
- Max dataset size: 5MB
- Security: CSV sanitization, no remote URLs

### Technical Details

#### File Structure
```
/sql-learn/
  /app/
    /lib/ - Core business logic
    /components/ - React UI components
    /challenges/[packId]/[challengeId]/ - Dynamic routes
    /packs/pack_basics/ - Challenge content
  /tests/ - Unit and e2e tests
  /docs/ - Documentation
  /scripts/ - Build utilities
```

#### Pack Schema Version
- v1.1 with integrity checking and schema validation

#### Browser Requirements
- Modern browser with WebAssembly support
- SharedArrayBuffer support (requires COOP/COEP headers)

### Configuration

Default configuration in `/app/config.json`:
- Pack upload: enabled
- SET_EQ assert: enabled
- Telemetry: disabled
- Timeout: 1500ms
- Row limit: 200,000
- Dataset size limit: 5MB

### Dependencies

**Runtime:**
- Next.js 15.0.0
- React 18.3.1
- @duckdb/duckdb-wasm 1.28.0
- @monaco-editor/react 4.6.0
- Tailwind CSS 3.4.1

**Dev:**
- TypeScript 5.6.0
- Vitest 2.1.0
- Playwright 1.48.0
- ESLint 8.57.0
- Prettier 3.3.0

### Documentation

- **CONTEXT_INDEX.md:** Module reference and recent changes
- **ARCHITECTURE.md:** System design and component interactions
- **CHANGELOG.md:** Version history
- **ROADMAP.md:** Future plans
- **ADR-0001:** Technology choice rationale
- **ADR-0002:** Pack schema design

### Security

- Input sanitization for CSV imports
- No external dataset URLs allowed
- Size limits enforced
- Timeout protection against runaway queries

### Accessibility

- ARIA labels and landmarks
- Keyboard navigation support
- Semantic HTML
- Color contrast compliance

## [Unreleased]

### Planned for v1.1
- Additional packs for intermediate SQL
- Pack difficulty ratings
- Challenge search and filtering
- Dark mode theme

### Planned for v2.0
- Authentication and user accounts
- Server-side progress sync
- Leaderboards and social features
- Custom pack uploads
- Advanced analytics
