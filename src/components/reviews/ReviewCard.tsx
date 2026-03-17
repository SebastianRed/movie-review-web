import { useState } from 'react';
import type { Review } from '../../types/review';
import { useAuth } from '../../hooks/useAuth';
import { reviewApi } from '../../api/reviewApi';
import type { ApiError } from '../../types/api';
import ReviewForm from './ReviewForm';

interface ReviewCardProps {
  review: Review;
  onReviewChange: () => void;
  showActions: boolean;
}

const ReviewCard = ({ review, onReviewChange, showActions }: ReviewCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === review.userId;
  const canEdit = isOwner && showActions;

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta review?')) {
      return;
    }

    setIsDeleting(true);

    try {
      await reviewApi.deleteReview(review.id);
      onReviewChange();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || 'Error al eliminar la review');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <ReviewForm
        externalContentId={review.externalContentId}
        contentType={review.contentType}
        initialRating={review.rating}
        initialComment={review.comment}
        reviewId={review.id}
        onSuccess={() => {
          setIsEditing(false);
          onReviewChange();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {review.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-800">{review.username}</p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Updated info */}
      {review.updatedAt !== review.createdAt && (
        <p className="text-xs text-gray-500 mb-4">
          Editado el {formatDate(review.updatedAt)}
        </p>
      )}

      {/* Actions */}
      {canEdit && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 disabled:text-red-400 font-medium text-sm"
          >
            {isDeleting ? '🗑️ Eliminando...' : '🗑️ Eliminar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;