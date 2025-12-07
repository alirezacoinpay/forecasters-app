import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
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
const AddQuestionModal = lazy(() => import('./components/AddQuestionModal').then(m => ({ default: m.AddQuestionModal })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));

export default function App() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(undefined);
  const isNavVisible = useScrollVisibility();
  const { topics, loading: topicsLoading } = useTopics();

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

  // Handle swipe to change topic
  const handleSwipeLeft = () => {
    if (topics.length === 0) return;
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const nextIndex = (currentIndex + 1) % topics.length;
    setSelectedTopicId(topics[nextIndex].id);
  };

  const handleSwipeRight = () => {
    if (topics.length === 0) return;
    const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
    const prevIndex = currentIndex === 0 ? topics.length - 1 : currentIndex - 1;
    setSelectedTopicId(topics[prevIndex].id);
  };

  return (
    <div className="min-h-screen bg-gray-50 mx-auto" dir="rtl" style={{ maxWidth: '428px', width: '100%' }}>
      <Header 
        isVisible={isNavVisible}
        selectedTopicId={selectedTopicId}
        topics={topics}
        onTopicChange={setSelectedTopicId}
        onPredictionClick={setSelectedPrediction}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
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
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <AddQuestionModal
          isOpen={showAddQuestion}
          onClose={() => setShowAddQuestion(false)}
        />
      </Suspense>
    </div>
  );
}
