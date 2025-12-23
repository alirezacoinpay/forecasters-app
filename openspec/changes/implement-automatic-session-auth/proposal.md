# Change: Implement Automatic Session-Based Authentication

## Why
The current authentication system requires explicit user registration and login, which creates friction for new users. We want to enable seamless user onboarding where users are automatically authenticated on their first visit, allowing them to interact with the application immediately. Activity data should be collected from the very first session, even before users are aware they're being tracked. This approach enables progressive user data collection (mobile, email, etc.) that can be verified and updated later, while maintaining a cookie-based session system for better security and user experience.

## What Changes
- **BREAKING**: Replace JWT token-based authentication with cookie-based session authentication
- **Automatic User Creation**: Users are automatically created and authenticated on first visit without explicit registration
- **Background Authentication**: Frontend checks authentication status and silently creates/login users in the background
- **Cookie-Based Sessions**: Use HTTP-only cookies for session management instead of localStorage tokens
- **Pre-Authentication Activity Tracking**: Collect and associate activity data with users even before they're aware of authentication
- **Progressive User Data Collection**: Support updating user information (mobile, email) after initial session creation
- **Session Persistence**: Maintain user sessions across browser sessions using secure cookies

## Impact
- Affected specs: `authentication`, `session-management`, `activity-tracking`
- Affected code:
  - `src/services/authService.service.ts` - Complete rewrite for automatic auth
  - `src/lib/axios.ts` - Remove token handling, add cookie support
  - `src/hooks/useProfile.ts` - Update for new auth flow
  - `src/services/activityService.service.ts` - Support pre-auth activity tracking
  - `src/App.tsx` - Add automatic auth check on mount
  - New: `src/hooks/useAutoAuth.ts` - Hook for automatic authentication
  - New: `src/utils/sessionStorage.ts` - Session state management
- Backend changes required:
  - New endpoint: `POST /auth/auto-login` - Automatic user creation/login
  - New endpoint: `GET /auth/session` - Check session status
  - Modify: `POST /auth/login` - Support cookie-based sessions
  - Modify: `POST /auth/register` - Support cookie-based sessions
  - Modify: All endpoints - Accept cookie-based authentication
  - Database: Add `session_id` and `is_verified` fields to users table
  - Database: Create `user_sessions` table for session management
  - Database: Create `user_activities` table for pre-auth activity tracking

