# Filtering Contract

This document details all query filtering dimensions supported by the Phiny frontend and expected from the backend API.

---

## 1. Supported Filter Dimensions

| Query Parameter | Target Entity | Type | Allowed Values | Default | Behavioral Rules |
|---|---|---|---|---|---|
| `tag` | `Post` | `string` | Any string, or `"All"` (case-insensitive). Typically one of the 18 design topics: `Architecture`, `Editorial`, `Photography`, `Typography`, `Industrial`, `Spatial`, `Monochrome`, `Brutalism`, `Concrete`, etc. | `"All"` | If `tag === "All"`, no tag filter is applied. Otherwise, filters posts where `LOWER(tag) = LOWER(:tag)` or `:tag` is present in `post.tags`. |
| `q` | `Post` / `Person` | `string` | UTF-8 text string | None | Strips leading `#`. Performs case-insensitive matching across `title`, `author.name`, `author.handle`, and `tags`. |
| `userId` | `Post` | `string` / `number` | Existing User ID | None | Restricts results to posts authored by the specified user (`author_id = :userId`). |
| `vis` | `Post` / `Collection` | `string` | `"public"`, `"private"` | `"public"` | Unauthenticated requests only receive `"public"` records. Authenticated requests can receive `"private"` records only if authored/owned by the requester. |
| `collectionId` | `Post` | `string` | Collection ID (e.g. `c0`) | None | Resolves posts associated with a specific curated collection board via `collection_posts` join. |

---

## 2. Filter Combination Logic

When multiple filters are provided simultaneously in a single request (e.g. `GET /api/posts?tag=Architecture&q=concrete&userId=0`), the backend MUST combine them using **logical AND**:

```sql
SELECT p.*
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE u.state != 'deactivated'
  AND (p.vis = 'public' OR p.author_id = :current_user_id)
  -- Tag filter:
  AND (:tag IS NULL OR :tag = 'All' OR LOWER(p.tag) = LOWER(:tag) OR :tag = ANY(p.tags))
  -- Creator filter:
  AND (:user_id IS NULL OR p.author_id = :user_id)
  -- Search query filter:
  AND (:query IS NULL OR (
      LOWER(p.title) LIKE :query_pattern OR
      LOWER(u.name) LIKE :query_pattern OR
      :clean_query = ANY(p.tags)
  ))
ORDER BY p.created_at DESC;
```

---

## 3. Concrete Filtering Examples

### Example 1: Tag Filtering on Explore Page
- **Request**: `GET /api/posts?tag=Typography`
- **Result**: Posts where `post.tag == "Typography"` or `post.tags` includes `"Typography"`.

### Example 2: Creator Profile Created Tab
- **Request**: `GET /api/posts?userId=0`
- **Result**: Posts authored by user ID 0 (`Mara Okafor`). Private posts excluded unless requester is user 0.

### Example 3: Search within Tag
- **Request**: `GET /api/posts?tag=Architecture&q=terrace`
- **Result**: Posts categorized under Architecture containing the word "terrace" in title or description.
