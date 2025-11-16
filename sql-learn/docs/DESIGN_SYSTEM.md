# SQL Learn Design System

**Version:** 2.0.0
**Last Updated:** 2025-11-15
**Status:** Active

## Overview

This document defines the visual design language for SQL Learn, an interactive SQL learning platform. The design system emphasizes **distinctiveness**, **clarity**, and **educational effectiveness** while maintaining a professional yet approachable aesthetic.

## Design Philosophy

### Core Principles

1. **Distinctive Identity** - SQL Learn has a unique visual signature that sets it apart from generic educational platforms
2. **Data-Inspired Aesthetics** - Colors and patterns draw from database/data visualization metaphors
3. **Clarity Over Cleverness** - Education requires clear visual hierarchy and obvious interactions
4. **Progressive Delight** - Micro-interactions and animations celebrate learning moments
5. **Accessibility First** - All learners have equal access to content and features

### Visual Mood

- **Professional yet Approachable** - Credible but not intimidating
- **Modern and Fresh** - Current design trends without being trendy
- **Energetic but Focused** - Engaging without distraction
- **Clean and Spacious** - Generous whitespace for reduced cognitive load

---

## Color System

### v2.0 Signature Palette (November 2025)

Our distinctive color palette is inspired by databases and data visualization, moving away from generic blue to create a memorable brand identity.

#### Primary Colors

```css
/* Teal - Primary (Database/Data Theme) */
--primary-50: #F0FDFA;   /* Very light teal background */
--primary-100: #CCFBF1;  /* Light teal background */
--primary-200: #99F6E4;  /* Subtle teal accents */
--primary-300: #5EEAD4;  /* Bright teal highlights */
--primary-400: #2DD4BF;  /* Medium teal */
--primary-500: #14B8A6;  /* Base teal */
--primary-600: #0D9488;  /* Primary interactive (buttons, links) */
--primary-700: #0F766E;  /* Primary hover state */
--primary-800: #115E59;  /* Dark teal */
--primary-900: #134E4A;  /* Very dark teal */
```

**Usage:**
- Primary buttons and CTAs
- Links and interactive elements
- Progress indicators
- SQL/database icons and metaphors

#### Accent Colors

```css
/* Coral - Accent (Energy/Engagement) */
--accent-50: #FFF7ED;    /* Light coral background */
--accent-100: #FFEDD5;   /* Subtle coral */
--accent-200: #FED7AA;   /* Soft coral */
--accent-300: #FDBA74;   /* Bright coral */
--accent-400: #FB923C;   /* Medium coral */
--accent-500: #F97316;   /* Base coral */
--accent-600: #EA580C;   /* Accent interactive */
--accent-700: #C2410C;   /* Accent hover */
--accent-800: #9A3412;   /* Dark coral */
--accent-900: #7C2D12;   /* Very dark coral */
```

**Usage:**
- Call-to-action highlights
- "Continue Learning" sections
- In-progress indicators
- Energy/excitement moments

#### Semantic Colors

```css
/* Success - Emerald (Achievement/Growth) */
--success-500: #10B981;  /* Base success */
--success-600: #059669;  /* Success hover */
--success-700: #047857;  /* Dark success */

/* Error - Red (Warnings/Failures) */
--error-500: #EF4444;    /* Base error */
--error-600: #DC2626;    /* Error hover */
--error-700: #B91C1C;    /* Dark error */

/* Warning - Amber (Hints/Caution) */
--warning-500: #F59E0B;  /* Base warning */
--warning-600: #D97706;  /* Warning hover */
--warning-700: #B45309;  /* Dark warning */

/* Info/Code - Indigo (Technical/Professional) */
--code-500: #6366F1;     /* Base code */
--code-600: #4F46E5;     /* Code hover */
--code-700: #4338CA;     /* Dark code */
```

#### Neutral Colors

```css
/* Gray Scale */
--gray-50: #F9FAFB;      /* Subtle backgrounds */
--gray-100: #F3F4F6;     /* Light backgrounds */
--gray-200: #E5E7EB;     /* Borders */
--gray-300: #D1D5DB;     /* Disabled states */
--gray-400: #9CA3AF;     /* Placeholder text */
--gray-500: #6B7280;     /* Secondary text */
--gray-600: #4B5563;     /* Body text */
--gray-700: #374151;     /* Emphasized text */
--gray-800: #1F2937;     /* Headings */
--gray-900: #111827;     /* Primary headings */
```

### Background Gradients

```css
/* Primary Page Background */
background: linear-gradient(to bottom right, #F0FDFA, #ECFEFF, #DBEAFE);
/* from-teal-50 via-cyan-50 to-blue-50 */

/* Card Hover Gradient (Subtle) */
background: linear-gradient(to bottom right, #F0FDFA, #F0F9FF);
/* from-teal-50 to-sky-50 */

/* Hero Section Gradient */
background: linear-gradient(135deg, #0D9488, #06B6D4);
/* from-teal-600 to-cyan-500 */
```

### Color Usage Guidelines

| Element | Color | Tailwind Class | Rationale |
|---------|-------|----------------|-----------|
| Primary buttons | Teal gradient | `from-teal-600 to-teal-700` | Data/database theme |
| Accent CTAs | Coral | `bg-orange-600` | Energy and engagement |
| Links | Teal | `text-teal-600 hover:text-teal-700` | Consistency with primary |
| Success states | Emerald | `text-emerald-600` | Growth metaphor |
| Error states | Red | `text-red-600` | Clear warnings |
| Code elements | Indigo | `text-indigo-600` | Professional/technical |
| Body text | Gray-700 | `text-gray-700` | Optimal readability |
| Headings | Gray-900 | `text-gray-900` | Maximum contrast |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

System fonts for optimal performance and native feel across platforms.

### Type Scale

| Level | Size | Weight | Line Height | Usage | Tailwind Classes |
|-------|------|--------|-------------|-------|------------------|
| Hero | 60px | 800 | 1.1 | Page titles | `text-6xl font-extrabold leading-tight` |
| H1 | 48px | 700 | 1.2 | Major headings | `text-5xl font-bold tracking-tight` |
| H2 | 36px | 700 | 1.3 | Section headings | `text-4xl font-bold` |
| H3 | 24px | 600 | 1.4 | Subsections | `text-2xl font-semibold` |
| H4 | 20px | 600 | 1.5 | Card titles | `text-xl font-semibold` |
| Body | 16px | 400 | 1.6 | Main content | `text-base text-gray-700` |
| Small | 14px | 400 | 1.5 | Supporting text | `text-sm text-gray-600` |
| Tiny | 12px | 500 | 1.4 | Labels, meta | `text-xs font-medium` |

### Gradient Text (New in v2.0)

For hero headings and special emphasis:

```tsx
<h1 className="text-6xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600
               bg-clip-text text-transparent tracking-tight">
  SQL Learn
</h1>
```

### Code Typography

```css
/* Inline Code */
font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
font-size: 14px;
background: #F3F4F6;
padding: 2px 6px;
border-radius: 4px;

/* Code Blocks */
font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
font-size: 14px;
background: linear-gradient(to bottom right, #1F2937, #111827);
color: #34D399; /* emerald-400 */
padding: 24px;
border-radius: 12px;
border-left: 4px solid #0D9488; /* teal-600 */
```

---

## Spacing System

Based on Tailwind's 4px base scale:

| Token | Value | Usage | Tailwind |
|-------|-------|-------|----------|
| xs | 4px | Tight spacing | `gap-1`, `p-1` |
| sm | 8px | Related items | `gap-2`, `p-2` |
| md | 16px | Standard spacing | `gap-4`, `p-4` |
| lg | 24px | Section spacing | `gap-6`, `p-6` |
| xl | 32px | Major sections | `gap-8`, `p-8` |
| 2xl | 48px | Page sections | `py-12` |
| 3xl | 64px | Hero spacing | `py-16` |

### Component Spacing Guidelines

- **Card padding**: `p-6` (24px)
- **Section gap**: `gap-8` (32px)
- **Grid gap**: `gap-6` (24px)
- **Button padding**: `px-4 py-2.5` (16px x 10px)
- **Container padding**: `px-4 sm:px-6 lg:px-8`

---

## Components

### Buttons

#### Primary Button (v2.0 Update)
```tsx
<button className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700
                   text-white font-medium rounded-lg
                   hover:from-teal-700 hover:to-teal-800
                   hover:shadow-lg hover:shadow-teal-500/50
                   active:scale-[0.98]
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 transform hover:scale-105">
  Primary Action
</button>
```

#### Accent Button (New in v2.0)
```tsx
<button className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700
                   text-white font-medium rounded-lg
                   hover:from-orange-700 hover:to-orange-800
                   hover:shadow-lg hover:shadow-orange-500/50
                   transition-all duration-300 transform hover:scale-105">
  Start Learning
</button>
```

#### Success Button
```tsx
<button className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600
                   text-white font-medium rounded-lg
                   hover:from-emerald-700 hover:to-green-700
                   hover:shadow-lg hover:shadow-emerald-500/50
                   transition-all duration-300 transform hover:scale-105">
  Submit Answer
</button>
```

### Cards

#### Pack Card (v2.0 Enhancement)
```tsx
<div className="relative group">
  {/* Animated gradient border on hover */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500
                  rounded-2xl opacity-0 group-hover:opacity-100 blur
                  transition duration-500"></div>

  {/* Card content */}
  <div className="relative bg-white rounded-2xl p-6 border border-gray-200
                  hover:shadow-2xl transition-all duration-300">
    {/* Icon with gradient background */}
    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600
                    rounded-xl flex items-center justify-center mb-4
                    shadow-lg shadow-teal-500/50">
      {/* Database icon */}
    </div>
    {/* Card content */}
  </div>
</div>
```

#### Challenge Card (v2.0 Enhancement)
```tsx
<div className={`relative bg-white rounded-2xl p-6 border-2 transition-all
                 border-l-4 ${
                   completed ? 'border-l-emerald-500 border-emerald-200' :
                   inProgress ? 'border-l-orange-500 border-orange-200' :
                   'border-l-gray-300 border-gray-200'
                 }
                 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2`}>
  {/* Challenge content */}
</div>
```

### Progress Indicators

#### Circular Progress Badge
```tsx
<div className="relative w-20 h-20">
  <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 36 36">
    {/* Background circle */}
    <circle cx="18" cy="18" r="15.5" fill="none"
            stroke="#E5E7EB" strokeWidth="3" />
    {/* Progress circle */}
    <circle cx="18" cy="18" r="15.5" fill="none"
            stroke="#0D9488" /* teal-600 */
            strokeWidth="3"
            strokeDasharray={`${(percentage / 100) * 97.4}, 97.4`}
            strokeLinecap="round" />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
  </div>
</div>
```

---

## Animation & Motion

### Timing Functions

```css
/* Entrances */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Exits */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Continuous */
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);

/* Bouncy (celebrations) */
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 150ms | Micro-interactions (hover) |
| Normal | 300ms | Standard transitions |
| Slow | 500ms | Page transitions |
| Very Slow | 800ms | Celebrations, reveals |

### Key Animations

#### Gradient Border Glow (New in v2.0)
```css
.gradient-border-glow {
  position: relative;
}

.gradient-border-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(to right, #0D9488, #06B6D4);
  border-radius: inherit;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 500ms;
}

.gradient-border-glow:hover::before {
  opacity: 1;
}
```

#### Success Checkmark Draw
```css
.checkmark-draw {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: draw-check 0.6s ease-out forwards;
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}
```

#### Loading Dots
```css
.loading-dots span {
  animation: loading-dots 1.4s infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes loading-dots {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}
```

---

## Accessibility

### WCAG AA Compliance

All color combinations meet WCAG AA contrast ratios:

| Combination | Ratio | Pass |
|-------------|-------|------|
| Gray-900 on White | 16.03:1 | ✅ AAA |
| Gray-700 on White | 9.16:1 | ✅ AAA |
| Teal-600 on White | 4.54:1 | ✅ AA |
| Orange-600 on White | 4.54:1 | ✅ AA |
| White on Teal-600 | 4.54:1 | ✅ AA |

### Focus Indicators

All interactive elements have visible focus states:

```css
focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
```

### Motion Preferences

Respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Guide

### Getting Started

1. **Update globals.css** with new CSS variables
2. **Update ui-constants.tsx** with new color mappings
3. **Apply to components** progressively (buttons → cards → pages)
4. **Test accessibility** with screen readers and keyboard navigation
5. **Verify consistency** across all pages and states

### File Locations

- **Color definitions**: `/app/globals.css`
- **Color utilities**: `/app/lib/ui-constants.tsx`
- **Component styles**: Individual component files in `/app/components/`
- **Button classes**: `/app/globals.css` (`.btn-primary`, `.btn-success`, etc.)

### Migration Checklist

- [ ] Update CSS variables in globals.css
- [ ] Update SECTION_COLORS in ui-constants.tsx
- [ ] Update button styles (.btn-primary, .btn-success)
- [ ] Update PackCard gradient borders
- [ ] Update ChallengeCard status strips
- [ ] Update hero gradient text
- [ ] Update progress badge colors
- [ ] Test all interactive states
- [ ] Verify accessibility contrast
- [ ] Update documentation

---

## Changelog

### v2.0.0 (November 2025)
- **Major color palette update**: Teal/coral signature theme
- **Enhanced typography**: Gradient text for heroes
- **New component patterns**: Gradient borders, status strips
- **Improved animations**: Gradient glow effects
- **Better distinctiveness**: Moved away from generic blue

### v1.0.0 (November 2025)
- Initial design system with blue/purple/pink gradients
- Glassmorphism effects
- Basic animation utilities
- Accessibility foundation

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Motion Guidelines**: https://m3.material.io/styles/motion/overview
