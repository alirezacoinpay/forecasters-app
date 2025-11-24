import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/questions/FeedView.tsx';
import { PredictionDetail } from './components/PredictionDetail';
import { AddQuestionModal } from './components/AddQuestionModal';
import { ProfileView } from './components/ProfileView';
import {Prediction} from "./models/Prediction.ts";
import { categories } from './data/mockData';
import { useScrollVisibility } from './hooks/useScrollVisibility';

export default function App() {
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
  const [selectedCategory, setSelectedCategory] = useState('political');
  const isNavVisible = useScrollVisibility();

  // Handle swipe to change category
  const handleSwipeLeft = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    setSelectedCategory(categories[nextIndex].id);
  };

  const handleSwipeRight = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    setSelectedCategory(categories[prevIndex].id);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        isVisible={isNavVisible}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {/* Top spacing for fixed header */}
      <div className="h-[57px]"></div>
      
      <main className="max-w-2xl mx-auto pb-24">
        {activeTab === 'feed' ? (
          <FeedView
            onPredictionClick={setSelectedPrediction}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        ) : (
          <ProfileView />
        )}
      </main>

      <BottomNav
        isVisible={isNavVisible}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddQuestion={() => setShowAddQuestion(true)}
      />

      {selectedPrediction && (
        <PredictionDetail
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
        />
      )}

      <AddQuestionModal
        isOpen={showAddQuestion}
        onClose={() => setShowAddQuestion(false)}
      />
    </div>
  );
}
