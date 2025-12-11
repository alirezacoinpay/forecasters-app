import { useState, useEffect } from "react";
import { PredictionCard } from "../PredictionCard";
import { PredictionCardSkeleton } from "../PredictionCardSkeleton";
import { useSwipe } from "../../hooks/useSwipe";
import { usePredictionFeed } from "../../hooks/predictions/usePredictionFeed.ts.tsx";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import {Prediction} from "../../models/Prediction.ts";
import { toast } from "sonner";
import { activityService } from "../../services/activityService.service";

interface FeedViewProps {
    onPredictionClick: (prediction: Prediction) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    searchQuery?: string;
    topicId?: number;
    onTagClick?: (tag: { id: number; title: string; color: string }) => void;
}

export function FeedView({ onPredictionClick, onSwipeLeft, onSwipeRight, searchQuery, topicId, onTagClick } : FeedViewProps) {
    const { predictions, loading, pagination, loadMore, refresh } = usePredictionFeed(searchQuery, topicId);
    
    // Log feed view activity
    useEffect(() => {
        if (predictions.length > 0 && !loading) {
            activityService.logActivity('feed_view', {
                page: 'home',
                topic_id: topicId,
            });
        }
    }, [predictions.length, loading, topicId]);
    
    // Listen for refresh events
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };
        window.addEventListener('refresh-feed', handleRefresh);
        return () => {
            window.removeEventListener('refresh-feed', handleRefresh);
        };
    }, [refresh]);
    
    const swipe = useSwipe({ 
        onSwipeLeft: () => {
            onSwipeLeft();
        },
        onSwipeRight: () => {
            onSwipeRight();
        },
    });
    
    // Only spread event handlers, not state values
    const swipeHandlers = {
        onTouchStart: swipe.onTouchStart,
        onTouchEnd: swipe.onTouchEnd,
    };
    
    const { isRefreshing, elementRef } = usePullToRefresh({
        onRefresh: async () => {
            await refresh();
        },
        enabled: !loading && predictions.length > 0,
    });

    const hasMore = pagination.page < pagination.lastPage;
    
    const { isLoading: isLoadingMore, sentinelRef } = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
        enabled: !loading && predictions.length > 0,
    });

    return (
        <div 
            {...swipeHandlers} 
            ref={elementRef as any}
            className="space-y-0 relative"
            style={{ minHeight: '100vh', overflowX: 'hidden' }}
        >
            {/* Pull to refresh indicator */}
            {isRefreshing && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border rounded-full p-2 shadow-lg">
                    <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Debug info in dev mode */}
            {import.meta.env.DEV && (
                <div className="fixed bottom-20 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
                    <div>Loading: {loading ? 'Yes' : 'No'}</div>
                    <div>Predictions: {predictions.length}</div>
                    <div>Has Data: {predictions.length > 0 ? 'Yes' : 'No'}</div>
                </div>
            )}

            <div className="relative w-full">
                {loading && predictions.length === 0 ? (
                    // Show skeletons on initial load
                    Array.from({ length: 5 }).map((_, index) => (
                        <PredictionCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : predictions.length > 0 ? (
                    <>
                        {predictions.map((prediction: Prediction, index: number) => (
                            <div 
                                key={prediction.id}
                                className="fade-in"
                                style={{ 
                                    animationDelay: `${index * 0.05}s`,
                                }}
                            >
                                <PredictionCard
                                    prediction={prediction}
                                    onClick={() => onPredictionClick(prediction)}
                                    onTagClick={onTagClick}
                                />
                            </div>
                        ))}
                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-4" />
                        {isLoadingMore && (
                            <div className="py-4">
                                <PredictionCardSkeleton />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-6" dir="rtl">
                        <p className="text-muted-foreground text-center mb-4">
                            هیچ پیش‌بینی در این دسته یافت نشد
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                            اولین پیش‌بینی را ایجاد کنید
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
