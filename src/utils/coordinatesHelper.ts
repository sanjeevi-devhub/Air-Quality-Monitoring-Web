/**
 * Geospatial coordinates resolution and visual formatting helpers
 */

export interface FormattedCoordinates {
  decimal: string;
  latFormatted: string;
  lngFormatted: string;
  dms: string;
  gridCode: string;
  elevationMeters: number;
}

export interface NearbyMonitoringNode {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  distanceKm: number;
  direction: string;
  aqi: number;
  dominantPollutant: string;
  status: 'Active' | 'Online' | 'Calibrating';
}

const KNOWN_CITY_COORDINATES: Record<string, [number, number]> = {
  // India
  chennai: [13.0827, 80.2707],
  coimbatore: [11.0168, 76.9558],
  madurai: [9.9252, 78.1198],
  bengaluru: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  mangaluru: [12.9141, 74.8560],
  delhi: [28.6139, 77.209],
  'new delhi': [28.6139, 77.209],
  noida: [28.5355, 77.391],
  gurugram: [28.4595, 77.0266],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
  nagpur: [21.1458, 79.0882],
  hyderabad: [17.385, 78.4867],
  warangal: [17.9689, 79.5941],
  kolkata: [22.5726, 88.3639],
  howrah: [22.5958, 88.2636],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  patna: [25.5941, 85.1376],
  bhopal: [23.2599, 77.4126],
  chandigarh: [30.7333, 76.7794],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],

  // USA
  'san francisco': [37.7749, -122.4194],
  'los angeles': [34.0522, -118.2437],
  'san diego': [32.7157, -117.1611],
  'new york': [40.7128, -74.006],
  albany: [42.6526, -73.7562],
  chicago: [41.8781, -87.6298],
  houston: [29.7604, -95.3698],
  dallas: [32.7767, -96.797],
  austin: [30.2672, -97.7431],
  seattle: [47.6062, -122.3321],
  denver: [39.7392, -104.9903],
  phoenix: [33.4484, -112.074],
  boston: [42.3601, -71.0589],

  // UK
  london: [51.5074, -0.1278],
  manchester: [53.4808, -2.2426],
  birmingham: [52.4862, -1.8904],
  leeds: [53.8008, -1.5491],
  glasgow: [55.8642, -4.2518],
  edinburgh: [55.9533, -3.1883],

  // Germany
  berlin: [52.52, 13.405],
  munich: [48.1351, 11.582],
  frankfurt: [50.1109, 8.6821],
  hamburg: [53.5511, 9.9937],
  cologne: [50.9375, 6.9603],

  // China
  beijing: [39.9042, 116.4074],
  shanghai: [31.2304, 121.4737],
  guangzhou: [23.1291, 113.2644],
  shenzhen: [22.5431, 114.0579],
  chengdu: [30.5728, 104.0668],
  wuhan: [30.5928, 114.3055],

  // Japan
  tokyo: [35.6762, 139.6503],
  osaka: [34.6937, 135.5023],
  kyoto: [35.0116, 135.7681],
  yokohama: [35.4437, 139.638],

  // Canada
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  montreal: [45.5017, -73.5673],

  // Australia
  sydney: [-33.8688, 151.2093],
  melbourne: [-37.8136, 144.9631],
  brisbane: [-27.4698, 153.0251],

  // Other Global Cities
  singapore: [1.3521, 103.8198],
  dubai: [25.2048, 55.2708],
  seoul: [37.5665, 126.978],
  bangkok: [13.7563, 100.5018],
  jakarta: [-6.2088, 106.8456],
  paris: [48.8566, 2.3522],
  rome: [41.9028, 12.4964],
  cairo: [30.0444, 31.2357],
  kathmandu: [27.7172, 85.324],
  dhaka: [23.8103, 90.4125],
  lahore: [31.5204, 74.3587],
};

/**
 * Resolve coordinates for a given city and country
 */
export function resolveCoordinates(city: string, country?: string): [number, number] {
  const normalized = city.trim().toLowerCase();
  if (KNOWN_CITY_COORDINATES[normalized]) {
    return KNOWN_CITY_COORDINATES[normalized];
  }

  // Check substring match
  for (const [key, coords] of Object.entries(KNOWN_CITY_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // Fallback to deterministic pseudo-coordinates within world bounds
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = (hash << 5) - hash + city.charCodeAt(i);
    hash |= 0;
  }
  const pseudoLat = ((Math.abs(hash) % 12000) / 100) - 40; // -40 to +80
  const pseudoLng = (((Math.abs(hash >> 3)) % 36000) / 100) - 180; // -180 to +180

  return [+pseudoLat.toFixed(4), +pseudoLng.toFixed(4)];
}

function convertToDmsPart(degVal: number, posChar: string, negChar: string): string {
  const isPos = degVal >= 0;
  const absVal = Math.abs(degVal);
  const degrees = Math.floor(absVal);
  const minutesDec = (absVal - degrees) * 60;
  const minutes = Math.floor(minutesDec);
  const seconds = Math.round((minutesDec - minutes) * 60);

  return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"${
    isPos ? posChar : negChar
  }`;
}

/**
 * Formats coordinates for clear visual telemetry displays
 */
export function formatVisualCoordinates(lat: number, lng: number): FormattedCoordinates {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  const latFormatted = `${Math.abs(lat).toFixed(4)}° ${latDir}`;
  const lngFormatted = `${Math.abs(lng).toFixed(4)}° ${lngDir}`;
  const decimal = `${latFormatted}, ${lngFormatted}`;

  const dms = `${convertToDmsPart(lat, 'N', 'S')} ${convertToDmsPart(lng, 'E', 'W')}`;

  // Deterministic elevation and Military/Standard Grid reference
  const elev = Math.max(12, Math.round(((Math.abs(lat * 17 + lng * 11) % 450) + 18)));
  const gridLetter1 = String.fromCharCode(65 + (Math.abs(Math.floor(lat)) % 26));
  const gridLetter2 = String.fromCharCode(65 + (Math.abs(Math.floor(lng)) % 26));
  const gridCode = `GRID-${Math.abs(Math.round(lat))}${gridLetter1}${Math.abs(Math.round(lng))}${gridLetter2}`;

  return {
    decimal,
    latFormatted,
    lngFormatted,
    dms,
    gridCode,
    elevationMeters: elev,
  };
}

/**
 * Generate 3-4 realistic nearby regional monitoring nodes around a primary station
 */
export function generateNearbyNodes(
  centerLat: number,
  centerLng: number,
  baseAqi: number,
  stationName: string
): NearbyMonitoringNode[] {
  const offsets = [
    { nameSuffix: 'North Outpost', dLat: 0.024, dLng: -0.012, dist: 3.2, dir: 'NNW', aqiDelta: -8, type: 'Suburban' },
    { nameSuffix: 'Industrial Sector B', dLat: -0.018, dLng: 0.031, dist: 4.1, dir: 'ESE', aqiDelta: +14, type: 'Industrial' },
    { nameSuffix: 'Boulevard Junction', dLat: 0.015, dLng: 0.022, dist: 2.8, dir: 'ENE', aqiDelta: +5, type: 'Traffic' },
    { nameSuffix: 'Eco-Park Perimeter', dLat: -0.029, dLng: -0.019, dist: 4.7, dir: 'SSW', aqiDelta: -16, type: 'Suburban' },
  ];

  const cleanName = stationName.replace(/Central Telemetry|Station/gi, '').trim();

  return offsets.map((item, idx) => ({
    id: `nearby-node-${idx + 1}`,
    name: `${cleanName} ${item.nameSuffix}`,
    type: item.type,
    coordinates: [+(centerLat + item.dLat).toFixed(4), +(centerLng + item.dLng).toFixed(4)],
    distanceKm: item.dist,
    direction: item.dir,
    aqi: Math.max(15, Math.min(480, baseAqi + item.aqiDelta)),
    dominantPollutant: item.type === 'Industrial' ? 'SO₂' : item.type === 'Traffic' ? 'NO₂' : 'PM2.5',
    status: idx === 2 ? 'Calibrating' : 'Online',
  }));
}
