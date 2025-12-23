# Change: Refactor ShareBottomSheet to Use useBottomSheet Hook

## Why
ShareBottomSheet currently has a manual implementation without the `useBottomSheet` hook, causing inconsistent behavior compared to PredictionDetail:
- No drag gestures or smooth animations
- Static height (55vh) instead of dynamic states
- Manual backdrop handling instead of hook-managed interactions
- Missing scroll-to-collapse functionality
- Opening/closing animations are less smooth
- No three-state system (collapsed/half-expanded/fully-expanded)

PredictionDetail works perfectly with the `useBottomSheet` hook, providing smooth drag interactions, physics-based animations, and intelligent scroll handling. ShareBottomSheet should match this behavior exactly.

## What Changes
- **MODIFIED**: ShareBottomSheet rewritten to use `useBottomSheet` hook (matching PredictionDetail pattern)
- **MODIFIED**: Replace manual state management with hook-managed state
- **MODIFIED**: Add three-state system (collapsed/half-expanded/fully-expanded)
- **MODIFIED**: Add drag gestures and smooth animations
- **MODIFIED**: Add scroll-to-collapse functionality
- **MODIFIED**: Improve opening/closing transitions
- **KEPT**: All existing share functionality (copy link, send to phone, social media options)

## Impact
- **Affected specs**: 
  - Modified capability: `ui-components` (share bottom sheet)
  - Modified capability: `user-interactions` (share gestures)
- **Affected code**:
  - `src/components/ShareBottomSheet.tsx` - Complete rewrite to use useBottomSheet hook
- **Breaking changes**: None - all changes are internal improvements, API remains the same
