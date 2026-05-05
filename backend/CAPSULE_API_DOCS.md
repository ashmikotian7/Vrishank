# Capsule API Documentation

## Overview
This API provides endpoints for creating and managing time capsules. Users can create capsules with messages, attachments, and schedule them to be unlocked at a future date.

## Base URL
```
http://localhost:8000/api/capsules/
```

## Authentication
All endpoints (except unlock) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. List/Create Capsules
- **GET** `/api/capsules/` - List user's capsules
- **POST** `/api/capsules/` - Create a new capsule

#### POST Request Body:
```json
{
  "title": "Our First Anniversary",
  "description": "A short description of this capsule...",
  "message": "Write your heartfelt message here...",
  "is_private": true,
  "pin_lock": "1234",
  "unlock_date": "2024-12-31T23:59:59Z",
  "timezone": "UTC",
  "recipient_emails": ["email@example.com", "friend@example.com"]
}
```

#### Response:
```json
{
  "id": 1,
  "title": "Our First Anniversary",
  "description": "A short description of this capsule...",
  "message": "Write your heartfelt message here...",
  "creator": "test@example.com",
  "is_private": true,
  "pin_lock": "1234",
  "unlock_date": "2024-12-31T23:59:59Z",
  "timezone": "UTC",
  "is_sealed": false,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "is_unlocked": false,
  "recipients": [],
  "attachments": []
}
```

### 2. Capsule Details
- **GET** `/api/capsules/{id}/` - Get capsule details
- **PUT** `/api/capsules/{id}/` - Update capsule (only if not sealed)
- **PATCH** `/api/capsules/{id}/` - Partially update capsule (only if not sealed)
- **DELETE** `/api/capsules/{id}/` - Delete capsule (only if not sealed)

### 3. Seal Capsule
- **POST** `/api/capsules/{id}/seal/` - Seal a capsule (prevents further modifications)

#### Response:
```json
{
  "message": "Capsule sealed successfully",
  "capsule": { /* capsule details */ }
}
```

### 4. Unlock Capsule
- **POST** `/api/capsules/{id}/unlock/` - Unlock a capsule (no authentication required)

#### Request Body:
```json
{
  "pin": "1234"  // Required only if capsule has PIN lock
}
```

### 5. User Capsules
- **GET** `/api/capsules/my-capsules/` - Get all capsules created by the user
- **GET** `/api/capsules/received-capsules/` - Get capsules shared with the user

### 6. File Attachments
- **POST** `/api/capsules/{id}/attachments/` - Upload file to capsule
- **DELETE** `/api/capsules/{id}/attachments/{attachment_id}/` - Delete attachment

#### Upload Request (multipart/form-data):
```
file: <file_data>
```

#### Upload Response:
```json
{
  "id": 1,
  "file_name": "photo.jpg",
  "file_path": "capsules/1/uuid-photo.jpg",
  "file_url": "http://localhost:8000/media/capsules/1/uuid-photo.jpg",
  "file_size": 1024000,
  "file_type": "image/jpeg",
  "uploaded_at": "2024-01-01T12:00:00Z"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Capsule title (max 200 chars) |
| description | string | No | Optional description |
| message | string | Yes | The main message content |
| is_private | boolean | No | Whether capsule is private (default: true) |
| pin_lock | string | No | 4-digit PIN for additional security |
| unlock_date | datetime | Yes | When capsule can be unlocked |
| timezone | string | No | Timezone for unlock date (default: UTC) |
| recipient_emails | array | No | List of recipient email addresses |

## Business Rules

1. **Sealed Capsules**: Once sealed, capsules cannot be modified or deleted
2. **Unlock Date**: Must be in the future when creating
3. **PIN Lock**: Must be exactly 4 digits if provided
4. **Private Capsules**: Only accessible to creator and specified recipients
5. **File Uploads**: Only allowed before sealing
6. **Access Control**: Users can only access their own capsules or capsules shared with them

## Error Responses

### 400 Bad Request
```json
{
  "error": "Cannot update a sealed capsule"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "error": "Capsule not found"
}
```

## Testing

Use the provided test script `test_capsule_api.py` to verify all functionality:

```bash
python test_capsule_api.py
```

Make sure the Django server is running on localhost:8000 before running the test.
