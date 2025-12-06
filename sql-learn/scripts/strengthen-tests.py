#!/usr/bin/env python3
"""
Strengthen test assertions for Meta Interview challenges.

This script adds value-verification tests to challenges that only have
structural tests (row count, column names) but don't verify actual values.

Usage:
    python scripts/strengthen-tests.py
"""

import json
import duckdb
from pathlib import Path

def get_expected_values(conn, solution_sql):
    """Execute solution and return expected values."""
    sql = solution_sql.rstrip(';').strip()
    try:
        result = conn.execute(sql).fetchdf()
        if len(result) == 0:
            return None
        # Return first row as dict
        return result.iloc[0].to_dict()
    except Exception as e:
        print(f"Error executing solution: {e}")
        return None

def generate_value_tests(challenge_id, expected_values, num_cols=3):
    """Generate tests that verify actual values based on challenge type."""
    tests = []

    if expected_values is None:
        return tests

    # For single-row results with numeric values
    if len(expected_values) <= 5:
        for col_name, value in expected_values.items():
            if isinstance(value, (int, float)):
                # Use NEAR for floats, exact match for ints
                if isinstance(value, float) or '.' in str(value):
                    tests.append({
                        "name": f"correct_{col_name}",
                        "assert": "SQL",
                        "sql": f"SELECT ABS({col_name} - {value}) < 0.01 AS ok FROM ({{{{USER_SQL}}}})",
                        "expected": [{"ok": True}]
                    })
                else:
                    tests.append({
                        "name": f"correct_{col_name}",
                        "assert": "SQL",
                        "sql": f"SELECT {col_name} = {value} AS ok FROM ({{{{USER_SQL}}}})",
                        "expected": [{"ok": True}]
                    })

    return tests

def main():
    pack_dir = Path(__file__).parent.parent / "public" / "packs" / "pack_meta_interview"
    pack_json = pack_dir / "pack.json"

    # Load pack
    with open(pack_json, 'r') as f:
        pack = json.load(f)

    # Create DuckDB connection and load data
    conn = duckdb.connect(':memory:')

    # Load datasets
    parquet_files = list(pack_dir.glob("*.parquet"))
    for parquet_file in parquet_files:
        table_name = parquet_file.stem
        conn.execute(f"CREATE TABLE IF NOT EXISTS {table_name} AS SELECT * FROM read_parquet('{parquet_file}')")

    print(f"Loaded {len(parquet_files)} datasets\n")

    # Analyze each challenge
    for challenge in pack['challenges']:
        challenge_id = challenge['id']
        solution_sql = challenge.get('solution_sql', '')
        tests = challenge.get('tests', [])

        print(f"=== {challenge_id} ===")

        # Check if already has value tests
        has_value_test = any(
            'correct_' in t.get('name', '') or
            t.get('assert') == 'SET_EQ' or
            t.get('assert') == 'NEAR'
            for t in tests
        )

        if has_value_test:
            print("  Already has value verification tests\n")
            continue

        # Get expected values
        expected = get_expected_values(conn, solution_sql)
        if expected:
            print(f"  Expected values: {expected}")

            # Generate new tests
            new_tests = generate_value_tests(challenge_id, expected)
            if new_tests:
                print(f"  Suggested tests:")
                for t in new_tests:
                    print(f"    - {t['name']}")
        else:
            print("  Could not compute expected values")
        print()

    conn.close()

if __name__ == "__main__":
    main()
