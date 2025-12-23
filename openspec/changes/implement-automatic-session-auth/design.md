# Design: Automatic Session-Based Authentication

## Context
The application currently uses JWT token-based authentication stored in localStorage. Users must explicitly register and login. We need to transition to a seamless authentication system where users are automatically authenticated on first visit, with cookie-based sessions and the ability to track activities before users are aware of authentication.

## Goals
- Enable automatic user creation and authentication on first visit
- Implement cookie-based session management for better security
- Track user activities from the very first session
- Support progressive user data collection (mobile, email verification later)
- Maintain backward compatibility during migration
- Ensure secure session handling with HTTP-only cookies

## Non-Goals
- Real-time session synchronization across devices (future enhancement)
- OAuth/SSO integration (future enhancement)
- Session sharing across subdomains (future enhancement)
- Two-factor authentication (future enhancement)

## Decisions

### Decision: Cookie-Based Sessions Over JWT Tokens
**Rationale**: 
- HTTP-only cookies prevent XSS attacks (tokens can't be accessed via JavaScript)
- Automatic cookie handling by browsers simplifies session management
- Server-side session control enables better security (revocation, expiration)
- Better suited for automatic authentication flow

**Alternatives Considered**:
- JWT in localStorage - Rejected: XSS vulnerability, manual token management
- JWT in httpOnly cookies - Rejected: Still requires explicit login flow
- Session tokens in localStorage - Rejected: Same XSS issues as JWT

### Decision: Automatic User Creation on First Visit
**Rationale**: 
- Eliminates friction for new users
- Enables immediate activity tracking
- Allows progressive data collection

**Implementation**:
- Frontend checks session status on app mount
- If no session exists, automatically call `/auth/auto-login` with available data (device fingerprint, IP, user agent)
- Backend creates user with minimal data (session_id, device info)
- User is immediately authenticated and can interact with app
- Later, user can verify/update email, mobile, etc.

**Alternatives Considered**:
- Guest mode with later registration - Rejected: Adds complexity, loses early activity data
- Anonymous sessions - Rejected: Requires session merging logic, more complex

### Decision: Pre-Authentication Activity Tracking
**Rationale**: 
- Capture valuable user behavior data from first interaction
- Associate activities with user even before they know they have an account
- Enable analytics and personalization from day one

**Implementation**:
- Activities are tracked with a temporary session identifier before authentication
- On auto-login, activities are associated with the created user
- Activity service works seamlessly before and after authentication

### Decision: Device Fingerprinting for Auto-Login
**Rationale**: 
- Helps identify returning users even without cookies
- Enables session recovery if cookies are cleared
- Provides additional security layer

**Data Collected**:
- User agent
- Screen resolution
- Timezone
- Language preferences
- IP address (server-side)
- Browser plugins (if available)

**Privacy Considerations**:
- Only used for authentication, not tracking
- Can be disabled by users
- Complies with privacy regulations

### Decision: Progressive User Data Collection
**Rationale**: 
- Users start with minimal data (session_id, device info)
- Can progressively add email, mobile, name, etc.
- Verification happens later when user provides data

**Flow**:
1. First visit: Auto-create user with session_id + device fingerprint
2. User interacts: Activities tracked, no verification needed
3. User provides email: Update user, send verification email
4. User verifies email: Mark user as verified, enable email features
5. User provides mobile: Update user, send verification SMS
6. User verifies mobile: Mark mobile as verified

## Architecture

### Frontend Flow

```
App Mount
  ↓
Check Session Status (GET /auth/session)
  ↓
Has Valid Session?
  ├─ YES → Load User Data → Continue
  └─ NO → Auto-Login (POST /auth/auto-login)
           ↓
           Create/Login User
           ↓
           Set HTTP-only Cookie
           ↓
           Load User Data → Continue
```

### Backend Flow

```
POST /auth/auto-login
  ↓
Extract Device Fingerprint
  ↓
Check for Existing User (by fingerprint or cookie)
  ├─ EXISTS → Login User → Create Session → Return Cookie
  └─ NOT EXISTS → Create New User → Create Session → Return Cookie
```

### Session Management

```
Session Structure:
- session_id: Unique session identifier
- user_id: Associated user
- device_fingerprint: Device identifier
- ip_address: Client IP
- user_agent: Browser info
- expires_at: Session expiration
- created_at: Session creation time
```

### Activity Tracking Flow

```
User Action
  ↓
Activity Service Logs Action
  ↓
Has Active Session?
  ├─ YES → Associate with user_id
  └─ NO → Store with temporary_id
           ↓
           On Auto-Login → Associate with user_id
```

## Data Models

### User Model (Backend)
```php
- id
- session_id (unique, auto-generated)
- email (nullable, verified)
- mobile (nullable, verified)
- name (nullable)
- device_fingerprint (nullable)
- is_verified (boolean, default: false)
- created_at
- updated_at
```

### Session Model (Backend)
```php
- id
- user_id
- session_token (unique, stored in cookie)
- device_fingerprint
- ip_address
- user_agent
- expires_at
- created_at
- updated_at
```

### Activity Model (Backend)
```php
- id
- user_id (nullable, for pre-auth activities)
- temporary_session_id (nullable, for pre-auth)
- action
- meta (JSON)
- device_type
- platform
- created_at
```

## API Endpoints

### New Endpoints

**POST /auth/auto-login**
- Purpose: Automatically create or login user
- Request Body:
  ```json
  {
    "device_fingerprint": "string",
    "user_agent": "string",
    "timezone": "string",
    "language": "string"
  }
  ```
- Response: Sets HTTP-only cookie, returns user data
- Status Codes:
  - 200: Success (user created or logged in)
  - 400: Invalid request
  - 500: Server error

**GET /auth/session**
- Purpose: Check current session status
- Request: Cookie automatically sent
- Response:
  ```json
  {
    "success": true,
    "data": {
      "authenticated": true,
      "user": { ... },
      "session_expires_at": "datetime"
    }
  }
  ```
- Status Codes:
  - 200: Session valid
  - 401: No valid session

**PUT /auth/verify-email**
- Purpose: Verify user email
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "verification_code": "string"
  }
  ```
- Response: Updated user data

**PUT /auth/verify-mobile**
- Purpose: Verify user mobile
- Request Body:
  ```json
  {
    "mobile": "+1234567890",
    "verification_code": "string"
  }
  ```
- Response: Updated user data

### Modified Endpoints

**POST /auth/login** (if still needed for explicit login)
- Now sets HTTP-only cookie instead of returning token
- Response: User data (cookie set automatically)

**POST /auth/register** (if still needed)
- Now sets HTTP-only cookie instead of returning token
- Response: User data (cookie set automatically)

**POST /auth/logout**
- Clears session cookie
- Invalidates server-side session

## Security Considerations

### Cookie Security
- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: Only sent over HTTPS in production
- **SameSite**: Strict or Lax to prevent CSRF
- **Expiration**: Configurable (default: 30 days)

### Session Security
- Session tokens are cryptographically random
- Sessions expire after inactivity
- Server-side session validation on every request
- IP address validation (optional, can be disabled)

### Device Fingerprinting
- Not used for tracking, only authentication
- Can be disabled by users
- Complies with privacy regulations
- Stored securely, not shared with third parties

## Migration Plan

### Phase 1: Backend Preparation
1. Create database migrations (sessions table, user updates)
2. Implement auto-login endpoint
3. Implement session management middleware
4. Update existing auth endpoints for cookies
5. Test backend endpoints

### Phase 2: Frontend Implementation
1. Remove JWT token handling from axios
2. Implement automatic auth check on app mount
3. Create useAutoAuth hook
4. Update auth service for new flow
5. Update activity service for pre-auth tracking
6. Test frontend flow

### Phase 3: Progressive Data Collection
1. Implement email verification flow
2. Implement mobile verification flow
3. Add UI for user data updates
4. Test verification flows

### Phase 4: Migration & Cleanup
1. Migrate existing users (if any) to new system
2. Remove old token-based code
3. Update documentation
4. Deploy and monitor

## Risks / Trade-offs

### Risk: Cookie Theft via XSS
**Mitigation**: HttpOnly cookies prevent JavaScript access. Still need to prevent XSS vulnerabilities.

### Risk: Session Hijacking
**Mitigation**: Use secure cookies, validate IP (optional), implement session rotation.

### Risk: Device Fingerprinting Privacy Concerns
**Mitigation**: Only use for authentication, allow users to disable, comply with privacy regulations.

### Risk: Cookie Blocking by Users
**Mitigation**: Provide fallback mechanism, show clear message if cookies are disabled.

### Trade-off: Server-Side Session Storage
**Decision**: Use database for session storage. Alternative (Redis) can be added later for performance.

### Trade-off: Automatic User Creation
**Decision**: Create users automatically. Alternative (guest mode) adds complexity and loses early data.

## Open Questions

1. **Session Expiration**: What should be the default session expiration time? (Proposed: 30 days)
2. **IP Validation**: Should we validate IP addresses for sessions? (Proposed: Optional, disabled by default)
3. **Existing Users**: How do we migrate existing JWT-based users? (Proposed: On next login, create session)
4. **Cookie Domain**: Should sessions work across subdomains? (Proposed: No, single domain only)
5. **Activity Retention**: How long should pre-auth activities be retained? (Proposed: 7 days)
6. **Device Fingerprint Algorithm**: Which fingerprinting library/algorithm to use? (Proposed: Simple hash of user agent + screen + timezone)

