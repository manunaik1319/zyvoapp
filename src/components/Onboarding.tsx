import React from 'react';
import { QrCode, Armchair, VolumeX, Wifi, Clock, Flame, TrendingUp, Trophy } from 'lucide-react';

interface OnboardingProps {
  activeSlide: number;
  setActiveSlide: (slide: number) => void;
  onDismiss: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ activeSlide, setActiveSlide, onDismiss }) => {
  const handleNext = () => {
    if (activeSlide < 2) {
      setActiveSlide(activeSlide + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className={`app-onboarding-panel premium-onboarding slide-${activeSlide}`}>
      {/* Centered Brand Header */}
      <header className="brand-center-header">
        <h1 className={`brand-center-title ${activeSlide === 0 ? 'white-logo' : ''}`}>ZYVO</h1>
      </header>

      {/* Slider Track Container */}
      <div className="onboard-slider-container">
        <div 
          className="onboard-slide-track" 
          style={{ transform: `translateX(-${activeSlide * 33.3333}%)` }}
        >
          {/* SLIDE 1: 3D Study Room */}
          <div className="onboard-slide">
            <div className="onboard-image-box premium-illustration-box" style={{ position: 'relative' }}>
              <img 
                src="/onboarding_1.png" 
                alt="Find Premium Focus Spots" 
              />
              {/* Floating Glassmorphism elements */}
              <div className="floating-glass-card tag-quiet">🤫 Quiet Zone</div>
              <div className="floating-glass-card tag-open">🪑 Available Seats</div>
            </div>
            <div className="onboard-content-box">
              <h2 className="onboard-title">Find Premium<br />Focus Spots</h2>
              <p className="onboard-description">
                Discover quiet libraries, study rooms, and focus cafés designed for deep focus and productive study sessions.
              </p>
            </div>
          </div>

          {/* SLIDE 2: Interactive Desk Layout */}
          <div className="onboard-slide">
            <div className="onboard-image-box premium-illustration-box flex-center" style={{ position: 'relative' }}>
              <svg width="280" height="260" viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg" style={{ margin: 'auto', overflow: 'visible' }}>
                <defs>
                  {/* Glow filter for selected seat */}
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="phone-shadow" x="-25%" y="-15%" width="150%" height="135%">
                    <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#0047FF" floodOpacity="0.15" />
                  </filter>
                </defs>
                
                {/* Outer Smartphone Enclosure */}
                <g transform="rotate(-3 140 130)" filter="url(#phone-shadow)">
                  {/* Phone body */}
                  <rect x="75" y="15" width="130" height="230" rx="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
                  {/* Inner screen boundary */}
                  <rect x="80" y="20" width="120" height="220" rx="20" fill="#FAFAFA" />
                  {/* Screen Header / Dynamic Island */}
                  <rect x="125" y="27" width="30" height="6" rx="3" fill="#111827" />
                  
                  {/* Floor plan header */}
                  <text x="140" y="48" fontFamily="Plus Jakarta Sans" fontSize="7" fontWeight="800" fill="#0047FF" textAnchor="middle" letterSpacing="0.05em">STUDY ROOM PLAN</text>
                  
                  {/* Table 1: Rectangular Desk Row */}
                  <rect x="94" y="70" width="92" height="20" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
                  <text x="140" y="82" fontFamily="Plus Jakarta Sans" fontSize="5" fontWeight="800" fill="#94A3B8" textAnchor="middle">FOCUS ZONE A</text>
                  
                  {/* Seats around Table 1 */}
                  {/* Top seats */}
                  <rect x="102" y="55" width="16" height="12" rx="3" fill="#2D7FFF" />
                  <text x="110" y="63" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#FFFFFF" textAnchor="middle">01</text>
                  
                  <rect x="132" y="55" width="16" height="12" rx="3" fill="#0047FF" filter="url(#glow-filter)" />
                  <text x="140" y="63" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#FFFFFF" textAnchor="middle">02</text>
                  
                  <rect x="162" y="55" width="16" height="12" rx="3" fill="#E4E4E7" stroke="#D1D1D6" strokeWidth="1" />
                  <text x="170" y="63" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#8E8E93" textAnchor="middle">03</text>
                  
                  {/* Bottom seats */}
                  <rect x="102" y="93" width="16" height="12" rx="3" fill="#E4E4E7" stroke="#D1D1D6" strokeWidth="1" />
                  <text x="110" y="101" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#8E8E93" textAnchor="middle">04</text>
                  
                  <rect x="132" y="93" width="16" height="12" rx="3" fill="#2D7FFF" />
                  <text x="140" y="101" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#FFFFFF" textAnchor="middle">05</text>
                  
                  <rect x="162" y="93" width="16" height="12" rx="3" fill="#2D7FFF" />
                  <text x="170" y="101" fontFamily="Inter" fontSize="5" fontWeight="850" fill="#FFFFFF" textAnchor="middle">06</text>

                  {/* Table 2: Circular Group Hub */}
                  <circle cx="140" cy="146" r="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
                  <text x="140" y="148" fontFamily="Plus Jakarta Sans" fontSize="4.5" fontWeight="800" fill="#94A3B8" textAnchor="middle">HUB B</text>
                  
                  {/* Chairs around Table 2 */}
                  <circle cx="116" cy="146" r="5" fill="#E4E4E7" stroke="#D1D1D6" strokeWidth="1" />
                  <circle cx="154" cy="134" r="5" fill="#2D7FFF" />
                  <circle cx="154" cy="158" r="5" fill="#E4E4E7" stroke="#D1D1D6" strokeWidth="1" />

                  {/* Screen Footer Booking Card */}
                  <rect x="85" y="190" width="110" height="42" rx="8" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1" />
                  <text x="92" y="201" fontFamily="Plus Jakarta Sans" fontSize="6.5" fontWeight="800" fill="#111827">Selected Seat</text>
                  <text x="92" y="211" fontFamily="Inter" fontSize="8" fontWeight="800" fill="#0047FF">Desk 02 (Focus)</text>
                  <rect x="92" y="219" width="96" height="9" rx="3.5" fill="#0047FF" />
                  <text x="140" y="225" fontFamily="Inter" fontSize="5.5" fontWeight="900" fill="#FFFFFF" textAnchor="middle">CONFIRM SEAT</text>
                </g>
              </svg>
              {/* Floating Glassmorphism elements */}
              <div className="floating-glass-card tag-qr">
                <QrCode size={12} />
                <span>Spot QR Code</span>
              </div>
              <div className="floating-glass-card tag-seats-left">
                <Armchair size={12} />
                <span>84% Available</span>
              </div>
              <div className="floating-glass-card tag-quiet-zone">
                <VolumeX size={12} />
                <span>Silent Zone</span>
              </div>
              <div className="floating-glass-card tag-wifi-speed">
                <Wifi size={12} />
                <span>High-Speed WiFi</span>
              </div>
            </div>
            <div className="onboard-content-box">
              <h2 className="onboard-title">Book Your Perfect Seat</h2>
              <p className="onboard-description">
                Reserve your ideal study space in seconds and enjoy a distraction-free environment built for productivity.
              </p>
            </div>
          </div>

          {/* SLIDE 3: Time Reservation */}
          <div className="onboard-slide">
            <div className="onboard-image-box premium-illustration-box" style={{ position: 'relative' }}>
              <img 
                src="/onboarding_3.png" 
                alt="Stay Focused. Achieve More." 
              />
              {/* Floating Glassmorphism elements */}
              <div className="floating-glass-card tag-focus-time">
                <Clock size={12} />
                <span>4h 32m Focus Time</span>
              </div>
              <div className="floating-glass-card tag-streak-days">
                <Flame size={12} />
                <span>15 Day Study Streak</span>
              </div>
              <div className="floating-glass-card tag-score-prod">
                <TrendingUp size={12} />
                <span>Productivity Score</span>
              </div>
              <div className="floating-glass-card tag-badge-ach">
                <Trophy size={12} />
                <span>Achievement Badge</span>
              </div>
            </div>
            <div className="onboard-content-box">
              <h2 className="onboard-title">Stay Focused. Achieve More.</h2>
              <p className="onboard-description">
                Build consistent study habits, track your focus sessions, and reach your academic goals faster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination & Footer actions */}
      <div className="onboard-footer">
        <div className="onboard-dots-row">
          {[0, 1, 2].map((idx) => (
            <span 
              key={idx} 
              className={`onboard-dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>

        <button className="onboard-next-btn white-primary-btn" onClick={handleNext}>
          {activeSlide === 0 ? 'Get Started' : activeSlide === 1 ? 'Reserve Your Seat' : 'Start Your Journey'}
        </button>

        <button className="onboard-secondary-glass-btn" onClick={onDismiss} type="button">
          {activeSlide === 0 ? 'I already have an account' : activeSlide === 1 ? 'Skip' : 'Maybe Later'}
        </button>

        <p className="onboard-consent-text">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
