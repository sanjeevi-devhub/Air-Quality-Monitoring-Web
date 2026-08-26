import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  BrainCircuit,
  Trophy,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ML_MODELS } from '../data/mockData';
import { MLModelMetric } from '../types';

export const ModelComparisonView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'r2' | 'rmse' | 'mae' | 'inferenceSpeedMs'>('r2');
  const [activeModelDetail, setActiveModelDetail] = useState<MLModelMetric>(ML_MODELS[0]);

  const bestModel = ML_MODELS.find((m) => m.isBest) || ML_MODELS[0];

  const chartData = ML_MODELS.map((m) => ({
    name: m.name.split(' ')[0], // short name
    fullName: m.name,
    r2: m.r2,
    rmse: m.rmse,
    mae: m.mae,
    inferenceSpeedMs: m.inferenceSpeedMs,
    isBest: m.isBest,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Machine Learning Model Benchmark & Evaluation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical comparison of deep recurrent networks, gradient-boosted ensembles, and statistical time-series models on real sensor telemetry.
          </p>
        </div>

        {/* Winner Highlight Pill */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-300/80 p-3 rounded-2xl">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-emerald-800 font-bold block">Top Performing Architecture</span>
            <span className="text-slate-600">{bestModel.name} (R² = {bestModel.r2})</span>
          </div>
        </div>
      </div>

      {/* Top 3 Champion Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Highest R² Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">0.946</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Bi-LSTM Neural Network</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Explains 94.6% of pollutant variance</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lowest RMSE Error</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">4.32</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Bi-LSTM (vs 9.07 SARIMAX)</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Minimizes heavy outlier penalty</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fastest Edge Inference</span>
            <Zap className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">3.8 ms</div>
          <div className="text-xs text-cyan-600 font-semibold mt-1">XGBoost Regressor</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ideal for sub-second IoT edge nodes</p>
        </div>
      </div>

      {/* Comparative Visual Benchmark Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              Architectural Metric Comparison Chart
            </h3>
            <p className="text-xs text-slate-500">
              Interactive visualization across regression accuracy and latency.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'r2', label: 'R² Correlation (Higher is better)' },
              { id: 'rmse', label: 'RMSE (Lower is better)' },
              { id: 'mae', label: 'MAE (Lower is better)' },
              { id: 'inferenceSpeedMs', label: 'Latency (ms)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMetric === m.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                formatter={(val: any) => [
                  `${val} ${selectedMetric === 'r2' ? 'Score' : selectedMetric === 'inferenceSpeedMs' ? 'ms' : 'Error'}`,
                  selectedMetric.toUpperCase(),
                ]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey={selectedMetric} radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isBest ? '#10b981' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Benchmark Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              Comprehensive Performance Benchmark Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated on 50,000 continuous test timestamps across multi-sensor urban grids.
            </p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any row to view architecture breakdown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Model & Architecture</th>
                <th className="py-3.5 px-3">MAE</th>
                <th className="py-3.5 px-3">MSE</th>
                <th className="py-3.5 px-3">RMSE</th>
                <th className="py-3.5 px-3">R² Score</th>
                <th className="py-3.5 px-3">Latency</th>
                <th className="py-3.5 px-3">Training</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ML_MODELS.map((model) => {
                const isSelected = activeModelDetail.id === model.id;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setActiveModelDetail(model)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {model.name}
                        {model.isBest && (
                          <span className="p-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold px-1.5 flex items-center gap-0.5">
                            <Trophy className="w-2.5 h-2.5" /> Best
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{model.architecture}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-700">{model.mae}</td>
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-700">{model.mse}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-900">{model.rmse}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">{model.r2}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">{model.inferenceSpeedMs} ms</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{model.trainingTimeSec}s</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          model.r2 > 0.93
                            ? 'bg-emerald-100 text-emerald-800'
                            : model.r2 > 0.88
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {model.r2 > 0.93 ? 'Superior' : model.r2 > 0.88 ? 'Strong' : 'Baseline'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Architectural Breakdown Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Architectural Deep Dive
            </span>
            <h4 className="text-xl font-bold font-display text-white mt-0.5">
              {activeModelDetail.name}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-emerald-400 text-xs font-mono font-bold">
              R² = {activeModelDetail.r2}
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono">
              RMSE = {activeModelDetail.rmse}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Best Use Case */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="text-emerald-400 font-bold uppercase text-[10px]">Optimal Deployment</div>
            <div className="text-slate-200 font-semibold">{activeModelDetail.bestUseFor}</div>
            <div className="text-[11px] text-slate-400 pt-1">
              Architecture: {activeModelDetail.architecture}
            </div>
          </div>

          {/* Key Advantages */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="text-emerald-400 font-bold uppercase text-[10px]">Model Advantages</div>
            <ul className="space-y-1 text-slate-300">
              {activeModelDetail.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tradeoffs */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="text-amber-400 font-bold uppercase text-[10px]">Architectural Trade-offs</div>
            <ul className="space-y-1 text-slate-300">
              {activeModelDetail.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
