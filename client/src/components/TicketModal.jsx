import React from 'react';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const show = booking.show || {};
  const movie = show.movie || {};
  const theater = show.theater || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content card-dark border-secondary overflow-hidden">
          <div className="modal-header border-secondary py-2">
            <h5 className="modal-title text-light fw-bold">
              <i className="bi bi-ticket-perforated-fill text-danger me-2"></i> Digital Movie Pass
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="ticket-stub p-4 text-light position-relative">
              <div className="row g-4 align-items-center">
                {/* Poster & Booking ID */}
                <div className="col-md-4 text-center border-end border-secondary pe-md-4">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="rounded-3 shadow-sm mb-3 w-75 object-fit-cover"
                    style={{ maxHeight: '220px' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="text-secondary small">BOOKING ID</div>
                  <div className="fw-bold fs-5 text-warning font-monospace">{booking.bookingId}</div>
                  <span
                    className={`badge mt-2 ${
                      booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {booking.status === 'confirmed' ? 'CONFIRMED' : 'CANCELLED'}
                  </span>
                </div>

                {/* Details */}
                <div className="col-md-8 ps-md-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h3 className="fw-bold mb-1 text-light">{movie.title}</h3>
                      <div className="text-secondary small">
                        {movie.language} • {movie.certificate} • {movie.duration} min
                      </div>
                    </div>
                    <span className="badge bg-danger fs-6 px-3 py-2 brand-font">IMOVIES PASS</span>
                  </div>

                  <hr className="border-secondary my-3" />

                  <div className="row g-3 small">
                    <div className="col-6">
                      <div className="text-secondary">THEATER & AUDI</div>
                      <div className="fw-bold text-light">{theater.name || 'Cinema Hall'}</div>
                      <div className="text-muted small">{show.screenName || 'Audi 1'}</div>
                    </div>

                    <div className="col-6">
                      <div className="text-secondary">DATE & TIME</div>
                      <div className="fw-bold text-light">{show.date}</div>
                      <div className="text-warning fw-semibold">{show.time}</div>
                    </div>

                    <div className="col-6">
                      <div className="text-secondary">RESERVED SEATS</div>
                      <div className="fw-bold fs-5 text-success">
                        {booking.seats ? booking.seats.join(', ') : 'None'}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="text-secondary">TOTAL PAID</div>
                      <div className="fw-bold fs-5 text-light">${booking.totalAmount}</div>
                      <div className="text-muted small">{booking.paymentDetails?.method || 'Card'}</div>
                    </div>
                  </div>

                  {/* Barcode representation */}
                  <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                    <div>
                      <div className="font-monospace text-secondary" style={{ letterSpacing: '4px', fontSize: '11px' }}>
                        ||| | ||||| || |||| ||| ||||||| || |||
                      </div>
                      <div className="text-muted small">Show this QR/Barcode at cinema gate</div>
                    </div>
                    <i className="bi bi-qr-code text-light fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary justify-content-between">
            <div className="small text-secondary">
              <i className="bi bi-shield-check text-success me-1"></i> Verified by IMovies Secure Ticketing
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-light" onClick={handlePrint}>
                <i className="bi bi-printer me-1"></i> Print Ticket
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
