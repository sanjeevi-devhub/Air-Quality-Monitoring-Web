import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  Flame,
  Layers,
  ArrowUpDown,
  Sparkles,
  ThermometerSnowflake,
  SunMedium,
  Wind,
  CheckCircle2,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  HOURLY_24H_DATA,
  SEVEN_DAY_DATA,
  THIRTY_DAY_DATA,
  MONTHLY_DATA,
  SEASONAL_DATA,
  EMISSION_SOURCES,
} from '../data/mockData';

type TimeRangeKey = '24h' | '7d' | '30d' | '12m' | 'seasonal';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('7d');
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>(['pm25', 'pm10', 'no2']);
  const [exportNotice, setExportNotice] = useState<{
    message: string;
    filename: string;
    rowsCount: number;
    columnsCount: number;
  } | null>(null);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);

  const togglePollutant = (pKey: string) => {
    if (selectedPollutants.includes(pKey)) {
      if (selectedPollutants.length > 1) {
        setSelectedPollutants(selectedPollutants.filter((k) => k !== pKey));
      }
    } else {
      setSelectedPollutants([...selectedPollutants, pKey]);
    }
  };

  const pollutantLabels: Record<string, { label: string; unit: string; chemical: string }> = {
    pm25: { label: 'PM2.5', unit: 'µg/m³', chemical: 'PM2.5 (Fine Particulate)' },
    pm10: { label: 'PM10', unit: 'µg/m³', chemical: 'PM10 (Coarse Particulate)' },
    no2: { label: 'NO2', unit: 'ppb', chemical: 'NO₂ (Nitrogen Dioxide)' },
    so2: { label: 'SO2', unit: 'ppb', chemical: 'SO₂ (Sulfur Dioxide)' },
    co: { label: 'CO', unit: 'ppm', chemical: 'CO (Carbon Monoxide)' },
    o3: { label: 'O3', unit: 'ppb', chemical: 'O₃ (Ground-level Ozone)' },
  };

  /**
   * Generates formatted CSV string tailored strictly to the active time range
   * and user's selected pollutant filter configuration.
   */
  const generateCSV = (exportFullDataset: boolean = false): { csv: string; filename: string; rowsCount: number; columnsCount: number } => {
    const timestampStr = new Date().toISOString().split('T')[0];
    let headers: string[] = [];
    const rows: string[][] = [];
    let filename = `aeropulse_${timeRange}_dataset_${timestampStr}.csv`;

    const activePollutantKeys = exportFullDataset
      ? ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3']
      : selectedPollutants;

    if (timeRange === '24h') {
      filename = `aeropulse_24h_telemetry_${exportFullDataset ? 'all' : activePollutantKeys.join('_')}_${timestampStr}.csv`;
      headers = ['Timestamp', 'Time Label', 'US AQI'];
      
      activePollutantKeys.forEach((key) => {
        const info = pollutantLabels[key];
        if (info) headers.push(`${info.chemical} [${info.unit}]`);
      });

      headers.push('Ambient Temp (°C)', 'Relative Humidity (%)');

      HOURLY_24H_DATA.forEach((item) => {
        const row = [item.timestamp, item.timeLabel, item.aqi.toString()];
        activePollutantKeys.forEach((key) => {
          const val = (item as any)[key] !== undefined ? (item as any)[key] : 'N/A';
          row.push(val.toString());
        });
        row.push(item.temperature.toString(), item.humidity.toString());
        rows.push(row);
      });
    } else if (timeRange === '7d') {
      filename = `aeropulse_7day_trend_${exportFullDataset ? 'all' : activePollutantKeys.join('_')}_${timestampStr}.csv`;
      headers = ['Day', 'AQI'];

      activePollutantKeys.forEach((key) => {
        const info = pollutantLabels[key];
        if (info) headers.push(`${info.chemical} [${info.unit}]`);
      });

      headers.push('Temperature (°C)');

      SEVEN_DAY_DATA.forEach((item) => {
        const row = [item.day, item.aqi.toString()];
        activePollutantKeys.forEach((key) => {
          const val = (item as any)[key] !== undefined ? (item as any)[key] : 'N/A';
          row.push(val.toString());
        });
        row.push(item.temp.toString());
        rows.push(row);
      });
    } else if (timeRange === '30d') {
      filename = `aeropulse_30day_progression_${exportFullDataset ? 'all' : activePollutantKeys.join('_')}_${timestampStr}.csv`;
      headers = ['Day Sequence', 'Date', 'AQI'];

      activePollutantKeys.forEach((key) => {
        const info = pollutantLabels[key];
        if (info) headers.push(`${info.chemical} [${info.unit}]`);
      });

      THIRTY_DAY_DATA.forEach((item) => {
        const row = [item.day, item.date, item.aqi.toString()];
        activePollutantKeys.forEach((key) => {
          const val = (item as any)[key] !== undefined ? (item as any)[key] : 'N/A';
          row.push(val.toString());
        });
        rows.push(row);
      });
    } else if (timeRange === '12m') {
      filename = `aeropulse_12month_annual_summary_${timestampStr}.csv`;
      headers = [
        'Month',
        'Monthly Mean AQI',
        'Peak Anomaly AQI',
        'PM2.5 Mean (µg/m³)',
        'PM10 Mean (µg/m³)',
        'NO2 Mean (ppb)',
        'SO2 Mean (ppb)',
      ];

      MONTHLY_DATA.forEach((item) => {
        rows.push([
          item.month,
          item.avgAqi.toString(),
          item.maxAqi.toString(),
          item.pm25.toString(),
          item.pm10.toString(),
          item.no2.toString(),
          item.so2.toString(),
        ]);
      });
    } else if (timeRange === 'seasonal') {
      filename = `aeropulse_seasonal_meteorological_inversion_${timestampStr}.csv`;
      headers = [
        'Season Window',
        'Mean AQI',
        'PM2.5 (µg/m³)',
        'Average Temp (°C)',
        'Thermal Inversion Risk Level',
        'Primary Meteorological Driver',
      ];

      SEASONAL_DATA.forEach((item) => {
        rows.push([
          `"${item.season}"`,
          item.aqi.toString(),
          item.pm25.toString(),
          item.temperature.toString(),
          `"${item.inversionRisk}"`,
          `"${item.dominantFactor}"`,
        ]);
      });
    }

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel compatibility
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return {
      csv: csvContent,
      filename,
      rowsCount: rows.length,
      columnsCount: headers.length,
    };
  };

  const handleExport = (exportFullDataset: boolean = false) => {
    try {
      const { csv, filename, rowsCount, columnsCount } = generateCSV(exportFullDataset);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportNotice({
        message: `Dataset downloaded successfully (${rowsCount} rows, ${columnsCount} fields)`,
        filename,
        rowsCount,
        columnsCount,
      });

      setShowExportOptions(false);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      console.error('Failed to export CSV dataset:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter Controls Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Air Quality Analytics & Historical Trends
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multivariate temporal analysis, seasonal thermal inversion dynamics, and particulate source apportionment.
          </p>
        </div>

        {/* Interactive Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(
              [
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '12m', label: '12 Months' },
                { id: 'seasonal', label: 'Seasonal' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTimeRange(t.id);
                  setExportNotice(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export Dropdown / Action Cluster */}
          <div className="relative">
            <div className="inline-flex rounded-xl shadow-2xs border border-slate-200 bg-white">
              <button
                onClick={() => handleExport(false)}
                id="export-analytics-csv-btn"
                title="Download filtered CSV dataset for current view"
                className="px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 rounded-l-xl border-r border-slate-100"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export Filtered CSV</span>
              </button>
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                id="toggle-export-options-btn"
                aria-label="Export options"
                className="px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors rounded-r-xl"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Export Configuration Menu */}
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-30 space-y-2.5 text-xs animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                    CSV Export Settings
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{timeRange}</span>
                </div>

                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between py-1">
                    <span>Active Filter:</span>
                    <strong className="text-slate-800 uppercase font-mono">
                      {timeRange === '24h' || timeRange === '7d' || timeRange === '30d'
                        ? `${selectedPollutants.join(', ').toUpperCase()}`
                        : 'Full Matrix'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-100">
                    <span>Format:</span>
                    <span className="text-slate-800 font-medium">UTF-8 RFC-4180 (.csv)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <button
                    onClick={() => handleExport(false)}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Download Filtered View</span>
                    <Download className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleExport(true)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Download All Parameters</span>
                    <Layers className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">{exportNotice.message}</span>
              <span className="text-emerald-700 block text-[11px]">
                Saved as <code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded text-emerald-900 font-semibold">{exportNotice.filename}</code>
              </span>
            </div>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-[11px] font-semibold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dynamic Trend Visualizer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              {timeRange === '24h' && '24-Hour High-Resolution Diurnal Progression'}
              {timeRange === '7d' && '7-Day Weekly Temporal Cycle'}
              {timeRange === '30d' && '30-Day Ambient Concentration Progression'}
              {timeRange === '12m' && '12-Month Annual Pollution Progression & Anomaly Peaks'}
              {timeRange === 'seasonal' && 'Seasonal Distribution & Meteorological Trapping Analysis'}
            </h3>
            <p className="text-xs text-slate-500">
              Select or deselect pollutant channels to compare relative temporal correlations.
            </p>
          </div>

          {/* Pollutant Toggle Checkboxes (for 24h/7d/30d) */}
          {(timeRange === '24h' || timeRange === '7d' || timeRange === '30d') && (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'pm25', label: 'PM2.5', color: '#10b981' },
                { key: 'pm10', label: 'PM10', color: '#3b82f6' },
                { key: 'no2', label: 'NO₂', color: '#f59e0b' },
                { key: 'o3', label: 'O₃', color: '#8b5cf6' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => togglePollutant(item.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    selectedPollutants.includes(item.key)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chart View Switching based on timeRange */}
        <div className="h-80 w-full pt-2">
          {timeRange === '24h' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_24H_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anPM25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="anPM10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                {selectedPollutants.includes('pm25') && (
                  <Area type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#10b981" strokeWidth={2} fill="url(#anPM25)" />
                )}
                {selectedPollutants.includes('pm10') && (
                  <Area type="monotone" dataKey="pm10" name="PM10 (µg/m³)" stroke="#3b82f6" strokeWidth={2} fill="url(#anPM10)" />
                )}
                {selectedPollutants.includes('no2') && (
                  <Line type="monotone" dataKey="no2" name="NO₂ (ppb)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                )}
                {selectedPollutants.includes('o3') && (
                  <Line type="monotone" dataKey="o3" name="O₃ (ppb)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}

          {timeRange === '7d' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEVEN_DAY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                {selectedPollutants.includes('pm25') && (
                  <Bar dataKey="pm25" name="PM2.5 (µg/m³)" fill="#10b981" radius={[6, 6, 0, 0]} />
                )}
                {selectedPollutants.includes('pm10') && (
                  <Bar dataKey="pm10" name="PM10 (µg/m³)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                )}
                {selectedPollutants.includes('no2') && (
                  <Bar dataKey="no2" name="NO₂ (ppb)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                )}
                {selectedPollutants.includes('o3') && (
                  <Bar dataKey="o3" name="O₃ (ppb)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}

          {timeRange === '30d' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={THIRTY_DAY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                {selectedPollutants.includes('pm25') && (
                  <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#10b981" strokeWidth={2} dot={false} />
                )}
                {selectedPollutants.includes('pm10') && (
                  <Line type="monotone" dataKey="pm10" name="PM10 (µg/m³)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                )}
                {selectedPollutants.includes('no2') && (
                  <Line type="monotone" dataKey="no2" name="NO₂ (ppb)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                )}
                {selectedPollutants.includes('o3') && (
                  <Line type="monotone" dataKey="o3" name="O₃ (ppb)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}

          {timeRange === '12m' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="avgAqi" name="Monthly Avg AQI" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="maxAqi" name="Peak Spike AQI" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {timeRange === 'seasonal' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEASONAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="aqi" name="Seasonal Mean AQI" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pm25" name="PM2.5 (µg/m³)" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Two-Column Analytics: Source Apportionment & Seasonal Inversion Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emission Source Apportionment (Donut Chart & List) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold font-display text-slate-900">
                Pollution Source Apportionment
              </h4>
              <p className="text-xs text-slate-500">
                Receptor modeling & chemical mass balance distribution.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Urban Grid Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
            <div className="sm:col-span-5 h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EMISSION_SOURCES}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {EMISSION_SOURCES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}% Share`, 'Contribution']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-7 space-y-2 text-xs">
              {EMISSION_SOURCES.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-display shrink-0">{item.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal & Meteorological Inversion Impact */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold font-display text-slate-900">
                Seasonal Meteorological Impact
              </h4>
              <p className="text-xs text-slate-500">
                Atmospheric boundary layer height and thermal trapping.
              </p>
            </div>
            <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
          </div>

          <div className="space-y-3 pt-1">
            {SEASONAL_DATA.map((s, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{s.season}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Mean AQI: {s.aqi}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Primary Driver: <strong className="text-slate-700">{s.dominantFactor}</strong>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      s.inversionRisk.includes('Severe')
                        ? 'bg-rose-100 text-rose-800'
                        : s.inversionRisk.includes('Moderate')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.inversionRisk}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.temperature}°C Average</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
