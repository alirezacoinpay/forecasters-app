import { TrendingUp, Calendar, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ProfileView() {
  return (
    <div className="space-y-6 pb-24" dir="rtl">
      {/* Profile Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1">forecasters</h2>
            <p className="text-sm text-muted-foreground mb-3">
              کاربر فعال در پیش‌بینی‌های سیاسی و اقتصادی
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                ویرایش پروفایل
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
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
            <div className="text-2xl text-[#FF6B35] mb-1">156</div>
            <div className="text-xs text-muted-foreground">پیش‌بینی</div>
          </div>
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">87%</div>
            <div className="text-xs text-muted-foreground">دقت</div>
          </div>
          <div>
            <div className="text-2xl text-[#FF6B35] mb-1">1.2K</div>
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
