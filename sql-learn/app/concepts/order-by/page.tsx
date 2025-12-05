"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveExample } from "@/app/components/concepts/InteractiveExample";
import { CopyButton } from "@/app/components/concepts/CopyButton";
import { orderByExamples } from "@/app/lib/concept-examples";

export default function OrderByPage() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeVisualExample, setActiveVisualExample] = useState(0);

  const examples = [
    {
      title: "Sort Ascending",
      description: "Sort results from lowest to highest (default)",
      sql: "SELECT name, age \nFROM customers \nORDER BY age ASC;",
      result: "Shows youngest customers first (18, 25, 30, 45...)",
    },
    {
      title: "Sort Descending",
      description: "Sort results from highest to lowest",
      sql: "SELECT name, price \nFROM products \nORDER BY price DESC;",
      result: "Shows most expensive products first",
    },
    {
      title: "Multiple Columns",
      description: "Sort by one column, then another for ties",
      sql: "SELECT name, country, age \nFROM customers \nORDER BY country ASC, age DESC;",
      result: "Groups by country alphabetically, then oldest first within each country",
    },
    {
      title: "Sort by Expression",
      description: "Sort by calculated values",
      sql: "SELECT name, price, quantity,\n       price * quantity AS total \nFROM orders \nORDER BY price * quantity DESC;",
      result: "Shows highest-value orders first",
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
            <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">
              Beginner
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">5 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              ORDER BY - Sorting Results
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to sort query results in ascending or descending order for better data presentation.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* What is ORDER BY */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is ORDER BY?</h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                The <code className="px-2 py-1 bg-gray-100 rounded text-teal-600 font-mono text-sm">ORDER BY</code> clause
                lets you <strong>sort query results</strong> based on one or more columns. Without it, rows are returned in an
                unpredictable order.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like sorting products on Amazon by price or rating. ORDER BY does the same for your database
                queries, making data easier to analyze and present.
              </p>
            </div>
          </section>

          {/* Basic Syntax */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Syntax</h2>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">SQL Syntax</span>
                <CopyButton text={`SELECT column1, column2, ...
FROM table_name
ORDER BY column_name [ASC|DESC];`} />
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-gray-100 font-mono text-sm">{`SELECT column1, column2, ...
FROM table_name
ORDER BY column_name [ASC|DESC];`}</code>
              </pre>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 text-sm">
                <strong>💡 Pro Tip:</strong> ORDER BY is the last clause in a SELECT statement (after WHERE and GROUP BY).
                ASC (ascending) is the default and can be omitted.
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

          {/* Visual Sorting Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">See Sorting In Action</h2>
            <p className="text-gray-600 mb-6">
              Watch how ORDER BY transforms data! See the before and after states to understand how sorting works.
            </p>

            {/* Example Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {orderByExamples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVisualExample(idx)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeVisualExample === idx
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Interactive Visual Example */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
              <InteractiveExample example={orderByExamples[activeVisualExample]} />
            </div>
          </section>

          {/* Key Concepts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-sm">ASC</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Ascending Order</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sorts from smallest to largest (A→Z, 0→9, oldest→newest).
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">ORDER BY price ASC</code>
                </div>
                <p className="text-gray-600 text-xs mt-2">This is the default - you can omit ASC</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">DESC</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Descending Order</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sorts from largest to smallest (Z→A, 9→0, newest→oldest).
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">ORDER BY price DESC</code>
                </div>
                <p className="text-gray-600 text-xs mt-2">Must explicitly specify DESC</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">1,2</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Multiple Columns</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sort by first column, then use second column to break ties.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">ORDER BY country, age DESC</code>
                </div>
                <p className="text-gray-600 text-xs mt-2">Can mix ASC and DESC</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold">NULL</span>
                  </div>
                  <h3 className="font-bold text-gray-900">NULL Handling</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  NULL values typically appear last in ASC, first in DESC.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-xs whitespace-nowrap">ORDER BY last_login DESC</code>
                </div>
                <p className="text-gray-600 text-xs mt-2">Behavior varies by database</p>
              </div>
            </div>
          </section>

          {/* Sorting Different Data Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sorting Different Data Types</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-lg">123</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Numbers</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sorted numerically: 1, 2, 10, 20, 100 (not alphabetically)
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    SELECT * FROM products ORDER BY price DESC;
                  </code>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-lg">ABC</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Text (Strings)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sorted alphabetically. Case-sensitivity depends on database settings.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    SELECT * FROM customers ORDER BY name ASC;
                  </code>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">📅</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Dates & Times</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  Sorted chronologically. Older dates come first in ASC.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    SELECT * FROM orders ORDER BY order_date DESC; -- Most recent first
                  </code>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">✓/✗</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Booleans</h3>
                </div>
                <p className="text-gray-700 text-sm mb-2 break-words">
                  False (0) before True (1) in ASC order.
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    SELECT * FROM tasks ORDER BY completed ASC; -- Incomplete tasks first
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Ordering by column not in SELECT</p>
                <code className="text-red-700 text-sm font-mono">SELECT name FROM customers ORDER BY age;</code>
                <p className="text-red-800 text-sm mt-2">
                  While often allowed, it's confusing. Better to include it: <code className="bg-red-100 px-1 rounded text-xs">SELECT name, age FROM customers ORDER BY age</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Forgetting DESC for reverse order</p>
                <code className="text-red-700 text-sm font-mono">SELECT * FROM products ORDER BY price; -- Shows cheapest first!</code>
                <p className="text-red-800 text-sm mt-2">
                  Default is ASC. For expensive-first: <code className="bg-red-100 px-1 rounded text-xs">ORDER BY price DESC</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Wrong order in multi-column sort</p>
                <code className="text-red-700 text-sm font-mono">ORDER BY age, country -- Groups by age, then country</code>
                <p className="text-red-800 text-sm mt-2">
                  Order matters! For country grouping: <code className="bg-red-100 px-1 rounded text-xs">ORDER BY country, age</code>
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Using ORDER BY before WHERE</p>
                <code className="text-red-700 text-sm font-mono">SELECT * FROM customers ORDER BY age WHERE country = 'USA';</code>
                <p className="text-red-800 text-sm mt-2">
                  Wrong clause order! Correct: <code className="bg-red-100 px-1 rounded text-xs">WHERE country = 'USA' ORDER BY age</code>
                </p>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-900 font-medium mb-2">✅ Correct multi-column sort with mixed directions</p>
                <code className="text-emerald-700 text-sm font-mono">SELECT name, country, age FROM customers WHERE age &gt;= 18 ORDER BY country ASC, age DESC;</code>
                <p className="text-emerald-800 text-sm mt-2">Perfect! Groups by country alphabetically, oldest first within each.</p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section>
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="mb-6 text-teal-50">
                Now that you understand ORDER BY, try sorting data in our interactive challenges!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/packs/pack_basics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <span>Try ORDER BY Challenges</span>
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
