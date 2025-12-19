#!/usr/bin/env python3
"""
Meta Interview Pack v3 - Comprehensive Data Generator with Edge Cases

This script generates ALL datasets for the pack_meta_interview challenges with
carefully designed edge cases to catch common SQL mistakes:

1. Data OUTSIDE expected ranges (2023, 2025 data to test year filters)
2. Decoy users (partial month activity, repeated calls to same person)
3. Boundary cases (exactly 4-day streaks, exactly 1 post, etc.)
4. Edge cases for each specific challenge

Usage:
    python scripts/generate-meta-interview-data-v3.py

For detailed edge case documentation, see: docs/DATA_DESIGN.md
"""

import pandas as pd
import numpy as np
from datetime import datetime, date, timedelta
import random
import os
from pathlib import Path

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "packs" / "pack_meta_interview"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 70)
print("Meta Interview Pack v3 - Comprehensive Data Generator")
print("=" * 70)


# ============================================================
# 1. USERS TABLE (30 users - expanded from 20)
# ============================================================
def generate_users():
    """
    Base users table with 30 users:
    - Users 1-20: Core users with full activity
    - Users 21-25: Edge case users (minimal activity)
    - Users 26-30: Decoy users (should be excluded by most queries)
    """
    print("\n[1/18] Generating users.parquet...")

    users_data = {
        "user_id": list(range(1, 31)),
        "username": [
            # Core users 1-20
            "alice_smith", "bob_jones", "carol_white", "david_brown", "emma_davis",
            "frank_miller", "grace_wilson", "henry_moore", "iris_taylor", "jack_anderson",
            "kate_thomas", "leo_jackson", "mia_harris", "noah_martin", "olivia_garcia",
            "peter_lee", "quinn_adams", "rachel_king", "sam_wright", "tina_clark",
            # Edge case users 21-25
            "uma_edge1", "victor_edge2", "wendy_edge3", "xavier_edge4", "yara_edge5",
            # Decoy users 26-30
            "zack_decoy1", "amy_decoy2", "brian_decoy3", "chloe_decoy4", "dan_decoy5"
        ],
        "email": [f"user{i}@example.com" for i in range(1, 31)],
        "country": [
            "US", "US", "BR", "US", "UK", "US", "BR", "US", "UK", "US",
            "BR", "US", "UK", "US", "BR", "US", "UK", "BR", "US", "UK",
            "US", "BR", "UK", "US", "BR", "US", "UK", "BR", "US", "UK"
        ],
        "signup_date": [
            # Core users
            "2023-01-15", "2023-02-20", "2023-03-10", "2023-04-05", "2023-05-12",
            "2023-06-18", "2023-07-22", "2023-08-30", "2023-09-14", "2023-10-25",
            "2023-11-08", "2023-12-01", "2024-01-10", "2024-02-15", "2024-03-20",
            "2024-04-01", "2024-05-10", "2024-06-01", "2024-06-05", "2024-06-10",
            # Edge case users
            "2024-07-01", "2024-07-15", "2024-08-01", "2024-08-15", "2024-09-01",
            # Decoy users
            "2024-05-01", "2024-05-15", "2024-06-01", "2024-06-15", "2024-07-01"
        ],
        "is_active": [True] * 28 + [False, True]
    }

    df = pd.DataFrame(users_data)
    df['signup_date'] = pd.to_datetime(df['signup_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "users.parquet", index=False)
    print(f"   Created {len(df)} users (20 core + 5 edge + 5 decoy)")
    return df


# ============================================================
# 2. POSTS TABLE (Q1: Average Post Hiatus, Q14: Second Highest Engagement)
# ============================================================
def generate_posts():
    """
    Q1: Average Post Hiatus
    - 7 users with 2+ posts in 2024 (correct answer)

    Edge cases:
    - Posts from 2023 (must be excluded by WHERE YEAR = 2024)
    - Posts from 2025 (must be excluded by WHERE YEAR = 2024)
    - User with exactly 1 post in 2024 (excluded by HAVING COUNT >= 2)
    - User with 2 posts on same day (days_between = 0)

    Q14: Second Highest Engagement per Category
    - 5 categories with clear rankings
    - Category with tied second-highest scores
    - Category with only 1 post (should be excluded)
    """
    print("\n[2/18] Generating posts.parquet...")

    posts_data = []
    post_id = 1

    # ===== Q1 DATA: Post Hiatus =====

    # Users with 2+ posts in 2024 (will be in results) - 7 users
    multi_posters_2024 = {
        1: ["2024-04-07", "2024-07-09"],                 # days_between = 93
        3: ["2024-01-14", "2024-02-20"],                 # days_between = 37
        5: ["2024-04-27", "2024-11-24"],                 # days_between = 211 (FIRST - highest)
        10: ["2024-07-06", "2024-07-06"],                # days_between = 0 (same day)
        12: ["2024-02-06", "2024-02-18"],                # days_between = 12
        14: ["2024-06-13", "2024-10-25"],                # days_between = 134
        18: ["2024-03-21", "2024-07-18"],                # days_between = 119
    }

    # EDGE CASE: User with exactly 1 post in 2024 (excluded by HAVING)
    single_posters_2024 = {
        21: ["2024-07-04"],  # Edge case user - only 1 post
        9: ["2024-08-20"],
        11: ["2024-09-15"],
    }

    # EDGE CASE: Posts from 2023 (excluded by WHERE year=2024)
    posts_2023 = {
        1: ["2023-12-25", "2023-11-11"],  # User 1 also has 2024 posts
        2: ["2023-10-05", "2023-08-15"],  # User 2 only has 2023 posts
        3: ["2023-06-20"],                 # User 3 also has 2024 posts
        4: ["2023-05-10", "2023-03-22"],  # User 4 only has 2023 posts
        6: ["2023-09-01"],                 # User 6 only has 2023 posts
    }

    # EDGE CASE: Posts from 2025 (excluded by WHERE year=2024)
    posts_2025 = {
        5: ["2025-01-15"],   # User 5 also has 2024 posts
        7: ["2025-01-20"],   # User 7 only has 2025 posts
        8: ["2025-02-01"],   # User 8 only has 2025 posts
    }

    categories = ["tech", "lifestyle", "news", "sports", "entertainment"]

    # Generate Q1 posts
    for user_id, dates in multi_posters_2024.items():
        for post_date in dates:
            posts_data.append({
                "post_id": post_id,
                "user_id": user_id,
                "post_date": post_date,
                "content": f"Post {post_id} content",
                "category": random.choice(categories[:3]),  # Only first 3 categories for Q1 posts
                "engagement_score": random.randint(100, 500)
            })
            post_id += 1

    for user_id, dates in single_posters_2024.items():
        for post_date in dates:
            posts_data.append({
                "post_id": post_id,
                "user_id": user_id,
                "post_date": post_date,
                "content": f"Post {post_id} content",
                "category": random.choice(categories[:3]),
                "engagement_score": random.randint(100, 500)
            })
            post_id += 1

    for user_id, dates in posts_2023.items():
        for post_date in dates:
            posts_data.append({
                "post_id": post_id,
                "user_id": user_id,
                "post_date": post_date,
                "content": f"Post {post_id} content",
                "category": random.choice(categories[:3]),
                "engagement_score": random.randint(100, 500)
            })
            post_id += 1

    for user_id, dates in posts_2025.items():
        for post_date in dates:
            posts_data.append({
                "post_id": post_id,
                "user_id": user_id,
                "post_date": post_date,
                "content": f"Post {post_id} content",
                "category": random.choice(categories[:3]),
                "engagement_score": random.randint(100, 500)
            })
            post_id += 1

    # ===== Q14 DATA: Second Highest Engagement per Category =====

    # Category engagement scores (designed for clear 2nd place)
    category_scores = {
        "tech": [950, 850, 850, 700, 600],      # Tied 2nd place at 850
        "lifestyle": [900, 750, 600, 500],       # Clear 2nd at 750
        "news": [800, 650, 500],                 # Clear 2nd at 650
        "sports": [700, 550],                    # Only 2 posts - 2nd is 550
        "entertainment": [600, 480, 350, 200],   # Clear 2nd at 480
        "single": [999],                         # EDGE CASE: Only 1 post - should be excluded
    }

    for category, scores in category_scores.items():
        for score in scores:
            posts_data.append({
                "post_id": post_id,
                "user_id": random.randint(1, 20),
                "post_date": f"2024-{random.randint(1, 11):02d}-{random.randint(1, 28):02d}",
                "content": f"Q14 post in {category}",
                "category": category,
                "engagement_score": score
            })
            post_id += 1

    df = pd.DataFrame(posts_data)
    df['post_date'] = pd.to_datetime(df['post_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "posts.parquet", index=False)

    print(f"   Created {len(df)} posts")
    print(f"   - Q1: 7 users with 2+ posts in 2024 (expected answer)")
    print(f"   - Edge: 5 posts from 2023, 3 posts from 2025")
    print(f"   - Edge: 1 user with exactly 1 post in 2024")
    print(f"   - Q14: 6 categories including 'single' with only 1 post")
    return df


# ============================================================
# 3. ACTIONS TABLE (Q2, Q3, Q10, Q19)
# ============================================================
def generate_actions():
    """
    Multi-purpose table for:
    - Q2: MAU Retention (users in both June AND July 2024)
    - Q3: CTR calculation by app
    - Q10: Rolling 7-day active users
    - Q19: First activity and total activities

    Edge cases:
    - Users active in June ONLY (decoys for retention)
    - Users active in July ONLY (decoys for retention)
    - App with 0 clicks (CTR = 0)
    - App with clicks but 0 impressions (should be excluded)
    - Actions from 2023 (should be excluded from 2024 CTR)
    - Actions from Oct 31 and Dec 1 (boundary testing for Nov rolling window)
    """
    print("\n[3/18] Generating actions.parquet...")

    actions_data = []
    action_id = 1

    # ===== Q2: MAU Retention =====
    # Users active in BOTH June AND July 2024: 1, 2, 3, 4, 5, 6 (answer = 6 users)
    both_months_users = [1, 2, 3, 4, 5, 6]

    # EDGE CASE: Users active in June ONLY (should NOT be in retention)
    june_only_users = [26, 27]  # Decoy users

    # EDGE CASE: Users active in July ONLY (should NOT be in retention)
    july_only_users = [28, 29]  # Decoy users

    # User active in both months but only 1 day each (still counts)
    both_months_users.append(30)

    # Generate June 2024 actions
    for user_id in june_only_users + both_months_users:
        num_actions = 3 if user_id == 30 else random.randint(2, 4)
        for _ in range(num_actions):
            day = random.randint(1, 30)
            actions_data.append({
                "action_id": action_id,
                "user_id": user_id,
                "app_id": random.randint(1, 4),
                "action_type": random.choice(["login", "post", "like", "comment"]),
                "action_date": f"2024-06-{day:02d}"
            })
            action_id += 1

    # Generate July 2024 actions
    for user_id in july_only_users + both_months_users:
        num_actions = 3 if user_id == 30 else random.randint(2, 4)
        for _ in range(num_actions):
            day = random.randint(1, 31)
            actions_data.append({
                "action_id": action_id,
                "user_id": user_id,
                "app_id": random.randint(1, 4),
                "action_type": random.choice(["login", "post", "like", "comment"]),
                "action_date": f"2024-07-{day:02d}"
            })
            action_id += 1

    # ===== Q3: CTR calculation =====
    # App 1: 40 impressions, 10 clicks = 25% CTR
    # App 2: 60 impressions, 9 clicks = 15% CTR
    # App 3: 80 impressions, 4 clicks = 5% CTR
    # App 4: 100 impressions, 2 clicks = 2% CTR
    # App 5: 50 impressions, 0 clicks = 0% CTR (EDGE CASE)
    # App 6: 0 impressions, 5 clicks (EDGE CASE - should be excluded)

    ctr_design = {
        1: {"impressions": 40, "clicks": 10},   # 25.00%
        2: {"impressions": 60, "clicks": 9},    # 15.00%
        3: {"impressions": 80, "clicks": 4},    # 5.00%
        4: {"impressions": 100, "clicks": 2},   # 2.00%
        5: {"impressions": 50, "clicks": 0},    # 0.00% - EDGE CASE
        6: {"impressions": 0, "clicks": 5},     # excluded - EDGE CASE
    }

    for app_id, counts in ctr_design.items():
        # Add impressions
        for _ in range(counts["impressions"]):
            actions_data.append({
                "action_id": action_id,
                "user_id": random.randint(1, 20),
                "app_id": app_id,
                "action_type": "impression",
                "action_date": f"2024-{random.randint(1, 11):02d}-{random.randint(1, 28):02d}"
            })
            action_id += 1

        # Add clicks
        for _ in range(counts["clicks"]):
            actions_data.append({
                "action_id": action_id,
                "user_id": random.randint(1, 20),
                "app_id": app_id,
                "action_type": "click",
                "action_date": f"2024-{random.randint(1, 11):02d}-{random.randint(1, 28):02d}"
            })
            action_id += 1

    # EDGE CASE: Actions from 2023 (should NOT count for 2024 CTR)
    for _ in range(20):
        actions_data.append({
            "action_id": action_id,
            "user_id": random.randint(1, 20),
            "app_id": random.randint(1, 4),
            "action_type": random.choice(["impression", "click"]),
            "action_date": f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
        })
        action_id += 1

    # ===== Q10: Rolling 7-Day Active Users (November 2024) =====
    # EDGE CASE: Actions from Oct 31 (should NOT appear in Nov 1's 7-day window if using >= Nov 1)
    for user_id in range(1, 6):
        actions_data.append({
            "action_id": action_id,
            "user_id": user_id,
            "app_id": random.randint(1, 4),
            "action_type": "login",
            "action_date": "2024-10-31"
        })
        action_id += 1

    # November data (30 days)
    for day in range(1, 31):
        # Vary the number of active users per day (between 5-15)
        num_active = random.randint(5, 15)
        active_users = random.sample(range(1, 21), num_active)
        for user_id in active_users:
            actions_data.append({
                "action_id": action_id,
                "user_id": user_id,
                "app_id": random.randint(1, 4),
                "action_type": random.choice(["login", "post", "like"]),
                "action_date": f"2024-11-{day:02d}"
            })
            action_id += 1

    # EDGE CASE: Actions from Dec 1 (should NOT appear in Nov 30's forward window)
    for user_id in range(1, 6):
        actions_data.append({
            "action_id": action_id,
            "user_id": user_id,
            "app_id": random.randint(1, 4),
            "action_type": "login",
            "action_date": "2024-12-01"
        })
        action_id += 1

    df = pd.DataFrame(actions_data)
    df['action_date'] = pd.to_datetime(df['action_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "actions.parquet", index=False)

    print(f"   Created {len(df)} actions")
    print(f"   - Q2: 6 users in both June & July (+ 2 June-only, 2 July-only decoys)")
    print(f"   - Q3: 5 apps with valid CTR + 1 app with no impressions")
    print(f"   - Q10: 30 days November + Oct 31 & Dec 1 boundary data")
    return df


# ============================================================
# 4. PAGES TABLE (Q4: Pages With No Likes)
# ============================================================
def generate_pages():
    """
    Q4: Pages With No Likes
    - 10 pages total
    - Pages 8, 9, 10 have NO likes (answer = 3 pages)
    """
    print("\n[4/18] Generating pages.parquet...")

    pages_data = {
        "page_id": list(range(1, 11)),
        "page_name": [
            "Meta Developers", "React Community", "PyTorch Hub", "Instagram Creators",
            "WhatsApp Business", "Oculus Gaming", "Facebook AI", "Spark AR Studio",
            "Workplace Hub", "Meta Open Source"
        ],
        "category": [
            "Technology", "Technology", "Technology", "Lifestyle",
            "Business", "Gaming", "Technology", "Creative",
            "Business", "Technology"
        ],
        "created_date": [f"2023-{i:02d}-01" for i in range(1, 11)]
    }

    df = pd.DataFrame(pages_data)
    df['created_date'] = pd.to_datetime(df['created_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "pages.parquet", index=False)
    print(f"   Created {len(df)} pages (pages 8, 9, 10 will have NO likes)")
    return df


# ============================================================
# 5. PAGE_LIKES TABLE (Q4, Q13)
# ============================================================
def generate_page_likes():
    """
    Q4: Pages With No Likes - pages 8, 9, 10 have NO likes
    Q13: Page Recommendations - friends' likes for recommendations

    Edge case:
    - Page 11 could have a NULL user_id like (testing NULL handling)
      But we keep it simple: pages 8-10 simply have no records
    """
    print("\n[5/18] Generating page_likes.parquet...")

    page_likes_data = []
    like_id = 1

    # Only pages 1-7 have likes (pages 8-10 have NONE)
    for page_id in range(1, 8):
        num_likes = random.randint(3, 8)
        likers = random.sample(range(1, 21), num_likes)
        for user_id in likers:
            page_likes_data.append({
                "like_id": like_id,
                "user_id": user_id,
                "page_id": page_id,
                "liked_date": f"2024-{random.randint(1, 11):02d}-{random.randint(1, 28):02d}"
            })
            like_id += 1

    df = pd.DataFrame(page_likes_data)
    df['liked_date'] = pd.to_datetime(df['liked_date']).dt.date
    df = df.drop_duplicates(subset=["user_id", "page_id"])
    df.to_parquet(OUTPUT_DIR / "page_likes.parquet", index=False)

    print(f"   Created {len(df)} page likes (NONE for pages 8, 9, 10)")
    return df


# ============================================================
# 6. EVENTS TABLE (Q5: Friend Recommendations)
# ============================================================
def generate_events():
    """
    Q5: Friend Recommendations based on shared private events
    - Private events for shared attendance
    - Public events (should NOT count)
    """
    print("\n[6/18] Generating events.parquet...")

    events_data = {
        "event_id": list(range(1, 21)),
        "event_name": [
            # Private events (1-12)
            "Tech Meetup", "Book Club", "Hiking Trip", "Coding Workshop",
            "Wine Tasting", "Game Night", "Cooking Class", "Photography Walk",
            "Startup Pitch", "Meditation Session", "Art Class", "Music Jam",
            # Public events (13-20)
            "Movie Night", "Yoga Class", "Art Exhibition", "Music Festival",
            "Dance Party", "Food Fair", "Sports Day", "Community Picnic"
        ],
        "is_private": [
            # 1-12 are private
            True, True, True, True, True, True, True, True, True, True, True, True,
            # 13-20 are public
            False, False, False, False, False, False, False, False
        ],
        "event_date": [
            f"2024-{(i % 12) + 1:02d}-{((i * 3) % 28) + 1:02d}"
            for i in range(1, 21)
        ]
    }

    df = pd.DataFrame(events_data)
    df['event_date'] = pd.to_datetime(df['event_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "events.parquet", index=False)
    print(f"   Created {len(df)} events (12 private, 8 public)")
    return df


# ============================================================
# 7. EVENT_ATTENDANCE TABLE (Q5: Friend Recommendations)
# ============================================================
def generate_event_attendance():
    """
    Q5: Friend Recommendations
    Design pairs that share 2+ PRIVATE events and are NOT friends.

    Edge cases:
    - Pair sharing 3 private events but ARE friends (should be excluded)
    - Pair sharing 2 PUBLIC events (should be excluded - only private counts)
    - Pair sharing only 1 private event (should be excluded - need 2+)
    """
    print("\n[7/18] Generating event_attendance.parquet...")

    # Design attendance to create specific recommendation pairs
    # Private events: 1-12, Public events: 13-20

    # Pairs that SHOULD be recommended (share 2+ private, NOT friends):
    # (1, 3): share private 1, 2, 3 - NOT friends
    # (2, 4): share private 1, 4, 5 - NOT friends
    # (5, 7): share private 2, 6, 8 - NOT friends
    # (8, 10): share private 3, 9 - NOT friends
    # (11, 13): share private 7, 10 - NOT friends
    # (12, 14): share private 11, 12 - NOT friends

    attendance_mapping = {
        # Users 1-4: recommendation pairs (1,3) and (2,4)
        1: [1, 2, 3, 4],           # Private events
        2: [1, 4, 5, 6],           # Private events
        3: [1, 2, 3, 7],           # Private events - shares 3 with user 1
        4: [1, 4, 5, 8],           # Private events - shares 3 with user 2

        # Users 5-7: recommendation pair (5,7)
        5: [2, 6, 8, 9],           # Private events
        6: [3, 5, 10],             # Private events (user 6 is friends with 5)
        7: [2, 6, 8, 11],          # Private events - shares 3 with user 5

        # Users 8-10: recommendation pair (8,10)
        8: [3, 9, 10, 12],         # Private events
        9: [4, 7, 9],              # Private events
        10: [3, 9, 11, 12],        # Private events - shares 2 with user 8

        # Users 11-14: recommendation pairs (11,13) and (12,14)
        11: [7, 10, 1],            # Private events
        12: [11, 12, 2],           # Private events
        13: [7, 10, 3],            # Private events - shares 2 with user 11
        14: [11, 12, 4],           # Private events - shares 2 with user 12

        # EDGE CASE: Users 15-16 share 3 private events but ARE friends
        15: [1, 2, 3],             # Private events
        16: [1, 2, 3],             # Private events - shares 3 but ARE friends

        # EDGE CASE: Users 17-18 share 2 PUBLIC events (should NOT count)
        17: [13, 14, 1],           # 2 public (13, 14) + 1 private (1)
        18: [13, 14, 2],           # 2 public (13, 14) + 1 private (2) - only 0 shared private

        # EDGE CASE: Users 19-20 share only 1 private event (need 2+)
        19: [5, 13, 14],           # 1 private (5)
        20: [5, 15, 16],           # 1 private (5) - only 1 shared
    }

    attendance_data = []
    attendance_id = 1

    for user_id, events in attendance_mapping.items():
        for event_id in events:
            attendance_data.append({
                "attendance_id": attendance_id,
                "user_id": user_id,
                "event_id": event_id,
                "attendance_status": random.choice(["going", "interested", "maybe"])
            })
            attendance_id += 1

    df = pd.DataFrame(attendance_data)
    df.to_parquet(OUTPUT_DIR / "event_attendance.parquet", index=False)

    print(f"   Created {len(df)} attendance records")
    print(f"   - 6 valid recommendation pairs (share 2+ private, not friends)")
    print(f"   - Edge: pair (15,16) shares 3 private but ARE friends")
    print(f"   - Edge: pair (17,18) shares 2 PUBLIC only")
    print(f"   - Edge: pair (19,20) shares only 1 private")
    return df


# ============================================================
# 8. FRIENDSHIPS TABLE (Q5, Q13, Q16)
# ============================================================
def generate_friendships():
    """
    Friendship graph for:
    - Q5: Friend recommendations (exclude existing friends)
    - Q13: Page recommendations from friends
    - Q16: Mutual friends count

    Edge cases:
    - Users 15-16 ARE friends (should be excluded from Q5 despite shared events)
    - Pairs with exactly 2 mutual friends (boundary for Q16's 3+ requirement)
    """
    print("\n[8/18] Generating friendships.parquet...")

    friendships_raw = [
        # Core friendship network
        (1, 2), (1, 4), (2, 3), (2, 6), (3, 4), (3, 8),
        (4, 6), (4, 10), (5, 6), (5, 9), (6, 7), (6, 10),
        (7, 9), (8, 9), (8, 10), (9, 10),

        # Connections for users 11-14
        (11, 12), (12, 13), (13, 14), (14, 15),

        # EDGE CASE: Users 15-16 ARE friends (for Q5 edge case)
        (15, 16),

        # More connections for mutual friends calculation (Q16)
        (1, 5), (2, 5), (3, 5), (4, 5),  # User 5 friends with 1,2,3,4
        (1, 7), (2, 7),                   # User 7 friends with 1,2
        (16, 17), (17, 18), (18, 19), (19, 20),

        # Sparse connections for users 21-30
        (21, 1), (22, 2), (23, 3), (24, 4), (25, 5),
        (26, 6), (27, 7), (28, 8), (29, 9), (30, 10),
    ]

    friendships_data = []
    friendship_id = 1

    seen = set()
    for a, b in friendships_raw:
        pair = (min(a, b), max(a, b))
        if pair not in seen:
            seen.add(pair)
            friendships_data.append({
                "friendship_id": friendship_id,
                "user1_id": pair[0],
                "user2_id": pair[1],
                "friendship_date": f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
            })
            friendship_id += 1

    df = pd.DataFrame(friendships_data)
    df['friendship_date'] = pd.to_datetime(df['friendship_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "friendships.parquet", index=False)

    print(f"   Created {len(df)} friendship pairs")
    print(f"   - Includes (15, 16) friendship for Q5 edge case")
    return df


# ============================================================
# 9. SIGNUPS TABLE (Q6: Weekly Churn Rate)
# ============================================================
def generate_signups():
    """
    Q6: Weekly Churn Rate
    Design: Users who signed up in June 2024 with varying churn rates.

    Edge cases:
    - User who signed up, logged in 27 days later (NOT churned - within 28 days)
    - User who signed up, logged in 29 days later (churned - beyond 28 days)
    - Week with high churn vs low churn for testing
    """
    print("\n[9/18] Generating signups.parquet...")

    signups_data = []
    signup_id = 1

    # Week 1 (June 1-7): 10 signups, 3 churned (30% churn)
    # Week 2 (June 8-14): 12 signups, 2 churned (16.67% churn)
    # Week 3 (June 15-21): 8 signups, 4 churned (50% churn)
    # Week 4 (June 22-28): 15 signups, 3 churned (20% churn)

    churn_design = [
        {"week": 1, "start": 1, "end": 7, "total": 10, "churned": 3},
        {"week": 2, "start": 8, "end": 14, "total": 12, "churned": 2},
        {"week": 3, "start": 15, "end": 21, "total": 8, "churned": 4},
        {"week": 4, "start": 22, "end": 28, "total": 15, "churned": 3},
    ]

    for week_data in churn_design:
        for i in range(week_data["total"]):
            day = random.randint(week_data["start"], week_data["end"])
            is_churned = i < week_data["churned"]

            signup_date = date(2024, 6, day)

            if is_churned:
                # Churned = last login within first few days, then nothing
                last_login = signup_date + timedelta(days=random.randint(1, 15))
            else:
                # Active users have recent logins (November)
                last_login = date(2024, 11, random.randint(1, 28))

            signups_data.append({
                "signup_id": signup_id,
                "user_id": 100 + signup_id,
                "signup_date": signup_date,
                "last_login_date": last_login,
                "signup_week": week_data["week"]
            })
            signup_id += 1

    # EDGE CASE: User logged in exactly 27 days later (NOT churned)
    signups_data.append({
        "signup_id": signup_id,
        "user_id": 100 + signup_id,
        "signup_date": date(2024, 6, 10),
        "last_login_date": date(2024, 7, 7),  # 27 days later - within 28
        "signup_week": 2
    })
    signup_id += 1

    # EDGE CASE: User logged in exactly 29 days later (churned)
    signups_data.append({
        "signup_id": signup_id,
        "user_id": 100 + signup_id,
        "signup_date": date(2024, 6, 10),
        "last_login_date": date(2024, 7, 9),  # 29 days later - beyond 28
        "signup_week": 2
    })
    signup_id += 1

    df = pd.DataFrame(signups_data)
    df.to_parquet(OUTPUT_DIR / "signups.parquet", index=False)

    print(f"   Created {len(df)} signups across 4 weeks")
    print(f"   - Week 1: 30% churn, Week 2: ~17% churn")
    print(f"   - Week 3: 50% churn, Week 4: 20% churn")
    print(f"   - Edge: 27-day login (not churned) vs 29-day login (churned)")
    return df


# ============================================================
# 10. CALLS TABLE (Q7, Q8)
# ============================================================
def generate_calls():
    """
    Q7: Messenger Video Call Percentage
    Q8: Users With 3+ Distinct Calls

    Edge cases:
    - User 50: Makes 5 calls to SAME person (should NOT count as 3+ distinct)
    - User 51: Makes 3 calls to 2 distinct people (should NOT count as 3+ distinct)
    - User made video call but NOT on Messenger that day (for Q7)
    """
    print("\n[10/18] Generating calls.parquet...")

    calls_data = []
    call_id = 1

    # ===== Q8: Users with 3+ distinct callees in last 7 days =====
    # Last 7 days = 2024-11-24 to 2024-11-30

    # Users 1-5 each call 3+ distinct people (answer = 5 users)
    high_callers = {
        1: [2, 3, 4, 5],      # 4 distinct people
        2: [1, 3, 6],         # 3 distinct people
        3: [1, 2, 4, 7, 8],   # 5 distinct people
        4: [1, 5, 6, 9],      # 4 distinct people
        5: [2, 3, 10],        # 3 distinct people
    }

    # Users who called fewer than 3 distinct people
    low_callers = {
        6: [1, 2],            # 2 distinct people
        7: [3],               # 1 distinct person
        8: [4],               # 1 distinct person
    }

    # EDGE CASE: User 50 calls SAME person 5 times (should NOT qualify)
    repeat_caller = {
        50: [99, 99, 99, 99, 99],  # 5 calls to user 99 = only 1 distinct
    }

    # EDGE CASE: User 51 calls 2 distinct people 3 times total
    almost_qualifier = {
        51: [98, 98, 97],     # 3 calls but only 2 distinct people
    }

    for caller_id, callees in high_callers.items():
        for callee_id in callees:
            calls_data.append({
                "call_id": call_id,
                "caller_id": caller_id,
                "callee_id": callee_id,
                "call_type": random.choice(["video", "audio"]),
                "call_date": f"2024-11-{random.randint(24, 30):02d}",
                "duration_seconds": random.randint(60, 1800)
            })
            call_id += 1

    for caller_id, callees in low_callers.items():
        for callee_id in callees:
            calls_data.append({
                "call_id": call_id,
                "caller_id": caller_id,
                "callee_id": callee_id,
                "call_type": random.choice(["video", "audio"]),
                "call_date": f"2024-11-{random.randint(24, 30):02d}",
                "duration_seconds": random.randint(60, 1800)
            })
            call_id += 1

    for caller_id, callees in repeat_caller.items():
        for callee_id in callees:
            calls_data.append({
                "call_id": call_id,
                "caller_id": caller_id,
                "callee_id": callee_id,
                "call_type": "audio",
                "call_date": f"2024-11-{random.randint(24, 30):02d}",
                "duration_seconds": random.randint(60, 1800)
            })
            call_id += 1

    for caller_id, callees in almost_qualifier.items():
        for callee_id in callees:
            calls_data.append({
                "call_id": call_id,
                "caller_id": caller_id,
                "callee_id": callee_id,
                "call_type": "audio",
                "call_date": f"2024-11-{random.randint(24, 30):02d}",
                "duration_seconds": random.randint(60, 1800)
            })
            call_id += 1

    # ===== Q7: Video call percentage (yesterday = 2024-11-29) =====
    # Video callers on 2024-11-29: Users 1, 3, 5 (will be counted if on Messenger)
    video_callers_yesterday = [1, 3, 5]

    for user_id in video_callers_yesterday:
        calls_data.append({
            "call_id": call_id,
            "caller_id": user_id,
            "callee_id": random.choice([x for x in range(1, 21) if x != user_id]),
            "call_type": "video",
            "call_date": "2024-11-29",
            "duration_seconds": random.randint(300, 1200)
        })
        call_id += 1

    # EDGE CASE: User 52 made video call yesterday but NOT on Messenger
    calls_data.append({
        "call_id": call_id,
        "caller_id": 52,
        "callee_id": 53,
        "call_type": "video",
        "call_date": "2024-11-29",
        "duration_seconds": 600
    })
    call_id += 1

    df = pd.DataFrame(calls_data)
    df['call_date'] = pd.to_datetime(df['call_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "calls.parquet", index=False)

    print(f"   Created {len(df)} calls")
    print(f"   - Q8: 5 users with 3+ distinct callees")
    print(f"   - Edge: User 50 calls same person 5x (1 distinct)")
    print(f"   - Edge: User 51 calls 2 people 3x total")
    print(f"   - Q7: 3 video callers on 2024-11-29")
    return df


# ============================================================
# 11. MESSENGER_ACTIVITY TABLE (Q7, Q17)
# ============================================================
def generate_messenger_activity():
    """
    Q7: Video Call Percentage
    - Active on Messenger yesterday: 10 users
    - Video callers: 3 out of 10 = 30%

    Q17: DAU/MAU Stickiness
    - Daily active users across multiple months
    """
    print("\n[11/18] Generating messenger_activity.parquet...")

    messenger_data = []
    activity_id = 1

    # Q7: Active on Messenger on 2024-11-29 (yesterday)
    # Users 1-10 are active on Messenger
    messenger_active_yesterday = list(range(1, 11))

    for user_id in messenger_active_yesterday:
        messenger_data.append({
            "activity_id": activity_id,
            "user_id": user_id,
            "activity_type": "message_sent",
            "activity_date": "2024-11-29"
        })
        activity_id += 1

    # Note: User 52 made video call but is NOT in messenger_activity for 2024-11-29
    # This is the edge case - they should NOT count in the percentage

    # Add activity for other days in November (for rolling calculations)
    for day in range(25, 29):
        for user_id in random.sample(range(1, 21), random.randint(5, 12)):
            messenger_data.append({
                "activity_id": activity_id,
                "user_id": user_id,
                "activity_type": random.choice(["message_sent", "message_read", "status_update"]),
                "activity_date": f"2024-11-{day:02d}"
            })
            activity_id += 1

    # Q17: Stickiness data - daily activity across months
    # Generate Jun-Nov 2024 daily data
    for month in range(6, 12):
        days_in_month = 30 if month in [6, 9, 11] else 31
        if month == 11:
            days_in_month = 28  # Only go to 28 to avoid overlap

        for day in range(1, days_in_month + 1):
            # Vary daily active users
            num_active = random.randint(8, 18)
            active_users = random.sample(range(1, 26), num_active)
            for user_id in active_users:
                messenger_data.append({
                    "activity_id": activity_id,
                    "user_id": user_id,
                    "activity_type": random.choice(["message_sent", "message_read"]),
                    "activity_date": f"2024-{month:02d}-{day:02d}"
                })
                activity_id += 1

    df = pd.DataFrame(messenger_data)
    df['activity_date'] = pd.to_datetime(df['activity_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "messenger_activity.parquet", index=False)

    print(f"   Created {len(df)} messenger activity records")
    print(f"   - Q7: 10 users active on 2024-11-29, 3 made video calls (30%)")
    print(f"   - Q17: Daily activity Jun-Nov for stickiness calculation")
    return df


# ============================================================
# 12. COMMENTS TABLE (Q9: Comment Histogram)
# ============================================================
def generate_comments():
    """
    Q9: Comment Histogram
    Distribution of users across comment count buckets:
    - 0 comments: bucket '0'
    - 1-2 comments: bucket '1-2'
    - 3-5 comments: bucket '3-5'
    - 6-10 comments: bucket '6-10'
    - 10+ comments: bucket '10+'

    Edge cases:
    - Users at exact boundaries (0, 1, 2, 3, 5, 6, 10, 11)
    """
    print("\n[12/18] Generating comments.parquet...")

    comments_data = []
    comment_id = 1

    # Design exact bucket distribution
    comment_distribution = {
        # 10+ comments (bucket '10+')
        1: 15,
        2: 12,
        3: 11,   # Exactly 11 - boundary

        # 6-10 comments (bucket '6-10')
        4: 10,   # Exactly 10 - boundary
        5: 8,
        6: 6,    # Exactly 6 - boundary

        # 3-5 comments (bucket '3-5')
        7: 5,    # Exactly 5 - boundary
        8: 4,
        9: 3,    # Exactly 3 - boundary

        # 1-2 comments (bucket '1-2')
        10: 2,   # Exactly 2 - boundary
        11: 1,   # Exactly 1 - boundary
        12: 2,
        13: 1,
        14: 2,
        15: 1,

        # 0 comments (bucket '0') - users 16-20, 26-30
        # No entries for these users
    }

    for user_id, num_comments in comment_distribution.items():
        for _ in range(num_comments):
            comments_data.append({
                "comment_id": comment_id,
                "user_id": user_id,
                "post_id": random.randint(1, 50),
                "comment_text": f"Sample comment {comment_id}",
                "comment_date": f"2024-{random.randint(1, 11):02d}-{random.randint(1, 28):02d}"
            })
            comment_id += 1

    df = pd.DataFrame(comments_data)
    df['comment_date'] = pd.to_datetime(df['comment_date']).dt.date
    df.to_parquet(OUTPUT_DIR / "comments.parquet", index=False)

    # Count users in each bucket
    bucket_counts = {
        "0": 15,        # Users 16-30 have 0 comments
        "1-2": 6,       # Users 10-15
        "3-5": 3,       # Users 7-9
        "6-10": 3,      # Users 4-6
        "10+": 3,       # Users 1-3
    }

    print(f"   Created {len(df)} comments")
    print(f"   - Bucket '0': 15 users (16-30)")
    print(f"   - Bucket '1-2': 6 users")
    print(f"   - Bucket '3-5': 3 users")
    print(f"   - Bucket '6-10': 3 users")
    print(f"   - Bucket '10+': 3 users")
    return df


# ============================================================
# 13. LOGINS TABLE (Q11: Consecutive Login Streak)
# ============================================================
def generate_logins():
    """
    Q11: Consecutive Login Streak
    Find users with 5+ consecutive day login streaks.

    Edge cases:
    - User with exactly 4 consecutive days (should NOT qualify)
    - User with 5 days, gap, 3 days (longest streak = 5, not 8)
    - User with multiple logins per day (count as 1 day)
    """
    print("\n[13/18] Generating logins.parquet...")

    records = []

    # Users with 5+ day streaks (these are the answer) - 8 users
    streak_configs = [
        (1, 15, datetime(2024, 10, 1)),   # User 1: 15-day streak
        (2, 12, datetime(2024, 10, 5)),   # User 2: 12-day streak
        (3, 10, datetime(2024, 10, 10)),  # User 3: 10-day streak
        (4, 9, datetime(2024, 10, 8)),    # User 4: 9-day streak
        (5, 8, datetime(2024, 10, 12)),   # User 5: 8-day streak
        (6, 7, datetime(2024, 10, 15)),   # User 6: 7-day streak
        (7, 6, datetime(2024, 10, 18)),   # User 7: 6-day streak
        (8, 5, datetime(2024, 10, 20)),   # User 8: 5-day streak (minimum)
    ]

    for user_id, streak_len, start_date in streak_configs:
        for day_offset in range(streak_len):
            login_date = start_date + timedelta(days=day_offset)
            # Sometimes multiple logins per day (should count as 1 day)
            num_logins = random.randint(1, 3)
            for _ in range(num_logins):
                records.append({
                    "user_id": user_id,
                    "login_date": login_date.date(),
                    "device_type": random.choice(["mobile", "desktop", "tablet"])
                })

        # Add some non-consecutive logins before the streak
        for _ in range(random.randint(2, 4)):
            extra_date = start_date - timedelta(days=random.randint(10, 30))
            records.append({
                "user_id": user_id,
                "login_date": extra_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

    # EDGE CASE: User 40 with exactly 4 consecutive days (should NOT qualify)
    start_date = datetime(2024, 10, 1)
    for day_offset in range(4):
        login_date = start_date + timedelta(days=day_offset)
        records.append({
            "user_id": 40,
            "login_date": login_date.date(),
            "device_type": "mobile"
        })

    # EDGE CASE: User 41 with 5 days, gap, 3 days (longest streak = 5, not 8)
    start_date = datetime(2024, 10, 1)
    # First streak: 5 days
    for day_offset in range(5):
        login_date = start_date + timedelta(days=day_offset)
        records.append({
            "user_id": 41,
            "login_date": login_date.date(),
            "device_type": "mobile"
        })
    # Gap of 2 days, then 3 more days
    gap_start = start_date + timedelta(days=7)  # Skip day 5 and 6
    for day_offset in range(3):
        login_date = gap_start + timedelta(days=day_offset)
        records.append({
            "user_id": 41,
            "login_date": login_date.date(),
            "device_type": "mobile"
        })

    # Users with broken streaks (shouldn't be in results)
    for user_id in range(42, 50):
        start_date = datetime(2024, 10, 1) + timedelta(days=random.randint(0, 20))
        streak_len = random.randint(1, 4)  # Max 4 days

        for day_offset in range(streak_len):
            login_date = start_date + timedelta(days=day_offset)
            records.append({
                "user_id": user_id,
                "login_date": login_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

    df = pd.DataFrame(records)
    df.to_parquet(OUTPUT_DIR / "logins.parquet", index=False)

    print(f"   Created {len(df)} login records")
    print(f"   - 8 users with 5+ day streaks (answer)")
    print(f"   - Edge: User 40 with exactly 4 days (excluded)")
    print(f"   - Edge: User 41 with 5+3 days but gap (streak=5)")
    return df


# ============================================================
# 14. ADVERTISERS TABLE (Q12: State Machine)
# ============================================================
def generate_advertisers():
    """
    Q12: Advertiser Status Transitions
    Test all 8 state transitions based on payment status.
    """
    print("\n[14/18] Generating advertisers.parquet...")

    # Design specific test cases for each transition
    # User IDs are chosen to make testing easy
    advertisers = [
        # NEW + paid → EXISTING (users 1-2)
        {"user_id": 1, "status": "NEW"},
        {"user_id": 2, "status": "NEW"},

        # NEW + not paid → CHURN (users 3-4)
        {"user_id": 3, "status": "NEW"},
        {"user_id": 4, "status": "NEW"},

        # EXISTING + paid → EXISTING (users 5-7)
        {"user_id": 5, "status": "EXISTING"},
        {"user_id": 6, "status": "EXISTING"},
        {"user_id": 7, "status": "EXISTING"},

        # EXISTING + not paid → CHURN (users 8-10)
        {"user_id": 8, "status": "EXISTING"},
        {"user_id": 9, "status": "EXISTING"},
        {"user_id": 10, "status": "EXISTING"},

        # CHURN + paid → RESURRECT (users 11-13)
        {"user_id": 11, "status": "CHURN"},
        {"user_id": 12, "status": "CHURN"},
        {"user_id": 13, "status": "CHURN"},

        # CHURN + not paid → CHURN (users 14-16)
        {"user_id": 14, "status": "CHURN"},
        {"user_id": 15, "status": "CHURN"},
        {"user_id": 16, "status": "CHURN"},

        # RESURRECT + paid → EXISTING (users 17-18)
        {"user_id": 17, "status": "RESURRECT"},
        {"user_id": 18, "status": "RESURRECT"},

        # RESURRECT + not paid → CHURN (users 19-20)
        {"user_id": 19, "status": "RESURRECT"},
        {"user_id": 20, "status": "RESURRECT"},
    ]

    df = pd.DataFrame(advertisers)
    df.to_parquet(OUTPUT_DIR / "advertisers.parquet", index=False)

    print(f"   Created {len(df)} advertisers")
    print(f"   - NEW: 4 (2 will pay, 2 won't)")
    print(f"   - EXISTING: 6 (3 will pay, 3 won't)")
    print(f"   - CHURN: 6 (3 will pay, 3 won't)")
    print(f"   - RESURRECT: 4 (2 will pay, 2 won't)")
    return df


# ============================================================
# 15. DAILY_PAY TABLE (Q12: State Machine)
# ============================================================
def generate_daily_pay():
    """
    Q12: Advertiser Status Transitions
    Payment records for "today" (2024-12-01)
    """
    print("\n[15/18] Generating daily_pay.parquet...")

    # Users who paid today
    paid_users = [1, 2, 5, 6, 7, 11, 12, 13, 17, 18]

    daily_pay = []
    for user_id in paid_users:
        daily_pay.append({
            "user_id": user_id,
            "paid_date": date(2024, 12, 1),
            "amount": random.randint(50, 500)
        })

    df = pd.DataFrame(daily_pay)
    df.to_parquet(OUTPUT_DIR / "daily_pay.parquet", index=False)

    print(f"   Created {len(df)} payment records for 2024-12-01")
    print(f"   - Paid: users 1,2 (NEW→EXISTING)")
    print(f"   - Paid: users 5,6,7 (EXISTING→EXISTING)")
    print(f"   - Paid: users 11,12,13 (CHURN→RESURRECT)")
    print(f"   - Paid: users 17,18 (RESURRECT→EXISTING)")
    return df


# ============================================================
# 16. TRANSACTIONS TABLE (Q15: Cumulative Revenue)
# ============================================================
def generate_transactions():
    """
    Q15: Cumulative Revenue by Month

    Edge cases:
    - Transactions from 2023 (should be excluded from 2024 cumulative)
    - Multiple transactions same day
    """
    print("\n[16/18] Generating transactions.parquet...")

    records = []
    transaction_id = 1

    # Monthly revenue targets (growing pattern)
    monthly_targets = [
        10000, 10800, 11500, 12300, 13200,  # Jan-May
        14100, 15000, 16200, 17500, 18800,  # Jun-Oct
        20200, 22000                         # Nov-Dec
    ]

    # Generate 2024 transactions
    for month_idx, target in enumerate(monthly_targets):
        month = month_idx + 1
        remaining = target
        day = 1

        while remaining > 0:
            amount = min(remaining, random.randint(50, 500))
            remaining -= amount

            trans_date = date(2024, month, min(day, 28))

            records.append({
                "transaction_id": transaction_id,
                "user_id": random.randint(1, 100),
                "amount": amount,
                "transaction_date": trans_date
            })

            transaction_id += 1
            day = min(day + random.randint(0, 2), 28)

    # EDGE CASE: Add 2023 transactions (should be excluded from 2024 cumulative)
    for month in range(1, 13):
        for _ in range(random.randint(5, 10)):
            records.append({
                "transaction_id": transaction_id,
                "user_id": random.randint(1, 100),
                "amount": random.randint(50, 300),
                "transaction_date": date(2023, month, random.randint(1, 28))
            })
            transaction_id += 1

    df = pd.DataFrame(records)
    df.to_parquet(OUTPUT_DIR / "transactions.parquet", index=False)

    print(f"   Created {len(df)} transactions")
    print(f"   - 2024: 12 months of growing revenue")
    print(f"   - 2023: ~80 transactions (should be excluded)")
    return df


# ============================================================
# 17. USER_RECORDS TABLE (Q18: Deduplication)
# ============================================================
def generate_user_records():
    """
    Q18: Deduplicate User Records
    Keep most recent record per user_id.

    Edge cases:
    - User with 3+ duplicate records
    - Records with different data quality (old records have "(old)" in name)
    """
    print("\n[17/18] Generating user_records.parquet...")

    records = []

    first_names = [
        "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
        "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Paul",
        "Quinn", "Rose", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier",
        "Yara", "Zack", "Amy", "Brian", "Chloe", "David"
    ]

    domains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"]

    # Users 1-15: single record each
    for i in range(1, 16):
        name = first_names[i - 1]
        records.append({
            "user_id": i,
            "name": name,
            "email": f"{name.lower()}@{random.choice(domains)}",
            "updated_at": datetime(2024, 10, random.randint(1, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

    # Users 16-27: 2 records each (duplicates)
    for i in range(16, 28):
        name = first_names[i - 1]
        base_email = f"{name.lower()}@{random.choice(domains)}"

        # Old record
        records.append({
            "user_id": i,
            "name": f"{name} (old)",
            "email": f"{name.lower()}.old@{random.choice(domains)}",
            "updated_at": datetime(2024, 10, random.randint(1, 14),
                                   random.randint(0, 23), random.randint(0, 59))
        })

        # New record (most recent - should be kept)
        records.append({
            "user_id": i,
            "name": name,
            "email": base_email,
            "updated_at": datetime(2024, 11, random.randint(1, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

    # Users 28-30: 3 records each (EDGE CASE)
    for i in range(28, 31):
        name = first_names[i - 1]
        base_email = f"{name.lower()}@{random.choice(domains)}"

        # Oldest record
        records.append({
            "user_id": i,
            "name": f"{name} (oldest)",
            "email": f"{name.lower()}.oldest@{random.choice(domains)}",
            "updated_at": datetime(2024, 9, random.randint(1, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

        # Middle record
        records.append({
            "user_id": i,
            "name": f"{name} (old)",
            "email": f"{name.lower()}.old@{random.choice(domains)}",
            "updated_at": datetime(2024, 10, random.randint(1, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

        # Most recent record (should be kept)
        records.append({
            "user_id": i,
            "name": name,
            "email": base_email,
            "updated_at": datetime(2024, 11, random.randint(15, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

    df = pd.DataFrame(records)
    df.to_parquet(OUTPUT_DIR / "user_records.parquet", index=False)

    print(f"   Created {len(df)} records for 30 users")
    print(f"   - 15 users with 1 record each")
    print(f"   - 12 users with 2 records each")
    print(f"   - 3 users with 3 records each (edge case)")
    return df


# ============================================================
# 18. MONTHLY_ACTIVE TABLE (Q20: YoY MAU Growth)
# ============================================================
def generate_monthly_active():
    """
    Q20: Year-over-Year MAU Growth

    Edge cases:
    - 2022 data (should be excluded from 2023-2024 comparison)
    - Month with negative YoY growth (2024 < 2023)
    - Month with exactly 0% growth
    """
    print("\n[18/18] Generating monthly_active.parquet...")

    records = []

    # 2022 baseline (EDGE CASE - should be excluded)
    base_2022 = [160, 155, 165, 170, 175, 168, 162, 158, 172, 180, 190, 200]

    # 2023 baseline
    base_2023 = [180, 175, 185, 190, 195, 188, 182, 178, 192, 200, 210, 220]

    # 2024 with growth (and edge cases)
    for month in range(1, 13):
        # 2022 data
        records.append({
            "year": 2022,
            "month": month,
            "mau": base_2022[month - 1]
        })

        # 2023 data
        mau_2023 = base_2023[month - 1]
        records.append({
            "year": 2023,
            "month": month,
            "mau": mau_2023
        })

        # 2024 data with varied growth
        if month == 6:
            # EDGE CASE: Negative growth (June 2024 < June 2023)
            mau_2024 = int(mau_2023 * 0.95)  # -5% growth
        elif month == 9:
            # EDGE CASE: Exactly 0% growth
            mau_2024 = mau_2023  # 0% growth
        else:
            # Normal positive growth (12-20%)
            growth_rate = 0.12 + random.uniform(0, 0.08)
            mau_2024 = int(mau_2023 * (1 + growth_rate))

        records.append({
            "year": 2024,
            "month": month,
            "mau": mau_2024
        })

    df = pd.DataFrame(records)
    df.to_parquet(OUTPUT_DIR / "monthly_active.parquet", index=False)

    print(f"   Created {len(df)} monthly MAU records")
    print(f"   - 2022: 12 months (edge case - should be excluded)")
    print(f"   - 2023: 12 months baseline")
    print(f"   - 2024: 12 months with growth variations")
    print(f"   - Edge: June 2024 has negative YoY growth")
    print(f"   - Edge: September 2024 has 0% YoY growth")
    return df


# ============================================================
# MAIN EXECUTION
# ============================================================
def main():
    """Generate all datasets with comprehensive edge cases."""

    # Generate all tables
    generate_users()
    generate_posts()
    generate_actions()
    generate_pages()
    generate_page_likes()
    generate_events()
    generate_event_attendance()
    generate_friendships()
    generate_signups()
    generate_calls()
    generate_messenger_activity()
    generate_comments()
    generate_logins()
    generate_advertisers()
    generate_daily_pay()
    generate_transactions()
    generate_user_records()
    generate_monthly_active()

    # Summary
    print("\n" + "=" * 70)
    print("Dataset Generation Complete!")
    print("=" * 70)
    print(f"\nOutput directory: {OUTPUT_DIR}")

    print("\n" + "-" * 70)
    print("EXPECTED ANSWERS FOR EACH CHALLENGE:")
    print("-" * 70)
    print("Q1  (Post Hiatus):       7 users with 2+ posts in 2024")
    print("Q2  (MAU Retention):     7 users active in both June & July")
    print("Q3  (CTR):               5 apps (25%, 15%, 5%, 2%, 0%)")
    print("Q4  (Pages No Likes):    3 pages (IDs 8, 9, 10)")
    print("Q5  (Friend Recs):       6 user pairs (2+ shared private events)")
    print("Q6  (Weekly Churn):      4 weeks with varying rates")
    print("Q7  (Video Call %):      30% (3/10 active users)")
    print("Q8  (3+ Calls):          5 users")
    print("Q9  (Histogram):         5 buckets, 30 total users")
    print("Q10 (Rolling 7-Day):     30 days of November")
    print("Q11 (Login Streak):      8 users with 5+ day streaks")
    print("Q12 (Advertiser Status): 20 advertisers with state transitions")
    print("Q13 (Page Recs):         Top 3 pages per user from friends")
    print("Q14 (2nd Engagement):    5 categories (excluding 'single')")
    print("Q15 (Cumulative Rev):    12 months of 2024")
    print("Q16 (Mutual Friends):    Pairs with 3+ mutual, not friends")
    print("Q17 (DAU/MAU):           6 months of stickiness ratios")
    print("Q18 (Deduplicate):       30 unique users")
    print("Q19 (First Activity):    Users with first date and count")
    print("Q20 (YoY Growth):        12 months comparing 2023 vs 2024")

    print("\n" + "-" * 70)
    print("KEY EDGE CASES ADDED:")
    print("-" * 70)
    print("- Posts from 2023/2025 (test year filters)")
    print("- June-only and July-only users (test retention intersection)")
    print("- App with 0 clicks, app with no impressions")
    print("- Users 15-16 are friends (test friendship exclusion)")
    print("- User 50 calls same person 5x (test COUNT DISTINCT)")
    print("- User 40 with exactly 4-day streak (boundary)")
    print("- User 41 with broken streak (5+gap+3)")
    print("- 2022 MAU data (test year exclusion)")
    print("- Negative and 0% YoY growth months")
    print("- Users with 3+ duplicate records")
    print("=" * 70)

    # List generated files
    print("\nGenerated files:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith(".parquet"):
            path = OUTPUT_DIR / f
            size = os.path.getsize(path)
            print(f"  {f}: {size:,} bytes")


if __name__ == "__main__":
    main()
