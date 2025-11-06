'use client'

interface ResultCardProps {
  result: string | null
  tokensUsed?: number
  estimatedCost?: number
  onCopy: () => void
  onDownload: () => void
}

/**
 * Display card for AI-generated results
 * Shows the result with metadata and export options
 */
export default function ResultCard({
  result,
  tokensUsed,
  estimatedCost,
  onCopy,
  onDownload,
}: ResultCardProps) {
  if (!result) {
    return (
      <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-center py-8">
          AI results will appear here after running an action
        </p>
      </div>
    )
  }

  // Check if result is JSON (for json-structure action)
  const isJson = result.trim().startsWith('{') || result.trim().startsWith('[')

  return (
    <div className="card border-2 border-blue-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">AI Result</h2>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="btn-secondary text-sm"
            title="Copy result to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={onDownload}
            className="btn-secondary text-sm"
            title={`Download result as ${isJson ? '.json' : '.txt'} file`}
          >
            ⬇️ Download {isJson ? 'JSON' : 'TXT'}
          </button>
        </div>
      </div>

      <div
        className={`${
          isJson ? 'font-mono text-sm bg-gray-900 text-green-400 p-4 rounded overflow-x-auto' : 'prose max-w-none'
        }`}
      >
        {isJson ? (
          <pre className="whitespace-pre-wrap">{result}</pre>
        ) : (
          <div className="whitespace-pre-wrap">{result}</div>
        )}
      </div>

      {/* Metadata */}
      {(tokensUsed || estimatedCost) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 text-xs text-gray-600">
          {tokensUsed && <span>Tokens: {tokensUsed.toLocaleString()}</span>}
          {estimatedCost && (
            <span>
              Est. Cost: ${estimatedCost.toFixed(4)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
