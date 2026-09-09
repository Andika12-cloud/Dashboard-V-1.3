'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Calendar, 
  GitCompare, 
  Layers, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight
} from 'lucide-react';
import { YEARLY_REVENUE_HISTORY } from '../data/dummy';
import { formatRupiah, formatRupiahShort, formatPercentage } from '../utils/formatters';

type AggregationMode = 'bulanan' | 'setahun';

export interface TrendRevenueChartProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

export const TrendRevenueChart: React.FC<TrendRevenueChartProps> = ({
  selectedYear: propSelectedYear,
  onYearChange,
}) => {
  // 1. Toggle Mode Tampilan: "Per Bulan" (Jan–Des) atau "Setahun" (Rentang Bebas)
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>('bulanan');

  // 2. Filter untuk Mode "Per Bulan":
  // - Tahun Utama (Default: 2026 atau dari props)
  // - Tahun Pembanding (Default: 2025)
  // Catatan: Hanya komponen grafik ini yang merespons filter periode di Dashboard
  const [internalYear, setInternalYear] = useState<number>(propSelectedYear || 2026);

  // Sinkronisasi internalYear dengan propSelectedYear saat berubah dari filter eksternal
  React.useEffect(() => {
    if (propSelectedYear && propSelectedYear !== internalYear) {
      setInternalYear(propSelectedYear);
    }
  }, [propSelectedYear]);

  const selectedYear = internalYear;
  const [comparisonYear, setComparisonYear] = useState<number | 'none'>(2025);

  // 3. Filter Fleksibel untuk Mode "Setahun":
  // - Rentang "Dari Tahun" s.d. "Sampai Tahun" (Default: 2022 s.d. 2026)
  const [startYear, setStartYear] = useState<number>(2022);
  const [endYear, setEndYear] = useState<number>(2026);

  // Seluruh daftar tahun dari riwayat data 8 tahun lengkap (2019 - 2026)
  const allYearsAsc = useMemo(() => {
    return [...YEARLY_REVENUE_HISTORY]
      .map((y) => y.tahun)
      .sort((a, b) => a - b); // [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
  }, []);

  const allYearsDesc = useMemo(() => {
    return [...allYearsAsc].sort((a, b) => b - a); // [2026, 2025, ...]
  }, [allYearsAsc]);

  // Handler dropdown rentang tahun fleksibel (Mode Setahun)
  const handleStartYearChange = (newStart: number) => {
    setStartYear(newStart);
    if (newStart > endYear) {
      setEndYear(newStart);
    }
  };

  const handleEndYearChange = (newEnd: number) => {
    setEndYear(newEnd);
    if (newEnd < startYear) {
      setStartYear(newEnd);
    }
  };

  // Opsi pembanding untuk mode bulanan: Seluruh tahun selain tahun utama terpilih
  const comparisonOptions = useMemo(() => {
    return allYearsDesc.filter((yr) => yr !== selectedYear);
  }, [allYearsDesc, selectedYear]);

  // Handler pergantian tahun utama (Mode Bulanan)
  // Hanya komponen grafik ini yang merespons filter periode di Dashboard
  const handleYearChange = (newYear: number) => {
    setInternalYear(newYear);
    if (comparisonYear === newYear) {
      const otherYears = allYearsDesc.filter((yr) => yr !== newYear);
      const fallback = otherYears.find((yr) => yr < newYear) || otherYears[0] || 'none';
      setComparisonYear(fallback);
    }
  };

  // Data Tahun Terpilih & Pembanding (Mode Bulanan)
  const currentYearData = useMemo(() => {
    return YEARLY_REVENUE_HISTORY.find((item) => item.tahun === selectedYear) || YEARLY_REVENUE_HISTORY[YEARLY_REVENUE_HISTORY.length - 1];
  }, [selectedYear]);

  const compYearData = useMemo(() => {
    if (comparisonYear === 'none') return null;
    return YEARLY_REVENUE_HISTORY.find((item) => item.tahun === comparisonYear) || null;
  }, [comparisonYear]);

  // Data Rentang Terpilih (Mode Setahun)
  const filteredYearlyData = useMemo(() => {
    const minYr = Math.min(startYear, endYear);
    const maxYr = Math.max(startYear, endYear);
    return YEARLY_REVENUE_HISTORY
      .filter((item) => item.tahun >= minYr && item.tahun <= maxYr)
      .sort((a, b) => a.tahun - b.tahun);
  }, [startYear, endYear]);

  // Kalkulasi Metrik Finansial Ticker
  const tickerStats = useMemo(() => {
    if (aggregationMode === 'setahun') {
      const totalRealisasi = filteredYearlyData.reduce((acc, curr) => acc + curr.realisasiTahun, 0);
      const totalTarget = filteredYearlyData.reduce((acc, curr) => acc + curr.targetTahun, 0);
      const avgPencapaian = totalTarget > 0 ? (totalRealisasi / totalTarget) * 100 : 0;
      const latestYearItem = filteredYearlyData[filteredYearlyData.length - 1] || filteredYearlyData[0];

      return {
        title: `AKUMULASI REALISASI (TA ${startYear}–${endYear})`,
        realisasi: totalRealisasi,
        target: totalTarget,
        pencapaian: avgPencapaian,
        latestYear: latestYearItem ? latestYearItem.tahun : endYear,
        hasComparison: false,
        growthPercent: 0,
      };
    }

    // Mode Bulanan
    const realisasi = currentYearData.realisasiTahun;
    const target = currentYearData.targetTahun;
    const pencapaian = currentYearData.persentaseTahun;

    let growthNominal = 0;
    let growthPercent = 0;
    let hasComparison = false;

    if (compYearData) {
      hasComparison = true;
      if (selectedYear === 2026 && compYearData.tahun < 2026) {
        const curr8M = currentYearData.bulanan.slice(0, 8).reduce((acc, m) => acc + m.realisasi, 0);
        const comp8M = compYearData.bulanan.slice(0, 8).reduce((acc, m) => acc + m.realisasi, 0);
        growthNominal = curr8M - comp8M;
        growthPercent = comp8M > 0 ? ((curr8M - comp8M) / comp8M) * 100 : 0;
      } else {
        growthNominal = realisasi - compYearData.realisasiTahun;
        growthPercent = compYearData.realisasiTahun > 0 
          ? ((realisasi - compYearData.realisasiTahun) / compYearData.realisasiTahun) * 100 
          : 0;
      }
    }

    return {
      title: `TOTAL REALISASI KAS TA ${selectedYear}`,
      realisasi,
      target,
      pencapaian,
      latestYear: selectedYear,
      hasComparison,
      growthPercent,
    };
  }, [aggregationMode, filteredYearlyData, startYear, endYear, currentYearData, compYearData, selectedYear]);

  // Dataset untuk LineChart Recharts
  const chartData = useMemo(() => {
    // MODE 1: PER BULAN (12 Bulan Jan–Des)
    if (aggregationMode === 'bulanan') {
      return currentYearData.bulanan.map((m, idx) => {
        const compMonth = compYearData ? compYearData.bulanan[idx] : null;
        const isFutureSelected = selectedYear === 2026 && idx >= 8;
        const compVal = compMonth ? (typeof compMonth.realisasi === 'number' ? compMonth.realisasi : 0) : 0;

        return {
          name: m.bulan, // Sumbu X: Jan, Feb, Mar, Apr, Mei, Jun, Jul, Ags, Sep, Okt, Nov, Des
          fullName: `${m.namaBulan} ${selectedYear}`,
          realisasi: isFutureSelected ? null : m.realisasi,
          target: m.target,
          compRealisasi: compVal,
          pencapaian: isFutureSelected ? 0 : m.pencapaian,
          selisih: (isFutureSelected || m.realisasi === 0) ? 0 : (m.realisasi - m.target),
          keterangan: m.keterangan,
        };
      });
    }

    // MODE 2: SETAHUN (Rentang Dinamis Pilihan Pengguna, misal 2022 s.d. 2026)
    return filteredYearlyData.map((item) => ({
      name: item.tahun.toString(), // Sumbu X: Titik tahun dalam rentang yang dipilih
      fullName: `Tahun Anggaran ${item.tahun}`,
      realisasi: item.realisasiTahun,
      target: item.targetTahun,
      compRealisasi: 0,
      pencapaian: item.persentaseTahun,
      selisih: item.realisasiTahun - item.targetTahun,
      keterangan: item.statusCatatan,
    }));
  }, [aggregationMode, currentYearData, compYearData, selectedYear, filteredYearlyData]);

  // Formatter Sumbu Y Ringkas & Presisi (contoh: "Rp 150 M" atau "Rp 1,2 T")
  const formatYAxis = (v: number): string => {
    if (v === 0) return 'Rp 0';
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000_000) {
      const num = (v / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
      return `Rp ${num} T`;
    }
    if (abs >= 1_000_000_000) {
      const num = (v / 1_000_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
      return `Rp ${num} M`;
    }
    if (abs >= 1_000_000) {
      const num = (v / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',');
      return `Rp ${num} Jt`;
    }
    return formatRupiahShort(v);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm font-sans transition-all">
      {/* 1. Header Toolbar Ringkas & Badge Riwayat Fleksibel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Activity className="w-4 h-4 text-emerald-600" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Tren Penerimaan Pajak Daerah
              </h2>
            </div>

            {/* Badge Status Fleksibel */}
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {aggregationMode === 'setahun' 
                ? `Rentang TA ${startYear}–${endYear} (${filteredYearlyData.length} Tahun)`
                : `Mode Bulanan TA ${selectedYear}`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {aggregationMode === 'bulanan'
              ? `Visualisasi grafik garis realisasi bulanan TA ${selectedYear} Kota Cimahi.`
              : `Pertumbuhan Realisasi Kas Tahunan vs Target APBD pada rentang tahun pilihan (TA ${startYear}–${endYear}).`}
          </p>
        </div>

        {/* 2. Controls Toolbar: Dinamis Sesuai Mode Pilihan */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* KONDISI A: KONTROL MODE SETAHUN (Dropdown "Dari Tahun" dan "Sampai Tahun") */}
          {aggregationMode === 'setahun' && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 pl-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Rentang:</span>
              </span>

              {/* Dropdown "Dari Tahun" (2019 s.d. 2026) */}
              <select
                value={startYear}
                onChange={(e) => handleStartYearChange(Number(e.target.value))}
                aria-label="Pilih Dari Tahun"
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1E293B] cursor-pointer"
              >
                {allYearsAsc.map((yr) => (
                  <option key={`start-${yr}`} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>

              <ArrowRight className="w-3 h-3 text-slate-400" />

              {/* Dropdown "Sampai Tahun" (2019 s.d. 2026) */}
              <select
                value={endYear}
                onChange={(e) => handleEndYearChange(Number(e.target.value))}
                aria-label="Pilih Sampai Tahun"
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1E293B] cursor-pointer"
              >
                {allYearsAsc.map((yr) => (
                  <option key={`end-${yr}`} value={yr}>
                    {yr} {yr === 2026 ? '(Aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* KONDISI B: KONTROL MODE PER BULAN (Dropdown "Tahun Utama" & "Bandingkan") */}
          {aggregationMode === 'bulanan' && (
            <>
              {/* Dropdown Filter Tahun Utama (2019–2026) */}
              <div className="inline-flex w-auto items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 pl-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Tahun Utama:</span>
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  aria-label="Pilih Tahun Anggaran Utama"
                  className="w-28 min-w-[100px] max-w-[130px] bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#1E293B] cursor-pointer"
                >
                  {allYearsDesc.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Filter Pembanding (Opsi Bebas Semua Tahun Lain 2019–2026) */}
              <div className="inline-flex w-auto items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 pl-1.5 flex items-center gap-1">
                  <GitCompare className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Bandingkan:</span>
                </span>
                <select
                  value={comparisonYear}
                  onChange={(e) => setComparisonYear(e.target.value === 'none' ? 'none' : Number(e.target.value))}
                  aria-label="Pilih Tahun Pembanding"
                  className="w-28 min-w-[100px] max-w-[130px] bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E293B] cursor-pointer"
                >
                  <option value="none">Tanpa Pembanding</option>
                  {comparisonOptions.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Toggle Mode: "Per Bulan" / "Setahun" */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setAggregationMode('bulanan')}
              className={`
                px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs
                ${aggregationMode === 'bulanan' 
                  ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              <Calendar className="w-3 h-3" />
              <span>Per Bulan</span>
            </button>

            <button
              type="button"
              onClick={() => setAggregationMode('setahun')}
              className={`
                px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs
                ${aggregationMode === 'setahun' 
                  ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              <Layers className="w-3 h-3" />
              <span>Setahun</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Ticker Bar Ringkas Khas Terminal Keuangan */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 my-1 border-b border-slate-100">
        <div className="flex items-baseline gap-3 flex-wrap">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              {tickerStats.title}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {formatRupiah(tickerStats.realisasi)}
            </span>
          </div>

          {/* Badge Capaian / Pertumbuhan */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatPercentage(tickerStats.pencapaian)} {aggregationMode === 'setahun' ? 'Rata-rata Capaian' : 'Capaian'}</span>
            </span>

            {aggregationMode === 'bulanan' && tickerStats.hasComparison && compYearData && (
              <span className={`
                inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg border
                ${tickerStats.growthPercent >= 0 
                  ? 'bg-sky-50 text-sky-700 border-sky-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'}
              `}>
                {tickerStats.growthPercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  {tickerStats.growthPercent >= 0 ? '+' : ''}
                  {formatPercentage(tickerStats.growthPercent)} vs {compYearData.tahun}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            {aggregationMode === 'setahun' ? `Total Target APBD (${startYear}–${endYear})` : `Target APBD TA ${selectedYear}`}
          </span>
          <span className="text-sm font-bold text-amber-600 tabular-nums">
            {formatRupiah(tickerStats.target)}
          </span>
        </div>
      </div>

      {/* 4. Visualisasi Grafik Garis (LineChart Recharts) */}
      <div className="w-full h-[380px] min-h-[360px] mt-2 relative">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart 
            data={chartData} 
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            {/* Grid Minimalis */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9" 
            />

            {/* Sumbu X: Dinamis (12 Bulan Jan–Des ATAU Rentang Tahun Pilihan Pengguna) */}
            <XAxis 
              dataKey="name" 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
              tick={{ 
                fill: '#64748b', 
                fontSize: 12, 
                fontWeight: 600, 
                fontFamily: "'Plus Jakarta Sans', sans-serif" 
              }}
              dy={6}
            />

            {/* Sumbu Y: Lebar width={80} agar angka Rupiah tidak terpotong */}
            <YAxis 
              width={80}
              axisLine={false} 
              tickLine={false} 
              tick={{ 
                fill: '#64748b', 
                fontSize: 11, 
                fontWeight: 500, 
                fontFamily: "'Plus Jakarta Sans', sans-serif" 
              }}
              tickFormatter={formatYAxis}
            />

            {/* Tooltip Interaktif Lengkap Format Rupiah */}
            <Tooltip
              cursor={{ 
                stroke: '#94a3b8', 
                strokeWidth: 1.5, 
                strokeDasharray: '4 4' 
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataItem = chartData.find((d) => d.name === label);
                  if (!dataItem) return null;

                  const realisasiUtama = typeof dataItem.realisasi === 'number' ? dataItem.realisasi : 0;
                  const realisasiComp = typeof dataItem.compRealisasi === 'number' ? dataItem.compRealisasi : 0;
                  const targetVal = typeof dataItem.target === 'number' ? dataItem.target : 0;
                  const selisih = dataItem.selisih ?? (realisasiUtama - targetVal);

                  // MODE 1: SETAHUN (RENTANG FLEKSIBEL)
                  if (aggregationMode === 'setahun') {
                    return (
                      <div className="bg-slate-950/95 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs backdrop-blur-md min-w-[275px] font-sans">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                            <span className="font-bold text-slate-100 text-sm">
                              Tahun Anggaran {label}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                            {formatPercentage(dataItem.pencapaian)} Capaian
                          </span>
                        </div>

                        <div className="space-y-2">
                          {/* 1. Realisasi Tahunan */}
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-emerald-400/40" />
                              <span>Realisasi Kas Tahunan:</span>
                            </span>
                            <span className="font-bold text-white tabular-nums tracking-tight">
                              {formatRupiah(realisasiUtama)}
                            </span>
                          </div>

                          {/* 2. Target APBD Tahunan */}
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                              <span className="w-2.5 h-0.5 bg-amber-400" />
                              <span>Target APBD Tahunan:</span>
                            </span>
                            <span className="font-semibold text-amber-300 tabular-nums">
                              {formatRupiah(targetVal)}
                            </span>
                          </div>

                          {/* 3. Selisih / Deviasi Fiskal */}
                          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-800/80 text-[11px]">
                            <span className="text-slate-400 font-medium">
                              {selisih >= 0 ? 'Surplus / Lebih Target:' : 'Defisit / Kurang:'}
                            </span>
                            <span className={`font-semibold tabular-nums ${selisih >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {selisih >= 0 ? '+' : ''}{formatRupiah(selisih)}
                            </span>
                          </div>

                          {/* Catatan Fiskal */}
                          {dataItem.keterangan && (
                            <p className="text-[11px] text-slate-400 pt-1 italic border-t border-slate-800/50 mt-1">
                              {dataItem.keterangan}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // MODE 2: PER BULAN (JAN–DES)
                  return (
                    <div className="bg-slate-950/95 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs backdrop-blur-md min-w-[260px] font-sans">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                          <span className="font-bold text-slate-100 text-sm">
                            {dataItem.fullName || label}
                          </span>
                        </div>
                        {dataItem.pencapaian !== null && dataItem.pencapaian !== undefined && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                            {formatPercentage(dataItem.pencapaian)}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* Realisasi Utama */}
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-emerald-400/40" />
                            <span>Realisasi {selectedYear}:</span>
                          </span>
                          <span className="font-bold text-white tabular-nums tracking-tight">
                            {dataItem.realisasi === null && selectedYear === 2026
                              ? 'Rp 0'
                              : formatRupiah(realisasiUtama)}
                          </span>
                        </div>

                        {/* Realisasi Pembanding (Warna Biru Diganti ke Navy/Slate) */}
                        {compYearData && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
                              <span>Realisasi {compYearData.tahun}:</span>
                            </span>
                            <span className="font-semibold text-slate-200 tabular-nums">
                              {formatRupiah(realisasiComp)}
                            </span>
                          </div>
                        )}

                        {/* Target APBD Bulanan */}
                        <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-800/80">
                          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <span className="w-2.5 h-0.5 bg-amber-400" />
                            <span>Target APBD Bulanan:</span>
                          </span>
                          <span className="font-semibold text-amber-300 tabular-nums">
                            {formatRupiah(targetVal)}
                          </span>
                        </div>

                        {/* Catatan Fiskal */}
                        {dataItem.keterangan && (
                          <p className="text-[11px] text-slate-400 pt-1 italic border-t border-slate-800/50 mt-1">
                            {dataItem.keterangan}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="plainline"
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
            />

            {/* GARIS 1: Realisasi Kas Tahun Berjalan (Hijau Emerald Solid - Fokus Utama) */}
            <Line
              type="monotone"
              dataKey="realisasi"
              name={aggregationMode === 'bulanan' ? `Realisasi Kas ${selectedYear}` : 'Realisasi Kas Tahunan'}
              stroke="#059669"
              strokeWidth={3}
              connectNulls={false}
              dot={{ 
                r: 4, 
                fill: '#059669', 
                strokeWidth: 2, 
                stroke: '#ffffff' 
              }}
              activeDot={{ 
                r: 7, 
                fill: '#059669', 
                stroke: '#ffffff', 
                strokeWidth: 3 
              }}
            />

            {/* GARIS 2: Realisasi Pembanding (Navy Slate Putus-Putus) */}
            {aggregationMode === 'bulanan' && compYearData && (
              <Line
                type="monotone"
                dataKey="compRealisasi"
                name={`Realisasi Kas ${compYearData.tahun} (Pembanding)`}
                stroke="#334155"
                strokeWidth={2}
                strokeDasharray="5 5"
                connectNulls={true}
                dot={{ 
                  r: 3.5, 
                  fill: '#334155', 
                  strokeWidth: 1.5, 
                  stroke: '#ffffff' 
                }}
                activeDot={{ 
                  r: 5, 
                  fill: '#334155', 
                  stroke: '#ffffff', 
                  strokeWidth: 2 
                }}
              />
            )}

            {/* GARIS 3: Target APBD (Amber/Kuning Putus-Putus Halus) */}
            <Line
              type="monotone"
              dataKey="target"
              name={aggregationMode === 'bulanan' ? 'Target APBD Bulanan' : 'Target APBD Tahunan'}
              stroke="#D97706"
              strokeWidth={1.5}
              strokeDasharray={aggregationMode === 'bulanan' ? '3 3' : '4 4'}
              dot={aggregationMode === 'setahun' ? { r: 3.5, fill: '#D97706', stroke: '#ffffff', strokeWidth: 1.5 } : false}
              activeDot={{ r: 5, fill: '#D97706' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Footer Legenda & Keterangan */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-1 rounded-full bg-[#1E293B]" />
            <span className="text-[11px] text-slate-700 font-medium">
              {aggregationMode === 'bulanan' ? `Realisasi TA ${selectedYear}` : 'Realisasi Kas Tahunan'}
            </span>
          </div>

          {aggregationMode === 'bulanan' && compYearData && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-1 rounded-full bg-[#94A3B8] border-b border-dashed" />
              <span className="text-[11px] text-slate-700 font-medium">
                Realisasi TA {compYearData.tahun} (Pembanding)
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-1 rounded-full bg-[#0D9488] border-b border-dashed" />
            <span className="text-[11px] text-slate-700 font-medium">
              {aggregationMode === 'bulanan' ? 'Target APBD Bulanan' : 'Target APBD Tahunan'}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">
          Sumber: SIPD-RI / Real-time Host-to-Host Kas Daerah bjb
        </span>
      </div>
    </div>
  );
};
