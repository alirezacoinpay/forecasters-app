import { useState, useEffect, useRef } from 'react';

export function useScrollVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const swipeTriggeredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show when at the top
        setIsVisible(true);
        swipeTriggeredRef.current = false;
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide (and reset swipe trigger)
        setIsVisible(false);
        swipeTriggeredRef.current = false;
      } else {
        // Scrolling up - show
        setIsVisible(true);
        swipeTriggeredRef.current = false;
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return isVisible;
}
