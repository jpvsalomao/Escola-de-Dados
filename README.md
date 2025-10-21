# Escola de Dados - Content Operations System

An intelligent, agent-based content operations system designed to streamline content creation, course development, and marketing for your edtech business.

## What is This?

This repository contains a complete content operations framework that uses specialized AI agents to handle different aspects of running Escola de Dados:

- **Content Research & Creation** - Research topics, create blog posts, tutorials, and educational content
- **Course Development** - Design curriculum, create lessons, develop exercises
- **Marketing** - Landing pages, email campaigns, ad copy
- **LinkedIn Management** - Thought leadership posts, engagement content, series
- **Content Reuse** - Strategic repurposing across channels

## Key Features

### 6 Specialized Agents

Each agent is an expert in their field:

1. **Content Researcher** - Market trends, topic research, competitor analysis
2. **Content Creator** - Blog posts, tutorials, educational content
3. **Landing Page Builder** - High-converting landing pages
4. **Marketing Writer** - Emails, ads, promotional content
5. **LinkedIn Specialist** - Professional networking content
6. **Course Designer** - Complete curriculum and lesson development

### Organized Workflow

```
.claude/          → Agent configurations and commands
content/          → Content library (research, drafts, published, reusable)
courses/          → Course materials and modules
marketing/        → Landing pages, emails, social media
references/       → Brand guidelines, frameworks, research
workflows/        → Weekly plans, content calendar
docs/             → System documentation
```

### Strategic Content Reuse

Create once, publish everywhere:
- Transform blog posts into LinkedIn series
- Turn course modules into tutorials
- Repurpose research into multiple formats
- Build a library of reusable components

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

- `/weekly-content-plan` - Generate your weekly content plan
- `/create-linkedin-series` - Create a multi-post LinkedIn series
- `/repurpose-content` - Adapt content across channels
- `/launch-course` - Complete course launch workflow

## Directory Guide

### `.claude/`
Configuration for specialized agents and workflow commands.

### `content/`
Your content library organized by stage:
- `research/` - Research outputs
- `raw/` - Drafts and work in progress
- `processed/` - Published content
- `reusable/` - Components to reuse

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

## Content Reuse Strategy

### Example: From Course Module to Multi-Channel Content

1. **Create** course module on "Data Cleaning with Pandas"
2. **Extract** key concepts as blog post
3. **Transform** into 5-post LinkedIn series
4. **Repurpose** as email tutorial series
5. **Save** code examples and definitions as reusable components
6. **Reference** in future related content

Result: One creation effort → 5+ content pieces → Growing reusable library

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

- **System Overview:** `docs/system-overview.md`
- **Agent Guide:** `docs/agent-guides/how-to-use-agents.md`
- **Agent Details:** `.claude/agents/[agent-name]/agent.md`
- **Templates:** `workflows/templates/`

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

### Launching a New Course
```
1. Use course-designer to create curriculum
2. Use landing-page-builder for course page
3. Use marketing-writer for email sequence
4. Use linkedin-specialist for announcement series
5. Coordinate launch using /launch-course command
```

### Content Marketing Campaign
```
1. Research topic with content-researcher
2. Create comprehensive blog post
3. Repurpose into LinkedIn series
4. Create email campaign
5. Extract reusable components
```

### Weekly LinkedIn Presence
```
1. Plan 3-5 posts in weekly plan
2. Use linkedin-specialist for creation
3. Mix educational, storytelling, and engagement posts
4. Maintain consistent schedule
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
**Version:** 1.0
**Last Updated:** 2025-10-21

**Ready to start?** Run `/weekly-content-plan` and begin your first week with Escola de Dados content operations system!
