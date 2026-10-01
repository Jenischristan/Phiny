# Backend Migration Plan: From In-Memory Store to PostgreSQL

This document outlines the phased migration strategy to transition Phiny from the in-memory development store (`lib/backendData.ts`) to a production PostgreSQL database without disrupting frontend workflows or breaking test suites.

---

## 1. Migration Overview & Phased Roadmap

```text
┌────────────────────────┐
│ Phase 1: Database DDL  │  Provision PostgreSQL 15+, apply schema, indexes & constraints
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Phase 2: Data Seeding  │  Extract seed records from mockData.ts into PostgreSQL
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Phase 3: API Cutover   │  Replace BackendStore calls in Next.js API routes with ORM/SQL
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Phase 4: Media Bucket  │  Transition Base64 data URLs to Cloud Object Storage & CDN
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ Phase 5: Verification  │  Execute 100-test Vitest suite + Playwright E2E verification
└────────────────────────┘
```

---

## 2. Phase 1: Database Setup
1. Provision a PostgreSQL 15+ instance (e.g. Cloud SQL, Supabase, Neon, AWS RDS).
2. Execute [`/docs/database/schema.md`](../database/schema.md) to initialize tables.
3. Execute [`/docs/database/indexes.md`](../database/indexes.md) to build query indexes.
4. Execute [`/docs/database/constraints.md`](../database/constraints.md) to enforce integrity rules.
5. Deploy database counter triggers from [`/docs/database/relationships.md`](../database/relationships.md).

---

## 3. Phase 2: Seed Data Migration

To preserve existing frontend lookups, the 8 default users (`PEOPLE`), 48 default posts (`PINS`), and 4 default collections (`COLLS0`) in `data/mockData.ts` must be loaded into the database:

```sql
-- Seed users
INSERT INTO users (id, name, handle, email, password_hash, role, bio, loc, state, vis, followers_count, following_count, dob)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Mara Okafor', 'maraokafor', 'mara@example.com', '$argon2id$v=19$m=65536,t=3,p=4$dummyhash', 'Architectural photographer', 'Architectural photographer. Lagos & Zurich.', 'Lagos & Zurich', 'active', 'public', 4200, 312, '1992-04-10'),
  ('00000000-0000-0000-0000-000000000001', 'Kenji Sato', 'kenjisato', 'kenji@example.com', '$argon2id$v=19$m=65536,t=3,p=4$dummyhash', 'Industrial designer', 'Form, material, reduction. Tokyo.', 'Tokyo', 'active', 'public', 3100, 184, '1989-11-23'),
  ('00000000-0000-0000-0000-000000000003', 'Sofia Rinaldi', 'sofiar', 'sofia@example.com', '$argon2id$v=19$m=65536,t=3,p=4$dummyhash', 'Architectural writer', 'Critical essays on concrete and light. Milan.', 'Milan', 'active', 'public', 8900, 420, '1994-08-15');

-- Seed collections
INSERT INTO collections (id, owner_id, name, priv)
VALUES
  ('c0', '00000000-0000-0000-0000-000000000000', 'Brutalist Moods', FALSE),
  ('c1', '00000000-0000-0000-0000-000000000000', 'Type Specimens', FALSE),
  ('c2', '00000000-0000-0000-0000-000000000000', 'Warm Palettes', FALSE),
  ('c3', '00000000-0000-0000-0000-000000000000', 'Night Walks', TRUE);
```

---

## 4. Phase 3: Route Handlers Migration

In `app/api/*`, replace direct references to `backendStore` (`lib/backendData.ts`) with database queries (e.g. using `pg`, `drizzle-orm`, or `prisma`):

### Before (`app/api/posts/route.ts`):
```typescript
import { backendStore } from '@/lib/backendData';
export async function GET(req: NextRequest) {
  const posts = backendStore.getPosts({ tag, q, userId });
  return NextResponse.json({ success: true, count: posts.length, data: posts });
}
```

### After:
```typescript
import { db } from '@/lib/db';
import { postsTable } from '@/lib/db/schema';
export async function GET(req: NextRequest) {
  const posts = await db.query.posts.findMany({ ... });
  return NextResponse.json({ success: true, count: posts.length, data: posts });
}
```

---

## 5. Phase 4: Media Asset Migration

1. Configure Google Cloud Storage or AWS S3 bucket `phiny-media-production`.
2. Connect Cloudflare or AWS CloudFront CDN with SSL.
3. Replace Data URLs with CDN URLs:
   - Avatars: `https://cdn.phiny.art/avatars/{userId}.webp`
   - Posts: `https://cdn.phiny.art/posts/{postId}.webp`
4. Update `next.config.mjs` `images.remotePatterns` to allow `cdn.phiny.art`.

---

## 6. Phase 5: Verification & Regression Testing

After migrating each endpoint:
1. Run `npm test` (all 20 test suites, 100 tests must pass).
2. Run `npm run typecheck` (zero TypeScript errors).
3. Run `npm run build` (Next.js production build succeeds).
4. Run Playwright E2E suite (`npm run test:e2e`).
