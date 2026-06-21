import React from 'react';
import { Calendar } from 'lucide-react';
import type { Reservation } from '../types';

interface ReserveTabProps {
  bookings: Reservation[];
  onCancelBooking: (id: string) => void;
  showToast: (msg: string) => void;
}

export const ReserveTab: React.FC<ReserveTabProps> = ({ bookings, onCancelBooking, showToast }) => {
  
  const handleCancel = (id: string, spaceName: string) => {
    onCancelBooking(id);
    showToast(`Cancelled reservation at ${spaceName}`);
  };

  return (
    <div className="app-main-content app-screen-view active-view" id="tab-panel-reserve">
      <header className="branding-header">
        <div className="brand-logo-pack">
          <span className="brand-logo-name" style={{ fontSize: '22px', fontWeight: 800 }}>
            My Reserves
          </span>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="bookings-empty-state" id="list-empty-bookings-box">
          <div className="bookings-empty-icon-circle">
            <Calendar size={26} />
          </div>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--zyvo-text-main)' }}>
            No Active Bookings
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--zyvo-text-muted)', maxWidth: '250px', margin: '0 auto' }}>
            Reserve a seat from the Discover feed and your digital ticket will appear here.
          </p>
        </div>
      ) : (
        <div id="list-populated-bookings" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map((booking) => (
            <div 
              className="compact-space-card" 
              key={booking.id}
              style={{ gridTemplateColumns: '1fr auto', padding: '16px' }}
            >
              <div className="compact-details">
                <h4 className="compact-title" style={{ fontSize: '16px' }}>{booking.spaceName}</h4>
                <div className="compact-meta-row" style={{ marginTop: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--zyvo-orange)' }}>
                    {booking.deskId}
                  </span>
                  <span>•</span>
                  <span>{booking.duration}</span>
                  <span>•</span>
                  <span>{booking.time}</span>
                </div>
                <div 
                  className="compact-meta-row" 
                  style={{ 
                    marginTop: '6px', 
                    fontFamily: 'monospace', 
                    fontSize: '11px', 
                    color: 'var(--zyvo-text-disclaimer)' 
                  }}
                >
                  CODE: {booking.ticketCode}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  className="btn-compact-reserve" 
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.08)', 
                    color: '#EF4444', 
                    borderColor: 'rgba(239, 68, 68, 0.15)' 
                  }} 
                  onClick={() => handleCancel(booking.id, booking.spaceName)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: '80px' }} />
    </div>
  );
};
