# System Architecture & Topology

## 1. System Overview

Phiny is designed around a decoupled client-server architecture where a Next.js 16 frontend acts as the user interface layer, communicating with backend REST endpoints for data persistence, authentication, search, and asset delivery.

```text
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│  - React 19 Client Components                          │
│  - PhinyContext State Management                       │
│  - Local Storage Cache & Session State                 │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON / Cookies
                           ▼
┌────────────────────────────────────────────────────────┐
│              Next.js 16 Frontend Layer                 │
│  - App Router (/app) Server & Client Components        │
│  - /lib/api.ts (Type-safe client API helper)           │
│  - /api/* (API proxy / serverless route handlers)      │
└──────────────────────────┬─────────────────────────────┘
                           │ Internal RPC / REST (Production)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Backend API Services                 │
│  - Authentication & Session Verification Middleware   │
│  - Post, Collection, User, and Messaging Handlers      │
│  - Input Validation & Sanitization Engine              │
│  - Full-Text Search Service (PostgreSQL / OpenSearch)  │
└────────────┬─────────────────────────────┬─────────────┘
             │ SQL Queries                 │ Presigned S3/GCS URLs
             ▼                             ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   PostgreSQL Database    │  │   Cloud Object Storage   │
│  - Users & Profiles      │  │  - Original Images (5MB) │
│  - Posts & Tags          │  │  - Optimized WebP Images │
│  - Collections & Pins    │  │  - CDN Distribution      │
│  - Messages & Notes      │  │    (CloudFront / CF)     │
└──────────────────────────┘  └──────────────────────────┘
```

---

## 2. Implementation State Classification

To ensure complete clarity for backend developers, every component and subsystem is categorized into one of three architectural tiers:

### Tier A: Current Prototype Implementation (What exists today)
- **Frontend App Router**: Complete Next.js 16 implementation with interactive pages, modals, slide-out sheets, responsive masonry layout, and brutalist UI.
- **In-Memory Store (`lib/backendData.ts`)**: A singleton class `BackendStore` stored on `globalThis` mimicking database storage in memory across development server requests.
- **Client API Helper (`lib/api.ts`)**: A fetch-based client wrapper calling `/api/posts`, `/api/collections`, and `/api/auth/login`. If a network error occurs, it falls back to an empty response while logging a warning.
- **Client-Side State (`context/PhinyContext.tsx`)**: Global React Context managing active user, liked pins, saved pins, followed creators, active collections, unread notifications, active conversation messages, and client theme.
- **Procedural SVG Generator (`lib/art.ts`)**: Automatically generates deterministic brutalist visual SVG artwork for seed numbers when an external image URL is not supplied.
- **Demo Authentication**: Matching usernames or emails against mock records in `data/mockData.ts` without password hashing.

### Tier B: Intended Production Architecture (What the backend must build)
- **Stateless API Services**: Scalable backend endpoints implementing the contracts defined in `/docs/api/`.
- **Relational PostgreSQL Database**: Strictly typed relational schema with constraints, foreign keys, and indexes defined in `/docs/database/`.
- **Secure Authentication**: Production session handling via `HttpOnly`, `SameSite=Lax`, `Secure` cookies or signed Bearer tokens (JWT/PASETO) backed by an encrypted password store (Argon2id/bcrypt).
- **Blob Storage Pipeline**: Direct-to-bucket uploads using presigned URLs or dedicated multipart upload endpoints, serving optimized media through a Content Delivery Network (CDN).
- **Search Infrastructure**: Indexed database search using PostgreSQL `tsvector`/GIN indexes or dedicated search engines (Meilisearch/Elasticsearch).
- **Authorization Enforcement**: Server-side access control verifying that mutations (delete post, update collection, post message) originate from the authentic owner.

### Tier C: Temporary & Mock Behaviors (To be replaced)
- **Local Storage Mocking**: `localStorage` used for theme persistence is standard, but fallback state for collections and saved pins must migrate to server queries.
- **Demo Users in Memory**: `PEOPLE` array in `data/mockData.ts` must be seeded into the production database `users` table.
- **Static Messages & Notifications**: Mock conversations and notifications must be replaced by relational database tables queried via dedicated API routes.

---

## 3. Client and Server Boundary Architecture

Next.js 16 App Router uses Server Components by default. The Phiny frontend balances server-side rendering and client-side interactivity as follows:

1. **Page Entries (`app/**/page.tsx`)**:
   - Serve as Server Component route definitions.
   - Define static and dynamic SEO metadata (`title`, `description`, `openGraph`).
   - Instantiate client-side view components (`HomeView`, `PostView`, `ProfileView`, `SettingsView`, `CreateView`, `LibraryView`, `ExploreView`).
2. **Interactive View Components (`components/**`)**:
   - Declared with `'use client'`.
   - Access global application state via `useC()` hook from `PhinyContext`.
   - Manage local UI states (e.g. active tab, filter strings, dropdown visibility, input values).
3. **Layout Shell (`components/layout/AppShell.tsx`)**:
   - Manages desktop sidebar navigation, mobile top header, and mobile bottom navigation.
   - Houses top-level portal modals (`LoginDialog`, `CollDialog`, `AddToDialog`, `EditProfileDialog`, `ConfirmDialog`, `ReportDialog`) and off-canvas sheets (`MsgsSheet`, `NotifsSheet`).
   - Enforces inert application locking when a modal or sheet is open to satisfy WCAG accessibility standards.
4. **Data Fetching Layer (`lib/api.ts`)**:
   - Client-side fetcher executing HTTP requests against `/api/*`.
   - Handles HTTP error status codes, parses JSON envelopes, and returns strongly typed payloads.

---

## 4. Failure and Fallback Strategy

The frontend implementation incorporates resilient fallback mechanisms:
- **Offline / Server Unavailability**: If `/api/posts` or `/api/collections` fails to respond or returns 500, `lib/api.ts` catches the error, logs a console warning, and returns cached client memory without crashing the UI.
- **Image Fallback**: If an image URL fails to load, `lib/art.ts` generates deterministic geometric vector graphics based on the post's integer seed and title.
- **Route Navigation Fallback**: If an invalid post ID (`/post/invalid`) or collection ID (`/collection/invalid`) is requested, the respective view detects `undefined` and renders an accessible `Empty` state component with a navigation CTA back to the feed or library.
