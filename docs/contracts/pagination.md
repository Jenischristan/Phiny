# Pagination Specification

This document details current list loading behavior and defines the production pagination contract required for scalable feeds, comments, collections, and user lists.

---

## 1. Current Implementation vs. Production Scalability

- **Current Prototype**: The in-memory store returns all matching items in a single response (`PINS.slice()` with default limit 48).
- **Production Architecture**: As the post volume expands into thousands or millions of records, querying without cursor-based pagination will cause memory exhaustion, slow database scans, and network bloat.

---

## 2. Cursor-Based Pagination Specification (Feeds & Lists)

For the home feed (`/`), explore feed (`/explore`), creator posts (`/profile/[id]`), and direct messaging history (`/messages`), **cursor-based pagination** is required to guarantee stable results without skipping or duplicating items when new posts are published concurrently.

### 2.1 Request Parameters
- `limit` (integer, optional): Number of items to return. Default `48`, minimum `1`, maximum `100`.
- `cursor` (string, optional): Base64-encoded opaque token pointing to the last evaluated record. Omitted on the initial request.

### 2.2 Cursor Encoding & Generation
The backend generates the cursor by encoding the sort keys:
```text
Base64URL.encode(JSON.stringify({
  t: post.created_at.toISOString(),
  id: post.id
}))
```

### 2.3 SQL Cursor Query Pattern
```sql
SELECT id, title, author_id, tag, ratio, likes, src, created_at
FROM posts
WHERE vis = 'public'
  AND (created_at, id) < ($1, $2)  -- Where $1 is cursor timestamp, $2 is cursor id
ORDER BY created_at DESC, id DESC
LIMIT $3 + 1;                       -- Fetch 1 extra record to evaluate has_more
```

### 2.4 Response Envelope with Pagination Metadata
```json
{
  "success": true,
  "count": 48,
  "data": [ ... ],
  "pagination": {
    "limit": 48,
    "has_more": true,
    "next_cursor": "eyJ0IjoiMjAyNi0xMC0wMVQxMjozNDowMFoiLCJpZCI6InBfOTI4MyJ9",
    "total_count": 2840
  }
}
```

### 2.5 End-of-Results Behavior
When `has_more === false`:
- `next_cursor` is returned as `null`.
- The frontend ceases further intersection observer fetch calls and renders an end-of-feed indicator or empty recommendations.
