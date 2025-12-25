# Backend API Modifications Required

## Overview
This document outlines the backend API endpoints that are missing from the Postman collection but are required for full functionality of the feed page and user interactions.

## Missing Endpoints

### 1. Add Comment
**Endpoint**: `POST /comments`

**Request Body** (FormData or JSON):
```json
{
  "prediction_id": 5,
  "text": "This is a comment",
  "file": <File> (optional),
  "parent_id": null (optional, for replies)
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": 1,
    "prediction_id": 5,
    "parent_id": null,
    "text": "This is a comment",
    "file": "path/to/file.jpg",
    "time_past": "2 minutes ago",
    "user": {
      "username": "user123",
      "mobile": "09386801868"
    },
    "likesCount": 0,
    "childrenCount": 0
  },
  "message": "Comment added successfully"
}
```

**Notes**:
- If `parent_id` is provided, this is a reply to an existing comment
- File upload should support images and other media types
- Should return the created comment with all necessary fields for display

---

### 2. Like/Unlike Comment
**Endpoint**: `POST /comments/:commentId/like` or `PUT /comments/:commentId/like`

**Request**: No body required (or empty body)

**Response**:
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 5
  },
  "message": "Comment liked successfully"
}
```

**Alternative Approach**: If using PUT, the endpoint could toggle the like state. If the comment is already liked, it unlikes it.

**Notes**:
- Should toggle the like state (if already liked, unlike it)
- Should return the new like count
- Should handle duplicate likes gracefully (idempotent)

---

### 3. Get Comments (Optional Enhancement)
**Endpoint**: `GET /predictions/:predictionId/comments`

**Query Parameters**:
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 123,
        "user_id": 1,
        "prediction_id": 5,
        "parent_id": null,
        "text": "Comment text",
        "file": null,
        "time_past": "2 minutes ago",
        "user": {
          "username": "user123",
          "mobile": "09386801868"
        },
        "likesCount": 5,
        "childrenCount": 2,
        "children": [
          {
            "id": 124,
            "parent_id": 123,
            "text": "Reply text",
            ...
          }
        ]
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 20,
      "last_page": 1,
      "total": 1
    }
  }
}
```

**Notes**:
- This endpoint is optional if comments are already included in the prediction detail response
- Should support nested replies (children)
- Should include pagination metadata

---

## Existing Endpoints Verification

### POST /predictions
**Current Postman Spec**: ✅ Exists

**Verification Needed**:
- Confirm that `comment[text]` and `comment[file]` are properly handled
- Verify that the response includes the created prediction with updated counts
- Confirm file upload size limits and supported file types

**Expected Response Enhancement**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "prediction_id": 5,
    "prediction_option_id": 7,
    "comment": {
      "id": 456,
      "text": "Comment text",
      "file": "path/to/file.jpg"
    },
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Prediction submitted successfully"
}
```

---

## Authentication & Authorization

All endpoints should:
- Require Bearer token authentication (except public endpoints)
- Return 401 if token is invalid or expired
- Return 403 if user doesn't have permission

---

## Error Response Format

All endpoints should return errors in this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `422` - Unprocessable entity
- `500` - Server error

---

## Testing Recommendations

1. **Comment Endpoints**:
   - Test adding comment with and without file
   - Test replying to comments (nested structure)
   - Test like/unlike toggle functionality
   - Test error cases (invalid prediction_id, unauthorized access)

2. **File Upload**:
   - Test various file types (images, documents)
   - Test file size limits
   - Test file validation errors

3. **Pagination**:
   - Test comment pagination if implemented
   - Test edge cases (empty pages, large datasets)

---

## Priority

**High Priority** (Required for feed page functionality):
1. ✅ POST /comments - Add comment
2. ✅ POST /comments/:commentId/like - Like comment

**Medium Priority** (Enhancement):
3. GET /predictions/:predictionId/comments - Get comments (if not in prediction detail)

**Low Priority** (Future):
- Comment editing
- Comment deletion
- Comment reporting

---

## Questions for Backend Team

1. Do comment endpoints already exist but aren't documented in Postman?
2. What are the file size and type restrictions for comment file uploads?
3. Should comments be paginated or loaded all at once?
4. What is the maximum nesting depth for comment replies?
5. Should comment likes be real-time or can they be eventually consistent?
