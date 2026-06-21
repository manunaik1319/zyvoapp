import React from 'react';
import { Bell, Settings, Check, Clock, Trophy, Calendar, CreditCard, Award } from 'lucide-react';

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
            onClick={() => showToast('Profile settings opened')} 
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Campus ID Card */}
      <section className="campus-id-card">
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
          </div>
          <div className="campus-profile-copy">
            <div className="campus-name-row">
              <h3 className="campus-student-name">Manohar L.</h3>
              <span className="verified-text-badge">VERIFIED</span>
            </div>
            <p className="campus-student-role">CSE Undergraduate Student</p>
            <div className="campus-meta">
              <span>IIIT Sonepat</span>
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
            <small>Kalyan Reading Room</small>
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
