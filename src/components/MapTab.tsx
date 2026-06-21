import React from 'react';
import { Compass } from 'lucide-react';
import type { Space } from '../types';
import { spacesData } from '../data/spaces';

interface MapTabProps {
  onSelectSpace: (space: Space) => void;
  showToast: (msg: string) => void;
}

interface MapPinData {
  spaceId: string;
  top: string;
  left: string;
  label: string;
}

const MAP_PINS: MapPinData[] = [
  { spaceId: 'kalyan', top: '130px', left: '80px', label: 'Banjara Hills (32%)' },
  { spaceId: 'cowork-hive', top: '280px', left: '240px', label: 'Madhapur (58%)' },
  { spaceId: 'south-campus', top: '400px', left: '110px', label: 'Ameerpet (12%)' }
];

export const MapTab: React.FC<MapTabProps> = ({ onSelectSpace, showToast }) => {
  
  const handlePinClick = (spaceId: string) => {
    const space = spacesData.find(s => s.id === spaceId);
    if (space) {
      onSelectSpace(space);
      showToast(`Selected ${space.name} from map`);
    }
  };

  return (
    <div 
      className="app-main-content app-screen-view active-view" 
      id="tab-panel-map"
      style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
    >
      <div className="phone-map-canvas">
        
        {/* Glowing Map Pins */}
        {MAP_PINS.map((pin, idx) => (
          <div 
            key={idx}
            className="map-glowing-pin" 
            style={{ top: pin.top, left: pin.left }}
            onClick={() => handlePinClick(pin.spaceId)}
          >
            <div className="map-pin-circle"></div>
            <div className="map-pin-lbl">{pin.label}</div>
          </div>
        ))}

        {/* Controls Overlay */}
        <div className="map-pill-overlay">
          <div className="map-capsule-btn">
            <Compass size={12} style={{ strokeWidth: 2.5 }} />
            Map View
          </div>
          <div className="map-capsule-btn" style={{ background: '#0047FF' }}>
            Hyderabad · 0.4 km
          </div>
        </div>

        {/* SVG Simulated Streets Background */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ opacity: 0.15, pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0,100 L 400,250 M 0,350 L 400,300 M 150,0 L 220,600 M 300,0 L 50,600" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M 0,200 C 150,220 200,400 400,420" stroke="currentColor" strokeWidth="8" fill="none" />
          <circle cx="180" cy="210" r="120" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4" />
        </svg>
      </div>
      <div style={{ height: '80px' }} />
    </div>
  );
};
