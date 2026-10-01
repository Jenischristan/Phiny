# Frontend State Architecture & `PhinyContext` Contract

The Phiny frontend manages application state through a central React Context provider (`PhinyProvider` in `context/PhinyContext.tsx`). This document defines the lifecycle, ownership, persistence, and backend synchronization requirements for every piece of state.

---

## 1. Master State Inventory

| State Name | Owner | Type | Purpose | Initial Value | LocalStorage? | Backend Synchronized? |
|---|---|---|---|---|---|---|
| `user` | Context | `Partial<Person> \| null` | Authenticated session user | `null` (Demo accounts in memory) | Planned (Session cookie / token) | Yes (`POST /api/auth/login`) |
| `accounts` | Context | `Partial<Person>[]` | Cached multi-account switcher list | `DEFAULT_ACCOUNTS` (2 default accounts) | Memory | Planned (`users` table) |
| `posts` | Context | `Post[]` | All active feed posts | Seed data (`PINS`) | No | Yes (`GET /api/posts`) |
| `colls` | Context | `Collection[]` | User's collection boards | Initial collections (`COLLS0`) | No | Yes (`GET /api/collections`) |
| `saved` | Context | `Record<string \| number, boolean>` | Map of post IDs bookmarked by user | `{}` | No | Yes (`user_saved_posts`) |
| `liked` | Context | `Record<string \| number, boolean>` | Map of post IDs liked by user | `{}` | No | Yes (`post_likes`) |
| `fol` | Context | `Record<string \| number, boolean>` | Map of user IDs followed by user | `{}` | No | Yes (`user_followers`) |
| `hidden` | Context | `Record<string \| number, number \| boolean>` | Map of muted/hidden post IDs | `{}` | No | Optional / User prefs |
| `q` | Context | `string` | Active global search filter query | `""` | No | Yes (`GET /api/posts?q=`) |
| `tag` | Context | `string` | Active category/tag filter | `"All"` | No | Yes (`GET /api/posts?tag=`) |
| `notes` | Context | `NotificationItem[]` | Notifications inbox items | Seed notifications (`NOTES2`) | No | Yes (`notifications` table) |
| `convs` | Context | `Conversation[]` | Direct messaging threads & history | Seed conversations (`CONV0`) | No | Yes (`conversations` & `messages`) |
| `col` | Context | `boolean` | Single column vs masonry grid toggle | `false` (Reads `phiny-col`) | Yes (`phiny-col` key) | No (Client preference) |
| `theme` | Context | `ThemeMode` (`'light' \| 'dark' \| 'system'`) | Dark / light theme appearance | `'system'` (Reads `phiny-theme`) | Yes (`phiny-theme` key) | Yes (Saved in `user.preferences`) |
| `pf` | Context | `Preferences` | Notification & privacy settings | `PF0` | No | Yes (`user_preferences` table) |
| `login` | Context | `boolean` | Sign-in dialog open state | `false` | No | No (UI modal) |
| `sheet` | Context | `SheetType` (`'notifications' \| 'messages' \| null`) | Active slide-out drawer | `null` | No | No (UI drawer) |
| `addTo` | Context | `number \| string \| null` | Post ID currently being added to boards | `null` | No | No (UI modal) |
| `cd` | Context | `{ coll?: Collection } \| null` | Collection dialog state (create or edit) | `null` | No | No (UI modal) |
| `edit` | Context | `boolean` | Edit profile dialog open state | `false` | No | No (UI modal) |
| `accOpen` | Context | `boolean` | Account switcher dialog open state | `false` | No | No (UI modal) |
| `rp` | Context | `{ kind: string } \| null` | Report content modal state | `null` | No | No (UI modal) |
| `cf` / `cfo` | Context | `ConfirmOptions` / `boolean` | Generic confirmation dialog state | `{}` / `false` | No | No (UI modal) |

---

## 2. Authentication Gating Pattern (`c.gate`)

The frontend uses an authorization interceptor pattern for actions requiring an authenticated account:

```typescript
const gate = (fn: () => void, w?: string) => {
  if (user) {
    fn();
    return;
  }
  pend.current = fn;
  setWhy(w || 'Log in to continue.');
  setLogin(true);
};
```

### Gating Lifecycle
1. User clicks an action requiring authentication (e.g. `c.openAdd(pinId)`, `c.toggleLike(pinId)`, `c.toggleFol(creatorId)`, `c.nav('messages')`).
2. If `user` is non-null, the callback `fn()` executes immediately.
3. If `user` is null:
   - The intended action is stored in `pend.current` ref.
   - The explanation prompt is set (`setWhy`).
   - The login modal opens (`setLogin(true)`).
4. If the user successfully signs in via `LoginDialog`:
   - `onLoginSuccess` updates the `user` state.
   - The stored callback in `pend.current` is invoked via `setTimeout(..., 0)`.
   - The user's intended action completes seamlessly without requiring a second click.
5. If the user closes `LoginDialog` without signing in, `pend.current` is cleared.

---

## 3. Optimistic Updates & State Synchronization

### 3.1 Bookmark / Save Pin (`c.toggleSave`)
- **Action**: Toggling bookmark on a post.
- **Frontend Mutation**: Instantly toggles `saved[id]` boolean in state.
- **Toast Trigger**: Displays `'Saved to your library'` or `'Removed from saved'`.
- **Backend Requirement**: In production, fire an asynchronous `POST /api/posts/[id]/save` or `DELETE /api/posts/[id]/save`. If the API returns an error, the frontend must catch the rejection and revert the optimistic toggle.

### 3.2 Like Pin (`c.toggleLike`)
- **Action**: Toggling heart like on a post.
- **Frontend Mutation**: Gated by `c.gate()`. If authenticated, instantly toggles `liked[id]` in state.
- **Backend Requirement**: Fire `POST /api/posts/[id]/like` or `DELETE /api/posts/[id]/like`.

### 3.3 Follow Creator (`c.toggleFol`)
- **Action**: Following or unfollowing a creator.
- **Frontend Mutation**: Gated by `c.gate()`. Instantly toggles `fol[id]` in state.
- **Backend Requirement**: Fire `POST /api/users/[id]/follow` or `DELETE /api/users/[id]/follow`.

### 3.4 Add Pin to Collection (`c.addToggle`)
- **Action**: Toggling whether a post is included in a specific collection.
- **Frontend Mutation**: Updates the local `pins` array on the matching `Collection` object in `colls`.
- **Backend Requirement**: Calls `PATCH /api/collections/[id]` via `lib/api.ts` with updated `pins` array.

### 3.5 Publish Post (`c.publish`)
- **Action**: Submitting a new post from `CreateView`.
- **Frontend Mutation**: Prepends the new `Post` object to `posts` array in state. If destination collection was specified, prepends `post.id` to `collection.pins`.
- **Backend Requirement**: Calls `POST /api/posts` with JSON payload. Upon receipt of 201 response, replaces temporary ID with server UUID and redirects to `/post/[id]`.

---

## 4. Inert Accessibility Lock

When any modal dialog or slide-out drawer is open (`login`, `sheet`, `addTo`, `cd`, `edit`, `accOpen`, `rp`, `cfo`), the application automatically sets:
1. `document.getElementById('shell').inert = true`
2. `document.documentElement.style.overflow = 'hidden'`
3. `document.body.style.overflow = 'hidden'`

This prevents screen readers and keyboard users from focusing background elements outside the modal container, satisfying WCAG 2.1 Level AA dialog accessibility standards.
