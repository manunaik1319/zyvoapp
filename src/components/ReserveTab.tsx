import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, QrCode as QrIcon, MapPin, Clock, ShieldAlert, Star, Zap } from 'lucide-react';
import type { Reservation } from '../types';
import { QrCode } from './QrCode';

interface ReserveTabProps {
  bookings: Reservation[];
  onCancelBooking: (id: string) => void;
  showToast: (msg: string) => void;
  onSwitchTab?: (tabName: string) => void;
  onNavigateToSpace?: (spaceId: string) => void;
}

const PAST_BOOKINGS = [
  {
    id: 'past-1',
    spaceName: 'Madhapur Study Hall',
    deskId: 'Desk Row B-12',
    duration: '4 Hours',
    time: '11:52 PM - 3:52 AM',
    date: 'June 18, 2026',
    price: 380,
    status: 'Completed',
    creditsEarned: 40,
    ticketCode: 'ZYV-5832-C'
  },
  {
    id: 'past-2',
    spaceName: 'Ameerpet Library Hub',
    deskId: 'Desk A-2',
    duration: '2 Hours',
    time: '09:15 AM - 11:15 AM',
    date: 'June 15, 2026',
    price: 220,
    status: 'Completed',
    creditsEarned: 20,
    ticketCode: 'ZYV-1029-C'
  }
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const ReserveTab: React.FC<ReserveTabProps> = ({ 
  bookings, 
  onCancelBooking, 
  showToast,
  onSwitchTab,
  onNavigateToSpace
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isLoading, setIsLoading] = useState(true);
  const [localBookings, setLocalBookings] = useState<Reservation[]>([]);
  const [fadingCardId, setFadingCardId] = useState<string | null>(null);
  const [walletTicketBooking, setWalletTicketBooking] = useState<Reservation | null>(null);
  const [confirmCancelBooking, setConfirmCancelBooking] = useState<Reservation | null>(null);
  const [extendingBooking, setExtendingBooking] = useState<Reservation | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    setIsLoading(true);
    setVisibleCards(new Set());
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Stagger animate cards in
  useEffect(() => {
    if (!isLoading) {
      const ids = activeTab === 'active'
        ? localBookings.map(b => b.id)
        : PAST_BOOKINGS.map(b => b.id);
      ids.forEach((id, i) => {
        setTimeout(() => {
          setVisibleCards(prev => new Set([...prev, id]));
        }, i * 100);
      });
    }
  }, [isLoading, activeTab, localBookings]);

  const handleCancelClick = (booking: Reservation) => {
    setConfirmCancelBooking(booking);
  };

  const handleConfirmCancel = () => {
    if (!confirmCancelBooking) return;
    const targetId = confirmCancelBooking.id;
    const targetName = confirmCancelBooking.spaceName;
    setFadingCardId(targetId);
    setConfirmCancelBooking(null);
    setTimeout(() => {
      onCancelBooking(targetId);
      showToast(`Cancelled reservation at ${targetName}`);
      setFadingCardId(null);
    }, 400);
  };

  const handleExtendClick = (booking: Reservation) => {
    setExtendingBooking(booking);
  };

  const handleConfirmExtension = (hours: number) => {
    if (!extendingBooking) return;
    setLocalBookings(prev => prev.map(b => {
      if (b.id === extendingBooking.id) {
        const currentHours = parseFloat(b.duration) || 2;
        return { ...b, duration: `${currentHours + hours} Hours` };
      }
      return b;
    }));
    showToast(`Session extended by ${hours === 0.5 ? '30 mins' : `${hours} ${hours === 1 ? 'hour' : 'hours'}`}! ⚡`);
    setExtendingBooking(null);
  };

  const getStatusConfig = (bookingId: string) => {
    const index = localBookings.findIndex(b => b.id === bookingId);
    if (index === 0) return { text: 'Active', color: '#059669', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.2)', dot: '#10B981', pulse: true };
    if (index === 1) return { text: 'Starting Soon', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.2)', dot: '#F59E0B', pulse: false };
    return { text: 'Upcoming', color: '#4F46E5', bg: 'rgba(79, 70, 229, 0.08)', border: 'rgba(79, 70, 229, 0.18)', dot: '#6366F1', pulse: false };
  };

  const renderStatusBadge = (bookingId: string) => {
    const cfg = getStatusConfig(bookingId);
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '20px',
        letterSpacing: '0.01em', whiteSpace: 'nowrap'
      }}>
        <span style={{
          width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot,
          ...(cfg.pulse ? { animation: 'statusPulse 1.8s ease-in-out infinite' } : {})
        }} />
        {cfg.text}
      </span>
    );
  };

  const renderPastStatusBadge = (status: string) => {
    const cfg = status === 'Cancelled'
      ? { text: 'Cancelled', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.07)', border: 'rgba(220, 38, 38, 0.18)', dot: '#EF4444' }
      : { text: 'Completed', color: '#475569', bg: 'rgba(71, 85, 105, 0.07)', border: 'rgba(71, 85, 105, 0.18)', dot: '#64748B' };
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '20px'
      }}>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: cfg.dot }} />
        {cfg.text}
      </span>
    );
  };

  // Premium floating study illustration
  const StudyIllustration = () => (
    <div className="reserve-empty-illustration">
      <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
        {/* Background rings */}
        <circle cx="65" cy="65" r="58" fill="rgba(79,70,229,0.06)" />
        <circle cx="65" cy="65" r="44" fill="rgba(79,70,229,0.05)" />
        {/* Desk surface */}
        <rect x="18" y="82" width="94" height="8" rx="4" fill="rgba(79,70,229,0.12)" />
        {/* Desk legs */}
        <rect x="26" y="90" width="6" height="18" rx="3" fill="rgba(79,70,229,0.1)" />
        <rect x="98" y="90" width="6" height="18" rx="3" fill="rgba(79,70,229,0.1)" />
        {/* Laptop */}
        <rect x="38" y="58" width="50" height="32" rx="5" fill="#4F46E5" opacity="0.85" />
        <rect x="40" y="60" width="46" height="28" rx="3" fill="#6366F1" opacity="0.6" />
        {/* Screen content lines */}
        <rect x="44" y="65" width="25" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        <rect x="44" y="71" width="18" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
        <rect x="44" y="76" width="22" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        {/* Laptop base */}
        <rect x="32" y="90" width="62" height="4" rx="2" fill="#4338CA" opacity="0.5" />
        {/* Person head */}
        <circle cx="65" cy="42" r="12" fill="#FEE2E2" />
        {/* Hair */}
        <path d="M53 38c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="#1E293B" />
        {/* Eyes */}
        <circle cx="61" cy="42" r="1.5" fill="#1E293B" />
        <circle cx="69" cy="42" r="1.5" fill="#1E293B" />
        {/* Smile */}
        <path d="M61 46c2 2 6 2 8 0" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Body / shirt */}
        <path d="M53 56c3-5 24-5 24 0v26H53V56z" fill="#4F46E5" opacity="0.7" />
        {/* Arms */}
        <path d="M53 62c-8 2-10 8-8 14" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M77 62c8 2 10 8 8 14" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        {/* Book floating left */}
        <rect x="14" y="60" width="18" height="22" rx="3" fill="#10B981" opacity="0.75" transform="rotate(-10 14 60)" />
        <rect x="16" y="63" width="12" height="2" rx="1" fill="rgba(255,255,255,0.6)" transform="rotate(-10 14 60)" />
        <rect x="16" y="68" width="10" height="2" rx="1" fill="rgba(255,255,255,0.45)" transform="rotate(-10 14 60)" />
        {/* Coffee cup right */}
        <rect x="98" y="68" width="14" height="14" rx="3" fill="#F59E0B" opacity="0.8" />
        <path d="M112 73c3 0 4 6 0 6" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Stars */}
        <circle cx="22" cy="28" r="2" fill="#FCD34D" opacity="0.7" />
        <circle cx="106" cy="22" r="3" fill="#A5B4FC" opacity="0.6" />
        <circle cx="112" cy="52" r="1.5" fill="#6EE7B7" opacity="0.7" />
      </svg>
    </div>
  );

  return (
    <div
      className="reserve-tab-root app-screen-view active-view"
      id="tab-panel-reserve"
    >
      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="reserve-header">
        <div className="reserve-greeting">
          <h1 className="reserve-greeting-title">{getGreeting()}, Manu 👋</h1>
          <p className="reserve-greeting-sub">
            {localBookings.length > 0
              ? `${localBookings.length} active ${localBookings.length === 1 ? 'reservation' : 'reservations'} ready`
              : 'No active reservations'}
          </p>
        </div>

        {/* Segment control */}
        <div className="reserve-segment">
          <button
            type="button"
            className={`reserve-segment-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active
            {localBookings.length > 0 && (
              <span className="reserve-segment-count">{localBookings.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`reserve-segment-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            History
          </button>
        </div>
      </header>

      {/* ── STATS ROW ─────────────────────────────────────── */}
      {activeTab === 'active' && (
        <div className="reserve-stats-row">
          <div className="reserve-stat-pill">
            <span className="reserve-stat-icon" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <span className="reserve-stat-label">Active</span>
              <strong className="reserve-stat-value">{localBookings.length}</strong>
            </div>
          </div>
          <div className="reserve-stat-pill">
            <span className="reserve-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
              <Clock size={12} />
            </span>
            <div>
              <span className="reserve-stat-label">Study hrs</span>
              <strong className="reserve-stat-value">14.5</strong>
            </div>
          </div>
          <div className="reserve-stat-pill">
            <span className="reserve-stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706' }}>
              <Star size={12} />
            </span>
            <div>
              <span className="reserve-stat-label">Points</span>
              <strong className="reserve-stat-value">420</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="reserve-content">

        {isLoading ? (
          /* SKELETON SHIMMER */
          <>
            <div className="reserve-shimmer" />
            <div className="reserve-shimmer" style={{ animationDelay: '0.12s' }} />
          </>

        ) : activeTab === 'active' ? (
          localBookings.length === 0 ? (
            /* EMPTY STATE */
            <div className="reserve-empty">
              <StudyIllustration />
              <h3 className="reserve-empty-title">No Reservations Yet</h3>
              <p className="reserve-empty-sub">
                Find the perfect study space and reserve your first seat.
              </p>
              {onSwitchTab && (
                <button
                  type="button"
                  className="reserve-explore-btn"
                  onClick={() => onSwitchTab('discover')}
                >
                  <Zap size={13} />
                  Explore Spaces
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          ) : (
            /* ACTIVE BOOKING CARDS */
            localBookings.map((booking) => {
              const isVisible = visibleCards.has(booking.id);
              const isFading = fadingCardId === booking.id;
              return (
                <div
                  key={booking.id}
                  ref={el => { cardRefs.current[booking.id] = el; }}
                  className="reserve-card"
                  style={{
                    opacity: isFading ? 0 : isVisible ? 1 : 0,
                    transform: isFading
                      ? 'scale(0.92) translateY(12px)'
                      : isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: isFading
                      ? 'all 0.4s cubic-bezier(0.4, 0, 1, 1)'
                      : 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  {/* Card Header */}
                  <div className="reserve-card-header">
                    <div className="reserve-card-info">
                      <h3 className="reserve-card-name">{booking.spaceName}</h3>
                      <div className="reserve-card-location">
                        <MapPin size={10} style={{ color: '#4F46E5', flexShrink: 0 }} />
                        <span>Hyderabad</span>
                      </div>
                    </div>
                    {renderStatusBadge(booking.id)}
                  </div>

                  {/* Divider */}
                  <div className="reserve-card-divider" />

                  {/* Details Grid */}
                  <div className="reserve-card-grid">
                    <div className="reserve-card-grid-item">
                      <span className="reserve-card-label">DESK</span>
                      <strong className="reserve-card-value">{booking.deskId}</strong>
                    </div>
                    <div className="reserve-card-grid-item">
                      <span className="reserve-card-label">TIME</span>
                      <strong className="reserve-card-value" style={{ fontSize: '10px' }}>{booking.time || '11:52 PM – 1:52 AM'}</strong>
                    </div>
                    <div className="reserve-card-grid-item">
                      <span className="reserve-card-label">DURATION</span>
                      <strong className="reserve-card-value">{booking.duration}</strong>
                    </div>
                  </div>

                  {/* Booking ID row */}
                  <div className="reserve-card-id-row">
                    <span style={{ color: '#64748B', fontSize: '9px', fontWeight: 600 }}>
                      ID: <span style={{ fontFamily: 'monospace', color: '#0F172A', fontWeight: 700 }}>{booking.ticketCode}</span>
                    </span>
                    <span className="reserve-verified-chip">✓ Verified</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="reserve-card-actions">
                    <button
                      type="button"
                      className="reserve-btn-qr"
                      onClick={() => setWalletTicketBooking(booking)}
                    >
                      <QrIcon size={13} />
                      View QR
                    </button>
                    <button
                      type="button"
                      className="reserve-btn-extend"
                      onClick={() => handleExtendClick(booking)}
                    >
                      <Clock size={11} />
                      Extend
                    </button>
                    {booking.spaceId && onNavigateToSpace && (
                      <button
                        type="button"
                        className="reserve-btn-map"
                        onClick={() => onNavigateToSpace(booking.spaceId!)}
                      >
                        📍
                      </button>
                    )}
                    <button
                      type="button"
                      className="reserve-btn-cancel"
                      onClick={() => handleCancelClick(booking)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* PAST BOOKINGS */
          PAST_BOOKINGS.map((past) => {
            const isVisible = visibleCards.has(past.id);
            return (
              <div
                key={past.id}
                className="reserve-card reserve-card-past"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div className="reserve-card-header">
                  <div className="reserve-card-info">
                    <h3 className="reserve-card-name" style={{ fontSize: '13.5px' }}>{past.spaceName}</h3>
                    <div className="reserve-card-location" style={{ color: '#64748B' }}>
                      <MapPin size={10} style={{ color: '#94A3B8', flexShrink: 0 }} />
                      <span>Hyderabad · {past.date}</span>
                    </div>
                  </div>
                  {renderPastStatusBadge(past.status)}
                </div>

                <div className="reserve-card-divider" style={{ borderStyle: 'dashed' }} />

                <div className="reserve-card-grid">
                  <div className="reserve-card-grid-item">
                    <span className="reserve-card-label">SPOT</span>
                    <strong className="reserve-card-value" style={{ color: '#475569' }}>{past.deskId}</strong>
                  </div>
                  <div className="reserve-card-grid-item">
                    <span className="reserve-card-label">FOCUS TIME</span>
                    <strong className="reserve-card-value" style={{ color: '#475569', fontSize: '9.5px' }}>{past.duration}</strong>
                  </div>
                  <div className="reserve-card-grid-item">
                    <span className="reserve-card-label">CREDITS</span>
                    <strong className="reserve-card-value" style={{ color: '#059669' }}>+{past.creditsEarned} pts</strong>
                  </div>
                </div>

                <div style={{ fontSize: '8.5px', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>
                  ID: <span style={{ fontFamily: 'monospace' }}>{past.ticketCode}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* spacer */}
      <div style={{ height: '24px' }} />

      {/* ══════════════════════════════════════════════════════
          APPLE WALLET QR TICKET OVERLAY
          ══════════════════════════════════════════════════════ */}
      {walletTicketBooking && (
        <div className="wallet-modal-backdrop" onClick={() => setWalletTicketBooking(null)}>
          <div className="wallet-ticket-container" onClick={(e) => e.stopPropagation()}>
            {/* Ticket Branding Header */}
            <div className="wallet-ticket-header">
              <div className="wallet-ticket-brand-row">
                <span className="wallet-ticket-brand-label">ZYVO CAMPUS PASSPORT</span>
                <button
                  type="button"
                  className="wallet-close-btn"
                  onClick={() => setWalletTicketBooking(null)}
                  aria-label="Close"
                >✕</button>
              </div>
              <h2 className="wallet-ticket-space-name">{walletTicketBooking.spaceName}</h2>
              <p className="wallet-ticket-location">
                <MapPin size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                Hyderabad, India
              </p>
            </div>

            {/* Perforation */}
            <div className="wallet-perforation">
              <div className="wallet-perf-notch wallet-perf-notch-left" />
              <div className="wallet-perf-line" />
              <div className="wallet-perf-notch wallet-perf-notch-right" />
            </div>

            {/* Ticket Body */}
            <div className="wallet-ticket-body">
              <div className="wallet-ticket-grid">
                <div>
                  <span className="wallet-field-label">STUDENT</span>
                  <strong className="wallet-field-value">Manu L.</strong>
                </div>
                <div>
                  <span className="wallet-field-label">DESK ASSIGNED</span>
                  <strong className="wallet-field-value">{walletTicketBooking.deskId}</strong>
                </div>
                <div>
                  <span className="wallet-field-label">DURATION</span>
                  <strong className="wallet-field-value">{walletTicketBooking.duration}</strong>
                </div>
                <div>
                  <span className="wallet-field-label">CHECK-IN</span>
                  <strong className="wallet-field-value">{walletTicketBooking.time || '11:52 PM'}</strong>
                </div>
              </div>

              {/* QR Code */}
              <div className="wallet-qr-wrap">
                <div className="wallet-qr-box">
                  <QrCode value={walletTicketBooking.ticketCode} size={140} />
                </div>
                <span className="wallet-scan-label">SCAN AT DESK FOR ACCESS</span>
                <strong className="wallet-ticket-code">{walletTicketBooking.ticketCode}</strong>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="wallet-ticket-footer">
              <button
                type="button"
                className="wallet-close-full-btn"
                onClick={() => setWalletTicketBooking(null)}
              >
                Close Ticket Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CANCEL CONFIRMATION BOTTOM SHEET
          ══════════════════════════════════════════════════════ */}
      {confirmCancelBooking && (
        <div className="wallet-modal-backdrop" onClick={() => setConfirmCancelBooking(null)}>
          <div
            className="reserve-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reserve-sheet-handle" />
            <div className="reserve-sheet-icon" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
              <ShieldAlert size={22} />
            </div>
            <h3 className="reserve-sheet-title">Cancel Reservation?</h3>
            <p className="reserve-sheet-sub">
              Are you sure you want to release your desk at <strong>{confirmCancelBooking.spaceName}</strong>? This action cannot be undone.
            </p>
            <div className="reserve-sheet-actions">
              <button
                type="button"
                className="reserve-sheet-btn-danger"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Booking
              </button>
              <button
                type="button"
                className="reserve-sheet-btn-ghost"
                onClick={() => setConfirmCancelBooking(null)}
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          EXTEND BOOKING BOTTOM SHEET
          ══════════════════════════════════════════════════════ */}
      {extendingBooking && (
        <div className="wallet-modal-backdrop" onClick={() => setExtendingBooking(null)}>
          <div
            className="reserve-bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reserve-sheet-handle" />
            <div className="reserve-sheet-icon" style={{ background: 'rgba(79,70,229,0.08)', color: '#4F46E5' }}>
              <Clock size={22} />
            </div>
            <h3 className="reserve-sheet-title">Extend Session</h3>
            <p className="reserve-sheet-sub">
              Extend desk at <strong>{extendingBooking.spaceName}</strong>. Charged at standard hourly rates.
            </p>
            <div className="reserve-extend-grid">
              {[
                { label: '+30 mins', val: 0.5 },
                { label: '+1 hour', val: 1 },
                { label: '+2 hours', val: 2 }
              ].map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  className="reserve-extend-option"
                  onClick={() => handleConfirmExtension(opt.val)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="reserve-sheet-btn-ghost"
              onClick={() => setExtendingBooking(null)}
            >
              Cancel Extension
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
