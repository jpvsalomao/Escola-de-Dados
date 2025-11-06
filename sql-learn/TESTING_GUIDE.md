# SQL Learn - Testing Guide

This guide helps verify that all challenges work correctly with their solution queries.

## Challenge Solutions & Expected Results

### Challenge 1: Select All Customers (q1_select_all)

**Prompt:** Write a query to retrieve all columns from the customers table.

**Solution:**
```sql
SELECT * FROM customers;
```

**Expected Result:**
- Should return **5 rows**
- All columns from customers table

**Tests:**
- ✓ returns_all_rows: Must return exactly 5 rows

---

### Challenge 2: Count All Orders (q2_count_orders)

**Prompt:** Write a query to count the total number of orders.

**Solution:**
```sql
SELECT COUNT(*) AS total FROM orders;
```

**Expected Result:**
- Should return **1 row**
- With a column showing the total count of orders

**Tests:**
- ✓ row_count_is_one: Must return exactly 1 row
- ✓ total_equals_10: The result must have exactly 1 row (validates it's an aggregate query)

---

### Challenge 3: Filter by Country (q3_filter_country)

**Prompt:** Find all customers from Brazil (country = 'Brazil').

**Solution:**
```sql
SELECT * FROM customers WHERE country = 'Brazil';
```

**Expected Result:**
- Should return **3 rows**
- Only customers where country = 'Brazil'
- Customers: Ana Silva, João Santos, Carla Souza

**Tests:**
- ✓ returns_three_rows: Must return exactly 3 rows

---

### Challenge 4: Order by Price (q4_order_by_price)

**Prompt:** List all orders sorted by amount in descending order.

**Solution:**
```sql
SELECT * FROM orders ORDER BY amount DESC;
```

**Expected Result:**
- Should return **10 rows**
- Sorted by amount column in descending order (highest first)

**Tests:**
- ✓ returns_all_orders: Must return exactly 10 rows
- ✓ first_row_has_max_amount: The first row's amount must equal the maximum amount in the orders table

---

### Challenge 5: Total Spent per Customer (q5_group_by_customer)

**Prompt:** Calculate the total amount spent by each customer. Return customer_id and total_spent.

**Solution:**
```sql
SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY customer_id;
```

**Expected Result:**
- Should return **5 rows** (one per customer)
- Must have exactly **2 columns**: customer_id and total_spent
- Sorted by customer_id

**Tests:**
- ✓ returns_correct_number_of_customers: Must return exactly 5 rows
- ✓ has_correct_columns: Must have exactly 2 columns

---

## Common Issues & Troubleshooting

### Issue: "Tests not passing even with the solution query"

**Possible Causes:**

1. **Case sensitivity in column names**
   - For Challenge 5, make sure to use `total_spent` (lowercase with underscore)
   - Column aliases matter!

2. **Semicolons are now handled automatically**
   - ✅ Both `SELECT * FROM customers` and `SELECT * FROM customers;` work correctly
   - The system automatically removes trailing semicolons before testing
   - You can use semicolons if you prefer - they won't cause test failures

3. **Data not loaded**
   - Refresh the page to ensure datasets are loaded
   - Check browser console for errors about parquet files

4. **Browser cache issues**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache

### Issue: "IO Error: No files found that match the pattern"

This was fixed by:
- Moving pack files to `/public/packs/` directory
- Updating the parquet file loading to fetch via HTTP and register buffers

### Issue: "Query timeout"

- Default timeout is 1500ms
- Complex queries on larger datasets might timeout
- Simplify your query or check for infinite loops

---

## Data Schema

### Customers Table
Expected columns:
- `customer_id` (INTEGER)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `country` (VARCHAR)

Expected rows: **5 customers**
Brazil customers: **3 customers** (Ana Silva, João Santos, Carla Souza)

### Orders Table
Expected columns:
- `order_id` (INTEGER)
- `customer_id` (INTEGER)
- `amount` (DECIMAL/DOUBLE)
- `order_date` (DATE)

Expected rows: **10 orders**
Unique customers with orders: **5 customers**

---

## How to Test

### Manual Testing

1. **Go to the challenge page**
2. **Copy the solution SQL** from this guide
3. **Paste into the SQL editor**
4. **Click "Submit Answer"**
5. **Verify all tests pass** (should show green checkmarks)

### Testing Each Challenge

```bash
# Challenge 1
SELECT * FROM customers;

# Challenge 2
SELECT COUNT(*) AS total FROM orders;

# Challenge 3
SELECT * FROM customers WHERE country = 'Brazil';

# Challenge 4
SELECT * FROM orders ORDER BY amount DESC;

# Challenge 5
SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY customer_id;
```

---

## Recent Fixes

### 2025-01-05: Fixed semicolon handling

**Problem:** Queries with trailing semicolons (e.g., `SELECT * FROM customers;`) were failing tests because the semicolon was included when the query was used in subqueries for testing.

**Solution:** The grader now automatically normalizes SQL queries:
- Trims leading/trailing whitespace
- Removes trailing semicolons (one or more)
- Tests work correctly whether you use semicolons or not

### 2025-01-05: Fixed q5_group_by_customer test

**Problem:** The `has_correct_columns` test was using invalid SQL:
```sql
SELECT COUNT(*) = 2 AS ok FROM (SELECT * FROM information_schema.columns WHERE table_name IN (SELECT table_name FROM information_schema.tables WHERE sql LIKE '%USER_SQL%'))
```

**Solution:** Updated to use DESCRIBE:
```sql
SELECT COUNT(DISTINCT column_name) = 2 AS ok FROM (DESCRIBE ({{USER_SQL}}))
```

This properly counts the number of columns in the user's query result.

---

## Debugging Tips

1. **Use "Run Query" first** before "Submit Answer" to see your results
2. **Check the error message** - it usually tells you what's wrong
3. **Compare your results** with the expected row count
4. **Check column names** - aliases must match exactly
5. **Look at the test details** when submission fails

---

## Need Help?

If a solution query from this guide doesn't pass:

1. Check the browser console for errors (F12)
2. Verify the pack.json file hasn't been modified
3. Ensure public/packs/pack_basics/ contains the parquet files
4. Try refreshing the page
5. Check if DuckDB-WASM initialized properly (first query might be slow)
