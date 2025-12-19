# Project Status

**Last Updated:** 2025-12-17
**Current Sprint:** Sprint 17 - Test & Data Quality Improvement
**Sprint Status:** Complete

## Quick Context
Recent sprints improved the SQL interview practice experience:
- **Sprint 16**: Fixed challenge tests, date formatting, and editor cursor jumping
- **Sprint 17**: Comprehensive test strengthening for pack_meta_interview (125+ assertions)

## Key Files Modified (Sprint 17)
- `scripts/generate-meta-interview-data-v3.py` - NEW: Comprehensive data generator (~900 lines)
- `public/packs/pack_meta_interview/pack.json` - All 20 challenges with strengthened tests
- `public/packs/pack_meta_interview/*.parquet` - All 18 parquet files regenerated with edge cases
- `docs/DATA_DESIGN.md` - NEW: Edge case documentation for all challenges

## Recent Completions
- [x] Sprint 17: Test & Data Quality Improvement
  - Created v3 data generator with comprehensive edge cases
  - Expanded tests from ~60 to 125+ assertions
  - Added decoy data, boundary values, edge cases to all parquet files
  - All 8 advertiser state transitions mapped (Q12)
  - DENSE_RANK tie handling for Tech category (Q14)
  - Verification: 20 challenges passed, 0 failed
- [x] Sprint 16: Interview Challenge Fixes & Editor Stability
  - Fixed tests to accept date_trunc() solutions (type-agnostic LIMIT 1)
  - Added UTC date formatting in ResultGrid
  - Fixed Monaco Editor cursor jumping with React.memo and useRef pattern
- [x] Sprint 15: ChallengeTabs UI/UX improvements
  - Removed skill badge from Strategy tab (fixed squeeze issue)
  - Unified all hints to Amber family (Tier 1-3)
  - Changed Notes from Violet to Indigo
  - Fixed Before You Code gradient to single Amber
- [x] Sprint 14: AI Review false positive fix
  - Added SQL NULL handling rules to prompts
  - Added guidance for alternative valid approaches (LEFT JOIN + COUNT vs EXISTS)
- [x] Sprint 13: LLM Answer Review (Claude API integration)
- [x] Sprint 12: Per-challenge Notes feature
- [x] Sprint 11: Editor height + Test assertion improvements
- [x] Sprint 10: Interview Cheatsheet for pack page
- [x] Sprint 9: Challenge validation & difficulty ordering
- [x] Sprint 8: Sprint system setup & documentation restructure
- [x] Sprint 7: Filter-based skills organization
- [x] Sprint 6: 20 Meta SQL interview questions
- [x] Sprint 5: Interview tips and Meta product context
- [x] Sprint 4: Pack schema v1.2 with metadata
- [x] Sprint 3: Category system and tag organization
- [x] Sprint 2: Basic grading system enhancements
- [x] Sprint 1: Initial DuckDB setup and core architecture

## Setup Required
For LLM Answer Review feature:
```bash
# Add to .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

## Next Up
- [ ] Sprint 18: TBD (based on user needs)

## Sprint System
- **Sprints folder:** `docs/sprints/`
- **Individual plans:** `docs/sprints/sprint-N/plan.md`
- **Archive:** `docs/sprints/archive/`

## How to Continue
1. Read this file for current state
2. Check `docs/sprints/sprint-17/plan.md` for detailed tasks
3. Run `npm run dev` to start development
4. Follow `docs/PLAYBOOKS/iteration-playbook.md` for workflow
