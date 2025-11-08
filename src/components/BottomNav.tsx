import { Home, PlusCircle, User } from 'lucide-react';

interface BottomNavProps {
  isVisible: boolean;
  activeTab: 'feed' | 'profile';
  onTabChange: (tab: 'feed' | 'profile') => void;
  onAddQuestion: () => void;
}

export function BottomNav({ isVisible, activeTab, onTabChange, onAddQuestion }: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 h-12 right-0 z-50 bg-background border-t border-border transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-around px-4 py-1 max-w-2xl mx-auto">
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

        {/* Add Question Button */}
        <button
          onClick={onAddQuestion}
          className="flex flex-col items-center gap-1 -mt-4   bg-[#FF6B35] text-white rounded-full p-3 shadow-lg hover:bg-[#FF6B35]/90 transition-all hover:scale-105"
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
