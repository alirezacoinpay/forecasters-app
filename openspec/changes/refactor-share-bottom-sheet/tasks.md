## 1. Analysis & Planning
- [x] 1.1 Compare PredictionDetail and ShareBottomSheet implementations side-by-side
- [x] 1.2 Document all differences in behavior and implementation
- [x] 1.3 Identify specific issues with current ShareBottomSheet (opening/closing problems)
- [x] 1.4 Plan exact refactoring approach to match PredictionDetail pattern

## 2. Hook Integration
- [x] 2.1 Import `useBottomSheet` hook in ShareBottomSheet
- [x] 2.2 Remove manual state management (`isVisible`, `isClosing` refs)
- [x] 2.3 Configure hook with appropriate heights (collapsed: 30vh, half: 60vh, full: 85vh)
- [x] 2.4 Set close threshold and velocity threshold
- [x] 2.5 Replace manual backdrop handling with hook's `onClose` callback

## 3. Component Structure Refactoring
- [x] 3.1 Replace manual container ref with `containerRef` from hook
- [x] 3.2 Replace manual content ref with `contentRef` from hook
- [x] 3.3 Add drag handle with proper event handlers (`onMouseDown`, `onTouchStart`)
- [x] 3.4 Update container styling to use hook's `height` and `isDragging` state
- [x] 3.5 Add proper transition styles matching PredictionDetail
- [x] 3.6 Update content area to use `canScroll` state for scroll management

## 4. Animation & Transitions
- [x] 4.1 Add smooth opening animation using `isVisible` state pattern from PredictionDetail
- [x] 4.2 Ensure closing animation matches PredictionDetail's smooth transition
- [x] 4.3 Add backdrop opacity transition
- [x] 4.4 Test drag-to-close gesture works smoothly
- [x] 4.5 Test scroll-to-collapse when at top of content

## 5. Event Handling
- [x] 5.1 Add proper mouse/touch event handlers to container (matching PredictionDetail pattern)
- [x] 5.2 Ensure interactive elements (buttons, inputs) don't trigger drag
- [x] 5.3 Add scroll detection for scroll-to-collapse behavior
- [x] 5.4 Test that content scrolling works when fully expanded
- [x] 5.5 Ensure backdrop click closes the sheet properly

## 6. Content & Layout
- [x] 6.1 Keep all existing share content sections
- [x] 6.2 Ensure content is properly scrollable when needed
- [x] 6.3 Maintain RTL layout
- [x] 6.4 Test content visibility at all three states (collapsed/half/full)

## 7. Testing & Validation
- [x] 7.1 Test opening animation is smooth
- [x] 7.2 Test closing animation is smooth
- [x] 7.3 Test drag gestures work correctly (up/down)
- [x] 7.4 Test snap points (collapsed/half-expanded/fully-expanded)
- [x] 7.5 Test scroll-to-collapse functionality
- [x] 7.6 Test all interactive elements work (copy, send, social buttons)
- [x] 7.7 Test backdrop click closes sheet
- [x] 7.8 Test close button works
- [x] 7.9 Compare behavior side-by-side with PredictionDetail to ensure consistency

## 8. Cleanup
- [x] 8.1 Remove unused manual state variables
- [x] 8.2 Remove unused manual event handlers
- [x] 8.3 Remove manual backdrop touch handling (now handled by hook)
- [x] 8.4 Clean up any duplicate code
- [x] 8.5 Ensure code structure matches PredictionDetail pattern
