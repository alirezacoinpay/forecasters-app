import { useState } from 'react';
import { X, Send, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
}

export function ShareModal({ isOpen, onClose, predictionId }: ShareModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const shareUrl = `https://example.com/prediction/${predictionId}`;

  const handleSend = () => {
    if (phoneNumber.trim()) {
      // Handle sending to phone number
      console.log('Sending to:', phoneNumber);
      alert(`ارسال به شماره: ${phoneNumber}`);
      setPhoneNumber('');
      onClose();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('لینک کپی شد!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-2xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h3>اشتراک‌گذاری</h3>
        </div>

        {/* Share Link Section */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">لینک پست</label>
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
          <label className="text-sm text-muted-foreground">ارسال به شماره موبایل</label>
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
            پست به صورت پیامک به شماره وارد شده ارسال می‌شود
          </p>
        </div>

        {/* Social Media Options */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-3">اشتراک‌گذاری در شبکه‌های اجتماعی</p>
          <div className="grid grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs">تلگرام</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs">واتساپ</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs">توییتر</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs">سایر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
