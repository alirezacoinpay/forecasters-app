import { useState, useRef, useCallback, useEffect } from 'react';

export type BottomSheetState = 'collapsed' | 'half-expanded' | 'fully-expanded';

interface UseBottomSheetOptions {
    onClose: () => void;
    collapsedHeight?: number; // vh
    halfExpandedHeight?: number; // vh
    fullyExpandedHeight?: number; // vh
    closeThreshold?: number; // vh
    velocityThreshold?: number; // px/ms
}

export function useBottomSheet({
    onClose,
    collapsedHeight = 50,
    halfExpandedHeight = 75,
    fullyExpandedHeight = 95,
    closeThreshold = 30,
    velocityThreshold = 0.5,
}: UseBottomSheetOptions) {
    const [state, setState] = useState<BottomSheetState>('half-expanded');
    const [height, setHeight] = useState<number>(halfExpandedHeight);
    const [isDragging, setIsDragging] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [canScroll, setCanScroll] = useState(false);
    const [isTracking, setIsTracking] = useState(false); // Track when we should attach listeners

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number | null>(null);
    const startHeight = useRef<number>(halfExpandedHeight);
    const lastY = useRef<number | null>(null);
    const lastTime = useRef<number | null>(null);
    const velocity = useRef<number>(0);
    const scrollTop = useRef<number>(0);
    const isDraggingRef = useRef(false);
    const dragThreshold = 5; // pixels - must move this much to start dragging
    const hasMovedRef = useRef(false);
    const startTargetRef = useRef<EventTarget | null>(null); // Track where touch started

    // Update state based on height
    useEffect(() => {
        if (isDragging) return;

        const threshold1 = (collapsedHeight + halfExpandedHeight) / 2;
        const threshold2 = (halfExpandedHeight + fullyExpandedHeight) / 2;

        if (height < threshold1) {
            setState('collapsed');
            setCanScroll(false);
        } else if (height < threshold2) {
            setState('half-expanded');
            setCanScroll(false);
        } else {
            setState('fully-expanded');
            setCanScroll(true);
        }
    }, [height, isDragging, collapsedHeight, halfExpandedHeight, fullyExpandedHeight]);

    // Handle scroll at top boundary
    const handleScroll = useCallback((e: Event) => {
        if (!canScroll || !contentRef.current) return;

        const target = e.target as HTMLElement;
        const scrollTopValue = target.scrollTop || contentRef.current.scrollTop;
        scrollTop.current = scrollTopValue;

        // If at top and trying to scroll down, start collapsing
        if (scrollTopValue === 0 && state === 'fully-expanded' && !isDraggingRef.current) {
            // This will be handled by touch/wheel events
        }
    }, [canScroll, state]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        content.addEventListener('scroll', handleScroll, { passive: true });
        return () => content.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const getSnapPoint = useCallback((currentHeight: number): number => {
        const points = [collapsedHeight, halfExpandedHeight, fullyExpandedHeight];
        return points.reduce((closest, point) => 
            Math.abs(point - currentHeight) < Math.abs(closest - currentHeight) ? point : closest
        );
    }, [collapsedHeight, halfExpandedHeight, fullyExpandedHeight]);

    const handleStart = useCallback((clientY: number, target?: EventTarget | null) => {
        if (!containerRef.current) return;

        // Don't start drag if clicking on interactive elements
        if (target instanceof HTMLElement) {
            const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], [role="tab"]');
            if (isInteractive && isInteractive !== containerRef.current) {
                return;
            }

            // If touch starts on the content area and we're fully expanded with scrollable content
            if (contentRef.current && state === 'fully-expanded' && canScroll) {
                const isOnContent = contentRef.current.contains(target);
                const currentScrollTop = contentRef.current.scrollTop;
                const atTop = currentScrollTop <= 5;

                // If touching content area and NOT at top, don't start tracking (allow scroll)
                if (isOnContent && !atTop) {
                    return;
                }
            }
        }

        // Initialize drag tracking but don't set dragging yet (wait for threshold)
        hasMovedRef.current = false;
        startY.current = clientY;
        startHeight.current = height;
        lastY.current = clientY;
        lastTime.current = performance.now();
        velocity.current = 0;
        startTargetRef.current = target || null;

        // Check if we're at scroll top
        if (contentRef.current) {
            scrollTop.current = contentRef.current.scrollTop;
        }

        // Set tracking state to attach listeners
        setIsTracking(true);
    }, [height, state, canScroll]);

    const handleMove = useCallback((clientY: number) => {
        if (startY.current === null) return;

        const deltaY = startY.current - clientY; // Positive = dragging up, Negative = dragging down
        const deltaAbs = Math.abs(deltaY);

        // Check if we've moved enough to start dragging
        if (!hasMovedRef.current && deltaAbs < dragThreshold) {
            return; // Wait for threshold before starting drag
        }

        // Start dragging if we've crossed the threshold
        if (!hasMovedRef.current && deltaAbs >= dragThreshold) {
            hasMovedRef.current = true;
            isDraggingRef.current = true;
            setIsDragging(true);
            setIsScrolling(false);
        }

        if (!isDraggingRef.current) return;

        const newHeight = startHeight.current + (deltaY / window.innerHeight) * 100;

        // If fully expanded and content is scrollable, handle scroll vs drag
        if (state === 'fully-expanded' && contentRef.current && canScroll) {
            const isDraggingDown = deltaY < 0; // Negative delta = dragging down
            const currentScrollTop = contentRef.current.scrollTop;
            const atTop = currentScrollTop <= 5; // Small threshold for "at top"

            // If not at top and dragging down, allow content to scroll instead
            if (!atTop && isDraggingDown) {
                // Let the content scroll naturally, don't change sheet height
                return;
            }
            // If at top or dragging up, continue with height change (collapse or expand)
        }

        // Apply resistance at boundaries (rubber band effect)
        let constrainedHeight = newHeight;
        if (newHeight > fullyExpandedHeight) {
            const overshoot = newHeight - fullyExpandedHeight;
            constrainedHeight = fullyExpandedHeight + overshoot * 0.15; // Resistance
        } else if (newHeight < 0) {
            const undershoot = -newHeight;
            constrainedHeight = -undershoot * 0.15; // Resistance
        }

        setHeight(Math.max(0, Math.min(100, constrainedHeight)));

        // Calculate velocity for momentum
        if (lastY.current !== null && lastTime.current !== null) {
            const now = performance.now();
            const dt = Math.max(1, now - lastTime.current);
            velocity.current = (clientY - lastY.current) / dt;
            lastY.current = clientY;
            lastTime.current = now;
        }
    }, [state, fullyExpandedHeight, canScroll]);

    const handleEnd = useCallback(() => {
        // If we never started dragging (clicked but didn't move), just return
        if (!hasMovedRef.current) {
            startY.current = null;
            startTargetRef.current = null;
            setIsTracking(false);
            return;
        }

        if (!isDraggingRef.current) {
            startY.current = null;
            hasMovedRef.current = false;
            startTargetRef.current = null;
            setIsTracking(false);
            return;
        }

        isDraggingRef.current = false;
        setIsDragging(false);
        hasMovedRef.current = false;

        const currentHeight = height;
        const currentVelocity = velocity.current;

        // Reset tracking
        startY.current = null;
        lastY.current = null;
        lastTime.current = null;
        velocity.current = 0;
        startTargetRef.current = null;
        setIsTracking(false);

        // Close if dragged down past threshold or with high velocity
        if (currentHeight < closeThreshold || currentVelocity > velocityThreshold) {
            onClose();
            return;
        }

        // Snap to nearest point
        const snapPoint = getSnapPoint(currentHeight);
        setHeight(snapPoint);
    }, [height, closeThreshold, velocityThreshold, getSnapPoint, onClose]);

    // Mouse events
    const onMouseMove = useCallback((e: MouseEvent) => {
        // Always track movement if we have a start position
        if (startY.current !== null) {
            if (isDraggingRef.current) {
                e.preventDefault();
                e.stopPropagation();
            }
            handleMove(e.clientY);
        }
    }, [handleMove]);

    const onMouseUp = useCallback(() => {
        handleEnd();
    }, [handleEnd]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        // Don't start drag if clicking on interactive elements
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], [role="tab"]');
        if (isInteractive && isInteractive !== containerRef.current) {
            return;
        }
        
        handleStart(e.clientY, e.target);
    }, [handleStart]);

    // Touch events
    const onTouchMove = useCallback((e: TouchEvent) => {
        // Only handle if we have a start position
        if (startY.current === null || !e.touches[0]) return;

        // Early exit: If touch started on content and we're not at top, don't interfere
        if (state === 'fully-expanded' && contentRef.current && canScroll && startTargetRef.current) {
            const startTarget = startTargetRef.current as HTMLElement;
            const isOnContent = contentRef.current.contains(startTarget);
            const currentScrollTop = contentRef.current.scrollTop;
            const atTop = currentScrollTop <= 5;
            
            // If touch started on content area and not at top, completely cancel tracking
            if (isOnContent && !atTop) {
                // Cancel all tracking immediately
                startY.current = null;
                hasMovedRef.current = false;
                startTargetRef.current = null;
                setIsTracking(false);
                isDraggingRef.current = false;
                setIsDragging(false);
                return; // Don't prevent default, allow normal scroll
            }
        }

        const deltaY = startY.current - e.touches[0].clientY;
        const deltaAbs = Math.abs(deltaY);
        
        // Check if we should start dragging (threshold check happens in handleMove)
        if (!isDraggingRef.current) {
            // Only prevent default if we've crossed threshold
            if (deltaAbs >= dragThreshold) {
                e.preventDefault();
                e.stopPropagation();
            }
        } else {
            // We're actively dragging, prevent default
            e.preventDefault();
            e.stopPropagation();
        }
        
        handleMove(e.touches[0].clientY);
    }, [handleMove, dragThreshold, state, canScroll]);

    const onTouchEnd = useCallback(() => {
        handleEnd();
    }, [handleEnd]);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (touch) {
            handleStart(touch.clientY, e.target);
        }
    }, [handleStart]);

    // Wheel events for scroll-to-collapse (when at top of content)
    // This is attached directly to the container element, not via React props
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (!canScroll || !contentRef.current || state !== 'fully-expanded') return;

            const isScrollingDown = e.deltaY > 0;
            const atTop = contentRef.current.scrollTop === 0;

            // If at top and scrolling down, collapse sheet instead of scrolling
            if (atTop && isScrollingDown) {
                e.preventDefault();
                e.stopPropagation();
                const delta = Math.min(Math.abs(e.deltaY) / window.innerHeight * 100, 3); // Max 3vh per wheel event
                setHeight(prev => Math.max(halfExpandedHeight, prev - delta));
            }
        };

        // Attach with passive: false to allow preventDefault
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [canScroll, state, halfExpandedHeight]);

    // Global event listeners - attach when tracking or dragging
    useEffect(() => {
        if (isTracking || isDragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);

            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
        }
    }, [isTracking, isDragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

    // Prevent body scroll when sheet is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return {
        state,
        height,
        isDragging,
        canScroll,
        containerRef,
        contentRef,
        onMouseDown,
        onTouchStart,
    };
}
