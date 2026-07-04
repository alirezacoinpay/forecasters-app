import { Prediction } from '../models/Prediction';
import { formatCount, getDaysUntilStart } from '../utils/format';
import { useState } from 'react';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionPollProps {
    prediction: Prediction;
    onPredictionUpdate?: (prediction: Prediction) => void;
}

export function PredictionPoll({
                                   prediction,
                                   onPredictionUpdate
                               }: PredictionPollProps) {
    const t = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    const daysUntilStart = getDaysUntilStart(prediction.startsAt);
    const totalPredictions = formatCount(prediction.userPredictionsCount);

    const handleOptionClick = async (optionId: number) => {
        // Prevent multiple submissions
        if (isSubmitting) return;

        // If already selected, don't do anything
        if (selectedOptionId === String(optionId)) return;

        setIsSubmitting(true);
        setSelectedOptionId(String(optionId));

        try {
            // Submit the prediction
            await predictionService.submitPrediction({
                prediction_option_id: optionId,
            });

            // Refresh the prediction data to get updated percentages
            if (onPredictionUpdate) {
                const updatedPrediction = await predictionService.getPredictionById(prediction.id);
                onPredictionUpdate(updatedPrediction);
            }

        } catch (error: any) {
            setSelectedOptionId(null); // Reset on error
            const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
            toast.error(t('errors.submitPredictionError'), {
                description: errorMessage,
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!prediction.options || prediction.options.length === 0) {
        return null;
    }

    return (
        <div className="w-full" dir="ltr">
            <div className="space-y-2" dir="ltr">
                {prediction.options.map((option) => {
                    const percentage =
                        prediction.userPredictionsCount > 0
                            ? prediction.getOptionPercentage(option.id)
                            : 0;

                    const percentages = prediction.options.map(o =>
                        prediction.getOptionPercentage(o.id)
                    );

                    // Check if all are 0
                    const allZero = percentages.every(p => p === 0);

                    // Check if current is max (including ties)
                    const isMax = prediction.options.every(
                        (o) =>
                            o.id === option.id ||
                            prediction.getOptionPercentage(o.id) <= percentage
                    );

                    // Only leading if NOT all zero AND is max
                    const isLeading = !allZero && isMax;

                    const isSelected = selectedOptionId === String(option.id);

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`
                                relative w-full rounded-md overflow-hidden border-gray-200
                                h-8
                                cursor-pointer hover:opacity-90 active:opacity-80 transition-all duration-200
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            style={{ minHeight: 32 }}
                        >
                            {/* Progress bar fill */}
                            <div
                                className={`
                                    rounded-md
                                    absolute inset-0 transition-all duration-500 min-w-1
                                    ${isLeading ? 'bg-[#1d9bf094]' : 'bg-[#cfd9de]'}
                                `}
                                style={{ width: `${percentage}%` }}
                            />

                            {/* Content row - using grid for perfect centering */}
                            <div className="relative flex items-center justify-between px-4 h-full">
                                <span
                                    className={`text-sm truncate text-gray-900 ${
                                        isLeading ? 'font-semibold' : 'font-normal'
                                    }`}
                                >
                                    {option.title}
                                </span>

                                <span
                                    className={`text-xs tabular-nums text-gray-900 ${
                                        isLeading ? 'font-semibold' : 'font-normal'
                                    }`}
                                >
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-400">
                <span>{totalPredictions} votes</span>
                <span>·</span>
                <span>{daysUntilStart || 'Final results'}</span>
            </div>
        </div>
    );
}