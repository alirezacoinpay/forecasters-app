import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void> | void;
    threshold?: number;
    enabled?: boolean;
}

export function usePullToRefresh({ 
    onRefresh, 
    threshold = 80, 
    enabled = true 
}: UsePullToRefreshOptions) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef<number | null>(null);
    const currentY = useRef<number | null>(null);
    const elementRef = useRef<HTMLElement | null>(null);
    const isAtTopRef = useRef(false);

    // Check if we're at the top of the page
    const checkIfAtTop = (): boolean => {
        // Check window scroll (for body/document scrolling)
        const windowScrollY = window.scrollY || window.pageYOffset || 0;
        
        // Also check element scroll if element exists and is scrollable
        const element = elementRef.current;
        const elementScrollTop = element ? element.scrollTop : 0;
        
        // We're at top if both window and element are at top (with small threshold for floating point)
        const isWindowAtTop = windowScrollY <= 5; // 5px threshold
        const isElementAtTop = !element || elementScrollTop <= 5;
        
        return isWindowAtTop && isElementAtTop;
    };

    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            isAtTopRef.current = checkIfAtTop();
        };

        // Check initial state
        isAtTopRef.current = checkIfAtTop();

        // Listen to scroll events to track if we're at top
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        const element = elementRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll, { passive: true });
        }

        const handleTouchStart = (e: TouchEvent) => {
            // Only trigger if at the top of scroll (no more space to go up)
            if (checkIfAtTop()) {
                startY.current = e.touches[0].clientY;
                isAtTopRef.current = true;
            } else {
                startY.current = null;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (startY.current === null) return;

            // Re-check if still at top during move
            if (!checkIfAtTop()) {
                startY.current = null;
                currentY.current = null;
                return;
            }

            currentY.current = e.touches[0].clientY;
            const deltaY = currentY.current - startY.current;

            // Only allow pull down when at top
            if (deltaY > 0 && isAtTopRef.current) {
                // Prevent default scrolling when pulling down
                if (deltaY > 10) {
                    e.preventDefault();
                }
            } else if (deltaY <= 0) {
                // If pulling up, cancel the pull-to-refresh
                startY.current = null;
                currentY.current = null;
            }
        };

        const handleTouchEnd = async () => {
            if (startY.current === null || currentY.current === null) {
                startY.current = null;
                currentY.current = null;
                return;
            }

            // Final check: must still be at top
            if (!checkIfAtTop()) {
                startY.current = null;
                currentY.current = null;
                return;
            }

            const deltaY = currentY.current - startY.current;

            // Only trigger refresh if pulled down enough and still at top
            if (deltaY > threshold && isAtTopRef.current) {
                setIsRefreshing(true);
                try {
                    await onRefresh();
                } finally {
                    setIsRefreshing(false);
                }
            }

            startY.current = null;
            currentY.current = null;
        };

        // Attach touch events to document to catch all touches
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onRefresh, threshold, enabled]);

    return {
        isRefreshing,
        elementRef,
    };
}
