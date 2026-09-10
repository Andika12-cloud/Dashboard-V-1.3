import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  ChevronRight, 
  ArrowUpDown, 
  Building2, 
  Hotel,
  Utensils,
  Sparkles,
  Megaphone,
  Zap,
  Car,
  Droplets,
  Landmark,
  Truck,
  FileBadge2,
  Layers,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  REPORT_TAX_DATA, 
  TaxSectorReportItem, 
  TaxPayerDetail,
  getAllSectorTransactions,
  filterTransactionsByDate,
  getReportDataByYear
} from '../../data/reportData';
import { formatRupiah, formatPercentage, getPercentageStatus } from '../../utils/formatters';
import { PrintPreviewModal } from './PrintPreviewModal';
import { TaxPayerSubTable } from './TaxPayerSubTable';
import { TaxPayerDetailModal } from './TaxPayerDetailModal';
import { CustomDatePicker } from './CustomDatePicker';
import { exportReportToExcel } from '../../utils/exportExcel';

interface ReportViewProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  onNavigateDashboard?: () => void;
}

const KECAMATAN_OPTIONS = [
  'Semua Kecamatan',
  'Cimahi Selatan',
  'Cimahi Tengah',
  'Cimahi Utara'
];

// Icon mapper untuk jenis pajak
const getTaxIcon = (iconName: string) => {
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

export const ReportView: React.FC<ReportViewProps> = ({ 
  selectedYear = 2026,
  onYearChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // 1. FILTER TANGGAL CUT-OFF (Rentang Tanggal Penelusuran Transaksi)
  const [filterStartDate, setFilterStartDate] = useState(() => 
    selectedYear && selectedYear !== 2026 ? `${selectedYear}-01-01` : '2026-09-01'
  );
  const [filterEndDate, setFilterEndDate] = useState(() => 
    selectedYear && selectedYear !== 2026 ? `${selectedYear}-12-31` : '2026-09-07'
  );

  // Tahun Anggaran (TA) Terdeteksi
  const activeYear = useMemo(() => {
    const targetDate = filterEndDate || filterStartDate;
    if (targetDate && targetDate.length >= 4) {
      const yr = parseInt(targetDate.slice(0, 4), 10);
      if (!isNaN(yr) && yr >= 2019 && yr <= 2026) {
        return yr;
      }
    }
    return selectedYear || 2026;
  }, [filterEndDate, filterStartDate, selectedYear]);

  // Sinkronisasi ke parent jika ada callback
  React.useEffect(() => {
    if (onYearChange && activeYear) {
      onYearChange(activeYear);
    }
  }, [activeYear, onYearChange]);

  // Filter Wilayah, Kelompok Pajak, dan Status
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua Kecamatan');
  const [filterTaxGroup, setFilterTaxGroup] = useState<string>('ALL');
  const [filterStatusCapaian, setFilterStatusCapaian] = useState<string>('ALL');

  // Comparative (YoY) dinonaktifkan
  const [isYoYEnabled] = useState(false);

  // Print Preview Modal
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // LEVEL 3 DRILLDOWN: WP DETAIL TRANSACTIONS MODAL
  const [selectedWpForModal, setSelectedWpForModal] = useState<TaxPayerDetail | null>(null);
  const [selectedSectorForModal, setSelectedSectorForModal] = useState<TaxSectorReportItem | null>(null);
  const [isWpModalOpen, setIsWpModalOpen] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<'no' | 'nama' | 'target' | 'realisasi' | 'persen' | 'growth' | 'periode'>('no');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 1. RESET STATE EXPANDED ROW: Default null agar tidak ada baris yang terbuka secara otomatis
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // 2. CLEANUP ON MOUNT: Memastikan seluruh accordion / sub-tabel dalam posisi tertutup saat masuk ke menu Laporan
  useEffect(() => {
    setExpandedRowId(null);
  }, []);

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const handleOpenWpDetail = (wp: TaxPayerDetail, sector: TaxSectorReportItem) => {
    setSelectedWpForModal(wp);
    setSelectedSectorForModal(sector);
    setIsWpModalOpen(true);
  };

  const handleCloseWpDetail = () => {
    setIsWpModalOpen(false);
    setSelectedWpForModal(null);
    setSelectedSectorForModal(null);
  };

  // Preset Cepat Rentang Tanggal
  const handleSetPresetDate = (preset: 'hari_ini' | 'bulan_ini' | 'tahun_ini', yearOverride?: number) => {
    const yr = yearOverride || activeYear;
    if (preset === 'hari_ini') {
      const todayDate = yr === 2026 ? '2026-09-07' : `${yr}-12-31`;
      setFilterStartDate(todayDate);
      setFilterEndDate(todayDate);
    } else if (preset === 'bulan_ini') {
      const startMonth = yr === 2026 ? '2026-09-01' : `${yr}-12-01`;
      const endMonth = yr === 2026 ? '2026-09-30' : `${yr}-12-31`;
      setFilterStartDate(startMonth);
      setFilterEndDate(endMonth);
    } else if (preset === 'tahun_ini') {
      setFilterStartDate(`${yr}-01-01`);
      setFilterEndDate(`${yr}-12-31`);
    }
  };

  // Format label tanggal untuk tampilan
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return dateStr;
  };

  // Data Sektor Pajak Dinamis Berdasarkan Tahun Anggaran yang Dipilih
  const currentReportData = useMemo(() => {
    return getReportDataByYear(activeYear);
  }, [activeYear]);

  // Filter Data Utama
  const filteredData = useMemo(() => {
    return currentReportData.map(sector => {
      // Filter WP per Kecamatan jika dipilih
      let matchingPayers = sector.taxPayers;
      if (selectedKecamatan !== 'Semua Kecamatan') {
        matchingPayers = matchingPayers.filter(wp => wp.kecamatan === selectedKecamatan);
      }

      // Hitung Transaksi dalam Rentang Tanggal Cut-Off
      const allTx = getAllSectorTransactions(sector);
      const dateTx = filterTransactionsByDate(allTx, filterStartDate, filterEndDate);
      const setoranPeriode = dateTx.reduce((acc, t) => acc + t.nominal, 0);

      // Jika ada filter kecamatan, recalculate target & realisasi berdasarkan WP yang match
      let targetTahun = sector.target2026;
      let realisasiTahun = sector.realisasi2026;
      let realisasi2025 = sector.realisasi2025;

      if (selectedKecamatan !== 'Semua Kecamatan') {
        targetTahun = matchingPayers.reduce((acc, wp) => acc + wp.target2026, 0);
        realisasiTahun = matchingPayers.reduce((acc, wp) => acc + wp.realisasi2026, 0);
        realisasi2025 = matchingPayers.reduce((acc, wp) => acc + wp.realisasi2025, 0);
      }

      return {
        ...sector,
        target2026: targetTahun,
        realisasi2026: realisasiTahun,
        realisasi2025: realisasi2025,
        taxPayers: matchingPayers,
        setoranPeriode,
        totalTxCountPeriode: dateTx.length
      };
    }).filter(item => {
      // Jangan tampilkan jika setelah filter kecamatan datanya 0 dan WP kosong
      if (selectedKecamatan !== 'Semua Kecamatan' && item.taxPayers.length === 0) {
        return false;
      }

      // Filter Kelompok Pajak
      if (filterTaxGroup !== 'ALL') {
        if (filterTaxGroup === 'PBJT' && item.group !== 'PBJT') return false;
        if (filterTaxGroup === 'PBB_BPHTB' && item.group !== 'PBB_BPHTB') return false;
        if (filterTaxGroup === 'OPSEN' && item.group !== 'OPSEN') return false;
        if (filterTaxGroup === 'PAJAK_LAIN' && item.group !== 'PAJAK_LAIN') return false;
      }

      // Filter Status Capaian
      const persen = item.target2026 > 0 ? (item.realisasi2026 / item.target2026) * 100 : 0;
      if (filterStatusCapaian !== 'ALL') {
        if (filterStatusCapaian === 'TERCAPAI' && persen < 100) return false;
        if (filterStatusCapaian === 'OPTIMAL' && (persen < 70 || persen >= 100)) return false;
        if (filterStatusCapaian === 'PERHATIAN' && persen >= 70) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.jenisPajak.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesShort = item.shortName.toLowerCase().includes(query);
        const matchesWP = item.taxPayers.some(wp => 
          wp.namaWajibPajak.toLowerCase().includes(query) || 
          wp.namaObjek.toLowerCase().includes(query) ||
          wp.npwpd.toLowerCase().includes(query)
        );
        return matchesName || matchesCode || matchesShort || matchesWP;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      const persenA = a.target2026 > 0 ? (a.realisasi2026 / a.target2026) * 100 : 0;
      const persenB = b.target2026 > 0 ? (b.realisasi2026 / b.target2026) * 100 : 0;
      const growthA = a.realisasi2025 > 0 ? ((a.realisasi2026 - a.realisasi2025) / a.realisasi2025) * 100 : 0;
      const growthB = b.realisasi2025 > 0 ? ((b.realisasi2026 - b.realisasi2025) / b.realisasi2025) * 100 : 0;

      if (sortField === 'no') comparison = a.no - b.no;
      if (sortField === 'nama') comparison = a.jenisPajak.localeCompare(b.jenisPajak);
      if (sortField === 'target') comparison = a.target2026 - b.target2026;
      if (sortField === 'realisasi') comparison = a.realisasi2026 - b.realisasi2026;
      if (sortField === 'persen') comparison = persenA - persenB;
      if (sortField === 'growth') comparison = growthA - growthB;
      if (sortField === 'periode') comparison = (a.setoranPeriode || 0) - (b.setoranPeriode || 0);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [currentReportData, selectedKecamatan, filterTaxGroup, filterStatusCapaian, searchQuery, sortField, sortOrder, filterStartDate, filterEndDate]);

  const handleSort = (field: 'no' | 'nama' | 'target' | 'realisasi' | 'persen' | 'growth' | 'periode') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Dynamic Totals
  const totalTarget2026 = filteredData.reduce((acc, curr) => acc + curr.target2026, 0);
  const totalRealisasi2026 = filteredData.reduce((acc, curr) => acc + curr.realisasi2026, 0);
  const totalSetoranPeriode = filteredData.reduce((acc, curr) => acc + (curr.setoranPeriode || 0), 0);
  const totalTxCountPeriode = filteredData.reduce((acc, curr) => acc + (curr.totalTxCountPeriode || 0), 0);
  const totalPersen = totalTarget2026 > 0 ? (totalRealisasi2026 / totalTarget2026) * 100 : 0;
  
  const totalTargetTW = filteredData.reduce((acc, curr) => acc + curr.targetTW, 0);
  const totalRealisasiTW = filteredData.reduce((acc, curr) => acc + curr.realisasiTW, 0);
  const totalPersenTW = totalTargetTW > 0 ? (totalRealisasiTW / totalTargetTW) * 100 : 0;

  const totalRealisasi2025 = filteredData.reduce((acc, curr) => acc + curr.realisasi2025, 0);
  const totalGrowthNominal = totalRealisasi2026 - totalRealisasi2025;
  const totalGrowthPersen = totalRealisasi2025 > 0 ? (totalGrowthNominal / totalRealisasi2025) * 100 : 0;

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await exportReportToExcel(
        filteredData, 
        { start: filterStartDate, end: filterEndDate }, 
        selectedKecamatan, 
        isYoYEnabled
      );
    } catch (error) {
      console.error('Gagal mengekspor data Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      {/* 1. Header Banner & Action Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold uppercase tracking-wider">
              Modul Audit & Rekapitulasi Kasda
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Real-Time SIPD Valid</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Realisasi & Penelusuran Pembayaran Pajak Daerah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Badan Pendapatan Daerah Kota Cimahi • Tahun Anggaran {activeYear} • Cut-off: {formatDateDisplay(filterStartDate)} s.d. {formatDateDisplay(filterEndDate)}
          </p>
        </div>

        {/* Action Buttons: Cetak PDF & Ekspor Excel */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Print PDF Preview */}
          <button
            onClick={() => setIsPrintPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak PDF</span>
          </button>

          {/* Export Excel (.xlsx) dengan exceljs & file-saver */}
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-[#1B3B36] hover:bg-[#142C28] disabled:opacity-75 text-xs font-semibold text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            title="Unduh laporan formal Excel dengan rumus dan format angka rapi"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses Excel...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Excel (.xlsx)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. PANEL FILTER RENTANG TANGGAL CUT-OFF & FILTER MULTI-DIMENSI */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#1B365D]" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Parameter Filter & Penelusuran Tanggal Cut-Off
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          {/* Filter 1: Tanggal Mulai Cut-Off (Modern Clean Date Picker) */}
          <div className="w-full">
            <CustomDatePicker
              label="Tanggal Mulai Cut-Off"
              value={filterStartDate}
              onChange={(newDate) => {
                setFilterStartDate(newDate);
                if (newDate > filterEndDate) {
                  setFilterEndDate(newDate);
                }
              }}
              onShortcutSelect={(type, yr) => handleSetPresetDate(type === 'hari_ini' ? 'hari_ini' : type === 'bulan_ini' ? 'bulan_ini' : 'tahun_ini', yr)}
            />
          </div>

          {/* Filter 2: Tanggal Selesai Cut-Off (Modern Clean Date Picker) */}
          <div className="w-full">
            <CustomDatePicker
              label="Tanggal Selesai Cut-Off"
              value={filterEndDate}
              onChange={(newDate) => {
                setFilterEndDate(newDate);
                if (newDate < filterStartDate) {
                  setFilterStartDate(newDate);
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
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:border-[#1B365D] cursor-pointer h-[38px]"
            >
              {KECAMATAN_OPTIONS.map((kec) => (
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
              value={filterTaxGroup}
              onChange={(e) => setFilterTaxGroup(e.target.value)}
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
              value={filterStatusCapaian}
              onChange={(e) => setFilterStatusCapaian(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:border-[#1B365D] cursor-pointer h-[38px]"
            >
              <option value="ALL">Semua Status Capaian</option>
              <option value="MELAMPAUI">Melampaui Target (≥ 100%)</option>
              <option value="MEMENUHI">Memenuhi Target (80% - 99.9%)</option>
              <option value="PERLU_PERHATIAN">Perlu Perhatian (&lt; 80%)</option>
            </select>
          </div>
        </div>

        {/* Baris Bawah: Quick Presets & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Quick Preset Buttons */}
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
              Hari Ini ({activeYear === 2026 ? '7 Sep 2026' : `31 Des ${activeYear}`})
            </button>

            <button
              type="button"
              onClick={() => handleSetPresetDate('bulan_ini')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Bulan Ini ({activeYear === 2026 ? 'September 2026' : `Desember ${activeYear}`})
            </button>

            <button
              type="button"
              onClick={() => handleSetPresetDate('tahun_ini')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-[#E67E22] border border-orange-200 transition-all cursor-pointer"
            >
              Setahun Penuh (1 Jan – 31 Des {activeYear})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari sektor pajak, WP, kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/15 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. RINGKASAN EKSEKUTIF CARDS (DILENGKAPI TOTAL SETORAN PERIODE TERPILIH) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Target APBD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Target APBD {activeYear}</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(totalTarget2026)}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">
            {filteredData.length} Sektor Rekening Pajak Daerah
          </span>
        </div>

        {/* Card 2: Total Realisasi Kasda */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Realisasi Kumulatif {activeYear}</span>
          <p className="text-xl sm:text-2xl font-bold text-[#27AE60] mt-1 tabular-nums">
            {formatRupiah(totalRealisasi2026)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-[#27AE60] font-semibold tabular-nums">
              Capaian: {formatPercentage(totalPersen)}
            </span>
            <span className="text-xs text-slate-400">• Cut-off Kasda</span>
          </div>
        </div>

        {/* Card 3: Total Setoran Selama Rentang Tanggal Cut-Off */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs ring-1 ring-[#E67E22]/30 bg-gradient-to-br from-white to-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 block">Setoran Periode Terpilih</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E67E22]/10 text-[#E67E22] font-bold tabular-nums">
              {totalTxCountPeriode} Transaksi
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1B365D] mt-1 tabular-nums">
            {formatRupiah(totalSetoranPeriode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block tabular-nums">
            Rentang: {formatDateDisplay(filterStartDate)} s.d. {formatDateDisplay(filterEndDate)}
          </span>
        </div>

        {/* Card 4: Triwulan III / YoY Comparison */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          {isYoYEnabled ? (
            <>
              <span className="text-xs font-semibold text-slate-500 block">
                Pertumbuhan YoY vs {activeYear > 2019 ? activeYear - 1 : 2019}
              </span>
              <p className={`text-xl sm:text-2xl font-bold mt-1 tabular-nums ${totalGrowthNominal >= 0 ? 'text-[#27AE60]' : 'text-rose-600'}`}>
                {totalGrowthNominal >= 0 ? '+' : ''}{formatRupiah(totalGrowthNominal)}
              </p>
              <span className={`text-xs font-semibold mt-1 block tabular-nums ${totalGrowthNominal >= 0 ? 'text-[#27AE60]' : 'text-rose-600'}`}>
                {totalGrowthNominal >= 0 ? 'Surplus ' : 'Defisit '}{formatPercentage(totalGrowthPersen)}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold text-slate-500 block">Realisasi Triwulan III ({activeYear})</span>
              <p className="text-xl sm:text-2xl font-bold text-[#1B365D] mt-1 tabular-nums">
                {formatRupiah(totalRealisasiTW)}
              </p>
              <span className="text-xs text-[#E67E22] font-semibold mt-1 block tabular-nums">
                Capaian TW III: {formatPercentage(totalPersenTW)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 4. TABEL AUDIT UTAMA & DRILL-DOWN SUB-TABEL (LEVEL 1 & LEVEL 2) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Description Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center font-bold text-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Rekapitulasi Sektor Pajak Daerah & Sub-Tabel Rincian Pembayaran Per Tanggal (TA {activeYear})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik ikon expand baris (chevron) untuk menelusuri sub-tabel rincian transaksi per tanggal dan daftar wajib pajak.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari sektor / kode / WP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1B365D] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="shrink-0"><strong>{filteredData.length}</strong> sektor</span>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-semibold border-b border-slate-200">
                <th className="py-3 px-3 text-center w-12">Expand</th>
                <th className="py-3 px-3 text-center w-12">
                  <button onClick={() => handleSort('no')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                    <span>No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3">Kode Rekening</th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSort('nama')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                    <span>Jenis Sektor Pajak Daerah</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('target')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                    <span>Target APBD {activeYear} (Rp)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('realisasi')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                    <span>Realisasi Kas {activeYear} (Rp)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right bg-amber-50/50">
                  <button onClick={() => handleSort('periode')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer text-[#1B365D]">
                    <span>Setoran Periode (Rp)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('persen')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                    <span>% Capaian</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                {isYoYEnabled && (
                  <>
                    <th className="py-3 px-3 text-right">Realisasi {activeYear > 2019 ? activeYear - 1 : 2019} (Rp)</th>
                    <th className="py-3 px-3 text-right">
                      <button onClick={() => handleSort('growth')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                        <span>YoY Growth (%)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={isYoYEnabled ? 11 : 9} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada sektor pajak yang sesuai dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredData.map((sector) => {
                  const isExpanded = expandedRowId === sector.id;
                  const Icon = getTaxIcon(sector.iconName);
                  const persen = sector.target2026 > 0 ? (sector.realisasi2026 / sector.target2026) * 100 : 0;
                  const growthNominal = sector.realisasi2026 - sector.realisasi2025;
                  const growthPersen = sector.realisasi2025 > 0 ? (growthNominal / sector.realisasi2025) * 100 : 0;
                  const statusInfo = getPercentageStatus(persen);

                  return (
                    <React.Fragment key={sector.id}>
                      {/* BARIS UTAMA SEKTOR PAJAK */}
                      <tr 
                        onClick={() => toggleRowExpand(sector.id)}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50/80 font-semibold' : ''}`}
                      >
                        {/* 1. Toggle Expand Icon */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpand(sector.id);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 text-[#1B365D] ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        </td>

                        {/* 2. No Urut */}
                        <td className="py-3 px-3 text-center tabular-nums text-slate-500 font-medium">
                          {sector.no}
                        </td>

                        {/* 3. Kode Rekening */}
                        <td className="py-3 px-3 tabular-nums font-semibold text-slate-700">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                            {sector.code}
                          </span>
                        </td>

                        {/* 4. Nama Sektor */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: sector.color }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-xs block hover:text-[#1B365D]">
                                {sector.jenisPajak}
                              </span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                {sector.taxPayers.length} Wajib Pajak Terdaftar
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 5. Target APBD 2026 */}
                        <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-800">
                          {formatRupiah(sector.target2026)}
                        </td>

                        {/* 6. Realisasi Kas 2026 */}
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-[#27AE60]">
                          {formatRupiah(sector.realisasi2026)}
                        </td>

                        {/* 7. Setoran Periode Terpilih */}
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-[#1B365D] bg-amber-50/50">
                          {formatRupiah(sector.setoranPeriode || 0)}
                        </td>

                        {/* 8. % Capaian */}
                        <td className="py-3 px-3 text-right tabular-nums font-semibold">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                            persen >= 100 ? 'bg-emerald-100 text-emerald-800' :
                            persen >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {formatPercentage(persen)}
                          </span>
                        </td>

                        {/* 9. Status Capaian */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            persen >= 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            persen >= 70 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* YoY Comparative Columns */}
                        {isYoYEnabled && (
                          <>
                            <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                              {formatRupiah(sector.realisasi2025)}
                            </td>
                            <td className="py-3 px-3 text-right tabular-nums font-semibold">
                              <span className={`inline-flex items-center gap-0.5 ${growthNominal >= 0 ? 'text-[#27AE60]' : 'text-rose-600'}`}>
                                {growthNominal >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>{growthNominal >= 0 ? '+' : ''}{formatPercentage(growthPersen)}</span>
                              </span>
                            </td>
                          </>
                        )}
                      </tr>

                      {/* SUB-TABEL DRILL-DOWN LEVEL 2 (Rincian Transaksi Pembayaran Per Tanggal & WP List) */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={isYoYEnabled ? 11 : 9} className="p-0 border-b border-slate-200">
                            <TaxPayerSubTable
                              sector={sector}
                              taxPayers={sector.taxPayers}
                              isYoYEnabled={isYoYEnabled}
                              filterStartDate={filterStartDate}
                              filterEndDate={filterEndDate}
                              onSelectTaxPayer={handleOpenWpDetail}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* TOTAL FOOTER ROW */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900 text-xs">
              <tr>
                <td colSpan={4} className="py-3.5 px-4 uppercase tracking-wider text-xs">
                  TOTAL KESELURUHAN PAJAK DAERAH (TA {activeYear})
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {formatRupiah(totalTarget2026)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums text-[#27AE60]">
                  {formatRupiah(totalRealisasi2026)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums text-[#1B365D] bg-amber-100/60">
                  {formatRupiah(totalSetoranPeriode)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  <span className="px-2 py-0.5 rounded-md bg-[#1B365D] text-white text-xs">
                    {formatPercentage(totalPersen)}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                    Sangat Optimal
                  </span>
                </td>
                {isYoYEnabled && (
                  <>
                    <td className="py-3.5 px-3 text-right tabular-nums text-slate-700">
                      {formatRupiah(totalRealisasi2025)}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-[#27AE60]">
                      +{formatPercentage(totalGrowthPersen)}
                    </td>
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL LEVEL 3: RINCIAN TRANSAKSI SPESIFIK WP & CETAK SSPD */}
      <TaxPayerDetailModal
        taxPayer={selectedWpForModal}
        sectorName={selectedSectorForModal ? selectedSectorForModal.jenisPajak : ''}
        sectorCode={selectedSectorForModal ? selectedSectorForModal.code : ''}
        isOpen={isWpModalOpen}
        onClose={handleCloseWpDetail}
      />

      {/* MODAL PRINT PREVIEW DOKUMEN RESMI KOP BAPENDA */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        data={filteredData}
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        selectedKecamatan={selectedKecamatan}
        isYoYEnabled={isYoYEnabled}
      />
    </div>
  );
};
