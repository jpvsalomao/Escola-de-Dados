# Escola de Dados - Content Operations System

An intelligent, agent-based content operations system designed to streamline content creation, course development, and marketing for your edtech business.

## What is This?

This repository contains a complete content operations framework that uses specialized AI agents to handle different aspects of running Escola de Dados:

- **Content Research & Creation** - Research topics, create blog posts, tutorials, and educational content
- **Deep Content Creation** - 5000+ word authoritative guides that establish thought leadership
- **Content Multiplication** - Turn one deep piece into 50+ strategic content pieces
- **Course Development** - Design curriculum, create lessons, develop exercises
- **Marketing** - Landing pages, email campaigns, ad copy
- **LinkedIn Management** - Thought leadership posts, engagement content, series
- **Strategic Content Reuse** - Maximum ROI through intelligent repurposing

## Key Features

### 8 Specialized Agents

Each agent is an expert in their field:

1. **Content Researcher** - Market trends, topic research, competitor analysis
2. **Content Creator** - Blog posts, tutorials, educational content
3. **Deep Content Writer** - 5000-10000 word authoritative pillar content
4. **Content Analyzer** - Repurposes deep content into 50+ strategic pieces
5. **Landing Page Builder** - High-converting landing pages
6. **Marketing Writer** - Emails, ads, promotional content
7. **LinkedIn Specialist** - Professional networking content
8. **Course Designer** - Complete curriculum and lesson development

### Organized Workflow

```
.claude/          → Agent configurations and commands
content/          → Content library (research, drafts, published, reusable)
  ├── deep-content/      → Authoritative 5000+ word pillar content
  └── repurposed/        → 50+ pieces from each deep content
courses/          → Course materials and modules
marketing/        → Landing pages, emails, social media
references/       → Brand guidelines, frameworks, audience research
workflows/        → Weekly plans, content calendar
docs/             → System documentation
```

### Strategic Content Multiplication

**The Deep Content System:**
- Create one 5000+ word authoritative piece
- Automatically analyze and identify 50+ repurposing opportunities
- Generate LinkedIn posts, blog posts, emails, course modules, videos, and more
- Fill 3-6 months of content calendar from one piece

**Example:** One "Complete Guide to Python for Data Analysis" (7000 words) becomes:
- 18 LinkedIn posts
- 12 blog posts
- 7-email series
- 5 course modules
- 8 video scripts
- 15 social snippets

**Result:** One creation effort → 65+ strategic pieces → Months of content

### Weekly Operations

Designed around your actual workflow:
- Monday: Planning (use `/weekly-content-plan`)
- Tue-Thu: Creation (leverage specialized agents)
- Friday: Publishing & next week prep

## Quick Start

### 1. Customize Your Brand

Edit `/references/brand-guidelines/brand-voice.md` with your:
- Mission and values
- Voice and tone
- Target audience
- Content pillars

### 2. Create Your First Weekly Plan

```
/weekly-content-plan
```

This will generate a structured plan based on your content calendar.

### 3. Start Creating

Use specialized agents for different tasks:

**Research a topic:**
```
"Research trending data science topics in Brazil"
```

**Create LinkedIn content:**
```
"Create a LinkedIn post about the importance of learning SQL"
```

**Develop course content:**
```
"Design a curriculum for a beginner Python for Data Analysis course"
```

**Build a landing page:**
```
"Create a landing page for our Excel for Business course"
```

## Common Commands

### Standard Operations
- `/weekly-content-plan` - Generate your weekly content plan
- `/create-linkedin-series` - Create a multi-post LinkedIn series
- `/repurpose-content` - Adapt content across channels
- `/launch-course` - Complete course launch workflow

### Deep Content System (NEW!)
- `/create-deep-content` - Create 5000+ word authoritative pillar content
- `/repurpose-deep-content` - Turn deep content into 50+ strategic pieces
- `/deep-content-sprint` - Complete workflow: research → create → repurpose

## Directory Guide

### `.claude/`
Configuration for specialized agents and workflow commands.

### `content/`
Your content library organized by stage:
- `research/` - Research outputs
- `raw/` - Drafts and work in progress
- `processed/` - Published content
- `deep-content/` - Authoritative 5000+ word pillar content
- `repurposed/` - 50+ pieces from each deep content source
- `reusable/` - Components to reuse across all content

### `courses/`
Course materials organized by course name:
- `templates/` - Course templates
- `modules/` - Individual course modules
- `assets/` - Supporting materials

### `marketing/`
All marketing content:
- `landing-pages/` - Product landing pages
- `social-media/linkedin/` - LinkedIn content
- `email/` - Email campaigns
- `templates/` - Marketing templates

### `references/`
Reference materials agents use:
- `brand-guidelines/` - Your brand voice and style
- `content-frameworks/` - Proven content structures
- `audience-research/` - Target customer profiles and needs
- `content-strategy/` - Trending topics tracker
- `market-research/` - Market data and insights
- `competitors/` - Competitor analysis

### `workflows/`
Operational planning:
- `weekly-plans/` - Week-by-week content plans
- `content-calendar/` - Editorial calendar
- `templates/` - Planning templates

### `docs/`
System documentation:
- `system-overview.md` - Complete system guide
- `deep-content-system-guide.md` - Deep content multiplication system
- `QUICK-START.md` - 15-minute quick start guide
- `agent-guides/` - How to use each agent
- `workflows/` - Process documentation

## Best Practices

1. **Always Start with Research** - Use the content-researcher agent before creating
2. **Follow Brand Guidelines** - Consistent voice builds trust
3. **Use Content Frameworks** - Proven structures for better results
4. **Save Reusable Components** - Build your content library over time
5. **Plan Weekly, Execute Daily** - Stay organized and consistent
6. **Batch Similar Tasks** - More efficient agent usage
7. **Track What Works** - Learn and improve continuously

## Content Multiplication Strategy

### The Deep Content System

**How it works:**

1. **Research** - Deep dive into trending/relevant topic for your target customer
2. **Create** - Write comprehensive 5000-10000 word authoritative guide
3. **Analyze** - Content analyzer identifies 50+ repurposing opportunities
4. **Repurpose** - Create LinkedIn posts, blogs, emails, videos, course modules, and more
5. **Publish** - Fill 3-6 months of content calendar across all channels

**Real Example:** "Complete Guide to Data Career Transition in Brazil" (7500 words)

**Becomes:**
- 18 LinkedIn posts (educational, personal stories, data-driven)
- 12 blog posts (beginner guides, deep dives, how-tos)
- 7-email "Career Transition" series
- 5 course modules for "Data Career Launchpad" course
- 8 video scripts (overviews, tutorials, interviews)
- 3 infographics (career paths, salary data, skill roadmap)
- 15 social media snippets (quote cards, stat cards)
- 2 lead magnets (career roadmap PDF, skills checklist)

**Result:** 1 deep piece → 65+ strategic pieces → 5 months of content → Thought leadership established

### Traditional Content Reuse (Still Powerful)

**Example:** Course Module to Multi-Channel Content

1. **Create** course module on "Data Cleaning with Pandas"
2. **Extract** key concepts as blog post
3. **Transform** into 5-post LinkedIn series
4. **Repurpose** as email tutorial series
5. **Save** code examples and definitions as reusable components

Result: One creation effort → 8+ content pieces → Growing reusable library

## Weekly Workflow

### Monday: Planning
- Run `/weekly-content-plan`
- Review content calendar
- Set week's priorities

### Tuesday-Thursday: Creation
- Use specialized agents for content production
- Review and refine outputs
- Identify reusable components

### Friday: Publishing & Prep
- Publish/schedule completed content
- Review performance
- Start research for next week

## System Requirements

- Claude Code installed and configured
- This repository cloned locally
- Basic understanding of your target audience and content goals

## Getting Help

- **Quick Start:** `docs/QUICK-START.md` - Get going in 15 minutes
- **System Overview:** `docs/system-overview.md` - Complete system guide
- **Deep Content Guide:** `docs/deep-content-system-guide.md` - Content multiplication system
- **Agent Guide:** `docs/agent-guides/how-to-use-agents.md` - How to use each agent
- **Agent Details:** `.claude/agents/[agent-name]/agent.md` - Individual agent docs
- **Templates:** `workflows/templates/` - Ready-to-use templates

## Customization

### Add New Agents
1. Create directory: `.claude/agents/[agent-name]/`
2. Add `agent.md` with role and guidelines
3. Start using in your workflows

### Create New Commands
1. Add file: `.claude/commands/[command-name].md`
2. Define workflow steps
3. Invoke with `/command-name`

### Update Brand Voice
Edit `/references/brand-guidelines/brand-voice.md` - all agents automatically use updated guidelines.

## Example Use Cases

### Deep Content Sprint (Build Authority + 3-6 Months of Content)
```
1. Run /deep-content-sprint
2. Choose validated topic: "Complete Python for Data Analysis Guide"
3. Deep-content-writer creates 7000-word comprehensive guide
4. Content-analyzer identifies 60+ repurposing opportunities
5. System creates:
   - 18 LinkedIn posts
   - 12 blog posts
   - 7-email series
   - 5 course modules
   - 8 video scripts
   - 15 social snippets
6. Result: Months of content + thought leadership + course foundation
```

### Launching a New Course
```
1. Use course-designer to create curriculum
2. Use deep-content-writer to create authoritative guide on course topic
3. Use landing-page-builder for course page
4. Use marketing-writer for email sequence
5. Use content-analyzer to repurpose guide into promotional content
6. Coordinate launch using /launch-course command
```

### Content Marketing Campaign
```
1. Research topic with content-researcher
2. Create deep content with deep-content-writer (5000+ words)
3. Use content-analyzer to repurpose into 50+ pieces
4. Distribute across LinkedIn, blog, email, and social
5. Fill content calendar for 3-6 months
```

### Weekly LinkedIn Presence
```
Option 1 - Traditional:
1. Plan 3-5 posts in weekly plan
2. Use linkedin-specialist for creation
3. Mix educational, storytelling, and engagement posts

Option 2 - Deep Content Powered:
1. Create one deep content piece per quarter
2. Repurpose into 15-20 LinkedIn posts
3. Post 3-5x per week for 4-6 weeks
4. Never run out of quality content
```

## Success Metrics

Track your content operations:
- Content pieces created per week
- LinkedIn engagement rate
- Email open/click rates
- Course enrollments
- Content reuse ratio (how often you repurpose)
- Time saved vs. manual creation

## Support & Community

- Documentation: `/docs/`
- Templates: `/workflows/templates/` and `/references/content-frameworks/`
- Examples: Throughout agent configuration files

---

**Built with:** Claude Code Agent System
**Version:** 2.0 - Now with Deep Content Multiplication System
**Last Updated:** 2025-10-21

**Ready to start?**
- **Quick wins:** Run `/weekly-content-plan` for your first week
- **Build authority:** Run `/deep-content-sprint` to create months of content from one piece
- **Learn the system:** Read `docs/QUICK-START.md`
