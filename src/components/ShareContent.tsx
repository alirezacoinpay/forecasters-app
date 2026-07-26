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

    const handleTelegramShare = () => {
        const shareUrl = `https://t.me/forecasters_top_bot/app?startapp=prediction_${predictionId}`;

        const text = encodeURIComponent(
            `🔥 I found an interesting prediction on Forecasters!

                        Think you know what will happen next?
                        
                        Cast your prediction, compare it with thousands of others, and see who's right when the outcome is revealed.
                        
                        👇 Join the prediction`
        );

        const url = encodeURIComponent(shareUrl);

        if (window.Telegram?.WebApp) {
            window.open(
                `https://t.me/share/url?url=${url}&text=${text}`,
                '_blank'
            );
            return;
        }

        // Browser fallback
        window.open(
            `https://t.me/share/url?url=${url}&text=${text}`,
            '_blank'
        );
    };

    return (
        <div className="space-y-2">
            {/* Share Link Section */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('ui.labels.postLink')}</label>
                <div className="flex gap-2">
                    <Input
                        value={shareUrl}
                        readOnly
                        className="bg-gray-50"
                        dir="ltr"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="shrink-0"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </div>


            {/* Social Media Options */}
            <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">{t('ui.labels.shareSocial')}</p>
                <div className="grid grid-cols-4 gap-3">
                    <button
                        onClick={handleTelegramShare}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#229ED9]/10 flex items-center justify-center">
                            <Send className="w-5 h-5 text-[#229ED9]" />
                        </div>
                        <span className="text-xs">Telegram</span>
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

