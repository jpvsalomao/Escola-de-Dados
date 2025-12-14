#!/usr/bin/env python3
"""
Generate additional datasets for Meta Data Scientist SQL Interview Prep Pack (Q11-Q20).

This script creates 6 new parquet files for questions 11-20:
- logins.parquet (Q11 - Consecutive Login Streak)
- advertisers.parquet (Q12 - State Machine)
- daily_pay.parquet (Q12 - State Machine)
- transactions.parquet (Q15 - Cumulative Revenue)
- user_records.parquet (Q18 - Deduplication)
- monthly_active.parquet (Q20 - YoY Growth)

Also updates existing datasets:
- posts.parquet (Q14 - adds category and engagement_score columns)
- page_likes.parquet (Q13 - adds more data for friend recommendations)

Usage:
    python scripts/generate-meta-interview-data-v2.py
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

OUTPUT_DIR = "public/packs/pack_meta_interview"


def generate_logins():
    """
    Q11 - Consecutive Login Streak

    Design:
    - 50 users total
    - 8 users have 5+ day consecutive streaks (answer)
    - Various streak lengths: 5, 6, 7, 8, 9, 10, 12, 15 days
    - Other users have shorter or broken streaks
    """
    print("Generating logins.parquet...")

    records = []
    user_id = 1

    # Users with 5+ day streaks (these are the answer)
    streak_lengths = [5, 6, 7, 8, 9, 10, 12, 15]
    for streak_len in streak_lengths:
        # Start date varies for each user
        start_date = datetime(2024, 10, 1) + timedelta(days=random.randint(0, 20))

        # Add consecutive login days
        for day_offset in range(streak_len):
            login_date = start_date + timedelta(days=day_offset)
            # Sometimes multiple logins per day
            num_logins = random.randint(1, 3)
            for _ in range(num_logins):
                records.append({
                    "user_id": user_id,
                    "login_date": login_date.date(),
                    "device_type": random.choice(["mobile", "desktop", "tablet"])
                })

        # Add some non-consecutive logins before/after the streak
        for _ in range(random.randint(2, 5)):
            extra_date = start_date - timedelta(days=random.randint(10, 30))
            records.append({
                "user_id": user_id,
                "login_date": extra_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

        user_id += 1

    # Users with broken streaks (4 days or less)
    for _ in range(20):
        start_date = datetime(2024, 10, 1) + timedelta(days=random.randint(0, 30))
        streak_len = random.randint(1, 4)

        for day_offset in range(streak_len):
            login_date = start_date + timedelta(days=day_offset)
            records.append({
                "user_id": user_id,
                "login_date": login_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

        # Add gap then more logins (breaks the streak)
        gap_start = start_date + timedelta(days=streak_len + random.randint(2, 5))
        for day_offset in range(random.randint(1, 3)):
            login_date = gap_start + timedelta(days=day_offset)
            records.append({
                "user_id": user_id,
                "login_date": login_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

        user_id += 1

    # Users with scattered logins (no real streak)
    for _ in range(22):
        num_logins = random.randint(3, 10)
        dates = random.sample(range(1, 60), num_logins)

        for day in dates:
            login_date = datetime(2024, 9, 15) + timedelta(days=day)
            records.append({
                "user_id": user_id,
                "login_date": login_date.date(),
                "device_type": random.choice(["mobile", "desktop", "tablet"])
            })

        user_id += 1

    df = pd.DataFrame(records)
    df.to_parquet(f"{OUTPUT_DIR}/logins.parquet", index=False)
    print(f"  Created {len(df)} login records for {user_id - 1} users")
    return df


def generate_advertisers_and_daily_pay():
    """
    Q12 - Advertiser Status Transitions (State Machine)

    Design:
    - 20 advertisers with various current statuses
    - daily_pay shows who paid "today" (2024-12-01)
    - Test all state transitions:
      - NEW + paid → EXISTING
      - NEW + not paid → NEW
      - EXISTING + paid → EXISTING
      - EXISTING + not paid → CHURN
      - CHURN + paid → RESURRECT
      - CHURN + not paid → CHURN
      - RESURRECT + paid → EXISTING
      - RESURRECT + not paid → CHURN
    """
    print("Generating advertisers.parquet and daily_pay.parquet...")

    # Design specific test cases for each transition
    advertisers = []
    daily_pay = []

    # NEW + paid → EXISTING (2 cases)
    for i in [1, 2]:
        advertisers.append({"user_id": i, "status": "NEW"})
        daily_pay.append({"user_id": i, "paid_date": datetime(2024, 12, 1).date(), "amount": random.randint(50, 500)})

    # NEW + not paid → NEW (2 cases)
    for i in [3, 4]:
        advertisers.append({"user_id": i, "status": "NEW"})
        # No payment record

    # EXISTING + paid → EXISTING (3 cases)
    for i in [5, 6, 7]:
        advertisers.append({"user_id": i, "status": "EXISTING"})
        daily_pay.append({"user_id": i, "paid_date": datetime(2024, 12, 1).date(), "amount": random.randint(100, 1000)})

    # EXISTING + not paid → CHURN (3 cases)
    for i in [8, 9, 10]:
        advertisers.append({"user_id": i, "status": "EXISTING"})
        # No payment record

    # CHURN + paid → RESURRECT (3 cases)
    for i in [11, 12, 13]:
        advertisers.append({"user_id": i, "status": "CHURN"})
        daily_pay.append({"user_id": i, "paid_date": datetime(2024, 12, 1).date(), "amount": random.randint(75, 300)})

    # CHURN + not paid → CHURN (3 cases)
    for i in [14, 15, 16]:
        advertisers.append({"user_id": i, "status": "CHURN"})
        # No payment record

    # RESURRECT + paid → EXISTING (2 cases)
    for i in [17, 18]:
        advertisers.append({"user_id": i, "status": "RESURRECT"})
        daily_pay.append({"user_id": i, "paid_date": datetime(2024, 12, 1).date(), "amount": random.randint(200, 800)})

    # RESURRECT + not paid → CHURN (2 cases)
    for i in [19, 20]:
        advertisers.append({"user_id": i, "status": "RESURRECT"})
        # No payment record

    advertisers_df = pd.DataFrame(advertisers)
    daily_pay_df = pd.DataFrame(daily_pay)

    advertisers_df.to_parquet(f"{OUTPUT_DIR}/advertisers.parquet", index=False)
    daily_pay_df.to_parquet(f"{OUTPUT_DIR}/daily_pay.parquet", index=False)

    print(f"  Created {len(advertisers_df)} advertisers, {len(daily_pay_df)} payment records")
    return advertisers_df, daily_pay_df


def generate_transactions():
    """
    Q15 - Cumulative Revenue by Month

    Design:
    - 12 months of 2024
    - Growing revenue pattern (realistic business growth)
    - Multiple transactions per month
    - Clear monthly totals for easy verification
    """
    print("Generating transactions.parquet...")

    records = []
    transaction_id = 1

    # Monthly revenue targets (growing ~5-10% monthly)
    monthly_targets = [
        10000, 10800, 11500, 12300, 13200,  # Jan-May
        14100, 15000, 16200, 17500, 18800,  # Jun-Oct
        20200, 22000  # Nov-Dec
    ]

    for month_idx, target in enumerate(monthly_targets):
        month = month_idx + 1

        # Generate transactions that sum close to target
        remaining = target
        day = 1

        while remaining > 0:
            # Random transaction amount
            amount = min(remaining, random.randint(50, 500))
            remaining -= amount

            # Random day in month
            try:
                trans_date = datetime(2024, month, min(day, 28))
            except ValueError:
                trans_date = datetime(2024, month, 28)

            records.append({
                "transaction_id": transaction_id,
                "user_id": random.randint(1, 100),
                "amount": amount,
                "transaction_date": trans_date.date()
            })

            transaction_id += 1
            day = min(day + random.randint(0, 2), 28)

    df = pd.DataFrame(records)
    df.to_parquet(f"{OUTPUT_DIR}/transactions.parquet", index=False)
    print(f"  Created {len(df)} transactions across 12 months")
    return df


def generate_user_records():
    """
    Q18 - Deduplicate User Records

    Design:
    - 30 unique users
    - 50 total records (some duplicates)
    - 15 users have 2+ records with different updated_at
    - Need to keep most recent record per user
    """
    print("Generating user_records.parquet...")

    records = []

    # First names and last names for realistic data
    first_names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
                   "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Paul",
                   "Quinn", "Rose", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier",
                   "Yara", "Zack", "Amy", "Brian", "Chloe", "David"]

    domains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"]

    # Users with single record (15 users)
    for i in range(1, 16):
        name = first_names[i - 1]
        records.append({
            "user_id": i,
            "name": name,
            "email": f"{name.lower()}@{random.choice(domains)}",
            "updated_at": datetime(2024, 10, random.randint(1, 28),
                                   random.randint(0, 23), random.randint(0, 59))
        })

    # Users with duplicate records (15 users, 2-3 records each)
    for i in range(16, 31):
        name = first_names[i - 1]
        num_records = random.randint(2, 3)

        base_email = f"{name.lower()}@{random.choice(domains)}"

        for j in range(num_records):
            # Later records have more recent updated_at
            base_day = 1 + (j * 10)
            records.append({
                "user_id": i,
                "name": name if j == num_records - 1 else f"{name} (old)",  # Most recent has clean name
                "email": base_email if j == num_records - 1 else f"{name.lower()}.old{j}@{random.choice(domains)}",
                "updated_at": datetime(2024, 11, min(base_day, 28),
                                       random.randint(0, 23), random.randint(0, 59))
            })

    df = pd.DataFrame(records)
    df.to_parquet(f"{OUTPUT_DIR}/user_records.parquet", index=False)
    print(f"  Created {len(df)} records for 30 users (15 with duplicates)")
    return df


def generate_monthly_active():
    """
    Q20 - Year-over-Year MAU Growth

    Design:
    - 24 months: all of 2023 and 2024
    - ~15% average YoY growth
    - Some variation month to month
    - Seasonal patterns (higher in winter, lower in summer)
    """
    print("Generating monthly_active.parquet...")

    records = []

    # 2023 baseline MAU (millions, scaled down for simplicity)
    base_2023 = [
        180, 175, 185, 190, 195, 188,  # Jan-Jun (spring growth, summer dip)
        182, 178, 192, 200, 210, 220   # Jul-Dec (fall recovery, holiday peak)
    ]

    # 2024 with ~15% YoY growth + variation
    for month in range(1, 13):
        # 2023 value
        mau_2023 = base_2023[month - 1]
        records.append({
            "year": 2023,
            "month": month,
            "mau": mau_2023
        })

        # 2024 value: ~15% growth with some variation
        growth_rate = 0.12 + random.uniform(0, 0.08)  # 12-20% growth
        mau_2024 = int(mau_2023 * (1 + growth_rate))
        records.append({
            "year": 2024,
            "month": month,
            "mau": mau_2024
        })

    df = pd.DataFrame(records)
    df.to_parquet(f"{OUTPUT_DIR}/monthly_active.parquet", index=False)
    print(f"  Created {len(df)} monthly MAU records (2023-2024)")
    return df


def update_posts_for_q14():
    """
    Q14 - Second Highest Engagement per Category

    Update existing posts table to add:
    - category column
    - engagement_score column

    Design:
    - 5 categories: tech, lifestyle, news, sports, entertainment
    - 3-5 posts per category
    - Clear 1st and 2nd place scores for each category
    """
    print("Updating posts.parquet with category and engagement_score...")

    # Read existing posts
    existing_posts = pd.read_parquet(f"{OUTPUT_DIR}/posts.parquet")

    # Create new posts with categories and engagement scores
    categories = ["tech", "lifestyle", "news", "sports", "entertainment"]
    records = []
    post_id = 1

    for category in categories:
        # Number of posts per category
        num_posts = random.randint(3, 5)

        # Generate engagement scores (clear ranking)
        scores = sorted([random.randint(100, 1000) for _ in range(num_posts)], reverse=True)

        for i, score in enumerate(scores):
            # Use existing user_ids
            user_id = random.randint(1, 20)
            post_date = datetime(2024, random.randint(1, 11), random.randint(1, 28))

            records.append({
                "post_id": post_id,
                "user_id": user_id,
                "post_date": post_date.date(),
                "content": f"Post about {category} #{i+1}",
                "category": category,
                "engagement_score": score
            })
            post_id += 1

    # Add some of the original posts without categories (for backward compatibility)
    for _, row in existing_posts.head(10).iterrows():
        records.append({
            "post_id": post_id,
            "user_id": row["user_id"],
            "post_date": row["post_date"],
            "content": row.get("content", f"Original post {post_id}"),
            "category": random.choice(categories),
            "engagement_score": random.randint(50, 500)
        })
        post_id += 1

    df = pd.DataFrame(records)
    df.to_parquet(f"{OUTPUT_DIR}/posts.parquet", index=False)
    print(f"  Updated posts with {len(df)} records across {len(categories)} categories")
    return df


def update_friendships_and_page_likes_for_q13_q16():
    """
    Q13 - Page Recommendations from Friends
    Q16 - Mutual Friends Count

    Ensure friendships and page_likes have enough data for:
    - Friend recommendations (friends liked pages user hasn't)
    - Mutual friends counting (pairs with 3+ mutual friends)

    IMPORTANT: Preserves original schema (user1_id, user2_id) for compatibility
    and keeps pages 8, 9, 10 without likes for q4.
    """
    print("Updating friendships.parquet and page_likes.parquet...")

    # Create a richer friendship graph using ORIGINAL schema (user1_id, user2_id)
    friendships = []
    friendship_id = 1

    # Core friend group (users 1-10 are highly connected)
    core_users = list(range(1, 11))
    for i, user1 in enumerate(core_users):
        for user2 in core_users[i+1:]:
            if random.random() < 0.6:  # 60% chance of friendship
                friendships.append({
                    "friendship_id": friendship_id,
                    "user1_id": min(user1, user2),
                    "user2_id": max(user1, user2),
                    "friendship_date": datetime(2023, random.randint(1, 12), random.randint(1, 28)).date()
                })
                friendship_id += 1

    # Secondary connections (users 11-20)
    for user in range(11, 21):
        num_friends = random.randint(2, 4)
        friends = random.sample(core_users, num_friends)
        for friend in friends:
            friendships.append({
                "friendship_id": friendship_id,
                "user1_id": min(user, friend),
                "user2_id": max(user, friend),
                "friendship_date": datetime(2023, random.randint(1, 12), random.randint(1, 28)).date()
            })
            friendship_id += 1

    # Sparse connections (users 21-30)
    for user in range(21, 31):
        num_friends = random.randint(1, 2)
        friends = random.sample(list(range(1, 21)), num_friends)
        for friend in friends:
            friendships.append({
                "friendship_id": friendship_id,
                "user1_id": min(user, friend),
                "user2_id": max(user, friend),
                "friendship_date": datetime(2023, random.randint(1, 12), random.randint(1, 28)).date()
            })
            friendship_id += 1

    friendships_df = pd.DataFrame(friendships).drop_duplicates(subset=["user1_id", "user2_id"])
    friendships_df.to_parquet(f"{OUTPUT_DIR}/friendships.parquet", index=False)

    # Create page likes for recommendations
    # IMPORTANT: Only pages 1-7 get likes, pages 8-10 stay empty for q4
    page_likes = []
    like_id = 1
    pages_with_likes = list(range(1, 8))  # Only pages 1-7

    # Each user likes some pages (from pages 1-7 only)
    for user in range(1, 21):
        num_likes = random.randint(2, 5)
        liked_pages = random.sample(pages_with_likes, min(num_likes, len(pages_with_likes)))
        for page in liked_pages:
            page_likes.append({
                "like_id": like_id,
                "user_id": user,
                "page_id": page,
                "liked_date": datetime(2024, random.randint(1, 11), random.randint(1, 28)).date()
            })
            like_id += 1

    page_likes_df = pd.DataFrame(page_likes).drop_duplicates(subset=["user_id", "page_id"])
    page_likes_df.to_parquet(f"{OUTPUT_DIR}/page_likes.parquet", index=False)

    print(f"  Created {len(friendships_df)} friendship pairs, {len(page_likes_df)} page likes")
    print(f"  Pages 8, 9, 10 have NO likes (preserved for q4)")
    return friendships_df, page_likes_df


def main():
    """Generate all datasets for Q11-Q20."""
    print(f"\n{'='*60}")
    print("Meta Interview Pack v2 - Dataset Generator")
    print(f"{'='*60}\n")

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Generate new datasets
    generate_logins()
    generate_advertisers_and_daily_pay()
    generate_transactions()
    generate_user_records()
    generate_monthly_active()

    # Update existing datasets
    update_posts_for_q14()
    update_friendships_and_page_likes_for_q13_q16()

    print(f"\n{'='*60}")
    print("Dataset generation complete!")
    print(f"Files written to: {OUTPUT_DIR}/")
    print(f"{'='*60}\n")

    # Verify files
    print("Generated files:")
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith(".parquet"):
            path = os.path.join(OUTPUT_DIR, f)
            size = os.path.getsize(path)
            print(f"  {f}: {size:,} bytes")


if __name__ == "__main__":
    main()
