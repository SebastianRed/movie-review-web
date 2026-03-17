import { useState, type FormEvent } from 'react';
import { reviewApi } from '../../api/reviewApi';
import type { ContentType, CreateReviewRequest } from '../../types/review';
import type { ApiError } from '../../types/api';

interface ReviewFormProps {
  externalContentId: number;
  contentType: ContentType;
  onSuccess: () => void;
  onCancel: () => void;
  initialRating?: number;
  initialComment?: string;
  reviewId?: number; // Para modo edición
}

const ReviewForm = ({
  externalContentId,
  contentType,
  onSuccess,
  onCancel,
  initialRating = 0,
  initialComment = '',
  reviewId
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!reviewId;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (!comment.trim()) {
      setError('Por favor escribe un comentario');
      return;
    }

    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await reviewApi.updateReview(reviewId, { rating, comment });
      } else {
        const reviewData: CreateReviewRequest = {
          externalContentId,
          contentType,
          rating,
          comment
        };
        await reviewApi.createReview(reviewData);
      }
      
      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al guardar la review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditMode ? 'Editar Review' : 'Nueva Review'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Calificación
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="text-5xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span className={
                star <= (hoveredStar || rating)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }>
                ⭐
              </span>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {rating === 1 && 'Muy mala'}
            {rating === 2 && 'Mala'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Buena'}
            {rating === 5 && 'Excelente'}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentario
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu opinión sobre esta película/serie..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500 mt-1">
          {comment.length} caracteres (mínimo 10)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Publicar Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;