---
name: sql-challenge-design
description: Create effective SQL learning challenges and packs for the SQL Learn platform. Use when designing new challenges, creating test assertions, or building challenge packs with datasets. Ensures educational effectiveness and proper technical implementation.
---

# SQL Challenge Design Skill

This skill guides the creation of high-quality SQL challenges that are educational, well-tested, and properly structured for the SQL Learn platform.

## Challenge Pack Structure

### Pack Location
All packs must be in: `/public/packs/<pack_id>/`

### Required Files
```
public/packs/pack_basics/
├── pack.json           # Pack metadata and challenges
├── customers.parquet   # Dataset 1
├── orders.parquet      # Dataset 2
└── products.parquet    # Dataset 3 (if needed)
```

### Pack Registration
After creating a pack, register it in `app/lib/pack.ts`:
```typescript
export async function getAvailablePacks() {
  return [
    { id: "pack_basics", path: "/packs/pack_basics" },
    { id: "your_new_pack", path: "/packs/your_new_pack" },  // Add here
  ];
}
```

## Pack Schema (v1.1/v1.2)

### Basic Pack Structure
```json
{
  "schema_version": "1.2",
  "min_app_version": "1.0.0",
  "id": "pack_advanced_sql",
  "title": "Advanced SQL Techniques",
  "description": "Master complex queries with subqueries, CTEs, and window functions",
  "metadata": {
    "author": "Escola de Dados",
    "locale": "en-US",
    "tags": ["advanced", "subquery", "cte", "window-functions"],
    "difficulty": "advanced",
    "estimatedTimeMinutes": 90,
    "learningObjectives": [
      "Write complex subqueries",
      "Use Common Table Expressions (CTEs)",
      "Apply window functions"
    ]
  },
  "integrity": {
    "algorithm": "sha256",
    "datasets": {
      "sales.parquet": "hash-here",
      "employees.parquet": "hash-here"
    }
  },
  "datasets": [
    { "name": "sales", "src": "sales.parquet" },
    { "name": "employees", "src": "employees.parquet" }
  ],
  "challenges": [
    // Challenge definitions here
  ]
}
```

### Metadata Guidelines

**Difficulty Levels:**
- `beginner`: SELECT, WHERE, basic JOINs, simple aggregations
- `intermediate`: Multiple JOINs, GROUP BY/HAVING, subqueries, CASE
- `advanced`: Window functions, CTEs, complex subqueries, optimization

**Tags for Categorization:**
Use tags that match the category system in `app/packs/[packId]/page.tsx`:
- **Basic Queries**: `select`, `basics`, `where`, `filter`
- **JOINs**: `join`, `inner join`, `left join`, `right join`, `outer join`
- **Advanced Queries**: `subquery`, `case`, `conditional`
- **Aggregations**: `aggregate`, `count`, `group by`, `sum`, `avg`, `having`
- **Sorting**: `order by`, `sorting`

**Estimated Time:**
- Simple queries: 5-10 minutes
- Medium complexity: 10-20 minutes
- Complex challenges: 20-30 minutes

## Challenge Structure

### Complete Challenge Template
```json
{
  "id": "q1_window_functions",
  "title": "Rank Sales by Region",
  "prompt": "Write a query that ranks salespeople by total sales within each region. Include the salesperson name, region, total sales, and their rank within the region.",
  "dialect": "duckdb",
  "hint": "Use the RANK() OVER (PARTITION BY ... ORDER BY ...) window function",
  "solution_sql": "SELECT name, region, SUM(sales) as total_sales, RANK() OVER (PARTITION BY region ORDER BY SUM(sales) DESC) as rank FROM salespeople JOIN sales ON salespeople.id = sales.person_id GROUP BY name, region ORDER BY region, rank",
  "tests": [
    {
      "name": "correct_row_count",
      "assert": "ROWCOUNT",
      "expected": 20
    },
    {
      "name": "correct_schema",
      "assert": "SCHEMA_EQ",
      "schema": [
        { "name": "name", "type": "VARCHAR" },
        { "name": "region", "type": "VARCHAR" },
        { "name": "total_sales", "type": "DOUBLE" },
        { "name": "rank", "type": "BIGINT" }
      ]
    }
  ],
  "limits": {
    "timeout_ms": 1500,
    "row_limit": 1000
  },
  "tags": ["window-functions", "aggregate", "group by"],
  "difficulty": "hard"
}
```

## Writing Effective Prompts

### Prompt Structure
1. **What to do**: Clear task statement
2. **What to include**: Specific columns/calculations required
3. **Constraints**: Filtering, ordering, or grouping requirements
4. **Context**: Why this matters (optional, for motivation)

### Good Prompt Examples

**Good:**
> "Write a query to find all customers who have placed more than 3 orders. Include the customer name, email, and their total order count. Order the results by order count descending."

**Why it's good:**
- Clear task (find customers)
- Specific criteria (>3 orders)
- Exact columns needed
- Ordering specified

**Bad:**
> "Get customers with lots of orders"

**Why it's bad:**
- Vague ("lots" is undefined)
- Missing column specifications
- No ordering guidance

### Difficulty Progression

**Easy Challenge:**
```json
{
  "prompt": "Select all products with price greater than $50. Show the product name and price.",
  "solution_sql": "SELECT name, price FROM products WHERE price > 50"
}
```

**Medium Challenge:**
```json
{
  "prompt": "Find the total revenue by category. Show category name and total revenue, ordered by revenue descending. Only include categories with revenue over $1000.",
  "solution_sql": "SELECT c.name, SUM(o.total) as revenue FROM categories c JOIN products p ON c.id = p.category_id JOIN orders o ON p.id = o.product_id GROUP BY c.name HAVING SUM(o.total) > 1000 ORDER BY revenue DESC"
}
```

**Hard Challenge:**
```json
{
  "prompt": "For each customer, calculate their running total of order amounts ordered by order date. Show customer name, order date, order amount, and running total.",
  "solution_sql": "SELECT c.name, o.order_date, o.amount, SUM(o.amount) OVER (PARTITION BY c.id ORDER BY o.order_date) as running_total FROM customers c JOIN orders o ON c.id = o.customer_id ORDER BY c.name, o.order_date"
}
```

## Test Assertions

### Available Assertion Types

#### 1. ROWCOUNT
Checks the exact number of rows returned.

```json
{
  "name": "returns_10_rows",
  "assert": "ROWCOUNT",
  "expected": 10
}
```

**Use when:** Result size is predictable and important.

#### 2. SQL
Runs SQL assertion against user's query using `{{USER_SQL}}` placeholder.

```json
{
  "name": "total_is_correct",
  "assert": "SQL",
  "sql": "SELECT (SELECT SUM(amount) FROM ({{USER_SQL}}) t) = 5000 AS ok",
  "expected": [{"ok": true}]
}
```

**Use when:** Need to validate calculations, totals, or complex conditions.

#### 3. SCHEMA_EQ
Validates output schema (column names and types).

```json
{
  "name": "correct_columns",
  "assert": "SCHEMA_EQ",
  "schema": [
    { "name": "customer_name", "type": "VARCHAR" },
    { "name": "total_orders", "type": "BIGINT" },
    { "name": "total_spent", "type": "DOUBLE" }
  ]
}
```

**Use when:** Column structure is critical (e.g., for specific calculations).

#### 4. SET_EQ
Compares result sets (order-insensitive).

```json
{
  "name": "correct_results",
  "assert": "SET_EQ",
  "expected": [
    {"name": "Alice", "count": 5},
    {"name": "Bob", "count": 3},
    {"name": "Charlie", "count": 7}
  ]
}
```

**Use when:** Exact results matter but order doesn't.

#### 5. NEAR
Compares numeric values with tolerance.

```json
{
  "name": "average_within_tolerance",
  "assert": "NEAR",
  "expected": [{"avg_price": 49.99}],
  "tolerance": { "abs": 0.01 }
}
```

**Use when:** Dealing with floating-point calculations.

### Test Design Best Practices

1. **Test multiple aspects:**
   - Row count (ROWCOUNT)
   - Schema correctness (SCHEMA_EQ)
   - Data accuracy (SET_EQ or SQL)

2. **Provide clear error messages:**
   - Name tests descriptively: "correct_row_count" not "test1"
   - Test names help learners understand what failed

3. **Progressive testing:**
   - Start with easy tests (row count)
   - Then check schema
   - Finally validate exact results

4. **Avoid brittle tests:**
   - Don't test unnecessary ordering (use SET_EQ)
   - Use NEAR for floats, not exact equality
   - Consider edge cases in your solution

### Example: Comprehensive Test Suite
```json
"tests": [
  {
    "name": "returns_correct_number_of_rows",
    "assert": "ROWCOUNT",
    "expected": 5
  },
  {
    "name": "has_required_columns",
    "assert": "SCHEMA_EQ",
    "schema": [
      { "name": "category", "type": "VARCHAR" },
      { "name": "revenue", "type": "DOUBLE" }
    ]
  },
  {
    "name": "revenue_totals_correct",
    "assert": "SET_EQ",
    "expected": [
      {"category": "Electronics", "revenue": 15000.50},
      {"category": "Books", "revenue": 8500.25},
      {"category": "Clothing", "revenue": 12300.00},
      {"category": "Food", "revenue": 6700.75},
      {"category": "Sports", "revenue": 9400.00}
    ]
  }
]
```

## Creating Datasets

### Using Python + Pandas

```python
import pandas as pd
import numpy as np

# Create sample data
customers = pd.DataFrame({
    "id": range(1, 101),
    "name": [f"Customer {i}" for i in range(1, 101)],
    "email": [f"customer{i}@example.com" for i in range(1, 101)],
    "signup_date": pd.date_range("2023-01-01", periods=100, freq="D"),
    "country": np.random.choice(["USA", "UK", "Canada", "Australia"], 100)
})

# Save as Parquet
customers.to_parquet("public/packs/my_pack/customers.parquet", index=False)
```

### Dataset Design Principles

1. **Realistic but simple:**
   - Use recognizable domains (e-commerce, school, library)
   - Keep data simple enough to understand quickly
   - Include realistic relationships (customers → orders → products)

2. **Appropriate size:**
   - Beginner packs: 10-100 rows per table
   - Intermediate: 100-1000 rows
   - Advanced: 1000-10000 rows (still manageable)

3. **Clear relationships:**
   - Use obvious foreign keys (customer_id, order_id)
   - Include some orphaned records for JOIN practice
   - Create data that makes testing specific scenarios easy

4. **Edge cases:**
   - Include NULLs where appropriate
   - Add duplicates for DISTINCT practice
   - Create ties for ranking exercises
   - Include boundary values (0, negative numbers)

### Example: E-Commerce Dataset

**Customers Table:**
- id, name, email, signup_date, country

**Products Table:**
- id, name, category, price, stock

**Orders Table:**
- id, customer_id, product_id, quantity, order_date, total

**Challenge Ideas:**
- Find customers who never ordered (LEFT JOIN)
- Calculate revenue by category (JOIN + GROUP BY)
- Find products out of stock (WHERE filter)
- Rank top spenders (window functions)

## Hints and Solutions

### Writing Good Hints

**Hint Levels:**

1. **Conceptual hint** (reveal first):
   > "This requires a JOIN between customers and orders tables"

2. **Technical hint** (reveal second):
   > "Use LEFT JOIN to include customers with no orders, then filter where order_id IS NULL"

3. **Near-solution hint** (reveal last):
   > "Start with: SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL"

### Solution SQL Quality

**Requirements:**
- ✅ Must be valid DuckDB SQL
- ✅ Must pass all test assertions
- ✅ Should follow best practices (proper aliases, clear naming)
- ✅ Should be reasonably optimized
- ✅ Should demonstrate the intended learning objective

**Good Solution:**
```sql
SELECT
    c.name,
    c.email,
    COUNT(o.id) as order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email
HAVING COUNT(o.id) > 3
ORDER BY order_count DESC
```

**Why it's good:**
- Clear aliases (c, o)
- Proper grouping (includes all non-aggregated columns)
- Readable formatting
- Correct logic

## Challenge Difficulty Guidelines

### Easy (Difficulty: "easy")
- **Concepts**: SELECT, WHERE, basic filtering, ORDER BY
- **Tables**: Single table queries
- **Time**: 5-10 minutes
- **Example**: "Select all products with price > 50"

### Medium (Difficulty: "medium")
- **Concepts**: JOINs (INNER, LEFT), GROUP BY, HAVING, CASE
- **Tables**: 2-3 tables
- **Time**: 10-20 minutes
- **Example**: "Find categories with total revenue > $1000"

### Hard (Difficulty: "hard")
- **Concepts**: Window functions, CTEs, complex subqueries
- **Tables**: 3+ tables, complex relationships
- **Time**: 20-30 minutes
- **Example**: "Calculate running total by customer over time"

## Pack Creation Workflow

1. **Define learning objectives**
   - What SQL concepts will this pack teach?
   - What's the progression from easy to hard?

2. **Design datasets**
   - What domain makes sense? (e-commerce, school, library, etc.)
   - What tables and relationships are needed?
   - Generate realistic sample data

3. **Create challenges**
   - Start with easiest concept
   - Progress to harder challenges
   - Ensure variety (don't repeat same pattern)

4. **Write tests**
   - Test each challenge thoroughly
   - Include multiple assertion types
   - Verify solution passes all tests

5. **Add hints**
   - Write progressive hints
   - Don't give away the answer too early
   - Include conceptual and technical guidance

6. **Register pack**
   - Add to getAvailablePacks()
   - Test loading in browser
   - Verify all challenges work

## Common Pitfalls to Avoid

### Dataset Issues
❌ Too large (>5MB files, slow loading)
❌ Missing foreign key relationships
❌ Unrealistic data (all perfect, no edge cases)
❌ Inconsistent data types

### Challenge Issues
❌ Vague prompts (unclear requirements)
❌ Impossible challenges (no valid solution)
❌ Missing test assertions
❌ Solution doesn't pass own tests (!!)
❌ Wrong difficulty rating

### Test Issues
❌ Brittle tests (fail on valid solutions)
❌ Only testing one thing (need multiple assertions)
❌ Hardcoded ordering when order shouldn't matter
❌ Poor test names (test1, test2)

## Quality Checklist

Before considering a challenge pack complete:

### Datasets
- [ ] All Parquet files in correct location
- [ ] File sizes under 5MB each
- [ ] Tables have clear relationships
- [ ] Data includes edge cases (NULLs, duplicates)
- [ ] Realistic and understandable domain

### Pack Metadata
- [ ] Correct schema version (1.1 or 1.2)
- [ ] Appropriate difficulty level
- [ ] Accurate estimated time
- [ ] Relevant tags for categorization
- [ ] Clear learning objectives

### Challenges
- [ ] Prompts are clear and specific
- [ ] Difficulty progression (easy → hard)
- [ ] Solution SQL is valid
- [ ] Solution SQL passes all tests
- [ ] Hints are helpful without giving away answer
- [ ] Tags match category system

### Tests
- [ ] Multiple assertion types used
- [ ] Test names are descriptive
- [ ] Edge cases covered
- [ ] Tests are not brittle
- [ ] All challenges have at least 2 tests

### Integration
- [ ] Pack registered in pack.ts
- [ ] Loads without errors
- [ ] All challenges accessible
- [ ] Progress tracking works
- [ ] Mobile responsive

## Examples from Existing Packs

See `/public/packs/pack_basics/pack.json` and `/public/packs/pack_intermediate/pack.json` for complete working examples of well-structured challenge packs.

## When to Use This Skill

Invoke this skill when:
- Creating new SQL challenge packs
- Designing individual challenges
- Writing test assertions for challenges
- Creating datasets for learning
- Debugging pack loading issues
- Improving existing challenges
- Ensuring educational quality
