import { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
  currentEmail?: string;
  currentMobile?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  onSave: (data: { name?: string; email?: string; mobile?: string }) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentEmail,
  currentMobile,
  emailVerified,
  mobileVerified,
  onSave,
}: EditProfileModalProps) {
  const t = useTranslation();
  const [username, setUsername] = useState(currentUsername || '');
  const [email, setEmail] = useState(currentEmail || '');
  const [mobile, setMobile] = useState(currentMobile || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername(currentUsername || '');
      setEmail(currentEmail || '');
      setMobile(currentMobile || '');
      setErrors({});
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentUsername, currentEmail, currentMobile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = t('errors.enterUsername');
    } else if (username.trim().length < 3) {
      newErrors.username = t('errors.usernameMinLength');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (mobile && !/^\+?[1-9]\d{1,14}$/.test(mobile.replace(/\s/g, ''))) {
      newErrors.mobile = t('errors.invalidMobile');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t('errors.formInvalid'), {
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('ui.buttons.updating'));

    try {
      await onSave({
        name: username.trim() !== currentUsername ? username.trim() : undefined,
        email: email.trim() !== currentEmail ? email.trim() : undefined,
        mobile: mobile.trim() !== currentMobile ? mobile.trim() : undefined,
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
          <h3 id="edit-profile-title">{t('ui.labels.editProfile')}</h3>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm">{t('ui.labels.username')}</label>
            <Input
              ref={inputRef}
              placeholder={t('ui.placeholders.enterUsername')}
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
            <label className="text-sm flex items-center gap-2">
              {t('ui.labels.emailOptional')}
              {emailVerified && email && (
                <CheckCircle2 className="w-4 h-4 text-green-500" title={t('ui.labels.verified')} />
              )}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={t('ui.placeholders.enterEmail')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                className={`${errors.email ? 'border-destructive' : ''} ${email ? 'pr-10' : ''}`}
                dir="ltr"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Mobile Input */}
          <div className="space-y-2">
            <label className="text-sm flex items-center gap-2">
              {t('ui.labels.mobileOptional')}
              {mobileVerified && mobile && (
                <CheckCircle2 className="w-4 h-4 text-green-500" title={t('ui.labels.verified')} />
              )}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder={t('ui.placeholders.enterMobile')}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (errors.mobile) {
                    setErrors((prev) => ({ ...prev, mobile: '' }));
                  }
                }}
                className={`${errors.mobile ? 'border-destructive' : ''} ${mobile ? 'pr-10' : ''}`}
                dir="ltr"
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                disabled={isSubmitting}
              />
            </div>
            {errors.mobile && (
              <p id="mobile-error" className="text-xs text-destructive" role="alert">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !username.trim()}
            className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
          >
            {isSubmitting ? t('ui.buttons.saving') : t('ui.buttons.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
