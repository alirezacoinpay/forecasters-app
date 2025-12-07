import { useState, useEffect, useCallback } from 'react';
import { topicRepository } from '../repositories/TopicRepository';
import { Topic } from '../types/api';
import { toast } from 'sonner';

// Simple in-memory cache
let topicsCache: Topic[] | null = null;
let topicsCachePromise: Promise<Topic[]> | null = null;

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTopics = useCallback(async (forceRefresh: boolean = false) => {
        // Return cached data if available and not forcing refresh
        if (!forceRefresh && topicsCache) {
            setTopics(topicsCache);
            setLoading(false);
            return topicsCache;
        }

        // If already fetching, wait for that promise
        if (topicsCachePromise) {
            try {
                const cachedTopics = await topicsCachePromise;
                setTopics(cachedTopics);
                setLoading(false);
                return cachedTopics;
            } catch (err) {
                // If cached promise fails, continue to fetch
            }
        }

        // Start new fetch
        setLoading(true);
        setError(null);

        topicsCachePromise = topicRepository.fetch()
            .then((fetchedTopics) => {
                topicsCache = fetchedTopics;
                setTopics(fetchedTopics);
                setLoading(false);
                topicsCachePromise = null;
                return fetchedTopics;
            })
            .catch((err) => {
                const error = err instanceof Error ? err : new Error('خطا در دریافت موضوعات');
                setError(error);
                setLoading(false);
                topicsCachePromise = null;
                toast.error('خطا در دریافت موضوعات', {
                    description: error.message || 'لطفاً دوباره تلاش کنید',
                });
                throw error;
            });

        return topicsCachePromise;
    }, []);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    const refresh = useCallback(() => {
        topicsCache = null;
        return fetchTopics(true);
    }, [fetchTopics]);

    return {
        topics,
        loading,
        error,
        refresh,
    };
}
