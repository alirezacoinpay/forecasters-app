import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Prediction } from '../models/Prediction';
import { PredictionCard } from './PredictionCard';
import { PredictionCardSkeleton } from './PredictionCardSkeleton';
import { usePredictionFeed } from '../hooks/predictions/usePredictionFeed.ts.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredictionClick: (prediction: Prediction) => void;
}

export function SearchModal({ isOpen, onClose, onPredictionClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const { predictions, loading } = usePredictionFeed(debouncedQuery);

  const handleClose = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0" dir="rtl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>جستجوی پیش‌بینی‌ها</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="جستجو کنید..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              dir="rtl"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && predictions.length === 0 ? (
            <div className="p-4 space-y-0">
              {Array.from({ length: 3 }).map((_, index) => (
                <PredictionCardSkeleton key={`search-skeleton-${index}`} />
              ))}
            </div>
          ) : debouncedQuery && predictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <p className="text-muted-foreground text-center mb-2">
                نتیجه‌ای یافت نشد
              </p>
              <p className="text-sm text-muted-foreground text-center">
                سعی کنید کلمات کلیدی دیگری جستجو کنید
              </p>
            </div>
          ) : debouncedQuery ? (
            <div className="space-y-0">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  onClick={() => {
                    onPredictionClick(prediction);
                    handleClose();
                  }}
                >
                  <PredictionCard
                    prediction={prediction}
                    onClick={() => {}}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-center">
                برای جستجو، کلمه کلیدی را وارد کنید
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
