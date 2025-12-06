import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Types for the review API
interface ReviewRequest {
  userSql: string;
  challengePrompt: string;
  solutionSql: string;
  tables: string[];
  hint?: string;
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
  const systemPrompt = `You are a senior data scientist reviewing SQL interview answers.

CRITICAL SQL RULES - You MUST consider these before critiquing:
1. COUNT() ignores NULL values - COUNT(DISTINCT col) only counts non-NULL distinct values
2. LEFT JOIN from table A to B: rows from A always appear; B columns are NULL when no match
3. Multiple valid approaches exist: EXISTS, IN, LEFT JOIN + COUNT, window functions, subqueries
4. A LEFT JOIN + COUNT(column) approach CAN be equivalent to an EXISTS approach - the LEFT JOIN restricts the base set, and COUNT ignores the NULLs from non-matches

REVIEW PROCESS:
1. First, trace through the query logic step by step
2. Consider how NULLs propagate through JOINs and aggregations
3. Compare the LOGIC, not just syntax, to the reference solution
4. Only flag issues if the query would produce WRONG RESULTS, not just different style

IMPORTANT:
- If the user's approach is logically equivalent but uses different syntax, mark as "correct"
- Be very careful about LEFT JOIN + COUNT patterns - they often correctly handle NULLs
- When unsure, lean toward "correct" rather than giving wrong feedback
- Focus on whether the final result would be correct, not intermediate style choices

GUIDELINES:
- Be concise (max 150 words total)
- Don't reveal the complete solution
- Be encouraging but honest
- Consider DuckDB SQL syntax (similar to PostgreSQL)

Respond with valid JSON:
{
  "correctness": "correct" | "partially_correct" | "incorrect",
  "summary": "1-2 sentence verdict explaining the logic",
  "issues": [{"type": "logic|syntax|efficiency|edge_case", "description": "...", "suggestion": "..."}],
  "strengths": ["what they did well"],
  "actionItems": ["specific improvement"]
}

Keep issues to max 2 items, actionItems to max 3.`;

  const userPrompt = `QUESTION:
${challengePrompt}

AVAILABLE TABLES:
${tables.join(", ")}

${body.hint ? `HINT PROVIDED:\n${body.hint}\n\n` : ""}REFERENCE SOLUTION (one valid approach - others may exist):
${solutionSql}

USER'S ANSWER:
${userSql}

IMPORTANT: The reference solution shows ONE valid approach. The user's query may use a different but equally valid approach (e.g., LEFT JOIN + COUNT vs EXISTS, subquery vs CTE). Analyze whether the user's query would produce the CORRECT RESULTS, not whether it matches the reference syntax.

Provide structured JSON feedback.`;

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
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
      // Clean up the response in case it has markdown code blocks
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      review = JSON.parse(jsonText);
    } catch {
      // If JSON parsing fails, create a fallback response
      review = {
        correctness: "partially_correct",
        summary: textContent.text.slice(0, 200),
        issues: [],
        strengths: [],
        actionItems: ["Review the reference solution approach"],
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
