# Entity Contracts & JSON Serialization Schemas

This document defines the strict field-by-field schema, constraints, data types, and nullability requirements for all domain entities.

---

## 1. `User` Entity (Frontend: `Person`)

Represents an individual creator or authenticated account.

| Field | JSON Type | Database Type | Required | Nullable | Default | Constraints & Rules |
|---|---|---|---|---|---|---|
| `id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | Generated | Primary Key. Exposed as string or number. |
| `name` | `string` | `VARCHAR(100)` | Yes | No | None | Display name. Min 1, Max 100 characters. |
| `handle` | `string` | `VARCHAR(20)` | Yes | No | None | Unique username. Lowercase alphanumeric + `.` and `_`. Regex: `^[a-z0-9_.]+$`. Length 3–20. |
| `email` | `string` | `VARCHAR(255)` | Yes | No | None | Unique email. Lowercase. Valid email regex. |
| `password_hash` | `string` | `VARCHAR(255)` | Yes (Backend) | No | None | Never exposed to client. Argon2id or bcrypt hash. |
| `role` | `string` | `VARCHAR(100)` | No | Yes | `"Creator"` | Professional role (e.g. "Architectural photographer"). |
| `bio` | `string` | `TEXT` | No | Yes | `""` | Creator bio. Max 500 characters. |
| `loc` | `string` | `VARCHAR(100)` | No | Yes | `null` | Geographical location (e.g. "Lagos & Zurich"). |
| `web` | `string` | `VARCHAR(255)` | No | Yes | `null` | External portfolio link. Valid HTTP/HTTPS URL. |
| `photo` | `string` | `TEXT` | No | Yes | `null` | Avatar image URL. |
| `pro` | `string` | `VARCHAR(100)` | No | Yes | `null` | Discipline category. |
| `dis` | `string` | `VARCHAR(100)` | No | Yes | `null` | Sub-discipline. |
| `state` | `string` | `VARCHAR(20)` | Yes | No | `"active"` | Enum: `'active'`, `'private'`, `'deactivated'`. |
| `vis` | `string` | `VARCHAR(10)` | Yes | No | `"public"` | Enum: `'public'`, `'private'`. |
| `fers` | `number` | `INTEGER` | Yes | No | `0` | Computed or cached follower count (`>= 0`). |
| `fing` | `number` | `INTEGER` | Yes | No | `0` | Computed or cached following count (`>= 0`). |
| `created_at` | `string` | `TIMESTAMPTZ` | Yes | No | `NOW()` | ISO 8601 timestamp. |
| `updated_at` | `string` | `TIMESTAMPTZ` | Yes | No | `NOW()` | ISO 8601 timestamp. |

---

## 2. `Post` Entity (Frontend: `Post`)

Represents a visual publication.

| Field | JSON Type | Database Type | Required | Nullable | Default | Constraints & Rules |
|---|---|---|---|---|---|---|
| `id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | Generated | Primary Key. |
| `author_id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | None | Foreign Key -> `users(id)` ON DELETE CASCADE. |
| `by` | `object` (`Person`) | N/A (Joined) | Yes (JSON) | No | None | Serialized author summary embedded in post payload. |
| `title` | `string` | `VARCHAR(80)` | Yes | No | None | Post title. 3–80 characters. |
| `tag` | `string` | `VARCHAR(50)` | Yes | No | `"Art"` | Primary category interest tag. |
| `tags` | `string[]` | `TEXT[]` / Join | No | Yes | `[]` | Up to 8 tags. Lowercase alphanumeric + `_`. |
| `ratio` | `number` | `NUMERIC(4,3)` | Yes | No | `1.000` | Height-to-width ratio. Min `0.5`, Max `2.0`. |
| `seed` | `number` | `INTEGER` | Yes | No | `1` | Seed for procedural SVG generator fallback. |
| `src` | `string` | `TEXT` | No | Yes | `null` | Image CDN URL or data URL. |
| `alt` | `string` | `VARCHAR(255)` | No | Yes | `null` | Accessibility alternative description. |
| `desc` | `string` | `TEXT` | No | Yes | `null` | Extended editorial notes. Max 1000 chars. |
| `loc` | `string` | `VARCHAR(100)` | No | Yes | `null` | Location tag. Max 100 chars. |
| `likes` | `number` | `INTEGER` | Yes | No | `0` | Like counter (`>= 0`). |
| `vis` | `string` | `VARCHAR(10)` | Yes | No | `"public"` | Enum: `'public'`, `'private'`. |
| `comments` | `boolean` | `BOOLEAN` | Yes | No | `true` | Allows comments on post if true. |
| `hideLikes`| `boolean` | `BOOLEAN` | Yes | No | `false` | Suppresses public display of like count if true. |
| `date` | `string` | N/A (Derived) | Yes (JSON) | No | None | Display timestamp (e.g. "2d ago", "Just now"). |
| `created_at`| `string` | `TIMESTAMPTZ` | Yes | No | `NOW()` | ISO 8601 creation timestamp. |

---

## 3. `Collection` Entity (Frontend: `Collection`)

Represents a curated board owned by a user.

| Field | JSON Type | Database Type | Required | Nullable | Default | Constraints & Rules |
|---|---|---|---|---|---|---|
| `id` | `string` | `UUID` / `VARCHAR` | Yes | No | Generated | Primary Key. Prefix `c_` or UUID. |
| `owner_id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | None | Foreign Key -> `users(id)` ON DELETE CASCADE. |
| `name` | `string` | `VARCHAR(100)` | Yes | No | None | Board name. 2–100 characters. |
| `priv` | `boolean` | `BOOLEAN` | Yes | No | `false` | If true, visible only to owner. |
| `pins` | `(string \| number)[]`| Join array | Yes (JSON) | No | `[]` | Ordered array of post IDs saved in board. |
| `created_at`| `string` | `TIMESTAMPTZ` | Yes | No | `NOW()` | ISO 8601 creation timestamp. |

---

## 4. `CollectionPost` (Join Entity)

| Field | Database Type | Required | Default | Constraints & Rules |
|---|---|---|---|---|
| `collection_id` | `UUID` / `VARCHAR` | Yes | None | FK -> `collections(id)` ON DELETE CASCADE. |
| `post_id` | `UUID` / `BIGINT` | Yes | None | FK -> `posts(id)` ON DELETE CASCADE. |
| `position` | `INTEGER` | Yes | `0` | Order index within board. |
| `created_at` | `TIMESTAMPTZ` | Yes | `NOW()` | Addition timestamp. |
| **PRIMARY KEY** | `(collection_id, post_id)` | Yes | None | Prevents duplicate pin additions to same board. |

---

## 5. `Comment` Entity (Frontend: `CommentTuple`)

| Field | JSON Type | Database Type | Required | Nullable | Default | Description |
|---|---|---|---|---|---|---|
| `id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | Generated | Primary Key. |
| `post_id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | None | FK -> `posts(id)` ON DELETE CASCADE. |
| `user_id` | `string` / `number` | `UUID` / `BIGINT` | Yes | No | None | FK -> `users(id)` ON DELETE CASCADE. |
| `text` | `string` | `TEXT` | Yes | No | None | Comment text. 1–500 characters. |
| `created_at` | `string` | `TIMESTAMPTZ` | Yes | No | `NOW()` | ISO timestamp (rendered as "2h", "1d"). |

---

## 6. `Conversation` & `ChatMessage` Entities

### `Conversation`
| Field | Database Type | Constraints & Rules |
|---|---|---|
| `id` | `UUID` / `BIGINT` | Primary Key. |
| `created_at` | `TIMESTAMPTZ` | `NOW()`. |
| `updated_at` | `TIMESTAMPTZ` | Timestamp of last message sent in thread. |

### `ConversationParticipant`
| Field | Database Type | Constraints & Rules |
|---|---|---|
| `conversation_id` | `UUID` / `BIGINT` | FK -> `conversations(id)` ON DELETE CASCADE. |
| `user_id` | `UUID` / `BIGINT` | FK -> `users(id)` ON DELETE CASCADE. |
| `unread` | `BOOLEAN` | Default `false`. True if new message unread by user. |
| `mute` | `BOOLEAN` | Default `false`. True if user muted thread notifications. |
| **PRIMARY KEY** | `(conversation_id, user_id)` | Unique participant per thread. |

### `ChatMessage`
| Field | JSON Type | Database Type | Description |
|---|---|---|---|
| `id` | `number` / `string` | `UUID` / `BIGINT` | Primary Key. |
| `conversation_id`| `string` | `UUID` / `BIGINT` | FK -> `conversations(id)` ON DELETE CASCADE. |
| `sender_id` | `string` / `number` | `UUID` / `BIGINT` | FK -> `users(id)` ON DELETE CASCADE. |
| `text` | `string` | `TEXT` | Message text content (1–2000 characters). |
| `reply_to` | `string` | `TEXT` | Quoted snippet of replied message. |
| `created_at` | `string` | `TIMESTAMPTZ` | Message dispatch timestamp. |

---

## 7. `Notification` Entity (Frontend: `NotificationItem`)

| Field | JSON Type | Database Type | Description |
|---|---|---|---|
| `id` | `number` / `string` | `UUID` / `BIGINT` | Primary Key. |
| `recipient_id`| `string` / `number` | `UUID` / `BIGINT` | FK -> `users(id)` (User receiving the notification). |
| `actor_id` | `string` / `number` | `UUID` / `BIGINT` | FK -> `users(id)` (User who performed the action). |
| `post_id` | `string` / `number` | `UUID` / `BIGINT` | Optional FK -> `posts(id)`. Null for follow events. |
| `type` | `string` | `VARCHAR(30)` | Enum: `'like'`, `'save'`, `'comment'`, `'follow'`, `'mention'`, `'invite'`. |
| `text` | `string` | `TEXT` | Notification text (e.g. "started following you"). |
| `unread` | `boolean` | `BOOLEAN` | Default `true`. `0` / `false` when read. |
| `created_at` | `string` | `TIMESTAMPTZ` | Timestamp. |
