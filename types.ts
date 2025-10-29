import type React from 'react';

export interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  priceUSD: number;
  priceINR: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}