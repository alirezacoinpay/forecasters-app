export interface PredictionOption {
  id: string;
  text: string;
  percentage: number;
  voters: number;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  avatar?: string;
}

export interface Prediction {
  id: string;
  author: string;
  timestamp: string;
  question: string;
  description?: string;
  detailedDescription?: string;
  category: string;
  tags: Tag[];
  options: PredictionOption[];
  commentsCount: number;
  sharesCount: number;
  comments?: Comment[];
}

export interface Category {
  id: string;
  label: string;
}

export const categories: Category[] = [
  { id: 'political', label: 'سیاسی' },
  { id: 'economic', label: 'اقتصادی' },
  { id: 'sports', label: 'ورزشی' },
  { id: 'cultural', label: 'فرهنگی' },
  { id: 'social', label: 'اجتماعی' },
];

export const mockTags: Tag[] = [
  { id: '1', label: 'سیاسی' },
  { id: '2', label: 'اقتصادی' },
  { id: '3', label: 'ورزشی' },
];

export const mockPredictions: Prediction[] = [
  {
    id: '1',
    author: 'forecasters',
    timestamp: '1h',
    category: 'political',
    question: 'یه مینی سریال خوش ساخت  ۸ قسمته با ژانر جنایی درام که بر اساس واقعیت ساخته شده \n' +
        'پیشنهاد میکنم ببینید',
    description: 'این سوال با نسبت ظرفیت محاسباتی یک سازمان با بیشترین ظرفیت محاسباتی به سرمایش کل ظرفیت محاسباتی در تمام سازمان‌ها حل خواهد شد. ظرفیت محاسباتی با تبدیل معادل کل محاسبات استاندارد شده‌در گزارش نیمه سالانه به رایانه‌های معادل مقیاس درخواست محاسبه می‌شود، سپس جمع کردن این معادل‌ها برای به دست آوردن صورت (ارگینزیشن سازمان) و مخرج (همه سازمان‌ها) تعیین می‌شود.',
    detailedDescription: 'این سوال با نسبت ظرفیت محاسباتی یک سازمان با بیشترین ظرفیت محاسباتی به سرمایش کل ظرفیت محاسباتی در تمام سازمان‌ها حل خواهد شد. ظرفیت محاسباتی با تبدیل معادل کل محاسبات استاندارد شده‌در گزارش نیمه سالانه به رایانه‌های معادل مقیاس درخواست محاسبه می‌شود، سپس جمع کردن این معادل‌ها برای به دست آوردن صورت (ارگینزیشن سازمان) و مخرج (همه سازمان‌ها) تعیین می‌شود.',
    tags: [
      { id: '1', label: 'سیاسی' },
      { id: '2', label: 'اقتصادی' },
      { id: '3', label: 'ورزشی' },
    ],
    options: [
      { id: '1', text: 'کشور زدن 1', percentage: 67, voters: 25 },
      { id: '2', text: 'کشور زدن 2', percentage: 67, voters: 25 },
      { id: '3', text: 'کشور زدن 3', percentage: 67, voters: 25 },
      { id: '4', text: 'کشور زدن 4', percentage: 67, voters: 25 },
    ],
    commentsCount: 123000,
    sharesCount: 123000,
    comments: [
      {
        id: '1',
        author: 'forecasters',
        content: 'این سوال با نسبت ظرفیت محاسباتی یک سازمان با بیشترین ظرفیت محاسباتی به کل ظرفیت محاسباتی در تمام سازمان‌ها حل خواهد شد. ظرفیت محاسباتی با تبدیل معادل کل محاسبات استاندارد شده‌در گزارش نیمه سالانه به رایانه‌های معادل مقیاس درخواست محاسبه می‌شود، سپس جمع کردن این معادل‌ها برای به دست آوردن صورت (ارگینزیشن سازمان) و مخرج (همه سازمان‌ها) تعیین می‌شود.',
        likes: 412,
        replies: 22000,
        timestamp: '1h',
      },
      {
        id: '2',
        author: 'forecasters',
        content: 'این سوال با نسبت ظرفیت محاسباتی یک سازمان با بیشترین ظرفیت محاسباتی به کل ظرفیت محاسباتی در تمام سازمان‌ها حل خواهد شد. ظرفیت محاسباتی با تبدیل معادل کل محاسبات استاندارد شده‌در گزارش نیمه سالانه به رایانه‌های معادل مقیاس درخواست محاسبه می‌شود، سپس جمع کردن این معادل‌ها برای به دست آوردن صورت (ارگینزیشن سازمان) و مخرج (همه سازمان‌ها) تعیین می‌شود.',
        likes: 412,
        replies: 22000,
        timestamp: '1h',
      },
    ],
  },
  {
    id: '2',
    author: 'forecasters',
    timestamp: '2h',
    category: 'economic',
    question: 'قیمت طلا در سال آینده چه تغییری خواهد کرد؟',
    tags: [
      { id: '2', label: 'اقتصادی' },
    ],
    options: [
      { id: '1', text: 'افزایش بیش از 20%', percentage: 45, voters: 120 },
      { id: '2', text: 'افزایش 10-20%', percentage: 35, voters: 95 },
      { id: '3', text: 'بدون تغییر یا کاهش', percentage: 20, voters: 50 },
    ],
    commentsCount: 89000,
    sharesCount: 45000,
  },
  {
    id: '3',
    author: 'forecasters',
    timestamp: '3h',
    category: 'sports',
    question: 'کدام تیم قهرمان لیگ برتر این فصل خواهد شد؟',
    tags: [
      { id: '3', label: 'ورزشی' },
    ],
    options: [
      { id: '1', text: 'پرسپولیس', percentage: 55, voters: 200 },
      { id: '2', text: 'استقلال', percentage: 30, voters: 110 },
      { id: '3', text: 'سپاهان', percentage: 15, voters: 55 },
    ],
    commentsCount: 156000,
    sharesCount: 78000,
  },
  {
    id: '4',
    author: 'forecasters',
    timestamp: '4h',
    category: 'cultural',
    question: 'آیا فیلم جدید فرهادی نامزد اسکار خواهد شد؟',
    tags: [
      { id: '4', label: 'فرهنگی' },
    ],
    options: [
      { id: '1', text: 'بله، قطعاً', percentage: 60, voters: 180 },
      { id: '2', text: 'احتمال دارد', percentage: 25, voters: 75 },
      { id: '3', text: 'خیر', percentage: 15, voters: 45 },
    ],
    commentsCount: 67000,
    sharesCount: 34000,
  },
  {
    id: '5',
    author: 'forecasters',
    timestamp: '5h',
    category: 'social',
    question: 'نرخ مشارکت در انتخابات بعدی چقدر خواهد بود؟',
    tags: [
      { id: '5', label: 'اجتماعی' },
    ],
    options: [
      { id: '1', text: 'بیش از 60%', percentage: 40, voters: 130 },
      { id: '2', text: 'بین 40-60%', percentage: 35, voters: 115 },
      { id: '3', text: 'کمتر از 40%', percentage: 25, voters: 82 },
    ],
    commentsCount: 92000,
    sharesCount: 51000,
  },
  {
    id: '6',
    author: 'forecasters',
    timestamp: '6h',
    category: 'political',
    question: 'آیا توافق هسته‌ای احیا خواهد شد؟',
    tags: [
      { id: '1', label: 'سیاسی' },
    ],
    options: [
      { id: '1', text: 'بله، تا پایان سال', percentage: 50, voters: 165 },
      { id: '2', text: 'بله، اما دیرتر', percentage: 30, voters: 99 },
      { id: '3', text: 'خیر', percentage: 20, voters: 66 },
    ],
    commentsCount: 234000,
    sharesCount: 145000,
  },
];
