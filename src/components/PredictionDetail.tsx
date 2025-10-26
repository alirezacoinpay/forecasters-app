import { useState, useEffect } from 'react';
import { X, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Prediction } from '../data/mockData';
import { CommentSection } from './CommentSection';

interface PredictionDetailProps {
  prediction: Prediction;
  onClose: () => void;
}

export function PredictionDetail({ prediction, onClose }: PredictionDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [opinion, setOpinion] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = () => {
    if (selectedOption && opinion.trim()) {
      console.log('Submitted:', { option: selectedOption, opinion });
      // Handle submission
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div 
        className={`bg-background w-full max-w-2xl rounded-t-3xl transition-transform duration-300 ease-out overflow-hidden ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '70vh' }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Drag Handle */}
        <div className="flex items-center justify-center py-3 cursor-pointer" onClick={handleClose}>
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto pb-6">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
            <ChevronDown className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{prediction.timestamp}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm">{prediction.author}</span>
            <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Question */}
          <div>
            <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-600 border-0">
              پیشبینی
            </Badge>
            <p className="text-sm leading-relaxed mb-4">{prediction.question}</p>
            
            {prediction.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {prediction.description}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
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

          {/* Prediction Section */}
          <div className="bg-white rounded-lg border border-border p-4 space-y-4">
            <h3 className="text-center">پیش‌بینی</h3>
            
            {/* Description */}
            {prediction.detailedDescription && (
              <div className="space-y-2">
                <h4 className="text-sm">توضیحات</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {prediction.detailedDescription}
                </p>
              </div>
            )}

            {/* Current Results */}
            <div className="space-y-3">
              <h4 className="text-sm text-center">پیش‌بینی کاربران</h4>
              <div className="space-y-2">
                {prediction.options.map((option, index) => (
                  <div key={option.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        {index + 1}. کشور زدن {option.voters}
                      </span>
                      <span className="text-[#FF6B35]">
                        نسبت {option.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF6B35] transition-all"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options Selection */}
            <div className="space-y-3">
              <h4 className="text-sm text-center">پیشبینی شما از بین گزینه‌های زیر</h4>
              <div className="grid grid-cols-3 gap-2">
                {prediction.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedOption === option.id
                        ? 'border-[#FF6B35] bg-orange-50'
                        : 'border-gray-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-sm text-blue-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{option.percentage}%</span>
                    </div>
                    <span className="text-xs text-gray-600 block mt-2">
                      کشور زدن {option.voters}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Opinion Input */}
            <div className="space-y-2">
              <h4 className="text-sm text-center text-gray-500">(نظر شما (اختیاری</h4>
              <Textarea
                placeholder="نظر خود را بنویسید..."
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                className="min-h-[80px] resize-none"
                dir="rtl"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full"
              >
                ثبت پیش‌بینی
              </Button>
              <Button
                variant="outline"
                className="px-8 rounded-full"
                onClick={handleClose}
              >
                لغو
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {prediction.comments && prediction.comments.length > 0 && (
            <CommentSection comments={prediction.comments} />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
