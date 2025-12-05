"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveExample } from "@/app/components/concepts/InteractiveExample";
import { CopyButton } from "@/app/components/concepts/CopyButton";
import { groupByExamples } from "@/app/lib/concept-examples";

export default function GroupByPage() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeVisualExample, setActiveVisualExample] = useState(0);

  const examples = [
    {
      title: "COUNT by Category",
      description: "Count how many rows exist in each group",
      sql: "SELECT country, COUNT(*) AS customer_count \nFROM customers \nGROUP BY country;",
      result: "Shows number of customers per country: USA: 45, Canada: 23, UK: 17...",
    },
    {
      title: "SUM by Group",
      description: "Calculate totals for each group",
      sql: "SELECT customer_id, SUM(amount) AS total_spent \nFROM orders \nGROUP BY customer_id;",
      result: "Shows total amount spent by each customer",
    },
    {
      title: "AVG with Multiple Aggregates",
      description: "Calculate multiple statistics per group",
      sql: "SELECT category, \n       COUNT(*) AS product_count,\n       AVG(price) AS avg_price,\n       MAX(price) AS max_price \nFROM products \nGROUP BY category;",
      result: "Shows count, average price, and highest price per category",
    },
    {
      title: "HAVING Clause",
      description: "Filter groups after aggregation",
      sql: "SELECT country, COUNT(*) AS customer_count \nFROM customers \nGROUP BY country \nHAVING COUNT(*) > 10;",
      result: "Only shows countries with more than 10 customers",
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
            <span className="text-sm text-gray-600">10 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              GROUP BY - Grouping & Aggregation
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to group rows and calculate summary statistics using aggregate functions.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* What is GROUP BY */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GROUP BY?</h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                The <code className="px-2 py-1 bg-gray-100 rounded text-teal-600 font-mono text-sm">GROUP BY</code> clause
                groups rows that share the same values into <strong>summary rows</strong>. It's used with
                <strong> aggregate functions</strong> like COUNT, SUM, AVG to calculate statistics for each group.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like organizing students by grade level and calculating the average test score for each grade.
                GROUP BY does the grouping, and aggregate functions do the calculations.
              </p>
            </div>
          </section>

          {/* Basic Syntax */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Syntax</h2>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">SQL Syntax</span>
                <CopyButton text={`SELECT column_name, AGGREGATE_FUNCTION(column)
FROM table_name
WHERE condition
GROUP BY column_name
HAVING group_condition
ORDER BY column_name;`} />
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-gray-100 font-mono text-sm">{`SELECT column_name, AGGREGATE_FUNCTION(column)
FROM table_name
WHERE condition
GROUP BY column_name
HAVING group_condition
ORDER BY column_name;`}</code>
              </pre>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 text-sm">
                <strong>💡 Pro Tip:</strong> Every column in SELECT that's not inside an aggregate function
                must appear in GROUP BY. This is SQL's "grouping rule."
              </p>
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

          {/* Visual Interactive Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">See Aggregation In Action</h2>
            <p className="text-gray-700 mb-6">
              Watch how GROUP BY transforms raw data into summary statistics step by step.
            </p>

            {/* Example Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {groupByExamples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVisualExample(idx)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeVisualExample === idx
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Interactive Visual Example */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
              <InteractiveExample example={groupByExamples[activeVisualExample]} />
            </div>
          </section>

          {/* Aggregate Functions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aggregate Functions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-sm">#</span>
                  </div>
                  <h3 className="font-bold text-gray-900">COUNT()</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Counts the number of rows in each group.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">COUNT(*)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  Use COUNT(*) for all rows, COUNT(column) to exclude NULLs
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">Σ</span>
                  </div>
                  <h3 className="font-bold text-gray-900">SUM()</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Adds up all values in a numeric column.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">SUM(amount)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  Only works with numeric columns
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">x̄</span>
                  </div>
                  <h3 className="font-bold text-gray-900">AVG()</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Calculates the average (mean) of numeric values.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">AVG(price)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  NULL values are excluded from calculation
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">↑</span>
                  </div>
                  <h3 className="font-bold text-gray-900">MAX()</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Finds the largest value in each group.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">MAX(salary)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  Works with numbers, text (alphabetically), and dates
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-sm">↓</span>
                  </div>
                  <h3 className="font-bold text-gray-900">MIN()</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Finds the smallest value in each group.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">MIN(price)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  Works with numbers, text (alphabetically), and dates
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">∑</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Multiple Aggregates</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  Combine multiple functions in one query.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">COUNT(*), AVG(price), MAX(price)</code>
                </div>
                <p className="text-gray-600 text-xs">
                  Get comprehensive statistics in a single query
                </p>
              </div>
            </div>
          </section>

          {/* WHERE vs HAVING */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">WHERE vs HAVING</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-teal-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-sm">W</span>
                  </div>
                  <h3 className="font-bold text-gray-900">WHERE</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Filters individual rows</strong> BEFORE grouping happens.
                </p>
                <div className="bg-teal-50 rounded-lg p-3 mb-3">
                  <code className="text-xs font-mono text-teal-900">
                    WHERE price &gt; 100
                  </code>
                </div>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Applied before GROUP BY</li>
                  <li>Cannot use aggregate functions</li>
                  <li>Filters rows</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border-2 border-cyan-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">H</span>
                  </div>
                  <h3 className="font-bold text-gray-900">HAVING</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  <strong>Filters groups</strong> AFTER aggregation is done.
                </p>
                <div className="bg-cyan-50 rounded-lg p-3 mb-3">
                  <code className="text-xs font-mono text-cyan-900">
                    HAVING COUNT(*) &gt; 10
                  </code>
                </div>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Applied after GROUP BY</li>
                  <li>Can use aggregate functions</li>
                  <li>Filters groups</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl border-2 border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-3">Complete Example Using Both</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs text-gray-400 font-mono">WHERE & HAVING Example</span>
                  <CopyButton text={`SELECT country, COUNT(*) AS customer_count, AVG(age) AS avg_age
FROM customers
WHERE age >= 18                    -- Filter rows: only adults
GROUP BY country                   -- Group by country
HAVING COUNT(*) > 5                -- Filter groups: only countries with 5+ customers
ORDER BY customer_count DESC;      -- Sort results`} />
                </div>
                <pre className="p-4">
                  <code className="text-gray-100 font-mono text-xs">{`SELECT country, COUNT(*) AS customer_count, AVG(age) AS avg_age
FROM customers
WHERE age >= 18                    -- Filter rows: only adults
GROUP BY country                   -- Group by country
HAVING COUNT(*) > 5                -- Filter groups: only countries with 5+ customers
ORDER BY customer_count DESC;      -- Sort results`}</code>
                </pre>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                This query finds countries with 5+ adult customers and shows their average age, sorted by customer count.
              </p>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Column not in GROUP BY</p>
                <code className="text-red-700 text-sm font-mono">SELECT country, name, COUNT(*) FROM customers GROUP BY country;</code>
                <p className="text-red-800 text-sm mt-2">
                  `name` isn't in GROUP BY and isn't aggregated. SQL doesn't know which name to show per country!
                  Remove `name` or add it to GROUP BY.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Using aggregate in WHERE instead of HAVING</p>
                <code className="text-red-700 text-sm font-mono">WHERE COUNT(*) &gt; 10</code>
                <p className="text-red-800 text-sm mt-2">
                  WHERE can't use aggregates! Use: <code className="bg-red-100 px-1 rounded text-xs">HAVING COUNT(*) &gt; 10</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Forgetting GROUP BY entirely</p>
                <code className="text-red-700 text-sm font-mono">SELECT country, COUNT(*) FROM customers;</code>
                <p className="text-red-800 text-sm mt-2">
                  Mixing non-aggregate column (country) with aggregate (COUNT). Need: <code className="bg-red-100 px-1 rounded text-xs">GROUP BY country</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ COUNT(*) vs COUNT(column) confusion</p>
                <code className="text-red-700 text-sm font-mono">COUNT(email) -- Excludes rows where email is NULL</code>
                <p className="text-red-800 text-sm mt-2">
                  If you want all rows: <code className="bg-red-100 px-1 rounded text-xs">COUNT(*)</code>. Use COUNT(column) only when you want to exclude NULLs.
                </p>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-900 font-medium mb-2">✅ Correct GROUP BY with multiple aggregates</p>
                <code className="text-emerald-700 text-sm font-mono">
                  SELECT category, COUNT(*) AS products, AVG(price) AS avg_price FROM products WHERE price &gt; 0 GROUP BY category HAVING COUNT(*) &gt; 3;
                </code>
                <p className="text-emerald-800 text-sm mt-2">Perfect! All non-aggregate columns in GROUP BY, WHERE filters rows, HAVING filters groups.</p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section>
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="mb-6 text-teal-50">
                Now that you understand GROUP BY and aggregation, try summarizing data in our interactive challenges!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/packs/pack_basics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <span>Try GROUP BY Challenges</span>
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
