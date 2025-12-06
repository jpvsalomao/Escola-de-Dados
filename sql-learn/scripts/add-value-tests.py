#!/usr/bin/env python3
"""
Add value-verification tests to Meta Interview challenges.

This script modifies pack.json to add tests that verify actual computed values,
preventing false positives from conceptually incorrect answers.

Usage:
    python scripts/add-value-tests.py
"""

import json
import duckdb
from pathlib import Path
from datetime import datetime

# Expected values for each challenge (computed from solution SQL)
EXPECTED_VALUES = {
    "q1_average_post_hiatus": {
        # First row - user 4 with 335 days
        "tests": [
            {"name": "first_user_correct", "sql": "SELECT user_id = 4 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_days_between_correct", "sql": "SELECT days_between = 335 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q2_mau_retention": {
        # 4 users retained from June to July
        "tests": [
            {"name": "correct_retained_count", "sql": "SELECT COUNT(*) = 4 AS ok FROM ({{USER_SQL}})", "expected": [{"ok": True}]}
        ]
    },
    "q5_friend_recommendations": {
        # First recommendation: user1=2, user2=4, shared_events=3
        "tests": [
            {"name": "first_pair_correct", "sql": "SELECT user1_id = 2 AND user2_id = 4 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_shared_count_correct", "sql": "SELECT shared_events_count = 3 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q6_weekly_churn_rate": {
        # First week: signup_week=1, total=10, churned=3, rate=30
        "tests": [
            {"name": "week1_signups_correct", "sql": "SELECT total_signups = 10 AS ok FROM ({{USER_SQL}}) WHERE signup_week = 1", "expected": [{"ok": True}]},
            {"name": "week1_churned_correct", "sql": "SELECT churned_users = 3 AS ok FROM ({{USER_SQL}}) WHERE signup_week = 1", "expected": [{"ok": True}]},
            {"name": "week1_rate_correct", "sql": "SELECT ABS(churn_rate - 30.0) < 0.01 AS ok FROM ({{USER_SQL}}) WHERE signup_week = 1", "expected": [{"ok": True}]}
        ]
    },
    "q8_users_3plus_calls": {
        # First user: caller_id=3, distinct_callees=6
        "tests": [
            {"name": "first_caller_correct", "sql": "SELECT caller_id = 3 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_callees_correct", "sql": "SELECT distinct_callees = 6 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q9_comment_histogram": {
        # Bucket '0' has 5 users
        "tests": [
            {"name": "bucket_0_count_correct", "sql": "SELECT user_count = 5 AS ok FROM ({{USER_SQL}}) WHERE comment_bucket = '0'", "expected": [{"ok": True}]}
        ]
    },
    "q10_rolling_7day_active": {
        # First day: 2024-11-01 has 9 rolling users
        "tests": [
            {"name": "first_day_rolling_correct", "sql": "SELECT rolling_7day_users = 9 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q11_consecutive_login_streak": {
        # First user: user_id=8, streak=15
        "tests": [
            {"name": "first_user_correct", "sql": "SELECT user_id = 8 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_streak_correct", "sql": "SELECT longest_streak = 15 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q13_page_recommendations": {
        # First rec: user=1, page=4, friends=8
        "tests": [
            {"name": "first_user_correct", "sql": "SELECT user_id = 1 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_page_correct", "sql": "SELECT page_id = 4 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_friends_count_correct", "sql": "SELECT friends_who_liked = 8 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q14_second_highest_engagement": {
        # Entertainment category: post_id=20, score=394
        "tests": [
            {"name": "entertainment_post_correct", "sql": "SELECT post_id = 20 AS ok FROM ({{USER_SQL}}) WHERE category = 'entertainment'", "expected": [{"ok": True}]},
            {"name": "entertainment_score_correct", "sql": "SELECT engagement_score = 394 AS ok FROM ({{USER_SQL}}) WHERE category = 'entertainment'", "expected": [{"ok": True}]}
        ]
    },
    "q15_cumulative_revenue": {
        # Month 1: revenue=10000, ytd=10000
        "tests": [
            {"name": "month1_revenue_correct", "sql": "SELECT monthly_revenue = 10000 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]},
            {"name": "month1_ytd_correct", "sql": "SELECT ytd_revenue = 10000 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]}
        ]
    },
    "q16_mutual_friends_count": {
        # First pair: user1=6, user2=8, mutual=6
        "tests": [
            {"name": "first_pair_users_correct", "sql": "SELECT user1_id = 6 AND user2_id = 8 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_mutual_count_correct", "sql": "SELECT mutual_friend_count = 6 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q17_dau_mau_stickiness": {
        # Month 1: avg_dau=1.21, mau=11, stickiness=11.04
        "tests": [
            {"name": "month1_mau_correct", "sql": "SELECT mau = 11 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]},
            {"name": "month1_stickiness_correct", "sql": "SELECT ABS(stickiness_ratio - 11.04) < 0.1 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]}
        ]
    },
    "q19_first_activity": {
        # First user: user_id=1, total=40
        "tests": [
            {"name": "first_user_correct", "sql": "SELECT user_id = 1 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]},
            {"name": "first_total_correct", "sql": "SELECT total_activities = 40 AS ok FROM ({{USER_SQL}}) LIMIT 1", "expected": [{"ok": True}]}
        ]
    },
    "q20_yoy_mau_growth": {
        # Month 1: mau_2024=206, mau_2023=180, growth=14.44
        "tests": [
            {"name": "month1_mau_2024_correct", "sql": "SELECT mau_2024 = 206 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]},
            {"name": "month1_mau_2023_correct", "sql": "SELECT mau_2023 = 180 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]},
            {"name": "month1_growth_correct", "sql": "SELECT ABS(yoy_growth_rate - 14.44) < 0.1 AS ok FROM ({{USER_SQL}}) WHERE month = 1", "expected": [{"ok": True}]}
        ]
    }
}

def main():
    pack_dir = Path(__file__).parent.parent / "public" / "packs" / "pack_meta_interview"
    pack_json = pack_dir / "pack.json"

    # Load pack
    with open(pack_json, 'r') as f:
        pack = json.load(f)

    print(f"Processing {len(pack['challenges'])} challenges...\n")

    modified = 0
    for challenge in pack['challenges']:
        challenge_id = challenge['id']

        if challenge_id in EXPECTED_VALUES:
            new_tests = EXPECTED_VALUES[challenge_id]['tests']
            existing_test_names = {t['name'] for t in challenge['tests']}

            added = 0
            for new_test in new_tests:
                if new_test['name'] not in existing_test_names:
                    challenge['tests'].append({
                        "name": new_test['name'],
                        "assert": "SQL",
                        "sql": new_test['sql'],
                        "expected": new_test['expected']
                    })
                    added += 1

            if added > 0:
                print(f"✓ {challenge_id}: Added {added} value-verification tests")
                modified += 1
            else:
                print(f"  {challenge_id}: Already has value tests")
        else:
            print(f"  {challenge_id}: No new tests defined")

    # Save updated pack
    with open(pack_json, 'w') as f:
        json.dump(pack, f, indent=2)

    print(f"\n{'='*40}")
    print(f"Modified {modified} challenges")
    print(f"Pack saved to {pack_json}")

if __name__ == "__main__":
    main()
