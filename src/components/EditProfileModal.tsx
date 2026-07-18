import { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
  currentAvatar?: string;
  onSave: (data: { name?: string; email?: string; mobile?: string; avatar?: File }) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentAvatar,
  onSave,
}: EditProfileModalProps) {
  const t = useTranslation();
  const [username, setUsername] = useState(currentUsername || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername(currentUsername || '');
      setAvatarFile(null);
      setAvatarPreview(currentAvatar || null);
      setErrors({});
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentUsername, currentAvatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('errors.invalidImage'));
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = t('errors.enterUsername');
    } else if (username.trim().length < 3) {
      newErrors.username = t('errors.usernameMinLength');
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
        avatar: avatarFile || undefined,
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
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center overflow-hidden shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <TrendingUp className="w-10 h-10 text-white" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Camera className="w-4 h-4 mr-1" />
              {t('ui.labels.changeAvatar')}
            </Button>
          </div>

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
