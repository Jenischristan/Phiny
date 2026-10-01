# Collections API Specification

This document details all endpoints for managing curated boards/collections, organizing saved pins, and configuring board visibility.

---

## 1. List Collections: `GET /api/collections`

- **Method**: `GET`
- **Path**: `/api/collections`
- **Purpose**: Retrieve collections owned by the authenticated user or public collections for exploration.
- **Authentication**: Optional. If authenticated, returns user's private and public collections; if unauthenticated, returns public collections only.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "id": "c0",
        "name": "Brutalist Moods",
        "priv": false,
        "pins": [0, 4, 8, 12]
      },
      {
        "id": "c1",
        "name": "Type Specimens",
        "priv": false,
        "pins": [1, 5, 9, 13]
      },
      {
        "id": "c2",
        "name": "Warm Palettes",
        "priv": false,
        "pins": [2, 6, 10, 14]
      },
      {
        "id": "c3",
        "name": "Night Walks",
        "priv": true,
        "pins": [3, 7, 11, 15]
      }
    ]
  }
  ```

---

## 2. Create Collection: `POST /api/collections`

- **Method**: `POST`
- **Path**: `/api/collections`
- **Purpose**: Create a new curated board.
- **Authentication**: Required.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Monochrome Concrete",
    "priv": false,
    "pins": [0, 12]
  }
  ```
- **Validation Rules**:
  - `name`: Required string. Minimum 2 characters, maximum 100 characters. Trimmed.
  - `priv`: Optional boolean. Default `false` (Public).
  - `pins`: Optional array of post IDs (`number` or `string`). Default `[]`.
- **Successful Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c_1720000000",
      "name": "Monochrome Concrete",
      "priv": false,
      "pins": [0, 12]
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`:
    ```json
    { "success": false, "error": "Collection name is required" }
    ```

---

## 3. Get Collection By ID: `GET /api/collections/:id`

- **Method**: `GET`
- **Path**: `/api/collections/:id`
- **Purpose**: Retrieve a single collection's metadata and contained pins for `CollectionDetailView`.
- **Path Parameters**:
  - `id`: Collection identifier (e.g. `c0`, `c_1720000000`).
- **Authorization**:
  - If `collection.priv === false`: Accessible to all users.
  - If `collection.priv === true`: Accessible only to the owner. All others receive 404 to avoid leaking collection existence.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c0",
      "name": "Brutalist Moods",
      "priv": false,
      "pins": [0, 4, 8, 12]
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`:
    ```json
    { "success": false, "error": "Collection not found" }
    ```

---

## 4. Update Collection: `PATCH /api/collections/:id`

- **Method**: `PATCH`
- **Path**: `/api/collections/:id`
- **Purpose**: Rename collection, toggle privacy, or synchronize the full `pins` array.
- **Authentication**: Required.
- **Authorization**: Collection owner only (HTTP 403 Forbidden otherwise).
- **Path Parameters**: `id`
- **Request Body**:
  ```json
  {
    "name": "Brutalist Moods & Facades",
    "priv": true,
    "pins": [0, 4, 8, 12, 18]
  }
  ```
- **Validation Rules**:
  - `name`: Optional string. If provided, min 2 characters.
  - `priv`: Optional boolean.
  - `pins`: Optional array of post IDs.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c0",
      "name": "Brutalist Moods & Facades",
      "priv": true,
      "pins": [0, 4, 8, 12, 18]
    }
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: User is not the owner.
  - `404 Not Found`: Collection does not exist.

---

## 5. Delete Collection: `DELETE /api/collections/:id`

- **Method**: `DELETE`
- **Path**: `/api/collections/:id`
- **Purpose**: Permanently delete a collection.
- **Authentication**: Required.
- **Authorization**: Collection owner only.
- **Path Parameters**: `id`
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Collection deleted"
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: User is not the owner.
  - `404 Not Found`: Collection does not exist.

---

## 6. Atomic Pin Management Endpoints (Recommended Production Additions)

While `PATCH /api/collections/:id` currently allows updating the entire `pins` array, atomic addition and removal endpoints prevent race conditions when multiple tabs or devices are used:

### Add Pin to Collection
- **Method**: `POST`
- **Path**: `/api/collections/:id/pins`
- **Request Body**: `{ "postId": 42 }`
- **Response**: `{ "success": true, "message": "Pin added to collection" }`

### Remove Pin from Collection
- **Method**: `DELETE`
- **Path**: `/api/collections/:id/pins/:postId`
- **Response**: `{ "success": true, "message": "Pin removed from collection" }`
