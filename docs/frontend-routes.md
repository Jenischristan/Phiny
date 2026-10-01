# Complete Frontend Route Documentation

This document specifies every route in the Phiny Next.js App Router application.

---

## Route 1: Home Feed (`/`)

- **Route**: `/`
- **Component File**: `app/page.tsx` rendering `components/feed/HomeView.tsx`
- **Purpose**: Main discovery feed showcasing pins in a responsive multi-column masonry layout with tag filters and search integration.
- **Authentication Required**: No (Publicly accessible to anonymous visitors).
- **Public / Private**: Public.
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - Search bar input in Header (`q`).
  - Active tag filter buttons (`tag`: "All", "Architecture", "Design", etc.).
  - Layout toggle (`col`: 1 column compact vs standard masonry).
- **Backend Data Required**:
  - List of active public posts with author details, tags, aspect ratios, and like counts.
  - Suggested creators list for wide screens (top 4 active users).
- **API Calls**:
  - Initial / Refresh: `GET /api/posts`
  - When searching: `GET /api/posts?q={term}`
  - When filtering by tag: Filtered in memory or `GET /api/posts?tag={tag}`
- **Loading State**: Masonry skeleton cards with placeholder aspect ratios and grain background.
- **Empty State**: Renders `Empty` component: `NO POSTS FOUND. Clear filters or search for something else.`
- **Error State**: Displays cached client pins or console warning on network failure.
- **Navigation Behavior**: Clicking any card navigates to `/post/[id]`. Clicking author link navigates to `/profile/[id]`.
- **SEO Metadata**:
  - Title: `Home | Phiny`
  - Description: `Discover curated visual research, architecture, typography, and brutalist design.`

---

## Route 2: Explore Discovery (`/explore`)

- **Route**: `/explore`
- **Component File**: `app/explore/page.tsx` rendering `components/feed/ExploreView.tsx`
- **Purpose**: Curated category exploration allowing users to browse visual culture by theme, curated topics, and suggested creators.
- **Authentication Required**: No.
- **Public / Private**: Public.
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - Horizontal topic carousel selection (`Art`, `Graphic Design`, `Architecture`, `Typography`, `Industrial`, `Photography`, `Editorial`, `Monochrome`, `Spatial`).
- **Backend Data Required**:
  - Posts categorized under the selected interest or tag.
  - Featured creator list matching topic affinity.
- **API Calls**:
  - `GET /api/posts?tag={selectedTag}`
- **Loading State**: Content fade-in transition (`opacity-0` to `opacity-100`).
- **Empty State**: `NO POSTS IN THIS CATEGORY. Try exploring other topics.`
- **Error State**: Graceful fallback to client post cache.
- **Navigation Behavior**: Selecting a topic updates the active feed. Clicking posts navigates to `/post/[id]`.
- **SEO Metadata**:
  - Title: `Explore | Phiny`
  - Description: `Explore visual themes, curated design collections, and emerging creators.`

---

## Route 3: Create Post (`/create`)

- **Route**: `/create`
- **Component File**: `app/create/page.tsx` rendering `components/feed/CreateView.tsx`
- **Purpose**: Creator publishing interface to upload images, compute aspect ratios, enter title, assign tags, set visibility, and publish directly to the feed or a collection.
- **Authentication Required**: Yes.
- **Public / Private**: Private (Authenticated users only).
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - `img` (File / Data URL, required)
  - `title` (String, 3–80 characters, required)
  - `tags` (Array of strings, 2–24 characters each, up to 8 tags)
  - `vis` ("public" | "private", default "public")
  - `cm` (Allow comments: boolean, default true)
  - `hl` (Hide like count: boolean, default false)
  - `loc` (Location string, optional)
  - `alt` (Accessibility description, optional)
  - `coll` (Collection ID to add to upon publishing, optional)
- **Backend Data Required**:
  - Current user profile (`me`).
  - Current user collections list (for destination dropdown).
- **API Calls**:
  - `POST /api/posts` with `{ title, tag, tags, src, alt, ratio, vis, comments, hideLikes, loc, coll }`
- **Loading State**: Publish button shows `Publishing...` with disabled state and loading spinner.
- **Empty State**: If user is unauthenticated, displays `SIGNED OUT. Log in to create posts.` with CTA triggering `LoginDialog`.
- **Error State**: Inline validation alerts highlighting missing image or invalid title length.
- **Navigation Behavior**: Upon successful creation, redirects to `/post/[newPostId]` and fires toast `Published.`.
- **SEO Metadata**:
  - Title: `Create | Phiny`
  - Description: `Publish new visual research, architecture, or design studies to Phiny.`

---

## Route 4: User Library (`/library`)

- **Route**: `/library`
- **Component File**: `app/library/page.tsx` rendering `components/collections/LibraryView.tsx`
- **Purpose**: Personal repository where users access saved pins, custom collections, and curated boards.
- **Authentication Required**: No (Displays public / local saved items, but full collection sync requires auth).
- **Public / Private**: Semi-private / User-specific.
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - Tab selector: `Saved` vs `Collections`.
  - Search input for filtering collections.
  - "New Collection" button opening `CollDialog`.
- **Backend Data Required**:
  - Saved posts for current user.
  - User's owned collections (`GET /api/collections`).
- **API Calls**:
  - `GET /api/collections`
- **Loading State**: Skeleton grid matching collection card dimensions.
- **Empty State**:
  - Saved tab empty: `NO SAVED PINS. Click Save on any post to bookmark it.`
  - Collections tab empty: `NO COLLECTIONS. Create your first collection to organize pins.`
- **Error State**: Toast error on collection deletion failure.
- **Navigation Behavior**: Clicking a collection card navigates to `/collection/[id]`. Clicking a saved pin navigates to `/post/[id]`.
- **SEO Metadata**:
  - Title: `Library | Phiny`
  - Description: `Your saved pins, curated boards, and personal collections on Phiny.`

---

## Route 5: Settings (`/settings`)

- **Route**: `/settings`
- **Component File**: `app/settings/page.tsx` rendering `components/settings/SettingsView.tsx`
- **Purpose**: Account management, security/password updates, appearance themes (light/dark/system), and notification preferences.
- **Authentication Required**: Partial (Display & appearance settings work offline; profile & security require auth).
- **Public / Private**: User-specific.
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - Section tabs: `Account`, `Appearance`, `Privacy & Safety`, `Notifications`, `Security`.
  - Account fields: Display name, handle, email, website, bio, profile photo.
  - Appearance: Theme toggle (`light` / `dark` / `system`).
  - Security fields: Current password, new password, confirm password.
- **Backend Data Required**:
  - Current user account record (`User`).
  - Current user preferences (`Preferences`).
- **API Calls**:
  - `PATCH /api/users/me`
  - `POST /api/auth/change-password` (Production)
- **Loading State**: Subtle button spinner on save.
- **Empty State**: If signed out and attempting to access Account tab: `SIGNED OUT. Log in to manage account settings.`
- **Error State**: Field-level validation text under inputs.
- **Navigation Behavior**: In-page section switching.
- **SEO Metadata**:
  - Title: `Settings | Phiny`
  - Description: `Manage your Phiny profile, preferences, appearance, and account settings.`

---

## Route 6: Sign Up Onboarding (`/signup`)

- **Route**: `/signup`
- **Component File**: `app/signup/page.tsx` rendering `components/auth/SignupView.tsx`
- **Purpose**: 9-step guided registration wizard with validation, username availability checks, password strength meter, interest selection, and recommended follows.
- **Authentication Required**: No.
- **Public / Private**: Public.
- **URL Parameters**: None.
- **Query Parameters**: None.
- **Page Inputs**:
  - Step 1: Full Name
  - Step 2: Username (3–20 chars, regex `^[a-z0-9_.]+$`i)
  - Step 3: Email address
  - Step 4: Password & Confirm Password (min 8 chars, letter + number)
  - Step 5: Date of Birth (must be >= 13 years old)
  - Step 6: Visibility (`public` vs `private`)
  - Step 7: Profile Photo upload
  - Step 8: Topics of interest (selection from 18 topics)
  - Step 9: Follow suggestions (creator toggle list)
- **Backend Data Required**:
  - Username availability endpoint (`GET /api/users/check-handle?handle={handle}`).
  - List of initial suggested creators to follow.
- **API Calls**:
  - `POST /api/auth/register` (Production)
- **Loading State**: Step progression bar (`SignupProgress`) with animated fill.
- **Empty State**: N/A.
- **Error State**: Step blocked until validation error resolves.
- **Navigation Behavior**: Completing step 9 creates the account, logs the user in, sets active user context, and redirects to `/` with toast `Welcome to Phiny, {name}.`. Clicking "Exit" returns to `/`.
- **SEO Metadata**:
  - Title: `Sign Up | Phiny`
  - Description: `Create a Phiny account to curate, publish, and explore visual research.`

---

## Route 7: Post Detail (`/post/[id]`)

- **Route**: `/post/[id]`
- **Component File**: `app/post/[id]/page.tsx` rendering `components/feed/PostView.tsx`
- **Purpose**: Full-screen view of a specific post, creator profile card, comments thread, save/like actions, and related recommendations.
- **Authentication Required**: No (Viewing is public; liking, saving, commenting prompts login if unauthenticated).
- **Public / Private**: Public (unless post visibility is `private`).
- **URL Parameters**:
  - `id`: Unique identifier of the post (e.g. `0`, `42`, `p_1720000000`).
- **Query Parameters**: None.
- **Page Inputs**:
  - Comment text input form.
  - Save button, Like button, Share dropdown menu, More Actions menu (`Add to collection`, `Report`, `Hide`).
- **Backend Data Required**:
  - Full post entity with creator details (`GET /api/posts/[id]`).
  - Comments list for the post (`CommentTuple[]`).
  - Related posts list (up to 8 posts sharing tags).
- **API Calls**:
  - `GET /api/posts/[id]`
  - `POST /api/posts/[id]/comments` (Production)
  - `DELETE /api/posts/[id]` (if owner)
- **Loading State**: Skeleton image frame with centered loader.
- **Empty / Error State**: If post is not found or invalid: `POST UNAVAILABLE. It may have been removed.` with Back button.
- **Navigation Behavior**: "Back" button returns to previous route in history or falls back to `/`. Clicking author navigates to `/profile/[creatorId]`.
- **SEO Metadata**:
  - Dynamic Title: `{post.title} | Phiny`
  - Dynamic Description: `{post.title} by {creator.name} on Phiny.`

---

## Route 8: Creator Profile (`/profile/[id]` & `/profile`)

- **Route**: `/profile/[id]` and `/profile` (alias for authenticated user's own profile)
- **Component File**: `app/profile/[id]/page.tsx` and `app/profile/page.tsx` rendering `components/profile/ProfileView.tsx`
- **Purpose**: Creator portfolio displaying bio, stats (followers, following, posts count), website, location, tabs for `Created` pins vs `Saved` pins, and user collections.
- **Authentication Required**:
  - `/profile` (me): Yes (redirects or renders sign-in prompt if unauthenticated).
  - `/profile/[id]`: No (Publicly viewable unless user account is marked `private`).
- **URL Parameters**:
  - `id`: Numeric ID or string identifier (e.g. `0`, `3`, `me`).
- **Query Parameters**: None.
- **Page Inputs**:
  - Tabs: `Created` vs `Saved`.
  - Follow / Unfollow button.
  - Share profile menu.
  - If viewing own profile: "Edit Profile" button opening `EditProfileDialog`.
- **Backend Data Required**:
  - User profile object (`Person`).
  - Posts created by this user (`GET /api/posts?userId={id}`).
  - Public collections owned by this user.
  - Follower / following counts.
- **API Calls**:
  - `GET /api/users/[id]` (Production)
  - `GET /api/posts?userId=[id]`
- **Loading State**: Profile header placeholder with avatar pulse.
- **Empty State**:
  - If account deactivated: `UNAVAILABLE. This profile is currently unavailable.`
  - If private account not followed: `ACCOUNT PRIVATE. Follow this account to see their posts and collections.`
- **Navigation Behavior**: Clicking follower stat navigates to `/profile/[id]/followers`. Clicking following stat navigates to `/profile/[id]/following`.
- **SEO Metadata**:
  - Dynamic Title: `{creator.name} (@{creator.handle}) | Phiny`
  - Dynamic Description: `{creator.bio}`

---

## Route 9: Followers & Following Lists (`/profile/[id]/followers` & `/profile/[id]/following`)

- **Route**:
  - `/profile/[id]/followers`
  - `/profile/[id]/following`
- **Component Files**:
  - `app/profile/[id]/followers/page.tsx`
  - `app/profile/[id]/following/page.tsx`
  both rendering `components/profile/PeopleView.tsx`
- **Purpose**: Searchable user lists displaying accounts following or followed by a creator, with follow/unfollow toggles.
- **Authentication Required**: No (Viewing is public).
- **URL Parameters**:
  - `id`: Target user identifier.
- **Query Parameters**: None.
- **Page Inputs**:
  - Search filter input to filter user list by name or handle.
  - Follow/unfollow buttons per user card.
- **Backend Data Required**:
  - Target creator profile header data.
  - Array of user summaries (`Person[]`).
- **API Calls**:
  - `GET /api/users/[id]/followers` (Production)
  - `GET /api/users/[id]/following` (Production)
- **Loading State**: User list skeleton rows.
- **Empty State**:
  - When no followers exist: `NO ACCOUNTS YET.`
  - When search yields no results: `NO MATCHING ACCOUNTS.`
- **Navigation Behavior**: Back button returns to `/profile/[id]`. Clicking any avatar navigates to their profile.
- **SEO Metadata**:
  - Dynamic Title: `Followers of {creator.name} | Phiny` / `Following by {creator.name} | Phiny`

---

## Route 10: Collection Detail (`/collection/[id]`)

- **Route**: `/collection/[id]`
- **Component File**: `app/collection/[id]/page.tsx` rendering `components/collections/CollectionDetailView.tsx`
- **Purpose**: Curated board view showcasing collection title, privacy status, pin count, full masonry grid of pins, and owner actions (edit name, toggle privacy, delete collection).
- **Authentication Required**: No for public collections; Yes for private collections.
- **URL Parameters**:
  - `id`: Collection identifier (e.g. `c0`, `c1`, `c_1720000000`).
- **Query Parameters**: None.
- **Page Inputs**:
  - "Edit collection" button (if owner).
  - "Share collection" menu.
  - Remove pin actions.
- **Backend Data Required**:
  - Collection entity (`Collection`).
  - Resolved post objects for all post IDs in `collection.pins`.
- **API Calls**:
  - `GET /api/collections/[id]`
  - `PATCH /api/collections/[id]` (Rename / Privacy)
  - `DELETE /api/collections/[id]` (Delete)
- **Loading State**: Board title and masonry placeholder.
- **Empty State**:
  - If collection is empty: `NO PINS IN THIS COLLECTION. Save pins here to organize your visual research.`
  - If collection does not exist or is private: `COLLECTION UNAVAILABLE. This collection may have been removed or is private.` with CTA `Back to Library`.
- **Navigation Behavior**: "Back" button returns to `/library`.
- **SEO Metadata**:
  - Dynamic Title: `{collection.name} | Collection | Phiny`

---

## Route 11: Not Found 404 (`/not-found`)

- **Route**: Any unmatched path
- **Component File**: `app/not-found.tsx`
- **Purpose**: Accessible error boundary for nonexistent routes.
- **Authentication Required**: No.
- **Navigation Behavior**: Provides button `Return to Home Feed` redirecting to `/`.
- **SEO Metadata**:
  - Title: `404 - Page Not Found | Phiny`
