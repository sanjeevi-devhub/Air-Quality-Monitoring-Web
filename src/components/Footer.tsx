import React from 'react';
import { Wind, ShieldCheck, Heart, Radio, Github, ExternalLink } from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-slate-900">
                Aero<span className="text-emerald-600">Pulse</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Real-time air quality monitoring, deep learning pollution forecasting, and environmental decision intelligence platform.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>128 Telemetry Nodes Online</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              Core Modules
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Live Monitoring Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Historical Trends & Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prediction')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Predictive AI Forecasting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('models')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Model Benchmark Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Standards */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              Decision Support
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('insights')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Health & Activity Advisories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  System Architecture & Sensors
                </button>
              </li>
              <li className="text-slate-500 text-[11px]">EPA NowCast AQI Standard</li>
              <li className="text-slate-500 text-[11px]">WHO 24-Hour Particulate Thresholds</li>
            </ul>
          </div>

          {/* Col 4: Sensor Network Info */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              Network Status
            </h5>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Ingestion Latency:</span>
                <span className="font-mono font-bold text-slate-700">1.2 sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bi-LSTM Accuracy:</span>
                <span className="font-mono font-bold text-emerald-600">94.6% R²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calibration State:</span>
                <span className="font-mono font-bold text-slate-700">Zero-Drift OK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} AeroPulse Atmospheric Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Environmental & Urban Analytics</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Telemetry
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
