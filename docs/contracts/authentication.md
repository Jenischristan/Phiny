# Production Authentication & Session Contract

This document specifies the session management, credential security, token lifecycle, and cookie configuration required for the production Phiny backend.

---

## 1. Session Storage & Cookie Protocol

To prevent cross-site scripting (XSS) token theft, production browser sessions MUST be managed via secure, HTTP-only cookies rather than storing raw bearer tokens in browser `localStorage`.

### 1.1 Cookie Attributes
Upon successful authentication (`POST /api/auth/login` or `POST /api/auth/register`), the backend must issue the session cookie:

```http
Set-Cookie: phiny_session=v0_s_9a8b7c6d5e4f3a2b1c; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

- **`HttpOnly`**: Mandatory. Prevents JavaScript execution context (`document.cookie`) from accessing session tokens.
- **`Secure`**: Mandatory in production. Ensures cookie transmission exclusively over HTTPS.
- **`SameSite=Lax`**: Protects against Cross-Site Request Forgery (CSRF) on mutating requests while permitting top-level navigation.
- **`Path=/`**: Accessible across all frontend and API routes.
- **`Max-Age=2592000`**: 30 days (when "Remember me" is checked) or omitted for session duration.

---

## 2. Server-Side Session Entity (`sessions` table)

Rather than stateless JWTs which cannot be revoked when a user logs out or resets their password, stateful database sessions are required:

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash of plaintext cookie token
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Verification Flow
1. Incoming request includes `Cookie: phiny_session=<raw_token>`.
2. Backend computes `SHA-256(<raw_token>)`.
3. Backend looks up record in `sessions` where `token_hash = computed_hash AND expires_at > NOW()`.
4. If found, attaches `req.user` to request context and asynchronously updates `last_active_at = NOW()`.
5. If not found or expired, returns `401 Unauthorized` and issues a cookie clearing header.

---

## 3. Password Security & Storage

> **CRITICAL RULE**: Storing passwords in plaintext is strictly prohibited.

- **Recommended Algorithm**: **Argon2id** (RFC 9106 recommended parameters: memory 64 MB, 3 iterations, 4 parallelism threads).
- **Approved Alternative**: **bcrypt** with a minimum work factor (cost) of 12.
- **Salting**: Cryptographically random 16-byte salt generated per password by the hashing library.
- **Password Complexity**: Minimum 8 characters, maximum 128 characters. Must contain at least one letter and one number.

---

## 4. Frontend Session Invalidation Handling

When the frontend receives a `401 Unauthorized` response from any API endpoint:
1. `PhinyContext` clears the active `user` state to `null`.
2. The UI switches navigation elements to the logged-out state ("Sign in" button visible).
3. If the user was in the middle of an action, `c.gate()` opens `LoginDialog` with the message: `"Log in to continue."`.
