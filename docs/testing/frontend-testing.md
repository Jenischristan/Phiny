# Frontend Testing Strategy & Test Inventory

This document details the test suites, tooling, test files, and assertions verifying the Phiny frontend application.

---

## 1. Testing Frameworks & Setup

- **Unit & Component Runner**: **Vitest 5.0** configured with `jsdom` environment in `vitest.config.ts`.
- **Testing Utilities**: `@testing-library/react` and `@testing-library/jest-dom`.
- **E2E Runner**: **Playwright Test** configured in `playwright.config.ts`.
- **Current Status**: **20/20 test suites passing, 100/100 tests passing**.

---

## 2. Complete Vitest Suite Inventory (100 Tests)

### 2.1 API Route Tests (`tests/api/`)
1. **`auth-login.test.ts`** (3 tests):
   - Returns 400 when identifier is missing or whitespace.
   - Finds matching creator in mock database and returns success.
   - Generates default guest user when handle is unknown.
2. **`posts.test.ts`** (5 tests):
   - Lists all posts with count.
   - Filters posts by category tag.
   - Filters posts by search keyword.
   - Rejects post creation with empty title (400).
   - Successfully creates post with default author and assigns ID (201).
3. **`posts-id.test.ts`** (6 tests):
   - Retrieves post by numeric ID.
   - Returns 404 for nonexistent post.
   - Updates title and description via PATCH.
   - Returns 404 on PATCH for nonexistent post.
   - Deletes existing post and verifies deletion.
   - Returns 404 on DELETE for nonexistent post.
4. **`collections.test.ts`** (3 tests):
   - Lists collections with count.
   - Rejects collection creation without name (400).
   - Creates new collection with default privacy and pins (201).
5. **`collections-id.test.ts`** (4 tests):
   - Retrieves collection by ID.
   - Returns 404 for nonexistent collection.
   - Updates name and privacy flag via PATCH.
   - Deletes collection and returns success message.

### 2.2 Unit & Helper Tests (`tests/unit/`)
6. **`backendData.test.ts`** (15 tests):
   - Verifies all CRUD methods on `BackendStore` singleton.
   - Tests tag filtering, keyword matching, user filtering, and deactivated account exclusion.
7. **`utils.test.ts`** (9 tests):
   - Tests number abbreviation formatting (`fmt`: 1200 -> "1.2k", 4200000 -> "4.2M").
   - Tests tag extraction (`tagsOf`), excerpt clipping, and media query strings.
8. **`api-helper.test.ts`** (8 tests):
   - Verifies `lib/api.ts` fetch wrappers for posts and collections.
   - Validates error catching and fallback to empty array on network failure.
9. **`validation.test.ts`** (12 tests):
   - Validates `V.name`, `V.user`, `V.email`, `V.pw`, `V.dob`.
   - Validates password strength score calculation (0 to 5 scale).

### 2.3 Component Tests (`tests/components/`)
10. **`ImageCard.test.tsx`** (4 tests):
    - Renders pin title and image.
    - REGRESSION: Renders semantic link to post detail page (`/post/:id`).
    - REGRESSION: Renders semantic link to creator profile (`/profile/:id`).
    - Allows saving and unsaving the pin.
11. **`SearchBar.test.tsx`** (3 tests):
    - Renders accessible search input with placeholder `"Search pins, creators, themes"`.
    - Submitting search updates query state.
    - REGRESSION: Submitting search from another route navigates to home feed.
12. **`Dialog.test.tsx`** (4 tests):
    - Renders dialog title and description when open.
    - Calls `onClose` when close button is clicked.
    - Closes on `Escape` key press.
    - Traps focus and locks background scrolling.
13. **`LoginDialog.test.tsx`** (5 tests):
    - Validates required username/email and password fields.
    - Calls `onLogin` callback on valid submission.
    - Submitting forgot password sends instructions and shows confirmation.
    - Navigates to signup on "Create account" click.
14. **`UserCard.test.tsx`** (2 tests):
    - Renders creator avatar, name, and handle.
    - Toggles follow state on button click.
15. **`AddToDialog.tsx`** (3 tests):
    - Correctly normalizes string and numeric IDs when determining pin inclusion in board.
    - Allows creating a new collection inline.
16. **`Tabs.test.tsx`** (1 test):
    - Renders accessible tab list and switches active tab on click.
17. **`Menu.test.tsx`** (4 tests):
    - Opens dropdown on trigger click.
    - Executes menu item callback.
    - Closes on Escape.
    - REGRESSION: Does NOT run continuous `requestAnimationFrame` loop while open.
18. **`Bubble.test.tsx`** (2 tests):
    - Differentiates outgoing vs incoming chat message styling.
    - Renders replied-to quote preview.
19. **`ImageUploader.test.tsx`** (3 tests):
    - Renders dropzone with drag-and-drop support.
    - Enforces 5 MB file size limit.
    - Shows progress bar during upload.

### 2.4 Regression Audit Suite (`tests/regression/`)
20. **`regressions.test.tsx`** (4 tests):
    - REGRESSION: `MsgsSheet` maps conversation 0 to participant Sofia Rinaldi (`u=3`), NOT Mara Okafor.
    - REGRESSION: `HomeView` does not filter pins by Explore tag.
    - REGRESSION: Sidebar and BottomNav navigation items use semantic HTML anchor links (`<a>`).
    - REGRESSION: `CollectionDetailView` renders valid collections by ID and handles invalid IDs.

---

## 3. Playwright End-to-End Suite (`tests/e2e/flows.spec.ts`)
- **Flow 1 — Feed & Post Navigation**: Loads masonry feed, opens post, verifies image and creator attribution, navigates back.
- **Flow 2 — Collection Detail**: Opens board, verifies pins, tests invalid collection URL error handling.
- **Flow 3 — Search Across Routes**: Initiates search from `/settings` and verifies automatic navigation to feed with matching results.
- **Flow 4 — Creator Profile**: Opens creator profile, inspects followers/following tabs.
- **Flow 5 — Authentication & Forgot Password**: Opens login modal, tests validation, verifies forgot password reset flow.
