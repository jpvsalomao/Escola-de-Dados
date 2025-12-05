// Pack Schema v1.2 (backward compatible with v1.1)
export interface PackSchema {
  schema_version: string;
  min_app_version: string;
  id: string;
  title: string;
  description?: string;
  metadata: {
    author: string;
    authorBio?: string;
    authorLinks?: {
      website?: string;
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
    locale: string;
    tags: string[];
    difficulty?: "beginner" | "intermediate" | "advanced";
    estimatedTimeMinutes?: number;
    prerequisites?: string[];
    learningObjectives?: string[];
    coverImage?: string;
  };
  integrity: {
    algorithm: string;
    datasets: Record<string, string>;
  };
  datasets: Array<{
    name: string;
    src: string;
  }>;
  // Optional: Section definitions (v1.2+)
  sections?: Record<string, {
    title: string;
    description?: string;
    icon?: string;
    color?: string;
  }>;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  dialect: string;
  hint?: string; // Deprecated: use hints instead (backward compatibility)
  hints?: {
    tier1?: string; // Gentle nudge
    tier2?: string; // More specific direction
    tier3?: string; // Near-solution guidance
  };
  interviewTips?: {
    thinkOutLoud?: string; // What to verbalize as you code
    detailsToCheck?: string; // Table/column details to verify
    metaProductContext?: string; // Real-world application at Meta
    avoidGeneric?: string; // Specific pitfalls for this problem
    followUpQuestion?: string; // Likely metric/experiment follow-up
  };
  solution_sql: string;
  tests: Test[];
  limits: {
    timeout_ms: number;
    row_limit: number;
  };
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  section?: string; // Optional: section ID (v1.2+)
  tables?: string[]; // Optional: tables required for this challenge (v1.2+)
  estimatedMinutes?: number; // Optional: expected time to solve in minutes (v1.2+)
  beforeYouCode?: string[]; // Optional: checklist of questions to consider before coding (v1.2+)
  conceptExplanation?: {
    skill: string; // Primary skill name (e.g., "Anti-Join Pattern")
    explanation: string; // 2-3 sentence explanation of the concept
    keyInsight: string; // One-liner "aha moment" for this pattern
    relatedSkills?: string[]; // Other skills this touches
  };
}

export type AssertType = "ROWCOUNT" | "SQL" | "SCHEMA_EQ" | "SET_EQ" | "NEAR";

export interface Test {
  name: string;
  assert: AssertType;
  expected?: unknown;
  sql?: string;
  schema?: Array<{ name: string; type: string }>;
  tolerance?: { abs?: number; rel?: number };
}

export interface GradeOptions {
  orderInsensitive?: boolean;
  floatTolerance?: { abs?: number; rel?: number };
  nullsEqual?: boolean;
}

export interface GradeResult {
  pass: boolean;
  checks: Array<{
    name: string;
    pass: boolean;
    message?: string;
  }>;
  stats: {
    elapsedMs: number;
    rowsReturned: number;
  };
}

export interface Progress {
  packId: string;
  challengeId: string;
  completed: boolean;
  attempts: number;
  lastAttempt?: string;
  bestTime?: number;
}

export interface AppConfig {
  flags: {
    allowPackUpload: boolean;
    enableSetEqAssert: boolean;
    enableTelemetry: boolean;
  };
  limits: {
    maxRowsLoadedPerPack: number;
    maxBytesPerDataset: number;
    timeoutMs: number;
  };
}
