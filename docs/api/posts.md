# Posts API Specification

This document defines all endpoints for visual publication (Pin/Post) lifecycle management, feed retrieval, filtering, search, and social interactions.

---

## 1. List Posts: `GET /api/posts`

- **Method**: `GET`
- **Path**: `/api/posts`
- **Purpose**: Retrieve visual pins for the main feed, category explore pages, creator profile feeds, and global search.
- **Authentication**: Optional. If authenticated, responses may include personalized flags (`is_liked`, `is_saved`).
- **Query Parameters**:
  - `tag` (string, optional): Filter by category tag (e.g. `Architecture`, `Typography`, `All`). Case-insensitive.
  - `q` (string, optional): Search keyword matching against title, author name, or tags.
  - `userId` (string, optional): Filter pins authored by a specific user ID.
  - `limit` (integer, optional, default `48`, max `100`): Maximum posts to return.
  - `cursor` (string, optional): Pagination cursor for infinite scrolling.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 0,
        "title": "Concrete Light",
        "by": {
          "id": 0,
          "name": "Mara Okafor",
          "handle": "maraokafor",
          "role": "Architectural photographer",
          "state": "active",
          "fers": 4200
        },
        "tag": "Architecture",
        "tags": ["Architecture", "Brutalism", "Concrete"],
        "seed": 3,
        "ratio": 1.25,
        "date": "2d ago",
        "likes": 293,
        "vis": "public",
        "comments": true,
        "hideLikes": false,
        "src": "https://cdn.phiny.art/posts/0.webp",
        "alt": "Concrete Light by Mara Okafor",
        "desc": "Brutalist morning shadows in Lagos.",
        "loc": "Lagos, Nigeria"
      },
      {
        "id": 1,
        "title": "Monolith in Mist",
        "by": {
          "id": 1,
          "name": "Kenji Sato",
          "handle": "kenjisato",
          "role": "Industrial designer",
          "state": "active",
          "fers": 3100
        },
        "tag": "Spatial",
        "tags": ["Spatial", "Atmosphere"],
        "seed": 4,
        "ratio": 0.6,
        "date": "3d ago",
        "likes": 412,
        "vis": "public",
        "comments": true,
        "hideLikes": false,
        "src": "https://cdn.phiny.art/posts/1.webp",
        "alt": "Monolith in Mist by Kenji Sato"
      }
    ]
  }
  ```

---

## 2. Create Post: `POST /api/posts`

- **Method**: `POST`
- **Path**: `/api/posts`
- **Purpose**: Publish a new visual pin to Phiny.
- **Authentication**: Required (HTTP 401 if unauthenticated).
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Minimal Void Study No. 4",
    "tag": "Architecture",
    "tags": ["Architecture", "Brutalism", "Shadow"],
    "ratio": 1.333,
    "src": "https://cdn.phiny.art/uploads/p_91823.webp",
    "alt": "Angular concrete corner casting a sharp triangular shadow",
    "desc": "High-contrast study of morning light on raw concrete facade.",
    "vis": "public",
    "comments": true,
    "hideLikes": false,
    "loc": "Zurich, Switzerland",
    "coll": "c0"
  }
  ```
- **Validation Rules**:
  - `title`: Required string. 3–80 characters.
  - `tag`: Optional string. Defaults to `"Art"` if empty.
  - `tags`: Optional array of strings. Maximum 8 tags. Each tag 2–24 characters, matching `^[a-z0-9_]+$`i.
  - `ratio`: Required float. Must be between `0.5` and `2.0` (inclusive).
  - `src`: Required image URL or Base64 data string.
  - `alt`: Optional string. Maximum 255 characters.
  - `desc`: Optional string. Maximum 1000 characters.
  - `vis`: Optional enum: `"public"` | `"private"`. Default `"public"`.
  - `comments`: Optional boolean. Default `true`.
  - `hideLikes`: Optional boolean. Default `false`.
  - `loc`: Optional string. Maximum 100 characters.
  - `coll`: Optional collection ID. If provided, automatically associates the created post with the specified collection.
- **Successful Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "p_1720000000",
      "title": "Minimal Void Study No. 4",
      "by": {
        "id": "u_948a9b2c",
        "name": "Mara Okafor",
        "handle": "maraokafor",
        "state": "active",
        "fers": 4200
      },
      "tag": "Architecture",
      "tags": ["Architecture", "Brutalism", "Shadow"],
      "seed": 482,
      "ratio": 1.333,
      "date": "Just now",
      "likes": 0,
      "vis": "public",
      "comments": true,
      "hideLikes": false,
      "src": "https://cdn.phiny.art/uploads/p_91823.webp",
      "alt": "Angular concrete corner casting a sharp triangular shadow",
      "desc": "High-contrast study of morning light on raw concrete facade.",
      "loc": "Zurich, Switzerland"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`:
    ```json
    { "success": false, "error": "Title is required" }
    ```
  - `401 Unauthorized`:
    ```json
    { "success": false, "error": "Log in to create posts" }
    ```

---

## 3. Get Post By ID: `GET /api/posts/:id`

- **Method**: `GET`
- **Path**: `/api/posts/:id`
- **Purpose**: Fetch complete details for a single pin.
- **Path Parameters**:
  - `id`: Post identifier (numeric or UUID string).
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "0",
      "title": "Concrete Light",
      "by": {
        "id": 0,
        "name": "Mara Okafor",
        "handle": "maraokafor",
        "role": "Architectural photographer",
        "bio": "Architectural photographer. Lagos & Zurich.",
        "state": "active",
        "fers": 4200
      },
      "tag": "Architecture",
      "tags": ["Architecture", "Brutalism", "Concrete"],
      "seed": 3,
      "ratio": 1.25,
      "date": "2d ago",
      "likes": 293,
      "vis": "public",
      "comments": true,
      "hideLikes": false,
      "src": "https://cdn.phiny.art/posts/0.webp",
      "alt": "Concrete Light by Mara Okafor",
      "desc": "Brutalist morning shadows in Lagos.",
      "loc": "Lagos, Nigeria"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`:
    ```json
    { "success": false, "error": "Post not found" }
    ```

---

## 4. Update Post: `PATCH /api/posts/:id`

- **Method**: `PATCH`
- **Path**: `/api/posts/:id`
- **Purpose**: Modify an existing post's metadata.
- **Authentication**: Required (Must be the author of the post).
- **Authorization**: Only the author can update their post.
- **Path Parameters**: `id`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "desc": "Updated description",
    "vis": "private",
    "comments": false,
    "hideLikes": true
  }
  ```
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "0",
      "title": "Updated Title",
      ...
    }
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: User is not the author.
  - `404 Not Found`: Post does not exist.

---

## 5. Delete Post: `DELETE /api/posts/:id`

- **Method**: `DELETE`
- **Path**: `/api/posts/:id`
- **Purpose**: Permanently remove a post.
- **Authentication**: Required.
- **Authorization**: Author only.
- **Path Parameters**: `id`
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Post deleted"
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: User is not the author.
  - `404 Not Found`: Post does not exist.

---

## 6. Social Interaction Endpoints (Production)

### 6.1 Like / Unlike Post
- **Like**: `POST /api/posts/:id/like`
- **Unlike**: `DELETE /api/posts/:id/like`
- **Authentication**: Required.
- **Response**: `{ "success": true, "likes": 294, "is_liked": true }`

### 6.2 Bookmark / Save Post
- **Save to Library**: `POST /api/posts/:id/save`
- **Remove from Library**: `DELETE /api/posts/:id/save`
- **Authentication**: Required.
- **Response**: `{ "success": true, "is_saved": true }`

### 6.3 Post Comments
- **List Comments**: `GET /api/posts/:id/comments`
- **Add Comment**: `POST /api/posts/:id/comments`
  - **Body**: `{ "text": "The negative space here is unreal." }`
  - **Validation**: 1–500 characters.
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "cmt_91283",
        "user": { "id": 0, "name": "Mara Okafor", "handle": "maraokafor" },
        "text": "The negative space here is unreal.",
        "date": "Just now"
      }
    }
    ```
