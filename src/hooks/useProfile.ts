import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService.service';
import { User } from '../types/api';
import { toast } from 'sonner';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    predictionsCount: 0,
    accuracy: 0,
    score: 0,
  });

  const loadProfile = useCallback(async () => {
    if (!userId) {
      // Load current user profile
      try {
        setLoading(true);
        setError(null);
        
        const user = await userService.getCurrentUser();
        setProfile(user);
        
        // Mock stats (these should come from API in future)
        setStats({
          predictionsCount: 156,
          accuracy: 87,
          score: 1200,
        });
      } catch (err: any) {
        const error = err as Error;
        setError(error);
        
        // Don't show toast for 401 errors (handled by interceptor)
        if (err?.status !== 401) {
          toast.error('خطا در بارگذاری پروفایل', {
            description: error.message || 'لطفاً دوباره تلاش کنید',
            duration: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    try {
      setLoading(true);
      const updatedUser = await userService.editProfile(data);
      setProfile(updatedUser);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد', {
        duration: 2000,
      });
      return updatedUser;
    } catch (err: any) {
      const error = err as Error;
      const errorMessage = err?.data?.message || error.message || 'لطفاً دوباره تلاش کنید';
      toast.error('خطا در به‌روزرسانی پروفایل', {
        description: errorMessage,
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    stats,
    loading,
    error,
    refresh: loadProfile,
    updateProfile,
  };
}
