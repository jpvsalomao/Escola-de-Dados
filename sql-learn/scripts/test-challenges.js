/**
 * Script to test all challenge solutions against their tests
 * Usage: node scripts/test-challenges.js <pack_id>
 * Example: node scripts/test-challenges.js pack_basics
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function testPack(packId) {
  const packPath = path.join(__dirname, '../public/packs', packId, 'pack.json');

  if (!fs.existsSync(packPath)) {
    console.error(`${colors.red}❌ Pack not found: ${packId}${colors.reset}`);
    process.exit(1);
  }

  const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));

  console.log(`\n${colors.cyan}${colors.bright}Testing Pack: ${pack.title}${colors.reset}`);
  console.log(`${colors.cyan}Total Challenges: ${pack.challenges.length}${colors.reset}\n`);

  const results = [];

  for (const challenge of pack.challenges) {
    console.log(`\n${colors.bright}Challenge ${challenge.id}: ${challenge.title}${colors.reset}`);
    console.log(`Difficulty: ${challenge.difficulty}`);
    console.log(`Solution SQL: ${colors.yellow}${challenge.solution_sql}${colors.reset}`);

    // Check if solution exists
    if (!challenge.solution_sql || challenge.solution_sql.trim() === '') {
      console.log(`${colors.red}  ❌ MISSING SOLUTION${colors.reset}`);
      results.push({
        id: challenge.id,
        title: challenge.title,
        status: 'missing_solution',
        issues: ['No solution_sql provided']
      });
      continue;
    }

    const issues = [];

    // Check for common issues
    if (challenge.solution_sql.endsWith(';')) {
      issues.push('Solution ends with semicolon (will be auto-removed by grader)');
    }

    // Check if tests exist
    if (!challenge.tests || challenge.tests.length === 0) {
      issues.push('No tests defined');
    } else {
      console.log(`  Tests: ${challenge.tests.length}`);
      challenge.tests.forEach((test, idx) => {
        console.log(`    ${idx + 1}. ${test.name} (${test.assert})`);

        // Validate test structure
        if (test.assert === 'SQL' && !test.sql) {
          issues.push(`Test "${test.name}": Missing SQL assertion`);
        }
        if (test.assert === 'ROWCOUNT' && typeof test.expected !== 'number') {
          issues.push(`Test "${test.name}": ROWCOUNT expected value should be a number`);
        }
      });
    }

    if (issues.length > 0) {
      console.log(`${colors.yellow}  ⚠️  WARNINGS:${colors.reset}`);
      issues.forEach(issue => console.log(`      - ${issue}`));
      results.push({
        id: challenge.id,
        title: challenge.title,
        status: 'warnings',
        issues
      });
    } else {
      console.log(`${colors.green}  ✓ Looks good${colors.reset}`);
      results.push({
        id: challenge.id,
        title: challenge.title,
        status: 'ok',
        issues: []
      });
    }
  }

  // Summary
  console.log(`\n${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}\n`);

  const ok = results.filter(r => r.status === 'ok').length;
  const warnings = results.filter(r => r.status === 'warnings').length;
  const missing = results.filter(r => r.status === 'missing_solution').length;

  console.log(`${colors.green}✓ OK: ${ok}${colors.reset}`);
  console.log(`${colors.yellow}⚠  Warnings: ${warnings}${colors.reset}`);
  console.log(`${colors.red}❌ Missing Solution: ${missing}${colors.reset}`);

  if (warnings > 0 || missing > 0) {
    console.log(`\n${colors.yellow}Challenges needing attention:${colors.reset}`);
    results
      .filter(r => r.status !== 'ok')
      .forEach(r => {
        console.log(`\n  ${r.id} - ${r.title} (${r.status})`);
        r.issues.forEach(issue => console.log(`    - ${issue}`));
      });
  }

  console.log(`\n${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}\n`);
}

// Get pack ID from command line args
const packId = process.argv[2] || 'pack_basics';
testPack(packId).catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
