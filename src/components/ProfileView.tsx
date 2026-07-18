import { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useProfile } from '../hooks/useProfile';
import { Skeleton } from './ui/skeleton';
import { EditProfileModal } from './EditProfileModal';
import { useTranslation } from '../hooks/useTranslation';
import { UserPredictionItem } from './UserPredictionItem';

import { User } from "../types/api.ts";

interface ProfileViewProps {
  user?: User | null;
  onPredictionClick?: (predictionId: number) => void;
}

export function ProfileView({ user, onPredictionClick }: ProfileViewProps = {}) {
  const t = useTranslation();
  const { profile: fetchedProfile, stats, loading, updateProfile, refresh } = useProfile();
  const profile = fetchedProfile ?? user;
  const [showEditModal, setShowEditModal] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6 pb-24" dir="rtl">
        <div className="bg-white border-b border-border p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-border p-6">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0 overflow-hidden">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <TrendingUp className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="mb-3">{profile?.name || t('ui.labels.user')}</h2>
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
            <div className="text-2xl text-[#FF6B35] mb-1">{stats.userPredictionsCount}</div>
            <div className="text-xs text-muted-foreground">{t('ui.labels.predictions')}</div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border-b border-border p-6 space-y-4">
        <h3 className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF6B35]" />
          {t('ui.labels.recentActivity')}
        </h3>
        <div className="space-y-3">
          {profile?.userPredictions && profile.userPredictions.length > 0 ? (
            profile.userPredictions.map((userPrediction) => (
              <UserPredictionItem
                key={userPrediction.id}
                userPrediction={userPrediction}
                onClick={() => {
                  if (onPredictionClick) {
                    onPredictionClick(userPrediction.prediction.id);
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t('ui.labels.noActivity') || 'هیچ فعالیتی وجود ندارد'}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUsername={profile?.name}
        currentAvatar={profile?.avatar}
        onSave={updateProfile}
      />
    </div>
  );
}
