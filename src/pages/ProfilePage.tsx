import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewApi } from '../api/reviewApi';
import type { Review } from '../types/review';
import type { ApiError } from '../types/api';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewCard from '../components/reviews/ReviewCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyReviews = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await reviewApi.getMyReviews();
      setReviews(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar tus reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleReviewChange = () => {
    fetchMyReviews();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMyReviews} />;
  }

  // Calcular estadísticas
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-purple-600 text-4xl font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user?.username}</h1>
            <p className="text-purple-100">{user?.email}</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{totalReviews}</p>
                <p className="text-sm text-purple-100">Reviews</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)} ⭐</p>
                <p className="text-sm text-purple-100">Promedio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📝 Mis Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-600 text-lg mb-6">
              Aún no has escrito ninguna review
            </p>
            <Link
              to="/search"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Buscar Películas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                {/* Content Title */}
                <div className="mb-3">
                  <Link
                    to={review.contentType === 'MOVIE' 
                      ? `/movie/${review.externalContentId}` 
                      : `/series/${review.externalContentId}`
                    }
                    className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
                  >
                    {review.contentType === 'MOVIE' ? '🎬' : '📺'} Ver detalles del contenido →
                  </Link>
                </div>

                {/* Review Card */}
                <ReviewCard
                  review={review}
                  onReviewChange={handleReviewChange}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;