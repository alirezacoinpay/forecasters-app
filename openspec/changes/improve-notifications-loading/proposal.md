# Improve Notifications and Loading Indicators

## Summary
Refine loading indicators and notification system to be more minimal and mobile-friendly. Remove success notifications, improve error notifications, and fix mobile positioning.

## Goals
1. Simplify loading indicators - remove text, show only spinning circle
2. Remove success notifications for 200/OK requests
3. Improve error notifications - smaller, with close button, faster auto-dismiss
4. Fix error notification positioning for mobile view

## Changes

### Loading Indicators
- Remove text from pull-to-refresh indicator
- Show only spinning circle for all loading states
- Keep loading spinners minimal and unobtrusive

### Notifications
- Remove all `toast.success()` calls
- Only show notifications for errors
- Make error notifications:
  - Smaller size
  - Include close button
  - Auto-dismiss faster (3 seconds instead of default)
  - Better mobile positioning (top-right for RTL)

### Toast Configuration
- Update Toaster component with mobile-friendly positioning
- Configure error toast styling
- Ensure proper RTL support

## Impact
- Cleaner, less intrusive UI
- Better mobile experience
- Reduced notification noise
- Users only see important error messages
