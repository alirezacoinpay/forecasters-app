import { PredictionCard } from './PredictionCard';
import { Prediction } from '../data/mockData';
import { useSwipe } from '../hooks/useSwipe';

interface FeedViewProps {
  predictions: Prediction[];
  onPredictionClick: (prediction: Prediction) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function FeedView({ predictions, onPredictionClick, onSwipeLeft, onSwipeRight }: FeedViewProps) {
  const swipeHandlers = useSwipe({
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <div
      {...swipeHandlers}
      className="space-y-0"
    >
      {predictions.length > 0 ? (
        predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            onClick={() => onPredictionClick(prediction)}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6" dir="rtl">
          <p className="text-muted-foreground text-center">
            هیچ پیش‌بینی در این دسته یافت نشد
          </p>
        </div>
      )}
    </div>
  );
}
