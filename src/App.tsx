import { useState, useMemo, lazy, Suspense, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/predictions/FeedView.tsx';
import { PredictionCardSkeleton } from './components/PredictionCardSkeleton';
import {Prediction} from "./models/Prediction.ts";
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTopics, DEFAULT_TOPIC_ID } from './hooks/useTopics';
import { useAutoAuth } from './hooks/useAutoAuth';
import {Tag} from "./types/api.ts";

// Code splitting: Lazy load heavy components
const PredictionDetail = lazy(() => import('./components/PredictionDetail').then(m => ({ default: m.PredictionDetail })));
const CreatePredictionPage = lazy(() => import('./components/CreatePredictionPage').then(m => ({ default: m.CreatePredictionPage })));
const SearchPage = lazy(() => import('./components/SearchPage').then(m => ({ default: m.SearchPage })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));

// Parse URL synchronously on module load to get deep link prediction ID
// This runs before component renders, preventing unnecessary API calls
const parseInitialUrl = (): number | undefined => {
  if (typeof window === 'undefined') return undefined;
  const urlParams = new URLSearchParams(window.location.search);
  const predictionParam = urlParams.get('prediction') || urlParams.get('predictionId');
  
  if (predictionParam) {
    const predictionId = parseInt(predictionParam, 10);
    if (!isNaN(predictionId) && predictionId > 0) {
      // Clear URL parameter immediately to prevent re-parsing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('prediction');
      newUrl.searchParams.delete('predictionId');
      window.history.replaceState({}, '', newUrl.toString());
      return predictionId;
    }
  }
  return undefined;
};

export default function App() {
  // Automatic authentication - runs on mount
  const { user, loading: authLoading, authenticated } = useAutoAuth();
  
  // Parse URL synchronously before first render
  const initialDeepLinkPredictionId = useRef<number | undefined>(parseInitialUrl());
  
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showAddPrediction, setShowAddPrediction] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [searchPageTag, setSearchPageTag] = useState<{ id: number; title: string; color: string } | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
  // If deep link is present, start with default topic (0), otherwise undefined
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(
    initialDeepLinkPredictionId.current !== undefined ? DEFAULT_TOPIC_ID : undefined
  );
  const [headerVisibleFromSwipe, setHeaderVisibleFromSwipe] = useState(false);
  const [deepLinkPredictionId, setDeepLinkPredictionId] = useState<number | undefined>(initialDeepLinkPredictionId.current);
  const [isDeepLinkLoading, setIsDeepLinkLoading] = useState(initialDeepLinkPredictionId.current !== undefined);
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

    const handleSearchTagSelected = (tag: Tag) => {
        setSearchPageTag(tag);
    };

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
      handler: () => setShowAddPrediction(true),
      description: 'پیش‌بینی جدید',
    },
    {
      key: 'Escape',
      handler: () => {
        if (selectedPrediction) setSelectedPrediction(null);
        if (showAddPrediction) setShowAddPrediction(false);
      },
      description: 'بستن',
    },
  ]);

  // Handle browser back/forward navigation for deep links
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const predictionParam = urlParams.get('prediction') || urlParams.get('predictionId');
      
      if (predictionParam) {
        const predictionId = parseInt(predictionParam, 10);
        if (!isNaN(predictionId) && predictionId > 0) {
          setDeepLinkPredictionId(predictionId);
          setIsDeepLinkLoading(true);
          setSelectedTopicId(DEFAULT_TOPIC_ID);
          
          // Clear URL parameter
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('prediction');
          newUrl.searchParams.delete('predictionId');
          window.history.replaceState({}, '', newUrl.toString());
        }
      } else {
        // No deep link in URL, clear deep link state
        setDeepLinkPredictionId(undefined);
        setIsDeepLinkLoading(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Set initial topic when topics are loaded (only if not already set)
  useEffect(() => {
    // If no topic is selected and topics are loaded, set to default "Forecasters" topic (id: 0)
    // This is the first topic in the list after adding the default topic
    // Don't set if deep link is active (already set to DEFAULT_TOPIC_ID in initial state)
    if (topics.length > 0 && selectedTopicId === undefined) {
      setSelectedTopicId(topics[0].id); // This will be the default "Forecasters" topic (id: 0)
    }
  }, [topics, selectedTopicId]);

  // Handle swipe to change topic and show header
  const handleSwipeLeft = () => {
    if (topics.length === 0 || isDeepLinkLoading) return; // Prevent topic switching during deep link load
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const nextIndex = (currentIndex + 1) % topics.length;
    setSelectedTopicId(topics[nextIndex].id);
    // Show header smoothly when swiping (stays visible until scroll hides it)
    setHeaderVisibleFromSwipe(true);
  };

  const handleSwipeRight = () => {
    if (topics.length === 0 || isDeepLinkLoading) return; // Prevent topic switching during deep link load
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const prevIndex = currentIndex === 0 ? topics.length - 1 : currentIndex - 1;
    setSelectedTopicId(topics[prevIndex].id);
    // Show header smoothly when swiping (stays visible until scroll hides it)
    setHeaderVisibleFromSwipe(true);
  };

  // Show create prediction page if showAddPrediction is true
  if (showAddPrediction) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">در حال بارگذاری...</div>
        </div>
      }>
        <CreatePredictionPage
          onClose={() => setShowAddPrediction(false)}
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
      <>
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
            onTagSelected={handleSearchTagSelected}
            selectedTag={searchPageTag}
            onPredictionClick={setSelectedPrediction}
            onClearSelectedTag={() => setSearchPageTag(undefined)}
          />
        </Suspense>
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
              onTagClick={(tag) => {
                setSearchPageTag(tag);
                setShowSearchPage(true);
                setSelectedPrediction(null);
              }}
            />
          </Suspense>
        )}
      </>
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
            topicId={selectedTopicId ?? DEFAULT_TOPIC_ID}
            predictionId={deepLinkPredictionId}
            onTagClick={(tag) => {
              setSearchPageTag(tag);
              setShowSearchPage(true);
            }}
            onDeepLinkLoaded={() => {
              setIsDeepLinkLoading(false);
              // Clear deep link prediction ID after successful load to prevent re-fetching
              setDeepLinkPredictionId(undefined);
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
        onAddPrediction={() => setShowAddPrediction(true)}
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
            onTagClick={(tag) => {
              setSearchPageTag(tag);
              setShowSearchPage(true);
              setSelectedPrediction(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
