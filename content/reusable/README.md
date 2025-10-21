# Reusable Content Components

This directory contains content components that can be reused across different content pieces, courses, and marketing materials.

## Purpose

Building a library of reusable components:
- Saves time (don't rewrite the same explanations)
- Ensures consistency (same concepts explained the same way)
- Improves quality (refine once, use everywhere)
- Enables rapid content creation

## Structure

```
reusable/
├── definitions/          # Technical definitions and concepts
├── examples/            # Code examples and case studies
├── explanations/        # How concepts work
├── intros/              # Opening paragraphs for common topics
├── ctas/                # Call-to-action snippets
└── statistics/          # Data points and research findings
```

## How to Use

### When Creating Content
As you write, identify sections that could be reused:
- Standard definitions (What is a DataFrame?)
- Common explanations (How does a JOIN work?)
- Frequently used examples
- Statistics and data points

### When Reusing
1. Search this directory for relevant components
2. Copy and adapt as needed
3. Maintain consistent voice
4. Credit sources if external

## Component Template

```markdown
---
title: [Component name]
category: [definition|example|explanation|intro|cta|statistic]
topics: [topic1, topic2]
level: [beginner|intermediate|advanced]
language: [pt-BR|en]
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
used_in: [List of content pieces using this]
---

# [Component Title]

[Reusable content here]

## Context
[When/how to use this component]

## Variations
[Alternative versions for different audiences or formats]
```

## Examples of Reusable Components

### Definitions
- What is Data Science?
- What is a DataFrame?
- What is SQL?
- What is Data Visualization?

### Explanations
- How Python imports work
- How SQL JOINs work
- How to read a CSV file
- How correlation vs causation differs

### Examples
- Sample datasets
- Code snippets for common tasks
- Real-world use cases
- Step-by-step walkthroughs

### Intros
- Opening paragraphs for beginner content
- Hooks for intermediate readers
- Context-setting for Brazilian market

### CTAs
- Course enrollment CTAs
- Newsletter signup CTAs
- Free resource download CTAs
- Community engagement CTAs

### Statistics
- Data science job market stats
- Learning statistics
- Industry trends
- Brazilian market data

## Best Practices

1. **Make it Modular** - Component should work independently
2. **Version Control** - Update `last_updated` when you refine
3. **Track Usage** - Note where components are used in `used_in`
4. **Keep it Fresh** - Update statistics and examples regularly
5. **Maintain Consistency** - Use brand voice
6. **Add Context** - Include notes on when to use

## Maintenance

- **Monthly:** Review and update statistics
- **Quarterly:** Refresh examples with current tools/practices
- **Annually:** Audit for outdated content

---

Building this library is an investment that pays dividends over time. Every component you save accelerates future content creation.
