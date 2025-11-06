'use client'

interface TranscriptEditorProps {
  transcript: string
  onChange: (transcript: string) => void
  onCopy: () => void
  onDownload: () => void
}

/**
 * Transcript editor with character counter and export options
 * Allows viewing and editing the transcript
 */
export default function TranscriptEditor({
  transcript,
  onChange,
  onCopy,
  onDownload,
}: TranscriptEditorProps) {
  const charCount = transcript.length
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Transcript</h2>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="btn-secondary text-sm"
            disabled={!transcript}
            title="Copy transcript to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={onDownload}
            className="btn-secondary text-sm"
            disabled={!transcript}
            title="Download transcript as .txt file"
          >
            ⬇️ Download
          </button>
        </div>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcript will appear here after fetching..."
        className="input-field font-mono text-sm min-h-[300px] resize-y"
        spellCheck={false}
      />

      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>
          {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters
        </span>
        {transcript && (
          <span className="text-gray-400">Click inside to edit transcript</span>
        )}
      </div>
    </div>
  )
}
