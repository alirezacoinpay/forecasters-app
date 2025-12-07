import { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {Prediction} from "../models/Prediction.ts";
import { CommentSection } from './CommentSection';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { useBottomSheet } from '../hooks/useBottomSheet';

interface PredictionDetailProps {
    prediction: Prediction;
    onClose: () => void;
}

const TRANSITION_MS = 300;

export function PredictionDetail({ prediction, onClose }: PredictionDetailProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

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

    const handleSubmit = async () => {
        if (!selectedOption) {
            toast.error('لطفاً یک گزینه انتخاب کنید');
            return;
        }

        try {
            // Optimistic update - show loading
            const loadingToast = toast.loading('در حال ثبت پیش‌بینی...');
            
            // TODO: Implement actual API call
            // await predictionService.submitPrediction(prediction.id, selectedOption);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast.dismiss(loadingToast);
            toast.success('پیش‌بینی با موفقیت ثبت شد');
            
            // Close modal after success
            setTimeout(() => {
                handleClose();
            }, 500);
        } catch (error) {
            toast.error('خطا در ثبت پیش‌بینی', {
                description: error instanceof Error ? error.message : 'لطفاً دوباره تلاش کنید',
            });
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
                    className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                >
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div 
                    ref={contentRef}
                    className="h-full pb-24"
                    style={{
                        overflowY: canScroll ? 'auto' : 'hidden',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: canScroll ? 'pan-y' : 'none',
                        pointerEvents: 'auto', // Ensure content is interactive
                        position: 'relative',
                        height: '100%',
                    }}
                    onTouchStart={(e) => {
                        // Stop propagation to prevent container from handling this touch
                        // Only if we're on content and not at top
                        if (canScroll && contentRef.current) {
                            const atTop = contentRef.current.scrollTop <= 5;
                            if (!atTop) {
                                e.stopPropagation(); // Prevent container drag handlers
                            }
                        }
                    }}
                >
                    <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 pb-2 flex items-center justify-between z-10">
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{prediction.timePast}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm">{prediction.user?.username || 'ناشناس'}</span>
                            <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 space-y-6">
                        <div>
                            <p id="prediction-detail-title" className="text-sm font-semibold leading-relaxed mb-2">{prediction.title}</p>

                            <div className="flex flex-wrap gap-1.5">
                                {prediction.tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="outline"
                                        style={{ backgroundColor: tag.color, borderColor: tag.color, color: "#fff" }}
                                        className="rounded-md"
                                    >
                                        {tag.title}
                                    </Badge>
                                ))}
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {prediction.options.map((option) => {
                                        const percentage = prediction.getOptionPercentage(option.id);
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setSelectedOption(String(option.id))}
                                                className={`bg-blue-50 rounded-lg h-20 p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                                                    selectedOption === String(option.id) 
                                                        ? 'ring-2 ring-[#FF6B35] bg-orange-50' 
                                                        : 'hover:bg-blue-100'
                                                }`}
                                            >
                                                {prediction.userPredictionsCount > 0 && (
                                                    <div className="flex items-center gap-1 text-sm text-blue-600">
                                                        <TrendingUp className="w-3 h-3" />
                                                        <span>{percentage}%</span>
                                                    </div>
                                                )}

                                                <span className="text-xs text-gray-600 text-center">
                                                    {option.title}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-border p-4 space-y-4">
                            {prediction.text && (
                                <div className="space-y-2">
                                    <h4 className="text-sm">توضیحات</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">{prediction.text}</p>
                                </div>
                            )}

                            {prediction.userPredictionsCount > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm text-center">پیش‌بینی کاربران</h4>
                                    <div className="space-y-2">
                                        {prediction.options.map((option, index) => {
                                            const percentage = prediction.getOptionPercentage(option.id);
                                            return (
                                                <div key={option.id} className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-600">
                                                            {index + 1}. {option.title} ({option.userPredictionsCount} رای)
                                                        </span>
                                                        <span className="text-[#FF6B35]">{percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#FF6B35] transition-all" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        {prediction.commentsCount > 0 && prediction.comments && prediction.comments.length > 0 && (
                            <CommentSection comments={prediction.comments} />
                        )}

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border w-full px-4 py-3 shadow-lg">
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg font-bold text-md w-full py-6"
                    >
                        ثبت پیش‌بینی
                    </Button>
                </div>
            </div>
        </div>
    );
}
