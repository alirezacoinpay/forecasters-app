import { useState, useEffect, useCallback, useRef } from "react";
import { predictionService } from "../services/predictionService.service";
import { Prediction } from "../models/Prediction";
import { toast } from "sonner";
import { useTranslation } from "./useTranslation";

export function useUserPredictions(perPage: number = 10) {
    const t = useTranslation();
    const [items, setItems] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage,
        lastPage: 1,
    });
    const abortControllerRef = useRef<AbortController | null>(null);

    const load = useCallback(async (pageToLoad: number = 1, append: boolean = false) => {
        if (!append && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const { items: newItems, meta } = await predictionService.getUserPredictions({
                page: pageToLoad,
                paginate: perPage,
            });

            if (!abortControllerRef.current?.signal.aborted) {
                if (append) {
                    setItems(prev => [...prev, ...newItems]);
                } else {
                    setItems(newItems);
                }
                setPagination(prev => ({
                    ...prev,
                    page: meta.current_page,
                    perPage: meta.per_page,
                    lastPage: meta.last_page,
                }));
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err);
                if (!append) {
                    toast.error(t('errors.loadingPredictions'), {
                        description: err.message || t('errors.tryAgain'),
                        duration: 3000,
                    });
                }
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                if (append) {
                    setLoadingMore(false);
                } else {
                    setLoading(false);
                }
            }
        }
    }, [perPage, t]);

    useEffect(() => {
        load();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [load]);

    const loadMore = useCallback(async () => {
        setPagination(prev => {
            const nextPage = prev.page + 1;
            if (nextPage <= prev.lastPage && !loading && !loadingMore) {
                load(nextPage, true);
            }
            return prev;
        });
    }, [load, loading, loadingMore]);

    const refresh = useCallback(() => load(1, false), [load]);

    return {
        items,
        loading,
        loadingMore,
        error,
        pagination,
        loadMore,
        refresh,
    };
}
