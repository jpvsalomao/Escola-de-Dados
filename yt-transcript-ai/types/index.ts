// LLM Provider Types
export type LLMProvider = 'anthropic' | 'openai'

// Transcript Types
export interface TranscriptSegment {
  text: string
  offset: number
  duration: number
}

export interface TranscriptResponse {
  success: boolean
  transcript?: string
  segments?: TranscriptSegment[]
  error?: string
}

// AI Action Types
export type AIAction =
  | 'summarize'
  | 'outline'
  | 'key-points'
  | 'qa'
  | 'json-structure'

export interface AIRequest {
  action: AIAction
  transcript: string
}

export interface AIResponse {
  success: boolean
  result?: string
  error?: string
  tokensUsed?: number
  estimatedCost?: number
}

// JSON Structure Output Types
export interface StructuredSection {
  title: string
  bullets: string[]
}

export interface StructuredOutput {
  sections: StructuredSection[]
}

// UI State Types
export interface AppState {
  youtubeUrl: string
  transcript: string
  isLoading: boolean
  error: string | null
  aiResult: string | null
  lastAction: AIAction | null
}
