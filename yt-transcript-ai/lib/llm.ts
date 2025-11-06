import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { LLMProvider, AIAction } from '@/types'

/**
 * LLM Adapter - Routes AI requests to either Anthropic or OpenAI
 * based on LLM_PROVIDER environment variable
 */

// Initialize clients lazily
let anthropicClient: Anthropic | null = null
let openaiClient: OpenAI | null = null

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    anthropicClient = new Anthropic({ apiKey })
  }
  return anthropicClient
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

/**
 * Build system prompt based on action type
 */
function buildPrompt(action: AIAction): string {
  const prompts: Record<AIAction, string> = {
    summarize:
      'Provide a concise summary of the following YouTube transcript. Focus on the main points and key takeaways. Keep it under 300 words.',
    outline:
      'Create a structured outline of the following YouTube transcript. Use hierarchical formatting with main topics and subtopics. Use markdown formatting.',
    'key-points':
      'Extract exactly 5 key points from the following YouTube transcript. Format as a numbered list. Each point should be concise (1-2 sentences).',
    qa: 'Generate 10 meaningful questions and answers based on the following YouTube transcript. Format as Q1: question / A1: answer pairs.',
    'json-structure':
      'Analyze the following YouTube transcript and structure it into JSON format with the schema: { "sections": [{ "title": "string", "bullets": ["string"] }] }. Identify main sections/topics and key points under each. Return ONLY valid JSON, no additional text.',
  }

  return prompts[action]
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(
  systemPrompt: string,
  transcript: string
): Promise<{ result: string; tokensUsed: number }> {
  const client = getAnthropicClient()

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${systemPrompt}\n\nTranscript:\n${transcript}`,
      },
    ],
  })

  const result = message.content[0].type === 'text' ? message.content[0].text : ''
  const tokensUsed = message.usage.input_tokens + message.usage.output_tokens

  return { result, tokensUsed }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  systemPrompt: string,
  transcript: string
): Promise<{ result: string; tokensUsed: number }> {
  const client = getOpenAIClient()

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Transcript:\n${transcript}` },
    ],
    max_tokens: 4096,
  })

  const result = response.choices[0]?.message?.content || ''
  const tokensUsed = response.usage?.total_tokens || 0

  return { result, tokensUsed }
}

/**
 * Estimate cost based on provider and token usage
 */
function estimateCost(provider: LLMProvider, tokensUsed: number): number {
  // Rough estimates (as of Jan 2025)
  const rates: Record<LLMProvider, number> = {
    anthropic: 0.003 / 1000, // ~$3 per 1M tokens (Claude Sonnet average)
    openai: 0.005 / 1000, // ~$5 per 1M tokens (GPT-4o average)
  }

  return tokensUsed * rates[provider]
}

/**
 * Main LLM execution function
 * Routes to appropriate provider and returns structured response
 */
export async function executeLLM(
  action: AIAction,
  transcript: string
): Promise<{ result: string; tokensUsed: number; estimatedCost: number }> {
  const provider = (process.env.LLM_PROVIDER || 'anthropic') as LLMProvider

  if (!['anthropic', 'openai'].includes(provider)) {
    throw new Error(`Invalid LLM_PROVIDER: ${provider}`)
  }

  const systemPrompt = buildPrompt(action)

  let result: string
  let tokensUsed: number

  if (provider === 'anthropic') {
    const response = await callAnthropic(systemPrompt, transcript)
    result = response.result
    tokensUsed = response.tokensUsed
  } else {
    const response = await callOpenAI(systemPrompt, transcript)
    result = response.result
    tokensUsed = response.tokensUsed
  }

  const estimatedCost = estimateCost(provider, tokensUsed)

  return { result, tokensUsed, estimatedCost }
}
