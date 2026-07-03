import { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {Prediction} from "../models/Prediction.ts";
import { CommentSection } from './CommentSection';
import { CommentInput } from './CommentInput';
import { PredictionsOptions } from './PredictionsOptions';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { activityService } from '../services/activityService.service';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { formatCount } from '../utils/format';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionDetailProps {
    prediction: Prediction;
    onClose: () => void;
    onRefresh?: () => void;
    onTagClick?: (tag: { id: number; title: string; color: string }) => void;
}

const TRANSITION_MS = 300;

export function PredictionDetail({ prediction, onClose, onRefresh, onTagClick }: PredictionDetailProps) {
    const t = useTranslation();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(prediction.isLiked ?? false);
    const [likesCount, setLikesCount] = useState(prediction.predictionLikes ?? 0);
    const [isLiking, setIsLiking] = useState(false);

    // Sync state when prediction prop changes
    useEffect(() => {
        setIsLiked(prediction.isLiked ?? false);
        setLikesCount(prediction.predictionLikes ?? 0);
    }, [prediction.isLiked, prediction.predictionLikes]);

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

    useEffect(() => {
        setIsVisible(true);
        // Focus management: focus the sheet content when it opens
        setTimeout(() => {
            containerRef.current?.focus();
        }, 100);
    }, [containerRef]);

    const handleLike = async () => {
        if (isLiking) return;

        const wasLiked = isLiked;
        const previousCount = likesCount;

        // Optimistic update
        setIsLiked(!wasLiked);
        setLikesCount(wasLiked ? previousCount - 1 : previousCount + 1);
        setIsLiking(true);

        try {
            const response = await predictionService.likePrediction(prediction.id);

            // Update with actual response
            setIsLiked(response.is_liked);
            setLikesCount(response.likesCount);

        } catch (error: any) {
            // Revert optimistic update on error
            setIsLiked(wasLiked);
            setLikesCount(previousCount);
            
            const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
            toast.error(t('errors.likeError'), {
                description: errorMessage,
                duration: 3000,
            });
        } finally {
            setIsLiking(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            toast.error(t('errors.selectOption'), {
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading(t('ui.loading.loading'));

        try {
            await predictionService.submitPrediction({
                prediction_option_id: Number(selectedOption),
            });


            toast.dismiss(loadingToast);
            toast.success(t('success.predictionSubmitted'), {
                duration: 2000,
            });

            // Refresh feed if callback provided
            if (onRefresh) {
                onRefresh();
            }

            // Close modal after success
            setTimeout(() => {
                handleClose();
            }, 300);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
            toast.error(t('errors.submitPredictionError'), {
                description: errorMessage,
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


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
                dir="rtl"
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
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <div className="px-3">
                            <span className="text-md font-medium">{t('ui.labels.comments')}</span>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-4">
                        <CommentSection 
                            comments={prediction.comments ?? []} 
                            predictionId={prediction.id}
                            onCommentAdded={() => {
                                if (onRefresh) {
                                    onRefresh();
                                }
                            }}
                        />
                    </div>

                    <div className="sticky bottom-0 shrink-0 border-t border-border bg-background px-4 py-3 z-10 mb-4 ">
                        <CommentInput
                            predictionId={prediction.id}
                            variant="sheet"
                            onCommentAdded={() => {
                                if (onRefresh) {
                                    onRefresh();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
