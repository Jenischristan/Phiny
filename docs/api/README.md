# Phiny API Documentation Index

This directory contains the formal backend API specifications for Phiny. All contracts are directly grounded in the existing frontend code (`lib/api.ts`, `app/api/*`, `context/PhinyContext.tsx`, and component interaction patterns).

---

## API Specifications

1. **[Overview & Standards](./overview.md)**: HTTP protocols, base URLs, versioning, request/response headers, content types, and status codes.
2. **[Authentication & Session API](./authentication.md)**: Endpoints for sign-in (`POST /api/auth/login`), registration, password reset, session checking, and logout.
3. **[Posts API](./posts.md)**: Endpoints for listing posts (`GET /api/posts`), creating posts (`POST /api/posts`), single post retrieval (`GET /api/posts/:id`), post updating (`PATCH /api/posts/:id`), and deletion (`DELETE /api/posts/:id`).
4. **[Collections API](./collections.md)**: Endpoints for listing collections (`GET /api/collections`), creating boards (`POST /api/collections`), updating boards (`PATCH /api/collections/:id`), and deleting boards (`DELETE /api/collections/:id`).
5. **[Users & Profiles API](./users.md)**: Profile endpoints (`GET /api/users/:id`, `PATCH /api/users/me`), followers, and follow actions.
6. **[Direct Messaging API](./messages.md)**: Chat conversations, message histories, sending messages, and read receipts.
7. **[Search API](./search.md)**: Querying posts, creators, and tags with autocomplete suggestions.
8. **[Uploads API](./uploads.md)**: Image intake pipeline, validation, storage buckets, and CDN delivery.
9. **[Errors & Status Codes](./errors.md)**: Standardized error envelope format and complete error code catalog.
10. **[OpenAPI 3.1 Specification](./openapi.yaml)**: Complete machine-readable OpenAPI specification file.
