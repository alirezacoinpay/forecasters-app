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
        
        // TODO: Replace with actual API call when endpoint is available
        // const response = await userService.getProfile();
        // setProfile(response);
        
        // Mock data for now
        setProfile({
          id: '1',
          name: 'forecasters',
          email: 'user@example.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        // Mock stats
        setStats({
          predictionsCount: 156,
          accuracy: 87,
          score: 1200,
        });
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast.error('خطا در بارگذاری پروفایل', {
          description: error.message || 'لطفاً دوباره تلاش کنید',
        });
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    stats,
    loading,
    error,
    refresh: loadProfile,
  };
}
