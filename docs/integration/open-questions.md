# Open Architectural Decisions & Product Inquiries

This document tracks all unresolved technical and product decisions requiring explicit consensus before backend implementation is finalized. **No silent assumptions should be made regarding these items.**

---

## 1. Authentication & Identity Provider

> **NEEDS DECISION**: Self-hosted session management vs. Managed Auth Provider (e.g. Supabase Auth, Firebase Auth, Clerk, Auth0).
- **Current State**: Lightweight handle lookup in `app/api/auth/login/route.ts`.
- **Options**:
  1. *Custom In-House Auth*: Argon2id hashing + PostgreSQL `sessions` table + HttpOnly cookies. (Maximum control, zero vendor lock-in).
  2. *Managed Auth Provider*: Outsources MFA, rate limiting, and password reset email delivery.
- **Recommendation**: In-house PostgreSQL sessions with Argon2id for prototype portability, with optional OAuth2 integration.

---

## 2. Cloud Storage & CDN Provider

> **NEEDS DECISION**: Cloud Object Storage provider selection.
- **Current State**: Ingestion of Base64 strings via `FileReader` and procedural SVG rendering (`lib/art.ts`).
- **Options**:
  1. AWS S3 + CloudFront CDN.
  2. Google Cloud Storage + Cloud CDN.
  3. Cloudflare R2 + Cloudflare CDN (Zero egress fees).
- **Recommendation**: Cloudflare R2 for zero egress fees on heavy image browsing.

---

## 3. Real-Time Messaging Protocol

> **NEEDS DECISION**: WebSocket server vs. Server-Sent Events (SSE) vs. Short Polling.
- **Current State**: Direct messaging threads (`MsgsSheet`) update in-memory state on the client without live network events.
- **Options**:
  1. *Server-Sent Events (SSE)* on `GET /api/messages/stream`: Simple, unidirectional, works over standard HTTP/2, easy to authenticate with cookies.
  2. *WebSockets*: Full bidirectional duplex, enables live typing indicators and instant delivery acknowledgments.
  3. *Short Polling*: Requests `GET /api/conversations` every 10–30s. Simpler, but higher server query load.
- **Recommendation**: Server-Sent Events (SSE) for initial release, scaling to WebSockets if interactive typing indicators are added to the product roadmap.

---

## 4. Search Engine Architecture

> **NEEDS DECISION**: PostgreSQL Native Full-Text Search vs. Dedicated Search Engine.
- **Current State**: Substring matching across memory arrays in `lib/backendData.ts`.
- **Options**:
  1. *PostgreSQL `tsvector` + GIN Index*: Zero additional infrastructure, instant consistency with DB writes.
  2. *Meilisearch / OpenSearch*: Typo tolerance, prefix search as you type, and instant sub-5ms faceted search.
- **Recommendation**: PostgreSQL `tsvector` with GIN indexing until catalog exceeds 100,000 posts; then migrate to Meilisearch.

---

## 5. Account Deletion & Anonymization Policy (GDPR / Privacy)

> **NEEDS DECISION**: Hard deletion vs. Soft deletion for user accounts.
- **Current State**: User state supports `'deactivated'`.
- **Options**:
  1. *Hard Delete (`CASCADE`)*: Deletes all posts, comments, collections, and messages permanently.
  2. *Soft Delete / Anonymize*: Sets `state = 'deactivated'`, renames handle to `[deleted_user]`, removes personal avatar and email, but preserves published post imagery to prevent breaking other users' collection boards.
- **Recommendation**: Soft delete with anonymization, giving users a 30-day grace period to restore their account before irreversible purge.

---

## 6. Rate Limiting Thresholds

> **NEEDS DECISION**: Production rate limiting rules.
- **Current State**: No rate limiting applied.
- **Proposed Thresholds**:
  - `POST /api/auth/login`: 5 failed attempts per IP per 15 minutes.
  - `POST /api/posts`: 20 new posts per user per hour (anti-spam).
  - `POST /api/posts/:id/comments`: 60 comments per user per hour.
  - `GET /api/search/suggestions`: 120 requests per minute per IP.
  - Global API: 1,000 requests per minute per authenticated user.

---

## 7. Direct Messaging Moderation & Spam Controls

> **NEEDS DECISION**: Who can initiate direct messages with a creator?
- **Current State**: Frontend preferences in `types/index.ts` include `msg: "Everyone" | "People you follow" | "No one"`.
- **Backend Requirement**: Before allowing `POST /api/conversations`, the server must verify the recipient's `allow_msg_from` preference setting. If set to `"People you follow"`, the recipient must be following the sender.
