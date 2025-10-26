import { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

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

  const handleSubmit = () => {
    if (question.trim() && options.every(opt => opt.trim())) {
      console.log('Submitted:', { question, description, options, selectedTags });
      // Handle submission
      onClose();
      // Reset form
      setQuestion('');
      setDescription('');
      setOptions(['', '', '']);
      setSelectedTags([]);
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h3>سوال جدید</h3>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm">سوال پیش‌بینی</label>
            <Textarea
              placeholder="سوال خود را بنویسید..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
              dir="rtl"
            />
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
            
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`گزینه ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  dir="rtl"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="shrink-0 text-destructive"
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
            disabled={!question.trim() || !options.every(opt => opt.trim())}
            className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
          >
            انتشار سوال
          </Button>
        </div>
      </div>
    </div>
  );
}
