# Frontend Component Catalog & Architecture

This document catalogs every component in the Phiny frontend, detailing component responsibilities, props interfaces, consumed context values, emitted actions, and subcomponent hierarchies.

---

## 1. Layout & Shell Components (`components/layout/`)

### 1.1 `AppShell.tsx`
- **Location**: `components/layout/AppShell.tsx`
- **Purpose**: Master wrapper around all page content. Provides desktop sidebar, responsive header, mobile bottom navigation, right-side suggested creators panel (for 2XL viewports on feed routes), and global modal/sheet dialog portals.
- **Props**: `{ children: React.ReactNode }`
- **Context Consumed**:
  - `c.route`, `c.rid`: Current route identifier for layout keying.
  - `c.screen`: Checks if signup wizard is active to omit standard header/sidebar.
  - `c.fol`, `c.toggleFol`: Suggested creators follow status.
  - `c.lock`: Inerts `#shell` when modals are active.
- **Portals Rendered**:
  - `EditProfileDialog`, `ReportDialog`, `AddToDialog`, `CollDialog`, `ConfirmDialog`, `LoginDialog`, `AccountSwitcherDialog`, `NotifsSheet`, `MsgsSheet`, `Toaster`.

### 1.2 `Header.tsx`
- **Location**: `components/layout/Header.tsx`
- **Purpose**: Top navigation bar with brand mark, universal search input (`SearchBar`), unread message/notification triggers, and authentication CTA (Sign in button or User Avatar dropdown).
- **Props**: None.
- **Context Consumed**:
  - `c.me`, `c.user`: Authenticated user state.
  - `c.unread`: Count of unread notifications to display badge.
  - `c.convs`: Active conversations to compute unread chat count.
  - `c.openLogin`: Opens login dialog.
  - `c.setSheet`: Toggles `messages` or `notifications` sheet.
  - `c.setAccOpen`: Toggles account switcher.

### 1.3 `Sidebar.tsx`
- **Location**: `components/layout/Sidebar.tsx`
- **Purpose**: Fixed desktop navigation column (hidden on screens `< 768px`). Displays brand logo and semantic navigation links for Home, Explore, Create, Library, Notifications, Messages, Profile, and Settings.
- **Props**: None.
- **Context Consumed**:
  - `c.route`: Highlights active nav item.
  - `c.nav`: Dispatches route transitions or triggers auth gating for protected sheets.
  - `c.unread`: Unread notification badge count.

### 1.4 `BottomNav.tsx`
- **Location**: `components/layout/BottomNav.tsx`
- **Purpose**: Fixed mobile bottom bar (hidden on screens `>= 768px`). Houses 4 key tabs: Home, Explore, Create, and Library with coarse pointer touch targets (minimum 44px).
- **Props**: None.
- **Context Consumed**:
  - `c.route`: Indicates active tab.
  - `c.go`: Dispatches route transition.

---

## 2. Feed & Post Components (`components/feed/`)

### 2.1 `HomeView.tsx`
- **Location**: `components/feed/HomeView.tsx`
- **Purpose**: Renders the main discover feed with tag filter chips, layout grid density toggles, and infinite-scrolling masonry.
- **Props**: None.
- **Context Consumed**:
  - `c.posts`: Array of all active posts.
  - `c.tag`, `c.setTag`: Selected filter topic.
  - `c.q`, `c.setQ`: Search query string.
  - `c.col`, `c.toggleCol`: Single column vs masonry layout toggle.
  - `c.hidden`: Map of hidden post IDs.

### 2.2 `ExploreView.tsx`
- **Location**: `components/feed/ExploreView.tsx`
- **Purpose**: Curated category exploration view with horizontal interest badges, featured topics, and tag-filtered feed.
- **Props**: None.
- **Context Consumed**:
  - `c.posts`, `c.tag`, `c.setTag`, `c.hidden`.

### 2.3 `ImageCard.tsx`
- **Location**: `components/feed/ImageCard.tsx`
- **Purpose**: Renders individual visual pins in the masonry feed with lazy image loading, aspect-ratio container, hover action bar (Save button, Like button, Share menu, More options dropdown), creator attribution link, and detail link.
- **Accessibility**: Semantically wrapped with `<article>` containing `<figure>` and `<figcaption>` to ensure accessibility tree compliance.
- **Props**:
  ```typescript
  interface ImageCardProps {
    pin: Post;
    extra?: MenuItemTuple[];
  }
  ```
- **Context Consumed**:
  - `c.saved`: Checks if pin is bookmarked.
  - `c.liked`: Checks if pin is liked.
  - `c.toggleSave`: Bookmarks or unbookmarks pin.
  - `c.toggleLike`: Likes or unlikes pin.
  - `c.openAdd`: Opens collection picker dialog.
  - `c.hide`: Mutes pin from feed.
  - `c.report`: Opens report dialog.

### 2.4 `Grid.tsx`
- **Location**: `components/feed/Grid.tsx`
- **Purpose**: CSS columns masonry layout wrapper rendering a list of `ImageCard` components.
- **Props**:
  ```typescript
  interface GridProps {
    pins: Post[];
    col?: boolean;
    extra?: MenuItemTuple[];
  }
  ```

### 2.5 `SearchBar.tsx`
- **Location**: `components/feed/SearchBar.tsx`
- **Purpose**: Global search bar featuring debounced input, responsive placeholder truncation, keyboard shortcuts (`/` focus, Escape clear), autocomplete suggestion popover with sections for Creators, Posts, and Tags.
- **Props**:
  ```typescript
  interface SearchBarProps {
    q: string;
    setQ: (v: string) => void;
  }
  ```
- **Placeholder**: `"Search pins, creators, themes"` (truncates dynamically on viewports `< 290px`).
- **Context Consumed**:
  - `c.posts`: Scanned for post suggestions.
  - `c.route`, `c.go`: Navigates back to home feed upon committing a query from other routes.

### 2.6 `PostView.tsx`
- **Location**: `components/feed/PostView.tsx`
- **Purpose**: Full-page single post inspection view with responsive layout (image on left, metadata & comments on right), comment composer, creator attribution card, like/save toggles, and related posts grid.
- **Props**: `{ id: number | string }`
- **Context Consumed**:
  - `c.posts`: Retrieves target post and related posts.
  - `c.me`, `c.gate`: Verifies authentication before adding comment.
  - `c.liked`, `c.toggleLike`, `c.saved`, `c.toggleSave`, `c.openAdd`.

### 2.7 `CreateView.tsx`
- **Location**: `components/feed/CreateView.tsx`
- **Purpose**: Post creation screen featuring drag-and-drop image upload, automatic image aspect-ratio detection, live preview card, tag pills, visibility switch, and collection assignment.
- **Props**: None.
- **Context Consumed**:
  - `c.me`, `c.colls`, `c.publish`, `c.go`, `c.openLogin`.

---

## 3. Collections Components (`components/collections/`)

### 3.1 `LibraryView.tsx`
- **Location**: `components/collections/LibraryView.tsx`
- **Purpose**: User library screen managing tabs for "Saved" posts and user "Collections", collection search, and "New collection" trigger.
- **Props**: None.

### 3.2 `CollectionDetailView.tsx`
- **Location**: `components/collections/CollectionDetailView.tsx`
- **Purpose**: Route view displaying a single collection board, resolving all post IDs to full pin objects, and handling missing or private collection states.
- **Props**: `{ id: string }`

### 3.3 `CollView.tsx`
- **Location**: `components/collections/CollView.tsx`
- **Purpose**: Presentational board container rendering title, privacy badge, pin count, pin removal actions, and board management options (Rename, Delete).
- **Props**:
  ```typescript
  interface CollViewProps {
    coll: Collection;
    mine?: boolean;
    onBack?: () => void;
  }
  ```

### 3.4 `AddToDialog.tsx`
- **Location**: `components/collections/AddToDialog.tsx`
- **Purpose**: Modal picker displaying the user's collections with instant check toggles to add or remove a post from multiple boards, alongside an inline "Create collection" form.
- **Props**: None (Controlled via `c.addTo` in context).

### 3.5 `CollDialog.tsx`
- **Location**: `components/collections/CollDialog.tsx`
- **Purpose**: Modal to create a new collection or rename an existing collection with privacy switch.
- **Props**: None (Controlled via `c.cd` in context).

---

## 4. Profile Components (`components/profile/`)

### 4.1 `ProfileView.tsx`
- **Location**: `components/profile/ProfileView.tsx`
- **Purpose**: User profile header (avatar, name, handle, bio, links, followers/following count), "Edit profile" trigger for owner, "Follow" button for visitors, and tabbed grids for "Created" and "Saved" pins.
- **Props**: `{ id: number | string }`

### 4.2 `PeopleView.tsx`
- **Location**: `components/profile/PeopleView.tsx`
- **Purpose**: List view of followers or following accounts with search filter input and follow action buttons.
- **Props**: `{ type: 'followers' | 'following'; id: number | string }`

### 4.3 `UserCard.tsx`
- **Location**: `components/profile/UserCard.tsx`
- **Purpose**: Compact creator row used in sidebars and follower lists with avatar, display name, handle, role, and follow toggle button.
- **Props**:
  ```typescript
  interface UserCardProps {
    p: Person;
    on?: boolean;
    toggle?: () => void;
  }
  ```

### 4.4 `EditProfileDialog.tsx`
- **Location**: `components/profile/EditProfileDialog.tsx`
- **Purpose**: Modal form allowing users to update their display name, handle, bio, website, location, professional discipline, and avatar photo.
- **Props**: None (Controlled via `c.edit` in context).

---

## 5. Authentication Components (`components/auth/`)

### 5.1 `LoginDialog.tsx`
- **Location**: `components/auth/LoginDialog.tsx`
- **Purpose**: Sign-in modal supporting username/email and password inputs, form validation, "Forgot your password?" recovery flow with email reset trigger, and redirection to the `/signup` wizard.
- **Props**:
  ```typescript
  interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
    onSignup: () => void;
    onLogin: (id: string) => void;
    why?: string;
  }
  ```

### 5.2 `AccountSwitcherDialog.tsx`
- **Location**: `components/auth/AccountSwitcherDialog.tsx`
- **Purpose**: Multi-account manager modal allowing quick profile switching between cached accounts, adding a new account, or logging out.
- **Props**: None (Controlled via `c.accOpen` in context).

### 5.3 `SignupView.tsx`
- **Location**: `components/auth/SignupView.tsx`
- **Purpose**: Full-screen 9-step registration wizard with client validation, password strength scoring, topic onboarding, and suggested follows.
- **Props**:
  ```typescript
  interface SignupProps {
    onExit: () => void;
    onDone: (d: SignupData) => void;
  }
  ```

---

## 6. Messaging & Notifications Components

### 6.1 `MsgsSheet.tsx`
- **Location**: `components/messages/MsgsSheet.tsx`
- **Purpose**: Slide-out left drawer managing conversation threads, unread status dots, message composer, inline replies, conversation muting, and chat history.
- **Props**: None (Controlled via `c.sheet === 'messages'`).

### 6.2 `Bubble.tsx`
- **Location**: `components/messages/Bubble.tsx`
- **Purpose**: Chat message bubble rendering sender avatar, timestamp, reply quote, and message text with differentiated styling for current user vs counterparty.
- **Props**:
  ```typescript
  interface BubbleProps {
    m: ChatMessage;
    p: Person;
    onReply?: (text: string) => void;
  }
  ```

### 6.3 `NotifsSheet.tsx`
- **Location**: `components/notifications/NotifsSheet.tsx`
- **Purpose**: Slide-out notification drawer with grouped notices (likes, saves, comments, follows, mentions), "Mark all read", and "Clear all" actions.
- **Props**: None (Controlled via `c.sheet === 'notifications'`).

---

## 7. Modals & UI Primitives (`components/modals/` & `components/ui/`)

### 7.1 `ConfirmDialog.tsx`
- **Location**: `components/modals/ConfirmDialog.tsx`
- **Purpose**: Destructive and standard action confirmation dialog with customizable title, description, and primary button style (`danger`).

### 7.2 `ReportDialog.tsx`
- **Location**: `components/modals/ReportDialog.tsx`
- **Purpose**: Content reporting modal with reason checkboxes (spam, copyright, inappropriate content) and submission toast.

### 7.3 `ImageUploader.tsx`
- **Location**: `components/ui/ImageUploader.tsx`
- **Purpose**: File ingestion component supporting drag-and-drop, drag-over highlight, file size limit (5MB), MIME verification (`image/*`), upload progress indicator, and image preview replacement.
