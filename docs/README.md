# Phiny — Frontend Documentation & Backend Integration Contract

Welcome to the central documentation and integration contract for **Phiny**, a visual discovery, curation, and creative publishing platform built with Next.js 16, React 19, Tailwind CSS, and TypeScript.

This documentation suite serves as the **definitive contract** between the Phiny frontend application and the backend engineering team. It is written to enable a backend engineer to design, build, test, and deploy the entire production backend **without needing to open, read, or reverse-engineer the frontend source code**.

---

## 1. Executive Summary & Purpose

Phiny is a high-craft visual media platform focused on curation, brutalist aesthetics, and creator networks. Users discover curated imagery across architecture, graphic design, typography, film, and art; organize posts into personal or public collections; interact through likes, saves, and comments; follow creators; communicate through direct messaging; and manage fine-grained profile and privacy settings.

### Core Frontend Stack
- **Framework**: Next.js 16.3.8 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5.8+ (Strict mode)
- **Styling**: Tailwind CSS v4 + IBM Plex Mono & Space Grotesk typography
- **State Management**: React Context (`PhinyContext`) with optimistic client state and local storage fallback
- **Data Fetching**: Next.js App Router client helper (`/lib/api.ts`) interfacing with `/api/*` endpoints
- **Test Suite**: Vitest (20 suites, 100 tests passing) + Playwright E2E suite

---

## 2. Documentation Map

| Category | File | Description |
|---|---|---|
| **Architecture** | [`architecture.md`](./architecture.md) | High-level system architecture, current vs. production topology, data flow |
| **Frontend Overview** | [`frontend-overview.md`](./frontend-overview.md) | Technical stack, App Router structure, responsive breakpoints, styling |
| **Frontend Routes** | [`frontend-routes.md`](./frontend-routes.md) | Specification of every page route, parameters, data needs, error/empty states |
| **Frontend Components** | [`frontend-components.md`](./frontend-components.md) | Component catalog, hierarchy, props, UI primitives, and modals |
| **Frontend State** | [`frontend-state.md`](./frontend-state.md) | `PhinyContext` global state model, optimistic actions, storage persistence |
| **Data Model** | [`frontend-data-model.md`](./frontend-data-model.md) | Complete frontend TypeScript types and mock-to-production entity mappings |
| **API Specification** | [`api/overview.md`](./api/overview.md) | API architecture, conventions, status codes, and headers |
| **API Spec: Auth** | [`api/authentication.md`](./api/authentication.md) | Login, registration, password reset, and session verification contracts |
| **API Spec: Posts** | [`api/posts.md`](./api/posts.md) | Posts CRUD, feed queries, filtering, search, like/save toggling |
| **API Spec: Collections** | [`api/collections.md`](./api/collections.md) | Collections CRUD, pin addition/removal, privacy controls |
| **API Spec: Users** | [`api/users.md`](./api/users.md) | User profiles, follower/following lists, account settings |
| **API Spec: Messages** | [`api/messages.md`](./api/messages.md) | Direct messaging threads, chat messages, read receipts |
| **API Spec: Search** | [`api/search.md`](./api/search.md) | Search suggestions, full-text post/creator/tag queries |
| **API Spec: Uploads** | [`api/uploads.md`](./api/uploads.md) | Image upload pipeline, storage requirements, CDN delivery |
| **API Spec: Errors** | [`api/errors.md`](./api/errors.md) | Standardized error envelope, status codes, field validation formats |
| **OpenAPI Spec** | [`api/openapi.yaml`](./api/openapi.yaml) | Machine-readable OpenAPI 3.1 specification for all endpoints |
| **Contracts: Master** | [`contracts/api-contract.md`](./contracts/api-contract.md) | Master input/output contract summary across all endpoints |
| **Contracts: Entities** | [`contracts/entity-contracts.md`](./contracts/entity-contracts.md) | Exact schema requirements for all database and JSON entities |
| **Contracts: Validation** | [`contracts/validation.md`](./contracts/validation.md) | Field-by-field client UX rules vs. mandatory server integrity rules |
| **Contracts: Pagination** | [`contracts/pagination.md`](./contracts/pagination.md) | Cursor and offset pagination contracts for scalable feeds |
| **Contracts: Filtering** | [`contracts/filtering.md`](./contracts/filtering.md) | Tag, user, and keyword filtering contracts |
| **Contracts: Sorting** | [`contracts/sorting.md`](./contracts/sorting.md) | Feed sorting modes, date recency, and like weighting |
| **Contracts: Auth** | [`contracts/authentication.md`](./contracts/authentication.md) | Production session cookies, JWT bearer tokens, and expiry rules |
| **Contracts: Authz** | [`contracts/authorization.md`](./contracts/authorization.md) | Role & ownership matrix for posts, collections, and messages |
| **Database: Schema** | [`database/schema.md`](./database/schema.md) | Production PostgreSQL DDL schema with constraints and defaults |
| **Database: ERD** | [`database/relationships.md`](./database/relationships.md) | Entity relationship diagrams (Mermaid), cascade and deletion rules |
| **Database: Indexes** | [`database/indexes.md`](./database/indexes.md) | Indexing strategy for query performance and uniqueness |
| **Database: Constraints** | [`database/constraints.md`](./database/constraints.md) | Integrity constraints, foreign keys, enums, check constraints |
| **Primary Guide** | [`integration/backend-implementation-guide.md`](./integration/backend-implementation-guide.md) | **PRIMARY HANDOFF DOCUMENT**: Complete step-by-step implementation guide |
| **Integration Flows** | [`integration/frontend-backend-flow.md`](./integration/frontend-backend-flow.md) | Mermaid sequence diagrams for all key user journeys |
| **Migration Plan** | [`integration/migration-plan.md`](./integration/migration-plan.md) | Zero-downtime transition from mock store to PostgreSQL backend |
| **Open Questions** | [`integration/open-questions.md`](./integration/open-questions.md) | Explicit registry of all architectural items requiring product decisions |
| **Testing: Frontend** | [`testing/frontend-testing.md`](./testing/frontend-testing.md) | Vitest and Playwright test inventory and assertions |
| **Testing: API** | [`testing/api-testing.md`](./testing/api-testing.md) | Backend test scenarios, contract verification, and test seeds |
| **Testing: Integration** | [`testing/integration-testing.md`](./testing/integration-testing.md) | End-to-end integration and verification checklist |

---

## 3. Recommended Reading Path for Backend Engineers

If you are a backend engineer tasked with implementing the Phiny backend, follow this sequential path:

```text
1. /docs/integration/backend-implementation-guide.md   (High-level overview & checklist)
                 ↓
2. /docs/database/schema.md                           (PostgreSQL DDL & tables)
                 ↓
3. /docs/database/relationships.md                    (Foreign keys & cascades)
                 ↓
4. /docs/contracts/entity-contracts.md                (JSON serialization formats)
                 ↓
5. /docs/api/overview.md & /docs/api/*.md             (API endpoints & handlers)
                 ↓
6. /docs/contracts/validation.md                      (Input validation & security)
                 ↓
7. /docs/integration/frontend-backend-flow.md         (Sequence diagrams of UX flows)
                 ↓
8. /docs/api/openapi.yaml                             (OpenAPI 3.1 specification)
```

---

## 4. Current vs. Production Architecture Comparison

| Domain | Current Frontend Prototype | Intended Production Backend |
|---|---|---|
| **Persistence** | In-memory singleton (`lib/backendData.ts`) + browser `localStorage` | PostgreSQL database with connection pooling |
| **Authentication** | Demo handle matching (`/api/auth/login`) with client-side user state | Secure session cookies (`HttpOnly`, `SameSite=Lax`, `Secure`) or JWT |
| **Password Storage** | Mock client validation (no hashing) | Argon2id or bcrypt (work factor >= 12) |
| **Media Storage** | Base64 Data URLs and procedural SVG generator (`lib/art.ts`) | Cloud Object Storage (S3 / GCS) + CDN (CloudFront / Cloudflare) |
| **Search** | Case-insensitive substring matching in memory | PostgreSQL Full-Text Search (`tsvector`) or OpenSearch / Meilisearch |
| **Authorization** | Client-side UI checks (e.g. `c.me.id === post.by.id`) | Server-side authorization middleware enforcing entity ownership |
| **Messaging** | In-memory conversation array in state | Relational conversation/message tables with WebSocket or SSE events |
| **Notifications** | Local in-memory list with simulated triggers | Relational notification table with background event worker |

---

## 5. Architectural Glossary

- **Pin / Post**: A visual publication consisting of an image, title, aspect ratio, creator metadata, tags, description, location, and visibility settings.
- **Collection**: A named grouping of posts/pins owned by a user, which can be public or private.
- **Creator / Person**: A user entity on Phiny containing handle, display name, bio, avatar, role, website, and follower counts.
- **Gating (`c.gate`)**: A UX mechanism in the frontend where actions requiring an authenticated user prompt the sign-in dialog if the visitor is anonymous.
- **Aspect Ratio**: The numerical height-to-width ratio of an image (`height / width`) stored as a float (e.g. `1.25`, `0.75`) used by the CSS column grid for masonry rendering without layout shift.
- **Saved Pin**: A pin bookmarked by the user in their personal library or added to one or more collections.
- **Unread Indicator**: A notification or conversation flag indicating unseen content.
