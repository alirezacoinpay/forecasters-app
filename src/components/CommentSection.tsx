import { useState } from 'react';
import { Heart, MessageCircle, TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Comment } from '../data/mockData';

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

  const toggleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between border-b border-border">
        <h3 className="pb-3">نظرات کاربران</h3>
        <span className="text-xs text-muted-foreground">{comments.length} نظر</span>
      </div>
      
      {comments.map((comment) => {
        const isLiked = likedComments.has(comment.id);
        return (
          <div key={comment.id} className="space-y-3">
            {/* Comment Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Comment Content */}
            <p className="text-xs text-gray-700 leading-relaxed pr-10">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-6 pr-10">
              <button
                onClick={() => toggleLike(comment.id)}
                className="flex items-center gap-1 text-sm hover:text-[#FF6B35] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                <span className={`text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {formatCount(comment.likes + (isLiked ? 1 : 0))}
                </span>
              </button>
              
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#FF6B35] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>

              <span className="text-xs text-muted-foreground mr-auto">
                {formatCount(comment.replies)} پاسخ
              </span>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-100"></div>
          </div>
        );
      })}
    </div>
  );
}
