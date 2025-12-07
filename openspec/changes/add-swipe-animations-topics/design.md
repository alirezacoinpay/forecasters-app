# Design: Swipe Animations and Topic-Based Feed

## Context
Currently, the app uses mock categories and basic swipe detection. We need to:
1. Add smooth Reddit-like swipe animations
2. Fetch real topics from API
3. Filter predictions by topic
4. Cache topics for performance

## Goals
- Smooth, responsive swipe animations
- Real-time topic data from API
- Efficient topic caching
- Seamless topic-based feed filtering

## Non-Goals
- Complex gesture recognition (keep simple swipe)
- Offline topic storage (in-memory cache only)
- Topic management UI (just display and swipe)

## Key Decisions

### 1. Animation Approach
- **Decision**: Use CSS transforms with React state for animations
- **Rationale**: Better performance than JS animations, easier to control
- **Trade-off**: Slightly more complex state management

### 2. Topic Caching
- **Decision**: In-memory cache with React context/hook
- **Rationale**: Topics don't change frequently, simple cache is sufficient
- **Trade-off**: Cache lost on page refresh (acceptable)

### 3. Swipe Animation Timing
- **Decision**: 300ms transition duration
- **Rationale**: Fast enough to feel responsive, slow enough to see transition
- **Trade-off**: May feel slow on very fast swipes

### 4. Feed Loading Strategy
- **Decision**: Show loading state during topic change, clear old predictions
- **Rationale**: Clear user feedback, prevents confusion
- **Trade-off**: Brief empty state during transition

## Implementation Plan

### Step 1: Animation Infrastructure
- Enhance `useSwipe` to track swipe progress
- Add animation state (isSwiping, direction, progress)
- Create animation CSS classes

### Step 2: Header Animations
- Add swipe handlers to Header
- Animate topic label slide
- Show next/previous topic during swipe

### Step 3: FeedView Animations
- Wrap predictions in animated container
- Slide out old content, slide in new
- Show loading skeleton during transition

### Step 4: Topic API
- Create topic service and repository
- Define Topic interface matching API
- Handle API response structure

### Step 5: Topic Cache
- Create `useTopics` hook
- Implement simple in-memory cache
- Add loading/error states

### Step 6: Feed Integration
- Update feed to accept topic_id
- Refetch on topic change
- Clear old predictions during transition

## Risks & Mitigations

### Risk: Animation Performance
- **Mitigation**: Use CSS transforms, will-change property, limit re-renders

### Risk: API Latency
- **Mitigation**: Cache topics, show loading states, optimistic UI updates

### Risk: Rapid Swipes
- **Mitigation**: Debounce swipe handlers, prevent multiple simultaneous requests

## Migration Plan
1. Add animations (non-breaking)
2. Add topic API (backward compatible with mocks)
3. Switch to real topics (remove mock dependency)
4. Add topic filtering (enhancement)
