import { useState, useEffect, useRef } from 'react';
import { X, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/authService.service';

interface MobileVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMobile?: string;
  isVerified?: boolean;
  onVerified: () => void;
}

export function MobileVerificationModal({
  isOpen,
  onClose,
  currentMobile,
  isVerified,
  onVerified,
}: MobileVerificationModalProps) {
  const t = useTranslation();
  const [mobile, setMobile] = useState(currentMobile || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'mobile' | 'verify'>('mobile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMobile(currentMobile || '');
      setVerificationCode('');
      setStep(currentMobile ? 'verify' : 'mobile');
      setErrors({});
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentMobile]);

  const validateMobile = () => {
    if (!mobile.trim()) {
      setErrors({ mobile: t('errors.enterMobile') });
      return false;
    }
    // Basic mobile validation (can be enhanced)
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
      setErrors({ mobile: t('errors.invalidMobile') });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendCode = async () => {
    if (!validateMobile()) {
      return;
    }

    setIsSendingCode(true);
    const loadingToast = toast.loading(t('ui.buttons.sendingCode'));

    try {
      // Call backend to send verification SMS
      await authService.sendMobileVerificationCode(mobile);
      
      toast.dismiss(loadingToast);
      toast.success(t('success.verificationCodeSent'), {
        description: t('success.checkSMS'),
        duration: 3000,
      });
      setStep('verify');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error?.data?.message || error?.message || t('errors.tryAgain');
      toast.error(t('errors.sendCodeFailed'), {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setErrors({ code: t('errors.enterVerificationCode') });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('ui.buttons.verifying'));

    try {
      await authService.verifyMobile(mobile, verificationCode.trim());
      
      toast.dismiss(loadingToast);
      toast.success(t('success.mobileVerified'), {
        duration: 3000,
      });
      onVerified();
      onClose();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error?.data?.message || error?.message || t('errors.invalidVerificationCode');
      toast.error(t('errors.verificationFailed'), {
        description: errorMessage,
        duration: 3000,
      });
      setErrors({ code: errorMessage });
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
      aria-labelledby="mobile-verification-title"
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
          <h3 id="mobile-verification-title" className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {isVerified ? t('ui.labels.mobileVerified') : t('ui.labels.verifyMobile')}
          </h3>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isVerified ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg font-medium">{t('ui.labels.mobileVerified')}</p>
              <p className="text-sm text-muted-foreground">{mobile}</p>
            </div>
          ) : step === 'mobile' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm">{t('ui.labels.mobile')}</label>
                <Input
                  ref={inputRef}
                  type="tel"
                  placeholder={t('ui.placeholders.enterMobile')}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (errors.mobile) {
                      setErrors((prev) => ({ ...prev, mobile: '' }));
                    }
                  }}
                  className={errors.mobile ? 'border-destructive' : ''}
                  dir="ltr"
                  aria-invalid={!!errors.mobile}
                  disabled={isSendingCode}
                />
                {errors.mobile && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isSendingCode || !mobile.trim()}
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
              >
                {isSendingCode ? t('ui.buttons.sending') : t('ui.buttons.sendVerificationCode')}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm">{t('ui.labels.verificationCode')}</label>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={t('ui.placeholders.enterVerificationCode')}
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    if (errors.code) {
                      setErrors((prev) => ({ ...prev, code: '' }));
                    }
                  }}
                  className={errors.code ? 'border-destructive' : ''}
                  dir="ltr"
                  maxLength={6}
                  aria-invalid={!!errors.code}
                  disabled={isSubmitting}
                />
                {errors.code && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.code}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('ui.labels.verificationCodeSentTo')} {mobile}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('mobile')}
                  disabled={isSubmitting}
                  className="flex-1 rounded-full"
                >
                  {t('ui.buttons.changeMobile')}
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={isSubmitting || !verificationCode.trim()}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full py-6"
                >
                  {isSubmitting ? t('ui.buttons.verifying') : t('ui.buttons.verify')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

