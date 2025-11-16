"use client";

import Link from "next/link";

interface ConceptCategory {
  title: string;
  description: string;
  concepts: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }>;
}

const categories: ConceptCategory[] = [
  {
    title: "Fundamentals",
    description: "Essential SQL concepts every beginner should know",
    concepts: [
      {
        id: "select-basics",
        title: "SELECT - Retrieving Data",
        description: "Learn how to query data from tables using SELECT statements",
        difficulty: "beginner",
      },
      {
        id: "where-clause",
        title: "WHERE - Filtering Data",
        description: "Filter rows based on conditions to get exactly what you need",
        difficulty: "beginner",
      },
      {
        id: "order-by",
        title: "ORDER BY - Sorting Results",
        description: "Sort your query results in ascending or descending order",
        difficulty: "beginner",
      },
    ],
  },
  {
    title: "Aggregation & Grouping",
    description: "Summarize and analyze data with aggregate functions",
    concepts: [
      {
        id: "group-by",
        title: "GROUP BY - Grouping & Aggregation",
        description: "Learn aggregate functions (COUNT, SUM, AVG) and how to group data",
        difficulty: "intermediate",
      },
    ],
  },
  {
    title: "Combining Data",
    description: "Work with multiple tables using JOINs",
    concepts: [
      {
        id: "joins-intro",
        title: "Introduction to JOINs",
        description: "Combine data from multiple tables based on relationships",
        difficulty: "intermediate",
      },
    ],
  },
];

const difficultyColors = {
  beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
  intermediate: "bg-amber-100 text-amber-800 border-amber-200",
  advanced: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function ConceptsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-4 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              SQL Concepts
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Learn SQL concepts with clear explanations, examples, and interactive demonstrations.
            Master the fundamentals before diving into challenges.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category.title}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.concepts.map((concept) => (
                  <Link
                    key={concept.id}
                    href={`/concepts/${concept.id}`}
                    className="block group"
                  >
                    <article className="h-full bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 text-teal-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                            difficultyColors[concept.difficulty]
                          }`}
                        >
                          {concept.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {concept.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {concept.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-teal-600 font-medium text-sm">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-white rounded-2xl border-2 border-teal-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Practice?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Now that you understand the concepts, try applying them in our interactive challenges.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Browse Challenge Packs</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
