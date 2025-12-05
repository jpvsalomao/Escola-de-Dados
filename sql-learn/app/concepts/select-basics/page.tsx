"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveExample } from "@/app/components/concepts/InteractiveExample";
import { selectExamples } from "@/app/lib/concept-examples";

export default function SelectBasicsPage() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeVisualExample, setActiveVisualExample] = useState(0);

  const examples = [
    {
      title: "Select All Columns",
      description: "Use * to retrieve all columns from a table",
      sql: "SELECT * FROM customers;",
      result: "Returns all columns: id, name, email, country, etc.",
    },
    {
      title: "Select Specific Columns",
      description: "Specify exactly which columns you want",
      sql: "SELECT name, email FROM customers;",
      result: "Returns only the name and email columns",
    },
    {
      title: "Select with Column Aliases",
      description: "Rename columns in the output using AS",
      sql: "SELECT name AS customer_name, \n       email AS contact_email \nFROM customers;",
      result: "Columns are renamed to customer_name and contact_email",
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
              SELECT - Retrieving Data
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to query and retrieve data from database tables using the SELECT statement.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* What is SELECT */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is SELECT?</h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                <code className="px-2 py-1 bg-gray-100 rounded text-teal-600 font-mono text-sm">SELECT</code> is the most fundamental SQL command.
                It allows you to <strong>retrieve data</strong> from one or more tables in your database.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Think of it like asking a question to your database: "Show me this information from that table."
                Every data retrieval operation in SQL starts with SELECT.
              </p>
            </div>
          </section>

          {/* Basic Syntax */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Syntax</h2>
            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
              <pre className="text-gray-100 font-mono text-sm">
                <code>{`SELECT column1, column2, ...
FROM table_name;`}</code>
              </pre>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-900 text-sm">
                <strong>💡 Pro Tip:</strong> SQL keywords like SELECT and FROM are not case-sensitive,
                but it's common practice to write them in UPPERCASE for readability.
              </p>
            </div>
          </section>

          {/* Interactive Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Patterns</h2>

            {/* Example Tabs */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveExample(idx)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeExample === idx
                        ? "bg-white text-teal-600 border-b-2 border-teal-600"
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
                <div className="bg-gray-900 rounded-xl p-4 mb-4">
                  <pre className="text-gray-100 font-mono text-sm">
                    <code>{examples[activeExample].sql}</code>
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
            <p className="text-gray-700 mb-6">
              Watch how SELECT retrieves and transforms data step by step.
            </p>

            {/* Example Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectExamples.map((example, idx) => (
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
              <InteractiveExample example={selectExamples[activeVisualExample]} />
            </div>
          </section>

          {/* Key Concepts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold">*</span>
                  </div>
                  <h3 className="font-bold text-gray-900">The Asterisk (*)</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Using <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">*</code> selects ALL columns.
                  Great for exploration, but specify columns in production for better performance.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-bold">AS</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Column Aliases</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Use <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">AS</code> to rename columns in your output.
                  Makes results more readable and meaningful.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">,</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Multiple Columns</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Separate column names with commas to select multiple specific columns.
                  Order matters - columns appear in the order you list them.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold">;</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Semicolon</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  End your SQL statements with a semicolon <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">;</code>
                  It's required in most databases and is considered best practice.
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Missing FROM clause</p>
                <code className="text-red-700 text-sm font-mono">SELECT name, email;</code>
                <p className="text-red-800 text-sm mt-2">You must specify which table to select from!</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-900 font-medium mb-2">❌ Missing commas between columns</p>
                <code className="text-red-700 text-sm font-mono">SELECT name email FROM customers;</code>
                <p className="text-red-800 text-sm mt-2">Always separate column names with commas!</p>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-900 font-medium mb-2">✅ Correct syntax</p>
                <code className="text-emerald-700 text-sm font-mono">SELECT name, email FROM customers;</code>
                <p className="text-emerald-800 text-sm mt-2">Perfect! All elements in place.</p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section>
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="mb-6 text-teal-50">
                Now that you understand SELECT, try it out in our interactive challenges!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/packs/pack_basics"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <span>Try SELECT Challenges</span>
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
