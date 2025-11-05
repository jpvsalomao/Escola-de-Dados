# Roadmap

## Vision

Build the best interactive SQL learning platform that scales from beginners to advanced users, with a focus on hands-on practice and immediate feedback.

## Version History

- **v1.0.0** (2025-11-05): Initial release with core features and pack_basics

## Upcoming Releases

### v1.1.0 - Content Expansion (Target: 2-3 weeks after v1.0)

**Goal:** More learning content and quality-of-life improvements

#### Features
- [ ] Add `pack_intermediate` with 10 challenges (JOINs, subqueries, window functions)
- [ ] Add `pack_advanced` with 10 challenges (CTEs, advanced aggregations)
- [ ] Challenge search and filtering (by difficulty, tags, completion status)
- [ ] Dark mode theme toggle
- [ ] Export progress to CSV/JSON from UI
- [ ] Print/PDF challenge sheets for offline study

#### Improvements
- [ ] Better mobile responsive design
- [ ] Keyboard shortcuts (Cmd+Enter to run query)
- [ ] Monaco editor themes selector
- [ ] Improved error messages with suggestions

#### Fixes
- [ ] Address any bugs reported in v1.0

---

### v1.2.0 - Enhanced Learning Experience (Target: 1-2 months after v1.1)

**Goal:** Make learning more engaging and guided

#### Features
- [ ] Hints system with progressive disclosure
- [ ] Inline SQL reference documentation
- [ ] Query explanation feature (EXPLAIN QUERY PLAN)
- [ ] Challenge difficulty ratings based on completion rate
- [ ] Recommended next challenge based on progress
- [ ] Achievement badges (e.g., "Completed all easy challenges")
- [ ] SQL formatter/beautifier

#### Content
- [ ] `pack_data_cleaning` - NULL handling, CASE statements, string functions
- [ ] `pack_analytics` - Business metrics, cohort analysis
- [ ] `pack_performance` - Query optimization challenges

---

### v2.0.0 - Social & Community (Target: 3-6 months after v1.0)

**Goal:** Build a community around SQL learning

#### Major Features
- [ ] **Authentication:** Email/password, OAuth (Google, GitHub)
- [ ] **User Profiles:** Public profile pages with stats, achievements
- [ ] **Leaderboards:** Global and per-pack rankings
- [ ] **Progress Sync:** Cloud backup of progress across devices
- [ ] **Discussion Forums:** Per-challenge discussion threads
- [ ] **Solution Sharing:** Share and vote on solutions
- [ ] **Custom Packs:** User-created and community packs
- [ ] **Pack Marketplace:** Browse, rate, and download community packs

#### Infrastructure
- [ ] Backend API (Node.js/Deno)
- [ ] PostgreSQL database
- [ ] User authentication system
- [ ] CDN for pack hosting
- [ ] Admin dashboard for content moderation

#### Breaking Changes
- Pack schema v2.0 with enhanced metadata
- Migration path for v1 users

---

### v2.1.0 - Collaborative Learning (Target: 1-2 months after v2.0)

**Goal:** Learn together with others

#### Features
- [ ] **Pair Programming Mode:** Shared SQL editor sessions
- [ ] **Multiplayer Challenges:** Competitive/cooperative modes
- [ ] **Study Groups:** Create private groups with shared progress tracking
- [ ] **Mentorship System:** Connect learners with SQL experts
- [ ] **Live Workshops:** Scheduled live coding sessions
- [ ] **Challenge of the Week:** Community-wide events

---

### v3.0.0 - Enterprise & Advanced Features (Target: 6-12 months after v2.0)

**Goal:** Support enterprise training and advanced use cases

#### Features
- [ ] **Organization Accounts:** Team licenses, SSO integration
- [ ] **Custom Branding:** White-label option for enterprises
- [ ] **LMS Integration:** SCORM, LTI compatibility
- [ ] **Advanced Analytics:** Detailed learner progress tracking
- [ ] **Adaptive Learning:** AI-powered challenge recommendations
- [ ] **Multi-Database Support:** PostgreSQL, MySQL, SQL Server modes
- [ ] **Real Database Connections:** Connect to actual databases (sandboxed)
- [ ] **Certification System:** Verified skill assessments
- [ ] **API Access:** Programmatic pack management

#### Infrastructure
- [ ] Multi-tenancy support
- [ ] Advanced security and compliance (SOC 2, GDPR)
- [ ] Horizontal scaling architecture
- [ ] Real-time collaboration infrastructure

---

## Continuous Improvements

### Ongoing (All Versions)

- **Performance:** Reduce bundle size, optimize WASM loading
- **Accessibility:** WCAG AAA compliance, screen reader improvements
- **Internationalization:** Support for multiple languages (es, pt, fr, de, zh)
- **Content Quality:** Regularly add new challenges based on user feedback
- **Bug Fixes:** Address reported issues promptly
- **Documentation:** Keep docs up-to-date with features

---

## Feature Requests from Community

_To be populated based on user feedback_

### Under Consideration
- Mobile app (iOS, Android)
- VS Code extension
- Jupyter notebook integration
- Challenge difficulty rating (user-generated)
- Bookmarking/favoriting challenges
- Progress sharing on social media

### Declined
- (None yet)

---

## Research & Experimentation

### Ideas to Explore

- **AI-Powered Hints:** Use LLMs to generate context-aware hints
- **Automated Challenge Generation:** Generate challenges from schema
- **Visual Query Builder:** Drag-and-drop query construction for beginners
- **SQL Linter:** Real-time suggestions for query improvements
- **Performance Benchmarking:** Compare query performance across solutions
- **Gamification:** XP points, level progression, quests
- **Video Tutorials:** Embedded explanatory videos per challenge
- **Interactive Schema Diagrams:** Visual ERD with clickable tables

---

## Non-Goals

**Things we explicitly will NOT do:**

- Become a general-purpose data science platform (focus on SQL only)
- Support proprietary SQL dialects that can't run in DuckDB
- Store or process sensitive user data (PII, credentials)
- Build a full-fledged IDE (keep it focused on learning)
- Monetize through ads (explore premium/enterprise instead)

---

## How to Contribute

See `/CONTRIBUTING.md` (future) for guidelines on:
- Submitting challenge ideas
- Reporting bugs
- Proposing features
- Contributing code

For v1, contact the maintainers directly with suggestions.

---

## Success Metrics

### v1 Goals
- [ ] 100 active users in first month
- [ ] 50% of users complete pack_basics
- [ ] Average session time > 15 minutes
- [ ] <2% error rate on challenge loads

### v2 Goals
- [ ] 10,000 registered users
- [ ] 100 community-created packs
- [ ] 70% user retention after 30 days
- [ ] 4.5+ star rating on community packs

### v3 Goals
- [ ] 5 enterprise customers
- [ ] 100,000 total users
- [ ] 90% uptime SLA
- [ ] WCAG AAA compliance

---

**Last Updated:** 2025-11-05
**Maintainers:** Escola de Dados Team
