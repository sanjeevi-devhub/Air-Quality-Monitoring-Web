export type NavTab = 
  | 'home' 
  | 'dashboard' 
  | 'analytics' 
  | 'prediction' 
  | 'models' 
  | 'insights' 
  | 'about';

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface PollutantData {
  id: string;
  name: string;
  chemical: string;
  value: number;
  unit: string;
  standardLimit: number; // Safe WHO/EPA limit
  status: 'Good' | 'Moderate' | 'Poor' | 'Severe';
  change24h: number; // percentage
  description: string;
  sources: string[];
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  pressure: number; // hPa
  uvIndex: number;
  visibility: number; // km
  condition: string;
}

export interface StationInfo {
  id: string;
  name: string;
  type: 'Urban' | 'Industrial' | 'Traffic' | 'Suburban' | 'Coastal';
  location: string;
  coordinates: [number, number];
  aqi: number;
  dominantPollutant: string;
  status: 'Online' | 'Calibrating' | 'Maintenance';
  lastUpdated: string;
}

export interface HistoricalPoint {
  timestamp: string;
  timeLabel: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  temperature: number;
  humidity: number;
}

export interface MonthlyTrend {
  month: string;
  avgAqi: number;
  maxAqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
}

export interface SeasonalTrend {
  season: string;
  aqi: number;
  pm25: number;
  dominantFactor: string;
  temperature: number;
  inversionRisk: string;
}

export interface ForecastPoint {
  time: string;
  historicalValue?: number;
  predictedValue: number;
  confidenceLower: number;
  confidenceUpper: number;
  isForecast: boolean;
  aqi: number;
  category: AQICategory;
}

export interface MLModelMetric {
  id: string;
  name: string;
  architecture: string;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  inferenceSpeedMs: number;
  trainingTimeSec: number;
  isBest?: boolean;
  pros: string[];
  cons: string[];
  bestUseFor: string;
}

export interface InsightAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  title: string;
  category: 'Pollution Surge' | 'Weather Trapping' | 'Health Advisory' | 'Traffic Congestion' | 'Model Anomaly' | 'Environmental Condition Summary';
  message: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  actionSuggested: string;
  timestamp: string;
}

export interface LocationAirQualityRecord {
  country: string;
  stateProvince: string;
  cityArea: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  aqi: number;
  historicalAqi: number;
  predictedAqi: number;
  pollutionLevel: AQICategory;
  pollutionTrend: 'Rising' | 'Falling' | 'Stable';
  dominantPollutant: string;
  stationType?: 'Urban' | 'Industrial' | 'Traffic' | 'Suburban' | 'Coastal';
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}
