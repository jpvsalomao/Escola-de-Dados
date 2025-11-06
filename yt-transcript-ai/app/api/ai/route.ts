import { NextRequest, NextResponse } from 'next/server'
import { executeLLM } from '@/lib/llm'
import type { AIRequest, AIResponse, AIAction } from '@/types'

/**
 * Validate that the action is a supported AI action
 */
function isValidAction(action: string): action is AIAction {
  const validActions: AIAction[] = [
    'summarize',
    'outline',
    'key-points',
    'qa',
    'json-structure',
  ]
  return validActions.includes(action as AIAction)
}

/**
 * POST /api/ai
 * Executes an AI action on the provided transcript
 */
export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { action, transcript } = body

    // Validation
    if (!action || !transcript) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action and transcript are required',
        } as AIResponse,
        { status: 400 }
      )
    }

    if (!isValidAction(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: summarize, outline, key-points, qa, json-structure`,
        } as AIResponse,
        { status: 400 }
      )
    }

    if (transcript.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transcript is too short',
        } as AIResponse,
        { status: 400 }
      )
    }

    // Check if LLM provider is configured
    const provider = process.env.LLM_PROVIDER || 'anthropic'
    const apiKey =
      provider === 'anthropic'
        ? process.env.ANTHROPIC_API_KEY
        : process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: `${provider.toUpperCase()} API key is not configured. Please set ${provider.toUpperCase()}_API_KEY in your environment.`,
        } as AIResponse,
        { status: 500 }
      )
    }

    // Execute LLM request
    const { result, tokensUsed, estimatedCost } = await executeLLM(action, transcript)

    const response: AIResponse = {
      success: true,
      result,
      tokensUsed,
      estimatedCost,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('AI processing error:', error)

    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'API key configuration error: ' + error.message,
        } as AIResponse,
        { status: 500 }
      )
    }

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        } as AIResponse,
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI request. Please try again.',
      } as AIResponse,
      { status: 500 }
    )
  }
}
