import { useState, useEffect, useCallback, useRef } from "react";
import { predictionRepository } from "../../repositories/PredictionRepository";
import { Prediction } from "../../models/Prediction";
import { toast } from "sonner";

export function usePredictionFeed(searchQuery?: string, topicId?: number) {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 20,
        lastPage: 1,
    });
    const abortControllerRef = useRef<AbortController | null>(null);

    const load = useCallback(async (pageToLoad?: number, append: boolean = false) => {
        // Cancel previous request if still pending (only on new page loads, not appends)
        if (!append && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        if (!append) {
            setLoading(true);
        }
        setError(null);

        try {
            const page = pageToLoad ?? pagination.page;
            const params = {
                page,
                paginate: pagination.perPage,
                ...(searchQuery && { search: searchQuery }),
                ...(topicId && { topic_id: topicId }),
            };

            const { predictions: newPredictions, meta } = await predictionRepository.fetch(params);

           

            // Check if component is still mounted
            if (!abortControllerRef.current?.signal.aborted) {
                if (append) {
                    setPredictions(prev => [...prev, ...newPredictions]);
                } else {
                    setPredictions(newPredictions);
                }
                setPagination({
                    page: meta.current_page,
                    perPage: meta.per_page,
                    lastPage: meta.last_page,
                });
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err);
                if (!append) {
                    toast.error('خطا در بارگذاری پیش‌بینی‌ها', {
                        description: err.message || 'لطفاً دوباره تلاش کنید',
                        duration: 3000,
                    });
                }
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, [searchQuery, topicId, pagination.page, pagination.perPage]);

    useEffect(() => {
        load();

        // Cleanup: cancel request on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [load]);

    const loadMore = useCallback(() => {
        if (pagination.page < pagination.lastPage && !loading) {
            load(pagination.page + 1, true);
        }
    }, [pagination, loading, load]);

    return {
        predictions,
        loading,
        error,
        pagination,
        setPage: (p: number) => {
            setPagination((prev) => ({ ...prev, page: p }));
            load(p, false);
        },
        refresh: () => load(1, false),
        loadMore,
    };
}
