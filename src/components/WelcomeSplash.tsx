import React, { useEffect } from 'react';

interface WelcomeSplashProps {
  type: 'welcome' | 'welcome-back';
  onComplete: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ type, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (type === 'welcome-back') {
    return (
      <div className="welcome-splash-panel">
        <div className="welcome-splash-inner">
          <div className="welcome-glow-orb" />
          {/* Cursive "Welcome Back" — slides right to left */}
          <h1 className="welcome-cursive-text">Welcome Back</h1>
          <p className="welcome-redirect-hint">Your focus space is ready for you.</p>
        </div>
      </div>
    );
  }

  // Signup: welcome note + thank you
  return (
    <div className="welcome-splash-panel">
      <div className="welcome-splash-inner">
        <div className="welcome-glow-orb" />
        {/* Signup welcome note — slides left to right */}
        <h1 className="welcome-anim-text">Welcome to ZYVO</h1>
        <p className="welcome-thankyou-text">Thank you for choosing us ✨</p>
        <p className="welcome-redirect-hint">Opening your focus dashboard...</p>
      </div>
    </div>
  );
};
