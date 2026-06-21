import React from 'react';

export interface Space {
  id: string;
  name: string;
  category: string;
  freePercent: number;
  distance: string;
  rating: number;
  image: string;
  allImages: string[];
  description: string;
  locationText: string;
  bestFor: string;
  hours: string;
  ambience: string;
  amenities: string[];
  layout: string;
  categories: string[];
  pricePerHour: number;
}

export interface Reservation {
  id: string;
  spaceName: string;
  deskId: string;
  duration: string;
  price: number;
  time: string;
  ticketCode: string;
}

export interface LocationOption {
  title: string;
  address: string;
}

export interface Achievement {
  icon: string;
  value: string;
  label: string;
}

export interface MomentumStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
}

export interface ActivityLog {
  icon: string;
  title: string;
  subtitle: string;
  time: string;
}
