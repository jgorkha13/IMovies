import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketModal from '../components/TicketModal';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The seats will be released back to the cinema.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.put(`/bookings/${bookingId}/cancel`);
      setNotification({ type: 'success', message: 'Booking cancelled successfully. Seats have been released.' });
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setNotification({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to cancel booking.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-light fw-bold mb-1">
            <i className="bi bi-ticket-perforated-fill text-danger me-2"></i> My Movie Bookings
          </h2>
          <p className="text-secondary small mb-0">
            View your active tickets, print passes, or manage cancellations.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-danger btn-sm">
          <i className="bi bi-plus-circle me-1"></i> Book New Ticket
        </Link>
      </div>

      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show small`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <div className="text-secondary mt-2">Loading your tickets...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card-dark p-5 text-center my-4">
          <i className="bi bi-ticket text-secondary display-3 mb-3"></i>
          <h4 className="text-light">No Bookings Yet</h4>
          <p className="text-secondary">You haven't reserved any movie tickets yet. Start exploring now!</p>
          <Link to="/" className="btn btn-cinema-red mt-2">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const show = booking.show || {};
            const movie = show.movie || {};
            const theater = show.theater || {};
            const isCancelled = booking.status === 'cancelled';

            return (
              <div key={booking._id} className="col-lg-6">
                <div className="card-dark p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header Row */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-secondary font-monospace mb-1">
                          {booking.bookingId}
                        </span>
                        <h5 className="text-light fw-bold mb-1">{movie.title || 'Movie'}</h5>
                        <div className="text-secondary small">
                          <i className="bi bi-geo-alt me-1 text-danger"></i>
                          {theater.name || 'Cinema Hall'} • {show.screenName || 'Audi 1'}
                        </div>
                      </div>

                      <span
                        className={`badge ${
                          isCancelled ? 'bg-danger' : 'bg-success'
                        } px-3 py-1 text-uppercase`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <hr className="border-secondary my-3" />

                    {/* Booking Details Grid */}
                    <div className="row g-2 small text-secondary mb-3">
                      <div className="col-6">
                        <div>SHOW DATE & TIME</div>
                        <div className="text-light fw-semibold">
                          {show.date} at {show.time}
                        </div>
                      </div>

                      <div className="col-6">
                        <div>RESERVED SEATS</div>
                        <div className={`fw-bold fs-6 ${isCancelled ? 'text-secondary' : 'text-success'}`}>
                          {booking.seats ? booking.seats.join(', ') : 'N/A'}
                        </div>
                      </div>

                      <div className="col-6 mt-2">
                        <div>AMOUNT PAID</div>
                        <div className="text-light fw-semibold">${booking.totalAmount}</div>
                      </div>

                      <div className="col-6 mt-2">
                        <div>BOOKED ON</div>
                        <div className="text-light">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 pt-3 border-top border-secondary">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="btn btn-outline-light btn-sm flex-fill"
                    >
                      <i className="bi bi-qr-code me-1"></i> View Ticket Pass
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="btn btn-outline-danger btn-sm"
                        title="Cancel this booking"
                      >
                        {cancellingId === booking._id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <TicketModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
};

export default MyBookingsPage;
