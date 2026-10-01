# Image & Media Upload Pipeline Specification

This document details the file upload contract required by `ImageUploader` and `CreateView`.

---

## 1. Frontend Ingestion Contract (`components/ui/ImageUploader.tsx`)

The frontend component implements the following client-side ingestion constraints:
- **Accepted Formats**: `image/jpeg`, `image/png`, `image/webp`. (HTML input attribute: `accept="image/*"`).
- **Maximum File Size**: `5,000,000` bytes (5 MB).
- **Current Prototype Behavior**: The browser reads the dropped file into an in-memory Base64 data URL via `FileReader.readAsDataURL(file)` and passes the string to form state.
- **Client Validation Error**: If `file.size > 5MB` or file type does not start with `image/`, displays inline error: `"Choose an image under 5 MB."`.

---

## 2. Production Storage & CDN Pipeline

In production, uploading raw Base64 strings to JSON endpoints degrades database performance and increases payload sizes by ~33%. The backend must implement a dedicated cloud object storage pipeline.

```text
1. Browser requests upload URL:
   POST /api/uploads/presigned { filename: "photo.jpg", contentType: "image/jpeg", size: 2150000 }
                           │
                           ▼
2. Server validates user auth and file constraints, then returns:
   { uploadUrl: "https://storage.googleapis.com/phiny-raw/...", publicUrl: "https://cdn.phiny.art/..." }
                           │
                           ▼
3. Browser uploads binary file directly to S3 / GCS via PUT request with progress indicator.
                           │
                           ▼
4. Server / Background Worker:
   - Validates image magic bytes (not just extension).
   - Strips dangerous EXIF GPS / camera metadata.
   - Computes width, height, and exact aspect ratio (height / width).
   - Generates responsive WebP derivatives (thumbnail 400w, medium 800w, full 1600w).
   - Serves cached assets via CDN with Cache-Control: public, max-age=31536000, immutable.
```

---

## 3. Presigned Upload Endpoint: `POST /api/uploads/presigned`

- **Method**: `POST`
- **Path**: `/api/uploads/presigned`
- **Purpose**: Generates a temporary, cryptographically signed URL permitting direct client upload to cloud storage.
- **Authentication**: Required.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "filename": "brutalist_facade.jpg",
    "contentType": "image/jpeg",
    "size": 3145728
  }
  ```
- **Validation Rules**:
  - `contentType`: Must be one of `["image/jpeg", "image/png", "image/webp"]`.
  - `size`: Integer. Must be `<= 5,000,000` bytes.
- **Successful Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "uploadUrl": "https://storage.googleapis.com/phiny-raw-uploads/u_948a9b2c/upload_1720000000.jpg?GoogleAccessId=...",
      "fileUrl": "https://cdn.phiny.art/posts/raw/upload_1720000000.webp",
      "expiresIn": 900
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (File too large):
    ```json
    { "success": false, "code": "FILE_TOO_LARGE", "error": "Maximum file size is 5 MB" }
    ```
  - `415 Unsupported Media Type`:
    ```json
    { "success": false, "code": "INVALID_IMAGE_TYPE", "error": "Only JPG, PNG, and WebP are allowed" }
    ```

---

## 4. Direct Multipart Upload Alternative: `POST /api/uploads`

If direct S3/GCS presigned URLs are not preferred, the backend can provide a server-proxied multipart endpoint:
- **Method**: `POST`
- **Path**: `/api/uploads`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: Form with binary file under key `file`.
- **Successful Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://cdn.phiny.art/posts/p_91823.webp",
      "ratio": 1.25,
      "width": 1200,
      "height": 1500
    }
  }
  ```
