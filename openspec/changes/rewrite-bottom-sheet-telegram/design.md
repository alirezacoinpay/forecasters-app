## Context
The existing bottom sheet component (`PredictionDetail`) had basic drag functionality but lacked the sophisticated gesture handling found in modern mobile applications like Telegram. Users expect seamless interactions where dragging and scrolling work together intelligently.

## Goals
- Implement Telegram-style bottom sheet with three states
- Enable dragging from anywhere on the sheet surface
- Integrate scroll-to-collapse behavior
- Maintain all existing functionality
- Ensure smooth, physics-based animations

## Non-Goals
- Changing the component API (props remain the same)
- Adding new dependencies (using native web APIs)
- Modifying other components

## Decisions

### Decision: Custom Hook Implementation
**What**: Created `useBottomSheet` hook to encapsulate all gesture logic
**Why**: 
- Separates concerns (gesture logic vs UI)
- Reusable for other bottom sheets
- Easier to test and maintain
- No external dependencies needed

**Alternatives considered**:
- Using framer-motion: Adds dependency, more complex setup
- Using react-spring: Adds dependency, overkill for this use case
- Keeping logic in component: Harder to maintain, not reusable

### Decision: Native Web APIs
**What**: Using native mouse, touch, and wheel events
**Why**:
- No external dependencies
- Full control over behavior
- Better performance
- Works across all browsers

**Alternatives considered**:
- @use-gesture/react: Good but adds dependency
- react-spring gestures: Adds dependency
- Native events: Chosen for simplicity and control

### Decision: Three-State System
**What**: Collapsed (50vh), Half-Expanded (75vh), Fully-Expanded (95vh)
**Why**:
- Matches Telegram's behavior
- Provides good UX balance
- Allows content preview and full access
- Configurable via hook options

### Decision: Drag Threshold
**What**: 5px movement required before drag starts
**Why**:
- Prevents accidental drags on button clicks
- Allows normal click interactions
- Feels natural to users
- Standard practice in mobile apps

### Decision: Scroll Detection
**What**: Track scrollTop to detect top boundary
**Why**:
- Enables scroll-to-collapse behavior
- Prevents scroll/drag conflicts
- Natural user experience
- Works with both touch and wheel events

## Risks / Trade-offs

### Risk: Button Click Interference
**Mitigation**: Drag threshold prevents accidental drags, interactive element detection

### Risk: Scroll/Drag Conflicts
**Mitigation**: Smart detection of scroll position and drag direction, only collapse when at top

### Risk: Performance on Low-End Devices
**Mitigation**: Using refs to minimize re-renders, passive event listeners where possible

### Trade-off: Complexity vs Features
**Decision**: Accept moderate complexity for better UX that matches user expectations

## Migration Plan
- No migration needed - component API unchanged
- Existing usage continues to work
- Internal implementation only changed

## Open Questions
- Should we add haptic feedback on mobile? (Future enhancement)
- Should we support keyboard navigation for states? (Future enhancement)
