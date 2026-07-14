import { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from './button';
import { useBottomSheet } from '../../hooks/useBottomSheet';
import {useTranslation} from "../../hooks/useTranslation.ts";

export interface BottomSheetOptions {
    // Three-state system (default)
    collapsedHeight?: number; // vh
    halfExpandedHeight?: number; // vh
    fullyExpandedHeight?: number; // vh
    // Dynamic height system (alternative)
    initialHeight?: number; // vh - initial height when opened
    maxHeight?: number; // vh - maximum height it can expand to
    // Common options
    closeThreshold?: number; // vh
    velocityThreshold?: number; // px/ms
    maxWidth?: string; // CSS max-width value
    showDragHandle?: boolean;
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    zIndex?: number;
    backdropOpacity?: number;
    dir?: 'rtl' | 'ltr';
}

export interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    options?: BottomSheetOptions;
    className?: string;
    contentClassName?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

const TRANSITION_MS = 300;

export function BottomSheet({
    isOpen,
    onClose,
    children,
    header,
    footer,
    options = {},
    className = '',
    contentClassName = '',
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
}: BottomSheetProps) {
    const {
        // Three-state system
        collapsedHeight: collapsedHeightOption,
        halfExpandedHeight: halfExpandedHeightOption,
        fullyExpandedHeight: fullyExpandedHeightOption,
        // Dynamic height system
        initialHeight,
        maxHeight: maxHeightOption,
        // Common options
        closeThreshold = 30,
        velocityThreshold = 0.5,
        maxWidth = 'max-w-2xl',
        showDragHandle = true,
        showCloseButton = true,
        closeOnBackdropClick = true,
        zIndex = 50,
        backdropOpacity = 0.5,
        dir = 'rtl',
    } = options;

    const t = useTranslation();
    // Use dynamic height system if provided, otherwise use three-state system
    const collapsedHeight = initialHeight ?? collapsedHeightOption ?? 50;
    // If using dynamic system, set halfExpandedHeight to midpoint between initial and max
    const halfExpandedHeight = initialHeight && maxHeightOption 
        ? (initialHeight + maxHeightOption) / 2 
        : (halfExpandedHeightOption ?? 75);
    const fullyExpandedHeight = maxHeightOption ?? fullyExpandedHeightOption ?? 95;
    const maxHeight = maxHeightOption ?? fullyExpandedHeight;

    // Start hidden so the browser can paint the off-screen state before the
    // opening transition begins. Initialising this from `isOpen` skips that
    // first paint when the sheet is conditionally mounted.
    const [isVisible, setIsVisible] = useState(false);
    const openTimeRef = useRef<number>(0);

    const handleClose = () => {
        // Prevent closing immediately after opening (within 200ms)
        const timeSinceOpen = Date.now() - openTimeRef.current;
        if (timeSinceOpen < 200) {
            return;
        }
        
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, TRANSITION_MS);
    };

    const {
        state,
        height,
        isDragging,
        canScroll,
        containerRef,
        contentRef,
        onMouseDown,
        onTouchStart,
    } = useBottomSheet({
        onClose: handleClose,
        collapsedHeight,
        halfExpandedHeight,
        fullyExpandedHeight,
        closeThreshold,
        velocityThreshold,
    });

    useEffect(() => {
        if (isOpen) {
            openTimeRef.current = Date.now();
            const animationFrame = requestAnimationFrame(() => {
                setIsVisible(true);
            });
            // Focus management: focus the sheet content when it opens
            const focusTimer = window.setTimeout(() => {
                containerRef.current?.focus();
            }, 100);

            return () => {
                cancelAnimationFrame(animationFrame);
                window.clearTimeout(focusTimer);
            };
        }

        setIsVisible(false);
    }, [isOpen, containerRef]);

    // Don't render if not open (parent controls mounting)
    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick) {
            const target = e.target as HTMLElement;
            if (containerRef.current && !containerRef.current.contains(target)) {
                handleClose();
            }
        }
    };

    const handleBackdropTouchStart = (e: React.TouchEvent) => {
        if (closeOnBackdropClick && !isDragging) {
            const target = e.target as HTMLElement;
            if (containerRef.current && !containerRef.current.contains(target)) {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
            }
        }
    };

    const bottomSheetContent = (
        <div
            className="fixed inset-0 flex items-end justify-center"
            onClick={handleBackdropClick}
            onTouchStart={handleBackdropTouchStart}
            style={{
                backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease-out`,
                zIndex,
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
        >
            <div
                ref={containerRef}
                className={`bg-background w-full ${maxWidth} rounded-t-3xl overflow-hidden ${className}`}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                    // Only handle drag if not clicking on content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(e.target as HTMLElement);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal interaction with content
                        }
                    }
                    onMouseDown(e);
                }}
                onTouchStart={(e) => {
                    // Only handle drag if not touching content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(e.target as HTMLElement);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal scrolling
                        }
                    }
                    onTouchStart(e);
                }}
                dir={dir}
                role="dialog"
                aria-modal="true"
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                tabIndex={-1}
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: isDragging ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), height ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    height: `${height}vh`,
                    maxHeight: `${maxHeight}vh`,
                    cursor: isDragging ? 'grabbing' : 'default',
                    userSelect: isDragging ? 'none' : 'auto',
                    touchAction: 'none', // Prevent default touch behavior on container, content handles its own
                }}
            >
                {/* Drag handle indicator - also draggable */}
                {showDragHandle && (
                    <div 
                        className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                    >
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                )}

                <div 
                    ref={contentRef}
                    className={`h-full ${contentClassName}`}
                    style={{
                        overflowY: canScroll ? 'auto' : 'hidden',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: canScroll ? 'pan-y' : 'none',
                        pointerEvents: 'auto', // Ensure content is interactive
                        position: 'relative',
                        height: '100%',
                    }}
                    onTouchStart={(e) => {
                        // Stop propagation to prevent container from handling this touch
                        // Only if we're on content and not at top
                        if (canScroll && contentRef.current) {
                            const atTop = contentRef.current.scrollTop <= 5;
                            if (!atTop) {
                                e.stopPropagation(); // Prevent container drag handlers
                            }
                        }
                    }}
                >
                    {/* Header */}
                    {header && (
                        <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 pb-2 flex items-center justify-between z-10">
                                        <div className="px-3">
                                        <span className="text-sm font-medium">{header}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                                <ChevronDown className="w-5 h-5" />
                            </Button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-4 py-6">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border w-full px-4 py-3 shadow-lg">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Render using portal to ensure it's always on top
    if (typeof document !== 'undefined') {
        return createPortal(bottomSheetContent, document.body);
    }
    
    return bottomSheetContent;
}
