import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import TicketModal from '../components/TicketModal';

const BookingSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      api.get(`/bookings/${id}`)
        .then((res) => {
          setBooking(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading booking:', err);
          setLoading(false);
        });
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  const show = booking?.show || {};
  const movie = show?.movie || {};
  const theater = show?.theater || {};

  return (
    <div className="container py-5 text-center">
      <div className="card-dark p-4 p-md-5 mx-auto shadow-lg" style={{ maxWidth: '680px' }}>
        {/* Animated Success Icon */}
        <div className="mb-4">
          <div
            className="rounded-circle bg-success bg-opacity-25 text-success d-inline-flex align-items-center justify-content-center"
            style={{ width: '88px', height: '88px', fontSize: '3rem' }}
          >
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </div>

        <span className="badge bg-success px-3 py-1 mb-2">RESERVATION CONFIRMED</span>
        <h2 className="text-light fw-bold mb-2">You're Going to the Movies!</h2>
        <p className="text-secondary small mb-4">
          A confirmation with your digital movie pass has been generated. Show your barcode at the cinema counter or audi entrance.
        </p>

        {/* Quick Ticket Snapshot Card */}
        <div className="bg-dark p-4 rounded-3 text-start border border-secondary mb-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="text-light fw-bold mb-1">{movie.title || 'Movie'}</h5>
              <div className="text-secondary small">
                {theater.name} • {show.screenName}
              </div>
            </div>
            <div className="text-end">
              <div className="text-secondary small">Booking Ref</div>
              <div className="fw-bold text-warning font-monospace">{booking?.bookingId}</div>
            </div>
          </div>

          <hr className="border-secondary my-2" />

          <div className="row g-2 small text-secondary mt-2">
            <div className="col-4">
              <div>DATE & TIME</div>
              <div className="text-light fw-bold">{show.date} {show.time}</div>
            </div>
            <div className="col-4">
              <div>SEATS</div>
              <div className="text-success fw-bold fs-6">{booking?.seats?.join(', ')}</div>
            </div>
            <div className="col-4 text-end">
              <div>TOTAL AMOUNT</div>
              <div className="text-light fw-bold fs-6">${booking?.totalAmount}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-cinema-red px-4 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-ticket-perforated"></i> View & Print Ticket
          </button>

          <Link to="/my-bookings" className="btn btn-outline-light px-4 py-2 fw-semibold">
            My Bookings
          </Link>

          <Link to="/" className="btn btn-dark border-secondary px-4 py-2">
            Explore More Movies
          </Link>
        </div>
      </div>

      {showModal && booking && (
        <TicketModal booking={booking} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BookingSuccessPage;
