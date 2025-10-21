# Escola de Dados - Content System Overview

## Introduction

This is a comprehensive content operations system for Escola de Dados, designed to streamline content creation, course development, and marketing activities using Claude Code's specialized agent system.

## System Architecture

### Specialized Agents

The system uses six specialized AI agents, each expert in their domain:

1. **Content Researcher** (`.claude/agents/content-researcher/`)
   - Conducts topic research
   - Analyzes market trends
   - Identifies content opportunities
   - Validates technical accuracy

2. **Content Creator** (`.claude/agents/content-creator/`)
   - Creates blog posts and tutorials
   - Adapts content for different skill levels
   - Optimizes for SEO
   - Generates reusable components

3. **Landing Page Builder** (`.claude/agents/landing-page-builder/`)
   - Designs landing pages
   - Writes conversion-focused copy
   - Structures social proof
   - Optimizes for conversions

4. **Marketing Writer** (`.claude/agents/marketing-writer/`)
   - Creates email campaigns
   - Writes ad copy
   - Develops promotional materials
   - Adapts content across channels

5. **LinkedIn Specialist** (`.claude/agents/linkedin-specialist/`)
   - Creates LinkedIn posts
   - Develops thought leadership content
   - Plans content series
   - Optimizes for engagement

6. **Course Designer** (`.claude/agents/course-designer/`)
   - Designs curriculum
   - Creates lesson materials
   - Develops exercises and assessments
   - Structures learning progression

### Directory Structure

```
Escola-de-Dados/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized agent definitions
│   └── commands/               # Workflow commands
├── content/                    # Content library
│   ├── research/               # Research outputs
│   ├── raw/                    # Draft content
│   ├── processed/              # Published content
│   └── reusable/               # Reusable components
├── courses/                    # Course materials
│   ├── templates/              # Course templates
│   ├── modules/                # Individual modules
│   └── assets/                 # Supporting materials
├── marketing/                  # Marketing content
│   ├── landing-pages/          # Landing pages
│   ├── social-media/           # Social content
│   │   └── linkedin/           # LinkedIn-specific
│   ├── email/                  # Email campaigns
│   └── templates/              # Marketing templates
├── references/                 # Reference materials
│   ├── brand-guidelines/       # Brand voice & style
│   ├── content-frameworks/     # Content frameworks
│   ├── market-research/        # Market data
│   └── competitors/            # Competitor analysis
├── workflows/                  # Operations
│   ├── weekly-plans/           # Weekly content plans
│   ├── content-calendar/       # Editorial calendar
│   └── templates/              # Workflow templates
└── docs/                       # Documentation
    ├── agent-guides/           # Agent usage guides
    └── workflows/              # Process documentation
```

## How to Use the System

### Daily Operations

1. **Check Your Weekly Plan**
   - Review current week's plan in `/workflows/weekly-plans/`
   - See what content is scheduled

2. **Invoke Specialized Agents**
   - Use agents for specific tasks
   - Reference agent documentation in `.claude/agents/[agent-name]/agent.md`

3. **Track Progress**
   - Update content status in weekly plan
   - Note what's completed

### Weekly Workflow

**Monday: Planning**
1. Run `/weekly-content-plan` command
2. Review research from previous week
3. Set content priorities
4. Brief agents on week's work

**Tuesday-Thursday: Creation**
1. Use specialized agents to create content
2. Review and refine outputs
3. Save to appropriate directories
4. Identify reusable components

**Friday: Publishing & Planning Ahead**
1. Schedule/publish completed content
2. Review week's performance
3. Start research for next week
4. Update content calendar

### Common Workflows

#### Creating a LinkedIn Post
```
1. Determine topic and goal
2. Invoke linkedin-specialist agent
3. Reference brand voice guidelines
4. Save to /marketing/social-media/linkedin/posts/
5. Schedule or publish
```

#### Developing Course Content
```
1. Use course-designer agent to outline curriculum
2. Create module structure in /courses/[course-name]/
3. Develop lessons one module at a time
4. Create supporting materials
5. Review and refine
```

#### Launching New Content
```
1. Use content-creator to develop main content
2. Use marketing-writer for promotional emails
3. Use linkedin-specialist for social promotion
4. Coordinate launch timing
5. Track performance
```

## Slash Commands

Quick workflows accessible via `/command-name`:

- `/weekly-content-plan` - Generate weekly content plan
- `/create-linkedin-series` - Create LinkedIn content series
- `/repurpose-content` - Repurpose content across channels
- `/launch-course` - Complete course launch workflow

## Content Reuse Strategy

The system is designed for maximum content reuse:

1. **Create Once, Publish Many**
   - Start with comprehensive research
   - Create primary content piece
   - Adapt for different channels
   - Save reusable components

2. **Reusable Components** (`/content/reusable/`)
   - Definitions and explanations
   - Examples and case studies
   - Common sections (intros, CTAs)
   - Data and statistics

3. **Content Transformation**
   - Blog post → LinkedIn series + Email + Landing page section
   - Course module → Tutorial + LinkedIn posts
   - Research → Multiple blog posts + Social content

## Best Practices

### 1. Always Start with Research
Use content-researcher agent before creating content to ensure accuracy and relevance.

### 2. Follow Brand Guidelines
Reference `/references/brand-guidelines/brand-voice.md` for all content.

### 3. Use Content Frameworks
Apply frameworks from `/references/content-frameworks/` for consistency.

### 4. Document Reusable Content
Tag and save reusable components for future use.

### 5. Track Performance
Note what content performs well to inform future strategy.

### 6. Batch Similar Tasks
Use agents to create multiple related pieces in one session.

### 7. Plan Weekly, Execute Daily
Weekly planning prevents last-minute scrambles.

## Customizing the System

### Adding New Agents
1. Create directory in `.claude/agents/[agent-name]/`
2. Add `agent.md` with role, responsibilities, guidelines
3. Define output format and quality standards

### Creating New Commands
1. Add markdown file to `.claude/commands/`
2. Define workflow steps
3. Specify which agents to use
4. Document expected inputs/outputs

### Updating Brand Guidelines
1. Edit `/references/brand-guidelines/brand-voice.md`
2. All agents will reference updated guidelines
3. Review frequency: Quarterly

## Getting Started

### First Week Setup
1. **Customize Brand Guidelines** - Update with your specific voice and values
2. **Add Reference Materials** - Add any existing brand assets, research, competitor analysis
3. **Create First Weekly Plan** - Use `/weekly-content-plan` command
4. **Start Creating** - Use agents to create your first content pieces

### First Month Goals
- Establish content rhythm (3-5 LinkedIn posts/week)
- Create reusable content library
- Develop 1-2 comprehensive blog posts or tutorials
- Build course outline if launching a course

## Support & Resources

- **Agent Documentation:** `.claude/agents/[agent-name]/agent.md`
- **Workflow Templates:** `/workflows/templates/`
- **Content Frameworks:** `/references/content-frameworks/`
- **Brand Guidelines:** `/references/brand-guidelines/`

---

**System Version:** 1.0
**Last Updated:** 2025-10-21
**Maintained by:** Escola de Dados Team
