# Sprint 14: Fix AI Review False Positives

**Status:** Complete
**Date:** 2025-12-06

## Problem

The AI Review was giving incorrect feedback on valid SQL queries. Example:

**User's valid query:**
```sql
WITH active_users as (SELECT distinct user_id FROM messenger_activity WHERE activity_date = '2024-11-29'),
video_callers as (SELECT caller_id FROM calls WHERE call_date = '2024-11-29' AND call_type = 'video')
SELECT COUNT(DISTINCT user_id) active_users, COUNT(DISTINCT caller_id) video_callers,
ROUND(100.00*COUNT(DISTINCT caller_id)/COUNT(DISTINCT user_id), 2) video_call_percentage
FROM active_users au LEFT JOIN video_callers vc ON au.user_id = vc.caller_id
```

**AI's incorrect feedback:**
> "COUNT(DISTINCT caller_id) counts all video callers, including those not active on Messenger"

**Why the AI was wrong:**
1. The LEFT JOIN starts from `active_users` - only active users are in the result
2. `caller_id` is NULL for active users who didn't make video calls
3. `COUNT(DISTINCT caller_id)` ignores NULLs, so it only counts active users who made calls
4. The logic is actually correct - this is an alternative approach to the EXISTS pattern

## Root Cause

The Claude prompt lacked:
1. SQL execution context - AI doesn't see actual query results
2. Explicit guidance on alternative approaches - LEFT JOIN + COUNT is valid
3. NULL handling awareness - AI doesn't consider that COUNT ignores NULLs

## Solution

Updated `app/api/review/route.ts` with improved prompts:

### System Prompt Changes

Added "CRITICAL SQL RULES" section:
```
1. COUNT() ignores NULL values - COUNT(DISTINCT col) only counts non-NULL distinct values
2. LEFT JOIN from table A to B: rows from A always appear; B columns are NULL when no match
3. Multiple valid approaches exist: EXISTS, IN, LEFT JOIN + COUNT, window functions, subqueries
4. A LEFT JOIN + COUNT(column) approach CAN be equivalent to an EXISTS approach
```

Added review process guidance:
```
1. First, trace through the query logic step by step
2. Consider how NULLs propagate through JOINs and aggregations
3. Compare the LOGIC, not just syntax, to the reference solution
4. Only flag issues if the query would produce WRONG RESULTS
```

### User Prompt Changes

Added explicit guidance:
```
IMPORTANT: The reference solution shows ONE valid approach. The user's query may use a
different but equally valid approach (e.g., LEFT JOIN + COUNT vs EXISTS, subquery vs CTE).
Analyze whether the user's query would produce the CORRECT RESULTS, not whether it matches
the reference syntax.
```

## Files Modified

| File | Change |
|------|--------|
| `app/api/review/route.ts` | Updated system and user prompts |

## Testing

Verified fix by testing the same LEFT JOIN query - AI now correctly marks it as "correct".
