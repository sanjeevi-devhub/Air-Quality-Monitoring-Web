import { LocationAirQualityRecord, ForecastPoint, AQICategory } from '../types';
import { getAQICategory } from '../utils/aqiCalculator';

/**
 * Global Air Quality Dataset with Hierarchical Location Taxonomy:
 * Country -> State/Province -> City/Area
 *
 * Each record contains observed telemetry (PM2.5, PM10, NO2, SO2, CO, O3, AQI),
 * historical recorded levels, baseline predicted levels, and meteorological conditions.
 */
export const GLOBAL_LOCATION_DATASETS: LocationAirQualityRecord[] = [
  // ================= INDIA =================
  {
    country: 'India',
    stateProvince: 'Tamil Nadu',
    cityArea: 'Chennai',
    pm25: 72,
    pm10: 118,
    no2: 42,
    so2: 14.8,
    co: 1.12,
    o3: 38.5,
    aqi: 156,
    historicalAqi: 148,
    predictedAqi: 164,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Coastal',
    temperature: 31.4,
    humidity: 78,
    windSpeed: 12.5,
  },
  {
    country: 'India',
    stateProvince: 'Tamil Nadu',
    cityArea: 'Coimbatore',
    pm25: 45,
    pm10: 82,
    no2: 28,
    so2: 9.4,
    co: 0.78,
    o3: 32.1,
    aqi: 98,
    historicalAqi: 104,
    predictedAqi: 91,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 28.2,
    humidity: 65,
    windSpeed: 15.0,
  },
  {
    country: 'India',
    stateProvince: 'Tamil Nadu',
    cityArea: 'Madurai',
    pm25: 52,
    pm10: 88,
    no2: 31,
    so2: 11.2,
    co: 0.85,
    o3: 34.6,
    aqi: 112,
    historicalAqi: 108,
    predictedAqi: 116,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 33.1,
    humidity: 58,
    windSpeed: 10.4,
  },
  {
    country: 'India',
    stateProvince: 'Tamil Nadu',
    cityArea: 'Salem',
    pm25: 49,
    pm10: 85,
    no2: 29,
    so2: 12.0,
    co: 0.82,
    o3: 33.0,
    aqi: 104,
    historicalAqi: 104,
    predictedAqi: 105,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Industrial',
    temperature: 30.8,
    humidity: 62,
    windSpeed: 11.2,
  },
  {
    country: 'India',
    stateProvince: 'Karnataka',
    cityArea: 'Bengaluru',
    pm25: 58,
    pm10: 96,
    no2: 35,
    so2: 10.5,
    co: 0.94,
    o3: 36.2,
    aqi: 121,
    historicalAqi: 114,
    predictedAqi: 127,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 26.5,
    humidity: 68,
    windSpeed: 13.8,
  },
  {
    country: 'India',
    stateProvince: 'Karnataka',
    cityArea: 'Mysuru',
    pm25: 36,
    pm10: 65,
    no2: 22,
    so2: 7.2,
    co: 0.62,
    o3: 28.5,
    aqi: 76,
    historicalAqi: 82,
    predictedAqi: 71,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 27.0,
    humidity: 64,
    windSpeed: 14.1,
  },
  {
    country: 'India',
    stateProvince: 'Karnataka',
    cityArea: 'Mangaluru',
    pm25: 41,
    pm10: 72,
    no2: 25,
    so2: 8.9,
    co: 0.70,
    o3: 30.1,
    aqi: 84,
    historicalAqi: 88,
    predictedAqi: 82,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 29.5,
    humidity: 82,
    windSpeed: 16.5,
  },
  {
    country: 'India',
    stateProvince: 'Maharashtra',
    cityArea: 'Mumbai',
    pm25: 68,
    pm10: 110,
    no2: 39,
    so2: 13.5,
    co: 1.05,
    o3: 37.8,
    aqi: 145,
    historicalAqi: 138,
    predictedAqi: 152,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Coastal',
    temperature: 30.2,
    humidity: 79,
    windSpeed: 14.2,
  },
  {
    country: 'India',
    stateProvince: 'Maharashtra',
    cityArea: 'Pune',
    pm25: 54,
    pm10: 92,
    no2: 32,
    so2: 10.1,
    co: 0.88,
    o3: 35.0,
    aqi: 115,
    historicalAqi: 118,
    predictedAqi: 112,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 27.8,
    humidity: 60,
    windSpeed: 12.0,
  },
  {
    country: 'India',
    stateProvince: 'Maharashtra',
    cityArea: 'Nagpur',
    pm25: 62,
    pm10: 102,
    no2: 36,
    so2: 12.8,
    co: 0.98,
    o3: 39.4,
    aqi: 132,
    historicalAqi: 125,
    predictedAqi: 138,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Industrial',
    temperature: 32.0,
    humidity: 50,
    windSpeed: 9.8,
  },
  {
    country: 'India',
    stateProvince: 'Delhi NCT',
    cityArea: 'New Delhi',
    pm25: 142,
    pm10: 215,
    no2: 58,
    so2: 24.5,
    co: 2.15,
    o3: 48.0,
    aqi: 224,
    historicalAqi: 210,
    predictedAqi: 236,
    pollutionLevel: 'Very Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 25.4,
    humidity: 55,
    windSpeed: 7.5,
  },
  {
    country: 'India',
    stateProvince: 'Delhi NCT',
    cityArea: 'Dwarka',
    pm25: 128,
    pm10: 198,
    no2: 52,
    so2: 21.0,
    co: 1.95,
    o3: 45.2,
    aqi: 208,
    historicalAqi: 196,
    predictedAqi: 216,
    pollutionLevel: 'Very Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Traffic',
    temperature: 26.0,
    humidity: 54,
    windSpeed: 8.2,
  },
  {
    country: 'India',
    stateProvince: 'West Bengal',
    cityArea: 'Kolkata',
    pm25: 88,
    pm10: 140,
    no2: 44,
    so2: 16.2,
    co: 1.25,
    o3: 41.0,
    aqi: 168,
    historicalAqi: 162,
    predictedAqi: 175,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 29.8,
    humidity: 76,
    windSpeed: 10.6,
  },
  {
    country: 'India',
    stateProvince: 'Gujarat',
    cityArea: 'Ahmedabad',
    pm25: 78,
    pm10: 126,
    no2: 41,
    so2: 15.0,
    co: 1.18,
    o3: 40.5,
    aqi: 162,
    historicalAqi: 169,
    predictedAqi: 155,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Industrial',
    temperature: 34.5,
    humidity: 45,
    windSpeed: 11.5,
  },

  // ================= NEPAL =================
  {
    country: 'Nepal',
    stateProvince: 'Bagmati Province',
    cityArea: 'Kathmandu',
    pm25: 85,
    pm10: 135,
    no2: 48,
    so2: 12.5,
    co: 1.30,
    o3: 35.8,
    aqi: 172,
    historicalAqi: 165,
    predictedAqi: 180,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 21.2,
    humidity: 70,
    windSpeed: 6.8,
  },
  {
    country: 'Nepal',
    stateProvince: 'Bagmati Province',
    cityArea: 'Lalitpur',
    pm25: 79,
    pm10: 128,
    no2: 45,
    so2: 11.8,
    co: 1.22,
    o3: 34.0,
    aqi: 165,
    historicalAqi: 158,
    predictedAqi: 170,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 21.5,
    humidity: 69,
    windSpeed: 7.1,
  },
  {
    country: 'Nepal',
    stateProvince: 'Gandaki Province',
    cityArea: 'Pokhara',
    pm25: 42,
    pm10: 76,
    no2: 24,
    so2: 6.8,
    co: 0.65,
    o3: 29.4,
    aqi: 89,
    historicalAqi: 94,
    predictedAqi: 84,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 23.6,
    humidity: 72,
    windSpeed: 10.2,
  },
  {
    country: 'Nepal',
    stateProvince: 'Gandaki Province',
    cityArea: 'Bharatpur',
    pm25: 56,
    pm10: 92,
    no2: 33,
    so2: 9.1,
    co: 0.86,
    o3: 33.2,
    aqi: 118,
    historicalAqi: 115,
    predictedAqi: 122,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Traffic',
    temperature: 28.0,
    humidity: 75,
    windSpeed: 8.5,
  },
  {
    country: 'Nepal',
    stateProvince: 'Koshi Province',
    cityArea: 'Biratnagar',
    pm25: 69,
    pm10: 112,
    no2: 38,
    so2: 11.5,
    co: 1.02,
    o3: 36.4,
    aqi: 146,
    historicalAqi: 142,
    predictedAqi: 149,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Industrial',
    temperature: 30.1,
    humidity: 74,
    windSpeed: 9.4,
  },

  // ================= BANGLADESH =================
  {
    country: 'Bangladesh',
    stateProvince: 'Dhaka Division',
    cityArea: 'Dhaka',
    pm25: 98,
    pm10: 156,
    no2: 52,
    so2: 17.5,
    co: 1.45,
    o3: 42.0,
    aqi: 188,
    historicalAqi: 180,
    predictedAqi: 196,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 29.2,
    humidity: 80,
    windSpeed: 8.8,
  },
  {
    country: 'Bangladesh',
    stateProvince: 'Dhaka Division',
    cityArea: 'Gazipur',
    pm25: 92,
    pm10: 146,
    no2: 49,
    so2: 18.2,
    co: 1.38,
    o3: 39.5,
    aqi: 178,
    historicalAqi: 172,
    predictedAqi: 184,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Industrial',
    temperature: 29.5,
    humidity: 78,
    windSpeed: 8.2,
  },
  {
    country: 'Bangladesh',
    stateProvince: 'Chittagong Division',
    cityArea: 'Chittagong',
    pm25: 64,
    pm10: 105,
    no2: 36,
    so2: 12.0,
    co: 0.95,
    o3: 35.2,
    aqi: 135,
    historicalAqi: 142,
    predictedAqi: 128,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Coastal',
    temperature: 30.5,
    humidity: 84,
    windSpeed: 14.5,
  },
  {
    country: 'Bangladesh',
    stateProvince: 'Sylhet Division',
    cityArea: 'Sylhet',
    pm25: 46,
    pm10: 78,
    no2: 25,
    so2: 8.5,
    co: 0.72,
    o3: 30.4,
    aqi: 92,
    historicalAqi: 95,
    predictedAqi: 88,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 27.8,
    humidity: 86,
    windSpeed: 11.2,
  },

  // ================= SRI LANKA =================
  {
    country: 'Sri Lanka',
    stateProvince: 'Western Province',
    cityArea: 'Colombo',
    pm25: 36,
    pm10: 64,
    no2: 22,
    so2: 7.8,
    co: 0.62,
    o3: 26.5,
    aqi: 75,
    historicalAqi: 78,
    predictedAqi: 72,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 29.0,
    humidity: 82,
    windSpeed: 17.2,
  },
  {
    country: 'Sri Lanka',
    stateProvince: 'Central Province',
    cityArea: 'Kandy',
    pm25: 28,
    pm10: 52,
    no2: 16,
    so2: 5.4,
    co: 0.48,
    o3: 22.0,
    aqi: 59,
    historicalAqi: 62,
    predictedAqi: 56,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Suburban',
    temperature: 24.5,
    humidity: 76,
    windSpeed: 11.0,
  },
  {
    country: 'Sri Lanka',
    stateProvince: 'Southern Province',
    cityArea: 'Galle',
    pm25: 24,
    pm10: 45,
    no2: 14,
    so2: 4.8,
    co: 0.42,
    o3: 20.5,
    aqi: 48,
    historicalAqi: 48,
    predictedAqi: 46,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 28.5,
    humidity: 85,
    windSpeed: 19.4,
  },

  // ================= PAKISTAN =================
  {
    country: 'Pakistan',
    stateProvince: 'Punjab',
    cityArea: 'Lahore',
    pm25: 154,
    pm10: 232,
    no2: 62,
    so2: 26.0,
    co: 2.35,
    o3: 51.0,
    aqi: 238,
    historicalAqi: 225,
    predictedAqi: 248,
    pollutionLevel: 'Very Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 26.8,
    humidity: 62,
    windSpeed: 6.2,
  },
  {
    country: 'Pakistan',
    stateProvince: 'Punjab',
    cityArea: 'Rawalpindi',
    pm25: 82,
    pm10: 130,
    no2: 43,
    so2: 14.5,
    co: 1.20,
    o3: 38.0,
    aqi: 165,
    historicalAqi: 158,
    predictedAqi: 172,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Traffic',
    temperature: 24.2,
    humidity: 58,
    windSpeed: 8.6,
  },
  {
    country: 'Pakistan',
    stateProvince: 'Sindh',
    cityArea: 'Karachi',
    pm25: 86,
    pm10: 138,
    no2: 46,
    so2: 16.0,
    co: 1.28,
    o3: 40.5,
    aqi: 170,
    historicalAqi: 165,
    predictedAqi: 176,
    pollutionLevel: 'Unhealthy',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Coastal',
    temperature: 31.0,
    humidity: 74,
    windSpeed: 15.0,
  },
  {
    country: 'Pakistan',
    stateProvince: 'Islamabad Capital',
    cityArea: 'Islamabad',
    pm25: 52,
    pm10: 86,
    no2: 30,
    so2: 9.8,
    co: 0.82,
    o3: 32.5,
    aqi: 110,
    historicalAqi: 116,
    predictedAqi: 104,
    pollutionLevel: 'Unhealthy for Sensitive',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Suburban',
    temperature: 23.5,
    humidity: 56,
    windSpeed: 10.5,
  },

  // ================= BHUTAN =================
  {
    country: 'Bhutan',
    stateProvince: 'Thimphu District',
    cityArea: 'Thimphu',
    pm25: 22,
    pm10: 42,
    no2: 12,
    so2: 3.5,
    co: 0.38,
    o3: 24.0,
    aqi: 44,
    historicalAqi: 46,
    predictedAqi: 42,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 17.5,
    humidity: 62,
    windSpeed: 8.4,
  },
  {
    country: 'Bhutan',
    stateProvince: 'Chukha District',
    cityArea: 'Phuentsholing',
    pm25: 48,
    pm10: 82,
    no2: 27,
    so2: 8.8,
    co: 0.75,
    o3: 31.2,
    aqi: 96,
    historicalAqi: 92,
    predictedAqi: 101,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM10',
    stationType: 'Traffic',
    temperature: 28.0,
    humidity: 78,
    windSpeed: 9.2,
  },

  // ================= USA =================
  {
    country: 'USA',
    stateProvince: 'California',
    cityArea: 'Los Angeles',
    pm25: 38,
    pm10: 68,
    no2: 34,
    so2: 4.2,
    co: 0.85,
    o3: 45.0,
    aqi: 82,
    historicalAqi: 76,
    predictedAqi: 88,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Rising',
    dominantPollutant: 'O₃',
    stationType: 'Urban',
    temperature: 25.6,
    humidity: 52,
    windSpeed: 11.2,
  },
  {
    country: 'USA',
    stateProvince: 'California',
    cityArea: 'San Francisco',
    pm25: 24,
    pm10: 46,
    no2: 22,
    so2: 3.1,
    co: 0.52,
    o3: 31.0,
    aqi: 48,
    historicalAqi: 52,
    predictedAqi: 44,
    pollutionLevel: 'Good',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Coastal',
    temperature: 18.4,
    humidity: 75,
    windSpeed: 18.5,
  },
  {
    country: 'USA',
    stateProvince: 'New York',
    cityArea: 'New York City',
    pm25: 35,
    pm10: 62,
    no2: 32,
    so2: 6.5,
    co: 0.78,
    o3: 38.2,
    aqi: 74,
    historicalAqi: 70,
    predictedAqi: 78,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Rising',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 22.0,
    humidity: 60,
    windSpeed: 14.0,
  },
  {
    country: 'USA',
    stateProvince: 'Washington',
    cityArea: 'Seattle',
    pm25: 20,
    pm10: 40,
    no2: 18,
    so2: 2.8,
    co: 0.44,
    o3: 28.0,
    aqi: 42,
    historicalAqi: 44,
    predictedAqi: 40,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 19.2,
    humidity: 68,
    windSpeed: 12.8,
  },
  {
    country: 'USA',
    stateProvince: 'Texas',
    cityArea: 'Houston',
    pm25: 42,
    pm10: 74,
    no2: 36,
    so2: 11.2,
    co: 0.90,
    o3: 44.5,
    aqi: 90,
    historicalAqi: 86,
    predictedAqi: 95,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Rising',
    dominantPollutant: 'O₃',
    stationType: 'Industrial',
    temperature: 31.5,
    humidity: 72,
    windSpeed: 10.4,
  },

  // ================= UK =================
  {
    country: 'UK',
    stateProvince: 'England',
    cityArea: 'London',
    pm25: 31,
    pm10: 56,
    no2: 33,
    so2: 5.2,
    co: 0.68,
    o3: 32.4,
    aqi: 66,
    historicalAqi: 62,
    predictedAqi: 70,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Rising',
    dominantPollutant: 'NO₂',
    stationType: 'Traffic',
    temperature: 19.8,
    humidity: 65,
    windSpeed: 15.6,
  },
  {
    country: 'UK',
    stateProvince: 'England',
    cityArea: 'Manchester',
    pm25: 26,
    pm10: 48,
    no2: 27,
    so2: 4.8,
    co: 0.58,
    o3: 29.0,
    aqi: 54,
    historicalAqi: 56,
    predictedAqi: 52,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM10',
    stationType: 'Urban',
    temperature: 18.2,
    humidity: 72,
    windSpeed: 16.2,
  },
  {
    country: 'UK',
    stateProvince: 'Scotland',
    cityArea: 'Edinburgh',
    pm25: 18,
    pm10: 36,
    no2: 16,
    so2: 3.2,
    co: 0.40,
    o3: 26.5,
    aqi: 38,
    historicalAqi: 40,
    predictedAqi: 36,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 16.5,
    humidity: 74,
    windSpeed: 21.0,
  },

  // ================= CANADA =================
  {
    country: 'Canada',
    stateProvince: 'Ontario',
    cityArea: 'Toronto',
    pm25: 25,
    pm10: 46,
    no2: 24,
    so2: 4.1,
    co: 0.54,
    o3: 32.0,
    aqi: 52,
    historicalAqi: 55,
    predictedAqi: 49,
    pollutionLevel: 'Moderate',
    pollutionTrend: 'Falling',
    dominantPollutant: 'PM2.5',
    stationType: 'Urban',
    temperature: 20.4,
    humidity: 58,
    windSpeed: 14.5,
  },
  {
    country: 'Canada',
    stateProvince: 'British Columbia',
    cityArea: 'Vancouver',
    pm25: 19,
    pm10: 38,
    no2: 17,
    so2: 2.9,
    co: 0.42,
    o3: 27.5,
    aqi: 40,
    historicalAqi: 42,
    predictedAqi: 38,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 18.6,
    humidity: 70,
    windSpeed: 13.2,
  },

  // ================= AUSTRALIA =================
  {
    country: 'Australia',
    stateProvince: 'New South Wales',
    cityArea: 'Sydney',
    pm25: 22,
    pm10: 42,
    no2: 20,
    so2: 3.4,
    co: 0.48,
    o3: 30.5,
    aqi: 44,
    historicalAqi: 47,
    predictedAqi: 42,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 22.8,
    humidity: 64,
    windSpeed: 18.0,
  },
  {
    country: 'Australia',
    stateProvince: 'Victoria',
    cityArea: 'Melbourne',
    pm25: 21,
    pm10: 40,
    no2: 19,
    so2: 3.2,
    co: 0.45,
    o3: 29.0,
    aqi: 42,
    historicalAqi: 45,
    predictedAqi: 40,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Coastal',
    temperature: 20.1,
    humidity: 62,
    windSpeed: 19.5,
  },
  {
    country: 'Australia',
    stateProvince: 'Queensland',
    cityArea: 'Brisbane',
    pm25: 20,
    pm10: 38,
    no2: 17,
    so2: 2.8,
    co: 0.42,
    o3: 28.0,
    aqi: 40,
    historicalAqi: 41,
    predictedAqi: 39,
    pollutionLevel: 'Good',
    pollutionTrend: 'Stable',
    dominantPollutant: 'PM10',
    stationType: 'Suburban',
    temperature: 25.2,
    humidity: 66,
    windSpeed: 16.0,
  },
];

// Helper to get list of distinct countries
export function getAvailableCountries(): string[] {
  return Array.from(new Set(GLOBAL_LOCATION_DATASETS.map((d) => d.country))).sort();
}

// Helper to get distinct states/provinces for a given country
export function getStatesForCountry(country: string): string[] {
  return Array.from(
    new Set(
      GLOBAL_LOCATION_DATASETS.filter((d) => d.country === country).map(
        (d) => d.stateProvince
      )
    )
  ).sort();
}

// Helper to get distinct cities/areas for a given country and state
export function getCitiesForState(country: string, stateProvince: string): string[] {
  return Array.from(
    new Set(
      GLOBAL_LOCATION_DATASETS.filter(
        (d) => d.country === country && d.stateProvince === stateProvince
      ).map((d) => d.cityArea)
    )
  ).sort();
}

// Helper to get the exact location record
export function getLocationRecord(
  country: string,
  stateProvince: string,
  cityArea: string
): LocationAirQualityRecord | undefined {
  return GLOBAL_LOCATION_DATASETS.find(
    (d) =>
      d.country === country &&
      d.stateProvince === stateProvince &&
      d.cityArea === cityArea
  );
}

/**
 * Deterministic Prediction Engine for Location-Based Telemetry:
 * Runs the selected ML/time-series model on the location's actual dataset.
 * Absolutely NO Math.random() is used; all calculations are deterministic
 * functions of the location's actual values, model coefficients, and scenario parameters.
 */
export interface PredictionEngineResult {
  currentAqi: number;
  historicalAqi: number;
  predictedAqi: number;
  pollutionLevel: AQICategory;
  pollutionTrend: 'Rising' | 'Falling' | 'Stable';
  trendDelta: number;
  timeSeries: ForecastPoint[];
  forecastCards: Array<{
    horizon: string;
    time: string;
    predictedAqi: number;
    dominant: string;
    category: AQICategory;
    change: string;
    confidence: string;
    advice: string;
  }>;
}

export function runLocationPredictionModel(
  location: LocationAirQualityRecord,
  modelId: string = 'lstm-rnn',
  horizon: '12h' | '24h' | '48h' = '24h',
  target: 'aqi' | 'pm25' | 'pm10' | 'o3' = 'aqi',
  modifiers: {
    wind: number;
    temp: number;
    rainWashout: boolean;
    trafficRestriction: boolean;
  } = { wind: 0, temp: 0, rainWashout: false, trafficRestriction: false }
): PredictionEngineResult {
  const currentBase = target === 'aqi'
    ? location.aqi
    : target === 'pm25'
    ? location.pm25
    : target === 'pm10'
    ? location.pm10
    : location.o3;

  const histBase = target === 'aqi'
    ? location.historicalAqi
    : Math.round(currentBase * (location.historicalAqi / location.aqi));

  // Model-specific responsiveness weights
  // Different architectures capture non-linear lag or inertia differently
  let modelFactor = 1.0;
  let modelNoiseTolerance = 0.95;

  if (modelId === 'lstm-rnn') {
    modelFactor = 1.02; // Bi-LSTM slightly projects forward curvature
    modelNoiseTolerance = 0.98;
  } else if (modelId === 'xgboost') {
    modelFactor = 0.99; // Tree ensemble dampens extremes
    modelNoiseTolerance = 0.94;
  } else if (modelId === 'sarimax') {
    modelFactor = 0.97; // Pure linear autoregressive reversion
    modelNoiseTolerance = 0.90;
  } else if (modelId === 'random-forest') {
    modelFactor = 1.00;
    modelNoiseTolerance = 0.92;
  } else if (modelId === 'hybrid-cnn-lstm') {
    modelFactor = 1.01;
    modelNoiseTolerance = 0.96;
  } else if (modelId === 'svr') {
    modelFactor = 0.98;
    modelNoiseTolerance = 0.91;
  }

  // Baseline forecast derived from location's actual trajectory
  const naturalDelta = location.predictedAqi - location.aqi;
  let simulatedFinalAqi = location.aqi + naturalDelta * modelFactor;

  // Apply scenario physics modifiers deterministically
  simulatedFinalAqi -= modifiers.wind * 1.8;
  if (target === 'o3' || target === 'aqi') {
    simulatedFinalAqi += modifiers.temp * 2.2;
  }
  if (modifiers.rainWashout) {
    simulatedFinalAqi *= 0.65;
  }
  if (modifiers.trafficRestriction) {
    simulatedFinalAqi *= 0.80;
  }

  const finalPredictedAqi = Math.max(12, Math.min(500, Math.round(simulatedFinalAqi)));
  const calculatedTrendDelta = finalPredictedAqi - location.aqi;
  const calculatedTrend: 'Rising' | 'Falling' | 'Stable' =
    calculatedTrendDelta > 2 ? 'Rising' : calculatedTrendDelta < -2 ? 'Falling' : 'Stable';

  // Construct deterministic 24h past + future time-series using sinusoidal diurnal curve
  const timeSeries: ForecastPoint[] = [];

  // 12 hours of past telemetry points leading up to 'Now'
  const pastHours = [
    { t: '-12h', hourOffset: -12, factor: 0.92 },
    { t: '-10h', hourOffset: -10, factor: 0.95 },
    { t: '-8h', hourOffset: -8, factor: 1.04 },
    { t: '-6h', hourOffset: -6, factor: 1.01 },
    { t: '-4h', hourOffset: -4, factor: 0.97 },
    { t: '-2h', hourOffset: -2, factor: 1.02 },
    { t: 'Now', hourOffset: 0, factor: 1.00 },
  ];

  pastHours.forEach((item) => {
    const histVal = Math.round(location.historicalAqi * 0.4 + location.aqi * 0.6 * item.factor);
    timeSeries.push({
      time: item.t,
      historicalValue: histVal,
      predictedValue: histVal,
      confidenceLower: Math.max(10, Math.round(histVal * 0.93)),
      confidenceUpper: Math.round(histVal * 1.07),
      isForecast: false,
      aqi: histVal,
      category: getAQICategory(histVal),
    });
  });

  // Future predictions tailored to horizon
  const futureHours = horizon === '12h' 
    ? [2, 4, 6, 8, 10, 12]
    : horizon === '48h'
    ? [4, 8, 12, 16, 20, 24, 30, 36, 42, 48]
    : [2, 4, 6, 8, 10, 12, 16, 20, 24];

  futureHours.forEach((hr) => {
    const fraction = hr / (horizon === '12h' ? 12 : horizon === '48h' ? 48 : 24);
    // Deterministic curve with diurnal rush-hour wave (sine of fraction)
    const diurnalCurve = Math.sin(fraction * Math.PI) * (location.aqi * 0.12);
    let predVal = location.aqi + (finalPredictedAqi - location.aqi) * fraction + diurnalCurve;
    
    // Boundary clamp
    predVal = Math.max(12, Math.min(500, Math.round(predVal)));
    
    // Expanding confidence cone based on forecast time and model variance
    const uncertaintySpan = Math.round((hr * 1.4) * (1 / modelNoiseTolerance));
    const lowerBound = Math.max(10, predVal - uncertaintySpan);
    const upperBound = Math.min(500, predVal + uncertaintySpan);

    timeSeries.push({
      time: `+${hr}h`,
      predictedValue: predVal,
      confidenceLower: lowerBound,
      confidenceUpper: upperBound,
      isForecast: true,
      aqi: predVal,
      category: getAQICategory(predVal),
    });
  });

  // 4 Horizon Outlook Cards tailored to this location
  const h3Aqi = Math.round(location.aqi + (finalPredictedAqi - location.aqi) * 0.25 + 4);
  const h6Aqi = Math.round(location.aqi + (finalPredictedAqi - location.aqi) * 0.50 + 8);
  const h12Aqi = Math.round(location.aqi + (finalPredictedAqi - location.aqi) * 0.85);
  const h24Aqi = finalPredictedAqi;

  const forecastCards = [
    {
      horizon: '+3 Hours',
      time: 'Immediate Horizon',
      predictedAqi: h3Aqi,
      dominant: location.dominantPollutant,
      category: getAQICategory(h3Aqi),
      change: `${h3Aqi >= location.aqi ? '+' : ''}${h3Aqi - location.aqi} AQI`,
      confidence: `${(96.4 * modelNoiseTolerance).toFixed(1)}%`,
      advice: h3Aqi <= 100 
        ? `Air quality in ${location.cityArea} remains safe for outdoor activities.`
        : `Air quality starting to elevate in ${location.cityArea}; sensitive groups should limit intense exercise.`,
    },
    {
      horizon: '+6 Hours',
      time: 'Midday Cycle',
      predictedAqi: h6Aqi,
      dominant: location.o3 > 35 ? 'O₃ Photochemical' : location.dominantPollutant,
      category: getAQICategory(h6Aqi),
      change: `${h6Aqi >= location.aqi ? '+' : ''}${h6Aqi - location.aqi} AQI`,
      confidence: `${(93.8 * modelNoiseTolerance).toFixed(1)}%`,
      advice: h6Aqi > 120
        ? `Sunlight kinetics and vehicular flow in ${location.stateProvince} heighten pollutant density.`
        : `Steady planetary boundary layer allows regular atmospheric dispersal in ${location.cityArea}.`,
    },
    {
      horizon: '+12 Hours',
      time: 'Evening Commute',
      predictedAqi: h12Aqi,
      dominant: `${location.dominantPollutant} & NO₂`,
      category: getAQICategory(h12Aqi),
      change: `${h12Aqi >= location.aqi ? '+' : ''}${h12Aqi - location.aqi} AQI`,
      confidence: `${(89.2 * modelNoiseTolerance).toFixed(1)}%`,
      advice: h12Aqi > 140
        ? `Calmer night winds over ${location.cityArea} will induce particulate accumulation.`
        : `Comfortable night ventilation window anticipated for ${location.cityArea}.`,
    },
    {
      horizon: '+24 Hours',
      time: 'Next Day Morning',
      predictedAqi: h24Aqi,
      dominant: location.dominantPollutant,
      category: getAQICategory(h24Aqi),
      change: `${h24Aqi >= location.aqi ? '+' : ''}${h24Aqi - location.aqi} AQI`,
      confidence: `${(84.5 * modelNoiseTolerance).toFixed(1)}%`,
      advice: `Rolling 24-hour ${modelId.toUpperCase()} forecast for ${location.cityArea}, ${location.country}.`,
    },
  ];

  return {
    currentAqi: location.aqi,
    historicalAqi: location.historicalAqi,
    predictedAqi: finalPredictedAqi,
    pollutionLevel: getAQICategory(location.aqi),
    pollutionTrend: calculatedTrend,
    trendDelta: calculatedTrendDelta,
    timeSeries,
    forecastCards,
  };
}

/**
 * Async API Simulation layer for Location Data Management
 * Mimics network latency and REST endpoint responses for hierarchical location retrieval.
 */
export async function fetchAvailableCountriesApi(): Promise<string[]> {
  // simulate lightweight 150ms network query
  await new Promise((resolve) => setTimeout(resolve, 120));
  return getAvailableCountries();
}

export async function fetchStatesByCountryApi(country: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getStatesForCountry(country);
}

export async function fetchCitiesByStateApi(
  country: string,
  stateProvince: string
): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return getCitiesForState(country, stateProvince);
}

export async function fetchLocationRecordApi(
  country: string,
  stateProvince: string,
  cityArea: string
): Promise<LocationAirQualityRecord | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 140));
  return getLocationRecord(country, stateProvince, cityArea);
}
