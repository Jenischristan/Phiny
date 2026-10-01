# Validation Contract: Client UX Rules vs. Server Data Integrity

This document establishes the validation matrix for Phiny. Client-side rules provide immediate, accessible UX feedback; the backend must independently enforce all data integrity and security checks. **The backend must never trust client-side validation.**

---

## 1. Master Validation Matrix

| Field / Target | Client Validation Rule (`lib/validation.ts`) | Server Validation & Integrity Constraint | Client Error Message | HTTP Error Status |
|---|---|---|---|---|
| **User Name** | `v.trim().length > 0` | `NOT NULL`, `LENGTH(TRIM(name)) BETWEEN 1 AND 100`. Strip HTML/script tags. | `"Enter your name."` | `400 Bad Request` |
| **Username / Handle** | Length 3–20 chars. Regex: `^[a-z0-9_.]+$`i | `NOT NULL`, `UNIQUE`, lowercase normalized. `LENGTH(handle) BETWEEN 3 AND 20`. Regex: `^[a-z0-9_.]{3,20}$`. Reserved handles blocklist (`admin`, `api`, `root`, `login`, `help`). | `"Choose a username."` / `"Use 3–20 characters."` / `"Use letters, numbers, . and _ only."` | `400 Bad Request` / `409 Conflict` |
| **User Email** | Regex: `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | `NOT NULL`, `UNIQUE`, lowercase normalized. RFC 5322 compliant regex. Maximum 255 chars. | `"Enter your email."` / `"Enter a valid email address."` | `400 Bad Request` / `409 Conflict` |
| **Password** | Min 8 chars. Must include at least 1 letter and 1 digit (`/[A-Za-z]/` and `/\d/`) | Minimum 8 characters, maximum 128 characters. Hashed via Argon2id. | `"Create a password."` / `"Use at least 8 characters."` / `"Include a letter and a number."` | `400 Bad Request` |
| **Password Strength** | 5 criteria: length >= 8, length >= 12, uppercase + lowercase, digit, special character | Backend enforces minimum entropy score (e.g. zxcvbn score >= 2 or equivalent). | UI meter: Weak, Fair, Good, Strong | N/A |
| **Date of Birth** | Age between 0 and 120 years. Must be `>= 13` years old: `age >= 13` | `NOT NULL`, `DATE <= CURRENT_DATE - INTERVAL '13 years'`. Valid calendar date. | `"Enter your date of birth."` / `"You must be at least 13 to join Phiny."` | `400 Bad Request` |
| **Website URL** | Regex: `/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i` | Valid URL format. Enforce `https://` prefix. Max 255 chars. Prevent `javascript:` URI attacks. | `"Enter a valid website, like yourname.com."` | `400 Bad Request` |
| **Bio** | Implicit (textarea) | `LENGTH(bio) <= 500`. Strip harmful HTML. | `"Bio must be 500 characters or fewer."` | `400 Bad Request` |
| **Post Title** | Trimmed length between 3 and 80 characters | `NOT NULL`, `LENGTH(TRIM(title)) BETWEEN 3 AND 80`. Sanitize text. | `"Give your post a title (3–80 characters)."` / `"Keep the title under 80 characters."` | `400 Bad Request` |
| **Post Image (`src`)** | Required. Non-empty string. | `NOT NULL`. Valid HTTPS URL pointing to approved CDN/bucket or data URI (in dev). | `"Add an image to publish."` | `400 Bad Request` |
| **Post Tags** | Tag string 2–24 chars (`^[a-z0-9_]{2,24}$`i). Up to 8 tags. | Maximum 8 elements. Each element lowercase alphanumeric + `_`, length 2–24. | `"Tags use 2–24 letters, numbers or _ , up to 8 in total."` | `400 Bad Request` |
| **Post Ratio** | Float computed from `height / width`, clamped between `0.5` and `2.0` | `NUMERIC(4,3) BETWEEN 0.500 AND 2.000`. | Implicitly calculated | `422 Unprocessable` |
| **Post Alt Text** | String | Max 255 characters. | None | `400 Bad Request` |
| **Post Description** | String | Max 1000 characters. Sanitize markdown/HTML. | None | `400 Bad Request` |
| **Post Location** | String | Max 100 characters. | None | `400 Bad Request` |
| **Collection Name** | Trimmed length `>= 2` characters | `NOT NULL`, `LENGTH(TRIM(name)) BETWEEN 2 AND 100`. | `"Name the collection (at least 2 characters)."` | `400 Bad Request` |
| **Comment Text** | Trimmed length `>= 1` character | `NOT NULL`, `LENGTH(TRIM(text)) BETWEEN 1 AND 500`. Sanitize text. | `"Enter a comment."` | `400 Bad Request` |
| **Chat Message** | Trimmed length `>= 1` character | `NOT NULL`, `LENGTH(TRIM(text)) BETWEEN 1 AND 2000`. Sanitize text. | None | `400 Bad Request` |
| **Image Upload File** | Size `<= 5,000,000` bytes (5 MB). MIME starts with `image/` | Verify file signature (magic bytes) for `image/jpeg`, `image/png`, `image/webp`. File size `<= 5,000,000` bytes. | `"Choose an image under 5 MB."` | `400 / 413 / 415` |

---

## 2. Server-Side Input Sanitization Rules

To prevent Cross-Site Scripting (XSS) and database injection:
1. **HTML Stripping**: All user-supplied strings (`name`, `bio`, `title`, `desc`, `text`) must be sanitized. No raw HTML tags (`<script>`, `<iframe>`, `<img>`, `<style>`) may be stored in database columns.
2. **Whitespace Normalization**: Trim leading and trailing whitespace from strings. Normalize double spaces.
3. **URL Validation**: Disallow `javascript:`, `data:text/html`, and non-HTTP protocols on `web` and external link fields.
4. **Parameterized SQL Queries**: All database queries must use prepared statements/parameterized arguments to prevent SQL injection.
