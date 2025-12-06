#!/usr/bin/env python3
"""
Test all challenge solutions against DuckDB to verify they produce correct results.

This script:
1. Loads all parquet files into DuckDB
2. Runs each challenge's solution_sql
3. Runs each test assertion against the solution
4. Reports pass/fail status

Usage:
    python scripts/test-solutions-duckdb.py [challenge_id]

Examples:
    python scripts/test-solutions-duckdb.py                    # Test all challenges
    python scripts/test-solutions-duckdb.py q2_mau_retention   # Test specific challenge
"""

import json
import sys
import os
import duckdb
from pathlib import Path

# ANSI color codes
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
RESET = '\033[0m'
BOLD = '\033[1m'

def load_datasets(conn, pack_dir):
    """Load all parquet files from the pack directory into DuckDB."""
    parquet_files = list(Path(pack_dir).glob("*.parquet"))
    print(f"\n{CYAN}Loading {len(parquet_files)} datasets...{RESET}")

    for parquet_file in parquet_files:
        table_name = parquet_file.stem
        conn.execute(f"CREATE TABLE IF NOT EXISTS {table_name} AS SELECT * FROM read_parquet('{parquet_file}')")
        row_count = conn.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]
        print(f"  {table_name}: {row_count} rows")

    print()

def run_solution(conn, solution_sql):
    """Execute the solution SQL and return results."""
    # Remove trailing semicolon (matching grader behavior)
    sql = solution_sql.rstrip(';').strip()
    try:
        result = conn.execute(sql).fetchdf()
        return result, None
    except Exception as e:
        return None, str(e)

def run_test(conn, test, user_sql):
    """Run a single test assertion and return (passed, message)."""
    user_sql_clean = user_sql.rstrip(';').strip()

    if test['assert'] == 'ROWCOUNT':
        try:
            result = conn.execute(user_sql_clean).fetchdf()
            actual_count = len(result)
            expected_count = test['expected']
            passed = actual_count == expected_count
            msg = f"Expected {expected_count} rows, got {actual_count}"
            return passed, msg
        except Exception as e:
            return False, f"SQL Error: {e}"

    elif test['assert'] == 'SQL':
        try:
            # Replace {{USER_SQL}} with the actual user SQL
            test_sql = test['sql'].replace('{{USER_SQL}}', user_sql_clean)
            result = conn.execute(test_sql).fetchdf()

            # Check against expected
            expected = test['expected']
            if isinstance(expected, list) and len(expected) > 0:
                # Compare first row
                actual_row = result.iloc[0].to_dict() if len(result) > 0 else {}
                expected_row = expected[0]

                passed = True
                msg_parts = []
                for key, exp_val in expected_row.items():
                    if key in actual_row:
                        act_val = actual_row[key]
                        # Handle boolean comparisons
                        if isinstance(exp_val, bool):
                            act_val = bool(act_val)
                        if act_val != exp_val:
                            passed = False
                            msg_parts.append(f"{key}: expected {exp_val}, got {act_val}")
                    else:
                        passed = False
                        msg_parts.append(f"Missing key: {key}")

                msg = "; ".join(msg_parts) if msg_parts else "OK"
                return passed, msg
            else:
                return True, "No expected value to compare"
        except Exception as e:
            return False, f"SQL Error: {e}"

    elif test['assert'] == 'SCHEMA_EQ':
        try:
            result = conn.execute(user_sql_clean).fetchdf()
            actual_cols = list(result.columns)
            expected_cols = test.get('expected_columns', [])
            passed = actual_cols == expected_cols
            msg = f"Expected columns {expected_cols}, got {actual_cols}"
            return passed, msg
        except Exception as e:
            return False, f"SQL Error: {e}"

    else:
        return True, f"Unknown assert type: {test['assert']}"

def test_challenge(conn, challenge, verbose=True):
    """Test a single challenge and return results."""
    challenge_id = challenge['id']
    title = challenge['title']
    solution_sql = challenge.get('solution_sql', '')
    tests = challenge.get('tests', [])

    if verbose:
        print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
        print(f"{BOLD}Challenge: {title}{RESET}")
        print(f"ID: {challenge_id}")
        print(f"{CYAN}{'='*60}{RESET}")

    if not solution_sql:
        if verbose:
            print(f"{RED}  ❌ No solution_sql provided{RESET}")
        return {'id': challenge_id, 'passed': False, 'error': 'No solution'}

    # Run the solution
    if verbose:
        print(f"\n{YELLOW}Solution SQL:{RESET}")
        print(f"  {solution_sql[:100]}..." if len(solution_sql) > 100 else f"  {solution_sql}")

    result_df, error = run_solution(conn, solution_sql)

    if error:
        if verbose:
            print(f"\n{RED}  ❌ Solution Error: {error}{RESET}")
        return {'id': challenge_id, 'passed': False, 'error': error}

    if verbose:
        print(f"\n{GREEN}  ✓ Solution executed successfully ({len(result_df)} rows){RESET}")
        if len(result_df) <= 10:
            print(f"\n  Result preview:")
            print(result_df.to_string(index=False).replace('\n', '\n  '))

    # Run tests
    if verbose:
        print(f"\n{CYAN}Running {len(tests)} tests:{RESET}")

    all_passed = True
    test_results = []

    for test in tests:
        test_name = test.get('name', 'unnamed')
        passed, msg = run_test(conn, test, solution_sql)
        test_results.append({'name': test_name, 'passed': passed, 'message': msg})

        if passed:
            if verbose:
                print(f"  {GREEN}✓ {test_name}{RESET}")
        else:
            all_passed = False
            if verbose:
                print(f"  {RED}✗ {test_name}: {msg}{RESET}")

    return {
        'id': challenge_id,
        'title': title,
        'passed': all_passed,
        'tests': test_results
    }

def main():
    pack_dir = Path(__file__).parent.parent / "public" / "packs" / "pack_meta_interview"
    pack_json = pack_dir / "pack.json"

    if not pack_json.exists():
        print(f"{RED}Error: pack.json not found at {pack_json}{RESET}")
        sys.exit(1)

    # Load pack
    with open(pack_json, 'r') as f:
        pack = json.load(f)

    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}Testing Pack: {pack['title']}{RESET}")
    print(f"Challenges: {len(pack['challenges'])}")
    print(f"{CYAN}{'='*60}{RESET}")

    # Create DuckDB connection
    conn = duckdb.connect(':memory:')

    # Load all datasets
    load_datasets(conn, pack_dir)

    # Get specific challenge ID if provided
    target_challenge = sys.argv[1] if len(sys.argv) > 1 else None

    # Test challenges
    results = []
    for challenge in pack['challenges']:
        if target_challenge and challenge['id'] != target_challenge:
            continue

        result = test_challenge(conn, challenge, verbose=True)
        results.append(result)

    # Summary
    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}SUMMARY{RESET}")
    print(f"{CYAN}{'='*60}{RESET}")

    passed = sum(1 for r in results if r['passed'])
    failed = len(results) - passed

    print(f"\n{GREEN}✓ Passed: {passed}{RESET}")
    print(f"{RED}✗ Failed: {failed}{RESET}")

    if failed > 0:
        print(f"\n{RED}Failed challenges:{RESET}")
        for r in results:
            if not r['passed']:
                print(f"  - {r['id']}: {r.get('title', 'Unknown')}")
                if 'error' in r:
                    print(f"    Error: {r['error']}")
                elif 'tests' in r:
                    for t in r['tests']:
                        if not t['passed']:
                            print(f"    - {t['name']}: {t['message']}")

    print(f"\n{CYAN}{'='*60}{RESET}\n")

    conn.close()
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
