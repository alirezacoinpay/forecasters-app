import { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    MoreHorizontal,
    TrendingUp,
    Heart,
} from 'lucide-react';
import { Button } from './ui/button';
import { Prediction } from "../models/Prediction.ts";
import { ShareContent } from './ShareContent';
import { BottomSheet } from './ui/BottomSheet';
import ForwardCustomIcon from "./icons/ForwardCustomIcon.tsx";
import { PredictionPoll } from './PredictionPoll.tsx';
import { formatCount } from '../utils/format';
import { memo } from 'react';
import { predictionService } from '../services/predictionService.service';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionCardProps {
    prediction: Prediction;
    onClick?: () => void;
    onPredictionUpdate?: (prediction: Prediction) => void;
}

export const PredictionCard = memo(function PredictionCard({
                                                               prediction,
                                                               onClick,
                                                               onPredictionUpdate
                                                           }: PredictionCardProps) {
    const t = useTranslation();
    const [showShareSheet, setShowShareSheet] = useState(false);
    const touchHandledRef = useRef(false);
    const [isLiked, setIsLiked] = useState(prediction.isLiked ?? false);
    const [likesCount, setLikesCount] = useState(prediction.predictionLikes ?? 0);
    const [isLiking, setIsLiking] = useState(false);

    // Sync state when prediction prop changes
    useEffect(() => {
        setIsLiked(prediction.isLiked ?? false);
        setLikesCount(prediction.predictionLikes ?? 0);
    }, [prediction.isLiked, prediction.predictionLikes]);

    const handleLike = async (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
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

    return (
        <div
            className="bg-card border-b border-border px-4 py-4 space-y-3 cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all duration-3500"
            onClick={(e) => {
                // Don't trigger card click if share sheet is open
                if (showShareSheet) {
                    e.stopPropagation();
                    return;
                }
                // Don't trigger if click came from a button
                const target = e.target as HTMLElement;
                const isButton = target.closest('button');
                if (isButton) {
                    return;
                }
                onClick?.();
            }}
            dir="rtl"
            role="button"
            tabIndex={0}
            aria-label={`${t('ui.labels.predictions')}: ${prediction.title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        // TODO: Add menu functionality
                    }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-300 text-muted-foreground">{prediction.timePast}</span>
                    <span className="text-xs font-300 text-muted-foreground">•</span>
                    <span className="text-sm font-700">{prediction.user?.username || t('ui.anonymous')}</span>
                    <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                </div>
            </div>

            {/* Prediction */}
            <div className="space-y-2">
                <p className="text-sm font-400 leading-relaxed">{prediction.title}</p>
            </div>

            {/* Poll */}
            <PredictionPoll
                prediction={prediction}
                onPredictionUpdate={onPredictionUpdate}
            />

            {/* Actions */}
            <div className="flex items-center justify-between">
                {/* Share Button */}
                <Button
                    variant="ghost"
                    className="inline-flex items-center gap-0.5 h-auto p-0 hover:bg-transparent text-gray-500"
                    onTouchStart={(e: React.TouchEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        touchHandledRef.current = true;
                        setShowShareSheet(true);
                        setTimeout(() => {
                            touchHandledRef.current = false;
                        }, 300);
                    }}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (touchHandledRef.current) {
                            return;
                        }
                        setShowShareSheet(true);
                    }}
                >
                    <span className="text-sm">{formatCount(prediction.predictionForwardCount)}</span>
                    <ForwardCustomIcon className="w-4 h-4" />
                </Button>

                {/* Like Button */}
                <Button
                    variant="ghost"
                    className="inline-flex items-center gap-0.5 h-auto p-0 hover:bg-transparent text-gray-500"
                    disabled={isLiking}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleLike(e);
                    }}
                    onTouchStart={(e: React.TouchEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        touchHandledRef.current = true;
                        handleLike(e);
                    }}
                    onTouchEnd={(e: React.TouchEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        touchHandledRef.current = true;
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                >
                    <span className={`text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {formatCount(likesCount)}
                    </span>
                    <Heart
                        className={`w-4 h-4 transition-all ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                </Button>

                {/* Comment Button - Opens PredictionDetail */}
                <Button
                    variant="ghost"
                    className="inline-flex items-center gap-0.5 h-auto p-0 hover:bg-transparent text-gray-500"
                    onClick={(e: { stopPropagation: () => void; }) => {
                        e.stopPropagation();
                        // Call the onClick prop to open the detail sheet
                        onClick?.();
                    }}
                >
                    <span className="text-xs">{formatCount(prediction.commentsCount)}</span>
                    <MessageCircle className="w-4 h-4" />
                </Button>
            </div>

            {/* Share Sheet */}
            {showShareSheet && (
                <BottomSheet
                    isOpen={showShareSheet}
                    onClose={() => setShowShareSheet(false)}
                    header={
                        <div className="flex items-center justify-between w-full">
                            <h3 id="share-bottom-sheet-title" className="font-semibold">{t('ui.labels.shareTitle')}</h3>
                            <div className="w-10"></div>
                        </div>
                    }
                    options={{
                        initialHeight: 30,
                        maxHeight: 50,
                        maxWidth: 'max-w-[428px]',
                        closeThreshold: 25,
                        velocityThreshold: 0.5,
                        zIndex: 100,
                    }}
                    aria-labelledby="share-bottom-sheet-title"
                >
                    <ShareContent predictionId={prediction.id} onClose={() => setShowShareSheet(false)} />
                </BottomSheet>
            )}
        </div>
    );
});