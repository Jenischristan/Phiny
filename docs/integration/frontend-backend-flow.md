# Frontend ↔ Backend Sequence Diagrams

This document contains Mermaid sequence diagrams illustrating the end-to-end communication flows between the user browser, Next.js frontend, API services, and database.

---

## 1. Authentication: Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Modal as LoginDialog.tsx
    participant Ctx as PhinyContext
    participant API as /api/auth/login
    participant DB as PostgreSQL

    User->>Modal: Enters handle/email & password, clicks "Sign in"
    Modal->>API: POST /api/auth/login { id, password, remember }
    API->>DB: Query user by LOWER(handle) OR LOWER(email)
    DB-->>API: Return user record with password_hash
    API->>API: Verify password hash (Argon2id)
    alt Invalid Password
        API-->>Modal: HTTP 401 { success: false, error: "Invalid username or password" }
        Modal-->>User: Display inline validation error
    else Valid Credentials
        API->>DB: INSERT INTO sessions (user_id, token_hash, expires_at)
        DB-->>API: Session created
        API-->>Modal: HTTP 200 { success: true, user } + Set-Cookie: phiny_session=...
        Modal->>Ctx: onLoginSuccess(user)
        Ctx->>Ctx: Set active user state & execute queued action (pend.current)
        Modal-->>User: Close dialog & display toast "Signed in as @handle"
    end
```

---

## 2. Publish New Post Flow

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Creator
    participant View as CreateView.tsx
    participant Storage as Cloud Object Storage (S3/GCS)
    participant API as /api/posts
    participant DB as PostgreSQL
    participant Router as Next.js Router

    Creator->>View: Drops image into ImageUploader
    View->>View: Inspect aspect ratio & file size (<= 5MB)
    View->>API: POST /api/uploads/presigned { filename, contentType, size }
    API-->>View: Return { uploadUrl, fileUrl }
    View->>Storage: PUT binary image to uploadUrl
    Storage-->>View: HTTP 200 OK
    Creator->>View: Enters Title, Tags, sets Visibility, clicks "Publish"
    View->>API: POST /api/posts { title, tags, ratio, src: fileUrl, vis, coll }
    API->>API: Validate title (3-80 chars), ratio bounds (0.5-2.0), tags
    API->>DB: INSERT INTO posts (...) RETURNING *
    opt If collection specified
        API->>DB: INSERT INTO collection_posts (collection_id, post_id)
    end
    DB-->>API: Created post record
    API-->>View: HTTP 201 Created { success: true, data: Post }
    View->>Router: Navigate to /post/[newPostId]
    Router-->>Creator: Render post detail view with toast "Published."
```

---

## 3. Global Search Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Bar as SearchBar.tsx
    participant Feed as HomeView.tsx
    participant API as Backend API
    participant DB as PostgreSQL

    User->>Bar: Types "concrete" into search input
    Bar->>Bar: Debounce (150ms), strip leading #, lowercase
    Bar->>API: GET /api/search/suggestions?q=concrete
    API->>DB: Query top matching creators, posts, and tags
    DB-->>API: Suggestions data
    API-->>Bar: HTTP 200 { data: { creators, posts, tags } }
    Bar-->>User: Render autocomplete dropdown popover

    User->>Bar: Presses Enter key to commit search
    Bar->>Feed: Updates context query: setQ("concrete")
    opt If user is on /settings or /profile
        Bar->>Feed: c.go('home') -> Navigates to /
    end
    Feed->>API: GET /api/posts?q=concrete
    API->>DB: SELECT * FROM posts WHERE search_vector @@ websearch_to_tsquery('concrete')
    DB-->>API: Matching posts
    API-->>Feed: HTTP 200 { count: 12, data: Post[] }
    Feed-->>User: Re-renders masonry grid with filtered results
```

---

## 4. Bookmark / Save Post to Collection Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Card as ImageCard.tsx
    participant Dialog as AddToDialog.tsx
    participant Ctx as PhinyContext
    participant API as /api/collections/:id
    participant DB as PostgreSQL

    User->>Card: Clicks "Save" button on pin
    Card->>Ctx: c.toggleSave(pin.id)
    Ctx->>Ctx: Optimistic update: saved[pin.id] = true
    Ctx-->>User: Toast "Saved to your library"
    Ctx->>API: POST /api/posts/:id/save
    API->>DB: INSERT INTO user_saved_posts (user_id, post_id)
    DB-->>API: Saved successfully

    User->>Card: Clicks "Add to collection" from More Actions menu
    Card->>Ctx: c.openAdd(pin.id)
    Ctx->>Dialog: Open modal with user's collections
    Dialog-->>User: Displays board list with checked states
    User->>Dialog: Clicks on "Brutalist Moods"
    Dialog->>Ctx: c.addToggle(collId, pin.id)
    Ctx->>API: PATCH /api/collections/:id { pins: [0, 4, 8, 12, newPinId] }
    API->>DB: INSERT INTO collection_posts (collection_id, post_id)
    DB-->>API: Updated collection
    API-->>Dialog: HTTP 200 { success: true, data: Collection }
    Dialog-->>User: Checkmark updates to "Added"
```

---

## 5. Direct Messaging Flow

```mermaid
sequenceDiagram
    autonumber
    actor Sender as Sender Browser
    participant Sheet as MsgsSheet.tsx
    participant API as /api/conversations/:id/messages
    participant DB as PostgreSQL
    actor Receiver as Receiver Browser

    Sender->>Sheet: Opens conversation with Sofia Rinaldi (u=3)
    Sheet->>API: GET /api/conversations/0/messages
    API->>DB: SELECT * FROM chat_messages WHERE conversation_id = 0 ORDER BY created_at ASC
    DB-->>API: Chronological message rows
    API-->>Sheet: HTTP 200 { data: ChatMessage[] }
    Sheet-->>Sender: Renders chat history and scrolls to bottom

    Sender->>Sheet: Enters message "Is the terrace series still for sale?" and submits
    Sheet->>API: POST /api/conversations/0/messages { text: "..." }
    API->>DB: INSERT INTO chat_messages (conversation_id, sender_id, text)
    API->>DB: UPDATE conversation_participants SET unread = TRUE WHERE user_id = 3
    API->>DB: INSERT INTO notifications (recipient_id, actor_id, type, text)
    DB-->>API: Persisted message row
    API-->>Sheet: HTTP 201 { success: true, data: ChatMessage }
    Sheet-->>Sender: Appends new Bubble to chat window & scrolls to bottom
    opt In production with WebSockets / SSE
        API-->>Receiver: Push event: new_message { threadId: 0, text: "..." }
        Receiver-->>Receiver: Increment unread message badge in Header
    end
```

---

## 6. Forgot Password Recovery Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Modal as LoginDialog.tsx
    participant API as /api/auth/forgot-password
    participant EmailSvc as Transactional Email Service (SES / Resend)
    participant DB as PostgreSQL

    User->>Modal: Clicks "Forgot your password?"
    Modal-->>User: Transitions to "Reset password" step
    User->>Modal: Enters "user@example.com", clicks "Send reset link"
    Modal->>API: POST /api/auth/forgot-password { email: "user@example.com" }
    API->>DB: SELECT id, email FROM users WHERE LOWER(email) = LOWER(:email)
    alt User Found
        API->>DB: INSERT INTO password_resets (user_id, token_hash, expires_at)
        API->>EmailSvc: Send email with signed reset link (expires in 1 hour)
    end
    API-->>Modal: HTTP 200 { success: true, message: "Reset instructions sent to your email" }
    Modal-->>User: Render confirmation: "Check your inbox for a link to reset your password" + "Back to sign in" button
```
