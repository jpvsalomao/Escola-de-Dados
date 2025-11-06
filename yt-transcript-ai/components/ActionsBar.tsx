'use client'

import type { AIAction } from '@/types'

interface ActionsBarProps {
  onAction: (action: AIAction) => void
  disabled: boolean
  isLoading: boolean
  currentAction: AIAction | null
}

/**
 * Action buttons bar for AI operations
 * Provides buttons for all supported AI actions
 */
export default function ActionsBar({
  onAction,
  disabled,
  isLoading,
  currentAction,
}: ActionsBarProps) {
  const actions: { action: AIAction; label: string; description: string }[] = [
    { action: 'summarize', label: '📝 Summarize', description: 'Concise summary' },
    { action: 'outline', label: '📋 Outline', description: 'Structured outline' },
    { action: 'key-points', label: '🎯 Key Points', description: '5 main bullets' },
    { action: 'qa', label: '❓ Q&A', description: '10 questions' },
    { action: 'json-structure', label: '🔧 JSON', description: 'Structured data' },
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">AI Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map(({ action, label, description }) => (
          <button
            key={action}
            onClick={() => onAction(action)}
            disabled={disabled || isLoading}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all text-left
              ${
                isLoading && currentAction === action
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }
              ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={description}
          >
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          </button>
        ))}
      </div>

      {!disabled && (
        <p className="text-xs text-gray-500 mt-3">
          💡 Tip: Press <kbd className="px-2 py-1 bg-gray-100 rounded">Cmd/Ctrl + Enter</kbd> to
          re-run last action
        </p>
      )}
    </div>
  )
}
