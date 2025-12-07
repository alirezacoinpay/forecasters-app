import { TrendingUp, Calendar, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useProfile } from '../hooks/useProfile';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

export function ProfileView() {
  const { profile, stats, loading } = useProfile();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `پروفایل ${profile?.name || 'کاربر'}`,
        text: `پروفایل ${profile?.name || 'کاربر'} در Forecasters`,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('لینک کپی شد');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('لینک کپی شد');
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
            <h2 className="mb-1">{profile?.name || 'کاربر'}</h2>
            <p className="text-sm text-muted-foreground mb-3">
              کاربر فعال در پیش‌بینی‌های سیاسی و اقتصادی
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                ویرایش پروفایل
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={handleShare}
              >
                اشتراک‌گذاری
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">{stats.predictionsCount}</div>
            <div className="text-xs text-muted-foreground">پیش‌بینی</div>
          </div>
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">{stats.accuracy}%</div>
            <div className="text-xs text-muted-foreground">دقت</div>
          </div>
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">
              {stats.score >= 1000 ? `${(stats.score / 1000).toFixed(1)}K` : stats.score}
            </div>
            <div className="text-xs text-muted-foreground">امتیاز</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border-b border-border p-6 space-y-4">
        <h3 className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FF6B35]" />
          دستاورد‌ها
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-amber-100 text-amber-700 border-0">
            🏆 پیش‌بینی‌کننده حرفه‌ای
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-0">
            🎯 دقت بالا
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-0">
            ⭐ کاربر فعال
          </Badge>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border-b border-border p-6 space-y-4">
        <h3 className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF6B35]" />
          فعالیت اخیر
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1">
                  پیش‌بینی جدید در دسته سیاسی ثبت کردید
                </p>
                <span className="text-xs text-muted-foreground">2 ساعت پیش</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
