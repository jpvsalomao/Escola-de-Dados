"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveExample } from "@/app/components/concepts/InteractiveExample";
import { CopyButton } from "@/app/components/concepts/CopyButton";
import { whereExamples } from "@/app/lib/concept-examples";

export default function WhereClausePage() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeVisualExample, setActiveVisualExample] = useState(0);

  const examples = [
    {
      title: "Simple Comparison",
      description: "Filter rows using comparison operators",
      sql: "SELECT name, age \nFROM customers \nWHERE age >= 18;",
      result: "Returns only customers who are 18 or older",
    },
    {
      title: "Multiple Conditions (AND)",
      description: "Combine conditions - both must be true",
      sql: "SELECT name, country \nFROM customers \nWHERE age >= 18 AND country = 'USA';",
      result: "Returns only adult customers from the USA",
    },
    {
      title: "Alternative Conditions (OR)",
      description: "Match rows where at least one condition is true",
      sql: "SELECT name, country \nFROM customers \nWHERE country = 'USA' OR country = 'Canada';",
      result: "Returns customers from either USA or Canada",
    },
    {
      title: "Pattern Matching (LIKE)",
      description: "Search for patterns in text using wildcards",
      sql: "SELECT name, email \nFROM customers \nWHERE email LIKE '%@gmail.com';",
      result: "Returns customers with Gmail addresses",
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
            <span className="text-sm text-gray-600">7 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              WHERE - Filtering Data
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to filter database rows using conditions to get exactly the data you need.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* What is WHERE */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is WHERE?</h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                The <code className="px-2 py-1 bg-gray-100 rounded text-teal-600 font-mono text-sm">WHERE</code> clause
                lets you <strong>filter rows</strong> based on specific conditions. Instead of retrieving all rows from a table,
                you only get the ones that match your criteria.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like using a search filter in an online store: "Show me only products under $50 in the Electronics category."
                WHERE does the same thing for database queries.
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
WHERE condition;`} />
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-gray-100 font-mono text-sm whitespace-pre break-words">{`SELECT column1, column2, ...
FROM table_name
WHERE condition;`}</code>
              </pre>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 text-sm">
                <strong>💡 Pro Tip:</strong> WHERE comes after FROM and before ORDER BY or GROUP BY.
                The condition must evaluate to true or false for each row.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">See It In Action</h2>
            <p className="text-gray-600 mb-6">
              Watch how WHERE filters data step by step. Select an example to see the complete flow from input data to filtered results.
            </p>

            {/* Example Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {whereExamples.map((example, idx) => (
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
              <InteractiveExample example={whereExamples[activeVisualExample]} />
            </div>
          </section>

          {/* Comparison Operators */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparison Operators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">=</span>
                  Equal To
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">age = 25</code>
                </div>
                <p className="text-gray-700 text-sm">
                  Exact match. Use single quotes for text: <code className="text-xs bg-gray-100 px-1 rounded break-all">country = 'USA'</code>
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">!=</span>
                  Not Equal To
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">status != 'inactive'</code>
                </div>
                <p className="text-gray-700 text-sm">
                  Excludes rows with the specified value. Can also use <code className="text-xs bg-gray-100 px-1 rounded">&lt;&gt;</code>
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">&gt; &lt;</span>
                  Greater/Less Than
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">price &gt; 100</code>
                </div>
                <p className="text-gray-700 text-sm">
                  Compare numeric values. Also includes <code className="text-xs bg-gray-100 px-1 rounded">&gt;=</code> and <code className="text-xs bg-gray-100 px-1 rounded">&lt;=</code>
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">BETWEEN</span>
                  Range
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">age BETWEEN 18 AND 65</code>
                </div>
                <p className="text-gray-700 text-sm break-words">
                  Inclusive range check. Easier to read than <code className="text-xs bg-gray-100 px-1 rounded">age &gt;= 18 AND age &lt;= 65</code>
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">IN</span>
                  List Match
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">country IN ('USA', 'Canada')</code>
                </div>
                <p className="text-gray-700 text-sm">
                  Matches any value in the list. Cleaner than multiple OR conditions.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">LIKE</span>
                  Pattern Match
                </h3>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">name LIKE 'John%'</code>
                </div>
                <p className="text-gray-700 text-sm">
                  Use <code className="text-xs bg-gray-100 px-1 rounded">%</code> for any characters, <code className="text-xs bg-gray-100 px-1 rounded">_</code> for single character.
                </p>
              </div>
            </div>
          </section>

          {/* Logical Operators */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Combining Conditions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-sm">AND</span>
                  </div>
                  <h3 className="font-bold text-gray-900">AND - Both Must Be True</h3>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    WHERE age &gt;= 18 AND country = 'USA'
                  </code>
                </div>
                <p className="text-gray-700 text-sm">
                  Narrows results. Only rows where ALL conditions are true are returned.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold text-sm">OR</span>
                  </div>
                  <h3 className="font-bold text-gray-900">OR - At Least One Must Be True</h3>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    WHERE country = 'USA' OR country = 'Canada'
                  </code>
                </div>
                <p className="text-gray-700 text-sm">
                  Broadens results. Rows matching ANY condition are returned.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">NOT</span>
                  </div>
                  <h3 className="font-bold text-gray-900">NOT - Negates a Condition</h3>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    WHERE NOT country = 'USA'
                  </code>
                </div>
                <p className="text-gray-700 text-sm">
                  Reverses the condition. Can also use <code className="text-xs bg-gray-100 px-1 rounded">!=</code> or <code className="text-xs bg-gray-100 px-1 rounded">NOT IN</code>
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">( )</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Parentheses - Control Order</h3>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded mb-2 overflow-x-auto">
                  <code className="text-gray-900 text-sm whitespace-nowrap">
                    WHERE (country = 'USA' OR country = 'Canada') AND age &gt;= 18
                  </code>
                </div>
                <p className="text-gray-700 text-sm">
                  Group conditions to control evaluation order. Critical for complex filters!
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Forgetting quotes for text values</p>
                <code className="text-red-700 text-sm font-mono">WHERE country = USA</code>
                <p className="text-red-800 text-sm mt-2">Text values must be in single quotes: <code className="bg-red-100 px-1 rounded text-xs">country = 'USA'</code></p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Using AND when you mean OR</p>
                <code className="text-red-700 text-sm font-mono">WHERE country = 'USA' AND country = 'Canada'</code>
                <p className="text-red-800 text-sm mt-2">A row can't be both! Use OR: <code className="bg-red-100 px-1 rounded text-xs">country = 'USA' OR country = 'Canada'</code></p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Incorrect LIKE wildcards</p>
                <code className="text-red-700 text-sm font-mono">WHERE email LIKE 'gmail.com'</code>
                <p className="text-red-800 text-sm mt-2">Use % wildcard: <code className="bg-red-100 px-1 rounded text-xs">email LIKE '%gmail.com'</code></p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Missing parentheses in complex conditions</p>
                <code className="text-red-700 text-sm font-mono">WHERE age &gt; 18 AND country = 'USA' OR country = 'Canada'</code>
                <p className="text-red-800 text-sm mt-2">Ambiguous! Use parentheses: <code className="bg-red-100 px-1 rounded text-xs">(country = 'USA' OR country = 'Canada') AND age &gt; 18</code></p>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-900 font-medium mb-2">✅ Correct syntax with proper grouping</p>
                <code className="text-emerald-700 text-sm font-mono">WHERE (country IN ('USA', 'Canada')) AND age BETWEEN 18 AND 65</code>
                <p className="text-emerald-800 text-sm mt-2">Clear, readable, and correct!</p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section>
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="mb-6 text-teal-50">
                Now that you understand WHERE clauses, try filtering data in our interactive challenges!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/packs/pack_basics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <span>Try WHERE Challenges</span>
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
