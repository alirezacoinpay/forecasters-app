# Design: Convert Share Modal to Bottom Sheet

## Context
The application currently has ShareModal as a centered modal dialog. PredictionDetail successfully uses a bottom sheet pattern with `useBottomSheet` hook. Users want consistency across share interactions.

## Goals
1. Convert ShareModal to use bottom sheet pattern
2. Maintain all existing share functionality
3. Use the same `useBottomSheet` hook as PredictionDetail
4. Provide smooth drag gestures and snap points
5. Ensure proper scroll handling when content is scrollable

## Non-Goals
- Changing share functionality or features
- Adding new share options
- Modifying the share API

## Decisions

### 1. Bottom Sheet Hook
**Decision**: Reuse existing `useBottomSheet` hook from PredictionDetail.

**Rationale**: 
- Already proven and tested
- Consistent behavior across app
- No need to reinvent the wheel

**Configuration**:
- `collapsedHeight`: 30vh (smaller than PredictionDetail since share has less content)
- `halfExpandedHeight`: 60vh (comfortable viewing height)
- `fullyExpandedHeight`: 85vh (full content access)
- `closeThreshold`: 25vh (easy to dismiss)

### 2. Component Structure
**Decision**: Rename ShareModal to ShareBottomSheet and restructure to match PredictionDetail pattern.

**Rationale**:
- Clear naming convention
- Follows existing pattern
- Easy to understand and maintain

**Structure**:
- Drag handle at top
- Header with close button
- Scrollable content area
- Same sections as current modal (link, phone, social)

### 3. Content Layout
**Decision**: Keep all existing content sections in the same order.

**Rationale**:
- Users are familiar with current layout
- No need to change what works
- Just change presentation method

**Sections**:
1. Share link section (copy button + input)
2. Phone number section (send button + input)
3. Social media options grid

### 4. Scroll Behavior
**Decision**: Enable scrolling when content exceeds viewport height.

**Rationale**:
- Bottom sheet can expand fully for scrolling
- Better UX than cramped modal
- Matches PredictionDetail behavior

## Risks / Trade-offs

### Risk: Content Height Variations
**Mitigation**: 
- Use flexible height configuration
- Test with different content lengths
- Ensure proper scroll handling

### Trade-off: Modal vs Bottom Sheet
**Trade-off**: Bottom sheet is better for mobile but requires gesture handling.

**Decision**: Bottom sheet provides better mobile UX and consistency.

## Migration Plan

1. **Phase 1**: Create ShareBottomSheet component alongside ShareModal
2. **Phase 2**: Update PredictionCard to use ShareBottomSheet
3. **Phase 3**: Test all share functionality
4. **Phase 4**: Remove ShareModal after verification

## Open Questions
- Should the bottom sheet have the same height snap points as PredictionDetail?
- Should we add haptic feedback on drag gestures?
