import type { Review } from '../../types/review';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  onReviewChange: () => void;
  showActions: boolean;
}

const ReviewList = ({ reviews, onReviewChange, showActions }: ReviewListProps) => {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReviewChange={onReviewChange}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default ReviewList;