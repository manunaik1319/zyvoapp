import { useState, useEffect } from 'react';
import { Check, Bell } from 'lucide-react';
import type { Space, Reservation, LocationOption } from './types';
import { Splash } from './components/Splash';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { WelcomeSplash } from './components/WelcomeSplash';
import { IphoneFrame } from './components/IphoneFrame';
import { DiscoverTab } from './components/DiscoverTab';
import { ReserveTab } from './components/ReserveTab';
import { MapTab } from './components/MapTab';
import { ProfileTab } from './components/ProfileTab';
import { BookingSheet } from './components/BookingSheet';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: string;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [welcomeType, setWelcomeType] = useState<'welcome' | 'welcome-back' | null>(null);
  const [onboardingSlide, setOnboardingSlide] = useState(0);
  
  // Campus Notifications System state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Focus Sprint Complete',
      body: 'You completed your daily deep-work challenge! +20 credits added to your wallet.',
      time: '2h ago',
      unread: true,
      icon: '🎯'
    },
    {
      id: '2',
      title: 'Booking Confirmed',
      body: 'Desk #4 at Kalyan Reading Room is reserved. Show your pass at check-in.',
      time: '5h ago',
      unread: true,
      icon: '🏢'
    },
    {
      id: '3',
      title: 'Campus Rank Up!',
      body: 'Awesome effort! You moved up to Rank #12 among campus focusers.',
      time: '1d ago',
      unread: false,
      icon: '📈'
    }
  ]);
  
  // App routing & views state
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [savedSpaces, setSavedSpaces] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>({
    title: 'Banjara Hills',
    address: 'Road No. 12, Hyderabad'
  });

  // Booking & transaction state
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [successBooking, setSuccessBooking] = useState<Reservation | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastActive, setToastActive] = useState(false);

  // Trigger onboarding immediately after splash completes on first load
  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const handleOnboardingDismiss = () => {
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const handleAuthSuccess = (type: 'welcome' | 'welcome-back') => {
    setShowAuth(false);
    setWelcomeType(type);
  };

  const handleBackToOnboarding = () => {
    setShowAuth(false);
    setShowOnboarding(true);
    setOnboardingSlide(0);
  };

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastActive(true);
  };

  useEffect(() => {
    if (!toastActive) return;
    const timer = setTimeout(() => {
      setToastActive(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastActive]);

  // Handle saving space favorites
  const toggleSaveSpace = (spaceId: string) => {
    setSavedSpaces((prev) => {
      const isSaved = prev.includes(spaceId);
      const updated = isSaved ? prev.filter((id) => id !== spaceId) : [...prev, spaceId];
      showToast(isSaved ? 'Removed from favourites' : 'Study hall saved to favourites');
      return updated;
    });
  };

  // Confirm booking callback from sheet
  const handleConfirmBooking = (spaceName: string, deskId: string, duration: string, price: number) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const ticketCode = `ZYV-${Math.floor(1000 + Math.random() * 9000)}-F`;
    
    const newReservation: Reservation = {
      id: Math.random().toString(36).substring(2, 9),
      spaceName,
      deskId: `Desk ${deskId}`,
      duration,
      price,
      time: timeNow,
      ticketCode
    };

    setBookings((prev) => [newReservation, ...prev]);
    setSelectedSpace(null);
    setSuccessBooking(newReservation);
    
    // Trigger confetti physics animation
    setConfettiTrigger((t) => t + 1);

    // Add unread notification for the confirmed reservation in real time
    const bookingNotification: NotificationItem = {
      id: Math.random().toString(),
      title: 'Booking Confirmed',
      body: `Spot ${newReservation.deskId} at ${spaceName} is locked in. Show code ${ticketCode} at desk check-in.`,
      time: 'Just now',
      unread: true,
      icon: '🏢'
    };
    setNotifications((prev) => [bookingNotification, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleDismissReceipt = () => {
    setSuccessBooking(null);
    setActiveTab('reserve');
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Determine which tab content to render
  const renderTabContent = () => {
    const hasUnread = notifications.some((n) => n.unread);
    switch (activeTab) {
      case 'discover':
        return (
          <DiscoverTab 
            onSelectSpace={setSelectedSpace}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            savedSpaces={savedSpaces}
            onToggleSaveSpace={toggleSaveSpace}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            showToast={showToast}
            onSwitchTab={setActiveTab}
            onOpenNotifications={() => setShowNotifications(true)}
            hasUnread={hasUnread}
          />
        );
      case 'reserve':
        return (
          <ReserveTab 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            showToast={showToast}
          />
        );
      case 'map':
        return (
          <MapTab 
            onSelectSpace={setSelectedSpace}
            showToast={showToast}
          />
        );
      case 'profile':
        return (
          <ProfileTab 
            onSwitchTab={setActiveTab}
            showToast={showToast}
            onOpenNotifications={() => setShowNotifications(true)}
            hasUnread={hasUnread}
          />
        );
      case 'rewards':
        return (
          <div className="app-main-content app-screen-view active-view" id="tab-panel-rewards" style={{ gap: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 900, color: 'var(--zyvo-text-main)', letterSpacing: '-0.04em' }}>Rewards 🪙</h2>
                <p style={{ fontSize: '12px', color: 'var(--zyvo-text-muted)', marginTop: '2px' }}>Earn coins by focusing</p>
              </div>
              <span style={{ background: 'linear-gradient(135deg,#2563FF,#4F7DFF)', color: '#fff', borderRadius: '12px', padding: '6px 14px', fontSize: '12px', fontWeight: 800 }}>120 coins</span>
            </header>

            {/* Coin balance card */}
            <div style={{ background: 'linear-gradient(135deg, #2563FF 0%, #4F7DFF 100%)', borderRadius: '22px', padding: '22px', color: '#fff', boxShadow: '0 16px 40px rgba(37,99,255,0.28)' }}>
              <p style={{ fontSize: '11px', opacity: 0.8, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Zyvo Coins</p>
              <p style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.05em', margin: '6px 0 2px' }}>🪙 120</p>
              <p style={{ fontSize: '11px', opacity: 0.75 }}>≈ ₹60 credits · Redeemable anytime</p>
              <button onClick={() => showToast('Redeeming coins!')} style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '12px', color: '#fff', padding: '9px 20px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Redeem Now →</button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { emoji: '🔥', val: '7', lbl: 'Day Streak', sub: '+10 bonus coins' },
                { emoji: '⏱️', val: '24h', lbl: 'Focus Hours', sub: 'This week' },
                { emoji: '👥', val: '2', lbl: 'Referrals', sub: '+40 coins earned' },
                { emoji: '⚡', val: '2×', lbl: 'Boost Active', sub: 'Until Sunday' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '18px', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #EEF2FF' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.emoji}</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F1B35', fontFamily: 'Outfit', letterSpacing: '-0.04em' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F1B35', marginTop: '2px' }}>{s.lbl}</div>
                  <div style={{ fontSize: '10px', color: '#94A3C0', marginTop: '2px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Refer CTA */}
            <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', borderRadius: '20px', padding: '20px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => showToast('Referral link copied!')}>
              <div style={{ fontSize: '32px' }}>🎁</div>
              <div>
                <p style={{ fontWeight: 900, fontSize: '14px', color: '#92400E' }}>Refer a Friend</p>
                <p style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>Get 20 coins per referral · No limit!</p>
                <p style={{ fontSize: '10px', marginTop: '6px', color: '#D97706', fontWeight: 700 }}>Tap to copy your link →</p>
              </div>
            </div>

            <div style={{ height: '80px' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <IphoneFrame 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      hideNavBar={showSplash || showOnboarding || showAuth || welcomeType !== null}
      statusColor={showSplash || showOnboarding || showAuth || welcomeType !== null ? 'light' : 'dark'}
      overlays={
        <>
          {/* Booking bottom sheet slide-up */}
          <BookingSheet 
            space={selectedSpace}
            onClose={() => setSelectedSpace(null)}
            onConfirmBooking={handleConfirmBooking}
          />

          {/* Confetti physics particles */}
          <ConfettiCanvas trigger={confettiTrigger} />

          {/* Campus Campus Notifications Overlay Drawer */}
          <div 
            className={`booking-sheet-backdrop ${showNotifications ? 'active' : ''}`} 
            onClick={() => setShowNotifications(false)}
          />
          <div className={`booking-sheet-panel notifications-panel ${showNotifications ? 'active' : ''}`}>
            <div className="sheet-handle-bar" onClick={() => setShowNotifications(false)} />
            <div className="sheet-head-row">
              <h3 className="sheet-title-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} style={{ color: 'var(--zyvo-orange)' }} /> Campus Notifications
              </h3>
              <button 
                className="sheet-close-btn" 
                onClick={() => setShowNotifications(false)}
                type="button"
                aria-label="Close notifications"
              >
                ✕
              </button>
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`notification-item ${item.unread ? 'unread' : ''}`}
                    onClick={() => handleMarkAsRead(item.id)}
                  >
                    <div className="notification-icon-box">{item.icon}</div>
                    <div className="notification-details">
                      <div className="notification-title-row">
                        <strong>{item.title}</strong>
                        <span className="notification-time">{item.time}</span>
                      </div>
                      <p className="notification-body">{item.body}</p>
                    </div>
                    {item.unread && <span className="notification-unread-dot" />}
                  </div>
                ))
              ) : (
                <div className="notifications-empty">
                  <div className="notifications-empty-icon">🔔</div>
                  <strong>All caught up!</strong>
                  <p>No new campus notifications at the moment.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notifications-footer">
                <button 
                  className="btn-reserve-cta" 
                  onClick={handleClearAllNotifications}
                  style={{ width: '100%', height: '44px', borderRadius: '12px' }}
                  type="button"
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>

          {/* Success Booking Receipt Overlay */}
          {successBooking && (
            <div className="booking-receipt-overlay" style={{ display: 'flex' }}>
              <div className="checkmark-ring">
                <Check size={36} strokeWidth={3} />
              </div>
              <h3 className="receipt-title">Spot Reserved!</h3>
              <p className="receipt-subtitle">
                Your seat is locked in. Show this passport at the study desk check-in.
              </p>

              {/* Digital ticket code card */}
              <div className="digital-ticket-box">
                <div className="ticket-info-row">
                  <span className="ticket-info-lbl">Study Space</span>
                  <span className="ticket-info-val" id="receipt-space-name">{successBooking.spaceName}</span>
                </div>
                <div className="ticket-info-row">
                  <span className="ticket-info-lbl">Assigned Spot</span>
                  <span className="ticket-info-val" id="receipt-desk-id">{successBooking.deskId}</span>
                </div>
                <div className="ticket-info-row">
                  <span className="ticket-info-lbl">Duration</span>
                  <span className="ticket-info-val" id="receipt-duration">{successBooking.duration}</span>
                </div>
                <div className="ticket-dashed-line" />
                <div className="ticket-info-row" style={{ marginTop: '4px' }}>
                  <span className="ticket-info-lbl">Check-In Time</span>
                  <span className="ticket-info-val">{successBooking.time}</span>
                </div>
                <div className="ticket-info-row">
                  <span className="ticket-info-lbl">Passport Code</span>
                  <span className="ticket-info-val" style={{ fontFamily: 'monospace', color: 'var(--zyvo-orange)' }}>
                    {successBooking.ticketCode}
                  </span>
                </div>
              </div>

              <button 
                className="btn-reserve-cta" 
                onClick={handleDismissReceipt}
                style={{ width: '100%', height: '44px', borderRadius: '12px' }}
                type="button"
              >
                Done
              </button>
            </div>
          )}

          {/* Profile/System Toast Notifications */}
          <div className={`profile-toast ${toastActive ? 'show' : ''}`} id="profile-toast" role="status">
            {toastMessage}
          </div>
        </>
      }
    >
      {/* Shared Stable Gradient Background for Startup & Auth Flow */}
      {(showSplash || showOnboarding || showAuth || welcomeType !== null) && (
        <div className="shared-auth-gradient-bg" />
      )}

      {showSplash ? (
        <Splash onComplete={handleSplashComplete} />
      ) : showOnboarding ? (
        <Onboarding 
          activeSlide={onboardingSlide} 
          setActiveSlide={setOnboardingSlide} 
          onDismiss={handleOnboardingDismiss} 
        />
      ) : showAuth ? (
        <Auth 
          onAuthSuccess={handleAuthSuccess}
          onBackToOnboarding={handleBackToOnboarding}
        />
      ) : welcomeType !== null ? (
        <WelcomeSplash 
          type={welcomeType} 
          onComplete={() => setWelcomeType(null)} 
        />
      ) : (
        /* Active View Panel */
        renderTabContent()
      )}
    </IphoneFrame>
  );
}

export default App;
