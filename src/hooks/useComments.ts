import { useState, useEffect, useCallback, useRef } from 'react';
import { Comment } from '../models/Comment';
import { commentService } from '../services/commentService.service';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

const COMMENTS_PER_PAGE = 15;

export function useComments(predictionId: number) {
    const t = useTranslation();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: COMMENTS_PER_PAGE,
        lastPage: 1,
    });
    const abortControllerRef = useRef<AbortController | null>(null);
    const isRefreshingRef = useRef(false);

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

        try {
            const { comments: newComments, meta } = await commentService.getComments(predictionId, {
                page: pageToLoad,
                per_page: COMMENTS_PER_PAGE,
            });

            if (!abortControllerRef.current?.signal.aborted) {
                setComments((prev) => (append ? [...prev, ...newComments] : newComments));
                setPagination({
                    page: meta.current_page,
                    perPage: meta.per_page,
                    lastPage: meta.last_page,
                });
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                toast.error(t('errors.loadingComments'), {
                    description: err.message || t('errors.tryAgain'),
                    duration: 3000,
                });
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [predictionId, t]);

    useEffect(() => {
        load(1, false);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [load]);

    const loadMore = useCallback(async () => {
        if (loading || loadingMore || isRefreshingRef.current) return;

        const nextPage = pagination.page + 1;
        if (nextPage <= pagination.lastPage) {
            await load(nextPage, true);
        }
    }, [load, loading, loadingMore, pagination.page, pagination.lastPage]);

    const refresh = useCallback(async () => {
        isRefreshingRef.current = true;
        try {
            await load(1, false);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [load]);

    const hasMore = pagination.page < pagination.lastPage;

    return {
        comments,
        loading,
        loadingMore,
        loadMore,
        refresh,
        hasMore,
    };
}
