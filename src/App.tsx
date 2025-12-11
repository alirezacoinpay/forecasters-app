import { useState, useMemo, lazy, Suspense, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/questions/FeedView.tsx';
import { PredictionCardSkeleton } from './components/PredictionCardSkeleton';
import {Prediction} from "./models/Prediction.ts";
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTopics } from './hooks/useTopics';

// Code splitting: Lazy load heavy components
const PredictionDetail = lazy(() => import('./components/PredictionDetail').then(m => ({ default: m.PredictionDetail })));
const CreatePredictionPage = lazy(() => import('./components/CreatePredictionPage').then(m => ({ default: m.CreatePredictionPage })));
const SearchPage = lazy(() => import('./components/SearchPage').then(m => ({ default: m.SearchPage })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));

export default function App() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [searchPageTag, setSearchPageTag] = useState<{ id: number; title: string; color: string } | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(undefined);
  const [headerVisibleFromSwipe, setHeaderVisibleFromSwipe] = useState(false);
  const isNavVisibleFromScroll = useScrollVisibility();
  const prevScrollVisibleRef = useRef(isNavVisibleFromScroll);
  const { topics, loading: topicsLoading } = useTopics();
  
  // Reset swipe-triggered visibility only when scrolling down (not just when hidden)
  useEffect(() => {
    // Only reset if scroll visibility changed from true to false (scrolling down)
    if (prevScrollVisibleRef.current && !isNavVisibleFromScroll && headerVisibleFromSwipe) {
      setHeaderVisibleFromSwipe(false);
    }
    prevScrollVisibleRef.current = isNavVisibleFromScroll;
  }, [isNavVisibleFromScroll, headerVisibleFromSwipe]);
  
  // Combine scroll visibility with swipe-triggered visibility
  const isNavVisible = isNavVisibleFromScroll || headerVisibleFromSwipe;

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      handler: () => {
        // Open search (triggered via Header search button)
        const searchButton = document.querySelector('[aria-label="جستجو"]') as HTMLElement;
        searchButton?.click();
      },
      description: 'جستجو',
    },
    {
      key: 'n',
      ctrl: true,
      handler: () => setShowAddQuestion(true),
      description: 'سوال جدید',
    },
    {
      key: 'Escape',
      handler: () => {
        if (selectedPrediction) setSelectedPrediction(null);
        if (showAddQuestion) setShowAddQuestion(false);
      },
      description: 'بستن',
    },
  ]);

  // Set initial topic when topics are loaded
  useEffect(() => {
    if (topics.length > 0 && selectedTopicId === undefined) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  // Handle swipe to change topic and show header
  const handleSwipeLeft = () => {
    if (topics.length === 0) return;
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const nextIndex = (currentIndex + 1) % topics.length;
    setSelectedTopicId(topics[nextIndex].id);
    // Show header smoothly when swiping (stays visible until scroll hides it)
    setHeaderVisibleFromSwipe(true);
  };

  const handleSwipeRight = () => {
    if (topics.length === 0) return;
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const prevIndex = currentIndex === 0 ? topics.length - 1 : currentIndex - 1;
    setSelectedTopicId(topics[prevIndex].id);
    // Show header smoothly when swiping (stays visible until scroll hides it)
    setHeaderVisibleFromSwipe(true);
  };

  // Show create prediction page if showAddQuestion is true
  if (showAddQuestion) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">در حال بارگذاری...</div>
        </div>
      }>
        <CreatePredictionPage
          onClose={() => setShowAddQuestion(false)}
          selectedTopicId={selectedTopicId}
          topics={topics}
          onTopicChange={setSelectedTopicId}
        />
      </Suspense>
    );
  }

  // Show search page if showSearchPage is true
  if (showSearchPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }>
        <SearchPage
          onClose={() => {
            setShowSearchPage(false);
            setSearchPageTag(undefined);
          }}
          onPredictionClick={setSelectedPrediction}
          selectedTag={searchPageTag}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mx-auto" dir="rtl" style={{ maxWidth: '428px', width: '100%', overflowX: 'hidden' }}>
      <Header 
        isVisible={isNavVisible}
        selectedTopicId={selectedTopicId}
        topics={topics}
        onTopicChange={setSelectedTopicId}
        onPredictionClick={setSelectedPrediction}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSearchClick={() => setShowSearchPage(true)}
      />
      
      {/* Top spacing for fixed header */}
      <div className="h-[57px]"></div>
      
      <main className="w-full pb-24">
        {activeTab === 'feed' ? (
          <FeedView
            onPredictionClick={setSelectedPrediction}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            topicId={selectedTopicId}
            onTagClick={(tag) => {
              setSearchPageTag(tag);
              setShowSearchPage(true);
            }}
          />
        ) : (
          <Suspense fallback={
            <div className="space-y-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <PredictionCardSkeleton key={`profile-skeleton-${i}`} />
              ))}
            </div>
          }>
            <ProfileView />
          </Suspense>
        )}
      </main>

      <BottomNav
        isVisible={isNavVisible}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddQuestion={() => setShowAddQuestion(true)}
      />

      {selectedPrediction && (
        <Suspense fallback={null}>
          <PredictionDetail
            prediction={selectedPrediction}
            onClose={() => setSelectedPrediction(null)}
            onRefresh={() => {
              // Trigger feed refresh by updating key or calling refresh
              // This will be handled by FeedView's refresh mechanism
              window.dispatchEvent(new Event('refresh-feed'));
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
