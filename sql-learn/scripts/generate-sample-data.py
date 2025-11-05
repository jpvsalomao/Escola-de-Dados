#!/usr/bin/env python3
"""
Generate sample Parquet files for pack_basics
"""
import pandas as pd
from pathlib import Path

# Create output directory
output_dir = Path(__file__).parent.parent / "app" / "packs" / "pack_basics"
output_dir.mkdir(parents=True, exist_ok=True)

# Create customers data
customers_data = {
    "customer_id": [1, 2, 3, 4, 5],
    "name": ["Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa", "Carla Souza"],
    "email": ["ana@example.com", "joao@example.com", "maria@example.com", "pedro@example.com", "carla@example.com"],
    "country": ["Brazil", "Brazil", "Portugal", "Argentina", "Brazil"],
    "signup_date": ["2023-01-15", "2023-02-20", "2023-03-10", "2023-04-05", "2023-05-12"]
}

customers_df = pd.DataFrame(customers_data)
customers_df.to_parquet(output_dir / "customers.parquet", index=False)
print(f"✓ Created customers.parquet with {len(customers_df)} rows")

# Create orders data
orders_data = {
    "order_id": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
    "customer_id": [1, 2, 1, 3, 4, 2, 5, 1, 3, 4],
    "amount": [150.00, 200.50, 75.25, 300.00, 450.75, 125.00, 220.00, 180.50, 95.00, 500.00],
    "order_date": [
        "2023-06-01", "2023-06-02", "2023-06-03", "2023-06-04", "2023-06-05",
        "2023-06-06", "2023-06-07", "2023-06-08", "2023-06-09", "2023-06-10"
    ],
    "status": ["completed", "completed", "completed", "pending", "completed", "completed", "completed", "pending", "completed", "completed"]
}

orders_df = pd.DataFrame(orders_data)
orders_df.to_parquet(output_dir / "orders.parquet", index=False)
print(f"✓ Created orders.parquet with {len(orders_df)} rows")

print("\n✅ Sample data generation complete!")
