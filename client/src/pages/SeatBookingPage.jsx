import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import SeatMatrix from '../components/SeatMatrix';
import { useAuth } from '../context/AuthContext';

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatPrices, setSeatPrices] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchShow();
  }, [showId]);

  const fetchShow = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shows/${showId}`);
      setShow(res.data);
    } catch (err) {
      console.error('Error fetching show details:', err);
      setErrorMsg('Failed to load show details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatId, price) => {
    setErrorMsg('');
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      const newPrices = { ...seatPrices };
      delete newPrices[seatId];
      setSeatPrices(newPrices);
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMsg('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
      setSeatPrices({ ...seatPrices, [seatId]: price });
    }
  };

  const subtotal = selectedSeats.reduce((sum, seat) => sum + (seatPrices[seat] || show?.ticketPrice || 250), 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const grandTotal = subtotal + convenienceFee;

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least one seat to continue.');
      return;
    }

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/booking/shows/${showId}`));
      return;
    }

    // Save booking draft in state/sessionStorage and navigate to checkout
    const checkoutData = {
      showId,
      show,
      selectedSeats,
      seatPrices,
      subtotal,
      convenienceFee,
      grandTotal,
    };
    sessionStorage.setItem('imovies_checkout', JSON.stringify(checkoutData));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <div className="text-secondary mt-2">Loading seat availability...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-light">Show Not Found</h3>
        <Link to="/" className="btn btn-cinema-red mt-3">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Show Details Header Card */}
      <div className="card-dark p-3 p-md-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger">{show.movie?.certificate || 'UA'}</span>
              <span className="badge bg-secondary">{show.movie?.language || 'English'}</span>
              <span className="text-secondary small">{show.screenName}</span>
            </div>
            <h3 className="text-light fw-bold mb-1">{show.movie?.title}</h3>
            <div className="text-secondary small">
              <i className="bi bi-geo-alt me-1 text-danger"></i>
              {show.theater?.name} ({show.theater?.city})
            </div>
          </div>

          <div className="text-md-end bg-dark p-3 rounded-3 border border-secondary border-opacity-50">
            <div className="text-secondary small">SHOWTIME</div>
            <div className="text-light fw-bold fs-5">{show.time}</div>
            <div className="text-warning small">{show.date}</div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}
        </div>
      )}

      {/* Interactive Seat Matrix */}
      <SeatMatrix
        bookedSeats={show.bookedSeats || []}
        selectedSeats={selectedSeats}
        onSeatToggle={handleSeatToggle}
        ticketPrice={show.ticketPrice || 250}
        vipPrice={show.vipPrice || 450}
      />

      {/* Sticky Bottom Summary Bar */}
      <div className="card-dark p-3 p-md-4 mt-4 sticky-bottom shadow-lg border-danger border-opacity-50">
        <div className="row align-items-center g-3">
          <div className="col-lg-6 col-md-5">
            <div className="text-secondary small mb-1">
              SELECTED SEATS ({selectedSeats.length}/8):
            </div>
            {selectedSeats.length === 0 ? (
              <span className="text-secondary fst-italic small">No seats selected yet</span>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="badge bg-success fs-6 px-2 py-1">
                    {seat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-3 col-md-3 text-md-end">
            <div className="text-secondary small">TOTAL ESTIMATE</div>
            <div className="text-light fw-bold fs-4">
              ${grandTotal}{' '}
              <span className="text-secondary small fs-6">
                {convenienceFee > 0 ? '(incl. $30 fee)' : ''}
              </span>
            </div>
          </div>

          <div className="col-lg-3 col-md-4">
            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="btn btn-cinema-red w-100 py-2 fs-6 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
            >
              <span>Continue to Payment</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
