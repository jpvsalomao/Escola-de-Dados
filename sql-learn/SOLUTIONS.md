# SQL Basics - Challenge Solutions

Quick reference for all challenge solutions in the SQL Basics pack.

## Challenge 1: Select All Customers
```sql
SELECT * FROM customers;
```

## Challenge 2: Count All Orders
```sql
SELECT COUNT(*) AS total FROM orders;
```

## Challenge 3: Filter by Country
```sql
SELECT * FROM customers WHERE country = 'Brazil';
```

## Challenge 4: Order by Price
```sql
SELECT * FROM orders ORDER BY amount DESC;
```

## Challenge 5: Total Spent per Customer
```sql
SELECT customer_id, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
```

---

## Important Notes

- ✅ **Semicolons are optional** - Both `SELECT * FROM customers` and `SELECT * FROM customers;` work
- ✅ **Trailing semicolons are automatically removed** during testing
- ⚠️ **Column aliases must match exactly** (e.g., `total_spent` not `total` or `TotalSpent`)
- ℹ️ **SQL keywords are case-insensitive** (SELECT = select = SeLeCt)
- ⚠️ **Column names and string values ARE case-sensitive**
- ⚠️ **For Challenge 3:** Use `'Brazil'` not `'brazil'`

## Quick Tips

- You can write SQL with or without semicolons - your choice!
- Column aliases matter, so copy them exactly as shown
- String comparisons are case-sensitive
- If a test fails, check the error message for details
