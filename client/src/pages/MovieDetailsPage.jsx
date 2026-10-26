import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  // Generate 5 upcoming dates
  const dateOptions = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dateStr, dayName, formatted };
  });

  useEffect(() => {
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[0].dateStr);
    }
  }, []);

  useEffect(() => {
    fetchMovieAndShows();
  }, [id, selectedDate]);

  const fetchMovieAndShows = async () => {
    try {
      setLoading(true);
      const movieRes = await api.get(`/movies/${id}`);
      setMovie(movieRes.data);

      if (selectedDate) {
        const showRes = await api.get('/shows', {
          params: { movie: id, date: selectedDate },
        });
        setShows(showRes.data);
      }
    } catch (err) {
      console.error('Error fetching movie details & shows:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group shows by theater
  const showsByTheater = shows.reduce((acc, show) => {
    const theaterId = show.theater?._id || 'unknown';
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theater || { name: 'Cinema Hall', location: 'City' },
        shows: [],
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {});

  if (loading && !movie) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <div className="text-secondary mt-2">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-light">Movie Not Found</h3>
        <Link to="/" className="btn btn-cinema-red mt-3">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Movie Details Header */}
      <section
        className="hero-backdrop"
        style={{
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          minHeight: '420px',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container position-relative py-5">
          <div className="row g-4 align-items-end">
            <div className="col-md-3 col-sm-4 text-center text-sm-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-4 shadow-lg w-100 object-fit-cover border border-secondary"
                style={{ maxHeight: '340px' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="col-md-9 col-sm-8 text-light">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge badge-gold px-2 py-1">
                  <i className="bi bi-star-fill text-dark me-1"></i> {movie.rating.toFixed(1)} / 10
                </span>
                <span className="badge bg-secondary">{movie.certificate}</span>
                <span className="badge bg-danger">{movie.language}</span>
                <span className="text-secondary small">
                  <i className="bi bi-clock me-1"></i> {movie.duration} minutes
                </span>
              </div>

              <h1 className="display-5 fw-bold brand-font mb-2">{movie.title}</h1>

              <div className="d-flex flex-wrap gap-1 mb-3">
                {movie.genre.map((g, idx) => (
                  <span key={idx} className="badge bg-dark border border-secondary text-secondary">
                    {g}
                  </span>
                ))}
              </div>

              <p className="lead text-light text-opacity-90 fs-6 mb-3" style={{ maxWidth: '800px' }}>
                {movie.description}
              </p>

              {movie.director && (
                <div className="small text-secondary mb-1">
                  <span className="text-light fw-semibold">Director:</span> {movie.director}
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="small text-secondary mb-3">
                  <span className="text-light fw-semibold">Cast:</span> {movie.cast.join(', ')}
                </div>
              )}

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm"
                >
                  <i className="bi bi-play-circle me-1 text-danger"></i> Watch Official Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Date Selector & Showtimes */}
      <div className="container py-5">
        <h3 className="text-light fw-bold mb-3">
          <i className="bi bi-calendar-event me-2 text-danger"></i> Select Date & Showtime
        </h3>

        {/* Date Tabs */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
          {dateOptions.map((opt) => (
            <button
              key={opt.dateStr}
              onClick={() => setSelectedDate(opt.dateStr)}
              className={`btn px-4 py-2 text-center rounded-3 ${
                selectedDate === opt.dateStr
                  ? 'btn-danger shadow'
                  : 'btn-dark border border-secondary text-light'
              }`}
              style={{ minWidth: '110px' }}
            >
              <div className="small fw-medium opacity-75">{opt.dayName}</div>
              <div className="fw-bold fs-6">{opt.formatted}</div>
            </button>
          ))}
        </div>

        {/* Theaters & Showtimes Listing */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <div className="text-secondary mt-2">Checking real-time theater availability...</div>
          </div>
        ) : Object.keys(showsByTheater).length === 0 ? (
          <div className="card-dark p-5 text-center my-3">
            <i className="bi bi-clock-history text-secondary display-4 mb-3"></i>
            <h4 className="text-light">No shows available for this date</h4>
            <p className="text-secondary">Please pick an alternate date or check back later.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {Object.values(showsByTheater).map(({ theater, shows }) => (
              <div key={theater._id || theater.name} className="card-dark p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom border-secondary">
                  <div>
                    <h5 className="text-light fw-bold mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i> {theater.name}
                    </h5>
                    <div className="text-secondary small">{theater.location || theater.city}</div>
                  </div>
                  <div className="d-flex gap-3 text-secondary small mt-2 mt-md-0">
                    <div><i className="bi bi-phone me-1 text-success"></i> M-Ticket Available</div>
                    <div><i className="bi bi-cup-straw me-1 text-warning"></i> F&B Service</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  {shows.map((show) => {
                    const availableSeatsCount =
                      (show.totalSeats || 80) - (show.bookedSeats ? show.bookedSeats.length : 0);
                    const isAlmostFull = availableSeatsCount <= 10;

                    return (
                      <Link
                        key={show._id}
                        to={`/booking/shows/${show._id}`}
                        className="btn btn-outline-secondary border-secondary p-2 text-start rounded-3 text-decoration-none transition-all"
                        style={{ minWidth: '150px' }}
                      >
                        <div className="fw-bold fs-5 text-light">{show.time}</div>
                        <div className="text-secondary small">{show.screenName}</div>
                        <div className="d-flex justify-content-between align-items-center mt-2 small">
                          <span className="text-warning fw-semibold">${show.ticketPrice}</span>
                          <span className={isAlmostFull ? 'text-danger' : 'text-success'}>
                            {availableSeatsCount} left
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
