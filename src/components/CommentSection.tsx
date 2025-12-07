import { useState } from 'react';
import { Heart, MessageCircle, TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import {Comment} from "../models/Comment.ts";
import { toast } from 'sonner';

interface CommentSectionProps {
  comments: Comment[];
}

export function CommentSection({ comments }: CommentSectionProps) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K`;
    }
    return count.toString();
  };

  const toggleLike = async (commentId: number | string | undefined, currentLikes: number) => {
    if (!commentId) return;
    
    const wasLiked = likedComments.has(String(commentId));
    const newLikedState = !wasLiked;
    
    // Optimistic update
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newLikedState) {
        newSet.add(String(commentId));
      } else {
        newSet.delete(String(commentId));
      }
      return newSet;
    });

    try {
      // TODO: Implement actual API call
      // await commentService.likeComment(commentId, newLikedState);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      // Revert optimistic update on error
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(String(commentId));
        } else {
          newSet.delete(String(commentId));
        }
        return newSet;
      });
      
      toast.error('خطا در ثبت لایک', {
        description: 'لطفاً دوباره تلاش کنید',
      });
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between border-b border-border">
        <h3 className="pb-3">نظرات کاربران</h3>
        <span className="text-xs text-muted-foreground">{comments.length} نظر</span>
      </div>
      
      {comments.map((comment, index) => {
        const commentId = comment.id ?? `${comment.user_id}_${comment.question_id}_${index}`;
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
                  {formatCount(comment.likesCount + (isLiked ? 1 : 0))}
                </span>
              </button>
              
              {comment.isRoot() && (
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}

              {comment.childrenCount > 0 && (
                <span className="text-xs text-muted-foreground mr-auto">
                  {formatCount(comment.childrenCount)} پاسخ
                </span>
              )}
            </div>

            {/* Nested Comments */}
            {comment.children && comment.children.length > 0 && (
              <div className="pr-8 mt-3 space-y-3 border-r-2 border-gray-200">
                {comment.children.map((child, childIndex) => {
                  const childId = child.id ?? `${child.user_id}_${child.question_id}_${index}_${childIndex}`;
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
                            {formatCount(child.likesCount + (isChildLiked ? 1 : 0))}
                          </span>
                        </button>
                      </div>
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
