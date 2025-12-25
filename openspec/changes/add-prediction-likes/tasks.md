## 1. API Integration
- [x] 1.1 Add `LikePredictionResponse` type to `src/types/api.ts`
- [x] 1.2 Add `likePrediction(predictionId)` method to `src/services/predictionService.service.ts`
- [x] 1.3 Document required backend API endpoint in comments (POST `/predictions/:id/like`)
- [x] 1.4 Add activity logging for prediction likes in `activityService.service.ts`

## 2. Prediction Model Updates
- [x] 2.1 Add `likesCount: number` property to `Prediction` class in `src/models/Prediction.ts`
- [x] 2.2 Add `isLiked: boolean` property to `Prediction` class
- [x] 2.3 Update constructor to map backend `likes_count` and `is_liked` (or similar) fields
- [x] 2.4 Update `fromArray` method to handle new properties

## 3. PredictionCard Component
- [x] 3.1 Import `Heart` icon from `lucide-react`
- [x] 3.2 Add like button in the actions section (next to forward and comment buttons)
- [x] 3.3 Display like count using `formatCount` utility
- [x] 3.4 Implement optimistic UI update for like/unlike
- [x] 3.5 Add visual state for liked predictions (filled heart with red color)
- [x] 3.6 Handle click event with `stopPropagation` to prevent card click
- [x] 3.7 Add loading state during API call
- [x] 3.8 Add error handling with toast notifications

## 4. PredictionDetail Component
- [x] 4.1 Import `Heart` icon from `lucide-react`
- [x] 4.2 Add like button in the header section (next to user info)
- [x] 4.3 Display like count
- [x] 4.4 Implement optimistic UI update for like/unlike
- [x] 4.5 Add visual state for liked predictions (filled heart with red color)
- [x] 4.6 Handle click event
- [x] 4.7 Add loading state during API call
- [x] 4.8 Add error handling with toast notifications
- [x] 4.9 Update prediction state after successful like/unlike

## 5. State Management
- [x] 5.1 Implement local state for like status in PredictionCard
- [x] 5.2 Implement local state for like status in PredictionDetail
- [x] 5.3 Handle state synchronization when prediction data updates
- [x] 5.4 Consider prop drilling or context if needed for state sharing

## 6. Styling & UX
- [x] 6.1 Style like button to match existing action buttons (rounded-full, border-gray-300)
- [x] 6.2 Add hover and active states
- [x] 6.3 Ensure heart icon size matches other icons (w-4 h-4)
- [x] 6.4 Add smooth transition for like state change
- [x] 6.5 Ensure proper spacing in actions section
- [x] 6.6 Test touch interactions on mobile

## 7. Validation
- [ ] 7.1 Test like button in PredictionCard
- [ ] 7.2 Test like button in PredictionDetail
- [ ] 7.3 Test optimistic UI updates
- [ ] 7.4 Test error handling and rollback
- [ ] 7.5 Test like count updates correctly
- [ ] 7.6 Test visual state (filled/unfilled heart)
- [ ] 7.7 Test that backend `is_liked` parameter correctly sets initial state
- [ ] 7.8 Test activity logging
