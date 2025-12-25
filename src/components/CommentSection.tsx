import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, TrendingUp, MoreVertical, Send, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {Comment} from "../models/Comment.ts";
import { toast } from 'sonner';
import { commentService } from '../services/commentService.service';
import { activityService } from '../services/activityService.service';
import { Comment as ApiComment } from '../types/api';
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
  const [commentText, setCommentText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComments, setNewComments] = useState<Comment[]>([]);
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
    
    // Optimistic update
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
      
      // Update with actual response
      setCommentLikes((prev) => ({
        ...prev,
        [commentIdStr]: response.likesCount,
      }));
      
      // Log activity
      await activityService.logActivity('comment_like', {
        comment_id: commentId,
        liked: response.liked,
      });
    } catch (error: any) {
      // Revert optimistic update on error
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

  const handleAddComment = async () => {
    if (!predictionId) {
      toast.error(t('errors.addCommentError'), {
        description: t('errors.predictionIdNotFound'),
        duration: 3000,
      });
      return;
    }

    if (!commentText.trim()) {
      toast.error(t('errors.enterComment'), {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('ui.loading.loading'));

    try {
      const newComment = await commentService.addComment({
        prediction_id: predictionId,
        text: commentText,
        file: selectedFile || undefined,
        parent_id: replyingTo || undefined,
      });

      // Log activity
      await activityService.logActivity('comment_add', {
        prediction_id: predictionId,
        comment_id: newComment.id,
        parent_id: replyingTo,
      });

      toast.dismiss(loadingToast);
      toast.success(t('success.commentSubmitted'), {
        duration: 2000,
      });

      // Add to local state
      if (replyingTo) {
        // If replying, we'd need to update the parent comment's children
        // For now, just refresh (callback will be called below)
      } else {
        // Add as new root comment - convert API Comment to model Comment
        const modelComment = new Comment(newComment as any);
        setNewComments((prev) => [modelComment, ...prev]);
      }

      // Reset form
      setCommentText('');
      setSelectedFile(null);
      setReplyingTo(null);
      setReplyingToCommentId(null);

      // Refresh if callback provided (called once for both replies and root comments)
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
      toast.error(t('errors.submitCommentError'), {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('errors.fileSize'), {
          duration: 3000,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const allComments = [...newComments, ...comments];

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
    // Toggle: if already replying to this comment, close it
    if (replyingToCommentId === commentId) {
      setReplyingTo(null);
      setReplyingToCommentId(null);
      setCommentText('');
      setSelectedFile(null);
    } else {
      // Open reply box for this comment
      setReplyingTo(commentDbId);
      setReplyingToCommentId(commentId);
      setCommentText('');
      setSelectedFile(null);
    }
  };

  const closeReplyBox = () => {
    setReplyingTo(null);
    setReplyingToCommentId(null);
    setCommentText('');
    setSelectedFile(null);
  };

  // Handle click outside to close reply box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!replyingToCommentId) return;

      const target = event.target as HTMLElement;
      
      // Check if click is on a reply button - don't close in this case
      const isReplyButton = target.closest('button[data-reply-button]');
      if (isReplyButton) return;

      // Check if click is inside the reply box
      if (replyBoxRef.current && replyBoxRef.current.contains(target)) {
        return;
      }

      // Check if click is inside the main comment box (at bottom)
      const mainCommentBox = document.querySelector('[data-main-comment-box]');
      if (mainCommentBox && mainCommentBox.contains(target)) {
        return;
      }

      // Click is outside - close the reply box
      closeReplyBox();
    };

    if (replyingToCommentId) {
      // Add event listener with a small delay to avoid immediate closure when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [replyingToCommentId]);

  const renderCommentBox = (parentCommentId?: string) => {
    const isReplying = replyingToCommentId === parentCommentId;
    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-border">
        <Textarea
          placeholder={isReplying ? t('ui.placeholders.enterComment') : t('ui.placeholders.enterComment')}
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
            // If typing in main box while replying, clear reply state
            if (!parentCommentId && replyingTo) {
              setReplyingTo(null);
              setReplyingToCommentId(null);
            }
          }}
          className="min-h-[80px] resize-none"
          dir="rtl"
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="flex items-center text-muted-foreground cursor-pointer hover:text-[#FF6B35] transition-colors">
              <ImageIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
            {selectedFile && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {selectedFile.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </span>
            )}
          </div>
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || isSubmitting}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
            size="sm"
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between border-b border-border">
        <h3 className="pb-3">نظرات کاربران</h3>
        <span className="text-xs text-muted-foreground">{allComments.length} نظر</span>
      </div>

      {/* Always visible comment box at bottom for new comments */}
      {predictionId && (
        <div className="mb-4" data-main-comment-box>
          {renderCommentBox()}
        </div>
      )}
      
      {allComments.map((comment, index) => {
        const commentId = comment.id ?? `${comment.user_id}_${comment.prediction_id}_${index}`;
        const isLiked = likedComments.has(String(commentId));
        return (
          <div key={commentId} className="space-y-3">
            {/* Comment Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{comment.user?.username || 'ناشناس'}</span>
                    <span className="text-xs text-muted-foreground">{comment.time_past}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Comment Content */}
            <p className="text-xs text-gray-700 leading-relaxed pr-10">
              {comment.text}
            </p>

            {/* Comment Actions */}
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

            {/* Reply Comment Box - appears under the comment being replied to */}
            {replyingToCommentId === String(commentId) && predictionId && (
              <div ref={replyBoxRef} className="pr-8 mt-2">
                {renderCommentBox(String(commentId))}
              </div>
            )}

            {/* Expandable Nested Comments */}
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
                              <span className="text-xs truncate">{child.user?.username || 'ناشناس'}</span>
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
                      
                      {/* Reply box for nested comments */}
                      {replyingToCommentId === String(childId) && predictionId && (
                        <div ref={replyBoxRef} className="pr-4 mt-2">
                          {renderCommentBox(String(childId))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            <div className="border-b border-gray-100"></div>
          </div>
        );
      })}
    </div>
  );
}
