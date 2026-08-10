import { useState, useMemo, lazy, Suspense, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedView } from './components/predictions/FeedView.tsx';
import { PredictionCardSkeleton } from './components/PredictionCardSkeleton';
import { Prediction } from "./models/Prediction.ts";
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTopics, DEFAULT_TOPIC_ID } from './hooks/useTopics';
import { useAutoAuth } from './hooks/useAutoAuth';
import { Tag } from "./types/api.ts";
import { useTranslation } from "./hooks/useTranslation.ts";

// Code splitting: Lazy load heavy components
const CommentsBottomSheet = lazy(() => import('./components/CommentsBottomSheet').then(m => ({ default: m.CommentsBottomSheet })));
const CreatePredictionPage = lazy(() => import('./components/CreatePredictionPage').then(m => ({ default: m.CreatePredictionPage })));
const SearchPage = lazy(() => import('./components/SearchPage').then(m => ({ default: m.SearchPage })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));

const parseInitialUrl = (): number | undefined => {
    if (typeof window === "undefined") return;

    // 1. Handle Telegram WebApp start_param (Inside Telegram Mini App)
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

    if (startParam) {
        // Matches "predictions_77", "prediction_77", "predictions=77", or "77"
        const match = startParam.match(/(?:predictions?_|=)?(\d+)/);
        if (match && match[1]) {
            const id = parseInt(match[1], 10);
            if (!isNaN(id) && id > 0) {
                return id;
            }
        }
    }

    // 2. Handle standard browser URL parameters (Outside Telegram / Web fallback)
    const params = new URLSearchParams(window.location.search);
    const rawPrediction =
        params.get("prediction") ??
        params.get("predictions") ??
        params.get("predictionId");

    if (rawPrediction) {
        const id = parseInt(rawPrediction, 10);
        if (!isNaN(id) && id > 0) {
            // Clean up the URL search parameters without reloading
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("prediction");
            newUrl.searchParams.delete("predictions");
            newUrl.searchParams.delete("predictionId");
            window.history.replaceState({}, "", newUrl.toString());

            return id;
        }
    }

    return undefined;
};

export default function App() {
    const { user, loading: authLoading, authenticated } = useAutoAuth();
    const t = useTranslation();
    const initialDeepLinkPredictionId = useRef<number | undefined>(parseInitialUrl());

    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const [showAddPrediction, setShowAddPrediction] = useState(false);
    const [showSearchPage, setShowSearchPage] = useState(false);
    const [searchPageTag, setSearchPageTag] = useState<{ id: number; title: string; color: string } | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed');
    const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(
        initialDeepLinkPredictionId.current !== undefined ? DEFAULT_TOPIC_ID : undefined
    );
    const [headerVisibleFromSwipe, setHeaderVisibleFromSwipe] = useState(false);
    const [deepLinkPredictionId, setDeepLinkPredictionId] = useState<number | undefined>(initialDeepLinkPredictionId.current);
    const [isDeepLinkLoading, setIsDeepLinkLoading] = useState(initialDeepLinkPredictionId.current !== undefined);
    const isNavVisibleFromScroll = useScrollVisibility();
    const prevScrollVisibleRef = useRef(isNavVisibleFromScroll);
    const { topics, loading: topicsLoading } = useTopics();

    // Reset swipe-triggered visibility only when scrolling down
    useEffect(() => {
        if (prevScrollVisibleRef.current && !isNavVisibleFromScroll && headerVisibleFromSwipe) {
            setHeaderVisibleFromSwipe(false);
        }
        prevScrollVisibleRef.current = isNavVisibleFromScroll;
    }, [isNavVisibleFromScroll, headerVisibleFromSwipe]);

    const isNavVisible = isNavVisibleFromScroll || headerVisibleFromSwipe;

    const handleSearchTagSelected = (tag: Tag) => {
        setSearchPageTag(tag);
    };

    // Keyboard shortcuts
    useKeyboardShortcuts([
        {
            key: 'k',
            ctrl: true,
            handler: () => {
                const searchButton = document.querySelector('[aria-label="جستجو"]') as HTMLElement;
                searchButton?.click();
            },
            description: 'جستجو',
        },
        {
            key: 'n',
            ctrl: true,
            handler: () => setShowAddPrediction(true),
            description: 'پیش‌بینی جدید',
        },
        {
            key: 'Escape',
            handler: () => {
                if (selectedPrediction) setSelectedPrediction(null);
                if (showAddPrediction) setShowAddPrediction(false);
            },
            description: 'بستن',
        },
    ]);

    // Handle browser back/forward navigation for deep links
    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const predictionParam =
                urlParams.get('predictions') ||
                urlParams.get('prediction') ||
                urlParams.get('predictionId');

            if (predictionParam) {
                const predictionId = parseInt(predictionParam, 10);
                if (!isNaN(predictionId) && predictionId > 0) {
                    setDeepLinkPredictionId(predictionId);
                    setIsDeepLinkLoading(true);
                    setSelectedTopicId(DEFAULT_TOPIC_ID);

                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('predictions');
                    newUrl.searchParams.delete('prediction');
                    newUrl.searchParams.delete('predictionId');
                    window.history.replaceState({}, '', newUrl.toString());
                }
            } else {
                setDeepLinkPredictionId(undefined);
                setIsDeepLinkLoading(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Set initial topic when topics are loaded
    useEffect(() => {
        if (topics.length > 0 && selectedTopicId === undefined) {
            setSelectedTopicId(topics[0].id);
        }
    }, [topics, selectedTopicId]);

    // Handle swipe to change topic
    const handleSwipeLeft = () => {
        if (topics.length === 0 || isDeepLinkLoading) return;
        const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
        const nextIndex = (currentIndex + 1) % topics.length;
        setSelectedTopicId(topics[nextIndex].id);
        setHeaderVisibleFromSwipe(true);
    };

    const handleSwipeRight = () => {
        if (topics.length === 0 || isDeepLinkLoading) return;
        const currentIndex = topics.findIndex(topic => topic.id === selectedTopicId);
        const prevIndex = currentIndex === 0 ? topics.length - 1 : currentIndex - 1;
        setSelectedTopicId(topics[prevIndex].id);
        setHeaderVisibleFromSwipe(true);
    };

    // Handle prediction click from FeedView
    const handlePredictionClick = (prediction: Prediction) => {
        setSelectedPrediction(prediction);
    };

    // Show create prediction page
    if (showAddPrediction) {
        return (
            <Suspense fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-muted-foreground">{t('loading.loading')}</div>
                </div>
            }>
                <CreatePredictionPage
                    onClose={() => {
                        setShowAddPrediction(false);
                        setActiveTab('feed');
                    }}
                    selectedTopicId={selectedTopicId}
                    topics={topics}
                    onTopicChange={setSelectedTopicId}
                />
            </Suspense>
        );
    }

    // Show search page
    if (showSearchPage) {
        return (
            <Suspense fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            }>
                <SearchPage
                    onClose={() => {
                        setShowSearchPage(false);
                        setSearchPageTag(undefined);
                    }}
                    onTagSelected={handleSearchTagSelected}
                    selectedTag={searchPageTag}
                    onPredictionClick={(prediction) => {
                        setShowSearchPage(false);
                        setSearchPageTag(undefined);
                        setDeepLinkPredictionId(prediction.id);
                        setIsDeepLinkLoading(true);
                        setSelectedTopicId(DEFAULT_TOPIC_ID);
                    }}
                    onClearSelectedTag={() => setSearchPageTag(undefined)}
                />
            </Suspense>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mx-auto" style={{ maxWidth: '428px', width: '100%', overflowX: 'hidden' }}>
            <Header
                isVisible={isNavVisible}
                selectedTopicId={selectedTopicId}
                topics={topics}
                onTopicChange={setSelectedTopicId}
                onPredictionClick={handlePredictionClick}
                onSearchClick={() => setShowSearchPage(true)}
            />

            <div className="h-[57px]"></div>

            <main className="w-full pb-24">
                {activeTab === 'feed' ? (
                    <FeedView
                        topicId={selectedTopicId ?? DEFAULT_TOPIC_ID}
                        predictionId={deepLinkPredictionId}
                        onDeepLinkLoaded={() => {
                            setIsDeepLinkLoading(false);
                            setDeepLinkPredictionId(undefined);
                        }}
                        onPredictionClick={handlePredictionClick}
                    />
                ) : (
                    <Suspense fallback={
                        <div className="space-y-0">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <PredictionCardSkeleton key={`profile-skeleton-${i}`} />
                            ))}
                        </div>
                    }>
                        <ProfileView user={user} />
                    </Suspense>
                )}
            </main>

            <BottomNav
                isVisible={isNavVisible}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddPrediction={() => setShowAddPrediction(true)}
                user={user}
            />

            {selectedPrediction && (
                <Suspense fallback={null}>
                    <CommentsBottomSheet
                        prediction={selectedPrediction}
                        onClose={() => setSelectedPrediction(null)}
                    />
                </Suspense>
            )}
        </div>
    );
}