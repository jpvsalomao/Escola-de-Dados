"use client";

import Link from "next/link";
import { useState } from "react";
import { JoinDiagram } from "@/app/components/concepts/JoinDiagram";
import { CopyButton } from "@/app/components/concepts/CopyButton";
import type { SampleTable } from "@/app/lib/concept-examples";

export default function JoinsIntroPage() {
  const [activeExample, setActiveExample] = useState(0);

  // Sample tables for JOIN visualization
  const customersForJoin: SampleTable = {
    name: "customers",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "TEXT" },
    ],
    rows: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Carlos" },
      { id: 4, name: "Diana" },
      { id: 5, name: "Emma" },
    ],
  };

  const ordersForJoin: SampleTable = {
    name: "orders",
    columns: [
      { name: "order_id", type: "INT" },
      { name: "customer_id", type: "INT" },
      { name: "amount", type: "DECIMAL" },
    ],
    rows: [
      { order_id: 101, customer_id: 1, amount: 1200 },
      { order_id: 102, customer_id: 1, amount: 25 },
      { order_id: 103, customer_id: 2, amount: 75 },
      { order_id: 104, customer_id: 3, amount: 350 },
      { order_id: 105, customer_id: 3, amount: 120 },
      { order_id: 106, customer_id: 4, amount: 150 },
      { order_id: 107, customer_id: 99, amount: 500 }, // Orphaned order - no matching customer!
      // Note: Emma (id: 5) has no orders - demonstrates LEFT JOIN
      // Order 107 (customer_id: 99) has no matching customer - demonstrates FULL JOIN
    ],
  };

  const examples = [
    {
      title: "INNER JOIN",
      description: "Return only rows that have matching values in both tables",
      sql: "SELECT customers.name, orders.order_date, orders.amount \nFROM customers \nINNER JOIN orders \n  ON customers.id = orders.customer_id;",
      result: "Shows customers who have placed orders (excludes customers with no orders)",
    },
    {
      title: "LEFT JOIN",
      description: "Return all rows from left table, with matches from right table",
      sql: "SELECT customers.name, orders.amount \nFROM customers \nLEFT JOIN orders \n  ON customers.id = orders.customer_id;",
      result: "Shows ALL customers, even those who haven't placed orders (amount will be NULL)",
    },
    {
      title: "JOIN with WHERE",
      description: "Filter results after joining tables",
      sql: "SELECT c.name, o.amount \nFROM customers c \nINNER JOIN orders o \n  ON c.id = o.customer_id \nWHERE o.amount > 100;",
      result: "Shows customers who placed orders over $100",
    },
    {
      title: "Multiple JOINs",
      description: "Join more than two tables together",
      sql: "SELECT c.name, o.order_date, p.product_name \nFROM customers c \nINNER JOIN orders o ON c.id = o.customer_id \nINNER JOIN products p ON o.product_id = p.id;",
      result: "Shows customer name, order date, and product name by joining 3 tables",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-4 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Concepts
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
              Intermediate
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">12 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Introduction to JOINs
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to combine data from multiple tables based on relationships between them.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* What are JOINs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are JOINs?</h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                <code className="px-2 py-1 bg-gray-100 rounded text-teal-600 font-mono text-sm">JOIN</code> operations
                let you <strong>combine rows from two or more tables</strong> based on a related column between them.
                This is how you work with normalized databases where data is split across multiple tables.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like connecting puzzle pieces: A "customers" table has customer info, and an "orders" table
                has order details. JOINs let you combine them to see "which customer placed which order."
              </p>
            </div>
          </section>

          {/* Why Use JOINs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Do We Need JOINs?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 text-lg">📊</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Data Normalization</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Databases split data into multiple tables to avoid duplication. Instead of storing customer address
                  in every order, we store it once in the customers table and reference it.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 text-lg">🔗</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Relationships</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Tables are connected through foreign keys (like customer_id in orders table references id in customers table).
                  JOINs follow these relationships.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 text-lg">🎯</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Comprehensive Views</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Get complete information by combining related data. For example, see customer name alongside their order
                  history, even though they're in different tables.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">⚡</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Efficient Queries</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  JOINs let you query across multiple tables in a single statement, which is much more efficient than
                  making multiple separate queries.
                </p>
              </div>
            </div>
          </section>

          {/* Basic Syntax */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic JOIN Syntax</h2>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">SQL Syntax</span>
                <CopyButton text={`SELECT table1.column, table2.column
FROM table1
JOIN table2
  ON table1.common_column = table2.common_column;`} />
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-gray-100 font-mono text-sm">{`SELECT table1.column, table2.column
FROM table1
JOIN table2
  ON table1.common_column = table2.common_column;`}</code>
              </pre>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 text-sm">
                <strong>💡 Pro Tip:</strong> The ON clause specifies how tables are related. It's usually matching a
                primary key (id) in one table to a foreign key (customer_id) in another.
              </p>
            </div>
          </section>

          {/* Interactive JOIN Visualizer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualize JOINs</h2>
            <p className="text-gray-600 mb-6">
              See how different JOIN types work! Switch between INNER, LEFT, RIGHT, and FULL OUTER JOINs to understand which rows are included in the result.
            </p>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
              <JoinDiagram
                leftTable={customersForJoin}
                rightTable={ordersForJoin}
                leftJoinColumn="id"
                rightJoinColumn="customer_id"
              />
            </div>

            <div className="mt-4 bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
              <p className="text-teal-900 text-sm mb-2">
                <strong>💡 Key Insights:</strong>
              </p>
              <ul className="text-teal-900 text-sm space-y-1 list-disc list-inside">
                <li><strong>Emma (id: 5)</strong> has no orders - demonstrates LEFT JOIN (includes Emma with NULL)</li>
                <li><strong>Order 107 (customer_id: 99)</strong> has no matching customer - demonstrates FULL JOIN difference</li>
                <li><strong>INNER JOIN</strong> excludes both Emma and order 107</li>
                <li><strong>LEFT JOIN</strong> includes Emma but excludes order 107</li>
                <li><strong>FULL JOIN</strong> includes both Emma and order 107</li>
              </ul>
            </div>
          </section>

          {/* Interactive Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Patterns</h2>

            {/* Example Tabs */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveExample(idx)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all ${
                      activeExample === idx
                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">{examples[activeExample].description}</p>

                {/* SQL Code */}
                <div className="bg-gray-900 rounded-xl overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-mono">SQL Query</span>
                    <CopyButton text={examples[activeExample].sql} />
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-gray-100 font-mono text-sm">{examples[activeExample].sql}</code>
                  </pre>
                </div>

                {/* Result Explanation */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-emerald-900 text-sm">
                      <strong>Result:</strong> {examples[activeExample].result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Types of JOINs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of JOINs</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-teal-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold">⊗</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">INNER JOIN</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Returns only rows where there's a match in <strong>both</strong> tables.
                </p>
                <div className="bg-teal-50 rounded-lg p-3 mb-2">
                  <code className="text-xs font-mono text-teal-900">
                    SELECT * FROM customers INNER JOIN orders ON customers.id = orders.customer_id
                  </code>
                </div>
                <p className="text-gray-600 text-xs">
                  ✅ Use when: You only want rows with matching data on both sides (e.g., customers who have orders)
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-cyan-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold">⊂</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">LEFT JOIN (LEFT OUTER JOIN)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Returns <strong>all rows from the left table</strong>, plus matching rows from the right table.
                  If no match, right side shows NULL.
                </p>
                <div className="bg-cyan-50 rounded-lg p-3 mb-2">
                  <code className="text-xs font-mono text-cyan-900">
                    SELECT * FROM customers LEFT JOIN orders ON customers.id = orders.customer_id
                  </code>
                </div>
                <p className="text-gray-600 text-xs">
                  ✅ Use when: You want all records from the first table, even if they don't have matches (e.g., all customers, including those without orders)
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-indigo-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">⊃</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">RIGHT JOIN (RIGHT OUTER JOIN)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Returns <strong>all rows from the right table</strong>, plus matching rows from the left table.
                  If no match, left side shows NULL. (Less commonly used - can rewrite as LEFT JOIN)
                </p>
                <div className="bg-indigo-50 rounded-lg p-3 mb-2">
                  <code className="text-xs font-mono text-indigo-900">
                    SELECT * FROM orders RIGHT JOIN customers ON orders.customer_id = customers.id
                  </code>
                </div>
                <p className="text-gray-600 text-xs">
                  ✅ Use when: You want all records from the second table (rarely needed - prefer LEFT JOIN with tables swapped)
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">⊎</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">FULL OUTER JOIN</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Returns <strong>all rows from both tables</strong>. Where there's a match, combines them.
                  Where there's no match, shows NULL on the missing side.
                </p>
                <div className="bg-purple-50 rounded-lg p-3 mb-2">
                  <code className="text-xs font-mono text-purple-900">
                    SELECT * FROM customers FULL OUTER JOIN orders ON customers.id = orders.customer_id
                  </code>
                </div>
                <p className="text-gray-600 text-xs">
                  ✅ Use when: You want all records from both tables (e.g., all customers AND all orders, even orphaned ones)
                </p>
              </div>
            </div>
          </section>

          {/* Table Aliases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Table Aliases & Best Practices</h2>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Using Table Aliases</h3>
              <p className="text-gray-700 text-sm mb-4">
                Table aliases make JOINs more readable by shortening table names:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">❌ Without aliases (verbose):</p>
                  <div className="bg-gray-100 rounded p-3">
                    <code className="text-xs font-mono text-gray-900">
                      SELECT customers.name, orders.amount<br />
                      FROM customers<br />
                      JOIN orders<br />
                      ON customers.id = orders.customer_id
                    </code>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">✅ With aliases (clean):</p>
                  <div className="bg-emerald-50 rounded p-3">
                    <code className="text-xs font-mono text-emerald-900">
                      SELECT c.name, o.amount<br />
                      FROM customers c<br />
                      JOIN orders o<br />
                      ON c.id = o.customer_id
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">USING Clause Shortcut</h3>
              <p className="text-gray-700 text-sm mb-4">
                When the join column has the <strong>same name</strong> in both tables, you can use USING instead of ON:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">Standard ON syntax:</p>
                  <div className="bg-gray-100 rounded p-3">
                    <code className="text-xs font-mono text-gray-900">
                      JOIN orders<br />
                      ON customers.customer_id = orders.customer_id
                    </code>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">Shorter USING syntax:</p>
                  <div className="bg-emerald-50 rounded p-3">
                    <code className="text-xs font-mono text-emerald-900">
                      JOIN orders<br />
                      USING (customer_id)
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Forgetting the ON clause</p>
                <code className="text-red-700 text-sm font-mono">SELECT * FROM customers JOIN orders;</code>
                <p className="text-red-800 text-sm mt-2">
                  This creates a CROSS JOIN (every customer paired with every order)! Add: <code className="bg-red-100 px-1 rounded text-xs">ON customers.id = orders.customer_id</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Ambiguous column names</p>
                <code className="text-red-700 text-sm font-mono">SELECT id FROM customers JOIN orders ON ...</code>
                <p className="text-red-800 text-sm mt-2">
                  Both tables have `id`! Specify: <code className="bg-red-100 px-1 rounded text-xs">customers.id</code> or <code className="bg-red-100 px-1 rounded text-xs">orders.id</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Using INNER JOIN when you need LEFT JOIN</p>
                <code className="text-red-700 text-sm font-mono">INNER JOIN -- Excludes customers without orders!</code>
                <p className="text-red-800 text-sm mt-2">
                  If you want ALL customers: <code className="bg-red-100 px-1 rounded text-xs">LEFT JOIN orders</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Wrong join condition</p>
                <code className="text-red-700 text-sm font-mono">ON customers.name = orders.customer_name</code>
                <p className="text-red-800 text-sm mt-2">
                  Join on IDs, not names! Names can be duplicated or misspelled: <code className="bg-red-100 px-1 rounded text-xs">ON customers.id = orders.customer_id</code>
                </p>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-900 font-medium mb-2">✅ Correct JOIN with aliases and proper ON clause</p>
                <code className="text-emerald-700 text-sm font-mono">
                  SELECT c.name, o.amount, o.order_date FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.amount &gt; 100;
                </code>
                <p className="text-emerald-800 text-sm mt-2">Perfect! Clear aliases, correct join type, proper ON clause, additional WHERE filter.</p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section>
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="mb-6 text-teal-50">
                Now that you understand JOINs, try combining tables in our interactive challenges!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/packs/pack_basics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <span>Try JOIN Challenges</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/concepts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-all"
                >
                  <span>Back to All Concepts</span>
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
