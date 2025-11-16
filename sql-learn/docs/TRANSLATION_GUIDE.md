# Translation Implementation Guide

## ✅ What's Already Complete

### Infrastructure (100% Done)
- ✅ `app/lib/i18n.ts` - Translation utilities
- ✅ `app/lib/useTranslation.ts` - React hook for components
- ✅ `app/locales/pt-BR.json` - Portuguese translations (~520 strings)
- ✅ `app/locales/en.json` - English fallback
- ✅ `app/components/LanguageSwitcher.tsx` - Language toggle component

### Translation Coverage
- ✅ Homepage strings
- ✅ Challenge page strings
- ✅ Pack page strings
- ✅ Welcome modal strings
- ✅ Concept page strings
- ✅ Error messages
- ✅ Common UI elements

## 🚀 How to Use Translations in Components

### Pattern 1: Simple String Replacement

**Before:**
```typescript
<h1>Welcome to SQL Learn!</h1>
```

**After:**
```typescript
import { useTranslation } from "../lib/useTranslation";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("welcome.step1.title")}</h1>;
}
```

### Pattern 2: With Parameters

**Before:**
```typescript
<p>Challenge {current} of {total}</p>
```

**After:**
```typescript
<p>{t("challenge.challenge_of", { current, total })}</p>
```

### Pattern 3: Plural Forms

**Before:**
```typescript
{count} {count === 1 ? "row" : "rows"}
```

**After:**
```typescript
{count === 1
  ? t("challenge.results_title", { count })
  : t("challenge.results_title_plural", { count })
}
```

### Pattern 4: Adding Language Switcher

Add to any page header:
```typescript
import { LanguageSwitcher } from "./components/LanguageSwitcher";

<header>
  <div className="flex justify-between">
    <Logo />
    <LanguageSwitcher />
  </div>
</header>
```

## 📝 Components to Update

### Priority 1: Core User Flow (Critical)

#### 1. Homepage (`app/page.tsx`)
**Strings to replace:** ~15
**Key translations:**
- `home.title`
- `home.subtitle`
- `home.challenge_packs`
- `home.concepts_banner.*`
- `home.stats.*`

**Example:**
```typescript
import { useTranslation } from "./lib/useTranslation";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <header>
        <LanguageSwitcher />
        <h1>{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
      </header>
      {/* ...rest */}
    </div>
  );
}
```

#### 2. Welcome Modal (`app/components/WelcomeModal.tsx`)
**Strings to replace:** ~20
**Key translations:**
- `welcome.step1.*`
- `welcome.step2.*`
- `welcome.step3.*`
- `welcome.get_started`
- `welcome.next`, `welcome.previous`

#### 3. Challenge Page (`app/challenges/[packId]/[challengeId]/page.tsx`)
**Strings to replace:** ~30
**Key translations:**
- `challenge.back_to_challenges`
- `challenge.hints_title`
- `challenge.hint_tier1/2/3`
- `challenge.run_query`
- `challenge.submit_answer`
- `challenge.success_title`
- `challenge.not_quite_title`

#### 4. Pack Page (`app/packs/[packId]/page.tsx`)
**Strings to replace:** ~15
**Key translations:**
- `pack.back_to_home`
- `pack.your_progress`
- `pack.author`
- `pack.challenges`
- `pack.start_challenge`
- `pack.difficulty.*`

### Priority 2: Content (Medium)

#### 5. Pack Content (`public/packs/pack_basics/pack.json`)
**Create:** `public/packs/pack_basics/pack.pt-BR.json`

This is a separate Portuguese version of the pack with all challenges translated.

**Structure:**
```json
{
  "schema_version": "1.2",
  "id": "pack_basics",
  "title": "Fundamentos de SQL",
  "description": "Domine os fundamentos de SQL...",
  "challenges": [
    {
      "id": "q1_select_all",
      "title": "Selecionar Todos os Clientes",
      "prompt": "Escreva uma consulta para recuperar todas as colunas da tabela customers.",
      "hints": {
        "tier1": "Você precisa usar a instrução SELECT para recuperar dados de uma tabela.",
        "tier2": "Use o símbolo asterisco (*) para selecionar todas as colunas de uma vez.",
        "tier3": "A sintaxe é: SELECT * FROM nome_da_tabela;"
      },
      // ... rest of challenge (solution_sql and tests stay the same)
    }
  ]
}
```

**Note:** SQL code (`solution_sql`) stays in English - SQL keywords are universal.

#### 6. Error Messages (`app/lib/grader.ts`)
**Update `translateError` function to use i18n:**

```typescript
import { t } from "./i18n";
import enTranslations from "../locales/en.json";
import ptBRTranslations from "../locales/pt-BR.json";
import { getCurrentLocale } from "./i18n";

function translateError(error: Error): string {
  const locale = getCurrentLocale();
  const translations = locale === "pt-BR" ? ptBRTranslations : enTranslations;
  const message = error.message;

  // Table not found errors
  if (message.includes("Binder Error") && message.includes("does not exist")) {
    const tableMatch = message.match(/table '([^']+)' does not exist/i);
    if (tableMatch) {
      const attemptedTable = tableMatch[1];
      const suggestions: Record<string, string> = {
        customer: "customers",
        order: "orders",
        product: "products",
        employee: "employees",
      };
      const suggestion = suggestions[attemptedTable.toLowerCase()];

      if (suggestion) {
        return t("errors.table_not_found", translations, "")
          .replace("{{table}}", attemptedTable)
          .replace("{{suggestion}}", suggestion);
      }
      return t("errors.table_not_found_generic", translations, "")
        .replace("{{table}}", attemptedTable);
    }
  }

  // ... rest of error translations
}
```

### Priority 3: Polish (Low)

#### 7. Concept Pages
Each concept page needs:
- Page title and subtitle
- Section headers
- Example descriptions
- Common mistakes
- Call-to-action text

**Note:** This is ~200 strings per page × 5 pages = 1000 strings
**Recommendation:** Keep in English for V1, translate in V2

#### 8. Components
- PackCard.tsx
- ChallengeCard.tsx
- KeyboardShortcuts.tsx
- ResultGrid.tsx
- ProgressBadge.tsx

Most are small (~5-10 strings each)

## 🎯 Implementation Timeline

### Week 1: Critical Path (20 hours)
- [ ] Homepage with LanguageSwitcher
- [ ] Welcome Modal
- [ ] Challenge Page
- [ ] Pack Page
- [ ] Error messages in grader.ts
- **Result:** Core user experience fully translated

### Week 2: Content (15 hours)
- [ ] Create pack_basics.pt-BR.json
- [ ] Update pack loading logic to check locale
- [ ] Test all challenge translations
- **Result:** 16 challenges fully in Portuguese

### Week 3: Polish (10 hours)
- [ ] Remaining components
- [ ] Concept pages (partial - just headers/CTAs)
- [ ] Final QA and layout fixes
- **Result:** 95%+ of user-facing text translated

## 🔧 Helper Script

Create `scripts/extract-strings.js` to find untranslated strings:

```javascript
// Find all hardcoded strings in components
const fs = require('fs');
const path = require('path');

function findHardcodedStrings(dir) {
  const files = fs.readdirSync(dir);
  const strings = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      strings.push(...findHardcodedStrings(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Find strings in JSX that aren't t("...")
      const matches = content.match(/>([^<>{}]+)</g);
      if (matches) {
        matches.forEach(match => {
          const text = match.slice(1, -1).trim();
          if (text && !text.includes('t(') && text.length > 2) {
            strings.push({ file, text });
          }
        });
      }
    }
  });

  return strings;
}

console.log(findHardcodedStrings('./app'));
```

## 🧪 Testing Checklist

- [ ] Switch between PT/EN - page reloads correctly
- [ ] All buttons and labels appear in correct language
- [ ] No layout breaks from longer Portuguese text
- [ ] Error messages display in correct language
- [ ] Welcome modal shows in correct language
- [ ] Challenge content loads in correct language
- [ ] Concept pages readable in both languages
- [ ] No console errors related to missing translations
- [ ] Fallback to English works if key missing
- [ ] Language preference persists across sessions

## 📊 Translation Quality Checklist

**Brazilian Portuguese Specifics:**
- [ ] Uses informal "você" (not formal "vossa")
- [ ] Positive, encouraging tone ("Parabéns!", "Muito bem!")
- [ ] SQL keywords stay in English (SELECT, WHERE, JOIN)
- [ ] Technical terms appropriately localized:
  - "query" → "consulta"
  - "table" → "tabela"
  - "database" → "banco de dados"
  - "row" → "linha"
  - "column" → "coluna"
- [ ] Cultural fit (Brazilian names, scenarios if applicable)

## 🚀 Quick Start

1. **Test the infrastructure:**
```bash
npm run dev
# Open http://localhost:3005
# Click language switcher in header
# Confirm page reloads and strings change
```

2. **Add LanguageSwitcher to Homepage:**
```typescript
// app/page.tsx
import { LanguageSwitcher } from "./components/LanguageSwitcher";

// In header section:
<header className="...">
  <div className="max-w-7xl mx-auto px-4 flex justify-between">
    <div>Logo and Title</div>
    <LanguageSwitcher />
  </div>
</header>
```

3. **Replace first string:**
```typescript
// Before:
<h1>SQL Learn</h1>

// After:
import { useTranslation } from "./lib/useTranslation";
const { t } = useTranslation();
<h1>{t("home.title")}</h1>
```

4. **Test:**
- Confirm string changes when switching languages
- Check console for any errors
- Verify fallback works

5. **Repeat for all strings in the component**

## 📁 File Reference

**Core infrastructure:**
- `app/lib/i18n.ts` - Translation utilities
- `app/lib/useTranslation.ts` - React hook
- `app/locales/pt-BR.json` - Portuguese strings
- `app/locales/en.json` - English strings
- `app/components/LanguageSwitcher.tsx` - Language toggle

**Files needing updates:**
- `app/page.tsx` - Homepage
- `app/components/WelcomeModal.tsx` - Onboarding
- `app/challenges/[packId]/[challengeId]/page.tsx` - Challenge
- `app/packs/[packId]/page.tsx` - Pack detail
- `app/lib/grader.ts` - Error messages
- `public/packs/pack_basics/pack.json` - Challenge content

## 🎓 Best Practices

1. **Always use the hook:**
   ```typescript
   const { t, locale } = useTranslation();
   ```

2. **Keep keys organized:**
   - Use dot notation: `home.title`, not `homeTitle`
   - Group by page/feature: `challenge.*`, `pack.*`
   - Be descriptive: `hint_tier1`, not `h1`

3. **Handle plurals explicitly:**
   ```typescript
   {count === 1 ? t("challenge.result") : t("challenge.results")}
   ```

4. **Test both languages:**
   - Always test PT and EN after changes
   - Check for layout breaks
   - Verify all parameters work

5. **Add fallbacks:**
   ```typescript
   {t("some.new.key", {}, "Fallback Text")}
   ```

## ✅ Success Criteria

When complete, the platform should:
- ✅ Default to Portuguese for Brazilian users
- ✅ Allow easy switching between PT/EN
- ✅ Have 100% of critical UI translated
- ✅ Have 80%+ of content translated
- ✅ Maintain same UX quality in both languages
- ✅ Show proper Brazilian Portuguese tone
- ✅ Have no layout issues from translation

---

**Next Steps:**
1. Add LanguageSwitcher to Homepage header
2. Update Homepage strings to use `t()` function
3. Update Welcome Modal
4. Update Challenge Page
5. Create pack_basics.pt-BR.json
6. Update error messages
7. QA and polish

**Estimated Total Effort:** 35-45 hours to complete all translations
