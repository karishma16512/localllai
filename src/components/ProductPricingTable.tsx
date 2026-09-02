import React from 'react';
import {
  Tag,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ProductPricingItem } from '../types';
import { formatINR } from '../utils/calculator';

interface ProductPricingTableProps {
  pricingItems: ProductPricingItem[];
  businessType: 'dairy' | 'grocery';
}

export default function ProductPricingTable({ pricingItems, businessType }: ProductPricingTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Micro-Market Value
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            <span>Product Pricing & Gross Margin Economics</span>
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Benchmarked local rural wholesale vs retail rates
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3.5">Product SKU / Offering</th>
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3 text-right">Wholesale Cost</th>
              <th className="py-3 px-3 text-right">Retail Selling Price</th>
              <th className="py-3 px-3 text-right">Gross Margin</th>
              <th className="py-3 px-3 text-center">Demand Trend</th>
              <th className="py-3 px-3 text-right">Est. Daily Turnover</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {pricingItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{item.name}</span>
                </td>
                <td className="py-3 px-3 text-slate-500 font-semibold">{item.unit}</td>
                <td className="py-3 px-3 text-right text-slate-600">{formatINR(item.wholesaleCost)}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">{formatINR(item.retailMarketPrice)}</td>
                <td className="py-3 px-3 text-right font-extrabold text-emerald-700">
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 inline-block font-bold">
                    {item.grossMarginPct.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.demandTrend === 'High'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.demandTrend === 'Growing'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <ArrowUpRight className="w-3 h-3" />
                    {item.demandTrend}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-700">
                  {item.dailySalesVol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
