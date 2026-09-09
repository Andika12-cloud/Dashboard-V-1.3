import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Receipt, 
  CheckCircle2, 
  ArrowUpDown,
  Calendar,
  CreditCard,
  Building2,
  Filter,
  Layers,
  Clock,
  Download,
  Printer,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pagination } from '../common/Pagination';
import { 
  TaxPayerDetail, 
  TaxSectorReportItem, 
  TaxTransactionRecord, 
  generateTaxTransactions,
  getAllSectorTransactions,
  filterTransactionsByDate
} from '../../data/reportData';
import { formatRupiah, formatRupiahShort, formatPercentage } from '../../utils/formatters';

interface TaxPayerSubTableProps {
  sector: TaxSectorReportItem;
  taxPayers: TaxPayerDetail[];
  isYoYEnabled: boolean;
  filterStartDate: string;
  filterEndDate: string;
  onSelectTaxPayer: (wp: TaxPayerDetail, sector: TaxSectorReportItem) => void;
}

export const TaxPayerSubTable: React.FC<TaxPayerSubTableProps> = ({
  sector,
  taxPayers,
  isYoYEnabled: _isYoYEnabled,
  filterStartDate,
  filterEndDate,
  onSelectTaxPayer,
}) => {
  // Mode Tampilan: 'transaksi' (Rincian Pembayaran Per Tanggal) vs 'wajib_pajak' (Daftar WP)
  const [activeSubTab, setActiveSubTab] = useState<'transaksi' | 'wajib_pajak'>('transaksi');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [selectedMasaPajak, setSelectedMasaPajak] = useState<string>('ALL');
  
  // Pagination & Sorting State for Transaksi
  const [txPage, setTxPage] = useState(1);
  const [txPageSize, setTxPageSize] = useState<number>(10);
  const [txSortField, setTxSortField] = useState<'tanggal' | 'nominal' | 'wp' | 'ntb'>('tanggal');
  const [txSortOrder, setTxSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination & Sorting State for WP List
  const [wpPage, setWpPage] = useState(1);
  const [wpPageSize, setWpPageSize] = useState<number>(5);
  const [wpSortField, setWpSortField] = useState<'nama' | 'target' | 'realisasi' | 'persen' | 'bulanIni'>('realisasi');
  const [wpSortOrder, setWpSortOrder] = useState<'asc' | 'desc'>('desc');

  // Inline expanded WP for single-WP daily transactions
  const [expandedWpNpwpd, setExpandedWpNpwpd] = useState<string | null>(null);

  // 1. Ambil Seluruh Transaksi untuk Sektor Ini
  const rawTransactions = useMemo(() => {
    return getAllSectorTransactions(sector);
  }, [sector]);

  // 2. Saring Transaksi Berdasarkan Rentang Tanggal Cut-Off (100% Dinamis & Fleksibel Sesuai Pilihan User)
  const dateFilteredTransactions = useMemo(() => {
    if (!rawTransactions) return [];

    return rawTransactions.filter((item) => {
      // Ambil string tanggal YYYY-MM-DD dari properti paymentDate / tglSspd
      const itemDate = (item.paymentDate || item.tglSspd || item.tanggalBayar).split(' ')[0];

      const isAfterStart = !filterStartDate || itemDate >= filterStartDate;
      const isBeforeEnd = !filterEndDate || itemDate <= filterEndDate;

      return isAfterStart && isBeforeEnd;
    });
  }, [rawTransactions, filterStartDate, filterEndDate]);

  // 3. Saring Berdasarkan Filter Search, Bank, Masa Pajak, dan Sorting
  const filteredTransactions = useMemo(() => {
    return dateFilteredTransactions.filter(tx => {
      // Filter Bank
      if (selectedBank !== 'ALL' && !tx.bankPenampung.includes(selectedBank)) {
        return false;
      }
      // Filter Masa Pajak
      if (selectedMasaPajak !== 'ALL' && tx.masaPajak !== selectedMasaPajak) {
        return false;
      }
      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchWp = tx.namaWajibPajak.toLowerCase().includes(q);
        const matchObj = tx.namaObjek.toLowerCase().includes(q);
        const matchNtb = tx.noNtb.toLowerCase().includes(q);
        const matchSspd = tx.noSspd.toLowerCase().includes(q);
        const matchNtpd = tx.ntpd.toLowerCase().includes(q);
        const matchDate = tx.tanggalBayar.toLowerCase().includes(q);
        const matchMasa = tx.masaPajak.toLowerCase().includes(q);
        return matchWp || matchObj || matchNtb || matchSspd || matchNtpd || matchDate || matchMasa;
      }
      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (txSortField === 'tanggal') {
        const dateA = new Date(a.tanggalBayar.replace(' ', 'T')).getTime();
        const dateB = new Date(b.tanggalBayar.replace(' ', 'T')).getTime();
        comp = dateA - dateB;
      } else if (txSortField === 'nominal') {
        comp = a.nominal - b.nominal;
      } else if (txSortField === 'wp') {
        comp = a.namaWajibPajak.localeCompare(b.namaWajibPajak);
      } else if (txSortField === 'ntb') {
        comp = a.noNtb.localeCompare(b.noNtb);
      }
      return txSortOrder === 'asc' ? comp : -comp;
    });
  }, [dateFilteredTransactions, searchQuery, selectedBank, selectedMasaPajak, txSortField, txSortOrder]);

  // Total Nominal Transaksi pada Periode Terpilih
  const totalNominalPeriode = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => acc + curr.nominal, 0);
  }, [filteredTransactions]);

  // Pagination Math for Transaksi
  const totalTxItems = filteredTransactions.length;
  const totalTxPages = Math.max(1, Math.ceil(totalTxItems / txPageSize));
  const startTxIndex = (txPage - 1) * txPageSize;
  const currentTransactions = filteredTransactions.slice(startTxIndex, startTxIndex + txPageSize);

  // 4. Filter & Search untuk Tab WP
  const filteredTaxPayers = useMemo(() => {
    return taxPayers.filter(wp => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = wp.namaWajibPajak.toLowerCase().includes(q);
      const matchObj = wp.namaObjek.toLowerCase().includes(q);
      const matchNpwpd = wp.npwpd.toLowerCase().includes(q);
      const matchNopd = wp.nopd ? wp.nopd.toLowerCase().includes(q) : false;
      const matchKec = wp.kecamatan.toLowerCase().includes(q);
      const matchKel = wp.kelurahan.toLowerCase().includes(q);
      return matchName || matchObj || matchNpwpd || matchNopd || matchKec || matchKel;
    }).sort((a, b) => {
      const persenA = a.target2026 > 0 ? (a.realisasi2026 / a.target2026) * 100 : 0;
      const persenB = b.target2026 > 0 ? (b.realisasi2026 / b.target2026) * 100 : 0;

      let comp = 0;
      if (wpSortField === 'nama') comp = a.namaWajibPajak.localeCompare(b.namaWajibPajak);
      if (wpSortField === 'target') comp = a.target2026 - b.target2026;
      if (wpSortField === 'realisasi') comp = a.realisasi2026 - b.realisasi2026;
      if (wpSortField === 'persen') comp = persenA - persenB;
      if (wpSortField === 'bulanIni') comp = a.setoranBulanIni - b.setoranBulanIni;

      return wpSortOrder === 'asc' ? comp : -comp;
    });
  }, [taxPayers, searchQuery, wpSortField, wpSortOrder]);

  const totalWpItems = filteredTaxPayers.length;
  const totalWpPages = Math.max(1, Math.ceil(totalWpItems / wpPageSize));
  const startWpIndex = (wpPage - 1) * wpPageSize;
  const currentTaxPayers = filteredTaxPayers.slice(startWpIndex, startWpIndex + wpPageSize);

  // Format label rentang tanggal
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleToggleTxSort = (field: 'tanggal' | 'nominal' | 'wp' | 'ntb') => {
    if (txSortField === field) {
      setTxSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setTxSortField(field);
      setTxSortOrder('desc');
    }
  };

  const handleToggleWpSort = (field: 'nama' | 'target' | 'realisasi' | 'persen' | 'bulanIni') => {
    if (wpSortField === field) {
      setWpSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setWpSortField(field);
      setWpSortOrder('desc');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="p-3.5 sm:p-5 bg-slate-50 border-l-4 border-l-[#1B365D] space-y-4 font-sans text-slate-800"
    >
      {/* 1. Header Toolbar & Dual View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left Side: Info & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center font-bold text-xs shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Audit Sub-Tabel — {sector.jenisPajak}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold tabular-nums">
                  {sector.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Penelusuran data setoran per tanggal kas daerah & daftar kepatuhan wajib pajak.
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto sm:ml-4">
            <button
              type="button"
              onClick={() => setActiveSubTab('transaksi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'transaksi'
                  ? 'bg-white text-[#1B365D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>Pembayaran Per Tanggal</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                activeSubTab === 'transaksi' ? 'bg-[#1B365D] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {totalTxItems}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('wajib_pajak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'wajib_pajak'
                  ? 'bg-white text-[#1B365D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#1B365D]" />
              <span>Daftar Wajib Pajak</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                activeSubTab === 'wajib_pajak' ? 'bg-[#1B365D] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {totalWpItems}
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Search & Filter Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder={activeSubTab === 'transaksi' ? "Cari No. NTB, SSPD, nama WP..." : "Cari WP, NOPD, kelurahan..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/15 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {activeSubTab === 'transaksi' && (
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-[#1B365D] cursor-pointer"
            >
              <option value="ALL">Semua Bank</option>
              <option value="bjb">Bank bjb</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="Pos">PT Pos Indonesia</option>
            </select>
          )}

          {/* Page Size Selector */}
          <select
            value={activeSubTab === 'transaksi' ? txPageSize : wpPageSize}
            onChange={(e) => {
              if (activeSubTab === 'transaksi') {
                setTxPageSize(Number(e.target.value));
                setTxPage(1);
              } else {
                setWpPageSize(Number(e.target.value));
                setWpPage(1);
              }
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-[#1B365D] cursor-pointer"
          >
            <option value={5}>5 baris</option>
            <option value={10}>10 baris</option>
            <option value={20}>20 baris</option>
          </select>
        </div>
      </div>

      {/* 2. Banner Indikator Periode Tanggal Aktif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-semibold">
          <Calendar className="w-4 h-4 text-[#E67E22] shrink-0" />
          <span>
            Periode Cut-Off Aktif: <strong>{formatDateLabel(filterStartDate)}</strong> s.d. <strong>{formatDateLabel(filterEndDate)}</strong>
          </span>
          <span className="hidden md:inline text-amber-600 font-normal">•</span>
          <span className="hidden md:inline text-amber-800 font-normal">
            Menampilkan data transaksi yang terekam pada kasda selama rentang tanggal tersebut.
          </span>
        </div>

        {activeSubTab === 'transaksi' && (
          <div className="text-right text-xs">
            <span className="text-slate-600">Total Setoran Periode: </span>
            <strong className="text-[#1B365D] tabular-nums font-bold text-xs sm:text-sm">
              {formatRupiah(totalNominalPeriode)}
            </strong>
          </div>
        )}
      </div>

      {/* 3. TAMPILAN TAB 1: SUB-TABEL RINCIAN PEMBAYARAN PER TANGGAL (6 KOLOM SESUAI SPESIFIKASI) */}
      {activeSubTab === 'transaksi' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-xs font-semibold border-b border-slate-200">
                  {/* Kolom 1: Tanggal Bayar / TGL SSPD */}
                  <th className="py-3 px-3.5">
                    <button 
                      onClick={() => handleToggleTxSort('tanggal')} 
                      className="inline-flex items-center gap-1.5 hover:text-[#1B365D] cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>1. Tanggal Bayar / TGL SSPD</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>

                  {/* Kolom 2: Nomor Urut / No. NTB (Nomor Transaksi Bank) */}
                  <th className="py-3 px-3">
                    <button 
                      onClick={() => handleToggleTxSort('ntb')} 
                      className="inline-flex items-center gap-1.5 hover:text-[#1B365D] cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>2. No. NTB / No. SSPD</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>

                  {/* Kolom 3: Nama Wajib Pajak / Objek Pajak */}
                  <th className="py-3 px-3">
                    <button 
                      onClick={() => handleToggleTxSort('wp')} 
                      className="inline-flex items-center gap-1.5 hover:text-[#1B365D] cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>3. Nama Wajib Pajak / Objek Pajak</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>

                  {/* Kolom 4: Masa Pajak (Bulan/Tahun) */}
                  <th className="py-3 px-3">4. Masa Pajak</th>

                  {/* Kolom 5: Jumlah Setoran (Rp) */}
                  <th className="py-3 px-3 text-right">
                    <button 
                      onClick={() => handleToggleTxSort('nominal')} 
                      className="inline-flex items-center gap-1.5 hover:text-[#1B365D] cursor-pointer"
                    >
                      <span>5. Jumlah Setoran (Rp)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>

                  {/* Kolom 6: Status Pembayaran (Lunas / Diverifikasi Kasda) */}
                  <th className="py-3 px-3.5 text-center">6. Status Pembayaran</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {currentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Receipt className="w-8 h-8 text-slate-300 stroke-1" />
                        <span className="font-medium text-slate-600">Tidak ada transaksi pembayaran pada rentang tanggal atau filter ini.</span>
                        <span className="text-[11px] text-slate-400">Silakan ubah rentang tanggal cut-off di header atas atau reset kata kunci pencarian.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((tx, txIdx) => {
                    const wpObj = taxPayers.find(w => w.npwpd === tx.npwpd) || taxPayers[0];

                    return (
                      <tr 
                        key={`${tx.id}-${txIdx}`}
                        onClick={() => {
                          if (wpObj) onSelectTaxPayer(wpObj, sector);
                        }}
                        className="hover:bg-amber-50/50 transition-colors cursor-pointer group"
                      >
                        {/* 1. Tanggal Bayar / TGL SSPD */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 text-xs block tabular-nums group-hover:text-[#1B365D]">
                              {tx.tanggalBayar}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock className="w-3 h-3 text-[#E67E22] shrink-0" />
                              <span>Pukul {tx.tanggalBayar.split(' ')[1] || '09:00:00'} WIB</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. No. NTB / No. SSPD */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 text-xs block tabular-nums">
                              {tx.noNtb}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 tabular-nums">
                              <span className="text-[#1B365D] font-medium">{tx.noSspd}</span>
                              <span>•</span>
                              <span className="text-slate-400">{tx.bankPenampung.split(' ')[0]}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Nama Wajib Pajak / Objek Pajak */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 group-hover:text-[#1B365D] text-xs block transition-colors">
                              {tx.namaWajibPajak}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <span className="text-slate-700 font-medium">{tx.namaObjek}</span>
                              <span>•</span>
                              <span className="text-slate-400 tabular-nums">{tx.npwpd}</span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Masa Pajak */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs inline-block">
                            {tx.masaPajak}
                          </span>
                        </td>

                        {/* 5. Jumlah Setoran (Rp) */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="font-bold text-[#1B365D] text-xs sm:text-sm tabular-nums block">
                            {formatRupiah(tx.nominal)}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            via {tx.metodeBayar}
                          </span>
                        </td>

                        {/* 6. Status Pembayaran */}
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{tx.statusValidasi}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Transaksi */}
          <Pagination
            currentPage={txPage}
            totalPages={totalTxPages}
            onPageChange={setTxPage}
            startIndex={startTxIndex}
            pageSize={txPageSize}
            totalItems={totalTxItems}
            itemName="transaksi per tanggal"
          />
        </div>
      ) : (
        /* 4. TAMPILAN TAB 2: DAFTAR WAJIB PAJAK LENGKAP */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-xs font-semibold border-b border-slate-200">
                  <th className="py-3 px-3.5">
                    <button onClick={() => handleToggleWpSort('nama')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                      <span>Wajib Pajak & NOPD</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3">Objek Pajak & Lokasi</th>
                  <th className="py-3 px-3 text-right">
                    <button onClick={() => handleToggleWpSort('target')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                      <span>Target 2026</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button onClick={() => handleToggleWpSort('realisasi')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                      <span>Realisasi Kas 2026</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button onClick={() => handleToggleWpSort('bulanIni')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                      <span>Setoran Bln Ini</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-right">
                    <button onClick={() => handleToggleWpSort('persen')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                      <span>% Capaian</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center">Rincian Per Tanggal</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {currentTaxPayers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      Tidak ada Wajib Pajak yang sesuai dengan kata kunci pencarian.
                    </td>
                  </tr>
                ) : (
                  currentTaxPayers.map((wp, wpIdx) => {
                    const persen = wp.target2026 > 0 ? (wp.realisasi2026 / wp.target2026) * 100 : 0;
                    const isWpExpanded = expandedWpNpwpd === wp.npwpd;
                    const wpTransactions = generateTaxTransactions(wp);
                    const wpDateFiltered = filterTransactionsByDate(wpTransactions, filterStartDate, filterEndDate);

                    return (
                      <React.Fragment key={`${sector.id}-wp-${wp.npwpd}-${wpIdx}`}>
                        <tr 
                          onClick={() => onSelectTaxPayer(wp, sector)}
                          className={`hover:bg-amber-50/50 transition-colors cursor-pointer group ${isWpExpanded ? 'bg-amber-50/30' : ''}`}
                        >
                          {/* Nama WP & NPWPD / NOPD */}
                          <td className="py-3 px-3.5">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 group-hover:text-[#1B365D] text-xs block transition-colors">
                                {wp.namaWajibPajak}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 tabular-nums">
                                <span className="font-normal">{wp.npwpd}</span>
                                {wp.nopd && (
                                  <>
                                    <span>•</span>
                                    <span className="text-[#E67E22] font-semibold">{wp.nopd}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Objek Pajak & Wilayah */}
                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <span className="font-medium text-slate-800 text-xs block">
                                {wp.namaObjek}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                <MapPin className="w-3 h-3 text-[#E67E22] shrink-0" />
                                <span>{wp.kelurahan}, {wp.kecamatan}</span>
                              </div>
                            </div>
                          </td>

                          {/* Target 2026 */}
                          <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-800" title={formatRupiah(wp.target2026)}>
                            {formatRupiahShort(wp.target2026, true)}
                          </td>

                          {/* Realisasi 2026 */}
                          <td className="py-3 px-3 text-right tabular-nums font-bold text-[#1B365D]" title={formatRupiah(wp.realisasi2026)}>
                            {formatRupiahShort(wp.realisasi2026, true)}
                          </td>

                          {/* Setoran Bulan Berjalan */}
                          <td className="py-3 px-3 text-right tabular-nums font-semibold text-emerald-700" title={formatRupiah(wp.setoranBulanIni)}>
                            {formatRupiahShort(wp.setoranBulanIni, true)}
                          </td>

                          {/* % Capaian */}
                          <td className="py-3 px-3 text-right tabular-nums font-semibold">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                              persen >= 100 ? 'bg-emerald-100 text-emerald-800' :
                              persen >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {formatPercentage(persen)}
                            </span>
                          </td>

                          {/* Status Kepatuhan */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                              wp.statusKepatuhan === 'Patuh' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              wp.statusKepatuhan === 'Kurang Bayar' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {wp.statusKepatuhan}
                            </span>
                          </td>

                          {/* Aksi: Buka Transaksi Per Tanggal Inline & Modal */}
                          <td className="py-3 px-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedWpNpwpd(isWpExpanded ? null : wp.npwpd);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                  isWpExpanded
                                    ? 'bg-[#1B365D] text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Lihat Transaksi Per Tanggal WP Ini"
                              >
                                <Calendar className="w-3 h-3 text-[#E67E22]" />
                                <span>Per Tanggal ({wpDateFiltered.length})</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${isWpExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* INLINE SUB-SUB TABLE TRANSAKSI PER TANGGAL KHUSUS WP INI */}
                        {isWpExpanded && (
                          <tr>
                            <td colSpan={8} className="p-3.5 bg-slate-100/70 border-y border-slate-200">
                              <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2 shadow-2xs">
                                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                                  <div className="flex items-center gap-2 font-bold text-slate-900">
                                    <Receipt className="w-3.5 h-3.5 text-[#E67E22]" />
                                    <span>Rincian Pembayaran Per Tanggal: {wp.namaWajibPajak}</span>
                                  </div>
                                  <span className="text-[11px] text-slate-500">
                                    Periode: {formatDateLabel(filterStartDate)} s.d. {formatDateLabel(filterEndDate)}
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                                        <th className="py-2 px-2.5">1. Tanggal Bayar</th>
                                        <th className="py-2 px-2">2. No. NTB / SSPD</th>
                                        <th className="py-2 px-2">3. Objek Pajak</th>
                                        <th className="py-2 px-2">4. Masa Pajak</th>
                                        <th className="py-2 px-2 text-right">5. Jumlah Setoran (Rp)</th>
                                        <th className="py-2 px-2.5 text-center">6. Status Pembayaran</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {wpDateFiltered.length === 0 ? (
                                        <tr>
                                          <td colSpan={6} className="py-4 text-center text-slate-400 text-xs">
                                            Tidak ada pembayaran pada rentang tanggal ini.
                                          </td>
                                        </tr>
                                      ) : (
                                        wpDateFiltered.map((tx, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50">
                                            <td className="py-2 px-2.5 font-semibold text-slate-900 tabular-nums">
                                              {tx.tanggalBayar}
                                            </td>
                                            <td className="py-2 px-2 text-slate-700 font-medium tabular-nums">
                                              {tx.noNtb}
                                            </td>
                                            <td className="py-2 px-2 text-slate-700">
                                              {tx.namaObjek}
                                            </td>
                                            <td className="py-2 px-2 font-medium text-slate-800">
                                              {tx.masaPajak}
                                            </td>
                                            <td className="py-2 px-2 text-right font-bold text-[#1B365D] tabular-nums">
                                              {formatRupiah(tx.nominal)}
                                            </td>
                                            <td className="py-2 px-2.5 text-center">
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                <span>Lunas / Diverifikasi Kasda</span>
                                              </span>
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for WP List */}
          <Pagination
            currentPage={wpPage}
            totalPages={totalWpPages}
            onPageChange={setWpPage}
            startIndex={startWpIndex}
            pageSize={wpPageSize}
            totalItems={totalWpItems}
            itemName="Wajib Pajak"
          />
        </div>
      )}
    </motion.div>
  );
};
