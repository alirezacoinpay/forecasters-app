import { useState, useEffect, useRef } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Prediction } from '../data/mockData';
import { CommentSection } from './CommentSection';

interface PredictionDetailProps {
    prediction: Prediction;
    onClose: () => void;
}

export function PredictionDetail({ prediction, onClose }: PredictionDetailProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [opinion] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [height, setHeight] = useState<number>(70);

    const heightRef = useRef<number>(70);
    const startY = useRef<number | null>(null);
    const startHeight = useRef<number>(70);
    const dragging = useRef(false);

    const velocityRef = useRef(0);
    const lastYRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    const SNAP_POINTS = [95, 75, 50];
    const MIN_HEIGHT = 35;
    const MAX_HEIGHT = 100;
    const CLOSE_HEIGHT_THRESHOLD = 45;
    const VELOCITY_CLOSE_THRESHOLD = 0.5;
    const TRANSITION_MS = 300;

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const setHeightSync = (h: number) => {
        heightRef.current = h;
        setHeight(h);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, TRANSITION_MS);
    };

    const handleSubmit = () => {
        if (selectedOption && opinion.trim()) {
            console.log('Submitted:', { option: selectedOption, opinion });
        }
    };

    const addListeners = () => {
        document.addEventListener('mousemove', handleDragMove as any);
        document.addEventListener('mouseup', handleDragEnd as any);
        document.addEventListener('touchmove', handleDragMove as any, { passive: false } as any);
        document.addEventListener('touchend', handleDragEnd as any);
    };

    const removeListeners = () => {
        document.removeEventListener('mousemove', handleDragMove as any);
        document.removeEventListener('mouseup', handleDragEnd as any);
        document.removeEventListener('touchmove', handleDragMove as any);
        document.removeEventListener('touchend', handleDragEnd as any);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        dragging.current = true;
        const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        startY.current = y;
        startHeight.current = heightRef.current;

        lastYRef.current = y;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

        addListeners();
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (startY.current === null || !dragging.current) return;

        if ('touches' in e) {
            e.preventDefault();
        }

        const currentY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        const deltaY = startY.current - currentY;
        let newHeight = startHeight.current + (deltaY / window.innerHeight) * 100;

        if (newHeight > SNAP_POINTS[0]) {
            const overshoot = newHeight - SNAP_POINTS[0];
            newHeight = SNAP_POINTS[0] + overshoot * 0.35;
        } else if (newHeight < MIN_HEIGHT) {
            const undershoot = MIN_HEIGHT - newHeight;
            newHeight = MIN_HEIGHT - undershoot * 0.35;
        }

        newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight));
        setHeightSync(Number(newHeight.toFixed(2)));

        const now = performance.now();
        const lastY = lastYRef.current!;
        const lastTime = lastTimeRef.current!;
        const dy = (lastY - currentY);
        const dt = Math.max(1, now - lastTime);
        velocityRef.current = (currentY - lastY) / dt;

        lastYRef.current = currentY;
        lastTimeRef.current = now;
    };

    const findClosestSnap = (value: number) => {
        return SNAP_POINTS.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a), SNAP_POINTS[0]);
    };

    const handleDragEnd = () => {
        removeListeners();

        if (!dragging.current) {
            startY.current = null;
            return;
        }
        dragging.current = false;

        const currentHeight = heightRef.current;
        const velocity = velocityRef.current;

        lastYRef.current = null;
        lastTimeRef.current = null;
        velocityRef.current = 0;

        if (velocity > VELOCITY_CLOSE_THRESHOLD) {
            handleClose();
            return;
        }

        if (currentHeight < CLOSE_HEIGHT_THRESHOLD) {
            handleClose();
            return;
        }

        const snap = findClosestSnap(currentHeight);
        setHeightSync(snap);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={handleClose}
        >
            <div
                className="bg-background w-full max-w-2xl rounded-t-3xl overflow-hidden"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 0.98, 0.38, 0.99), height ${TRANSITION_MS}ms cubic-bezier(0.22, 0.98, 0.38, 0.99)`,
                    height: `${height}vh`,
                }}
            >
                <div
                    className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                >
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div className="h-full overflow-y-auto pb-6">
                    <div className="sticky top-0 bg-background border-b border-border px-4 pt-1 flex items-center justify-between z-10">
                        <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{prediction.timestamp}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm">{prediction.author}</span>
                            <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 space-y-6">
                        <div>
                            <p className="text-sm font-semibold leading-relaxed mb-2">{prediction.question}</p>

                            <div className="flex flex-wrap gap-2">
                                {prediction.tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="outline"
                                        className="rounded-md bg-gray-50 border-gray-200 text-gray-700"
                                    >
                                        {tag.label}
                                    </Badge>
                                ))}
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {prediction.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSelectedOption(option.id)}
                                            className={`p-3 transition-all rounded-none ${
                                                selectedOption === option.id ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-200 bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-1 text-sm text-blue-600">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>{option.percentage}%</span>
                                            </div>
                                            <span className="text-xs text-gray-600 block mt-2">
                        کشور زدن                      {option.voters}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-border p-4 space-y-4">
                            {prediction.detailedDescription && (
                                <div className="space-y-2">
                                    <h4 className="text-sm">توضیحات</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">{prediction.detailedDescription}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="text-sm text-center">پیش‌بینی کاربران</h4>
                                <div className="space-y-2">
                                    {prediction.options.map((option, index) => (
                                        <div key={option.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600">
                                                  {index + 1}. کشور زدن {option.voters}
                                                </span>
                                                <span className="text-[#FF6B35]">نسبت {option.percentage}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#FF6B35] transition-all" style={{ width: `${option.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {prediction.comments && prediction.comments.length > 0 && (
                            <CommentSection comments={prediction.comments} />
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 bg-background w-full">
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-none font-bold text-md w-full py-6 font-yekanBakh"
                    >
                        ثبت پیش‌بینی
                    </Button>
                </div>
            </div>
        </div>
    );
}
