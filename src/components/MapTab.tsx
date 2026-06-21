import React, { useEffect, useRef, useState } from 'react';
import { Compass } from 'lucide-react';
import type { Space } from '../types';
import { spacesData } from '../data/spaces';

interface MapTabProps {
  onSelectSpace: (space: Space) => void;
  showToast: (msg: string) => void;
  focusSpaceId?: string | null;
  onClearFocus?: () => void;
}

export const MapTab: React.FC<MapTabProps> = ({ 
  onSelectSpace, 
  showToast,
  focusSpaceId,
  onClearFocus
}) => {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  // Dynamic Leaflet Loader
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
      console.error('Failed to load Leaflet script');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Clean up previous map instance if any
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (err) {
        console.error('Error removing map instance:', err);
      }
      mapInstanceRef.current = null;
    }

    // Initialize map centered at Hyderabad
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([17.43, 78.43], 12);
    
    mapInstanceRef.current = map;

    // Add Voyager styled map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Custom glowing Map pins DivIcon (offsets adjusted)
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

    const spaceMarkers = spacesData.map(space => ({
      spaceId: space.id,
      coords: spaceCoords[space.id] || [17.43, 78.43],
      name: space.name,
      occupancy: `${space.freePercent}% Free`,
      price: `₹${space.pricePerHour}/hr`
    }));

    markersRef.current = {};
    spaceMarkers.forEach((marker) => {
      const leafletMarker = L.marker(marker.coords, { icon: customIcon }).addTo(map);
      markersRef.current[marker.spaceId] = leafletMarker;

      // Interactive popup with custom styled markup
      const popupCard = document.createElement('div');
      popupCard.className = 'map-leaflet-popup-card';
      popupCard.innerHTML = `
        <div style="font-family: 'Outfit', sans-serif; font-size: 11.5px; font-weight: 850; color: #0F172A; margin-bottom: 2px;">
          ${marker.name}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #64748B; margin-bottom: 8px; font-weight: 600;">
          <span style="color: #10B981;">⚡ ${marker.occupancy}</span>
          <span style="color: #3B66F5; font-weight: 800;">${marker.price}</span>
        </div>
        <button id="btn-popup-${marker.spaceId}" style="width: 100%; height: 26px; border: none; background: linear-gradient(135deg, #3B66F5 0%, #5E83FF 100%); color: #FFFFFF; font-size: 9.5px; font-weight: 800; border-radius: 6px; cursor: pointer;">
          Book Space
        </button>
      `;

      leafletMarker.bindPopup(popupCard, {
        closeButton: false,
        offset: [0, -10]
      });

      // Bind button click events on popup opens
      leafletMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${marker.spaceId}`);
        if (btn) {
          btn.onclick = () => {
            const space = spacesData.find(s => s.id === marker.spaceId);
            if (space) {
              onSelectSpace(space);
              showToast(`Selected ${space.name}`);
            }
          };
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          console.error('Error removing map instance on cleanup:', err);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Center and open popup when focused from bookings
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !focusSpaceId) return;

    const timer = setTimeout(() => {
      const marker = markersRef.current[focusSpaceId];
      if (marker) {
        const latlng = marker.getLatLng();
        mapInstanceRef.current.setView(latlng, 14.5);
        marker.openPopup();
        showToast(`Navigated to ${spacesData.find(s => s.id === focusSpaceId)?.name || 'hall'}`);
        onClearFocus?.();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [leafletLoaded, focusSpaceId, onClearFocus, showToast]);

  return (
    <div 
      className="app-main-content app-screen-view active-view" 
      id="tab-panel-map"
      style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <header className="profile-topbar" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <h2 className="profile-page-title">Interactive Map</h2>
        <div className="map-capsule-btn" style={{ background: '#3B66F5', color: '#FFFFFF', fontSize: '9px', padding: '4px 8px' }}>
          Hyderabad Live
        </div>
      </header>

      {/* REAL LIVE MAP VIEW MODE */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Leaflet Map Div container - Explicit height sets bounds! */}
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '700px', background: '#E8ECEF', zIndex: 1 }}
        />

        {/* Fixed Controls Overlay */}
        <div className="map-pill-overlay" style={{ top: '14px', zIndex: 10 }}>
          <div className="map-capsule-btn" style={{ pointerEvents: 'auto' }}>
            <Compass size={12} style={{ strokeWidth: 2.5 }} />
            Live Interactive
          </div>
          <div className="map-capsule-btn" style={{ background: '#3B66F5', pointerEvents: 'auto' }}>
            OpenStreetMap Tiles
          </div>
        </div>
      </div>
      <div style={{ height: '80px' }} />
    </div>
  );
};
