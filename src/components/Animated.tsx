import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedNumberProps {
  /** Nilai angka yang ingin ditampilkan */
  value: number;
  /** Durasi animasi dalam milidetik */
  duration?: number;
  /** Fungsi format tampilan angka, misal Rupiah atau persen */
  format?: (n: number) => string;
  /** Class tambahan untuk styling */
  className?: string;
}

/**
 * Komponen AnimatedNumber
 * - Saat pertama kali dirender (misal setelah login), angka menghitung dari 0 menuju nilai asli.
 * - Setiap kali prop `value` berubah setelahnya (refresh data, filter tanggal, update real-time),
 *   angka beranimasi dari nilai yang sedang tampil menuju nilai baru (bukan dari 0 lagi).
 * - Menghormati preferensi "reduce motion" pada perangkat pengguna.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1200,
  format = (n) => Math.round(n).toLocaleString('id-ID'),
  className = '',
}) => {
  const [display, setDisplay] = useState<number>(0);
  const currentRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = currentRef.current;

    if (from === value) {
      return;
    }

    // Hormati pengaturan "reduce motion" dari sistem pengguna
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      currentRef.current = value;
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // easeOutCubic agar animasi terasa halus di akhir
      const eased = 1 - Math.pow(1 - t, 3);
      const nextValue = from + (value - from) * eased;

      currentRef.current = nextValue;
      setDisplay(nextValue);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = value;
        setDisplay(value);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);

  return <span className={`tabular-nums ${className}`}>{format(display)}</span>;
};

export default AnimatedNumber;