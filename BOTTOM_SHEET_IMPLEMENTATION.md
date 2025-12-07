# Telegram-Style Bottom Sheet Implementation

## Overview
The bottom sheet component (`PredictionDetail.tsx`) has been completely rewritten to behave like Telegram's sticker panel with smooth, physics-based interactions.

## Key Features Implemented

### 1. **Fully Draggable from Anywhere**
- The entire sheet surface is draggable, not just the handle
- Drag threshold of 5px prevents accidental drags when clicking buttons
- Interactive elements (buttons, links, inputs) still work normally

### 2. **Three States**
- **Collapsed** (50vh): Minimal view
- **Half-Expanded** (75vh): Default/balanced view  
- **Fully-Expanded** (95vh): Full content view with scrolling enabled

### 3. **Smooth Drag Interactions**
- Drag upward expands smoothly to full height
- Drag downward collapses smoothly
- Rubber band resistance at boundaries (15% overshoot damping)
- Velocity-based momentum for natural feel

### 4. **Scroll-to-Collapse**
- When fully expanded and at top of content, scrolling down collapses the sheet
- Wheel events at top boundary trigger collapse
- Touch drag at top boundary collapses instead of scrolling

### 5. **Smart Scroll Management**
- Scrolling disabled when between states (only enabled when fully expanded)
- Scroll position tracked to detect top boundary
- Smooth transition between drag and scroll modes

### 6. **Physics-Based Animations**
- Cubic-bezier easing: `cubic-bezier(0.32, 0.72, 0, 1)` for smooth transitions
- Velocity-based closing (threshold: 0.5 px/ms)
- Height threshold closing (below 30vh)
- Automatic snap to nearest state on release

## Files Created/Modified

### New Files
1. **`src/hooks/useBottomSheet.ts`** (258 lines)
   - Custom hook managing all bottom sheet logic
   - Handles drag gestures, scroll detection, state management
   - Exports: `state`, `height`, `isDragging`, `canScroll`, refs, and event handlers

### Modified Files
1. **`src/components/PredictionDetail.tsx`**
   - Completely rewritten to use `useBottomSheet` hook
   - Simplified from 332 lines to 240 lines
   - All gesture logic moved to hook
   - Maintains all original functionality (prediction display, comments, etc.)

## Technical Implementation

### Gesture Handling
- **Mouse Events**: `onMouseDown`, `onMouseMove`, `onMouseUp`
- **Touch Events**: `onTouchStart`, `onTouchMove`, `onTouchEnd`
- **Wheel Events**: `onWheel` for scroll-to-collapse
- **Scroll Events**: Detects top boundary for collapse behavior

### State Management
- Uses React refs for performance (no re-renders during drag)
- State updates only on drag start/end and snap points
- `isDragging` flag prevents transitions during active drag

### Scroll Detection
- Tracks `scrollTop` to detect when at top of content
- When at top and dragging down, collapses instead of scrolling
- When not at top, allows normal scrolling

### Boundary Handling
- **Upper boundary** (fully expanded): 15% resistance on overshoot
- **Lower boundary** (closed): 15% resistance on undershoot
- Smooth snap to nearest state on release

## Usage

```tsx
const {
    state,              // 'collapsed' | 'half-expanded' | 'fully-expanded'
    height,            // Current height in vh
    isDragging,        // Whether currently dragging
    canScroll,         // Whether content can scroll
    containerRef,      // Ref for the sheet container
    contentRef,        // Ref for scrollable content
    onMouseDown,       // Mouse drag handler
    onTouchStart,      // Touch drag handler
    onWheel,           // Wheel scroll handler
} = useBottomSheet({
    onClose: handleClose,
    collapsedHeight: 50,
    halfExpandedHeight: 75,
    fullyExpandedHeight: 95,
    closeThreshold: 30,
    velocityThreshold: 0.5,
});
```

## Behavior Details

### Drag Threshold
- 5px movement required before drag starts
- Prevents accidental drags on button clicks
- Allows normal click interactions

### Velocity-Based Closing
- Tracks drag velocity (px/ms)
- If velocity > 0.5 px/ms downward, closes immediately
- Provides natural "flick to close" gesture

### Height-Based Closing
- If height < 30vh, closes on release
- Prevents getting stuck in collapsed state

### Snap Points
- Automatically snaps to nearest state on release
- Uses closest distance algorithm
- Smooth animation to snap point

## Browser Compatibility
- Works on all modern browsers
- Touch events for mobile devices
- Mouse events for desktop
- Wheel events for scroll-to-collapse
- CSS transforms for smooth animations

## Performance Optimizations
- Uses refs to avoid re-renders during drag
- Passive event listeners where possible
- RequestAnimationFrame for smooth updates
- Minimal state updates during drag

## Future Enhancements (Optional)
- Add haptic feedback on mobile
- Add spring physics for more natural feel
- Add gesture history for undo/redo
- Add keyboard shortcuts (arrow keys to navigate states)
