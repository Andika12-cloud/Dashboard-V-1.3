import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Coins, 
  BarChart3,
  Flame
} from 'lucide-react';
import { getSummaryTotalsByYear, getTaxDataByYear } from '../data/dummy';
import { SummaryTotals, TaxItem } from '../types';
import { formatRupiah, formatRupiahShort, formatPercentage } from '../utils/formatters';

export interface MetricCardsProps {
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  customSummary?: SummaryTotals;
  customTaxData?: TaxItem[];
  dateRangeLabel?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  selectedYear = 2026,
  customSummary,
  customTaxData,
  dateRangeLabel,
}) => {
  const [_activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Dynamic summary totals & tax items according to selectedYear or custom filtered data
  const summary = useMemo(() => {
    if (customSummary) return customSummary;
    return getSummaryTotalsByYear(selectedYear);
  }, [customSummary, selectedYear]);

  const taxData = useMemo(() => {
    if (customTaxData && customTaxData.length > 0) return customTaxData;
    return getTaxDataByYear(selectedYear);
  }, [customTaxData, selectedYear]);

  // Computed data
  const totalTarget = summary.totalKeseluruhan.targetTahun;
  const totalRealisasi = summary.totalKeseluruhan.realisasiTahun;
  const totalPersen = summary.totalKeseluruhan.persentaseTahun;
  const sisaTarget = Math.max(0, totalTarget - totalRealisasi);

  // Triwulan metrics
  const triwulanPersen = summary.totalKeseluruhan.persentaseTriwulan;

  // Top performers
  const topPajak = useMemo(() => {
    return [...taxData].sort((a, b) => (b.persentaseTriwulan || b.persentaseTahun) - (a.persentaseTriwulan || a.persentaseTahun))[0] || taxData[0];
  }, [taxData]);

  const lowestPajak = useMemo(() => {
    return [...taxData].sort((a, b) => a.persentaseTahun - b.persentaseTahun)[0] || taxData[0];
  }, [taxData]);

  return (
    <div className="space-y-4 font-sans">
      {/* 3 Main Highlighted KPI Cards - Uniform Elegant White Cards with Subtle Top Accent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Penerimaan Tahun (Priority Card with Navy Top Accent) */}
        <div 
          className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
          onMouseEnter={() => setActiveTooltip('tahun')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E293B]" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              {/* Header with Title & Target Chip */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1E293B] flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-tight text-slate-800 truncate">
                    {dateRangeLabel ? `Penerimaan (${dateRangeLabel})` : `Penerimaan ${selectedYear}`}
                  </span>
                </div>

                {/* Target Badge dengan whitespace-nowrap agar tidak terpotong */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80 shrink-0 whitespace-nowrap">
                  <span className="text-slate-500 font-normal">Target:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{formatRupiahShort(totalTarget)}</span>
                </div>
              </div>

              {/* Big Realisasi Amount */}
              <div className="mt-1">
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {formatRupiah(totalRealisasi)}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {formatPercentage(totalPersen)} Tercapai
                  </span>
                  <span className="text-xs text-slate-500 font-normal tabular-nums">
                    Sisa: {formatRupiahShort(sisaTarget)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-normal">
                <span>Progres Realisasi Kas</span>
                <span className="font-semibold text-slate-800 tabular-nums">{totalPersen.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-emerald-600 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(totalPersen, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Penerimaan Bulan */}
        <div 
          className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
          onMouseEnter={() => setActiveTooltip('bulan')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-tight text-slate-800 truncate">
                    Penerimaan {summary.namaBulan}
                  </span>
                </div>

                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 whitespace-nowrap">
                  {selectedYear === 2026 ? 'Bulan Berjalan' : `Tahun ${selectedYear}`}
                </span>
              </div>

              {/* Big Realisasi Bulan */}
              <div className="mt-1">
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {formatRupiah(summary.penerimaanBulanIni)}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                    <Coins className="w-3.5 h-3.5 text-slate-500" />
                    {selectedYear === 2026 ? 'Akumulasi Bulan' : 'Rekapitulasi'}
                  </span>
                  <span className="text-xs text-slate-500 font-normal tabular-nums">
                    Target Bulanan: ~{formatRupiahShort(Math.round(totalTarget / 12))}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional info footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-normal">Status Rekonsiliasi Kas:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sinkron Real-time
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Penerimaan Hari Ini / Rata-Rata */}
        <div 
          className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
          onMouseEnter={() => setActiveTooltip('hari')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-tight text-slate-800 truncate">
                    Penerimaan Harian
                  </span>
                </div>

                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 tabular-nums shrink-0 whitespace-nowrap">
                  {summary.namaHari}
                </span>
              </div>

              {/* Big Realisasi Hari */}
              <div className="mt-1">
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {formatRupiah(summary.penerimaanHariIni)}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    Setoran SSPD
                  </span>
                  <span className="text-xs text-slate-500 font-normal">
                    Kas Masuk
                  </span>
                </div>
              </div>
            </div>

            {/* Additional info footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-normal">Kontributor Utama:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                {topPajak?.shortName || 'PBB-P2'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Soft UI Quick-Info Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Triwulan Snapshot */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-normal text-slate-500 truncate">Capaian Triwulan</p>
              <p className="text-sm font-semibold text-slate-900 tabular-nums">{formatPercentage(triwulanPersen)}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            {triwulanPersen >= 100 ? 'Surplus' : 'Optimal'}
          </span>
        </div>

        {/* Subtotal Pajak Murni */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-normal text-slate-500 truncate">Pajak Murni Daerah</p>
              <p className="text-sm font-semibold text-slate-900 tabular-nums">{formatRupiahShort(summary.subTotalPajakMurni.realisasiTahun)}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 tabular-nums shrink-0">
            {formatPercentage(summary.subTotalPajakMurni.persentaseTahun)}
          </span>
        </div>

        {/* Top Performer */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
              <Flame className="w-4 h-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-normal text-slate-500 truncate">Top Triwulan</p>
              <p className="text-xs font-semibold text-slate-900 truncate">{topPajak.shortName}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums shrink-0">
            {topPajak.persentaseTriwulan.toFixed(1)}%
          </span>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-normal text-slate-500 truncate">Perhatian Khusus</p>
              <p className="text-xs font-semibold text-slate-900 truncate">{lowestPajak.shortName}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 tabular-nums shrink-0">
            {lowestPajak.persentaseTahun.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};