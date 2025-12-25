# Design: API Integration for Feed Page Actions

## Context
The application needs to integrate with the backend API for all user interactions on the feed page. Currently, many actions are mocked with TODOs. The Postman collection provides the API contract, but some endpoints are missing and need to be identified for backend implementation.

## Goals
- Integrate all feed page actions with real API calls
- Maintain optimistic UI updates for better UX
- Handle errors gracefully with proper user feedback
- Support file uploads for prediction comments
- Track user activity for analytics

## Non-Goals
- Authentication flow (already handled)
- Real-time updates (future enhancement)
- Offline support (future enhancement)

## Decisions

### Decision: Use FormData for Prediction Submission
**Rationale**: The Postman collection shows POST `/predictions` uses formdata with `prediction_option_id`, `comment[text]`, and `comment[file]`. This matches Laravel's form data handling.

**Alternatives Considered**:
- JSON with base64 file encoding - Rejected: More complex, larger payload
- Separate file upload endpoint - Rejected: Requires two API calls, more complex state management

### Decision: Optimistic Updates for Comments
**Rationale**: Comment likes and additions should update UI immediately for better UX, with rollback on error.

**Implementation**:
- Update local state immediately
- Make API call in background
- Revert state if API call fails
- Show error toast on failure

### Decision: Activity Logging Service
**Rationale**: Activity logs are sent with specific headers (device-type, X-Platform) and should be centralized.

**Implementation**:
- Create dedicated `activityService` for consistency
- Include headers as per Postman spec
- Fire-and-forget approach (don't block UI)

### Decision: Missing Comment Endpoints
**Rationale**: Postman collection doesn't include comment endpoints, but they're needed for functionality.

**Backend Requirements**:
1. POST `/comments` - Body: `{ prediction_id, text, file?, parent_id? }`
2. POST `/comments/:commentId/like` or PUT `/comments/:commentId/like` - Toggle like

**Alternative**: Use existing endpoints if they exist but aren't documented in Postman.

## API Endpoint Mapping

### Existing Endpoints (from Postman)
- ✅ GET `/prediction-feed` - Already implemented
- ✅ GET `/predictions/:predictionId` - Already implemented
- ✅ POST `/predictions` - Needs implementation
- ✅ GET `/me` - Needs implementation
- ✅ PUT `/edit-profile` - Needs implementation
- ✅ POST `/activity` - Needs implementation
- ✅ GET `/topics` - Already implemented
- ✅ GET `/categories` - Already implemented

### Missing Endpoints (Need Backend Implementation)
- ❌ POST `/comments` - Add comment
- ❌ POST `/comments/:commentId/like` - Like comment
- ❌ GET `/predictions/:predictionId/comments` - Get comments (if not included in prediction detail)

## Data Flow

### Prediction Submission Flow
```
User selects option → Click submit → 
  → Show loading toast
  → Create FormData with prediction_option_id, comment[text], comment[file]
  → POST /predictions
  → On success: Close modal, refresh feed, show success toast
  → On error: Show error toast, keep modal open
```

### Comment Like Flow
```
User clicks like → 
  → Optimistic update (toggle like state, update count)
  → POST /comments/:commentId/like
  → On success: Keep optimistic state
  → On error: Revert optimistic state, show error toast
```

### Add Comment Flow
```
User types comment → Click submit →
  → Show loading state
  → POST /comments with { prediction_id, text, file?, parent_id? }
  → On success: Add comment to list, clear input, show success
  → On error: Show error toast, keep input
```

## Error Handling Strategy

### Network Errors
- Show generic "اتصال اینترنت را بررسی کنید" message
- Allow retry for critical actions

### Validation Errors (400)
- Show field-specific errors if provided
- Show generic validation error otherwise

### Authentication Errors (401)
- Redirect to login (handled by axios interceptor)
- Clear local state

### Server Errors (500)
- Show generic "خطای سرور" message
- Log error for debugging

## Risks / Trade-offs

### Risk: Missing Backend Endpoints
**Mitigation**: Document required endpoints clearly, coordinate with backend team before implementation

### Risk: File Upload Size Limits
**Mitigation**: Add client-side validation for file size, show clear error messages

### Risk: Optimistic Updates Causing Inconsistency
**Mitigation**: Always revert on error, consider adding version/timestamp checks

### Trade-off: Activity Logging Performance
**Decision**: Use fire-and-forget, don't block UI. If logging fails, silently continue.

## Migration Plan

### Phase 1: Feed Page Priority (Current)
1. Implement prediction submission
2. Implement comment interactions
3. Add activity logging

### Phase 2: Profile Integration
1. Implement current user fetch
2. Implement profile editing

### Phase 3: Polish & Testing
1. Comprehensive testing
2. Error handling improvements
3. Performance optimization

## Open Questions

1. **Comment Endpoints**: Do comment endpoints exist but aren't in Postman? Need to verify with backend team.
2. **File Upload Limits**: What are the size and type restrictions for comment files?
3. **Comment Pagination**: Should comments be paginated or loaded all at once?
4. **Activity Log Batching**: Should multiple activities be batched or sent individually?
