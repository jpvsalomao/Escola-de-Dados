# Sprint 9: Challenge Validation & Ordering

**Status:** Complete
**Started:** 2025-12-05
**Goal:** Validate all challenge solutions and reorder by difficulty

## Summary

Created a DuckDB-based test script to validate all 20 Meta interview challenges, fixed data/test inconsistencies, and reordered challenges by difficulty (easy → medium → hard).

## Tasks

- [x] Create Python test script (`scripts/test-solutions-duckdb.py`)
- [x] Run tests and identify 6 failing challenges
- [x] Fix data generation script v2 (friendships schema, page_likes)
- [x] Update test expectations (q2: 13 users, q5: 8 pairs, q17: 11 months)
- [x] Reorder challenges by difficulty in pack.json
- [x] Verify all 20 tests pass

## Issues Fixed

| Challenge | Issue | Fix |
|-----------|-------|-----|
| q2_mau_retention | Expected 6 users, got 13 | Updated test to expect 13 |
| q4_pages_no_likes | Expected 3 pages, got 0 | Fixed page_likes to only use pages 1-7 |
| q5_friend_recommendations | SQL error + wrong count | Fixed friendships schema, updated test to expect 8 |
| q13_page_recommendations | SQL error | Fixed friendships schema (user1_id, user2_id) |
| q16_mutual_friends_count | SQL error | Fixed friendships schema |
| q17_dau_mau_stickiness | Expected 12 months, got 11 | Updated test to expect 11 |

## New Challenge Order

**Easy (2):**
1. Pages With No Likes
2. First Activity and Total Activities

**Medium (11):**
3. Average Post Hiatus
4. Click-Through Rate (CTR)
5. Messenger Video Call Percentage
6. Users With 3+ Distinct Calls
7. Comment Histogram
8. Page Recommendations from Friends
9. Second Highest Engagement per Category
10. Cumulative Revenue by Month
11. DAU/MAU Stickiness Ratio
12. Deduplicate User Records
13. Year-over-Year MAU Growth

**Hard (7):**
14. Monthly Active User Retention
15. Friend Recommendations
16. Weekly Churn Rate
17. Rolling 7-Day Active Users
18. Consecutive Login Streak
19. Advertiser Status Transitions
20. Mutual Friends Count

## Files Modified

| File | Change |
|------|--------|
| `scripts/test-solutions-duckdb.py` | NEW - DuckDB test runner |
| `scripts/generate-meta-interview-data-v2.py` | Fixed friendships schema |
| `public/packs/pack_meta_interview/pack.json` | Fixed tests, reordered challenges |
| `public/packs/pack_meta_interview/*.parquet` | Regenerated data files |

## Notes

- Test script requires `duckdb` Python package
- Run with: `python scripts/test-solutions-duckdb.py`
- Data must be regenerated in order: v1 script first, then v2 script
