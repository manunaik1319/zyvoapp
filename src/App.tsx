import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
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
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { PaymentFlow } from './components/PaymentFlow';
import { SpaceDetails } from './components/SpaceDetails';
import { SeatSelection } from './components/SeatSelection';

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
      body: 'Desk #4 at Banjara Hills Reading Room is reserved. Show your pass at check-in.',
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
  const [bookingSpace, setBookingSpace] = useState<Space | null>(null);
  const [mapFocusSpaceId, setMapFocusSpaceId] = useState<string | null>(null);
  
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
  const [pendingBooking, setPendingBooking] = useState<{
    space: Space;
    deskId: string;
    duration: string;
    price: number;
    paymentMethod: string;
  } | null>(null);
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

  // Confirm booking callback from seat selection page
  const handleConfirmBooking = (
    _spaceName: string, 
    deskId: string, 
    duration: string, 
    price: number, 
    paymentMethod: string
  ) => {
    if (!bookingSpace) return;
    
    setPendingBooking({
      space: bookingSpace,
      deskId: `Desk ${deskId}`,
      duration,
      price,
      paymentMethod
    });
    
    setBookingSpace(null);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
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
            onSwitchTab={setActiveTab}
            onNavigateToSpace={(spaceId) => {
              setMapFocusSpaceId(spaceId);
              setActiveTab('map');
            }}
          />
        );
      case 'map':
        return (
          <MapTab 
            onSelectSpace={setSelectedSpace}
            showToast={showToast}
            focusSpaceId={mapFocusSpaceId}
            onClearFocus={() => setMapFocusSpaceId(null)}
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
          {/* Space Details Page Overlay */}
          {selectedSpace && (
            <SpaceDetails
              space={selectedSpace}
              onClose={() => setSelectedSpace(null)}
              onProceed={() => {
                setBookingSpace(selectedSpace);
                setSelectedSpace(null);
              }}
              isSaved={savedSpaces.includes(selectedSpace.id)}
              onToggleSave={toggleSaveSpace}
            />
          )}

          {/* Seat Selection Page Overlay */}
          {bookingSpace && (
            <SeatSelection
              space={bookingSpace}
              onBack={() => {
                setSelectedSpace(bookingSpace);
                setBookingSpace(null);
              }}
              onClose={() => setBookingSpace(null)}
              onConfirm={handleConfirmBooking}
            />
          )}

          {pendingBooking && (
            <PaymentFlow
              space={pendingBooking.space}
              deskId={pendingBooking.deskId}
              duration={pendingBooking.duration}
              price={pendingBooking.price}
              initialPaymentMethod={pendingBooking.paymentMethod}
              onCancel={() => {
                if (pendingBooking) {
                  setBookingSpace(pendingBooking.space);
                }
                setPendingBooking(null);
              }}
              onSuccess={(newReservation) => {
                setBookings((prev) => [newReservation, ...prev]);
                setPendingBooking(null);
                setConfettiTrigger((t) => t + 1);

                const bookingNotification: NotificationItem = {
                  id: Math.random().toString(),
                  title: 'Booking Confirmed',
                  body: `Spot ${newReservation.deskId} at ${newReservation.spaceName} is locked in. Show code ${newReservation.ticketCode} at desk check-in.`,
                  time: 'Just now',
                  unread: true,
                  icon: '🏢'
                };
                setNotifications((prev) => [bookingNotification, ...prev]);
                setActiveTab('reserve');
                showToast('Booking Confirmed!');
              }}
            />
          )}

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
        /* Active View Panel with transition key */
        <div key={activeTab} className="app-view-wrapper">
          {renderTabContent()}
        </div>
      )}
    </IphoneFrame>
  );
}

export default App;
