import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins > 0 ? `${remMins}m` : ''}`;
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div className="card-dark h-100 overflow-hidden d-flex flex-column">
        {/* Poster Wrapper */}
        <div className="position-relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-100 h-100 object-fit-cover transition-all"
            style={{ transition: 'transform 0.4s ease' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Rating Badge */}
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge badge-gold px-2 py-1 shadow-sm d-flex align-items-center gap-1">
              <i className="bi bi-star-fill text-dark"></i> {movie.rating.toFixed(1)}
            </span>
          </div>

          {/* Certificate & Language */}
          <div className="position-absolute bottom-0 start-0 m-2 d-flex gap-1">
            <span className="badge bg-black bg-opacity-75 text-light px-2 py-1 border border-secondary">
              {movie.certificate}
            </span>
            <span className="badge bg-black bg-opacity-75 text-light px-2 py-1 border border-secondary">
              {movie.language}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            <h5 className="text-light fw-bold mb-1 text-truncate" title={movie.title}>
              {movie.title}
            </h5>
            <div className="text-secondary small mb-2">
              <i className="bi bi-clock me-1"></i> {formatDuration(movie.duration)}
            </div>

            {/* Genre tags */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 3).map((g, idx) => (
                <span key={idx} className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 font-monospace small">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <Link
            to={`/movie/${movie._id}`}
            className="btn btn-cinema-red w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-ticket-perforated"></i> Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
