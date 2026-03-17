interface RatingDisplayProps {
  averageRating: number;
  totalReviews: number;
}

const RatingDisplay = ({ averageRating, totalReviews }: RatingDisplayProps) => {
  // Convertir rating a estrellas (1-5)
  const stars = averageRating;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">Calificación Promedio</p>
          <div className="flex items-center gap-2">
            <div className="flex text-3xl">
              {/* Full stars */}
              {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-500">⭐</span>
              ))}
              {/* Half star */}
              {hasHalfStar && <span className="text-yellow-500">⭐</span>}
              {/* Empty stars */}
              {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-300">⭐</span>
              ))}
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-gray-800">{totalReviews}</p>
          <p className="text-gray-600">
            {totalReviews === 1 ? 'Review' : 'Reviews'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingDisplay;