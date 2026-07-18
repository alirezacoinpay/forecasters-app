import { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    MoreHorizontal,
    TrendingUp,
    Heart, CalendarDays,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {Prediction} from "../models/Prediction.ts";
import { ShareContent } from './ShareContent';
import { BottomSheet } from './ui/BottomSheet';
import ForwardCustomIcon from "./icons/ForwardCustomIcon.tsx";
import { PredictionsOptions } from './PredictionsOptions';
import { formatCount } from '../utils/format';
import { memo } from 'react';
import { predictionService } from '../services/predictionService.service';
import { activityService } from '../services/activityService.service';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';
import {PredictionPoll} from "./PredictionPoll.tsx";

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
  onTagClick?: (tag: { id: number; title: string; color: string }) => void;
}

export const PredictionCardSummary = memo(function PredictionCard({ prediction, onClick, onTagClick }: PredictionCardProps) {
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
    // setLikesCount(wasLiked ? previousCount - 1 : previousCount + 1);
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
      className="bg-card border-b border-border px-4 py-4 space-y-3 cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all duration-150"
      onClick={(e) => {
        // Don't trigger card click if share sheet is open
        if (showShareSheet) {
          e.stopPropagation();
          return;
        }
        // Don't trigger if click came from a button (like, comment, share buttons)
        // But allow clicks on empty space in the Actions area to trigger card click
        const target = e.target as HTMLElement;
        const isButton = target.closest('button');
        if (isButton) {
          // Allow the button's own handlers to work, but don't trigger card click
          return;
        }
        onClick?.();
      }}
      dir="ltr"
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
            <div className="flex items-center gap-2">
                {prediction.user?.avatar ? (
                    <img
                        src={prediction.user.avatar}
                        alt={prediction.user.username}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                )}
                <span className="text-sm font-500">{prediction.user?.username || t('ui.anonymous')}</span>
            </div>
            <div className="flex items-center text-xs gap-2 text-gray-400 self-center">
                <CalendarDays className="w-4 h-4" />
                <span>{prediction.created_at}</span>
            </div>

            {/*<Button*/}
            {/*    variant="ghost"*/}
            {/*    size="icon"*/}
            {/*    className="h-8 w-8 rounded-full"*/}
            {/*    onClick={(e: React.MouseEvent) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        // TODO: Add menu functionality*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MoreHorizontal className="w-4 h-4" />*/}
            {/*</Button>*/}
        </div>

        {/* Prediction */}
        <div className="space-y-2">
            <p className="text-sm font-500 leading-relaxed">{prediction.title}</p>
        </div>

    </div>
  );
});
