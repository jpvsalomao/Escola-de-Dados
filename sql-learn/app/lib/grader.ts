import type { Test, GradeResult, GradeOptions } from "./types";
import { executeQueryWithTimeout, getTableSchema } from "./duck";
import { config } from "./config";

/**
 * Grade a user's SQL query against a set of tests
 */
export async function gradeQuery(
  userSql: string,
  tests: Test[],
  options: GradeOptions = {}
): Promise<GradeResult> {
  const checks: Array<{ name: string; pass: boolean; message?: string }> = [];
  let elapsedMs = 0;
  let rowsReturned = 0;

  // Normalize the SQL query - trim whitespace and remove trailing semicolons
  const normalizedSql = userSql.trim().replace(/;+\s*$/, '');

  try {
    // Execute user query with timeout
    const { data, elapsedMs: queryTime } = await executeQueryWithTimeout(
      normalizedSql,
      config.limits.timeoutMs
    );
    elapsedMs = queryTime;
    rowsReturned = data.length;

    // Check row limit
    if (rowsReturned > config.limits.maxRowsLoadedPerPack) {
      return {
        pass: false,
        checks: [
          {
            name: "row_limit",
            pass: false,
            message: `Query returned ${rowsReturned} rows, exceeding limit of ${config.limits.maxRowsLoadedPerPack}`,
          },
        ],
        stats: { elapsedMs, rowsReturned },
      };
    }

    // Run each test
    for (const test of tests) {
      const check = await runTest(test, normalizedSql, data, options);
      checks.push(check);
    }
  } catch (error) {
    return {
      pass: false,
      checks: [
        {
          name: "execution_error",
          pass: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ],
      stats: { elapsedMs, rowsReturned },
    };
  }

  const pass = checks.every((c) => c.pass);

  return {
    pass,
    checks,
    stats: { elapsedMs, rowsReturned },
  };
}

/**
 * Run a single test
 */
async function runTest(
  test: Test,
  userSql: string,
  userData: unknown[],
  options: GradeOptions
): Promise<{ name: string; pass: boolean; message?: string }> {
  switch (test.assert) {
    case "ROWCOUNT":
      return checkRowCount(test, userData);

    case "SQL":
      return await checkSQL(test, userSql);

    case "SCHEMA_EQ":
      return await checkSchemaEq(test, userSql);

    case "SET_EQ":
      return checkSetEq(test, userData, options);

    case "NEAR":
      return checkNear(test, userData, options);

    default:
      return {
        name: test.name,
        pass: false,
        message: `Unknown assert type: ${test.assert}`,
      };
  }
}

/**
 * Check row count
 */
function checkRowCount(
  test: Test,
  userData: unknown[]
): { name: string; pass: boolean; message?: string } {
  const expected = test.expected as number;
  const actual = userData.length;
  const pass = actual === expected;

  return {
    name: test.name,
    pass,
    message: pass ? undefined : `Expected ${expected} rows, got ${actual}`,
  };
}

/**
 * Check using SQL assertion
 */
async function checkSQL(
  test: Test,
  userSql: string
): Promise<{ name: string; pass: boolean; message?: string }> {
  if (!test.sql) {
    return { name: test.name, pass: false, message: "SQL test missing sql field" };
  }

  // Replace {{USER_SQL}} with actual user SQL
  const assertSql = test.sql.replace(/\{\{USER_SQL\}\}/g, `(${userSql})`);

  try {
    const { data } = await executeQueryWithTimeout(assertSql);
    const expected = test.expected as Array<Record<string, unknown>>;

    const pass = deepEqual(data, expected);

    return {
      name: test.name,
      pass,
      message: pass ? undefined : `Assertion failed. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(data)}`,
    };
  } catch (error) {
    return {
      name: test.name,
      pass: false,
      message: error instanceof Error ? error.message : "SQL assertion failed",
    };
  }
}

/**
 * Check schema equality
 */
async function checkSchemaEq(
  test: Test,
  userSql: string
): Promise<{ name: string; pass: boolean; message?: string }> {
  if (!test.schema) {
    return { name: test.name, pass: false, message: "SCHEMA_EQ test missing schema field" };
  }

  try {
    // Create a temporary table from user query to get its schema
    const tempTable = `temp_schema_check_${Date.now()}`;
    await executeQueryWithTimeout(`CREATE TEMP TABLE ${tempTable} AS ${userSql}`);
    const actualSchema = await getTableSchema(tempTable);
    await executeQueryWithTimeout(`DROP TABLE ${tempTable}`);

    const expectedSchema = test.schema;

    // Compare schemas
    if (actualSchema.length !== expectedSchema.length) {
      return {
        name: test.name,
        pass: false,
        message: `Schema mismatch: expected ${expectedSchema.length} columns, got ${actualSchema.length}`,
      };
    }

    for (let i = 0; i < expectedSchema.length; i++) {
      if (
        actualSchema[i].name !== expectedSchema[i].name ||
        !typesMatch(actualSchema[i].type, expectedSchema[i].type)
      ) {
        return {
          name: test.name,
          pass: false,
          message: `Schema mismatch at column ${i}: expected ${expectedSchema[i].name}:${expectedSchema[i].type}, got ${actualSchema[i].name}:${actualSchema[i].type}`,
        };
      }
    }

    return { name: test.name, pass: true };
  } catch (error) {
    return {
      name: test.name,
      pass: false,
      message: error instanceof Error ? error.message : "Schema check failed",
    };
  }
}

/**
 * Check set equality (order-insensitive)
 */
function checkSetEq(
  test: Test,
  userData: unknown[],
  options: GradeOptions
): { name: string; pass: boolean; message?: string } {
  const expected = test.expected as unknown[];

  if (userData.length !== expected.length) {
    return {
      name: test.name,
      pass: false,
      message: `Set size mismatch: expected ${expected.length}, got ${userData.length}`,
    };
  }

  // Sort both arrays for comparison
  const sortedUser = [...userData].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const sortedExpected = [...expected].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  const pass = deepEqual(sortedUser, sortedExpected, options);

  return {
    name: test.name,
    pass,
    message: pass ? undefined : "Sets do not match",
  };
}

/**
 * Check numeric values with tolerance
 */
function checkNear(
  test: Test,
  userData: unknown[],
  options: GradeOptions
): { name: string; pass: boolean; message?: string } {
  const expected = test.expected as unknown[];
  const tolerance = test.tolerance || options.floatTolerance || { abs: 0.0001 };

  if (userData.length !== expected.length) {
    return {
      name: test.name,
      pass: false,
      message: `Row count mismatch: expected ${expected.length}, got ${userData.length}`,
    };
  }

  for (let i = 0; i < expected.length; i++) {
    if (!nearEqual(userData[i], expected[i], tolerance)) {
      return {
        name: test.name,
        pass: false,
        message: `Value mismatch at row ${i}`,
      };
    }
  }

  return { name: test.name, pass: true };
}

/**
 * Deep equality check
 */
function deepEqual(a: unknown, b: unknown, options: GradeOptions = {}): boolean {
  if (a === b) return true;

  if (a === null || b === null) {
    if (options.nullsEqual) return a === b;
    return false;
  }

  if (typeof a !== typeof b) return false;

  if (typeof a === "number" && typeof b === "number") {
    if (isNaN(a) && isNaN(b)) return true;
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index], options));
  }

  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as object).sort();
    const bKeys = Object.keys(b as object).sort();

    if (!deepEqual(aKeys, bKeys, options)) return false;

    return aKeys.every((key) =>
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], options)
    );
  }

  return false;
}

/**
 * Check if two values are near equal (for floats)
 */
function nearEqual(
  a: unknown,
  b: unknown,
  tolerance: { abs?: number; rel?: number }
): boolean {
  if (typeof a === "number" && typeof b === "number") {
    if (tolerance.abs !== undefined) {
      return Math.abs(a - b) <= tolerance.abs;
    }
    if (tolerance.rel !== undefined) {
      return Math.abs(a - b) <= tolerance.rel * Math.max(Math.abs(a), Math.abs(b));
    }
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => nearEqual(item, b[index], tolerance));
  }

  if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();

    if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) return false;

    return aKeys.every((key) =>
      nearEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], tolerance)
    );
  }

  return deepEqual(a, b);
}

/**
 * Check if two SQL types match (case-insensitive, normalize)
 */
function typesMatch(type1: string, type2: string): boolean {
  const normalize = (t: string) => t.toLowerCase().trim();
  return normalize(type1) === normalize(type2);
}
