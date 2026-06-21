import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import type { Space } from '../types';

interface BookingSheetProps {
  space: Space | null;
  onClose: () => void;
  onConfirmBooking: (spaceName: string, deskId: string, duration: string, price: number) => void;
}

interface Seat {
  id: string;
  isOccupied: boolean;
}

export const BookingSheet: React.FC<BookingSheetProps> = ({ space, onClose, onConfirmBooking }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [selectedPayment, setSelectedPayment] = useState<string>('wallet');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('Choose a focus seat');
  const [errorStyle, setErrorStyle] = useState<boolean>(false);
  const [shaking, setShaking] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sync open state animation
  useEffect(() => {
    if (space) {
      setIsOpen(true);
      // Generate randomized but persistent seats for this space
      const tempSeats: Seat[] = [];
      // Use space ID string length + rating as seed to make it consistent but different per space
      let seed = space.id.length + space.rating;
      const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      for (let i = 1; i <= 18; i++) {
        tempSeats.push({
          id: `A-${i}`,
          isOccupied: random() < 0.45 // 45% occupancy rate
        });
      }
      setSeats(tempSeats);
      setSelectedSeat(null);
      setDurationHours(2);
      setErrorMessage('Choose a focus seat');
      setErrorStyle(false);
    } else {
      setIsOpen(false);
    }
  }, [space]);

  if (!space) return null;

  // Calculate pricing based on duration and hourly rate
  const getPrice = () => {
    const basePrice = space.pricePerHour * durationHours;
    if (durationHours === 2) return basePrice;
    if (durationHours === 4) return Math.round(basePrice * 0.88); // 12% discount
    return Math.round(basePrice * 0.78); // 22% discount
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;
    setSelectedSeat(seat.id);
    setErrorMessage(`Seat ${seat.id} Selected`);
    setErrorStyle(false);
  };

  const handleConfirm = () => {
    if (!selectedSeat) {
      setErrorMessage('⚠️ Select a seat first!');
      setErrorStyle(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      return;
    }

    onConfirmBooking(
      space.name,
      selectedSeat,
      `${durationHours} Hours`,
      getPrice()
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`booking-sheet-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={() => {
          setIsOpen(false);
          setTimeout(onClose, 350);
        }}
        id="sheet-backdrop"
      />

      {/* Main Bottom Sheet */}
      <div className={`booking-sheet-panel ${isOpen ? 'active' : ''}`} id="sheet-panel">
        {/* Handle */}
        <div className="sheet-handle-bar" onClick={() => {
          setIsOpen(false);
          setTimeout(onClose, 350);
        }} />

        {/* Header */}
        <div className="sheet-head-row">
          <span className="sheet-title-text" id="sheet-header-title">{space.name}</span>
          <button 
            className="sheet-close-btn" 
            onClick={() => {
              setIsOpen(false);
              setTimeout(onClose, 350);
            }}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Gallery */}
        <div className="space-detail-hero">
          <div className="space-detail-main-image">
            <img src={space.allImages[0]} alt="Main space view" id="detail-main-image" />
            <span className="space-detail-photo-badge" id="detail-photo-badge">
              {space.allImages.length} photos
            </span>
          </div>
          <div className="space-detail-side-stack">
            <div className="space-detail-side-image">
              <img src={space.allImages[1]} alt="Side space view 1" id="detail-side-image-one" />
            </div>
            <div className="space-detail-side-image">
              <img src={space.allImages[2]} alt="Side space view 2" id="detail-side-image-two" />
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="space-detail-summary">
          <div className="space-detail-meta-row" id="detail-meta-row">
            {space.amenities.map((item, idx) => (
              <span className="space-detail-chip" key={idx}>
                {item}
              </span>
            ))}
          </div>
          <p className="space-detail-copy" id="detail-description">
            {space.description}
          </p>
        </div>

        {/* Additional info pills */}
        <div className="space-detail-grid">
          <div className="space-info-card">
            <span>Location</span>
            <strong id="detail-location">{space.locationText}</strong>
          </div>
          <div className="space-info-card">
            <span>Best For</span>
            <strong id="detail-best-for">{space.bestFor}</strong>
          </div>
          <div className="space-info-card">
            <span>Opening Hours</span>
            <strong id="detail-hours">{space.hours}</strong>
          </div>
          <div className="space-info-card">
            <span>Ambience</span>
            <strong id="detail-ambience">{space.ambience}</strong>
          </div>
        </div>

        {/* Floor zone preview map */}
        <div className="space-layout-card">
          <div className="space-layout-head">
            <strong>Interactive Floor zones</strong>
            <span id="detail-layout-caption">{space.layout}</span>
          </div>
          <div className="mini-floor-layout">
            <div className="floor-zone focus">Focus Zone (A)</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div className="floor-zone quiet">Quiet Desk (B)</div>
              <div className="floor-zone cafe">Cafe zone (C)</div>
            </div>
          </div>
        </div>

        {/* Desk Seat Picker */}
        <div className="space-layout-card">
          <div className="space-layout-head" style={{ marginBottom: '8px' }}>
            <strong 
              id="selected-desk-prompt"
              style={{ color: errorStyle ? '#EF4444' : (selectedSeat ? 'var(--zyvo-orange)' : '') }}
            >
              {errorMessage}
            </strong>
            <span>Select Seat</span>
          </div>

          <div 
            className={`seat-map-grid-box ${shaking ? 'shake' : ''}`} 
            id="sheet-seat-grid"
            style={{ 
              transition: 'transform 0.15s ease',
              transform: shaking ? 'translateX(6px)' : 'none'
            }}
          >
            {seats.map((seat) => (
              <div 
                key={seat.id}
                className={`seat-cell ${seat.isOccupied ? 'occupied' : ''} ${selectedSeat === seat.id ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.id}
              </div>
            ))}
          </div>

          <div className="legends-flex-row" style={{ marginTop: '12px' }}>
            <div className="legend-bullet-item">
              <span className="legend-bullet-color" style={{ background: '#FFFFFF', border: '1.5px solid var(--zyvo-border)' }} />
              Available
            </div>
            <div className="legend-bullet-item">
              <span className="legend-bullet-color" style={{ background: 'var(--zyvo-orange)' }} />
              Selected
            </div>
            <div className="legend-bullet-item">
              <span className="legend-bullet-color" style={{ background: 'rgba(0, 0, 0, 0.05)' }} />
              Occupied
            </div>
          </div>
        </div>

        {/* Booking Duration */}
        <div className="space-layout-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Focus Duration</strong>
          <div className="hours-picker-flex">
            {[2, 4, 8].map((h) => (
              <button 
                key={h}
                className={`hour-chip-btn ${durationHours === h ? 'active' : ''}`}
                onClick={() => updateDurationPrice(h)}
                type="button"
              >
                {h} Hours
              </button>
            ))}
          </div>
        </div>

        {/* Payment options */}
        <div className="payment-method-block">
          <span className="payment-section-label">SELECT PAYMENT METHOD</span>
          <div className="payment-method-grid">
            <button 
              className={`payment-option ${selectedPayment === 'wallet' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('wallet')}
              type="button"
            >
              <span>👛</span>
              <strong>Wallet</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'card' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('card')}
              type="button"
            >
              <span>💳</span>
              <strong>Card</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'upi' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('upi')}
              type="button"
            >
              <span>📲</span>
              <strong>UPI</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'net' ? 'active' : ''}`}
              onClick={() => setSelectedPayment('net')}
              type="button"
            >
              <span>🏦</span>
              <strong>Net</strong>
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="sheet-bottom-action">
          <div className="sheet-pricing-row">
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--zyvo-text-main)' }}>Total Billing</strong>
              <p style={{ fontSize: '10px', color: 'var(--zyvo-text-disclaimer)' }}>Hourly discount applied</p>
            </div>
            <div className="pricing-box-col">
              <span className="pricing-text-val" id="price-amount-lbl">₹{getPrice()}</span>
              <span className="pricing-sub-val">₹{Math.round(getPrice() / durationHours)}/hr avg</span>
            </div>
          </div>
          <button 
            className="btn-reserve-cta" 
            onClick={handleConfirm}
            style={{ width: '100%' }}
            type="button"
          >
            <Zap size={14} fill="currentColor" />
            Confirm Reservation
          </button>
        </div>
      </div>
    </>
  );

  function updateDurationPrice(hours: number) {
    setDurationHours(hours);
  }
};
