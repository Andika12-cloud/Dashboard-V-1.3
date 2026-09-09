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
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between transition-all font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Peringkat Realisasi Pajak
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Perbandingan Sektor Terbesar ke Terkecil
            </p>
          </div>
        </div>

        {/* Sort Metric Selector */}
        <div className="flex items-center p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSortBy('realisasi')}
            className={`
              px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer
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
              px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer
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
      <div className="my-3 space-y-3 max-h-[480px] overflow-y-auto pr-1">
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
                group p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden
                ${isHovered 
                  ? 'bg-slate-50 border-slate-300 shadow-sm' 
                  : 'bg-white hover:bg-slate-50/60 border-slate-200'}
              `}
            >
              {/* Row Header: Rank, Name, Values */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Rank Badge */}
                  <span className={`
                    w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 tabular-nums
                    ${index === 0 
                      ? 'bg-[#1E293B] text-white' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'}
                  `}>
                    {index + 1}
                  </span>

                  <div className="truncate">
                    <p className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#1E293B] transition-colors truncate">
                      {item.jenisPajak}
                    </p>
                    <p className="text-xs text-slate-500 font-normal tabular-nums">
                      Target: {formatRupiahShort(item.targetTahun)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Realisasi Value & Percentage Pill */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 block tabular-nums">
                      {formatRupiahShort(item.realisasiTahun)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal hidden sm:inline tabular-nums">
                      {item.kontribusiPersen}% total
                    </span>
                  </div>

                  <span className={`
                    text-xs font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1 tabular-nums
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
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
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
                  <span className="text-slate-500">Nominal Realisasi Utuh:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(item.realisasiTahun)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart Footer Summary */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Klik salah satu baris untuk rincian triwulan</span>
        </div>
        <span className="font-semibold text-slate-900 tabular-nums">
          Total: {formatRupiahShort(SUMMARY_TOTALS.totalKeseluruhan.realisasiTahun)}
        </span>
      </div>
    </div>
  );
};
