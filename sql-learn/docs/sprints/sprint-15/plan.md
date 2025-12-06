# Sprint 15: ChallengeTabs UI/UX Improvements

**Status:** Complete
**Date:** 2025-12-06

## Problems

### Problem 1: Squeezed Tab Headers
The tab bar showed badges like "Percentage with CTEs" which overflowed and squeezed the layout.

**Root Cause:**
- No max-width constraint on badge text
- Badge could grow unbounded within flex container

### Problem 2: Inconsistent Color Usage
Colors were random across sections, not following Design System v2.0.

| Section | Before | Issue |
|---------|--------|-------|
| Tab active | Teal | OK (primary) |
| Hint Tier 1 | Teal | Should be Amber (warning) |
| Hint Tier 2 | Amber | OK |
| Hint Tier 3 | Orange | Should be Amber (same family) |
| Notes icon | Violet | Not in design system |
| Before You Code | Amber→Orange gradient | Should be single Amber |

## Solution

### Design System v2.0 Color Mapping

- **Primary (Teal)**: Tabs, links, primary actions
- **Warning (Amber)**: All hints (tier 1-3), Before You Code
- **Success (Emerald)**: Completion states, progress
- **Code (Indigo)**: Tables, schema, technical elements
- **Neutral (Gray)**: Borders, backgrounds, secondary text

### Changes Made

1. **Removed skill badge from Strategy tab**
   - Fixed: Tab header squeeze issue
   - Skill info already shown in Strategy tab content

2. **Unified hint colors to Amber family:**
   ```
   Tier 1: bg-amber-50, text-amber-700, border-amber-200
   Tier 2: bg-amber-50, text-amber-700, border-amber-200 (button)
           bg-amber-100, text-amber-800 (expanded)
   Tier 3: bg-amber-100, text-amber-800, border-amber-300
   ```

3. **Changed Notes from Violet to Indigo:**
   ```
   Before: bg-violet-100, text-violet-600, focus:ring-violet-500
   After:  bg-indigo-100, text-indigo-600, focus:ring-indigo-500
   ```

4. **Fixed Before You Code gradient:**
   ```
   Before: bg-gradient-to-br from-amber-50 to-orange-50
   After:  bg-amber-50 (single color)
   ```

5. **Hints header icon color:**
   ```
   Before: text-teal-600
   After:  text-amber-600
   ```

## Files Modified

| File | Change |
|------|--------|
| `app/components/ChallengeTabs.tsx` | All color and badge fixes |

## Visual Result

- Cleaner tab headers without overflow
- Consistent amber color family for all hints/warnings
- Indigo for technical elements (tables, notes, AI review)
- Teal reserved for primary actions only
