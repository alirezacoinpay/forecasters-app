import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {Prediction} from "../models/Prediction.ts";
import { CommentSection } from './CommentSection';
import { CommentInput } from './CommentInput';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { useComments } from '../hooks/useComments';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionDetailProps {
    prediction: Prediction;
    onClose: () => void;
    onTagClick?: (tag: { id: number; title: string; color: string }) => void;
}

const TRANSITION_MS = 300;

export function PredictionDetail({ prediction, onClose, onTagClick }: PredictionDetailProps) {
    const t = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const {
        comments,
        loading: commentsLoading,
        loadingMore: commentsLoadingMore,
        loadMore: loadMoreComments,
        refresh: refreshComments,
        hasMore: hasMoreComments,
    } = useComments(prediction.id);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, TRANSITION_MS);
    };

    const {
        state,
        height,
        isDragging,
        canScroll,
        containerRef,
        contentRef,
        onMouseDown,
        onTouchStart,
    } = useBottomSheet({
        onClose: handleClose,
        collapsedHeight: 50,
        halfExpandedHeight: 75,
        fullyExpandedHeight: 95,
        closeThreshold: 30,
        velocityThreshold: 0.5,
    });

    const { sentinelRef } = useInfiniteScroll({
        onLoadMore: loadMoreComments,
        hasMore: hasMoreComments,
        enabled: !commentsLoading && comments.length > 0,
        rootRef: contentRef,
    });

    const handleCommentAdded = useCallback(async () => {
        await refreshComments();
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [refreshComments, contentRef]);

    useEffect(() => {
        setIsVisible(true);
        // Focus management: focus the sheet content when it opens
        setTimeout(() => {
            containerRef.current?.focus();
        }, 100);
    }, [containerRef]);


    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={handleClose}
            style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease-out`,
            }}
        >
            <div
                ref={containerRef}
                className="bg-background w-full max-w-2xl rounded-t-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                    // Only handle drag if not clicking on content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(e.target as HTMLElement);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal interaction with content
                        }
                    }
                    onMouseDown(e);
                }}
                onTouchStart={(e) => {
                    // Only handle drag if not touching content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(e.target as HTMLElement);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal scrolling
                        }
                    }
                    onTouchStart(e);
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="prediction-detail-title"
                tabIndex={-1}
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: isDragging ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), height ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    height: `${height}vh`,
                    maxHeight: '95vh',
                    cursor: isDragging ? 'grabbing' : 'default',
                    userSelect: isDragging ? 'none' : 'auto',
                    touchAction: 'none', // Prevent default touch behavior on container, content handles its own
                }}
            >
                {/* Drag handle indicator - also draggable */}
                <div 
                    className="flex items-center justify-center pt-3 cursor-grab active:cursor-grabbing"
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                >
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div 
                    ref={contentRef}
                    className="flex flex-col h-full overflow-y-auto"
                    style={{
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: canScroll ? 'pan-y' : 'none',
                        pointerEvents: 'auto',
                        position: 'relative',
                        height: '100%',
                    }}
                    onTouchStart={(e) => {
                        if (canScroll && contentRef.current) {
                            const atTop = contentRef.current.scrollTop <= 5;
                            if (!atTop) {
                                e.stopPropagation();
                            }
                        }
                    }}
                >
                    <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 pb-2 flex items-center justify-between z-10">
                        <div className="px-3">
                            <span className="text-sm font-medium">{t('ui.labels.comments')}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 px-4 py-4 mb-4">
                        <CommentSection 
                            comments={comments} 
                            predictionId={prediction.id}
                            onCommentAdded={handleCommentAdded}
                            loading={commentsLoading}
                            isLoadingMore={commentsLoadingMore}
                            sentinelRef={sentinelRef}
                        />
                    </div>

                    <div className="sticky bottom-4 shrink-0 border-t border-border bg-background px-3 py-2 z-10 overflow-hidden">
                        <CommentInput
                            predictionId={prediction.id}
                            variant="sheet"
                            onCommentAdded={handleCommentAdded}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
