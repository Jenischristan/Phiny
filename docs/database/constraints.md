# Database Constraints & Data Integrity Rules

This document specifies the database-level constraints, check rules, uniqueness guards, and data validation invariants enforced by the relational schema.

---

## 1. Uniqueness Constraints

| Constraint Name | Target Table | Columns | Purpose |
|---|---|---|---|
| `users_handle_unique` | `users` | `LOWER(handle)` | Prevents duplicate usernames regardless of casing. |
| `users_email_unique` | `users` | `LOWER(email)` | Prevents duplicate email account registrations. |
| `sessions_token_hash_unique` | `sessions` | `token_hash` | Ensures session collision impossibility. |
| `pk_collection_posts` | `collection_posts` | `(collection_id, post_id)` | Prevents adding the same post multiple times to a collection. |
| `pk_post_likes` | `post_likes` | `(user_id, post_id)` | Prevents double-liking a post. |
| `pk_user_saved_posts` | `user_saved_posts` | `(user_id, post_id)` | Prevents duplicate bookmarking of a post in user library. |
| `pk_user_followers` | `user_followers` | `(follower_id, following_id)` | Prevents duplicate follow relationships. |
| `pk_conv_participants` | `conversation_participants`| `(conversation_id, user_id)`| Ensures each user is registered only once per conversation. |

---

## 2. Check Constraints (`CHECK`)

```sql
-- 1. Prevent self-following
ALTER TABLE user_followers 
ADD CONSTRAINT chk_prevent_self_follow 
CHECK (follower_id <> following_id);

-- 2. Post aspect ratio bounds (matches ImageCard masonry constraints)
ALTER TABLE posts 
ADD CONSTRAINT chk_posts_ratio_bounds 
CHECK (ratio >= 0.500 AND ratio <= 2.000);

-- 3. Non-negative counters
ALTER TABLE posts 
ADD CONSTRAINT chk_posts_likes_non_negative 
CHECK (likes_count >= 0);

ALTER TABLE users 
ADD CONSTRAINT chk_users_followers_non_negative 
CHECK (followers_count >= 0);

ALTER TABLE users 
ADD CONSTRAINT chk_users_following_non_negative 
CHECK (following_count >= 0);

-- 4. Minimum age constraint (must be >= 13 years old at signup)
ALTER TABLE users 
ADD CONSTRAINT chk_users_minimum_age 
CHECK (dob <= CURRENT_DATE - INTERVAL '13 years');

-- 5. Text length and trim guards
ALTER TABLE posts 
ADD CONSTRAINT chk_posts_title_length 
CHECK (LENGTH(TRIM(title)) >= 3 AND LENGTH(title) <= 80);

ALTER TABLE collections 
ADD CONSTRAINT chk_collections_name_length 
CHECK (LENGTH(TRIM(name)) >= 2 AND LENGTH(name) <= 100);

ALTER TABLE comments 
ADD CONSTRAINT chk_comments_text_length 
CHECK (LENGTH(TRIM(text)) >= 1 AND LENGTH(text) <= 500);

ALTER TABLE chat_messages 
ADD CONSTRAINT chk_chat_messages_text_length 
CHECK (LENGTH(TRIM(text)) >= 1 AND LENGTH(text) <= 2000);

-- 6. Valid enum states
ALTER TABLE users 
ADD CONSTRAINT chk_users_state_enum 
CHECK (state IN ('active', 'private', 'deactivated'));

ALTER TABLE users 
ADD CONSTRAINT chk_users_vis_enum 
CHECK (vis IN ('public', 'private'));

ALTER TABLE posts 
ADD CONSTRAINT chk_posts_vis_enum 
CHECK (vis IN ('public', 'private'));

ALTER TABLE notifications 
ADD CONSTRAINT chk_notifications_type_enum 
CHECK (type IN ('like', 'save', 'comment', 'follow', 'mention', 'invite'));
```
