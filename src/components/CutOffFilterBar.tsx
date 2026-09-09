'use client';

import React from 'react';
import { 
  Filter, 
  Calendar,
  MapPin, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Search 
} from 'lucide-react';
import { CustomDatePicker } from './common/CustomDatePicker';

export interface CutOffFilterBarProps {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  onDateChange: (startDate: string, endDate: string) => void;
  selectedKecamatan?: string;
  onKecamatanChange?: (kec: string) => void;
  selectedTaxGroup?: string;
  onTaxGroupChange?: (group: string) => void;
  selectedStatusCapaian?: string;
  onStatusCapaianChange?: (status: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onYearChange?: (year: number) => void;
}

const KECAMATAN_LIST = [
  'Semua Kecamatan',
  'Cimahi Selatan',
  'Cimahi Tengah',
  'Cimahi Utara'
];

export const CutOffFilterBar: React.FC<CutOffFilterBarProps> = ({
  startDate,
  endDate,
  onDateChange,
  selectedKecamatan = 'Semua Kecamatan',
  onKecamatanChange,
  selectedTaxGroup = 'ALL',
  onTaxGroupChange,
  selectedStatusCapaian = 'ALL',
  onStatusCapaianChange,
  searchQuery = '',
  onSearchChange,
  onYearChange
}) => {
  // Preset Cepat Tanggal
  const handleSetPresetDate = (preset: 'hari_ini' | 'bulan_ini' | 'tahun_ini', yearOverride?: number) => {
    // Deteksi tahun dari tanggal akhir atau override
    const yr = yearOverride || (endDate ? parseInt(endDate.slice(0, 4), 10) : 2026) || 2026;
    
    if (preset === 'hari_ini') {
      const todayDate = yr === 2026 ? '2026-09-07' : `${yr}-12-31`;
      onDateChange(todayDate, todayDate);
    } else if (preset === 'bulan_ini') {
      const startMonth = yr === 2026 ? '2026-09-01' : `${yr}-12-01`;
      const endMonth = yr === 2026 ? '2026-09-30' : `${yr}-12-31`;
      onDateChange(startMonth, endMonth);
    } else if (preset === 'tahun_ini') {
      onDateChange(`${yr}-01-01`, `${yr}-12-31`);
    }

    if (onYearChange && yr) {
      onYearChange(yr);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 font-sans">
      {/* 1. Header Filter Simpel, Bersih, dan Profesional (Tanpa Badge Tahun) */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#1B365D]" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Parameter Filter & Penelusuran Tanggal Cut-Off
          </h2>
        </div>
      </div>

      {/* 2. Grid 5 Parameter Utama Filter Cut-Off */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
        {/* Filter 1: Tanggal Mulai Cut-Off (Modern Clean Date Picker) */}
        <div className="w-full">
          <CustomDatePicker
            label="Tanggal Mulai Cut-Off"
            value={startDate}
            onChange={(newDate) => {
              if (newDate > endDate) {
                onDateChange(newDate, newDate);
              } else {
                onDateChange(newDate, endDate);
              }
            }}
            onShortcutSelect={(type, yr) => handleSetPresetDate(type === 'hari_ini' ? 'hari_ini' : type === 'bulan_ini' ? 'bulan_ini' : 'tahun_ini', yr)}
          />
        </div>

        {/* Filter 2: Tanggal Selesai Cut-Off (Modern Clean Date Picker) */}
        <div className="w-full">
          <CustomDatePicker
            label="Tanggal Selesai Cut-Off"
            value={endDate}
            onChange={(newDate) => {
              if (newDate < startDate) {
                onDateChange(newDate, newDate);
              } else {
                onDateChange(startDate, newDate);
              }
            }}
            onShortcutSelect={(type, yr) => handleSetPresetDate(type === 'hari_ini' ? 'hari_ini' : type === 'bulan_ini' ? 'bulan_ini' : 'tahun_ini', yr)}
          />
        </div>

        {/* Filter 3: Wilayah Kecamatan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1B365D]" />
            <span>Wilayah Kecamatan</span>
          </label>
          <select
            value={selectedKecamatan}
            onChange={(e) => onKecamatanChange && onKecamatanChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:border-[#1B365D] cursor-pointer h-[38px]"
          >
            {KECAMATAN_LIST.map((kec) => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>

        {/* Filter 4: Kelompok Pajak */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1B365D]" />
            <span>Kelompok Pajak</span>
          </label>
          <select
            value={selectedTaxGroup}
            onChange={(e) => onTaxGroupChange && onTaxGroupChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:border-[#1B365D] cursor-pointer h-[38px]"
          >
            <option value="ALL">Semua Kelompok Pajak</option>
            <option value="PBJT">PBJT (Hotel, Restoran, Hiburan, Listrik, Parkir)</option>
            <option value="PBB_BPHTB">PBB-P2 & BPHTB</option>
            <option value="OPSEN">Opsen PKB & Opsen BBNKB</option>
            <option value="PAJAK_LAIN">Pajak Reklame & Air Tanah</option>
          </select>
        </div>

        {/* Filter 5: Status Capaian */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status Capaian</span>
          </label>
          <select
            value={selectedStatusCapaian}
            onChange={(e) => onStatusCapaianChange && onStatusCapaianChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:border-[#1B365D] cursor-pointer h-[38px]"
          >
            <option value="ALL">Semua Status Capaian</option>
            <option value="MELAMPAUI">Melampaui Target (≥ 100%)</option>
            <option value="MEMENUHI">Memenuhi Target (80% - 99.9%)</option>
            <option value="PERLU_PERHATIAN">Perlu Perhatian (&lt; 80%)</option>
          </select>
        </div>
      </div>

      {/* 3. Baris Bawah: Shortcut Periode Cepat & Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Shortcut Periode:</span>
          </span>
          
          <button
            type="button"
            onClick={() => handleSetPresetDate('hari_ini')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={() => handleSetPresetDate('bulan_ini')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Bulan Ini
          </button>

          <button
            type="button"
            onClick={() => handleSetPresetDate('tahun_ini')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-[#E67E22] border border-orange-200 transition-all cursor-pointer"
          >
            Setahun Penuh
          </button>
        </div>

        {onSearchChange && (
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari sektor pajak, WP, kode..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/15 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};
