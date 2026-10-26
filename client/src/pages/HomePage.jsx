import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Comedy'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Spanish'];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [trailerModalUrl, setTrailerModalUrl] = useState(null);

  const querySearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchMovies();
  }, [querySearch, selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (querySearch) params.search = querySearch;
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      const res = await api.get('/movies', { params });
      setMovies(res.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMovie = movies[0];

  return (
    <div>
      {/* Featured Hero Banner */}
      {featuredMovie && !querySearch && (
        <section
          className="hero-backdrop"
          style={{
            backgroundImage: `url(${featuredMovie.bannerUrl || featuredMovie.posterUrl})`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="container position-relative py-5">
            <div className="row">
              <div className="col-lg-7 col-md-10">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-danger px-3 py-1 fs-6">FEATURED PREMIERE</span>
                  <span className="badge badge-gold px-2 py-1">
                    <i className="bi bi-star-fill text-dark"></i> {featuredMovie.rating}
                  </span>
                  <span className="badge bg-dark border border-secondary text-light">
                    {featuredMovie.certificate}
                  </span>
                </div>

                <h1 className="display-4 fw-black text-light brand-font mb-2">
                  {featuredMovie.title}
                </h1>

                <p className="lead text-light text-opacity-90 mb-4" style={{ maxHeight: '72px', overflow: 'hidden' }}>
                  {featuredMovie.description}
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <Link
                    to={`/movie/${featuredMovie._id}`}
                    className="btn btn-cinema-red btn-lg px-4 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-ticket-perforated-fill"></i> Book Showtimes
                  </Link>
                  {featuredMovie.trailerUrl && (
                    <a
                      href={featuredMovie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light btn-lg px-4 d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-play-circle-fill"></i> Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content & Filter Bar */}
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="text-light fw-bold mb-1">
              {querySearch ? `Search Results for "${querySearch}"` : 'Now Showing in Cinemas'}
            </h2>
            <p className="text-secondary small mb-0">
              Select your favorite movie and reserve your preferred seats instantly
            </p>
          </div>

          {/* Language filter dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label className="text-secondary small fw-semibold">Language:</label>
            <select
              className="form-select form-select-sm bg-dark text-light border-secondary"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ width: '130px' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`btn btn-sm rounded-pill px-3 py-1 ${
                selectedGenre === g
                  ? 'btn-danger'
                  : 'btn-outline-secondary text-light'
              }`}
            >
              {g}
            </button>
          ))}
          {querySearch && (
            <button
              className="btn btn-sm btn-outline-warning rounded-pill px-3"
              onClick={() => setSearchParams({})}
            >
              Clear Search <i className="bi bi-x-circle ms-1"></i>
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading movies...</span>
            </div>
            <div className="text-secondary mt-2">Fetching current cinema catalog...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="card-dark p-5 text-center my-4">
            <i className="bi bi-film text-secondary display-3 mb-3"></i>
            <h4 className="text-light">No movies found matching criteria</h4>
            <p className="text-secondary">Try searching for other titles or resetting filters.</p>
            <button
              className="btn btn-cinema-red mt-2"
              onClick={() => {
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setSearchParams({});
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {/* Cinema Experience Perks Section */}
        <div className="row g-4 mt-5 pt-4 border-top border-secondary">
          <div className="col-md-4">
            <div className="card-dark p-4 text-center h-100">
              <div className="fs-1 text-danger mb-3">
                <i className="bi bi-camera-reels"></i>
              </div>
              <h5 className="text-light fw-bold">IMAX & Dolby Atmos</h5>
              <p className="text-secondary small mb-0">
                Experience next-generation crystal audio and towering laser projection across our partner theaters.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-dark p-4 text-center h-100">
              <div className="fs-1 text-warning mb-3">
                <i className="bi bi-grid-3x3"></i>
              </div>
              <h5 className="text-light fw-bold">Real-Time Seat Booking</h5>
              <p className="text-secondary small mb-0">
                Pick your exact seat live with instant lock and zero double bookings guaranteed.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-dark p-4 text-center h-100">
              <div className="fs-1 text-success mb-3">
                <i className="bi bi-qr-code-scan"></i>
              </div>
              <h5 className="text-light fw-bold">Instant Digital Tickets</h5>
              <p className="text-secondary small mb-0">
                Skip the kiosk queues. Scan your contactless barcode ticket straight from your phone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
