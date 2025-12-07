import { useState, useEffect, useRef } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddQuestionModal({ isOpen, onClose }: AddQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ['سیاسی', 'اقتصادی', 'ورزشی', 'فرهنگی', 'اجتماعی'];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && questionInputRef.current) {
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!question.trim()) {
      newErrors.question = 'لطفاً سوال را وارد کنید';
    } else if (question.trim().length < 10) {
      newErrors.question = 'سوال باید حداقل ۱۰ کاراکتر باشد';
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'حداقل ۲ گزینه الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('لطفاً فرم را به درستی پر کنید');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('در حال انتشار سوال...');

    try {
      // TODO: Implement actual API call
      // await predictionService.createQuestion({ question, description, options, tags: selectedTags });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.dismiss(loadingToast);
      toast.success('سوال با موفقیت منتشر شد');

      // Reset form
      setQuestion('');
      setDescription('');
      setOptions(['', '', '']);
      setSelectedTags([]);
      setErrors({});

      // Close modal
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('خطا در انتشار سوال', {
        description: error instanceof Error ? error.message : 'لطفاً دوباره تلاش کنید',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-question-title"
    >
      <div 
        ref={modalRef}
        className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h3 id="add-question-title">سوال جدید</h3>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm">سوال پیش‌بینی</label>
            <Textarea
              ref={questionInputRef}
              placeholder="سوال خود را بنویسید..."
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors(prev => ({ ...prev, question: '' }));
                }
              }}
              className={`min-h-[80px] resize-none ${errors.question ? 'border-destructive' : ''}`}
              dir="rtl"
              aria-invalid={!!errors.question}
              aria-describedby={errors.question ? 'question-error' : undefined}
            />
            {errors.question && (
              <p id="question-error" className="text-xs text-destructive" role="alert">{errors.question}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">(توضیحات (اختیاری</label>
            <Textarea
              placeholder="توضیحات بیشتر..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] resize-none"
              dir="rtl"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">گزینه‌های پاسخ</label>
              {options.length < 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addOption}
                  className="gap-1 text-[#FF6B35]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">افزودن گزینه</span>
                </Button>
              )}
            </div>
            
            {errors.options && (
              <p className="text-xs text-destructive">{errors.options}</p>
            )}
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`گزینه ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    updateOption(index, e.target.value);
                    if (errors.options) {
                      setErrors(prev => ({ ...prev, options: '' }));
                    }
                  }}
                  className={errors.options ? 'border-destructive' : ''}
                  dir="rtl"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="shrink-0 text-destructive"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm flex items-center gap-2">
              <Tag className="w-4 h-4" />
              برچسب‌ها
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !question.trim() || !options.some(opt => opt.trim())}
            className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
          >
            {isSubmitting ? 'در حال انتشار...' : 'انتشار سوال'}
          </Button>
        </div>
      </div>
    </div>
  );
}
