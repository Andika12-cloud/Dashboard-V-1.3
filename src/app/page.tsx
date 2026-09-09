'use client';

import React, { useState, useEffect } from 'react';
// Helper useRouter yang kompatibel untuk navigasi browser & Next.js:
const useRouter = () => {
  return {
    push: (url: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    },
    replace: (url: string) => {
      if (typeof window !== 'undefined') {
        window.location.replace(url);
      }
    }
  };
};
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MetricCards } from '../components/MetricCards';
import { TaxTable } from '../components/TaxTable';
import { TaxRankingChart } from '../components/TaxRankingChart';
import { TrendRevenueChart } from '../components/TrendRevenueChart';
import { TaxDetailModal } from '../components/TaxDetailModal';
import { ExportModal } from '../components/ExportModal';
import { ReportView } from '../components/report/ReportView';
import { TaxItem } from '../types';
import { 
  CheckCircle2, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  ShieldCheck,
  Calendar
} from 'lucide-react';

/**
 * Komponen Halaman Utama Dashboard Pendapatan Pajak Daerah (Next.js App Router)
 * Dilengkapi Sistem Autentikasi (Mock Auth) & Tombol Logout.
 */
export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'laporan'>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaxItem, setSelectedTaxItem] = useState<TaxItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [_userProfile, setUserProfile] = useState<{ name: string; role: string } | null>(null);

  // Verifikasi Sesi Login Pengguna
  useEffect(() => {
    const authToken = localStorage.getItem('pajak_auth_token');
    if (authToken !== 'true') {
      setIsAuthenticated(false);
      if (router && typeof router.push === 'function') {
        router.push('/login');
      } else if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      setIsAuthenticated(true);
      const savedUser = localStorage.getItem('pajak_user');
      if (savedUser) {
        try {
          setUserProfile(JSON.parse(savedUser));
        } catch (_e) {
          setUserProfile({ name: 'Admin Bapenda', role: 'Kabid Pendapatan' });
        }
      }
    }
  }, [router]);

  // Fungsi Logout Sesi
  const handleLogout = () => {
    localStorage.removeItem('pajak_auth_token');
    localStorage.removeItem('pajak_user');
    setIsAuthenticated(false);
    
    if (router && typeof router.push === 'function') {
      router.push('/login');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Simulasi sinkronisasi data real-time SIPD & Kasda
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowRefreshToast(true);
      setTimeout(() => setShowRefreshToast(false), 3000);
    }, 800);
  };

  // Render loading state saat cek autentikasi
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E67E22]/10 text-[#E67E22] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Mengarahkan ke Halaman Login</h3>
          <p className="text-xs text-slate-500 mt-1">Sesi belum terautentikasi. Membuka form login...</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full py-2.5 bg-[#1B365D] hover:bg-[#10223D] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Buka Form Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      {/* 1. Sidebar Navigasi Collapsible (Dashboard & Laporan + Tombol Logout) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area yang otomatis menyesuaikan lebar sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navbar dengan Tombol Profil & Logout */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={() => setIsExportOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onLogout={handleLogout}
        />

        {/* Page Main Body Full Width (Enterprise Dashboard Layout) */}
        <main className="w-full min-h-screen px-4 md:px-6 lg:px-8 py-6 space-y-6">
          {/* Toast Notifikasi Sinkronisasi */}
          {showRefreshToast && (
            <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#27AE60] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data realisasi kas daerah Kota Cimahi berhasil diperbarui secara real-time!</span>
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <>
              {/* Year Selector Synchronization Bar */}
              <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#E67E22] flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 tracking-tight">Tahun Anggaran (TA) Aktif:</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                        TA {selectedYear} {selectedYear === 2026 ? '• Berjalan' : ''}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Seluruh data terhubung dinamis ke single source <code className="text-[#1B365D] font-bold">dummy.ts</code> (2019–2026).
                    </span>
                  </div>
                </div>

                {/* Quick Year Selection Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Pilih TA:</span>
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedYear === year
                          ? 'bg-[#1B365D] text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Baris Atas: Top 3 KPI Metric Cards */}
              <section className="w-full">
                <MetricCards 
                  selectedYear={selectedYear} 
                  onSelectYear={setSelectedYear} 
                />
              </section>

              {/* 2. Baris Tengah: Tabel Realisasi 11 Pajak (8/9 cols) + Card Peringkat (4/3 cols) */}
              <section className="grid grid-cols-12 gap-6 w-full items-start">
                {/* Tabel Realisasi */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 w-full">
                  <TaxTable 
                    selectedYear={selectedYear}
                    onSelectTaxItem={(item) => setSelectedTaxItem(item)}
                    searchQuery={searchQuery}
                    categoryFilter={selectedCategory}
                    onNavigateLaporan={() => setActiveTab('laporan')}
                  />
                </div>

                {/* Card Peringkat Capaian */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3 w-full">
                  <TaxRankingChart 
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

      {/* Tax Detail Modal */}
      <TaxDetailModal
        taxItem={selectedTaxItem}
        onClose={() => setSelectedTaxItem(null)}
      />

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
