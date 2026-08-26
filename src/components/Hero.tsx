import React from 'react';
import {
  Activity,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wind,
  Sparkles,
  Layers,
  Flame,
  Droplets,
  CloudSun,
} from 'lucide-react';
import { NavTab, StationInfo, PollutantData } from '../types';
import { getAQIColorConfig } from '../utils/aqiCalculator';

interface HeroProps {
  onNavigate: (tab: NavTab) => void;
  selectedStation: StationInfo;
  pollutants: PollutantData[];
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, selectedStation, pollutants }) => {
  const aqiConfig = getAQIColorConfig(selectedStation.aqi);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        {/* Subtle background ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Description, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Next-Gen Environmental Intelligence & Deep Learning Forecasting</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">Air Quality Monitoring</span> & Pollution Prediction
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              An advanced environmental analytics platform synthesizing high-precision multi-pollutant IoT telemetry with Bi-LSTM neural networks and gradient-boosted time-series models to monitor, analyze, and forecast urban atmospheric hazards.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                id="hero-explore-dashboard-btn"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center gap-2 group"
              >
                <Activity className="w-4 h-4" />
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('prediction')}
                id="hero-prediction-btn"
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300/90 transition-all shadow-xs flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Run Forecast Models</span>
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                id="hero-analytics-btn"
                className="px-4 py-3 rounded-xl text-slate-600 hover:text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Historical Analytics</span>
              </button>
            </div>

            {/* Trust badges / compliance */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>EPA / WHO AQI Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-teal-600" />
                <span>Bi-LSTM & XGBoost Models</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Sub-Second Telemetry Sync</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Station Card Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl relative backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Live Telemetry Preview
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {selectedStation.type} Station
                </span>
              </div>

              {/* Station AQI Badge */}
              <div className="py-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Selected Location</div>
                  <div className="text-lg font-bold text-slate-900">{selectedStation.name}</div>
                  <div className="text-xs text-slate-400">{selectedStation.location}</div>
                </div>

                <div className="text-right">
                  <div className="inline-flex flex-col items-end">
                    <div className="text-3xl font-display font-extrabold text-slate-900 flex items-baseline gap-1">
                      <span>{selectedStation.aqi}</span>
                      <span className="text-xs font-semibold text-slate-400">AQI</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${aqiConfig.lightBg} ${aqiConfig.textColor} border ${aqiConfig.borderColor}`}
                    >
                      {aqiConfig.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pollutant mini preview grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {pollutants.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center"
                  >
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">{p.chemical}</div>
                    <div className="text-base font-bold font-display text-slate-800 my-0.5">
                      {p.value}
                    </div>
                    <div className="text-[10px] text-slate-500">{p.unit}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-600">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" /> 24.5°C • 58% Humidity
                </span>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  Full View <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">IoT Sensor Network</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">128</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>● Synchronized Stations</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Model Accuracy (R²)</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">0.946</div>
          <div className="text-xs text-teal-600 font-medium mt-1">Bi-LSTM Temporal Engine</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data Ingestion</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">2.4M</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Daily sensor readings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Predictive Horizon</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">72 Hrs</div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Continuous rolling forecast</div>
        </div>
      </section>

      {/* Feature Navigation Modules Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">Platform Core Modules</h2>
            <p className="text-sm text-slate-500">
              Integrated environmental toolkit engineered for environmental scientists, urban planners, and the public.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Dashboard */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Real-Time Air Quality Monitoring
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live multi-pollutant telemetry tracking PM2.5, PM10, NO₂, SO₂, CO, and O₃ with EPA standard sub-indices, meteorological overlays, and sensor calibration telemetry.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
              <span>Open Monitoring Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Analytics */}
          <div
            onClick={() => onNavigate('analytics')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Historical Trends & Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-depth diurnal cycles, 30-day temporal progressions, 12-month seasonal thermal inversion breakdowns, and source emission contribution apportionment.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Prediction */}
          <div
            onClick={() => onNavigate('prediction')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Deep Learning Forecasting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive forecasting simulator projecting future particulate surges with 95% confidence intervals, weather scenario adjustments, and anomaly alerts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-cyan-600">
              <span>Run Prediction Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Model Benchmarking */}
          <div
            onClick={() => onNavigate('models')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                ML Model Benchmarking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare Bi-LSTM, XGBoost, Random Forest, SARIMAX, and SVR across MAE, MSE, RMSE, R² scores, and latency to evaluate architectural efficacy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
              <span>View Benchmark Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Insights & Decision Support */}
          <div
            onClick={() => onNavigate('insights')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Intelligent Decision Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated health advisories for sensitive demographics, ventilation windows, and municipal pollution mitigation recommendations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600">
              <span>Review Actionable Insights</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Project Info & Architecture */}
          <div
            onClick={() => onNavigate('about')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                System Architecture & Workflow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technical pipeline detailing IoT calibration, data imputation, temporal feature synthesis, model training pipelines, and deployment topology.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
              <span>Read Architecture Specs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
