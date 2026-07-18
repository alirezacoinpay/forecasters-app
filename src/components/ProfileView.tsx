import { useState } from 'react';
import { TrendingUp, Calendar, Award, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useProfile } from '../hooks/useProfile';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { EditProfileModal } from './EditProfileModal';
import { EmailVerificationModal } from './EmailVerificationModal';
import { MobileVerificationModal } from './MobileVerificationModal';
import { useTranslation } from '../hooks/useTranslation';
import { UserPredictionItem } from './UserPredictionItem';

interface ProfileViewProps {
  onPredictionClick?: (predictionId: number) => void;
}

export function ProfileView({ onPredictionClick }: ProfileViewProps = {}) {
  const t = useTranslation();
  const { profile, stats, loading, updateProfile, refresh } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showMobileVerification, setShowMobileVerification] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `پروفایل ${profile?.name || 'کاربر'}`,
        text: `پروفایل ${profile?.name || 'کاربر'} در Forecasters`,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
    <div className="space-y-6 pb-24" dir="rtl">
      {/* Profile Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1">{profile?.name || t('ui.labels.user')}</h2>
            <p className="text-sm text-muted-foreground mb-3">
              {t('ui.labels.activeUser')}
            </p>
            
            {/* Email and Mobile Verification Status */}
            <div className="flex flex-wrap gap-2 mb-3">
              {profile?.email && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setShowEmailVerification(true)}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  {profile.email}
                  {profile.email_verified_at ? (
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground mr-1">({t('ui.labels.notVerified')})</span>
                  )}
                </Button>
              )}
              {profile?.mobile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setShowMobileVerification(true)}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {profile.mobile}
                  {profile.mobile_verified_at ? (
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground mr-1">({t('ui.labels.notVerified')})</span>
                  )}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setShowEditModal(true)}
              >
                {t('ui.labels.editProfile')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={handleShare}
              >
                {t('ui.labels.share')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">{stats.userPredictionsCount}</div>
            <div className="text-xs text-muted-foreground">{t('ui.labels.predictions')}</div>
          </div>
          {/*<div>*/}
          {/*  <div className="text-2xl text-[#FF6B35] mb-1">{stats.accuracy}%</div>*/}
          {/*  <div className="text-xs text-muted-foreground">{t('ui.labels.accuracy')}</div>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <div className="text-2xl text-[#FF6B35] mb-1">*/}
          {/*    {stats.score >= 1000 ? `${(stats.score / 1000).toFixed(1)}K` : stats.score}*/}
          {/*  </div>*/}
          {/*  <div className="text-xs text-muted-foreground">{t('ui.labels.score')}</div>*/}
          {/*</div>*/}
        </div>
      </div>

      {/* Achievements */}
      {/*<div className="bg-white border-b border-border p-6 space-y-4">*/}
      {/*  <h3 className="flex items-center gap-2">*/}
      {/*    <Award className="w-5 h-5 text-[#FF6B35]" />*/}
      {/*    {t('ui.labels.achievements')}*/}
      {/*  </h3>*/}
      {/*  <div className="flex flex-wrap gap-2">*/}
      {/*    <Badge className="bg-amber-100 text-amber-700 border-0">*/}
      {/*      🏆 {t('ui.labels.professionalPredictor')}*/}
      {/*    </Badge>*/}
      {/*    <Badge className="bg-blue-100 text-blue-700 border-0">*/}
      {/*      🎯 {t('ui.labels.highAccuracy')}*/}
      {/*    </Badge>*/}
      {/*    <Badge className="bg-green-100 text-green-700 border-0">*/}
      {/*      ⭐ {t('ui.labels.activeUserBadge')}*/}
      {/*    </Badge>*/}
      {/*  </div>*/}
      {/*</div>*/}

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
        currentEmail={profile?.email}
        currentMobile={profile?.mobile}
        emailVerified={!!profile?.email_verified_at}
        mobileVerified={!!profile?.mobile_verified_at}
        onSave={updateProfile}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        currentEmail={profile?.email}
        isVerified={!!profile?.email_verified_at}
        onVerified={() => {
          refresh();
          setShowEmailVerification(false);
        }}
      />

      {/* Mobile Verification Modal */}
      <MobileVerificationModal
        isOpen={showMobileVerification}
        onClose={() => setShowMobileVerification(false)}
        currentMobile={profile?.mobile}
        isVerified={!!profile?.mobile_verified_at}
        onVerified={() => {
          refresh();
          setShowMobileVerification(false);
        }}
      />
    </div>
  );
}
