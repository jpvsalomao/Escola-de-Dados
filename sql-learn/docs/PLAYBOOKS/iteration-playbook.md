# Iteration Playbook

## Purpose

This playbook ensures **context continuity** across development sessions. Following this process makes it trivial for Claude Code (or any developer) to resume work without losing context.

## Core Principle

**No code change lands without updating context docs.**

This is enforced by CI (`scripts/check-docs.js`).

## Workflow Steps

### 1. Identify Next Increment

**Goal:** Choose the smallest valuable slice of work.

**Questions to ask:**
- What's the smallest feature that provides user value?
- Can this be tested independently?
- Does this unblock other work?

**Output:** Clear 1-2 sentence description of what will be built.

**Example:**
- ✅ "Add CSV import for datasets"
- ✅ "Implement NEAR assert type for float tolerance"
- ❌ "Build entire authentication system" (too big)

---

### 2. Implement Cleanly and Atomically

**Guidelines:**

- **Small commits:** Each commit should represent a complete, working change
- **Type-safe:** Fix TypeScript errors as you go
- **Consistent style:** Follow ESLint/Prettier rules
- **Accessible:** Add ARIA labels, semantic HTML
- **Error handling:** Graceful failures with user-friendly messages

**Checklist:**
- [ ] Code compiles without errors
- [ ] No console warnings
- [ ] Lint passes (`pnpm lint`)
- [ ] Types pass (`pnpm typecheck`)
- [ ] Code is formatted (`pnpm format`)

---

### 3. Run Tests

**Unit Tests:**
```bash
pnpm test
```

**E2E Tests:**
```bash
pnpm test:e2e
```

**Manual Testing:**
- [ ] Test happy path
- [ ] Test error cases
- [ ] Test edge cases (empty data, large data, special characters)
- [ ] Test keyboard navigation
- [ ] Check responsiveness (mobile, tablet)

**Lighthouse (periodic):**
```bash
# Run in browser DevTools
# Target: Performance >90, Accessibility >90, Best Practices >90
```

---

### 4. Update Docs

**Required updates:**

#### A. CONTEXT_INDEX.md

Update the relevant section with:
- What changed
- Why it changed
- New functions/modules added
- Dependencies introduced
- Timestamp

**Example:**
```markdown
#### `duck.ts`
...
- **Last Changed:** 2025-11-06 - Added loadCSV() function for CSV import
```

#### B. CHANGELOG.md

Add entry under `[Unreleased]`:

```markdown
### Added
- CSV import support for datasets

### Fixed
- Query timeout handling on slow devices

### Changed
- Improved error messages for SQL syntax errors
```

#### C. ADRs (if applicable)

If this is a **design decision**, create a new ADR:

```bash
docs/ADR/ADR-NNNN-short-title.md
```

Use template:
```markdown
# ADR-NNNN: Title

**Status:** Accepted | Deprecated | Superseded
**Date:** YYYY-MM-DD
**Deciders:** Who decided
**Context:** Background

## Decision
What we decided and why

## Consequences
Positive, negative, neutral outcomes
```

#### D. README.md (if user-facing)

Update main README if:
- New installation steps
- New commands
- New requirements
- Major features

---

### 5. Commit and Summarize

**Commit Message Format:**

```
<type>: <short description>

<optional detailed explanation>

- Key change 1
- Key change 2

Refs: #issue-number (if applicable)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change without behavior change
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: add CSV import for datasets

- Implement loadCSV() in duck.ts
- Add sanitization for formula injection
- Update pack schema to support CSV src
- Add tests for CSV loading edge cases

Updated CONTEXT_INDEX and CHANGELOG.
```

**Git Commands:**
```bash
git add .
git commit -m "feat: add CSV import for datasets"
git push
```

---

## Resuming Context (For Claude or New Devs)

When starting a new session:

1. **Read CONTEXT_INDEX.md** - Get module overview
2. **Read CHANGELOG.md** - Understand recent changes
3. **Check ADRs** - Understand design decisions
4. **Review open issues/TODOs** - Know what's next
5. **Run tests** - Verify everything works

**Commands:**
```bash
# Fresh clone
git clone <repo>
cd sql-learn
pnpm install

# Verify setup
pnpm typecheck
pnpm lint
pnpm test

# Start dev server
pnpm dev
```

---

## CI Enforcement

**File:** `scripts/check-docs.js`

**Logic:**
```javascript
if (code changed in /app or /lib) {
  assert(
    CONTEXT_INDEX.md touched OR
    CHANGELOG.md touched OR
    ADR/* touched
  )
}
```

**GitHub Action:** `.github/workflows/ci.yml`

```yaml
- name: Docs Touch Check
  run: node scripts/check-docs.js
```

**If CI fails:**
1. Update at least one of: CONTEXT_INDEX, CHANGELOG, or add ADR
2. Stage changes: `git add docs/`
3. Amend commit: `git commit --amend --no-edit`
4. Force push: `git push --force-with-lease`

---

## Anti-Patterns

### ❌ Don't Do This

- **Large commits:** Mixing multiple features in one commit
- **Skip docs:** "I'll document it later" (enforced by CI!)
- **Skip tests:** "It works on my machine"
- **Ignore lint errors:** "I'll fix it later"
- **Break main branch:** Always verify tests pass locally first
- **Ambiguous commit messages:** "fix stuff", "wip", "asdf"

### ✅ Do This Instead

- **Small, atomic commits** with clear messages
- **Update docs alongside code** in the same commit
- **Write tests first** (TDD) or immediately after
- **Fix lint/type errors** before committing
- **Test locally** before pushing
- **Descriptive commit messages** with context

---

## Example Session

**Goal:** Add "export results to CSV" feature

**Step 1: Identify increment**
> "Add a button to export query results as CSV file"

**Step 2: Implement**
- Add `exportToCSV()` function in `lib/utils.ts`
- Add "Export CSV" button to ResultGrid component
- Sanitize output to prevent formula injection
- Handle edge cases (empty results, special characters)

**Step 3: Test**
```bash
pnpm typecheck  # ✓
pnpm lint       # ✓
pnpm test       # ✓ (added unit test for exportToCSV)
```

Manual test:
- [x] Export with normal data
- [x] Export with empty results
- [x] Export with special characters
- [x] Verify downloaded file opens in Excel

**Step 4: Update docs**

`docs/CONTEXT_INDEX.md`:
```diff
#### `utils.ts`
- **Purpose:** Utility functions
- **Key Functions:**
  - `cn()` - Tailwind class name merger
+  - `exportToCSV()` - Export array to CSV download
- **Last Changed:** 2025-11-06 - Added exportToCSV function
```

`docs/CHANGELOG.md`:
```diff
## [Unreleased]

### Added
+ - Export query results to CSV feature
```

**Step 5: Commit**
```bash
git add .
git commit -m "feat: add CSV export for query results

- Implement exportToCSV() utility function
- Add Export button to ResultGrid component
- Sanitize output to prevent formula injection
- Add tests for edge cases (empty, special chars)

Updated CONTEXT_INDEX and CHANGELOG."

git push
```

**CI:** ✅ Passes (docs were touched)

---

## For Claude Code Specifically

**When starting a new task:**

1. Read `/docs/CONTEXT_INDEX.md` first
2. Check `/docs/CHANGELOG.md` for recent work
3. Review related ADRs
4. Implement the smallest slice
5. **Always update docs before committing**
6. Use descriptive commit messages

**Memory Aid:**

> "Code without docs is technical debt."

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Architecture Decision Records](https://adr.github.io/)

---

**Last Updated:** 2025-11-05
**Maintainers:** Escola de Dados Team
