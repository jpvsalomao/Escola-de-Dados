import type { Challenge } from "./types";

// Skill group definition with curated content
export interface SkillCategory {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  matchPatterns: string[];
  // Mental model section - based on actual pack challenges
  mentalModel: {
    coreIdea: string;
    recognizeIt: string[];  // How to spot this problem type from actual challenges
    approach: string;       // Step-by-step thinking
  };
  patterns: PatternDefinition[];
}

export interface PatternDefinition {
  name: string;
  formula?: string;
  useFor: string;
  pitfall?: string;
}

// Curated cheatsheet content based on pack_meta_interview challenges
export const CHEATSHEET_CATEGORIES: SkillCategory[] = [
  {
    id: "aggregation",
    title: "Aggregation & Counting",
    shortTitle: "Aggregation",
    icon: "calculator",
    description: "GROUP BY, HAVING, conditional counts",
    matchPatterns: ["Aggregation", "COUNT", "HAVING", "First Value", "Conditional Counting"],
    mentalModel: {
      coreIdea: "Transform rows into summaries. Think: 'For each user/app/week, calculate X.'",
      recognizeIt: [
        "'Users with 2+ posts' → GROUP BY + HAVING COUNT >= 2 (Average Post Hiatus)",
        "'First activity date per user' → GROUP BY + MIN(date) (First Activity)",
        "'CTR per app' → GROUP BY + conditional counting (Click-Through Rate)",
        "'Users who called 3+ people' → GROUP BY + COUNT DISTINCT + HAVING (3+ Calls)",
      ],
      approach: "1) What to group by? 2) What to count/sum? 3) Filter groups (HAVING) or rows (WHERE)?",
    },
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
    mentalModel: {
      coreIdea: "Combine tables or compare rows. 'What's missing?' = anti-join. 'Find pairs?' = self-join.",
      recognizeIt: [
        "'Pages with no likes' → Anti-join: LEFT JOIN + IS NULL (Pages No Likes)",
        "'Friend recommendations' → Self-join + anti-join (Page Recommendations)",
        "'Mutual friends count' → Self-join on shared friend_id (Mutual Friends)",
        "'Users who share 2+ private events' → Self-join on event_id + HAVING (Friend Recommendations)",
      ],
      approach: "1) 'Missing' data? → Anti-join. 2) Comparing within same table? → Self-join. 3) Exclude existing pairs? → NOT EXISTS.",
    },
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
    mentalModel: {
      coreIdea: "Calculate across rows without collapsing them. 'Keep all rows but add context.'",
      recognizeIt: [
        "'Second highest per category' → DENSE_RANK + filter rank = 2 (Second Highest Engagement)",
        "'Remove duplicates, keep most recent' → ROW_NUMBER + filter rn = 1 (Deduplicate Records)",
        "'YTD cumulative revenue' → SUM OVER + UNBOUNDED PRECEDING (Cumulative Revenue)",
        "'Consecutive login streak' → Gaps & Islands technique (Consecutive Login Streak)",
        "'Rolling 7-day active users' → Correlated subquery with date BETWEEN (Rolling 7-Day)",
      ],
      approach: "1) Need ranking? → ROW_NUMBER/DENSE_RANK. 2) Running total? → SUM OVER. 3) Consecutive sequences? → Gaps & Islands.",
    },
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
    mentalModel: {
      coreIdea: "Metrics = numerator / denominator × 100. Always clarify: What's being counted? What's the base?",
      recognizeIt: [
        "'CTR per app' → clicks / impressions × 100 (Click-Through Rate)",
        "'Video call percentage' → video_callers / active_users × 100 (Video Call Percentage)",
        "'DAU/MAU stickiness' → avg(daily_count) / monthly_users × 100 (DAU/MAU Stickiness)",
        "'YoY MAU growth' → (this_year - last_year) / last_year × 100 (YoY MAU Growth)",
        "'Churn rate by week' → churned / total × 100 (Weekly Churn Rate)",
      ],
      approach: "1) Define numerator precisely. 2) Define denominator (the base). 3) Calculate ratio × 100. 4) Handle edge cases (div by zero).",
    },
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
    mentalModel: {
      coreIdea: "Complex problems = smaller patterns combined. Break into: states, transitions, sets, distributions.",
      recognizeIt: [
        "'Advertiser status update' → State machine with CASE WHEN (Advertiser Status)",
        "'Comment count distribution' → Histogram: aggregate → bucket → count (Comment Histogram)",
        "'Users active in BOTH months' → Set intersection: IN or EXISTS (MAU Retention)",
        "'Recommend pages friends liked' → Self-join + anti-join + ranking (Page Recommendations)",
      ],
      approach: "1) Identify the pattern type. 2) Use CTEs to break into steps. 3) Handle edge cases explicitly (zero counts, missing data).",
    },
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
