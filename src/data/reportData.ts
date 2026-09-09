import { getTaxDataByYear, getYearData } from './dummy';

export interface TaxTransactionRecord {
  id: string;
  noNtb: string; // Nomor Transaksi Bank (NTB)
  noSspd: string; // Nomor Surat Setoran Pajak Daerah (SSPD)
  ntpd: string; // Nomor Transaksi Pendapatan Daerah (NTPD)
  tanggalBayar: string; // Format: YYYY-MM-DD HH:mm:ss
  paymentDate: string; // Format: YYYY-MM-DD HH:mm:ss (Standar filter tanggal)
  tglSspd: string; // Format: YYYY-MM-DD HH:mm:ss (Standar alias filter)
  namaWajibPajak: string;
  namaObjek: string;
  npwpd: string;
  nopd?: string;
  masaPajak: string; // Contoh: "Agustus 2026", "September 2026"
  nominal: number; // Jumlah Setoran (Rp)
  bankPenampung: string;
  metodeBayar: 'Teller Kasda bjb' | 'QRIS Dinamis' | 'Virtual Account bjb' | 'EDC Pos / Agen' | 'Host-to-Host Bank Mandiri';
  statusValidasi: 'Lunas / Diverifikasi Kasda' | 'Valid / Terverifikasi Kasda' | 'Dalam Proses Kliring';
  keterangan?: string;
}

export interface TaxPayerDetail {
  npwpd: string;
  nopd?: string;
  namaWajibPajak: string;
  namaObjek: string;
  alamat?: string;
  kecamatan: 'Cimahi Selatan' | 'Cimahi Tengah' | 'Cimahi Utara';
  kelurahan: string;
  target2026: number;
  realisasi2026: number;
  realisasi2025: number;
  setoranBulanIni: number;
  statusKepatuhan: 'Patuh' | 'Kurang Bayar' | 'Dalam Pengawasan';
  telepon?: string;
  pic?: string;
}

export interface TaxSectorReportItem {
  id: string;
  no: number;
  code: string;
  jenisPajak: string;
  shortName: string;
  iconName: string;
  group: 'PBJT' | 'PBB_BPHTB' | 'OPSEN' | 'PAJAK_LAIN';
  color: string;
  target2026: number;
  realisasi2026: number;
  targetTW: number;
  realisasiTW: number;
  realisasi2025: number;
  setoranPeriode?: number;
  totalTxCountPeriode?: number;
  taxPayers: TaxPayerDetail[];
}

export const KECAMATAN_LIST = [
  'Semua Kecamatan',
  'Cimahi Selatan',
  'Cimahi Tengah',
  'Cimahi Utara'
] as const;

export const REPORT_TAX_DATA: TaxSectorReportItem[] = [
  {
    id: 'pbjt-hotel',
    no: 1,
    code: '4.1.01.06',
    jenisPajak: 'PBJT Jasa Perhotelan',
    shortName: 'Hotel',
    iconName: 'Hotel',
    group: 'PBJT',
    color: '#3B82F6',
    target2026: 300703216,
    realisasi2026: 221017153,
    targetTW: 219513342,
    realisasiTW: 221017153,
    realisasi2025: 198450000,
    taxPayers: [
      { npwpd: 'P.2.0019283.01.24', nopd: 'NOPD-327701-001', namaWajibPajak: 'PT CIMAHI HOTEL INDAH', namaObjek: 'Hotel Grand Cimahi & Convention', alamat: 'Jl. Jend. H. Amir Machmud No. 465', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 120000000, realisasi2026: 92400000, realisasi2025: 85000000, setoranBulanIni: 11500000, statusKepatuhan: 'Patuh', telepon: '022-6654210', pic: 'Budi Santoso' },
      { npwpd: 'P.2.0028471.02.24', nopd: 'NOPD-327702-004', namaWajibPajak: 'CV PESONA ASIA INN', namaObjek: 'Hotel Melati Pesona Cimahi', alamat: 'Jl. Ibu Ganirah No. 12', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeber', target2026: 80000000, realisasi2026: 58617153, realisasi2025: 51200000, setoranBulanIni: 7400000, statusKepatuhan: 'Patuh', telepon: '022-6631980', pic: 'Hendra Gunawan' },
      { npwpd: 'P.2.0039182.03.24', nopd: 'NOPD-327703-009', namaWajibPajak: 'PT SUKADANA ASRI', namaObjek: 'Pondok Wisata & Resort Cimahi', alamat: 'Jl. Kolonel Masturi No. 88', kecamatan: 'Cimahi Utara', kelurahan: 'Cipageran', target2026: 55000000, realisasi2026: 42000000, realisasi2025: 38500000, setoranBulanIni: 5200000, statusKepatuhan: 'Patuh', telepon: '022-6628741', pic: 'Siti Rahma' },
      { npwpd: 'P.2.0048192.01.24', nopd: 'NOPD-327701-015', namaWajibPajak: 'DRA. ENI SUMIATI', namaObjek: 'Griya Kos & Guest House Melati', alamat: 'Jl. Gandawijaya No. 102', kecamatan: 'Cimahi Tengah', kelurahan: 'Karangmekar', target2026: 25703216, realisasi2026: 18000000, realisasi2025: 14750000, setoranBulanIni: 2100000, statusKepatuhan: 'Kurang Bayar', telepon: '0812-2345-6789', pic: 'Dra. Eni Sumiati' },
      { npwpd: 'P.2.0051928.02.24', nopd: 'NOPD-327702-022', namaWajibPajak: 'HOTEL NEO TRANS CIMAHI', namaObjek: 'Neo City Express Hotel', alamat: 'Jl. Raya Cibeureum No. 15', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeureum', target2026: 12000000, realisasi2026: 6200000, realisasi2025: 5500000, setoranBulanIni: 850000, statusKepatuhan: 'Patuh', telepon: '022-6644112', pic: 'Arya Permana' },
      { npwpd: 'P.2.0062839.03.24', nopd: 'NOPD-327703-031', namaWajibPajak: 'WISMA KARTIKA CIMAHI', namaObjek: 'Wisma Tamu Pusdikif', alamat: 'Jl. Sangkuriang No. 20', kecamatan: 'Cimahi Utara', kelurahan: 'Citeureup', target2026: 8000000, realisasi2026: 3800000, realisasi2025: 3500000, setoranBulanIni: 450000, statusKepatuhan: 'Patuh', telepon: '022-6611223', pic: 'Mayor Supratman' }
    ]
  },
  {
    id: 'pbjt-mamin',
    no: 2,
    code: '4.1.01.07',
    jenisPajak: 'PBJT Makanan dan/atau Minuman',
    shortName: 'Restoran',
    iconName: 'Utensils',
    group: 'PBJT',
    color: '#10B981',
    target2026: 26602215842,
    realisasi2026: 23074964562,
    targetTW: 18009506766,
    realisasiTW: 23074964562,
    realisasi2025: 19850000000,
    taxPayers: [
      { npwpd: 'P.2.0001827.01.24', nopd: 'NOPD-MAMIN-001', namaWajibPajak: 'PT FAST FOOD INDONESIA TBK', namaObjek: 'KFC Store Amir Machmud Cimahi', alamat: 'Jl. Raya Amir Machmud No. 340', kecamatan: 'Cimahi Tengah', kelurahan: 'Cigugur Tengah', target2026: 4200000000, realisasi2026: 3850000000, realisasi2025: 3400000000, setoranBulanIni: 480000000, statusKepatuhan: 'Patuh', telepon: '022-6651234', pic: 'Dodi Hidayat' },
      { npwpd: 'P.2.0002938.02.24', nopd: 'NOPD-MAMIN-002', namaWajibPajak: 'PT REKSO NASIONAL FOOD', namaObjek: 'McDonalds Gatot Subroto Drive-thru', alamat: 'Jl. Gatot Subroto No. 55', kecamatan: 'Cimahi Selatan', kelurahan: 'Baros', target2026: 3900000000, realisasi2026: 3520000000, realisasi2025: 3100000000, setoranBulanIni: 440000000, statusKepatuhan: 'Patuh', telepon: '022-6638899', pic: 'Lina Marlina' },
      { npwpd: 'P.2.0003847.03.24', nopd: 'NOPD-MAMIN-003', namaWajibPajak: 'PT BUMI BERKAH BOGA', namaObjek: 'Kopi Kenangan Sangkuriang Express', alamat: 'Jl. Sangkuriang No. 12', kecamatan: 'Cimahi Utara', kelurahan: 'Cipageran', target2026: 2800000000, realisasi2026: 2450000000, realisasi2025: 1950000000, setoranBulanIni: 310000000, statusKepatuhan: 'Patuh', telepon: '022-6625566', pic: 'Reza Fahlevi' },
      { npwpd: 'P.2.0004928.01.24', nopd: 'NOPD-MAMIN-004', namaWajibPajak: 'CV AMBOINA CITRA KULINER', namaObjek: 'Restoran Rumah Makan Padang Sederhana', alamat: 'Jl. Raya Barat No. 78', kecamatan: 'Cimahi Tengah', kelurahan: 'Padasuka', target2026: 3100000000, realisasi2026: 2680000000, realisasi2025: 2350000000, setoranBulanIni: 335000000, statusKepatuhan: 'Patuh', telepon: '022-6648712', pic: 'H. Syamsul Bahri' },
      { npwpd: 'P.2.0005819.02.24', nopd: 'NOPD-MAMIN-005', namaWajibPajak: 'PT SARIMELATI KENCANA TBK', namaObjek: 'Pizza Hut Restaurant & PHD Cibeber', alamat: 'Jl. Mahar Martanegara No. 89', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeber', target2026: 3500000000, realisasi2026: 2980000000, realisasi2025: 2500000000, setoranBulanIni: 370000000, statusKepatuhan: 'Patuh', telepon: '022-6632233', pic: 'Denny Prasetya' },
      { npwpd: 'P.2.0006720.01.24', nopd: 'NOPD-MAMIN-006', namaWajibPajak: 'PT TRANS RETAIL RESTO', namaObjek: 'Wendy’s & Coffee Bean Cimahi Mall', alamat: 'Jl. Gandawijaya Lantai 1', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 2600000000, realisasi2026: 2150000000, realisasi2025: 1900000000, setoranBulanIni: 270000000, statusKepatuhan: 'Patuh', telepon: '022-6658800', pic: 'Vina Pandu' },
      { npwpd: 'P.2.0007831.03.24', nopd: 'NOPD-MAMIN-007', namaWajibPajak: 'CAFE KOPI KOLEKTIF CIMAHI', namaObjek: 'Kopi Toko Djawa Kolonel Masturi', alamat: 'Jl. Kolonel Masturi No. 142', kecamatan: 'Cimahi Utara', kelurahan: 'Pasirkaliki', target2026: 2200000000, realisasi2026: 1840000000, realisasi2025: 1600000000, setoranBulanIni: 230000000, statusKepatuhan: 'Patuh', telepon: '0813-8899-0011', pic: 'Gibran Rakabumi' },
      { npwpd: 'P.2.0008942.02.24', nopd: 'NOPD-MAMIN-008', namaWajibPajak: 'PT PESTA PORA ABADI', namaObjek: 'Mie Gacoan Amir Machmud Cimahi', alamat: 'Jl. Jend. Amir Machmud No. 512', kecamatan: 'Cimahi Selatan', kelurahan: 'Utama', target2026: 4302215842, realisasi2026: 3604964562, realisasi2025: 3050000000, setoranBulanIni: 455000000, statusKepatuhan: 'Patuh', telepon: '0812-7788-9900', pic: 'Fajar Nugraha' }
    ]
  },
  {
    id: 'pbjt-kesenian',
    no: 3,
    code: '4.1.01.08',
    jenisPajak: 'PBJT Kesenian dan Hiburan',
    shortName: 'Hiburan',
    iconName: 'Sparkles',
    group: 'PBJT',
    color: '#8B5CF6',
    target2026: 2884100000,
    realisasi2026: 2337775585,
    targetTW: 2163075000,
    realisasiTW: 2337775585,
    realisasi2025: 2050000000,
    taxPayers: [
      { npwpd: 'P.2.0011928.01.24', nopd: 'NOPD-HBR-001', namaWajibPajak: 'PT NUSANTARA SEJAHTERA RAYA', namaObjek: 'Cinema XXI Cimahi Mall Theater 1-4', alamat: 'Jl. Gandawijaya Lantai 3', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 1800000000, realisasi2026: 1480000000, realisasi2025: 1320000000, setoranBulanIni: 185000000, statusKepatuhan: 'Patuh', telepon: '022-6659900', pic: 'Bambang Irawan' },
      { npwpd: 'P.2.0022839.02.24', nopd: 'NOPD-HBR-002', namaWajibPajak: 'CV TIMEZONE WAHANA JAYA', namaObjek: 'Timezone & Funworld Cimahi Mall', alamat: 'Jl. Gandawijaya Lantai 2', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 650000000, realisasi2026: 520775585, realisasi2025: 450000000, setoranBulanIni: 65000000, statusKepatuhan: 'Patuh', telepon: '022-6659911', pic: 'Citra Kirana' },
      { npwpd: 'P.2.0033748.03.24', nopd: 'NOPD-HBR-003', namaWajibPajak: 'PT NADA SUARA CITRA', namaObjek: 'Masterpiece Family Karaoke Cimahi', alamat: 'Jl. Kolonel Masturi No. 45', kecamatan: 'Cimahi Utara', kelurahan: 'Cipageran', target2026: 434100000, realisasi2026: 337000000, realisasi2025: 280000000, setoranBulanIni: 42000000, statusKepatuhan: 'Patuh', telepon: '022-6627788', pic: 'Ahmad Yani' }
    ]
  },
  {
    id: 'pajak-reklame',
    no: 4,
    code: '4.1.01.09',
    jenisPajak: 'Pajak Reklame',
    shortName: 'Reklame',
    iconName: 'Megaphone',
    group: 'PAJAK_LAIN',
    color: '#F59E0B',
    target2026: 6224343160,
    realisasi2026: 4851221764,
    targetTW: 4668257370,
    realisasiTW: 4851221764,
    realisasi2025: 4120000000,
    taxPayers: [
      { npwpd: 'P.2.0044859.01.24', nopd: 'NOPD-REK-001', namaWajibPajak: 'PT PRISMA ADVERTISING UTAMA', namaObjek: 'Videotron & Billboard Simpang Flyover Cimindi', alamat: 'Jl. Raya Cibeureum Simpang Tiga', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeureum', target2026: 2800000000, realisasi2026: 2250000000, realisasi2025: 1900000000, setoranBulanIni: 280000000, statusKepatuhan: 'Patuh', telepon: '022-6641122', pic: 'Rian Pratama' },
      { npwpd: 'P.2.0055960.02.24', nopd: 'NOPD-REK-002', namaWajibPajak: 'CV MEDIA VISUAL JABAR', namaObjek: 'JPO Reklame & Bando Jl. Amir Machmud', alamat: 'Jl. Amir Machmud No. 200', kecamatan: 'Cimahi Tengah', kelurahan: 'Karangmekar', target2026: 2100000000, realisasi2026: 1650000000, realisasi2025: 1400000000, setoranBulanIni: 210000000, statusKepatuhan: 'Patuh', telepon: '022-6653344', pic: 'Gilang Dirga' },
      { npwpd: 'P.2.0066071.03.24', nopd: 'NOPD-REK-003', namaWajibPajak: 'PT MITRA KARYA DISPLAY', namaObjek: 'Neon Sign & Billboard Gandawijaya', alamat: 'Jl. Gandawijaya Pertokoan', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 1324343160, realisasi2026: 951221764, realisasi2025: 820000000, setoranBulanIni: 120000000, statusKepatuhan: 'Patuh', telepon: '022-6657788', pic: 'Heni Hidayati' }
    ]
  },
  {
    id: 'pbjt-tenaga-listrik',
    no: 5,
    code: '4.1.01.10',
    jenisPajak: 'PBJT Tenaga Listrik',
    shortName: 'Tenaga Listrik',
    iconName: 'Zap',
    group: 'PBJT',
    color: '#EAB308',
    target2026: 58826585149,
    realisasi2026: 41829032483,
    targetTW: 44119938862,
    realisasiTW: 41829032483,
    realisasi2025: 38500000000,
    taxPayers: [
      { npwpd: 'P.2.0000001.01.24', nopd: 'NOPD-PLN-001', namaWajibPajak: 'PT PLN (PERSERO) UID JAWA BARAT UP3 CIMAHI', namaObjek: 'Penyedia Tenaga Listrik Wilayah Kota Cimahi', alamat: 'Jl. Kolonel Masturi No. 1', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 52000000000, realisasi2026: 37200000000, realisasi2025: 34200000000, setoranBulanIni: 4650000000, statusKepatuhan: 'Patuh', telepon: '022-6652000', pic: 'Manajer Keuangan UP3' },
      { npwpd: 'P.2.0000002.02.24', nopd: 'NOPD-GENSET-001', namaWajibPajak: 'PT KAHATEX CIMAHI PLANT (GENSET SENDIRI)', namaObjek: 'Pembangkit Listrik Mandiri Non-PLN Kawasan Industri', alamat: 'Kawasan Industri Cibeureum', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeureum', target2026: 4200000000, realisasi2026: 2980000000, realisasi2025: 2700000000, setoranBulanIni: 370000000, statusKepatuhan: 'Patuh', telepon: '022-6635500', pic: 'Ir. Sutrisno' },
      { npwpd: 'P.2.0000003.02.24', nopd: 'NOPD-GENSET-002', namaWajibPajak: 'PT TRIJAYA TEXTILE INDUSTRI', namaObjek: 'Pembangkit Listrik Cadangan Industri Tekstil', alamat: 'Jl. Mahar Martanegara No. 110', kecamatan: 'Cimahi Selatan', kelurahan: 'Utama', target2026: 2626585149, realisasi2026: 1649032483, realisasi2025: 1600000000, setoranBulanIni: 210000000, statusKepatuhan: 'Patuh', telepon: '022-6638811', pic: 'Johan Halim' }
    ]
  },
  {
    id: 'pbjt-parkir',
    no: 6,
    code: '4.1.01.11',
    jenisPajak: 'PBJT Jasa Parkir',
    shortName: 'Parkir',
    iconName: 'Car',
    group: 'PBJT',
    color: '#6366F1',
    target2026: 3000000000,
    realisasi2026: 2261543763,
    targetTW: 2250000000,
    realisasiTW: 2261543763,
    realisasi2025: 1950000000,
    taxPayers: [
      { npwpd: 'P.2.0077182.01.24', nopd: 'NOPD-PKR-001', namaWajibPajak: 'PT CENTREPARK CITRA CORPORA', namaObjek: 'Gedung Parkir Cimahi Mall', alamat: 'Jl. Gandawijaya No. 1', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 1500000000, realisasi2026: 1150000000, realisasi2025: 980000000, setoranBulanIni: 145000000, statusKepatuhan: 'Patuh', telepon: '022-6657711', pic: 'Eko Prasetyo' },
      { npwpd: 'P.2.0088293.02.24', nopd: 'NOPD-PKR-002', namaWajibPajak: 'PT SECURE PARKING INDONESIA', namaObjek: 'Pelataran Parkir RS Dustira & Stasiun Cimahi', alamat: 'Jl. Dustira No. 1', kecamatan: 'Cimahi Tengah', kelurahan: 'Baros', target2026: 950000000, realisasi2026: 720000000, realisasi2025: 620000000, setoranBulanIni: 90000000, statusKepatuhan: 'Patuh', telepon: '022-6652288', pic: 'Didi Supardi' },
      { npwpd: 'P.2.0099304.03.24', nopd: 'NOPD-PKR-003', namaWajibPajak: 'PENGELOLA PARKIR RAMAYANA CIMAHI', namaObjek: 'Area Parkir Plaza Ramayana Cimahi', alamat: 'Jl. Raya Barat No. 10', kecamatan: 'Cimahi Tengah', kelurahan: 'Padasuka', target2026: 550000000, realisasi2026: 391543763, realisasi2025: 350000000, setoranBulanIni: 48000000, statusKepatuhan: 'Patuh', telepon: '022-6649988', pic: 'Mulyadi' }
    ]
  },
  {
    id: 'pajak-air-tanah',
    no: 7,
    code: '4.1.01.12',
    jenisPajak: 'Pajak Air Tanah (PAT)',
    shortName: 'Air Tanah',
    iconName: 'Droplets',
    group: 'PAJAK_LAIN',
    color: '#06B6D4',
    target2026: 6250000000,
    realisasi2026: 5122116035,
    targetTW: 4687500000,
    realisasiTW: 5122116035,
    realisasi2025: 4500000000,
    taxPayers: [
      { npwpd: 'P.2.0010415.02.24', nopd: 'NOPD-PAT-001', namaWajibPajak: 'PT CHITOSE INTERNASIONAL TBK', namaObjek: 'Sumur Bor Industri 1 & 2 Cibeber', alamat: 'Jl. Mahar Martanegara No. 8', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeber', target2026: 2200000000, realisasi2026: 1850000000, realisasi2025: 1600000000, setoranBulanIni: 230000000, statusKepatuhan: 'Patuh', telepon: '022-6631100', pic: 'Ir. Handoko' },
      { npwpd: 'P.2.0021526.02.24', nopd: 'NOPD-PAT-002', namaWajibPajak: 'PT CENTRAL GEORGETTE NUSANTARA', namaObjek: 'Pengambilan Air Tanah Dyeing Textile', alamat: 'Jl. Cibaligo No. 33', kecamatan: 'Cimahi Selatan', kelurahan: 'Utama', target2026: 2400000000, realisasi2026: 1980000000, realisasi2025: 1750000000, setoranBulanIni: 245000000, statusKepatuhan: 'Patuh', telepon: '022-6632288', pic: 'Drs. Susanto' },
      { npwpd: 'P.2.0032637.03.24', nopd: 'NOPD-PAT-003', namaWajibPajak: 'RSUD CIBABAT KOTA CIMAHI', namaObjek: 'Sumur Dalam Pelayanan Fasilitas Medis', alamat: 'Jl. Jend. H. Amir Machmud No. 140', kecamatan: 'Cimahi Utara', kelurahan: 'Cigugur Tengah', target2026: 1650000000, realisasi2026: 1292116035, realisasi2025: 1150000000, setoranBulanIni: 160000000, statusKepatuhan: 'Patuh', telepon: '022-6652705', pic: 'Bagian Sarpras RSUD' }
    ]
  },
  {
    id: 'pbb-p2',
    no: 8,
    code: '4.1.01.15',
    jenisPajak: 'PBB-P2 (Pedesaan & Perkotaan)',
    shortName: 'PBB-P2',
    iconName: 'Building2',
    group: 'PBB_BPHTB',
    color: '#059669',
    target2026: 62500000000,
    realisasi2026: 42967150920,
    targetTW: 46875000000,
    realisasiTW: 42967150920,
    realisasi2025: 41000000000,
    taxPayers: [
      { npwpd: '32.77.010.001.0001-0', nopd: '32.77.010.001.001-0001.0', namaWajibPajak: 'PT KERETA CEPAT INDONESIA CHINA (KCIC)', namaObjek: 'Kawasan Stasiun & Jalur Whoosh Cimahi', alamat: 'Trase Kereta Cepat Baros', kecamatan: 'Cimahi Selatan', kelurahan: 'Baros', target2026: 15000000000, realisasi2026: 12500000000, realisasi2025: 11000000000, setoranBulanIni: 1500000000, statusKepatuhan: 'Patuh', telepon: '021-3829000', pic: 'Divisi Aset KCIC' },
      { npwpd: '32.77.020.002.0002-0', nopd: '32.77.020.002.002-0002.0', namaWajibPajak: 'PERUM PINDAD PERSERO AREA CIMAHI', namaObjek: 'Kompleks Industri & Pergudangan Militer', alamat: 'Jl. Gatot Subroto No. 1', kecamatan: 'Cimahi Tengah', kelurahan: 'Karangmekar', target2026: 14000000000, realisasi2026: 9800000000, realisasi2025: 9500000000, setoranBulanIni: 1200000000, statusKepatuhan: 'Patuh', telepon: '022-7321964', pic: 'Biro Pengelolaan Aset' },
      { npwpd: '32.77.030.003.0003-0', nopd: '32.77.030.003.003-0003.0', namaWajibPajak: 'PT BUKIT JALIL INDAH (DEVELOPER)', namaObjek: 'Kompleks Perumahan & Ruko Cipageran Asri', alamat: 'Jl. Kolonel Masturi KM 3.5', kecamatan: 'Cimahi Utara', kelurahan: 'Cipageran', target2026: 18500000000, realisasi2026: 12100000000, realisasi2025: 11800000000, setoranBulanIni: 1450000000, statusKepatuhan: 'Patuh', telepon: '022-6643322', pic: 'Gunawan Wibisono' },
      { npwpd: '32.77.010.004.0004-0', nopd: '32.77.010.004.004-0004.0', namaWajibPajak: 'MASYARAKAT WAJIB PAJAK BUKU I & II', namaObjek: 'Rumah Tinggal & Tanah Pekarangan Se-Cimahi', alamat: 'Kolektif 15 Kelurahan Se-Kota Cimahi', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeureum', target2026: 15000000000, realisasi2026: 8567150920, realisasi2025: 8700000000, setoranBulanIni: 980000000, statusKepatuhan: 'Kurang Bayar', telepon: '022-6654274', pic: 'Kolektor Kelurahan' }
    ]
  },
  {
    id: 'bphtb',
    no: 9,
    code: '4.1.01.16',
    jenisPajak: 'BPHTB (Bea Perolehan Hak Tanah & Bangunan)',
    shortName: 'BPHTB',
    iconName: 'Landmark',
    group: 'PBB_BPHTB',
    color: '#0D9488',
    target2026: 52000000000,
    realisasi2026: 39598858223,
    targetTW: 39000000000,
    realisasiTW: 39598858223,
    realisasi2025: 36500000000,
    taxPayers: [
      { npwpd: 'P.2.0044123.01.24', nopd: 'NOT-PPAT-001', namaWajibPajak: 'NOTARIS / PPAT H. DODI SURYADI, SH, M.KN', namaObjek: 'Transaksi Jual Beli Tanah Kawasan Industri Baros', alamat: 'Jl. Baros No. 28', kecamatan: 'Cimahi Selatan', kelurahan: 'Baros', target2026: 18000000000, realisasi2026: 14200000000, realisasi2025: 13000000000, setoranBulanIni: 1750000000, statusKepatuhan: 'Patuh', telepon: '022-6639900', pic: 'H. Dodi Suryadi, SH' },
      { npwpd: 'P.2.0055234.02.24', nopd: 'NOT-PPAT-002', namaWajibPajak: 'NOTARIS / PPAT HJ. NURLAELA, SH', namaObjek: 'Peralihan Hak Waris & Hibah Tanah Cipageran', alamat: 'Jl. Kolonel Masturi No. 70', kecamatan: 'Cimahi Utara', kelurahan: 'Cipageran', target2026: 16000000000, realisasi2026: 12500000000, realisasi2025: 11500000000, setoranBulanIni: 1550000000, statusKepatuhan: 'Patuh', telepon: '022-6624411', pic: 'Hj. Nurlaela, SH' },
      { npwpd: 'P.2.0066345.03.24', nopd: 'NOT-PPAT-003', namaWajibPajak: 'NOTARIS / PPAT BUDI SETIAWAN, SH', namaObjek: 'Akta Perolehan Hak Ruko Pasar Atas Baru', alamat: 'Jl. Kolonel Amir Machmud No. 300', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 18000000000, realisasi2026: 12898858223, realisasi2025: 12000000000, setoranBulanIni: 1620000000, statusKepatuhan: 'Patuh', telepon: '022-6651188', pic: 'Budi Setiawan, SH' }
    ]
  },
  {
    id: 'opsen-pkb',
    no: 10,
    code: '4.1.01.17',
    jenisPajak: 'Opsen Pajak Kendaraan Bermotor (PKB)',
    shortName: 'Opsen PKB',
    iconName: 'Truck',
    group: 'OPSEN',
    color: '#EC4899',
    target2026: 48943717590,
    realisasi2026: 28249826337,
    targetTW: 38557345592,
    realisasiTW: 28249826337,
    realisasi2025: 25000000000,
    taxPayers: [
      { npwpd: 'SAMSAT-CMA-01', nopd: 'OPSEN-PKB-01', namaWajibPajak: 'KANTOR BERSAMA SAMSAT KOTA CIMAHI (KASDA)', namaObjek: 'Penerimaan Opsen PKB Tahunan & 5 Tahunan', alamat: 'Jl. Amir Machmud No. 100', kecamatan: 'Cimahi Tengah', kelurahan: 'Karangmekar', target2026: 35000000000, realisasi2026: 20500000000, realisasi2025: 18000000000, setoranBulanIni: 2600000000, statusKepatuhan: 'Patuh', telepon: '022-6653300', pic: 'Bapenda Jabar & Kasda Cimahi' },
      { npwpd: 'SAMSAT-CMA-02', nopd: 'OPSEN-PKB-02', namaWajibPajak: 'LAYANAN SAMSAT KELILING & OUTLET CIMAHI', namaObjek: 'Penerimaan Opsen PKB Layanan Drive Thru & Samling', alamat: 'Alun-Alun Cimahi & Cimahi Mall', kecamatan: 'Cimahi Tengah', kelurahan: 'Setiamanah', target2026: 13943717590, realisasi2026: 7749826337, realisasi2025: 7000000000, setoranBulanIni: 980000000, statusKepatuhan: 'Patuh', telepon: '022-6654400', pic: 'Petugas Samling bjb' }
    ]
  },
  {
    id: 'opsen-bbnkb',
    no: 11,
    code: '4.1.01.18',
    jenisPajak: 'Opsen Bea Balik Nama Kendaraan Bermotor (BBNKB)',
    shortName: 'Opsen BBNKB',
    iconName: 'FileBadge2',
    group: 'OPSEN',
    color: '#D946EF',
    target2026: 38263493016,
    realisasi2026: 18368447100,
    targetTW: 30141334135,
    realisasiTW: 18368447100,
    realisasi2025: 16800000000,
    taxPayers: [
      { npwpd: 'SAMSAT-BBN-01', nopd: 'OPSEN-BBN-01', namaWajibPajak: 'DEALER & ATPM RESMI WILAYAH CIMAHI', namaObjek: 'Opsen BBNKB Kendaraan Baru (Penyerahan I)', alamat: 'Jl. Amir Machmud No. 120', kecamatan: 'Cimahi Tengah', kelurahan: 'Karangmekar', target2026: 26000000000, realisasi2026: 12200000000, realisasi2025: 11200000000, setoranBulanIni: 1550000000, statusKepatuhan: 'Patuh', telepon: '022-6652211', pic: 'Asosiasi Dealer Kendaraan Cimahi' },
      { npwpd: 'SAMSAT-BBN-02', nopd: 'OPSEN-BBN-02', namaWajibPajak: 'Masyarakat & Balik Nama Kendaraan Bekas', namaObjek: 'Opsen BBNKB Penyerahan II & Seterusnya', alamat: 'Kantor Bersama Samsat Cimahi', kecamatan: 'Cimahi Selatan', kelurahan: 'Cibeber', target2026: 12263493016, realisasi2026: 6168447100, realisasi2025: 5600000000, setoranBulanIni: 780000000, statusKepatuhan: 'Patuh', telepon: '022-6631122', pic: 'Samsat Pelayanan Publik' }
    ]
  }
];

// Helper untuk menghasilkan daftar riwayat transaksi SSPD harian terperinci untuk setiap Wajib Pajak
export const generateTaxTransactions = (wp: TaxPayerDetail): TaxTransactionRecord[] => {
  const bankList = [
    'Bank bjb (Kasda Cimahi)',
    'Bank bjb Digi QRIS',
    'Bank bjb Virtual Account',
    'Bank Mandiri (Host-to-Host)',
    'PT Pos Indonesia (Agen Giropos)'
  ];

  const methods: Array<'Teller Kasda bjb' | 'QRIS Dinamis' | 'Virtual Account bjb' | 'EDC Pos / Agen' | 'Host-to-Host Bank Mandiri'> = [
    'Teller Kasda bjb',
    'QRIS Dinamis',
    'Virtual Account bjb',
    'EDC Pos / Agen',
    'Host-to-Host Bank Mandiri'
  ];

  // Buat daftar transaksi historis 2024, 2025, hingga tahun berjalan 2026
  const months = [
    // Tahun 2026
    { name: 'September 2026', code: '2026-09', days: ['07', '06', '05', '04', '03', '02', '01'], share: 0.12, factor: 1.0 },
    { name: 'Agustus 2026', code: '2026-08', days: ['28', '21', '14', '08', '02'], share: 0.14, factor: 1.0 },
    { name: 'Juli 2026', code: '2026-07', days: ['29', '20', '15', '09', '03'], share: 0.13, factor: 1.0 },
    { name: 'Juni 2026', code: '2026-06', days: ['27', '22', '16', '10', '04'], share: 0.12, factor: 1.0 },
    { name: 'Mei 2026', code: '2026-05', days: ['28', '19', '12', '07', '02'], share: 0.11, factor: 1.0 },
    { name: 'April 2026', code: '2026-04', days: ['29', '23', '15', '08', '03'], share: 0.11, factor: 1.0 },
    { name: 'Maret 2026', code: '2026-03', days: ['27', '20', '14', '09', '04'], share: 0.10, factor: 1.0 },
    { name: 'Februari 2026', code: '2026-02', days: ['26', '18', '12', '06', '01'], share: 0.09, factor: 1.0 },
    { name: 'Januari 2026', code: '2026-01', days: ['30', '22', '15', '08', '05'], share: 0.08, factor: 1.0 },
    // Tahun 2025
    { name: 'Desember 2025', code: '2025-12', days: ['29', '22', '15', '08'], share: 0.11, factor: 0.92 },
    { name: 'November 2025', code: '2025-11', days: ['28', '20', '12', '05'], share: 0.10, factor: 0.92 },
    { name: 'Oktober 2025', code: '2025-10', days: ['27', '19', '11', '04'], share: 0.10, factor: 0.92 },
    { name: 'September 2025', code: '2025-09', days: ['26', '18', '10', '03'], share: 0.09, factor: 0.92 },
    { name: 'Agustus 2025', code: '2025-08', days: ['28', '21', '14', '07'], share: 0.09, factor: 0.92 },
    { name: 'Juli 2025', code: '2025-07', days: ['25', '18', '11', '04'], share: 0.08, factor: 0.92 },
    { name: 'Juni 2025', code: '2025-06', days: ['24', '17', '10', '03'], share: 0.08, factor: 0.92 },
    { name: 'Mei 2025', code: '2025-05', days: ['26', '19', '12', '05'], share: 0.08, factor: 0.92 },
    { name: 'April 2025', code: '2025-04', days: ['25', '18', '11', '04'], share: 0.08, factor: 0.92 },
    { name: 'Maret 2025', code: '2025-03', days: ['26', '19', '12', '05'], share: 0.07, factor: 0.92 },
    { name: 'Februari 2025', code: '2025-02', days: ['25', '18', '11', '04'], share: 0.07, factor: 0.92 },
    { name: 'Januari 2025', code: '2025-01', days: ['27', '20', '13', '06'], share: 0.07, factor: 0.92 },
    // Tahun 2024
    { name: 'Desember 2024', code: '2024-12', days: ['28', '20', '12', '05'], share: 0.10, factor: 0.85 },
    { name: 'November 2024', code: '2024-11', days: ['27', '19', '11', '04'], share: 0.09, factor: 0.85 },
    { name: 'Oktober 2024', code: '2024-10', days: ['26', '18', '10', '03'], share: 0.09, factor: 0.85 },
    { name: 'September 2024', code: '2024-09', days: ['25', '17', '09', '02'], share: 0.08, factor: 0.85 },
    { name: 'Agustus 2024', code: '2024-08', days: ['27', '20', '13', '06'], share: 0.08, factor: 0.85 },
    { name: 'Juli 2024', code: '2024-07', days: ['26', '19', '12', '05'], share: 0.08, factor: 0.85 },
    { name: 'Juni 2024', code: '2024-06', days: ['25', '18', '11', '04'], share: 0.08, factor: 0.85 },
    { name: 'Mei 2024', code: '2024-05', days: ['24', '17', '10', '03'], share: 0.08, factor: 0.85 },
    { name: 'April 2024', code: '2024-04', days: ['26', '19', '12', '05'], share: 0.07, factor: 0.85 },
    { name: 'Maret 2024', code: '2024-03', days: ['25', '18', '11', '04'], share: 0.07, factor: 0.85 },
    { name: 'Februari 2024', code: '2024-02', days: ['27', '20', '13', '06'], share: 0.07, factor: 0.85 },
    { name: 'Januari 2024', code: '2024-01', days: ['26', '19', '12', '05'], share: 0.07, factor: 0.85 }
  ];

  const transactions: TaxTransactionRecord[] = [];
  let txIndex = 1;

  months.forEach((m, mIdx) => {
    // Pada bulan September 2026 (bulan cut-off saat ini), buat 2-3 transaksi harian (misal tgl 01, 03, 05, 07)
    const txCount = m.code === '2026-09' ? 3 : (mIdx % 2 === 0 ? 2 : 1);
    const baseRealisasi = wp.realisasi2026 || 10000000;
    const monthTotal = baseRealisasi * m.share * (m.factor || 1.0);

    for (let i = 0; i < txCount; i++) {
      const day = m.days[i % m.days.length];
      const hour = String(8 + ((txIndex * 3) % 8)).padStart(2, '0');
      const min = String((txIndex * 17) % 60).padStart(2, '0');
      const sec = String((txIndex * 23) % 60).padStart(2, '0');
      const timestamp = `${m.code}-${day} ${hour}:${min}:${sec}`;
      
      let nominal = monthTotal / txCount;
      if (txCount === 3) {
        nominal = i === 0 ? monthTotal * 0.45 : (i === 1 ? monthTotal * 0.35 : monthTotal * 0.20);
      } else if (txCount === 2) {
        nominal = i === 0 ? monthTotal * 0.6 : monthTotal * 0.4;
      }

      const noSspd = `SSPD-${m.code.replace('-', '')}-${String(1000 + txIndex)}`;
      const noNtb = `NTB-BJB-${m.code.replace('-', '')}${day}-${String(3000 + txIndex * 17).slice(0, 5)}`;
      const ntpd = `NTPD-CMA-${String(8472910 + (txIndex * 3829)).slice(0, 10)}`;
      const bank = bankList[txIndex % bankList.length];
      const method = methods[txIndex % methods.length];

      transactions.push({
        id: `tx-${wp.npwpd}-${m.code}-${txIndex}`,
        noNtb,
        noSspd,
        ntpd,
        tanggalBayar: timestamp,
        paymentDate: timestamp,
        tglSspd: timestamp,
        namaWajibPajak: wp.namaWajibPajak,
        namaObjek: wp.namaObjek,
        npwpd: wp.npwpd,
        nopd: wp.nopd,
        masaPajak: m.name,
        nominal: Math.round(nominal),
        bankPenampung: bank,
        metodeBayar: method,
        statusValidasi: 'Lunas / Diverifikasi Kasda',
        keterangan: `Penyetoran Pajak Daerah Masa ${m.name} via ${bank}`
      });

      txIndex++;
    }
  });

  return transactions;
};

// Helper untuk mengambil seluruh transaksi harian dari satu sektor pajak
export const getAllSectorTransactions = (sector: TaxSectorReportItem): TaxTransactionRecord[] => {
  const list: TaxTransactionRecord[] = [];
  sector.taxPayers.forEach(wp => {
    const txs = generateTaxTransactions(wp);
    list.push(...txs);
  });
  // Sort descending by date
  return list.sort((a, b) => new Date(b.tanggalBayar.replace(' ', 'T')).getTime() - new Date(a.tanggalBayar.replace(' ', 'T')).getTime());
};

// Helper untuk menyaring transaksi berdasarkan rentang tanggal cut-off (YYYY-MM-DD)
export const filterTransactionsByDate = (
  transactions: TaxTransactionRecord[],
  startDate: string,
  endDate: string
): TaxTransactionRecord[] => {
  if (!transactions) return [];

  return transactions.filter((item) => {
    // Ambil string tanggal YYYY-MM-DD dari properti paymentDate / tglSspd / tanggalBayar
    const rawDateStr = item.paymentDate || item.tglSspd || item.tanggalBayar || '';
    const itemDate = rawDateStr.split(' ')[0];

    const isAfterStart = !startDate || itemDate >= startDate;
    const isBeforeEnd = !endDate || itemDate <= endDate;

    return isAfterStart && isBeforeEnd;
  });
};

// Helper dinamis untuk menghasilkan data laporan per tahun (2019-2026) tersinkronisasi dengan dummy.ts
export const getReportDataByYear = (year: number = 2026): TaxSectorReportItem[] => {
  const currentTaxes = getTaxDataByYear(year);
  const prevYear = year > 2019 ? year - 1 : 2019;
  const prevTaxes = getTaxDataByYear(prevYear);

  return REPORT_TAX_DATA.map((baseSector) => {
    const cur = currentTaxes.find((t) => t.id === baseSector.id || t.code === baseSector.code || t.no === baseSector.no);
    const prv = prevTaxes.find((t) => t.id === baseSector.id || t.code === baseSector.code || t.no === baseSector.no);

    const targetTahun = cur ? cur.targetTahun : baseSector.target2026;
    const realisasiTahun = cur ? cur.realisasiTahun : baseSector.realisasi2026;
    const realisasiPrev = prv ? prv.realisasiTahun : (baseSector.realisasi2025 || Math.round(realisasiTahun * 0.9));
    const targetTW = cur ? cur.targetTriwulan : baseSector.targetTW;
    const realisasiTW = cur ? cur.realisasiTriwulan : baseSector.realisasiTW;

    // Scale taxpayer details proportionally
    const scale = baseSector.realisasi2026 > 0 ? (realisasiTahun / baseSector.realisasi2026) : 1;
    const targetScale = baseSector.target2026 > 0 ? (targetTahun / baseSector.target2026) : 1;
    const prevScale = baseSector.realisasi2025 > 0 ? (realisasiPrev / baseSector.realisasi2025) : 1;

    const scaledPayers: TaxPayerDetail[] = baseSector.taxPayers.map((wp) => ({
      ...wp,
      target2026: Math.round(wp.target2026 * targetScale),
      realisasi2026: Math.round(wp.realisasi2026 * scale),
      realisasi2025: Math.round(wp.realisasi2025 * prevScale),
      setoranBulanIni: Math.round(wp.setoranBulanIni * scale),
    }));

    return {
      ...baseSector,
      target2026: targetTahun,
      realisasi2026: realisasiTahun,
      targetTW,
      realisasiTW,
      realisasi2025: realisasiPrev,
      taxPayers: scaledPayers,
    };
  });
};
