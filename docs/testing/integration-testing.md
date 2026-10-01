# End-to-End Integration Testing & Verification

This document specifies the verification procedure to test the Next.js frontend against a live production backend.

---

## 1. Environment Configuration

### Frontend `.env.production`
```env
NEXT_PUBLIC_API_URL=https://api.phiny.art
NEXT_PUBLIC_CDN_URL=https://cdn.phiny.art
```

### CORS & Cookie Credentials
If the production backend runs on a separate subdomain (e.g. `api.phiny.art` while frontend runs on `phiny.art` or `app.phiny.art`):
- **Cookie Domain**: Set `Domain=.phiny.art` on `Set-Cookie: phiny_session=...` so cookies are shared across subdomains.
- **CORS Headers on API**:
  ```http
  Access-Control-Allow-Origin: https://phiny.art
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
- **Fetch Calls**: Must pass `credentials: 'include'` when calling cross-origin APIs.

---

## 2. Integrated User Journey Verification Checklist

Execute these 7 core user journeys in sequence to verify full frontend-backend integration:

### Journey 1: New User Registration & Onboarding
1. Navigate to `/signup`.
2. Complete steps 1 through 5 (Name, Username, Email, Password, DOB). Verify validation blocks under-13 ages and invalid handles.
3. Select 3 topics on step 8 and follow 2 suggested creators on step 9.
4. Click "Complete".
5. **Verification**: User is redirected to `/`, welcome toast appears, session cookie is set, and header shows user avatar.

### Journey 2: Post Publication & Image Upload
1. Navigate to `/create`.
2. Drop an image under 5 MB. Verify progress bar completes and preview displays image with detected aspect ratio.
3. Enter title `"Berlin Concrete Study"`, assign tags `["Architecture", "Brutalism"]`, and click "Publish".
4. **Verification**: Frontend navigates to `/post/[newId]`. Re-check `/` to verify post appears at the top of the feed.

### Journey 3: Collection Creation & Pin Bookmarking
1. On `/post/[id]`, click "Save" button. Verify button changes to "Saved" and toast `"Saved to your library"` displays.
2. Click More Actions dropdown -> "Add to collection".
3. Enter new collection name `"Raw Facades"` and submit.
4. **Verification**: Toast `"Added to Raw Facades"` appears. Navigate to `/library` -> verify collection appears with 1 pin. Open `/collection/[id]` -> verify pin renders.

### Journey 4: Global Search & Navigation Synchronization
1. Navigate to `/settings`.
2. In the header search bar, type `"Berlin"` and press `Enter`.
3. **Verification**: Application automatically navigates from `/settings` to `/`, search filter activates, and only matching posts render.

### Journey 5: Creator Profile & Follower Graph
1. Click on author name `"Mara Okafor"` on any post card.
2. Verify `/profile/0` loads with Mara's bio, follower count, and created posts.
3. Click "Follow" button.
4. **Verification**: Button switches to "Following", follower count increments by 1. Open `/profile/0/followers` and verify logged-in user appears in list.

### Journey 6: Direct Messaging
1. In the header or sidebar, click the Messages icon.
2. Select thread with Sofia Rinaldi.
3. Send message `"Hello Sofia!"`.
4. **Verification**: Message bubble renders immediately, scrolls to bottom, and thread list shows preview.

### Journey 7: Session Persistence & Logout
1. Hard-refresh browser window (`Cmd+Shift+R`).
2. Verify user remains signed in (session cookie persisted).
3. Open Account Switcher modal, click "Log out".
4. **Verification**: Session cookie is cleared, UI reverts to logged-out state ("Sign in" button visible).

---

## 3. Production Latency & Performance Benchmarks

| Operation | Target P95 Latency | Benchmark Requirement |
|---|---|---|
| **Feed Listing (`GET /api/posts`)** | `< 150 ms` | Must utilize partial B-tree index on `(created_at DESC, id DESC)`. |
| **Search Autocomplete (`GET /api/search/suggestions`)** | `< 50 ms` | Must use GIN index on trigram / text search vector. |
| **Single Post Query (`GET /api/posts/:id`)** | `< 30 ms` | Single row Primary Key lookup. |
| **Post Creation (`POST /api/posts`)** | `< 200 ms` | Single row insert with collection join insert. |
| **CDN Image Delivery** | `< 100 ms` | Edge-cached WebP image delivered from CDN. |
