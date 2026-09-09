import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export interface CustomDatePickerProps {
  value: string; // Format: 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
  align?: 'left' | 'right';
  onShortcutSelect?: (type: 'hari_ini' | 'bulan_ini' | 'tahun_ini', year: number) => void;
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Pilih tanggal...',
  minYear = 2019,
  maxYear = 2026,
  className = '',
  align = 'left',
  onShortcutSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsing tanggal awal dari value (YYYY-MM-DD)
  const parseDate = (str: string): Date => {
    if (!str) return new Date(2026, 8, 7); // Default 7 September 2026 jika kosong
    const parts = str.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  };

  const parsedDate = useMemo(() => parseDate(value), [value]);
  const [viewYear, setViewYear] = useState<number>(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsedDate.getMonth());

  // Sinkronisasi view bila value diubah dari luar
  useEffect(() => {
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  // Tutup kalender jika klik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Format tanggal Indonesia rapi: "01 September 2026"
  const formattedDisplay = (str: string) => {
    if (!str) return placeholder;
    const parts = str.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const mIdx = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (mIdx >= 0 && mIdx < 12) {
        return `${d < 10 ? '0' + d : d} ${NAMA_BULAN[mIdx]} ${y}`;
      }
    }
    return str;
  };

  // Navigasi bulan
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setViewYear((prev) => prev - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewYear((prev) => prev + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate Hari Kalender
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Hari pertama bulan (0 = Minggu/Min)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Daftar tahun untuk select cepat
  const yearsList = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  // Cek apakah hari sedang aktif / terpilih
  const isSelected = (day: number) => {
    if (!value) return false;
    const parts = value.split('-').map(Number);
    return parts[0] === viewYear && parts[1] === viewMonth + 1 && parts[2] === day;
  };

  // Cek apakah hari ini (sistem cut-off saat ini: 7 September 2026 atau tanggal sistem)
  const isToday = (day: number) => {
    // Patokan tanggal data atau real: 2026-09-07
    return viewYear === 2026 && viewMonth === 8 && day === 7;
  };

  // Shortcut "Hari ini"
  const handleSelectToday = () => {
    const todayStr = '2026-09-07';
    onChange(todayStr);
    if (onShortcutSelect) {
      onShortcutSelect('hari_ini', 2026);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label Komponen */}
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#1B365D]" />
          <span>{label}</span>
        </label>
      )}

      {/* Input Trigger Button (Clean, Modern, Simpel & Selaras) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[38px] flex items-center justify-between text-left text-xs bg-slate-50 border rounded-xl px-3 py-2 text-slate-800 font-medium transition-all cursor-pointer focus:outline-hidden ${
          isOpen 
            ? 'bg-white border-[#1B365D] ring-2 ring-[#1B365D]/15' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-[#1B365D] shrink-0" />
          <span className="truncate">{formattedDisplay(value)}</span>
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#1B365D]' : ''
          }`} 
        />
      </button>

      {/* Modern Popover Calendar */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          } w-[290px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-3.5 animate-in fade-in zoom-in-95 duration-150 font-sans`}
        >
          {/* 1. Header & Navigasi Kalender */}
          <div className="flex items-center justify-between gap-1 mb-3 pb-2.5 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={viewYear === minYear && viewMonth === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pemilih Bulan & Tahun Berdampingan */}
            <div className="flex items-center gap-1.5">
              {/* Select Bulan */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-[#1B365D] cursor-pointer transition-colors"
              >
                {NAMA_BULAN.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Select Tahun */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-[#1B365D] cursor-pointer transition-colors"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={viewYear === maxYear && viewMonth === 11}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Header Nama Hari (Min, Sen, Sel...) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {NAMA_HARI.map((day, idx) => (
              <span 
                key={day} 
                className={`text-xs font-medium py-0.5 ${
                  idx === 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* 3. Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {/* Hari dari bulan sebelumnya (pudar) */}
            {Array.from({ length: firstDay }).map((_, i) => {
              const dayNum = prevMonthDays - firstDay + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-normal text-slate-300 select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Hari di bulan aktif */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNum = i + 1;
              const active = isSelected(dayNum);
              const today = isToday(dayNum);

              return (
                <button
                  key={`cur-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-medium transition-colors cursor-pointer relative ${
                    active
                      ? 'bg-[#1B365D] text-white font-bold shadow-md shadow-[#1B365D]/30'
                      : today
                      ? 'text-[#E67E22] font-bold bg-orange-50/80 hover:bg-orange-100/80'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{dayNum}</span>
                  {today && !active && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#E67E22]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 4. Footer & Shortcut Interaktif */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[#1B365D] font-semibold hover:text-[#0F223D] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Hari ini</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 font-medium hover:text-slate-600 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
