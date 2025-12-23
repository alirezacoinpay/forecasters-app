import { Prediction } from '../models/Prediction';
import { formatCount, getDaysUntilStart } from '../utils/format';
import { Checkbox } from './ui/checkbox';

interface PredictionsOptionsProps {
    prediction: Prediction;
    selectedOptionId?: string | null;
    onOptionSelect?: (optionId: string) => void;
    showHeader?: boolean;
    interactive?: boolean;
}

export function PredictionsOptions({
    prediction,
    selectedOptionId,
    onOptionSelect,
    showHeader = true,
    interactive = false,
}: PredictionsOptionsProps) {
    const daysUntilStart = getDaysUntilStart(prediction.startsAt);
    const totalPredictions = formatCount(prediction.userPredictionsCount);

    const handleOptionClick = (optionId: number) => {
        if (interactive && onOptionSelect) {
            onOptionSelect(String(optionId));
        }
    };

    // Safety check for empty options
    if (!prediction.options || prediction.options.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg bg-[#e2e2e2] space-y-2" dir="ltr">
            {/* Header */}
            {showHeader && (
                <div className="flex items-center justify-between px-3 py-2.5 bg-[#434343] rounded-md rounded-b-none">
                    <span className="text-sm text-white/90 font-medium">{daysUntilStart || 'شروع نشده'}</span>
                    <span className="text-sm text-white/90 font-medium">{totalPredictions} predictions</span>
                </div>
            )}

            {/* Options */}
            <div className="space-y-2 p-3">
                {prediction.options.map((option) => {
                    const percentage = prediction.userPredictionsCount > 0
                        ? prediction.getOptionPercentage(option.id)
                        : 0;
                    const optionCount = formatCount(option.userPredictionsCount);
                    const isSelected = selectedOptionId === String(option.id);

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`
                                bg-white rounded-lg p-3 flex items-center gap-3
                                ${interactive ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''}
                                ${isSelected ? 'ring-2 ring-[#FF6B35] bg-orange-50' : ''}
                            `}
                        >
                            {/* Checkbox + Option name */}
                            <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => {
                                            if (interactive && onOptionSelect) {
                                                onOptionSelect(String(option.id));
                                            }
                                        }}
                                        className="flex-shrink-0"
                                    />
                                </div>
                                <span className="text-sm text-gray-800 truncate">{option.title}</span>
                            </div>

                            {/* Progress bar with percentage at the end */}
                            <div className="flex-1 flex items-center min-w-0 relative">
                                <div className="flex-1 h-2.5 rounded-full overflow-visible relative">
                                    {/* Progress bar fill */}
                                    <div
                                        className="h-full bg-gray-400 transition-all duration-300 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                    {/* Percentage number positioned at the end of the progress bar */}
                                    <span 
                                        className="absolute top-1/2 -translate-y-1/2 text-xs text-gray-600 whitespace-nowrap ml-1"
                                        style={{ 
                                            left: `${percentage}%`
                                        }}
                                    >
                                        {percentage}%
                                    </span>
                                </div>
                            </div>

                            {/* Prediction count at the end (left side) */}
                            <div className="flex-shrink-0">
                                <span className="text-sm text-gray-800 font-medium">{optionCount}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
