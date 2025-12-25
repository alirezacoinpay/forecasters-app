import { Home, PlusCircle, User } from 'lucide-react';

interface BottomNavProps {
  isVisible: boolean;
  activeTab: 'feed' | 'profile';
  onTabChange: (tab: 'feed' | 'profile') => void;
  onAddPrediction: () => void;
}

export function BottomNav({ isVisible, activeTab, onTabChange, onAddPrediction }: BottomNavProps) {
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
        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'profile'
              ? 'text-[#FF6B35]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-6 h-6" />
        </button>

        {/* Add Prediction Button */}
        <button
          onClick={onAddPrediction}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            'text-[#FF6B35]'
          }`}
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* Feed Tab */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'feed'
              ? 'text-[#FF6B35]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
