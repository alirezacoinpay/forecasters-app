# Backend API Coordination: Question to Prediction Rename

## Overview
This document outlines all backend API changes required to support the frontend rename from "question" to "prediction" terminology.

## Critical: Backend Must Update Before Frontend Deployment

**⚠️ IMPORTANT**: The frontend has been updated to use the new naming conventions. The backend MUST be updated to match before deploying the frontend changes, or the application will break.

## Required API Endpoint Changes

### 1. Base Endpoints
| Old Endpoint | New Endpoint | Method | Notes |
|-------------|--------------|--------|-------|
| `/questions` | `/predictions` | POST | Create new prediction |
| `/questions/:id` | `/predictions/:id` | GET | Get prediction by ID |
| `/questions/:id` | `/predictions/:id` | PUT | Update prediction |
| `/questions/:questionId/comments` | `/predictions/:predictionId/comments` | GET | Get comments for a prediction |

### 2. Request Payload Changes

#### Create Prediction (POST `/predictions`)
**No changes needed** - The payload structure remains the same, only the endpoint URL changes.

#### Submit Prediction Option (POST `/predictions`)
**Field name changes required:**
```json
// OLD
{
  "question_option_id": 7,
  "comment": {
    "text": "...",
    "file": <File>
  }
}

// NEW
{
  "prediction_option_id": 7,
  "comment": {
    "text": "...",
    "file": <File>
  }
}
```

#### Add Comment (POST `/comments`)
**Field name changes required:**
```json
// OLD
{
  "question_id": 5,
  "text": "Comment text",
  "file": <File>,
  "parent_id": null
}

// NEW
{
  "prediction_id": 5,
  "text": "Comment text",
  "file": <File>,
  "parent_id": null
}
```

#### Share Prediction (POST `/share/sms`)
**Field name changes required:**
```json
// OLD
{
  "question_id": 5,
  "mobile": "09386801868"
}

// NEW
{
  "prediction_id": 5,
  "mobile": "09386801868"
}
```

### 3. Response Payload Changes

#### Prediction Response
**Field name changes required:**
```json
// OLD
{
  "id": 1,
  "title": "...",
  "questionOptions": [...],
  "questionForwardCount": 10,
  ...
}

// NEW
{
  "id": 1,
  "title": "...",
  "predictionOptions": [...],
  "predictionForwardCount": 10,
  ...
}
```

#### Prediction Option Response
**Field name changes required:**
```json
// OLD
{
  "id": 1,
  "title": "Option 1",
  "question_id": 5,
  "is_true": 0,
  "userPredictionsCount": 10
}

// NEW
{
  "id": 1,
  "title": "Option 1",
  "prediction_id": 5,
  "is_true": 0,
  "userPredictionsCount": 10
}
```

#### Comment Response
**Field name changes required:**
```json
// OLD
{
  "id": 123,
  "user_id": 1,
  "question_id": 5,
  "parent_id": null,
  "text": "Comment text",
  ...
}

// NEW
{
  "id": 123,
  "user_id": 1,
  "prediction_id": 5,
  "parent_id": null,
  "text": "Comment text",
  ...
}
```

### 4. Activity Logging Metadata

**Field name changes in activity metadata:**
```json
// OLD
{
  "action": "prediction_submit",
  "meta": {
    "question_id": 5,
    "question_option_id": 7
  }
}

// NEW
{
  "action": "prediction_submit",
  "meta": {
    "prediction_id": 5,
    "prediction_option_id": 7
  }
}
```

## Migration Strategy

### Option 1: Complete Migration (Recommended)
1. Update all backend endpoints and field names
2. Deploy backend changes
3. Deploy frontend changes
4. **No backward compatibility needed**

### Option 2: Gradual Migration with Backward Compatibility
If immediate complete migration is not possible, backend can temporarily accept both field names:

```php
// Example: Accept both old and new field names
$predictionId = $request->input('prediction_id') ?? $request->input('question_id');
$predictionOptionId = $request->input('prediction_option_id') ?? $request->input('question_option_id');
```

**Response should always use new field names** to ensure frontend compatibility.

## Testing Checklist for Backend Team

- [ ] Test POST `/predictions` endpoint (create prediction)
- [ ] Test GET `/predictions/:id` endpoint (get prediction)
- [ ] Test PUT `/predictions/:id` endpoint (update prediction)
- [ ] Test POST `/predictions` with `prediction_option_id` (submit prediction)
- [ ] Test POST `/comments` with `prediction_id` (add comment)
- [ ] Test GET `/predictions/:predictionId/comments` (get comments)
- [ ] Test POST `/share/sms` with `prediction_id` (share prediction)
- [ ] Verify response includes `predictionOptions` (not `questionOptions`)
- [ ] Verify response includes `predictionForwardCount` (not `questionForwardCount`)
- [ ] Verify prediction options include `prediction_id` (not `question_id`)
- [ ] Verify comments include `prediction_id` (not `question_id`)
- [ ] Test activity logging with `prediction_id` and `prediction_option_id`

## Database Schema Considerations

If the database schema uses `question_id` column names, you may need to:
1. Add database migrations to rename columns (if desired)
2. Or use aliases in queries to map `question_id` → `prediction_id` in responses
3. Update any foreign key constraints and indexes

## Timeline Coordination

**Recommended deployment order:**
1. **Week 1**: Backend team updates API endpoints and field names
2. **Week 1**: Backend team deploys changes to staging environment
3. **Week 2**: Frontend team tests against staging backend
4. **Week 2**: Both teams coordinate production deployment

## Questions for Backend Team

1. What is the estimated timeline for implementing these changes?
2. Will you maintain backward compatibility during migration?
3. Are there any database migrations required?
4. Are there any other services/APIs that depend on the old naming that need coordination?
5. Should we schedule a joint testing session after backend changes are deployed?

## Support

For questions or clarifications, please refer to:
- Frontend proposal: `openspec/changes/rename-question-to-prediction/proposal.md`
- Design document: `openspec/changes/rename-question-to-prediction/design.md`
- This coordination document: `openspec/changes/rename-question-to-prediction/BACKEND_COORDINATION.md`

