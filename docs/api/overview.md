# Phiny API Architectural Overview & Standards

## 1. Base URL & Protocol

- **Protocol**: HTTPS (TLS 1.3 required in production)
- **Current Active Base Path**: `/api`
- **Recommended Production Base Path**: `/api/v1`

> **API Versioning Strategy**:
> In the current codebase, the frontend fetcher (`lib/api.ts`) communicates directly with unversioned endpoints at `/api/posts`, `/api/collections`, and `/api/auth/login`. For production, it is recommended to maintain a proxy or gateway rewrite from `/api/*` to `/api/v1/*` so that API contracts can be versioned without requiring client code changes.

---

## 2. Request & Response Standards

### 2.1 Content Negotiation
- **Request Headers**:
  - `Accept: application/json`
  - `Content-Type: application/json` (Required for `POST`, `PUT`, `PATCH`)
- **Response Headers**:
  - `Content-Type: application/json; charset=utf-8`

### 2.2 Standard Success Envelope
All JSON responses follow a consistent envelope structure established by the existing API routes:

#### Single Entity Response
```json
{
  "success": true,
  "data": {
    "id": "p_1720000000",
    "title": "Concrete Light",
    ...
  }
}
```

#### List / Array Response
```json
{
  "success": true,
  "count": 48,
  "data": [
    { ... },
    { ... }
  ]
}
```

#### Action Acknowledgment Response
```json
{
  "success": true,
  "message": "Post deleted"
}
```

### 2.3 Standard Error Envelope
When a request fails, the server responds with an appropriate HTTP error status code and a structured JSON payload:

```json
{
  "success": false,
  "error": "Human-readable description of error",
  "code": "ERROR_CODE_STRING",
  "details": null
}
```

For validation failures:
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 3 and 80 characters"
    }
  ]
}
```

---

## 3. Standard HTTP Status Codes

| Code | Status | Usage in Phiny |
|---|---|---|
| `200` | OK | Successful `GET`, `PATCH`, or action query. |
| `201` | Created | Successful `POST` creating a post or collection. |
| `400` | Bad Request | Missing required parameters, malformed JSON, or invalid field formats. |
| `401` | Unauthorized | Missing, expired, or invalid session token on a protected endpoint. |
| `403` | Forbidden | Authenticated user lacks permission to modify another user's post or private collection. |
| `404` | Not Found | Requested post, collection, or user profile does not exist. |
| `409` | Conflict | Attempting to register an already taken username or email address. |
| `422` | Unprocessable Entity | Semantically invalid input (e.g. image aspect ratio out of bounds). |
| `429` | Too Many Requests | Rate limit exceeded. |
| `500` | Internal Server Error | Unhandled server exception. |
