import React, { useEffect } from 'react';

interface WelcomeSplashProps {
  type: 'welcome' | 'welcome-back';
  onComplete: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ type, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="welcome-splash-panel">
      <div className="welcome-splash-inner">
        {/* Background glow orb */}
        <div className="welcome-glow-orb"></div>
        
        {/* Cursive animated text */}
        <h1 className="welcome-anim-text">
          {type === 'welcome' ? 'Welcome to ZYVO' : 'Welcome back'}
        </h1>
        
        {/* Loading subtext */}
        <p className="welcome-redirect-hint">Opening your focus dashboard...</p>
      </div>
    </div>
  );
};
