import { useCallback, useState } from 'react';
import { ApiError } from '../types/api';

interface UseApiStateReturn {
    loading: boolean;
    error: ApiError | null;
    startLoading: () => void;
    stopLoading: () => void;
    setError: (error: ApiError | null) => void;
    reset: () => void;
}

export const useApiState = (): UseApiStateReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setApiError] = useState<ApiError | null>(null);

    const startLoading = useCallback((): void => {
        setLoading(true);
        setApiError(null);
    }, []);

    const stopLoading = useCallback((): void => {
        setLoading(false);
    }, []);

    const setError = useCallback((error: ApiError | null): void => {
        setApiError(error);
        setLoading(false);
    }, []);

    const reset = useCallback((): void => {
        setLoading(false);
        setApiError(null);
    }, []);

    return {
        loading,
        error,
        startLoading,
        stopLoading,
        setError,
        reset,
    };
};