import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../types/api';

type ApiFunction<T = any, P extends any[] = any[]> = (...args: P) => Promise<T>;

interface UseApiOptions<T, P extends any[]> {
    immediate?: boolean;
    initialData?: T;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
}

interface UseApiReturn<T, P extends any[]> {
    data: T | undefined;
    loading: boolean;
    error: ApiError | null;
    execute: (...args: P) => Promise<T | undefined>;
    reset: () => void;
}

export const useApi = <T = any, P extends any[] = any[]>(
    apiFunction: ApiFunction<T, P>,
    options: UseApiOptions<T, P> = {}
): UseApiReturn<T, P> => {
    const {
        immediate = false,
        initialData,
        onSuccess,
        onError,
    } = options;

    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const isMounted = useRef<boolean>(true);

    const execute = useCallback(async (...args: P): Promise<T | undefined> => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiFunction(...args);

            if (isMounted.current) {
                setData(result);
                onSuccess?.(result);
            }

            return result;
        } catch (err) {
            const apiError = err as ApiError;

            if (isMounted.current) {
                setError(apiError);
                onError?.(apiError);
            }

            throw apiError;
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [apiFunction, onSuccess, onError]);

    const reset = useCallback((): void => {
        setData(initialData);
        setError(null);
        setLoading(false);
    }, [initialData]);

    useEffect(() => {
        if (immediate) {
            execute(...([] as unknown as P));
        }
    }, [execute, immediate]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
    };
};