# PostgreSQL Production Database Schema (DDL)

This document provides the complete, production-ready PostgreSQL Data Definition Language (DDL) schema for Phiny.

---

## 1. Schema DDL Script

```sql
-- Enable UUID extension for robust distributed primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    handle VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Creator',
    bio TEXT DEFAULT '',
    loc VARCHAR(100),
    web VARCHAR(255),
    photo TEXT,
    pro VARCHAR(100),
    dis VARCHAR(100),
    state VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'private', 'deactivated')),
    vis VARCHAR(10) NOT NULL DEFAULT 'public' CHECK (vis IN ('public', 'private')),
    followers_count INTEGER NOT NULL DEFAULT 0 CHECK (followers_count >= 0),
    following_count INTEGER NOT NULL DEFAULT 0 CHECK (following_count >= 0),
    dob DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. SESSIONS TABLE
-- ============================================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. USER PREFERENCES TABLE
-- ============================================================================
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(10) NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    allow_follow_from VARCHAR(30) NOT NULL DEFAULT 'Everyone',
    allow_msg_from VARCHAR(30) NOT NULL DEFAULT 'Everyone',
    allow_cmt_from VARCHAR(30) NOT NULL DEFAULT 'Everyone',
    allow_men_from VARCHAR(30) NOT NULL DEFAULT 'Everyone',
    recommend_saved BOOLEAN NOT NULL DEFAULT TRUE,
    notif_likes BOOLEAN NOT NULL DEFAULT TRUE,
    notif_comments BOOLEAN NOT NULL DEFAULT TRUE,
    notif_follows BOOLEAN NOT NULL DEFAULT TRUE,
    notif_mentions BOOLEAN NOT NULL DEFAULT TRUE,
    notif_messages BOOLEAN NOT NULL DEFAULT TRUE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. POSTS TABLE
-- ============================================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(80) NOT NULL,
    tag VARCHAR(50) NOT NULL DEFAULT 'Art',
    tags TEXT[] NOT NULL DEFAULT '{}',
    ratio NUMERIC(4,3) NOT NULL CHECK (ratio >= 0.500 AND ratio <= 2.000),
    seed INTEGER NOT NULL DEFAULT 1,
    src TEXT,
    alt VARCHAR(255),
    description TEXT,
    location VARCHAR(100),
    likes_count INTEGER NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
    vis VARCHAR(10) NOT NULL DEFAULT 'public' CHECK (vis IN ('public', 'private')),
    allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
    hide_likes BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generated full-text search vector
ALTER TABLE posts ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(tags, ' ')), 'C')
) STORED;

-- ============================================================================
-- 5. COLLECTIONS TABLE
-- ============================================================================
CREATE TABLE collections (
    id VARCHAR(64) PRIMARY KEY, -- Supports c0, c1 or c_<timestamp/uuid>
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    priv BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. COLLECTION POSTS (JOIN TABLE)
-- ============================================================================
CREATE TABLE collection_posts (
    collection_id VARCHAR(64) NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (collection_id, post_id)
);

-- ============================================================================
-- 7. SOCIAL INTERACTIONS (LIKES, SAVES, FOLLOWS)
-- ============================================================================
CREATE TABLE post_likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE user_saved_posts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE user_followers (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- ============================================================================
-- 8. COMMENTS TABLE
-- ============================================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (LENGTH(TRIM(text)) > 0 AND LENGTH(text) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. DIRECT MESSAGING TABLES
-- ============================================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unread BOOLEAN NOT NULL DEFAULT FALSE,
    mute BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (LENGTH(TRIM(text)) > 0 AND LENGTH(text) <= 2000),
    reply_to TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('like', 'save', 'comment', 'follow', 'mention', 'invite')),
    text TEXT NOT NULL,
    unread BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. REPORTS TABLE (CONTENT MODERATION)
-- ============================================================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'user', 'comment')),
    target_id VARCHAR(64) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
