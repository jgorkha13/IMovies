import React from 'react';

const SeatMatrix = ({
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  ticketPrice = 250,
  vipPrice = 450,
}) => {
  // Rows: A-F are Standard, G-H are VIP
  const standardRows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const vipRows = ['G', 'H'];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const renderSeat = (row, col, isVip = false) => {
    const seatId = `${row}${col}`;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    let className = 'seat ';
    if (isBooked) {
      className += 'booked';
    } else if (isSelected) {
      className += 'selected';
    } else if (isVip) {
      className += 'vip available';
    } else {
      className += 'available';
    }

    return (
      <button
        key={seatId}
        type="button"
        disabled={isBooked}
        className={className}
        onClick={() => onSeatToggle(seatId, isVip ? vipPrice : ticketPrice)}
        title={
          isBooked
            ? `Seat ${seatId} (Sold Out)`
            : `Seat ${seatId} - $${isVip ? vipPrice : ticketPrice} (${isVip ? 'VIP' : 'Standard'})`
        }
      >
        {col}
      </button>
    );
  };

  return (
    <div className="card-dark p-4 text-center my-4">
      {/* Screen representation */}
      <div className="screen-container">
        <div className="cinema-screen"></div>
        <div className="screen-label">
          <i className="bi bi-display me-2"></i> CINEMA SCREEN (ALL EYES THIS WAY)
        </div>
      </div>

      {/* Seat Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 my-4 p-3 bg-dark rounded-3 border border-secondary border-opacity-50 small">
        <div className="d-flex align-items-center gap-2">
          <span className="seat available" style={{ width: '22px', height: '20px' }}></span>
          <span className="text-secondary">Standard (${ticketPrice})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat vip available" style={{ width: '22px', height: '20px' }}></span>
          <span className="text-secondary">VIP Recliner (${vipPrice})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat selected" style={{ width: '22px', height: '20px' }}></span>
          <span className="text-secondary">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat booked" style={{ width: '22px', height: '20px' }}></span>
          <span className="text-secondary">Sold Out</span>
        </div>
      </div>

      {/* Seating Layout */}
      <div className="overflow-auto py-2">
        {/* Standard Section */}
        <div className="mb-4">
          <div className="text-secondary small fw-semibold text-start mb-2 px-3 border-bottom border-secondary pb-1">
            STANDARD SECTION (${ticketPrice})
          </div>
          {standardRows.map((row) => (
            <div key={row} className="d-flex align-items-center justify-content-center mb-1">
              <span className="text-secondary fw-bold me-3" style={{ width: '20px' }}>
                {row}
              </span>
              <div className="d-flex align-items-center">
                {columns.slice(0, 5).map((col) => renderSeat(row, col, false))}
                {/* Aisle gap */}
                <div style={{ width: '24px' }}></div>
                {columns.slice(5, 10).map((col) => renderSeat(row, col, false))}
              </div>
              <span className="text-secondary fw-bold ms-3" style={{ width: '20px' }}>
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* VIP Section */}
        <div>
          <div className="text-warning small fw-semibold text-start mb-2 px-3 border-bottom border-warning border-opacity-50 pb-1">
            <i className="bi bi-star-fill me-1"></i> VIP PRIME RECLINERS (${vipPrice})
          </div>
          {vipRows.map((row) => (
            <div key={row} className="d-flex align-items-center justify-content-center mb-1">
              <span className="text-warning fw-bold me-3" style={{ width: '20px' }}>
                {row}
              </span>
              <div className="d-flex align-items-center">
                {columns.slice(0, 5).map((col) => renderSeat(row, col, true))}
                {/* Aisle gap */}
                <div style={{ width: '24px' }}></div>
                {columns.slice(5, 10).map((col) => renderSeat(row, col, true))}
              </div>
              <span className="text-warning fw-bold ms-3" style={{ width: '20px' }}>
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMatrix;
