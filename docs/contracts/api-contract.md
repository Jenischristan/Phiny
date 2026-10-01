# Master API Contract & Frontend Call Inventory

This document inventories every network call made or expected by the Phiny frontend application, detailing the UI component trigger, HTTP method, target path, payload schema, response structure, and authentication requirements.

---

## 1. Master Frontend API Call Inventory

| # | Frontend Component / File | HTTP Method | Target Endpoint | User Interaction / Event Trigger | Request Payload | Response Data | Auth Level |
|---|---|---|---|---|---|---|---|
| **1** | `LoginDialog.tsx` | `POST` | `/api/auth/login` | User submits sign-in form | `{ id: string, password?: string }` | `{ success: true, user: Person }` | Public |
| **2** | `SignupView.tsx` | `POST` | `/api/auth/register` | User completes 9-step registration | `SignupData` object | `{ success: true, user: Person }` | Public |
| **3** | `AccountSwitcherDialog.tsx` | `POST` | `/api/auth/logout` | User clicks "Log out" button | None | `{ success: true, message: string }` | Authenticated |
| **4** | `HomeView.tsx` / `lib/api.ts` | `GET` | `/api/posts` | Initial feed mount / scroll | Query: `?limit=48` | `{ success: true, count: N, data: Post[] }` | Public |
| **5** | `HomeView.tsx` / `lib/api.ts` | `GET` | `/api/posts` | User clicks category tag filter chip | Query: `?tag=Architecture` | `{ success: true, count: N, data: Post[] }` | Public |
| **6** | `SearchBar.tsx` / `lib/api.ts` | `GET` | `/api/posts` | User submits search query | Query: `?q=concrete` | `{ success: true, count: N, data: Post[] }` | Public |
| **7** | `SearchBar.tsx` | `GET` | `/api/search/suggestions` | User types in search bar | Query: `?q=term` | `{ success: true, data: { creators, posts, tags } }` | Public |
| **8** | `CreateView.tsx` / `lib/api.ts` | `POST` | `/api/posts` | User clicks "Publish post" button | `PostInput` (title, tags, ratio, src, vis, etc.) | `{ success: true, data: Post }` | Authenticated |
| **9** | `PostView.tsx` | `GET` | `/api/posts/:id` | Page navigation to `/post/[id]` | Path param: `id` | `{ success: true, data: Post }` | Public |
| **10** | `PostView.tsx` | `PATCH` | `/api/posts/:id` | Creator edits post metadata | `{ title, desc, vis, comments, hideLikes }` | `{ success: true, data: Post }` | Author Only |
| **11** | `PostView.tsx` / `lib/api.ts` | `DELETE` | `/api/posts/:id` | Creator confirms "Delete post" | Path param: `id` | `{ success: true, message: string }` | Author Only |
| **12** | `ImageCard.tsx` / `PostView.tsx` | `POST` | `/api/posts/:id/save` | User clicks "Save" bookmark button | Path param: `id` | `{ success: true, is_saved: true }` | Authenticated |
| **13** | `ImageCard.tsx` / `PostView.tsx` | `DELETE` | `/api/posts/:id/save` | User clicks "Saved" to unbookmark | Path param: `id` | `{ success: true, is_saved: false }` | Authenticated |
| **14** | `ImageCard.tsx` / `PostView.tsx` | `POST` | `/api/posts/:id/like` | User clicks heart button to like | Path param: `id` | `{ success: true, likes: N, is_liked: true }` | Authenticated |
| **15** | `ImageCard.tsx` / `PostView.tsx` | `DELETE` | `/api/posts/:id/like` | User clicks heart button to unlike | Path param: `id` | `{ success: true, likes: N, is_liked: false }` | Authenticated |
| **16** | `PostView.tsx` | `POST` | `/api/posts/:id/comments` | User submits comment form | `{ text: string }` | `{ success: true, data: Comment }` | Authenticated |
| **17** | `LibraryView.tsx` / `lib/api.ts` | `GET` | `/api/collections` | Mounts `/library` collections tab | None | `{ success: true, count: N, data: Collection[] }` | Public / User |
| **18** | `CollDialog.tsx` / `lib/api.ts` | `POST` | `/api/collections` | User creates board in modal | `{ name: string, priv: boolean, pins: [] }` | `{ success: true, data: Collection }` | Authenticated |
| **19** | `CollectionDetailView.tsx` | `GET` | `/api/collections/:id` | Page navigation to `/collection/[id]` | Path param: `id` | `{ success: true, data: Collection }` | Public (or Owner) |
| **20** | `CollDialog.tsx` / `lib/api.ts` | `PATCH` | `/api/collections/:id` | User renames board or toggles priv | `{ name?: string, priv?: boolean }` | `{ success: true, data: Collection }` | Owner Only |
| **21** | `AddToDialog.tsx` / `lib/api.ts` | `PATCH` | `/api/collections/:id` | User checks/unchecks pin on board | `{ pins: (string \| number)[] }` | `{ success: true, data: Collection }` | Owner Only |
| **22** | `CollView.tsx` / `lib/api.ts` | `DELETE` | `/api/collections/:id` | Owner confirms "Delete collection" | Path param: `id` | `{ success: true, message: string }` | Owner Only |
| **23** | `ProfileView.tsx` | `GET` | `/api/users/:id` | Navigation to `/profile/[id]` | Path param: `id` | `{ success: true, data: Person }` | Public |
| **24** | `ProfileView.tsx` / `lib/api.ts` | `GET` | `/api/posts` | Mounts creator profile posts tab | Query: `?userId={id}` | `{ success: true, count: N, data: Post[] }` | Public |
| **25** | `EditProfileDialog.tsx` | `PATCH` | `/api/users/me` | User submits profile edit form | `{ name, handle, bio, web, loc, photo, ... }` | `{ success: true, data: Person }` | Authenticated |
| **26** | `PeopleView.tsx` | `GET` | `/api/users/:id/followers` | Navigation to `/profile/[id]/followers` | Path param: `id`, Query: `?q=` | `{ success: true, count: N, data: Person[] }` | Public |
| **27** | `PeopleView.tsx` | `GET` | `/api/users/:id/following` | Navigation to `/profile/[id]/following` | Path param: `id`, Query: `?q=` | `{ success: true, count: N, data: Person[] }` | Public |
| **28** | `FollowButton.tsx` / `UserCard.tsx`| `POST` | `/api/users/:id/follow` | User clicks "Follow" button | Path param: `id` | `{ success: true, is_following: true }` | Authenticated |
| **29** | `FollowButton.tsx` / `UserCard.tsx`| `DELETE` | `/api/users/:id/follow` | User clicks "Following" to unfollow | Path param: `id` | `{ success: true, is_following: false }` | Authenticated |
| **30** | `MsgsSheet.tsx` | `GET` | `/api/conversations` | User opens messaging slide-out sheet | None | `{ success: true, count: N, data: Conversation[] }` | Authenticated |
| **31** | `MsgsSheet.tsx` | `GET` | `/api/conversations/:id/messages`| User selects conversation thread | Path param: `id` | `{ success: true, data: ChatMessage[] }` | Participant |
| **32** | `MsgsSheet.tsx` | `POST` | `/api/conversations/:id/messages`| User submits chat message | `{ text: string, reply_to?: string }` | `{ success: true, data: ChatMessage }` | Participant |
| **33** | `MsgsSheet.tsx` | `PATCH` | `/api/conversations/:id/read` | Thread selected by user | Path param: `id` | `{ success: true, message: string }` | Participant |
| **34** | `MsgsSheet.tsx` | `PATCH` | `/api/conversations/:id/mute` | User toggles mute on thread | `{ mute: boolean }` | `{ success: true, data: { mute: boolean } }`| Participant |
| **35** | `NotifsSheet.tsx` | `GET` | `/api/notifications` | User opens notifications sheet | None | `{ success: true, data: NotificationItem[] }` | Authenticated |
| **36** | `NotifsSheet.tsx` | `PATCH` | `/api/notifications/read-all`| User clicks "Mark all read" | None | `{ success: true, message: string }` | Authenticated |
| **37** | `NotifsSheet.tsx` | `DELETE` | `/api/notifications` | User clicks "Clear all" | None | `{ success: true, message: string }` | Authenticated |
| **38** | `ImageUploader.tsx` | `POST` | `/api/uploads/presigned` | User drops an image into dropzone | `{ filename, contentType, size }` | `{ uploadUrl, fileUrl, expiresIn }` | Authenticated |
| **39** | `Security.tsx` | `POST` | `/api/auth/change-password` | User submits password change form | `{ currentPassword, newPassword }` | `{ success: true, message: string }` | Authenticated |
| **40** | `ReportDialog.tsx` | `POST` | `/api/reports` | User submits abuse/copyright report | `{ targetType: "post" \| "user", targetId, reason }` | `{ success: true, message: string }` | Optional |
