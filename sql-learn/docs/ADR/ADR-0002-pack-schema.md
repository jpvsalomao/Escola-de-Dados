# ADR-0002: Pack Schema Design (v1.1)

**Status:** Accepted
**Date:** 2025-11-05
**Deciders:** Escola de Dados Team
**Context:** Defining the structure for challenge packs

## Context and Problem Statement

We need a structured, versioned format for packaging SQL challenges with datasets. The format must support:

1. Multiple challenges per pack
2. Multiple datasets (tables) per pack
3. Flexible test assertions for grading
4. Metadata for discovery and filtering
5. Version compatibility checks
6. Integrity verification (tamper detection)
7. Extensibility for future features

## Decision Drivers

- **Simplicity:** Content creators should easily understand the schema
- **Flexibility:** Support diverse challenge types and grading scenarios
- **Integrity:** Detect corrupted or tampered packs
- **Versioning:** Allow schema evolution without breaking old packs
- **Discoverability:** Rich metadata for search and filtering
- **Performance:** Efficient to parse and validate

## Considered Options

### Pack Container Format

**Option A: JSON with separate data files**
- ✅ Human-readable metadata
- ✅ Separate binary files for efficiency
- ✅ Easy to version control (JSON diff)
- ❌ Multiple files to distribute

**Option B: Single archive (ZIP)**
- ✅ Single file distribution
- ❌ Binary format harder to version control
- ❌ Requires unzip step

**Option C: Embedded data in JSON (Base64)**
- ✅ Single file
- ❌ Huge JSON files
- ❌ Inefficient

**Decision:** **JSON + separate data files**
- Best balance of readability and efficiency
- Standard web approach (fetch JSON, then data)

---

### Schema Structure

```json
{
  "schema_version": "1.1",
  "min_app_version": "1.0.0",
  "id": "pack_basics",
  "title": "SQL Basics",
  "metadata": { ... },
  "integrity": { ... },
  "datasets": [ ... ],
  "challenges": [ ... ]
}
```

**Key Design Decisions:**

#### 1. Versioning Strategy

- `schema_version`: Pack schema version (semantic versioning)
- `min_app_version`: Minimum app version required to run this pack

**Rationale:**
- Allows schema evolution without breaking old packs
- App can reject incompatible packs gracefully

#### 2. Metadata Object

```json
{
  "author": "Escola de Dados",
  "locale": "pt-BR",
  "tags": ["intro", "beginner"]
}
```

**Rationale:**
- Supports future search/filter features
- Internationalization-ready
- Attribution for content creators

#### 3. Integrity Checking

```json
{
  "algorithm": "sha256",
  "datasets": {
    "orders.parquet": "a1b2c3...",
    "customers.parquet": "d4e5f6..."
  }
}
```

**Rationale:**
- Detect file corruption or tampering
- Important for community packs (v2+)
- SHA-256 is standard, well-supported

#### 4. Dataset Definition

```json
{
  "name": "customers",
  "src": "customers.parquet"
}
```

**Rationale:**
- `name`: Table name in DuckDB
- `src`: File path relative to pack directory
- Simple, extensible

**Future Fields (v2+):**
- `description`: Human-readable table description
- `row_count`: For UI display
- `schema`: Column definitions

#### 5. Challenge Structure

```json
{
  "id": "q1_select_all",
  "title": "Select All Customers",
  "prompt": "Write a query to retrieve...",
  "dialect": "duckdb",
  "hint": "Use SELECT *...",
  "solution_sql": "SELECT * FROM customers;",
  "tests": [ ... ],
  "limits": {
    "timeout_ms": 1500,
    "row_limit": 1000
  },
  "tags": ["select", "basics"],
  "difficulty": "easy"
}
```

**Rationale:**

- **id:** Unique within pack, URL-safe
- **dialect:** Future-proofs for multi-dialect support
- **hint/solution_sql:** Optional learning aids
- **tests:** Flexible assertion system (see below)
- **limits:** Safety guardrails per challenge
- **tags:** For filtering and search
- **difficulty:** User-facing difficulty rating

---

### Test Assertion System

**Design Goal:** Support multiple validation strategies

```json
{
  "name": "row_count_is_one",
  "assert": "ROWCOUNT",
  "expected": 1
}
```

**Supported Assert Types (v1.1):**

1. **ROWCOUNT**: Check number of rows returned
2. **SQL**: Run SQL assertion against user result
3. **SCHEMA_EQ**: Verify column names and types
4. **SET_EQ**: Order-insensitive result comparison
5. **NEAR**: Float comparison with tolerance

**Rationale:**

- **Flexibility:** Different challenges need different validation
- **Composability:** Multiple tests per challenge
- **Extensibility:** Easy to add new assert types
- **Precision:** SET_EQ and NEAR handle edge cases

**Example SQL Assertion:**

```json
{
  "name": "total_equals_expected",
  "assert": "SQL",
  "sql": "SELECT (SELECT COUNT(*) FROM ({{USER_SQL}}) t) = 42 AS ok",
  "expected": [{"ok": true}]
}
```

**Rationale:**
- Allows arbitrary SQL-based validation
- `{{USER_SQL}}` placeholder for user query
- Powerful for complex assertions

---

### Alternatives Considered

**Option B: Simpler schema with only expected results**

```json
{
  "expected_results": [
    {"customer_id": 1, "name": "Alice"},
    {"customer_id": 2, "name": "Bob"}
  ]
}
```

**Rejected Because:**
- Inflexible: Can't validate schema, row count independently
- Order-sensitive by default (problem for some queries)
- No support for tolerance (floats)
- Harder to provide granular feedback

---

**Option C: Separate test files**

```
pack_basics/
  pack.json
  tests/
    q1_test.json
    q2_test.json
```

**Rejected Because:**
- More complex distribution
- Harder to maintain consistency
- Overkill for v1 scope

---

## Consequences

### Positive

- **Clear structure** for content creators
- **Extensible** without breaking changes
- **Flexible testing** supports diverse challenge types
- **Integrity checking** prevents corruption
- **Version safety** prevents incompatibility errors

### Negative

- **Complex schema** has learning curve for creators
- **Multiple files** to distribute per pack
- **Integrity checking** adds overhead (but optional)

### Neutral

- **JSON format** is standard but verbose
- **Semantic versioning** requires careful management

## Implementation Notes

### Validation Rules

1. `schema_version` must match `"1.1"` exactly (v1)
2. `min_app_version` must be ≤ current app version
3. All `datasets[].src` files must exist and be valid Parquet
4. All `challenges[].id` must be unique within pack
5. `challenges[].tests` must have at least one test
6. `challenges[].difficulty` must be one of: easy, medium, hard

### Backward Compatibility

- **v1.0 → v1.1:** Added `integrity` field (optional)
- **v1.1 → v2.0 (future):** TBD, will provide migration guide

### Pack Discovery (Future)

Pack registry could be a simple JSON index:

```json
{
  "packs": [
    {
      "id": "pack_basics",
      "url": "https://cdn.example.com/packs/pack_basics/pack.json",
      "version": "1.0.0"
    }
  ]
}
```

## Examples

See `/app/packs/pack_basics/pack.json` for a complete example.

## Follow-up Actions

- [ ] Create pack authoring guide
- [ ] Build pack validator CLI tool (v1.1)
- [ ] Consider pack schema linter for CI
- [ ] Plan v2.0 schema enhancements based on user feedback

## References

- [JSON Schema](https://json-schema.org/) - Considered for validation (may add in v2)
- [Parquet Format Spec](https://parquet.apache.org/docs/)
- [Semantic Versioning](https://semver.org/)
