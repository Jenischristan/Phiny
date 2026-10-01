# Search API Specification

This document specifies the exact query processing, matching semantics, and API endpoints utilized by the `SearchBar` component and search result feeds.

---

## 1. Search Suggestions / Autocomplete: `GET /api/search/suggestions`

- **Method**: `GET`
- **Path**: `/api/search/suggestions`
- **Purpose**: Power the live autocomplete dropdown in `SearchBar` as the user types.
- **Authentication**: Optional (Public endpoint).
- **Query Parameters**:
  - `q` (string, required): Search query string.
- **Query Preprocessing Rules (from `components/feed/SearchBar.tsx`)**:
  1. Trim leading and trailing whitespace.
  2. Strip leading `#` symbol (e.g. `#brutalism` becomes `brutalism`).
  3. Convert to lowercase for case-insensitive matching.
  4. If processed keyword is empty (`k === ""`), return empty results array.
- **Categorical Breakdown**:
  - **Creators (`u`)**: Top 3 matching users where `(name + " " + handle + " " + role)` contains `k` and `state !== "deactivated"`.
  - **Posts (`p`)**: Top 4 matching posts where `(title + " " + by.name + " " + tags.join(" "))` contains `k`, `vis !== "private"`, and author is not deactivated.
  - **Tags (`t`)**: Top 3 matching category interests from approved topics.
  - **Action (`a`)**: Direct link to "See all results for “{q}”".
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "creators": [
        {
          "id": 0,
          "name": "Mara Okafor",
          "handle": "maraokafor",
          "role": "Architectural photographer",
          "photo": "https://cdn.phiny.art/avatars/mara.webp"
        }
      ],
      "posts": [
        {
          "id": 0,
          "title": "Concrete Light",
          "by": {
            "name": "Mara Okafor"
          },
          "src": "https://cdn.phiny.art/posts/0.webp"
        }
      ],
      "tags": [
        "Concrete",
        "Architecture"
      ]
    }
  }
  ```

---

## 2. Full-Text Search Feed: `GET /api/posts?q={term}`

- **Method**: `GET`
- **Path**: `/api/posts?q={term}`
- **Purpose**: Retrieve full masonry feed matching the search term when user presses `Enter` or clicks "See all results".
- **Matching Criteria**:
  - Matches against `post.title`, `post.by.name`, and any string in `post.tags`.
  - Excludes posts where `post.vis === "private"`.
  - Excludes posts authored by deactivated accounts.
- **Successful Response (200 OK)**: Standard list response containing matching `Post[]` array.

---

## 3. Database Execution Recommendations (PostgreSQL)

To achieve fast, scalable full-text search in PostgreSQL:
1. Maintain a generated `tsvector` column on `posts`:
   ```sql
   ALTER TABLE posts ADD COLUMN search_vector tsvector
   GENERATED ALWAYS AS (
     setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(description, '')), 'B')
   ) STORED;
   ```
2. Create a GIN index on `search_vector`:
   ```sql
   CREATE INDEX idx_posts_search_vector ON posts USING gin(search_vector);
   ```
3. Use `websearch_to_tsquery('english', $1)` to safely handle user input with quotes and prefix matching.
