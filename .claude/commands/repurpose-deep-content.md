Analyze and repurpose a deep content piece into 50+ strategic content pieces across multiple channels.

This command uses the content-analyzer agent to extract maximum value from pillar content.

## Process

### 1. Content Analysis (content-analyzer agent)
- Read the deep content piece completely
- Identify key themes, insights, and frameworks
- Extract quotable statements (15-20)
- Map content structure and hierarchy
- Identify standalone sections
- Assess audience fit for different sections
- Determine optimal formats for each insight
- Save analysis to `/content/repurposed/[source-title]/analysis.md`

### 2. Strategic Repurposing Plan (content-analyzer agent)
Create comprehensive plan for:
- **15-20 LinkedIn posts** (varied formats: hooks-story-lesson, lists, data posts, etc.)
- **8-12 blog post spin-offs** (different angles and depths)
- **5-7 email series** (progressive education)
- **3-5 course module ideas** (learning progression)
- **2-3 infographic concepts** (visual content)
- **5-8 video scripts** (different lengths and styles)
- **10-15 social snippets** (quote cards, stat cards, tips)
- **2-3 lead magnet ideas** (downloadable resources)

Save plan to `/content/repurposed/[source-title]/repurposing-plan.md`

### 3. Prioritization (content-analyzer agent)
Organize repurposed content by:
- High Priority: Create immediately (LinkedIn posts, key blog posts)
- Medium Priority: Create week 2-3 (email series, additional blogs)
- Long-term: Create over time (videos, lead magnets, course modules)

### 4. Implementation Timeline
Create 4-6 week execution plan:
- Week 1: LinkedIn posts 1-5, Blog post 1, Social snippets
- Week 2: LinkedIn posts 6-10, Blog posts 2-3, Email series start
- Week 3: LinkedIn posts 11-15, Blog posts 4-5, Email series complete
- Week 4+: Remaining LinkedIn, videos, lead magnets, course modules

### 5. Content Creation (content-analyzer with other agents)
Begin creating repurposed pieces:
- Use linkedin-specialist for LinkedIn posts
- Use content-creator for blog posts
- Use marketing-writer for email series
- Use course-designer for module outlines
- Content-analyzer coordinates and ensures consistency

### 6. Organization & Tracking
- Save all repurposed content to `/content/repurposed/[source-title]/`
- Maintain content relationship map
- Track what's created vs planned
- Monitor performance of repurposed pieces

## User Inputs Required

Ask the user:
1. **Source Content:** Which deep content piece to repurpose?
2. **Priority Focus:** Which channels are most important? (LinkedIn, blog, email, course)
3. **Timeline:** How quickly do you need the content?
4. **Execution Mode:**
   - "Plan Only" - Create repurposing plan, user executes
   - "High Priority" - Create plan + high priority pieces (5-10 pieces)
   - "Full Service" - Create plan + all pieces (50+ pieces over time)

## Output Structure

```
/content/repurposed/[source-title]/
├── analysis.md
├── repurposing-plan.md
├── implementation-timeline.md
├── linkedin/
│   ├── post-01-[type]-[topic].md
│   ├── post-02-[type]-[topic].md
│   └── [15-20 total]
├── blog-posts/
│   ├── [topic]-beginners-guide.md
│   ├── [topic]-deep-dive.md
│   └── [8-12 total]
├── email-series/
│   └── [series-name]/
│       ├── email-01-welcome.md
│       └── [5-7 total]
├── course-modules/
│   └── module-outline.md
├── video-scripts/
│   └── [5-8 scripts]
├── lead-magnets/
│   └── [2-3 outlines]
└── social-snippets/
    └── snippets-collection.md
```

## Example Usage

User: "/repurpose-deep-content"

System asks:
- Source: "Python for Data Analysis - Complete Guide"
- Priority: "LinkedIn and Blog"
- Timeline: "4 weeks"
- Mode: "High Priority"

System then:
1. Analyzes the 7000-word guide
2. Creates repurposing plan for 60+ pieces
3. Immediately creates:
   - 10 LinkedIn posts (varied formats)
   - 3 blog post spin-offs
   - Outlines for remaining content
4. Provides 4-week implementation timeline
5. Saves everything organized by channel

## Success Criteria

- Minimum 50 pieces identified in repurposing plan
- Each piece adds standalone value
- Multiple channels covered
- All audience levels addressed
- Content funnel complete (awareness → conversion)
- Maintains factual accuracy and brand voice
- Clear implementation timeline
- Organized file structure

## Collaboration Notes

This command coordinates multiple agents:
- **content-analyzer:** Leads the repurposing strategy
- **linkedin-specialist:** Creates LinkedIn posts
- **content-creator:** Creates blog posts
- **marketing-writer:** Creates email series
- **course-designer:** Creates module outlines

All work from the same source truth (deep content) while optimizing for their channel.

## Content Reuse Philosophy

Remember: You're not just dividing content. You're:
- Extracting insights for different contexts
- Adapting depth for different audiences
- Optimizing format for different channels
- Creating a content ecosystem where pieces reinforce each other
- Maximizing ROI on deep content investment

One 5000-word deep piece = 3-6 months of multi-channel content
