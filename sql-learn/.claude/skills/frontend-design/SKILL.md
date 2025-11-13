---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality for SQL Learn platform. Use when building or improving web components, pages, or UI elements. Generates creative, polished code that avoids generic aesthetics and follows educational platform best practices.
---

# Frontend Design Skill for SQL Learn

This skill provides guidance for creating beautiful, functional interfaces for the SQL Learn interactive learning platform. It emphasizes clarity, engagement, and educational effectiveness while maintaining high aesthetic standards.

## Core Philosophy

SQL Learn is an educational platform that should feel **approachable yet professional**, **engaging yet focused**. Every design decision should support the learning experience while providing visual delight.

### Design Principles

1. **Clarity Over Cleverness**: Education requires clear visual hierarchy and obvious interactive elements
2. **Progressive Disclosure**: Show what learners need when they need it
3. **Confidence Through Feedback**: Every interaction should provide clear, immediate feedback
4. **Joy in Achievement**: Celebrate progress with meaningful animations and visual rewards
5. **Accessibility First**: All learners should have equal access to content

## Design Framework

Before implementing any UI component, establish:

### 1. Educational Purpose
- What learning goal does this serve?
- How does it reduce cognitive load?
- Does it provide clear feedback on progress?

### 2. Aesthetic Direction
SQL Learn's current aesthetic is **modern educational** with characteristics:
- Clean, spacious layouts with breathing room
- Soft gradients (blue-purple-pink) for warmth
- Clear typography hierarchy
- Glassmorphism for depth without distraction
- Smooth, purposeful animations

### 3. Technical Standards
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: CSS-first, subtle and purposeful
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG AA compliance minimum

## Typography Guidelines

### Current Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Hierarchy Rules
- **Hero Headings (h1)**: `text-4xl` to `text-5xl`, `font-bold`, high contrast
- **Section Headings (h2)**: `text-3xl`, `font-bold`, gray-900
- **Subsection Headings (h3)**: `text-xl`, `font-semibold`, gray-800
- **Body Text**: `text-base`, `text-gray-700`, line-height optimized for reading
- **Small Text/Meta**: `text-sm`, `text-gray-600`, used for hints and supplementary info

### Code/SQL Display
- **SQL Editor**: Monaco Editor with VS Code theme
- **Inline Code**: Monospace with subtle background (`bg-gray-100`)
- **Code Blocks**: Proper syntax highlighting, clear line numbers

## Color & Theme System

### Current Palette (defined in globals.css)
```css
--primary: #2563eb (blue-600)
--primary-hover: #1d4ed8 (blue-700)
--success: #10b981 (green-500)
--error: #ef4444 (red-500)
--warning: #f59e0b (amber-500)
```

### Background Strategy
- **Main backgrounds**: Soft gradients (`from-blue-50 via-purple-50 to-pink-50`)
- **Card backgrounds**: White (`bg-white`) with subtle borders
- **Elevated surfaces**: Glassmorphism (`.glass` and `.glass-strong` utilities)
- **Interactive elements**: Clear hover states with color shifts

### Color Usage Rules
1. **Blue** for primary actions and SQL/database metaphors
2. **Green** for success, correct answers, completion states
3. **Red** for errors, incorrect answers, warnings
4. **Purple** as accent for progress, achievements
5. **Gray scale** for neutrals, text, borders

## Motion & Animation

### Animation Philosophy
Animations should **teach and delight**, never distract. Every animation must have purpose.

### Current Animation Utilities (globals.css)

#### Shimmer Loading
```css
.shimmer {
  /* Subtle loading state for skeletons */
  animation: shimmer 2.5s ease-in-out infinite;
}
```
**Use for**: Loading states, skeleton screens

#### Scale-In
```css
.scale-in {
  /* Gentle entrance animation */
  animation: scale-in 0.3s ease-out;
}
```
**Use for**: Modals, tooltips, newly appeared content

#### Bounce-In
```css
.animate-bounce-in {
  /* Celebratory entrance */
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```
**Use for**: Success badges, completion checkmarks

#### Stagger Fade-In
```css
.stagger-fade-in {
  /* Graceful sequential appearance */
  animation: fade-slide-in 0.4s ease-out forwards;
}
```
**Use for**: List items, challenge cards appearing

#### Checkmark Draw
```css
.checkmark-draw {
  /* Animated success checkmark */
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: draw-check 0.6s ease-out forwards;
}
```
**Use for**: Marking challenges complete, test passing

#### Loading Dots
```css
.loading-dots span {
  /* Bouncing dot animation */
  animation: loading-dots 1.4s infinite;
}
```
**Use for**: Query execution, data loading

### Animation Guidelines
1. **Duration**: 150-400ms for micro-interactions, 400-800ms for significant transitions
2. **Easing**: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for continuous
3. **Trigger**: Prefer CSS `:hover`, `:focus`, `:active` over JS when possible
4. **Performance**: Use `transform` and `opacity` only (GPU-accelerated)
5. **Respect preferences**: Honor `prefers-reduced-motion`

## Component Patterns

### Loading States
**Always use skeleton screens** (not spinners) that match content structure:
- PackCardSkeleton for pack cards
- ChallengeCardSkeleton for challenge cards
- Custom skeletons that mirror actual layout

### Interactive Cards
```tsx
// Pattern for hoverable, clickable cards
<div className="bg-white rounded-2xl shadow-md border border-gray-200
                hover:shadow-lg hover:border-blue-300
                transition-all duration-300 cursor-pointer">
  {/* Card content */}
</div>
```

### Buttons
**Primary Actions** (Run, Submit):
```tsx
<button className="btn-primary">
  {/* Includes gradient, hover effects, active states */}
</button>
```

**Success Actions** (Mark Complete):
```tsx
<button className="btn-success">
  {/* Green gradient with glow effect */}
</button>
```

### Progress Indicators
- **Circular progress**: `ProgressBadge` component with animated fill
- **Linear progress**: Subtle bars with smooth transitions
- **Stats displays**: AnimatedNumber for count-ups

### Feedback Messages
- **Success**: Green background, checkmark icon, fade-in animation
- **Error**: Red background, alert icon, persist until dismissed
- **Info**: Blue background, info icon, auto-dismiss
- **Hint**: Amber background, lightbulb icon, expandable

## Layout & Composition

### Container Widths
- **Main content**: `max-w-7xl mx-auto` (1280px)
- **Reading content**: `max-w-4xl mx-auto` (896px for optimal reading)
- **Modals**: `max-w-2xl` to `max-w-4xl` depending on content

### Spacing System
Follow Tailwind's spacing scale:
- **Micro**: `gap-2` (8px) for tight groups
- **Standard**: `gap-4` (16px) for related items
- **Sections**: `gap-6` (24px) to `gap-8` (32px)
- **Major sections**: `py-12` (48px) for vertical breathing room

### Grid Layouts
```tsx
// Responsive pack/challenge grids
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

### Visual Hierarchy
1. Use whitespace generously
2. Group related elements with subtle backgrounds
3. Create clear visual paths with alignment and sizing
4. Emphasize primary actions with color and size

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators (ring-2 ring-blue-500)
- Logical tab order
- Keyboard shortcuts documented in UI

### Screen Readers
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`)
- ARIA labels on icon-only buttons
- Live regions for dynamic content (query results, errors)
- Meaningful alt text for images/icons

### Color Contrast
- Text contrast ratio ≥ 4.5:1 (WCAG AA)
- Large text ≥ 3:1
- Interactive elements clearly distinguishable
- Don't rely on color alone for meaning

### Responsive Design
- Mobile-first approach
- Touch targets ≥ 44x44px
- Readable text without zoom (minimum 16px body)
- Test on mobile, tablet, desktop viewports

## Educational UX Patterns

### Challenge Presentation
1. **Clear prompt**: Prominently display what to do
2. **Available data**: Show table schemas, expandable
3. **Editor space**: Generous SQL editing area with syntax highlighting
4. **Action buttons**: Run (test query) vs Submit (grade)
5. **Results display**: Clear, tabular, with row counts

### Feedback Loops
1. **Immediate**: Syntax errors, query results appear instantly
2. **Informative**: Show what passed/failed in tests
3. **Encouraging**: Positive messages for attempts and success
4. **Actionable**: Hints point toward solutions without giving answers

### Progress Visualization
1. **Pack-level**: Circular progress badges showing completion %
2. **Overall**: Stats showing challenges attempted/completed
3. **Achievements**: Celebrate pack completions with animations
4. **History**: Track best times, attempts (subtle, not punitive)

### Learning Affordances
1. **Hints**: Progressively revealed, not immediately visible
2. **Solutions**: Available after multiple attempts, clearly marked
3. **Schema reference**: Always accessible, expandable without disruption
4. **Keyboard shortcuts**: Visible shortcuts panel, closeable

## Anti-Patterns to Avoid

### Visual Anti-Patterns
❌ Overusing animations (causes distraction)
❌ Low contrast text (accessibility issue)
❌ Cluttered interfaces (increases cognitive load)
❌ Inconsistent spacing (looks unprofessional)
❌ Generic stock imagery (breaks immersion)

### UX Anti-Patterns
❌ Hidden feedback (users don't know what happened)
❌ Ambiguous buttons (unclear what they do)
❌ Forcing linear progression (frustrates advanced users)
❌ Punishing exploration (errors should educate)
❌ Overwhelming with data (progressive disclosure needed)

### Code Anti-Patterns
❌ Inline styles (use Tailwind utilities)
❌ Non-semantic HTML (use proper elements)
❌ Missing loading states (causes confusion)
❌ Hardcoded colors (use CSS variables)
❌ Unused dependencies (bloat)

## Implementation Checklist

Before considering a UI component complete:

### Functionality
- [ ] Works on all target browsers (Chrome, Firefox, Safari, Edge)
- [ ] Handles loading states gracefully
- [ ] Handles error states informatively
- [ ] Handles empty states meaningfully
- [ ] Mobile responsive (320px to 1920px+)

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Focus indicators visible
- [ ] ARIA labels where needed

### Performance
- [ ] No layout shifts (CLS < 0.1)
- [ ] Fast interaction (FID < 100ms)
- [ ] Quick loading (LCP < 2.5s)
- [ ] Optimized images/assets
- [ ] Minimal bundle impact

### Design Quality
- [ ] Matches design system
- [ ] Consistent spacing
- [ ] Appropriate animations
- [ ] Proper visual hierarchy
- [ ] Polished details (hover states, transitions)

### Code Quality
- [ ] TypeScript types defined
- [ ] Components are reusable
- [ ] Props validated
- [ ] Console clean (no errors/warnings)
- [ ] Formatted (Prettier)

## Examples of Excellence

### Good: Challenge Card
```tsx
<div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6
                hover:shadow-lg hover:border-blue-300 transition-all duration-300
                cursor-pointer group">
  <div className="flex items-start justify-between mb-4">
    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600
                   transition-colors">
      {challenge.title}
    </h3>
    {completed && (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600 checkmark-draw">
          {/* Checkmark */}
        </svg>
      </div>
    )}
  </div>
  {/* More content */}
</div>
```

### Good: Loading State
```tsx
<div className="h-64 bg-gray-100 rounded relative overflow-hidden">
  <div className="absolute inset-0 shimmer" />
</div>
```

### Good: Success Feedback
```tsx
{gradeResult?.pass && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4
                  scale-in flex items-center gap-3">
    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-green-600 checkmark-draw">
        {/* Checkmark */}
      </svg>
    </div>
    <div>
      <h4 className="font-semibold text-green-900">Perfect! Challenge Complete</h4>
      <p className="text-sm text-green-700">All tests passed in {elapsedMs}ms</p>
    </div>
  </div>
)}
```

## Resources

### Internal
- `/app/globals.css` - Animation utilities and design tokens
- `/app/components/` - Reusable component library
- `/app/lib/ui-constants.tsx` - Color and styling utilities

### External
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Next.js App Router](https://nextjs.org/docs/app)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Motion Design Principles](https://m3.material.io/styles/motion/overview)

## When to Use This Skill

Invoke this skill when:
- Building new UI components or pages
- Improving existing interfaces
- Implementing animations or transitions
- Creating loading or feedback states
- Ensuring accessibility compliance
- Establishing visual consistency
- Enhancing educational UX patterns

This skill provides the foundation for creating interfaces that are not just functional, but **delightful and effective learning tools**.
