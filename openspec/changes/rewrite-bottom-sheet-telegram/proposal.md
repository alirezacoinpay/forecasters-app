# Change: Rewrite Bottom Sheet to Match Telegram Sticker Panel Behavior

## Why
The existing bottom sheet component (`PredictionDetail`) has basic drag functionality but lacks the smooth, physics-based interactions found in modern mobile apps like Telegram. Users expect natural gesture handling where dragging and scrolling work seamlessly together, with the sheet responding intelligently to user input.

## What Changes
- **Complete rewrite** of `PredictionDetail.tsx` to use new `useBottomSheet` hook
- **New hook created**: `useBottomSheet.ts` - Manages all gesture logic, state transitions, and scroll handling
- **Three-state system**: collapsed (50vh), half-expanded (75vh), fully-expanded (95vh)
- **Fully draggable**: Entire sheet surface is draggable, not just handle
- **Scroll-to-collapse**: When at top of content and scrolling down, sheet collapses
- **Physics-based animations**: Rubber band resistance, velocity-based momentum, smooth snap points
- **Smart scroll management**: Scrolling only enabled when fully expanded, disabled during transitions

## Impact
- **Affected specs**: New capability - `bottom-sheet-gestures`, `ui-components`
- **Affected code**: 
  - `src/components/PredictionDetail.tsx` - Complete rewrite
  - `src/hooks/useBottomSheet.ts` - New file created
- **Breaking changes**: None - all changes are internal improvements, API remains the same
