/**
 * Indonesian Rupiah & Statistical Formatters
 */

export function formatRupiah(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatRupiahShort(amount: number, withRpPrefix: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return withRpPrefix ? 'Rp 0' : '0';
  
  const absAmount = Math.abs(amount);
  const prefix = withRpPrefix ? 'Rp ' : '';
  
  // Triliun (>= 1.000.000.000.000)
  if (absAmount >= 1_000_000_000_000) {
    const val = (amount / 1_000_000_000_000).toFixed(2).replace('.', ',');
    return `${prefix}${val} T`;
  }
  // Miliar (>= 1.000.000.000)
  if (absAmount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(2).replace('.', ',');
    return `${prefix}${val} M`;
  }
  // Juta (>= 1.000.000)
  if (absAmount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace('.', ',');
    return `${prefix}${val} Jt`;
  }
  // Ribu (>= 1.000)
  if (absAmount >= 1_000) {
    const val = (amount / 1_000).toFixed(1).replace('.', ',');
    return `${prefix}${val} Rb`;
  }
  
  return `${prefix}${amount.toLocaleString('id-ID')}`;
}

export function formatPercentage(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return '0,0%';
  return val.toFixed(1).replace('.', ',') + '%';
}

export type PercentageColorTier = 'green' | 'yellow' | 'red';

export interface PercentageStatusInfo {
  tier: PercentageColorTier;
  label: string;
  badgeClass: string;
  barColor: string;
  glowClass: string;
  dotColor: string;
}

export function getPercentageStatus(percent: number): PercentageStatusInfo {
  if (percent >= 100) {
    return {
      tier: 'green',
      label: 'Sesuai Target',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
      barColor: 'bg-emerald-600',
      glowClass: 'shadow-xs',
      dotColor: 'bg-emerald-600',
    };
  } else if (percent >= 70) {
    return {
      tier: 'yellow',
      label: 'Optimal',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
      barColor: 'bg-emerald-600',
      glowClass: 'shadow-xs',
      dotColor: 'bg-emerald-600',
    };
  } else {
    return {
      tier: 'red',
      label: 'Perhatian',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
      barColor: 'bg-rose-600',
      glowClass: 'shadow-xs',
      dotColor: 'bg-rose-600',
    };
  }
}
