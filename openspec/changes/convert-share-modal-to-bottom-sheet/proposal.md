# Change: Convert Share Modal to Bottom Sheet

## Why
The current ShareModal uses a centered modal dialog which is inconsistent with the PredictionDetail component that uses a bottom sheet. Converting ShareModal to a bottom sheet will:
- Provide consistent UX across the application
- Better mobile experience with native-like bottom sheet gestures
- Allow users to drag and interact with the share interface naturally
- Match the existing bottom sheet pattern already established in PredictionDetail

## What Changes
- **MODIFIED**: ShareModal component converted to ShareBottomSheet using `useBottomSheet` hook
- **MODIFIED**: Share functionality moved from modal to bottom sheet with drag gestures
- **MODIFIED**: PredictionCard forward button now opens bottom sheet instead of modal
- **KEPT**: All existing share functionality (copy link, send to phone, social media options)

## Impact
- **Affected specs**: 
  - Modified capability: `ui-components` (share interface)
  - Modified capability: `user-interactions` (share actions)
- **Affected code**:
  - `src/components/ShareModal.tsx` - Convert to ShareBottomSheet
  - `src/components/PredictionCard.tsx` - Update to use ShareBottomSheet
  - Any other components using ShareModal
