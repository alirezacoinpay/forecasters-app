import {useEffect, useState} from 'react';
import {Search, ChevronDown, HomeIcon} from 'lucide-react';
import { Button } from './ui/button';
import { SearchModal } from './SearchModal';
import { Prediction } from '../models/Prediction';
import { Topic } from '../types/api';
import { useSwipe } from '../hooks/useSwipe';

interface HeaderProps {
  isVisible: boolean;
  selectedTopicId?: number;
  topics: Topic[];
  onTopicChange: (topicId: number) => void;
  onPredictionClick?: (prediction: Prediction) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function Header({ 
  isVisible, 
  selectedTopicId, 
  topics, 
  onTopicChange, 
  onPredictionClick,
  onSwipeLeft,
  onSwipeRight,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  
  useEffect(() => {
     if (!isVisible) setShowDropdown(false);
  }, [isVisible]);
  
  const currentTopic = topics.find(topic => topic.id === selectedTopicId);
  const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : topics[0];
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : topics[topics.length - 1];

  const swipe = useSwipe({
    onSwipeLeft: () => {
      if (onSwipeLeft) {
        setTransitionDirection('left');
        setIsTransitioning(true);
        onSwipeLeft();
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 300);
      }
    },
    onSwipeRight: () => {
      if (onSwipeRight) {
        setTransitionDirection('right');
        setIsTransitioning(true);
        onSwipeRight();
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionDirection(null);
        }, 300);
      }
    },
    onSwipeProgress: (progress, direction) => {
      // Update transition state during swipe for smooth carousel effect
      if (progress > 10) {
        setTransitionDirection(direction);
        setIsTransitioning(true);
      }
    },
  });
  
  // Only spread event handlers, not state values
  const swipeHandlers = {
    onTouchStart: swipe.onTouchStart,
    onTouchMove: swipe.onTouchMove,
    onTouchEnd: swipe.onTouchEnd,
  };
  
  // Use swipe progress for carousel animation
  const swipeProgress = swipe.swipeProgress;
  const isSwiping = swipe.isSwiping;

  const handleTopicSelect = (topicId: number) => {
    onTopicChange(topicId);
    setShowDropdown(false);
  };

  return (
    <>
      <header 
        className="fixed top-0 z-50 bg-background border-b border-border transition-transform duration-300 text-yekanBakh"
        style={{
          left: '50%',
          transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100%)',
          width: '100%',
          maxWidth: '428px',
        }}
        {...swipeHandlers}
      >
        <div className="flex items-center justify-between px-4 py-3">

            {/* Right Side - Topic Carousel */}
            <div className="flex items-center gap-3 relative overflow-hidden" style={{ minWidth: '120px', height: '32px' }}>
                <div className="relative w-full h-full">
                    {/* Carousel container with all topics */}
                    <div 
                        className="absolute top-0 left-0 flex"
                        style={{
                            transform: isSwiping && swipeProgress > 0
                                ? `translateX(${swipe.swipeDirection === 'left' 
                                    ? `-${currentIndex * 100 + (swipeProgress / 2)}%` 
                                    : `-${currentIndex * 100 - (swipeProgress / 2)}%`})`
                                : `translateX(-${currentIndex * 100}%)`,
                            transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: `${topics.length * 100}%`,
                        }}
                    >
                        {topics.map((topic, index) => (
                            <div 
                                key={topic.id}
                                className="flex-shrink-0"
                                style={{ width: `${100 / topics.length}%` }}
                            >
                                <Button
                                    variant="ghost"
                                    className="gap-2 w-full justify-start h-full"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <span className="text-[#FF6B35] text-xl font-black">
                                        {topic.title}
                                    </span>
                                    {index === currentIndex && (
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          {/* Left Side - Search */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(true)}
              aria-label="جستجو"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

          {/* Dropdown Menu */}
          {showDropdown && (
              <>
                  <div
                      className="fixed inset-0 right-0 z-40"
                      onClick={() => setShowDropdown(false)}
                  />
                  <div
                      className="fixed top-[52px] right-4 z-50 bg-background border border-border shadow-lg rounded-2xl"
                      dir="rtl"
                  >
                      <div className="py-2">
                          {topics.map((topic) => (
                              <button
                                  key={topic.id}
                                  onClick={() => handleTopicSelect(topic.id)}
                                  className={`w-full flex items-center justify-right pr-6 pl-14 py-3 hover:bg-gray-100 transition-colors font-semibold ${selectedTopicId === topic.id ? 'bg-gray-100' : ''}`}
                              >
                                  <HomeIcon className='w-5 h-5' />
                                  <span className={selectedTopicId === topic.id ? 'text-[#FF6B35] mr-2' : 'mr-2'}>
                                    {topic.title}
                                  </span>
                              </button>
                          ))}
                      </div>
                  </div>
              </>
          )}
      </header>

      {onPredictionClick && (
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onPredictionClick={onPredictionClick}
        />
      )}
    </>
  );
}
