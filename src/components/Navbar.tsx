import React, { useState } from 'react';
import {
  Wind,
  Activity,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  Info,
  MapPin,
  RefreshCw,
  Calculator,
  Menu,
  X,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NavTab, StationInfo } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stations: StationInfo[];
  selectedStation: StationInfo;
  onSelectStation: (station: StationInfo) => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
  onOpenCalculator: () => void;
  selectedLocation?: {
    country: string;
    stateProvince: string;
    cityArea: string;
  };
  onOpenLocationSelector?: () => void;
  alertsCount?: number;
  onTriggerAlert?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stations,
  selectedStation,
  onSelectStation,
  isLiveUpdating,
  onToggleLive,
  onOpenCalculator,
  selectedLocation,
  onOpenLocationSelector,
  alertsCount = 0,
  onTriggerAlert,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Wind className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'prediction', label: 'Prediction', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'models', label: 'Model Benchmark', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro-status bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveUpdating ? 'bg-emerald-400 opacity-75' : 'bg-slate-500 opacity-25'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveUpdating ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="font-mono text-[11px] text-slate-200 font-medium">
              {isLiveUpdating ? 'LIVE TELEMETRY STREAMING' : 'STREAM PAUSED'}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Node: <strong className="text-emerald-400">{selectedLocation ? `${selectedLocation.cityArea}, ${selectedLocation.stateProvince}, ${selectedLocation.country}` : selectedStation.name}</strong>
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Sensors: 6 Gas/Dust Channels Synchronized
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedStation.aqi > 150 && onTriggerAlert && (
            <button
              onClick={onTriggerAlert}
              id="micro-bar-alert-badge"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 hover:bg-rose-500/35 border border-rose-500/40 text-[11px] font-semibold animate-pulse transition-colors"
              title="Click to view Environmental AQI > 150 Advisory"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>AQI {selectedStation.aqi} &gt; 150 ALERT</span>
            </button>
          )}

          <button
            onClick={onToggleLive}
            id="toggle-live-stream-btn"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              isLiveUpdating
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle simulated live streaming"
          >
            <RefreshCw className={`w-3 h-3 ${isLiveUpdating ? 'animate-spin' : ''}`} />
            <span>{isLiveUpdating ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo-container"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                  Aero<span className="text-emerald-600">Pulse</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">
                Air Quality & Pollution Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Global Geospatial Location Trigger */}
            {onOpenLocationSelector && (
              <button
                onClick={onOpenLocationSelector}
                id="navbar-location-selector-btn"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-all shadow-2xs group"
                title="Change Geospatial Location (Country > State > City)"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="truncate max-w-[135px]">
                  {selectedLocation ? `${selectedLocation.cityArea}, ${selectedLocation.country}` : selectedStation.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 font-mono">
                  AQI {selectedStation.aqi}
                </span>
              </button>
            )}

            {/* Station Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStationDropdownOpen(!stationDropdownOpen)}
                id="station-selector-trigger"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
              >
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[110px]">Stations</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>

              {stationDropdownOpen && (
                <div
                  id="station-dropdown-menu"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Monitoring Station
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {stations.map((st) => (
                      <button
                        key={st.id}
                        id={`select-station-${st.id}`}
                        onClick={() => {
                          onSelectStation(st);
                          setStationDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-start justify-between hover:bg-slate-50 transition-colors ${
                          selectedStation.id === st.id ? 'bg-emerald-50/70 text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            {st.name}
                            {selectedStation.id === st.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{st.location}</div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold font-display px-1.5 py-0.5 rounded ${
                              st.aqi <= 50
                                ? 'bg-emerald-100 text-emerald-800'
                                : st.aqi <= 100
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            AQI {st.aqi}
                          </span>
                          <div className="text-[10px] text-slate-400 capitalize">{st.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Environmental Alert Center & Test Trigger */}
            {onTriggerAlert && (
              <button
                onClick={onTriggerAlert}
                id="navbar-alert-trigger-btn"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                  selectedStation.aqi > 150
                    ? 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 animate-pulse'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title={
                  selectedStation.aqi > 150
                    ? `Current AQI ${selectedStation.aqi} > 150! Click to view environmental advisory`
                    : 'Test environmental AQI > 150 alert toast'
                }
              >
                <Bell className={`w-3.5 h-3.5 ${selectedStation.aqi > 150 ? 'text-rose-600' : 'text-slate-500'}`} />
                <span className="hidden md:inline">
                  {selectedStation.aqi > 150 ? 'AQI > 150 Alert' : 'Alert Test'}
                </span>
                {alertsCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono">
                    {alertsCount}
                  </span>
                ) : selectedStation.aqi > 150 ? (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                ) : null}
              </button>
            )}

            {/* Sound Chime Toggle */}
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                id="navbar-sound-toggle-btn"
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors shadow-2xs"
                title={soundEnabled ? 'Alert Chime Sound: ON' : 'Alert Chime Sound: MUTED'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            )}

            {/* AQI Calculator Button */}
            <button
              onClick={onOpenCalculator}
              id="open-aqi-calculator-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all shadow-xs hover:shadow"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>AQI Calculator</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {onTriggerAlert && (
              <button
                onClick={onTriggerAlert}
                className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                  selectedStation.aqi > 150
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}
                title="Environmental AQI Alert"
              >
                <Bell className="w-4 h-4" />
                {selectedStation.aqi > 150 && (
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                )}
              </button>
            )}
            <button
              onClick={onOpenCalculator}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs"
              title="AQI Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-nav-toggle"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="mb-3 pt-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Station
            </label>
            <select
              value={selectedStation.id}
              onChange={(e) => {
                const found = stations.find((s) => s.id === e.target.value);
                if (found) onSelectStation(found);
              }}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} (AQI: {st.aqi} - {st.type})
                </option>
              ))}
            </select>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
