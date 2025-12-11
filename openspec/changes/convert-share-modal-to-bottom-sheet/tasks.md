## 1. Component Conversion
- [ ] 1.1 Rename ShareModal.tsx to ShareBottomSheet.tsx
- [ ] 1.2 Import and integrate useBottomSheet hook
- [ ] 1.3 Replace modal structure with bottom sheet structure
- [ ] 1.4 Add drag handle at top
- [ ] 1.5 Configure bottom sheet heights (collapsed: 30vh, half: 60vh, full: 85vh)
- [ ] 1.6 Add transition animations matching PredictionDetail
- [ ] 1.7 Ensure proper scroll handling for content

## 2. Functionality Preservation
- [ ] 2.1 Keep share link section with copy functionality
- [ ] 2.2 Keep phone number input and send functionality
- [ ] 2.3 Keep social media options grid
- [ ] 2.4 Maintain all existing handlers and logic
- [ ] 2.5 Ensure RTL layout is preserved

## 3. Integration Updates
- [ ] 3.1 Update PredictionCard to use ShareBottomSheet
- [ ] 3.2 Update import statements
- [ ] 3.3 Update component name references
- [ ] 3.4 Check for any other components using ShareModal

## 4. Styling & UX
- [ ] 4.1 Style bottom sheet to match PredictionDetail pattern
- [ ] 4.2 Ensure proper spacing and padding
- [ ] 4.3 Add smooth transitions
- [ ] 4.4 Test drag gestures work correctly
- [ ] 4.5 Test scroll behavior when content is long
- [ ] 4.6 Ensure backdrop overlay works correctly

## 5. Cleanup
- [ ] 5.1 Remove old ShareModal component (if renamed, delete old file)
- [ ] 5.2 Remove any unused imports
- [ ] 5.3 Update any documentation references

## 6. Validation
- [ ] 6.1 Test forward button opens bottom sheet
- [ ] 6.2 Test copy link functionality
- [ ] 6.3 Test send to phone functionality
- [ ] 6.4 Test social media buttons
- [ ] 6.5 Test drag to close gesture
- [ ] 6.6 Test scroll when content is long
- [ ] 6.7 Test close button functionality
- [ ] 6.8 Test backdrop click to close
