import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Search, X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Prediction } from '../models/Prediction';
import { PredictionCard } from './PredictionCard';
import { PredictionCardSkeleton } from './PredictionCardSkeleton';
import { usePredictionFeed } from '../hooks/predictions/usePredictionFeed.ts.tsx';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { searchService } from '../services/searchService.service';
import { SearchHistoryItem } from '../types/api';
import { Tag } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';

interface SearchPageProps {
  onClose: () => void;
  onPredictionClick: (prediction: Prediction) => void;
  selectedTag?: Tag;
}

export function SearchPage({ onClose, onPredictionClick, selectedTag }: SearchPageProps) {
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState(selectedTag?.title || '');
  const [debouncedQuery, setDebouncedQuery] = useState(selectedTag?.title || '');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load recent searches on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      setLoadingHistory(true);
      try {
        const history = await searchService.getSearchHistory();
        setRecentSearches(history);
      } catch (error) {
        console.error('Error loading search history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (!debouncedQuery) {
      loadRecentSearches();
    }
  }, [debouncedQuery]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  // Use prediction feed hook for search results and trending
  const { predictions, loading, pagination, loadMore } = usePredictionFeed(
    debouncedQuery || undefined,
    undefined
  );

  const hasMore = pagination.page < pagination.lastPage;
  const { isLoading: isLoadingMore, sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    enabled: !loading && predictions.length > 0 && !!debouncedQuery,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const handleRecentSearchClick = (item: SearchHistoryItem) => {
    setSearchQuery(item.query);
  };

  const handleDismissRecentSearch = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await searchService.deleteSearchHistoryItem(id);
    if (success) {
      setRecentSearches(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleRemoveTag = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const showTrending = !debouncedQuery && !selectedTag;
  const showRecentSearches = !debouncedQuery && recentSearches.length > 0 && !loadingHistory;
  const showSearchResults = !!debouncedQuery;

  return (
    <div className="min-h-screen bg-background" dir="ltr">
      {/* Header with Search Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={t('ui.placeholders.search')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={handleClearSearch}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tag Badge */}
        {selectedTag && (
          <div className="px-4 pb-2">
            <Badge
              variant="outline"
              className="bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20"
              style={{
                backgroundColor: selectedTag.color ? `${selectedTag.color}20` : undefined,
                borderColor: selectedTag.color ? `${selectedTag.color}40` : undefined,
                color: selectedTag.color || '#FF6B35',
              }}
            >
              {selectedTag.title}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleRemoveTag}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Recent Searches */}
        {showRecentSearches && (
          <div className="space-y-1 mb-6">
            {recentSearches.map((item) => (
              <button
                key={item.id}
                onClick={() => handleRecentSearchClick(item)}
                className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {item.type === 'tag' ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                      <span className="text-[#FF6B35] text-xs font-bold">#</span>
                    </div>
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground">{item.query}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground"
                  onClick={(e) => handleDismissRecentSearch(item.id, e)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </button>
            ))}
          </div>
        )}

        {/* Trending Predictions Section */}
        {showTrending && (
          <div>
            <h2 className="text-lg font-bold mb-4">{t('ui.search.trendingToday')}</h2>
            {loading && predictions.length === 0 ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PredictionCardSkeleton key={`trending-skeleton-${index}`} />
                ))}
              </div>
            ) : predictions.length > 0 ? (
              <div className="space-y-0">
                {predictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    onClick={() => onPredictionClick(prediction)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground text-center">
                  {t('ui.emptyStates.noTrending')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {showSearchResults && (
          <div>
            {loading && predictions.length === 0 ? (
              <div className="space-y-0">
                {Array.from({ length: 3 }).map((_, index) => (
                  <PredictionCardSkeleton key={`search-skeleton-${index}`} />
                ))}
              </div>
            ) : predictions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground text-center mb-2">
                  {t('ui.emptyStates.noResults')}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {t('ui.emptyStates.tryDifferentKeywords')}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {predictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    onClick={() => onPredictionClick(prediction)}
                  />
                ))}
                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-4" />
                {isLoadingMore && (
                  <div className="py-4">
                    <PredictionCardSkeleton />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
