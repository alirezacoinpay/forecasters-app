import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
    onLoadMore: () => Promise<void> | void;
    hasMore: boolean;
    threshold?: number;
    enabled?: boolean;
}

export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    threshold = 200,
    enabled = true,
}: UseInfiniteScrollOptions) {
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!enabled || !hasMore || isLoading) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        observerRef.current = new IntersectionObserver(
            async (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !isLoading) {
                    setIsLoading(true);
                    try {
                        await onLoadMore();
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
            {
                rootMargin: `${threshold}px`,
            }
        );

        observerRef.current.observe(sentinel);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [onLoadMore, hasMore, threshold, enabled, isLoading]);

    return {
        isLoading,
        sentinelRef,
    };
}
