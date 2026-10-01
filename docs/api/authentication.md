# Authentication & Session API Specification

This document details both the current prototype authentication endpoint and the full production authentication specification required by the Phiny frontend.

---

## 1. Existing Prototype Endpoint: `POST /api/auth/login`

The current prototype exposes a lightweight handle/email sign-in route in `app/api/auth/login/route.ts`.

- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Purpose**: Authenticates a user by matching their username or email handle.
- **Authentication**: None (Public endpoint).
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "id": "maraokafor"
  }
  ```
- **Validation**:
  - `id`: Required string. Must not be empty or whitespace.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": 0,
      "name": "Mara Okafor",
      "handle": "maraokafor",
      "role": "Architectural photographer",
      "bio": "Architectural photographer. Lagos & Zurich.",
      "vis": "public",
      "fers": 4200,
      "state": "active"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`:
    ```json
    { "success": false, "error": "Username or email is required" }
    ```

---

## 2. Production Authentication Endpoints

In production, the backend must replace demo handle matching with secure, salted password hashing (Argon2id or bcrypt) and session cookie or JWT management.

### 2.1 Sign In: `POST /api/auth/login`

- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Purpose**: Authenticate user credentials and establish an authenticated session.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "id": "maraokafor",
    "password": "Password123!",
    "remember": true
  }
  ```
- **Validation Rules**:
  - `id`: Required string (username or email). Length 3–255 characters.
  - `password`: Required string. Minimum 8 characters.
  - `remember`: Optional boolean. If `true`, sets 30-day session cookie; if `false`, sets session cookie expiring on browser close.
- **Security Logic**:
  - Rate limit: 5 failed attempts per IP/username per 15 minutes before temporary lockout.
  - Case-insensitive lookup on username or email.
  - Constant-time password hash verification.
- **Successful Response (200 OK)**:
  - **Headers**:
    `Set-Cookie: phiny_session=<session_token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
  - **Body**:
    ```json
    {
      "success": true,
      "user": {
        "id": "u_948a9b2c",
        "name": "Mara Okafor",
        "handle": "maraokafor",
        "email": "mara@example.com",
        "role": "Architectural photographer",
        "bio": "Architectural photographer. Lagos & Zurich.",
        "loc": "Lagos & Zurich",
        "web": "maraokafor.com",
        "photo": "https://cdn.phiny.art/avatars/mara.webp",
        "vis": "public",
        "state": "active",
        "fers": 4200,
        "fing": 312
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`:
    ```json
    {
      "success": false,
      "code": "INVALID_CREDENTIALS",
      "error": "Invalid username or password"
    }
    ```
  - `403 Forbidden`:
    ```json
    {
      "success": false,
      "code": "ACCOUNT_DEACTIVATED",
      "error": "This account has been deactivated"
    }
    ```

---

### 2.2 Register Account: `POST /api/auth/register`

- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Purpose**: Create a new user account upon completing the 9-step signup wizard.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "username": "alexmercer",
    "email": "alex@example.com",
    "password": "SecurePassword1",
    "dob": "1998-05-14",
    "vis": "public",
    "photo": "https://cdn.phiny.art/avatars/temp_upload_123.jpg",
    "interests": ["Architecture", "Typography", "Editorial"],
    "following": [0, 3]
  }
  ```
- **Validation Rules**:
  - `name`: Required string. 1–100 characters. Trimmed.
  - `username`: Required string. 3–20 characters. Must match `^[a-z0-9_.]+$`i. Must be unique.
  - `email`: Required string. Valid email format. Must be unique.
  - `password`: Required string. Minimum 8 characters. Must contain at least one letter and one number.
  - `dob`: Required ISO date string (`YYYY-MM-DD`). Age calculated from current date must be `>= 13` years old.
  - `vis`: Optional enum: `"public"` | `"private"`. Default `"public"`.
  - `photo`: Optional image URL.
  - `interests`: Optional array of strings from approved topics list.
  - `following`: Optional array of user IDs to automatically follow upon creation.
- **Successful Response (201 Created)**:
  - **Headers**: `Set-Cookie: phiny_session=...`
  - **Body**:
    ```json
    {
      "success": true,
      "user": {
        "id": "u_e72f8a10",
        "name": "Alex Mercer",
        "handle": "alexmercer",
        "email": "alex@example.com",
        "vis": "public",
        "state": "active",
        "fers": 0,
        "fing": 2
      }
    }
    ```
- **Error Responses**:
  - `409 Conflict` (Username taken):
    ```json
    {
      "success": false,
      "code": "USERNAME_TAKEN",
      "error": "That username is already taken"
    }
    ```
  - `409 Conflict` (Email registered):
    ```json
    {
      "success": false,
      "code": "EMAIL_REGISTERED",
      "error": "An account with that email already exists"
    }
    ```

---

### 2.3 Current Session: `GET /api/auth/me`

- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Purpose**: Verify session validity and return current user profile on client application load.
- **Authentication**: Required (via Cookie or Bearer token).
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "u_948a9b2c",
      "name": "Mara Okafor",
      "handle": "maraokafor",
      "email": "mara@example.com",
      "role": "Architectural photographer",
      "bio": "Architectural photographer. Lagos & Zurich.",
      "vis": "public",
      "state": "active",
      "fers": 4200,
      "fing": 312
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`:
    ```json
    { "success": false, "code": "UNAUTHORIZED", "error": "Not authenticated" }
    ```

---

### 2.4 Sign Out: `POST /api/auth/logout`

- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Purpose**: Invalidate current session and clear browser cookie.
- **Successful Response (200 OK)**:
  - **Headers**:
    `Set-Cookie: phiny_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  - **Body**:
    ```json
    { "success": true, "message": "Logged out successfully" }
    ```

---

### 2.5 Forgot Password Request: `POST /api/auth/forgot-password`

- **Method**: `POST`
- **Path**: `/api/auth/forgot-password`
- **Purpose**: Initiates password recovery email from `LoginDialog`.
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Security Rule**: To prevent account enumeration, the endpoint always returns `200 OK` regardless of whether the email exists in the database.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Reset instructions sent to your email"
  }
  ```
