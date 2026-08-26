import React, { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
  Users,
  Wind,
  Home,
  CheckCircle2,
  Bell,
  ArrowRight,
  Sparkles,
  Layers,
  Car,
  Building,
} from 'lucide-react';
import { INSIGHT_ALERTS } from '../data/mockData';
import { StationInfo } from '../types';
import { getAQIColorConfig } from '../utils/aqiCalculator';

interface InsightsViewProps {
  station: StationInfo;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ station }) => {
  const [selectedDemographic, setSelectedDemographic] = useState<
    'general' | 'elderly' | 'children' | 'asthmatic' | 'athletes'
  >('general');
  const [activityType, setActivityType] = useState<'sedentary' | 'moderate' | 'intense'>('moderate');

  const aqiConfig = getAQIColorConfig(station.aqi);

  // Dynamic personalized advisory calculation
  const getPersonalizedAdvisory = () => {
    const isSensitive = selectedDemographic === 'asthmatic' || selectedDemographic === 'elderly' || selectedDemographic === 'children';
    const isIntense = activityType === 'intense';

    if (station.aqi <= 50) {
      return {
        level: 'Safe & Ideal',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        summary: 'Excellent ambient air conditions across all metrics.',
        recommendations: [
          'No restrictions on outdoor aerobic sports, running, or cycling.',
          'Natural ventilation recommended for residential and commercial interiors.',
          'Ideal window for outdoor school activities and open-air events.',
        ],
      };
    } else if (station.aqi <= 100) {
      return {
        level: isSensitive ? 'Caution for Sensitive Individuals' : 'Generally Acceptable',
        badge: isSensitive ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
        summary: 'Moderate particulate concentrations present in the lower atmosphere.',
        recommendations: [
          isSensitive
            ? 'Consider reducing prolonged heavy outdoor exertion if experiencing coughing or shortness of breath.'
            : 'General public may enjoy routine outdoor activities without restrictions.',
          'Individuals with pre-existing asthma should keep rescue inhalers accessible.',
          'Keep vehicle air recirculation mode on during heavy traffic congestion.',
        ],
      };
    } else if (station.aqi <= 150) {
      return {
        level: 'Sensitive Groups Risk',
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        summary: 'Particulate matter or photochemical ozone elevated above WHO 24h baseline.',
        recommendations: [
          'Children, seniors, and respiratory patients should shift intense workouts indoors.',
          isIntense
            ? 'Avoid heavy outdoor cardiovascular endurance training near high-traffic arterial roads.'
            : 'Take more frequent breaks during outdoor walks.',
          'Close windows during evening peak hours (18:00–21:00) and engage HEPA air cleaners.',
        ],
      };
    } else {
      return {
        level: 'Unhealthy Alert',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        summary: 'Elevated pollution hazard affecting the general population.',
        recommendations: [
          'Everyone should avoid prolonged or heavy outdoor physical exertion.',
          'Wear N95/KF94 certified respirators if commuting or walking outdoors.',
          'Operate indoor air purifiers on high mode; seal window perimeter gaps.',
          'Schools should suspend outdoor physical education classes.',
        ],
      };
    }
  };

  const advisory = getPersonalizedAdvisory();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Intelligent Insights & Environmental Decision Support
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizing complex multi-sensor readings into actionable health recommendations, emission mitigation protocols, and real-time alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs">
          <span className="text-slate-400 font-medium">Station:</span>
          <span className="font-bold text-slate-800">{station.name}</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${aqiConfig.lightBg} ${aqiConfig.textColor}`}>
            AQI {station.aqi}
          </span>
        </div>
      </div>

      {/* Real-time Atmospheric Alert Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" /> Real-Time Intelligence & Advisory Feed
          </h3>
          <span className="text-xs text-slate-400">4 Active System Insights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSIGHT_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        alert.impactLevel === 'High'
                          ? 'bg-rose-500 animate-pulse'
                          : alert.impactLevel === 'Medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {alert.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      alert.impactLevel === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : alert.impactLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {alert.impactLevel} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{alert.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Action:
                </div>
                <div className="text-emerald-800 bg-emerald-50/80 p-2 rounded-xl mt-1 font-medium text-[11px]">
                  {alert.actionSuggested}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Personalized Health Advisory Tool */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              Personalized Health & Activity Advisory Generator
            </h3>
            <p className="text-xs text-slate-500">
              Tailored medical and behavioral guidance calculated dynamically for current ambient air quality.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographic Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Select Demographic / Vulnerability Group:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'general', label: 'Healthy Adults' },
                { id: 'elderly', label: 'Seniors (65+)' },
                { id: 'children', label: 'Children & Infants' },
                { id: 'asthmatic', label: 'Asthma / COPD' },
                { id: 'athletes', label: 'Outdoor Athletes' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDemographic(item.id as any)}
                  className={`p-2.5 rounded-2xl text-xs font-medium border transition-all text-center ${
                    selectedDemographic === item.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Planned Activity Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sedentary', label: 'Indoor / Desk Work' },
                { id: 'moderate', label: 'Walking / Commute' },
                { id: 'intense', label: 'Vigorous Running' },
              ].map((act) => (
                <button
                  key={act.id}
                  onClick={() => setActivityType(act.id as any)}
                  className={`p-2.5 rounded-2xl text-xs font-medium border transition-all text-center ${
                    activityType === act.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Advisory Output Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Assessment:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${advisory.badge}`}>
                {advisory.level}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Station AQI: {station.aqi}
            </span>
          </div>

          <p className="text-xs text-slate-700 font-medium">{advisory.summary}</p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Action Checklist:
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {advisory.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Municipal & Urban Management Policy Checklist */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              Municipal & Urban Pollution Management Protocols
            </h3>
            <p className="text-xs text-slate-500">
              Automated trigger matrix for city environmental administrators and transport authorities.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            Standard Protocol Stage 1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Car className="w-4 h-4" />
              <span>Traffic & Congestion Flow</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Dynamically optimize traffic signal cycles along heavy freight corridors to reduce idling emissions during evening wind stagnation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Wind className="w-4 h-4" />
              <span>Anti-Smog Misting Cannons</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Deploy high-pressure atomized misting trucks across high-dust construction corridors when PM10 values exceed 80 µg/m³.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Industrial Compliance Alert</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Continuous CEMS emission monitoring checks dispatched to coal boilers and smelters in Industrial Zone B.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
