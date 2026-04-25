'use client';

import type { Rating, IntervalPreview } from '@/lib/types';

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  intervalPreview: IntervalPreview;
  disabled?: boolean;
}

const buttons: { rating: Rating; label: string; color: string }[] = [
  {
    rating: 'again',
    label: '다시',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800',
  },
  {
    rating: 'hard',
    label: '어려움',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 border-orange-200 dark:border-orange-800',
  },
  {
    rating: 'good',
    label: '좋음',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800',
  },
  {
    rating: 'easy',
    label: '쉬움',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800',
  },
];

export default function RatingButtons({ onRate, intervalPreview, disabled = false }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {buttons.map(({ rating, label, color }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all min-h-[56px] ${color} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="font-bold">{label}</span>
          <span className="text-xs mt-0.5 opacity-70">{intervalPreview[rating]}</span>
        </button>
      ))}
    </div>
  );
}
