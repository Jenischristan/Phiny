# Backend Implementation Guide & Master Handoff

> **PRIMARY ENTRY POINT FOR BACKEND ENGINEERS**  
> This document serves as the master implementation roadmap. By following this guide step-by-step, a backend engineer can build, configure, test, and deploy the entire production backend for Phiny without opening the frontend codebase.

---

## 1. Executive Answers to Core Engineering Questions

### 1.1 What database should exist?
A relational **PostgreSQL 15+** database with extensions `uuid-ossp` and `pgcrypto` enabled. Refer to [`/docs/database/schema.md`](../database/schema.md) for the exact DDL.

### 1.2 What tables/entities are required?
1. `users`: Creator profiles, credentials, counts, and account visibility.
2. `sessions`: Stateful HTTP session tokens and expiration tracking.
3. `user_preferences`: Notification, theme, and privacy preferences.
4. `posts`: Visual pins, metadata, aspect ratios, titles, tags, and like counters.
5. `collections`: Curated boards with privacy flags.
6. `collection_posts`: Join table mapping pins to collections with position ordering.
7. `post_likes`: Join table tracking user likes on posts.
8. `user_saved_posts`: Join table tracking user bookmarks.
9. `user_followers`: Self-referential graph mapping follower/following relationships.
10. `comments`: Threaded comments on posts.
11. `conversations` & `conversation_participants`: Direct messaging channels.
12. `chat_messages`: Chronological chat messages.
13. `notifications`: Activity event notices.
14. `reports`: Content moderation reports.

### 1.3 What relationships exist?
Refer to the ERD in [`/docs/database/relationships.md`](../database/relationships.md). All child tables use foreign keys referencing parent entities with `ON DELETE CASCADE` semantics (e.g. deleting a user cleans up their posts, likes, saves, collections, and messages).

### 1.4 What API endpoints must exist?
The complete inventory is detailed in [`/docs/contracts/api-contract.md`](../contracts/api-contract.md) and formalized in the OpenAPI specification at [`/docs/api/openapi.yaml`](../api/openapi.yaml). The minimum endpoints required:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/collections`
- `POST /api/collections`
- `GET /api/collections/:id`
- `PATCH /api/collections/:id`
- `DELETE /api/collections/:id`
- `GET /api/users/:id`
- `PATCH /api/users/me`
- `GET /api/search/suggestions`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`
- `GET /api/notifications`
- `POST /api/uploads/presigned`

### 1.5 What does each endpoint accept and return?
Refer to the individual API specifications:
- Auth: [`/docs/api/authentication.md`](../api/authentication.md)
- Posts: [`/docs/api/posts.md`](../api/posts.md)
- Collections: [`/docs/api/collections.md`](../api/collections.md)
- Users: [`/docs/api/users.md`](../api/users.md)
- Messages: [`/docs/api/messages.md`](../api/messages.md)
- Search: [`/docs/api/search.md`](../api/search.md)

### 1.6 What authentication is required?
Production browser session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age=2592000`) or signed Bearer tokens. Refer to [`/docs/contracts/authentication.md`](../contracts/authentication.md).

### 1.7 What authorization is required?
Strict entity ownership:
- A user can only edit or delete their own posts and collections.
- Private collections are hidden (`404`) from non-owners.
- Private posts are hidden (`404`) from non-owners.
- Direct messages are only accessible to conversation participants.
Refer to [`/docs/contracts/authorization.md`](../contracts/authorization.md).

### 1.8 What validation is required?
Refer to the complete validation matrix in [`/docs/contracts/validation.md`](../contracts/validation.md). The backend must independently enforce all length, type, regex, and age checks.

### 1.9 What errors can occur?
Standard error envelope: `{ success: false, error: string, code?: string, details?: any }`. Refer to [`/docs/api/errors.md`](../api/errors.md).

### 1.10 What files/images need storage?
Images up to 5 MB in JPG, PNG, or WebP format. Stored in Cloud Object Storage (S3 / GCS) and served through a CDN. Refer to [`/docs/api/uploads.md`](../api/uploads.md).

### 1.11 What frontend behavior depends on each endpoint?
Refer to the Master API Contract table in [`/docs/contracts/api-contract.md`](../contracts/api-contract.md).

### 1.12 What is currently mocked and what needs to be replaced?
Refer to Section 2 of [`/docs/architecture.md`](../architecture.md) and [`/docs/integration/migration-plan.md`](./migration-plan.md). The in-memory `backendStore` (`lib/backendData.ts`) must be replaced with PostgreSQL queries.

### 1.13 What decisions are still unresolved?
Refer to [`/docs/integration/open-questions.md`](./open-questions.md) for all items marked as `NEEDS DECISION`.

---

## 2. Step-by-Step Implementation Sequence

```text
Step 1: Database Setup
  - Provision PostgreSQL 15+ instance.
  - Run /docs/database/schema.md.
  - Run /docs/database/indexes.md.
  - Run /docs/database/constraints.md.
  - Run triggers from /docs/database/relationships.md.
  - Seed initial 8 creators and 48 posts from /data/mockData.ts.

Step 2: Authentication & Session Middleware
  - Implement Argon2id password hashing.
  - Build POST /api/auth/register and POST /api/auth/login.
  - Configure HttpOnly session cookie issuance.
  - Create authentication middleware attaching req.user to request context.

Step 3: Core CRUD Services
  - Implement Posts API (/docs/api/posts.md).
  - Implement Collections API (/docs/api/collections.md).
  - Implement Users API (/docs/api/users.md).

Step 4: Media Upload Pipeline
  - Configure S3 / GCS bucket with CORS.
  - Build POST /api/uploads/presigned (/docs/api/uploads.md).
  - Implement image processing worker (WebP optimization, metadata stripping).

Step 5: Social Graph & Interactions
  - Implement like/save toggling.
  - Implement follower graph.
  - Implement comments.

Step 6: Real-Time Services & Notifications
  - Implement messaging threads and chat histories (/docs/api/messages.md).
  - Implement notifications event consumer.

Step 7: Verification & Acceptance
  - Run full test suite (/docs/testing/api-testing.md).
```

---

## 3. Backend Acceptance Checklist

Use this comprehensive checklist to track production backend readiness:

- [ ] **Database & Models**:
  - [ ] PostgreSQL 15+ provisioned with `uuid-ossp` and `pgcrypto`.
  - [ ] `users` table created with unique handles, emails, and age check.
  - [ ] `sessions` table created with token hash indexing.
  - [ ] `posts` table created with aspect ratio check (0.5 to 2.0).
  - [ ] `collections` and `collection_posts` tables created with cascade deletes.
  - [ ] `post_likes`, `user_saved_posts`, and `user_followers` tables created with composite PKs.
  - [ ] `comments`, `conversations`, `chat_messages`, and `notifications` tables created.
  - [ ] Database sync triggers deployed for `likes_count`, `followers_count`, `following_count`.
  - [ ] All partial and GIN indexes created from `/docs/database/indexes.md`.
  - [ ] Initial seed data imported from `/data/mockData.ts`.
- [ ] **Authentication & Security**:
  - [ ] Argon2id or bcrypt password hashing implemented.
  - [ ] `POST /api/auth/register` validates input, hashes password, and creates session.
  - [ ] `POST /api/auth/login` checks credentials with rate limiting and constant-time compare.
  - [ ] Session cookie configured with `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
  - [ ] `POST /api/auth/logout` invalidates session in DB and clears cookie.
  - [ ] `GET /api/auth/me` validates session and returns user profile.
  - [ ] `POST /api/auth/forgot-password` returns 200 without email enumeration.
- [ ] **Posts API**:
  - [ ] `GET /api/posts` supports `tag`, `q`, `userId`, `limit`, and `cursor` parameters.
  - [ ] `POST /api/posts` validates title (3–80 chars), ratio, and image URL.
  - [ ] `GET /api/posts/:id` returns post with author details.
  - [ ] `PATCH /api/posts/:id` restricts updates to post author.
  - [ ] `DELETE /api/posts/:id` restricts deletion to author and cascades child records.
  - [ ] `POST /api/posts/:id/like` and `DELETE /api/posts/:id/like` toggle like state atomically.
  - [ ] `POST /api/posts/:id/save` and `DELETE /api/posts/:id/save` toggle bookmark state.
  - [ ] `POST /api/posts/:id/comments` validates text (1–500 chars) and persists comment.
- [ ] **Collections API**:
  - [ ] `GET /api/collections` returns user collections and public collections.
  - [ ] `POST /api/collections` validates name (2–100 chars) and assigns owner.
  - [ ] `GET /api/collections/:id` returns 404 for private collections owned by others.
  - [ ] `PATCH /api/collections/:id` updates name, privacy, or pin memberships for owner only.
  - [ ] `DELETE /api/collections/:id` deletes board for owner only.
- [ ] **Users & Profiles API**:
  - [ ] `GET /api/users/:id` returns creator profile, statistics, and follow status.
  - [ ] `PATCH /api/users/me` validates unique handle, name, bio, and website URL.
  - [ ] `GET /api/users/:id/followers` and `GET /api/users/:id/following` return user arrays.
  - [ ] `POST /api/users/:id/follow` and `DELETE /api/users/:id/follow` manage follow graph.
- [ ] **Search & Discovery**:
  - [ ] `GET /api/search/suggestions` returns categorized creators, posts, and tags.
  - [ ] GIN index search on `search_vector` performs fast sub-10ms keyword search.
- [ ] **Direct Messaging & Notifications**:
  - [ ] `GET /api/conversations` returns user threads with last message and unread badge.
  - [ ] `GET /api/conversations/:id/messages` returns thread history for participants only.
  - [ ] `POST /api/conversations/:id/messages` validates text (1–2000 chars) and dispatches message.
  - [ ] `PATCH /api/conversations/:id/read` clears unread indicator.
  - [ ] `GET /api/notifications` returns activity items with unread indicators.
- [ ] **Media Storage**:
  - [ ] `POST /api/uploads/presigned` validates size (<= 5MB) and MIME type.
  - [ ] Direct bucket upload verified.
  - [ ] WebP derivative generation verified.
- [ ] **Errors & Resilience**:
  - [ ] All error responses follow standard envelope `{ success: false, error: string, code: string }`.
  - [ ] Proper HTTP statuses (200, 201, 400, 401, 403, 404, 409, 413, 415, 429, 500) enforced.
  - [ ] Frontend integration verified against production API with zero TypeScript or console errors.
