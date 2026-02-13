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
import { SearchHistoryItem, Tag, Topic } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';
import {PredictionCardSummary} from "./PredictionCardSummary.tsx";
import {tagService} from "../services/tagService.service.ts";

interface SearchPageProps {
    onClose: () => void;
    onPredictionClick: (prediction: Prediction) => void;
    selectedTag?: Tag;
    onClearSelectedTag: () => void;
    onTagSelected: (tagTitle: Tag) => void;
    onTopicSelected?: (topicId: number) => void;
}

export function SearchPage({ onClose, onPredictionClick, selectedTag, onClearSelectedTag, onTagSelected, onTopicSelected}: SearchPageProps) {
  const t = useTranslation();
  // When a tag is selected, keep search input empty - only tag_id will be used for API
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagQuery, setTagQuery] = useState('');
  const [tagResults, setTagResults] = useState<Tag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(undefined);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        // If tag dropdown is open, do nothing
        if (showTagDropdown) {
            e.preventDefault();
            return;
        }

        // Normal text search → let debounce handle it
    };

    // Don't clear search query when tag is selected - allow user to search within tag results

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

    // Load recent searches when there's no search query, tag, or topic selected
    if (!debouncedQuery && !selectedTag && !selectedTopicId) {
      loadRecentSearches();
    }
  }, [debouncedQuery, selectedTag, selectedTopicId]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

    const { predictions, loading, pagination, loadMore } =
        usePredictionFeed(
            // Send search query if present (can be combined with tag_id or topic_id)
            debouncedQuery || undefined,
            selectedTopicId, // topic_id from recent search
            undefined,
            selectedTag?.id
        );

  const hasMore = pagination.page < pagination.lastPage;
  const { isLoading: isLoadingMore, sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    // Enable infinite scroll when there are results and either search query, tag, or topic is present
    enabled: !loading && predictions.length > 0 && (!!debouncedQuery || !!selectedTag || !!selectedTopicId),
  });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        
        // Keep the tag selected even when user types - don't clear it
        // The tag will remain active and both tag_id and search query can be used together

        const hashIndex = value.lastIndexOf('#');

        if (hashIndex !== -1) {
            const query = value.slice(hashIndex + 1).trim();
            setTagQuery(query);
            setShowTagDropdown(true);
        } else {
            setTagQuery('');
            setShowTagDropdown(false);
        }
    };

    useEffect(() => {
        if (!showTagDropdown) return;

        let cancelled = false;

        const loadTags = async () => {
            setLoadingTags(true);
            try {
                const tags = await tagService.searchTags(undefined, 1, 10);
                if (!cancelled) {
                    setTagResults(
                        tags.filter(tag =>
                            tag.title.toLowerCase().includes(tagQuery.toLowerCase())
                        )
                    );
                }
            } finally {
                setLoadingTags(false);
            }
        };

        loadTags();

        return () => {
            cancelled = true;
        };
    }, [tagQuery, showTagDropdown]);



    const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const handleRecentSearchClick = (item: SearchHistoryItem) => {
    // Clear previous selections
    onClearSelectedTag();
    setSelectedTopicId(undefined);
    setSearchQuery('');
    setDebouncedQuery('');
    
    // Handle based on searchable_type
    if (item.searchable_type === 'App\\Models\\Tag' && item.searchable) {
      // It's a tag - select the tag
      const tag = item.searchable as Tag;
      onTagSelected(tag);
    } else if (item.searchable_type === 'App\\Models\\Topic' && item.searchable) {
      // It's a topic - select the topic
      const topic = item.searchable as Topic;
      setSelectedTopicId(topic.id);
      if (onTopicSelected) {
        onTopicSelected(topic.id);
      }
    } else if (item.search_text) {
      // It's a text search
      setSearchQuery(item.search_text);
    }
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
    onClearSelectedTag();
  };

    const handleTagSelect = (tag: Tag) => {
        onClearSelectedTag();
        onTagSelected(tag);
        setShowTagDropdown(false);
        setTagQuery('');
        setSearchQuery('');
        setDebouncedQuery('');
    };

    const showTrending = !debouncedQuery && !selectedTag && !selectedTopicId;
  // Show recent searches when no query/tag/topic and we have recent searches loaded
  // Show them even if trending is loading/loaded - they should appear above trending
  const showRecentSearches = !debouncedQuery && !selectedTag && !selectedTopicId && recentSearches.length > 0 && !loadingHistory;
  // Show search results when there's a query OR when a tag or topic is selected
  const showSearchResults = !!debouncedQuery || !!selectedTag || !!selectedTopicId;


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
              onKeyDown={handleKeyDown}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
              {showTagDropdown && (
                  <div
                      onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
                      className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow">
                      {loadingTags ? (
                          <div className="p-3 text-sm text-muted-foreground">Loading tags…</div>
                      ) : tagResults.length > 0 ? (
                          tagResults.map(tag => (
                              <button
                                  key={tag.id}
                                  onClick={() => handleTagSelect(tag)}
                                  className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                              >
                                  <span className="font-medium">#{tag.title}</span>
                              </button>
                          ))
                      ) : (
                          <div className="p-3 text-sm text-muted-foreground">No tags found</div>
                      )}
                  </div>
              )}

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
                  {item.searchable_type === 'App\\Models\\Tag' || item.searchable_type === 'tag' ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                      <span className="text-[#FF6B35] text-xs font-bold">#</span>
                    </div>
                  ) : item.searchable_type === 'App\\Models\\Topic' || item.searchable_type === 'topic' ? (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📁</span>
                    </div>
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground">
                    {item.searchable_type === 'App\\Models\\Tag' && item.searchable
                      ? (item.searchable as Tag).title
                      : item.searchable_type === 'App\\Models\\Topic' && item.searchable
                      ? (item.searchable as Topic).title
                      : item.search_text || t('ui.search.recentSearch')}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground"
                  onClick={(e: any) => handleDismissRecentSearch(item.id, e)}
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
                  <PredictionCardSummary
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
                  <PredictionCardSummary
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
