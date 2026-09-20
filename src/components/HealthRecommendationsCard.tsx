import React, { useState } from 'react';
import {
  HeartPulse,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Home,
  Activity,
  Wind,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Sliders,
  ChevronRight,
  Stethoscope,
  BellRing,
} from 'lucide-react';
import { getAQICategory, getAQIColorConfig } from '../utils/aqiCalculator';

interface HealthRecommendationsCardProps {
  aqi: number;
  stationName: string;
  dominantPollutant?: string;
  onOpenCalculator?: () => void;
  className?: string;
}

type AudienceType = 'general' | 'sensitive' | 'athletes' | 'children';

interface RecommendationDetail {
  category: string;
  title: string;
  summary: string;
  badge: string;
  statusType: 'positive' | 'neutral' | 'warning' | 'critical';
  icon: React.ComponentType<{ className?: string }>;
}

export const HealthRecommendationsCard: React.FC<HealthRecommendationsCardProps> = ({
  aqi,
  stationName,
  dominantPollutant = 'PM2.5',
  onOpenCalculator,
  className = '',
}) => {
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('general');

  const aqiConfig = getAQIColorConfig(aqi);
  const aqiCategory = getAQICategory(aqi);

  // Derive dynamic core safety tips based on current AQI level
  const getCoreSafetyTips = () => {
    if (aqi <= 50) {
      return {
        overallHeadline: 'Air quality is clean and healthy. No protective measures needed.',
        maskTip: {
          title: 'No mask required',
          desc: 'Ambient air is clean and unpolluted. Free breathing outdoors is completely safe.',
          status: 'Safe',
          statusType: 'positive' as const,
        },
        outdoorTip: {
          title: 'Ideal for outdoor recreation',
          desc: 'Perfect conditions for running, cycling, outdoor sports, and family outings.',
          status: 'Optimal',
          statusType: 'positive' as const,
        },
        ventilationTip: {
          title: 'Open windows freely',
          desc: 'Circulate clean outdoor air throughout your home and workplace.',
          status: 'Recommended',
          statusType: 'positive' as const,
        },
        purifierTip: {
          title: 'Air purifier not needed',
          desc: 'Standard natural indoor ventilation is more than sufficient today.',
          status: 'Standby',
          statusType: 'neutral' as const,
        },
        stayIndoorsTip: {
          title: 'No need to stay indoors',
          desc: 'Enjoy unrestricted outdoor time with zero particulate hazard.',
          status: 'Safe',
          statusType: 'positive' as const,
        },
        symptoms: ['None anticipated', 'Clean airway comfort', 'Optimal lung function'],
      };
    } else if (aqi <= 100) {
      return {
        overallHeadline: 'Acceptable air quality. Unusually sensitive individuals should stay mindful.',
        maskTip: {
          title: 'Mask optional',
          desc: 'Most people do not need a mask. Unusually sensitive individuals may carry one in high-traffic zones.',
          status: 'Optional',
          statusType: 'neutral' as const,
        },
        outdoorTip: {
          title: 'Safe for regular outdoor activities',
          desc: 'Good for general exercise. Those with acute sensitivity should take breaks if throat feels dry.',
          status: 'Normal',
          statusType: 'positive' as const,
        },
        ventilationTip: {
          title: 'Natural ventilation is safe',
          desc: 'Air out rooms during mid-day hours when boundary atmospheric dispersion is optimal.',
          status: 'Safe',
          statusType: 'positive' as const,
        },
        purifierTip: {
          title: 'Purifier on auto / low',
          desc: 'Light particulate filtering is beneficial in bedrooms or enclosed study spaces.',
          status: 'Optional',
          statusType: 'neutral' as const,
        },
        stayIndoorsTip: {
          title: 'Stay indoors only if sensitive',
          desc: 'General public can stay outdoors; only hypersensitive asthmatics should limit long shifts.',
          status: 'Normal',
          statusType: 'neutral' as const,
        },
        symptoms: ['Mild throat irritation in sensitive people', 'Occasional eye dryness near road traffic'],
      };
    } else if (aqi <= 150) {
      return {
        overallHeadline: 'Unhealthy for Sensitive Groups. Children, seniors, and asthmatics take precautions.',
        maskTip: {
          title: 'Mask recommended for sensitive groups',
          desc: 'Wear a well-fitting mask (KN95 or surgical) if you have asthma, allergies, or cardiovascular conditions.',
          status: 'Recommended',
          statusType: 'warning' as const,
        },
        outdoorTip: {
          title: 'Reduce intense outdoor training',
          desc: 'Shift strenuous cardio workouts indoors; limit outdoor sports sessions to under 30 minutes.',
          status: 'Caution',
          statusType: 'warning' as const,
        },
        ventilationTip: {
          title: 'Close windows during peak rush hours',
          desc: 'Prevent traffic-generated particulate influx from entering living areas.',
          status: 'Partial',
          statusType: 'warning' as const,
        },
        purifierTip: {
          title: 'Run HEPA air purifiers',
          desc: 'Activate indoor particulate air filtration to maintain healthy baseline indoor AQI.',
          status: 'Active',
          statusType: 'warning' as const,
        },
        stayIndoorsTip: {
          title: 'Sensitive groups should stay indoors',
          desc: 'Children and seniors should minimize prolonged outdoor exposure.',
          status: 'Caution',
          statusType: 'warning' as const,
        },
        symptoms: ['Coughing or wheezing in asthma patients', 'Throat tickle', 'Eye stinging after long exposure'],
      };
    } else if (aqi <= 200) {
      return {
        overallHeadline: 'Unhealthy air quality. Increased respiratory hazard for the entire population.',
        maskTip: {
          title: 'Wear an N95 / KN95 mask',
          desc: 'A certified N95 respirator is strongly advised whenever stepping outdoors to filter fine PM2.5.',
          status: 'Required',
          statusType: 'critical' as const,
        },
        outdoorTip: {
          title: 'Avoid all outdoor workouts',
          desc: 'Do not jog, cycle, or play sports outdoors. Relocate all physical exertion indoors.',
          status: 'Avoid',
          statusType: 'critical' as const,
        },
        ventilationTip: {
          title: 'Keep windows and doors tightly shut',
          desc: 'Do not open windows for ventilation; use air conditioners with clean internal circulation filters.',
          status: 'Closed',
          statusType: 'critical' as const,
        },
        purifierTip: {
          title: 'Run HEPA purifiers on medium / high',
          desc: 'Continuous mechanical filtration is essential to prevent fine particulate indoor buildup.',
          status: 'High',
          statusType: 'critical' as const,
        },
        stayIndoorsTip: {
          title: 'Stay indoors as much as possible',
          desc: 'Everyone should avoid prolonged outdoor exposure. Keep vulnerable family members inside.',
          status: 'Stay Indoors',
          statusType: 'critical' as const,
        },
        symptoms: ['Shortness of breath during exertion', 'Chest tightness', 'Coughing', 'Fatigue'],
      };
    } else if (aqi <= 300) {
      return {
        overallHeadline: 'Very Unhealthy air (Health Alert). Serious risk of adverse cardiopulmonary effects.',
        maskTip: {
          title: 'Mandatory N95 / FFP3 respirator outdoors',
          desc: 'Never step outside unprotected. Ensure airtight seal around nose and mouth.',
          status: 'Compulsory',
          statusType: 'critical' as const,
        },
        outdoorTip: {
          title: 'Stay indoors - cancel outdoor activities',
          desc: 'Eliminate all outdoor physical exertion, walking commutes, and open-air gatherings.',
          status: 'Prohibited',
          statusType: 'critical' as const,
        },
        ventilationTip: {
          title: 'Seal windows and vents completely',
          desc: 'Keep all windows, balconies, and vents hermetically closed. Avoid introducing outside air.',
          status: 'Sealed',
          statusType: 'critical' as const,
        },
        purifierTip: {
          title: 'Max HEPA filtration in sealed rooms',
          desc: 'Run multi-stage HEPA air purifiers at maximum fan speed in primary occupied rooms.',
          status: 'Maximum',
          statusType: 'critical' as const,
        },
        stayIndoorsTip: {
          title: 'Strict stay-at-home advisory',
          desc: 'All residents should remain indoors in air-filtered spaces. Schools and offices should restrict outdoor time.',
          status: 'Stay Indoors',
          statusType: 'critical' as const,
        },
        symptoms: ['Persistent coughing', 'Acute asthma exacerbation', 'Eye inflammation', 'Headaches'],
      };
    } else {
      // 301+ Hazardous
      return {
        overallHeadline: 'Hazardous emergency conditions! Acute health hazard for all individuals.',
        maskTip: {
          title: 'Industrial-grade N99 / FFP3 respirator',
          desc: 'Emergency protection mandatory if stepping outside. Cloth and surgical masks are ineffective.',
          status: 'Emergency',
          statusType: 'critical' as const,
        },
        outdoorTip: {
          title: 'Zero outdoor exposure',
          desc: 'Absolute prohibition on outdoor activities. High risk of systemic inflammation and toxic intake.',
          status: 'Emergency',
          statusType: 'critical' as const,
        },
        ventilationTip: {
          title: 'Create a sealed clean-air haven',
          desc: 'Seal perimeter drafts around doors and windows with damp towels or weather strips.',
          status: 'Sealed',
          statusType: 'critical' as const,
        },
        purifierTip: {
          title: 'Continuous 24/7 HEPA & Carbon filtration',
          desc: 'Keep all air purification units running without interruption at peak capacity.',
          status: 'Continuous',
          statusType: 'critical' as const,
        },
        stayIndoorsTip: {
          title: 'Emergency: Stay indoors in clean zone',
          desc: 'Remain strictly inside an air-purified room. Vulnerable persons must have immediate medical contacts.',
          status: 'Strict Quarantine',
          statusType: 'critical' as const,
        },
        symptoms: ['Severe breathing difficulty', 'Chest pain or rapid pulse', 'Acute bronchitis', 'Dizziness'],
      };
    }
  };

  const tips = getCoreSafetyTips();

  // Audience-specific personalized guidance
  const getAudienceAdvice = () => {
    switch (selectedAudience) {
      case 'children':
        return aqi <= 100
          ? 'Safe for school recesses and outdoor playgrounds. Encourage hydration.'
          : aqi <= 150
          ? 'Limit high-intensity outdoor games like soccer and sprint games to under 20 minutes.'
          : 'Schools should cancel outdoor gym classes and recess. Keep children indoors in air-conditioned spaces.';
      case 'sensitive':
        return aqi <= 50
          ? 'No restrictions. Great weather to boost lung capacity with gentle walking.'
          : aqi <= 100
          ? 'Carry prescribed asthma inhalers or antihistamines if you have seasonal dust reactivity.'
          : aqi <= 150
          ? 'Wear a mask when leaving the house. Do not perform strenuous manual chores outdoors.'
          : 'Stay strictly indoors. Monitor pulse oximetry and keep emergency medical numbers handy.';
      case 'athletes':
        return aqi <= 50
          ? 'Optimal baseline for marathon training, interval running, and aerobic fitness.'
          : aqi <= 100
          ? 'Safe for training. Heavy endurance athletes breathing 80+ L/min may feel mild tracheal drying.'
          : aqi <= 150
          ? 'Move aerobic training indoors to gym treadmills and stationary bikes with air filtration.'
          : 'Avoid outdoor exercise completely. Breathing polluted air at high ventilatory rates causes deep alveolar damage.';
      case 'general':
      default:
        return aqi <= 100
          ? 'Enjoy normal daily routines, walking commutes, and outdoor activities without concern.'
          : aqi <= 150
          ? 'General public can proceed with regular routines, but avoid unnecessary idle time in heavy traffic.'
          : 'Limit unnecessary outdoor trips. Wear a protective mask if commuting and keep windows closed at home.';
    }
  };

  const getBadgeClasses = (type: 'positive' | 'neutral' | 'warning' | 'critical') => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'neutral':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div
      id="health-recommendations-card"
      className={`bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 ${className}`}
    >
      {/* Top Header: Title, Category Badge & Current Telemetry Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${aqiConfig.lightBg} ${aqiConfig.textColor} ${aqiConfig.borderColor}`}
          >
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Health Recommendations & Safety Advisories
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${aqiConfig.lightBg} ${aqiConfig.textColor} ${aqiConfig.borderColor}`}
              >
                AQI {aqi} • {aqiCategory}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live automated safety guidelines dynamically calibrated to{' '}
              <strong className="text-slate-700">{stationName}</strong> ({dominantPollutant} dominant)
            </p>
          </div>
        </div>

        {/* Action Button: Simulate or Calculator */}
        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            id="health-card-simulate-btn"
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
            title="Open AQI Simulator to test different health advisories"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulate Level</span>
          </button>
        )}
      </div>

      {/* Main Dynamic Headline Alert Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
          aqi > 150
            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
            : aqi > 100
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {aqi > 150 ? (
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          ) : aqi > 100 ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">
            {aqi > 200 ? 'Health Emergency Warning' : aqi > 150 ? 'Health Advisory Alert' : 'Current Health Outlook'}
          </div>
          <p className="text-sm font-semibold mt-0.5">{tips.overallHeadline}</p>
        </div>
        <div className="text-right hidden md:block shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Dominant Risk
          </span>
          <span className="text-xs font-bold text-slate-800">{dominantPollutant} Particulates</span>
        </div>
      </div>

      {/* 4 Core Dynamic Safety Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tip 1: Mask Protection */}
        <div
          id="health-tip-mask"
          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mask Protection</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses(
                  tips.maskTip.statusType
                )}`}
              >
                {tips.maskTip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-2.5">{tips.maskTip.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tips.maskTip.desc}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            {tips.maskTip.statusType === 'critical' ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Wear N95 outdoors
              </span>
            ) : tips.maskTip.statusType === 'warning' ? (
              <span className="text-amber-700 font-medium">Sensitive groups mask up</span>
            ) : (
              <span className="text-emerald-700 font-medium">Clear air - unmasked</span>
            )}
          </div>
        </div>

        {/* Tip 2: Outdoor Activity & Exercise */}
        <div
          id="health-tip-outdoor"
          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Outdoor Activity</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses(
                  tips.outdoorTip.statusType
                )}`}
              >
                {tips.outdoorTip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-2.5">{tips.outdoorTip.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tips.outdoorTip.desc}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            {tips.outdoorTip.statusType === 'critical' ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Exercise indoors only
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Outdoor safe
              </span>
            )}
          </div>
        </div>

        {/* Tip 3: Windows & Natural Ventilation */}
        <div
          id="health-tip-ventilation"
          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                <Home className="w-4 h-4 text-cyan-600" />
                <span>Indoor Ventilation</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses(
                  tips.ventilationTip.statusType
                )}`}
              >
                {tips.ventilationTip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-2.5">{tips.ventilationTip.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tips.ventilationTip.desc}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            {tips.ventilationTip.statusType === 'critical' ? (
              <span className="text-rose-600 font-bold">Keep windows closed</span>
            ) : (
              <span className="text-emerald-700 font-medium">Fresh air circulation safe</span>
            )}
          </div>
        </div>

        {/* Tip 4: Stay Indoors & Air Purification */}
        <div
          id="health-tip-purification"
          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                <Wind className="w-4 h-4 text-indigo-600" />
                <span>Stay Indoors / Purifier</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses(
                  tips.purifierTip.statusType
                )}`}
              >
                {tips.purifierTip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-2.5">{tips.stayIndoorsTip.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tips.purifierTip.desc}</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            {aqi > 150 ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <BellRing className="w-3 h-3" /> Stay indoors recommended
              </span>
            ) : (
              <span className="text-slate-600 font-medium">Outdoor movements unrestricted</span>
            )}
          </div>
        </div>
      </div>

      {/* Audience Personalization Tabs & Specific Advice */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Personalized Guidance by Demographic Group:
            </span>
          </div>

          {/* Demographic Pill Switchers */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 overflow-x-auto">
            {(
              [
                { id: 'general', label: 'General Public' },
                { id: 'sensitive', label: 'Sensitive & Asthmatic' },
                { id: 'athletes', label: 'Athletes & Joggers' },
                { id: 'children', label: 'Children & Schools' },
              ] as const
            ).map((aud) => (
              <button
                key={aud.id}
                onClick={() => setSelectedAudience(aud.id)}
                id={`audience-btn-${aud.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedAudience === aud.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {aud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Demographic Advice Content Box */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 mb-0.5">
              Specific Advisory for {selectedAudience === 'general' ? 'General Public' : selectedAudience === 'sensitive' ? 'Sensitive Groups (Respiratory & Cardiac)' : selectedAudience === 'athletes' ? 'Athletes and High-Exertion Workers' : 'Children, Schools and Nurseries'}:
            </div>
            <p className="text-slate-600 leading-relaxed">{getAudienceAdvice()}</p>
          </div>
        </div>
      </div>

      {/* Symptoms to Watch For Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
            Symptoms to Monitor:
          </span>
          {tips.symptoms.map((symptom, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-700 text-xs font-medium"
            >
              • {symptom}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0">
          <Info className="w-3.5 h-3.5" />
          <span>Grounded in WHO Global Air Quality Guidelines 2021</span>
        </div>
      </div>
    </div>
  );
};
