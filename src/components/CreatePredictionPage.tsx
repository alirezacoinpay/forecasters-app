import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, ChevronDown, Send, Link2, Image as ImageIcon, Video, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { predictionService } from '../services/predictionService.service';
import { tagService } from '../services/tagService.service';
import { Topic, Tag } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';
import { formatDateTime } from '../utils/format'

interface CreatePredictionPageProps {
  onClose: () => void;
  selectedTopicId?: number;
  topics: Topic[];
  onTopicChange?: (topicId: number) => void;
}

export function CreatePredictionPage({ onClose, selectedTopicId, topics, onTopicChange }: CreatePredictionPageProps) {
  const t = useTranslation();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<number | undefined>(selectedTopicId);
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  
  // Tag search states
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const tagSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  // Update current topic when selectedTopicId changes
  useEffect(() => {
    setCurrentTopicId(selectedTopicId);
  }, [selectedTopicId]);

  // Focus on title input when component mounts
  useEffect(() => {
    if (titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, []);

  const currentTopic = topics.find(t => t.id === currentTopicId);
  const handleTopicSelect = (topicId: number) => {
    setCurrentTopicId(topicId);
    setShowTopicDropdown(false);
    if (onTopicChange) {
      onTopicChange(topicId);
    }
  };

  // Handle tag search when user types #
  const handleTextChange = (value: string) => {
    setText(value);
    
    // Check if user is typing a hashtag
    const cursorPosition = textareaRef.current?.selectionStart || value.length;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');
    
    if (lastHashIndex !== -1) {
      // Check if there's a space or newline after the #
      const textAfterHash = textBeforeCursor.substring(lastHashIndex + 1);
      if (!textAfterHash.includes(' ') && !textAfterHash.includes('\n')) {
        const query = textAfterHash.trim();
        setTagSearchQuery(query);
        setShowTagSuggestions(true);
        
        // Debounce the search
        if (tagSearchTimeoutRef.current) {
          clearTimeout(tagSearchTimeoutRef.current);
        }
        
        tagSearchTimeoutRef.current = setTimeout(() => {
          searchTags(query);
        }, 300);
      } else {
        setShowTagSuggestions(false);
        setTagSuggestions([]);
      }
    } else {
      setShowTagSuggestions(false);
      setTagSuggestions([]);
    }
  };

  const searchTags = useCallback(async (query: string) => {
    setIsLoadingTags(true);
    try {
      // tagService.searchTags returns Tag[] directly (handles paginated response internally)
      const tags = await tagService.searchTags(query, 1, 3);
      setTagSuggestions(tags);
    } catch (error) {
      console.error('Error searching tags:', error);
      setTagSuggestions([]);
    } finally {
      setIsLoadingTags(false);
    }
  }, []);

  const selectTag = (tag: Tag) => {
    const cursorPosition = textareaRef.current?.selectionStart || text.length;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');
    
    if (lastHashIndex !== -1) {
      // Get text after the # symbol
      const textAfterHash = textBeforeCursor.substring(lastHashIndex + 1);
      const newText = text.substring(0, lastHashIndex) + `#${tag.title} ` + text.substring(cursorPosition);
      setText(newText);
      setSelectedTags(prev => {
        if (!prev.includes(tag.title)) {
          return [...prev, tag.title];
        }
        return prev;
      });
      setShowTagSuggestions(false);
      setTagSearchQuery('');
      
      // Focus back on textarea
      setTimeout(() => {
        textareaRef.current?.focus();
        const newCursorPos = lastHashIndex + tag.title.length + 2;
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const removeTag = (tagToRemove: string) => {
    // Remove the tag from text
    const updatedText = text.replace(new RegExp(`#${tagToRemove}\\b`, 'g'), '');
    setText(updatedText);
    setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Extract existing hashtags from text
  useEffect(() => {
    const hashtagRegex = /#([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9_]+)/g;
    const matches = text.matchAll(hashtagRegex);
    const extractedTags = Array.from(matches, match => match[1]);
    setSelectedTags(extractedTags);
  }, [text]);

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

  const getStartDate = (days: number): string => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return formatDateTime(date);
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error(t('errors.enterTitle'));
      return;
    }

    if (title.trim().length < 10) {
      toast.error(t('errors.titleMinLength'));
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error(t('errors.minOptions'));
      return;
    }

    if (!currentTopicId) {
      toast.error(t('errors.selectTopic'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('ui.buttons.publishing'));

    try {
      const selectedTopic = topics.find(t => t.id === currentTopicId);
      const startsAt = getStartDate(selectedDays);
      
      await predictionService.createPrediction({
        title: title.trim(),
        text: text.trim() || undefined,
        topic_id: currentTopicId,
        category_id: selectedTopic?.category_id,
        options: validOptions,
        tags: selectedTags,
        starts_at: startsAt,
      });

      toast.dismiss(loadingToast);
      toast.success(t('success.predictionPublished'));

      // Reset form
      setTitle('');
      setText('');
      setOptions(['', '']);
      setSelectedTags([]);
      setSelectedDays(1);

      // Close page
      setTimeout(() => {
        onClose();
        // Trigger feed refresh
        window.dispatchEvent(new Event('refresh-feed'));
      }, 500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(t('errors.publishPredictionError'), {
        description: error instanceof Error ? error.message : t('errors.tryAgain'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title.trim().length >= 10 && 
                   options.filter(opt => opt.trim()).length >= 2 && 
                   currentTopicId !== undefined;

  return (
    <div className="min-h-screen bg-background" dir="ltr">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
          <X className="w-5 h-5" />
        </Button>
        {/* 
          Post button is enabled when:
          - Title has at least 10 characters
          - At least 2 options are filled
          - A topic is selected
          
          When enabled, the icon turns orange (#FF6B35), otherwise it's gray/muted
        */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={canSubmit ? 'text-[#FF6B35]' : 'text-muted-foreground'}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Topic Selection - Not full width */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            className="flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
          >
            <span className="text-sm text-muted-foreground">
              {currentTopic ? currentTopic.title : t('ui.labels.topic')}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground ml-2 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showTopicDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTopicDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-[200px]">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      currentTopicId === topic.id ? 'bg-gray-100 text-[#FF6B35]' : ''
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title Input - No background */}
        <Textarea
          ref={titleInputRef}
          placeholder={t('ui.placeholders.enterTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-h-[60px] resize-none text-lg font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground bg-transparent"
        />

          {/* Tags Display - Right under body input, smaller, vertical */}
          {selectedTags.length > 0 && (
            <div className="flex gap-1.5">
              {selectedTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/20 cursor-pointer text-xs py-0.5 px-2"
                  onClick={() => removeTag(tag)}
                >
                  #{tag}
                  <X className="w-2.5 h-2.5 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        {/* Body Text Input - No background */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder={t('ui.placeholders.enterDescription')}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowTagSuggestions(false);
              }
            }}
            className="min-h-[80px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-muted-foreground placeholder:text-muted-foreground bg-transparent"
          />
          
          {/* Tag Suggestions - Small vertical tags */}
          {showTagSuggestions && tagSuggestions.length > 0 && (
            <div className="absolute top-full right-0 mt-1 z-50 flex flex gap-1 bg-gray-100 rounded-lg p-2">
              {isLoadingTags ? (
                <div className="text-xs text-muted-foreground px-1">{t('ui.loading.loading')}</div>
              ) : (
                tagSuggestions.map((tag) => (
                  <Badge
                    key={tag.id}
                    onClick={() => selectTag(tag)}
                    className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/20 cursor-pointer text-xs py-0.5 px-2"
                    style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, borderColor: tag.color ? `${tag.color}40` : undefined, color: tag.color || '#FF6B35' }}
                  >
                    {tag.title}
                  </Badge>
                ))
              )}
            </div>
          )}
        </div>

        

        {/* Poll Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="relative">
            <button
              onClick={() => setShowDaysDropdown(!showDaysDropdown)}
              className="w-full flex items-center justify-between text-sm text-muted-foreground"
            >
              <span>Predictions starts now</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDaysDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDaysDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDaysDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg">
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        setSelectedDays(days);
                        setShowDaysDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        selectedDays === days ? 'bg-gray-100 text-[#FF6B35]' : ''
                      }`}
                    >
                      {days} {t('ui.labels.days')}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={t('ui.placeholders.enterOption')}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 bg-background"
                />
                {index >= 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="shrink-0 text-muted-foreground h-8 w-8"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 5 && (
              <button
                onClick={addOption}
                className="w-full flex items-center gap-2 text-[#FF6B35] text-sm py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" />
                <span>Add poll option</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Commented out for now */}
      {/* 
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-background border-t border-border px-4 py-2 flex items-center justify-around">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Link2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <ImageIcon className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="h-16"></div>
      */}
    </div>
  );
}
