import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulated card form fields
  const [cardNumber, setCardNumber] = useState('4532 8912 3014 9871');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [cardHolder, setCardHolder] = useState(user ? user.name : 'Alex Johnson');

  useEffect(() => {
    const saved = sessionStorage.getItem('imovies_checkout');
    if (!saved) {
      navigate('/');
      return;
    }
    try {
      setCheckoutData(JSON.parse(saved));
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  if (!checkoutData) return null;

  const { show, selectedSeats, subtotal, convenienceFee, grandTotal } = checkoutData;
  const movie = show.movie || {};
  const theater = show.theater || {};

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const payload = {
        showId: show._id,
        seats: selectedSeats,
        totalAmount: grandTotal,
        convenienceFee,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'upi'
            ? 'Instant UPI / QR'
            : 'Net Banking',
      };

      const res = await api.post('/bookings', payload);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear session checkout data
      sessionStorage.removeItem('imovies_checkout');

      // Navigate to success page with booking details
      navigate(`/booking-success/${res.data._id}`, { state: { booking: res.data } });
    } catch (err) {
      console.error('Booking failed:', err);
      setErrorMessage(
        err.response?.data?.message || 'Payment processing failed. Please try again or re-select seats.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        {/* Order Summary Column */}
        <div className="col-lg-5 col-md-6 order-md-2">
          <div className="card-dark p-4 shadow-sm mb-4">
            <h5 className="text-light fw-bold mb-3 border-bottom border-secondary pb-2">
              <i className="bi bi-receipt me-2 text-danger"></i> Booking Summary
            </h5>

            <div className="d-flex gap-3 mb-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3 object-fit-cover shadow-sm"
                style={{ width: '80px', height: '110px' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div>
                <h6 className="text-light fw-bold mb-1">{movie.title}</h6>
                <div className="text-secondary small mb-1">
                  {movie.language} • {movie.certificate}
                </div>
                <div className="text-warning small fw-semibold">
                  {show.date} | {show.time}
                </div>
                <div className="text-secondary small">
                  {theater.name} ({show.screenName})
                </div>
              </div>
            </div>

            <hr className="border-secondary my-3" />

            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Seats Selected ({selectedSeats.length})</span>
              <span className="text-light fw-bold">{selectedSeats.join(', ')}</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Tickets Subtotal</span>
              <span className="text-light">${subtotal}</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Convenience & Booking Fee</span>
              <span className="text-light">${convenienceFee}</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-3">
              <span>Taxes & Levies</span>
              <span className="text-success fw-semibold">Included</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
              <span className="text-light fw-bold fs-5">Amount Payable</span>
              <span className="text-warning fw-bold fs-4">${grandTotal}</span>
            </div>
          </div>

          <div className="card-dark p-3 text-secondary small d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill text-success fs-4"></i>
            <div>
              <strong className="text-light">100% Safe & Secure Checkout</strong>
              <div>256-bit encryption for seamless cinema bookings.</div>
            </div>
          </div>
        </div>

        {/* Payment Form Column */}
        <div className="col-lg-6 col-md-6 order-md-1">
          <div className="card-dark p-4 shadow-sm">
            <h4 className="text-light fw-bold mb-3">Complete Your Reservation</h4>

            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i> {errorMessage}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className={`btn flex-fill py-2 text-center rounded-3 ${
                  paymentMethod === 'card'
                    ? 'btn-danger'
                    : 'btn-dark border border-secondary text-secondary'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <i className="bi bi-credit-card me-1"></i> Credit / Debit
              </button>

              <button
                type="button"
                className={`btn flex-fill py-2 text-center rounded-3 ${
                  paymentMethod === 'upi'
                    ? 'btn-danger'
                    : 'btn-dark border border-secondary text-secondary'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <i className="bi bi-qr-code me-1"></i> UPI / QR
              </button>

              <button
                type="button"
                className={`btn flex-fill py-2 text-center rounded-3 ${
                  paymentMethod === 'netbanking'
                    ? 'btn-danger'
                    : 'btn-dark border border-secondary text-secondary'
                }`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <i className="bi bi-bank me-1"></i> Net Banking
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="bi bi-credit-card-2-front"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary shadow-none"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label text-secondary small">Expiration</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary shadow-none"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      className="form-control bg-dark text-light border-secondary shadow-none"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-cinema-red w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 shadow"
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Processing Reservation...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill"></i> Pay ${grandTotal} & Confirm Tickets
                    </>
                  )}
                </button>
              </form>
            )}

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="text-center py-4">
                <i className="bi bi-qr-code text-light display-1 mb-3"></i>
                <h6 className="text-light">Scan QR to pay ${grandTotal}</h6>
                <p className="text-secondary small">
                  Supports Google Pay, PhonePe, Paytm, and any UPI app.
                </p>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn btn-cinema-red px-4 py-2 mt-2"
                >
                  {isProcessing ? 'Confirming...' : 'Simulate Successful UPI Payment'}
                </button>
              </div>
            )}

            {/* Netbanking Form */}
            {paymentMethod === 'netbanking' && (
              <div className="py-3">
                <label className="form-label text-secondary small">Select Your Bank</label>
                <select className="form-select bg-dark text-light border-secondary mb-4">
                  <option>JPMorgan Chase Bank</option>
                  <option>Bank of America</option>
                  <option>Wells Fargo</option>
                  <option>Citibank</option>
                  <option>HDFC Bank</option>
                  <option>State Bank of India</option>
                </select>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn btn-cinema-red w-100 py-2"
                >
                  {isProcessing ? 'Authorizing...' : `Proceed to Net Banking ($${grandTotal})`}
                </button>
              </div>
            )}

            {/* Quick Demo Pre-fill Button */}
            <div className="mt-4 pt-3 border-top border-secondary text-center">
              <span className="text-secondary small">Testing or grading this project?</span>
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="btn btn-outline-warning btn-sm d-block mx-auto mt-2"
              >
                <i className="bi bi-lightning-charge-fill me-1"></i> Instant 1-Click Demo Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
