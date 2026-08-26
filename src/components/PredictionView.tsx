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
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Brain,
  Sliders,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Wind,
  CloudRain,
  Car,
  Thermometer,
  RotateCcw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { FORECAST_SERIES_24H, FORECAST_CARDS, ML_MODELS } from '../data/mockData';
import { ForecastPoint } from '../types';
import { getAQIColorConfig } from '../utils/aqiCalculator';

export const PredictionView: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<'12h' | '24h' | '48h'>('24h');
  const [selectedTarget, setSelectedTarget] = useState<'aqi' | 'pm25' | 'pm10' | 'o3'>('aqi');
  const [selectedModel, setSelectedModel] = useState<string>('lstm-rnn');

  // Scenario Simulator Modifiers
  const [windModifier, setWindModifier] = useState<number>(0); // -10 to +10 km/h
  const [tempModifier, setTempModifier] = useState<number>(0); // -5 to +5 °C
  const [rainWashout, setRainWashout] = useState<boolean>(false);
  const [trafficRestriction, setTrafficRestriction] = useState<boolean>(false);

  // Dynamic forecast series calculation based on scenario adjustments
  const dynamicForecastData = FORECAST_SERIES_24H.map((pt) => {
    if (!pt.isForecast) return pt;

    // Apply simulation physics
    let val = pt.predictedValue;
    // Stronger wind disperses pollutants
    val -= windModifier * 1.8;
    // Higher temp increases ozone/chemical kinetics
    if (selectedTarget === 'o3' || selectedTarget === 'aqi') {
      val += tempModifier * 2.2;
    }
    // Rain washout washes particulates by 35%
    if (rainWashout) {
      val *= 0.65;
    }
    // Traffic restriction reduces emissions by 20%
    if (trafficRestriction) {
      val *= 0.80;
    }

    val = Math.max(18, Math.min(280, Math.round(val)));
    const low = Math.max(10, Math.round(val * 0.88));
    const high = Math.round(val * 1.14);

    return {
      ...pt,
      predictedValue: val,
      confidenceLower: low,
      confidenceUpper: high,
    };
  });

  const currentModelObj = ML_MODELS.find((m) => m.id === selectedModel) || ML_MODELS[0];
  const peakForecast = Math.max(...dynamicForecastData.map((d) => d.predictedValue));
  const peakConfig = getAQIColorConfig(peakForecast);

  const resetScenario = () => {
    setWindModifier(0);
    setTempModifier(0);
    setRainWashout(false);
    setTrafficRestriction(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              AI Atmospheric Forecasting & Predictive Modeling
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate multi-step future pollution trajectories with temporal confidence intervals and meteorological what-if scenario testing.
          </p>
        </div>

        {/* Model Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-2xl">
          <Brain className="w-4 h-4 text-emerald-600" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Predictor</span>
            <span className="font-bold text-slate-800">{currentModelObj.name}</span>
          </div>
        </div>
      </div>

      {/* Peak Alert Banner if forecast is elevated */}
      {peakForecast > 100 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">
              Projected Surge Alert: Peak {peakForecast} AQI Expected in Horizon
            </span>
            <p className="text-amber-800/90 mt-0.5">
              The deep learning model forecasts an ambient concentration spike reaching the <strong>{peakConfig.category}</strong> threshold due to anticipated wind lulls and peak diurnal emission cycles.
            </p>
          </div>
        </div>
      )}

      {/* Main Prediction & Scenario Playground Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config & Scenario Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Target & Horizon Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Forecast Parameters</span>
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            </h4>

            {/* Target Channel */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Target Predictor</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'aqi', label: 'Overall AQI' },
                  { id: 'pm25', label: 'PM2.5 Hazard' },
                  { id: 'pm10', label: 'PM10 Dust' },
                  { id: 'o3', label: 'O₃ Ozone' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t.id as any)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedTarget === t.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Inference Engine</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800 focus:outline-emerald-500"
              >
                {ML_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (R² = {m.r2})
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Horizon */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Prediction Horizon</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: '12h', label: '+12 Hours' },
                  { id: '24h', label: '+24 Hours' },
                  { id: '48h', label: '+48 Hours' },
                ].map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHorizon(h.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedHorizon === h.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meteorological What-If Simulator */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Scenario Simulator
                </h4>
              </div>
              <button
                onClick={resetScenario}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                title="Reset modifiers"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Wind Modifier Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-500" /> Wind Speed Delta:
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {windModifier > 0 ? `+${windModifier}` : windModifier} km/h
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={windModifier}
                onChange={(e) => setWindModifier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Temp Modifier Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Temp Anomaly:
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {tempModifier > 0 ? `+${tempModifier}` : tempModifier} °C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={tempModifier}
                onChange={(e) => setTempModifier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Rain Washout & Traffic Policy Toggles */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Simulate Rain Wash-out Event (-35%)</span>
                </div>
                <input
                  type="checkbox"
                  checked={rainWashout}
                  onChange={(e) => setRainWashout(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Odd-Even Traffic Policy (-20%)</span>
                </div>
                <input
                  type="checkbox"
                  checked={trafficRestriction}
                  onChange={(e) => setTrafficRestriction(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Interactive Historical vs Predicted Chart & Forecast Horizon Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visualizer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Historical Telemetry vs AI Forecast (95% CI Band)
                </h3>
                <p className="text-xs text-slate-500">
                  Solid green line = Recorded past telemetry | Dashed line = {currentModelObj.name} projection.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500"></span> Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-teal-600"></span> Forecast
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-100 rounded-xs"></span> 95% Confidence
                </span>
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: string) => {
                      if (name === 'confidenceUpper') return [`${val} AQI`, '95% Upper Bound'];
                      if (name === 'confidenceLower') return [`${val} AQI`, '95% Lower Bound'];
                      if (name === 'predictedValue') return [`${val} AQI`, 'Predicted AQI'];
                      if (name === 'historicalValue') return [`${val} AQI`, 'Recorded History'];
                      return [val, name];
                    }}
                  />
                  <ReferenceLine x="Now" stroke="#0f172a" strokeDasharray="4 4" label={{ value: 'Present', position: 'top', fill: '#0f172a', fontSize: 11, fontWeight: 700 }} />

                  {/* Confidence Interval Shaded Range */}
                  <Area
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="transparent"
                    fill="url(#confidenceBand)"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidenceLower"
                    stroke="transparent"
                    fill="#ffffff"
                  />

                  {/* Historical Recorded Past Line */}
                  <Line
                    type="monotone"
                    dataKey="historicalValue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#10b981' }}
                    name="Historical Telemetry"
                  />

                  {/* Future Forecast Prediction Line */}
                  <Line
                    type="monotone"
                    dataKey="predictedValue"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: '#0d9488' }}
                    name="AI Predicted Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast Horizon Outlook Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORECAST_CARDS.map((card, idx) => {
              const cfg = getAQIColorConfig(card.predictedAqi);
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{card.horizon}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({card.time})</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {card.confidence} Confidence
                    </span>
                  </div>

                  <div className="my-3 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold font-display text-slate-900">
                        {card.predictedAqi} <span className="text-xs font-normal text-slate-400">AQI</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${cfg.lightBg} ${cfg.textColor}`}
                      >
                        {card.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Dominant Factor</div>
                      <div className="text-xs font-semibold text-slate-700">{card.dominant}</div>
                      <div className="text-[10px] font-mono text-amber-600 font-medium">{card.change}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    {card.advice}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
