#!/usr/bin/env node
/**
 * CI Check: Enforce documentation updates when code changes
 *
 * Rule: If files in /app or /lib change, at least one of these must also change:
 * - docs/CONTEXT_INDEX.md
 * - docs/CHANGELOG.md
 * - docs/ADR/*.md
 *
 * This ensures documentation stays in sync with code.
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("path");

// Detect if we're in CI or local environment
const isCI = process.env.CI === "true";

// Get the base branch to compare against
const baseBranch = process.env.BASE_BRANCH || "main";

// Function to get changed files
function getChangedFiles() {
  try {
    // In CI, compare against base branch
    if (isCI) {
      // Fetch the base branch
      execSync(`git fetch origin ${baseBranch}:${baseBranch}`, { stdio: "ignore" });
      const diff = execSync(`git diff --name-only origin/${baseBranch}...HEAD`, {
        encoding: "utf8",
      });
      return diff.trim().split("\n").filter(Boolean);
    } else {
      // Locally, check staged files or uncommitted changes
      let diff = execSync("git diff --cached --name-only", { encoding: "utf8" });
      if (!diff.trim()) {
        // No staged files, check unstaged changes
        diff = execSync("git diff --name-only", { encoding: "utf8" });
      }
      return diff.trim().split("\n").filter(Boolean);
    }
  } catch (error) {
    console.error("Error getting changed files:", error.message);
    // If git commands fail, don't block (might be first commit, detached head, etc.)
    return [];
  }
}

function main() {
  console.log("🔍 Checking if documentation was updated alongside code changes...\n");

  const changedFiles = getChangedFiles();

  if (changedFiles.length === 0) {
    console.log("ℹ️  No changed files detected (or git not initialized)");
    console.log("✅ Docs check passed (no-op)\n");
    return;
  }

  console.log(`Changed files (${changedFiles.length}):`);
  changedFiles.forEach((file) => console.log(`  - ${file}`));
  console.log();

  // Check if any code files changed
  const codePatterns = [/^app\//, /^lib\//];
  const codeTouched = changedFiles.some((file) =>
    codePatterns.some((pattern) => pattern.test(file))
  );

  if (!codeTouched) {
    console.log("✅ No code files changed (app/ or lib/), docs check skipped\n");
    return;
  }

  console.log("⚠️  Code files changed - checking for documentation updates...\n");

  // Check if any documentation files changed
  const docsPatterns = [
    /^docs\/CONTEXT_INDEX\.md$/,
    /^docs\/CHANGELOG\.md$/,
    /^docs\/ADR\/.+\.md$/,
  ];

  const docsTouched = changedFiles.some((file) =>
    docsPatterns.some((pattern) => pattern.test(file))
  );

  if (docsTouched) {
    console.log("✅ Documentation was updated:");
    changedFiles
      .filter((file) => docsPatterns.some((pattern) => pattern.test(file)))
      .forEach((file) => console.log(`  ✓ ${file}`));
    console.log("\n✅ Docs check passed\n");
    return;
  }

  // Documentation was NOT updated
  console.error("❌ Docs check FAILED\n");
  console.error("Code was changed but documentation was not updated.");
  console.error("\nYou must update at least ONE of the following files:");
  console.error("  • docs/CONTEXT_INDEX.md - Update module description and 'Last Changed' date");
  console.error("  • docs/CHANGELOG.md - Add entry under [Unreleased] section");
  console.error("  • docs/ADR/ADR-NNNN-*.md - Create new ADR for design decisions\n");
  console.error("See docs/PLAYBOOKS/iteration-playbook.md for guidance.\n");
  process.exit(1);
}

main();
