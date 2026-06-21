import React, { useEffect, useState } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for fade transition to finish
      const completeTimer = setTimeout(onComplete, 400);
      return () => clearTimeout(completeTimer);
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div className="app-splash-screen">
      <div className="splash-logo-container">
        <h1 className="splash-brand-title">
          ZYV<span className="brand-logo-o">O</span>
        </h1>
        <p className="splash-tagline">Premium Focus Spaces</p>
      </div>
    </div>
  );
};
