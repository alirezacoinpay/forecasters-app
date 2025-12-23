import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.service';
import { User } from '../types/api';
import { setAuthStatus, clearTemporarySessionId } from '../utils/sessionStorage';

interface UseAutoAuthReturn {
    user: User | null;
    loading: boolean;
    error: Error | null;
    authenticated: boolean;
    retry: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Hook for automatic authentication
 * Checks authentication by calling /me endpoint, automatically logs in if needed
 */
export function useAutoAuth(): UseAutoAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [retryCount, setRetryCount] = useState<number>(0);

    const performAuth = useCallback(async (isRetry = false) => {
        try {
            setLoading(true);
            setError(null);

            // First, check if we have a valid cookie by calling /me
            const currentUser = await authService.checkAuth();

            if (currentUser) {
                // We have a valid session
                setUser(currentUser);
                setAuthenticated(true);
                setAuthStatus(true);
                clearTemporarySessionId(); // Clear temp session after successful auth
                setRetryCount(0);
            } else {
                // No valid session, try auto-login (calls /login with no body)
                try {
                    const loggedInUser = await authService.autoLogin();
                    
                    if (loggedInUser) {
                        setUser(loggedInUser);
                        setAuthenticated(true);
                        setAuthStatus(true);
                        clearTemporarySessionId(); // Clear temp session after successful auth
                        setRetryCount(0);
                    } else {
                        throw new Error('Auto-login failed: No user data returned');
                    }
                } catch (autoLoginError: any) {
                    // If auto-login fails and we haven't exceeded retries, retry
                    if (!isRetry && retryCount < MAX_RETRIES) {
                        setRetryCount(prev => prev + 1);
                        setTimeout(() => {
                            performAuth(true);
                        }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
                        return;
                    }
                    throw autoLoginError;
                }
            }
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(err?.message || 'Authentication failed');
            setError(error);
            setAuthenticated(false);
            setAuthStatus(false);
            
            // Don't block the app if auth fails - allow limited functionality
            if (import.meta.env.DEV) {
                console.warn('Auto-authentication failed:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [retryCount]);

    const retry = useCallback(() => {
        setRetryCount(0);
        performAuth(false);
    }, [performAuth]);

    useEffect(() => {
        performAuth(false);
    }, []); // Only run on mount

    return {
        user,
        loading,
        error,
        authenticated,
        retry,
    };
}

