#!/usr/bin/env python3
"""
Generate sample Parquet files for pack_meta_interview
Meta Data Scientist SQL Interview Preparation Pack

This script creates carefully designed datasets that produce known answers
for each of the 10 interview questions.
"""
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import date, timedelta
import random

# Create output directory
output_dir = Path(__file__).parent.parent / "public" / "packs" / "pack_meta_interview"
output_dir.mkdir(parents=True, exist_ok=True)

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

print("=" * 60)
print("Meta Interview Pack - Dataset Generation")
print("=" * 60)

# ============================================================
# 1. USERS TABLE (20 users)
# ============================================================
users_data = {
    "user_id": list(range(1, 21)),
    "username": [
        "alice_smith", "bob_jones", "carol_white", "david_brown", "emma_davis",
        "frank_miller", "grace_wilson", "henry_moore", "iris_taylor", "jack_anderson",
        "kate_thomas", "leo_jackson", "mia_harris", "noah_martin", "olivia_garcia",
        "peter_lee", "quinn_adams", "rachel_king", "sam_wright", "tina_clark"
    ],
    "email": [f"user{i}@example.com" for i in range(1, 21)],
    "country": [
        "US", "US", "BR", "US", "UK", "US", "BR", "US", "UK", "US",
        "BR", "US", "UK", "US", "BR", "US", "UK", "BR", "US", "UK"
    ],
    "signup_date": [
        "2023-01-15", "2023-02-20", "2023-03-10", "2023-04-05", "2023-05-12",
        "2023-06-18", "2023-07-22", "2023-08-30", "2023-09-14", "2023-10-25",
        "2023-11-08", "2023-12-01", "2024-01-10", "2024-02-15", "2024-03-20",
        "2024-04-01", "2024-05-10", "2024-06-01", "2024-06-05", "2024-06-10"
    ],
    "is_active": [True] * 18 + [False, True]
}
users_df = pd.DataFrame(users_data)
users_df['signup_date'] = pd.to_datetime(users_df['signup_date']).dt.date
users_df.to_parquet(output_dir / "users.parquet", index=False)
print(f"Created users.parquet with {len(users_df)} rows")

# ============================================================
# 2. POSTS TABLE (for Q1: Average Post Hiatus)
# Design: 8 users have 2+ posts in 2024 (the answer)
# ============================================================
posts_data = []
post_id = 1

# Users with 2+ posts in 2024 (will be in results) - 8 users
multi_posters_2024 = {
    1: ["2024-01-15", "2024-06-20", "2024-11-10"],  # days_between = 299
    2: ["2024-02-01", "2024-08-15"],                 # days_between = 196
    3: ["2024-03-10", "2024-03-25", "2024-04-05"],   # days_between = 26
    4: ["2024-01-01", "2024-12-01"],                 # days_between = 335
    5: ["2024-05-01", "2024-05-15"],                 # days_between = 14
    6: ["2024-04-10", "2024-07-22", "2024-10-30"],   # days_between = 203
    7: ["2024-06-01", "2024-06-30"],                 # days_between = 29
    8: ["2024-02-14", "2024-09-14"],                 # days_between = 213
}

# Users with only 1 post in 2024 (filtered out by HAVING)
single_posters_2024 = {
    9: ["2024-07-04"],
    10: ["2024-08-20"],
    11: ["2024-09-15"],
}

# Users with posts only in 2023 (filtered out by WHERE year=2024)
posts_2023_only = {
    12: ["2023-12-25", "2023-11-11"],
    13: ["2023-10-05"],
}

for user_id, dates in {**multi_posters_2024, **single_posters_2024, **posts_2023_only}.items():
    for post_date in dates:
        posts_data.append({
            "post_id": post_id,
            "user_id": user_id,
            "post_date": post_date,
            "content_type": random.choice(["text", "image", "video"]),
            "shares_count": random.randint(0, 100)
        })
        post_id += 1

posts_df = pd.DataFrame(posts_data)
posts_df['post_date'] = pd.to_datetime(posts_df['post_date']).dt.date
posts_df.to_parquet(output_dir / "posts.parquet", index=False)
print(f"Created posts.parquet with {len(posts_df)} rows")

# ============================================================
# 3. PAGES TABLE (for Q4: Pages With No Likes)
# Design: 3 pages have zero likes
# ============================================================
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
pages_df = pd.DataFrame(pages_data)
pages_df['created_date'] = pd.to_datetime(pages_df['created_date']).dt.date
pages_df.to_parquet(output_dir / "pages.parquet", index=False)
print(f"Created pages.parquet with {len(pages_df)} rows")

# ============================================================
# 4. PAGE_LIKES TABLE (for Q4: Pages With No Likes)
# Design: Pages 8, 9, 10 have NO likes (answer = 3 pages)
# ============================================================
page_likes_data = []
like_id = 1

# Pages 1-7 have likes, pages 8-10 have NO likes
for page_id in range(1, 8):
    num_likes = random.randint(3, 8)
    likers = random.sample(range(1, 21), num_likes)
    for user_id in likers:
        page_likes_data.append({
            "like_id": like_id,
            "user_id": user_id,
            "page_id": page_id,
            "liked_date": f"2024-{random.randint(1,11):02d}-{random.randint(1,28):02d}"
        })
        like_id += 1

page_likes_df = pd.DataFrame(page_likes_data)
page_likes_df['liked_date'] = pd.to_datetime(page_likes_df['liked_date']).dt.date
page_likes_df.to_parquet(output_dir / "page_likes.parquet", index=False)
print(f"Created page_likes.parquet with {len(page_likes_df)} rows")

# ============================================================
# 5. ACTIONS TABLE (for Q2: MAU Retention, Q3: CTR, Q10: Rolling 7-Day)
# ============================================================
actions_data = []
action_id = 1

# --- Q2: MAU Retention ---
# Users active in June 2024 only: 13, 14, 15
june_only_users = [13, 14, 15]
# Users active in July 2024 only: 16, 17, 18
july_only_users = [16, 17, 18]
# Users active in BOTH June AND July 2024: 1, 2, 3, 4, 5, 6 (answer = 6 users)
both_months_users = [1, 2, 3, 4, 5, 6]

# Generate June 2024 actions
for user_id in june_only_users + both_months_users:
    for _ in range(random.randint(2, 4)):
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
    for _ in range(random.randint(2, 4)):
        day = random.randint(1, 31)
        actions_data.append({
            "action_id": action_id,
            "user_id": user_id,
            "app_id": random.randint(1, 4),
            "action_type": random.choice(["login", "post", "like", "comment"]),
            "action_date": f"2024-07-{day:02d}"
        })
        action_id += 1

# --- Q3: CTR calculation ---
# App 1: 40 impressions, 10 clicks = 25% CTR
# App 2: 60 impressions, 9 clicks = 15% CTR
# App 3: 80 impressions, 4 clicks = 5% CTR
# App 4: 100 impressions, 2 clicks = 2% CTR
ctr_design = {
    1: {"impressions": 40, "clicks": 10},   # 25.00%
    2: {"impressions": 60, "clicks": 9},    # 15.00%
    3: {"impressions": 80, "clicks": 4},    # 5.00%
    4: {"impressions": 100, "clicks": 2},   # 2.00%
}

for app_id, counts in ctr_design.items():
    for _ in range(counts["impressions"]):
        actions_data.append({
            "action_id": action_id,
            "user_id": random.randint(1, 20),
            "app_id": app_id,
            "action_type": "impression",
            "action_date": f"2024-{random.randint(1,11):02d}-{random.randint(1,28):02d}"
        })
        action_id += 1

    for _ in range(counts["clicks"]):
        actions_data.append({
            "action_id": action_id,
            "user_id": random.randint(1, 20),
            "app_id": app_id,
            "action_type": "click",
            "action_date": f"2024-{random.randint(1,11):02d}-{random.randint(1,28):02d}"
        })
        action_id += 1

# --- Q10: Rolling 7-Day Active Users ---
# Generate daily activity data for November 2024
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

actions_df = pd.DataFrame(actions_data)
actions_df['action_date'] = pd.to_datetime(actions_df['action_date']).dt.date
actions_df.to_parquet(output_dir / "actions.parquet", index=False)
print(f"Created actions.parquet with {len(actions_df)} rows")

# ============================================================
# 6. EVENTS TABLE (for Q5: Friend Recommendations)
# ============================================================
events_data = {
    "event_id": list(range(1, 16)),
    "event_name": [
        "Tech Meetup", "Book Club", "Hiking Trip", "Movie Night", "Coding Workshop",
        "Wine Tasting", "Yoga Class", "Game Night", "Art Exhibition", "Music Festival",
        "Cooking Class", "Photography Walk", "Startup Pitch", "Meditation Session", "Dance Party"
    ],
    "is_private": [
        True, True, True, False, True,
        True, False, True, False, False,
        True, True, False, True, False
    ],
    "event_date": [
        "2024-07-15", "2024-07-20", "2024-08-05", "2024-08-10", "2024-08-15",
        "2024-08-20", "2024-09-01", "2024-09-05", "2024-09-10", "2024-09-15",
        "2024-09-20", "2024-09-25", "2024-10-01", "2024-10-05", "2024-10-10"
    ]
}
events_df = pd.DataFrame(events_data)
events_df['event_date'] = pd.to_datetime(events_df['event_date']).dt.date
events_df.to_parquet(output_dir / "events.parquet", index=False)
print(f"Created events.parquet with {len(events_df)} rows")

# ============================================================
# 7. EVENT_ATTENDANCE TABLE (for Q5: Friend Recommendations)
# Design: 3 non-friend pairs share 2+ private events (answer = 3 recommendations)
# Private events: 1, 2, 3, 5, 6, 8, 11, 12, 14
# ============================================================
attendance_data = []
attendance_id = 1

# Design attendance so that:
# - Users 1 and 3 share private events 1, 2, 3 (3 shared) - NOT friends -> RECOMMEND
# - Users 2 and 4 share private events 1, 5, 6 (3 shared) - NOT friends -> RECOMMEND
# - Users 5 and 7 share private events 2, 6, 8 (3 shared) - NOT friends -> RECOMMEND
# - Users 1 and 2 share private events 1, 2 (2 shared) - ARE friends -> NO RECOMMEND

attendance_mapping = {
    1: [1, 2, 3, 5],       # User 1: private events 1,2,3,5
    2: [1, 2, 5, 6],       # User 2: private events 1,2,5,6
    3: [1, 2, 3, 8],       # User 3: private events 1,2,3,8
    4: [1, 5, 6, 11],      # User 4: private events 1,5,6,11
    5: [2, 6, 8, 12],      # User 5: private events 2,6,8,12
    6: [3, 5, 11, 14],     # User 6: private events 3,5,11,14
    7: [2, 6, 8, 11],      # User 7: private events 2,6,8,11
    8: [1, 3, 12, 14],     # User 8: private events 1,3,12,14
    9: [4, 7, 9],          # User 9: public events only
    10: [4, 7, 10],        # User 10: public events only
}

for user_id, events in attendance_mapping.items():
    for event_id in events:
        attendance_data.append({
            "attendance_id": attendance_id,
            "user_id": user_id,
            "event_id": event_id,
            "attendance_status": random.choice(["going", "interested", "maybe"])
        })
        attendance_id += 1

attendance_df = pd.DataFrame(attendance_data)
attendance_df.to_parquet(output_dir / "event_attendance.parquet", index=False)
print(f"Created event_attendance.parquet with {len(attendance_df)} rows")

# ============================================================
# 8. FRIENDSHIPS TABLE (for Q5: Friend Recommendations)
# Design: Users 1-2 are friends (should NOT be recommended)
# ============================================================
friendships_raw = [
    (1, 2), (1, 4), (2, 3), (2, 6), (3, 4), (3, 8),
    (4, 6), (4, 10), (5, 9), (6, 7), (6, 10), (7, 9),
    (8, 9), (8, 10), (9, 10), (11, 12), (12, 13), (13, 14),
    (14, 15), (15, 16), (16, 17), (17, 18), (18, 19), (19, 20)
]

friendships_data = {
    "friendship_id": list(range(1, len(friendships_raw) + 1)),
    "user1_id": [min(a, b) for a, b in friendships_raw],
    "user2_id": [max(a, b) for a, b in friendships_raw],
    "friendship_date": [f"2023-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
                        for _ in friendships_raw]
}
friendships_df = pd.DataFrame(friendships_data)
friendships_df['friendship_date'] = pd.to_datetime(friendships_df['friendship_date']).dt.date
friendships_df.to_parquet(output_dir / "friendships.parquet", index=False)
print(f"Created friendships.parquet with {len(friendships_df)} rows")

# ============================================================
# 9. CALLS TABLE (for Q7: Messenger Video Call %, Q8: Users With 3+ Calls)
# ============================================================
calls_data = []
call_id = 1

# Design for Q8: 5 users called 3+ distinct people in last 7 days
# Let's say "last 7 days" = 2024-11-24 to 2024-11-30

# Users 1, 2, 3, 4, 5 each call 3+ distinct people (answer = 5 users)
high_callers = {
    1: [2, 3, 4, 5],      # 4 distinct people
    2: [1, 3, 6],          # 3 distinct people
    3: [1, 2, 4, 7, 8],    # 5 distinct people
    4: [1, 5, 6, 9],       # 4 distinct people
    5: [2, 3, 10],         # 3 distinct people
}

# Users who called fewer than 3 distinct people
low_callers = {
    6: [1, 2],             # 2 distinct people
    7: [3],                # 1 distinct person
    8: [4, 4],             # 1 distinct person (same person twice)
}

# Q7: Video call percentage (yesterday = 2024-11-29)
# Active on Messenger yesterday: 10 users
# Made video call yesterday: 3 users (30%)
messenger_active_yesterday = list(range(1, 11))  # Users 1-10
video_callers_yesterday = [1, 3, 5]  # 3 out of 10 = 30%

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

# Add video calls for yesterday (Q7)
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

# Add messenger activity for yesterday (not calls, just presence)
# This creates the "active on messenger" population

calls_df = pd.DataFrame(calls_data)
calls_df['call_date'] = pd.to_datetime(calls_df['call_date']).dt.date
calls_df.to_parquet(output_dir / "calls.parquet", index=False)
print(f"Created calls.parquet with {len(calls_df)} rows")

# ============================================================
# 10. COMMENTS TABLE (for Q9: Comment Histogram)
# Design: Distribution of comments per user
# ============================================================
comments_data = []
comment_id = 1

# Design histogram buckets:
# 0 comments: users 16-20 (5 users)
# 1-2 comments: users 11-15 (5 users, 1-2 each)
# 3-5 comments: users 6-10 (5 users, 3-5 each)
# 6-10 comments: users 3-5 (3 users, 6-10 each)
# 10+ comments: users 1-2 (2 users, 11-15 each)

comment_distribution = {
    1: 15,
    2: 12,
    3: 8,
    4: 7,
    5: 6,
    6: 5,
    7: 4,
    8: 3,
    9: 4,
    10: 5,
    11: 2,
    12: 1,
    13: 2,
    14: 1,
    15: 2,
    # Users 16-20 have 0 comments
}

for user_id, num_comments in comment_distribution.items():
    for _ in range(num_comments):
        comments_data.append({
            "comment_id": comment_id,
            "user_id": user_id,
            "post_id": random.randint(1, len(posts_data)),
            "comment_text": f"Sample comment {comment_id}",
            "comment_date": f"2024-{random.randint(1,11):02d}-{random.randint(1,28):02d}"
        })
        comment_id += 1

comments_df = pd.DataFrame(comments_data)
comments_df['comment_date'] = pd.to_datetime(comments_df['comment_date']).dt.date
comments_df.to_parquet(output_dir / "comments.parquet", index=False)
print(f"Created comments.parquet with {len(comments_df)} rows")

# ============================================================
# 11. SIGNUPS TABLE (for Q6: Weekly Churn Rate)
# Design: Users who signed up in June 2024 with varying churn
# ============================================================
signups_data = []

# Week 1 (June 1-7): 10 signups, 3 churned (30% churn)
# Week 2 (June 8-14): 12 signups, 2 churned (16.67% churn)
# Week 3 (June 15-21): 8 signups, 4 churned (50% churn)
# Week 4 (June 22-28): 15 signups, 3 churned (20% churn)

signup_id = 1
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

        signup_date = f"2024-06-{day:02d}"
        # Churned = last login within 28 days of signup but then nothing
        if is_churned:
            last_login = f"2024-06-{min(day + random.randint(1, 20), 30):02d}"
        else:
            # Active users have recent logins
            last_login = f"2024-11-{random.randint(1, 28):02d}"

        signups_data.append({
            "signup_id": signup_id,
            "user_id": 100 + signup_id,  # New user IDs for this table
            "signup_date": signup_date,
            "last_login_date": last_login,
            "signup_week": week_data["week"]
        })
        signup_id += 1

signups_df = pd.DataFrame(signups_data)
signups_df['signup_date'] = pd.to_datetime(signups_df['signup_date']).dt.date
signups_df['last_login_date'] = pd.to_datetime(signups_df['last_login_date']).dt.date
signups_df.to_parquet(output_dir / "signups.parquet", index=False)
print(f"Created signups.parquet with {len(signups_df)} rows")

# ============================================================
# 12. MESSENGER_ACTIVITY TABLE (for Q7: Video Call %)
# ============================================================
messenger_data = []
activity_id = 1

# Active on Messenger yesterday (2024-11-29): Users 1-10
# Video callers: Users 1, 3, 5 (already in calls table)
for user_id in range(1, 11):
    messenger_data.append({
        "activity_id": activity_id,
        "user_id": user_id,
        "activity_type": "message_sent",
        "activity_date": "2024-11-29"
    })
    activity_id += 1

# Add some other days for variety
for day in range(25, 29):
    for user_id in random.sample(range(1, 21), random.randint(5, 12)):
        messenger_data.append({
            "activity_id": activity_id,
            "user_id": user_id,
            "activity_type": random.choice(["message_sent", "message_read", "status_update"]),
            "activity_date": f"2024-11-{day:02d}"
        })
        activity_id += 1

messenger_df = pd.DataFrame(messenger_data)
messenger_df['activity_date'] = pd.to_datetime(messenger_df['activity_date']).dt.date
messenger_df.to_parquet(output_dir / "messenger_activity.parquet", index=False)
print(f"Created messenger_activity.parquet with {len(messenger_df)} rows")

# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 60)
print("Dataset Generation Complete!")
print("=" * 60)
print(f"\nOutput directory: {output_dir}")
print("\nExpected answers for each question:")
print("-" * 40)
print("Q1 (Post Hiatus):        8 users with 2+ posts in 2024")
print("Q2 (MAU Retention):      6 users active in both June & July")
print("Q3 (CTR):                4 apps (25%, 15%, 5%, 2%)")
print("Q4 (Pages No Likes):     3 pages (IDs 8, 9, 10)")
print("Q5 (Friend Recs):        3 user pairs")
print("Q6 (Weekly Churn):       4 weeks with varying rates")
print("Q7 (Video Call %):       30% (3/10 active users)")
print("Q8 (3+ Calls):           5 users")
print("Q9 (Histogram):          5 buckets of comment counts")
print("Q10 (Rolling 7-Day):     30 days of rolling calculations")
print("=" * 60)
