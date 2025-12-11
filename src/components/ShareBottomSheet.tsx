import { useState, useEffect } from 'react';
import { ChevronDown, Send, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { toast } from 'sonner';

interface ShareBottomSheetProps {
    predictionId: number;
    onClose: () => void;
}

const TRANSITION_MS = 300;

export function ShareBottomSheet({ predictionId, onClose }: ShareBottomSheetProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isVisible, setIsVisible] = useState(false);
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
        collapsedHeight: 50,
        halfExpandedHeight: 75,
        fullyExpandedHeight: 95,
        closeThreshold: 30,
        velocityThreshold: 0.5,
    });

    useEffect(() => {
        setIsVisible(true);
        // Focus management: focus the sheet content when it opens
        setTimeout(() => {
            containerRef.current?.focus();
        }, 100);
    }, [containerRef]);

    const handleSend = () => {
        if (phoneNumber.trim()) {
            toast.success(`ارسال به شماره: ${phoneNumber}`, {
                duration: 2000,
            });
            setPhoneNumber('');
            setTimeout(() => {
                handleClose();
            }, 500);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('لینک کپی شد!', {
            duration: 2000,
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={handleClose}
            style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${TRANSITION_MS}ms ease-out`,
            }}
        >
            <div
                ref={containerRef}
                className="bg-background w-full max-w-[428px] rounded-t-3xl overflow-hidden"
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
                dir="rtl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-bottom-sheet-title"
                tabIndex={-1}
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: isDragging ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), height ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    height: `${height}vh`,
                    maxHeight: '95vh',
                    cursor: isDragging ? 'grabbing' : 'default',
                    userSelect: isDragging ? 'none' : 'auto',
                    touchAction: 'none', // Prevent default touch behavior on container, content handles its own
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
                    className="h-full pb-24"
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
                    <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 pb-2 flex items-center justify-between z-10">
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <h3 id="share-bottom-sheet-title" className="font-semibold">اشتراک‌گذاری</h3>
                        <div className="w-10"></div>
                    </div>

                    <div className="px-4 py-6 space-y-4">
                        {/* Share Link Section */}
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">لینک پست</label>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyLink}
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
                            <label className="text-sm text-muted-foreground">ارسال به شماره موبایل</label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSend}
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
                                    dir="ltr"
                                    type="tel"
                                    maxLength={11}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                پست به صورت پیامک به شماره وارد شده ارسال می‌شود
                            </p>
                        </div>

                        {/* Social Media Options */}
                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground mb-3">اشتراک‌گذاری در شبکه‌های اجتماعی</p>
                            <div className="grid grid-cols-4 gap-3">
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs">تلگرام</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-xs">واتساپ</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs">توییتر</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs">سایر</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
