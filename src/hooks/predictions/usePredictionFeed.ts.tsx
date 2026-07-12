import { useState, useEffect, useCallback, useRef } from "react";
import { predictionRepository } from "../../repositories/PredictionRepository";
import { Prediction } from "../../models/Prediction";
import { toast } from "sonner";
import { DEFAULT_TOPIC_ID } from "../useTopics";
import { useTranslation } from "../useTranslation";

export function usePredictionFeed(searchQuery?: string, topicId?: number, predictionId?: number, tagId?: number) {
    const t = useTranslation();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 5,
        lastPage: 1,
    });
    const abortControllerRef = useRef<AbortController | null>(null);

    const load = useCallback(async (pageToLoad: number = 1, append: boolean = false) => {
        // Cancel previous request if still pending (only on new page loads, not appends)
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
            const params: any = {
                page: pageToLoad,
                paginate: 5, // Fixed to 5 items per page as requested
            };
            
            // Add search query if present
            // When both tag and search query are present, send both (user is filtering tag results with search)
            if (searchQuery) {
                params.search = searchQuery;
            }
            
            // Add prediction_id if present (for deep links)
            if (predictionId) {
                params.prediction_id = predictionId;
            }
            
            // Add topic_id only if:
            // 1. topicId is defined
            // 2. It's NOT the default topic (DEFAULT_TOPIC_ID = 0) - "Forecasters" shows all predictions
            // 3. predictionId is NOT present (deep links don't need topic_id)
            if (topicId !== undefined && topicId !== DEFAULT_TOPIC_ID && !predictionId) {
                params.topic_id = topicId;
            }

            // Add tag_id if present (when tag is selected, only tag_id should be sent, not search text)
            if (tagId !== undefined && tagId !== DEFAULT_TOPIC_ID && !predictionId) {
                params.tag_id = tagId;
            }

            const { predictions: newPredictions, meta } = await predictionRepository.fetch(params);

            // Check if component is still mounted
            if (!abortControllerRef.current?.signal.aborted) {
                if (append) {
                    setPredictions(prev => [...prev, ...newPredictions]);
                } else {
                    setPredictions(newPredictions);
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
                    // Only show error if not a deep link (deep link errors handled in FeedView)
                    if (!predictionId) {
                        toast.error(t('errors.loadingPredictions'), {
                            description: err.message || t('errors.tryAgain'),
                            duration: 3000,
                        });
                    }
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
    }, [searchQuery, topicId, predictionId, tagId]);

    // Track previous predictionId to detect when it's cleared after successful load
    const prevPredictionIdRef = useRef<number | undefined>(predictionId);
    const shouldSkipReloadRef = useRef(false);
    
    useEffect(() => {
        // Check if predictionId was just cleared (went from value to undefined)
        const wasCleared = prevPredictionIdRef.current !== undefined && predictionId === undefined;
        
        // If predictionId was cleared after a successful load, skip reload
        // This prevents the third API call when deep link is processed
        if (wasCleared && shouldSkipReloadRef.current) {
            prevPredictionIdRef.current = predictionId;
            shouldSkipReloadRef.current = false; // Reset after skipping
            return;
        }
        
        // Update previous value
        prevPredictionIdRef.current = predictionId;
        
        // Reset flag when predictionId is set (new deep link)
        if (predictionId) {
            shouldSkipReloadRef.current = false;
        }
        
        load();

        // Cleanup: cancel request on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [load]);
    
    // Mark that we should skip reload when predictionId is cleared after successful load
    useEffect(() => {
        if (predictionId && predictions.length > 0 && !loading) {
            // When we successfully load with a predictionId, mark to skip reload if it's cleared
            shouldSkipReloadRef.current = true;
        }
    }, [predictionId, predictions.length, loading]);

    const loadMore = useCallback(async () => {
        setPagination(prev => {
            const nextPage = prev.page + 1;
            if (nextPage <= prev.lastPage && !loading && !loadingMore) {
                // Load next page asynchronously - don't update state here, 
                // let load() update it after successful fetch
                load(nextPage, true);
            }
            return prev;
        });
    }, [load, loading, loadingMore]);

    const updatePrediction = useCallback((updated: Prediction) => {
        setPredictions((prev) =>
            prev.map((prediction) => (prediction.id === updated.id ? updated : prediction))
        );
    }, []);

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
        updatePrediction,
    };
}
