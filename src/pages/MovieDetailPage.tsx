import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { tmdbApi, getImageUrl } from '../api/tmdbApi';
import { reviewApi } from '../api/reviewApi';
import type { Movie, Series } from '../types/movie';
import type { ReviewsResponse, ContentType } from '../types/review';
import type { ApiError } from '../types/api';
import { useAuth } from '../hooks/useAuth';

import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import RatingDisplay from '../components/reviews/RatingDisplay';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Determinar contentType de forma síncrona desde la URL — sin useEffect
  const contentType: ContentType = location.pathname.includes('/movie/') ? 'MOVIE' : 'SERIES';

  const [content, setContent] = useState<Movie | Series | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Cargar detalles del contenido
  const fetchContentDetails = async () => {
    if (!id) return;

    setIsLoadingContent(true);
    setError('');

    try {
      const data = contentType === 'MOVIE'
        ? await tmdbApi.getMovieDetails(Number(id))
        : await tmdbApi.getSeriesDetails(Number(id));

      setContent(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar detalles');
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Cargar reviews
  const fetchReviews = async () => {
    if (!id) return;

    setIsLoadingReviews(true);

    try {
      const data = await reviewApi.getReviewsByContent(Number(id), contentType);
      setReviewsData(data);
    } catch (err) {
      console.error('Error al cargar reviews:', err);
      setReviewsData({ reviews: [], averageRating: 0, totalReviews: 0 });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchContentDetails();
    fetchReviews();
  }, [id, contentType]);

  // Callback cuando se crea/actualiza/elimina una review
  const handleReviewChange = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  // Verificar si el usuario ya tiene una review
  const userReview = reviewsData?.reviews.find(
    (review) => review.userId === user?.id
  );

  if (isLoadingContent) {
    return <Loader />;
  }

  if (error || !content) {
    return (
      <ErrorMessage
        message={error || 'Contenido no encontrado'}
        onRetry={() => navigate(-1)}
      />
    );
  }

  const title = contentType === 'MOVIE'
    ? (content as Movie).title
    : (content as Series).name;

  const releaseDate = contentType === 'MOVIE'
    ? (content as Movie).release_date
    : (content as Series).first_air_date;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
        {/* Backdrop */}
        {content.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${getImageUrl(content.backdrop_path, 'w1280')})` }}
          />
        )}

        <div className="relative grid md:grid-cols-[300px,1fr] gap-8 p-8">
          {/* Poster */}
          <div className="flex justify-center md:justify-start">
            <img
              src={getImageUrl(content.poster_path, 'w500')}
              alt={title}
              className="w-full max-w-[300px] rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="text-white space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <p className="text-xl text-gray-300">{year}</p>
            </div>

            {/* TMDB Rating */}
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold">
                ⭐ {content.vote_average.toFixed(1)} / 10
              </div>
              <span className="text-gray-300">
                ({content.vote_count.toLocaleString()} votos en TMDB)
              </span>
            </div>

            {/* Genres */}
            {content.genres && content.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed">
                {content.overview || 'No hay sinopsis disponible.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            💬 Reviews de la Comunidad
          </h2>

          {!userReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              ✍️ Escribir Review
            </button>
          )}
        </div>

        {/* Rating Display */}
        {isLoadingReviews ? (
          <Loader />
        ) : (
          <>
            <RatingDisplay
              averageRating={reviewsData?.averageRating || 0}
              totalReviews={reviewsData?.totalReviews || 0}
            />

            {/* Review Form */}
            {showReviewForm && (
              <div className="mt-6">
                <ReviewForm
                  externalContentId={Number(id)}
                  contentType={contentType}
                  onSuccess={handleReviewChange}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* User's Review (if exists) */}
            {userReview && !showReviewForm && (
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-2">Tu Review:</p>
                <ReviewList
                  reviews={[userReview]}
                  onReviewChange={handleReviewChange}
                  showActions={true}
                />
              </div>
            )}

            {/* Other Reviews */}
            {reviewsData && reviewsData.reviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Todas las Reviews ({reviewsData.reviews.filter(r => r.userId !== user?.id).length})
                </h3>
                <ReviewList
                  reviews={reviewsData.reviews.filter(r => r.userId !== user?.id)}
                  onReviewChange={handleReviewChange}
                  showActions={false}
                />
              </div>
            )}

            {reviewsData && reviewsData.reviews.length === 0 && !showReviewForm && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-lg mb-4">
                  Aún no hay reviews. ¡Sé el primero en opinar!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;