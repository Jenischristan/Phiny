# API Error Contract & Error Codes Catalog

This document defines the standardized error format and catalog of machine-readable error codes across all Phiny backend endpoints.

---

## 1. Standard Error Envelope Structure

All non-2xx responses MUST adhere to this uniform JSON envelope:

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;             // Human-readable message suitable for toast or alert
  code?: string;             // Machine-readable uppercase snake_case identifier
  details?: Array<{          // Optional array of specific field validation failures
    field: string;
    message: string;
  }> | null;
}
```

### Example: Validation Error (HTTP 400)
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "error": "Validation failed on 2 fields",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 3 and 80 characters"
    },
    {
      "field": "ratio",
      "message": "Aspect ratio must be between 0.5 and 2.0"
    }
  ]
}
```

---

## 2. Comprehensive Error Code Catalog

| Error Code | HTTP Status | Triggering Condition | Frontend Reaction |
|---|---|---|---|
| `VALIDATION_ERROR` | `400` | Malformed or invalid input fields. | Renders inline red error text under input field. |
| `INVALID_CREDENTIALS` | `401` | Username/email and password combination do not match. | Displays inline warning: `"Invalid username or password"`. |
| `UNAUTHORIZED` | `401` | Missing, expired, or invalid session on a protected route. | Opens `LoginDialog` via `c.gate()`. |
| `FORBIDDEN` | `403` | User attempted to edit/delete a post or collection owned by someone else. | Shows toast error: `"You do not have permission to perform this action"`. |
| `ACCOUNT_DEACTIVATED` | `403` | User account has been deactivated by user or moderator. | Halts login and renders deactivated notice. |
| `POST_NOT_FOUND` | `404` | Post ID does not exist in the database. | `PostView` renders `Empty` state: `"POST UNAVAILABLE"`. |
| `COLLECTION_NOT_FOUND` | `404` | Collection ID does not exist or is marked private by another user. | `CollectionDetailView` renders `Empty` state: `"COLLECTION UNAVAILABLE"`. |
| `USER_NOT_FOUND` | `404` | Creator profile ID or handle does not exist. | `ProfileView` renders `Empty` state: `"UNAVAILABLE"`. |
| `CONVERSATION_NOT_FOUND` | `404` | Chat thread ID does not exist. | Clears active conversation selection in `MsgsSheet`. |
| `USERNAME_TAKEN` | `409` | Chosen username already registered during signup. | `SignupView` Step 2 flags username field: `"That username is taken"`. |
| `EMAIL_REGISTERED` | `409` | Email already in use. | `SignupView` Step 3 flags email field: `"An account with that email already exists"`. |
| `FILE_TOO_LARGE` | `413` | Uploaded image exceeds 5 MB. | `ImageUploader` displays: `"Choose an image under 5 MB"`. |
| `INVALID_IMAGE_TYPE` | `415` | File MIME type is not JPEG, PNG, or WebP. | `ImageUploader` displays: `"Unsupported image type"`. |
| `RATE_LIMIT_EXCEEDED` | `429` | Client exceeded maximum requests per minute. | Toast: `"Too many requests. Please wait a moment."`. |
| `INTERNAL_SERVER_ERROR` | `500` | Unhandled server exception or database connectivity loss. | `lib/api.ts` catches error and falls back to client cache. |

---

## 3. Frontend Error Handling In `lib/api.ts`

The client API wrapper (`lib/api.ts`) contains resilient try-catch wrappers around every endpoint:

```typescript
async list(params?: { tag?: string; q?: string; userId?: string }): Promise<Post[]> {
  try {
    const res = await fetch(`/api/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('API error, using client cache:', err);
    return [];
  }
}
```

### Backend Expectation
The backend MUST always return a properly formatted JSON error body even during internal exceptions (e.g. 500), rather than returning an unformatted HTML error page (like default Nginx 502/504), so that `await res.json()` succeeds without throwing syntax errors.
