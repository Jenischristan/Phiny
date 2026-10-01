# Authorization & Access Control Matrix

This document defines the server-side access control matrix governing reads, writes, updates, and deletions across all Phiny resources.

---

## 1. Master Authorization Matrix

| Resource | Action | Anonymous Visitor | Authenticated User (Non-Owner) | Resource Owner | Platform Admin |
|---|---|---|---|---|---|
| **Public Post** | Read | Allowed | Allowed | Allowed | Allowed |
| **Private Post** | Read | Denied (`404`) | Denied (`404`) | Allowed | Allowed |
| **Post** | Create | Denied (`401`) | Allowed | Allowed | Allowed |
| **Post** | Update | Denied (`401`) | Denied (`403`) | Allowed | Allowed |
| **Post** | Delete | Denied (`401`) | Denied (`403`) | Allowed | Allowed |
| **Public Collection**| Read | Allowed | Allowed | Allowed | Allowed |
| **Private Collection**| Read | Denied (`404`) | Denied (`404`) | Allowed | Allowed |
| **Collection** | Create | Denied (`401`) | Allowed | Allowed | Allowed |
| **Collection** | Update / Rename | Denied (`401`) | Denied (`403`) | Allowed | Allowed |
| **Collection** | Add/Remove Pins | Denied (`401`) | Denied (`403`) | Allowed | Allowed |
| **Collection** | Delete | Denied (`401`) | Denied (`403`) | Allowed | Allowed |
| **Post Comments** | Read | Allowed | Allowed | Allowed | Allowed |
| **Comment** | Create | Denied (`401`) | Allowed (if post allows comments) | Allowed | Allowed |
| **Comment** | Delete | Denied (`401`) | Denied (`403`) | Comment Author OR Post Author | Allowed |
| **Direct Messages** | Read / Send | Denied (`401`) | Denied (`403`) | Thread Participants Only | Audited Access |
| **User Profile** | Read (Active) | Allowed | Allowed | Allowed | Allowed |
| **User Profile** | Read (Private) | Profile Header only; posts/colls locked | Posts/colls locked unless following | Full Access | Full Access |
| **User Profile** | Update | Denied (`401`) | Denied (`403`) | Self Only | Allowed |
| **Notifications** | Read / Clear | Denied (`401`) | Denied (`403`) | Recipient Only | Denied |

---

## 2. Granular Enforcement Rules & Security Tenets

### 2.1 Private Collections: 404 vs. 403 Enumeration Defense
If an unauthorized user attempts to access a private collection at `GET /api/collections/:id`, the backend MUST return **`HTTP 404 Not Found`** rather than `HTTP 403 Forbidden`.
*Reasoning*: Returning 403 confirms the existence of the private collection and leaks the ID. Returning 404 ensures private collections remain completely invisible to outsiders.

### 2.2 Post Ownership Verification
When `PATCH /api/posts/:id` or `DELETE /api/posts/:id` is received:
```sql
SELECT author_id FROM posts WHERE id = :post_id;
```
If `post.author_id != current_user.id` (and user is not an admin), immediately abort with `HTTP 403 Forbidden`:
```json
{
  "success": false,
  "code": "FORBIDDEN",
  "error": "You do not have permission to modify this post"
}
```

### 2.3 Direct Messaging Privacy
Under no circumstances may a user access conversations where they are not an explicit entry in `conversation_participants`. An attempt to view another user's conversation thread must fail with `HTTP 403 Forbidden` or `HTTP 404 Not Found`.
