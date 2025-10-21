# Directory Structure

Complete overview of the Escola de Dados content operations system.

```
Escola-de-Dados/
│
├── .claude/                                    # Claude Code Configuration
│   ├── agents/                                 # Specialized AI Agents
│   │   ├── content-researcher/
│   │   │   └── agent.md                        # Research agent config
│   │   ├── content-creator/
│   │   │   └── agent.md                        # Content creation agent config
│   │   ├── landing-page-builder/
│   │   │   └── agent.md                        # Landing page agent config
│   │   ├── marketing-writer/
│   │   │   └── agent.md                        # Marketing agent config
│   │   ├── linkedin-specialist/
│   │   │   └── agent.md                        # LinkedIn agent config
│   │   └── course-designer/
│   │       └── agent.md                        # Course design agent config
│   │
│   └── commands/                               # Workflow Commands
│       ├── weekly-content-plan.md              # Weekly planning workflow
│       ├── create-linkedin-series.md           # LinkedIn series creation
│       ├── repurpose-content.md                # Content repurposing workflow
│       └── launch-course.md                    # Course launch workflow
│
├── content/                                    # Content Library
│   ├── research/                               # Research Outputs
│   │   └── YYYY-MM-DD_topic-name.md
│   ├── raw/                                    # Draft Content
│   │   └── YYYY-MM-DD_content-title.md
│   ├── processed/                              # Published Content
│   │   └── YYYY-MM-DD_content-title.md
│   └── reusable/                               # Reusable Components
│       ├── README.md                           # Guide to reusable content
│       ├── definitions/                        # Technical definitions
│       ├── examples/                           # Code examples & case studies
│       ├── explanations/                       # Concept explanations
│       ├── intros/                             # Opening paragraphs
│       ├── ctas/                               # Call-to-action snippets
│       └── statistics/                         # Data points & research
│
├── courses/                                    # Course Materials
│   ├── templates/                              # Course Templates
│   │   └── course-structure-template.md
│   ├── modules/                                # Course Modules
│   │   └── [course-name]/
│   │       ├── curriculum.md
│   │       └── module-01/
│   │           ├── overview.md
│   │           ├── lesson-01.md
│   │           ├── exercises.md
│   │           └── assessment.md
│   └── assets/                                 # Course Assets
│       ├── datasets/
│       ├── code-examples/
│       └── supplementary-materials/
│
├── marketing/                                  # Marketing Materials
│   ├── landing-pages/                          # Landing Pages
│   │   └── [product-name]/
│   │       ├── index.html
│   │       ├── copy.md
│   │       └── assets/
│   ├── social-media/                           # Social Media Content
│   │   ├── instagram/
│   │   └── linkedin/                           # LinkedIn Content
│   │       ├── posts/
│   │       │   └── YYYY-MM-DD_post-topic.md
│   │       ├── carousels/
│   │       ├── articles/
│   │       └── content-calendar.md
│   ├── email/                                  # Email Campaigns
│   │   ├── campaigns/
│   │   │   └── [campaign-name]/
│   │   │       ├── email-1-subject.md
│   │   │       └── email-2-subject.md
│   │   └── templates/
│   └── templates/                              # Marketing Templates
│       ├── email-template.md
│       └── ad-copy-template.md
│
├── references/                                 # Reference Materials
│   ├── brand-guidelines/                       # Brand Guidelines
│   │   └── brand-voice.md                      # Brand voice & style guide
│   ├── content-frameworks/                     # Content Frameworks
│   │   ├── README.md                           # Frameworks overview
│   │   ├── tutorial-framework.md               # Tutorial structure
│   │   └── linkedin-frameworks.md              # LinkedIn content frameworks
│   ├── market-research/                        # Market Research
│   │   └── [research-files]
│   └── competitors/                            # Competitor Analysis
│       └── [competitor-analysis-files]
│
├── workflows/                                  # Weekly Operations
│   ├── weekly-plans/                           # Weekly Content Plans
│   │   └── YYYY-MM-DD_weekly-plan.md
│   ├── content-calendar/                       # Editorial Calendar
│   │   ├── README.md                           # Calendar guide
│   │   ├── 2025-Q1.md
│   │   └── monthly/
│   │       └── 2025-01-january.md
│   └── templates/                              # Workflow Templates
│       ├── weekly-plan-template.md
│       └── content-brief-template.md
│
├── docs/                                       # Documentation
│   ├── system-overview.md                      # Complete system guide
│   ├── QUICK-START.md                          # Quick start guide
│   ├── agent-guides/                           # Agent Usage Guides
│   │   └── how-to-use-agents.md
│   └── workflows/                              # Workflow Documentation
│
├── .gitignore                                  # Git ignore file
├── README.md                                   # Main documentation
├── STRUCTURE.md                                # This file
└── Test                                        # Original test file

```

## Key Directories Explained

### `.claude/`
Claude Code configuration for specialized agents and workflow commands.

**Purpose:** Define AI agent behavior and automated workflows
**Who uses it:** System administrators, when customizing agent behavior
**Update frequency:** When adding new agents or workflows

### `content/`
Complete content library from research to published content.

**Purpose:** Store all content at every stage of production
**Who uses it:** All agents, for creating and referencing content
**Update frequency:** Daily/weekly as content is created

### `courses/`
All course-related materials organized by course.

**Purpose:** Centralized course development and management
**Who uses it:** course-designer agent, instructors
**Update frequency:** Ongoing during course development

### `marketing/`
Marketing content across all channels.

**Purpose:** Organize promotional and marketing materials
**Who uses it:** marketing-writer, linkedin-specialist, landing-page-builder agents
**Update frequency:** Daily/weekly

### `references/`
Reference materials that guide content creation.

**Purpose:** Maintain brand consistency and content quality
**Who uses it:** All agents reference these for guidelines
**Update frequency:** Monthly/quarterly reviews

### `workflows/`
Operational planning and execution tracking.

**Purpose:** Plan and track weekly content operations
**Who uses it:** Content team for planning and coordination
**Update frequency:** Weekly

### `docs/`
System documentation and guides.

**Purpose:** Help users understand and use the system effectively
**Who uses it:** All team members
**Update frequency:** As system evolves

## File Naming Conventions

### Date-Prefixed Files
Format: `YYYY-MM-DD_descriptive-name.md`

Examples:
- `2025-10-21_python-tutorials-research.md`
- `2025-10-21_sql-basics-tutorial.md`
- `2025-10-21_weekly-plan.md`

**Why:** Easy to sort chronologically, find recent work

### Agent Configuration Files
Always named: `agent.md`

**Location:** `.claude/agents/[agent-name]/agent.md`
**Why:** Standard location Claude Code looks for agent definitions

### Template Files
Suffix: `-template.md`

Examples:
- `weekly-plan-template.md`
- `content-brief-template.md`
- `course-structure-template.md`

**Why:** Clearly identifies files meant to be copied/reused

## Content Flow

```
Research → Raw Content → Processed Content → Published
   ↓           ↓              ↓                 ↓
   |           |              |                 |
   └───────────┴──────────────┴────> Reusable Components
```

1. **Research** (`/content/research/`) - Initial topic research
2. **Raw** (`/content/raw/`) - Draft content
3. **Processed** (`/content/processed/`) - Finalized content
4. **Reusable** (`/content/reusable/`) - Components extracted at any stage

## Agent-to-Directory Mapping

| Agent | Primary Output Directory | Secondary Directories |
|-------|-------------------------|---------------------|
| content-researcher | `/content/research/` | `/references/market-research/` |
| content-creator | `/content/processed/` | `/content/raw/`, `/content/reusable/` |
| landing-page-builder | `/marketing/landing-pages/` | - |
| marketing-writer | `/marketing/email/`, `/marketing/ads/` | `/marketing/templates/` |
| linkedin-specialist | `/marketing/social-media/linkedin/` | - |
| course-designer | `/courses/` | `/content/reusable/` |

## Workflow-to-Directory Mapping

| Workflow | Directories Used |
|----------|-----------------|
| Weekly planning | `/workflows/weekly-plans/`, `/workflows/content-calendar/` |
| Content creation | `/content/research/` → `/content/raw/` → `/content/processed/` |
| LinkedIn posting | `/marketing/social-media/linkedin/posts/` |
| Course development | `/courses/[course-name]/` |
| Course launch | `/courses/`, `/marketing/landing-pages/`, `/marketing/email/` |

## Growth Over Time

### Week 1
```
content/
├── research/ (5-10 files)
├── processed/ (3-5 files)
└── reusable/ (starting to build)
```

### Month 3
```
content/
├── research/ (40+ files)
├── processed/ (20+ files)
└── reusable/ (robust library of components)

courses/
└── [first-course]/ (complete curriculum)
```

### Month 6
```
All directories well-populated
- Established content rhythm
- Multiple courses developed
- Rich reusable component library
- Proven content frameworks
- Optimized workflows
```

## Maintenance

### Daily
- Add new content to appropriate directories
- Update weekly plans
- Create and refine content

### Weekly
- Archive completed weekly plans
- Update content calendar
- Review what content performed well

### Monthly
- Audit reusable components
- Update templates based on learnings
- Review and refine content frameworks

### Quarterly
- Update brand guidelines
- Reorganize if needed
- Archive old content
- System optimization

---

**This structure is designed to:**
- Scale with your business
- Maintain organization as content grows
- Enable content reuse
- Support multiple content workflows
- Keep brand consistency

**Start simple, grow naturally.**
