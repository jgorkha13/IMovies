import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  // New Movie Form State
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 130,
    rating: 8.5,
    certificate: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: '',
    trailerUrl: '',
  });

  // New Show Form State
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newShow, setNewShow] = useState({
    movie: '',
    theater: '',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 PM',
    ticketPrice: 280,
    vipPrice: 480,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/theaters'),
      ]);
      setStats(statsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);

      if (moviesRes.data.length > 0 && !newShow.movie) {
        setNewShow((prev) => ({ ...prev, movie: moviesRes.data[0]._id }));
      }
      if (theatersRes.data.length > 0 && !newShow.theater) {
        setNewShow((prev) => ({ ...prev, theater: theatersRes.data[0]._id }));
      }

      if (activeTab === 'shows') {
        const showsRes = await api.get('/shows');
        setShows(showsRes.data);
      } else if (activeTab === 'bookings') {
        const bookingsRes = await api.get('/admin/bookings');
        setAllBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies', newMovie);
      setActionMsg({ type: 'success', text: 'New movie published successfully!' });
      setShowMovieForm(false);
      fetchDashboardData();
    } catch (err) {
      setActionMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to add movie' });
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure? This will remove this movie and its scheduled shows.')) return;
    try {
      await api.delete(`/movies/${movieId}`);
      setActionMsg({ type: 'success', text: 'Movie removed successfully' });
      fetchDashboardData();
    } catch (err) {
      setActionMsg({ type: 'danger', text: 'Failed to delete movie' });
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shows', newShow);
      setActionMsg({ type: 'success', text: 'Showtime scheduled successfully!' });
      setShowScheduleForm(false);
      fetchDashboardData();
    } catch (err) {
      setActionMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to schedule show' });
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Delete this showtime?')) return;
    try {
      await api.delete(`/shows/${showId}`);
      setActionMsg({ type: 'success', text: 'Show deleted' });
      fetchDashboardData();
    } catch (err) {
      setActionMsg({ type: 'danger', text: 'Failed to delete show' });
    }
  };

  const handleResetSeedData = async () => {
    if (!window.confirm('Re-seed cinema database with fresh blockbuster movies, theaters, and shows?')) return;
    try {
      setLoading(true);
      await api.post('/seed');
      setActionMsg({ type: 'success', text: 'Database reset & re-seeded with demo blockbusters!' });
      fetchDashboardData();
    } catch (err) {
      setActionMsg({ type: 'danger', text: 'Seeding failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning text-dark fw-bold mb-1">
            <i className="bi bi-shield-lock-fill me-1"></i> CINEMA ADMIN CONSOLE
          </span>
          <h2 className="text-light fw-bold mb-1">IMovies Management Portal</h2>
          <p className="text-secondary small mb-0">
            Control movies, showtime schedules, and view platform ticket revenues.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button onClick={handleResetSeedData} className="btn btn-outline-secondary btn-sm text-light">
            <i className="bi bi-arrow-repeat me-1 text-info"></i> Reset Demo Data
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className={`alert alert-${actionMsg.type} alert-dismissible fade show small`} role="alert">
          {actionMsg.text}
          <button type="button" className="btn-close" onClick={() => setActionMsg(null)}></button>
        </div>
      )}

      {/* KPI Stats Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card-dark p-3 border-danger border-opacity-50">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">TOTAL REVENUE</div>
                  <h3 className="text-warning fw-bold mb-0">${stats.totalRevenue}</h3>
                </div>
                <div className="fs-2 text-warning opacity-75"><i className="bi bi-cash-stack"></i></div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card-dark p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">TICKETS RESERVED</div>
                  <h3 className="text-light fw-bold mb-0">{stats.totalTicketsSold}</h3>
                </div>
                <div className="fs-2 text-success opacity-75"><i className="bi bi-ticket-perforated"></i></div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card-dark p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">ACTIVE MOVIES</div>
                  <h3 className="text-light fw-bold mb-0">{stats.totalMovies}</h3>
                </div>
                <div className="fs-2 text-danger opacity-75"><i className="bi bi-film"></i></div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card-dark p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">REGISTERED USERS</div>
                  <h3 className="text-light fw-bold mb-0">{stats.totalUsers}</h3>
                </div>
                <div className="fs-2 text-info opacity-75"><i className="bi bi-people"></i></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-pills gap-2 mb-4 p-2 bg-dark rounded-3 border border-secondary border-opacity-50">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'stats' ? 'active bg-danger' : 'text-light'}`}
            onClick={() => setActiveTab('stats')}
          >
            <i className="bi bi-graph-up me-1"></i> Dashboard Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'movies' ? 'active bg-danger' : 'text-light'}`}
            onClick={() => setActiveTab('movies')}
          >
            <i className="bi bi-film me-1"></i> Manage Movies ({movies.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'shows' ? 'active bg-danger' : 'text-light'}`}
            onClick={() => setActiveTab('shows')}
          >
            <i className="bi bi-calendar-check me-1"></i> Schedule Shows
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'bookings' ? 'active bg-danger' : 'text-light'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-receipt me-1"></i> All Customer Bookings
          </button>
        </li>
      </ul>

      {/* Tab: Stats Overview & Recent Activity */}
      {activeTab === 'stats' && stats && (
        <div className="card-dark p-4">
          <h5 className="text-light fw-bold mb-3">
            <i className="bi bi-clock-history me-2 text-danger"></i> Recent Platform Bookings
          </h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>BOOKING ID</th>
                  <th>USER</th>
                  <th>MOVIE & SHOWTIME</th>
                  <th>SEATS</th>
                  <th>PAID</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b._id} className="border-secondary">
                    <td className="font-monospace text-warning">{b.bookingId}</td>
                    <td>
                      <div className="fw-semibold text-light">{b.user?.name || 'Customer'}</div>
                      <small className="text-secondary">{b.user?.email}</small>
                    </td>
                    <td>
                      <div className="text-light">{b.show?.movie?.title || 'Movie'}</div>
                      <small className="text-secondary">
                        {b.show?.date} at {b.show?.time} ({b.show?.theater?.name})
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{b.seats?.join(', ')}</span>
                    </td>
                    <td className="text-light fw-semibold">${b.totalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'confirmed' ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Movies */}
      {activeTab === 'movies' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-light fw-bold mb-0">Current Movies in Repertoire</h5>
            <button
              onClick={() => setShowMovieForm(!showMovieForm)}
              className="btn btn-cinema-red btn-sm"
            >
              <i className="bi bi-plus-circle me-1"></i> Add New Movie
            </button>
          </div>

          {/* Add Movie Form */}
          {showMovieForm && (
            <div className="card-dark p-4 mb-4 border-danger border-opacity-50">
              <h5 className="text-light fw-bold mb-3">Publish New Movie</h5>
              <form onSubmit={handleCreateMovie}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Movie Title</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Language</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.language}
                      onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Certificate</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.certificate}
                      onChange={(e) => setNewMovie({ ...newMovie, certificate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Genres (comma separated)</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.genre}
                      onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary small">Synopsis / Description</label>
                    <textarea
                      rows="3"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Poster Image URL</label>
                    <input
                      type="url"
                      className="form-control bg-dark text-light border-secondary"
                      value={newMovie.posterUrl}
                      onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">YouTube Trailer URL</label>
                    <input
                      type="url"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newMovie.trailerUrl}
                      onChange={(e) => setNewMovie({ ...newMovie, trailerUrl: e.target.value })}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowMovieForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-cinema-red btn-sm">
                      Save & Publish
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Movies Table */}
          <div className="card-dark p-3">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small border-secondary">
                    <th>POSTER</th>
                    <th>TITLE & GENRE</th>
                    <th>DURATION</th>
                    <th>RATING</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m._id} className="border-secondary">
                      <td style={{ width: '60px' }}>
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="rounded object-fit-cover"
                          style={{ width: '45px', height: '60px' }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-light">{m.title}</div>
                        <small className="text-secondary">{m.genre.join(', ')}</small>
                      </td>
                      <td className="text-secondary">{m.duration} min</td>
                      <td>
                        <span className="badge badge-gold">⭐ {m.rating}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteMovie(m._id)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Movie"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Shows */}
      {activeTab === 'shows' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-light fw-bold mb-0">Scheduled Cinema Showtimes</h5>
            <button
              onClick={() => setShowScheduleForm(!showScheduleForm)}
              className="btn btn-cinema-red btn-sm"
            >
              <i className="bi bi-calendar-plus me-1"></i> Add Showtime
            </button>
          </div>

          {/* Add Show Form */}
          {showScheduleForm && (
            <div className="card-dark p-4 mb-4 border-danger border-opacity-50">
              <h5 className="text-light fw-bold mb-3">Schedule Showtime</h5>
              <form onSubmit={handleCreateShow}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Select Movie</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={newShow.movie}
                      onChange={(e) => setNewShow({ ...newShow, movie: e.target.value })}
                      required
                    >
                      {movies.map((m) => (
                        <option key={m._id} value={m._id}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small">Select Cinema / Theater</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={newShow.theater}
                      onChange={(e) => setNewShow({ ...newShow, theater: e.target.value })}
                      required
                    >
                      {theaters.map((t) => (
                        <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Date</label>
                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      value={newShow.date}
                      onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Time Slot</label>
                    <input
                      type="text"
                      placeholder="e.g. 07:30 PM"
                      className="form-control bg-dark text-light border-secondary"
                      value={newShow.time}
                      onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Standard Price ($)</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      value={newShow.ticketPrice}
                      onChange={(e) => setNewShow({ ...newShow, ticketPrice: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-secondary small">VIP Price ($)</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      value={newShow.vipPrice}
                      onChange={(e) => setNewShow({ ...newShow, vipPrice: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowScheduleForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-cinema-red btn-sm">
                      Schedule Show
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Shows Table */}
          <div className="card-dark p-3">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small border-secondary">
                    <th>MOVIE</th>
                    <th>THEATER</th>
                    <th>DATE & TIME</th>
                    <th>PRICES</th>
                    <th>BOOKED SEATS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((s) => (
                    <tr key={s._id} className="border-secondary">
                      <td className="fw-bold text-light">{s.movie?.title || 'Movie'}</td>
                      <td className="text-secondary">{s.theater?.name || 'Theater'}</td>
                      <td>
                        <div className="text-light">{s.date}</div>
                        <small className="text-warning">{s.time}</small>
                      </td>
                      <td className="text-light">
                        ${s.ticketPrice} / <span className="text-warning">${s.vipPrice}</span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {s.bookedSeats ? s.bookedSeats.length : 0} / {s.totalSeats || 80}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteShow(s._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: All Bookings */}
      {activeTab === 'bookings' && (
        <div className="card-dark p-4">
          <h5 className="text-light fw-bold mb-3">All Customer Bookings</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small border-secondary">
                  <th>BOOKING ID</th>
                  <th>CUSTOMER</th>
                  <th>MOVIE & SHOWTIME</th>
                  <th>SEATS</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id} className="border-secondary">
                    <td className="font-monospace text-warning">{b.bookingId}</td>
                    <td>
                      <div className="fw-semibold text-light">{b.user?.name || 'Customer'}</div>
                      <small className="text-secondary">{b.user?.email}</small>
                    </td>
                    <td>
                      <div className="text-light">{b.show?.movie?.title}</div>
                      <small className="text-secondary">
                        {b.show?.date} {b.show?.time} ({b.show?.theater?.name})
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{b.seats?.join(', ')}</span>
                    </td>
                    <td className="text-light fw-semibold">${b.totalAmount}</td>
                    <td>
                      <span className="badge bg-dark border border-secondary text-secondary">
                        {b.paymentDetails?.method || 'Card'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'confirmed' ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
