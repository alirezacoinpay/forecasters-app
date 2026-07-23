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
const RETRY_DELAY = 1000;

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

            // FRESH check every time - don't cache
            const tgDetected = isTelegramMiniApp();
            console.log('[Auth] isTelegramMiniApp:', tgDetected);

            if (tgDetected) {
                const initData = getTelegramInitData();
                console.log('[Auth] initData:', initData ? `${initData.length} chars` : 'EMPTY');

                if (initData && initData.length > 0) {
                    try {
                        console.log('[Auth] Attempting Telegram login...');
                        const telegramUser = await authService.telegramLogin(initData);
                        console.log('[Auth] Telegram login SUCCESS:', telegramUser);
                        setUser(telegramUser);
                        setAuthenticated(true);
                        setAuthStatus(true);
                        setRetryCount(0);
                        return;
                    } catch (tgError: any) {
                        console.error('[Auth] Telegram login FAILED:', {
                            message: tgError?.message,
                            status: tgError?.status,
                            data: tgError?.data,
                        });
                        // Fall through to web auth
                    }
                }
            }

            // Web auth flow - check existing session first
            console.log('[Auth] Trying web auth...');
            const currentUser = await authService.checkAuth();

            if (currentUser) {
                console.log('[Auth] Existing session valid:', currentUser);
                setUser(currentUser);
                setAuthenticated(true);
                setAuthStatus(true);
                clearTemporarySessionId();
                setRetryCount(0);
            } else {
                console.log('[Auth] No session, trying auto-login...');
                try {
                    const loggedInUser = await authService.autoLogin();
                    
                    if (loggedInUser) {
                        console.log('[Auth] Auto-login SUCCESS:', loggedInUser);
                        setUser(loggedInUser);
                        setAuthenticated(true);
                        setAuthStatus(true);
                        clearTemporarySessionId();
                        setRetryCount(0);
                    } else {
                        throw new Error('Auto-login failed: No user data returned');
                    }
                } catch (autoLoginError: any) {
                    console.error('[Auth] Auto-login failed:', autoLoginError);
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
            console.error('[Auth] Final error:', error);
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
    }, []);

    return {
        user,
        loading,
        error,
        authenticated,
        retry,
    };
}
