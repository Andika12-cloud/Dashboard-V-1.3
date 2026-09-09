'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Layers,
  Hotel,
  Utensils,
  Megaphone,
  Zap,
  Car,
  Droplets,
  Landmark,
  Building2,
  Truck,
  FileBadge2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TaxItem } from '../types';
import { TAX_DATA, SUMMARY_TOTALS, getTaxDataByYear, getSummaryTotalsByYear } from '../data/dummy';
import { 
  formatRupiah, 
  formatRupiahShort, 
  formatPercentage, 
  getPercentageStatus 
} from '../utils/formatters';

interface TaxTableProps {
  data?: TaxItem[];
  selectedYear?: number;
  onSelectTaxItem?: (item: TaxItem) => void;
  searchQuery?: string;
  categoryFilter?: string;
  onNavigateLaporan?: () => void;
}

type ExecutiveViewTab = 'top_performers' | 'perhatian_khusus' | 'semua_sektor';

// Icon mapper untuk ikon sektor pajak
const getTaxIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'Hotel': return Hotel;
    case 'Utensils': return Utensils;
    case 'Sparkles': return Sparkles;
    case 'Megaphone': return Megaphone;
    case 'Zap': return Zap;
    case 'Car': return Car;
    case 'Droplets': return Droplets;
    case 'Landmark': return Landmark;
    case 'Building2': return Building2;
    case 'Truck': return Truck;
    case 'FileBadge2': return FileBadge2;
    default: return Layers;
  }
};

export const TaxTable: React.FC<TaxTableProps> = ({
  data,
  selectedYear = 2026,
  onSelectTaxItem,
  searchQuery = '',
  onNavigateLaporan,
}) => {
  const [activeTab, setActiveTab] = useState<ExecutiveViewTab>('top_performers');
  const [internalSearch, setInternalSearch] = useState('');

  const effectiveSearch = (searchQuery || internalSearch).toLowerCase();

  // Sumber data pajak sesuai props atau tahun terpilih
  const sourceTaxData = useMemo(() => {
    if (data && data.length > 0) return data;
    return getTaxDataByYear(selectedYear);
  }, [data, selectedYear]);

  // Sumber summary totals dinamis
  const dynamicTotals = useMemo(() => {
    return getSummaryTotalsByYear(selectedYear);
  }, [selectedYear]);

  // Data terfilter sesuai tab eksekutif
  const displayedTaxData = useMemo(() => {
    let list = [...sourceTaxData];

    // Filter Search jika ada
    if (effectiveSearch) {
      list = list.filter((item) => {
        const matchesName = item.jenisPajak.toLowerCase().includes(effectiveSearch);
        const matchesCode = item.code.toLowerCase().includes(effectiveSearch);
        const matchesShort = item.shortName.toLowerCase().includes(effectiveSearch);
        return matchesName || matchesCode || matchesShort;
      });
    }

    if (activeTab === 'top_performers') {
      // Urutkan berdasarkan realisasi nominal terbesar (TOP 5 Sektor Kontributor)
      return list.sort((a, b) => b.realisasiTahun - a.realisasiTahun).slice(0, 5);
    } else if (activeTab === 'perhatian_khusus') {
      // Sektor kritis dengan capaian target < 70% atau terendah
      return list.filter((item) => item.persentaseTahun < 70).sort((a, b) => a.persentaseTahun - b.persentaseTahun);
    } else {
      // Semua Sektor Pajak Daerah
      return list.sort((a, b) => a.no - b.no);
    }
  }, [sourceTaxData, activeTab, effectiveSearch]);

  const handleNavigateToReport = () => {
    if (onNavigateLaporan) {
      onNavigateLaporan();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/laporan';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all font-sans">
      {/* 1. Header Toolbar & Tab Filter Eksekutif */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Ringkasan Realisasi Pajak Daerah</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Executive Summary
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ikhtisar cepat realisasi kas untuk pengambilan keputusan strategis TA 2026.
          </p>
        </div>

        {/* Tab Filter Eksekutif */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('top_performers')}
              className={`
                px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs
                ${activeTab === 'top_performers' 
                  ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top Kontributor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('perhatian_khusus')}
              className={`
                px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs
                ${activeTab === 'perhatian_khusus' 
                  ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-rose-600'}
              `}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Perhatian Khusus (&lt;70%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('semua_sektor')}
              className={`
                px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs
                ${activeTab === 'semua_sektor' 
                  ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              <span>Semua (11 Sektor)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              className="w-24 sm:w-28 pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E293B]"
            />
          </div>
        </div>
      </div>

      {/* 2. Fixed Layout Executive Table */}
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-700 text-xs font-semibold border-b border-slate-200">
              <th scope="col" className="w-[36%] py-3 px-3.5 text-left truncate">
                Sektor Pajak Daerah
              </th>
              <th scope="col" className="w-[22%] py-3 px-2 text-right truncate">
                Target APBD 2026
              </th>
              <th scope="col" className="w-[24%] py-3 px-2 text-right truncate">
                Realisasi Kas (Riil)
              </th>
              <th scope="col" className="w-[18%] py-3 px-3 text-right truncate">
                % Capaian
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedTaxData.map((tax, index) => {
              const IconComponent = getTaxIcon(tax.iconName);
              const status = getPercentageStatus(tax.persentaseTahun);

              return (
                <tr 
                  key={tax.id}
                  onClick={() => onSelectTaxItem && onSelectTaxItem(tax)}
                  className={`
                    transition-colors group cursor-pointer
                    ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                    hover:bg-slate-50/80
                  `}
                >
                  {/* Sektor Pajak (w-[36%]) */}
                  <td className="w-[36%] py-3 px-3.5 truncate">
                    <div className="flex items-center gap-2.5 truncate">
                      {/* Monochrome / Slate Icon */}
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 border border-slate-200/60 flex items-center justify-center shrink-0">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate min-w-0">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-[#1E293B] truncate block">
                          {tax.jenisPajak}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal block truncate tabular-nums">
                          Kode: {tax.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Target (w-[22%]) */}
                  <td className="w-[22%] py-3 px-2 text-right truncate" title={formatRupiah(tax.targetTahun)}>
                    <span className="tabular-nums font-semibold text-xs text-slate-800 block truncate">
                      {formatRupiahShort(tax.targetTahun, true)}
                    </span>
                  </td>

                  {/* Realisasi (w-[24%]) */}
                  <td className="w-[24%] py-3 px-2 text-right truncate" title={formatRupiah(tax.realisasiTahun)}>
                    <span className="tabular-nums font-semibold text-xs text-slate-900 block truncate">
                      {formatRupiahShort(tax.realisasiTahun, true)}
                    </span>
                  </td>

                  {/* % Capaian Badge Kontras Tinggi (w-[18%]) */}
                  <td className="w-[18%] py-3 px-3 text-right truncate">
                    <div className="flex items-center justify-end">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold tabular-nums text-right ${status.badgeClass}`}>
                        {formatPercentage(tax.persentaseTahun)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Total Keseluruhan Ringkas */}
            <tr className="bg-[#1E293B] text-white font-medium border-t-2 border-[#1E293B]">
              <td className="w-[36%] py-3 px-3.5 text-left truncate">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-xs text-white tracking-tight truncate">
                    Total Realisasi APBD (TA {selectedYear})
                  </span>
                </div>
              </td>
              <td className="w-[22%] py-3 px-2 text-right tabular-nums font-semibold text-xs text-slate-200 truncate">
                {formatRupiahShort(dynamicTotals.totalKeseluruhan.targetTahun, true)}
              </td>
              <td className="w-[24%] py-3 px-2 text-right tabular-nums font-bold text-xs text-emerald-300 truncate">
                {formatRupiahShort(dynamicTotals.totalKeseluruhan.realisasiTahun, true)}
              </td>
              <td className="w-[18%] py-3 px-3 text-right truncate">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold tabular-nums bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {formatPercentage(dynamicTotals.totalKeseluruhan.persentaseTahun)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Call-To-Action (CTA) Banner Footer Menuju /laporan */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {activeTab === 'top_performers' && 'Menampilkan 5 Sektor Pajak Penerimaan Terbesar.'}
            {activeTab === 'perhatian_khusus' && 'Menampilkan sektor pajak yang memerlukan intensifikasi (<70%).'}
            {activeTab === 'semua_sektor' && 'Menampilkan 11 seluruh sektor pajak daerah.'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNavigateToReport}
          className="w-full sm:w-auto px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Lihat Laporan Lengkap & Unduh Rekap</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
