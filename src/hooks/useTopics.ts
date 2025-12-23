import { useState, useEffect, useCallback } from 'react';
import { topicRepository } from '../repositories/TopicRepository';
import { Topic } from '../types/api';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

// Default topic ID for "Forecasters" - special ID that doesn't send topic_id to API
export const DEFAULT_TOPIC_ID = 0;

// Get default topic name from environment variable, fallback to "Forecasters"
const DEFAULT_TOPIC_NAME = import.meta.env.VITE_DEFAULT_TOPIC_NAME || 'Forecasters';

// Simple in-memory cache
let topicsCache: Topic[] | null = null;
let topicsCachePromise: Promise<Topic[]> | null = null;

export function useTopics() {
    const t = useTranslation();
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
                // Add default "Forecasters" topic at the beginning of the list
                const defaultTopic: Topic = {
                    id: DEFAULT_TOPIC_ID,
                    title: DEFAULT_TOPIC_NAME,
                };
                const topicsWithDefault = [defaultTopic, ...fetchedTopics];
                topicsCache = topicsWithDefault;
                setTopics(topicsWithDefault);
                setLoading(false);
                topicsCachePromise = null;
                return topicsWithDefault;
            })
            .catch((err) => {
                const error = err instanceof Error ? err : new Error(t('errors.loadingTopics'));
                setError(error);
                setLoading(false);
                topicsCachePromise = null;
                toast.error(t('errors.loadingTopics'), {
                    description: error.message || t('errors.tryAgain'),
                    duration: 3000,
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
