---
name: testing
description: Write comprehensive tests for SQL Learn platform including unit tests (Vitest) and E2E tests (Playwright). Use when adding new features, fixing bugs, or improving test coverage.
---

# Testing Skill for SQL Learn

This skill provides guidance for writing effective tests that ensure the SQL Learn platform remains reliable and bug-free.

## Testing Philosophy

Tests should:
1. **Catch bugs early** before they reach users
2. **Document behavior** through clear test descriptions
3. **Enable refactoring** with confidence
4. **Run quickly** to maintain fast feedback loops
5. **Be maintainable** with clear, simple test code

## Test Structure

### Unit Tests (Vitest)
**Location:** `tests/unit/`

**Purpose:** Test individual functions and modules in isolation

**Run:** `npm test`

**Watch mode:** `npm test -- --watch`

### E2E Tests (Playwright)
**Location:** `tests/e2e/`

**Purpose:** Test complete user workflows in real browser

**Run:** `npm run test:e2e`

**With UI:** `npm run test:e2e -- --headed`

**Debug:** `npm run test:e2e -- --debug`

## Unit Testing Best Practices

### Test File Structure
```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '@/app/lib/module';

describe('Module Name', () => {
  describe('functionToTest', () => {
    it('should handle normal case', () => {
      const result = functionToTest(normalInput);
      expect(result).toBe(expectedOutput);
    });

    it('should handle edge case', () => {
      const result = functionToTest(edgeCase);
      expect(result).toBe(expectedEdgeCaseOutput);
    });

    it('should throw on invalid input', () => {
      expect(() => functionToTest(invalidInput)).toThrow('Expected error');
    });
  });
});
```

### What to Test

**✅ Test:**
- Core business logic (grader.ts, pack.ts)
- Utility functions
- Data transformations
- Validation logic
- Error handling

**❌ Don't Test:**
- Simple getters/setters
- Third-party libraries
- Next.js framework code
- UI components (use E2E instead)

### Example: Testing Grader Logic

```typescript
import { describe, it, expect } from 'vitest';
import { gradeQuery } from '@/app/lib/grader';

describe('Grader', () => {
  describe('ROWCOUNT assertion', () => {
    it('should pass when row count matches', async () => {
      const tests = [{
        name: 'correct_rows',
        assert: 'ROWCOUNT' as const,
        expected: 3
      }];

      const sql = 'SELECT * FROM test_table LIMIT 3';
      const result = await gradeQuery(sql, tests);

      expect(result.pass).toBe(true);
      expect(result.checks[0].pass).toBe(true);
    });

    it('should fail when row count differs', async () => {
      const tests = [{
        name: 'wrong_rows',
        assert: 'ROWCOUNT' as const,
        expected: 5
      }];

      const sql = 'SELECT * FROM test_table LIMIT 3';
      const result = await gradeQuery(sql, tests);

      expect(result.pass).toBe(false);
      expect(result.checks[0].message).toContain('Expected 5 rows, got 3');
    });
  });

  describe('SET_EQ assertion', () => {
    it('should pass with order-insensitive match', async () => {
      const tests = [{
        name: 'correct_set',
        assert: 'SET_EQ' as const,
        expected: [
          { id: 2, name: 'Bob' },
          { id: 1, name: 'Alice' }
        ]
      }];

      const sql = 'SELECT id, name FROM users WHERE id IN (1, 2) ORDER BY id';
      const result = await gradeQuery(sql, tests);

      expect(result.pass).toBe(true);
    });
  });
});
```

### Mocking External Dependencies

```typescript
import { describe, it, expect, vi } from 'vitest';
import { loadPack } from '@/app/lib/pack';

// Mock fetch
global.fetch = vi.fn();

describe('Pack Loading', () => {
  it('should load pack metadata', async () => {
    const mockPack = {
      id: 'test_pack',
      title: 'Test Pack',
      challenges: []
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPack
    });

    const pack = await loadPack('/packs/test_pack');
    expect(pack.id).toBe('test_pack');
  });

  it('should throw on failed fetch', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false
    });

    await expect(loadPack('/packs/missing')).rejects.toThrow();
  });
});
```

## E2E Testing Best Practices

### Test File Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should complete main user flow', async ({ page }) => {
    // Arrange
    await page.goto('/packs/pack_basics');

    // Act
    await page.click('text=Select All Customers');
    await page.fill('[data-testid="sql-editor"]', 'SELECT * FROM customers');
    await page.click('button:has-text("Run")');

    // Assert
    await expect(page.locator('[data-testid="results"]')).toBeVisible();
  });
});
```

### What to Test with E2E

**✅ Test:**
- Critical user flows (challenge completion)
- Navigation between pages
- Form submissions
- Loading states
- Error handling
- Accessibility

**❌ Don't Test:**
- Unit-level logic
- Every edge case
- Internal implementation details

### Example: Challenge Completion Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Challenge Completion', () => {
  test('user can complete a basic SQL challenge', async ({ page }) => {
    // Navigate to challenge
    await page.goto('/');
    await page.click('text=SQL Basics');
    await page.click('text=Select All Customers');

    // Wait for DuckDB to load
    await page.waitForSelector('[data-testid="sql-editor"]');

    // Write solution
    await page.fill('[data-testid="sql-editor"]', 'SELECT * FROM customers');

    // Submit
    await page.click('button:has-text("Submit")');

    // Verify success
    await expect(page.locator('text=Perfect! Challenge Complete')).toBeVisible();
    await expect(page.locator('[data-testid="checkmark"]')).toBeVisible();
  });

  test('user receives helpful error on incorrect query', async ({ page }) => {
    await page.goto('/challenges/pack_basics/q1_select_all');

    // Write incorrect solution
    await page.fill('[data-testid="sql-editor"]', 'SELECT name FROM customers');

    // Submit
    await page.click('button:has-text("Submit")');

    // Verify error feedback
    await expect(page.locator('text=Test Failed')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

### Testing Loading States

```typescript
test('displays loading skeleton while fetching packs', async ({ page }) => {
  // Slow down network to see loading state
  await page.route('/packs/pack_basics/pack.json', async route => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.continue();
  });

  await page.goto('/');

  // Should show skeleton
  await expect(page.locator('.shimmer')).toBeVisible();

  // Should eventually show content
  await expect(page.locator('text=SQL Basics')).toBeVisible();
});
```

### Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focused = await page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
```

## Testing DuckDB Integration

### Unit Testing DuckDB Functions

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { initDuckDB, executeQuery, loadParquet } from '@/app/lib/duck';

describe('DuckDB Integration', () => {
  beforeAll(async () => {
    await initDuckDB();
  });

  it('should execute simple query', async () => {
    const result = await executeQuery('SELECT 1 as num');
    expect(result).toEqual([{ num: 1 }]);
  });

  it('should handle query errors', async () => {
    await expect(executeQuery('INVALID SQL')).rejects.toThrow();
  });

  it('should load parquet files', async () => {
    await loadParquet('test_table', '/path/to/file.parquet');
    const result = await executeQuery('SELECT COUNT(*) as count FROM test_table');
    expect(result[0].count).toBeGreaterThan(0);
  });
});
```

### E2E Testing SQL Execution

```typescript
test('SQL editor executes queries and shows results', async ({ page }) => {
  await page.goto('/challenges/pack_basics/q1_select_all');

  // Wait for DuckDB initialization
  await page.waitForFunction(() => {
    return window.localStorage.getItem('duckdb_ready') === 'true';
  });

  // Enter query
  await page.fill('[data-testid="sql-editor"]', 'SELECT * FROM customers LIMIT 5');

  // Run query
  await page.click('button:has-text("Run")');

  // Verify results displayed
  await expect(page.locator('[data-testid="results-table"]')).toBeVisible();
  await expect(page.locator('table tbody tr')).toHaveCount(5);
});
```

## Testing Progress Tracking

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { markCompleted, getProgress, getAllProgress } from '@/app/lib/progress';

describe('Progress Tracking', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should mark challenge as completed', () => {
    markCompleted('pack_basics', 'q1_select_all', 1500);

    const progress = getProgress('pack_basics', 'q1_select_all');
    expect(progress.completed).toBe(true);
  });

  it('should track multiple attempts', () => {
    markCompleted('pack_basics', 'q1_select_all', 2000);
    markCompleted('pack_basics', 'q1_select_all', 1500);

    const progress = getProgress('pack_basics', 'q1_select_all');
    expect(progress.attempts).toBe(2);
    expect(progress.bestTime).toBe(1500);
  });

  it('should calculate pack completion percentage', () => {
    markCompleted('pack_basics', 'q1', 1000);
    markCompleted('pack_basics', 'q2', 1500);
    // 2 out of 10 challenges = 20%

    const percentage = getPackCompletionPercentage('pack_basics', 10);
    expect(percentage).toBe(20);
  });
});
```

## Test Data Management

### Creating Test Fixtures

```typescript
// tests/fixtures/packs.ts
export const mockPack = {
  schema_version: '1.1',
  min_app_version: '1.0.0',
  id: 'test_pack',
  title: 'Test Pack',
  description: 'Pack for testing',
  metadata: {
    author: 'Test Author',
    locale: 'en-US',
    tags: ['test'],
    difficulty: 'beginner' as const
  },
  datasets: [
    { name: 'customers', src: 'customers.parquet' }
  ],
  challenges: [
    {
      id: 'test_challenge',
      title: 'Test Challenge',
      prompt: 'Write a test query',
      dialect: 'duckdb',
      solution_sql: 'SELECT * FROM customers',
      tests: [
        {
          name: 'row_count',
          assert: 'ROWCOUNT' as const,
          expected: 10
        }
      ],
      limits: {
        timeout_ms: 1500,
        row_limit: 1000
      },
      tags: ['test'],
      difficulty: 'easy' as const
    }
  ]
};

// Use in tests
import { mockPack } from '../fixtures/packs';

it('should load pack', () => {
  const pack = loadPack(mockPack);
  expect(pack.id).toBe('test_pack');
});
```

### Generating Test Data

```typescript
// tests/helpers/dataGenerator.ts
export function generateCustomers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`
  }));
}

export function generateOrders(customerIds: number[], count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    customer_id: customerIds[i % customerIds.length],
    total: Math.random() * 1000,
    order_date: new Date(2024, 0, i + 1).toISOString()
  }));
}
```

## Coverage Requirements

### Target Coverage
- **Unit Tests**: > 80% coverage for core logic
- **E2E Tests**: All critical user flows covered

### Running Coverage

```bash
# Unit test coverage
npm test -- --coverage

# View coverage report
open coverage/index.html
```

### Coverage Best Practices
- Don't chase 100% coverage blindly
- Focus on critical business logic
- Ignore trivial code (getters, simple formatters)
- Test edge cases and error paths

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const promise = asyncFunction();
  await expect(promise).resolves.toBe(expectedValue);
});

it('should reject on error', async () => {
  const promise = failingAsyncFunction();
  await expect(promise).rejects.toThrow('Expected error');
});
```

### Testing Timeouts

```typescript
it('should timeout long queries', async () => {
  const longQuery = 'SELECT * FROM massive_table';
  const result = await gradeQuery(longQuery, tests);

  expect(result.pass).toBe(false);
  expect(result.checks[0].message).toContain('timeout');
}, 5000); // Set test timeout higher than query timeout
```

### Testing State Changes

```typescript
test('progress updates in localStorage', async ({ page }) => {
  await page.goto('/challenges/pack_basics/q1');

  // Complete challenge
  await page.fill('[data-testid="editor"]', 'SELECT * FROM customers');
  await page.click('button:has-text("Submit")');

  // Verify localStorage updated
  const progress = await page.evaluate(() => {
    return localStorage.getItem('progress');
  });

  expect(JSON.parse(progress)).toHaveProperty('pack_basics.q1');
});
```

## Debugging Tests

### Vitest Debugging

```typescript
import { describe, it, expect } from 'vitest';

it('should debug this test', () => {
  const value = complexFunction();

  // Add debugger breakpoint
  debugger;

  // Log for inspection
  console.log('Value:', value);

  expect(value).toBe(expected);
});
```

Run with: `npm test -- --inspect-brk`

### Playwright Debugging

```bash
# Run with headed browser
npm run test:e2e -- --headed

# Run with debug mode (step through)
npm run test:e2e -- --debug

# Run specific test
npm run test:e2e -- -g "specific test name"
```

### Screenshots on Failure

```typescript
test('take screenshot on failure', async ({ page }) => {
  await page.goto('/challenges/pack_basics/q1');

  try {
    await expect(page.locator('text=Expected Text')).toBeVisible();
  } catch (error) {
    await page.screenshot({ path: 'test-failure.png' });
    throw error;
  }
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run unit tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e
```

## Test Checklist

Before merging code:

### Unit Tests
- [ ] Core logic is tested
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Mocks used appropriately
- [ ] Tests pass locally
- [ ] Coverage meets threshold

### E2E Tests
- [ ] Critical flows tested
- [ ] Loading states verified
- [ ] Error states tested
- [ ] Accessibility checked
- [ ] Tests pass in CI
- [ ] No flaky tests

### Code Quality
- [ ] Tests are readable
- [ ] Test names are descriptive
- [ ] No unnecessary waits/delays
- [ ] Proper test organization
- [ ] Fixtures reused where appropriate

## When to Use This Skill

Invoke this skill when:
- Writing tests for new features
- Fixing bugs (write test first!)
- Improving test coverage
- Debugging failing tests
- Setting up E2E test scenarios
- Testing DuckDB integration
- Ensuring accessibility compliance
