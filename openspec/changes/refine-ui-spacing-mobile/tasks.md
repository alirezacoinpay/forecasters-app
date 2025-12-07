## 1. Prediction Card Spacing
- [x] 1.1 Remove extra space between "..." button and prediction title (added -mr-2 to button)
- [x] 1.2 Reduce spacing between tags (changed gap-2 to gap-1.5)
- [x] 1.3 Make avatar circle smaller (from w-9 h-9 to w-7 h-7, icon from w-3 h-3 to w-2.5 h-2.5)

## 2. Bottom Sheet Improvements
- [x] 2.1 Redesign option cards (changed from grid-cols-3 to flex-col, improved styling)
- [x] 2.2 Make time passed text smaller in bottom sheet header (changed from text-sm to text-xs)
- [x] 2.3 Adjust spacing in bottom sheet content (reduced tag gap to gap-1.5)

## 3. Mobile Layout Constraints
- [x] 3.1 Ensure web view stays mobile-sized (max-width: 428px in App.tsx and #root)
- [x] 3.2 Add empty space on sides when on desktop (updated globals.css with proper centering)
- [x] 3.3 Constrain Header to mobile width (added maxWidth: 428px, centered with transform)
- [x] 3.4 Constrain BottomNav to mobile width (added maxWidth: 428px, centered with transform)

## 4. General Margin Fixes
- [x] 4.1 Review and fix margins that don't fit mobile view (adjusted spacing throughout)
- [x] 4.2 Ensure consistent spacing throughout components (standardized gaps and margins)
