# Frontend Data Model & Mock Data Mapping

This document provides a complete audit of all TypeScript interfaces in `types/index.ts`, analyzes the mock seed data in `data/mockData.ts`, and maps every frontend data structure to its corresponding production database entity.

---

## 1. Frontend TypeScript Definitions (`types/index.ts`)

### 1.1 `Person` (User / Creator)
```typescript
export type AccountState = 'active' | 'private' | 'deactivated';

export interface Person {
  id: number | 'me';
  name: string;
  handle: string;
  role?: string;
  bio?: string;
  fers: number;       // Follower count
  fing?: number;      // Following count
  loc?: string;       // Location string (e.g. "Lagos & Zurich")
  web?: string;       // Website URL
  state: AccountState;// 'active' | 'private' | 'deactivated'
  vis?: 'public' | 'private';
  photo?: string;     // Avatar URL or Base64 data string
  pro?: string;       // Professional title
  email?: string;
  dis?: string;       // Primary discipline / focus area
}
```

### 1.2 `Post` (Visual Publication / Pin)
```typescript
export interface Post {
  id: number | string;  // Server ID (number in mock data, string in newly created posts)
  title: string;
  by: Person;           // Author summary
  tag: string;          // Primary category tag (e.g. "Architecture")
  tags?: string[];      // Array of supplementary tags
  seed: number;         // Integer seed for procedural SVG artwork fallback
  ratio: number;        // Height-to-width ratio (e.g. 1.25, 0.75) for CSS masonry
  date: string;         // Relative display timestamp (e.g. "2d ago", "Just now")
  likes: number;        // Like counter
  vis: 'public' | 'private';
  comments: boolean;    // Flag indicating if comments are permitted
  hideLikes?: boolean;  // Flag indicating if public like counts are suppressed
  src?: string;         // Image URL or Base64 data URL
  alt?: string;         // Accessibility image description
  desc?: string;        // Extended editorial description
  loc?: string;         // Physical location tag (e.g. "Berlin, Germany")
}
```

### 1.3 `Collection` (Curated Board)
```typescript
export interface Collection {
  id: string;                    // Unique identifier (e.g. "c0", "c_1720000000")
  name: string;                  // Board title (min 2 chars)
  priv: boolean;                 // Privacy flag (true = private to owner)
  pins: (number | string)[];     // Ordered array of Post IDs contained in this collection
}
```

### 1.4 `ChatMessage` & `Conversation` (Direct Messaging)
```typescript
export interface ChatMessage {
  id: number;
  me: number | boolean;          // 1/true if sent by authenticated user, 0/false if received
  t: string;                     // Message text content
  w: string;                     // Display timestamp (e.g. "Mon", "12m", "Now")
  rp?: string | null;            // Replied-to message text preview (if reply)
}

export interface Conversation {
  id: number;                    // Unique thread identifier
  u: number;                     // Counterparty user ID (Person.id)
  unread?: number | boolean;     // Unread indicator flag
  mute: number | boolean;        // Mute conversation notifications flag
  m: ChatMessage[];              // Messages array in chronological order
}
```

### 1.5 `NotificationItem` (Alerts & Activity)
```typescript
export interface NotificationItem {
  id: number;                    // Unique notice ID
  p: number;                     // Actor Person ID (who triggered the notice)
  t: string;                     // Action description (e.g. "liked your post “Concrete Light”")
  w: string;                     // Display timestamp (e.g. "2m", "1h", "1d")
  pin: number | null;            // Associated Post ID (null if follow event)
  u: number;                     // Unread indicator (1 = unread, 0 = read)
}
```

### 1.6 `CommentTuple` (Comments)
```typescript
export type CommentTuple = [
  number,                        // User index/ID (or -1 for current user)
  string,                        // Comment text
  string                         // Timestamp string (e.g. "2h", "1d")
];
```

### 1.7 `Preferences` (User Settings)
```typescript
export interface Preferences {
  follow: string;                // "Everyone" | "People you follow" | "No one"
  msg: string;                   // "Everyone" | "People you follow" | "No one"
  cmt: string;                   // "Everyone" | "People you follow" | "No one"
  men: string;                   // "Everyone" | "People you follow" | "No one"
  saved: boolean;                // Include saved pins in recommendations
  likes: number;                 // Push notification toggle (1 or 0)
  comments: number;              // Push notification toggle
  follows: number;               // Push notification toggle
  mentions: number;              // Push notification toggle
  messages: number;              // Push notification toggle
  recs: number;                  // Push notification toggle
  tfa: number;                   // Two-factor authentication enabled (1 or 0)
}
```

---

## 2. Seed Mock Data Inventory (`data/mockData.ts`)

| Mock Dataset | Count | Description |
|---|---|---|
| `PEOPLE` | 8 | Predefined creator profiles (IDs 0–7) covering Lagos, Tokyo, Moscow, Milan, Mexico City, Seoul, London, and Beirut. |
| `TITLES` | 48 | Curated brutalist, architectural, and photographic post titles. |
| `INTERESTS` | 18 | Categorical design tags: Architecture, Editorial, Photography, Typography, Industrial, Spatial, Monochrome, Brutalism, Concrete, etc. |
| `RATIOS` | 12 | Deterministic aspect ratio pool: `[1.25, 0.6, 1.9, 1, 1.4, 0.75, 1.15, 1.6, 0.56, 1, 1.5, 0.85]`. |
| `PINS` | 48 | Generated posts combining titles, creators, tags, and aspect ratios. |
| `COLLS0` | 4 | Initial collections: `Brutalist Moods` (`c0`), `Type Specimens` (`c1`), `Warm Palettes` (`c2`), `Night Walks` (`c3`, private). |
| `MSGS` / `CONV0` | 4 | Direct messaging threads with Sofia Rinaldi (u=3), Mara Okafor (u=0), Kenji Sato (u=1), and Devon Price (u=6). |
| `NOTES2` | 7 | Notifications representing follows, likes, comments, mentions, saves, and collection collaboration invites. |

---

## 3. Mock Data to Production Database Entity Mapping

| Frontend Mock Element | Production Database Entity | Primary Key | Foreign Keys | Key Transformations |
|---|---|---|---|---|
| `PEOPLE[i]` | `users` table | `id` (UUID / bigint) | None | Add `password_hash`, `created_at`, `updated_at`. Normalize `fers` and `fing` as computed counts or counter columns. |
| `PINS[i]` | `posts` table | `id` (UUID / string) | `author_id` -> `users.id` | Store `by` as `author_id` relation. Store `ratio` as `numeric(4,3)`. Store tags in `post_tags` join table. |
| `COLLS0[i]` | `collections` table | `id` (UUID / string) | `owner_id` -> `users.id` | Convert `pins` array into relational join table `collection_posts`. |
| `COLLS0[i].pins` | `collection_posts` table | `(collection_id, post_id)` | `collection_id` -> `collections.id`, `post_id` -> `posts.id` | Add `position` integer column for board ordering. |
| `c.saved[post.id]` | `user_saved_posts` table | `(user_id, post_id)` | `user_id` -> `users.id`, `post_id` -> `posts.id` | Timestamped bookmark table (`saved_at`). |
| `c.liked[post.id]` | `post_likes` table | `(user_id, post_id)` | `user_id` -> `users.id`, `post_id` -> `posts.id` | Timestamped like table (`created_at`). |
| `c.fol[user.id]` | `user_followers` table | `(follower_id, following_id)` | Both -> `users.id` | Timestamped follow table. |
| `COMMENTS` | `comments` table | `id` (UUID) | `post_id` -> `posts.id`, `user_id` -> `users.id` | Replace tuple `[userId, text, time]` with structured relational table. |
| `CONV0` | `conversations` table | `id` (UUID) | None | Has join table `conversation_participants` mapping users. |
| `CONV0[i].m` | `chat_messages` table | `id` (UUID) | `conversation_id`, `sender_id` | Store message content, created timestamp, reply reference. |
| `NOTES2` | `notifications` table | `id` (UUID) | `recipient_id`, `actor_id`, `post_id` | Replace raw string concatenation with structured event types (`like`, `save`, `comment`, `follow`, `mention`). |
| `PF0` | `user_preferences` table | `user_id` | `user_id` -> `users.id` | Stores JSON or individual columns for privacy, notification, and theme settings. |
