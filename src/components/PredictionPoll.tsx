import { Prediction } from '../models/Prediction';
import { formatCount, getDaysUntilStart } from '../utils/format';
import { useState } from 'react';
import {Check, User2Icon, UserIcon} from 'lucide-react';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionPollProps {
    prediction: Prediction;
    onPredictionUpdate?: (prediction: Prediction) => void;
}

function getUserPickOptionId(prediction: Prediction): number | null {
    const userPrediction = prediction.userPrediction;
    const optionId = userPrediction?.predictionOptionId ?? userPrediction?.prediction_option_id;

    // Only mark an option selected when the ID supplied by the API belongs to
    // this prediction. This prevents a stale userPrediction from styling a
    // different option in the feed.
    return optionId != null && prediction.options.some((option) => option.id === Number(optionId))
        ? Number(optionId)
        : null;
}

function formatPredictionTime(prediction: Prediction): string | null {
    const userPrediction = prediction.userPrediction;
    return userPrediction?.created_at ?? null;
}

export function PredictionPoll({
    prediction,
    onPredictionUpdate,
}: PredictionPollProps) {
    const t = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userPickOptionId = getUserPickOptionId(prediction);
    const hasUserVoted = userPickOptionId !== null;
    const predictionTime = formatPredictionTime(prediction);
    const mostSelectedOptionId = prediction.options.reduce<number | null>((leadingOptionId, option) => {
        if (option.userPredictionsCount <= 0) return leadingOptionId;
        if (leadingOptionId === null) return option.id;

        const leadingOption = prediction.options.find((candidate) => candidate.id === leadingOptionId);
        return option.userPredictionsCount > (leadingOption?.userPredictionsCount ?? 0)
            ? option.id
            : leadingOptionId;
    }, null);

    const handleOptionClick = async (optionId: number) => {
        // POST /user-predictions acts as an upsert: it creates the first
        // prediction and updates it when the user picks a different option.
        if (isSubmitting || optionId === userPickOptionId) return;

        setIsSubmitting(true);

        try {
            await predictionService.submitPrediction({
                prediction_option_id: optionId,
            });

            // Do not manufacture counts or a selected option in the client.
            // Re-read the prediction so percentages and userPrediction are the
            // exact values returned by the API.
            const updatedPrediction = await predictionService.getPredictionById(prediction.id);
            onPredictionUpdate?.(updatedPrediction);
        } catch (error: any) {
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
            <div className="space-y-2.5">
                {prediction.options.map((option) => {
                    const percentage = prediction.getOptionPercentage(option.id);
                    const isUserPick = option.id === userPickOptionId;
                    const isMostSelected = !hasUserVoted && option.id === mostSelectedOptionId;

                    const fillClass = isUserPick
                        ? 'bg-[#F5DA8A]'
                        : isMostSelected
                            ? 'bg-[#A8CCE8]'
                            : 'bg-[#CFD9DE]';

                    const percentageClass = isUserPick
                        ? 'text-[#B45309] font-semibold'
                        : isMostSelected
                            ? 'text-[#2563EB] font-semibold'
                            : 'text-gray-900 font-normal';

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`
                                relative w-full rounded-lg overflow-hidden bg-[#E8ECF0]
                                h-8
                                ${isUserPick ? 'cursor-default' : 'cursor-pointer active:opacity-80'}
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
                                {/*{isUserPick && (*/}
                                {/*    <div className="w-5 h-5 rounded-full bg-[#FFE2D5] shrink-0 flex items-center justify-center">*/}
                                {/*        <Check className="w-3 h-3 text-[#D95C2B]" strokeWidth={2} />*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <span className="text-xs font-medium text-gray-900 truncate">
                                    {option.title}
                                </span>

                                {isUserPick && predictionTime && (
                                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#FFF3CD] text-[#B8860B] text-[10px] font-medium leading-none">
                                        {predictionTime}
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

            <div className="flex items-center gap-1 mt-2.5 text-xs text-gray-400">
                <UserIcon className="w-4 h-4 transition-all"/>
                <span>{formatCount(prediction.userPredictionsCount)} votes</span>
            </div>
        </div>
    );
}
