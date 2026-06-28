import {useEffect, useState} from 'react';
import {Search, ChevronDown, HomeIcon} from 'lucide-react';
import { Button } from './ui/button';
import { Prediction } from '../models/Prediction';
import { Topic } from '../types/api';
import { useSwipe } from '../hooks/useSwipe';
import { useTranslation } from '../hooks/useTranslation';
import LogoSearch from "./LogoSearch.tsx";

interface HeaderProps {
    isVisible: boolean;
    selectedTopicId?: number;
    topics: Topic[];
    onTopicChange: (topicId: number) => void;
    onPredictionClick?: (prediction: Prediction) => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSearchClick?: () => void;
}

export function Header({
                           isVisible,
                           selectedTopicId,
                           topics,
                           onTopicChange,
                           onPredictionClick,
                           onSwipeLeft,
                           onSwipeRight,
                           onSearchClick,
                       }: HeaderProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const t = useTranslation();

    useEffect(() => {
        if (!isVisible) setShowDropdown(false);
    }, [isVisible]);

    const currentTopic = topics.find(topic => topic.id === selectedTopicId);

    // Show loading state if topic is not yet determined (for deep links)
    const topicDisplay = currentTopic?.title || '...';

    const swipe = useSwipe({
        onSwipeLeft: () => {
            if (onSwipeLeft) {
                onSwipeLeft();
            }
        },
        onSwipeRight: () => {
            if (onSwipeRight) {
                onSwipeRight();
            }
        },
    });

    // Only spread event handlers, not state values
    const swipeHandlers = {
        onTouchStart: swipe.onTouchStart,
        onTouchEnd: swipe.onTouchEnd,
    };

    const handleTopicSelect = (topicId: number) => {
        onTopicChange(topicId);
        setShowDropdown(false);
    };

    // Prevent topic dropdown interaction if needed (can be extended for deep link loading)

    return (
        <>
            <header
                className="fixed top-0 z-50 bg-background border-b border-border transition-transform duration-300 text-yekanBakh"
                dir="ltr"
                style={{
                    left: '50%',
                    transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100%)',
                    width: '100%',
                    maxWidth: '428px',
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                }}
                {...swipeHandlers}
            >
                <div className="flex items-center justify-between px-4 py-3 flex-row-reverse">
                     {/*Left Side - Topic Dropdown (reversed to appear on left in LTR)*/}
                    <div className="flex items-center gap-3 relative" style={{ minWidth: '80px', overflowX: 'hidden' }}>
                        <div className="relative">
                            <Button
                                variant="ghost"
                                className="gap-2 justify-start"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                      <span className="text-[#FF6B35] text-xl font-black">
                          {topicDisplay}
                      </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>
                    {/* Right Side - Search (reversed to appear on right in LTR) */}
                    <div className="flex items-center gap-3">

                        <LogoSearch
                            onClick={onSearchClick}
                        />
                    </div>
                </div>
            </header>

            {/* Dropdown Menu - Outside header to prevent scrolling issues */}
            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-[55]"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div
                        className="fixed top-[52px] z-[60] bg-background border border-border shadow-lg rounded-2xl"
                        dir="ltr"
                    >
                        <div className="py-2">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => handleTopicSelect(topic.id)}
                                    className={`w-full flex items-center justify-left pl-6 pr-14 py-3 hover:bg-gray-100 transition-colors font-semibold ${selectedTopicId === topic.id ? 'bg-gray-100' : ''}`}
                                >
                                    <HomeIcon className='w-5 h-5' />
                                    <span className={selectedTopicId === topic.id ? 'text-[#FF6B35] ml-2' : 'ml-2'}>
                                {topic.title}
                              </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
