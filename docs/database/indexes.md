# Database Indexing Strategy & Query Optimization

This document outlines the indexing strategy designed to support the specific queries, filters, and access patterns required by the Phiny frontend.

---

## 1. Index Definitions Script

```sql
-- ============================================================================
-- POSTS TABLE INDEXES
-- ============================================================================

-- 1. Primary feed sorting & cursor pagination (WHERE vis = 'public' ORDER BY created_at DESC, id DESC)
CREATE INDEX idx_posts_feed_pagination 
ON posts (created_at DESC, id DESC) 
WHERE vis = 'public';

-- 2. Tag filter queries (e.g. GET /api/posts?tag=Architecture)
CREATE INDEX idx_posts_tag_recency 
ON posts (tag, created_at DESC) 
WHERE vis = 'public';

-- 3. GIN index for multi-tag containment (tags @> ARRAY['Brutalism'])
CREATE INDEX idx_posts_tags_gin 
ON posts USING gin(tags);

-- 4. Author profile posts (e.g. GET /api/posts?userId=0)
CREATE INDEX idx_posts_author_recency 
ON posts (author_id, created_at DESC);

-- 5. Full-text search GIN index
CREATE INDEX idx_posts_search_gin 
ON posts USING gin(search_vector);

-- 6. Popularity explore sorting (ORDER BY likes_count DESC, created_at DESC)
CREATE INDEX idx_posts_popularity 
ON posts (likes_count DESC, created_at DESC) 
WHERE vis = 'public';

-- ============================================================================
-- USERS TABLE INDEXES
-- ============================================================================

-- Unique lookups (already covered by UNIQUE constraints)
-- handle: users_handle_key
-- email: users_email_key

-- Suggested creators index (WHERE state = 'active' ORDER BY followers_count DESC)
CREATE INDEX idx_users_suggested 
ON users (followers_count DESC) 
WHERE state = 'active';

-- Autocomplete search on user handles and names
CREATE INDEX idx_users_name_handle_trgm 
ON users USING gin ((name || ' ' || handle || ' ' || coalesce(role, '')) gin_trgm_ops)
WHERE state != 'deactivated';

-- ============================================================================
-- COLLECTIONS & COLLECTION POSTS INDEXES
-- ============================================================================

-- Fast lookup of all collections owned by a user in /library
CREATE INDEX idx_collections_owner 
ON collections (owner_id, created_at DESC);

-- Fast lookup and ordered retrieval of pins within a collection
CREATE INDEX idx_collection_posts_board_order 
ON collection_posts (collection_id, position ASC);

-- Inverse lookup to check if a specific pin is saved in any collection
CREATE INDEX idx_collection_posts_pin_lookup 
ON collection_posts (post_id);

-- ============================================================================
-- SOCIAL GRAPH & INTERACTION INDEXES
-- ============================================================================

-- Followers list query: GET /api/users/:id/followers
CREATE INDEX idx_followers_following_id 
ON user_followers (following_id, created_at DESC);

-- Following list query: GET /api/users/:id/following
CREATE INDEX idx_followers_follower_id 
ON user_followers (follower_id, created_at DESC);

-- User's saved posts library list
CREATE INDEX idx_user_saved_posts_recency 
ON user_saved_posts (user_id, created_at DESC);

-- User's liked posts list
CREATE INDEX idx_post_likes_user 
ON post_likes (user_id, created_at DESC);

-- ============================================================================
-- COMMENTS & MESSAGING INDEXES
-- ============================================================================

-- Chronological comments retrieval on post detail view
CREATE INDEX idx_comments_post_thread 
ON comments (post_id, created_at ASC);

-- Chronological chat messages retrieval in MsgsSheet
CREATE INDEX idx_chat_messages_thread 
ON chat_messages (conversation_id, created_at ASC);

-- User's active conversation threads lookup
CREATE INDEX idx_conv_participants_user 
ON conversation_participants (user_id, unread, conversation_id);

-- ============================================================================
-- NOTIFICATIONS INDEXES
-- ============================================================================

-- Notifications inbox query: GET /api/notifications
CREATE INDEX idx_notifications_recipient 
ON notifications (recipient_id, created_at DESC);

-- Fast unread badge counter query (Header badge: unread > 0)
CREATE INDEX idx_notifications_unread_count 
ON notifications (recipient_id) 
WHERE unread = TRUE;
```

---

## 2. Query Execution Analysis & Justification

1. **Masonry Feed Optimization**:
   The `idx_posts_feed_pagination` partial index allows PostgreSQL to satisfy feed queries entirely via Index Scan without evaluating private posts or reading heap blocks for sort operations.
2. **Tag Discovery Optimization**:
   The compound index `idx_posts_tag_recency` enables sub-millisecond retrieval of category feeds (`GET /api/posts?tag=Architecture`) without requiring dynamic bitmap heap scans.
3. **Unread Badge Optimization**:
   The partial index `idx_notifications_unread_count` on `WHERE unread = TRUE` reduces unread check queries from sequential table scans to a tiny B-tree lookup of only unread records.
