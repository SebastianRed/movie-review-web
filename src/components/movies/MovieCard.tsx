import { Link } from 'react-router-dom';
import type { Movie, Series } from '../../types/movie';
import { getImageUrl } from '../../api/tmdbApi';
import type { ContentType } from '../../types/review';

interface MovieCardProps {
  content: Movie | Series;
  type: ContentType;
}

const MovieCard = ({ content, type }: MovieCardProps) => {
  const title = type === 'MOVIE' 
    ? (content as Movie).title 
    : (content as Series).name;

  const releaseDate = type === 'MOVIE'
    ? (content as Movie).release_date
    : (content as Series).first_air_date;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const linkPath = type === 'MOVIE' ? `/movie/${content.id}` : `/series/${content.id}`;

  return (
    <Link to={linkPath} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gray-200">
          <img
            src={getImageUrl(content.poster_path, 'w342')}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm font-bold">
            ⭐ {content.vote_average.toFixed(1)}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
            {title}
          </h3>
          <p className="text-gray-500 text-sm">{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;