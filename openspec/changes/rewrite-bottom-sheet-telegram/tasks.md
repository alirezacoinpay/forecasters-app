## 1. Core Hook Implementation
- [x] 1.1 Create useBottomSheet hook with state management
- [x] 1.2 Implement three-state system (collapsed, half-expanded, fully-expanded)
- [x] 1.3 Add drag gesture handling (mouse and touch)
- [x] 1.4 Implement velocity tracking for momentum
- [x] 1.5 Add snap point calculation and auto-snap
- [x] 1.6 Implement rubber band resistance at boundaries

## 2. Scroll Integration
- [x] 2.1 Detect scroll position and top boundary
- [x] 2.2 Implement scroll-to-collapse when at top
- [x] 2.3 Handle wheel events for scroll-to-collapse
- [x] 2.4 Disable scrolling when between states
- [x] 2.5 Enable scrolling only when fully expanded

## 3. Component Rewrite
- [x] 3.1 Refactor PredictionDetail to use useBottomSheet hook
- [x] 3.2 Remove old drag logic from component
- [x] 3.3 Update event handlers to use hook handlers
- [x] 3.4 Ensure button clicks work (drag threshold)
- [x] 3.5 Maintain all existing functionality (prediction display, comments, etc.)

## 4. Gesture Refinement
- [x] 4.1 Add drag threshold to prevent accidental drags
- [x] 4.2 Implement proper touch event handling
- [x] 4.3 Add mouse event handling for desktop
- [x] 4.4 Prevent default behaviors appropriately
- [x] 4.5 Ensure interactive elements still work

## 5. Animation & Physics
- [x] 5.1 Implement smooth cubic-bezier transitions
- [x] 5.2 Add velocity-based closing
- [x] 5.3 Implement height threshold closing
- [x] 5.4 Add rubber band effect at boundaries
- [x] 5.5 Ensure no transitions during active drag

## 6. Testing & Polish
- [x] 6.1 Test drag from anywhere on sheet
- [x] 6.2 Test scroll-to-collapse behavior
- [x] 6.3 Test button click interactions
- [x] 6.4 Test all three states and transitions
- [x] 6.5 Verify smooth animations

## Implementation Status
✅ **COMPLETE** - All tasks implemented and tested. The bottom sheet now behaves exactly like Telegram's sticker panel.

## Additional Refinements Completed
- [x] Improved listener attachment logic for better threshold detection
- [x] Enhanced touch event handling to prevent scroll conflicts
- [x] Fixed dependency arrays for proper callback updates
- [x] Optimized event listener management
