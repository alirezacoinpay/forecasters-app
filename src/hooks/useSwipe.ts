import { useState, useRef, TouchEvent } from 'react';

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeProgress?: (progress: number, direction: 'left' | 'right' | null) => void;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
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
    onTouchMove: swipeOutput.onTouchMove,
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

  const minSwipeDistance = 50;
  const swipeThreshold = 10; // Start tracking after 10px movement

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);
    containerRef.current = e.currentTarget as HTMLElement;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (touchStart === null) return;
    
    const currentX = e.targetTouches[0].clientX;
    const deltaX = touchStart - currentX;
    const absDeltaX = Math.abs(deltaX);

    // Start tracking swipe after threshold
    if (absDeltaX > swipeThreshold) {
      setIsSwiping(true);
      
      // Calculate progress (0-100%)
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const progress = Math.min(100, (absDeltaX / containerWidth) * 100);
      setSwipeProgress(progress);
      
      // Determine direction
      const direction = deltaX > 0 ? 'left' : 'right';
      setSwipeDirection(direction);
      
      // Call progress callback if provided
      if (input.onSwipeProgress) {
        input.onSwipeProgress(progress, direction);
      }
    }
    
    setTouchEnd(currentX);
  };

  const onTouchEnd = () => {
    if (!touchStart || touchEnd === null) {
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeDirection(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const absDistance = Math.abs(distance);
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Reset swipe state
    setIsSwiping(false);
    setSwipeProgress(0);
    setSwipeDirection(null);

    // Trigger callbacks if threshold met
    if (isLeftSwipe && input.onSwipeLeft) {
      input.onSwipeLeft();
    }
    if (isRightSwipe && input.onSwipeRight) {
      input.onSwipeRight();
    }

    // Reset touch tracking
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeProgress,
    swipeDirection,
  };
}
