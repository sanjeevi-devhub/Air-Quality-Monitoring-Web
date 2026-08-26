import React, { useState } from 'react';
import {
  Calculator,
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { computeFullAQI } from '../utils/aqiCalculator';

interface AQICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AQICalculatorModal: React.FC<AQICalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pm25, setPm25] = useState<number>(24.5);
  const [pm10, setPm10] = useState<number>(45.0);
  const [no2, setNo2] = useState<number>(30.0);
  const [so2, setSo2] = useState<number>(10.0);
  const [co, setCo] = useState<number>(0.8);
  const [o3, setO3] = useState<number>(40.0);

  if (!isOpen) return null;

  const result = computeFullAQI({
    pm25,
    pm10,
    no2,
    so2,
    co,
    o3,
  });

  const loadPreset = (preset: 'clean' | 'moderate' | 'smog' | 'dust') => {
    switch (preset) {
      case 'clean':
        setPm25(6.2);
        setPm10(14.0);
        setNo2(12.0);
        setSo2(4.0);
        setCo(0.3);
        setO3(22.0);
        break;
      case 'moderate':
        setPm25(28.4);
        setPm10(54.0);
        setNo2(35.0);
        setSo2(12.0);
        setCo(0.85);
        setO3(45.0);
        break;
      case 'smog':
        setPm25(88.5);
        setPm10(142.0);
        setNo2(72.0);
        setSo2(28.0);
        setCo(2.4);
        setO3(65.0);
        break;
      case 'dust':
        setPm25(45.0);
        setPm10(280.0);
        setNo2(30.0);
        setSo2(10.0);
        setCo(0.9);
        setO3(35.0);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Interactive Air Quality Index (AQI) Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Standard EPA linear breakpoint interpolation for multi-pollutant sub-indices.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Scenario Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('clean')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
            >
              🍃 Clean Mountain Day
            </button>
            <button
              onClick={() => loadPreset('moderate')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
            >
              🚗 Urban Commute
            </button>
            <button
              onClick={() => loadPreset('smog')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
            >
              🏭 Winter Inversion Smog
            </button>
            <button
              onClick={() => loadPreset('dust')}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold transition-colors"
            >
              🌪️ Coarse Dust Storm
            </button>
          </div>
        </div>

        {/* Sliders Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* PM2.5 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">PM2.5 (Fine Particulate)</span>
              <span className="font-mono font-bold text-emerald-600">{pm25} µg/m³</span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="0.5"
              value={pm25}
              onChange={(e) => setPm25(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* PM10 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">PM10 (Coarse Dust)</span>
              <span className="font-mono font-bold text-blue-600">{pm10} µg/m³</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="1"
              value={pm10}
              onChange={(e) => setPm10(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* NO2 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">NO₂ (Nitrogen Dioxide)</span>
              <span className="font-mono font-bold text-amber-600">{no2} ppb</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="1"
              value={no2}
              onChange={(e) => setNo2(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* SO2 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">SO₂ (Sulfur Dioxide)</span>
              <span className="font-mono font-bold text-indigo-600">{so2} ppb</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={so2}
              onChange={(e) => setSo2(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* CO */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">CO (Carbon Monoxide)</span>
              <span className="font-mono font-bold text-cyan-600">{co} ppm</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={co}
              onChange={(e) => setCo(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* O3 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">O₃ (Ground Ozone)</span>
              <span className="font-mono font-bold text-purple-600">{o3} ppb</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="1"
              value={o3}
              onChange={(e) => setO3(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Calculated US AQI Sub-Index
              </span>
              <div className="text-3xl font-display font-extrabold text-white mt-0.5 flex items-baseline gap-2">
                <span>{result.aqi}</span>
                <span className="text-xs font-semibold text-slate-400">Index Value</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${result.bgColor} text-white`}
              >
                {result.category}
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                Dominant: <strong className="text-emerald-400">{result.dominantPollutant}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
            <div className="text-slate-300">
              <strong>Health Impact:</strong> {result.healthImplications}
            </div>
            <div className="text-slate-400 text-[11px]">
              <strong>Cautionary Guidance:</strong> {result.cautionaryStatement}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
        >
          Done & Apply
        </button>
      </div>
    </div>
  );
};
