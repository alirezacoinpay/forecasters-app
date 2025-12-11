import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
  currentEmail?: string;
  onSave: (data: { name?: string; email?: string }) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentEmail,
  onSave,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername || '');
  const [email, setEmail] = useState(currentEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername(currentUsername || '');
      setEmail(currentEmail || '');
      setErrors({});
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentUsername, currentEmail]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'لطفاً نام کاربری را وارد کنید';
    } else if (username.trim().length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('لطفاً فرم را به درستی پر کنید', {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('در حال به‌روزرسانی...');

    try {
      await onSave({
        name: username.trim() !== currentUsername ? username.trim() : undefined,
        email: email.trim() !== currentEmail ? email.trim() : undefined,
      });

      toast.dismiss(loadingToast);
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      // Error is already handled in onSave
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        ref={modalRef}
        className="bg-background rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h3 id="edit-profile-title">ویرایش پروفایل</h3>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm">نام کاربری</label>
            <Input
              ref={inputRef}
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: '' }));
                }
              }}
              className={errors.username ? 'border-destructive' : ''}
              dir="rtl"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p id="username-error" className="text-xs text-destructive" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm">ایمیل (اختیاری)</label>
            <Input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              className={errors.email ? 'border-destructive' : ''}
              dir="rtl"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !username.trim()}
            className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
          >
            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>
    </div>
  );
}
