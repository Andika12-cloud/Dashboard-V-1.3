import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  TaxSectorReportItem, 
  getAllSectorTransactions, 
  filterTransactionsByDate 
} from '../data/reportData';

/**
 * Format string tanggal YYYY-MM-DD menjadi format formal Indonesia (DD/MM/YYYY atau DD MMMM YYYY)
 */
const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
    }
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

/**
 * Palet Warna & Styling Formal Pemerintahan
 * Header: Dark Teal (#1B3B36) dengan teks putih tebal
 * Body: Latar putih bersih, gridlines aktif, border tipis abu-abu (#D1D5DB)
 * Total: Bold dengan double border bawah khas laporan akuntansi resmi
 */
const THEME = {
  headerBg: 'FF1B3B36',     // Dark Teal
  headerText: 'FFFFFFFF',   // Putih
  bodyBg: 'FFFFFFFF',       // Putih Bersih
  totalBg: 'FFF8FAFC',      // Soft Slate
  borderColor: 'FFCBD5E1',  // Slate-300 / Abu-abu Halus
  doubleBorderColor: 'FF1B3B36', // Dark Teal untuk Garis Akuntansi
};

const cellThinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: THEME.borderColor } },
  left: { style: 'thin', color: { argb: THEME.borderColor } },
  bottom: { style: 'thin', color: { argb: THEME.borderColor } },
  right: { style: 'thin', color: { argb: THEME.borderColor } },
};

const totalCellBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: THEME.doubleBorderColor } },
  left: { style: 'thin', color: { argb: THEME.borderColor } },
  bottom: { style: 'double', color: { argb: THEME.doubleBorderColor } },
  right: { style: 'thin', color: { argb: THEME.borderColor } },
};

/**
 * Fungsi Helper Ekspor Excel Laporan Realisasi Pajak Daerah Kota Cimahi
 * Sesuai Standar Formal Pemerintahan:
 * 1. Desain Formal & Clean (Dark Teal Header, Double Border Akuntansi, Gridlines Aktif)
 * 2. Penamaan File & Header Tanggal Dinamis
 * 3. Format Angka Rupiah 'Rp #,##0' (Utuh, Tanpa Notasi Ilmiah E+, Tanpa Desimal)
 * 4. Format Persentase '0.00%' & Rumus/Formula Excel Asli (=SUM(), =E/D)
 * 5. Struktur 2 Sheet: Sheet 1 (Ringkasan Capaian) & Sheet 2 (Laporan_Detail)
 */
export const exportReportToExcel = async (
  data: TaxSectorReportItem[], 
  periode: { start: string; end: string } | string,
  kecamatan: string = 'Semua Kecamatan',
  isYoY: boolean = false
): Promise<void> => {
  // Parsing tanggal input
  const startDate = typeof periode === 'string' ? periode : periode.start;
  const endDate = typeof periode === 'string' ? periode : periode.end;
  const isSameDate = startDate === endDate;
  
  // Format tanggal untuk nama file dan header judul
  const tanggalLabelFile = isSameDate ? endDate : `${startDate}_sd_${endDate}`;
  const tanggalLabelJudul = isSameDate 
    ? formatDateIndo(endDate) 
    : `${formatDateIndo(startDate)} s.d. ${formatDateIndo(endDate)}`;

  const fileName = `Laporan_Realisasi_Pajak_${tanggalLabelFile}.xlsx`;

  // Deteksi tahun anggaran dari tanggal
  const yearMatch = (endDate || startDate).match(/^(\d{4})/);
  const tahunAnggaran = yearMatch ? yearMatch[1] : '2026';

  // Inisialisasi Workbook ExcelJS
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Bapenda Kota Cimahi';
  workbook.lastModifiedBy = 'Sistem Informasi Pendapatan Pajak Daerah (SIPPD)';
  workbook.created = new Date();
  workbook.modified = new Date();

  // =========================================================================
  // SHEET 1: RINGKASAN CAPAIAN
  // =========================================================================
  const sheetRingkasan = workbook.addWorksheet('Ringkasan Capaian', {
    views: [{ showGridLines: true }],
    pageSetup: {
      orientation: 'landscape',
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  // --- Header Dokumen Instansi ---
  sheetRingkasan.mergeCells('A1:H1');
  const titleInstansi = sheetRingkasan.getCell('A1');
  titleInstansi.value = 'PEMERINTAH KOTA CIMAHI • BADAN PENGELOLAAN PENDAPATAN DAERAH';
  titleInstansi.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } };
  titleInstansi.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetRingkasan.getRow(1).height = 24;

  sheetRingkasan.mergeCells('A2:H2');
  const titleLaporan = sheetRingkasan.getCell('A2');
  titleLaporan.value = `LAPORAN REALISASI PAJAK DAERAH KOTA CIMAHI - Per Tanggal ${tanggalLabelJudul}`;
  titleLaporan.font = { name: 'Arial', size: 14, bold: true, color: { argb: THEME.headerBg } };
  titleLaporan.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetRingkasan.getRow(2).height = 26;

  sheetRingkasan.mergeCells('A3:H3');
  const subtitleInfo = sheetRingkasan.getCell('A3');
  subtitleInfo.value = `Tahun Anggaran: ${tahunAnggaran} | Wilayah: ${kecamatan} | Sumber Data: Kas Daerah Host-to-Host bjb & SIPD-RI`;
  subtitleInfo.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };
  subtitleInfo.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetRingkasan.getRow(3).height = 20;

  // Baris kosong pemisah
  sheetRingkasan.getRow(4).height = 10;

  // --- Header Tabel Ringkasan (Baris 5) ---
  const headerRowRingkasan = sheetRingkasan.getRow(5);
  headerRowRingkasan.height = 32;

  const columnsRingkasanConfig = [
    { key: 'no', label: 'No', width: 8, align: 'center' as const },
    { key: 'code', label: 'Kode Rekening', width: 18, align: 'center' as const },
    { key: 'jenisPajak', label: 'Sektor Pajak Daerah', width: 38, align: 'left' as const },
    { key: 'target', label: `Target APBD ${tahunAnggaran}`, width: 24, align: 'right' as const },
    { key: 'realisasi', label: `Realisasi Kas ${tahunAnggaran}`, width: 24, align: 'right' as const },
    { key: 'setoranPeriode', label: 'Setoran Periode Cut-Off', width: 24, align: 'right' as const },
    { key: 'capaian', label: '% Capaian', width: 16, align: 'right' as const },
    { key: 'status', label: 'Status Capaian', width: 22, align: 'center' as const },
  ];

  columnsRingkasanConfig.forEach((col, idx) => {
    const cell = headerRowRingkasan.getCell(idx + 1);
    cell.value = col.label;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: THEME.headerText } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.headerBg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = cellThinBorder;
  });

  // --- Isi Data Baris Tabel Ringkasan ---
  const startRowRingkasan = 6;
  data.forEach((item, index) => {
    const currentRowNumber = startRowRingkasan + index;
    const row = sheetRingkasan.getRow(currentRowNumber);
    row.height = 22;

    // Nilai numerik mentah untuk perhitungan formula
    const targetVal = item.target2026 || 0;
    const realisasiVal = item.realisasi2026 || 0;
    const setoranPeriodeVal = item.setoranPeriode || 0;

    // Status capaian berdasarkan persentase
    const persenValue = targetVal > 0 ? (realisasiVal / targetVal) * 100 : 0;
    let statusLabel = 'Perlu Perhatian';
    if (persenValue >= 100) statusLabel = 'Melampaui Target';
    else if (persenValue >= 80) statusLabel = 'Memenuhi Target';

    // 1. No
    const c1 = row.getCell(1);
    c1.value = index + 1;
    c1.alignment = { horizontal: 'center', vertical: 'middle' };

    // 2. Kode Rekening
    const c2 = row.getCell(2);
    c2.value = item.code;
    c2.alignment = { horizontal: 'center', vertical: 'middle' };

    // 3. Sektor Pajak Daerah
    const c3 = row.getCell(3);
    c3.value = item.jenisPajak;
    c3.alignment = { horizontal: 'left', vertical: 'middle' };

    // 4. Target APBD (Format Rupiah Utuh)
    const c4 = row.getCell(4);
    c4.value = targetVal;
    c4.numFmt = '"Rp "#,##0';
    c4.alignment = { horizontal: 'right', vertical: 'middle' };

    // 5. Realisasi Kas (Format Rupiah Utuh)
    const c5 = row.getCell(5);
    c5.value = realisasiVal;
    c5.numFmt = '"Rp "#,##0';
    c5.alignment = { horizontal: 'right', vertical: 'middle' };

    // 6. Setoran Periode Cut-Off (Format Rupiah Utuh)
    const c6 = row.getCell(6);
    c6.value = setoranPeriodeVal;
    c6.numFmt = '"Rp "#,##0';
    c6.alignment = { horizontal: 'right', vertical: 'middle' };

    // 7. % Capaian (Formula Excel Asli: =Realisasi / Target)
    const c7 = row.getCell(7);
    c7.value = {
      formula: `IF(D${currentRowNumber}>0, E${currentRowNumber}/D${currentRowNumber}, 0)`,
      result: targetVal > 0 ? realisasiVal / targetVal : 0,
    };
    c7.numFmt = '0.00%';
    c7.alignment = { horizontal: 'right', vertical: 'middle' };

    // 8. Status Capaian
    const c8 = row.getCell(8);
    c8.value = statusLabel;
    c8.alignment = { horizontal: 'center', vertical: 'middle' };

    // Terapkan border & styling font pada semua sel di baris ini
    for (let c = 1; c <= 8; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Arial', size: 9.5 };
      cell.border = cellThinBorder;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.bodyBg } };
    }
  });

  // --- Baris Total Keseluruhan (Formula Excel Asli & Double Border) ---
  const endRowRingkasan = startRowRingkasan + data.length - 1;
  const totalRowNumberRingkasan = endRowRingkasan + 1;
  const totalRowRingkasan = sheetRingkasan.getRow(totalRowNumberRingkasan);
  totalRowRingkasan.height = 26;

  // Label Total di kolom 1-3
  sheetRingkasan.mergeCells(`A${totalRowNumberRingkasan}:C${totalRowNumberRingkasan}`);
  const totalLabelCell = sheetRingkasan.getCell(`A${totalRowNumberRingkasan}`);
  totalLabelCell.value = 'TOTAL KESELURUHAN PAJAK DAERAH';
  totalLabelCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  totalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Total Target APBD (=SUM(D6:D16))
  const totTargetCell = totalRowRingkasan.getCell(4);
  totTargetCell.value = { formula: `SUM(D${startRowRingkasan}:D${endRowRingkasan})` };
  totTargetCell.numFmt = '"Rp "#,##0';
  totTargetCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  totTargetCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // Total Realisasi Kas (=SUM(E6:E16))
  const totRealisasiCell = totalRowRingkasan.getCell(5);
  totRealisasiCell.value = { formula: `SUM(E${startRowRingkasan}:E${endRowRingkasan})` };
  totRealisasiCell.numFmt = '"Rp "#,##0';
  totRealisasiCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF059669' } };
  totRealisasiCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // Total Setoran Periode (=SUM(F6:F16))
  const totSetoranCell = totalRowRingkasan.getCell(6);
  totSetoranCell.value = { formula: `SUM(F${startRowRingkasan}:F${endRowRingkasan})` };
  totSetoranCell.numFmt = '"Rp "#,##0';
  totSetoranCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  totSetoranCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // Total % Capaian (=Realisasi Total / Target Total)
  const totCapaianCell = totalRowRingkasan.getCell(7);
  totCapaianCell.value = { 
    formula: `IF(D${totalRowNumberRingkasan}>0, E${totalRowNumberRingkasan}/D${totalRowNumberRingkasan}, 0)` 
  };
  totCapaianCell.numFmt = '0.00%';
  totCapaianCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF059669' } };
  totCapaianCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // Status Kosong / Simbolis di Total
  const totStatusCell = totalRowRingkasan.getCell(8);
  totStatusCell.value = 'REKAPITULASI RESMI';
  totStatusCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF64748B' } };
  totStatusCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Terapkan Total Border (Double Line di Bawah) dan Background
  for (let c = 1; c <= 8; c++) {
    const cell = totalRowRingkasan.getCell(c);
    cell.border = totalCellBorder;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.totalBg } };
  }

  // Auto-fit kolom Sheet 1 dengan margin padding yang aman
  columnsRingkasanConfig.forEach((col, idx) => {
    sheetRingkasan.getColumn(idx + 1).width = col.width;
  });

  // Footer Pengesahan / Dokumen Resmi Bapenda
  const signRowStart = totalRowNumberRingkasan + 3;
  sheetRingkasan.getCell(`F${signRowStart}`).value = `Kota Cimahi, ${formatDateIndo(new Date().toISOString().split('T')[0])}`;
  sheetRingkasan.getCell(`F${signRowStart}`).font = { name: 'Arial', size: 9.5, italic: true };
  
  sheetRingkasan.getCell(`F${signRowStart + 1}`).value = 'Kepala Badan Pengelolaan Pendapatan Daerah,';
  sheetRingkasan.getCell(`F${signRowStart + 1}`).font = { name: 'Arial', size: 9.5, bold: true };
  
  sheetRingkasan.getCell(`F${signRowStart + 5}`).value = 'Drs. H. MOCHAMAD RONI, M.Si.';
  sheetRingkasan.getCell(`F${signRowStart + 5}`).font = { name: 'Arial', size: 10, bold: true, underline: true };
  
  sheetRingkasan.getCell(`F${signRowStart + 6}`).value = 'NIP. 19680512 199303 1 005';
  sheetRingkasan.getCell(`F${signRowStart + 6}`).font = { name: 'Arial', size: 9 };

  // =========================================================================
  // SHEET 2: LAPORAN_DETAIL (Rincian Transaksi Wajib Pajak Per Tanggal)
  // =========================================================================
  const sheetDetail = workbook.addWorksheet('Laporan_Detail', {
    views: [{ showGridLines: true }],
    pageSetup: {
      orientation: 'landscape',
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  // Header Dokumen Sheet 2
  sheetDetail.mergeCells('A1:L1');
  const titleInstansi2 = sheetDetail.getCell('A1');
  titleInstansi2.value = 'PEMERINTAH KOTA CIMAHI • BADAN PENGELOLAAN PENDAPATAN DAERAH';
  titleInstansi2.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } };
  titleInstansi2.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetDetail.getRow(1).height = 24;

  sheetDetail.mergeCells('A2:L2');
  const titleDetail = sheetDetail.getCell('A2');
  titleDetail.value = `RINCIAN TRANSAKSI PENERIMAAN PAJAK DAERAH - Per Tanggal ${tanggalLabelJudul}`;
  titleDetail.font = { name: 'Arial', size: 14, bold: true, color: { argb: THEME.headerBg } };
  titleDetail.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetDetail.getRow(2).height = 26;

  sheetDetail.mergeCells('A3:L3');
  const subtitleDetail = sheetDetail.getCell('A3');
  subtitleDetail.value = `Tahun Anggaran: ${tahunAnggaran} | Filter Wilayah: ${kecamatan} | Status: Valid Terverifikasi Host-to-Host Bank bjb`;
  subtitleDetail.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };
  subtitleDetail.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetDetail.getRow(3).height = 20;

  sheetDetail.getRow(4).height = 10;

  // Header Tabel Sheet 2 (Baris 5)
  const headerRowDetail = sheetDetail.getRow(5);
  headerRowDetail.height = 32;

  const columnsDetailConfig = [
    { label: 'No', width: 6, align: 'center' as const },
    { label: 'Tanggal Bayar', width: 16, align: 'center' as const },
    { label: 'No. Transaksi (NTPD / NTB)', width: 24, align: 'center' as const },
    { label: 'Kode Rekening', width: 16, align: 'center' as const },
    { label: 'Sektor Pajak', width: 28, align: 'left' as const },
    { label: 'Nama Wajib Pajak', width: 32, align: 'left' as const },
    { label: 'NPWPD / NOPD', width: 22, align: 'center' as const },
    { label: 'Masa Pajak', width: 16, align: 'center' as const },
    { label: 'Jumlah Setoran (Rp)', width: 24, align: 'right' as const },
    { label: 'Bank Penampung', width: 20, align: 'center' as const },
    { label: 'Metode Pembayaran', width: 22, align: 'center' as const },
    { label: 'Status Validasi', width: 24, align: 'center' as const },
  ];

  columnsDetailConfig.forEach((col, idx) => {
    const cell = headerRowDetail.getCell(idx + 1);
    cell.value = col.label;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: THEME.headerText } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.headerBg } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = cellThinBorder;
  });

  // Ekstraksi transaksi dari semua sektor data
  const startRowDetail = 6;
  let detailIndex = 0;

  data.forEach((sector) => {
    const allSectorTx = getAllSectorTransactions(sector);
    const dateFilteredTx = filterTransactionsByDate(allSectorTx, startDate, endDate);

    dateFilteredTx.forEach((tx) => {
      detailIndex++;
      const currentRowNumber = startRowDetail + detailIndex - 1;
      const row = sheetDetail.getRow(currentRowNumber);
      row.height = 20;

      // 1. No
      const c1 = row.getCell(1);
      c1.value = detailIndex;
      c1.alignment = { horizontal: 'center', vertical: 'middle' };

      // 2. Tanggal Bayar
      const c2 = row.getCell(2);
      c2.value = tx.tanggalBayar || '-';
      c2.alignment = { horizontal: 'center', vertical: 'middle' };

      // 3. NTPD / NTB
      const c3 = row.getCell(3);
      c3.value = tx.ntpd || tx.noNtb || '-';
      c3.alignment = { horizontal: 'center', vertical: 'middle' };

      // 4. Kode Rekening
      const c4 = row.getCell(4);
      c4.value = sector.code;
      c4.alignment = { horizontal: 'center', vertical: 'middle' };

      // 5. Sektor Pajak
      const c5 = row.getCell(5);
      c5.value = sector.jenisPajak;
      c5.alignment = { horizontal: 'left', vertical: 'middle' };

      // 6. Nama Wajib Pajak
      const c6 = row.getCell(6);
      c6.value = tx.namaWajibPajak;
      c6.alignment = { horizontal: 'left', vertical: 'middle' };

      // 7. NPWPD / NOPD
      const c7 = row.getCell(7);
      c7.value = tx.npwpd || tx.nopd || '-';
      c7.alignment = { horizontal: 'center', vertical: 'middle' };

      // 8. Masa Pajak
      const c8 = row.getCell(8);
      c8.value = tx.masaPajak || '-';
      c8.alignment = { horizontal: 'center', vertical: 'middle' };

      // 9. Jumlah Setoran (Format Rupiah Utuh)
      const c9 = row.getCell(9);
      c9.value = tx.nominal || 0;
      c9.numFmt = '"Rp "#,##0';
      c9.alignment = { horizontal: 'right', vertical: 'middle' };

      // 10. Bank Penampung
      const c10 = row.getCell(10);
      c10.value = tx.bankPenampung || 'Bank bjb Kasda';
      c10.alignment = { horizontal: 'center', vertical: 'middle' };

      // 11. Metode Bayar
      const c11 = row.getCell(11);
      c11.value = tx.metodeBayar || 'Kasda bjb';
      c11.alignment = { horizontal: 'center', vertical: 'middle' };

      // 12. Status Validasi
      const c12 = row.getCell(12);
      c12.value = tx.statusValidasi || 'Lunas / Terverifikasi';
      c12.alignment = { horizontal: 'center', vertical: 'middle' };

      // Styling sel
      for (let c = 1; c <= 12; c++) {
        const cell = row.getCell(c);
        cell.font = { name: 'Arial', size: 9 };
        cell.border = cellThinBorder;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.bodyBg } };
      }
    });
  });

  // Jika tidak ada transaksi dalam rentang cut-off
  if (detailIndex === 0) {
    const row = sheetDetail.getRow(startRowDetail);
    row.height = 28;
    sheetDetail.mergeCells(`A${startRowDetail}:L${startRowDetail}`);
    const emptyCell = sheetDetail.getCell(`A${startRowDetail}`);
    emptyCell.value = 'Tidak ada transaksi setoran penerimaan pada rentang tanggal cut-off yang dipilih.';
    emptyCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    emptyCell.alignment = { horizontal: 'center', vertical: 'middle' };
    emptyCell.border = cellThinBorder;
  } else {
    // Total Baris Transaksi Sheet 2 dengan Formula Asli SUM
    const endRowDetail = startRowDetail + detailIndex - 1;
    const totalRowNumberDetail = endRowDetail + 1;
    const totalRowDetail = sheetDetail.getRow(totalRowNumberDetail);
    totalRowDetail.height = 26;

    sheetDetail.mergeCells(`A${totalRowNumberDetail}:H${totalRowNumberDetail}`);
    const totLabelDetail = sheetDetail.getCell(`A${totalRowNumberDetail}`);
    totLabelDetail.value = `TOTAL KESELURUHAN SETORAN (${detailIndex} TRANSAKSI)`;
    totLabelDetail.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    totLabelDetail.alignment = { horizontal: 'center', vertical: 'middle' };

    // Total Setoran Kolom I (=SUM(I6:I...))
    const totSetoranCol = totalRowDetail.getCell(9);
    totSetoranCol.value = { formula: `SUM(I${startRowDetail}:I${endRowDetail})` };
    totSetoranCol.numFmt = '"Rp "#,##0';
    totSetoranCol.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF059669' } };
    totSetoranCol.alignment = { horizontal: 'right', vertical: 'middle' };

    sheetDetail.mergeCells(`J${totalRowNumberDetail}:L${totalRowNumberDetail}`);
    const totSuffixDetail = sheetDetail.getCell(`J${totalRowNumberDetail}`);
    totSuffixDetail.value = 'TERVERIFIKASI SISTEM';
    totSuffixDetail.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF64748B' } };
    totSuffixDetail.alignment = { horizontal: 'center', vertical: 'middle' };

    for (let c = 1; c <= 12; c++) {
      const cell = totalRowDetail.getCell(c);
      cell.border = totalCellBorder;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: THEME.totalBg } };
    }
  }

  // Set column widths Sheet 2
  columnsDetailConfig.forEach((col, idx) => {
    sheetDetail.getColumn(idx + 1).width = col.width;
  });

  // Tulis ke binary buffer dan download menggunakan file-saver
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, fileName);
};
