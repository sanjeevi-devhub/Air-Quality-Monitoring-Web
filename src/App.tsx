import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, StationInfo, PollutantData, WeatherData, HistoricalPoint } from './types';
import {
  STATIONS,
  INITIAL_POLLUTANTS,
  INITIAL_WEATHER,
  HOURLY_24H_DATA,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { PredictionView } from './components/PredictionView';
import { ModelComparisonView } from './components/ModelComparisonView';
import { InsightsView } from './components/InsightsView';
import { AboutView } from './components/AboutView';
import { AQICalculatorModal } from './components/AQICalculatorModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [stations, setStations] = useState<StationInfo[]>(STATIONS);
  const [selectedStation, setSelectedStation] = useState<StationInfo>(STATIONS[0]);
  const [pollutants, setPollutants] = useState<PollutantData[]>(INITIAL_POLLUTANTS);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [hourlyData, setHourlyData] = useState<HistoricalPoint[]>(HOURLY_24H_DATA);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);

  // When a different station is selected, adjust baseline readings realistically
  const handleStationChange = (newStation: StationInfo) => {
    setSelectedStation(newStation);
    const multiplier = newStation.aqi / 78;

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
      {/* Top Fixed / Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={handleStationChange}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
        onOpenCalculator={() => setCalculatorOpen(true)}
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
              <AnalyticsView />
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
              <PredictionView />
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

      {/* Global Interactive AQI Calculator Modal */}
      <AQICalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
