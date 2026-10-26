import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark border-top border-secondary py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="bg-danger text-white rounded-3 px-2 py-1 fs-5 fw-bold brand-font">
                <i className="bi bi-film me-1"></i> I-MOVIES
              </span>
            </div>
            <p className="text-secondary small">
              Movie ticket booking made simple. Browse the latest blockbusters, select your favorite
              cinema and seats with real-time tracking, and enjoy seamless cinema entertainment.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-secondary">MERN Stack</span>
              <span className="badge bg-secondary">JWT Auth</span>
              <span className="badge bg-secondary">Bootstrap 5</span>
              <span className="badge bg-secondary">MongoDB</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-light fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary hover-light">Now Showing</Link></li>
              <li><Link to="/" className="text-decoration-none text-secondary hover-light">Upcoming Movies</Link></li>
              <li><Link to="/my-bookings" className="text-decoration-none text-secondary hover-light">My Bookings</Link></li>
              <li><Link to="/login" className="text-decoration-none text-secondary hover-light">Sign In</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-light fw-bold mb-3">Cinemas & Cities</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>PVR Superplex IMAX - Metropolis</li>
              <li>Cinepolis Dolby Atmos - Westgate</li>
              <li>INOX Megaplex 4DX - North Hub</li>
              <li>VIP Lounge & Dine-in screens</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-light fw-bold mb-3">Instant Customer Support</h6>
            <p className="text-secondary small mb-2">
              <i className="bi bi-envelope me-2 text-danger"></i> support@imovies.app
            </p>
            <p className="text-secondary small mb-3">
              <i className="bi bi-telephone me-2 text-danger"></i> +1 (800) 555-IMOVIES
            </p>
            <div className="text-secondary small">
              24/7 automated booking support and instant e-ticket verification.
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <div>&copy; {new Date().getFullYear()} IMovies Cinema Network. All rights reserved.</div>
          <div className="mt-2 mt-md-0">
            Engineered with React, Node.js, Express & MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
