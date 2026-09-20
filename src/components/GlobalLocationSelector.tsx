import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Calendar,
  Layers,
  ChevronDown,
  CheckCircle2,
  Code2,
  Table,
  Copy,
  Check,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  GLOBAL_LOCATION_DATASETS,
  getAvailableCountries,
  getStatesForCountry,
  getCitiesForState,
  PredictionEngineResult,
} from '../data/locationData';
import { LocationAirQualityRecord } from '../types';
import { getAQIColorConfig } from '../utils/aqiCalculator';

interface GlobalLocationSelectorProps {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  locationRecord: LocationAirQualityRecord;
  predictionResult: PredictionEngineResult;
}

export const GlobalLocationSelector: React.FC<GlobalLocationSelectorProps> = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  locationRecord,
  predictionResult,
}) => {
  const [showFullDataset, setShowFullDataset] = useState(false);
  const [showRCode, setShowRCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');

  const availableCountries = getAvailableCountries();
  const availableStates = getStatesForCountry(selectedCountry);
  const availableCities = getCitiesForState(selectedCountry, selectedState);

  const currentAqiConfig = getAQIColorConfig(predictionResult.currentAqi);
  const predictedAqiConfig = getAQIColorConfig(predictionResult.predictedAqi);
  const historicalAqiConfig = getAQIColorConfig(predictionResult.historicalAqi);

  // Quick preset examples matching user request specification
  const PRESETS = [
    { country: 'India', state: 'Tamil Nadu', city: 'Chennai', label: 'Chennai, India' },
    { country: 'India', state: 'Tamil Nadu', city: 'Coimbatore', label: 'Coimbatore, India' },
    { country: 'India', state: 'Karnataka', city: 'Bengaluru', label: 'Bengaluru, India' },
    { country: 'India', state: 'Maharashtra', city: 'Mumbai', label: 'Mumbai, India' },
    { country: 'Nepal', state: 'Bagmati Province', city: 'Kathmandu', label: 'Kathmandu, Nepal' },
    { country: 'Nepal', state: 'Gandaki Province', city: 'Pokhara', label: 'Pokhara, Nepal' },
    { country: 'Bangladesh', state: 'Dhaka Division', city: 'Dhaka', label: 'Dhaka, Bangladesh' },
    { country: 'Sri Lanka', state: 'Western Province', city: 'Colombo', label: 'Colombo, Sri Lanka' },
    { country: 'USA', state: 'California', city: 'Los Angeles', label: 'Los Angeles, USA' },
    { country: 'UK', state: 'England', city: 'London', label: 'London, UK' },
  ];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    onCountryChange(preset.country);
    onStateChange(preset.state);
    onCityChange(preset.city);
  };

  // Filtered dataset for table view
  const filteredDataset = GLOBAL_LOCATION_DATASETS.filter((item) => {
    if (!datasetSearch.trim()) return true;
    const q = datasetSearch.toLowerCase();
    return (
      item.country.toLowerCase().includes(q) ||
      item.stateProvince.toLowerCase().includes(q) ||
      item.cityArea.toLowerCase().includes(q)
    );
  });

  const R_CODE_SNIPPET = `# ==============================================================================
# AIR QUALITY MONITORING & POLLUTION PREDICTION USING R
# Location-Filtered Hierarchical Predictive Modeling Pipeline
# ==============================================================================
# Required CRAN Packages:
# install.packages(c("forecast", "randomForest", "xgboost", "dplyr", "lubridate"))
library(forecast)
library(randomForest)
library(dplyr)
library(lubridate)

# 1. Hierarchical Location Filter Function
filter_location_dataset <- function(dataset_path = "global_air_quality.csv", 
                                    country_filter = "${selectedCountry}", 
                                    state_filter = "${selectedState}", 
                                    city_filter = "${selectedCity}") {
  
  message(sprintf("Filtering air quality data for: %s -> %s -> %s", 
                  country_filter, state_filter, city_filter))
  
  df <- read.csv(dataset_path, stringsAsFactors = FALSE)
  
  # Strict multi-tier hierarchical match
  city_data <- df %>%
    filter(Country == country_filter,
           State_Province == state_filter,
           City_Area == city_filter)
  
  if (nrow(city_data) == 0) {
    stop(sprintf("No records found for %s, %s, %s", city_filter, state_filter, country_filter))
  }
  
  return(city_data)
}

# 2. Fit Time-Series Prediction Model (SARIMAX with Exogenous Pollutants)
run_r_prediction_model <- function(location_df, horizon = 24) {
  # Hourly time series of AQI with frequency = 24
  aqi_ts <- ts(location_df$AQI, frequency = 24)
  
  # Exogenous meteorological & chemical feature matrix
  xreg_features <- as.matrix(location_df[, c("PM2.5", "PM10", "NO2", "Temperature", "WindSpeed")])
  
  # Fit Seasonal ARIMA with Exogenous Regressors
  fit_arima <- auto.arima(aqi_ts, xreg = xreg_features, seasonal = TRUE, stepwise = TRUE)
  
  # Generate multi-step forecast with 95% Confidence Intervals
  fc <- forecast(fit_arima, h = horizon, level = c(80, 95))
  
  # Output structured prediction report
  results <- list(
    Selected_Country = location_df$Country[1],
    Selected_State = location_df$State_Province[1],
    Selected_City = location_df$City_Area[1],
    Current_AQI = tail(location_df$AQI, 1),
    Historical_AQI = head(location_df$AQI, 1),
    Predicted_AQI = round(mean(fc$mean)),
    Pollution_Level = ifelse(mean(fc$mean) > 150, "Unhealthy", 
                      ifelse(mean(fc$mean) > 100, "Unhealthy for Sensitive",
                      ifelse(mean(fc$mean) > 50, "Moderate", "Good"))),
    Pollution_Trend = ifelse(mean(fc$mean) > tail(location_df$AQI, 1), "Rising", "Falling"),
    Confidence_Lower_95 = round(fc$lower[, 2]),
    Confidence_Upper_95 = round(fc$upper[, 2])
  )
  
  return(results)
}

# 3. Execution on Selected Location:
# location_data <- filter_location_dataset(country_filter = "${selectedCountry}", 
#                                         state_filter = "${selectedState}", 
#                                         city_filter = "${selectedCity}")
# prediction_output <- run_r_prediction_model(location_data, horizon = 24)
# print(prediction_output)`;

  const handleCopyRCode = () => {
    navigator.clipboard.writeText(R_CODE_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header with Title & Quick Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Global Location-Based Air Quality Prediction
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic 3-tier hierarchical selector: <span className="font-semibold text-slate-700">Country → State/Province → City/Area</span> running predictive models on location-filtered data.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFullDataset(!showFullDataset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              showFullDataset
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showFullDataset ? 'Hide Dataset' : 'View Global Dataset'}</span>
          </button>

          <button
            onClick={() => setShowRCode(!showRCode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              showRCode
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showRCode ? 'Hide R Code' : 'View R Code'}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Location Presets:
          </span>
          <span className="text-[10px] text-slate-400">Click to filter instantly</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESETS.map((preset) => {
            const isCurrent =
              selectedCountry === preset.country &&
              selectedState === preset.state &&
              selectedCity === preset.city;
            return (
              <button
                key={`${preset.country}-${preset.city}`}
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic 3-Tier Hierarchical Dropdown Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Country */}
        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Select Country</span>
          </label>
          <div className="relative">
            <select
              id="global-country-selector"
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[10px] text-slate-400">
            {availableCountries.length} countries available in dataset
          </p>
        </div>

        {/* Tier 2: State / Province */}
        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>2. Select State / Province</span>
          </label>
          <div className="relative">
            <select
              id="global-state-selector"
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {availableStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[10px] text-slate-400">
            {availableStates.length} states/provinces in {selectedCountry}
          </p>
        </div>

        {/* Tier 3: City / Area */}
        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>3. Select City / Area</span>
          </label>
          <div className="relative">
            <select
              id="global-city-selector"
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800 focus:outline-emerald-500 shadow-2xs cursor-pointer appearance-none pr-8"
            >
              {availableCities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[10px] text-slate-400">
            {availableCities.length} monitoring areas in {selectedState}
          </p>
        </div>
      </div>

      {/* REQUIRED DISPLAY PANEL:
          * Selected Country
          * Selected State/Province
          * Selected City/Area
          * Current AQI
          * Historical AQI
          * Predicted AQI
          * Pollution Level
          * Pollution Trend
      */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Location-Specific Prediction Output:
          </span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            Trained Model Applied to Filtered Telemetry
          </span>
        </div>

        {/* Primary 8-Metric Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Selected Country */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected Country
            </span>
            <div className="font-bold text-sm text-slate-900 mt-1 truncate" title={locationRecord.country}>
              {locationRecord.country}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Global Grid</span>
          </div>

          {/* 2. Selected State/Province */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              State / Province
            </span>
            <div className="font-bold text-sm text-slate-900 mt-1 truncate" title={locationRecord.stateProvince}>
              {locationRecord.stateProvince}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Regional Sub-grid</span>
          </div>

          {/* 3. Selected City/Area */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              City / Area
            </span>
            <div className="font-bold text-sm text-emerald-700 mt-1 truncate flex items-center gap-1" title={locationRecord.cityArea}>
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{locationRecord.cityArea}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Local Node</span>
          </div>

          {/* 4. Current AQI */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current AQI
            </span>
            <div className="font-display font-bold text-2xl text-slate-900 mt-0.5 flex items-baseline gap-1">
              <span>{predictionResult.currentAqi}</span>
              <span className="text-[10px] font-normal text-slate-400">AQI</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentAqiConfig.lightBg} ${currentAqiConfig.textColor} self-start mt-0.5`}>
              {currentAqiConfig.category}
            </span>
          </div>

          {/* 5. Historical AQI */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Historical AQI
            </span>
            <div className="font-display font-bold text-2xl text-slate-700 mt-0.5 flex items-baseline gap-1">
              <span>{predictionResult.historicalAqi}</span>
              <span className="text-[10px] font-normal text-slate-400">baseline</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">24h Benchmark</span>
          </div>

          {/* 6. Predicted AQI */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Predicted AQI
            </span>
            <div className="font-display font-bold text-2xl text-emerald-900 mt-0.5 flex items-baseline gap-1">
              <span>{predictionResult.predictedAqi}</span>
              <span className="text-[10px] font-semibold text-emerald-700">AQI</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${predictedAqiConfig.lightBg} ${predictedAqiConfig.textColor} self-start mt-0.5`}>
              Forecast Target
            </span>
          </div>

          {/* 7. Pollution Level */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pollution Level
            </span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${currentAqiConfig.lightBg} ${currentAqiConfig.textColor}`}>
                {predictionResult.pollutionLevel}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">WHO/EPA Standard</span>
          </div>

          {/* 8. Pollution Trend */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pollution Trend
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              {predictionResult.pollutionTrend === 'Rising' ? (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rising</span>
                </div>
              ) : predictionResult.pollutionTrend === 'Falling' ? (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Falling</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <Minus className="w-3.5 h-3.5" />
                  <span>Stable</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">
              {predictionResult.trendDelta > 0 ? `+${predictionResult.trendDelta}` : predictionResult.trendDelta} AQI shift
            </span>
          </div>
        </div>
      </div>

      {/* Dataset Filtered Record Table Card (Matches Prompt Format) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            Filtered Ground-Truth Telemetry Table Row:
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Location Filter: Country == '{selectedCountry}' & State == '{selectedState}' & City == '{selectedCity}'
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">State_Province</th>
                <th className="py-2.5 px-3">City_Area</th>
                <th className="py-2.5 px-3 font-mono text-right">PM2.5 (µg/m³)</th>
                <th className="py-2.5 px-3 font-mono text-right">PM10 (µg/m³)</th>
                <th className="py-2.5 px-3 font-mono text-right">NO2 (ppb)</th>
                <th className="py-2.5 px-3 font-mono text-right">Current AQI</th>
                <th className="py-2.5 px-3 font-mono text-right">Historical AQI</th>
                <th className="py-2.5 px-3 font-mono text-right font-bold text-emerald-700">Predicted AQI</th>
                <th className="py-2.5 px-3">Pollution Level</th>
                <th className="py-2.5 px-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50/30 font-medium">
                <td className="py-2.5 px-3 font-bold text-slate-900">{locationRecord.country}</td>
                <td className="py-2.5 px-3 text-slate-700">{locationRecord.stateProvince}</td>
                <td className="py-2.5 px-3 font-bold text-emerald-800">{locationRecord.cityArea}</td>
                <td className="py-2.5 px-3 font-mono text-right text-slate-800">{locationRecord.pm25}</td>
                <td className="py-2.5 px-3 font-mono text-right text-slate-800">{locationRecord.pm10}</td>
                <td className="py-2.5 px-3 font-mono text-right text-slate-800">{locationRecord.no2}</td>
                <td className="py-2.5 px-3 font-mono text-right font-bold text-slate-900">{locationRecord.aqi}</td>
                <td className="py-2.5 px-3 font-mono text-right text-slate-600">{locationRecord.historicalAqi}</td>
                <td className="py-2.5 px-3 font-mono text-right font-bold text-emerald-800">
                  {predictionResult.predictedAqi}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentAqiConfig.lightBg} ${currentAqiConfig.textColor}`}>
                    {predictionResult.pollutionLevel}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-[11px]">
                  {predictionResult.pollutionTrend === 'Rising' ? (
                    <span className="text-amber-600">Rising (+{predictionResult.trendDelta})</span>
                  ) : predictionResult.pollutionTrend === 'Falling' ? (
                    <span className="text-emerald-600">Falling ({predictionResult.trendDelta})</span>
                  ) : (
                    <span className="text-slate-600">Stable</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Expandable R Code Section */}
      {showRCode && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                R Script: Location-Filtered Air Quality Prediction Pipeline
              </span>
            </div>
            <button
              onClick={handleCopyRCode}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy R Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-72 p-2 bg-slate-950/60 rounded-xl">
            {R_CODE_SNIPPET}
          </pre>
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Compatible with R 4.x, RStudio, Shiny Server, and tidyverse workflows.</span>
            <span className="font-mono text-emerald-400">Active Location: {selectedCity}, {selectedCountry}</span>
          </div>
        </div>
      )}

      {/* Expandable Full Global Dataset Table */}
      {showFullDataset && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Global Air Quality Location Telemetry Dataset ({GLOBAL_LOCATION_DATASETS.length} Locations)
              </h4>
              <p className="text-xs text-slate-500">
                Click any row to instantly filter and run the prediction model on that location.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search country, state, city..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">State_Province</th>
                  <th className="py-2.5 px-3">City_Area</th>
                  <th className="py-2.5 px-3 font-mono text-right">PM2.5</th>
                  <th className="py-2.5 px-3 font-mono text-right">PM10</th>
                  <th className="py-2.5 px-3 font-mono text-right">NO2</th>
                  <th className="py-2.5 px-3 font-mono text-right">Current AQI</th>
                  <th className="py-2.5 px-3 font-mono text-right">Historical</th>
                  <th className="py-2.5 px-3 font-mono text-right">Predicted</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDataset.map((row) => {
                  const isSelected =
                    selectedCountry === row.country &&
                    selectedState === row.stateProvince &&
                    selectedCity === row.cityArea;
                  const rowCfg = getAQIColorConfig(row.aqi);
                  return (
                    <tr
                      key={`${row.country}-${row.stateProvince}-${row.cityArea}`}
                      onClick={() => {
                        onCountryChange(row.country);
                        onStateChange(row.stateProvince);
                        onCityChange(row.cityArea);
                      }}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-medium text-slate-900">{row.country}</td>
                      <td className="py-2 px-3 text-slate-600">{row.stateProvince}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{row.cityArea}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-700">{row.pm25}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-700">{row.pm10}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-700">{row.no2}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-slate-900">{row.aqi}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-500">{row.historicalAqi}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-emerald-700">{row.predictedAqi}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rowCfg.lightBg} ${rowCfg.textColor}`}>
                          {row.pollutionLevel}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 hover:text-emerald-600">Select</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
