# Change: Refine UI Spacing and Mobile Layout

## Why
The current UI has several spacing issues that affect visual hierarchy and mobile experience:
- Extra spaces in prediction cards between elements
- Avatar sizes are too large
- Option cards in bottom sheet have poor design
- Time indicators are too large
- Web view doesn't properly constrain to mobile size
- Header and bottom nav extend beyond mobile width

## What Changes
- **Prediction Card Spacing**: Remove extra space between "..." button and title, reduce tag spacing
- **Avatar Sizing**: Make prediction avatars smaller
- **Bottom Sheet Options**: Redesign/remove option cards, make time text smaller
- **Mobile Layout**: Ensure web view stays mobile-sized with empty side space
- **Header/Bottom Nav**: Constrain to mobile width, don't extend full screen
- **General Margins**: Fix margins that don't fit mobile view

## Impact
- **Affected specs**: `ui-components`, `layout`
- **Affected code**:
  - `src/components/PredictionCard.tsx`
  - `src/components/PredictionDetail.tsx`
  - `src/components/Header.tsx`
  - `src/components/BottomNav.tsx`
  - `src/App.tsx`
  - `src/styles/globals.css`
- **Breaking changes**: None - visual improvements only
