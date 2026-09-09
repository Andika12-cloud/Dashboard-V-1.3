import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Printer, Copy, Check } from 'lucide-react';
import { TAX_DATA, SUMMARY_TOTALS } from '../data/dummy';
import { formatRupiah, formatPercentage } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = [
      'No',
      'Jenis Pajak',
      'Kode Rekening',
      'Target Tahun 2026',
      'Realisasi Tahun 2026',
      'Persentase Tahun (%)',
      'Target TW III',
      'Realisasi TW III',
      'Persentase TW III (%)',
    ];

    const rows = TAX_DATA.map((t) => [
      t.no,
      `"${t.jenisPajak}"`,
      t.code,
      t.targetTahun,
      t.realisasiTahun,
      t.persentaseTahun,
      t.targetTriwulan,
      t.realisasiTriwulan,
      t.persentaseTriwulan,
    ]);

    // Subtotal & Total rows
    rows.push([
      '',
      '"Sub Total (Pajak Murni)"',
      '-',
      SUMMARY_TOTALS.subTotalPajakMurni.targetTahun,
      SUMMARY_TOTALS.subTotalPajakMurni.realisasiTahun,
      SUMMARY_TOTALS.subTotalPajakMurni.persentaseTahun,
      SUMMARY_TOTALS.subTotalPajakMurni.targetTriwulan,
      SUMMARY_TOTALS.subTotalPajakMurni.realisasiTriwulan,
      SUMMARY_TOTALS.subTotalPajakMurni.persentaseTriwulan,
    ]);

    rows.push([
      '',
      '"TOTAL KESELURUHAN"',
      '-',
      SUMMARY_TOTALS.totalKeseluruhan.targetTahun,
      SUMMARY_TOTALS.totalKeseluruhan.realisasiTahun,
      SUMMARY_TOTALS.totalKeseluruhan.persentaseTahun,
      SUMMARY_TOTALS.totalKeseluruhan.targetTriwulan,
      SUMMARY_TOTALS.totalKeseluruhan.realisasiTriwulan,
      SUMMARY_TOTALS.totalKeseluruhan.persentaseTriwulan,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Pendapatan_Pajak_Daerah_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const copyToClipboard = () => {
    const textData = TAX_DATA.map(t => 
      `${t.no}. ${t.jenisPajak} | Target: ${formatRupiah(t.targetTahun)} | Realisasi: ${formatRupiah(t.realisasiTahun)} (${formatPercentage(t.persentaseTahun)})`
    ).join('\n');

    navigator.clipboard.writeText(
      `LAPORAN REALISASI PAJAK DAERAH TA 2026\nPer 1 September 2026\n\n${textData}\n\nTOTAL: Realisasi ${formatRupiah(SUMMARY_TOTALS.totalKeseluruhan.realisasiTahun)} dari Target ${formatRupiah(SUMMARY_TOTALS.totalKeseluruhan.targetTahun)} (${formatPercentage(SUMMARY_TOTALS.totalKeseluruhan.persentaseTahun)})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center border border-[#1B365D]/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Ekspor Laporan Pendapatan</h3>
              <p className="text-xs text-slate-500">Pilih format unduhan data rekapitulasi Bapenda Kota Cimahi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Option 1: CSV / Excel */}
          <button
            onClick={downloadCSV}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#E67E22] hover:bg-[#E67E22]/5 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E67E22]/10 text-[#E67E22] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E67E22]/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Unduh Format CSV / Excel</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tabel lengkap target, realisasi, & persentase</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#E67E22] group-hover:translate-x-0.5 transition-transform">.CSV</span>
          </button>

          {/* Option 2: Copy Text */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#1B365D] hover:bg-[#1B365D]/5 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#1B365D]/20">
                {copied ? <Check className="w-5 h-5 text-[#27AE60]" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin Ringkasan Teks'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Format siap dikirim via WhatsApp / Email</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          {/* Option 3: Print View */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#27AE60] hover:bg-[#27AE60]/5 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 text-[#27AE60] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#27AE60]/20">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Cetak Laporan / Simpan PDF</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Layout ramah cetak halaman dashboard</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#27AE60]">Cetak</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
