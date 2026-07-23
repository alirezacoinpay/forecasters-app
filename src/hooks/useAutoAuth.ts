import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.service';
import { User } from '../types/api';
import { setAuthStatus, clearTemporarySessionId } from '../utils/sessionStorage';
import { isTelegramMiniApp, getTelegramInitData } from '../utils/telegram';

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

            // Check if we're in Telegram Mini App
            const tgDetected = isTelegramMiniApp();
            console.log('[Telegram] isTelegramMiniApp:', tgDetected);
            console.log('[Telegram] window.Telegram:', !!(window as any).Telegram);

            if (tgDetected) {
                const initData = getTelegramInitData();
                console.log('[Telegram] initData length:', initData?.length);
                console.log('[Telegram] initData preview:', initData?.substring(0, 80));

                if (initData) {
                    try {
                        console.log('[Telegram] Calling POST /auth/telegram...');
                        const telegramUser = await authService.telegramLogin(initData);
                        console.log('[Telegram] Login success:', telegramUser);
                        setUser(telegramUser);
                        setAuthenticated(true);
                        setAuthStatus(true);
                        setRetryCount(0);
                        return;
                    } catch (tgError: any) {
                        console.error('[Telegram] Login FAILED:', tgError);
                        console.error('[Telegram] Error message:', tgError?.message);
                        console.error('[Telegram] Error status:', tgError?.status);
                        console.error('[Telegram] Error data:', tgError?.data);
                        // Fall through to web auth
                    }
                } else {
                    console.warn('[Telegram] Mini App detected but initData is empty/null');
                }
            }

            // Original web auth flow
            console.log('[Auth] Falling back to web auth flow');
            const currentUser = await authService.checkAuth();

            if (currentUser) {
                // We have a valid session
                setUser(currentUser);
                setAuthenticated(true);
                setAuthStatus(true);
                clearTemporarySessionId();
                setRetryCount(0);
            } else {
                // No valid session, try auto-login (calls /login with no body)
                try {
                    const loggedInUser = await authService.autoLogin();
                    
                    if (loggedInUser) {
                        setUser(loggedInUser);
                        setAuthenticated(true);
                        setAuthStatus(true);
                        clearTemporarySessionId();
                        setRetryCount(0);
                    } else {
                        throw new Error('Auto-login failed: No user data returned');
                    }
                } catch (autoLoginError: any) {
                    if (!isRetry && retryCount < MAX_RETRIES) {
                        setRetryCount(prev => prev + 1);
                        setTimeout(() => {
                            performAuth(true);
                        }, RETRY_DELAY * (retryCount + 1));
                        return;
                    }
                    throw autoLoginError;
                }
            }
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(err?.message || 'Authentication failed');
            console.error('[Auth] Authentication failed:', error);
            setError(error);
            setAuthenticated(false);
            setAuthStatus(false);
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

