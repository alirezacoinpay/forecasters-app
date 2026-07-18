import { useState, useEffect, useRef } from 'react';
import {
    X,
    Plus, ArrowLeft, TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { predictionService } from '../services/predictionService.service';
import { Topic } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';
import { useAutoAuth } from '../hooks/useAutoAuth';
import { formatDateTime } from '../utils/format'
import { useSwipeable } from 'react-swipeable';
import { motion, useAnimation } from "framer-motion";

interface CreatePredictionPageProps {
  onClose: () => void;
  selectedTopicId?: number;
  topics: Topic[];
  onTopicChange?: (topicId: number) => void;
}

export function CreatePredictionPage({ onClose, selectedTopicId, topics }: CreatePredictionPageProps) {
  const t = useTranslation();
  const { user } = useAutoAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<number | undefined>(selectedTopicId);
  const [selectedDays, setSelectedDays] = useState<number>(1);

  const titleInputRef = useRef<HTMLTextAreaElement>(null);

    const swipeHandlers = useSwipeable({
        onSwipedRight: () => {
            if (!isSubmitting) {
                onClose();
            }
        },
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: false,
        delta: 50, // minimum swipe distance
    });
    const controls = useAnimation();

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

    setIsSubmitting(true);

    try {
      const selectedTopic = topics.find(t => t.id === currentTopicId);
      const startsAt = getStartDate(selectedDays);
      
      await predictionService.createPrediction({
        title: title.trim(),
        text: text.trim() || undefined,
        category_id: selectedTopic?.category_id,
        options: options,
        tags: selectedTags,
        starts_at: startsAt,
      });


      // Reset form
      setTitle('');
      setText('');
      setOptions(['', '']);
      setSelectedTags([]);
      setSelectedDays(1);

      // Close page and trigger feed refresh
      onClose();
      window.dispatchEvent(new Event('refresh-feed'));
    } catch (error) {

    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title.trim().length >= 5 &&
                   options.filter(opt => opt.trim()).length >= 2;

  return (
      <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          animate={controls}
          onDragEnd={async (_, info) => {
              if (info.offset.x > 120) {
                  await controls.start({
                      x: window.innerWidth,
                      transition: { duration: 0.2 },
                  });

                  onClose();
              } else {
                  controls.start({
                      x: 0,
                      transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                      },
                  });
              }
          }}
      >
      <div
          {...swipeHandlers}
          className="min-h-screen bg-background"
          dir="ltr"
      >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-2 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button 
          variant="default"
          size="icon"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`px-8 rounded-full ${
              canSubmit
                  ? 'bg-[#FF6B35] hover:bg-[#e85f2f] text-white'
                  : 'bg-muted text-muted-foreground'
          }`}
        >
            <span>{t('ui.buttons.post')}</span>
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 ">

          <div className="flex self-center gap-2">
              {user?.avatar ? (
                  <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                  />
              ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                  </div>
              )}
              {/* Title Input - No background */}
              <div className="mt-1 w-full">
                  <Textarea
                      ref={titleInputRef}
                      placeholder={t('ui.placeholders.enterTitle')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="min-h-[60px] resize-none text-md font-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground bg-transparent"
                  />
              </div>
          </div>


        {/* Poll Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                    placeholder={
                        index === 0
                            ? t('ui.placeholders.choice1')
                            : t('ui.placeholders.choice2')
                    }
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
   </motion.div>
  );
}
