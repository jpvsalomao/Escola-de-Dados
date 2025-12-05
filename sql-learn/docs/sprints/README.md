# Sprint Documentation

This folder contains sprint planning and documentation for SQL Learn development.

## Conventions

- **Naming:** `sprint-N/` (sequential numbering)
- **Required file:** `plan.md` - Sprint goals, tasks, and progress
- **Optional files:** `notes.md`, `retrospective.md`
- **Archive:** `archive/` - Completed sprint summaries

## Directory Structure

```
docs/sprints/
├── README.md           # This file
├── sprint-7/           # Filter-based skills
│   └── plan.md
├── sprint-8/           # Current sprint
│   └── plan.md
└── archive/            # Historical reference
    └── sprints-1-6-summary.md
```

## Active Sprints

| Sprint | Title | Status |
|--------|-------|--------|
| 8 | Sprint System Setup & UI Polish | Complete |
| 7 | Filter-based Skills Organization | Complete |

## Sprint Workflow

1. **Start:** Create `sprint-N/plan.md` with goals and tasks
2. **Track:** Update task checkboxes as work progresses
3. **Complete:** Mark status as "Complete" when done
4. **Archive:** Move summary to `archive/` if needed

## Quick Start for Claude Code

When resuming work:
1. Check `STATUS.md` at project root
2. Read the active sprint's `plan.md`
3. Update `STATUS.md` timestamp when starting work

## Related Documentation

- [STATUS.md](../../STATUS.md) - Project-level status (read first!)
- [CLAUDE.md](../../CLAUDE.md) - Development guidelines
- [iteration-playbook.md](../PLAYBOOKS/iteration-playbook.md) - Development workflow
- [CONTEXT_INDEX.md](../CONTEXT_INDEX.md) - Module overview
