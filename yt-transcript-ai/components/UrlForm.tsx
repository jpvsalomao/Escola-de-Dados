'use client'

interface UrlFormProps {
  url: string
  onUrlChange: (url: string) => void
  onFetch: () => void
  isLoading: boolean
}

/**
 * URL input form for YouTube video
 * Handles URL input and triggers transcript fetch
 */
export default function UrlForm({ url, onUrlChange, onFetch, isLoading }: UrlFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFetch()
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-4">
        <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL
        </label>
        <div className="flex gap-2">
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button type="submit" className="btn-primary" disabled={isLoading || !url.trim()}>
            {isLoading ? 'Fetching...' : 'Fetch Transcript'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Supports youtube.com/watch?v=ID, youtu.be/ID formats
      </p>
    </form>
  )
}
