import React from 'react';
import {
  Info,
  Layers,
  Cpu,
  Database,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Activity,
} from 'lucide-react';
import { NavTab } from '../types';

interface AboutViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              About AeroPulse & Technical Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Next-generation atmospheric intelligence framework unifying real-time IoT sensor telemetry with deep learning forecasting.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-start lg:self-auto shadow-xs"
        >
          <span>Explore Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Purpose & Core Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purpose */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <Globe2 className="w-4 h-4" />
            <span>Platform Mission & Purpose</span>
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900">
            Democratizing Atmospheric Intelligence for Smarter, Healthier Cities
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AeroPulse is engineered to bridge the critical temporal gap between retrospective pollution monitoring and proactive hazard mitigation. By continuously analyzing particulate dynamics (PM2.5, PM10) alongside gaseous precursors (NO₂, SO₂, CO, O₃) and meteorological conditions, the platform delivers high-precision rolling forecasts that empower citizens, medical professionals, and municipal planners to take early protective action.
          </p>
        </div>

        {/* Major Capabilities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>Core Capabilities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Multi-Channel Telemetry</span>
              <span className="text-slate-500 text-[11px]">Sub-second edge ingestion across optical dust and electrochemical gas sensors.</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Deep Learning Models</span>
              <span className="text-slate-500 text-[11px]">Bi-LSTM and XGBoost ensemble engines with 94.6% R² forecast correlation.</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Scenario Simulation</span>
              <span className="text-slate-500 text-[11px]">What-if meteorological modifiers for wind dispersion, temperature, and rain washout.</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">EPA & WHO Compliance</span>
              <span className="text-slate-500 text-[11px]">Automated sub-index interpolation and demographic-tailored health advisories.</span>
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End System Pipeline Architecture */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
        <div>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">
            End-to-End Technical Workflow
          </span>
          <h3 className="text-2xl font-bold font-display text-white mt-1">
            Data Ingestion, Preprocessing & Predictive Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            How raw environmental sensor signals are cleaned, engineered, modeled, and transformed into actionable insights.
          </p>
        </div>

        {/* 4-Step Pipeline Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-100">IoT Telemetry Ingestion</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Optical particle counters (OPC), NDIR CO sensors, and 4-electrode electrochemical cells transmit high-frequency telemetry via MQTT / HTTP protocols.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center font-mono">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-100">Data Cleansing & QA</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Automated Kalman filtering removes sensor drift and optical noise. Missing values imputed via spline interpolation; features normalized via robust Z-score scaling.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center font-mono">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-100">Feature Engineering</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Synthesizes temporal cyclical encodings (sin/cos of hour and month), lag-window statistics (t-1 to t-24), atmospheric boundary layer height, and thermal inversion ratios.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
              04
            </div>
            <h4 className="text-sm font-bold text-slate-100">Inference & Decision API</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Bi-LSTM recurrent networks compute 72h future probability distributions with 95% confidence intervals, powering dashboard graphs and automated emergency alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits & Impact Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold font-display text-slate-900">
          Measurable Outcomes & Real-World Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Public Health Protection</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Reduces acute cardiovascular and asthma emergency admissions by providing 6-12 hour advance warnings before severe particulate surges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Optimized City Operations</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Enables targeted, data-backed traffic signal tuning, construction dust suppression spraying, and industrial curtailment only during critical hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Scientific Transparency</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Full model explainability with open benchmark metrics (MAE, RMSE, R²) and exportable open data APIs for researchers and universities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
