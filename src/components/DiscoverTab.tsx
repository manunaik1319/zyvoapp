import React, { useState } from 'react';
import { Bell, Heart, Mic, Search, Globe, Building, Laptop, BookOpen, Lock, Coffee } from 'lucide-react';
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

const CATEGORIES_META = [
  { 
    id: 'All', 
    label: 'All', 
    iconName: 'Globe', 
    color: '#3B66F5', 
    gradient: 'linear-gradient(135deg, #3B66F5 0%, #5E83FF 100%)',
    bgSoft: 'rgba(59, 102, 245, 0.05)',
    borderSoft: 'rgba(59, 102, 245, 0.12)'
  },
  { 
    id: 'Study Halls', 
    label: 'Study Halls', 
    iconName: 'Building', 
    color: '#10B981', 
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bgSoft: 'rgba(16, 185, 129, 0.05)',
    borderSoft: 'rgba(16, 185, 129, 0.12)'
  },
  { 
    id: 'Co-works', 
    label: 'Co-works', 
    iconName: 'Laptop', 
    color: '#6366F1', 
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    bgSoft: 'rgba(99, 102, 241, 0.05)',
    borderSoft: 'rgba(99, 102, 241, 0.12)'
  },
  { 
    id: 'Libraries', 
    label: 'Libraries', 
    iconName: 'BookOpen', 
    color: '#0D9488', 
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    bgSoft: 'rgba(13, 148, 136, 0.05)',
    borderSoft: 'rgba(13, 148, 136, 0.12)'
  },
  { 
    id: 'Private Halls', 
    label: 'Private Halls', 
    iconName: 'Lock', 
    color: '#8B5CF6', 
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    bgSoft: 'rgba(139, 92, 246, 0.05)',
    borderSoft: 'rgba(139, 92, 246, 0.12)'
  },
  { 
    id: 'Cafés', 
    label: 'Cafés', 
    iconName: 'Coffee', 
    color: '#D97706', 
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    bgSoft: 'rgba(217, 119, 6, 0.05)',
    borderSoft: 'rgba(217, 119, 6, 0.12)'
  },
];

const getCategoryTagStyle = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('quiet') || cat.includes('silent') || cat.includes('study')) {
    return {
      text: '#047857',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.2)'
    };
  }
  if (cat.includes('wi-fi') || cat.includes('wifi') || cat.includes('cowork') || cat.includes('co-work') || cat.includes('co-working')) {
    return {
      text: '#4338CA',
      bg: 'rgba(99, 102, 241, 0.08)',
      border: 'rgba(99, 102, 241, 0.2)'
    };
  }
  if (cat.includes('library') || cat.includes('libraries') || cat.includes('knowledge')) {
    return {
      text: '#0F766E',
      bg: 'rgba(13, 148, 136, 0.08)',
      border: 'rgba(13, 148, 136, 0.2)'
    };
  }
  if (cat.includes('cafe') || cat.includes('café') || cat.includes('coffee') || cat.includes('books')) {
    return {
      text: '#B45309',
      bg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.2)'
    };
  }
  return {
    text: '#6D21A8',
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.2)'
  };
};

interface IconComponentProps {
  name: string;
  size?: number;
  className?: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ name, size = 18, className = "" }) => {
  switch (name) {
    case 'Globe': return <Globe size={size} className={className} />;
    case 'Building': return <Building size={size} className={className} />;
    case 'Laptop': return <Laptop size={size} className={className} />;
    case 'BookOpen': return <BookOpen size={size} className={className} />;
    case 'Lock': return <Lock size={size} className={className} />;
    case 'Coffee': return <Coffee size={size} className={className} />;
    default: return <Globe size={size} className={className} />;
  }
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
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [selectedSidebarCategory, setSelectedSidebarCategory] = useState('All');

  const matchesCategory = (space: Space, cat: string) => {
    if (cat === 'All') return true;
    if (cat === 'Study Halls') {
      return space.name.toLowerCase().includes('reading room') || 
             space.name.toLowerCase().includes('study centre') || 
             space.category === 'Quiet Zone';
    }
    if (cat === 'Co-works') {
      return space.category.includes('Co-work') || 
             space.category.includes('Wi-Fi') || 
             space.category.includes('24/7') || 
             space.name.toLowerCase().includes('cowork') || 
             space.name.toLowerCase().includes('factory');
    }
    if (cat === 'Libraries') {
      return space.categories.includes('Libraries') || 
             space.category.includes('Library') || 
             space.name.toLowerCase().includes('library') || 
             space.name.toLowerCase().includes('knowledge hub');
    }
    if (cat === 'Private Halls') {
      return space.id === 'scholars-den' || 
             space.id === 'night-owl' || 
             space.name.toLowerCase().includes('den') || 
             space.name.toLowerCase().includes('owl');
    }
    if (cat === 'Cafés') {
      return space.categories.includes('Cafés') || 
             space.category.toLowerCase().includes('café') || 
             space.category.toLowerCase().includes('cafe');
    }
    return true;
  };

  const filteredNearbySpaces = spacesData.filter(space => matchesCategory(space, selectedSidebarCategory));

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

  // ── Active filter metadata for dynamic theming ──────────────────────────
  const getActiveFilterMeta = () => {
    if (activeFilters.includes('Libraries')) {
      return { label: 'Libraries', emoji: '📚', filter: 'Libraries', color: '#0D9488', gradient: 'linear-gradient(135deg,#0D9488 0%,#0F766E 100%)', sectionTitle: 'Top Libraries Near You', secondaryTitle: 'All Campus Libraries', cat: 'Libraries' };
    }
    if (activeFilters.includes('Cafés')) {
      return { label: 'Cafés', emoji: '☕', filter: 'Cafés', color: '#D97706', gradient: 'linear-gradient(135deg,#D97706 0%,#B45309 100%)', sectionTitle: 'Top Cafés Near You', secondaryTitle: 'More Café Spaces', cat: 'Cafés' };
    }
    if (activeFilters.includes('Wi-Fi')) {
      return { label: 'Wi-Fi Zones', emoji: '⚡', filter: 'Wi-Fi', color: '#6366F1', gradient: 'linear-gradient(135deg,#6366F1 0%,#4F46E5 100%)', sectionTitle: 'Best Wi-Fi Zones', secondaryTitle: 'Fast Wi-Fi Spaces', cat: 'Wi-Fi' };
    }
    if (activeFilters.includes('Quiet')) {
      return { label: 'Quiet Zones', emoji: '🤫', filter: 'Quiet', color: '#059669', gradient: 'linear-gradient(135deg,#10B981 0%,#059669 100%)', sectionTitle: 'Quiet Focus Zones', secondaryTitle: 'More Quiet Spaces', cat: 'Quiet' };
    }
    if (activeFilters.includes('Open Now')) {
      return { label: 'Open Now', emoji: '🕒', filter: 'Open Now', color: '#3B66F5', gradient: 'linear-gradient(135deg,#3B66F5 0%,#5E83FF 100%)', sectionTitle: 'Open Right Now', secondaryTitle: 'More Open Spaces', cat: 'Open Now' };
    }
    return null;
  };

  const activeFilterMeta = getActiveFilterMeta();
  const hasActiveFilter = !!activeFilterMeta;

  // ── Spaces filtered for current chip ─────────────────────────────────────
  const chipFilteredSpaces = hasActiveFilter
    ? spacesData.filter(s => s.categories.includes(activeFilterMeta!.filter))
    : spacesData;

  const getFeaturedSpace = () => {
    if (hasActiveFilter) {
      return chipFilteredSpaces[0] || spacesData[0];
    }
    return spacesData.find(s => s.id === 'kalyan') || spacesData[0];
  };

  const featuredSpace = getFeaturedSpace();
  // Trending: rest of filtered spaces (excluding featured)
  const trendingSpaces = (hasActiveFilter ? chipFilteredSpaces : spacesData).filter(s => s.id !== featuredSpace.id);
  // Secondary section: always libraries when no filter active, otherwise same category but different slice
  const librarySpaces = spacesData.filter(space => space.categories.includes('Libraries'));
  const secondarySpaces = hasActiveFilter
    ? chipFilteredSpaces.filter(s => s.id !== featuredSpace.id)
    : librarySpaces;

  const getSearchSections = () => {
    const sections: Record<string, Space[]> = {
      'Quiet Zones': [],
      'Campus Libraries': [],
      'Wi-Fi Zones': [],
      'Café Hubs': []
    };

    filteredSpaces.forEach(space => {
      const cat = space.category.toLowerCase();
      if (cat.includes('library') || space.categories.includes('Libraries')) {
        sections['Campus Libraries'].push(space);
      } else if (cat.includes('quiet') || cat.includes('silent') || space.categories.includes('Quiet')) {
        sections['Quiet Zones'].push(space);
      } else if (cat.includes('cafe') || cat.includes('café') || space.categories.includes('Cafés')) {
        sections['Café Hubs'].push(space);
      } else {
        sections['Wi-Fi Zones'].push(space);
      }
    });

    return Object.entries(sections).filter(([_, items]) => items.length > 0);
  };

  const searchSections = getSearchSections();

  if (showAllNearby) {
    const activeMeta = CATEGORIES_META.find(c => c.id === selectedSidebarCategory) || CATEGORIES_META[0];
    const totalCount = filteredNearbySpaces.length;

    return (
      <div className="seeall-root app-screen-view active-view" id="tab-panel-discover-all">

        {/* ── HEADER ── */}
        <header className="seeall-header">
          <button
            className="seeall-back-btn"
            onClick={() => setShowAllNearby(false)}
            type="button"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="seeall-header-center">
            <h2 className="seeall-title">Explore Spaces</h2>
            <p className="seeall-subtitle">
              <span style={{ color: activeMeta.color, fontWeight: 800 }}>{totalCount}</span> {selectedSidebarCategory === 'All' ? 'spaces' : selectedSidebarCategory.toLowerCase()} near you
            </p>
          </div>
          {/* Active category chip */}
          <span
            className="seeall-active-chip"
            style={{ background: activeMeta.bgSoft, color: activeMeta.color, boxShadow: `inset 0 0 0 1px ${activeMeta.borderSoft}` }}
          >
            <IconComponent name={activeMeta.iconName} size={11} />
            {activeMeta.label}
          </span>
        </header>

        {/* ── CATEGORY PILLS ROW (horizontal scrollable) ── */}
        <div className="seeall-cats-outer">
          <div className="seeall-cats-track">
            {CATEGORIES_META.map(cat => {
              const isActive = selectedSidebarCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`seeall-cat-pill ${isActive ? 'active' : ''}`}
                  style={isActive ? {
                    background: cat.gradient,
                    color: '#FFFFFF',
                    boxShadow: `0 4px 12px ${cat.borderSoft}`
                  } : {}}
                  onClick={() => setSelectedSidebarCategory(cat.id)}
                >
                  <span className="seeall-cat-icon" style={isActive ? { background: 'rgba(255,255,255,0.22)' } : { background: cat.bgSoft, color: cat.color }}>
                    <IconComponent name={cat.iconName} size={14} />
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SPACE LIST ── */}
        <div className="seeall-list">
          {filteredNearbySpaces.length === 0 ? (
            <div className="seeall-empty">
              <div className="seeall-empty-icon" style={{ background: activeMeta.bgSoft, color: activeMeta.color }}>
                <IconComponent name={activeMeta.iconName} size={28} />
              </div>
              <p className="seeall-empty-title">No spaces found</p>
              <p className="seeall-empty-sub">Try a different category or check back later.</p>
            </div>
          ) : (
            filteredNearbySpaces.map((space, idx) => {
              const tagStyle = getCategoryTagStyle(space.category);
              const freeColor = space.freePercent > 50 ? '#059669' : space.freePercent > 20 ? '#D97706' : '#DC2626';
              const freeBg   = space.freePercent > 50 ? 'rgba(5,150,105,0.08)' : space.freePercent > 20 ? 'rgba(217,119,6,0.08)' : 'rgba(220,38,38,0.08)';
              return (
                <div
                  key={space.id}
                  className="seeall-card"
                  style={{ animationDelay: `${idx * 55}ms` }}
                  onClick={() => onSelectSpace(space)}
                >
                  {/* Thumbnail */}
                  <div className="seeall-card-thumb">
                    <img src={space.image} alt={space.name} />
                    {/* Availability bar */}
                    <div className="seeall-avail-bar">
                      <div
                        className="seeall-avail-fill"
                        style={{ width: `${space.freePercent}%`, background: freeColor }}
                      />
                    </div>
                    {/* Rating badge */}
                    <span className="seeall-rating-badge" style={{ background: activeMeta.gradient }}>
                      ★ {space.rating}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="seeall-card-body">
                    <div className="seeall-card-top">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="seeall-card-name">{space.name}</h4>
                        <p className="seeall-card-loc">📍 {space.locationText}</p>
                      </div>
                      <div className="seeall-card-avail" style={{ color: freeColor, background: freeBg }}>
                        {space.freePercent}% free
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="seeall-card-tags">
                      <span
                        className="seeall-tag"
                        style={{ color: tagStyle.text, background: tagStyle.bg, border: `1px solid ${tagStyle.border}` }}
                      >
                        {space.category}
                      </span>
                      <span className="seeall-tag seeall-tag-dist">
                        🚶 {space.distance}
                      </span>
                      {space.categories.slice(0, 1).map(c => (
                        <span key={c} className="seeall-tag" style={{ color: '#6366F1', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="seeall-card-footer">
                      <div>
                        <span className="seeall-price" style={{ color: activeMeta.color }}>
                          ₹{space.pricePerHour}
                        </span>
                        <span className="seeall-price-label">/hr · Student rate</span>
                      </div>
                      <button
                        className="seeall-book-btn"
                        style={{ background: activeMeta.gradient, boxShadow: `0 4px 10px ${activeMeta.borderSoft}` }}
                        onClick={e => { e.stopPropagation(); onSelectSpace(space); }}
                        type="button"
                      >
                        Book Seat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ height: '90px' }} />
      </div>
    );
  }


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
            <span className="dv2-sec-title">Search Results ({filteredSpaces.length})</span>
          </div>
          
          <div className="dv2-results" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {searchSections.map(([sectionName, items]) => (
              <div key={sectionName} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--zyvo-orange)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px', display: 'block' }}>
                  {sectionName} ({items.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(space => (
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
          {/* ─────────────────────── ACTIVE FILTER BANNER ─────────────────────── */}
          {hasActiveFilter && (
            <div className="dv2-filter-banner" style={{ background: `linear-gradient(135deg, ${activeFilterMeta!.color}12 0%, ${activeFilterMeta!.color}08 100%)`, borderColor: `${activeFilterMeta!.color}30` }}>
              <span className="dv2-filter-banner-icon" style={{ background: activeFilterMeta!.gradient }}>
                {activeFilterMeta!.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="dv2-filter-banner-label" style={{ color: activeFilterMeta!.color }}>
                  {activeFilterMeta!.label} Selected
                </p>
                <p className="dv2-filter-banner-sub">
                  Showing {chipFilteredSpaces.length} matching spaces
                </p>
              </div>
              <button
                type="button"
                className="dv2-filter-clear-btn"
                onClick={() => setActiveFilters([])}
                style={{ color: activeFilterMeta!.color, borderColor: `${activeFilterMeta!.color}40` }}
              >
                Clear
              </button>
            </div>
          )}

          {/* ─────────────────────── FEATURED CARD ─────────────────────── */}
          <div className="dv2-sec-group">
            <div className="dv2-sec-row">
              <span className="dv2-sec-title">
                {hasActiveFilter ? `Top ${activeFilterMeta!.label} Pick` : 'Featured Space'}
              </span>
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
          </div>

          {/* ─────────────────────── TRENDING / FILTERED SECTION ──────────── */}
          {trendingSpaces.length > 0 && (
            <div className="dv2-sec-group">
              <div className="dv2-sec-row">
                <span className="dv2-sec-title">
                  {hasActiveFilter ? activeFilterMeta!.sectionTitle : 'Trending Near You'}
                </span>
                <span
                  className="dv2-see-all"
                  style={hasActiveFilter ? { color: activeFilterMeta!.color } : {}}
                  onClick={() => {
                    setShowAllNearby(true);
                    if (hasActiveFilter) setSelectedSidebarCategory(activeFilterMeta!.cat);
                  }}
                >
                  See All
                </span>
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
            </div>
          )}

          {/* ─────────────────────── SECONDARY SECTION ───────────────────── */}
          {/* When no filter → show Libraries. When filter active → show more of same category */}
          {secondarySpaces.length > 0 && (
            <div className="dv2-sec-group">
              <div className="dv2-sec-row">
                <span className="dv2-sec-title">
                  {hasActiveFilter ? activeFilterMeta!.secondaryTitle : 'Libraries Available'}
                </span>
                <span
                  className="dv2-see-all"
                  style={hasActiveFilter ? { color: activeFilterMeta!.color } : {}}
                  onClick={() => {
                    setShowAllNearby(true);
                    setSelectedSidebarCategory(hasActiveFilter ? activeFilterMeta!.cat : 'Libraries');
                  }}
                >
                  See All
                </span>
              </div>

              <div className="dv2-hscroll-outer">
                <div className="dv2-hscroll-track">
                  {secondarySpaces.map(space => (
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
            </div>
          )}

          {/* ─── Empty state when filter has 0 results ─────────────────── */}
          {hasActiveFilter && chipFilteredSpaces.length === 0 && (
            <div className="dv2-filter-empty">
              <span className="dv2-filter-empty-icon">{activeFilterMeta!.emoji}</span>
              <p className="dv2-filter-empty-title">No {activeFilterMeta!.label} Found</p>
              <p className="dv2-filter-empty-sub">Try a different filter or explore all spaces.</p>
              <button type="button" className="dv2-filter-empty-btn" onClick={() => setActiveFilters([])}>
                Show All Spaces
              </button>
            </div>
          )}
        </>
      )}

      <div style={{ height: '100px' }} />
    </div>
  );
};
