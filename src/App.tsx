import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { TaxTable } from './components/TaxTable';
import { TaxRankingChart } from './components/TaxRankingChart';
import { TrendRevenueChart } from './components/TrendRevenueChart';
import { TaxDetailModal } from './components/TaxDetailModal';
import { ExportModal } from './components/ExportModal';
import { ReportView } from './components/report/ReportView';
import { TaxItem } from './types';
import { 
  getAggregatedTaxItems, 
  getAggregatedSummaryTotals, 
  filterTransactionsByDateRange 
} from './data/taxData';
import { 
  CheckCircle2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  Info
} from 'lucide-react';

export default function App() {
  // 1. INISIALISASI STATE EKSPLISIT: Selalu diinisialisasi secara eksplisit dengan nilai false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 2. PENGECEKAN TOKEN LEWAT useEffect: Hanya mengecek token setelah komponen berhasil di-mount di browser
  useEffect(() => {
    const token = localStorage.getItem('pajak_auth_token');
    if (token === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'laporan'>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // State Filter Rentang Tanggal Dinamis (Start Date & End Date)
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaxItem, setSelectedTaxItem] = useState<TaxItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);

  // 1. Filter Transaksi Berdasarkan Rentang Tanggal
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByDateRange(startDate, endDate);
  }, [startDate, endDate]);

  // 2. Data Agregasi Pajak Daerah Terfilter (Digunakan oleh TaxTable, TaxRankingChart, MetricCards)
  const filteredTaxData = useMemo(() => {
    return getAggregatedTaxItems(startDate, endDate, selectedYear);
  }, [startDate, endDate, selectedYear]);

  // 3. Ringkasan Total APBD Terfilter (Digunakan oleh MetricCards)
  const filteredSummaryTotals = useMemo(() => {
    return getAggregatedSummaryTotals(startDate, endDate, selectedYear);
  }, [startDate, endDate, selectedYear]);

  // 4. Label Deskripsi Periode Aktif
  const dateRangeLabel = useMemo(() => {
    if (startDate === '2026-01-01' && endDate === '2026-12-31') {
      return 'TA 2026';
    }
    if (startDate === '2025-01-01' && endDate === '2025-12-31') {
      return 'TA 2025';
    }
    if (startDate === '2024-01-01' && endDate === '2024-12-31') {
      return 'TA 2024';
    }
    return `${startDate} s.d. ${endDate}`;
  }, [startDate, endDate]);

  // Handler Sinkronisasi Tanggal
  const handleDateChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    // Sinkronkan selectedYear jika tahun berubah
    const endY = parseInt(newEnd.slice(0, 4), 10);
    if (endY && endY !== selectedYear) {
      setSelectedYear(endY);
    }
  };

  // Handle submit login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Tahan selama 1.5 detik sesuai ketentuan, lalu verifikasi dan redirect
    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
        localStorage.setItem('pajak_auth_token', 'true');
        localStorage.setItem('pajak_user', JSON.stringify({
          name: 'Admin Bapenda',
          role: 'Kepala Bidang Pendapatan Daerah',
          email: 'admin.bapenda@cimahikota.go.id'
        }));
        setIsAuthenticated(true);
        setIsLoggingIn(false);
      } else {
        setIsLoggingIn(false);
        setLoginError('Username atau Password salah! Gunakan "admin" dan "admin".');
      }
    }, 1500);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('pajak_auth_token');
    localStorage.removeItem('pajak_user');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Auto fill credentials
  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin');
    setLoginError('');
  };

  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowRefreshToast(true);
      setTimeout(() => setShowRefreshToast(false), 3000);
    }, 800);
  };

  // 1. Tampilan Halaman Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800 relative overflow-hidden">
        {/* Soft UI Glow Background */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1B365D]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 rounded-full bg-[#E67E22]/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/70 relative z-10">
          {/* Header Bapenda Kota Cimahi */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img
                 src="/assets/logo2.png" 
                 alt="Logo Bapenda Kota Cimahi" 
                 className="w-52 h-auto object-contain" 
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1B365D] bg-[#1B365D]/10 border border-[#1B365D]/20 px-2.5 py-0.5 rounded-full">
                Bapenda Kota Cimahi
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Portal Pendapatan Daerah
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Silakan masuk untuk mengakses rekapitulasi realisasi pajak daerah TA 2026.
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{loginError}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Masukkan username (admin)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1B365D] focus:ring-3 focus:ring-[#1B365D]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-xs font-semibold text-[#E67E22] hover:text-[#D35400] flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Auto-fill Demo</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password (admin)"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1B365D] focus:ring-3 focus:ring-[#1B365D]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#1B365D] border-slate-300 focus:ring-[#1B365D]/20"
                />
                <span className="text-xs text-slate-600 font-medium">Ingat sesi saya</span>
              </label>
              <span className="text-xs text-slate-400">Koneksi SSL Terenkripsi</span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 bg-[#E67E22] hover:bg-[#D35400] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-[#E67E22]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Testing Guide Box */}
          <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs mb-1.5">
              <Info className="w-3.5 h-3.5 text-[#1B365D] shrink-0" />
              <span>Kredensial Testing (Mock Auth):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-normal">Username:</span>
                <span className="font-semibold text-slate-900">admin</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-normal">Password:</span>
                <span className="font-semibold text-slate-900">admin</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#27AE60]" />
            <span>Sistem Informasi Pajak Daerah • Bapenda Kota Cimahi</span>
          </div>
        </div>

        {/* Modal Loading Overlay di Tengah Layar */}
        {isLoggingIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-900/20 flex flex-col items-center text-center transform scale-100 animate-in zoom-in-95 duration-200">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#E67E22]/20 rounded-full blur-xl animate-pulse" />
                <div className="relative p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center">
                  <img
                    src="/assets/Bapenda-Logo.png" 
                    alt="Logo Bapenda Kota Cimahi" 
                    className="w-12 h-12 object-contain animate-pulse"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Bapenda
                </span>
                <span className="text-base sm:text-lg font-bold text-[#E67E22] tracking-tight">
                  Kota Cimahi
                </span>
              </div>

              <p className="text-xs font-medium text-slate-500 mb-6">
                Memverifikasi Akses Admin SIPD...
              </p>

              <div className="flex items-center justify-center">
                <div className="relative w-9 h-9">
                  <div className="w-9 h-9 rounded-full border-3 border-slate-100" />
                  <div className="absolute top-0 left-0 w-9 h-9 rounded-full border-3 border-[#E67E22] border-t-transparent animate-spin" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Tampilan Dashboard Utama
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      {/* Soft UI Sidebar Collapsible */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={() => setIsExportOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onLogout={handleLogout}
        />

        {/* Page Main Body Full Width */}
        <main className="w-full min-h-screen px-4 md:px-6 lg:px-8 py-6 space-y-6">
          {/* Refresh Notification Toast */}
          {showRefreshToast && (
            <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#27AE60] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data realisasi kas daerah Kota Cimahi berhasil diperbarui secara real-time!</span>
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <>
              {/* 1. Baris Atas: Top 3 KPI Metric Cards Terfilter Dinamis */}
              <section className="w-full">
                <MetricCards 
                  selectedYear={selectedYear} 
                  onSelectYear={setSelectedYear} 
                  customSummary={filteredSummaryTotals}
                  customTaxData={filteredTaxData}
                  dateRangeLabel={dateRangeLabel}
                />
              </section>

              {/* 2. Baris Tengah: Table (col-span-12 lg:col-span-8 xl:col-span-9) + Ranking (col-span-12 lg:col-span-4 xl:col-span-3) */}
              <section className="grid grid-cols-12 gap-6 w-full items-start">
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 w-full">
                  <TaxTable 
                    data={filteredTaxData}
                    selectedYear={selectedYear}
                    onSelectTaxItem={(item) => setSelectedTaxItem(item)}
                    searchQuery={searchQuery}
                    categoryFilter={selectedCategory}
                    onNavigateLaporan={() => setActiveTab('laporan')}
                  />
                </div>

                <div className="col-span-12 lg:col-span-4 xl:col-span-3 w-full">
                  <TaxRankingChart 
                    data={filteredTaxData}
                    selectedYear={selectedYear}
                    onSelectTaxItem={(item) => setSelectedTaxItem(item)}
                  />
                </div>
              </section>

              {/* 3. Baris Bawah: Grafik Tren Penerimaan (Full Width Membentang Penuh) */}
              <section className="w-full">
                <TrendRevenueChart 
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                />
              </section>
            </>
          ) : (
            /* Modul Audit & Laporan Rekapitulasi Lengkap Bapenda Kota Cimahi */
            <ReportView 
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onNavigateDashboard={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Modal Rincian Pajak */}
      <TaxDetailModal
        taxItem={selectedTaxItem}
        onClose={() => setSelectedTaxItem(null)}
      />

      {/* Modal Ekspor */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
