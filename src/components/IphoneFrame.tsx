import React, { useEffect, useState } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface IphoneFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideNavBar?: boolean;
  statusColor?: 'light' | 'dark';
  overlays?: React.ReactNode;
}

export const IphoneFrame: React.FC<IphoneFrameProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  hideNavBar = false,
  statusColor = 'dark',
  overlays
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="iphone-canvas">
      {/* Notch / Dynamic Island */}
      <div className="iphone-notch" title="Dynamic Island" />

      {/* iOS Status Bar */}
      <div className="status-bar" style={{ color: statusColor === 'light' ? '#FFFFFF' : 'var(--zyvo-text-main)' }}>
        <span className="status-time">{timeStr}</span>
        <div className="status-icons">
          {/* Signal indicator */}
          <svg className="status-icon-svg" viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '2px' }}>
            <rect x="2" y="16" width="3" height="5" rx="0.5" fill="currentColor" />
            <rect x="7" y="12" width="3" height="9" rx="0.5" fill="currentColor" />
            <rect x="12" y="8" width="3" height="13" rx="0.5" fill="currentColor" />
            <rect x="17" y="4" width="3" height="17" rx="0.5" fill="currentColor" />
          </svg>
          <Wifi size={13} style={{ strokeWidth: 2.5 }} />
          <Battery size={15} style={{ strokeWidth: 2.2 }} />
        </div>
      </div>

      {/* Internal Content Area */}
      <div className="scroll-content">
        {children}
      </div>

      {/* Viewport Overlays (Bottom sheets, modals, notifications drawer) */}
      {overlays}

      {/* Bottom Nav Bar */}
      {!hideNavBar && (
        <nav className="app-ios-bottom-bar">
          {/* Home */}
          <button className={`app-nav-tab ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => onTabChange('discover')} type="button">
            <svg viewBox="0 0 24 24" fill={activeTab === 'discover' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
            <span className="app-nav-tab-label">Home</span>
          </button>

          {/* Explore */}
          <button className={`app-nav-tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => onTabChange('map')} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={activeTab === 'map' ? 'currentColor' : 'none'} />
            </svg>
            <span className="app-nav-tab-label">Explore</span>
          </button>

          {/* Bookings */}
          <button className={`app-nav-tab ${activeTab === 'reserve' ? 'active' : ''}`} onClick={() => onTabChange('reserve')} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" fill={activeTab === 'reserve' ? 'currentColor' : 'none'} fillOpacity="0.15" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span className="app-nav-tab-label">Bookings</span>
          </button>

          {/* Rewards */}
          <button className={`app-nav-tab ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => onTabChange('rewards')} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" fill={activeTab === 'rewards' ? 'currentColor' : 'none'} fillOpacity="0.15" />
              <path d="M12 12v9" />
              <path d="M8 16l4-4 4 4" />
              <path d="M6 20h12" />
            </svg>
            <span className="app-nav-tab-label">Rewards</span>
          </button>

          {/* Profile */}
          <button className={`app-nav-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => onTabChange('profile')} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" fill={activeTab === 'profile' ? 'currentColor' : 'none'} fillOpacity="0.15" />
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            </svg>
            <span className="app-nav-tab-label">Profile</span>
          </button>
        </nav>
      )}

      {/* iOS Home Indicator Bar */}
      <div 
        className="home-indicator-bar" 
        style={{ 
          background: hideNavBar ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.25)' 
        }} 
      />
    </div>
  );
};
