# Backend Contracts Directory

This directory defines the explicit data, validation, security, and query contracts that the Phiny backend must enforce.

---

## Documents in This Section

1. **[Master API Contract](./api-contract.md)**: Tabular summary of all frontend-to-backend operations, endpoints, triggers, payloads, and authentication levels.
2. **[Entity Contracts](./entity-contracts.md)**: Strict field-level contracts for all system entities (`User`, `Post`, `Collection`, `Comment`, `Conversation`, `ChatMessage`, `Notification`).
3. **[Validation Matrix](./validation.md)**: Complete breakdown comparing client-side UX hints against mandatory backend data integrity constraints.
4. **[Pagination Specification](./pagination.md)**: Cursor and offset pagination requirements for masonry feeds, comments, and follower lists.
5. **[Filtering Specification](./filtering.md)**: Contracts for filtering pins by tag, creator, and visibility.
6. **[Sorting Specification](./sorting.md)**: Chronological and engagement-weighted ranking algorithms.
7. **[Authentication Contract](./authentication.md)**: Production session storage, cookie headers, and token lifecycles.
8. **[Authorization & Access Control Matrix](./authorization.md)**: Strict read/write/delete permission matrices for all entities.
