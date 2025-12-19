import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Types for the review API
interface ReviewRequest {
  userSql: string;
  challengePrompt: string;
  solutionSql: string;
  tables: string[];
  hint?: string;
  // Actual query results for evidence-based review
  userQueryResults?: Record<string, unknown>[];
  userQueryError?: string;
}

interface ReviewIssue {
  type: "logic" | "syntax" | "efficiency" | "edge_case";
  description: string;
  suggestion: string;
}

interface ReviewResponse {
  correctness: "correct" | "partially_correct" | "incorrect";
  summary: string;
  issues: ReviewIssue[];
  strengths: string[];
  actionItems: string[];
}

// Rate limiting: Simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Check API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  // Parse request body
  let body: ReviewRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  // Validate required fields
  const { userSql, challengePrompt, solutionSql, tables } = body;
  if (!userSql || !challengePrompt || !solutionSql || !tables) {
    return NextResponse.json(
      { error: "Missing required fields: userSql, challengePrompt, solutionSql, tables" },
      { status: 400 }
    );
  }

  // Build the prompt for Claude
  const systemPrompt = `You are a senior data scientist reviewing SQL interview answers. Provide comprehensive feedback that evaluates both the query results AND the code quality.

## REVIEW APPROACH:
1. **Check Results**: If actual results are provided, verify they answer the question correctly
2. **Analyze Code Logic**: Even if results are correct, check if the logic would work on edge cases
3. **Guide to Best Practice**: Help the user understand optimal approaches

## WHAT TO EVALUATE:

### Results (if provided):
- Do the columns match what was asked?
- Are the values correct for the given data?
- Is the format correct (rounding, ordering, etc.)?

### Code Logic (always check):
- Would this work with NULL values?
- Would this work with empty tables?
- Would this work with duplicate data?
- Is the JOIN logic correct for all cases?
- Are aggregations handling edge cases?

### SQL Knowledge - BE VERY CAREFUL WITH THESE:
- COUNT(column) and COUNT(DISTINCT column) IGNORE NULLs - they NEVER count NULL values
- COUNT(*) counts all rows including those with NULLs

**LEFT JOIN + COUNT Pattern (THIS IS VALID - DO NOT FLAG AS WRONG):**
When you do: FROM table_A LEFT JOIN table_B ON condition, then COUNT(DISTINCT table_B.column):
- The result set only contains rows from table_A (the LEFT side)
- For non-matching rows, table_B.column is NULL
- COUNT(DISTINCT table_B.column) correctly counts only the matched (non-NULL) values
- This is a VALID and CORRECT pattern - do NOT claim it has flaws

**Concrete Example:**
FROM active_users LEFT JOIN video_callers ON user_id, then COUNT(DISTINCT video_caller_id):
- Only active_users appear in the result (LEFT side controls the rows)
- video_caller_id is NULL for non-matches, non-NULL for matches
- COUNT(DISTINCT video_caller_id) counts ONLY the matches (ignores NULLs)
- This correctly counts "active users who made video calls"
- There is NO WAY for "extra users not in active_users" to appear - the LEFT side controls the row set

- Different approaches (EXISTS vs LEFT JOIN + COUNT, subquery vs CTE) can be equally valid

**WHERE before GROUP BY (THIS IS CORRECT - DO NOT FLAG AS WRONG):**
When filtering with WHERE before GROUP BY, this is standard and correct SQL:
- WHERE filters rows BEFORE aggregation - this is intentional and correct
- Example: Filtering out pages a user already liked BEFORE counting friends who liked remaining pages
- The pattern: WHERE page_id NOT IN (SELECT page_id FROM likes WHERE user_id = ...) GROUP BY page_id
- This correctly excludes unwanted rows first, then aggregates the remaining rows
- Do NOT claim this "works by accident" or has "logic flaws" - it's the correct approach

**Correlated Subqueries in WHERE (VALID PATTERN):**
Using a correlated subquery like WHERE x NOT IN (SELECT ... WHERE outer.col = inner.col) is valid:
- The subquery runs for each outer row, which is expected behavior
- This correctly filters based on per-row conditions
- It's equivalent to NOT EXISTS and LEFT JOIN + IS NULL patterns

**NULL Filtering After LEFT JOIN (OFTEN INTENTIONAL - THINK BEFORE FLAGGING):**
When WHERE filters out NULL values from a LEFT JOIN, ask: "Is this actually a problem?"
- Example: LEFT JOIN page_likes, then WHERE page_id NOT IN (...) filters out NULL page_ids
- If we're recommending PAGES, rows where page_id is NULL are USELESS - there's nothing to recommend
- Filtering them out is CORRECT, not a "logic flaw" or "silent exclusion problem"
- Only flag NULL filtering if it genuinely loses meaningful data for the question being asked
- A recommendation query that excludes "no recommendations" rows is CORRECT behavior

## CRITICAL: AVOID FALSE POSITIVES
When the query results are correct:
- Do NOT invent hypothetical flaws like "works by accident", "happens to work for this data", or "silently excludes"
- If results are correct, the logic is likely correct - verify before claiming issues
- Standard SQL patterns (WHERE before GROUP BY, correlated subqueries, CTEs) are NOT flaws
- Only flag real issues you can explain with a concrete failing case
- Ask yourself: "Would this ACTUALLY cause wrong results, or am I overthinking?"
- If filtering out NULL/empty data makes sense for the question (e.g., "recommend pages" can't recommend NULL), it's NOT a flaw

## CORRECTNESS LEVELS:
- "correct": Results are right AND logic is sound for edge cases
- "partially_correct": Results are right but logic has potential edge case issues, OR results are close but missing something
- "incorrect": Results are wrong OR there's a critical logic flaw

## GUIDELINES:
- Be concise (max 200 words), encouraging but honest
- Praise good patterns, suggest improvements constructively
- If results are correct but you see potential edge case issues, mention them as improvements rather than errors
- Consider DuckDB SQL syntax (similar to PostgreSQL)

Respond with valid JSON:
{
  "correctness": "correct" | "partially_correct" | "incorrect",
  "summary": "1-2 sentence verdict explaining your assessment",
  "issues": [{"type": "logic|syntax|efficiency|edge_case", "description": "...", "suggestion": "..."}],
  "strengths": ["what they did well"],
  "actionItems": ["specific next step to improve"]
}

Keep issues to max 2, actionItems to max 3.`;

  // Format query results for the prompt
  const formatResults = (results: Record<string, unknown>[] | undefined, error: string | undefined): string => {
    if (error) {
      return `ERROR: ${error}`;
    }
    if (!results || results.length === 0) {
      return "No results (query not run yet or returned empty)";
    }
    // Limit to first 10 rows for readability
    const limitedResults = results.slice(0, 10);
    const hasMore = results.length > 10;
    const formatted = JSON.stringify(limitedResults, null, 2);
    return hasMore ? `${formatted}\n... (${results.length} total rows)` : formatted;
  };

  const userQueryOutput = formatResults(body.userQueryResults, body.userQueryError);
  const hasResults = body.userQueryResults && body.userQueryResults.length > 0;

  const userPrompt = `## CHALLENGE:
${challengePrompt}

## AVAILABLE TABLES:
${tables.join(", ")}

${body.hint ? `## HINT PROVIDED:\n${body.hint}\n\n` : ""}## REFERENCE SOLUTION (one valid approach):
\`\`\`sql
${solutionSql}
\`\`\`

## USER'S SQL QUERY:
\`\`\`sql
${userSql}
\`\`\`

${hasResults ? `## ACTUAL QUERY OUTPUT:
${userQueryOutput}

Please review BOTH:
1. Whether these results correctly answer the question
2. Whether the SQL logic would handle edge cases (NULLs, empty data, duplicates)

If results are correct and logic is sound, mark as "correct". If results are correct but there are edge case concerns, you can still mark as "correct" but mention the considerations as actionItems.` : `## NOTE:
The user hasn't run their query yet. Review the SQL logic and provide guidance, but be clear that you cannot verify correctness without seeing actual output.`}

Provide comprehensive JSON feedback.`;

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    // Extract text content from response
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    let review: ReviewResponse;
    try {
      // Clean up the response - extract JSON from markdown code blocks if present
      let jsonText = textContent.text.trim();

      // Try to extract JSON from markdown code blocks
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      } else {
        // If no code blocks, try to find JSON object directly
        const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          jsonText = jsonObjectMatch[0];
        }
      }

      review = JSON.parse(jsonText);

      // Validate required fields
      if (!review.correctness || !review.summary) {
        throw new Error("Missing required fields in response");
      }

      // Ensure arrays exist
      review.issues = review.issues || [];
      review.strengths = review.strengths || [];
      review.actionItems = review.actionItems || [];

    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", textContent.text);

      // If JSON parsing fails, create a fallback response
      // Try to extract useful info from the raw text
      let summary = "Unable to parse AI response. Please try again.";
      const rawText = textContent.text;

      // Try to extract correctness from raw text
      let correctness: "correct" | "partially_correct" | "incorrect" = "partially_correct";
      if (rawText.toLowerCase().includes('"correctness": "correct"') ||
          rawText.toLowerCase().includes('"correctness":"correct"')) {
        correctness = "correct";
      } else if (rawText.toLowerCase().includes('"correctness": "incorrect"') ||
                 rawText.toLowerCase().includes('"correctness":"incorrect"')) {
        correctness = "incorrect";
      }

      review = {
        correctness,
        summary,
        issues: [],
        strengths: [],
        actionItems: ["Try running the review again"],
      };
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Claude API error:", error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your ANTHROPIC_API_KEY." },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Claude API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to get review from Claude. Please try again." },
      { status: 500 }
    );
  }
}
