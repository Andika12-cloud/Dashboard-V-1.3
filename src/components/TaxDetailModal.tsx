'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  Landmark, 
  Calendar, 
  PieChart
} from 'lucide-react';
import { TaxItem } from '../types';
import { formatRupiah, formatRupiahShort, formatPercentage, getPercentageStatus } from '../utils/formatters';

interface TaxDetailModalProps {
  taxItem: TaxItem | null;
  onClose: () => void;
}

export const TaxDetailModal: React.FC<TaxDetailModalProps> = ({ taxItem, onClose }) => {
  // Dukungan tombol Escape keyboard untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (taxItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taxItem, onClose]);

  if (!taxItem) return null;

  const statusTahun = getPercentageStatus(taxItem.persentaseTahun);
  const statusTriwulan = getPercentageStatus(taxItem.persentaseTriwulan);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Color Accent */}
        <div className="p-6 border-b border-slate-100 relative" style={{ backgroundColor: `${taxItem.color}08` }}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 shadow-xs transition-colors cursor-pointer"
            aria-label="Tutup Rincian"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: taxItem.color }}
            >
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 tabular-nums">
                  {taxItem.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1B365D]/10 text-[#1B365D] border border-[#1B365D]/20">
                  {taxItem.group}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                {taxItem.jenisPajak}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            {taxItem.deskripsi || 'Rincian target penerimaan dan realisasi kas pendapatan daerah Bapenda Kota Cimahi.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Main 2-Column Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tahun Berjalan Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Tahun Berjalan 2026
              </span>
              <div className="mt-2">
                <p className="text-xs text-slate-500">Realisasi:</p>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatRupiah(taxItem.realisasiTahun)}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 tabular-nums">Target: {formatRupiahShort(taxItem.targetTahun)}</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] tabular-nums ${statusTahun.badgeClass}`}>
                  {formatPercentage(taxItem.persentaseTahun)}
                </span>
              </div>
            </div>

            {/* Triwulan Berjalan Box */}
            <div className="p-4 rounded-2xl bg-[#27AE60]/10 border border-[#27AE60]/20">
              <span className="text-xs font-semibold text-[#27AE60]">
                Triwulan III 2026
              </span>
              <div className="mt-2">
                <p className="text-xs text-slate-500">Realisasi TW:</p>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatRupiah(taxItem.realisasiTriwulan)}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-[#27AE60]/20 flex items-center justify-between text-xs">
                <span className="text-slate-500 tabular-nums">Target: {formatRupiahShort(taxItem.targetTriwulan)}</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] tabular-nums ${statusTriwulan.badgeClass}`}>
                  {formatPercentage(taxItem.persentaseTriwulan)}
                </span>
              </div>
            </div>
          </div>

          {/* Quarterly Progression Breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-2">
              Progres Triwulan Realisasi
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Triwulan I (Jan - Mar)', val: taxItem.triwulan1 || 0, status: '100% Selesai' },
                { label: 'Triwulan II (Apr - Jun)', val: taxItem.triwulan2 || 0, status: '100% Selesai' },
                { label: 'Triwulan III (Jul - Sep)', val: taxItem.triwulan3 || 0, status: 'Aktif Berjalan' },
              ].map((tw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{tw.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 tabular-nums">{formatRupiah(tw.val)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                      {tw.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kontribusi Info */}
          <div className="p-3.5 rounded-2xl bg-[#E67E22]/10 border border-[#E67E22]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#E67E22]" />
              <span className="font-semibold text-[#1B365D]">Kontribusi Terhadap Total PAD:</span>
            </div>
            <span className="font-bold text-[#E67E22] text-sm tabular-nums">
              {taxItem.kontribusiPersen}%
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Kategori: <strong className="text-slate-700">{taxItem.category === 'pajak_murni' ? 'Pajak Asli Daerah' : 'Opsen Pajak Provinsi'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1B365D] hover:bg-[#10223D] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
