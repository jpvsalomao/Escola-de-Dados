# YouTube → Transcript → AI Workspace

A modern web application that fetches YouTube transcripts and applies GenAI actions like summarization, outlining, key points extraction, Q&A generation, and structured JSON output.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

## Features

✨ **Core Functionality**
- Fetch transcripts from any YouTube video with captions
- Edit transcripts in-place before processing
- Choose from 5 AI actions:
  - 📝 **Summarize**: Concise summary (under 300 words)
  - 📋 **Outline**: Hierarchical structured outline
  - 🎯 **Key Points**: Extract 5 main bullets
  - ❓ **Q&A**: Generate 10 questions and answers
  - 🔧 **JSON Structure**: Convert to structured data

🤖 **LLM Provider Support**
- Anthropic Claude (Sonnet 3.5)
- OpenAI GPT-4o
- Easy switching via environment variable

🎨 **UX Enhancements**
- Real-time character and word counter
- Token usage and cost estimation
- Copy to clipboard and download (.txt, .json)
- Keyboard shortcut: `Cmd/Ctrl + Enter` to re-run last action
- Responsive design with Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18.17+ or later
- npm, yarn, or pnpm
- API key for either Anthropic or OpenAI

### Installation

```bash
# Clone or navigate to project directory
cd yt-transcript-ai

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure your LLM provider:

```env
# Choose provider: "anthropic" or "openai"
LLM_PROVIDER=anthropic

# Add your API key (only one required based on provider)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
```

**Get API Keys:**
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/api-keys

### Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage Guide

### Step 1: Fetch Transcript
1. Paste a YouTube URL (supports `youtube.com/watch?v=...` and `youtu.be/...` formats)
2. Click "Fetch Transcript"
3. The transcript will load in the editor below

### Step 2: (Optional) Edit Transcript
- Click inside the transcript editor to make manual edits
- Useful for fixing transcription errors or removing irrelevant content

### Step 3: Apply AI Action
- Choose one of the 5 AI action buttons
- Wait for the AI to process (typically 3-10 seconds)
- View the result in the Result Card below

### Step 4: Export or Copy
- Use the **Copy** button to copy to clipboard
- Use the **Download** button to save as `.txt` or `.json`

### Keyboard Shortcuts
- `Cmd/Ctrl + Enter`: Re-run the last AI action (useful for iterating after editing transcript)

## Project Architecture

```
yt-transcript-ai/
├── app/
│   ├── api/
│   │   ├── transcript/
│   │   │   └── route.ts          # Fetch YouTube transcripts
│   │   └── ai/
│   │       └── route.ts          # Process AI actions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles + Tailwind
├── components/
│   ├── UrlForm.tsx               # YouTube URL input
│   ├── TranscriptEditor.tsx      # Transcript viewer/editor
│   ├── ActionsBar.tsx            # AI action buttons
│   └── ResultCard.tsx            # AI result display
├── lib/
│   └── llm.ts                    # LLM adapter (Anthropic/OpenAI)
├── types/
│   └── index.ts                  # TypeScript type definitions
├── public/                       # Static assets
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── README.md                     # This file
```

## Technical Details

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Transcript Library**: `youtube-transcript` (npm)
- **AI SDKs**: `@anthropic-ai/sdk`, `openai`

### API Routes

#### `POST /api/transcript`
Fetches transcript from YouTube URL.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "transcript": "Full transcript text...",
  "segments": [
    { "text": "...", "offset": 0, "duration": 1000 }
  ]
}
```

#### `POST /api/ai`
Executes AI action on transcript.

**Request:**
```json
{
  "action": "summarize",
  "transcript": "Transcript text..."
}
```

**Response:**
```json
{
  "success": true,
  "result": "AI-generated output...",
  "tokensUsed": 1500,
  "estimatedCost": 0.0045
}
```

### LLM Adapter
The `lib/llm.ts` file provides a unified interface for both Anthropic and OpenAI:
- Automatically routes requests based on `LLM_PROVIDER`
- Handles API key validation
- Provides token usage tracking
- Estimates costs based on provider rates

## Error Handling

The app handles common errors gracefully:
- ❌ Invalid YouTube URL format
- ❌ Video without transcripts/captions
- ❌ Missing API keys
- ❌ Rate limiting
- ❌ Network errors

Error messages are displayed prominently at the top of the page.

## Roadmap (v2)

Future enhancements planned:
- [ ] Whisper fallback for videos without transcripts
- [ ] Handle long transcripts with chunking
- [ ] Export to Markdown and PDF
- [ ] Save sessions with localStorage
- [ ] Batch processing for multiple videos
- [ ] Custom prompt templates

## Development Principles

This project follows clean architecture:
- **Separation of Concerns**: UI, logic, and API are cleanly separated
- **Type Safety**: Full TypeScript coverage
- **Modularity**: Easy to extend with new AI actions
- **Readability**: Inline comments explain "why" over "how"
- **Scalability**: Structured for future enhancements

## Troubleshooting

### "No transcript available"
- The video may not have captions enabled
- Try a different video with auto-generated or manual captions

### "API key is not configured"
- Check your `.env` file exists in the project root
- Verify the API key is correctly copied (no extra spaces)
- Restart the dev server after changing `.env`

### Rate limiting
- Both Anthropic and OpenAI have rate limits on free tiers
- Wait a few minutes before retrying
- Consider upgrading to a paid tier for higher limits

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a pull request

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Anthropic Claude API](https://www.anthropic.com/)
- [OpenAI API](https://openai.com/)
- [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Questions or feedback?** Open an issue on GitHub or reach out to the maintainer.
