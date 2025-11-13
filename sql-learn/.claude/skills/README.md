# Claude Skills for SQL Learn

This directory contains specialized Claude Code skills that provide domain-specific guidance for developing the SQL Learn platform.

## What Are Skills?

Skills are markdown documents with instructions, best practices, and domain knowledge that Claude can reference when working on specific tasks. They activate on-demand based on the work being done, providing expert guidance without cluttering the main context.

## Available Skills

### 1. frontend-design
**Purpose:** Create distinctive, production-grade frontend interfaces with high design quality

**Use when:**
- Building new UI components or pages
- Improving existing interfaces
- Implementing animations or transitions
- Creating loading or feedback states
- Ensuring accessibility compliance
- Establishing visual consistency
- Enhancing educational UX patterns

**Key Features:**
- Complete design system documentation
- Animation utilities and guidelines
- Accessibility requirements
- Component patterns specific to educational platforms
- Typography, color, and layout standards

### 2. sql-challenge-design
**Purpose:** Create effective SQL learning challenges and packs

**Use when:**
- Designing new SQL challenges
- Creating challenge packs with datasets
- Writing test assertions for challenges
- Generating sample data
- Debugging pack loading issues
- Ensuring educational effectiveness

**Key Features:**
- Pack schema structure (v1.1/v1.2)
- Challenge design best practices
- Test assertion types (ROWCOUNT, SQL, SCHEMA_EQ, SET_EQ, NEAR)
- Dataset creation with Python/pandas
- Difficulty progression guidelines
- Common pitfalls to avoid

### 3. testing
**Purpose:** Write comprehensive tests for the SQL Learn platform

**Use when:**
- Writing unit tests with Vitest
- Creating E2E tests with Playwright
- Testing DuckDB integration
- Ensuring accessibility compliance
- Debugging failing tests
- Improving test coverage

**Key Features:**
- Unit testing patterns for core logic
- E2E testing for user flows
- Testing async operations and timeouts
- Mock data and fixtures
- Coverage requirements
- CI/CD integration

## How Skills Work

### File Structure
Each skill is in its own directory:
```
.claude/skills/
├── frontend-design/
│   └── SKILL.md
├── sql-challenge-design/
│   └── SKILL.md
├── testing/
│   └── SKILL.md
└── README.md
```

### Skill Format
Each `SKILL.md` file has YAML frontmatter:
```yaml
---
name: skill-name
description: What this skill does and when to use it
---
```

### Activation
Claude automatically discovers and uses skills based on:
- The task description
- Files being worked on
- Explicit invocation by name

### Manual Invocation
You can explicitly request a skill:
- "Use the frontend-design skill to improve this component"
- "Apply the sql-challenge-design skill to create a new pack"
- "Follow the testing skill to add E2E tests"

## Creating New Skills

To add a new skill:

1. Create a directory: `.claude/skills/your-skill-name/`
2. Create `SKILL.md` with frontmatter
3. Write clear, actionable guidance
4. Document when to use it
5. Include examples

**Best Practices:**
- Keep skills focused on one domain
- Write specific, actionable instructions
- Include code examples
- Reference project files and patterns
- Update as the project evolves

## Skill Maintenance

### When to Update Skills
- New patterns emerge in the codebase
- Design system changes
- Testing strategies evolve
- New technologies added
- Common mistakes identified

### Who Should Update
- Anyone on the team can improve skills
- Commit skill changes to git
- Skills are automatically available to all team members

## Benefits of Skills

1. **Consistency:** Ensures design patterns and best practices are followed
2. **Onboarding:** New team members get instant guidance
3. **Quality:** Reduces bugs and improves code quality
4. **Efficiency:** Faster development with expert guidance
5. **Documentation:** Living documentation that stays up-to-date

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Main project guidance for Claude
- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - System architecture
- [ADR-0002](../../docs/ADR/ADR-0002-pack-schema.md) - Pack schema specification
- [Iteration Playbook](../../docs/PLAYBOOKS/iteration-playbook.md) - Development workflow

## External Resources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Frontend Design Blog Post](https://www.claude.com/blog/improving-frontend-design-through-skills)

---

**Note:** Skills are a powerful feature of Claude Code that help maintain high-quality standards across the project. Keep them updated and use them actively for best results.
