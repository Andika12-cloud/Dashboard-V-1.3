import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Helper function to generate compact pagination range with ellipses (...)
 * Example output: [1, '...', 4, 5, 6, '...', 41]
 */
export const getPaginationRange = (currentPage: number, totalPages: number): (number | string)[] => {
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  let l: number | null = null;
  for (const i of range) {
    if (l !== null) {
      if (typeof i === 'number' && i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (typeof i === 'number' && i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = typeof i === 'number' ? i : l;
  }

  return rangeWithDots;
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex?: number;
  pageSize?: number;
  totalItems?: number;
  itemName?: string;
  infoText?: React.ReactNode;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  pageSize,
  totalItems,
  itemName = 'transaksi',
  infoText,
  className = ''
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems === 0)) return null;

  const paginationRange = getPaginationRange(currentPage, totalPages);

  const startDisplay = startIndex !== undefined ? startIndex + 1 : 1;
  const endDisplay = startIndex !== undefined && pageSize !== undefined && totalItems !== undefined
    ? Math.min(startIndex + pageSize, totalItems)
    : totalItems || 0;

  return (
    <div className={`bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${className}`}>
      {/* Teks Penjelas di Sebelah Kiri */}
      <div className="text-slate-600 order-2 sm:order-1 text-center sm:text-left">
        {infoText ? (
          infoText
        ) : totalItems !== undefined ? (
          <span>
            Menampilkan <strong className="text-slate-800 font-semibold">{startDisplay}</strong> s.d{' '}
            <strong className="text-slate-800 font-semibold">{endDisplay}</strong> dari{' '}
            <strong className="text-slate-800 font-semibold">{totalItems}</strong> {itemName}
          </span>
        ) : null}
      </div>

      {/* Kontrol Tombol Pagination di Sebelah Kanan */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 order-1 sm:order-2">
          {/* Tombol Sebelumnya (<) */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-[#1B365D] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            title="Halaman Sebelumnya"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Angka Halaman & Ellipsis (...) */}
          {paginationRange.map((item, idx) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-8 flex items-center justify-center text-slate-400 font-bold select-none text-xs tracking-wider"
                >
                  ...
                </span>
              );
            }

            const pageNum = item as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#1B365D] text-white shadow-xs border border-[#1B365D]'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#1B365D] shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Tombol Berikutnya (>) */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-[#1B365D] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            title="Halaman Berikutnya"
            aria-label="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
