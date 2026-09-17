import React, { useState, useMemo } from 'react';
import { 
  X, 
  Receipt, 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  FileText, 
  Clock,
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaxPayerDetail, TaxTransactionRecord, generateTaxTransactions } from '../../data/reportData';
import { formatRupiah, formatRupiahShort, formatPercentage } from '../../utils/formatters';

interface TaxPayerDetailModalProps {
  taxPayer: TaxPayerDetail | null;
  sectorName: string;
  sectorCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TaxPayerDetailModal: React.FC<TaxPayerDetailModalProps> = ({
  taxPayer,
  sectorName,
  sectorCode,
  isOpen,
  onClose,
}) => {
  const [searchTx, setSearchTx] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedSspdForPrint, setSelectedSspdForPrint] = useState<TaxTransactionRecord | null>(null);

  // Generate transaction records for this WP
  const allTransactions = useMemo(() => {
    if (!taxPayer) return [];
    return generateTaxTransactions(taxPayer);
  }, [taxPayer]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      if (selectedBankFilter !== 'ALL' && !tx.bankPenampung.includes(selectedBankFilter)) {
        return false;
      }
      if (searchTx.trim()) {
        const q = searchTx.toLowerCase();
        const matchesSspd = tx.noSspd.toLowerCase().includes(q);
        const matchesNtb = tx.noNtb.toLowerCase().includes(q);
        const matchesNtpd = tx.ntpd.toLowerCase().includes(q);
        const matchesMasa = tx.masaPajak.toLowerCase().includes(q);
        const matchesBank = tx.bankPenampung.toLowerCase().includes(q);
        const matchesDate = tx.tanggalBayar.toLowerCase().includes(q);
        return matchesSspd || matchesNtb || matchesNtpd || matchesMasa || matchesBank || matchesDate;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.tanggalBayar.replace(' ', 'T')).getTime();
      const dateB = new Date(b.tanggalBayar.replace(' ', 'T')).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [allTransactions, searchTx, selectedBankFilter, sortOrder]);

  if (!isOpen || !taxPayer) return null;

  const persenCapaian = taxPayer.target2026 > 0 ? (taxPayer.realisasi2026 / taxPayer.target2026) * 100 : 0;
  const totalFilteredNominal = filteredTransactions.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs font-sans text-slate-800">
        {/* Backdrop Click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Header Modal */}
          <div className="bg-[#1B365D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20 shrink-0">
                <img
                  src="/assets/Bapenda-Logo.png" 
                  alt="Logo Bapenda Kota Cimahi" 
                  className="w-9 h-9 object-contain" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E67E22] text-white">
                    Rincian Pembayaran Per Tanggal & SSPD
                  </span>
                  <span className="text-xs text-slate-300 tabular-nums font-semibold">
                    {sectorCode} • {sectorName}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 tracking-tight">
                  {taxPayer.namaWajibPajak}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-amber-300">{taxPayer.namaObjek}</span>
                  <span>•</span>
                  <span className="tabular-nums">NPWPD: {taxPayer.npwpd}</span>
                  {taxPayer.nopd && (
                    <>
                      <span>•</span>
                      <span className="tabular-nums">NOPD: {taxPayer.nopd}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable */}
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
            {/* 1. Identity & Location Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lokasi & Objek Pajak</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                  <span>{taxPayer.alamat || 'Kota Cimahi'}</span>
                </p>
                <p className="text-[11px] text-slate-500 pl-5">
                  Kel. {taxPayer.kelurahan}, Kec. {taxPayer.kecamatan}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kontak & Penanggung Jawab</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1B365D] shrink-0" />
                  <span>PIC: {taxPayer.pic || taxPayer.namaWajibPajak}</span>
                </p>
                <p className="text-[11px] text-slate-500 pl-5 flex items-center gap-1 tabular-nums">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{taxPayer.telepon || '022-6650000'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Kepatuhan Pajak</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    taxPayer.statusKepatuhan === 'Patuh' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    taxPayer.statusKepatuhan === 'Kurang Bayar' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{taxPayer.statusKepatuhan}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Validasi Kasda Aktif</span>
                </div>
              </div>
            </div>

            {/* 2. KPI Metrics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target TA 2026</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-1 block">
                  {formatRupiah(taxPayer.target2026)}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">Ketetapan Tahunan</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Realisasi 2026</span>
                <span className="text-base sm:text-lg font-bold text-[#27AE60] tabular-nums mt-1 block">
                  {formatRupiah(taxPayer.realisasi2026)}
                </span>
                <span className="text-xs text-[#27AE60] font-semibold mt-0.5 block tabular-nums">
                  Capaian: {formatPercentage(persenCapaian)}
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Setoran Bulan Ini</span>
                <span className="text-base sm:text-lg font-bold text-[#1B365D] tabular-nums mt-1 block">
                  {formatRupiah(taxPayer.setoranBulanIni)}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">September 2026</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Transaksi SSPD</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-1 block">
                  {allTransactions.length} Setoran
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">Tercatat Kasda</span>
              </div>
            </div>

            {/* 3. SUB-TABEL RINCIAN TRANSAKSI PEMBAYARAN PER TANGGAL (6 KOLOM) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#1B365D]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Rincian Transaksi Pembayaran Harian / Per Tanggal (Level 3)
                  </h3>
                </div>

                {/* Filter & Search inside modal */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-48 sm:w-60">
                    <input
                      type="text"
                      placeholder="Cari NTB, SSPD, masa..."
                      value={searchTx}
                      onChange={(e) => setSearchTx(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1B365D]"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <select
                    value={selectedBankFilter}
                    onChange={(e) => setSelectedBankFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:border-[#1B365D] cursor-pointer"
                  >
                    <option value="ALL">Semua Bank</option>
                    <option value="bjb">Bank bjb</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="Pos">PT Pos Indonesia</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table with 6 Columns */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">
                        <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="inline-flex items-center gap-1 hover:text-[#1B365D] cursor-pointer">
                          <span>1. Tanggal Bayar / TGL SSPD</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </button>
                      </th>
                      <th className="py-2.5 px-3">2. No. NTB / No. SSPD</th>
                      <th className="py-2.5 px-3">3. Nama Wajib Pajak / Objek</th>
                      <th className="py-2.5 px-3">4. Masa Pajak</th>
                      <th className="py-2.5 px-3 text-right">5. Jumlah Setoran (Rp)</th>
                      <th className="py-2.5 px-3 text-center">6. Status Pembayaran</th>
                      <th className="py-2.5 px-3 text-center">Slip SSPD</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          Tidak ada catatan transaksi yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          {/* 1. Tanggal Bayar */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-slate-900 tabular-nums block">
                              {tx.tanggalBayar}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {tx.bankPenampung}
                            </span>
                          </td>

                          {/* 2. No. NTB / SSPD */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-semibold text-slate-900 tabular-nums block">
                              {tx.noNtb}
                            </span>
                            <span className="text-[11px] text-slate-500 tabular-nums block">
                              {tx.noSspd}
                            </span>
                          </td>

                          {/* 3. Nama Wajib Pajak / Objek */}
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 text-xs block">
                              {tx.namaWajibPajak}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {tx.namaObjek}
                            </span>
                          </td>

                          {/* 4. Masa Pajak */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                            {tx.masaPajak}
                          </td>

                          {/* 5. Jumlah Setoran */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-[#1B365D] tabular-nums">
                            {formatRupiah(tx.nominal)}
                          </td>

                          {/* 6. Status Pembayaran */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{tx.statusValidasi}</span>
                            </span>
                          </td>

                          {/* Action: Print SSPD Slip */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedSspdForPrint(tx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#1B365D] text-slate-700 hover:text-white font-semibold text-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                              title="Lihat & Cetak Bukti Setor SSPD"
                            >
                              <FileText className="w-3 h-3 text-[#E67E22]" />
                              <span>Lihat Slip</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900 text-xs">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 uppercase tracking-wider text-[11px]">
                        TOTAL NOMINAL TRANSAKSI TAMPIL ({filteredTransactions.length} SETORAN)
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-[#1B365D] font-bold">
                        {formatRupiah(totalFilteredNominal)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SSPD SLIP POPUP MODAL (IF SELECTED) */}
            {selectedSspdForPrint && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/Bapenda-Logo.png" 
                        alt="Logo Bapenda Kota Cimahi" 
                        className="w-7 h-7 object-contain shrink-0" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">SURAT SETORAN PAJAK DAERAH (SSPD)</h4>
                        <p className="text-[10px] text-slate-500">Badan Pendapatan Daerah Kota Cimahi</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSspdForPrint(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Slip Body */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">No. NTB (Bank):</span>
                      <span className="font-bold text-slate-900 tabular-nums">{selectedSspdForPrint.noNtb}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">No. SSPD:</span>
                      <span className="font-bold text-slate-900 tabular-nums">{selectedSspdForPrint.noSspd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">NTPD Kasda:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{selectedSspdForPrint.ntpd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Wajib Pajak:</span>
                      <span className="font-bold text-slate-900">{selectedSspdForPrint.namaWajibPajak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Objek Pajak:</span>
                      <span className="font-medium text-slate-800">{selectedSspdForPrint.namaObjek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Masa Pajak:</span>
                      <span className="font-semibold text-slate-900">{selectedSspdForPrint.masaPajak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tanggal Bayar:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{selectedSspdForPrint.tanggalBayar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank Penampung:</span>
                      <span className="font-medium text-slate-800">{selectedSspdForPrint.bankPenampung}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">JUMLAH SETORAN:</span>
                      <span className="text-base font-bold text-[#1B365D] tabular-nums">
                        {formatRupiah(selectedSspdForPrint.nominal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-[#1B365D] hover:bg-[#10223D] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Bukti Setor</span>
                    </button>
                    <button
                      onClick={() => setSelectedSspdForPrint(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
