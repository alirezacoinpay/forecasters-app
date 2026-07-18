import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { EditProfileModal } from './EditProfileModal';
import { PredictionCard } from './PredictionCard';
import { PredictionCardSkeleton } from './PredictionCardSkeleton';
import { useUserPredictions } from '../hooks/useUserPredictions';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useProfile } from '../hooks/useProfile';
import { useTranslation } from '../hooks/useTranslation';
import { Prediction } from "../models/Prediction.ts";

import { User } from "../types/api.ts";

interface ProfileViewProps {
  user?: User | null;
  onPredictionClick?: (predictionId: number) => void;
}

type ActivityTab = 'activity' | 'picks';

export function ProfileView({ user, onPredictionClick }: ProfileViewProps = {}) {
  const t = useTranslation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ActivityTab>('activity');
  const { updateProfile } = useProfile();

  const {
    items,
    loading,
    loadingMore,
    pagination,
    loadMore,
    refresh,
  } = useUserPredictions(10);

  useEffect(() => {
    refresh();
  }, [activeTab, refresh]);

  const hasMore = pagination.page < pagination.lastPage;

  const { isLoading: isLoadingMore, sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    enabled: !loading && items.length > 0,
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <TrendingUp className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="mb-3">{user?.name || t('ui.labels.user')}</h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowEditModal(true)}
            >
              {t('ui.labels.editProfile')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border p-6">
        <div className="grid grid-cols-1 gap-4 text-center">
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">{user.userPredictionsCount}</div>
            <div className="text-xs text-muted-foreground">{t('ui.labels.predictions')}</div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border-b border-border">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 text-sm font-500 transition-colors ${
              activeTab === 'activity'
                ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]'
                : 'text-muted-foreground'
            }`}
          >
            {t('ui.labels.activityTab')}
          </button>
          <button
            onClick={() => setActiveTab('picks')}
            className={`flex-1 py-3 text-sm font-500 transition-colors ${
              activeTab === 'picks'
                ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]'
                : 'text-muted-foreground'
            }`}
          >
            {t('ui.labels.picksTab')}
          </button>
        </div>

        <div className="space-y-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : items.length > 0 ? (
            <>
              {items.map((prediction: Prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onCommentClick={() => onPredictionClick?.(prediction.id)}
                  onPredictionUpdate={() => {}}
                />
              ))}
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && (
                <PredictionCardSkeleton />
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {t('ui.labels.noActivity')}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUsername={user?.name}
        currentAvatar={user?.avatar}
        onSave={updateProfile}
      />
    </div>
  );
}
