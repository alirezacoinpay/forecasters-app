import { TrendingUp } from 'lucide-react';
import { UserPrediction } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';

interface UserPredictionItemProps {
  userPrediction: UserPrediction;
  onClick?: () => void;
}

export function UserPredictionItem({ userPrediction, onClick }: UserPredictionItemProps) {
  const t = useTranslation();


  return (
    <div 
      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
        <TrendingUp className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm mb-1 font-medium">
          {userPrediction.prediction.title}
        </p>
        <p className="text-xs text-muted-foreground mb-1">
          {userPrediction.predictionOption.title}
        </p>
        <span className="text-xs text-muted-foreground">{userPrediction.timePast}</span>
      </div>
    </div>
  );
}

