import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed = false,
  setIsCollapsed,
  onLogout
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use controlled prop if provided, else fallback to internal state
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (setIsCollapsed) {
      setIsCollapsed(!collapsed);
    } else {
      setInternalCollapsed(!collapsed);
    }
  };

  // Hanya 2 menu utama sesuai ketentuan user: Dashboard dan Laporan
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'laporan', label: 'Laporan', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 bg-white/95 backdrop-blur-md border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        ${isOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}
      `}>
        {/* Toggle Button for Desktop */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3.5 top-6 z-50 w-7 h-7 bg-white border border-slate-200 text-[#1E293B] hover:text-[#0F172A] hover:border-slate-300 rounded-full shadow-xs items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          title={collapsed ? 'Buka Sidebar' : 'Lipat Sidebar'}
          aria-label={collapsed ? 'Buka Sidebar' : 'Lipat Sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Brand Header with Kota Cimahi Logo */}
        <div className={`px-4 py-5 border-b border-slate-200/90 flex items-center bg-white transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'justify-center' : ''}`}>
            <img 
              src="/assets/aistudio/Bapenda-Logo.png" 
              alt="Logo Bapenda Kota Cimahi" 
              className={`${collapsed ? 'w-7 h-7' : 'w-8 h-8'} object-contain shrink-0`}
            />
            {!collapsed && (
              <div className="truncate transition-opacity duration-300">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#1E293B] text-[15px] tracking-tight truncate">
                    BAPENDA
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    CIMAHI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Pendapatan Pajak Daerah
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {!collapsed && (
            <div className="px-3 mb-2 transition-opacity duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu Utama</span>
            </div>
          )}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                }}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer
                  ${collapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-3'}
                  ${isActive 
                    ? 'bg-[#1E293B] text-white font-semibold shadow-xs' 
                    : 'text-slate-600 hover:text-[#1E293B] hover:bg-slate-100/80'}
                `}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500" />
                )}

                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className={`
                    p-1.5 rounded-lg transition-colors
                    ${isActive ? 'bg-white/15 text-white' : 'text-slate-400 group-hover:text-[#1E293B]'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  item.badge ? (
                    <span className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full border
                      ${isActive 
                        ? 'bg-white/20 text-white border-transparent' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                    `}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-4 h-4 text-slate-300" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className={`border-t border-slate-200 bg-slate-50/60 transition-all duration-300 ${collapsed ? 'p-3 flex flex-col items-center gap-3' : 'p-4'}`}>
          {/* Gateway Bapenda Aktif Info Card (Hidden when collapsed) */}
          {!collapsed && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">Gateway Bapenda Aktif</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Terintegrasi Bank bjb & Kasda Kota Cimahi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls: Status & Logout */}
          {!collapsed ? (
            <div className="flex items-center justify-between pt-1 text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[11px] font-medium text-slate-600">Server Online</span>
              </div>
              <button 
                onClick={onLogout ? onLogout : () => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('pajak_auth_token');
                    localStorage.removeItem('pajak_user');
                    window.location.href = '/login';
                  }
                }}
                className="flex items-center gap-1.5 text-slate-400 hover:text-rose-600 text-[11px] font-medium transition-colors cursor-pointer"
                title="Keluar dari sesi dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogout ? onLogout : () => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('pajak_auth_token');
                  localStorage.removeItem('pajak_user');
                  window.location.href = '/login';
                }
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar dari sesi dashboard"
              aria-label="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

