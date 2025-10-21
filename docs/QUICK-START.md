# Quick Start Guide - Escola de Dados Content System

Get up and running in 15 minutes.

## Step 1: Understand the System (2 minutes)

You have 6 specialized AI agents:
- **content-researcher** - Finds topics and trends
- **content-creator** - Writes blogs and tutorials
- **landing-page-builder** - Creates landing pages
- **marketing-writer** - Emails and ads
- **linkedin-specialist** - LinkedIn content
- **course-designer** - Course curriculum

Each agent automatically saves work in the right place and follows your brand guidelines.

## Step 2: Set Up Your Brand (5 minutes)

Edit `/references/brand-guidelines/brand-voice.md`:

1. Add your mission and values
2. Define your target audience
3. Set your brand voice characteristics
4. List common phrases you use

This file guides all agents to maintain consistent messaging.

## Step 3: Create Your First Content (5 minutes)

Try these commands:

### Research a Topic
```
"Research trending data science topics for beginners in Brazil"
```
Output saved to: `/content/research/`

### Create a LinkedIn Post
```
"Create a LinkedIn post about why learning Python is valuable for business professionals"
```
Output saved to: `/marketing/social-media/linkedin/posts/`

### Write a Blog Post
```
"Create a beginner-friendly tutorial on how to use Python for data analysis"
```
Output saved to: `/content/processed/`

## Step 4: Plan Your Week (3 minutes)

Run the weekly planning command:
```
/weekly-content-plan
```

This creates a structured plan in `/workflows/weekly-plans/` with:
- LinkedIn post topics
- Blog post ideas
- Content to repurpose
- Tasks for the week

## Your First Week

### Monday
- Run `/weekly-content-plan`
- Review and adjust the plan
- Do any research needed

### Tuesday
- Create 2-3 LinkedIn posts for the week
- "Create 3 LinkedIn posts about [topics from your plan]"

### Wednesday
- Work on blog/tutorial content
- "Create a tutorial on [topic from your plan]"

### Thursday
- Finish and refine content
- Start any course development work

### Friday
- Schedule/publish content
- Review what worked
- Research for next week

## Essential Commands

### Content Research
```
"Research [topic] for [audience level] in Brazilian market"
```

### LinkedIn Content
```
"Create a LinkedIn post about [topic] using the [hook-story-lesson] framework"
```

### Blog/Tutorial
```
"Create a beginner tutorial on [topic] with practical examples"
```

### Repurpose Content
```
"Take this blog post and create 5 LinkedIn posts from it"
```

### Course Development
```
"Design a curriculum for a [level] course on [topic]"
```

## Tips for Success

### 1. Be Specific
**Vague:** "Create content about data"
**Specific:** "Create a LinkedIn post for beginners explaining what a CSV file is with a real example"

### 2. Reference Frameworks
```
"Create a LinkedIn post using the Before-After-Bridge framework"
```
See frameworks in `/references/content-frameworks/`

### 3. Build Your Reusable Library
When you create good content:
```
"Extract the reusable components from this blog post and save them to /content/reusable/"
```

### 4. Batch Similar Tasks
```
"Create 5 LinkedIn posts about Python basics for beginners, one for each weekday, covering:
- Variables
- Lists
- Loops
- Functions
- File handling"
```

### 5. Repurpose Everything
```
"I have a course module on SQL joins. Repurpose it into:
- A blog post
- 3 LinkedIn posts
- An email for my newsletter"
```

## Common Workflows

### Weekly LinkedIn Presence
```
1. "Research trending topics in data science this week"
2. "Create 3 educational LinkedIn posts from this research"
3. "Create 1 personal story post about teaching data skills"
4. "Create 1 engagement post asking a question about [topic]"
```

### Blog Post Creation
```
1. "Research [topic] including latest trends and best practices"
2. "Create a comprehensive blog post on [topic] for [level] readers"
3. "Create 3 LinkedIn posts promoting this blog"
4. "Extract reusable definitions and examples"
```

### Course Development
```
1. "Design a complete curriculum for [course name]"
2. "Create detailed lesson plans for Module 1"
3. "Develop exercises and assessments for Module 1"
4. "Create a landing page for the course"
5. "Create promotional LinkedIn content"
```

## Troubleshooting

### "Agent isn't following my brand voice"
- Update `/references/brand-guidelines/brand-voice.md`
- Be explicit: "Use our brand voice which is accessible and practical"

### "Content isn't at the right level"
- Specify clearly: "for complete beginners" or "for intermediate users"
- Reference existing good content: "similar to [file]"

### "Not sure which agent to use"
- Just describe your task - the system will route to the right agent
- Or explicitly ask: "Which agent should I use to create [task]?"

### "Output isn't where I expected"
- Check the agent's documentation: `.claude/agents/[agent-name]/agent.md`
- Each agent has standard output locations

## Next Steps

After your first week:

1. **Review Performance**
   - What content got engagement?
   - What topics resonated?
   - What took too long?

2. **Build Your Library**
   - Save best-performing content as templates
   - Extract reusable components
   - Document what works

3. **Optimize Your Workflow**
   - Create custom commands for repeated tasks
   - Batch similar content creation
   - Develop your content calendar

4. **Expand**
   - Add email campaigns
   - Develop landing pages
   - Build complete courses

## Resources

- **Full Documentation:** `docs/system-overview.md`
- **Agent Guide:** `docs/agent-guides/how-to-use-agents.md`
- **Templates:** `workflows/templates/`
- **Frameworks:** `references/content-frameworks/`
- **Brand Guidelines:** `references/brand-guidelines/`

## Your First Assignment

Create your first week of LinkedIn content right now:

```
"Create 5 LinkedIn posts for this week about learning data skills:

Monday: Educational post about why SQL is essential
Wednesday: Personal story about a data mistake I made and learned from
Friday: Question post asking the community about their favorite data tools
Weekend: List post with 5 Python tips for beginners
Bonus: Contrarian take on why you don't need a degree for data science

Use varied frameworks and make them engaging for Brazilian professionals wanting to learn data skills."
```

Watch the agents work, review the output, refine as needed, and you're off to the races!

---

**Remember:** The system gets better the more you use it. Your feedback improves the agents, and your reusable library accelerates everything.

Ready? Let's create some amazing content!
