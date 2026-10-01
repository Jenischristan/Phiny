# Users & Profiles API Specification

This document details all endpoints required to retrieve, search, update, and follow user profiles on Phiny.

---

## 1. Get User Profile: `GET /api/users/:id`

- **Method**: `GET`
- **Path**: `/api/users/:id`
- **Purpose**: Fetch a creator's public profile data for `ProfileView`.
- **Path Parameters**:
  - `id`: User numeric ID, UUID string, or username handle (e.g. `0`, `u_948a9b2c`, `maraokafor`).
- **Authorization & Privacy Rules**:
  - If target user has `state === "deactivated"`, returns `404 Not Found`.
  - If target user has `state === "private"` and requester does not follow them, profile is returned with limited fields (bio, followers/following counts visible, but posts/collections locked).
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 0,
      "name": "Mara Okafor",
      "handle": "maraokafor",
      "role": "Architectural photographer",
      "bio": "Architectural photographer. Lagos & Zurich.",
      "loc": "Lagos & Zurich",
      "web": "maraokafor.com",
      "photo": "https://cdn.phiny.art/avatars/mara.webp",
      "pro": "Architecture",
      "dis": "Photography",
      "state": "active",
      "vis": "public",
      "fers": 4200,
      "fing": 312,
      "posts_count": 28,
      "is_following": false
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`:
    ```json
    { "success": false, "error": "User profile not found" }
    ```

---

## 2. Update Current Profile: `PATCH /api/users/me`

- **Method**: `PATCH`
- **Path**: `/api/users/me`
- **Purpose**: Update current authenticated user's profile details from `EditProfileDialog` or `AccountSet`.
- **Authentication**: Required.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Mara Okafor",
    "handle": "maraokafor",
    "bio": "Architectural photographer & spatial researcher. Lagos & Zurich.",
    "web": "https://maraokafor.com",
    "loc": "Zurich, Switzerland",
    "photo": "https://cdn.phiny.art/avatars/new_photo.webp",
    "pro": "Senior Photographer",
    "dis": "Spatial Studies",
    "vis": "public"
  }
  ```
- **Validation Rules**:
  - `name`: String. 1–100 characters. Trimmed.
  - `handle`: String. 3–20 characters. Must match regex `^[a-z0-9_.]+$`i. Must be globally unique.
  - `bio`: Optional string. Maximum 500 characters.
  - `web`: Optional valid URL string. Must match URL regex.
  - `loc`: Optional string. Maximum 100 characters.
  - `vis`: Optional enum: `"public"` | `"private"`.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "u_948a9b2c",
      "name": "Mara Okafor",
      "handle": "maraokafor",
      "bio": "Architectural photographer & spatial researcher. Lagos & Zurich.",
      "web": "https://maraokafor.com",
      "loc": "Zurich, Switzerland",
      "photo": "https://cdn.phiny.art/avatars/new_photo.webp",
      "pro": "Senior Photographer",
      "dis": "Spatial Studies",
      "vis": "public",
      "state": "active",
      "fers": 4200,
      "fing": 312
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Username handle already in use by another user.

---

## 3. List Followers: `GET /api/users/:id/followers`

- **Method**: `GET`
- **Path**: `/api/users/:id/followers`
- **Purpose**: Populate follower list on `/profile/[id]/followers`.
- **Query Parameters**:
  - `q` (string, optional): Search keyword to filter followers by name or handle.
  - `limit` (integer, optional, default `50`): Page size.
  - `cursor` (string, optional): Pagination token.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 1,
        "name": "Kenji Sato",
        "handle": "kenjisato",
        "role": "Industrial designer",
        "photo": "https://cdn.phiny.art/avatars/kenji.webp",
        "state": "active",
        "fers": 3100,
        "is_following": true
      },
      {
        "id": 3,
        "name": "Sofia Rinaldi",
        "handle": "sofiar",
        "role": "Architectural writer",
        "photo": "https://cdn.phiny.art/avatars/sofia.webp",
        "state": "active",
        "fers": 8900,
        "is_following": false
      }
    ]
  }
  ```

---

## 4. List Following: `GET /api/users/:id/following`

- **Method**: `GET`
- **Path**: `/api/users/:id/following`
- **Purpose**: Populate accounts followed by the user on `/profile/[id]/following`.
- **Query Parameters**: Same as followers.
- **Successful Response (200 OK)**: Similar array structure of `Person` objects.

---

## 5. Follow / Unfollow Creator

### Follow Creator
- **Method**: `POST`
- **Path**: `/api/users/:id/follow`
- **Authentication**: Required.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Now following @maraokafor",
    "is_following": true
  }
  ```

### Unfollow Creator
- **Method**: `DELETE`
- **Path**: `/api/users/:id/follow`
- **Authentication**: Required.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Unfollowed @maraokafor",
    "is_following": false
  }
  ```

---

## 6. Suggested Creators: `GET /api/users/suggested`

- **Method**: `GET`
- **Path**: `/api/users/suggested`
- **Purpose**: Provides top 4 suggested creators for the sidebar panel (`AppShell`) and category explore feeds.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "id": 0,
        "name": "Mara Okafor",
        "handle": "maraokafor",
        "role": "Architectural photographer"
      },
      {
        "id": 1,
        "name": "Kenji Sato",
        "handle": "kenjisato",
        "role": "Industrial designer"
      },
      {
        "id": 2,
        "name": "Elena Rostova",
        "handle": "erostova",
        "role": "Type designer"
      },
      {
        "id": 3,
        "name": "Sofia Rinaldi",
        "handle": "sofiar",
        "role": "Architectural writer"
      }
    ]
  }
  ```
