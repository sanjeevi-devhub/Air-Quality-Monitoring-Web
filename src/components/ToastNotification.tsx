import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  X,
  MapPin,
  Wind,
  ShieldAlert,
  Volume2,
  VolumeX,
  ExternalLink,
  Flame,
  Activity,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AQIToastAlert } from '../types/toast';

interface ToastNotificationProps {
  alerts: AQIToastAlert[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onNavigateToInsights?: () => void;
  onOpenCalculator?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const ToastNotificationContainer: React.FC<ToastNotificationProps> = ({
  alerts,
  onDismiss,
  onClearAll,
  onNavigateToInsights,
  onOpenCalculator,
  soundEnabled = true,
  onToggleSound,
}) => {
  if (alerts.length === 0) return null;

  return (
    <aside
      aria-label="Environmental Air Quality Alerts"
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2rem)] sm:w-[420px] pointer-events-none"
    >
      <AnimatePresence>
        {alerts.map((alert) => (
          <ToastItem
            key={alert.id}
            alert={alert}
            onDismiss={() => onDismiss(alert.id)}
            onNavigateToInsights={onNavigateToInsights}
            onOpenCalculator={onOpenCalculator}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
          />
        ))}
      </AnimatePresence>

      {alerts.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="flex justify-end pointer-events-auto pr-1"
        >
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 shadow-xs hover:shadow-sm transition-all"
          >
            Dismiss all alerts ({alerts.length})
          </button>
        </motion.div>
      )}
    </aside>
  );
};

interface ToastItemProps {
  alert: AQIToastAlert;
  onDismiss: () => void;
  onNavigateToInsights?: () => void;
  onOpenCalculator?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  alert,
  onDismiss,
  onNavigateToInsights,
  onOpenCalculator,
  soundEnabled,
  onToggleSound,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = alert.durationMs ?? 8500;
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Dynamic Environmental Color Palette based on AQI severity (> 150)
  const isHazardous = alert.aqi > 300;
  const isVeryUnhealthy = alert.aqi > 200 && alert.aqi <= 300;
  const isUnhealthy = alert.aqi > 150 && alert.aqi <= 200;

  const themeConfig = isHazardous
    ? {
        border: 'border-rose-600',
        badgeBg: 'bg-rose-950 text-rose-100 border border-rose-700',
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-950/80 border-rose-800',
        accentBg: 'from-rose-950/95 via-slate-900/98 to-rose-950/90 text-white',
        shadow: 'shadow-2xl shadow-rose-950/40',
        progressBar: 'bg-rose-500',
        aqiPill: 'bg-rose-600 text-white',
        severityLabel: 'Hazardous (WHO Emergency Tier)',
      }
    : isVeryUnhealthy
    ? {
        border: 'border-purple-300',
        badgeBg: 'bg-purple-100 text-purple-900 border border-purple-200',
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50 border-purple-200',
        accentBg: 'from-white via-purple-50/30 to-white text-slate-900',
        shadow: 'shadow-xl shadow-purple-950/10',
        progressBar: 'bg-purple-600',
        aqiPill: 'bg-purple-600 text-white',
        severityLabel: 'Very Unhealthy (Health Alert Tier)',
      }
    : {
        border: 'border-rose-300',
        badgeBg: 'bg-rose-100 text-rose-900 border border-rose-200',
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-50 border-rose-200',
        accentBg: 'from-white via-rose-50/30 to-white text-slate-900',
        shadow: 'shadow-xl shadow-rose-950/10',
        progressBar: 'bg-rose-500',
        aqiPill: 'bg-rose-600 text-white',
        severityLabel: 'Unhealthy (Threshold > 150 Exceeded)',
      };

  // Timer countdown with pause on hover
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (!isHovered) {
        const now = Date.now();
        const totalElapsed = elapsedBeforePauseRef.current + (now - startTimeRef.current);
        const remainingPct = Math.max(0, 100 - (totalElapsed / duration) * 100);
        setProgress(remainingPct);

        if (totalElapsed >= duration) {
          onDismiss();
          return;
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, duration, onDismiss]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startTimeRef.current = Date.now();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.94, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, scale: 0.92, filter: 'blur(4px)' }}
      transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${themeConfig.border} bg-gradient-to-b ${themeConfig.accentBg} ${themeConfig.shadow} backdrop-blur-md p-4 transition-all`}
    >
      {/* Top Progress countdown bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50">
        <div
          className={`h-full ${themeConfig.progressBar} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 pt-0.5">
        {/* Environmental Warning Icon Badge */}
        <div
          className={`p-2 rounded-xl border shrink-0 ${themeConfig.iconBg} ${themeConfig.iconColor}`}
        >
          {isHazardous ? (
            <Flame className="w-5 h-5 animate-pulse text-rose-500" />
          ) : isVeryUnhealthy ? (
            <ShieldAlert className="w-5 h-5 text-purple-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${themeConfig.badgeBg}`}
              >
                Environmental Alert
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                AQI &gt; 150 Threshold
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onToggleSound && (
                <button
                  onClick={onToggleSound}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                  title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </button>
              )}
              <button
                onClick={onDismiss}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                title="Dismiss this notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Title & Location */}
          <div className="mt-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold font-display flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {alert.city}, {alert.country}
                </span>
              </h4>
              <div
                className={`px-2 py-0.5 rounded-md text-xs font-extrabold font-display shrink-0 ${themeConfig.aqiPill}`}
              >
                AQI {alert.aqi}
              </div>
            </div>

            <p className="text-xs font-semibold text-rose-600 mt-0.5">
              {themeConfig.severityLabel}
            </p>
          </div>

          {/* Environmental metrics strip */}
          <div className="mt-2 text-xs bg-slate-100/70 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200/60 flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">
                Dominant:{' '}
                <strong className="text-slate-900">{alert.dominantPollutant}</strong>
              </span>
            </div>
            <span className="text-[11px] font-mono font-medium">
              PM2.5: <strong>{alert.pm25}</strong> µg/m³
            </span>
          </div>

          {/* Health Advice Snippet */}
          <div className="mt-2 text-[11px] text-slate-600 leading-relaxed bg-amber-50/60 border border-amber-200/60 p-2 rounded-xl flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Protective Guidance:</p>
              <p className="text-amber-800">{alert.protectiveAction}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {onNavigateToInsights && (
              <button
                onClick={() => {
                  onNavigateToInsights();
                  onDismiss();
                }}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <span>Health Insights</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {onOpenCalculator && (
              <button
                onClick={() => {
                  onOpenCalculator();
                  onDismiss();
                }}
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>AQI Sub-Index</span>
              </button>
            )}

            <span className="text-[10px] text-slate-400 ml-auto italic">
              {isHovered ? 'Paused' : 'Auto-dismissing'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
