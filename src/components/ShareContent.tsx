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
    const appUrl = import.meta.env.VITE_APP_URL.replace(/\/$/, '');

    const shareUrl = `${appUrl}?prediction=${predictionId}`;

    const shareDisplayUrl = `${appUrl.replace(/^https?:\/\//, '')}?prediction=${predictionId}`;


    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success(t('success.linkCopied'), {
            duration: 2000,
        });
    };
    const handleTelegramShare = () => {
        // Official Telegram Mini App startapp parameter
        const directLink = `https://t.me/forecasters_top_bot/feed?startapp=prediction_${predictionId}`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(directLink)}`;

        if (window.Telegram?.WebApp?.openTelegramLink) {
            window.Telegram.WebApp.openTelegramLink(shareUrl);
            return;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };


    return (
        <div className="space-y-2">
            {/* Share Link Section */}
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('ui.labels.postLink')}</label>
                <div className="flex gap-2">
                    <Input
                        value={shareDisplayUrl}
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
                </div>
            </div>
        </div>
    );
}

