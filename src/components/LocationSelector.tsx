import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  MapPin,
  Building2,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Search,
  Filter,
  Activity,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import {
  GLOBAL_LOCATION_DATASETS,
  fetchAvailableCountriesApi,
  fetchStatesByCountryApi,
  fetchCitiesByStateApi,
  getLocationRecord,
  getAvailableCountries,
  getStatesForCountry,
  getCitiesForState,
} from '../data/locationData';
import { LocationAirQualityRecord } from '../types';
import { getAQIColorConfig } from '../utils/aqiCalculator';

export interface LocationSelectorProps {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onLocationChange: (country: string, state: string, city: string) => void;
  variant?: 'card' | 'bar' | 'compact' | 'modal';
  className?: string;
  showPresets?: boolean;
  showTelemetryPreview?: boolean;
  onClose?: () => void;
}

export const PRESET_LOCATIONS = [
  { country: 'India', state: 'Tamil Nadu', city: 'Chennai', label: 'Chennai, TN, India' },
  { country: 'India', state: 'Tamil Nadu', city: 'Coimbatore', label: 'Coimbatore, TN, India' },
  { country: 'India', state: 'Karnataka', city: 'Bengaluru', label: 'Bengaluru, KA, India' },
  { country: 'India', state: 'Maharashtra', city: 'Mumbai', label: 'Mumbai, MH, India' },
  { country: 'India', state: 'Delhi NCT', city: 'New Delhi', label: 'New Delhi, India' },
  { country: 'Nepal', state: 'Bagmati Province', city: 'Kathmandu', label: 'Kathmandu, Nepal' },
  { country: 'Nepal', state: 'Gandaki Province', city: 'Pokhara', label: 'Pokhara, Nepal' },
  { country: 'Sri Lanka', state: 'Western Province', city: 'Colombo', label: 'Colombo, Sri Lanka' },
  { country: 'Bangladesh', state: 'Dhaka Division', city: 'Dhaka', label: 'Dhaka, Bangladesh' },
  { country: 'USA', state: 'California', city: 'Los Angeles', label: 'Los Angeles, USA' },
  { country: 'UK', state: 'England', city: 'London', label: 'London, UK' },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onLocationChange,
  variant = 'card',
  className = '',
  showPresets = true,
  showTelemetryPreview = true,
  onClose,
}) => {
  // State for fetched hierarchy data
  const [countries, setCountries] = useState<string[]>(() => getAvailableCountries());
  const [states, setStates] = useState<string[]>(() => getStatesForCountry(selectedCountry));
  const [cities, setCities] = useState<string[]>(() =>
    getCitiesForState(selectedCountry, selectedState)
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTier, setActiveTier] = useState<'country' | 'state' | 'city'>('city');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch available countries on mount
  useEffect(() => {
    let isMounted = true;
    fetchAvailableCountriesApi().then((data) => {
      if (isMounted && data.length > 0) {
        setCountries(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // When selectedCountry changes, fetch states
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchStatesByCountryApi(selectedCountry)
      .then((stateList) => {
        if (!isMounted) return;
        setStates(stateList);
        // If current state not in list, fallback to first
        const nextState = stateList.includes(selectedState) ? selectedState : stateList[0] || '';
        return fetchCitiesByStateApi(selectedCountry, nextState).then((cityList) => {
          if (!isMounted) return;
          setCities(cityList);
          const nextCity = cityList.includes(selectedCity) ? selectedCity : cityList[0] || '';
          if (nextState !== selectedState || nextCity !== selectedCity) {
            onLocationChange(selectedCountry, nextState, nextCity);
          }
        });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
  }, [selectedCountry]);

  // When selectedState changes within same country, fetch cities
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchCitiesByStateApi(selectedCountry, selectedState)
      .then((cityList) => {
        if (!isMounted) return;
        setCities(cityList);
        const nextCity = cityList.includes(selectedCity) ? selectedCity : cityList[0] || '';
        if (nextCity !== selectedCity) {
          onLocationChange(selectedCountry, selectedState, nextCity);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
  }, [selectedCountry, selectedState]);

  // Active location record
  const currentRecord = useMemo<LocationAirQualityRecord>(() => {
    return (
      getLocationRecord(selectedCountry, selectedState, selectedCity) ||
      GLOBAL_LOCATION_DATASETS[0]
    );
  }, [selectedCountry, selectedState, selectedCity]);

  const aqiConfig = getAQIColorConfig(currentRecord.aqi);

  const handleCountrySelect = (newCountry: string) => {
    if (newCountry === selectedCountry) return;
    const statesForC = getStatesForCountry(newCountry);
    const firstState = statesForC[0] || '';
    const citiesForS = getCitiesForState(newCountry, firstState);
    const firstCity = citiesForS[0] || '';
    onLocationChange(newCountry, firstState, firstCity);
  };

  const handleStateSelect = (newState: string) => {
    if (newState === selectedState) return;
    const citiesForS = getCitiesForState(selectedCountry, newState);
    const firstCity = citiesForS[0] || '';
    onLocationChange(selectedCountry, newState, firstCity);
  };

  const handleCitySelect = (newCity: string) => {
    if (newCity === selectedCity) return;
    onLocationChange(selectedCountry, selectedState, newCity);
  };

  // ----------------------------------------------------
  // VARIANT: MODAL
  // ----------------------------------------------------
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Global Monitoring Station Selector
                </h3>
                <p className="text-xs text-slate-500">
                  Select Country &gt; State/Province &gt; City/Area to synchronize telemetry
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Presets */}
            {showPresets && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Global Presets
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Instant Filter</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_LOCATIONS.map((preset) => {
                    const isSelected =
                      selectedCountry === preset.country &&
                      selectedState === preset.state &&
                      selectedCity === preset.city;
                    return (
                      <button
                        key={`${preset.country}-${preset.city}`}
                        onClick={() => {
                          onLocationChange(preset.country, preset.state, preset.city);
                          if (onClose) onClose();
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hierarchical 3-tier Dropdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Country</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountrySelect(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 pr-8 shadow-2xs appearance-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>2. State / Province</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 pr-8 shadow-2xs appearance-none"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>3. City / Area</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 pr-8 shadow-2xs appearance-none"
                  >
                    {cities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Telemetry Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Selected Node
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentRecord.cityArea}, {currentRecord.stateProvince}, {currentRecord.country}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>PM2.5: {currentRecord.pm25} µg/m³</span>
                  <span>•</span>
                  <span>NO₂: {currentRecord.no2} ppb</span>
                  <span>•</span>
                  <span>Station: {currentRecord.stationType}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold font-display text-slate-900">
                  {currentRecord.aqi}{' '}
                  <span className="text-xs font-normal text-slate-400">AQI</span>
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${aqiConfig.lightBg} ${aqiConfig.textColor}`}
                >
                  {currentRecord.pollutionLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selections synchronize across all tabs &amp; models</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT: BAR (Horizontal Sleek Toolbar)
  // ----------------------------------------------------
  if (variant === 'bar') {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Location Scope:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1 max-w-2xl">
          {/* Country */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-200 rounded-lg py-1.5 pl-2 pr-6 bg-slate-50 hover:bg-white text-slate-800 focus:outline-emerald-500 appearance-none truncate cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* State */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-200 rounded-lg py-1.5 pl-2 pr-6 bg-slate-50 hover:bg-white text-slate-800 focus:outline-emerald-500 appearance-none truncate cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* City */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full text-xs font-bold border border-emerald-300 rounded-lg py-1.5 pl-2 pr-6 bg-emerald-50/40 hover:bg-white text-emerald-900 focus:outline-emerald-500 appearance-none truncate cursor-pointer"
            >
              {cities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-600 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Snapshot badge */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            AQI {currentRecord.aqi}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${aqiConfig.lightBg} ${aqiConfig.textColor}`}
          >
            {currentRecord.pollutionLevel}
          </span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT: CARD (Default Rich Container)
  // ----------------------------------------------------
  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <span>Hierarchical Location Telemetry Selector</span>
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Three-tier geospatial navigation: <strong className="text-slate-700">Country &gt; State/Province &gt; City/Area</strong> controlling global filtering.
            </p>
          </div>
        </div>

        {/* Path Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 self-start sm:self-auto overflow-x-auto max-w-full">
          <span className="text-slate-500">{selectedCountry}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500">{selectedState}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-emerald-700 font-bold">{selectedCity}</span>
        </div>
      </div>

      {/* Quick Presets Carousel */}
      {showPresets && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Quick Location Presets:
            </span>
            <span className="text-slate-400 text-[10px]">Click any preset to filter all views</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_LOCATIONS.map((preset) => {
              const isSelected =
                selectedCountry === preset.country &&
                selectedState === preset.state &&
                selectedCity === preset.city;
              return (
                <button
                  key={`${preset.country}-${preset.city}`}
                  onClick={() => onLocationChange(preset.country, preset.state, preset.city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Tier Cascading Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Country */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Country</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">
              {countries.length} available
            </span>
          </label>
          <div className="relative">
            <select
              id="hierarchical-country-select"
              value={selectedCountry}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 2: State / Province */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>2. State / Province</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">
              {states.length} in {selectedCountry}
            </span>
          </label>
          <div className="relative">
            <select
              id="hierarchical-state-select"
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 3: City / Monitoring Area */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>3. City / Area</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">
              {cities.length} in {selectedState}
            </span>
          </label>
          <div className="relative">
            <select
              id="hierarchical-city-select"
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full text-xs font-bold border border-emerald-400 rounded-xl p-2.5 bg-emerald-50/30 text-emerald-950 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {cities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Telemetry Summary Card */}
      {showTelemetryPreview && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Ground-Truth Telemetry:
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Live Sensor Node
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {currentRecord.cityArea}, {currentRecord.stateProvince} ({currentRecord.country})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
              <span>
                PM2.5: <strong>{currentRecord.pm25}</strong> µg/m³
              </span>
              <span>•</span>
              <span>
                PM10: <strong>{currentRecord.pm10}</strong> µg/m³
              </span>
              <span>•</span>
              <span>
                NO₂: <strong>{currentRecord.no2}</strong> ppb
              </span>
              <span>•</span>
              <span>
                Dominant: <strong>{currentRecord.dominantPollutant}</strong>
              </span>
              <span>•</span>
              <span>
                Station: <strong>{currentRecord.stationType}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-slate-200 sm:pl-5 shrink-0">
            <div>
              <div className="text-xs text-slate-400 font-medium">Recorded AQI</div>
              <div className="text-2xl font-bold font-display text-slate-900 leading-none mt-0.5">
                {currentRecord.aqi}
              </div>
            </div>
            <div className="space-y-1">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${aqiConfig.lightBg} ${aqiConfig.textColor}`}
              >
                {currentRecord.pollutionLevel}
              </span>
              <div className="text-[10px] text-slate-500 font-mono">
                Trend: {currentRecord.pollutionTrend}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
