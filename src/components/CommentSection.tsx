import { useState, useEffect, useRef } from 'react';
import { Heart, TrendingUp, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { CommentInput } from './CommentInput';
import { Comment } from "../models/Comment.ts";
import { toast } from 'sonner';
import { commentService } from '../services/commentService.service';
import { useTranslation } from '../hooks/useTranslation';
import { Skeleton } from './ui/skeleton';

interface CommentSectionProps {
    comments: Comment[];
    predictionId?: number;
    onCommentAdded?: () => void;
    loading?: boolean;
    isLoadingMore?: boolean;
    sentinelRef?: React.RefObject<HTMLDivElement | null>;
}

export function CommentSection({
    comments,
    predictionId,
    onCommentAdded,
    loading = false,
    isLoadingMore = false,
    sentinelRef,
}: CommentSectionProps) {
    const t = useTranslation();
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const replyBoxRef = useRef<HTMLDivElement>(null);

    const formatCount = (count: number) => {
        if (count >= 1000) return `${Math.floor(count / 1000)}K`;
        return count.toString();
    };

    const toggleLike = async (commentId: number | string | undefined, currentLikes: number) => {
        if (!commentId) return;
        const commentIdStr = String(commentId);
        const wasLiked = likedComments.has(commentIdStr);
        const currentLikeCount = commentLikes[commentIdStr] ?? currentLikes;

        const newLikeCount = wasLiked ? currentLikeCount - 1 : currentLikeCount + 1;

        // Optimistic update
        setLikedComments((prev) => {
            const newSet = new Set(prev);
            wasLiked ? newSet.delete(commentIdStr) : newSet.add(commentIdStr);
            return newSet;
        });
        setCommentLikes((prev) => ({ ...prev, [commentIdStr]: newLikeCount }));

        try {
            const response = await commentService.likeComment(commentId);
            setCommentLikes((prev) => ({
                ...prev,
                [commentIdStr]: response.likesCount,
            }));
        } catch (error: any) {
            // Revert optimistic update
            setLikedComments((prev) => {
                const newSet = new Set(prev);
                wasLiked ? newSet.add(commentIdStr) : newSet.delete(commentIdStr);
                return newSet;
            });
            setCommentLikes((prev) => ({
                ...prev,
                [commentIdStr]: currentLikeCount,
            }));

            const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
            toast.error(t('errors.likeError'), { description: errorMessage, duration: 3000 });
        }
    };

    const getLikeCount = (commentId: string | number | undefined, defaultCount: number): number => {
        if (!commentId) return defaultCount;
        return commentLikes[String(commentId)] ?? defaultCount;
    };

    const closeReplyBox = () => {
        setReplyingTo(null);
        setReplyingToCommentId(null);
    };

    const handleReplyAdded = () => {
        closeReplyBox();
        onCommentAdded?.();
    };

    // Click outside to close reply box
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!replyingToCommentId) return;

            const target = event.target as HTMLElement;
            if (target.closest('button[data-reply-button]')) return;
            if (replyBoxRef.current?.contains(target)) return;
            if (document.querySelector('[data-main-comment-box]')?.contains(target)) return;

            closeReplyBox();
        };

        if (replyingToCommentId) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [replyingToCommentId]);

    const renderComment = (comment: Comment, isChild = false) => {
        const commentId = comment.id;
        const commentIdStr = String(commentId);
        const isLiked = comment.isLikedByMe || likedComments.has(commentIdStr);
        const likeCount = getLikeCount(commentId, comment.likesCount);

        const avatarSize = isChild ? 'w-6 h-6' : 'w-8 h-8';
        const textSize = isChild ? 'text-xs' : 'text-sm';
        const iconSize = isChild ? 'w-3 h-3' : 'w-4 h-4';

        return (
            <div key={commentId} className={`flex gap-3 ${isChild ? 'pl-4' : ''}`}>
                {/* Avatar */}
                <div className={`shrink-0 mt-0.5`}>
                    <div className={`${avatarSize} rounded-full bg-[#FF6B35] flex items-center justify-center`}>
                        <TrendingUp className={`${iconSize} text-white`} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
              <span className={`${textSize} font-medium truncate`}>
                {comment.user?.username || t('ui.anonymous')}
              </span>
                            <span className="text-xs text-muted-foreground">{comment.time_past}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-60 hover:opacity-100">
                            <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    {/* Comment Text - Now perfectly aligned under avatar */}
                    <p className={`${textSize} text-gray-700 leading-relaxed`}>
                        {comment.text}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => toggleLike(commentId, comment.likesCount)}
                            className="flex items-center gap-1.5 text-sm hover:text-[#FF6B35] transition-colors group"
                        >
                            <Heart
                                className={`${iconSize} transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground group-hover:text-red-500'}`}
                            />
                            <span className={`text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                {formatCount(likeCount)}
              </span>
                        </button>
                    </div>

                    {/* Reply Input */}
                    {replyingToCommentId === commentIdStr && predictionId && (
                        <div ref={replyBoxRef} className="mt-3">
                            <CommentInput
                                predictionId={predictionId}
                                parentId={replyingTo ?? undefined}
                                variant="inline"
                                onCommentAdded={handleReplyAdded}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderCommentSkeleton = (key: string) => (
        <div key={key} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {loading && comments.length === 0 && (
                <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, index) => renderCommentSkeleton(`comment-skeleton-${index}`))}
                </div>
            )}

            {!loading && comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                    {t('ui.emptyStates.noComments')}
                </p>
            )}

            {comments.map((comment) => renderComment(comment))}

            {sentinelRef && <div ref={sentinelRef} className="h-1" />}

            {isLoadingMore && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[#FF6B35]" />
                </div>
            )}
        </div>
    );
}