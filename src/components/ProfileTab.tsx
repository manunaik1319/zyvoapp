import React, { useState } from 'react';
import { Bell, Settings, Check, Clock, Trophy, Calendar, CreditCard, Award } from 'lucide-react';
import { QrCode } from './QrCode';

interface ProfileTabProps {
  onSwitchTab: (tabName: string) => void;
  showToast: (msg: string) => void;
  onOpenNotifications: () => void;
  hasUnread: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  onSwitchTab,
  showToast,
  onOpenNotifications,
  hasUnread
}) => {
  const [isIdFlipped, setIsIdFlipped] = useState(false);
  const [backTab, setBackTab] = useState<'pass' | 'settings'>('pass');
  const [studentName, setStudentName] = useState('Manohar L.');
  const [studentCollege, setStudentCollege] = useState('IIIT Sonepat');
  const [focusPref, setFocusPref] = useState<'silent' | 'wifi' | 'cafe'>('silent');
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <div className="app-main-content app-screen-view active-view" id="tab-panel-profile">
      {/* Profile Header */}
      <header className="profile-topbar">
        <h2 className="profile-page-title">My Campus ID</h2>
        <div className="profile-top-actions">
          <button 
            className={`profile-icon-button profile-notification-button ${hasUnread ? 'has-unread' : ''}`} 
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button 
            className="profile-icon-button" 
            type="button" 
            onClick={() => {
              setBackTab('settings');
              setIsIdFlipped(true);
              showToast('Opened settings panel');
            }} 
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Interactive Flipping Student ID Pass */}
      <section className="profile-id-container" onClick={() => setIsIdFlipped(!isIdFlipped)}>
        <div className={`profile-id-inner ${isIdFlipped ? 'flipped' : ''}`}>
          
          {/* CARD FRONT FACE */}
          <div className="campus-id-card campus-id-front">
            <div className="campus-id-brand">
              <span>ZYVO · Student Passport</span>
              <span className="campus-id-chip"></span>
            </div>
            <div className="campus-id-main">
              <div className="verified-avatar-ring">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=85" alt="Manohar L." />
                <span className="avatar-verified-mark">
                  <Check size={12} strokeWidth={3} />
                </span>
                <button 
                  className="avatar-settings-badge"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBackTab('settings');
                    setIsIdFlipped(true);
                    showToast('Opened settings panel');
                  }}
                  aria-label="Avatar settings"
                >
                  <Settings size={10} style={{ strokeWidth: 2.5 }} />
                </button>
              </div>
              <div className="campus-profile-copy">
                <div className="campus-name-row">
                  <h3 className="campus-student-name">{studentName}</h3>
                  <span className="verified-text-badge">VERIFIED</span>
                </div>
                <p className="campus-student-role">CSE Undergraduate Student</p>
                <div className="campus-meta">
                  <span>{studentCollege}</span>
                  <span>•</span>
                  <span>Semester 3</span>
                </div>
              </div>
            </div>
            <div className="achievement-strip">
              <div className="achievement-mini">
                <span className="achievement-mini-icon">🔥</span>
                <strong>42 Days</strong>
                <small>STREAK</small>
              </div>
              <div className="achievement-mini">
                <span className="achievement-mini-icon">⏱️</span>
                <strong>24.5 hrs</strong>
                <small>FOCUS</small>
              </div>
              <div className="achievement-mini">
                <span className="achievement-mini-icon">🏆</span>
                <strong>#12</strong>
                <small>RANK</small>
              </div>
              <div className="achievement-mini">
                <span className="achievement-mini-icon">🥇</span>
                <strong>Top 5%</strong>
                <small>PERFORMER</small>
              </div>
            </div>
          </div>

          {/* CARD BACK FACE (SECURE QR CODE PASSPORT & SETTINGS) */}
          <div className="campus-id-card campus-id-back">
            <div className="campus-id-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div 
                style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.1)', padding: '2px', borderRadius: '6px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setBackTab('pass')}
                  style={{
                    border: 'none',
                    background: backTab === 'pass' ? 'rgba(255,255,255,0.25)' : 'transparent',
                    color: '#FFFFFF',
                    fontSize: '8.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Campus Pass
                </button>
                <button
                  type="button"
                  onClick={() => setBackTab('settings')}
                  style={{
                    border: 'none',
                    background: backTab === 'settings' ? 'rgba(255,255,255,0.25)' : 'transparent',
                    color: '#FFFFFF',
                    fontSize: '8.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Settings
                </button>
              </div>
              <span className="verified-text-badge" style={{ background: backTab === 'pass' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 102, 245, 0.25)', color: backTab === 'pass' ? '#34D399' : '#818CF8', border: backTab === 'pass' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(59, 102, 245, 0.3)', padding: '2px 6px' }}>
                {backTab === 'pass' ? 'ACTIVE PASS' : 'EDIT MODE'}
              </span>
            </div>
            
            {backTab === 'pass' ? (
              /* PASS VIEW */
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, padding: '4px 0', width: '100%' }}>
                {/* Real dynamic QR image for Student Pass */}
                <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '10px', display: 'grid', placeItems: 'center', width: '82px', height: '82px', flexShrink: 0 }}>
                  <QrCode 
                    value={`ZYVO-STU-${studentName.toUpperCase().replace(/\s+/g, '-')}-${studentCollege.toUpperCase().replace(/\s+/g, '-')}-1280`} 
                    size={70} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left', minWidth: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', letterSpacing: '0.04em', fontWeight: 600 }}>PASSPORT REFERENCE</span>
                  <strong style={{ fontSize: '13px', color: '#FFF', fontFamily: 'monospace', letterSpacing: '0.05em' }}>ZYV-STU-2490-F</strong>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '7px', fontWeight: 600 }}>RANK</span>
                      <span style={{ fontSize: '10.5px', fontWeight: 700 }}>#12 Campus</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '7px', fontWeight: 600 }}>CREDITS</span>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#F59E0B' }}>1,280 Pts</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SETTINGS VIEW */
              <div 
                style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, padding: '4px 0', width: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Inputs for Name & College */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', fontWeight: 700, letterSpacing: '0.03em' }}>FULL NAME</label>
                    <input 
                      type="text" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        padding: '4px 6px',
                        outline: 'none',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', fontWeight: 700, letterSpacing: '0.03em' }}>COLLEGE</label>
                    <input 
                      type="text" 
                      value={studentCollege}
                      onChange={(e) => setStudentCollege(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        padding: '4px 6px',
                        outline: 'none',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    />
                  </div>
                </div>

                {/* Preference Segmented Selector & Switch Alert */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7px', fontWeight: 700, letterSpacing: '0.03em' }}>FOCUS ZONE PREF</label>
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', padding: '1px', borderRadius: '4px' }}>
                      {(['silent', 'wifi', 'cafe'] as const).map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            setFocusPref(pref);
                            showToast(`Preference set to ${pref.toUpperCase()}`);
                          }}
                          style={{
                            border: 'none',
                            background: focusPref === pref ? '#3B66F5' : 'transparent',
                            color: '#FFFFFF',
                            fontSize: '7.5px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '7.5px', fontWeight: 700 }}>ALERTS</span>
                    <label className="toggle-switch-container" style={{ position: 'relative', display: 'inline-block', width: '26px', height: '14px' }}>
                      <input 
                        type="checkbox" 
                        checked={pushAlerts}
                        onChange={(e) => {
                          setPushAlerts(e.target.checked);
                          showToast(e.target.checked ? 'Broadcast alerts enabled' : 'Broadcast alerts disabled');
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span className="toggle-slider" style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: pushAlerts ? '#10B981' : 'rgba(255,255,255,0.2)',
                        borderRadius: '14px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '10px', width: '10px',
                          left: pushAlerts ? '14px' : '2px',
                          bottom: '2px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)', borderTop: '1px dashed rgba(255, 255, 255, 0.15)', paddingTop: '8px', marginTop: '4px', width: '100%' }}>
              <span>{studentCollege} · CSE Undergraduate</span>
              <span style={{ fontWeight: 800 }}>Tap to Flip Back</span>
            </div>
          </div>

        </div>
      </section>

      {/* Momentum section */}
      <div className="profile-section-heading">
        <h3>Your momentum</h3>
        <span>This semester</span>
      </div>
      
      <section className="profile-stats-grid">
        <article className="profile-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-box">
              <Clock size={14} />
            </span>
            <span className="stat-change">+12%</span>
          </div>
          <strong className="stat-value">24.5 hrs</strong>
          <span className="stat-label">Focus time</span>
        </article>

        <article className="profile-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-box">
              <Trophy size={14} />
            </span>
            <span className="stat-change">↑ 3</span>
          </div>
          <strong className="stat-value">#12</strong>
          <span className="stat-label">Campus rank</span>
        </article>

        <article className="profile-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-box">
              <Calendar size={14} />
            </span>
            <span className="stat-change">+8</span>
          </div>
          <strong className="stat-value">68</strong>
          <span className="stat-label">Study sessions</span>
        </article>

        <article className="profile-stat-card">
          <div className="stat-card-top">
            <span className="stat-icon-box">
              <Award size={14} />
            </span>
            <span className="stat-change">+120</span>
          </div>
          <strong className="stat-value">1,280</strong>
          <span className="stat-label">Credits earned</span>
        </article>
      </section>

      {/* Wallet balance */}
      <section className="profile-wallet-card">
        <div className="wallet-top">
          <div>
            <span className="wallet-eyebrow">Zyvo Wallet</span>
            <div className="wallet-balance">
              ₹420 <span style={{ fontSize: '13px' }}>Credits</span>
            </div>
          </div>
          <span className="wallet-card-icon">
            <CreditCard size={24} />
          </span>
        </div>
        <div className="wallet-bottom">
          <span className="wallet-caption">Unlock premium spaces with credits.</span>
          <button 
            className="wallet-earn-button" 
            type="button" 
            onClick={() => showToast('Complete challenges to earn more credits')}
          >
            Earn More Credits
          </button>
        </div>
      </section>

      {/* Premium plan details */}
      <section className="profile-premium-card">
        <div className="premium-card-top">
          <span className="premium-badge-icon">
            <Award size={22} style={{ strokeWidth: 2.2 }} />
          </span>
          <div className="premium-copy">
            <div className="premium-title-row">
              <strong>ZYVO Premium</strong>
              <span className="active-status-pill">ACTIVE</span>
            </div>
            <p>Your all-access pass to focused campus life.</p>
          </div>
          <button 
            className="premium-upgrade-button" 
            type="button" 
            onClick={() => showToast('Your Premium plan is active')}
          >
            Manage
          </button>
        </div>
        <div className="premium-benefits">
          <span className="premium-benefit">Priority booking</span>
          <span className="premium-benefit">2× credits</span>
          <span className="premium-benefit">Free cancellations</span>
        </div>
      </section>

      {/* Goal tracking */}
      <section className="profile-progress-card">
        <div className="progress-card-head">
          <strong>Weekly Study Goal</strong>
          <span>80% Completed</span>
        </div>
        <p className="progress-card-caption">12 of 15 focused hours completed · 3 hrs to go</p>
        <div className="weekly-progress-track">
          <div className="weekly-progress-fill"></div>
        </div>
        <div className="progress-days">
          <span className="done">M</span>
          <span className="done">T</span>
          <span className="done">W</span>
          <span className="done">T</span>
          <span className="done">F</span>
          <span>S</span>
          <span>S</span>
        </div>
      </section>

      {/* Recent Activity */}
      <div className="profile-section-heading">
        <h3>Recent activity</h3>
        <span>View all</span>
      </div>
      
      <section className="profile-activity-card">
        <div className="activity-row">
          <span className="activity-icon">🎯</span>
          <span className="activity-copy">
            <strong>Checked into Study Hub</strong>
            <small>Banjara Hills Reading Room</small>
          </span>
          <span className="activity-time">10m</span>
        </div>
        <div className="activity-row">
          <span className="activity-icon">💰</span>
          <span className="activity-copy">
            <strong>Earned 20 Credits</strong>
            <small>Daily focus challenge</small>
          </span>
          <span className="activity-time">2h</span>
        </div>
        <div className="activity-row">
          <span className="activity-icon">📈</span>
          <span className="activity-copy">
            <strong>Campus Rank Increased</strong>
            <small>You moved from #15 to #12</small>
          </span>
          <span className="activity-time">1d</span>
        </div>
        <div className="activity-row">
          <span className="activity-icon">🏆</span>
          <span className="activity-copy">
            <strong>Completed Focus Session</strong>
            <small>90 minutes · Deep work</small>
          </span>
          <span className="activity-time">2d</span>
        </div>
      </section>

      {/* Quick actions */}
      <div className="profile-section-heading">
        <h3>Quick actions</h3>
        <span>Campus essentials</span>
      </div>
      
      <section className="profile-quick-grid">
        <button 
          className="quick-action-button" 
          type="button" 
          onClick={() => onSwitchTab('discover')}
        >
          <span className="quick-action-icon">🏢</span>
          <span>Book Study Hall</span>
        </button>
        
        <button 
          className="quick-action-button" 
          type="button" 
          onClick={() => onSwitchTab('map')}
        >
          <span className="quick-action-icon">📍</span>
          <span>Find Library</span>
        </button>
        
        <button 
          className="quick-action-button" 
          type="button" 
          onClick={() => showToast('Study groups near you are loading')}
        >
          <span className="quick-action-icon">👥</span>
          <span>Join Study Group</span>
        </button>
        
        <button 
          className="quick-action-button" 
          type="button" 
          onClick={() => showToast('Credit rewards catalogue opened')}
        >
          <span className="quick-action-icon">🎁</span>
          <span>Redeem Credits</span>
        </button>
      </section>
      <div style={{ height: '80px' }} />
    </div>
  );
};
