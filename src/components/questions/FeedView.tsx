import { useState, useEffect } from "react";
import { PredictionCard } from "../PredictionCard";
import { PredictionCardSkeleton } from "../PredictionCardSkeleton";
import { useSwipe } from "../../hooks/useSwipe";
import { usePredictionFeed } from "../../hooks/predictions/usePredictionFeed.ts.tsx";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import {Prediction} from "../../models/Prediction.ts";
import { toast } from "sonner";

interface FeedViewProps {
    onPredictionClick: (prediction: Prediction) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    searchQuery?: string;
    topicId?: number;
}

export function FeedView({ onPredictionClick, onSwipeLeft, onSwipeRight, searchQuery, topicId } : FeedViewProps) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
    const [previousTopicId, setPreviousTopicId] = useState<number | undefined>(undefined);
    
    const { predictions, loading, pagination, loadMore, refresh } = usePredictionFeed(searchQuery, topicId);
    
    // Track when topic changes
    useEffect(() => {
        if (topicId !== previousTopicId && previousTopicId !== undefined) {
            // Topic changed
            setIsTransitioning(true);
            setTimeout(() => {
                setIsTransitioning(false);
                setTransitionDirection(null);
            }, 300);
        }
        setPreviousTopicId(topicId);
    }, [topicId, previousTopicId]);
    
    const swipe = useSwipe({ 
        onSwipeLeft: () => {
            setTransitionDirection('left');
            setIsTransitioning(true);
            onSwipeLeft();
        },
        onSwipeRight: () => {
            setTransitionDirection('right');
            setIsTransitioning(true);
            onSwipeRight();
        },
        onSwipeProgress: (progress, direction) => {
            // Track swipe progress for carousel animation
            if (progress > 10) {
                setTransitionDirection(direction);
                setIsTransitioning(true);
            }
        },
    });
    
    // Only spread event handlers, not state values
    const swipeHandlers = {
        onTouchStart: swipe.onTouchStart,
        onTouchMove: swipe.onTouchMove,
        onTouchEnd: swipe.onTouchEnd,
    };
    
    const swipeProgress = swipe.swipeProgress;
    const isSwiping = swipe.isSwiping;
    
    const { isRefreshing, elementRef } = usePullToRefresh({
        onRefresh: async () => {
            await refresh();
            toast.success('به‌روزرسانی شد');
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
            className="space-y-0 relative overflow-hidden"
            style={{ minHeight: '100vh' }}
        >
            {/* Pull to refresh indicator */}
            {isRefreshing && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">در حال به‌روزرسانی...</span>
                    </div>
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

            <div 
                className="relative w-full"
                style={{
                    transform: isSwiping && swipeProgress > 0
                        ? `translateX(${swipe.swipeDirection === 'left' ? -swipeProgress : swipeProgress}%)`
                        : 'translateX(0)',
                    transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
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
                                    opacity: isSwiping ? Math.max(0, 1 - swipeProgress / 50) : 1,
                                }}
                            >
                                <PredictionCard
                                    prediction={prediction}
                                    onClick={() => onPredictionClick(prediction)}
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
