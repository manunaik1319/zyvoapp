import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Heart } from 'lucide-react';
import type { Space } from '../types';

interface SpaceDetailsProps {
  space: Space;
  onClose: () => void;
  onProceed: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const SpaceDetails: React.FC<SpaceDetailsProps> = ({
  space,
  onClose,
  onProceed,
  isSaved,
  onToggleSave
}) => {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const spaceCoords: Record<string, [number, number]> = {
    'kalyan': [17.4156, 78.4347],
    'cowork-hive': [17.4483, 78.3915],
    'public-library': [17.4326, 78.4726],
    'study-yard': [17.4435, 78.3489],
    'bean-books': [17.4278, 78.4062],
    'scholars-den': [17.4622, 78.3568],
    'south-campus': [17.4375, 78.4482],
    'science-library': [17.4756, 78.4312],
    'night-owl': [17.4855, 78.3885],
    'focus-factory': [17.4334, 78.5015]
  };

  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet script in details');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (err) {
        console.error('Error removing map instance in details:', err);
      }
      mapInstanceRef.current = null;
    }

    const coords = spaceCoords[space.id] || [17.43, 78.43];
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(coords, 14.5);

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'zyvo-custom-leaflet-marker',
      html: `
        <div class="map-glowing-pin" style="position: relative; transform: translate(-16px, -16px);">
          <div class="map-pin-circle"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker(coords, { icon: customIcon }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; color: #0F172A; text-align: center;">
        ${space.name}
      </div>
    `, { closeButton: false, offset: [0, -10] }).openPopup();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          console.error('Error removing map instance on cleanup in details:', err);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, space.id]);

  return (
    <div className="payment-flow-view" id="space-details-overlay">
      {/* Header */}
      <div className="payment-flow-header">
        <button type="button" className="payment-back-btn" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '15px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {space.name}
        </h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            type="button" 
            className="payment-back-btn" 
            style={{ color: isSaved ? '#EF4444' : 'var(--zyvo-text-muted)' }}
            onClick={() => onToggleSave(space.id)}
          >
            <Heart size={18} fill={isSaved ? '#EF4444' : 'none'} />
          </button>
          <button type="button" className="payment-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Details Scroll Content */}
      <div className="payment-scroll-content" style={{ gap: '20px' }}>
        {/* Gallery Stack */}
        <div className="space-detail-hero" style={{ height: '180px' }}>
          <div className="space-detail-main-image">
            <img src={space.allImages[0]} alt="Main space view" id="detail-main-image" />
            <span className="space-detail-photo-badge" id="detail-photo-badge">
              {space.allImages.length} photos
            </span>
          </div>
          <div className="space-detail-side-stack">
            <div className="space-detail-side-image">
              <img src={space.allImages[1]} alt="Side space view 1" id="detail-side-image-one" />
            </div>
            <div className="space-detail-side-image">
              <img src={space.allImages[2]} alt="Side space view 2" id="detail-side-image-two" />
            </div>
          </div>
        </div>

        {/* Space Category and Title */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="verified-space-badge" style={{ background: 'var(--zyvo-orange-soft)', color: 'var(--zyvo-orange)', border: '1px solid var(--zyvo-orange-border)' }}>
              {space.category}
            </span>
            <strong style={{ fontSize: '16px', color: 'var(--zyvo-orange)' }}>
              ₹{space.pricePerHour}/hr
            </strong>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '8px', color: 'var(--zyvo-text-main)', letterSpacing: '-0.025em' }}>
            {space.name}
          </h1>
        </div>

        {/* Amenities chips */}
        <div className="space-detail-summary" style={{ padding: 0, background: 'none', border: 'none' }}>
          <div className="space-detail-meta-row" id="detail-meta-row" style={{ flexWrap: 'wrap' }}>
            {space.amenities.map((item, idx) => (
              <span className="space-detail-chip" key={idx}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="checkout-summary-card" style={{ padding: '14px' }}>
          <strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>About this workspace</strong>
          <p className="space-detail-copy" id="detail-description" style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.5 }}>
            {space.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="space-detail-grid" style={{ marginTop: '0' }}>
          <div className="space-info-card">
            <span>Location</span>
            <strong id="detail-location">{space.locationText}</strong>
          </div>
          <div className="space-info-card">
            <span>Best For</span>
            <strong id="detail-best-for">{space.bestFor}</strong>
          </div>
          <div className="space-info-card">
            <span>Opening Hours</span>
            <strong id="detail-hours">{space.hours}</strong>
          </div>
          <div className="space-info-card">
            <span>Ambience</span>
            <strong id="detail-ambience">{space.ambience}</strong>
          </div>
        </div>

        {/* Location of Hall Map */}
        <div className="space-layout-card">
          <div className="space-layout-head" style={{ marginBottom: '10px' }}>
            <strong>Location of Hall</strong>
            <span id="detail-layout-caption">{space.locationText}</span>
          </div>
          <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '180px', borderRadius: '12px', background: '#E8ECEF', zIndex: 1, position: 'relative', overflow: 'hidden' }}
          />
        </div>
      </div>

      {/* Sticky Bottom Booking Button */}
      <div className="payment-flow-footer-btn-container">
        <button 
          type="button" 
          className="payment-primary-cta-btn"
          onClick={onProceed}
        >
          Select Focus Seat & Book
        </button>
      </div>
    </div>
  );
};
