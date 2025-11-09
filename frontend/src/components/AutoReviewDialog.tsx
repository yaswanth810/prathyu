import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { Star, PartyPopper } from 'lucide-react';
import { api } from '@/lib/api';
import { showToast } from './ui/Toast';
import { StarRating } from './ui/StarRating';

interface AutoReviewDialogProps {
  sessionId: string;
  revieweeId: string;
  revieweeName: string;
  sessionTitle: string;
  open: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export function AutoReviewDialog({ 
  sessionId, 
  revieweeId, 
  revieweeName,
  sessionTitle,
  open, 
  onClose,
  onReviewSubmitted 
}: AutoReviewDialogProps) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setRating(5);
      setComment('');
    }
  }, [open]);

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

      showToast.success('Thank you for your review! 🎉');
      onClose();
      onReviewSubmitted?.();
    } catch (error: any) {
      showToast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    showToast.success('You can leave a review later from your sessions page');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="w-6 h-6 text-primary-600" />
              <DialogTitle className="text-2xl">Session Complete!</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              How was your experience learning <strong>"{sessionTitle}"</strong> with {revieweeName}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
              <p className="text-sm text-primary-900 font-medium mb-3">
                Your feedback helps other learners and improves teaching quality
              </p>
              <div className="flex justify-center mb-2">
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              </div>
              <span className="text-sm font-semibold text-primary-700">
                {rating === 1 && '⭐ Poor'}
                {rating === 2 && '⭐⭐ Fair'}
                {rating === 3 && '⭐⭐⭐ Good'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </span>
            </div>

            <div className="grid gap-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Share your experience (Optional)
              </label>
              <textarea
                id="comment"
                placeholder="What did you learn? What did you like? Any suggestions?"
                className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {comment.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
