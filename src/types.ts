export type TaxCategory = 'pajak_murni' | 'opsen';

export type TaxGroup = 'PBJT' | 'PBB_BPHTB' | 'PAJAK_LAIN' | 'OPSEN';

/**
 * Interface Data Pajak Daerah (Bapenda Kota Cimahi)
 */
export interface TaxItem {
  id: string;
  no: number;
  jenisPajak: string;
  shortName: string;
  code: string;
  category: TaxCategory;
  group: TaxGroup;
  
  // Target & Realisasi Tahun Berjalan (APBD TA 2026)
  targetTahun: number;
  realisasiTahun: number;
  persentaseTahun: number;
  
  // Target & Realisasi Triwulan Berjalan
  targetTriwulan: number;
  realisasiTriwulan: number;
  persentaseTriwulan: number;
  
  // Metadata & Visual
  color: string;
  iconName: string;
  kontribusiPersen: number; // Kontribusi terhadap total PAD (contoh: 9.67%)
  deskripsi?: string;
  
  // Rincian Realisasi Tiap Triwulan
  triwulan1?: number;
  triwulan2?: number;
  triwulan3?: number;
  triwulan4?: number;

  // Alias kompatibilitas
  target?: number;
  realisasi?: number;
  persentase?: number;
  status?: string;
}

// Alias untuk interoperabilitas penamaan
export type TaxData = TaxItem;
export type TaxSector = TaxItem;

/**
 * Interface Transaksi Pajak Per Tanggal (Daily Transaction Record)
 */
export interface DailyTaxTransaction {
  id: string;
  tanggal: string; // Format YYYY-MM-DD
  waktu?: string; // Format HH:mm:ss
  hari?: string; // Contoh: "Senin", "Selasa"
  noNtb?: string; // Nomor Transaksi Bank
  noSspd?: string; // Nomor Surat Setoran Pajak Daerah
  ntpd?: string; // Nomor Transaksi Pendapatan Daerah
  namaWajibPajak: string;
  namaObjek?: string;
  npwpd?: string;
  nopd?: string;
  jenisPajak: string;
  kodePajak?: string;
  masaPajak?: string;
  nominal: number; // Jumlah setoran kas (Rp)
  metodeBayar?: string; // Contoh: QRIS Dinamis, Teller Kasda bjb, VA bjb
  bankPenampung?: string;
  statusValidasi?: 'Lunas' | 'Valid' | 'Dalam Proses' | string;
  keterangan?: string;
}

/**
 * Rekam Data Transaksi Sesuai Format Kas Daerah SIPD
 */
export interface TaxTransactionRecord {
  id: string;
  noNtb: string;
  noSspd: string;
  ntpd: string;
  tanggalBayar: string;
  paymentDate: string;
  tglSspd: string;
  namaWajibPajak: string;
  namaObjek: string;
  npwpd: string;
  nopd?: string;
  masaPajak: string;
  nominal: number;
  bankPenampung: string;
  metodeBayar: string;
  statusValidasi: string;
  keterangan?: string;
}

/**
 * Trend Realisasi Harian Per Tanggal
 */
export interface DailyTrend {
  date: string;
  dayName: string;
  realisasi: number;
  target: number;
  pencapaian?: number;
}

/**
 * Trend Realisasi Bulanan
 */
export interface MonthlyTrend {
  month: string;
  target: number;
  realisasi: number;
  pencapaian: number;
}

/**
 * Data Penerimaan Per Bulan (Januari s.d. Desember)
 */
export interface MonthData {
  bulan: string; // 'Jan' | 'Feb' | ... | 'Des'
  namaBulan: string; // 'Januari' | ... | 'Desember'
  target: number;
  realisasi: number;
  pencapaian: number;
  keterangan?: string;
}

/**
 * Data Penerimaan Per Triwulan
 */
export interface QuarterData {
  quarter: string; // 'TW I' | 'TW II' | 'TW III' | 'TW IV'
  label: string;
  realisasi: number;
  target: number;
  pencapaian: number;
  keterangan?: string;
}

/**
 * Data Penerimaan Tahunan (6 Tahun Terakhir 2021 - 2026)
 */
export interface YearlyRevenueData {
  tahun: number;
  targetTahun: number;
  realisasiTahun: number;
  persentaseTahun: number;
  statusCatatan?: string;
  bulanan: MonthData[];
  triwulan?: QuarterData[];
  sektorPajak?: TaxItem[];
}

/**
 * Interface Data Profil Pengguna / Sesi Admin (User Auth)
 */
export interface User {
  id?: string;
  name: string;
  username: string;
  role: string;
  nip?: string;
  email?: string;
  avatar?: string;
  jabatan?: string;
  instansi?: string;
  loginTime?: string;
  token?: string;
  isAuthenticated?: boolean;
}

export type UserProfile = User;

export interface AuthCredentials {
  username: string;
  password?: string;
  rememberMe?: boolean;
}

/**
 * Ringkasan Total APBD & Rekapitulasi Realisasi
 */
export interface SummaryTotals {
  subTotalPajakMurni: {
    targetTahun: number;
    realisasiTahun: number;
    persentaseTahun: number;
    targetTriwulan: number;
    realisasiTriwulan: number;
    persentaseTriwulan: number;
  };
  totalKeseluruhan: {
    targetTahun: number;
    realisasiTahun: number;
    persentaseTahun: number;
    targetTriwulan: number;
    realisasiTriwulan: number;
    persentaseTriwulan: number;
  };
  penerimaanBulanIni: number;
  penerimaanHariIni: number;
  namaHari: string;
  namaBulan: string;
  tahunAnggaran: number;
  lastUpdated: string;
}
