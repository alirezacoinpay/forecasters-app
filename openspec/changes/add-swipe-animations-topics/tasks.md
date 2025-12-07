## Phase 1: Swipe Animation Infrastructure
- [x] 1.1 Enhance useSwipe hook to track swipe progress and direction
- [x] 1.2 Add animation state management (swiping, direction, progress)
- [x] 1.3 Create animation utilities for slide transitions

## Phase 2: Header Swipe Animations
- [x] 2.1 Add swipe gesture detection to Header component
- [x] 2.2 Implement slide animation for topic label changes
- [x] 2.3 Add visual feedback during swipe (opacity, transform)
- [x] 2.4 Ensure smooth transition between topics

## Phase 3: FeedView Swipe Animations
- [x] 3.1 Add slide animation container to FeedView
- [x] 3.2 Implement content slide-out/slide-in on swipe
- [x] 3.3 Add loading state during topic change
- [x] 3.4 Ensure predictions animate smoothly

## Phase 4: Topic API Integration
- [x] 4.1 Create Topic type/interface
- [x] 4.2 Create topicService with fetchTopics method
- [x] 4.3 Create TopicRepository for data handling
- [x] 4.4 Add topic API endpoint integration

## Phase 5: Topic Caching
- [x] 5.1 Create useTopics hook with caching
- [x] 5.2 Implement in-memory cache for topics
- [x] 5.3 Add cache invalidation strategy
- [x] 5.4 Handle loading and error states

## Phase 6: Topic-Based Feed Filtering
- [x] 6.1 Update usePredictionFeed to accept topic_id parameter
- [x] 6.2 Update PredictionRepository to support topic_id filter (via service params)
- [x] 6.3 Update FeedView to pass topic_id when fetching
- [x] 6.4 Handle topic changes and refetch predictions

## Phase 7: Integration
- [x] 7.1 Replace mock categories with real topics in App.tsx
- [x] 7.2 Connect swipe handlers to topic changes
- [x] 7.3 Update Header to display fetched topics
- [x] 7.4 Test end-to-end swipe flow with animations

## Phase 8: Polish & Optimization
- [x] 8.1 Optimize animation performance (will-change, transform3d)
- [x] 8.2 Add transition timing adjustments (300ms cubic-bezier)
- [x] 8.3 Ensure smooth animations on all devices
- [x] 8.4 Test edge cases (rapid swipes, network errors)
