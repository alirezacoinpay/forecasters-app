import { useState } from 'react';
import { MessageCircle, Share2, MoreHorizontal, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Prediction } from '../data/mockData';
import { ShareModal } from './ShareModal';

interface PredictionCardProps {
  prediction: Prediction;
  onClick?: () => void;
}

export function PredictionCard({ prediction, onClick }: PredictionCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className="bg-card border-b border-border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{prediction.timestamp}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm">{prediction.author}</span>
          <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Question with Badge */}
      <div className="mb-3">
        <p className="text-sm leading-relaxed  font-medium">{prediction.question}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {prediction.tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="rounded-md bg-gray-50 border-gray-200 text-gray-700"
          >
            {tag.label}
          </Badge>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {prediction.options.map((option) => (
          <div
            key={option.id}
            className="bg-blue-50 rounded-lg p-3 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span>{option.percentage}%</span>
            </div>
            <span className="text-xs text-gray-600">
              کشور زدن {option.voters}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
        >
          <span className="text-sm">{formatCount(prediction.sharesCount)}</span>
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full gap-2 border-gray-300"
        >
          <span className="text-sm">{formatCount(prediction.commentsCount)}</span>
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
}
