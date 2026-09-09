import { TaxItem, SummaryTotals, MonthlyTrend } from '../types';
import { getTaxDataByYear, getSummaryTotalsByYear, YEARLY_REVENUE_HISTORY } from './dummy';

/**
 * Interface Item Transaksi Realisasi Pajak Daerah dengan properti date ('YYYY-MM-DD')
 */
export interface TaxTransactionWithDate {
  id: string;
  date: string; // Format 'YYYY-MM-DD'
  waktu?: string; // Format 'HH:mm:ss'
  taxId: string;
  jenisPajak: string;
  shortName: string;
  category: 'pajak_murni' | 'opsen';
  group: 'PBJT' | 'PBB_BPHTB' | 'PAJAK_LAIN' | 'OPSEN';
  nominal: number; // Setoran kas (Rp)
  namaWajibPajak: string;
  namaObjek?: string;
  npwpd?: string;
  kecamatan?: string;
  metodeBayar?: string;
  ntpd?: string;
}

// Basis data sektor untuk pembuatan data transaksi
const SECTOR_INFO_LIST = [
  { id: 'pbjt-hotel', jenisPajak: 'PBJT Jasa Perhotelan', shortName: 'PBJT Hotel', category: 'pajak_murni' as const, group: 'PBJT' as const, baseWeight: 0.02 },
  { id: 'pbjt-mamin', jenisPajak: 'PBJT Makanan atau Minuman', shortName: 'PBJT Restoran', category: 'pajak_murni' as const, group: 'PBJT' as const, baseWeight: 0.12 },
  { id: 'pbjt-hiburan', jenisPajak: 'PBJT Jasa Kesenian dan Hiburan', shortName: 'PBJT Hiburan', category: 'pajak_murni' as const, group: 'PBJT' as const, baseWeight: 0.015 },
  { id: 'pajak-reklame', jenisPajak: 'Pajak Reklame', shortName: 'Pajak Reklame', category: 'pajak_murni' as const, group: 'PAJAK_LAIN' as const, baseWeight: 0.035 },
  { id: 'pbjt-listrik', jenisPajak: 'PBJT Tenaga Listrik', shortName: 'PBJT Listrik', category: 'pajak_murni' as const, group: 'PBJT' as const, baseWeight: 0.19 },
  { id: 'pbjt-parkir', jenisPajak: 'PBJT Jasa Parkir', shortName: 'PBJT Parkir', category: 'pajak_murni' as const, group: 'PBJT' as const, baseWeight: 0.015 },
  { id: 'pajak-air-tanah', jenisPajak: 'Pajak Air Tanah', shortName: 'Pajak Air Tanah', category: 'pajak_murni' as const, group: 'PAJAK_LAIN' as const, baseWeight: 0.015 },
  { id: 'bphtb', jenisPajak: 'Pajak Bea perolehan Hak Atas Tanah dan Bangunan', shortName: 'BPHTB', category: 'pajak_murni' as const, group: 'PBB_BPHTB' as const, baseWeight: 0.22 },
  { id: 'pbb-p2', jenisPajak: 'Pajak Bumi dan Bangunan Perkotaan', shortName: 'PBB - P2', category: 'pajak_murni' as const, group: 'PBB_BPHTB' as const, baseWeight: 0.23 },
  { id: 'opsen-pkb', jenisPajak: 'Opsen Pajak Kendaraan Bermotor', shortName: 'Opsen PKB', category: 'opsen' as const, group: 'OPSEN' as const, baseWeight: 0.09 },
  { id: 'opsen-bbnkb', jenisPajak: 'Opsen Bea Balik Nama Kendaraan Bermotor', shortName: 'Opsen BBNKB', category: 'opsen' as const, group: 'OPSEN' as const, baseWeight: 0.05 },
];

const WP_NAMES = [
  'PT Cimahi Tekstil Mandiri', 'Hotel Valore Cimahi', 'The Edge Condominium', 
  'PT Chitose Internasional', 'PT Sansan Saudaratex', 'RM Ampera Cimahi', 
  'KFC Amir Machmud', 'McDonalds Cimahi', 'PT PLN Persero UP3 Cimahi', 
  'RSUD Cibabat Cimahi', 'PT Trisula Textile Industries', 'Borma Toserba Cimahi', 
  'Yogya Plaza Cimahi', 'Cinema XXI Cimahi Mall', 'Transmart Cimahi Parkir', 
  'PT Indorama Cimahi', 'PT Kahatex Logistik', 'PT Bio Farma Plant Cimahi'
];

const KECAMATAN_CHOICES = ['Cimahi Selatan', 'Cimahi Tengah', 'Cimahi Utara'];
const METODE_CHOICES = ['QRIS Dinamis', 'Virtual Account bjb', 'Teller Kasda bjb', 'Host-to-Host bjb'];

/**
 * Generator Data Transaksi Mock 2024, 2025, dan 2026
 */
function generateMockTransactions(): TaxTransactionWithDate[] {
  const transactions: TaxTransactionWithDate[] = [];
  let txCounter = 10001;

  // Generate data per tahun (2024 s/d 2026)
  const years = [2024, 2025, 2026];

  years.forEach((yr) => {
    // Ambil target realisasi tahunan dari dummy
    const yearHistory = YEARLY_REVENUE_HISTORY.find((y) => y.tahun === yr);
    const monthsInYear = yr === 2026 ? 9 : 12; // 2026 berjalan sampai September

    for (let m = 1; m <= monthsInYear; m++) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      // Ambil nominal bulanan dari dummy
      const mHistory = yearHistory?.bulanan[m - 1];
      const monthlyTotal = mHistory ? mHistory.realisasi : 25000000000;

      // Jumlah hari per bulan
      const daysInMonth = yr === 2026 && m === 9 ? 8 : (m === 2 ? 28 : (m === 4 || m === 6 || m === 9 || m === 11 ? 30 : 31));

      // Buat sample transaksi tersebar di beberapa tanggal penting per bulan
      const sampleDays = [1, 5, 8, 12, 15, 18, 22, 25, 28].filter(d => d <= daysInMonth);

      sampleDays.forEach((day, dIdx) => {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const dateStr = `${yr}-${monthStr}-${dayStr}`;

        // Distribusi ke setiap sektor
        SECTOR_INFO_LIST.forEach((sec, sIdx) => {
          // Nominal terdistribusi proporsional
          const factor = (0.8 + ((day + sIdx + m) % 5) * 0.1);
          const nominalShare = Math.round((monthlyTotal * sec.baseWeight / sampleDays.length) * factor);
          
          if (nominalShare > 0) {
            const wp = WP_NAMES[(txCounter + sIdx) % WP_NAMES.length];
            const kec = KECAMATAN_CHOICES[(day + sIdx) % KECAMATAN_CHOICES.length];
            const met = METODE_CHOICES[(sIdx + m) % METODE_CHOICES.length];
            const hour = 8 + (txCounter % 8);
            const minute = (txCounter * 7) % 60;
            const second = (txCounter * 13) % 60;

            transactions.push({
              id: `TX-${yr}-${monthStr}-${txCounter}`,
              date: dateStr,
              waktu: `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`,
              taxId: sec.id,
              jenisPajak: sec.jenisPajak,
              shortName: sec.shortName,
              category: sec.category,
              group: sec.group,
              nominal: nominalShare,
              namaWajibPajak: wp,
              namaObjek: `${sec.shortName} - ${wp}`,
              npwpd: `P.32.77.${(txCounter % 899 + 100)}.${(m * 123) % 899 + 100}`,
              kecamatan: kec,
              metodeBayar: met,
              ntpd: `NTPD${yr}${monthStr}${txCounter}`
            });

            txCounter++;
          }
        });
      });
    }
  });

  return transactions;
}

// Mock Transactions Cache
export const MOCK_TAX_TRANSACTIONS: TaxTransactionWithDate[] = generateMockTransactions();

/**
 * Filter transaksi berdasarkan rentang tanggal 'YYYY-MM-DD'
 */
export function filterTransactionsByDateRange(
  startDate: string,
  endDate: string
): TaxTransactionWithDate[] {
  return MOCK_TAX_TRANSACTIONS.filter((tx) => {
    return tx.date >= startDate && tx.date <= endDate;
  });
}

/**
 * Hitung TaxItem[] agregasi dinamis berdasarkan rentang tanggal
 */
export function getAggregatedTaxItems(
  startDate: string,
  endDate: string,
  baseYear: number = 2026
): TaxItem[] {
  const filteredTx = filterTransactionsByDateRange(startDate, endDate);
  const baseTaxItems = getTaxDataByYear(baseYear);

  // Ambil tahun dari startDate & endDate
  const startY = parseInt(startDate.slice(0, 4), 10) || baseYear;
  const endY = parseInt(endDate.slice(0, 4), 10) || baseYear;

  // Hitung durasi hari rentang tanggal
  const d1 = new Date(startDate).getTime();
  const d2 = new Date(endDate).getTime();
  const diffDays = Math.max(1, Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1);

  // Proporsi terhadap 1 tahun (365 hari)
  const durationProportion = Math.min(1.5, Math.max(0.01, diffDays / 365));

  // Akumulasi nominal per sektor dari transaksi yang difilter
  const sectorSums: Record<string, number> = {};
  filteredTx.forEach((tx) => {
    sectorSums[tx.taxId] = (sectorSums[tx.taxId] || 0) + tx.nominal;
  });

  // Total realisasi seluruh sektor
  const totalRealisasiAll = Object.values(sectorSums).reduce((a, b) => a + b, 0);

  return baseTaxItems.map((item) => {
    // Jika ada transaksi nyata di rentang tanggal, gunakan akumulasi transaksi.
    // Jika rentang tanggal mencakup setahun penuh dan transaksi sample hanya mewakili sebagian, sesuaikan skala
    const txRealisasi = sectorSums[item.id] || 0;
    
    // Sesuaikan target proporsional dengan rentang hari
    const adjustedTarget = Math.round(item.targetTahun * durationProportion);
    const realisasiPeriod = txRealisasi > 0 ? txRealisasi : Math.round(item.realisasiTahun * durationProportion);
    const persentase = adjustedTarget > 0 ? Number(((realisasiPeriod / adjustedTarget) * 100).toFixed(2)) : 0;
    const kontribusi = totalRealisasiAll > 0 ? Number(((realisasiPeriod / totalRealisasiAll) * 100).toFixed(2)) : item.kontribusiPersen;

    return {
      ...item,
      targetTahun: adjustedTarget,
      realisasiTahun: realisasiPeriod,
      persentaseTahun: persentase,
      target: adjustedTarget,
      realisasi: realisasiPeriod,
      persentase: persentase,
      kontribusiPersen: kontribusi,
      // Target & realisasi triwulan disesuaikan
      targetTriwulan: Math.round(adjustedTarget * 0.25),
      realisasiTriwulan: Math.round(realisasiPeriod * 0.3),
      persentaseTriwulan: adjustedTarget > 0 ? Number(((Math.round(realisasiPeriod * 0.3) / Math.round(adjustedTarget * 0.25)) * 100).toFixed(2)) : 0
    };
  });
}

/**
 * Hitung SummaryTotals agregasi dinamis berdasarkan rentang tanggal
 */
export function getAggregatedSummaryTotals(
  startDate: string,
  endDate: string,
  baseYear: number = 2026
): SummaryTotals {
  const aggregatedItems = getAggregatedTaxItems(startDate, endDate, baseYear);
  const baseSummary = getSummaryTotalsByYear(baseYear);

  const murniItems = aggregatedItems.filter(i => i.category === 'pajak_murni');
  const targetMurni = murniItems.reduce((acc, curr) => acc + curr.targetTahun, 0);
  const realisasiMurni = murniItems.reduce((acc, curr) => acc + curr.realisasiTahun, 0);
  const persenMurni = targetMurni > 0 ? Number(((realisasiMurni / targetMurni) * 100).toFixed(2)) : 0;

  const targetTotal = aggregatedItems.reduce((acc, curr) => acc + curr.targetTahun, 0);
  const realisasiTotal = aggregatedItems.reduce((acc, curr) => acc + curr.realisasiTahun, 0);
  const persenTotal = targetTotal > 0 ? Number(((realisasiTotal / targetTotal) * 100).toFixed(2)) : 0;

  const targetTWMurni = murniItems.reduce((acc, curr) => acc + curr.targetTriwulan, 0);
  const realisasiTWMurni = murniItems.reduce((acc, curr) => acc + curr.realisasiTriwulan, 0);

  const targetTWTotal = aggregatedItems.reduce((acc, curr) => acc + curr.targetTriwulan, 0);
  const realisasiTWTotal = aggregatedItems.reduce((acc, curr) => acc + curr.realisasiTriwulan, 0);

  // Ambil transaksi pada tanggal akhir (hari terakhir dalam filter)
  const lastDayTx = MOCK_TAX_TRANSACTIONS.filter(t => t.date === endDate);
  const penerimaanHariIni = lastDayTx.reduce((acc, t) => acc + t.nominal, 0) || Math.round(realisasiTotal / 30);

  // Hitung penerimaan bulan ini (berdasarkan bulan dari endDate)
  const endMonth = endDate.slice(0, 7);
  const monthTx = MOCK_TAX_TRANSACTIONS.filter(t => t.date.startsWith(endMonth));
  const penerimaanBulanIni = monthTx.reduce((acc, t) => acc + t.nominal, 0) || Math.round(realisasiTotal / 3);

  // Nama bulan dari endDate
  const monthNum = parseInt(endDate.slice(5, 7), 10);
  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const namaBulan = MONTH_NAMES[monthNum - 1] || 'September';

  return {
    subTotalPajakMurni: {
      targetTahun: targetMurni,
      realisasiTahun: realisasiMurni,
      persentaseTahun: persenMurni,
      targetTriwulan: targetTWMurni,
      realisasiTriwulan: realisasiTWMurni,
      persentaseTriwulan: targetTWMurni > 0 ? Number(((realisasiTWMurni / targetTWMurni) * 100).toFixed(2)) : 0,
    },
    totalKeseluruhan: {
      targetTahun: targetTotal,
      realisasiTahun: realisasiTotal,
      persentaseTahun: persenTotal,
      targetTriwulan: targetTWTotal,
      realisasiTriwulan: realisasiTWTotal,
      persentaseTriwulan: targetTWTotal > 0 ? Number(((realisasiTWTotal / targetTWTotal) * 100).toFixed(2)) : 0,
    },
    penerimaanBulanIni,
    penerimaanHariIni,
    namaHari: 'Hari Ini',
    namaBulan,
    tahunAnggaran: baseYear,
    lastUpdated: `Filter Aktif: ${startDate} s.d. ${endDate}`,
  };
}
