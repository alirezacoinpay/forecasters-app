import { useState } from 'react';
import {X, Image as ImageIcon, SendIcon, Loader2} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { commentService } from '../services/commentService.service';
import { useTranslation } from '../hooks/useTranslation';
import {Input} from "./ui/input.tsx";

interface CommentInputProps {
  predictionId: number;
  parentId?: number;
  onCommentAdded?: () => void;
  variant?: 'sheet' | 'inline';
  className?: string;
  'data-testid'?: string;
}

export function CommentInput({
  predictionId,
  parentId,
  onCommentAdded,
  variant = 'sheet',
  className = '',
}: CommentInputProps) {
  const t = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasText = commentText.trim().length > 0;

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await commentService.addComment({
        prediction_id: predictionId,
        text: commentText,
        file: selectedFile || undefined,
        parent_id: parentId,
      });
      setCommentText('');
      setSelectedFile(null);
      onCommentAdded?.();
    } catch (error: any) {
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
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('errors.fileSize'), { duration: 3000 });
      return;
    }
    setSelectedFile(file);
  };

  const isSheet = variant === 'sheet';

  return (
    <div
      className={`${isSheet ? 'space-y-2' : 'bg-gray-50 rounded-lg p-4 space-y-3 border border-border'} ${className}`}
      data-main-comment-box={isSheet ? true : undefined}
      dir="rtl"
    >
      <div className={`flex items-end gap-2 ${isSheet ? '' : 'flex-col'}`}>

          {hasText && (
              <Button
                  variant='ghost'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={` text-gray-500 shrink-0 ${isSheet ? 'px-4' : ''}`}
                  size="sm"
              >
                  {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                      <SendIcon className="h-4 w-4" />
                  )}
              </Button>
          )}
        <Input
          placeholder={t('ui.placeholders.enterComment')}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={`resize-none  text-xs font-400`}
          dir="ltr"
          onFocus={() => setSelectedFile(null)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
