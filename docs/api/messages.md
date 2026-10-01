# Direct Messaging API Specification

This document defines the direct messaging contracts utilized by `MsgsSheet` and `Bubble` components.

---

## 1. List Conversations: `GET /api/conversations`

- **Method**: `GET`
- **Path**: `/api/conversations`
- **Purpose**: Populate the conversation thread list in the left-hand messaging drawer (`MsgsSheet`).
- **Authentication**: Required.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "id": 0,
        "counterparty": {
          "id": 3,
          "name": "Sofia Rinaldi",
          "handle": "sofiar",
          "photo": "https://cdn.phiny.art/avatars/sofia.webp"
        },
        "unread": 1,
        "mute": 0,
        "last_message": {
          "id": "m_102",
          "text": "Loved the terrace series. Is it for sale?",
          "timestamp": "12m",
          "sender_id": 3
        }
      },
      {
        "id": 1,
        "counterparty": {
          "id": 0,
          "name": "Mara Okafor",
          "handle": "maraokafor",
          "photo": "https://cdn.phiny.art/avatars/mara.webp"
        },
        "unread": 0,
        "mute": 0,
        "last_message": {
          "id": "m_101",
          "text": "Thanks for the follow!",
          "timestamp": "2h",
          "sender_id": 0
        }
      }
    ]
  }
  ```

---

## 2. Get Thread Messages: `GET /api/conversations/:id/messages`

- **Method**: `GET`
- **Path**: `/api/conversations/:id/messages`
- **Purpose**: Load chronological chat history for an active thread.
- **Authentication**: Required (Must be a participant in the conversation).
- **Query Parameters**:
  - `limit` (integer, optional, default `50`): Maximum messages to return.
  - `before` (string/timestamp, optional): Pagination anchor for older messages.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "me": true,
        "t": "Hi! Thanks for the follow.",
        "w": "Mon",
        "rp": null
      },
      {
        "id": 2,
        "me": false,
        "t": "Loved the terrace series. Is it for sale?",
        "w": "12m",
        "rp": null
      }
    ]
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: User is not a participant in this conversation.
  - `404 Not Found`: Conversation does not exist.

---

## 3. Send Message: `POST /api/conversations/:id/messages`

- **Method**: `POST`
- **Path**: `/api/conversations/:id/messages`
- **Purpose**: Send a new text message into an existing conversation.
- **Authentication**: Required.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "text": "Yes, high-resolution archival prints are available on my site.",
    "reply_to": "Loved the terrace series. Is it for sale?"
  }
  ```
- **Validation Rules**:
  - `text`: Required string. 1–2000 characters. Trimmed. Must not be empty.
  - `reply_to`: Optional string. Text snippet of the message being quoted/replied to. Maximum 200 characters.
- **Successful Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "me": true,
      "t": "Yes, high-resolution archival prints are available on my site.",
      "w": "Now",
      "rp": "Loved the terrace series. Is it for sale?"
    }
  }
  ```

---

## 4. Mark Conversation as Read: `PATCH /api/conversations/:id/read`

- **Method**: `PATCH`
- **Path**: `/api/conversations/:id/read`
- **Purpose**: Dismisses the unread red indicator dot when a user opens the thread.
- **Authentication**: Required.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Conversation marked as read"
  }
  ```

---

## 5. Toggle Mute Thread: `PATCH /api/conversations/:id/mute`

- **Method**: `PATCH`
- **Path**: `/api/conversations/:id/mute`
- **Purpose**: Toggles push and badge notification muting for a specific thread.
- **Authentication**: Required.
- **Request Body**:
  ```json
  {
    "mute": true
  }
  ```
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 0,
      "mute": true
    }
  }
  ```

---

## 6. Real-Time Delivery Considerations

> **NEEDS DECISION**:
> In the prototype, message dispatch is synchronous and stored in client context. For production, direct messaging requires real-time push events to update `c.convs` and increment unread badges without page refreshing.
> - **Recommendation 1**: Server-Sent Events (SSE) on `GET /api/messages/stream` (simple, unidirectional, HTTP/2 multiplexed).
> - **Recommendation 2**: WebSocket connection on `/ws/messages` (bidirectional, lower latency).
