import { useState } from 'react';
import {
    MessageCircle,
    MoreHorizontal,
    TrendingUp,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {Prediction} from "../models/Prediction.ts";
import { ShareModal } from './ShareModal';
import ForwardCustomIcon from "./icons/ForwardCustomIcon.tsx";
import { memo } from 'react';

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
}

export const PredictionCard = memo(function PredictionCard({ prediction, onClick }: PredictionCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K`;
    }
    return count.toString();
  };
    return (
    <div
      className="bg-card border-b border-border px-4 py-4 space-y-3 cursor-pointer hover:bg-accent/50 active:scale-[0.98] transition-all duration-150"
      onClick={onClick}
      dir="rtl"
      role="button"
      tabIndex={0}
      aria-label={`پیش‌بینی: ${prediction.title}`}
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
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Add menu functionality
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{prediction.timePast}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm">{prediction.user?.username || 'ناشناس'}</span>
          <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Question */}
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
            className="rounded-md h-6"
          >
            {tag.title}
          </Badge>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-2">
        {prediction.options.map((option) => {
          const percentage = prediction.userPredictionsCount > 0 
            ? prediction.getOptionPercentage(option.id)
            : 0;
          return (
            <div
              key={option.id}
              className="bg-blue-50 rounded-lg h-20 p-3 flex flex-col items-center justify-center gap-2"
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
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300 h-8"
          onClick={(e : any) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
        >
          <span className="text-xs">{formatCount(prediction.questionForwardCount)}</span>
          <ForwardCustomIcon className="w-4 h-4"/>
        </Button>
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300 h-8"
        >
          <span className="text-xs">{formatCount(prediction.commentsCount)}</span>
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        predictionId={prediction.id}
      />
    </div>
  );
});
