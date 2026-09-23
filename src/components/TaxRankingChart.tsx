'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info
} from 'lucide-react';
import { TAX_DATA, SUMMARY_TOTALS, getTaxDataByYear } from '../data/dummy';
import { formatRupiah, formatRupiahShort, formatPercentage, getPercentageStatus } from '../utils/formatters';
import { TaxItem } from '../types';

interface TaxRankingChartProps {
  data?: TaxItem[];
  selectedYear?: number;
  onSelectTaxItem?: (item: TaxItem) => void;
}

type SortByMode = 'realisasi' | 'persentase' | 'target';

export const TaxRankingChart: React.FC<TaxRankingChartProps> = ({ 
  data,
  selectedYear = 2026,
  onSelectTaxItem 
}) => {
  const [sortBy, setSortBy] = useState<SortByMode>('realisasi');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const activeTaxData = React.useMemo(() => {
    if (data && data.length > 0) return data;
    return getTaxDataByYear(selectedYear);
  }, [data, selectedYear]);

  // Nilai maksimum untuk kalkulasi persentase visual bar
  const maxRealisasi = Math.max(...activeTaxData.map((t) => t.realisasiTahun), 1);

  // Pengurutan data sesuai metrik yang dipilih
  const sortedTaxData = [...activeTaxData].sort((a, b) => {
    if (sortBy === 'realisasi') return b.realisasiTahun - a.realisasiTahun;
    if (sortBy === 'persentase') return b.persentaseTahun - a.persentaseTahun;
    if (sortBy === 'target') return b.targetTahun - a.targetTahun;
    return 0;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between transition-all font-sans w-full min-w-0">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              Peringkat Realisasi Pajak
            </h3>
            <p className="text-[11px] text-slate-500 font-normal truncate">
              Perbandingan Sektor Terbesar ke Terkecil
            </p>
          </div>
        </div>

        {/* Sort Metric Selector */}
        <div className="flex items-center p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSortBy('realisasi')}
            className={`
              px-2 py-1 rounded-lg transition-all text-[11px] cursor-pointer
              ${sortBy === 'realisasi' 
                ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'}
            `}
          >
            Nominal (Rp)
          </button>
          <button
            type="button"
            onClick={() => setSortBy('persentase')}
            className={`
              px-2 py-1 rounded-lg transition-all text-[11px] cursor-pointer
              ${sortBy === 'persentase' 
                ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'}
            `}
          >
            Capaian (%)
          </button>
        </div>
      </div>

      {/* Horizontal Bar Chart List */}
      <div className="my-3 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {sortedTaxData.map((item, index) => {
          const status = getPercentageStatus(item.persentaseTahun);
          const barWidthPercent = (item.realisasiTahun / maxRealisasi) * 100;
          const isHovered = hoveredItemId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTaxItem && onSelectTaxItem(item)}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              className={`
                group p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden
                ${isHovered 
                  ? 'bg-slate-50 border-slate-300 shadow-sm' 
                  : 'bg-white hover:bg-slate-50/60 border-slate-200'}
              `}
            >
              {/* Row Header: Rank, Name, Values */}
              <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Rank Badge */}
                  <span className={`
                    w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-bold shrink-0 tabular-nums
                    ${index === 0 
                      ? 'bg-[#1E293B] text-white' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'}
                  `}>
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-slate-900 group-hover:text-[#1E293B] transition-colors truncate" title={item.jenisPajak}>
                      {item.jenisPajak}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-normal tabular-nums truncate">
                      Target: {formatRupiahShort(item.targetTahun)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Realisasi Value & Percentage Pill */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="text-right">
                    <span className="font-semibold text-xs text-slate-900 block tabular-nums">
                      {formatRupiahShort(item.realisasiTahun)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal block tabular-nums">
                      {item.kontribusiPersen}% total
                    </span>
                  </div>

                  <span className={`
                    text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md sm:rounded-lg border flex items-center gap-1 tabular-nums
                    ${status.badgeClass}
                  `}>
                    {item.persentaseTahun >= 100 ? (
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    ) : item.persentaseTahun >= 70 ? (
                      <TrendingUp className="w-3 h-3 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                    )}
                    <span>{formatPercentage(item.persentaseTahun)}</span>
                  </span>
                </div>
              </div>

              {/* Horizontal Visual Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out bg-[#1E293B]"
                  style={{
                    width: `${Math.min(Math.max(barWidthPercent, 3), 100)}%`,
                  }}
                />
              </div>

              {/* Hover Full Nominal Tooltip Footer */}
              {isHovered && (
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 animate-in fade-in duration-150">
                  <span className="text-slate-500 text-[11px]">Nominal Utuh:</span>
                  <span className="font-semibold text-slate-900 text-[11px] tabular-nums">
                    {formatRupiah(item.realisasiTahun)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart Footer Summary */}
      <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-2 min-w-0">
        <div className="flex items-center gap-1 min-w-0 truncate">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Klik baris untuk detail</span>
        </div>
        <span className="font-semibold text-slate-900 tabular-nums shrink-0">
          Total: {formatRupiahShort(SUMMARY_TOTALS.totalKeseluruhan.realisasiTahun)}
        </span>
      </div>
    </div>
  );
};