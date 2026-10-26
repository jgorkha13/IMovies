import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate('/');
      }
    };

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-glass sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="bg-danger text-white rounded-3 px-2 py-1 fs-5 fw-bold brand-font shadow-sm">
              <i className="bi bi-film me-1"></i> I-MOVIES
            </span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Search input */}
            <form className="d-flex my-2 my-lg-0 mx-auto w-50" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  className="form-control bg-dark text-light border-secondary shadow-none"
                  type="search"
                  placeholder="Search movies by title, genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <Link className="nav-link text-light fw-medium px-3" to="/">
                  <i className="bi bi-house-door me-1"></i> Home
                </Link>
              </li>

              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light fw-medium px-3" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-1"></i> My Tickets
                    </Link>
                  </li>

                  {isAdmin && (
                    <li className="nav-item">
                      <Link
                        className="nav-link btn btn-outline-warning text-warning border-warning px-3 py-1 fw-semibold me-2"
                        to="/admin"
                      >
                        <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                      </Link>
                    </li>
                  )}

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle text-light d-flex align-items-center gap-2"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <div
                        className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="d-none d-md-inline">{user.name.split(' ')[0]}</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark card-dark shadow-lg mt-2">
                      <li className="px-3 py-2 border-bottom border-secondary">
                        <div className="fw-semibold text-light">{user.name}</div>
                        <small className="text-secondary">{user.email}</small>
                        {isAdmin && <span className="badge bg-warning text-dark ms-2">Admin</span>}
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/my-bookings">
                          <i className="bi bi-ticket-detailed me-2 text-danger"></i> My Bookings
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link className="dropdown-item py-2" to="/admin">
                            <i className="bi bi-gear me-2 text-warning"></i> Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li><hr className="dropdown-divider border-secondary" /></li>
                      <li>
                        <button className="dropdown-item text-danger py-2" onClick={logout}>
                          <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2 ms-lg-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm px-3 fw-semibold">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-cinema-red btn-sm px-3 fw-semibold">
                    Register
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
