# Design: Prediction Deep Link Support

## Context
Users need to share predictions via URL links. When someone clicks a shared link, they should see the specific prediction at the top of the feed. The topic should be automatically determined from the prediction's data, and the header should update accordingly. This feature requires coordination between URL parsing, API calls, state management, and UI updates.

## Goals
- Enable sharing predictions via URL with prediction ID
- Display shared prediction at top of feed when link is clicked
- Automatically detect and set topic from prediction data
- Handle all edge cases gracefully (invalid IDs, not found, network errors)
- Maintain smooth UX during loading and state transitions

## Non-Goals
- URL routing with React Router (using query parameters instead)
- Prediction highlighting or scrolling (can be added later)
- Share link generation UI (assumes links are generated elsewhere)
- Deep linking to other resources (only predictions)

## Decisions

### Decision: URL Parameter Format
**What**: Use query parameters (`?prediction=123` or `?predictionId=123`) instead of path-based routing.

**Why**: 
- Simpler implementation without React Router
- Easier to share and parse
- Works with current SPA structure
- Backward compatible with existing URLs

**Alternatives considered**:
- Path-based routing (`/prediction/123`) - Would require React Router setup
- Hash-based (`#prediction=123`) - Less standard, harder to share

### Decision: Topic Detection Timing
**What**: Detect topic from prediction data after API response, then update header.

**Why**:
- Topic is not known until prediction data is received
- Ensures accurate topic selection
- Prevents showing wrong topic initially

**Alternatives considered**:
- Require topic in URL - Adds complexity, less user-friendly
- Guess topic before API call - Could be wrong, poor UX

### Decision: State Management Approach
**What**: Use local state in App component for prediction ID, pass down to FeedView and hook.

**Why**:
- Simple and straightforward
- No need for global state management
- Easy to clear after processing
- Fits current architecture

**Alternatives considered**:
- Context API - Overkill for single value
- URL state only - Harder to manage transitions

### Decision: Error Handling Strategy
**What**: Fall back to default feed if prediction not found, show error message.

**Why**:
- User still sees content (better than blank page)
- Clear feedback about what went wrong
- Graceful degradation

**Alternatives considered**:
- Show only error page - Poor UX, user sees nothing
- Retry automatically - Could loop indefinitely

### Decision: URL Cleaning
**What**: Optionally clear prediction ID from URL after successful load (to clean URL).

**Why**:
- Keeps URL clean after processing
- Prevents re-triggering on refresh
- Better UX for sharing

**Alternatives considered**:
- Keep URL as-is - Could cause confusion on refresh
- Always clear - Loses ability to refresh with same link

## Implementation Flow

1. **App Initialization**
   - Parse URL for prediction ID
   - Store in state
   - Pass to FeedView

2. **Feed Loading**
   - FeedView receives prediction ID
   - Passes to usePredictionFeed hook
   - Hook includes in API parameters
   - API returns predictions with shared one at top

3. **Topic Detection**
   - Extract topic_id from first prediction (the shared one)
   - Update selectedTopicId in App
   - Header automatically updates via props

4. **State Cleanup**
   - Optionally clear URL parameter
   - Maintain topic selection
   - Continue normal feed operations

## Risks / Trade-offs

### Risk: Race Condition Between Topic and Prediction Loading
**Mitigation**: 
- Show loading state in header until topic is determined
- Prevent topic switching during deep link load
- Use proper state synchronization

### Risk: Prediction Not Found
**Mitigation**:
- Show error message
- Fall back to default feed
- Handle gracefully without breaking app

### Risk: Topic Not in Topics List
**Mitigation**:
- Show default topic or "..."
- Log warning in dev mode
- Feed still works correctly

### Risk: URL Parameter Persistence
**Mitigation**:
- Optionally clear after load
- Handle browser navigation properly
- Re-parse on URL changes

## State Flow Diagram

```
URL: ?prediction=123
  ↓
App: Parse & Store predictionId
  ↓
FeedView: Receive predictionId
  ↓
usePredictionFeed: Include in API params
  ↓
API: Return predictions (123 at top)
  ↓
Extract topic_id from prediction 123
  ↓
Update selectedTopicId in App
  ↓
Header: Display topic name
  ↓
Feed: Display predictions (123 at top, rest below)
```

## Open Questions
- Should we clear the URL parameter after load? (Decision: Optional, default yes)
- Should we highlight the shared prediction? (Decision: Not in scope, can add later)
- Should we scroll to the shared prediction? (Decision: Not in scope, can add later)
- What happens if user switches topic while deep link is loading? (Decision: Prevent switching during load)
