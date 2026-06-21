import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (type: 'welcome' | 'welcome-back') => void;
  onBackToOnboarding: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot';

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBackToOnboarding }) => {
  const [view, setView] = useState<AuthView>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  // Success feedback states
  const [resetSent, setResetSent] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'signup' && (!fullName || !email || !password)) return;
    if (view === 'signin' && (!email || !password)) return;
    if (view === 'forgot' && !email) return;

    setLoading(true);
    
    if (view === 'forgot') {
      setTimeout(() => {
        setLoading(false);
        setResetSent(true);
      }, 1200);
    } else {
      setTimeout(() => {
        setLoading(false);
        onAuthSuccess(view === 'signup' ? 'welcome' : 'welcome-back');
      }, 1200);
    }
  };

  const handleSocialAuth = (provider: string) => {
    setLoadingProvider(provider);
    setTimeout(() => {
      setLoadingProvider(null);
      onAuthSuccess('welcome-back');
    }, 1000);
  };

  const handleBack = () => {
    if (view === 'signin') {
      onBackToOnboarding();
    } else {
      setView('signin');
      setResetSent(false);
    }
  };

  return (
    <div className="app-auth-panel">
      {/* Navigation Header */}
      <div className="auth-nav-bar">
        <button className="auth-back-btn" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Form Content */}
      <div className="auth-screen-content">
        <div className="auth-header-region">
          {/* Brand Logo (Concentric Rings in White) */}
          <div className="auth-logo-concentric">
            <svg width="52" height="52" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.25"/>
              <circle cx="50" cy="50" r="30" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.55"/>
              <circle cx="50" cy="50" r="16" fill="#FFFFFF"/>
            </svg>
          </div>

          {/* ZYVO Brand Wordmark in White */}
          <div className="auth-brand-wordmark">
            <svg width="116" height="38" viewBox="0 0 185 65" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15H42V23L23 47H42V55H15V47L34 23H15V15Z" fill="#FFFFFF" />
              <path d="M48 15H58L66 29L74 15H84L71 34V45H76L66 57L56 45H61V34L48 15Z" fill="#FFFFFF" opacity="0.85" />
              <path d="M90 15H100L108 43L116 15H126L113 55H103L90 15Z" fill="#FFFFFF" />
              <path d="M152 15C163 15 172 24 172 35C172 46 163 55 152 55C141 55 132 46 132 35C132 24 141 15 152 15ZM152 23C145 23 140 28 140 35C140 42 145 47 152 47C159 47 164 42 164 35C164 28 159 23 152 23Z" fill="#FFFFFF" />
            </svg>
          </div>

          <h2 className="auth-welcome-title">
            {view === 'signin' && 'Welcome back.'}
            {view === 'signup' && 'Create your account.'}
            {view === 'forgot' && 'Reset Password'}
          </h2>
          <p className="auth-welcome-subtitle">
            {view === 'signin' && 'Sign in to find your focus.'}
            {view === 'signup' && 'Discover study spaces in seconds.'}
            {view === 'forgot' && "Enter your email to receive a reset link."}
          </p>
        </div>

        {/* Premium Frosted Glass Form Card Container */}
        <div className="auth-form-card">
          {view === 'forgot' && resetSent ? (
            <div className="auth-success-message">
              <div className="auth-success-icon">✓</div>
              <h3>Reset Link Sent!</h3>
              <p>Check your email inbox at <strong>{email}</strong> for instructions to reset your password.</p>
              <button 
                type="button" 
                className="auth-btn-submit" 
                onClick={() => {
                  setView('signin');
                  setResetSent(false);
                }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <form className="auth-credentials-form" onSubmit={handleSubmit}>
                {view === 'signup' && (
                  <div className="auth-input-group">
                    <label className="auth-input-label" htmlFor="fullname-field">Full name</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon-left">
                        <User size={16} />
                      </span>
                      <input 
                        type="text" 
                        id="fullname-field" 
                        className="auth-input-field" 
                        placeholder="Aanya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                )}

                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="email-field">Email</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon-left">
                      <Mail size={16} />
                    </span>
                    <input 
                      type="email" 
                      id="email-field" 
                      className="auth-input-field" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {view !== 'forgot' && (
                  <div className="auth-input-group">
                    <label className="auth-input-label" htmlFor="password-field">Password</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon-left">
                        <Lock size={16} />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        id="password-field" 
                        className="auth-input-field" 
                        placeholder={view === 'signup' ? '••••••••' : 'Password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                      <button 
                        className="auth-eye-toggle-btn" 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle Password Visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {view === 'signup' && <span className="auth-caption-text">At least 8 characters</span>}
                  </div>
                )}

                {view === 'signin' && (
                  <div className="auth-forgot-pwd-row">
                    <button 
                      type="button" 
                      className="auth-forgot-pwd-link" 
                      onClick={() => {
                        setView('forgot');
                        setResetSent(false);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {view === 'signup' && (
                  <div className="auth-checkbox-row">
                    <label className="auth-checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={agreeTerms} 
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required 
                      />
                      <span className="auth-checkmark"></span>
                      <span className="auth-checkbox-text">
                        I agree to the <span className="auth-legal-link">Terms</span> and <span className="auth-legal-link">Privacy Policy</span>
                      </span>
                    </label>
                  </div>
                )}

                <button className="auth-btn-submit" type="submit" disabled={loading || !!loadingProvider}>
                  {loading ? (
                    <span className="auth-spinner"></span>
                  ) : view === 'signin' ? (
                    'Sign in'
                  ) : view === 'signup' ? (
                    'Create account'
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {view !== 'forgot' && (
                <>
                  {/* Separator */}
                  <div className="auth-or-divider" role="separator">
                    <span className="auth-divider-line"></span>
                    <span className="auth-divider-text">or continue with</span>
                    <span className="auth-divider-line"></span>
                  </div>

                  {/* Social Authentication */}
                  <div className="auth-social-row">
                    <button 
                      className="auth-btn-social" 
                      type="button" 
                      onClick={() => handleSocialAuth('Apple')}
                      disabled={loading || !!loadingProvider}
                    >
                      {loadingProvider === 'Apple' ? (
                        <span className="auth-spinner dark"></span>
                      ) : (
                        <>
                          <svg className="auth-social-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.27-.56 2.98-1.43" />
                          </svg>
                          <span>Apple</span>
                        </>
                      )}
                    </button>

                    <button 
                      className="auth-btn-social" 
                      type="button" 
                      onClick={() => handleSocialAuth('Google')}
                      disabled={loading || !!loadingProvider}
                    >
                      {loadingProvider === 'Google' ? (
                        <span className="auth-spinner dark"></span>
                      ) : (
                        <>
                          <svg className="auth-social-icon-svg" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                          </svg>
                          <span>Google</span>
                        </>
                      )}
                    </button>

                    <button 
                      className="auth-btn-social" 
                      type="button" 
                      onClick={() => handleSocialAuth('Email')}
                      disabled={loading || !!loadingProvider}
                    >
                      {loadingProvider === 'Email' ? (
                        <span className="auth-spinner dark"></span>
                      ) : (
                        <>
                          <Mail size={16} />
                          <span>Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Bottom Toggle Prompt */}
              <div className="auth-bottom-prompt">
                <span>{view === 'signin' ? 'New to ZYVO?' : 'Already have an account?'}</span>
                <button 
                  type="button" 
                  className="auth-toggle-link" 
                  onClick={() => {
                    setView(view === 'signin' ? 'signup' : 'signin');
                    setShowPassword(false);
                  }}
                >
                  {view === 'signin' ? 'Create an account' : 'Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
