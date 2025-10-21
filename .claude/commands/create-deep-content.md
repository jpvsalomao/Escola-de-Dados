Create a comprehensive deep content piece (5000-10000 words) on a specified topic.

This command orchestrates a complete deep content creation workflow:

## Process

### 1. Topic Validation (deep-content-writer + content-researcher)
- Validate topic against `/references/content-strategy/trending-topics-tracker.md`
- Review target customer fit in `/references/audience-research/target-customer-profile.md`
- Ensure topic meets validation framework (search volume, competition, business alignment)

### 2. Deep Research Phase (content-researcher agent)
- Conduct comprehensive research on the topic
- Gather 10+ authoritative sources
- Identify Brazilian market data
- Find case studies and examples
- Research competitor content
- Analyze keyword opportunities
- Save research to `/content/research/`

### 3. Content Planning (deep-content-writer agent)
- Create detailed content outline (3000-10000 words planned)
- Identify repurposing opportunities
- Plan frameworks and methodologies
- Structure for multiple skill levels
- Mark reusable sections
- Save outline to `/content/deep-content/drafts/`

### 4. Content Creation (deep-content-writer agent)
- Write comprehensive deep content following template
- Include:
  - Executive summary
  - Comprehensive main content (multiple sections)
  - Original frameworks/methodologies
  - Case studies and examples
  - Data and statistics
  - Expert perspectives (if available)
  - FAQ section (15+ questions)
  - Implementation guide
  - Complete references (10+ sources)
  - Repurposing map for content-analyzer

### 5. Quality Assurance
- Verify word count (minimum 3000 words)
- Check source citations (minimum 10)
- Validate Brazilian market relevance
- Ensure multiple skill levels addressed
- Confirm repurposing potential identified
- Review against quality checklist

### 6. Finalization
- Save to `/content/deep-content/published/YYYY-MM-DD_topic-title/`
- Extract reusable components to `/content/reusable/`
- Create repurposing handoff for content-analyzer agent
- Update content calendar

## User Inputs Required

Ask the user for:
1. **Topic:** What is the deep content about?
2. **Primary Audience:** Which target customer segment? (career changers, upskilling professionals, students)
3. **Skill Level Coverage:** Beginner only, intermediate, advanced, or all levels?
4. **Strategic Goal:** Build authority, support course launch, SEO play, or thought leadership?
5. **Timeline:** When is this needed? (affects depth and research time)
6. **Unique Angle:** What makes our perspective different?

## Output

- Deep content saved to `/content/deep-content/published/`
- Research notes in `/content/research/`
- Reusable components in `/content/reusable/`
- Repurposing map ready for content-analyzer agent

## Example Usage

User: "/create-deep-content"

System asks for:
- Topic: "Python for Data Analysis"
- Audience: "Career changers"
- Level: "Beginner to intermediate"
- Goal: "Support upcoming Python course launch"
- Timeline: "2 weeks"
- Angle: "Focus on practical business applications with Brazilian datasets"

Then executes full workflow, creating comprehensive guide.

## Success Criteria

- 5000+ words of high-value content
- Ready to become pillar content
- Can be repurposed into 50+ pieces
- Establishes thought leadership
- Serves target customer needs
- SEO optimized for Brazilian market
