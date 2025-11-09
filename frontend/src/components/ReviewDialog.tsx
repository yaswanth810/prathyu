import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Button } from './ui/Button';
import { Star } from 'lucide-react';
import { api } from '@/lib/api';
import { showToast } from './ui/Toast';
import { StarRating } from './ui/StarRating';

interface ReviewDialogProps {
  sessionId: string;
  revieweeId: string;
  revieweeName: string;
  onReviewSubmitted?: () => void;
  trigger?: React.ReactNode;
}

export function ReviewDialog({ sessionId, revieweeId, revieweeName, onReviewSubmitted, trigger }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/reviews', {
        sessionId,
        revieweeId,
        rating,
        comment: comment.trim() || undefined,
      });

      showToast.success('Review submitted successfully!');
      setOpen(false);
      setRating(5);
      setComment('');
      onReviewSubmitted?.();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Star className="w-4 h-4 mr-2" />
            Leave Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {revieweeName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                <span className="text-sm text-gray-600 ml-2">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Comment (Optional)
              </label>
              <textarea
                id="comment"
                placeholder="What did you like? What could be improved?"
                className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {comment.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
