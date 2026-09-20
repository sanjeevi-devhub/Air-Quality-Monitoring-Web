import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  MapPin,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Compass,
  Radio,
  Eye,
  Info,
  Navigation,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { StationInfo } from '../types';
import { getAQIColorConfig, getAQICategory } from '../utils/aqiCalculator';
import {
  formatVisualCoordinates,
  generateNearbyNodes,
  NearbyMonitoringNode,
} from '../utils/coordinatesHelper';

interface MiniStationMapProps {
  station: StationInfo;
  className?: string;
  onSelectStation?: (station: StationInfo) => void;
}

type MapLayer = 'hybrid' | 'radar' | 'terrain';

export const MiniStationMap: React.FC<MiniStationMapProps> = ({
  station,
  className = '',
  onSelectStation,
}) => {
  const [lat, lng] = station.coordinates;
  const [zoom, setZoom] = useState<number>(12);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<MapLayer>('hybrid');
  const [showRadiusRings, setShowRadiusRings] = useState<boolean>(true);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeNodePopup, setActiveNodePopup] = useState<NearbyMonitoringNode | null>(null);
  const [showPinTooltip, setShowPinTooltip] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const aqiConfig = getAQIColorConfig(station.aqi);
  const aqiCategory = getAQICategory(station.aqi);
  const formattedCoords = useMemo(() => formatVisualCoordinates(lat, lng), [lat, lng]);
  const nearbyNodes = useMemo(() => generateNearbyNodes(lat, lng, station.aqi, station.name), [
    lat,
    lng,
    station.aqi,
    station.name,
  ]);

  // Reset pan when station coordinates change
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
    setActiveNodePopup(null);
  }, [lat, lng]);

  // Handle Drag / Pan Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(16, z + 1));
  const handleZoomOut = () => setZoom((z) => Math.max(5, z - 1));
  const handleRecenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(12);
    setActiveNodePopup(null);
  };

  // Web Mercator Tile Calculation for Background Raster
  const { tileX, tileY, centerOffsetX, centerOffsetY } = useMemo(() => {
    const n = Math.pow(2, zoom);
    const rad = (lat * Math.PI) / 180;
    const exactX = ((lng + 180) / 360) * n;
    const exactY = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;

    const baseTileX = Math.floor(exactX);
    const baseTileY = Math.floor(exactY);
    const fractX = (exactX - baseTileX) * 256;
    const fractY = (exactY - baseTileY) * 256;

    return {
      tileX: baseTileX,
      tileY: baseTileY,
      centerOffsetX: fractX,
      centerOffsetY: fractY,
    };
  }, [lat, lng, zoom]);

  // Generate 3x3 surrounding tile grid coordinates
  const tiles = useMemo(() => {
    const list = [];
    const maxIndex = Math.pow(2, zoom);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const curX = (tileX + dx + maxIndex) % maxIndex;
        const curY = tileY + dy;
        if (curY >= 0 && curY < maxIndex) {
          list.push({
            dx,
            dy,
            url: `https://basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${curX}/${curY}@2x.png`,
            key: `${zoom}-${curX}-${curY}`,
          });
        }
      }
    }
    return list;
  }, [tileX, tileY, zoom]);

  // Convert lat/lng delta to viewport pixels based on zoom level
  const geoToPixel = useCallback(
    (targetLat: number, targetLng: number) => {
      // Approximate Mercator meters per degree at this latitude
      const latScale = Math.cos((lat * Math.PI) / 180);
      const pxPerDegLng = (256 * Math.pow(2, zoom)) / 360;
      const pxPerDegLat = pxPerDegLng * latScale;

      const pxX = (targetLng - lng) * pxPerDegLng;
      const pxY = -(targetLat - lat) * pxPerDegLat;

      return { x: pxX, y: pxY };
    },
    [lat, lng, zoom]
  );

  return (
    <div
      id="mini-station-map-card"
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden transition-all ${
        isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
    >
      {/* Top Header & Visual Coordinates HUD */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${aqiConfig.lightBg} ${aqiConfig.textColor} ${aqiConfig.borderColor}`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold font-display text-slate-900">
                Interactive Station Geospatial Pin
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Live GPS Lock
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{station.name}</span>
              <span>•</span>
              <strong className="text-slate-700 font-mono">{formattedCoords.decimal}</strong>
              <span className="text-slate-400">({formattedCoords.gridCode})</span>
            </p>
          </div>
        </div>

        {/* Map Header Action Toolbar */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {/* Layer switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveLayer('hybrid')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'hybrid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cartographic tiles with atmospheric heatmap overlay"
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveLayer('radar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'radar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="High-contrast dark sensory radar grid"
            >
              Radar Grid
            </button>
            <button
              onClick={() => setActiveLayer('terrain')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeLayer === 'terrain'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Clean topology cartography"
            >
              Clean
            </button>
          </div>

          {/* Toggle Crosshairs */}
          <button
            onClick={() => setShowCrosshairs((v) => !v)}
            id="map-toggle-crosshair-btn"
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
              showCrosshairs
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={showCrosshairs ? 'Hide coordinates crosshairs' : 'Show coordinates crosshairs'}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Fullscreen / Expand */}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            id="map-toggle-expand-btn"
            className="p-2 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            title={isExpanded ? 'Collapse map' : 'Expand full map'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Interactive Viewport Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full overflow-hidden select-none bg-slate-950 ${
          isExpanded ? 'h-[calc(100vh-180px)]' : 'h-80 sm:h-96'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Raster Tile Container (Centered on Station + Pan Offset) */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            activeLayer === 'radar' ? 'opacity-15 invert hue-rotate-180' : 'opacity-90'
          }`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={tile.url}
              alt="Map Tile"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute w-[256px] h-[256px] object-cover pointer-events-none"
              style={{
                left: `calc(50% + ${tile.dx * 256 - centerOffsetX}px)`,
                top: `calc(50% + ${tile.dy * 256 - centerOffsetY}px)`,
              }}
              onError={(e) => {
                // Graceful fallback to hide broken image icon and reveal SVG cartographic grid
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ))}
        </div>

        {/* Procedural Vector Cartography & Coordinate Lines Fallback/Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="coordGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#64748b" strokeWidth="0.4" opacity="0.25" />
            </pattern>
            {/* Heatmap Radial Dispersion Gradient */}
            <radialGradient id="aqiAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={aqiConfig.hex} stopOpacity="0.55" />
              <stop offset="45%" stopColor={aqiConfig.hex} stopOpacity="0.25" />
              <stop offset="85%" stopColor={aqiConfig.hex} stopOpacity="0.08" />
              <stop offset="100%" stopColor={aqiConfig.hex} stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Coordinate Grid Lines */}
          <rect width="100%" height="100%" fill="url(#coordGrid)" />

          {/* Centered Dynamic Atmospheric Heatmap & Dispersion Radius Rings */}
          <g
            style={{
              transform: `translate(calc(50% + ${panOffset.x}px), calc(50% + ${panOffset.y}px))`,
            }}
          >
            {/* Heatmap Dispersion Glow */}
            {activeLayer === 'hybrid' && (
              <circle cx="0" cy="0" r={Math.min(180, 70 + zoom * 7)} fill="url(#aqiAura)" />
            )}

            {/* Dispersion Radius Circles */}
            {showRadiusRings && (
              <>
                {/* 3 km Primary Impact Zone */}
                <circle
                  cx="0"
                  cy="0"
                  r="55"
                  fill="none"
                  stroke={aqiConfig.hex}
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />
                <text x="60" y="-8" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">
                  3 km Primary Zone
                </text>

                {/* 8 km Atmospheric Mixing Boundary */}
                <circle
                  cx="0"
                  cy="0"
                  r="115"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="0.8"
                  strokeDasharray="3 4"
                  opacity="0.4"
                />
                <text x="120" y="-8" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="monospace">
                  8 km Boundary
                </text>

                {/* Radar Sweep Animation (when in radar mode) */}
                {activeLayer === 'radar' && (
                  <line
                    x1="0"
                    y1="0"
                    x2="115"
                    y2="115"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="animate-spin origin-center"
                    style={{ animationDuration: '4s' }}
                  />
                )}
              </>
            )}

            {/* Coordinate Crosshairs */}
            {showCrosshairs && (
              <g opacity="0.65">
                <line x1="-1000" y1="0" x2="1000" y2="0" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1="-1000" x2="0" y2="1000" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
                <circle cx="0" cy="0" r="3" fill="#38bdf8" />
              </g>
            )}
          </g>
        </svg>

        {/* Nearby Regional Monitoring Nodes Pins */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {nearbyNodes.map((node) => {
            const pos = geoToPixel(node.coordinates[0], node.coordinates[1]);
            const nodeConfig = getAQIColorConfig(node.aqi);

            return (
              <div
                key={node.id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNodePopup(node);
                }}
              >
                {/* Micro Pin Marker */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1 transition-transform group-hover:scale-110 ${nodeConfig.bgColor} border border-white/80`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>{node.aqi}</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 border border-white rounded-full mt-0.5"></div>
                  <span className="text-[9px] font-semibold text-slate-800 bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded mt-0.5 shadow-2xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRIMARY STATION PIN (Anchored at exact center, modified by panOffset) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-20 group"
          style={{
            transform: `translate(calc(-50% + ${panOffset.x}px), calc(-50% + ${panOffset.y}px))`,
          }}
          onClick={() => setShowPinTooltip((v) => !v)}
        >
          {/* Animated Glowing Pulse Radar Rings */}
          <div className="relative flex items-center justify-center">
            <span
              className="absolute w-14 h-14 rounded-full opacity-40 animate-ping"
              style={{ backgroundColor: aqiConfig.hex }}
            ></span>
            <span
              className="absolute w-10 h-10 rounded-full opacity-60 animate-pulse"
              style={{ backgroundColor: aqiConfig.hex }}
            ></span>

            {/* Visual Station Pin Badge */}
            <div
              className={`relative z-10 px-3 py-1 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 ${aqiConfig.bgColor} text-white font-bold text-xs transition-transform transform group-hover:scale-110`}
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <div className="flex items-center gap-1">
                <span className="font-extrabold">{station.aqi}</span>
                <span className="text-[10px] opacity-90 uppercase">AQI</span>
              </div>
            </div>

            {/* Pin Pointer Stem */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-white"></div>
          </div>

          {/* Primary Station Pin Hover Tooltip Card */}
          {showPinTooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                <div>
                  <div className="font-bold text-sm text-slate-100">{station.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{station.location}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPinTooltip(false);
                  }}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2.5 text-[11px]">
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Current Index</span>
                  <span className="font-bold text-slate-100">
                    {station.aqi} • {aqiCategory}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Dominant Hazard</span>
                  <span className="font-bold text-slate-100">{station.dominantPollutant}</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 font-mono pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lat/Lng:</span>
                  <span className="text-emerald-400 font-bold">{formattedCoords.decimal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DMS:</span>
                  <span>{formattedCoords.dms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elevation:</span>
                  <span>~{formattedCoords.elevationMeters}m MSL</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Nearby Node Popup Card (when user clicks a nearby node) */}
        {activeNodePopup && (
          <div className="absolute top-4 left-4 z-30 max-w-xs bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{activeNodePopup.name}</span>
              </div>
              <button
                onClick={() => setActiveNodePopup(null)}
                className="text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                ✕
              </button>
            </div>
            <div className="my-2 space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Distance from Station:</span>
                <strong className="text-slate-900">
                  {activeNodePopup.distanceKm} km ({activeNodePopup.direction})
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Observed AQI:</span>
                <span
                  className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                    getAQIColorConfig(activeNodePopup.aqi).lightBg
                  } ${getAQIColorConfig(activeNodePopup.aqi).textColor}`}
                >
                  {activeNodePopup.aqi} ({getAQICategory(activeNodePopup.aqi)})
                </span>
              </div>
              <div className="flex justify-between text-mono">
                <span>Coordinates:</span>
                <span className="font-mono text-[11px]">
                  {activeNodePopup.coordinates[0].toFixed(4)}°N, {Math.abs(activeNodePopup.coordinates[1]).toFixed(4)}°W
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Regional sensor node feeding localized perimeter dispersion telemetry.
            </p>
          </div>
        )}

        {/* Map Control Buttons Overlay (Top Right: Zoom & Recenter) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            id="map-zoom-in-btn"
            className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            id="map-zoom-out-btn"
            className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            id="map-recenter-btn"
            className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Recenter on primary station pin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Compass & North Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1.5 rounded-xl text-[11px] border border-slate-700/60 shadow-md font-mono">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>N 0°</span>
          <span className="text-slate-400">|</span>
          <span>Zoom {zoom}x</span>
        </div>

        {/* Live Coordinates HUD Floating Bar (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs border border-slate-700/80 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono text-[11px] text-emerald-300 font-bold">
            {formattedCoords.decimal}
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">
            ({formattedCoords.dms})
          </span>
        </div>
      </div>

      {/* Map Card Footer Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Station Pin: {station.name}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Type: <strong>{station.type} Monitoring Node</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Elevation: <strong>~{formattedCoords.elevationMeters}m MSL</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRadiusRings((v) => !v)}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-medium underline"
          >
            {showRadiusRings ? 'Hide radius rings' : 'Show radius rings'}
          </button>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-400">
            Drag to pan • Scroll or buttons to zoom
          </span>
        </div>
      </div>
    </div>
  );
};
