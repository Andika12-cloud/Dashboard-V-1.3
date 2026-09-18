import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TaxSectorReportItem } from '../../data/reportData';
import { formatRupiah, formatPercentage } from '../../utils/formatters';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TaxSectorReportItem[];
  filterStartDate: string;
  filterEndDate: string;
  selectedKecamatan: string;
  isYoYEnabled: boolean;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  filterStartDate,
  filterEndDate,
  selectedKecamatan,
  isYoYEnabled,
}) => {
  if (!isOpen) return null;

  const totalTarget2026 = data.reduce((acc, curr) => acc + curr.target2026, 0);
  const totalRealisasi2026 = data.reduce((acc, curr) => acc + curr.realisasi2026, 0);
  const totalPersen2026 = totalTarget2026 > 0 ? (totalRealisasi2026 / totalTarget2026) * 100 : 0;
  
  const totalRealisasi2025 = data.reduce((acc, curr) => acc + curr.realisasi2025, 0);
  const totalGrowthNominal = totalRealisasi2026 - totalRealisasi2025;
  const totalGrowthPersen = totalRealisasi2025 > 0 ? (totalGrowthNominal / totalRealisasi2025) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Top Floating Control Bar */}
        <div className="bg-[#1B365D] text-white px-6 py-3.5 flex items-center justify-between border-b border-[#1B365D]/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">Pratinjau Dokumen Cetak Resmi (Kop Bapenda)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-white text-slate-900 font-serif print:p-0 print:max-h-none print:overflow-visible">
          
          {/* KOP SURAT RESMI PEMERINTAH KOTA CIMAHI */}
          <div className="flex items-center justify-between pb-3 border-b-4 border-double border-slate-900 text-center relative">
            {/* Logo Lambang Kota Cimahi */}
            <div className="w-20 h-20 flex items-center justify-center shrink-0">
              <img
                src="/assets/Bapenda-Logo2.png" 
                alt="Logo Bapenda Kota Cimahi" 
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain" 
              />
            </div>

            {/* Teks Kop Surat */}
            <div className="flex-1 px-4 text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 font-sans">
                PEMERINTAH DAERAH KOTA CIMAHI
              </h3>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-950 font-sans">
                BADAN PENDAPATAN DAERAH
              </h2>
              <p className="text-[11px] text-slate-600 font-sans leading-tight mt-0.5">
                Kompleks Perkantoran Pemkot Cimahi, Gedung B Lantai 2<br />
                Jl. Rd. Demang Hardjakusumah Blok Jati Cihanjuang, Cimahi 40513<br />
                Telp: (022) 6654274 • Fax: (022) 6654274 • Laman: bapenda.cimahikota.go.id
              </p>
            </div>

            {/* Spacer / QR Code Verification */}
            <div className="w-20 flex flex-col items-center justify-center shrink-0">
              <div className="w-16 h-16 border border-slate-300 rounded p-1 bg-slate-50 flex flex-col items-center justify-center text-[7px] text-center font-sans font-bold text-slate-500">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
                <span>E-VALID</span>
              </div>
            </div>
          </div>

          {/* DOKUMEN HEADER & PERIODE */}
          <div className="text-center my-5">
            <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide underline decoration-1 underline-offset-4 font-sans">
              LAPORAN REALISASI PENERIMAAN PAJAK DAERAH
            </h1>
            <p className="text-xs text-slate-600 font-sans font-semibold mt-1">
              Nomor: 973 / 1482 - BAPENDA / 2026
            </p>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Periode: <strong>{filterStartDate}</strong> s.d. <strong>{filterEndDate}</strong> | Wilayah: <strong>{selectedKecamatan}</strong>
            </p>
          </div>

          {/* TABEL DATA RESMI */}
          <div className="w-full my-4 font-sans text-xs border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-800 text-[10px] uppercase">
                  <th className="p-2 border-r border-slate-800 text-center w-8">NO</th>
                  <th className="p-2 border-r border-slate-800 text-center w-20">KODE REK.</th>
                  <th className="p-2 border-r border-slate-800">JENIS PAJAK DAERAH</th>
                  <th className="p-2 border-r border-slate-800 text-right">TARGET 2026 (Rp)</th>
                  <th className="p-2 border-r border-slate-800 text-right">REALISASI 2026 (Rp)</th>
                  <th className="p-2 border-r border-slate-800 text-center w-14">%</th>
                  {isYoYEnabled && (
                    <>
                      <th className="p-2 border-r border-slate-800 text-right bg-amber-50/50">REALISASI 2025 (Rp)</th>
                      <th className="p-2 text-right bg-amber-50/50 w-20">PERTUMBUHAN (YoY)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400 text-[11px]">
                {data.map((item, idx) => {
                  const persen = item.target2026 > 0 ? (item.realisasi2026 / item.target2026) * 100 : 0;
                  const growthNominal = item.realisasi2026 - item.realisasi2025;
                  const growthPersen = item.realisasi2025 > 0 ? (growthNominal / item.realisasi2025) * 100 : 0;

                  return (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-2 border-r border-slate-400 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-400 font-mono text-[10px] text-slate-700">{item.code}</td>
                      <td className="p-2 border-r border-slate-400 font-semibold">{item.jenisPajak}</td>
                      <td className="p-2 border-r border-slate-400 text-right font-mono">{formatRupiah(item.target2026)}</td>
                      <td className="p-2 border-r border-slate-400 text-right font-mono font-bold text-slate-950">{formatRupiah(item.realisasi2026)}</td>
                      <td className="p-2 border-r border-slate-400 text-center font-mono font-bold">{formatPercentage(persen)}</td>
                      {isYoYEnabled && (
                        <>
                          <td className="p-2 border-r border-slate-400 text-right font-mono text-slate-600 bg-amber-50/20">{formatRupiah(item.realisasi2025)}</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800 bg-amber-50/20">
                            {growthPersen >= 0 ? `+${formatPercentage(growthPersen)}` : formatPercentage(growthPersen)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}

                {/* TOTAL JUMLAH */}
                <tr className="bg-slate-200 text-slate-950 font-bold border-t-2 border-slate-800 text-[11px]">
                  <td colSpan={3} className="p-2 border-r border-slate-800 text-center uppercase tracking-wider">
                    TOTAL KESELURUHAN PAJAK DAERAH
                  </td>
                  <td className="p-2 border-r border-slate-800 text-right font-mono">{formatRupiah(totalTarget2026)}</td>
                  <td className="p-2 border-r border-slate-800 text-right font-mono font-black">{formatRupiah(totalRealisasi2026)}</td>
                  <td className="p-2 border-r border-slate-800 text-center font-mono font-black">{formatPercentage(totalPersen2026)}</td>
                  {isYoYEnabled && (
                    <>
                      <td className="p-2 border-r border-slate-800 text-right font-mono font-bold bg-amber-100/50">{formatRupiah(totalRealisasi2025)}</td>
                      <td className="p-2 text-right font-mono font-black bg-amber-100/50">
                        {totalGrowthPersen >= 0 ? `+${formatPercentage(totalGrowthPersen)}` : formatPercentage(totalGrowthPersen)}
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* CATATAN CUT-OFF & PENGESAHAN */}
          <div className="grid grid-cols-2 gap-6 mt-6 font-sans text-xs">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded text-[10px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Keterangan Dokumen:</span>
              </p>
              <p>1. Data bersumber dari Kasda dan SIPD-RI terverifikasi otomatis.</p>
              <p>2. Dokumen ini sah digunakan untuk evaluasi APBD dan pemeriksaan BPK.</p>
              <p>3. Dicetak pada tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
            </div>

            {/* LEMBAR TANDA TANGAN PEJABAT */}
            <div className="text-center font-sans">
              <p className="text-[11px] text-slate-600">Cimahi, 1 September 2026</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">Kepala Badan Pendapatan Daerah Kota Cimahi</p>
              
              {/* TTE Box */}
              <div className="my-3 py-2 px-4 inline-block border border-dashed border-slate-400 bg-slate-50 rounded text-[9px] text-slate-500 font-mono">
                [ Ditandatangani Secara Elektronik oleh BSrE BSSN ]
              </div>

              <p className="font-bold text-xs text-slate-900 underline underline-offset-2">
                H. MOCHAMAD RONI, S.Sos., M.Si.
              </p>
              <p className="text-[10px] font-mono text-slate-600">
                Pembina Utama Muda / NIP. 19700315 199603 1 003
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs font-sans">
          <span className="text-slate-500 text-[11px]">
            * Dokumen resmi berstandar format laporan akuntansi pemerintah daerah.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
