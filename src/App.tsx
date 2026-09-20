import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, StationInfo, PollutantData, WeatherData, HistoricalPoint } from './types';
import { AQIToastAlert } from './types/toast';
import {
  STATIONS,
  INITIAL_POLLUTANTS,
  INITIAL_WEATHER,
  HOURLY_24H_DATA,
} from './data/mockData';
import {
  GLOBAL_LOCATION_DATASETS,
  getLocationRecord,
} from './data/locationData';
import { createAQIAlertPayload } from './utils/aqiAlertHelper';
import { playEnvironmentalAlertChime } from './utils/audioChime';
import { resolveCoordinates } from './utils/coordinatesHelper';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { PredictionView } from './components/PredictionView';
import { ModelComparisonView } from './components/ModelComparisonView';
import { InsightsView } from './components/InsightsView';
import { AboutView } from './components/AboutView';
import { AQICalculatorModal } from './components/AQICalculatorModal';
import { LocationSelector } from './components/LocationSelector';
import { ToastNotificationContainer } from './components/ToastNotification';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [stations, setStations] = useState<StationInfo[]>(STATIONS);
  const [pollutants, setPollutants] = useState<PollutantData[]>(INITIAL_POLLUTANTS);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [hourlyData, setHourlyData] = useState<HistoricalPoint[]>(HOURLY_24H_DATA);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);

  // Global Hierarchical Location State: Country > State/Province > City/Area
  const [selectedLocation, setSelectedLocation] = useState<{
    country: string;
    stateProvince: string;
    cityArea: string;
  }>({
    country: 'India',
    stateProvince: 'Tamil Nadu',
    cityArea: 'Chennai',
  });
  const [selectedStation, setSelectedStation] = useState<StationInfo>({
    id: 'station-india-chennai',
    name: 'Chennai Central Telemetry',
    location: 'Chennai, Tamil Nadu, India',
    aqi: 156,
    status: 'Warning',
    type: 'Urban',
    lastUpdated: 'Just now',
    coordinates: [13.0827, 80.2707],
  });
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);

  // Environmental Color-Coded AQI > 150 Alert State
  const [alerts, setAlerts] = useState<AQIToastAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const lastAlertRef = useRef<{ city: string; aqi: number; time: number }>({ city: '', aqi: 0, time: 0 });

  // Core trigger for environmental AQI > 150 notification
  const triggerAQIAlert = (params: {
    city: string;
    stateProvince: string;
    country: string;
    aqi: number;
    pm25: number;
    pm10?: number;
    dominantPollutant?: string;
    force?: boolean;
  }) => {
    if (params.aqi > 150) {
      const now = Date.now();
      // Debounce repetitive alerts for the same city within 15 seconds unless forced
      if (
        !params.force &&
        lastAlertRef.current.city === params.city &&
        Math.abs(lastAlertRef.current.aqi - params.aqi) < 4 &&
        now - lastAlertRef.current.time < 15000
      ) {
        return;
      }

      lastAlertRef.current = { city: params.city, aqi: params.aqi, time: now };

      const newAlert = createAQIAlertPayload({
        city: params.city,
        stateProvince: params.stateProvince,
        country: params.country,
        aqi: params.aqi,
        pm25: params.pm25,
        pm10: params.pm10,
        dominantPollutant: params.dominantPollutant,
      });

      setAlerts((prev) => [newAlert, ...prev.filter((a) => a.city !== params.city).slice(0, 2)]);

      if (soundEnabled) {
        playEnvironmentalAlertChime();
      }
    }
  };

  // Propagate Global Hierarchical Location Selections to Data Filtering Modules
  const handleLocationChange = (country: string, state: string, city: string) => {
    setSelectedLocation({ country, stateProvince: state, cityArea: city });
    const record = getLocationRecord(country, state, city) || GLOBAL_LOCATION_DATASETS[0];

    // Trigger environmental toast notification if current AQI for the selected city exceeds 150
    if (record.aqi > 150) {
      triggerAQIAlert({
        city: record.cityArea,
        stateProvince: record.stateProvince,
        country: record.country,
        aqi: record.aqi,
        pm25: record.pm25,
        pm10: record.pm10,
        dominantPollutant: record.dominantPollutant,
        force: true, // explicit user selection
      });
    }

    // Synchronize station telemetry
    setSelectedStation({
      id: `station-${country.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${city} Central Telemetry`,
      location: `${city}, ${state}, ${country}`,
      aqi: record.aqi,
      status:
        record.pollutionLevel === 'Good' || record.pollutionLevel === 'Moderate'
          ? 'Active'
          : 'Warning',
      type: record.stationType as any,
      lastUpdated: 'Just now',
      coordinates: resolveCoordinates(city, country),
    });

    // Synchronize multi-pollutant telemetry to location ground truth
    setPollutants([
      {
        id: 'pm25',
        name: 'PM2.5',
        fullName: 'Fine Particulate Matter (<2.5µm)',
        value: record.pm25,
        unit: 'µg/m³',
        standardLimit: 35,
        status:
          record.pm25 > 55
            ? 'Severe'
            : record.pm25 > 35
            ? 'Poor'
            : record.pm25 > 15
            ? 'Moderate'
            : 'Good',
        category: 'Particulate',
        description: 'Fine aerosol particles that penetrate deep into lung tissue.',
        trend:
          record.pollutionTrend === 'Rising'
            ? '+3.4% / 1h'
            : record.pollutionTrend === 'Falling'
            ? '-2.8% / 1h'
            : '0.0% / 1h',
      },
      {
        id: 'pm10',
        name: 'PM10',
        fullName: 'Coarse Particulate Matter (<10µm)',
        value: record.pm10,
        unit: 'µg/m³',
        standardLimit: 150,
        status:
          record.pm10 > 150
            ? 'Severe'
            : record.pm10 > 100
            ? 'Poor'
            : record.pm10 > 50
            ? 'Moderate'
            : 'Good',
        category: 'Particulate',
        description: 'Inhalable coarse dust, road debris, and airborne matter.',
        trend:
          record.pollutionTrend === 'Rising'
            ? '+2.2% / 1h'
            : record.pollutionTrend === 'Falling'
            ? '-1.9% / 1h'
            : '0.0% / 1h',
      },
      {
        id: 'no2',
        name: 'NO2',
        fullName: 'Nitrogen Dioxide',
        value: record.no2,
        unit: 'ppb',
        standardLimit: 100,
        status:
          record.no2 > 100
            ? 'Severe'
            : record.no2 > 70
            ? 'Poor'
            : record.no2 > 40
            ? 'Moderate'
            : 'Good',
        category: 'Gas',
        description: 'Emissions from thermal power plants and vehicular traffic.',
        trend: '+1.1% / 1h',
      },
      {
        id: 'so2',
        name: 'SO2',
        fullName: 'Sulfur Dioxide',
        value: record.so2,
        unit: 'ppb',
        standardLimit: 75,
        status:
          record.so2 > 75
            ? 'Severe'
            : record.so2 > 50
            ? 'Poor'
            : record.so2 > 20
            ? 'Moderate'
            : 'Good',
        category: 'Gas',
        description: 'Industrial byproduct from sulfur-bearing fossil fuel burning.',
        trend: '-0.5% / 1h',
      },
      {
        id: 'co',
        name: 'CO',
        fullName: 'Carbon Monoxide',
        value: record.co,
        unit: 'ppm',
        standardLimit: 9.0,
        status:
          record.co > 9.0
            ? 'Severe'
            : record.co > 6.0
            ? 'Poor'
            : record.co > 2.0
            ? 'Moderate'
            : 'Good',
        category: 'Gas',
        description: 'Colorless toxic gas from incomplete engine fuel combustion.',
        trend: '+0.1% / 1h',
      },
      {
        id: 'o3',
        name: 'O3',
        fullName: 'Ground-Level Ozone',
        value: record.o3,
        unit: 'ppb',
        standardLimit: 70,
        status:
          record.o3 > 70
            ? 'Severe'
            : record.o3 > 55
            ? 'Poor'
            : record.o3 > 30
            ? 'Moderate'
            : 'Good',
        category: 'Gas',
        description: 'Photochemical secondary oxidant reacting under solar UV.',
        trend: '+1.8% / 1h',
      },
    ]);

    // Synchronize meteorological parameters
    setWeather({
      temperature: record.temperature,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      windDirection: 'NE',
      pressure: 1012,
      uvIndex: Math.min(10, Math.round(record.temperature / 3.5)),
      visibility: Math.max(2, +(16 - record.pm25 / 15).toFixed(1)),
      condition:
        record.pm25 > 60 ? 'Haze' : record.temperature > 28 ? 'Sunny' : 'Partly Cloudy',
    });

    // Synchronize 24-hour diurnal profile dynamically
    setHourlyData(
      HOURLY_24H_DATA.map((h, i) => {
        const diurnal = 0.85 + 0.3 * Math.sin((i / 24) * Math.PI * 2);
        const scaledAqi = Math.max(10, Math.round(record.aqi * diurnal));
        return {
          ...h,
          aqi: scaledAqi,
          pm25: Math.max(4, Math.round(record.pm25 * diurnal)),
          pm10: Math.max(8, Math.round(record.pm10 * diurnal)),
          no2: Math.max(5, Math.round(record.no2 * diurnal)),
          so2: Math.max(2, Math.round(record.so2 * diurnal)),
          o3: Math.max(8, Math.round(record.o3 * diurnal)),
          co: Math.max(0.1, +(record.co * diurnal).toFixed(2)),
        };
      })
    );
  };

  // When a different station is selected from legacy list
  const handleStationChange = (newStation: StationInfo) => {
    setSelectedStation(newStation);
    const multiplier = newStation.aqi / 78;

    // Trigger alert if station AQI exceeds 150
    if (newStation.aqi > 150) {
      triggerAQIAlert({
        city: newStation.name,
        stateProvince: selectedLocation.stateProvince,
        country: selectedLocation.country,
        aqi: newStation.aqi,
        pm25: Math.round(newStation.aqi * 0.48),
        pm10: Math.round(newStation.aqi * 0.78),
        dominantPollutant: newStation.dominantPollutant || 'PM2.5',
        force: true,
      });
    }

    setPollutants((prev) =>
      prev.map((p) => {
        let newVal = +(p.value * multiplier).toFixed(1);
        if (p.id === 'co') newVal = +(p.value * multiplier).toFixed(2);
        const status =
          newVal > p.standardLimit * 1.5
            ? 'Severe'
            : newVal > p.standardLimit
            ? 'Poor'
            : newVal > p.standardLimit * 0.6
            ? 'Moderate'
            : 'Good';
        return {
          ...p,
          value: newVal,
          status,
        };
      })
    );
  };

  // Manual trigger for user to test the environmental alert system or review current advisory
  const handleManualAlertTrigger = () => {
    const record =
      getLocationRecord(selectedLocation.country, selectedLocation.stateProvince, selectedLocation.cityArea) ||
      GLOBAL_LOCATION_DATASETS[0];

    const alertAqi = record.aqi > 150 ? record.aqi : 178;
    const alertPm25 = record.aqi > 150 ? record.pm25 : 84;

    triggerAQIAlert({
      city: record.cityArea,
      stateProvince: record.stateProvince,
      country: record.country,
      aqi: alertAqi,
      pm25: alertPm25,
      pm10: Math.round(alertPm25 * 1.5),
      dominantPollutant: record.dominantPollutant || 'PM2.5',
      force: true,
    });
  };

  // Automatic entrance check on initial load (Chennai default location has AQI 156 > 150)
  useEffect(() => {
    const timer = setTimeout(() => {
      const record = getLocationRecord(selectedLocation.country, selectedLocation.stateProvince, selectedLocation.cityArea);
      if (record && record.aqi > 150) {
        triggerAQIAlert({
          city: record.cityArea,
          stateProvince: record.stateProvince,
          country: record.country,
          aqi: record.aqi,
          pm25: record.pm25,
          pm10: record.pm10,
          dominantPollutant: record.dominantPollutant,
          force: true,
        });
      }
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Live telemetry stream simulation jitter (runs every 3.5 seconds if active)
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setPollutants((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.48) * (p.id === 'co' ? 0.04 : 0.8);
          const newVal = Math.max(
            0.1,
            +(p.value + delta).toFixed(p.id === 'co' ? 2 : 1)
          );
          return {
            ...p,
            value: newVal,
          };
        })
      );

      // Subtle weather flutter
      setWeather((prev) => ({
        ...prev,
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.1).toFixed(1),
        windSpeed: Math.max(2, +(prev.windSpeed + (Math.random() - 0.5) * 0.3).toFixed(1)),
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Fixed / Sticky Navigation with Global Location Trigger */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={handleStationChange}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
        onOpenCalculator={() => setCalculatorOpen(true)}
        selectedLocation={selectedLocation}
        onOpenLocationSelector={() => setLocationModalOpen(true)}
        alertsCount={alerts.length}
        onTriggerAlert={handleManualAlertTrigger}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Hero
                onNavigate={setActiveTab}
                selectedStation={selectedStation}
                pollutants={pollutants}
              />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardView
                station={selectedStation}
                pollutants={pollutants}
                weather={weather}
                hourlyData={hourlyData}
                onOpenCalculator={() => setCalculatorOpen(true)}
                onNavigateToAnalytics={() => setActiveTab('analytics')}
                selectedCountry={selectedLocation.country}
                selectedState={selectedLocation.stateProvince}
                selectedCity={selectedLocation.cityArea}
                onLocationChange={handleLocationChange}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsView
                selectedCountry={selectedLocation.country}
                selectedState={selectedLocation.stateProvince}
                selectedCity={selectedLocation.cityArea}
                onLocationChange={handleLocationChange}
              />
            </motion.div>
          )}

          {activeTab === 'prediction' && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PredictionView
                selectedCountry={selectedLocation.country}
                selectedState={selectedLocation.stateProvince}
                selectedCity={selectedLocation.cityArea}
                onLocationChange={handleLocationChange}
              />
            </motion.div>
          )}

          {activeTab === 'models' && (
            <motion.div
              key="models"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ModelComparisonView />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <InsightsView station={selectedStation} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AboutView onNavigate={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Global Location Selector Modal (accessible from Navbar and anywhere in app) */}
      {locationModalOpen && (
        <LocationSelector
          variant="modal"
          selectedCountry={selectedLocation.country}
          selectedState={selectedLocation.stateProvince}
          selectedCity={selectedLocation.cityArea}
          onLocationChange={handleLocationChange}
          onClose={() => setLocationModalOpen(false)}
        />
      )}

      {/* Global Interactive AQI Calculator Modal */}
      <AQICalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      {/* Environmental Color-Coded AQI > 150 Toast Notification System */}
      <ToastNotificationContainer
        alerts={alerts}
        onDismiss={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
        onClearAll={() => setAlerts([])}
        onNavigateToInsights={() => setActiveTab('insights')}
        onOpenCalculator={() => setCalculatorOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}

