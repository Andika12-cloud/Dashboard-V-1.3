'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  KeyRound 
} from 'lucide-react';
import { User } from '../../types';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Jika sudah memiliki sesi login aktif, redirect otomatis ke halaman utama
  useEffect(() => {
    const isAuth = typeof window !== 'undefined' ? localStorage.getItem('pajak_auth_token') : null;
    if (isAuth === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulasi verifikasi kredensial SIPD Bapenda Cimahi
    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
        const adminUser: User = {
          id: 'adm-001',
          name: 'Admin Bapenda',
          username: 'admin',
          role: 'Kepala Bidang Pendapatan Daerah',
          nip: '19840715 200801 1 004',
          email: 'admin.bapenda@cimahikota.go.id',
          instansi: 'Bapenda Kota Cimahi',
          loginTime: new Date().toISOString(),
          isAuthenticated: true,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('pajak_auth_token', 'true');
          localStorage.setItem('pajak_user', JSON.stringify(adminUser));
        }

        // Navigasi ke Dashboard Utama via Next.js App Router
        router.push('/');
      } else {
        setIsSubmitting(false);
        setErrorMsg('Username atau Password salah! Gunakan "admin" dan "admin".');
      }
    }, 1500);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800 relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1B365D]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 rounded-full bg-[#E67E22]/10 blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/70 relative z-10">
        {/* Header / Logo Bapenda Kota Cimahi */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/Bapenda-Logo.png" 
              alt="Logo Bapenda Kota Cimahi" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1B365D] bg-[#1B365D]/10 border border-[#1B365D]/20 px-2.5 py-0.5 rounded-full">
              BAPENDA KOTA CIMAHI
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B365D] tracking-tight">
            Portal Pendapatan Daerah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Silakan masuk untuk mengakses rekapitulasi realisasi pajak daerah TA 2026.
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input Username */}
          <div>
            <label className="block text-xs font-bold text-[#1B365D] mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Masukkan username (contoh: admin)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1B365D] focus:ring-3 focus:ring-[#1B365D]/15 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1B365D]">
                Password
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                disabled={isSubmitting}
                className="text-[11px] font-bold text-[#E67E22] hover:text-[#D35400] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Isi otomatis username dan password admin"
              >
                <KeyRound className="w-3 h-3" />
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
                disabled={isSubmitting}
                placeholder="Masukkan password (contoh: admin)"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1B365D] focus:ring-3 focus:ring-[#1B365D]/15 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Helper */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded text-[#1B365D] border-slate-300 focus:ring-[#1B365D]/20"
              />
              <span className="text-xs text-slate-600 font-medium">Ingat sesi saya</span>
            </label>
            <span className="text-[11px] text-slate-400">Koneksi SSL Terenkripsi</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-[#E67E22] hover:bg-[#D35400] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#E67E22]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1.5">
            <Info className="w-3.5 h-3.5 text-[#1B365D] shrink-0" />
            <span>Kredensial Testing (Mock Auth):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-medium">Username:</span>
              <code className="font-mono font-bold text-[#1B365D]">admin</code>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-medium">Password:</span>
              <code className="font-mono font-bold text-[#1B365D]">admin</code>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#27AE60]" />
          <span>Sistem Informasi Pajak Daerah • Bapenda Kota Cimahi</span>
        </div>
      </div>

      {/* MODAL LOADING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-900/20 flex flex-col items-center text-center transform scale-100">
            {/* Logo Bapenda Kota Cimahi */}
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

            {/* Identitas Resmi */}
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#1B365D] tracking-tight">
                BAPENDA
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#E67E22] tracking-tight">
                CIMAHI
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 mb-6">
              Memverifikasi Akses Admin...
            </p>

            {/* Spinner */}
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
