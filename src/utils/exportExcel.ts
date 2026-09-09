import * as XLSX from 'xlsx';
import { 
  TaxSectorReportItem, 
  getAllSectorTransactions, 
  filterTransactionsByDate 
} from '../data/reportData';

export const exportReportToExcel = (
  data: TaxSectorReportItem[], 
  periode: { start: string; end: string },
  kecamatan: string,
  isYoY: boolean
) => {
  // Sheet 1: Rekapitulasi Sektor Pajak
  const rekapData = data.map((item, index) => {
    const persen2026 = item.target2026 > 0 ? (item.realisasi2026 / item.target2026) * 100 : 0;
    const growthNominal = item.realisasi2026 - item.realisasi2025;
    const growthPersen = item.realisasi2025 > 0 ? (growthNominal / item.realisasi2025) * 100 : 0;

    const row: Record<string, any> = {
      'No': index + 1,
      'Kode Rekening': item.code,
      'Sektor Pajak Daerah': item.jenisPajak,
      'Target APBD 2026 (Rp)': item.target2026,
      'Realisasi Kas 2026 (Rp)': item.realisasi2026,
      'Capaian 2026 (%)': Number(persen2026.toFixed(2)),
      'Setoran Periode Cut-Off (Rp)': item.setoranPeriode || 0,
      'Target Triwulan III (Rp)': item.targetTW,
      'Realisasi Triwulan III (Rp)': item.realisasiTW,
    };

    if (isYoY) {
      row['Realisasi 2025 (Rp)'] = item.realisasi2025;
      row['Pertumbuhan YoY (Rp)'] = growthNominal;
      row['Pertumbuhan YoY (%)'] = Number(growthPersen.toFixed(2));
    }

    return row;
  });

  // Calculate totals
  const totalTarget2026 = data.reduce((acc, curr) => acc + curr.target2026, 0);
  const totalRealisasi2026 = data.reduce((acc, curr) => acc + curr.realisasi2026, 0);
  const totalSetoranPeriode = data.reduce((acc, curr) => acc + (curr.setoranPeriode || 0), 0);
  const totalTargetTW = data.reduce((acc, curr) => acc + curr.targetTW, 0);
  const totalRealisasiTW = data.reduce((acc, curr) => acc + curr.realisasiTW, 0);
  const totalRealisasi2025 = data.reduce((acc, curr) => acc + curr.realisasi2025, 0);

  const totalRow: Record<string, any> = {
    'No': '',
    'Kode Rekening': '',
    'Sektor Pajak Daerah': 'TOTAL KESELURUHAN PAJAK DAERAH',
    'Target APBD 2026 (Rp)': totalTarget2026,
    'Realisasi Kas 2026 (Rp)': totalRealisasi2026,
    'Capaian 2026 (%)': totalTarget2026 > 0 ? Number(((totalRealisasi2026 / totalTarget2026) * 100).toFixed(2)) : 0,
    'Setoran Periode Cut-Off (Rp)': totalSetoranPeriode,
    'Target Triwulan III (Rp)': totalTargetTW,
    'Realisasi Triwulan III (Rp)': totalRealisasiTW,
  };

  if (isYoY) {
    const totalGrowth = totalRealisasi2026 - totalRealisasi2025;
    totalRow['Realisasi 2025 (Rp)'] = totalRealisasi2025;
    totalRow['Pertumbuhan YoY (Rp)'] = totalGrowth;
    totalRow['Pertumbuhan YoY (%)'] = totalRealisasi2025 > 0 ? Number(((totalGrowth / totalRealisasi2025) * 100).toFixed(2)) : 0;
  }

  rekapData.push(totalRow);

  // Sheet 2: Rincian Wajib Pajak / Objek Pajak
  const detailData: Record<string, any>[] = [];
  data.forEach(sector => {
    sector.taxPayers.forEach((wp) => {
      const wpPersen = wp.target2026 > 0 ? (wp.realisasi2026 / wp.target2026) * 100 : 0;
      detailData.push({
        'Kode Sektor': sector.code,
        'Sektor Pajak': sector.jenisPajak,
        'NPWPD': wp.npwpd,
        'NOPD': wp.nopd || '-',
        'Nama Wajib Pajak': wp.namaWajibPajak,
        'Nama Objek Pajak': wp.namaObjek,
        'Kecamatan': wp.kecamatan,
        'Kelurahan': wp.kelurahan,
        'Target 2026 (Rp)': wp.target2026,
        'Realisasi 2026 (Rp)': wp.realisasi2026,
        'Setoran Bulan Ini (Rp)': wp.setoranBulanIni,
        'Capaian (%)': Number(wpPersen.toFixed(2)),
        'Realisasi 2025 (Rp)': wp.realisasi2025,
        'Status Kepatuhan': wp.statusKepatuhan,
      });
    });
  });

  // Sheet 3: Rincian Transaksi Pembayaran Per Tanggal (6 Kolom Sesuai Spesifikasi)
  const transaksiData: Record<string, any>[] = [];
  data.forEach(sector => {
    const allSectorTx = getAllSectorTransactions(sector);
    const dateFilteredTx = filterTransactionsByDate(allSectorTx, periode.start, periode.end);

    dateFilteredTx.forEach((tx) => {
      transaksiData.push({
        'Kode Rekening': sector.code,
        'Sektor Pajak': sector.jenisPajak,
        '1. Tanggal Bayar / TGL SSPD': tx.tanggalBayar,
        '2. No. NTB (Nomor Transaksi Bank)': tx.noNtb,
        'No. SSPD': tx.noSspd,
        'NTPD Kasda': tx.ntpd,
        '3. Nama Wajib Pajak': tx.namaWajibPajak,
        'Nama Objek Pajak': tx.namaObjek,
        'NPWPD': tx.npwpd,
        '4. Masa Pajak': tx.masaPajak,
        '5. Jumlah Setoran (Rp)': tx.nominal,
        'Bank Penampung': tx.bankPenampung,
        'Metode Bayar': tx.metodeBayar,
        '6. Status Pembayaran': tx.statusValidasi,
      });
    });
  });

  const workbook = XLSX.utils.book_new();

  const worksheetRekap = XLSX.utils.json_to_sheet(rekapData);
  const worksheetDetail = XLSX.utils.json_to_sheet(detailData);
  const worksheetTransaksi = XLSX.utils.json_to_sheet(transaksiData);

  XLSX.utils.book_append_sheet(workbook, worksheetRekap, 'Rekapitulasi Pajak');
  XLSX.utils.book_append_sheet(workbook, worksheetDetail, 'Daftar Wajib Pajak');
  XLSX.utils.book_append_sheet(workbook, worksheetTransaksi, 'Transaksi Pembayaran Per Tgl');

  const fileName = `Laporan_Realisasi_Bapenda_Cimahi_${periode.start}_sd_${periode.end}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
