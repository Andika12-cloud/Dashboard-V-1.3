import { TaxItem, SummaryTotals, MonthlyTrend, DailyTrend, YearlyRevenueData } from '../types';

// Template metadata 11 Sektor Pajak Daerah Kota Cimahi
interface SektorBaseInfo {
  id: string;
  no: number;
  jenisPajak: string;
  shortName: string;
  code: string;
  category: 'pajak_murni' | 'opsen';
  group: 'PBJT' | 'PBB_BPHTB' | 'PAJAK_LAIN' | 'OPSEN';
  color: string;
  iconName: string;
  deskripsi: string;
}

const SEKTOR_TEMPLATE: SektorBaseInfo[] = [
  {
    id: 'pbjt-hotel',
    no: 1,
    jenisPajak: 'PBJT Jasa Perhotelan',
    shortName: 'PBJT Hotel',
    code: '4.1.01.06',
    category: 'pajak_murni',
    group: 'PBJT',
    color: '#06b6d4',
    iconName: 'Hotel',
    deskripsi: 'Pajak Barang dan Jasa Tertentu atas pelayanan penyediaan akomodasi hotel, motel, dan penginapan.',
  },
  {
    id: 'pbjt-mamin',
    no: 2,
    jenisPajak: 'PBJT Makanan atau Minuman',
    shortName: 'PBJT Restoran',
    code: '4.1.01.07',
    category: 'pajak_murni',
    group: 'PBJT',
    color: '#d97706',
    iconName: 'Utensils',
    deskripsi: 'Pajak atas pelayanan makanan dan minuman yang disediakan oleh restoran, rumah makan, kafe, dan katering.',
  },
  {
    id: 'pbjt-hiburan',
    no: 3,
    jenisPajak: 'PBJT Jasa Kesenian dan Hiburan',
    shortName: 'PBJT Hiburan',
    code: '4.1.01.08',
    category: 'pajak_murni',
    group: 'PBJT',
    color: '#8b5cf6',
    iconName: 'Sparkles',
    deskripsi: 'Pajak atas tontonan film, pagelaran musik, diskotik, klub malam, permainan biliar, dan wahana rekreasi.',
  },
  {
    id: 'pajak-reklame',
    no: 4,
    jenisPajak: 'Pajak Reklame',
    shortName: 'Pajak Reklame',
    code: '4.1.01.09',
    category: 'pajak_murni',
    group: 'PAJAK_LAIN',
    color: '#78716c',
    iconName: 'Megaphone',
    deskripsi: 'Pajak atas semua penyelenggaraan reklame papan, billboard, videotron, kain, melekat/stiker, dan berjalan.',
  },
  {
    id: 'pbjt-listrik',
    no: 5,
    jenisPajak: 'PBJT Tenaga Listrik',
    shortName: 'PBJT Listrik',
    code: '4.1.01.10',
    category: 'pajak_murni',
    group: 'PBJT',
    color: '#ea580c',
    iconName: 'Zap',
    deskripsi: 'Pajak atas konsumsi tenaga listrik yang dihasilkan sendiri maupun dari sumber lain (PLN).',
  },
  {
    id: 'pbjt-parkir',
    no: 6,
    jenisPajak: 'PBJT Jasa Parkir',
    shortName: 'PBJT Parkir',
    code: '4.1.01.11',
    category: 'pajak_murni',
    group: 'PBJT',
    color: '#64748b',
    iconName: 'Car',
    deskripsi: 'Pajak atas penyelenggaraan tempat parkir di luar badan jalan, gedung parkir, dan valet parking.',
  },
  {
    id: 'pajak-air-tanah',
    no: 7,
    jenisPajak: 'Pajak Air Tanah',
    shortName: 'Pajak Air Tanah',
    code: '4.1.01.12',
    category: 'pajak_murni',
    group: 'PAJAK_LAIN',
    color: '#6366f1',
    iconName: 'Droplets',
    deskripsi: 'Pajak atas pengambilan dan/atau pemanfaatan air tanah oleh badan usaha maupun perorangan.',
  },
  {
    id: 'bphtb',
    no: 8,
    jenisPajak: 'Pajak Bea perolehan Hak Atas Tanah dan Bangunan',
    shortName: 'BPHTB',
    code: '4.1.01.13',
    category: 'pajak_murni',
    group: 'PBB_BPHTB',
    color: '#14b8a6',
    iconName: 'Landmark',
    deskripsi: 'Pajak atas perolehan hak atas tanah dan/atau bangunan karena jual beli, hibah, waris, dan tukar menukar.',
  },
  {
    id: 'pbb-p2',
    no: 9,
    jenisPajak: 'Pajak Bumi dan Bangunan Perkotaan',
    shortName: 'PBB - P2',
    code: '4.1.01.14',
    category: 'pajak_murni',
    group: 'PBB_BPHTB',
    color: '#e11d48',
    iconName: 'Building2',
    deskripsi: 'Pajak atas bumi dan/atau bangunan yang dimiliki, dikuasai, dan/atau dimanfaatkan oleh orang pribadi atau badan.',
  },
  {
    id: 'opsen-pkb',
    no: 10,
    jenisPajak: 'Opsen PKB',
    shortName: 'Opsen PKB',
    code: '4.1.01.15',
    category: 'opsen',
    group: 'OPSEN',
    color: '#10b981',
    iconName: 'Truck',
    deskripsi: 'Opsen Pajak Kendaraan Bermotor bagian penerimaan kabupaten/kota sesuai amanat UU HKPD No. 1 Tahun 2022.',
  },
  {
    id: 'opsen-bbnkb',
    no: 11,
    jenisPajak: 'Opsen BBNKB',
    shortName: 'Opsen BBNKB',
    code: '4.1.01.16',
    category: 'opsen',
    group: 'OPSEN',
    color: '#ec4899',
    iconName: 'FileBadge2',
    deskripsi: 'Opsen Bea Balik Nama Kendaraan Bermotor penyerahan pertama dan kedua yang dialokasikan ke Kas Daerah.',
  },
];

// Helper membuat rincian 11 sektor pajak untuk tahun tertentu
function buildSectors(
  totalTarget: number,
  totalRealisasi: number,
  ratios: { [key: string]: { targetRatio: number; realisasiRatio: number } }
): TaxItem[] {
  return SEKTOR_TEMPLATE.map((tpl) => {
    const r = ratios[tpl.id] || { targetRatio: 0.05, realisasiRatio: 0.05 };
    const targetTahun = Math.round(totalTarget * r.targetRatio);
    const realisasiTahun = Math.round(totalRealisasi * r.realisasiRatio);
    const persentaseTahun = targetTahun > 0 ? Number(((realisasiTahun / targetTahun) * 100).toFixed(2)) : 0;

    const targetTriwulan = Math.round(targetTahun * 0.75);
    const realisasiTriwulan = Math.round(realisasiTahun * 0.76);
    const persentaseTriwulan = targetTriwulan > 0 ? Number(((realisasiTriwulan / targetTriwulan) * 100).toFixed(2)) : 0;

    const kontribusiPersen = totalRealisasi > 0 ? Number(((realisasiTahun / totalRealisasi) * 100).toFixed(2)) : 0;

    const tw1 = Math.round(realisasiTahun * 0.28);
    const tw2 = Math.round(realisasiTahun * 0.32);
    const tw3 = Math.round(realisasiTahun * 0.25);
    const tw4 = Math.max(0, realisasiTahun - (tw1 + tw2 + tw3));

    return {
      ...tpl,
      targetTahun,
      realisasiTahun,
      persentaseTahun,
      targetTriwulan,
      realisasiTriwulan,
      persentaseTriwulan,
      kontribusiPersen,
      triwulan1: tw1,
      triwulan2: tw2,
      triwulan3: tw3,
      triwulan4: tw4,
    };
  });
}

/**
 * Riwayat Penerimaan Pajak Daerah 8 Tahun Terakhir (2019 - 2026)
 * Lengkap dengan:
 * 1. Total Target & Realisasi APBD
 * 2. Rincian Bulanan (Januari s.d. Desember)
 * 3. Rincian Triwulan (TW I s.d. TW IV)
 * 4. Rincian 11 Sektor Pajak Daerah Lengkap
 */
export const YEARLY_REVENUE_HISTORY: YearlyRevenueData[] = [
  // ========================== TAHUN 2019 ==========================
  {
    tahun: 2019,
    targetTahun: 175000000000,
    realisasiTahun: 178600000000,
    persentaseTahun: 102.06,
    statusCatatan: 'Pra-Pandemi Capaian Optimal (+2.06%)',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 14583333333, realisasi: 13800000000, pencapaian: 94.63, keterangan: 'Aktivitas awal tahun usaha perdagangan & jasa' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 14583333333, realisasi: 14200000000, pencapaian: 97.37, keterangan: 'Penerimaan rutin pajak hotel dan restoran' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 14583333333, realisasi: 14500000000, pencapaian: 99.43, keterangan: 'Peningkatan setoran pajak hiburan dan reklame' },
      { bulan: 'Apr', namaBulan: 'April', target: 14583333333, realisasi: 14900000000, pencapaian: 102.17, keterangan: 'Awal triwulan kedua stabil' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 14583333333, realisasi: 15600000000, pencapaian: 106.97, keterangan: 'Lonjakan konsumsi pra-libur lebaran' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 14583333333, realisasi: 15100000000, pencapaian: 103.54, keterangan: 'Penerimaan pajak restoran pasca liburan' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 14583333333, realisasi: 14800000000, pencapaian: 101.49, keterangan: 'Penerbitan massal SPPT PBB-P2' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 14583333333, realisasi: 16200000000, pencapaian: 111.09, keterangan: 'Puncak pelunasan PBB-P2 perkotaan' },
      { bulan: 'Sep', namaBulan: 'September', target: 14583333333, realisasi: 14900000000, pencapaian: 102.17, keterangan: 'Penerimaan pajak penerangan jalan optimal' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 14583333333, realisasi: 14700000000, pencapaian: 100.80, keterangan: 'Pemeriksaan kepatuhan wajib pajak berkala' },
      { bulan: 'Nov', namaBulan: 'November', target: 14583333333, realisasi: 14500000000, pencapaian: 99.43, keterangan: 'Penagihan aktif piutang pajak daerah' },
      { bulan: 'Des', namaBulan: 'Desember', target: 14583333333, realisasi: 15300000000, pencapaian: 104.91, keterangan: 'Tutup buku kas daerah melampaui target APBD' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 43750000000, realisasi: 42500000000, pencapaian: 97.14 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 43750000000, realisasi: 45600000000, pencapaian: 104.23 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 43750000000, realisasi: 45900000000, pencapaian: 104.91 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 43750000000, realisasi: 44600000000, pencapaian: 101.94 }
    ],
    sektorPajak: buildSectors(175000000000, 178600000000, {
      'pbjt-hotel': { targetRatio: 0.003, realisasiRatio: 0.0032 },
      'pbjt-mamin': { targetRatio: 0.125, realisasiRatio: 0.1320 },
      'pbjt-hiburan': { targetRatio: 0.008, realisasiRatio: 0.0085 },
      'pajak-reklame': { targetRatio: 0.022, realisasiRatio: 0.0230 },
      'pbjt-listrik': { targetRatio: 0.320, realisasiRatio: 0.3210 },
      'pbjt-parkir': { targetRatio: 0.006, realisasiRatio: 0.0065 },
      'pajak-air-tanah': { targetRatio: 0.110, realisasiRatio: 0.1140 },
      'bphtb': { targetRatio: 0.160, realisasiRatio: 0.1580 },
      'pbb-p2': { targetRatio: 0.246, realisasiRatio: 0.2338 },
      'opsen-pkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2020 ==========================
  {
    tahun: 2020,
    targetTahun: 165000000000,
    realisasiTahun: 152800000000,
    persentaseTahun: 92.61,
    statusCatatan: 'Dampak Pandemi COVID-19 & Relaksasi Pajak',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 13750000000, realisasi: 14200000000, pencapaian: 103.27, keterangan: 'Kondisi operasional normal sebelum pandemi' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 13750000000, realisasi: 13900000000, pencapaian: 101.09, keterangan: 'Mulai terindikasi penurunan sektor pariwisata' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 13750000000, realisasi: 12500000000, pencapaian: 90.91, keterangan: 'Mulai penetapan status tanggap darurat COVID-19' },
      { bulan: 'Apr', namaBulan: 'April', target: 13750000000, realisasi: 9800000000, pencapaian: 71.27, keterangan: 'PSBB awal, penutupan bioskop, hotel, dan resto' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 13750000000, realisasi: 9200000000, pencapaian: 66.91, keterangan: 'Penurunan drastis aktivitas ekonomi dan konsumsi' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 13750000000, realisasi: 10800000000, pencapaian: 78.55, keterangan: 'Masa adaptasi kebiasaan baru (AKB)' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 13750000000, realisasi: 12400000000, pencapaian: 90.18, keterangan: 'Program stimulus penghapusan denda administratif' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 13750000000, realisasi: 14100000000, pencapaian: 102.55, keterangan: 'Penerimaan PBB-P2 didorong intensifikasi digital' },
      { bulan: 'Sep', namaBulan: 'September', target: 13750000000, realisasi: 13600000000, pencapaian: 98.91, keterangan: 'Pemulihan bertahap pajak penerangan jalan' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 13750000000, realisasi: 13800000000, pencapaian: 100.36, keterangan: 'Relaksasi angsuran pajak bagi pelaku usaha' },
      { bulan: 'Nov', namaBulan: 'November', target: 13750000000, realisasi: 14100000000, pencapaian: 102.55, keterangan: 'Konsistensi penerimaan sektor esensial' },
      { bulan: 'Des', namaBulan: 'Desember', target: 13750000000, realisasi: 14500000000, pencapaian: 105.45, keterangan: 'Optimalisasi penerimaan akhir tahun masa relaksasi' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 41250000000, realisasi: 40600000000, pencapaian: 98.42 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 41250000000, realisasi: 29800000000, pencapaian: 72.24 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 41250000000, realisasi: 40100000000, pencapaian: 97.21 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 41250000000, realisasi: 42400000000, pencapaian: 102.79 }
    ],
    sektorPajak: buildSectors(165000000000, 152800000000, {
      'pbjt-hotel': { targetRatio: 0.003, realisasiRatio: 0.0018 },
      'pbjt-mamin': { targetRatio: 0.120, realisasiRatio: 0.0980 },
      'pbjt-hiburan': { targetRatio: 0.007, realisasiRatio: 0.0030 },
      'pajak-reklame': { targetRatio: 0.020, realisasiRatio: 0.0180 },
      'pbjt-listrik': { targetRatio: 0.330, realisasiRatio: 0.3540 },
      'pbjt-parkir': { targetRatio: 0.005, realisasiRatio: 0.0035 },
      'pajak-air-tanah': { targetRatio: 0.115, realisasiRatio: 0.1210 },
      'bphtb': { targetRatio: 0.150, realisasiRatio: 0.1420 },
      'pbb-p2': { targetRatio: 0.250, realisasiRatio: 0.2587 },
      'opsen-pkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2021 ==========================
  {
    tahun: 2021,
    targetTahun: 195000000000,
    realisasiTahun: 188420000000,
    persentaseTahun: 96.63,
    statusCatatan: 'Pemulihan Ekonomi Pasca Pandemi',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 16250000000, realisasi: 13100000000, pencapaian: 80.62, keterangan: 'Awal tahun pemulihan sektor usaha' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 16250000000, realisasi: 14200000000, pencapaian: 87.38, keterangan: 'Relaksasi denda pajak daerah' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 16250000000, realisasi: 14800000000, pencapaian: 91.08, keterangan: 'Peningkatan setoran pajak hotel & resto' },
      { bulan: 'Apr', namaBulan: 'April', target: 16250000000, realisasi: 15200000000, pencapaian: 93.54, keterangan: 'Aktivitas kuliner Ramadhan' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 16250000000, realisasi: 15800000000, pencapaian: 97.23, keterangan: 'Lonjakan konsumsi libur Idul Fitri' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 16250000000, realisasi: 16520000000, pencapaian: 101.66, keterangan: 'Evaluasi semester 1 melampaui target bulanan' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 16250000000, realisasi: 16100000000, pencapaian: 99.08, keterangan: 'Penyampaian SPPT PBB-P2 massal' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 16250000000, realisasi: 16800000000, pencapaian: 103.38, keterangan: 'Puncak pembayaran PBB-P2 perkotaan' },
      { bulan: 'Sep', namaBulan: 'September', target: 16250000000, realisasi: 16400000000, pencapaian: 100.92, keterangan: 'Realisasi pajak penerangan jalan stabil' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 16250000000, realisasi: 16300000000, pencapaian: 100.31, keterangan: 'Penagihan aktif reklame dan parkir' },
      { bulan: 'Nov', namaBulan: 'November', target: 16250000000, realisasi: 16400000000, pencapaian: 100.92, keterangan: 'Pemeriksaan kepatuhan wajib pajak' },
      { bulan: 'Des', namaBulan: 'Desember', target: 16250000000, realisasi: 16800000000, pencapaian: 103.38, keterangan: 'Tutup buku kas daerah surplus target bulanan' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 48750000000, realisasi: 42100000000, pencapaian: 86.36 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 48750000000, realisasi: 47520000000, pencapaian: 97.48 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 48750000000, realisasi: 49300000000, pencapaian: 101.13 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 48750000000, realisasi: 49500000000, pencapaian: 101.54 }
    ],
    sektorPajak: buildSectors(195000000000, 188420000000, {
      'pbjt-hotel': { targetRatio: 0.003, realisasiRatio: 0.0025 },
      'pbjt-mamin': { targetRatio: 0.115, realisasiRatio: 0.1100 },
      'pbjt-hiburan': { targetRatio: 0.006, realisasiRatio: 0.0050 },
      'pajak-reklame': { targetRatio: 0.018, realisasiRatio: 0.0175 },
      'pbjt-listrik': { targetRatio: 0.315, realisasiRatio: 0.3250 },
      'pbjt-parkir': { targetRatio: 0.005, realisasiRatio: 0.0048 },
      'pajak-air-tanah': { targetRatio: 0.118, realisasiRatio: 0.1200 },
      'bphtb': { targetRatio: 0.160, realisasiRatio: 0.1580 },
      'pbb-p2': { targetRatio: 0.260, realisasiRatio: 0.2572 },
      'opsen-pkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2022 ==========================
  {
    tahun: 2022,
    targetTahun: 220000000000,
    realisasiTahun: 226540000000,
    persentaseTahun: 102.97,
    statusCatatan: 'Target Melampaui 100% (+2.97%)',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 18333333333, realisasi: 16500000000, pencapaian: 90.00, keterangan: 'Normalisasi jam operasional sektor hiburan' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 18333333333, realisasi: 17100000000, pencapaian: 93.27, keterangan: 'Peningkatan kepatuhan e-SPTPD' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 18333333334, realisasi: 17600000000, pencapaian: 96.00, keterangan: 'Rebound sektor hotel dan hiburan kota' },
      { bulan: 'Apr', namaBulan: 'April', target: 18333333333, realisasi: 18200000000, pencapaian: 99.27, keterangan: 'Aktivitas kuliner Ramadhan meningkat' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 18333333333, realisasi: 18800000000, pencapaian: 102.55, keterangan: 'Penerimaan PBJT kuliner pasca Lebaran' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 18333333334, realisasi: 19400000000, pencapaian: 105.82, keterangan: 'Optimalisasi pemungutan BPHTB transaksi tanah' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 18333333333, realisasi: 19240000000, pencapaian: 104.95, keterangan: 'Intensifikasi pembayaran PBB-P2' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 18333333333, realisasi: 20200000000, pencapaian: 110.18, keterangan: 'Penerimaan massal PBB-P2 jatuh tempo' },
      { bulan: 'Sep', namaBulan: 'September', target: 18333333334, realisasi: 19500000000, pencapaian: 106.36, keterangan: 'Penerimaan pajak air tanah & reklame' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 18333333333, realisasi: 19800000000, pencapaian: 108.00, keterangan: 'Audit kepatuhan wajib pajak' },
      { bulan: 'Nov', namaBulan: 'November', target: 18333333333, realisasi: 20000000000, pencapaian: 109.09, keterangan: 'Penagihan aktif tunggakan piutang daerah' },
      { bulan: 'Des', namaBulan: 'Desember', target: 18333333334, realisasi: 20200000000, pencapaian: 110.18, keterangan: 'Tutup buku kas daerah surplus APBD' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 55000000000, realisasi: 51200000000, pencapaian: 93.09 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 55000000000, realisasi: 56400000000, pencapaian: 102.55 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 55000000000, realisasi: 58940000000, pencapaian: 107.16 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 55000000000, realisasi: 60000000000, pencapaian: 109.09 }
    ],
    sektorPajak: buildSectors(220000000000, 226540000000, {
      'pbjt-hotel': { targetRatio: 0.0025, realisasiRatio: 0.0026 },
      'pbjt-mamin': { targetRatio: 0.1180, realisasiRatio: 0.1220 },
      'pbjt-hiburan': { targetRatio: 0.0055, realisasiRatio: 0.0054 },
      'pajak-reklame': { targetRatio: 0.0160, realisasiRatio: 0.0162 },
      'pbjt-listrik': { targetRatio: 0.2980, realisasiRatio: 0.3010 },
      'pbjt-parkir': { targetRatio: 0.0050, realisasiRatio: 0.0051 },
      'pajak-air-tanah': { targetRatio: 0.1200, realisasiRatio: 0.1190 },
      'bphtb': { targetRatio: 0.1650, realisasiRatio: 0.1690 },
      'pbb-p2': { targetRatio: 0.2700, realisasiRatio: 0.2597 },
      'opsen-pkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2023 ==========================
  {
    tahun: 2023,
    targetTahun: 252000000000,
    realisasiTahun: 260150000000,
    persentaseTahun: 103.23,
    statusCatatan: 'Target Melampaui 100% (+3.23%)',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 21000000000, realisasi: 19200000000, pencapaian: 91.43, keterangan: 'Digitalisasi pembayaran via QRIS dan Virtual Account' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 21000000000, realisasi: 20100000000, pencapaian: 95.71, keterangan: 'Penerimaan stabil sektor hotel & restoran' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 21000000000, realisasi: 21200000000, pencapaian: 100.95, keterangan: 'Peningkatan transaksi properti BPHTB' },
      { bulan: 'Apr', namaBulan: 'April', target: 21000000000, realisasi: 21450000000, pencapaian: 102.14, keterangan: 'Konsumsi mudik Lebaran mendongkrak PBJT' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 21000000000, realisasi: 21900000000, pencapaian: 104.29, keterangan: 'Optimalisasi pemungutan pajak reklame' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 21000000000, realisasi: 22500000000, pencapaian: 107.14, keterangan: 'Pertumbuhan BPHTB transaksi peralihan hak' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 21000000000, realisasi: 21800000000, pencapaian: 103.81, keterangan: 'Pembukaan loket PBB-P2 di kecamatan' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 21000000000, realisasi: 22600000000, pencapaian: 107.62, keterangan: 'Peak season pembayaran PBB-P2 kota Cimahi' },
      { bulan: 'Sep', namaBulan: 'September', target: 21000000000, realisasi: 21800000000, pencapaian: 103.81, keterangan: 'Penerimaan pajak tenaga listrik industri' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 21000000000, realisasi: 22100000000, pencapaian: 105.24, keterangan: 'Audit kepatuhan wajib pajak reklame & hiburan' },
      { bulan: 'Nov', namaBulan: 'November', target: 21000000000, realisasi: 22500000000, pencapaian: 107.14, keterangan: 'Operasi sisir penagihan tunggakan pajak' },
      { bulan: 'Des', namaBulan: 'Desember', target: 21000000000, realisasi: 23000000000, pencapaian: 109.52, keterangan: 'Penerimaan akhir tahun fiskal mencapai rekor baru' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 63000000000, realisasi: 60500000000, pencapaian: 96.03 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 63000000000, realisasi: 65850000000, pencapaian: 104.52 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 63000000000, realisasi: 66200000000, pencapaian: 105.08 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 63000000000, realisasi: 67600000000, pencapaian: 107.30 }
    ],
    sektorPajak: buildSectors(252000000000, 260150000000, {
      'pbjt-hotel': { targetRatio: 0.0022, realisasiRatio: 0.0023 },
      'pbjt-mamin': { targetRatio: 0.1200, realisasiRatio: 0.1240 },
      'pbjt-hiburan': { targetRatio: 0.0050, realisasiRatio: 0.0048 },
      'pajak-reklame': { targetRatio: 0.0150, realisasiRatio: 0.0152 },
      'pbjt-listrik': { targetRatio: 0.2850, realisasiRatio: 0.2890 },
      'pbjt-parkir': { targetRatio: 0.0048, realisasiRatio: 0.0049 },
      'pajak-air-tanah': { targetRatio: 0.1220, realisasiRatio: 0.1210 },
      'bphtb': { targetRatio: 0.1700, realisasiRatio: 0.1730 },
      'pbb-p2': { targetRatio: 0.2760, realisasiRatio: 0.2658 },
      'opsen-pkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2024 ==========================
  {
    tahun: 2024,
    targetTahun: 286500000000,
    realisasiTahun: 296820000000,
    persentaseTahun: 103.60,
    statusCatatan: 'Kinerja Prima (+3.60% dari Target)',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 23875000000, realisasi: 22320000000, pencapaian: 93.49, keterangan: 'Implementasi tapping box monitoring transaksi online' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 23875000000, realisasi: 23400000000, pencapaian: 98.01, keterangan: 'Penerimaan pajak parkir & reklame melonjak' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 23875000000, realisasi: 24400000000, pencapaian: 102.20, keterangan: 'Percepatan pembayaran BPHTB pengembang' },
      { bulan: 'Apr', namaBulan: 'April', target: 23875000000, realisasi: 24500000000, pencapaian: 102.62, keterangan: 'Penerimaan PBJT kuliner Idul Fitri 1445 H' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 23875000000, realisasi: 24800000000, pencapaian: 103.87, keterangan: 'Ekspansi basis data wajib pajak potensial baru' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 23875000000, realisasi: 25600000000, pencapaian: 107.23, keterangan: 'Evaluasi semester 1 melampaui target APBD' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 23875000000, realisasi: 24900000000, pencapaian: 104.29, keterangan: 'Bulan panutan pajak bumi dan bangunan' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 23875000000, realisasi: 25500000000, pencapaian: 106.81, keterangan: 'Realisasi intensif PBB-P2 & BPHTB kawasan industri' },
      { bulan: 'Sep', namaBulan: 'September', target: 23875000000, realisasi: 24800000000, pencapaian: 103.87, keterangan: 'Penerimaan pajak air tanah tertib izin' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 23875000000, realisasi: 25100000000, pencapaian: 105.13, keterangan: 'Pemberlakuan program diskon pokok PBB-P2' },
      { bulan: 'Nov', namaBulan: 'November', target: 23875000000, realisasi: 25400000000, pencapaian: 106.39, keterangan: 'Penagihan door-to-door piutang pajak' },
      { bulan: 'Des', namaBulan: 'Desember', target: 23875000000, realisasi: 26100000000, pencapaian: 109.32, keterangan: 'Program pemutihan denda pajak daerah berjalan sukses' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 71625000000, realisasi: 70120000000, pencapaian: 97.90 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 71625000000, realisasi: 74900000000, pencapaian: 104.57 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 71625000000, realisasi: 75200000000, pencapaian: 104.99 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 71625000000, realisasi: 76600000000, pencapaian: 106.95 }
    ],
    sektorPajak: buildSectors(286500000000, 296820000000, {
      'pbjt-hotel': { targetRatio: 0.0018, realisasiRatio: 0.0019 },
      'pbjt-mamin': { targetRatio: 0.1250, realisasiRatio: 0.1280 },
      'pbjt-hiburan': { targetRatio: 0.0045, realisasiRatio: 0.0042 },
      'pajak-reklame': { targetRatio: 0.0140, realisasiRatio: 0.0145 },
      'pbjt-listrik': { targetRatio: 0.2750, realisasiRatio: 0.2780 },
      'pbjt-parkir': { targetRatio: 0.0045, realisasiRatio: 0.0044 },
      'pajak-air-tanah': { targetRatio: 0.1250, realisasiRatio: 0.1220 },
      'bphtb': { targetRatio: 0.1750, realisasiRatio: 0.1790 },
      'pbb-p2': { targetRatio: 0.2752, realisasiRatio: 0.2680 },
      'opsen-pkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
      'opsen-bbnkb': { targetRatio: 0.0000, realisasiRatio: 0.0000 },
    })
  },

  // ========================== TAHUN 2025 ==========================
  {
    tahun: 2025,
    targetTahun: 318000000000,
    realisasiTahun: 324950000000,
    persentaseTahun: 102.19,
    statusCatatan: 'Persiapan & Transisi Pemberlakuan Opsen HKPD',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 26500000000, realisasi: 25200000000, pencapaian: 95.09, keterangan: 'Integrasi sistem penerimaan kasda bjb perbankan' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 26500000000, realisasi: 26100000000, pencapaian: 98.49, keterangan: 'Penerimaan stabil sektor perhotelan dan kuliner' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 26500000000, realisasi: 27100000000, pencapaian: 102.26, keterangan: 'Peningkatan setoran BPHTB awal tahun' },
      { bulan: 'Apr', namaBulan: 'April', target: 26500000000, realisasi: 27350000000, pencapaian: 103.21, keterangan: 'Kenaikan tren konsumsi kuliner dan hiburan' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 26500000000, realisasi: 27800000000, pencapaian: 104.91, keterangan: 'Penerimaan pajak reklame kampanye dan event' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 26500000000, realisasi: 28100000000, pencapaian: 106.04, keterangan: 'Kinerja prima semester 1 di atas rata-rata' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 26500000000, realisasi: 26900000000, pencapaian: 101.51, keterangan: 'Mobilisasi pembayaran PBB-P2 terpadu' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 26500000000, realisasi: 27500000000, pencapaian: 103.77, keterangan: 'Realisasi PBB-P2 tepat waktu menjelang jatuh tempo' },
      { bulan: 'Sep', namaBulan: 'September', target: 26500000000, realisasi: 26900000000, pencapaian: 101.51, keterangan: 'Rekonsiliasi bagi hasil pajak provinsi' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 26500000000, realisasi: 27000000000, pencapaian: 101.89, keterangan: 'Intensifikasi penagihan aktif pajak daerah' },
      { bulan: 'Nov', namaBulan: 'November', target: 26500000000, realisasi: 27400000000, pencapaian: 103.40, keterangan: 'Penyelesaian piutang pajak masa lalu' },
      { bulan: 'Des', namaBulan: 'Desember', target: 26500000000, realisasi: 27600000000, pencapaian: 104.15, keterangan: 'Optimalisasi penagihan akhir tahun fiskal mencapai target' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 79500000000, realisasi: 78400000000, pencapaian: 98.62 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 79500000000, realisasi: 83250000000, pencapaian: 104.72 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 79500000000, realisasi: 81300000000, pencapaian: 102.26 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 79500000000, realisasi: 82000000000, pencapaian: 103.14 }
    ],
    sektorPajak: buildSectors(318000000000, 324950000000, {
      'pbjt-hotel': { targetRatio: 0.0015, realisasiRatio: 0.0016 },
      'pbjt-mamin': { targetRatio: 0.0950, realisasiRatio: 0.0980 },
      'pbjt-hiburan': { targetRatio: 0.0035, realisasiRatio: 0.0034 },
      'pajak-reklame': { targetRatio: 0.0110, realisasiRatio: 0.0112 },
      'pbjt-listrik': { targetRatio: 0.2100, realisasiRatio: 0.2140 },
      'pbjt-parkir': { targetRatio: 0.0040, realisasiRatio: 0.0038 },
      'pajak-air-tanah': { targetRatio: 0.1050, realisasiRatio: 0.1030 },
      'bphtb': { targetRatio: 0.1450, realisasiRatio: 0.1480 },
      'pbb-p2': { targetRatio: 0.2250, realisasiRatio: 0.2220 },
      'opsen-pkb': { targetRatio: 0.1300, realisasiRatio: 0.1280 },
      'opsen-bbnkb': { targetRatio: 0.0700, realisasiRatio: 0.0670 },
    })
  },

  // ========================== TAHUN 2026 (BERJALAN) ==========================
  {
    tahun: 2026,
    targetTahun: 337314520548,
    realisasiTahun: 238655221801,
    persentaseTahun: 70.75,
    statusCatatan: 'Tahun Anggaran Berjalan (Cut-off s.d. 1 September 2026)',
    bulanan: [
      { bulan: 'Jan', namaBulan: 'Januari', target: 28109543379, realisasi: 28450210120, pencapaian: 101.21, keterangan: 'Pemberlakuan penuh Opsen PKB & Opsen BBNKB' },
      { bulan: 'Feb', namaBulan: 'Februari', target: 28109543379, realisasi: 29180630100, pencapaian: 103.81, keterangan: 'Kepatuhan setoran PBJT hotel & restoran tinggi' },
      { bulan: 'Mar', namaBulan: 'Maret', target: 28109543379, realisasi: 30010600200, pencapaian: 106.76, keterangan: 'Realisasi TW I tuntas 100% melampaui target' },
      { bulan: 'Apr', namaBulan: 'April', target: 28109543379, realisasi: 31450200350, pencapaian: 111.88, keterangan: 'Penerimaan PBJT kuliner masa libur Idul Fitri' },
      { bulan: 'Mei', namaBulan: 'Mei', target: 28109543379, realisasi: 32151100200, pencapaian: 114.38, keterangan: 'Kenaikan transaksi peralihan hak BPHTB' },
      { bulan: 'Jun', namaBulan: 'Juni', target: 28109543379, realisasi: 32700300300, pencapaian: 116.33, keterangan: 'Surplus rekor semester 1 berkat integrasi opsen' },
      { bulan: 'Jul', namaBulan: 'Juli', target: 28109543379, realisasi: 28950110410, pencapaian: 102.99, keterangan: 'Penerimaan PBB-P2 mulai mengalir deras' },
      { bulan: 'Ags', namaBulan: 'Agustus', target: 28109543379, realisasi: 25762070121, pencapaian: 91.65, keterangan: 'Puncak pelunasan PBB-P2 jatuh tempo 31 Agustus' },
      { bulan: 'Sep', namaBulan: 'September', target: 28109543379, realisasi: 0, pencapaian: 0.0, keterangan: 'Bulan aktif berjalan (s.d. 1 September 2026)' },
      { bulan: 'Okt', namaBulan: 'Oktober', target: 28109543379, realisasi: 0, pencapaian: 0.0, keterangan: 'Target periode triwulan IV berjalan' },
      { bulan: 'Nov', namaBulan: 'November', target: 28109543379, realisasi: 0, pencapaian: 0.0, keterangan: 'Target periode triwulan IV berjalan' },
      { bulan: 'Des', namaBulan: 'Desember', target: 28109543379, realisasi: 0, pencapaian: 0.0, keterangan: 'Target periode triwulan IV berjalan' }
    ],
    triwulan: [
      { quarter: 'TW I', label: 'Triwulan I (Jan - Mar)', target: 84328630137, realisasi: 87641440420, pencapaian: 103.93 },
      { quarter: 'TW II', label: 'Triwulan II (Apr - Jun)', target: 84328630137, realisasi: 96301600850, pencapaian: 114.20 },
      { quarter: 'TW III', label: 'Triwulan III (Jul - Sep)', target: 84328630137, realisasi: 54712180531, pencapaian: 64.88 },
      { quarter: 'TW IV', label: 'Triwulan IV (Okt - Des)', target: 84328630137, realisasi: 0, pencapaian: 0.0 }
    ],
    // Rincian riil 11 Sektor Pajak APBD 2026 Kota Cimahi
    sektorPajak: [
      {
        id: 'pbjt-hotel',
        no: 1,
        jenisPajak: 'PBJT Jasa Perhotelan',
        shortName: 'PBJT Hotel',
        code: '4.1.01.06',
        category: 'pajak_murni',
        group: 'PBJT',
        targetTahun: 300703216,
        realisasiTahun: 221017153,
        persentaseTahun: 73.50,
        targetTriwulan: 219513342,
        realisasiTriwulan: 221017153,
        persentaseTriwulan: 100.69,
        color: '#06b6d4',
        iconName: 'Hotel',
        kontribusiPersen: 0.09,
        deskripsi: 'Pajak Barang dan Jasa Tertentu atas pelayanan penyediaan akomodasi hotel, motel, dan penginapan.',
        triwulan1: 65000000,
        triwulan2: 78000000,
        triwulan3: 78017153,
      },
      {
        id: 'pbjt-mamin',
        no: 2,
        jenisPajak: 'PBJT Makanan atau Minuman',
        shortName: 'PBJT Restoran',
        code: '4.1.01.07',
        category: 'pajak_murni',
        group: 'PBJT',
        targetTahun: 26602215842,
        realisasiTahun: 23074964562,
        persentaseTahun: 86.74,
        targetTriwulan: 18009506766,
        realisasiTriwulan: 23074964562,
        persentaseTriwulan: 128.13,
        color: '#d97706',
        iconName: 'Utensils',
        kontribusiPersen: 9.67,
        deskripsi: 'Pajak atas pelayanan makanan dan minuman yang disediakan oleh restoran, rumah makan, kafe, dan katering.',
        triwulan1: 7200000000,
        triwulan2: 7900000000,
        triwulan3: 7974964562,
      },
      {
        id: 'pbjt-hiburan',
        no: 3,
        jenisPajak: 'PBJT Jasa Kesenian dan Hiburan',
        shortName: 'PBJT Hiburan',
        code: '4.1.01.08',
        category: 'pajak_murni',
        group: 'PBJT',
        targetTahun: 700000000,
        realisasiTahun: 692400513,
        persentaseTahun: 98.91,
        targetTriwulan: 154999992,
        realisasiTriwulan: 692400513,
        persentaseTriwulan: 446.71,
        color: '#8b5cf6',
        iconName: 'Sparkles',
        kontribusiPersen: 0.29,
        deskripsi: 'Pajak atas tontonan film, pagelaran musik, diskotik, klub malam, permainan biliar, dan wahana rekreasi.',
        triwulan1: 210000000,
        triwulan2: 240000000,
        triwulan3: 242400513,
      },
      {
        id: 'pajak-reklame',
        no: 4,
        jenisPajak: 'Pajak Reklame',
        shortName: 'Pajak Reklame',
        code: '4.1.01.09',
        category: 'pajak_murni',
        group: 'PAJAK_LAIN',
        targetTahun: 2759600500,
        realisasiTahun: 2657694100,
        persentaseTahun: 96.31,
        targetTriwulan: 2080472273,
        realisasiTriwulan: 2657694100,
        persentaseTriwulan: 127.74,
        color: '#78716c',
        iconName: 'Megaphone',
        kontribusiPersen: 1.11,
        deskripsi: 'Pajak atas semua penyelenggaraan reklame papan, billboard, videotron, kain, melekat/stiker, dan berjalan.',
        triwulan1: 850000000,
        triwulan2: 900000000,
        triwulan3: 907694100,
      },
      {
        id: 'pbjt-listrik',
        no: 5,
        jenisPajak: 'PBJT Tenaga Listrik',
        shortName: 'PBJT Listrik',
        code: '4.1.01.10',
        category: 'pajak_murni',
        group: 'PBJT',
        targetTahun: 59842594390,
        realisasiTahun: 43566609900,
        persentaseTahun: 72.80,
        targetTriwulan: 41889235299,
        realisasiTriwulan: 43566609900,
        persentaseTriwulan: 104.00,
        color: '#ea580c',
        iconName: 'Zap',
        kontribusiPersen: 18.26,
        deskripsi: 'Pajak atas konsumsi tenaga listrik yang dihasilkan sendiri maupun dari sumber lain (PLN).',
        triwulan1: 14000000000,
        triwulan2: 14700000000,
        triwulan3: 14866609900,
      },
      {
        id: 'pbjt-parkir',
        no: 6,
        jenisPajak: 'PBJT Jasa Parkir',
        shortName: 'PBJT Parkir',
        code: '4.1.01.11',
        category: 'pajak_murni',
        group: 'PBJT',
        targetTahun: 800250000,
        realisasiTahun: 647908442,
        persentaseTahun: 80.96,
        targetTriwulan: 448965000,
        realisasiTriwulan: 647908442,
        persentaseTriwulan: 144.31,
        color: '#64748b',
        iconName: 'Car',
        kontribusiPersen: 0.27,
        deskripsi: 'Pajak atas penyelenggaraan tempat parkir di luar badan jalan, gedung parkir, dan valet parking.',
        triwulan1: 200000000,
        triwulan2: 220000000,
        triwulan3: 227908442,
      },
      {
        id: 'pajak-air-tanah',
        no: 7,
        jenisPajak: 'Pajak Air Tanah',
        shortName: 'Pajak Air Tanah',
        code: '4.1.01.12',
        category: 'pajak_murni',
        group: 'PAJAK_LAIN',
        targetTahun: 30436230561,
        realisasiTahun: 21182903984,
        persentaseTahun: 69.60,
        targetTriwulan: 20208549861,
        realisasiTriwulan: 21182903984,
        persentaseTriwulan: 104.82,
        color: '#6366f1',
        iconName: 'Droplets',
        kontribusiPersen: 8.88,
        deskripsi: 'Pajak atas pengambilan dan/atau pemanfaatan air tanah oleh badan usaha maupun perorangan.',
        triwulan1: 6800000000,
        triwulan2: 7100000000,
        triwulan3: 7282903984,
      },
      {
        id: 'bphtb',
        no: 8,
        jenisPajak: 'Pajak Bea perolehan Hak Atas Tanah dan Bangunan',
        shortName: 'BPHTB',
        code: '4.1.01.13',
        category: 'pajak_murni',
        group: 'PBB_BPHTB',
        targetTahun: 39335000000,
        realisasiTahun: 31072872460,
        persentaseTahun: 79.00,
        targetTriwulan: 20388149998,
        realisasiTriwulan: 31072872460,
        persentaseTriwulan: 152.41,
        color: '#14b8a6',
        iconName: 'Landmark',
        kontribusiPersen: 13.02,
        deskripsi: 'Pajak atas perolehan hak atas tanah dan/atau bangunan karena jual beli, hibah, waris, dan tukar menukar.',
        triwulan1: 9500000000,
        triwulan2: 10500000000,
        triwulan3: 11072872460,
      },
      {
        id: 'pbb-p2',
        no: 9,
        jenisPajak: 'Pajak Bumi dan Bangunan Perkotaan',
        shortName: 'PBB - P2',
        code: '4.1.01.14',
        category: 'pajak_murni',
        group: 'PBB_BPHTB',
        targetTahun: 64534810561,
        realisasiTahun: 53406292587,
        persentaseTahun: 82.76,
        targetTriwulan: 50325981397,
        realisasiTriwulan: 53406292587,
        persentaseTriwulan: 106.12,
        color: '#e11d48',
        iconName: 'Building2',
        kontribusiPersen: 22.38,
        deskripsi: 'Pajak atas bumi dan/atau bangunan yang dimiliki, dikuasai, dan/atau dimanfaatkan oleh orang pribadi atau badan.',
        triwulan1: 15000000000,
        triwulan2: 18000000000,
        triwulan3: 20406292587,
      },
      {
        id: 'opsen-pkb',
        no: 10,
        jenisPajak: 'Opsen PKB',
        shortName: 'Opsen PKB',
        code: '4.1.01.15',
        category: 'opsen',
        group: 'OPSEN',
        targetTahun: 73739622462,
        realisasiTahun: 43764111000,
        persentaseTahun: 59.35,
        targetTriwulan: 61991697972,
        realisasiTriwulan: 43764111000,
        persentaseTriwulan: 70.60,
        color: '#10b981',
        iconName: 'Truck',
        kontribusiPersen: 18.34,
        deskripsi: 'Opsen Pajak Kendaraan Bermotor bagian penerimaan kabupaten/kota sesuai amanat UU HKPD No. 1 Tahun 2022.',
        triwulan1: 14000000000,
        triwulan2: 14500000000,
        triwulan3: 15264111000,
      },
      {
        id: 'opsen-bbnkb',
        no: 11,
        jenisPajak: 'Opsen BBNKB',
        shortName: 'Opsen BBNKB',
        code: '4.1.01.16',
        category: 'opsen',
        group: 'OPSEN',
        targetTahun: 38263493016,
        realisasiTahun: 18368447100,
        persentaseTahun: 48.01,
        targetTriwulan: 30141334135,
        realisasiTriwulan: 18368447100,
        persentaseTriwulan: 60.94,
        color: '#ec4899',
        iconName: 'FileBadge2',
        kontribusiPersen: 7.70,
        deskripsi: 'Opsen Bea Balik Nama Kendaraan Bermotor penyerahan pertama dan kedua yang dialokasikan ke Kas Daerah.',
        triwulan1: 5800000000,
        triwulan2: 6100000000,
        triwulan3: 6468447100,
      },
    ]
  }
];

/**
 * Mendapatkan data tahun tertentu (2019-2026).
 * Jika tidak ditemukan, default ke 2026.
 */
export function getYearData(year: number): YearlyRevenueData {
  const found = YEARLY_REVENUE_HISTORY.find((y) => y.tahun === year);
  if (found) return found;
  return YEARLY_REVENUE_HISTORY[YEARLY_REVENUE_HISTORY.length - 1];
}

/**
 * Mendapatkan daftar seluruh tahun anggaran yang tersedia dari riwayat data (2026 s.d. 2019).
 */
export function getAvailableYears(): number[] {
  return YEARLY_REVENUE_HISTORY.map((y) => y.tahun).sort((a, b) => b - a);
}

/**
 * Mendapatkan daftar 11 Sektor Pajak Daerah sesuai tahun terpilih.
 */
export function getTaxDataByYear(year: number): TaxItem[] {
  const yData = getYearData(year);
  if (yData.sektorPajak && yData.sektorPajak.length > 0) {
    return yData.sektorPajak;
  }
  return YEARLY_REVENUE_HISTORY[YEARLY_REVENUE_HISTORY.length - 1].sektorPajak || [];
}

/**
 * Menghitung rekapitulasi ringkasan (SummaryTotals) secara dinamis sesuai tahun anggaran yang dipilih.
 */
export function getSummaryTotalsByYear(year: number): SummaryTotals {
  const yData = getYearData(year);
  const taxItems = getTaxDataByYear(year);

  // Pajak Murni (Non-Opsen)
  const pajakMurniItems = taxItems.filter((t) => t.category === 'pajak_murni');
  const targetMurni = pajakMurniItems.reduce((acc, t) => acc + t.targetTahun, 0);
  const realisasiMurni = pajakMurniItems.reduce((acc, t) => acc + t.realisasiTahun, 0);
  const targetTWMurni = pajakMurniItems.reduce((acc, t) => acc + (t.targetTriwulan || 0), 0);
  const realisasiTWMurni = pajakMurniItems.reduce((acc, t) => acc + (t.realisasiTriwulan || 0), 0);

  const targetKeseluruhan = yData.targetTahun;
  const realisasiKeseluruhan = yData.realisasiTahun;
  const persenKeseluruhan = yData.persentaseTahun;

  const targetTWTotal = taxItems.reduce((acc, t) => acc + (t.targetTriwulan || 0), 0) || Math.round(targetKeseluruhan * 0.75);
  const realisasiTWTotal = taxItems.reduce((acc, t) => acc + (t.realisasiTriwulan || 0), 0) || Math.round(realisasiKeseluruhan * 0.75);
  const persenTWTotal = targetTWTotal > 0 ? Number(((realisasiTWTotal / targetTWTotal) * 100).toFixed(2)) : 0;

  // Nilai transaksi bulanan/harian
  const currentMonthIdx = year === 2026 ? 8 : 11;
  const mData = yData.bulanan[currentMonthIdx] || yData.bulanan[0];
  const penerimaanBulanIni = mData ? mData.realisasi : 855652255;
  const penerimaanHariIni = Math.round(penerimaanBulanIni / 28) || 855652255;

  return {
    subTotalPajakMurni: {
      targetTahun: targetMurni,
      realisasiTahun: realisasiMurni,
      persentaseTahun: targetMurni > 0 ? Number(((realisasiMurni / targetMurni) * 100).toFixed(2)) : 0,
      targetTriwulan: targetTWMurni,
      realisasiTriwulan: realisasiTWMurni,
      persentaseTriwulan: targetTWMurni > 0 ? Number(((realisasiTWMurni / targetTWMurni) * 100).toFixed(2)) : 0,
    },
    totalKeseluruhan: {
      targetTahun: targetKeseluruhan,
      realisasiTahun: realisasiKeseluruhan,
      persentaseTahun: persenKeseluruhan,
      targetTriwulan: targetTWTotal,
      realisasiTriwulan: realisasiTWTotal,
      persentaseTriwulan: persenTWTotal,
    },
    penerimaanBulanIni: year === 2026 ? 855652255 : penerimaanBulanIni,
    penerimaanHariIni: year === 2026 ? 855652255 : penerimaanHariIni,
    namaHari: 'Selasa',
    namaBulan: year === 2026 ? 'September' : 'Desember',
    tahunAnggaran: year,
    lastUpdated: `Selasa, 1 ${year === 2026 ? 'September 2026' : `Desember ${year}`} | 15:06:47 WIB`,
  };
}

// Default export untuk kompatibilitas mundur (TA 2026)
export const TAX_DATA: TaxItem[] = getTaxDataByYear(2026);
export const SUMMARY_TOTALS: SummaryTotals = getSummaryTotalsByYear(2026);

// Monthly history trend for 2026
export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Jan', target: 28109543379, realisasi: 27500400120, pencapaian: 97.8 },
  { month: 'Feb', target: 28109543379, realisasi: 28940150300, pencapaian: 102.9 },
  { month: 'Mar', target: 28109543379, realisasi: 31200890000, pencapaian: 110.9 },
  { month: 'Apr', target: 28109543379, realisasi: 29400200450, pencapaian: 104.5 },
  { month: 'Mei', target: 28109543379, realisasi: 32800500100, pencapaian: 116.6 },
  { month: 'Jun', target: 28109543379, realisasi: 34100900300, pencapaian: 121.3 },
  { month: 'Jul', target: 28109543379, realisasi: 28900300000, pencapaian: 102.8 },
  { month: 'Agu', target: 28109543379, realisasi: 24957228276, pencapaian: 88.7 },
  { month: 'Sep', target: 28109543379, realisasi: 855652255, pencapaian: 3.0 },
  { month: 'Okt', target: 28109543379, realisasi: 0, pencapaian: 0 },
  { month: 'Nov', target: 28109543379, realisasi: 0, pencapaian: 0 },
  { month: 'Des', target: 28109543379, realisasi: 0, pencapaian: 0 },
];

// Daily trends for recent days
export const DAILY_TRENDS: DailyTrend[] = [
  { date: '25 Agu', dayName: 'Sen', realisasi: 1420500000, target: 1200000000 },
  { date: '26 Agu', dayName: 'Sel', realisasi: 1850300000, target: 1200000000 },
  { date: '27 Agu', dayName: 'Rab', realisasi: 1640100000, target: 1200000000 },
  { date: '28 Agu', dayName: 'Kam', realisasi: 2100800000, target: 1200000000 },
  { date: '29 Agu', dayName: 'Jum', realisasi: 2450000000, target: 1200000000 },
  { date: '30 Agu', dayName: 'Sab', realisasi: 980400000, target: 800000000 },
  { date: '31 Agu', dayName: 'Min', realisasi: 720100000, target: 500000000 },
  { date: '1 Sep', dayName: 'Sel', realisasi: 855652255, target: 1200000000 },
];
