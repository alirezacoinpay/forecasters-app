import { Prediction } from '../models/Prediction';
import { formatCount, getDaysUntilStart } from '../utils/format';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionPollProps {
    prediction: Prediction;
    onPredictionUpdate?: (prediction: Prediction) => void;
}

type PredictionOption = Prediction['options'][number];

function hasUserPrediction(option: PredictionOption): boolean {
    const value = option.myPrediction;
    if (value == null) return false;
    if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value as object).length > 0;
    }
    if (typeof value === 'string') return value.trim().length > 0;
    return Boolean(value);
}

function getUserPickOptionId(
    prediction: Prediction,
    localSelectedId: string | null
): number | null {
    const fromApi = prediction.options.find((option) => hasUserPrediction(option));
    if (fromApi) return fromApi.id;
    if (localSelectedId) return Number(localSelectedId);
    return null;
}

function buildPercentages(prediction: Prediction): Record<number, number> {
    return Object.fromEntries(
        prediction.options.map((option) => [option.id, prediction.getOptionPercentage(option.id)])
    );
}

function buildOptimisticPercentages(prediction: Prediction, optionId: number): Record<number, number> {
    const total = prediction.userPredictionsCount + 1;

    return Object.fromEntries(
        prediction.options.map((option) => {
            const count = option.userPredictionsCount + (option.id === optionId ? 1 : 0);
            return [option.id, total > 0 ? Math.round((count / total) * 100) : 0];
        })
    );
}

export function PredictionPoll({
    prediction,
    onPredictionUpdate,
}: PredictionPollProps) {
    const t = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(() => {
        const picked = prediction.options.find((option) => hasUserPrediction(option));
        return picked ? String(picked.id) : null;
    });
    const [percentages, setPercentages] = useState<Record<number, number>>(() => buildPercentages(prediction));
    const [totalVotes, setTotalVotes] = useState(prediction.userPredictionsCount);

    const daysUntilStart = getDaysUntilStart(prediction.startsAt);
    const userPickOptionId = getUserPickOptionId(prediction, selectedOptionId);
    const hasUserVoted = userPickOptionId !== null;

    useEffect(() => {
        const picked = prediction.options.find((option) => hasUserPrediction(option));
        if (picked) {
            setSelectedOptionId(String(picked.id));
        }
    }, [prediction.id, prediction.options]);

    useEffect(() => {
        if (isSubmitting) return;
        setPercentages(buildPercentages(prediction));
        setTotalVotes(prediction.userPredictionsCount);
    }, [prediction, isSubmitting]);

    const handleOptionClick = async (optionId: number) => {
        if (isSubmitting || hasUserVoted) return;
        if (selectedOptionId === String(optionId)) return;

        setIsSubmitting(true);
        setSelectedOptionId(String(optionId));
        setPercentages(buildOptimisticPercentages(prediction, optionId));
        setTotalVotes(prediction.userPredictionsCount + 1);

        try {
            await predictionService.submitPrediction({
                prediction_option_id: optionId,
            });

            const updatedPrediction = await predictionService.getPredictionById(prediction.id);
            const picked = updatedPrediction.options.find((option) => hasUserPrediction(option));
            if (picked) {
                setSelectedOptionId(String(picked.id));
            }
            setPercentages(buildPercentages(updatedPrediction));
            setTotalVotes(updatedPrediction.userPredictionsCount);
            onPredictionUpdate?.(updatedPrediction);
        } catch (error: any) {
            setSelectedOptionId(null);
            setPercentages(buildPercentages(prediction));
            setTotalVotes(prediction.userPredictionsCount);

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
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7EB6E0]" />
                    {t('ui.labels.communityVote')}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F5C842]" />
                    {t('ui.labels.yourPrediction')}
                </span>
            </div>

            <div className="space-y-2.5" dir="ltr">
                {prediction.options.map((option) => {
                    const percentage = percentages[option.id] ?? 0;
                    const isUserPick = option.id === userPickOptionId;

                    const fillClass = isUserPick
                        ? 'bg-[#F5DA8A]'
                        : hasUserVoted
                            ? 'bg-[#A8CCE8]'
                            : 'bg-[#CFD9DE]';

                    const percentageClass = isUserPick
                        ? 'text-[#B45309] font-semibold'
                        : hasUserVoted
                            ? 'text-[#2563EB] font-semibold'
                            : 'text-gray-900 font-normal';

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`
                                relative w-full rounded-lg overflow-hidden bg-[#E8ECF0]
                                h-10
                                ${hasUserVoted ? 'cursor-default' : 'cursor-pointer hover:opacity-90 active:opacity-80'}
                                ${isSubmitting ? 'pointer-events-none' : ''}
                            `}
                        >
                            <div
                                className={`
                                    absolute inset-y-0 left-0 rounded-lg
                                    transition-[width] duration-700 ease-out min-w-1
                                    ${fillClass}
                                `}
                                style={{ width: `${percentage}%` }}
                            />

                            <div className="relative flex items-center gap-2 px-3 h-full min-w-0">
                                {isUserPick && (
                                    <div className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                )}

                                <span className="text-sm font-medium text-gray-900 truncate">
                                    {option.title}
                                </span>

                                {isUserPick && (
                                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#FFF3CD] text-[#B8860B] text-[10px] font-medium leading-none">
                                        {t('ui.labels.yourPick')}
                                    </span>
                                )}

                                <span className={`ml-auto text-xs tabular-nums shrink-0 ${percentageClass}`}>
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-400">
                <span>{formatCount(totalVotes)} votes</span>
                <span>·</span>
                <span>{daysUntilStart || 'Final results'}</span>
            </div>
        </div>
    );
}
