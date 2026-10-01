# Sorting Specification

This document details the sorting contracts applied to feeds, search results, and collection listings.

---

## 1. Supported Sorting Modes

| Sorting Mode | Parameter | Underlying SQL Sort Expression | Default In | Description |
|---|---|---|---|---|
| **Chronological (Recency)** | `sort=recent` | `ORDER BY created_at DESC, id DESC` | Home Feed (`/`), Profile Posts | Newest publications appear first. |
| **Popularity (Engagement)** | `sort=popular` | `ORDER BY likes DESC, created_at DESC` | Explore (`/explore`) | Ranked by total likes with recency tie-breaking. |
| **Search Relevance** | `sort=relevance` | `ORDER BY ts_rank(search_vector, query) DESC` | Search (`/api/posts?q=`) | Ranked by keyword prominence in title and tags. |
| **Collection Position** | `sort=position` | `ORDER BY cp.position ASC` | Board View (`/collection/:id`) | Preserves the curated order set by the collection owner. |

---

## 2. Dynamic Engagement Weighting Algorithm (Production Recommendation)

To prevent stale high-like posts from dominating the explore feed indefinitely, the production backend should implement gravity-based ranking (Hacker News / Reddit style decay):

$$\text{Score} = \frac{\text{Likes} + 1}{(\text{AgeInHours} + 2)^{1.5}}$$

```sql
SELECT id, title, likes, created_at,
       (likes + 1.0) / POWER(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0 + 2.0, 1.5) AS hot_score
FROM posts
WHERE vis = 'public'
ORDER BY hot_score DESC
LIMIT :limit;
```
