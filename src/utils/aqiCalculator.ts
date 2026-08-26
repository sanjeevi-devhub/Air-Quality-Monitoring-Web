import { AQICategory } from '../types';

export interface AQIResult {
  aqi: number;
  category: AQICategory;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  healthImplications: string;
  cautionaryStatement: string;
  dominantPollutant: string;
}

// EPA AQI breakpoints for PM2.5 (µg/m³)
const PM25_BREAKPOINTS = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

// EPA AQI breakpoints for PM10 (µg/m³)
const PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
];

// Calculate linear interpolation sub-index
function calcSubIndex(
  concentration: number,
  breakpoints: Array<{ cLow: number; cHigh: number; iLow: number; iHigh: number }>
): number {
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const index =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) +
        bp.iLow;
      return Math.round(index);
    }
  }
  if (concentration > breakpoints[breakpoints.length - 1].cHigh) {
    return 500;
  }
  return 0;
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIColorConfig(aqi: number): {
  category: AQICategory;
  color: string;
  hex: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  lightBg: string;
} {
  const category = getAQICategory(aqi);

  switch (category) {
    case 'Good':
      return {
        category,
        color: 'emerald-500',
        hex: '#10b981',
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-300',
        lightBg: 'bg-emerald-50',
      };
    case 'Moderate':
      return {
        category,
        color: 'amber-500',
        hex: '#f59e0b',
        bgColor: 'bg-amber-500',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
        lightBg: 'bg-amber-50',
      };
    case 'Unhealthy for Sensitive':
      return {
        category,
        color: 'orange-500',
        hex: '#f97316',
        bgColor: 'bg-orange-500',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-300',
        lightBg: 'bg-orange-50',
      };
    case 'Unhealthy':
      return {
        category,
        color: 'rose-500',
        hex: '#ef4444',
        bgColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-300',
        lightBg: 'bg-rose-50',
      };
    case 'Very Unhealthy':
      return {
        category,
        color: 'purple-600',
        hex: '#9333ea',
        bgColor: 'bg-purple-600',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
        lightBg: 'bg-purple-50',
      };
    case 'Hazardous':
    default:
      return {
        category,
        color: 'rose-900',
        hex: '#881337',
        bgColor: 'bg-rose-950',
        textColor: 'text-rose-900',
        borderColor: 'border-rose-400',
        lightBg: 'bg-rose-100',
      };
  }
}

export function computeFullAQI(pollutants: {
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}): AQIResult {
  const pm25Sub = pollutants.pm25 !== undefined ? calcSubIndex(pollutants.pm25, PM25_BREAKPOINTS) : 0;
  const pm10Sub = pollutants.pm10 !== undefined ? calcSubIndex(pollutants.pm10, PM10_BREAKPOINTS) : 0;
  
  // Approximate sub-indices for others
  const no2Sub = pollutants.no2 ? Math.round(pollutants.no2 * 1.2) : 0;
  const so2Sub = pollutants.so2 ? Math.round(pollutants.so2 * 1.5) : 0;
  const coSub = pollutants.co ? Math.round(pollutants.co * 35) : 0;
  const o3Sub = pollutants.o3 ? Math.round(pollutants.o3 * 1.1) : 0;

  const subMap: Record<string, number> = {
    'PM2.5': pm25Sub,
    'PM10': pm10Sub,
    'NO₂': no2Sub,
    'SO₂': so2Sub,
    'CO': coSub,
    'O₃': o3Sub,
  };

  let maxAQI = 0;
  let dominant = 'PM2.5';

  Object.entries(subMap).forEach(([pollutant, value]) => {
    if (value > maxAQI) {
      maxAQI = value;
      dominant = pollutant;
    }
  });

  const config = getAQIColorConfig(maxAQI);

  let healthImplications = 'Air quality is satisfactory, and air pollution poses little or no risk.';
  let cautionaryStatement = 'None. Great time for outdoor sports and activities.';

  if (config.category === 'Moderate') {
    healthImplications = 'Air quality is acceptable. However, there may be a risk for some people sensitive to air pollution.';
    cautionaryStatement = 'Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.';
  } else if (config.category === 'Unhealthy for Sensitive') {
    healthImplications = 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    cautionaryStatement = 'People with lung disease, older adults, and children should reduce prolonged outdoor exertion.';
  } else if (config.category === 'Unhealthy') {
    healthImplications = 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    cautionaryStatement = 'People with respiratory disease should avoid prolonged outdoor exertion; everyone else should limit outdoor activity.';
  } else if (config.category === 'Very Unhealthy') {
    healthImplications = 'Health alert: The risk of health effects is increased for everyone.';
    cautionaryStatement = 'Everyone should avoid prolonged or heavy outdoor exertion. Keep indoor air clean.';
  } else if (config.category === 'Hazardous') {
    healthImplications = 'Health warning of emergency conditions: The entire population is more likely to be affected.';
    cautionaryStatement = 'Everyone should avoid all outdoor physical activity. Close windows and run air purifiers.';
  }

  return {
    aqi: maxAQI,
    category: config.category,
    color: config.color,
    bgColor: config.bgColor,
    textColor: config.textColor,
    borderColor: config.borderColor,
    healthImplications,
    cautionaryStatement,
    dominantPollutant: dominant,
  };
}
