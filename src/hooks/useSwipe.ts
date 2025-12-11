import { useState, useRef, useEffect, TouchEvent } from 'react';

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeProgress?: (progress: number, direction: 'left' | 'right' | null) => void;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchEnd: () => void;
  // State values (not for spreading on DOM)
  isSwiping: boolean;
  swipeProgress: number;
  swipeDirection: 'left' | 'right' | null;
}

// Helper to get only event handlers for spreading on DOM elements
export function getSwipeEventHandlers(swipeOutput: SwipeOutput) {
  return {
    onTouchStart: swipeOutput.onTouchStart,
    onTouchEnd: swipeOutput.onTouchEnd,
  };
}

export function useSwipe(input: SwipeInput): SwipeOutput {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const inputRef = useRef(input);

  // Update ref when input changes
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const minSwipeDistance = 50;
  const swipeThreshold = 10; // Start tracking after 10px movement

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    const startX = e.targetTouches[0].clientX;
    setTouchStart(startX);
    touchStartRef.current = startX;
    touchEndRef.current = null;
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);
    containerRef.current = e.currentTarget as HTMLElement;
  };

  // Use native event listener for touchmove to allow preventDefault
  useEffect(() => {
    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (touchStartRef.current === null) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = touchStartRef.current - currentX;
      const absDeltaX = Math.abs(deltaX);

      // Prevent horizontal scrolling during swipe
      if (absDeltaX > swipeThreshold) {
        e.preventDefault();
        setIsSwiping(true);
        
        // Calculate progress (0-100%)
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
        const progress = Math.min(100, (absDeltaX / containerWidth) * 100);
        setSwipeProgress(progress);
        
        // Determine direction
        const direction = deltaX > 0 ? 'left' : 'right';
        setSwipeDirection(direction);
        
        // Call progress callback if provided
        if (inputRef.current.onSwipeProgress) {
          inputRef.current.onSwipeProgress(progress, direction);
        }
      }
      
      touchEndRef.current = currentX;
      setTouchEnd(currentX);
    };

    // Attach listener when touchStart is set
    if (touchStart !== null) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [touchStart, swipeThreshold]);

  const onTouchEnd = () => {
    const start = touchStartRef.current;
    const end = touchEndRef.current;
    
    if (!start || end === null) {
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeDirection(null);
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }
    
    const distance = start - end;
    const absDistance = Math.abs(distance);
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Reset swipe state
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);

    // Trigger callbacks if threshold met
    if (isLeftSwipe && inputRef.current.onSwipeLeft) {
      inputRef.current.onSwipeLeft();
    }
    if (isRightSwipe && inputRef.current.onSwipeRight) {
      inputRef.current.onSwipeRight();
    }

    // Reset touch tracking
    touchStartRef.current = null;
    touchEndRef.current = null;
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart,
    onTouchEnd,
    isSwiping,
    swipeProgress,
    swipeDirection,
  };
}
