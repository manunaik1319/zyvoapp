import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Zap } from 'lucide-react';
import type { Space } from '../types';

interface SeatSelectionProps {
  space: Space;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (spaceName: string, deskId: string, duration: string, price: number, paymentMethod: string) => void;
}

interface Seat {
  id: string;
  isOccupied: boolean;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
  space,
  onBack,
  onClose,
  onConfirm
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [selectedPayment, setSelectedPayment] = useState<string>('wallet');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('Choose a focus seat');
  const [errorStyle, setErrorStyle] = useState<boolean>(false);
  const [shaking, setShaking] = useState<boolean>(false);

  // Generate seats based on space id seed
  useEffect(() => {
    const tempSeats: Seat[] = [];
    let seed = space.id.length + space.rating;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 1; i <= 18; i++) {
      tempSeats.push({
        id: `A-${i}`,
        isOccupied: random() < 0.45
      });
    }
    setSeats(tempSeats);
    setSelectedSeat(null);
    setDurationHours(2);
    setErrorMessage('Choose a focus seat');
    setErrorStyle(false);
  }, [space]);

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

  const handleConfirmClick = () => {
    if (!selectedSeat) {
      setErrorMessage('⚠️ Select a seat first!');
      setErrorStyle(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      return;
    }

    onConfirm(
      space.name,
      selectedSeat,
      `${durationHours} Hours`,
      getPrice(),
      selectedPayment
    );
  };

  const isQuietSpace = space.category === 'Quiet Zone' || space.name.toLowerCase().includes('reading room') || (space.categories && space.categories.includes('Libraries'));

  return (
    <div className={`payment-flow-view ${isQuietSpace ? 'reading-room-theme' : ''}`} id="seat-selection-overlay">
      {/* Header */}
      <div className="payment-flow-header">
        <button type="button" className="payment-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Select Focus Seat</h2>
        <button type="button" className="payment-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="payment-scroll-content">
        {/* Progress Indicators */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: 800, color: 'var(--zyvo-text-muted)', marginBottom: '4px' }}>
          <span style={{ color: 'var(--zyvo-green)' }}>1. ABOUT</span>
          <span>➔</span>
          <span style={{ color: 'var(--zyvo-orange)' }}>2. SEAT SELECTION</span>
          <span>➔</span>
          <span>3. CHECKOUT</span>
        </div>

        {/* Space Mini Info Card */}
        <div className="checkout-summary-card" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.65)' }}>
          <strong style={{ fontSize: '13px' }}>{space.name}</strong>
          <span style={{ fontSize: '10px', color: 'var(--zyvo-text-muted)' }}>{space.layout}</span>
        </div>

        {/* Desk Seat Picker Grid */}
        <div className="space-layout-card" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div className="space-layout-head" style={{ marginBottom: '10px' }}>
            <strong 
              id="selected-desk-prompt"
              style={{ color: errorStyle ? '#EF4444' : (selectedSeat ? 'var(--zyvo-orange)' : '') }}
            >
              {errorMessage}
            </strong>
            <span>{isQuietSpace ? 'Select Reading Desk' : 'Select Seat'}</span>
          </div>

          <div 
            className={`seat-map-grid-box ${shaking ? 'shake' : ''}`} 
            id="sheet-seat-grid"
            style={{ 
              transition: 'transform 0.15s ease',
              transform: shaking ? 'translateX(6px)' : 'none',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '6px'
            }}
          >
            {seats.map((seat) => (
              <div 
                key={seat.id}
                className={`seat-cell ${seat.isOccupied ? 'occupied' : ''} ${selectedSeat === seat.id ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
                style={
                  selectedSeat === seat.id && isQuietSpace 
                    ? { background: '#0F766E', borderColor: '#0F766E' } 
                    : {}
                }
              >
                {seat.id.split('-')[1]}
              </div>
            ))}
          </div>

          <div className="legends-flex-row" style={{ marginTop: '12px' }}>
            <div className="legend-bullet-item">
              <span className="legend-bullet-color" style={{ background: '#FFFFFF', border: '1.5px solid var(--zyvo-border)' }} />
              Available
            </div>
            <div className="legend-bullet-item">
              <span 
                className="legend-bullet-color" 
                style={{ background: isQuietSpace ? '#0F766E' : 'var(--zyvo-orange)' }} 
              />
              Selected
            </div>
            <div className="legend-bullet-item">
              <span className="legend-bullet-color" style={{ background: 'rgba(0, 0, 0, 0.05)' }} />
              Occupied
            </div>
          </div>
        </div>

        {/* Quiet Study Guidelines (Conditional) */}
        {isQuietSpace && (
          <div className="space-layout-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid #0F766E', background: 'rgba(15, 118, 110, 0.05)', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#0F766E' }}>
              <span>🤫</span> Quiet Study Guidelines
            </div>
            <p style={{ fontSize: '10px', color: '#115E59', lineHeight: 1.4, margin: 0 }}>
              This is a verified <strong>silent zone</strong>. No phone calls or laptop keyboard noise are permitted on desk rows. Perfect for deep concentration, book reading, and exam preparation. Supervised floor rules apply.
            </p>
          </div>
        )}

        {/* Booking Duration Picker */}
        <div className="space-layout-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)' }}>
          <strong>Focus Duration</strong>
          <div className="hours-picker-flex">
            {[2, 4, 8].map((h) => (
              <button 
                key={h}
                className={`hour-chip-btn ${durationHours === h ? 'active' : ''}`}
                style={
                  durationHours === h && isQuietSpace 
                    ? { background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', borderColor: '#0F766E' } 
                    : {}
                }
                onClick={() => setDurationHours(h)}
                type="button"
              >
                {h} Hours
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Quick-Select */}
        <div className="payment-method-block">
          <span className="payment-section-label" style={{ fontSize: '10px', fontWeight: 800 }}>SELECT PAYMENT METHOD</span>
          <div className="payment-method-grid">
            <button 
              className={`payment-option ${selectedPayment === 'wallet' ? 'active' : ''}`}
              style={selectedPayment === 'wallet' && isQuietSpace ? { borderColor: '#0F766E', background: 'rgba(15,118,110,0.05)' } : {}}
              onClick={() => setSelectedPayment('wallet')}
              type="button"
            >
              <span>👛</span>
              <strong>Wallet</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'card' ? 'active' : ''}`}
              style={selectedPayment === 'card' && isQuietSpace ? { borderColor: '#0F766E', background: 'rgba(15,118,110,0.05)' } : {}}
              onClick={() => setSelectedPayment('card')}
              type="button"
            >
              <span>💳</span>
              <strong>Card</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'upi' ? 'active' : ''}`}
              style={selectedPayment === 'upi' && isQuietSpace ? { borderColor: '#0F766E', background: 'rgba(15,118,110,0.05)' } : {}}
              onClick={() => setSelectedPayment('upi')}
              type="button"
            >
              <span>📲</span>
              <strong>UPI</strong>
            </button>
            <button 
              className={`payment-option ${selectedPayment === 'net' ? 'active' : ''}`}
              style={selectedPayment === 'net' && isQuietSpace ? { borderColor: '#0F766E', background: 'rgba(15,118,110,0.05)' } : {}}
              onClick={() => setSelectedPayment('net')}
              type="button"
            >
              <span>🏦</span>
              <strong>Net</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Summary Row & Action Button */}
      <div className="payment-flow-footer-btn-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.7)' }}>
        <div className="sheet-pricing-row" style={{ padding: '0 4px' }}>
          <div>
            <strong style={{ fontSize: '13px', color: 'var(--zyvo-text-main)' }}>Total Billing</strong>
            <p style={{ fontSize: '9px', color: 'var(--zyvo-text-disclaimer)' }}>Hourly discount applied</p>
          </div>
          <div className="pricing-box-col" style={{ alignItems: 'flex-end' }}>
            <span className="pricing-text-val" style={{ color: isQuietSpace ? '#0F766E' : '' }}>₹{getPrice()}</span>
            <span className="pricing-sub-val">₹{Math.round(getPrice() / durationHours)}/hr avg</span>
          </div>
        </div>
        
        <button 
          className="payment-primary-cta-btn" 
          onClick={handleConfirmClick}
          style={isQuietSpace ? { background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)' } : {}}
          type="button"
        >
          <Zap size={14} fill="currentColor" />
          Confirm Seat & Book
        </button>
      </div>
    </div>
  );
};
