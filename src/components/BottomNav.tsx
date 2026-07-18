import { Home, PlusCircle, TrendingUp } from 'lucide-react';
import { User } from "../types/api.ts";

interface BottomNavProps {
  isVisible: boolean;
  activeTab: 'feed' | 'profile';
  onTabChange: (tab: 'feed' | 'profile') => void;
  onAddPrediction: () => void;
  user?: User | null;
}

export function BottomNav({ isVisible, activeTab, onTabChange, onAddPrediction, user }: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-0 z-50 bg-background border-t border-border transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        left: '50%',
        transform: isVisible ? 'translateX(-50%)' : 'translateX(-50%) translateY(100%)',
        width: '100%',
        maxWidth: '428px',
        height: '48px',
      }}
    >
      <div className="flex items-center justify-around px-4 py-1">
          {/* Feed Tab - Right */}
          <button
              onClick={() => onTabChange('feed')}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors text-muted-foreground`}
          >
              <Home className="w-6 h-6" />
          </button>
          {/* Add Prediction Button - Middle */}
          <button
            onClick={onAddPrediction}
            className="flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
          {/* Profile Tab - Left */}
          <button
              onClick={() => onTabChange('profile')}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors text-muted-foreground `}
          >
              {user?.avatar ? (
                  <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                  />
              ) : (
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                  </div>
              )}
          </button>

      </div>
    </nav>
  );
}
