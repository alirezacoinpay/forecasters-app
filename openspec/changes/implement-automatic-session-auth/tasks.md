## 1. Backend Preparation (Laravel)

### 1.1 Database Schema
- [ ] 1.1.1 Create migration for `user_sessions` table with columns:
  - `id` (primary key)
  - `user_id` (foreign key to users)
  - `session_token` (unique, string, indexed)
  - `device_fingerprint` (nullable, string)
  - `ip_address` (nullable, string)
  - `user_agent` (nullable, text)
  - `expires_at` (datetime, indexed)
  - `created_at`, `updated_at` (timestamps)
- [ ] 1.1.2 Create migration to add columns to `users` table:
  - `session_id` (unique, string, nullable, indexed)
  - `device_fingerprint` (nullable, string)
  - `is_verified` (boolean, default: false)
  - `email_verified_at` (nullable, datetime)
  - `mobile_verified_at` (nullable, datetime)
- [ ] 1.1.3 Create migration for `user_activities` table with columns:
  - `id` (primary key)
  - `user_id` (nullable, foreign key to users, indexed)
  - `temporary_session_id` (nullable, string, indexed)
  - `action` (string, indexed)
  - `meta` (JSON, nullable)
  - `device_type` (string: 'mobile'|'desktop')
  - `platform` (string: 'web'|'android'|'ios')
  - `created_at`, `updated_at` (timestamps)
- [ ] 1.1.4 Run migrations and verify schema in database

### 1.2 Models and Relationships
- [ ] 1.2.1 Create `UserSession` model with relationships:
  - `belongsTo(User::class)`
  - Add fillable fields and casts
- [ ] 1.2.2 Create `UserActivity` model with relationships:
  - `belongsTo(User::class)` (nullable)
  - Add fillable fields and casts
- [ ] 1.2.3 Update `User` model:
  - Add `hasMany(UserSession::class)` relationship
  - Add `hasMany(UserActivity::class)` relationship
  - Add fillable fields for new columns
  - Add casts for boolean and datetime fields

### 1.3 Session Management Middleware
- [ ] 1.3.1 Create `SessionAuth` middleware to:
  - Extract session token from cookie
  - Validate session token against database
  - Check session expiration
  - Attach authenticated user to request
  - Handle invalid/expired sessions (return 401)
- [ ] 1.3.2 Register middleware in `app/Http/Kernel.php`
- [ ] 1.3.3 Apply middleware to protected routes
- [ ] 1.3.4 Test middleware with valid and invalid sessions

### 1.4 Auto-Login Endpoint
- [ ] 1.4.1 Create `AuthController@autoLogin` method:
  - Accept device fingerprint, user agent, timezone, language
  - Check for existing user by device fingerprint or session
  - If user exists: create new session, return user data
  - If user doesn't exist: create new user with minimal data, create session
  - Generate secure session token (cryptographically random)
  - Set HTTP-only cookie with session token
  - Return user data with success response
- [ ] 1.4.2 Add route: `POST /api/auth/auto-login` (public route)
- [ ] 1.4.3 Add request validation for auto-login endpoint
- [ ] 1.4.4 Test endpoint with Postman/curl:
  - Test new user creation
  - Test existing user login
  - Verify cookie is set correctly
  - Verify cookie has HttpOnly, Secure, SameSite flags

### 1.5 Session Status Endpoint
- [ ] 1.5.1 Create `AuthController@checkSession` method:
  - Extract session token from cookie
  - Validate session and load user
  - Return session status and user data
  - Return 401 if no valid session
- [ ] 1.5.2 Add route: `GET /api/auth/session` (protected route)
- [ ] 1.5.3 Test endpoint with valid and invalid sessions

### 1.6 Update Existing Auth Endpoints
- [ ] 1.6.1 Update `AuthController@login`:
  - Remove JWT token generation
  - Create session instead
  - Set HTTP-only cookie
  - Return user data (no token in response)
- [ ] 1.6.2 Update `AuthController@register`:
  - Remove JWT token generation
  - Create session instead
  - Set HTTP-only cookie
  - Return user data (no token in response)
- [ ] 1.6.3 Update `AuthController@logout`:
  - Invalidate session in database
  - Clear session cookie
  - Return success response
- [ ] 1.6.4 Test all updated endpoints

### 1.7 Verification Endpoints
- [ ] 1.7.1 Create `AuthController@verifyEmail`:
  - Accept email and verification code
  - Validate code
  - Update user email and mark as verified
  - Return updated user data
- [ ] 1.7.2 Create `AuthController@verifyMobile`:
  - Accept mobile and verification code
  - Validate code
  - Update user mobile and mark as verified
  - Return updated user data
- [ ] 1.7.3 Add routes for verification endpoints (protected)
- [ ] 1.7.4 Test verification endpoints

### 1.8 Activity Logging Endpoint Updates
- [ ] 1.8.1 Update `ActivityController@log` (or create if doesn't exist):
  - Accept activity data (action, meta, device_type, platform)
  - Check for authenticated user (from session)
  - If authenticated: store with user_id
  - If not authenticated: store with temporary_session_id
  - Return success response
- [ ] 1.8.2 Ensure endpoint works without authentication (public or optional auth)
- [ ] 1.8.3 Test activity logging with and without authentication

### 1.9 Activity Association Service
- [ ] 1.9.1 Create service method to associate pre-auth activities:
  - Accept user_id and temporary_session_id
  - Find all activities with temporary_session_id
  - Update activities to use user_id
  - Clear temporary_session_id
- [ ] 1.9.2 Call this service in auto-login after user creation/login
- [ ] 1.9.3 Test activity association

### 1.10 Cookie Configuration
- [ ] 1.10.1 Configure cookie settings in `config/session.php`:
  - Set `http_only` to true
  - Set `secure` to true in production (use env variable)
  - Set `same_site` to 'lax' or 'strict'
  - Set `lifetime` to desired session duration (e.g., 43200 minutes = 30 days)
- [ ] 1.10.2 Test cookie settings in development and production environments

### 1.11 CORS Configuration
- [ ] 1.11.1 Update CORS configuration to allow credentials:
  - Set `supports_credentials` to true
  - Configure allowed origins properly
- [ ] 1.11.2 Test CORS with frontend requests

## 2. Frontend Implementation (React)

### 2.1 Remove JWT Token Handling
- [x] 2.1.1 Remove token storage from `src/services/authService.service.ts`:
  - Remove localStorage.setItem for tokens
  - Remove localStorage.getItem for tokens
  - Remove token from AuthResponse interface
- [x] 2.1.2 Update `src/lib/axios.ts`:
  - Remove `getAuthToken()` method
  - Remove Authorization header from request interceptor
  - Update `handleUnauthorized()` to not remove tokens from localStorage
  - Ensure `withCredentials: true` is set in axios config for cookie support
- [x] 2.1.3 Update `src/types/api.ts`:
  - Remove `token` and `refreshToken` from `AuthResponse` interface
  - Keep `user` field in `AuthResponse`
- [ ] 2.1.4 Test that no token-related code remains

### 2.2 Configure Axios for Cookies
- [x] 2.2.1 Update `src/lib/axios.ts` constructor:
  - Add `withCredentials: true` to axios.create config
  - This ensures cookies are sent with all requests
- [ ] 2.2.2 Test that cookies are sent with requests (check Network tab)

### 2.3 Auto-Authentication Hook
- [x] 2.3.1 Create `src/hooks/useAutoAuth.ts`:
  - Check session status on mount
  - If no session, call auto-login endpoint
  - Handle loading and error states
  - Return authentication status and user data
- [x] 2.3.2 Implement session status check:
  - Call GET /auth/session
  - Handle 401 as "not authenticated"
  - Handle 200 as "authenticated" with user data
- [x] 2.3.3 Implement auto-login:
  - Collect device fingerprint data (user agent, screen, timezone, language)
  - Create device fingerprint hash
  - Call POST /auth/auto-login with fingerprint data
  - Handle success and error cases
- [x] 2.3.4 Add retry logic for failed auto-login attempts
- [ ] 2.3.5 Test hook in isolation

### 2.4 Device Fingerprinting Utility
- [x] 2.4.1 Create `src/utils/deviceFingerprint.ts`:
  - Function to collect device data (user agent, screen resolution, timezone, language)
  - Function to create hash from device data
  - Store fingerprint in sessionStorage for consistency
  - Return fingerprint string
- [ ] 2.4.2 Test fingerprint generation and consistency

### 2.5 Update Auth Service
- [x] 2.5.1 Update `src/services/authService.service.ts`:
  - Remove `login()` method or update to work with cookies
  - Remove `register()` method or update to work with cookies
  - Update `logout()` to call backend logout endpoint
  - Remove `refreshToken()` method (not needed with cookies)
  - Add `checkSession()` method to check session status
  - Add `autoLogin()` method for automatic authentication
- [x] 2.5.2 Update method signatures and return types
- [ ] 2.5.3 Test all auth service methods

### 2.6 Update Activity Service
- [x] 2.6.1 Update `src/services/activityService.service.ts`:
  - Ensure it works without authentication
  - Add temporary session ID tracking
  - Store temporary session ID in sessionStorage
  - Use temporary session ID when not authenticated
  - Use user ID when authenticated (handled by backend)
- [ ] 2.6.2 Test activity logging before and after authentication

### 2.7 App-Level Authentication
- [x] 2.7.1 Update `src/App.tsx`:
  - Add `useAutoAuth()` hook on mount
  - Show loading state during initial auth check
  - Handle authentication errors gracefully
  - Store user data in context or state management
- [x] 2.7.2 Ensure app doesn't block on authentication
- [ ] 2.7.3 Test app initialization flow

### 2.8 Update Profile Hook
- [x] 2.8.1 Update `src/hooks/useProfile.ts`:
  - Remove token-based authentication checks
  - Ensure it works with cookie-based sessions
  - Handle 401 errors appropriately (redirect or show message)
- [ ] 2.8.2 Test profile loading with new auth system

### 2.9 Session State Management
- [x] 2.9.1 Create `src/utils/sessionStorage.ts` or use existing state management:
  - Store temporary session ID
  - Store device fingerprint
  - Store authentication status
  - Helper functions for session data
- [x] 2.9.2 Integrate session storage with auto-auth hook

### 2.10 Update Error Handling
- [x] 2.10.1 Update `src/lib/axios.ts` error interceptor:
  - Handle 401/403 errors by automatically calling /login with no body
  - Retry original request after successful auto-login
  - Queue multiple requests if login is in progress
  - Prevent infinite loops by checking _retry flag
  - Don't show error toasts for automatic login (silent background operation)
- [ ] 2.10.2 Test error handling scenarios

## 3. Progressive User Data Collection

### 3.1 Email Verification UI
- [x] 3.1.1 Create email input component/modal
- [x] 3.1.2 Implement email submission:
  - Call backend to send verification code
  - Show code input field
  - Submit code for verification
  - Update user profile on success
- [x] 3.1.3 Add email verification status to user profile display
- [ ] 3.1.4 Test email verification flow

### 3.2 Mobile Verification UI
- [x] 3.2.1 Create mobile input component/modal
- [x] 3.2.2 Implement mobile submission:
  - Call backend to send verification SMS
  - Show code input field
  - Submit code for verification
  - Update user profile on success
- [x] 3.2.3 Add mobile verification status to user profile display
- [ ] 3.2.4 Test mobile verification flow

### 3.3 Profile Update UI
- [x] 3.3.1 Update profile edit components to support:
  - Name updates
  - Email updates (with verification)
  - Mobile updates (with verification)
- [x] 3.3.2 Show verification status for email and mobile
- [ ] 3.3.3 Test profile update flows

## 4. Testing & Validation

### 4.1 Backend Testing
- [ ] 4.1.1 Test auto-login endpoint:
  - New user creation
  - Existing user login
  - Cookie setting
  - Session creation
- [ ] 4.1.2 Test session validation:
  - Valid session
  - Expired session
  - Invalid session
  - Missing session
- [ ] 4.1.3 Test activity logging:
  - With authentication
  - Without authentication
  - Activity association after auth
- [ ] 4.1.4 Test verification endpoints:
  - Email verification
  - Mobile verification
  - Invalid codes
- [ ] 4.1.5 Test cookie security:
  - HttpOnly flag
  - Secure flag (in production)
  - SameSite attribute
  - Expiration

### 4.2 Frontend Testing
- [ ] 4.2.1 Test automatic authentication:
  - First visit flow
  - Returning user flow
  - Session expiration handling
- [ ] 4.2.2 Test activity tracking:
  - Before authentication
  - After authentication
  - Activity association
- [ ] 4.2.3 Test cookie handling:
  - Cookies are sent with requests
  - Cookies persist across reloads
  - Cookies work across tabs
- [ ] 4.2.4 Test error scenarios:
  - Network failures
  - Server errors
  - Invalid responses
- [ ] 4.2.5 Test progressive data collection:
  - Email verification flow
  - Mobile verification flow
  - Profile updates

### 4.3 Integration Testing
- [ ] 4.3.1 Test complete user journey:
  - First visit → auto-auth → activity tracking → profile update
- [ ] 4.3.2 Test session persistence:
  - Close browser → reopen → still authenticated
  - Clear cookies → auto-auth again
- [ ] 4.3.3 Test multiple devices:
  - Different devices create different users
  - Same device maintains same user
- [ ] 4.3.4 Test activity tracking end-to-end:
  - Pre-auth activities → auto-auth → activities associated

### 4.4 Security Testing
- [ ] 4.4.1 Verify cookies are HttpOnly (not accessible via JavaScript)
- [ ] 4.4.2 Verify cookies are Secure in production
- [ ] 4.4.3 Test CSRF protection (SameSite attribute)
- [ ] 4.4.4 Test session hijacking prevention
- [ ] 4.4.5 Test XSS protection (HttpOnly cookies)

### 4.5 Performance Testing
- [ ] 4.5.1 Test auto-login performance (should be fast, <500ms)
- [ ] 4.5.2 Test session validation performance
- [ ] 4.5.3 Test activity logging performance (should not block UI)
- [ ] 4.5.4 Test activity association performance

## 5. Migration & Cleanup

### 5.1 Existing User Migration (if applicable)
- [ ] 5.1.1 Create migration script to:
  - Convert existing JWT-based users to session-based
  - Create sessions for existing users
  - Preserve user data
- [ ] 5.1.2 Test migration script on staging data
- [ ] 5.1.3 Run migration on production (if needed)

### 5.2 Code Cleanup
- [x] 5.2.1 Remove all JWT token-related code
- [x] 5.2.2 Remove localStorage token storage
- [x] 5.2.3 Remove refresh token logic
- [x] 5.2.4 Clean up unused imports and dependencies
- [ ] 5.2.5 Update comments and documentation

### 5.3 Documentation
- [ ] 5.3.1 Update API documentation with new endpoints
- [ ] 5.3.2 Update frontend documentation with new auth flow
- [ ] 5.3.3 Document cookie configuration
- [ ] 5.3.4 Document device fingerprinting approach
- [ ] 5.3.5 Create migration guide for developers

## 6. Deployment

### 6.1 Backend Deployment
- [ ] 6.1.1 Deploy database migrations
- [ ] 6.1.2 Deploy backend code changes
- [ ] 6.1.3 Verify environment variables (cookie settings, CORS)
- [ ] 6.1.4 Test endpoints in production environment

### 6.2 Frontend Deployment
- [ ] 6.2.1 Build frontend with new auth system
- [ ] 6.2.2 Deploy frontend
- [ ] 6.2.3 Verify cookie settings work in production
- [ ] 6.2.4 Test complete flow in production

### 6.3 Monitoring
- [ ] 6.3.1 Set up monitoring for:
  - Auto-login success/failure rates
  - Session creation rates
  - Activity logging rates
  - Cookie-related errors
- [ ] 6.3.2 Set up alerts for authentication failures
- [ ] 6.3.3 Monitor session expiration patterns

## 7. Rollback Plan

### 7.1 Rollback Preparation
- [ ] 7.1.1 Document rollback steps
- [ ] 7.1.2 Prepare rollback database migrations (if needed)
- [ ] 7.1.3 Keep old JWT code in version control for reference
- [ ] 7.1.4 Test rollback procedure in staging

### 7.2 Rollback Execution (if needed)
- [ ] 7.2.1 Revert frontend code
- [ ] 7.2.2 Revert backend code
- [ ] 7.2.3 Restore previous authentication system
- [ ] 7.2.4 Verify system functionality

