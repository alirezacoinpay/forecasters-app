import { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    MoreHorizontal,
    TrendingUp,
    Heart,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {Prediction} from "../models/Prediction.ts";
import { ShareBottomSheet } from './ShareBottomSheet';
import ForwardCustomIcon from "./icons/ForwardCustomIcon.tsx";
import { PredictionsOptions } from './PredictionsOptions';
import { formatCount } from '../utils/format';
import { memo } from 'react';
import { predictionService } from '../services/predictionService.service';
import { activityService } from '../services/activityService.service';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
  onTagClick?: (tag: { id: number; title: string; color: string }) => void;
}

export const PredictionCard = memo(function PredictionCard({ prediction, onClick, onTagClick }: PredictionCardProps) {
  const t = useTranslation();
  const [showShareBottomSheet, setShowShareBottomSheet] = useState(false);
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
      onClick={onClick}
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
          <span className="text-sm text-muted-foreground">{prediction.timePast}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm">{prediction.user?.username || t('ui.anonymous')}</span>
          <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Prediction */}
      <div className="space-y-2">
        <p className="text-sm font-semibold leading-relaxed">{prediction.title}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {prediction.tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            style={{ backgroundColor: tag.color, borderColor: tag.color, color: "#fff" }}
            className="rounded-md h-6 cursor-pointer"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onTagClick?.(tag);
            }}
          >
            {tag.title}
          </Badge>
        ))}
      </div>

      {/* Options */}
      <PredictionsOptions 
        prediction={prediction}
        showHeader={true}
        interactive={false}
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300 h-8"
          onTouchStart={(e: React.TouchEvent) => {
            e.stopPropagation();
            touchHandledRef.current = true;
            setShowShareBottomSheet(true);
            // Reset after a delay to allow click event to be ignored
            setTimeout(() => {
              touchHandledRef.current = false;
            }, 300);
          }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            // Prevent click if it was triggered by a touch event
            if (touchHandledRef.current) {
              e.preventDefault();
              return;
            }
            setShowShareBottomSheet(true);
          }}
        >
          <span className="text-xs">{formatCount(prediction.predictionForwardCount)}</span>
          <ForwardCustomIcon className="w-4 h-4"/>
        </Button>
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300 h-8"
          disabled={isLiking}
          onClick={handleLike}
          onTouchStart={handleLike}
        >
          <span className={`text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
            {formatCount(likesCount)}
          </span>
          <Heart 
            className={`w-4 h-4 transition-all ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300 h-8"
        >
          <span className="text-xs">{formatCount(prediction.commentsCount)}</span>
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {showShareBottomSheet && (
        <ShareBottomSheet
          predictionId={prediction.id}
          onClose={() => setShowShareBottomSheet(false)}
        />
      )}
    </div>
  );
});
