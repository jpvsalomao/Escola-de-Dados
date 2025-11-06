import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import type { TranscriptResponse } from '@/types'

/**
 * Extract video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * POST /api/transcript
 * Fetches transcript for a given YouTube URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'YouTube URL is required' } as TranscriptResponse,
        { status: 400 }
      )
    }

    // Extract video ID
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL format' } as TranscriptResponse,
        { status: 400 }
      )
    }

    // Fetch transcript using youtube-transcript package
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)

    if (!transcriptData || transcriptData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No transcript available for this video. The video may not have captions.',
        } as TranscriptResponse,
        { status: 404 }
      )
    }

    // Combine all segments into a single transcript string
    const transcript = transcriptData.map((segment) => segment.text).join(' ')

    // Return both the full transcript and segments
    const response: TranscriptResponse = {
      success: true,
      transcript,
      segments: transcriptData.map((segment) => ({
        text: segment.text,
        offset: segment.offset,
        duration: segment.duration,
      })),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Transcript fetch error:', error)

    // Handle specific error cases
    if (error.message?.includes('Transcript is disabled')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transcripts are disabled for this video',
        } as TranscriptResponse,
        { status: 404 }
      )
    }

    if (error.message?.includes('Could not find')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Video not found or has no available transcripts',
        } as TranscriptResponse,
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transcript. Please try again.',
      } as TranscriptResponse,
      { status: 500 }
    )
  }
}
