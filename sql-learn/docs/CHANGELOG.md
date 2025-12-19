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

### Meta Interview Pack - Test Quality Sprint (December 2025)

#### Problem Addressed
Tests were passing by accident due to weak assertions. A query with incorrect SQL logic (missing WHERE, wrong aggregate) could return the right row count by chance.

#### Added
- **`scripts/generate-meta-interview-data-v3.py`**: Comprehensive data generator (~900 lines) with edge cases for all 20 challenges
- **`docs/DATA_DESIGN.md`**: Complete documentation of edge cases and test rationale

#### Changed
- **Test assertions expanded**: ~60 → 125+ total assertions across 20 challenges
- **pack_meta_interview/pack.json**: All challenges updated with SQL-based value validation tests
- **All 18 parquet files regenerated** with v3 data including:
  - Decoy data (records that should be excluded by correct queries)
  - Boundary values (e.g., exactly 28 days for churn)
  - Edge cases (zero values, ties, empty sets)

#### Key Test Improvements by Challenge
| Challenge | Key Improvements |
|-----------|-----------------|
| Q1 | 2023/2025 posts as decoys, single-post user exclusion |
| Q2 | June-only and July-only users to test retention logic |
| Q3 | App with 0 CTR, app with no impressions (division by zero) |
| Q5 | Expanded from 3 to 17 recommendation pairs |
| Q9 | All 5 histogram buckets validated with boundary values |
| Q12 | All 8 advertiser state transitions mapped and tested |
| Q14 | DENSE_RANK tie handling (Tech category has tied 2nd place) |

#### Verification
```bash
python3 scripts/test-solutions-duckdb.py
# Result: ✓ Passed: 20, ✗ Failed: 0
```

---

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
