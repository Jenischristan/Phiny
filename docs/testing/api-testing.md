# Backend API Testing Specification & Test Scenarios

This document details mandatory automated test suites that the backend engineering team must implement to verify API correctness, security boundaries, and data integrity.

---

## 1. Authentication Test Scenarios

| Test Case | Method & Route | Request Body | Expected HTTP Status | Expected Assertion |
|---|---|---|---|---|
| **Login with valid handle** | `POST /api/auth/login` | `{ "id": "maraokafor", "password": "CorrectPassword" }` | `200 OK` | Returns `user` object; sets `phiny_session` cookie with `HttpOnly; Secure; SameSite=Lax`. |
| **Login with valid email** | `POST /api/auth/login` | `{ "id": "mara@example.com", "password": "CorrectPassword" }` | `200 OK` | Case-insensitive email match; returns user. |
| **Login with invalid password**| `POST /api/auth/login` | `{ "id": "maraokafor", "password": "WrongPassword" }` | `401 Unauthorized` | `{ "code": "INVALID_CREDENTIALS" }`. No session cookie set. |
| **Login with empty ID** | `POST /api/auth/login` | `{ "id": "   " }` | `400 Bad Request` | Returns validation failure. |
| **Login deactivated account** | `POST /api/auth/login` | Deactivated user credentials | `403 Forbidden` | `{ "code": "ACCOUNT_DEACTIVATED" }`. |
| **Register new account** | `POST /api/auth/register` | Valid `SignupData` object | `201 Created` | Persists user; returns user object; sets session cookie. |
| **Register duplicate username**| `POST /api/auth/register` | Existing handle (`maraokafor`) | `409 Conflict` | `{ "code": "USERNAME_TAKEN" }`. |
| **Register underage user** | `POST /api/auth/register` | DOB less than 13 years ago | `400 Bad Request` | Fails minimum age check (`age >= 13`). |
| **Logout** | `POST /api/auth/logout` | Authenticated session | `200 OK` | Session deleted in DB; cookie cleared with `Expires=1970`. |
| **Verify session** | `GET /api/auth/me` | Valid session cookie | `200 OK` | Returns current user profile. |
| **Verify invalid session** | `GET /api/auth/me` | Expired / forged token | `401 Unauthorized` | `{ "code": "UNAUTHORIZED" }`. |

---

## 2. Posts API Test Scenarios

| Test Case | Method & Route | Request Body / Query | Expected Status | Expected Assertion |
|---|---|---|---|---|
| **Feed listing** | `GET /api/posts` | `?limit=10` | `200 OK` | Returns 10 public posts ordered by `created_at DESC`. |
| **Tag filtering** | `GET /api/posts?tag=Architecture` | Query: `tag=Architecture` | `200 OK` | Every returned post has tag or tags containing "Architecture". |
| **Author filtering** | `GET /api/posts?userId=0` | Query: `userId=0` | `200 OK` | All posts authored by user 0. Private posts excluded if caller is unauthenticated. |
| **Search keyword** | `GET /api/posts?q=concrete` | Query: `q=concrete` | `200 OK` | Returns posts matching keyword. |
| **Create post valid** | `POST /api/posts` | Valid post payload | `201 Created` | Post persisted in DB; returns post with UUID. |
| **Create post title too short**| `POST /api/posts` | `{ "title": "ab" }` | `400 Bad Request` | Fails min 3 characters check. |
| **Create post title too long** | `POST /api/posts` | Title with 81 characters | `400 Bad Request` | Fails max 80 characters check. |
| **Create post ratio too low** | `POST /api/posts` | `{ "ratio": 0.49 }` | `422 Unprocessable` | Rejected: ratio must be `>= 0.5`. |
| **Create post ratio too high**| `POST /api/posts` | `{ "ratio": 2.01 }` | `422 Unprocessable` | Rejected: ratio must be `<= 2.0`. |
| **Patch post by author** | `PATCH /api/posts/:id` | `{ "title": "New" }` (by author) | `200 OK` | Post title updated. |
| **Patch post by non-author** | `PATCH /api/posts/:id` | `{ "title": "New" }` (other user) | `403 Forbidden` | Modification rejected. |
| **Delete post cascades** | `DELETE /api/posts/:id` | Path: `:id` (by author) | `200 OK` | Post deleted; associated comments, likes, and collection links removed. |

---

## 3. Collections Security Test Scenarios

| Test Case | Method & Route | Caller | Expected Status | Expected Assertion |
|---|---|---|---|---|
| **View public collection** | `GET /api/collections/:id` | Anonymous / Any user | `200 OK` | Board details returned. |
| **View private collection (owner)**| `GET /api/collections/:id` | Board owner | `200 OK` | Board details returned. |
| **View private collection (other)**| `GET /api/collections/:id` | Non-owner / Anonymous | `404 Not Found` | Collection hidden to prevent enumeration. |
| **Add pin to collection** | `PATCH /api/collections/:id` | Board owner | `200 OK` | Post ID appended to pins array. |
| **Add pin non-owner** | `PATCH /api/collections/:id` | Non-owner | `403 Forbidden` | Access denied. |
| **Delete collection** | `DELETE /api/collections/:id` | Board owner | `200 OK` | Board removed; posts remain intact. |
