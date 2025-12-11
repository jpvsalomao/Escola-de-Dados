# Project Status

**Last Updated:** 2025-12-10
**Current Sprint:** Sprint 16 - Interview Challenge Fixes & Editor Stability
**Sprint Status:** Complete

## Quick Context
Recent sprints improved the SQL interview practice experience:
- **Sprint 15**: Unified ChallengeTabs colors following Design System v2.0
- **Sprint 16**: Fixed challenge tests, date formatting, and editor cursor jumping

## Key Files Modified (Sprint 16)
- `public/packs/pack_meta_interview/pack.json` - Test assertion fixes for date_trunc solutions
- `app/components/ResultGrid.tsx` - UTC date formatting
- `app/components/Editor.tsx` - React.memo() wrapper
- `app/challenges/[packId]/[challengeId]/page.tsx` - Ref-based callback stabilization

## Recent Completions
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
- [ ] Sprint 17: TBD (based on user needs)

## Sprint System
- **Sprints folder:** `docs/sprints/`
- **Individual plans:** `docs/sprints/sprint-N/plan.md`
- **Archive:** `docs/sprints/archive/`

## How to Continue
1. Read this file for current state
2. Check `docs/sprints/sprint-16/plan.md` for detailed tasks
3. Run `npm run dev` to start development
4. Follow `docs/PLAYBOOKS/iteration-playbook.md` for workflow
