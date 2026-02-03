import { useState, useEffect } from 'react';
import { ChevronDown, Send, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { shareService } from '../services/shareService.service';
import { useTranslation } from '../hooks/useTranslation';

interface ShareBottomSheetProps {
    predictionId: number;
    onClose: () => void;
}

const TRANSITION_MS = 300;

export function ShareBottomSheet({ predictionId, onClose }: ShareBottomSheetProps) {
    const t = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const shareUrl = `https://example.com/prediction/${predictionId}`;

    const handleClose = () => {
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
        collapsedHeight: 30,
        halfExpandedHeight: 60,
        fullyExpandedHeight: 85,
        closeThreshold: 25,
        velocityThreshold: 0.5,
    });

    useEffect(() => {
        // Set mounted immediately to allow transition
        setIsMounted(true);
        // Use requestAnimationFrame to ensure smooth transition from bottom
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        });
    }, []);

    const handleSend = async () => {
        if (!phoneNumber.trim()) {
            return;
        }

        try {
            await shareService.sendSms({
                prediction_id: predictionId,
                mobile: phoneNumber.trim(),
            });
            
            toast.success(t('success.sentToPhone', { phoneNumber }), {
                duration: 2000,
            });
            setPhoneNumber('');
            setTimeout(() => {
                handleClose();
            }, 500);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || t('errors.smsError');
            toast.error(errorMessage, {
                duration: 3000,
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success(t('success.linkCopied'), {
            duration: 2000,
        });
    };

    const handleBackdropTouchStart = (e: React.TouchEvent) => {
        // Check if touch is on the backdrop itself (not on the sheet container)
        const target = e.target as HTMLElement;
        if (containerRef.current && !containerRef.current.contains(target)) {
            // Don't close if we're currently dragging the sheet
            if (isDragging) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            // Close immediately on touch start for mobile-first experience
            handleClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        // Check if click is on the backdrop itself (not on the sheet container)
        const target = e.target as HTMLElement;
        if (containerRef.current && !containerRef.current.contains(target)) {
            handleClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center"
            onTouchStart={handleBackdropTouchStart}
            onClick={handleBackdropClick}
            style={{
                opacity: isVisible && isMounted ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease-out`,
                pointerEvents: isVisible && isMounted ? 'auto' : 'none',
            }}
        >
            <div
                ref={containerRef}
                className="bg-background w-full max-w-[428px] rounded-t-3xl overflow-hidden relative z-[101]"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                    // Only handle drag if not clicking on interactive elements
                    const target = e.target as HTMLElement;
                    const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
                    if (isInteractive) {
                        return; // Allow normal interaction - don't call drag handler
                    }
                    
                    // Only handle drag if not clicking on content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(target);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal interaction with content
                        }
                    }
                    
                    // Call hook's drag handler
                    onMouseDown(e);
                }}
                onTouchStart={(e) => {
                    // Only handle drag if not touching interactive elements
                    const target = e.target as HTMLElement;
                    const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
                    if (isInteractive) {
                        return; // Allow normal interaction - don't call drag handler
                    }
                    
                    // Only handle drag if not touching content area when scrollable
                    if (canScroll && contentRef.current) {
                        const isOnContent = contentRef.current.contains(target);
                        const atTop = contentRef.current.scrollTop <= 5;
                        if (isOnContent && !atTop) {
                            return; // Allow normal scrolling
                        }
                    }
                    
                    // Call hook's drag handler
                    onTouchStart(e);
                }}
                dir="rtl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-bottom-sheet-title"
                tabIndex={-1}
                style={{
                    transform: isVisible && isMounted ? 'translateY(0)' : 'translateY(100%)',
                    transition: isDragging ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), height ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    height: `${height}vh`,
                    maxHeight: '85vh',
                    cursor: isDragging ? 'grabbing' : 'default',
                    userSelect: isDragging ? 'none' : 'auto',
                    position: 'relative',
                    touchAction: isDragging ? 'none' : 'auto', // Only prevent touch when dragging
                }}
            >
                {/* Drag handle indicator - also draggable */}
                <div 
                    className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                >
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div 
                    ref={contentRef}
                    className="h-full overflow-hidden"
                    style={{
                        overflowY: canScroll ? 'auto' : 'hidden',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        touchAction: canScroll ? 'pan-y' : 'auto',
                        pointerEvents: 'auto', // Ensure content is interactive
                        position: 'relative',
                        height: '100%',
                    }}
                    onMouseDown={(e) => {
                        // Stop propagation for ALL interactive elements to prevent drag
                        const target = e.target as HTMLElement;
                        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
                        if (isInteractive) {
                            e.stopPropagation(); // Prevent container drag handlers completely
                        }
                    }}
                    onTouchStart={(e) => {
                        // Stop propagation for ALL interactive elements to prevent drag
                        const target = e.target as HTMLElement;
                        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
                        
                        // Always stop propagation for interactive elements
                        if (isInteractive) {
                            e.stopPropagation();
                            return;
                        }
                        
                        // For non-interactive content, only stop if scrolling
                        if (canScroll && contentRef.current) {
                            const atTop = contentRef.current.scrollTop <= 5;
                            if (!atTop) {
                                e.stopPropagation(); // Prevent container drag handlers when scrolling
                            }
                        }
                    }}
                    onTouchEnd={(e) => {
                        // Ensure touch events on interactive elements work properly
                        const target = e.target as HTMLElement;
                        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
                        if (isInteractive) {
                            e.stopPropagation();
                        }
                    }}
                    onClick={(e) => {
                        // Ensure clicks on interactive elements work
                        e.stopPropagation();
                    }}
                >
                    <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 pb-2 flex items-center justify-between z-10">
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <h3 id="share-bottom-sheet-title" className="font-semibold">{t('ui.labels.shareTitle')}</h3>
                        <div className="w-10"></div>
                    </div>

                    <div className="px-4 py-6 space-y-4">
                        {/* Share Link Section */}
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">{t('ui.labels.postLink')}</label>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onTouchStart={(e: React.TouchEvent) => {
                                        e.stopPropagation();
                                        handleCopyLink();
                                    }}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleCopyLink();
                                    }}
                                    className="shrink-0"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="bg-gray-50"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* Phone Number Section */}
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">{t('ui.labels.sendToMobile')}</label>
                            <div className="flex gap-2">
                                <Button
                                    onTouchStart={(e: React.TouchEvent) => {
                                        e.stopPropagation();
                                        if (phoneNumber.trim()) {
                                            handleSend();
                                        }
                                    }}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleSend();
                                    }}
                                    disabled={!phoneNumber.trim()}
                                    className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white shrink-0"
                                    size="icon"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                                <Input
                                    placeholder="09123456789"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onTouchStart={(e: React.TouchEvent) => {
                                        e.stopPropagation();
                                    }}
                                    onTouchEnd={(e: React.TouchEvent) => {
                                        e.stopPropagation();
                                    }}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                    }}
                                    dir="ltr"
                                    type="tel"
                                    maxLength={11}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('ui.labels.smsDescription')}
                            </p>
                        </div>

                        {/* Social Media Options */}
                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground mb-3">{t('ui.labels.shareSocial')}</p>
                            <div className="grid grid-cols-4 gap-3">
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs">{t('ui.labels.telegram')}</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-xs">{t('ui.labels.whatsapp')}</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs">{t('ui.labels.twitter')}</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs">{t('ui.labels.other')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
