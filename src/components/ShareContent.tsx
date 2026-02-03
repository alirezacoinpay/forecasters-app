import { useState } from 'react';
import { Send, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { shareService } from '../services/shareService.service';
import { useTranslation } from '../hooks/useTranslation';

interface ShareContentProps {
    predictionId: number;
    onClose?: () => void;
}

export function ShareContent({ predictionId, onClose }: ShareContentProps) {
    const t = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const shareUrl = `https://example.com/prediction/${predictionId}`;

    const handleSend = async () => {
        if (!phoneNumber.trim()) {
            return;
        }

        try {
            await shareService.sendSms({
                prediction_id: predictionId,
                mobile: phoneNumber.trim(),
            });
            
            toast.success(t('success.sentToPhone', { phoneNumber }), {
                duration: 2000,
            });
            setPhoneNumber('');
            if (onClose) {
                setTimeout(() => {
                    onClose();
                }, 500);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || t('errors.smsError');
            toast.error(errorMessage, {
                duration: 3000,
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success(t('success.linkCopied'), {
            duration: 2000,
        });
    };

    return (
        <div className="space-y-4">
            {/* Share Link Section */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('ui.labels.postLink')}</label>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="shrink-0"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Input
                        value={shareUrl}
                        readOnly
                        className="bg-gray-50"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Phone Number Section */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('ui.labels.sendToMobile')}</label>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSend}
                        disabled={!phoneNumber.trim()}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white shrink-0"
                        size="icon"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                    <Input
                        placeholder="09123456789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        dir="ltr"
                        type="tel"
                        maxLength={11}
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('ui.labels.smsDescription')}
                </p>
            </div>

            {/* Social Media Options */}
            <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">{t('ui.labels.shareSocial')}</p>
                <div className="grid grid-cols-4 gap-3">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs">{t('ui.labels.telegram')}</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs">{t('ui.labels.whatsapp')}</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs">{t('ui.labels.twitter')}</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-xs">{t('ui.labels.other')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

