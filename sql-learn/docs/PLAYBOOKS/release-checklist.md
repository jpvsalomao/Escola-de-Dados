# Release Checklist

**Purpose:** Ensure consistent, high-quality releases with no steps missed.

## Pre-Release (1-2 days before)

### Code Quality

- [ ] All tests passing (`pnpm test` and `pnpm test:e2e`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No lint warnings (`pnpm lint`)
- [ ] Code formatted (`pnpm format:check`)
- [ ] No console.error or console.warn in production code
- [ ] All TODOs addressed or documented in backlog

### Documentation

- [ ] CHANGELOG.md updated with all changes since last release
- [ ] CONTEXT_INDEX.md reflects current state
- [ ] README.md updated (if needed)
- [ ] All ADRs up-to-date
- [ ] API documentation current (if applicable)
- [ ] Migration guide written (if breaking changes)

### Testing

- [ ] Manual smoke test on dev environment
- [ ] Test all critical user flows:
  - [ ] Load home page
  - [ ] Browse packs
  - [ ] Open a challenge
  - [ ] Write and run a query
  - [ ] Submit for grading (pass and fail cases)
  - [ ] View progress
  - [ ] Export/import progress
- [ ] Cross-browser testing:
  - [ ] Chrome/Edge (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
- [ ] Mobile testing:
  - [ ] iOS Safari
  - [ ] Android Chrome
- [ ] Accessibility audit:
  - [ ] Lighthouse Accessibility score ≥ 90
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested (NVDA or VoiceOver)
  - [ ] Color contrast checked
- [ ] Performance audit:
  - [ ] Lighthouse Performance score ≥ 90
  - [ ] Bundle size acceptable (<5 MB total)
  - [ ] Load time <3s on 3G

### Security

- [ ] Dependencies up-to-date (`pnpm outdated`, `pnpm audit`)
- [ ] No known vulnerabilities in dependencies
- [ ] CSP headers configured (if applicable)
- [ ] COOP/COEP headers set for DuckDB-WASM
- [ ] No secrets in code or config files
- [ ] Input sanitization verified (especially CSV)

### Content

- [ ] All packs load correctly
- [ ] All challenges solvable
- [ ] Hints and solutions accurate
- [ ] No typos in challenge text
- [ ] Datasets integrity checked

---

## Release Process

### 1. Version Bump

Update version in:
- [ ] `package.json`
- [ ] `docs/CHANGELOG.md` (move `[Unreleased]` to `[X.Y.Z]` with date)
- [ ] Any version constants in code

**Example:**
```bash
# For v1.1.0 release
# Update package.json version to 1.1.0
# In CHANGELOG.md:
## [1.1.0] - 2025-11-15
... (move unreleased items here)

## [Unreleased]
(empty section for next work)
```

### 2. Create Release Branch

```bash
git checkout -b release/v1.1.0
git add .
git commit -m "chore: bump version to 1.1.0"
git push origin release/v1.1.0
```

### 3. Build and Verify

```bash
pnpm build
```

- [ ] Build completes without errors
- [ ] No warnings in build output
- [ ] Verify build artifacts in `.next/`
- [ ] Test production build locally:
  ```bash
  pnpm start
  ```
- [ ] Smoke test production build

### 4. Create Git Tag

```bash
git tag -a v1.1.0 -m "Release v1.1.0 - [Brief description]"
git push origin v1.1.0
```

### 5. Create GitHub Release

On GitHub:
1. Go to Releases → Draft a new release
2. Choose tag `v1.1.0`
3. Release title: `v1.1.0 - [Feature Name]`
4. Description: Copy from CHANGELOG.md (formatted)
5. Attach build artifacts (if applicable)
6. Check "Set as latest release"
7. Publish release

**Release Notes Template:**
```markdown
# SQL Learn v1.1.0

## 🎉 Highlights

- Major feature 1
- Major feature 2

## ✨ New Features

- Feature A
- Feature B

## 🐛 Bug Fixes

- Fix X
- Fix Y

## 📚 Documentation

- Updated ...

## ⚠️ Breaking Changes

(None for v1.1.0)

## 🚀 Upgrade Instructions

```bash
git pull origin main
pnpm install
pnpm build
```

## 📊 Stats

- X new challenges
- Y lines of code added
- Z contributors

---

**Full Changelog:** https://github.com/org/repo/compare/v1.0.0...v1.1.0
```

### 6. Deploy

#### For Static Hosting (Vercel/Netlify)

- [ ] Merge release branch to `main`
- [ ] Verify automatic deployment triggered
- [ ] Monitor deployment logs
- [ ] Wait for deployment to complete

#### Manual Deploy

```bash
# Build for production
pnpm build

# Deploy (example with Vercel CLI)
vercel --prod

# Or export static files
pnpm export
# Upload .next/out/* to hosting
```

- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Headers configured (COOP/COEP)

### 7. Post-Deploy Verification

- [ ] Visit production URL
- [ ] Smoke test critical flows (see Pre-Release Testing)
- [ ] Check browser console for errors
- [ ] Verify analytics (if enabled)
- [ ] Test from different geographic regions (if applicable)

### 8. Rollback Plan (if issues found)

**Option A: Quick fix**
1. Fix bug in new branch
2. Fast-track through CI
3. Deploy hotfix
4. Tag as `v1.1.1`

**Option B: Rollback**
1. Revert to previous Git tag
2. Redeploy previous version
3. Investigate issue locally

```bash
# Rollback example
git revert HEAD~1  # or specific commit
git push origin main
# Trigger redeploy
```

---

## Post-Release (within 24 hours)

### Communication

- [ ] Announce release on social media (if applicable)
- [ ] Email users (if mailing list exists)
- [ ] Post in Discord/Slack community (if applicable)
- [ ] Update status page (if applicable)

### Monitoring

- [ ] Check error tracking (Sentry, etc.) for new issues
- [ ] Monitor analytics for traffic patterns
- [ ] Watch for user feedback (GitHub issues, Discord)
- [ ] Review performance metrics

### Documentation

- [ ] Update demo videos (if UI changed significantly)
- [ ] Update screenshots (if UI changed)
- [ ] Update tutorials (if features changed)

### Backlog Update

- [ ] Move completed items from roadmap to changelog
- [ ] Prioritize next sprint items
- [ ] Create issues for new feedback

---

## Hotfix Process

**For critical bugs in production:**

### 1. Assess Severity

- **Critical:** Breaks core functionality, immediate hotfix needed
- **High:** Major feature broken, hotfix within 24h
- **Medium:** Minor feature broken, can wait for next release
- **Low:** Cosmetic issue, backlog

### 2. Create Hotfix Branch

```bash
git checkout v1.1.0  # Start from release tag
git checkout -b hotfix/v1.1.1
# Fix bug
git commit -m "fix: critical bug in grader logic"
```

### 3. Fast-Track Testing

- [ ] Unit tests pass
- [ ] Manual test of fix
- [ ] Verify fix doesn't break other features

### 4. Merge and Deploy

```bash
git tag -a v1.1.1 -m "Hotfix: grader bug"
git push origin hotfix/v1.1.1
git push origin v1.1.1

# Merge back to main
git checkout main
git merge hotfix/v1.1.1
git push origin main
```

### 5. Document

- [ ] Update CHANGELOG.md with hotfix entry
- [ ] Create GitHub release for hotfix
- [ ] Notify users if critical

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR (X.0.0):** Breaking changes, incompatible API changes
- **MINOR (1.X.0):** New features, backward compatible
- **PATCH (1.1.X):** Bug fixes, backward compatible

**Examples:**
- `1.0.0` → `1.1.0`: Added CSV import feature
- `1.1.0` → `1.1.1`: Fixed CSV parsing bug
- `1.9.9` → `2.0.0`: Changed pack schema (breaking)

---

## Release Cadence

**v1.x:**
- **Minor releases:** Every 2-4 weeks
- **Patch releases:** As needed for bugs
- **Major releases:** When breaking changes are necessary

**Communication:**
- Announce release schedule in advance (if possible)
- Use GitHub Milestones to track release progress

---

## Rollback Criteria

Rollback immediately if:

1. **Data Loss:** User progress is lost or corrupted
2. **Security Vulnerability:** Critical vulnerability introduced
3. **Complete Breakage:** App doesn't load or crashes immediately
4. **Performance Regression:** >50% slower than previous version

Consider rollback if:

1. Major feature is completely broken
2. Multiple users report same critical bug
3. Accessibility severely regressed

Do NOT rollback for:

1. Minor UI issues
2. Single-user reports without reproduction
3. Non-critical bugs with workarounds

---

## Metrics to Track

**Per Release:**
- Build time
- Bundle size
- Test coverage %
- Number of bugs found in QA
- Time from dev complete to deploy

**Post-Release:**
- Crash rate
- Error rate (% of requests)
- User-reported issues (first 24h, first week)
- Performance metrics (TTFB, FCP, LCP)
- User engagement (DAU, session length)

---

## Tools

- **CI/CD:** GitHub Actions
- **Hosting:** Vercel / Netlify / GitHub Pages
- **Error Tracking:** (Sentry, planned for v2)
- **Analytics:** (Planned for v2)
- **Monitoring:** (Planned for v2)

---

## Checklist Summary

Quick copy-paste checklist for release day:

```
Pre-Release:
☐ Tests passing
☐ Docs updated
☐ Manual smoke test
☐ Cross-browser test
☐ Accessibility audit
☐ Performance audit
☐ Security check

Release:
☐ Version bumped
☐ Release branch created
☐ Build verified
☐ Git tag created
☐ GitHub release published
☐ Deployed to production
☐ Post-deploy verification

Post-Release:
☐ Announce release
☐ Monitor errors
☐ Update backlog
```

---

**Last Updated:** 2025-11-05
**Maintainers:** Escola de Dados Team
