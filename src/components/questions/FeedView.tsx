import { PredictionCard } from "../PredictionCard";
import { useSwipe } from "../../hooks/useSwipe";
import { usePredictionFeed } from "../../hooks/predictions/usePredictionFeed.ts.tsx";
import {Prediction} from "../../models/Prediction.ts";

interface FeedViewProps {
    onPredictionClick: (prediction: Prediction) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    searchQuery?: string;
}

export function FeedView({ onPredictionClick, onSwipeLeft, onSwipeRight, searchQuery } : FeedViewProps) {
    const swipeHandlers = useSwipe({ onSwipeLeft, onSwipeRight });
    const { predictions, setPage } = usePredictionFeed(searchQuery);

    return (
        <div {...swipeHandlers} className="space-y-0">

            {predictions.length > 0 ? (
                predictions.map((prediction: Prediction) => (
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
