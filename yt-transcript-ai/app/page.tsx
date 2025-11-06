'use client'

import { useState, useEffect, useCallback } from 'react'
import UrlForm from '@/components/UrlForm'
import TranscriptEditor from '@/components/TranscriptEditor'
import ActionsBar from '@/components/ActionsBar'
import ResultCard from '@/components/ResultCard'
import type { AIAction, TranscriptResponse, AIResponse } from '@/types'

export default function Home() {
  // State management
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<AIAction | null>(null)
  const [tokensUsed, setTokensUsed] = useState<number | undefined>()
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>()

  /**
   * Fetch transcript from YouTube URL
   */
  const fetchTranscript = async () => {
    if (!youtubeUrl.trim()) return

    setIsLoadingTranscript(true)
    setError(null)
    setTranscript('')
    setAiResult(null)

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      })

      const data: TranscriptResponse = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to fetch transcript')
        return
      }

      setTranscript(data.transcript || '')
    } catch (err) {
      setError('Network error: Failed to fetch transcript')
      console.error(err)
    } finally {
      setIsLoadingTranscript(false)
    }
  }

  /**
   * Execute AI action on transcript
   */
  const executeAIAction = useCallback(
    async (action: AIAction) => {
      if (!transcript.trim()) {
        setError('No transcript available. Please fetch a transcript first.')
        return
      }

      setIsLoadingAI(true)
      setError(null)
      setLastAction(action)

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, transcript }),
        })

        const data: AIResponse = await response.json()

        if (!data.success) {
          setError(data.error || 'Failed to process AI request')
          setAiResult(null)
          return
        }

        setAiResult(data.result || null)
        setTokensUsed(data.tokensUsed)
        setEstimatedCost(data.estimatedCost)
      } catch (err) {
        setError('Network error: Failed to process AI request')
        setAiResult(null)
        console.error(err)
      } finally {
        setIsLoadingAI(false)
      }
    },
    [transcript]
  )

  /**
   * Copy to clipboard helper
   */
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert(`${label} copied to clipboard!`),
      () => alert('Failed to copy to clipboard')
    )
  }

  /**
   * Download helper
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Keyboard shortcut: Cmd/Ctrl + Enter to re-run last action
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (lastAction && transcript && !isLoadingAI) {
          executeAIAction(lastAction)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lastAction, transcript, isLoadingAI, executeAIAction])

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            YouTube → Transcript → AI Workspace
          </h1>
          <p className="text-gray-600">
            Fetch transcripts from YouTube and apply GenAI actions
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* URL Input */}
        <UrlForm
          url={youtubeUrl}
          onUrlChange={setYoutubeUrl}
          onFetch={fetchTranscript}
          isLoading={isLoadingTranscript}
        />

        {/* Transcript Editor */}
        {(transcript || isLoadingTranscript) && (
          <TranscriptEditor
            transcript={transcript}
            onChange={setTranscript}
            onCopy={() => copyToClipboard(transcript, 'Transcript')}
            onDownload={() => downloadFile(transcript, 'transcript.txt', 'text/plain')}
          />
        )}

        {/* Actions Bar */}
        {transcript && (
          <ActionsBar
            onAction={executeAIAction}
            disabled={!transcript || isLoadingAI}
            isLoading={isLoadingAI}
            currentAction={isLoadingAI ? lastAction : null}
          />
        )}

        {/* AI Result */}
        {(aiResult || isLoadingAI) && (
          <>
            {isLoadingAI ? (
              <div className="card bg-blue-50">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-700">Processing with AI...</p>
                </div>
              </div>
            ) : (
              <ResultCard
                result={aiResult}
                tokensUsed={tokensUsed}
                estimatedCost={estimatedCost}
                onCopy={() => copyToClipboard(aiResult || '', 'Result')}
                onDownload={() => {
                  const isJson = aiResult?.trim().startsWith('{') || aiResult?.trim().startsWith('[')
                  downloadFile(
                    aiResult || '',
                    isJson ? 'result.json' : 'result.txt',
                    isJson ? 'application/json' : 'text/plain'
                  )
                }}
              />
            )}
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8">
          <p>
            Built with Next.js 15 + TypeScript + Tailwind · LLM Provider:{' '}
            {process.env.NEXT_PUBLIC_LLM_PROVIDER || 'Configured server-side'}
          </p>
        </footer>
      </div>
    </main>
  )
}
