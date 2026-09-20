import { AQICategory } from './index';

export interface AQIToastAlert {
  id: string;
  city: string;
  stateProvince: string;
  country: string;
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pm25: number;
  pm10?: number;
  timestamp: number;
  title: string;
  healthAdvice: string;
  protectiveAction: string;
  urgency: 'high' | 'very-high' | 'critical';
  durationMs?: number;
}
