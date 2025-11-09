import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={cn(
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform',
            'focus:outline-none'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}
