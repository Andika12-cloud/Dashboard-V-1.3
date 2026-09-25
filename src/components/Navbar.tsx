import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  RefreshCw, 
  ChevronDown, 
  Clock, 
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  // Optional legacy props
  onExport?: () => void;
  onExportClick?: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  sidebarOpen,
  setSidebarOpen,
  searchQuery = '',
  setSearchQuery = (_q: string) => {},
  onRefresh = () => {},
  isRefreshing = false,
  onLogout,
  onOpenProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('Jumat, 4 September 2026 | 10:22:15 WIB');

  // Real-time Indonesian clock simulation formatted for 2026
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = 2026; // Tahun Anggaran 2026
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      
      setCurrentTime(`${dayName}, ${day} ${month} ${year} | ${hours}:${mins}:${secs} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Pembayaran PBJT Restoran',
      desc: 'PT Fast Food Indonesia menyetor Rp 480.000.000 via Kasda bjb',
      time: '3 menit yang lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Validasi NTPD Reklame',
      desc: 'Rekonsiliasi transaksi PT Prisma Advertising terverifikasi SIPD',
      time: '18 menit yang lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Bagi Hasil Opsen PKB',
      desc: 'Penerimaan harian Samsat Cimahi berhasil tersinkronisasi',
      time: '1 jam yang lalu',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-2xs">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* ========================================================= */}
        {/* SISI KIRI: Mobile Menu, Judul Bersih & Live Timestamp */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            type="button"
            onClick={handleToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
            title="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            {/* Judul Bersih tanpa badge */}
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1B365D] tracking-tight">
              Realisasi Pendapatan Pajak Daerah
            </h1>
            
            {/* Timestamp dengan Icon Jam Oranye */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SISI KANAN: Search, Refresh, Notifikasi, & Profile User */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* 1. Input Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari jenis pajak, kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]/15 focus:border-[#1B365D] transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* 2. Tombol Refresh (Background Putih, Border Halus) */}
          <button
            type="button"
            onClick={onRefresh}
            title="Segarkan Data Realisasi"
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1B365D] border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-[#E67E22]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* 3. Tombol Notifikasi (Lonceng dengan Dot Oranye) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-[#1B365D] border border-slate-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Notifikasi Kas Pajak"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E67E22] ring-2 ring-white" />
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1B365D]">Notifikasi Transaksi</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20">
                      2 Baru
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#1B365D] hover:underline font-semibold cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#27AE60] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Profile User (Avatar AD, Status Hijau, Nama, Subtitle, Chevron) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 sm:border-transparent sm:hover:border-slate-200 transition-all cursor-pointer"
            >
              {/* Avatar dengan status indikator hijau */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-xl bg-[#1B365D]/10 text-[#1B365D] font-black flex items-center justify-center text-xs ring-1 ring-[#1B365D]/20">
                  AD
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#27AE60] ring-2 ring-white" />
              </div>

              {/* Detail Nama & Subtitle */}
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">Admin Bapenda</p>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Kabid Pendapatan</p>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden lg:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">Admin Bapenda</p>
                  <p className="text-[11px] text-slate-500">Kabid Pendapatan Daerah</p>
                  <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Online • SIPD Aktif
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenProfile?.();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profil Akun</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hak Akses Verifikator</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button 
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) {
                      onLogout();
                    } else if (typeof window !== 'undefined') {
                      localStorage.removeItem('pajak_auth_token');
                      localStorage.removeItem('pajak_user');
                      window.location.href = '/login';
                    }
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi (Logout)</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
