# Sprint 17: Test & Data Quality Improvement

**Status:** Complete
**Date:** December 2025

## Problem Statement

The `pack_meta_interview` challenge pack had tests that could pass by accident due to:
1. **Weak assertions**: Over-reliance on ROWCOUNT without value validation
2. **Missing edge cases**: No decoy data to catch incorrect logic
3. **Small answer sets**: Queries with logic errors accidentally returned correct counts

## Goals

1. Create comprehensive data generation script with edge cases for all 20 challenges
2. Expand test assertions from ~60 to 125+ with value validation
3. Regenerate all parquet files with edge case data
4. Document all edge cases and test rationale

## Deliverables

### Completed

- [x] Created `scripts/generate-meta-interview-data-v3.py` (~900 lines)
- [x] Regenerated all 18 parquet files with edge cases
- [x] Updated all 20 challenges in `pack.json` with strengthened tests
- [x] Created `docs/DATA_DESIGN.md` documenting edge cases
- [x] Verified all 20 challenges pass: `python3 scripts/test-solutions-duckdb.py`

## Key Changes by Challenge

| Challenge | Tests Before | Tests After | Key Edge Cases |
|-----------|-------------|-------------|----------------|
| Q1 | 3 | 6 | 2023/2025 posts as decoys |
| Q2 | 2 | 5 | June-only, July-only users |
| Q3 | 3 | 7 | CTR=0 app, no impressions app |
| Q4 | 2 | 4 | Pages with/without likes |
| Q5 | 3 | 6 | Private events, existing friends |
| Q6 | 3 | 5 | 28-day boundary |
| Q7 | 2 | 5 | Video vs audio calls |
| Q8 | 2 | 5 | COUNT vs COUNT DISTINCT |
| Q9 | 3 | 6 | All 5 histogram buckets |
| Q10 | 2 | 6 | November dates only |
| Q11 | 2 | 6 | 4-day streak (excluded) |
| Q12 | 3 | 11 | All 8 state transitions |
| Q13 | 2 | 5 | Already liked pages |
| Q14 | 2 | 5 | DENSE_RANK ties |
| Q15 | 2 | 6 | YTD monotonic increase |
| Q16 | 2 | 6 | 2 mutual friends (excluded) |
| Q17 | 2 | 5 | Stickiness 0-100% |
| Q18 | 2 | 4 | Multiple duplicates |
| Q19 | 2 | 4 | 2023 activities |
| Q20 | 2 | 5 | Negative growth, 2022 excluded |

## Edge Case Categories

1. **Decoy Data**: Records that should be excluded by correct queries
   - 2023/2025 posts for Q1 (year filter)
   - June-only users for Q2 (retention logic)
   - App with no impressions for Q3 (division by zero)

2. **Boundary Values**: Data at exact boundaries
   - 28 days for churn (Q6)
   - 2 mutual friends (Q16 requires 3+)
   - 4-day streak (Q11 requires 5+)

3. **Edge Cases**: Special scenarios
   - CTR = 0 (valid value)
   - Tied engagement scores (DENSE_RANK)
   - Single-post categories (excluded)

## Verification

```bash
python3 scripts/test-solutions-duckdb.py
# Result: ✓ Passed: 20, ✗ Failed: 0
```

## Files Modified

- `scripts/generate-meta-interview-data-v3.py` (NEW)
- `public/packs/pack_meta_interview/pack.json`
- `public/packs/pack_meta_interview/*.parquet` (18 files)
- `docs/DATA_DESIGN.md` (NEW)
- `docs/CHANGELOG.md`
- `STATUS.md`

## Lessons Learned

1. ROWCOUNT assertions alone are insufficient for catching logic errors
2. Edge case data design should be documented before implementation
3. SQL-based value validation catches issues ROWCOUNT misses
4. All state transitions should be explicitly tested (Q12)
