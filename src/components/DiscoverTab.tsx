import React from 'react';
import { Bell, Heart, Mic, Search } from 'lucide-react';
import type { Space, LocationOption } from '../types';
import { spacesData } from '../data/spaces';

interface DiscoverTabProps {
  onSelectSpace: (space: Space) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
  savedSpaces: string[];
  onToggleSaveSpace: (spaceId: string) => void;
  selectedLocation: LocationOption;
  setSelectedLocation: (loc: LocationOption) => void;
  showToast: (msg: string) => void;
  onSwitchTab: (tabName: string) => void;
  onOpenNotifications: () => void;
  hasUnread: boolean;
}

const FILTER_CHIPS = [
  { label: 'Libraries', emoji: '📚', filter: 'Libraries' },
  { label: 'Quiet',     emoji: '🤫', filter: 'Quiet'     },
  { label: 'Fast WiFi', emoji: '⚡', filter: 'Wi-Fi'     },
  { label: '24/7',      emoji: '🕒', filter: 'Open Now'  },
  { label: 'Cafés',     emoji: '☕', filter: 'Cafés'     },
  { label: 'Focus',     emoji: '🎯', filter: 'Quiet'     },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  onSelectSpace,
  searchQuery,
  setSearchQuery,
  activeFilters,
  setActiveFilters,
  savedSpaces,
  onToggleSaveSpace,
  showToast,
  onSwitchTab,
  onOpenNotifications,
  hasUnread,
}) => {
  const filteredSpaces = spacesData.filter(space => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (activeFilters.length === 0) return true;
    const dataFilters = activeFilters.filter(f => f !== 'Near Me');
    if (dataFilters.length === 0) return true;
    return dataFilters.every(f => space.categories.includes(f));
  });

  const featuredSpace = spacesData.find(s => s.id === 'kalyan') || spacesData[0];
  const trendingSpaces = spacesData.filter(s => s.id !== 'kalyan');

  return (
    <div className="dv2 app-screen-view active-view" id="tab-panel-discover">

      {/* ─────────────────────── HEADER ─────────────────────── */}
      <header className="dv2-header">
        <div className="dv2-greeting-block">
          <h1 className="dv2-greeting">{getGreeting()}, Manu 👋</h1>
          <p className="dv2-greeting-sub">12 study spaces available near you</p>
        </div>
        <div className="dv2-header-icons">
          <button
            className={`dv2-icon-btn${hasUnread ? ' has-dot' : ''}`}
            onClick={onOpenNotifications}
            aria-label="Notifications"
            type="button"
          >
            <Bell size={17} />
          </button>
          <button
            className="dv2-avatar"
            onClick={() => onSwitchTab('profile')}
            aria-label="Profile"
            type="button"
          >
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80"
              alt="Profile"
            />
          </button>
        </div>
      </header>

      {/* ─────────────────────── SEARCH BAR ─────────────────────── */}
      <div className="dv2-search">
        <Search size={15} className="dv2-search-icon" />
        <input
          type="text"
          className="dv2-search-input"
          placeholder="Search study halls, libraries, cafes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button
          className="dv2-voice"
          onClick={() => searchQuery ? setSearchQuery('') : showToast('Voice search coming soon!')}
          type="button"
          aria-label={searchQuery ? 'Clear' : 'Voice search'}
        >
          {searchQuery ? '✕' : <Mic size={13} />}
        </button>
      </div>

      {/* ─────────────────────── FILTER CHIPS ─────────────────────── */}
      <div className="dv2-chips-outer">
        <div className="dv2-chips-track">
          <button
            className={`dv2-chip${activeFilters.length === 0 ? ' active' : ''}`}
            onClick={() => setActiveFilters([])}
            type="button"
          >
            All
          </button>
          {FILTER_CHIPS.map((c, i) => (
            <button
              key={i}
              className={`dv2-chip${activeFilters.includes(c.filter) ? ' active' : ''}`}
              onClick={() => setActiveFilters(prev =>
                prev.includes(c.filter) ? prev.filter(f => f !== c.filter) : [...prev, c.filter]
              )}
              type="button"
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────── SEARCH RESULTS ─────────────────────── */}
      {searchQuery && (
        <>
          <div className="dv2-sec-row">
            <span className="dv2-sec-title">Results ({filteredSpaces.length})</span>
          </div>
          <div className="dv2-results">
            {filteredSpaces.map(space => (
              <div key={space.id} className="dv2-result-row" onClick={() => onSelectSpace(space)}>
                <div className="dv2-result-thumb">
                  <img src={space.image} alt={space.name} />
                </div>
                <div className="dv2-result-info">
                  <p className="dv2-result-name">{space.name}</p>
                  <p className="dv2-result-loc">{space.locationText}</p>
                  <div className="dv2-result-tags">
                    <span className={`dv2-free-pill ${space.freePercent > 50 ? 'g' : 'o'}`}>
                      {space.freePercent}% Free
                    </span>
                    <span className="dv2-star-pill">★ {space.rating}</span>
                  </div>
                </div>
                <div className="dv2-result-action">
                  <span className="dv2-result-price">₹{space.pricePerHour}<small>/hr</small></span>
                  <button
                    className="dv2-book-sm"
                    onClick={e => { e.stopPropagation(); onSelectSpace(space); }}
                    type="button"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
            {filteredSpaces.length === 0 && (
              <div className="dv2-empty">No spaces found for "{searchQuery}"</div>
            )}
          </div>
        </>
      )}

      {!searchQuery && (
        <>
          {/* ─────────────────────── FEATURED CARD ─────────────────────── */}
          <div className="dv2-sec-row">
            <span className="dv2-sec-title">Featured Space</span>
            <span className="dv2-live">● LIVE</span>
          </div>

          <article className="dv2-featured" onClick={() => onSelectSpace(featuredSpace)}>
            <div className="dv2-f-img">
              <img src={featuredSpace.image} alt={featuredSpace.name} />
              <div className="dv2-f-grad" />

              <div className="dv2-f-top-row">
                <span className="dv2-verified">
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Verified Space
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="dv2-occ-badge">🟢 {featuredSpace.freePercent}% Free</span>
                  <button
                    className="dv2-heart-btn"
                    onClick={e => { e.stopPropagation(); onToggleSaveSpace(featuredSpace.id); }}
                    type="button"
                  >
                    <Heart size={12} fill={savedSpaces.includes(featuredSpace.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="dv2-f-bottom-row">
                <div>
                  <p className="dv2-f-name">{featuredSpace.name}</p>
                  <p className="dv2-f-loc">{featuredSpace.locationText}</p>
                </div>
                <div className="dv2-f-rating">★ {featuredSpace.rating}</div>
              </div>
            </div>

            <div className="dv2-f-body">
              <div className="dv2-amenities">
                <span className="dv2-amenity">⌁ 150 Mbps</span>
                <span className="dv2-amenity">⚡ Charging</span>
                <span className="dv2-amenity">❄️ AC</span>
                <span className="dv2-amenity">📚 Library</span>
              </div>

              <div className="dv2-f-footer">
                <div className="dv2-price-block">
                  <span className="dv2-price">₹{featuredSpace.pricePerHour}<small>/hr</small></span>
                  <span className="dv2-price-tag">Student Pricing</span>
                </div>
                <div className="dv2-cta-btns">
                  <button
                    className="dv2-btn-ghost"
                    onClick={e => { e.stopPropagation(); onSelectSpace(featuredSpace); }}
                    type="button"
                  >
                    View Details
                  </button>
                  <button
                    className="dv2-btn-solid"
                    onClick={e => { e.stopPropagation(); onSelectSpace(featuredSpace); }}
                    type="button"
                  >
                    Reserve Seat
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* ─────────────────────── TRENDING NEAR YOU ─────────────────────── */}
          <div className="dv2-sec-row">
            <span className="dv2-sec-title">Trending Near You</span>
            <span className="dv2-see-all" onClick={() => showToast('Showing all trending spaces')}>See All</span>
          </div>

          <div className="dv2-hscroll-outer">
            <div className="dv2-hscroll-track">
              {trendingSpaces.map(space => (
                <div key={space.id} className="dv2-hcard" onClick={() => onSelectSpace(space)}>
                  <div className="dv2-hcard-img">
                    <img src={space.image} alt={space.name} />
                    <div className="dv2-hcard-grad" />
                    <span className={`dv2-hcard-free ${space.freePercent > 50 ? 'g' : 'o'}`}>
                      {space.freePercent}%
                    </span>
                    <button
                      className="dv2-hcard-heart"
                      onClick={e => { e.stopPropagation(); onToggleSaveSpace(space.id); }}
                      type="button"
                    >
                      <Heart size={11} fill={savedSpaces.includes(space.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="dv2-hcard-body">
                    <p className="dv2-hcard-name">{space.name}</p>
                    <div className="dv2-hcard-meta">
                      <span className="dv2-hcard-star">★ {space.rating}</span>
                      <span className="dv2-hcard-dot">·</span>
                      <span>{space.distance}</span>
                    </div>
                    <div className="dv2-hcard-foot">
                      <span className="dv2-hcard-price">₹{space.pricePerHour}/hr</span>
                      <button
                        className="dv2-book-sm"
                        onClick={e => { e.stopPropagation(); onSelectSpace(space); }}
                        type="button"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────── FOCUS JOURNEY ─────────────────────── */}
          <div className="dv2-sec-row">
            <span className="dv2-sec-title">Your Focus Journey</span>
            <span className="dv2-see-all" onClick={() => onSwitchTab('profile')}>View All</span>
          </div>

          <div className="dv2-focus-grid">
            <div className="dv2-focus-card fc-streak">
              <span className="dv2-fc-emoji">🔥</span>
              <span className="dv2-fc-val">7</span>
              <span className="dv2-fc-lbl">Day Streak</span>
            </div>
            <div className="dv2-focus-card fc-hours">
              <span className="dv2-fc-emoji">⏱️</span>
              <span className="dv2-fc-val">24h</span>
              <span className="dv2-fc-lbl">This Week</span>
            </div>
            <div className="dv2-focus-card fc-points">
              <span className="dv2-fc-emoji">🏆</span>
              <span className="dv2-fc-val">120</span>
              <span className="dv2-fc-lbl">Zyvo Points</span>
            </div>
          </div>

          {/* ─────────────────────── REWARDS ─────────────────────── */}
          <div className="dv2-rewards" onClick={() => onSwitchTab('rewards')}>
            <div className="dv2-rewards-content">
              <p className="dv2-rewards-title">Earn While You Focus 🪙</p>
              <p className="dv2-rewards-sub">Refer friends · Book sessions · Get free hours</p>
              <div className="dv2-rewards-badges">
                <span>🪙 120 Coins</span>
                <span>🎁 Referral Bonus</span>
                <span>⚡ 2× This Week</span>
              </div>
            </div>
            <div className="dv2-rewards-orb">🎯</div>
          </div>
        </>
      )}

      <div style={{ height: '100px' }} />
    </div>
  );
};
