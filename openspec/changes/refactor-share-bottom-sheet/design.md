# Design: Refactor ShareBottomSheet to Use useBottomSheet Hook

## Context
ShareBottomSheet was converted from ShareModal but doesn't use the `useBottomSheet` hook that makes PredictionDetail work so smoothly. The current implementation has manual state management, static height, and lacks drag gestures, causing inconsistent UX.

## Goals
1. Make ShareBottomSheet behave exactly like PredictionDetail
2. Use the same `useBottomSheet` hook for consistency
3. Provide smooth drag gestures and animations
4. Support three-state system (collapsed/half-expanded/fully-expanded)
5. Enable scroll-to-collapse functionality

## Non-Goals
- Changing share functionality or features
- Adding new share options
- Modifying the share API or data flow

## Decisions

### 1. Hook Configuration
**Decision**: Use `useBottomSheet` hook with heights optimized for share content.

**Rationale**: 
- ShareBottomSheet has less content than PredictionDetail
- Smaller heights provide better UX for quick share actions
- Still maintains three-state system for flexibility

**Configuration**:
- `collapsedHeight`: 30vh (minimal view, just enough to see it's share)
- `halfExpandedHeight`: 60vh (comfortable viewing, default state)
- `fullyExpandedHeight`: 85vh (full content access with scrolling)
- `closeThreshold`: 25vh (easy to dismiss)
- `velocityThreshold`: 0.5 px/ms (same as PredictionDetail for consistency)

### 2. Component Structure
**Decision**: Match PredictionDetail's structure exactly.

**Rationale**:
- Proven pattern that works well
- Consistent codebase structure
- Easier to maintain and understand

**Structure**:
- Backdrop overlay with opacity transition
- Container with drag handle at top
- Header with close button
- Scrollable content area
- Same content sections (link, phone, social)

### 3. Animation Pattern
**Decision**: Use same `isVisible` state pattern as PredictionDetail.

**Rationale**:
- Smooth opening/closing animations
- Proper timing with backdrop fade
- Consistent UX across bottom sheets

**Pattern**:
- `isVisible` state starts as `false`, set to `true` in `useEffect`
- Backdrop opacity transitions based on `isVisible`
- Container transform transitions based on `isVisible` and `isDragging`
- Close handler sets `isVisible` to `false`, then calls `onClose` after delay

### 4. Event Handling
**Decision**: Use hook's event handlers with same pattern as PredictionDetail.

**Rationale**:
- Hook manages all gesture logic
- Prevents conflicts between drag and scroll
- Handles interactive element detection automatically

**Handlers**:
- Container uses `onMouseDown` and `onTouchStart` from hook
- Content area uses `contentRef` for scroll detection
- Interactive elements (buttons, inputs) automatically excluded from drag

## Risks / Trade-offs

### Risk: Content Height Issues
**Risk**: ShareBottomSheet content might not fit well in three-state system.
**Mitigation**: Test with various content lengths, adjust heights if needed.

### Risk: Scroll Conflicts
**Risk**: Drag gestures might interfere with content scrolling.
**Mitigation**: Hook already handles this with scroll detection and threshold logic.

### Risk: Opening/Closing Timing
**Risk**: Animation timing might feel off compared to PredictionDetail.
**Mitigation**: Use exact same pattern and timing constants.

## Implementation Notes

1. **Remove Manual State**: Delete `isClosing` ref and manual backdrop handling
2. **Hook Integration**: Import and configure hook at component start
3. **Structure Match**: Copy PredictionDetail's container/content structure
4. **Event Handlers**: Use hook's handlers, add same conditional logic for content area
5. **Styling**: Match PredictionDetail's transition and transform styles
6. **Testing**: Compare side-by-side with PredictionDetail to ensure consistency
