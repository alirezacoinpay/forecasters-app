import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { CommentInput } from './CommentInput';
import {Comment} from "../models/Comment.ts";
import { toast } from 'sonner';
import { commentService } from '../services/commentService.service';
import { useTranslation } from '../hooks/useTranslation';

interface CommentSectionProps {
  comments: Comment[];
  predictionId?: number;
  onCommentAdded?: () => void;
}

export function CommentSection({ comments, predictionId, onCommentAdded }: CommentSectionProps) {
  const t = useTranslation();
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const replyBoxRef = useRef<HTMLDivElement>(null);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K`;
    }
    return count.toString();
  };

  const toggleLike = async (commentId: number | string | undefined, currentLikes: number) => {
    if (!commentId) return;
    const commentIdStr = String(commentId);
    const wasLiked = likedComments.has(commentIdStr);
    const currentLikeCount = commentLikes[commentIdStr] ?? currentLikes;
    
    const newLikeCount = wasLiked ? currentLikeCount - 1 : currentLikeCount + 1;
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(commentIdStr);
      } else {
        newSet.add(commentIdStr);
      }
      return newSet;
    });
    setCommentLikes((prev) => ({
      ...prev,
      [commentIdStr]: newLikeCount,
    }));

    try {
      const response = await commentService.likeComment(commentId);
      
      setCommentLikes((prev) => ({
        ...prev,
        [commentIdStr]: response.likesCount,
      }));

    } catch (error: any) {
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(commentIdStr);
        } else {
          newSet.delete(commentIdStr);
        }
        return newSet;
      });
      setCommentLikes((prev) => ({
        ...prev,
        [commentIdStr]: currentLikeCount,
      }));
      
      const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
      toast.error(t('errors.likeError'), {
        description: errorMessage,
        duration: 3000,
      });
    }
  };

  const getLikeCount = (commentId: string | number | undefined, defaultCount: number): number => {
    if (!commentId) return defaultCount;
    const commentIdStr = String(commentId);
    return commentLikes[commentIdStr] ?? defaultCount;
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReplyClick = (commentId: string, commentDbId: number) => {
    if (replyingToCommentId === commentId) {
      closeReplyBox();
    } else {
      setReplyingTo(commentDbId);
      setReplyingToCommentId(commentId);
    }
  };

  const closeReplyBox = () => {
    setReplyingTo(null);
    setReplyingToCommentId(null);
  };

  const handleReplyAdded = () => {
    closeReplyBox();
    onCommentAdded?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!replyingToCommentId) return;

      const target = event.target as HTMLElement;
      
      const isReplyButton = target.closest('button[data-reply-button]');
      if (isReplyButton) return;

      if (replyBoxRef.current && replyBoxRef.current.contains(target)) {
        return;
      }

      const mainCommentBox = document.querySelector('[data-main-comment-box]');
      if (mainCommentBox && mainCommentBox.contains(target)) {
        return;
      }

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

  return (
    <div className="space-y-4">
      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t('ui.emptyStates.noComments')}
        </p>
      )}

      {comments.map((comment, index) => {
        const commentId = comment.id;
        const isLiked = comment.isLikedByMe
        return (
          <div key={commentId} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{comment.user?.username || t('ui.anonymous')}</span>
                    <span className="text-xs text-muted-foreground">{comment.time_past}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed pr-10">
              {comment.text}
            </p>

            <div className="flex items-center gap-6 pr-10">
              <button
                onClick={() => toggleLike(commentId, comment.likesCount)}
                className="flex items-center gap-1 text-sm hover:text-[#FF6B35] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                <span className={`text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {formatCount(getLikeCount(commentId, comment.likesCount))}
                </span>
              </button>
              
              {comment.isRoot() && predictionId && (
                <button
                  data-reply-button
                  onClick={() => handleReplyClick(String(commentId), comment.id || 0)}
                  className={`flex items-center text-sm transition-colors ${
                    replyingToCommentId === String(commentId)
                      ? 'text-[#FF6B35]'
                      : 'text-muted-foreground hover:text-[#FF6B35]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}

              {comment.childrenCount > 0 && (
                <button
                  onClick={() => toggleReplies(String(commentId))}
                  className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors mr-auto"
                >
                  {formatCount(comment.childrenCount)} پاسخ
                </button>
              )}
            </div>

            {replyingToCommentId === String(commentId) && predictionId && (
              <div ref={replyBoxRef} className="pr-8 mt-2">
                <CommentInput
                  predictionId={predictionId}
                  parentId={replyingTo ?? undefined}
                  variant="inline"
                  onCommentAdded={handleReplyAdded}
                />
              </div>
            )}

            {comment.childrenCount > 0 && expandedReplies.has(String(commentId)) && comment.children && comment.children.length > 0 && (
              <div className="pr-8 mt-3 space-y-3 border-r-2 border-gray-200">
                {comment.children.map((child, childIndex) => {
                  const childId = child.id ?? `${child.user_id}_${child.prediction_id}_${index}_${childIndex}`;
                  const isChildLiked = likedComments.has(String(childId));
                  return (
                    <div key={childId} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                            <TrendingUp className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs truncate">{child.user?.username || t('ui.anonymous')}</span>
                              <span className="text-xs text-muted-foreground">{child.time_past}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed pr-8">
                        {child.text}
                      </p>
                      <div className="flex items-center gap-4 pr-8">
                        <button
                          onClick={() => toggleLike(childId, child.likesCount)}
                          className="flex items-center gap-1 text-xs hover:text-[#FF6B35] transition-colors"
                        >
                          <Heart
                            className={`w-3 h-3 ${isChildLiked ? 'fill-red-500 text-red-500' : ''}`}
                          />
                          <span className={isChildLiked ? 'text-red-500' : 'text-muted-foreground'}>
                            {formatCount(getLikeCount(childId, child.likesCount))}
                          </span>
                        </button>
                        {predictionId && (
                          <button
                            data-reply-button
                            onClick={() => handleReplyClick(String(childId), child.id || 0)}
                            className={`flex items-center text-xs transition-colors ${
                              replyingToCommentId === String(childId)
                                ? 'text-[#FF6B35]'
                                : 'text-muted-foreground hover:text-[#FF6B35]'
                            }`}
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {replyingToCommentId === String(childId) && predictionId && (
                        <div ref={replyBoxRef} className="pr-4 mt-2">
                          <CommentInput
                            predictionId={predictionId}
                            parentId={replyingTo ?? undefined}
                            variant="inline"
                            onCommentAdded={handleReplyAdded}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-b border-gray-100"></div>
          </div>
        );
      })}
    </div>
  );
}
