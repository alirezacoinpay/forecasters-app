/**
 * Session Storage Utility
 * 
 * Manages temporary session data and authentication state
 * Uses sessionStorage for data that should persist across page reloads
 * but be cleared when the browser session ends.
 */

const TEMP_SESSION_ID_KEY = 'temp_session_id';
const AUTH_STATUS_KEY = 'auth_status';

/**
 * Gets or generates a temporary session ID
 * Used for tracking activities before authentication
 */
export function getTemporarySessionId(): string {
    let tempId = sessionStorage.getItem(TEMP_SESSION_ID_KEY);
    
    if (!tempId) {
        // Generate a unique temporary ID
        tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem(TEMP_SESSION_ID_KEY, tempId);
    }
    
    return tempId;
}

/**
 * Clears the temporary session ID
 * Called after successful authentication when activities are associated with user
 */
export function clearTemporarySessionId(): void {
    sessionStorage.removeItem(TEMP_SESSION_ID_KEY);
}

/**
 * Sets authentication status
 */
export function setAuthStatus(authenticated: boolean): void {
    sessionStorage.setItem(AUTH_STATUS_KEY, authenticated ? 'true' : 'false');
}

/**
 * Gets authentication status
 */
export function getAuthStatus(): boolean {
    return sessionStorage.getItem(AUTH_STATUS_KEY) === 'true';
}

/**
 * Clears all session storage data
 */
export function clearSessionStorage(): void {
    sessionStorage.removeItem(TEMP_SESSION_ID_KEY);
    sessionStorage.removeItem(AUTH_STATUS_KEY);
}

