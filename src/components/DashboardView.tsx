import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Wind,
  Thermometer,
  Droplets,
  Compass,
  Gauge,
  Sun,
  Eye,
  Info,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
  Maximize2,
} from 'lucide-react';
import { StationInfo, PollutantData, WeatherData, HistoricalPoint } from '../types';
import { getAQIColorConfig, getAQICategory } from '../utils/aqiCalculator';

interface DashboardViewProps {
  station: StationInfo;
  pollutants: PollutantData[];
  weather: WeatherData;
  hourlyData: HistoricalPoint[];
  onOpenCalculator: () => void;
  onNavigateToAnalytics: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  station,
  pollutants,
  weather,
  hourlyData,
  onOpenCalculator,
  onNavigateToAnalytics,
}) => {
  const [selectedChartPollutant, setSelectedChartPollutant] = useState<'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3'>('aqi');
  const [activePollutantModal, setActivePollutantModal] = useState<PollutantData | null>(null);

  const aqiConfig = getAQIColorConfig(station.aqi);
  const aqiCategory = getAQICategory(station.aqi);

  // SVG Gauge calculations
  const gaugePercent = Math.min(100, Math.max(0, (station.aqi / 300) * 100));
  const strokeDasharray = `${(gaugePercent * 251.2) / 100} 251.2`;

  const getPollutantStatusBadge = (status: PollutantData['status']) => {
    switch (status) {
      case 'Good':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Poor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Station Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-slate-900">{station.name}</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {station.type} Node
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {station.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {station.location} • Coordinates: {station.coordinates[0].toFixed(4)}°N, {Math.abs(station.coordinates[1]).toFixed(4)}°W • Last synced {station.lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenCalculator}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate AQI</span>
          </button>
          <button
            onClick={onNavigateToAnalytics}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Deep Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Monitoring Section: AQI Gauge Card & Weather/Atmospheric Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Overall AQI Radial Gauge & Health Category */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Atmospheric Quality Status
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> EPA Breakpoint Standard
            </span>
          </div>

          {/* Radial AQI Visualizer */}
          <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                />
                {/* Dynamic Colored Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={aqiConfig.hex}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (gaugePercent * 251.2) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-display font-extrabold text-slate-900 leading-none">
                  {station.aqi}
                </span>
                <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  US AQI Index
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${aqiConfig.lightBg} ${aqiConfig.textColor} border ${aqiConfig.borderColor}`}
                >
                  {aqiCategory}
                </span>
              </div>
            </div>

            {/* Sub-Index Summary Info */}
            <div className="space-y-3 text-left w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Dominant Pollutant
                </div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {station.dominantPollutant} (Particulate Hazard)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Health Recommendation
                </div>
                <div className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  {station.aqi <= 50
                    ? 'Air quality is great. Ideal for outdoor recreation.'
                    : station.aqi <= 100
                    ? 'Air quality is acceptable; unusually sensitive people reduce heavy outdoor exertion.'
                    : 'Sensitive groups should avoid prolonged outdoor exposure.'}
                </div>
              </div>
            </div>
          </div>

          {/* AQI Range Color Scale Bar */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase">
              <span>0 (Good)</span>
              <span>100 (Mod)</span>
              <span>150 (Unhealthy)</span>
              <span>300+ (Hazardous)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 via-rose-500 to-purple-800 relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-slate-900 rounded-full shadow-md transition-all duration-700"
                style={{ left: `calc(${Math.min(96, Math.max(2, (station.aqi / 300) * 100))}% - 7px)` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Cards: Weather & Atmospheric Parameters */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Meteorological & Atmospheric Telemetry
              </span>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {weather.condition}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Ambient Temp</span>
                <Thermometer className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.temperature}°C</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{(weather.temperature * 1.8 + 32).toFixed(1)}°F</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Relative Humidity</span>
                <Droplets className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.humidity}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dew point 15.2°C</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Wind Velocity</span>
                <Wind className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.windSpeed}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">km/h • {weather.windDirection}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Barometric Pressure</span>
                <Gauge className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.pressure}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">hPa (Stable gradient)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Solar UV Index</span>
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.uvIndex}</div>
              <div className="text-[10px] text-amber-600 font-medium mt-0.5">Moderate exposure</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium text-slate-500">Atmospheric Visibility</span>
                <Eye className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{weather.visibility}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">km (Clear horizon)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Atmospheric Dispersion Context:</strong> Current wind speed of {weather.windSpeed} km/h is maintaining steady horizontal mixing, preventing localized boundary layer particulate trapping.
            </span>
          </div>
        </div>
      </div>

      {/* 6 Core Pollutant Parameter KPI Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Real-Time Pollutant Channels
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated sensor concentrations relative to WHO 24-hour health guideline limits.
            </p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any card to inspect emission sources
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((p) => {
            const percentOfStandard = Math.round((p.value / p.standardLimit) * 100);
            return (
              <div
                key={p.id}
                onClick={() => setActivePollutantModal(p)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Name, Chemical symbol, status pill */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {p.chemical}
                        </span>
                        <span className="text-[11px] text-slate-400">({p.name})</span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPollutantStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Big concentration value & unit */}
                  <div className="my-3 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-display font-extrabold text-slate-900">
                        {p.value}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{p.unit}</span>
                    </div>

                    <div
                      className={`flex items-center gap-0.5 text-xs font-bold ${
                        p.change24h > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {p.change24h > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>{Math.abs(p.change24h)}% (24h)</span>
                    </div>
                  </div>

                  {/* Standard threshold progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>WHO Limit: {p.standardLimit} {p.unit}</span>
                      <span className={percentOfStandard > 100 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {percentOfStandard}% of limit
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          percentOfStandard > 100
                            ? 'bg-rose-500'
                            : percentOfStandard > 75
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentOfStandard)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{p.sources[0]}</span>
                  <span className="text-emerald-600 font-medium group-hover:underline flex items-center gap-0.5">
                    Details <Maximize2 className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 24-Hour Diurnal Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              24-Hour Diurnal Atmospheric Trend
            </h3>
            <p className="text-xs text-slate-500">
              Hourly continuous temporal fluctuations capturing diurnal traffic spikes and solar photochemical reactions.
            </p>
          </div>

          {/* Pollutant selector tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
            {(
              [
                { id: 'aqi', label: 'Overall AQI' },
                { id: 'pm25', label: 'PM2.5' },
                { id: 'pm10', label: 'PM10' },
                { id: 'no2', label: 'NO₂' },
                { id: 'o3', label: 'O₃ Ozone' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedChartPollutant(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedChartPollutant === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Diurnal Area / Line Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPollutant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [
                  `${value} ${selectedChartPollutant === 'aqi' ? 'AQI' : 'µg/m³'}`,
                  selectedChartPollutant.toUpperCase(),
                ]}
              />
              <Area
                type="monotone"
                dataKey={selectedChartPollutant}
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPollutant)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Micro analysis annotation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span><strong>Morning Peak:</strong> 08:00 AM rush hour spike (PM2.5: 31.4 µg/m³)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span><strong>Afternoon O₃:</strong> 14:00 PM peak (Ozone: 52.4 ppb)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span><strong>Night Cleanse:</strong> 04:00 AM lowest diurnal AQI (42 Good)</span>
          </div>
        </div>
      </div>

      {/* Sensor Calibration & Hardware Telemetry Strip */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Sensor Node Diagnostics & Hardware Calibration Array
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">Firmware: v4.8.2-RTOS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[11px]">Laser Dust Sensor (PM)</div>
            <div className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optical Calibrated
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Dual-wavelength 650nm</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[11px]">Electrochemical NO₂/SO₂</div>
            <div className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4-Electrode Array
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Zero-drift compensated</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[11px]">NDIR Infrared CO Cell</div>
            <div className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Self-Zeroing Active
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Dual optical beam</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <div className="text-slate-400 text-[11px]">UV Photometer (O₃)</div>
            <div className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 254nm Absorption
            </div>
            <div className="text-[10px] text-slate-400 mt-1">0.5 ppb detection limit</div>
          </div>
        </div>
      </div>

      {/* Modal for Pollutant Details */}
      {activePollutantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-lg text-slate-900">
                  {activePollutantModal.name} ({activePollutantModal.chemical})
                </h3>
              </div>
              <button
                onClick={() => setActivePollutantModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activePollutantModal.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Current Telemetry</span>
                <span className="font-bold text-base text-slate-900">
                  {activePollutantModal.value} {activePollutantModal.unit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">WHO Health Standard</span>
                <span className="font-bold text-base text-slate-900">
                  {activePollutantModal.standardLimit} {activePollutantModal.unit}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Emission Origins & Sources:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {activePollutantModal.sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium"
                  >
                    • {src}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActivePollutantModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors mt-2"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
