import { AQIToastAlert } from '../types/toast';
import { getAQICategory } from './aqiCalculator';

export function createAQIAlertPayload(params: {
  city: string;
  stateProvince: string;
  country: string;
  aqi: number;
  pm25: number;
  pm10?: number;
  dominantPollutant?: string;
  durationMs?: number;
}): AQIToastAlert {
  const {
    city,
    stateProvince,
    country,
    aqi,
    pm25,
    pm10 = Math.round(pm25 * 1.5),
    dominantPollutant = 'PM2.5',
    durationMs = 8500,
  } = params;

  const category = getAQICategory(aqi);

  let title = `Air Quality Alert for ${city}`;
  let healthAdvice = 'Pollution concentration has exceeded WHO safety benchmarks.';
  let protectiveAction = 'Sensitive groups should reduce prolonged outdoor exertion.';
  let urgency: 'high' | 'very-high' | 'critical' = 'high';

  if (aqi > 300) {
    title = `Hazardous Emergency in ${city} (AQI ${aqi})`;
    healthAdvice = 'Emergency air quality advisory: severe respiratory hazard for everyone.';
    protectiveAction = 'Avoid all outdoor activity. Keep doors and windows tightly closed with air purifiers active.';
    urgency = 'critical';
  } else if (aqi > 200) {
    title = `Very Unhealthy Air Quality in ${city} (AQI ${aqi})`;
    healthAdvice = 'Increased risk of adverse cardio-respiratory effects for the entire population.';
    protectiveAction = 'Avoid strenuous outdoor exertion; wear an N95 respirator if stepping outside.';
    urgency = 'very-high';
  } else {
    // 151 - 200
    title = `Unhealthy Air Alert in ${city} (AQI ${aqi})`;
    healthAdvice = 'Elevated particulate concentration may aggravate asthma, heart disease, or lung conditions.';
    protectiveAction = 'Active children and adults should avoid prolonged outdoor exposure; wear a protective mask.';
    urgency = 'high';
  }

  return {
    id: `alert-${city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    city,
    stateProvince,
    country,
    aqi,
    category,
    dominantPollutant,
    pm25,
    pm10,
    timestamp: Date.now(),
    title,
    healthAdvice,
    protectiveAction,
    urgency,
    durationMs,
  };
}
