import { useState } from 'react';
import {
  MapPin,
  Compass,
  Building
} from 'lucide-react';
import { LocationData, BusinessType, CompetitorPoint } from '../types';

interface CompetitorMapProps {
  location: LocationData;
  businessType: BusinessType;
}

export default function CompetitorMap({ location, businessType }: CompetitorMapProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'competitor' | 'cooperative_hub' | 'anchor_demand' | 'unserved_hamlet'>('all');

  const points: CompetitorPoint[] = businessType === 'dairy' ? location.dairyCompetitors : location.groceryCompetitors;

  const filteredPoints = points.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  // Calculate pixel coordinates on SVG canvas (500 x 500)
  // Center is at (250, 250), max radius is 10 km (scaled to ~210px)
  const maxRadiusKm = 10;
  const svgCenter = 250;
  const svgRadius = 210;

  const getPointCoords = (point: CompetitorPoint) => {
    const distPx = (point.distanceKm / maxRadiusKm) * svgRadius;
    const rad = ((point.directionAngleDeg - 90) * Math.PI) / 180;
    const x = svgCenter + distPx * Math.cos(rad);
    const y = svgCenter + distPx * Math.sin(rad);
    return { x, y };
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case 'competitor':
        return { bg: 'bg-rose-500', text: 'text-rose-500', fill: '#f43f5e', border: 'border-rose-600' };
      case 'cooperative_hub':
        return { bg: 'bg-blue-500', text: 'text-blue-500', fill: '#3b82f6', border: 'border-blue-600' };
      case 'anchor_demand':
        return { bg: 'bg-emerald-500', text: 'text-emerald-500', fill: '#10b981', border: 'border-emerald-600' };
      case 'unserved_hamlet':
        return { bg: 'bg-purple-500', text: 'text-purple-500', fill: '#a855f7', border: 'border-purple-600' };
      default:
        return { bg: 'bg-slate-500', text: 'text-slate-500', fill: '#64748b', border: 'border-slate-600' };
    }
  };

  const isDairy = businessType === 'dairy';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Spatial Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">5–10 km Catchment</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Hyper-Local Competitor & Catchment Map</span>
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({points.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('competitor')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeFilter === 'competitor' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Competitors
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('anchor_demand')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeFilter === 'anchor_demand' ? 'bg-white text-emerald-600 shadow-xs font-bold' : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Demand Hubs
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('unserved_hamlet')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              activeFilter === 'unserved_hamlet' ? 'bg-white text-purple-600 shadow-xs font-bold' : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            Unserved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Spatial Radar Canvas */}
        <div className="lg:col-span-7 flex justify-center relative bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          <svg viewBox="0 0 500 500" className="w-full max-w-[440px] aspect-square select-none">
            {/* Range Rings */}
            {/* 10 km Outer */}
            <circle cx={svgCenter} cy={svgCenter} r={svgRadius} fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* 7.5 km */}
            <circle cx={svgCenter} cy={svgCenter} r={svgRadius * 0.75} fill="rgba(16, 185, 129, 0.03)" stroke="#475569" strokeWidth="1.5" />
            {/* 5 km Market Reach */}
            <circle cx={svgCenter} cy={svgCenter} r={svgRadius * 0.5} fill="rgba(16, 185, 129, 0.07)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* 2.5 km Core */}
            <circle cx={svgCenter} cy={svgCenter} r={svgRadius * 0.25} fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1.5" />

            {/* Radar Crosshairs */}
            <line x1={svgCenter} y1={20} x2={svgCenter} y2={480} stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />
            <line x1={20} y1={svgCenter} x2={480} y2={svgCenter} stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />

            {/* Ring Distance Labels */}
            <text x={svgCenter + 6} y={svgCenter - svgRadius * 0.25 + 12} fill="#94a3b8" fontSize="10" fontWeight="600">2.5 km</text>
            <text x={svgCenter + 6} y={svgCenter - svgRadius * 0.5 + 12} fill="#10b981" fontSize="10" fontWeight="bold">5.0 km (Primary)</text>
            <text x={svgCenter + 6} y={svgCenter - svgRadius * 0.75 + 12} fill="#94a3b8" fontSize="10" fontWeight="600">7.5 km</text>
            <text x={svgCenter + 6} y={svgCenter - svgRadius + 14} fill="#64748b" fontSize="10" fontWeight="600">10 km (Outer)</text>

            {/* Cardinal Directions */}
            <text x={svgCenter} y={16} fill="#64748b" textAnchor="middle" fontSize="11" fontWeight="bold">N</text>
            <text x={488} y={svgCenter + 4} fill="#64748b" textAnchor="middle" fontSize="11" fontWeight="bold">E</text>
            <text x={svgCenter} y={496} fill="#64748b" textAnchor="middle" fontSize="11" fontWeight="bold">S</text>
            <text x={10} y={svgCenter + 4} fill="#64748b" textAnchor="middle" fontSize="11" fontWeight="bold">W</text>

            {/* Competitor / Demand Point Connectors */}
            {filteredPoints.map((pt) => {
              const { x, y } = getPointCoords(pt);
              return (
                <g key={`line-${pt.id}`}>
                  <line
                    x1={svgCenter}
                    y1={svgCenter}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                </g>
              );
            })}

            {/* Proposed Business Center Pin */}
            <g transform={`translate(${svgCenter}, ${svgCenter})`}>
              <circle r="22" fill="rgba(16, 185, 129, 0.25)" className="animate-ping origin-center" />
              <circle r="14" fill="#047857" stroke="#34d399" strokeWidth="2.5" />
              <text y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">★</text>
              <text y="28" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
                {location.name} (Proposed Unit)
              </text>
            </g>

            {/* Render Map Data Points */}
            {filteredPoints.map((pt) => {
              const { x, y } = getPointCoords(pt);
              const color = getPointColor(pt.type);

              return (
                <g
                  key={pt.id}
                  transform={`translate(${x}, ${y})`}
                >
                  {/* Marker Pin Circle */}
                  <circle
                    r="9"
                    fill={color.fill}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="shadow-md"
                  />

                  {/* Compact Point Identifier Label */}
                  <text
                    y={-14}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="9"
                    fontWeight="600"
                    className="bg-slate-900"
                  >
                    {pt.name.length > 18 ? `${pt.name.substring(0, 16)}...` : pt.name}
                  </text>
                  <text
                    y={22}
                    textAnchor="middle"
                    fill={color.fill}
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {pt.distanceKm} km
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Compass Badge */}
          <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[11px] text-slate-300">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPS: {location.centerCoords.lat}° N, {location.centerCoords.lng}° E</span>
          </div>
        </div>

        {/* Side Panel: Catchment Indicators & Location Intelligence */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Catchment Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold uppercase text-emerald-800 block">Market Catchment</span>
              <span className="text-xl font-extrabold text-emerald-950 block mt-0.5">
                {location.marketReachKm} km Radius
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">5–10 km coverage perimeter</span>
            </div>

            <div className="bg-sky-50/80 border border-sky-200 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold uppercase text-sky-800 block">Nearby Population</span>
              <span className="text-xl font-extrabold text-sky-950 block mt-0.5">
                {location.nearbyPopulation.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-sky-700 font-medium">{location.totalHouseholds.toLocaleString('en-IN')} Households</span>
            </div>

            <div className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold uppercase text-rose-800 block">Direct Competitors</span>
              <span className="text-xl font-extrabold text-rose-950 block mt-0.5">
                {isDairy ? location.dairyCompetitorCount : location.groceryCompetitorCount} Units
              </span>
              <span className="text-[10px] text-rose-700 font-medium">Within 5 km primary radius</span>
            </div>

            <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold uppercase text-purple-800 block">Daily Target Volume</span>
              <span className="text-base font-extrabold text-purple-950 block mt-1">
                {isDairy ? `${location.dairyDemandLpd} L / Day` : `₹${(location.groceryDailySpendEstimate / 1000).toFixed(0)}k / Day`}
              </span>
              <span className="text-[10px] text-purple-700 font-medium">Catchment consumption capacity</span>
            </div>
          </div>

          {/* Demographic & Economic Profile Overview */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Catchment Demographics</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                {location.regionType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Avg. Household Income</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{location.avgMonthlyHouseholdIncome.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Administrative Unit</span>
                <span className="font-bold text-slate-900 text-xs truncate block" title={`${location.block}, ${location.district}`}>
                  {location.block || location.district}
                </span>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-600 font-medium border-t border-slate-200">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Proposed Unit
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Competitor
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Co-op Center
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Demand Hub
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Unserved Pocket
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
