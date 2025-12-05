import type { Challenge } from "./types";

// Skill group definition with curated content
export interface SkillCategory {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  matchPatterns: string[];
  patterns: PatternDefinition[];
}

export interface PatternDefinition {
  name: string;
  formula?: string;
  useFor: string;
  pitfall?: string;
}

// Curated cheatsheet content organized by skill category
export const CHEATSHEET_CATEGORIES: SkillCategory[] = [
  {
    id: "aggregation",
    title: "Aggregation & Counting",
    shortTitle: "Aggregation",
    icon: "calculator",
    description: "GROUP BY, HAVING, conditional counts",
    matchPatterns: ["Aggregation", "COUNT", "HAVING", "First Value", "Conditional Counting"],
    patterns: [
      {
        name: "HAVING vs WHERE",
        formula: "WHERE filters rows → GROUP BY → HAVING filters groups",
        useFor: "Filter groups after aggregation (e.g., 'users with 2+ posts')",
        pitfall: "WHERE can't use aggregate functions; HAVING can",
      },
      {
        name: "Conditional Counting",
        formula: "SUM(CASE WHEN condition THEN 1 ELSE 0 END)",
        useFor: "Count subsets within groups (CTR, conversion rates)",
        pitfall: "Remember ELSE 0, not ELSE NULL",
      },
      {
        name: "COUNT DISTINCT",
        formula: "COUNT(DISTINCT column)",
        useFor: "Unique values (distinct users, unique days)",
        pitfall: "NULL values are not counted",
      },
      {
        name: "First/Last Values",
        formula: "MIN(date) = first, MAX(date) = last",
        useFor: "Find earliest/latest records per group",
      },
    ],
  },
  {
    id: "joins",
    title: "Join Patterns",
    shortTitle: "Joins",
    icon: "link",
    description: "Anti-joins, self-joins, graph queries",
    matchPatterns: ["Anti-Join", "Self-Join", "Graph Query"],
    patterns: [
      {
        name: "Anti-Join (Find Missing)",
        formula: "LEFT JOIN ... WHERE right.key IS NULL",
        useFor: "Find what's NOT in another table (pages with no likes)",
        pitfall: "NOT IN has NULL gotchas; LEFT JOIN + NULL is safer",
      },
      {
        name: "Self-Join for Pairs",
        formula: "JOIN table t2 ON t1.key = t2.key AND t1.id < t2.id",
        useFor: "Compare rows within same table (user pairs, time comparisons)",
        pitfall: "Use id < id to avoid duplicate pairs",
      },
      {
        name: "Bidirectional Relationships",
        formula: "SELECT user1, user2 UNION SELECT user2, user1",
        useFor: "Normalize friendships stored one-way",
      },
      {
        name: "Multi-Table Strategy",
        formula: "CTE → Join → Filter → Aggregate",
        useFor: "Break complex joins into readable CTEs",
      },
    ],
  },
  {
    id: "window",
    title: "Window Functions",
    shortTitle: "Windows",
    icon: "chart-bar",
    description: "Ranking, running totals, gaps & islands",
    matchPatterns: ["Window", "DENSE_RANK", "Rolling", "Deduplication", "ROW_NUMBER", "Gaps"],
    patterns: [
      {
        name: "ROW_NUMBER vs RANK vs DENSE_RANK",
        formula: "ROW_NUMBER: 1,2,3 | RANK: 1,1,3 | DENSE_RANK: 1,1,2",
        useFor: "ROW_NUMBER for dedup, DENSE_RANK for 'nth highest'",
        pitfall: "RANK skips numbers after ties; DENSE_RANK doesn't",
      },
      {
        name: "Running Total",
        formula: "SUM(val) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)",
        useFor: "Cumulative sums, YTD revenue",
        pitfall: "Without ROWS clause, default includes ties",
      },
      {
        name: "Deduplication",
        formula: "ROW_NUMBER() OVER (PARTITION BY key ORDER BY priority DESC)",
        useFor: "Keep one record per group (most recent, highest priority)",
      },
      {
        name: "Gaps & Islands",
        formula: "date - ROW_NUMBER() = constant for consecutive dates",
        useFor: "Find consecutive sequences (login streaks)",
        pitfall: "Requires DISTINCT dates first",
      },
    ],
  },
  {
    id: "metrics",
    title: "Metrics & Rates",
    shortTitle: "Metrics",
    icon: "trending-up",
    description: "CTR, DAU/MAU, YoY growth, churn",
    matchPatterns: ["Rate", "Ratio", "Percentage", "CTEs", "Period Comparison", "YoY", "MoM", "Stickiness"],
    patterns: [
      {
        name: "Percentage Formula",
        formula: "ROUND(100.0 * numerator / denominator, 2)",
        useFor: "CTR, conversion rates, any ratio",
        pitfall: "Use 100.0 (not 100) to force decimal division",
      },
      {
        name: "DAU/MAU Stickiness",
        formula: "AVG(daily_users) / COUNT(DISTINCT monthly_users) × 100",
        useFor: "Measure how often monthly users return daily",
        pitfall: "MAU ≠ sum of DAUs (same user counted multiple days)",
      },
      {
        name: "YoY Comparison",
        formula: "Self-join ON month WHERE year = 2024 AND year = 2023",
        useFor: "Compare same month across years",
        pitfall: "Handle missing months (some data might not exist)",
      },
      {
        name: "Churn Rate",
        formula: "(churned_users / total_users) × 100",
        useFor: "Measure user/customer loss over period",
        pitfall: "Clarify churn definition (30-day inactive? no purchase?)",
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Patterns",
    shortTitle: "Advanced",
    icon: "puzzle",
    description: "State machines, histograms, set operations",
    matchPatterns: ["State Machine", "Histogram", "Set Operations", "Existence"],
    patterns: [
      {
        name: "State Machine",
        formula: "CASE WHEN status='X' AND event THEN 'Y' ... END",
        useFor: "Status transitions (NEW→EXISTING→CHURNED)",
        pitfall: "Map ALL (state, event) → new_state combinations",
      },
      {
        name: "Histogram Buckets",
        formula: "CASE WHEN val <= 2 THEN '1-2' WHEN val <= 5 THEN '3-5' ... END",
        useFor: "Distribution analysis (comment count buckets)",
        pitfall: "Use LEFT JOIN to include zero counts",
      },
      {
        name: "EXISTS vs IN",
        formula: "WHERE EXISTS (SELECT 1 FROM ... WHERE ...)",
        useFor: "Check if related records exist",
        pitfall: "EXISTS stops at first match (faster for large datasets)",
      },
      {
        name: "Set Intersection",
        formula: "WHERE user_id IN (SELECT ... WHERE month=6) AND month=7",
        useFor: "Find users in BOTH sets (retention)",
        pitfall: "INTERSECT also works but less flexible",
      },
    ],
  },
];

// Get challenges for a skill category
export function getChallengesForCategory(
  challenges: Challenge[],
  categoryId: string
): Challenge[] {
  const category = CHEATSHEET_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  return challenges.filter((challenge) => {
    const skill = challenge.conceptExplanation?.skill || "";
    return category.matchPatterns.some((pattern) =>
      skill.toLowerCase().includes(pattern.toLowerCase())
    );
  });
}

// Extract key insights from challenges
export function getKeyInsightsForCategory(
  challenges: Challenge[],
  categoryId: string
): string[] {
  const categoryChallenges = getChallengesForCategory(challenges, categoryId);
  return categoryChallenges
    .map((c) => c.conceptExplanation?.keyInsight)
    .filter((insight): insight is string => !!insight);
}

// Get active categories (those with at least one challenge)
export function getActiveCategories(challenges: Challenge[]): SkillCategory[] {
  return CHEATSHEET_CATEGORIES.filter((category) => {
    return getChallengesForCategory(challenges, category.id).length > 0;
  });
}
