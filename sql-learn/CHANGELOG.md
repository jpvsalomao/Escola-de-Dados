# SQL Learn - Changelog

## 2025-01-06 - Table Schema Viewer Feature

### New Features

#### Expandable Table Schema Viewer
**Feature:** Added expandable table schema viewer to the Available Tables section in challenge pages.

**Benefits:**
- Students can now view table columns and their data types without leaving the challenge page
- Easier to write queries by seeing the exact column names and types
- Reduces guessing and trial-and-error when writing SQL

**How it works:**
1. Click on any table name in the Available Tables section
2. The table expands to show all columns with their data types
3. Click again to collapse
4. Schema is cached after first load for better performance

**Implementation:**
- Added `getTableSchema()` integration from DuckDB
- State management for expanded tables and cached schemas
- Loading spinner while fetching schema
- Consistent styling with hint/solution sections (chevron rotation animation)
- Shows column count badge when expanded

**Files Modified:**
- `app/challenges/[packId]/[challengeId]/page.tsx` (lines 10, 31-32, 111-131, 268-322)

**UI Elements:**
- Expandable cards for each table
- Chevron icon that rotates 90° when expanded
- Column count display
- Each column shown with name (left) and type badge (right)
- Loading state with animated spinner
- Hover effect on table buttons

---

## 2025-01-05 - Bug Fixes & UI Improvements

### Critical Fixes

#### 1. Fixed Parquet File Loading Error ✅
**Issue:** `Error: IO Error: No files found that match the pattern "/packs/pack_basics/customers.parquet"`

**Root Cause:**
- DuckDB-WASM in browser cannot access file paths directly
- Files were in `app/packs/` but needed to be in `public/packs/`

**Solution:**
- Moved pack files to `public/packs/pack_basics/`
- Updated `loadParquet()` function to fetch files via HTTP and register as buffers
- Modified `app/lib/duck.ts` to properly load parquet files in browser

**Files Modified:**
- Created `public/packs/pack_basics/` directory
- Updated `app/lib/duck.ts` (lines 77-95)

---

#### 2. Fixed Semicolon Handling ✅
**Issue:** Queries with trailing semicolons (`;`) were failing tests

**Example:**
```sql
-- This was failing
SELECT * FROM customers;

-- Only this worked
SELECT * FROM customers
```

**Root Cause:**
- Semicolons were included when queries were used in test subqueries
- Caused syntax errors like: `SELECT * FROM (SELECT * FROM customers;) t`

**Solution:**
- Added SQL normalization in `gradeQuery()` function
- Automatically removes trailing semicolons and whitespace
- Regex pattern: `/;+\s*$/`

**Files Modified:**
- `app/lib/grader.ts` (lines 17-18)

**Now Both Work:**
```sql
SELECT * FROM customers    ✅
SELECT * FROM customers;   ✅
SELECT * FROM customers  ; ✅
SELECT * FROM customers;;; ✅
```

---

#### 3. Fixed Challenge 5 Column Count Test ✅
**Issue:** Test for checking 2 columns was using invalid SQL

**Old Test (Broken):**
```sql
SELECT COUNT(*) = 2 AS ok
FROM (
  SELECT * FROM information_schema.columns
  WHERE table_name IN (
    SELECT table_name FROM information_schema.tables
    WHERE sql LIKE '%USER_SQL%'
  )
)
```

**New Test (Fixed):**
```sql
SELECT COUNT(DISTINCT column_name) = 2 AS ok
FROM (DESCRIBE ({{USER_SQL}}))
```

**Files Modified:**
- `public/packs/pack_basics/pack.json` (line 138)

---

#### 4. Fixed Challenge 3 Expected Row Count ✅
**Issue:** Test expected 2 Brazilian customers but data has 3

**Actual Data:**
1. Ana Silva (Brazil)
2. João Santos (Brazil)
3. Carla Souza (Brazil)

**Solution:**
- Updated test to expect 3 rows instead of 2
- Changed test name from `returns_two_rows` to `returns_three_rows`

**Files Modified:**
- `public/packs/pack_basics/pack.json` (lines 81-86)
- `TESTING_GUIDE.md`

---

### UI/UX Improvements 🎨

#### Homepage Enhancements
- ✨ Added gradient background
- 🎯 New hero header with database icon
- 📊 Enhanced pack header card with stats grid
- 🏷️ Better tag display and badges
- ⚡ Improved loading states with animated spinner
- ❌ Better error states with helpful messages

#### Challenge Cards
- 🔢 Challenge number badges
- ✅ Animated completion badges
- 🎭 Hover effects (scale, translate, shadow)
- 🏆 Difficulty icons (easy/medium/hard)
- 🎨 Better color scheme (emerald/amber/rose)
- 👉 Clear call-to-action buttons

#### Challenge Page
- 📌 Sticky header that stays visible
- 🔄 Back button with hover animation
- 📋 2-3 column layout (instructions vs editor)
- 🎯 Icon-based sections
- 🔽 Collapsible hints & solutions
- 🧹 Clear button for SQL editor
- 📊 Enhanced results display
- ⚡ Performance stats (time & rows)

#### Progress Badge
- 🌈 Dynamic colors based on completion
- 🎉 Special celebration at 100%
- 📈 Gradient progress bar
- 💬 Motivational text

**Files Modified:**
- `app/globals.css` - Enhanced global styles
- `app/page.tsx` - Homepage redesign
- `app/challenges/[packId]/[challengeId]/page.tsx` - Challenge page redesign
- `app/components/ChallengeCard.tsx` - Card enhancements
- `app/components/ProgressBadge.tsx` - Progress improvements

---

### Documentation 📚

#### New Files Created
1. **TESTING_GUIDE.md** - Comprehensive testing documentation
   - All challenge solutions with expected results
   - Troubleshooting guide
   - Common issues and fixes
   - Data schema documentation

2. **SOLUTIONS.md** - Quick reference guide
   - All SQL solutions in one place
   - Important notes about syntax
   - Quick tips for students

3. **CHANGELOG.md** - This file
   - Complete history of fixes
   - Detailed explanations of issues

#### Updated Files
- README.md would benefit from updates (not done yet)

---

## Verified Solutions

All challenges now work correctly with these solutions:

```sql
-- Challenge 1: Select All Customers (returns 5 rows)
SELECT * FROM customers;

-- Challenge 2: Count All Orders (returns 1 row with count)
SELECT COUNT(*) AS total FROM orders;

-- Challenge 3: Filter by Country (returns 3 rows)
SELECT * FROM customers WHERE country = 'Brazil';

-- Challenge 4: Order by Price (returns 10 rows)
SELECT * FROM orders ORDER BY amount DESC;

-- Challenge 5: Total Spent per Customer (returns 5 rows, 2 columns)
SELECT customer_id, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
```

**All solutions work with or without trailing semicolons!**

---

## Breaking Changes

None. All changes are backwards compatible.

---

## Migration Guide

### For Users
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. All your progress is saved in localStorage
3. Try the solution queries again - they should all pass now

### For Developers
No code changes needed. The fixes are automatic.

---

## Known Issues

None at this time.

---

## Future Improvements

Potential enhancements for future releases:

1. **More Packs**: Add intermediate and advanced SQL packs
2. **Hints System**: Progressive hints that reveal more over time
3. **Leaderboard**: Track completion times
4. **Badges**: Achievement system
5. **Dark Mode Toggle**: Manual dark mode switch
6. **Export Results**: Download query results as CSV
7. **Query History**: Save and revisit previous queries
8. **Schema Viewer**: Interactive table schema explorer
9. **Multi-language**: Support for Portuguese, Spanish, etc.
10. **Video Tutorials**: Embedded video explanations

---

## Testing Checklist

- [x] Challenge 1 solution passes all tests
- [x] Challenge 2 solution passes all tests
- [x] Challenge 3 solution passes all tests (updated to 3 rows)
- [x] Challenge 4 solution passes all tests
- [x] Challenge 5 solution passes all tests (fixed column count test)
- [x] Queries work with semicolons
- [x] Queries work without semicolons
- [x] Parquet files load successfully
- [x] UI displays correctly
- [x] Progress tracking works
- [x] Error messages are helpful
- [x] Loading states are smooth

---

## Credits

- **Built by:** Escola de Dados
- **Technologies:** Next.js 15, DuckDB-WASM, Monaco Editor, Tailwind CSS
- **Version:** 1.0.0

---

## Support

If you encounter issues:
1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for troubleshooting
2. Review [SOLUTIONS.md](SOLUTIONS.md) for correct answers
3. Hard refresh your browser
4. Check browser console for errors (F12)
5. Open an issue on GitHub
