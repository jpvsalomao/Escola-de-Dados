# How to Use Specialized Agents

## Overview

Specialized agents are AI assistants configured with specific expertise, guidelines, and output formats. Each agent is optimized for particular tasks within your content operations.

## Invoking Agents

### Method 1: Direct Task Assignment
Simply describe your task and Claude Code will automatically select the appropriate agent based on the task type.

**Examples:**
```
"Create a LinkedIn post about Python data visualization"
→ Automatically uses linkedin-specialist agent

"Research trending topics in data analytics for Brazil"
→ Automatically uses content-researcher agent

"Design curriculum for a beginner SQL course"
→ Automatically uses course-designer agent
```

### Method 2: Explicit Agent Reference
Reference the specific agent you want to use:

```
"Use the marketing-writer agent to create an email sequence for our new course launch"

"I need the landing-page-builder agent to create a landing page for our Excel course"
```

### Method 3: Slash Commands
Use pre-configured workflows that orchestrate multiple agents:

```
/weekly-content-plan
→ Coordinates content-researcher, linkedin-specialist, and other agents

/launch-course
→ Uses course-designer, landing-page-builder, and marketing-writer agents
```

## Agent Capabilities

### Content Researcher
**Best for:**
- Topic research
- Market trend analysis
- Competitor content review
- Finding authoritative sources
- Identifying content gaps

**Example tasks:**
```
"Research the current state of data science education in Brazil"
"Find trending Python libraries for data analysis"
"Analyze what our competitors are teaching about machine learning"
```

**Output:** Saved to `/content/research/YYYY-MM-DD_topic.md`

### Content Creator
**Best for:**
- Blog posts
- Tutorials
- Educational guides
- Case studies
- Transforming research into content

**Example tasks:**
```
"Create a beginner-friendly tutorial on pandas DataFrames"
"Write a blog post about career paths in data science"
"Transform this research into an engaging article"
```

**Output:**
- Drafts in `/content/raw/`
- Final content in `/content/processed/`
- Reusable components in `/content/reusable/`

### Landing Page Builder
**Best for:**
- Course landing pages
- Lead magnet pages
- Webinar registration pages
- Product pages

**Example tasks:**
```
"Create a landing page for our Python for Data Analysis course"
"Design a lead magnet page for our free Excel guide"
"Write landing page copy for our data visualization workshop"
```

**Output:** Saved to `/marketing/landing-pages/[product-name]/`

### Marketing Writer
**Best for:**
- Email campaigns
- Ad copy
- Promotional content
- Multi-channel campaigns

**Example tasks:**
```
"Write a 5-email welcome sequence for new subscribers"
"Create Facebook ad copy for our data science course"
"Develop promotional content for our workshop"
```

**Output:**
- Emails in `/marketing/email/campaigns/`
- Ads in `/marketing/ads/[platform]/`

### LinkedIn Specialist
**Best for:**
- LinkedIn posts
- Thought leadership content
- Professional networking content
- LinkedIn carousels and articles

**Example tasks:**
```
"Create a LinkedIn post about the importance of data literacy"
"Develop a 5-post series on Python tips for beginners"
"Write a LinkedIn article about our teaching methodology"
```

**Output:** Saved to `/marketing/social-media/linkedin/posts/`

### Course Designer
**Best for:**
- Complete course curriculum
- Module development
- Lesson materials
- Exercises and assessments
- Learning progression

**Example tasks:**
```
"Design a complete curriculum for a beginner Python course"
"Create lesson materials for Module 3 on data visualization"
"Develop exercises and quizzes for this module"
```

**Output:** Saved to `/courses/[course-name]/`

## Working with Multiple Agents

### Sequential Workflow
When tasks depend on previous outputs:

```
1. "Use content-researcher to research Python best practices for data cleaning"
   [Wait for research output]

2. "Now use content-creator to write a blog post based on this research"
   [Wait for blog post]

3. "Use linkedin-specialist to create 3 posts promoting this blog"
   [LinkedIn posts created]
```

### Parallel Workflow
When tasks are independent:

```
"I need:
1. Content-researcher to research SQL optimization techniques
2. LinkedIn-specialist to create a post about our new course
3. Marketing-writer to draft our weekly newsletter

All three can work simultaneously."
```

### Workflow Commands
Use slash commands for pre-orchestrated workflows:

```
/repurpose-content
→ Takes one piece of content
→ Uses multiple agents to adapt it for different channels
→ Saves all versions in appropriate locations
```

## Agent Guidelines

All agents follow these principles:

### 1. Brand Consistency
Every agent references `/references/brand-guidelines/brand-voice.md` to ensure consistent tone and messaging.

### 2. Structured Output
Agents save work in designated directories with clear naming conventions.

### 3. Reusability Focus
Agents identify and extract reusable components that can be used in future content.

### 4. Quality Standards
Each agent has specific quality checklists and best practices built in.

### 5. Context Awareness
Agents consider Brazilian market context and Portuguese language requirements.

## Tips for Effective Agent Use

### Be Specific
**Instead of:** "Create some LinkedIn content"
**Try:** "Create a LinkedIn post for beginners explaining what a DataFrame is in pandas, with a practical example"

### Provide Context
```
"Create a blog post about SQL joins.
Target audience: Beginners who just learned basic SELECT statements
Goal: Help them understand when to use different join types
Include: Real-world examples from e-commerce data"
```

### Reference Existing Work
```
"Use the research in /content/research/2025-10-20_sql-optimization.md
to create a tutorial for intermediate users"
```

### Specify Format and Length
```
"Create a LinkedIn post (max 1500 characters) with:
- Hook about a common data cleaning mistake
- 3 tips to avoid it
- Call to action to download our guide"
```

### Use Iterative Refinement
```
1. "Create initial draft of course curriculum"
2. [Review output]
3. "Expand Module 2 with more hands-on exercises"
4. [Review again]
5. "Add a capstone project at the end"
```

## Common Workflows

### Creating a Blog Post
```
1. "Research trending topics in data visualization for Brazilian market"
2. [Review research, select topic]
3. "Create a comprehensive blog post on [topic] for intermediate readers"
4. [Review draft]
5. "Create 3 LinkedIn posts promoting this blog"
6. "Write an email to our list featuring this content"
```

### Launching a New Course
```
1. /launch-course
2. Provide course details (name, target audience, launch date)
3. System coordinates:
   - Course designer: Finalizes curriculum
   - Landing page builder: Creates landing page
   - Marketing writer: Develops email sequence
   - LinkedIn specialist: Creates announcement series
```

### Weekly Content Production
```
1. /weekly-content-plan
2. System creates plan based on content calendar
3. Execute plan throughout the week using appropriate agents
4. Update progress in weekly plan
```

## Troubleshooting

### Agent Not Producing Expected Output
- Check that you referenced the correct agent
- Ensure you provided enough context
- Review the agent's documentation in `.claude/agents/[agent-name]/agent.md`

### Output Saved in Wrong Location
- Agents follow standard directory structures
- If needed, specify output location explicitly
- Review directory structure in `docs/system-overview.md`

### Inconsistent Brand Voice
- Ensure `/references/brand-guidelines/brand-voice.md` is updated
- All agents reference this file automatically
- Explicitly mention brand voice if needed

### Content Not Reusable Enough
- Ask agent to "identify and extract reusable components"
- Request modular structure
- Specify that you want to repurpose across channels

## Advanced Usage

### Customizing Agent Behavior
Edit agent configuration files to adjust:
- Output format
- Quality standards
- Specific guidelines
- Target metrics

Location: `.claude/agents/[agent-name]/agent.md`

### Creating Agent Workflows
Combine agents into custom slash commands:
1. Create file in `.claude/commands/`
2. Define which agents to use
3. Specify workflow steps
4. Document expected inputs

### Training Agents with Examples
Add examples to agent configuration:
- Best-performing content
- Style preferences
- Common scenarios
- Edge cases to handle

---

**Remember:** Agents are tools to amplify your creativity and productivity. Provide good input, review outputs critically, and iterate to perfection.
