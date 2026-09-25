import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Camera, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Building2, 
  BadgeCheck, 
  Save, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

/**
 * Tipe data profil akun pengguna Bapenda
 */
export interface UserProfileData {
  namaLengkap: string;
  nip: string;
  jabatan: string;
  email: string;
  instansi: string;
  unitKerja?: string;
  avatarUrl?: string;
  statusKepegawaian?: string;
}

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: Partial<UserProfileData>;
  onSave?: (updatedProfile: { email: string; newPassword?: string; avatarUrl?: string }) => void;
  title?: string;
}

export interface ProfileCardProps {
  currentUser?: Partial<UserProfileData>;
  onSave?: (updatedProfile: { email: string; newPassword?: string; avatarUrl?: string }) => void;
  onClose?: () => void;
  isModal?: boolean;
}

/**
 * Komponen Card Form Profil Akun
 * Menggunakan sistem desain modern eksekutif pemerintahan:
 * - Font base global 14px (text-sm)
 * - Sudut membulat rounded-2xl
 * - Tema warna slate (#1E293B / #0F172A) & aksen Bapenda
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  currentUser,
  onSave,
  onClose,
  isModal = false
}) => {
  // Data default pengguna eksekutif Bapenda Kota Cimahi
  const defaultUser: UserProfileData = {
    namaLengkap: 'Drs. H. Hendra Gunawan, M.Si.',
    nip: '19810412 200604 1 009',
    jabatan: 'Kabid Pendapatan',
    email: 'admin.bapenda@cimahikota.go.id',
    instansi: 'Badan Pendapatan Daerah Kota Cimahi',
    unitKerja: 'Bidang Pengelolaan Pendapatan Daerah',
    avatarUrl: '',
    statusKepegawaian: 'ASN Aktif • Pembina Tk. I (IV/b)'
  };

  const initialProfile = { ...defaultUser, ...currentUser };

  // Form states
  const [email, setEmail] = useState<string>(initialProfile.email);
  const [password, setPassword] = useState<string>(''); // Nilai awal kosong sesuai ketentuan
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialProfile.avatarUrl || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inisial avatar cadangan
  const getInitials = (name: string) => {
    return name
      .replace(/^(drs\.|dr\.|h\.|hj\.|ir\.)\s+/i, '')
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'AD';
  };

  // Handler pemilihan gambar foto profil baru
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran file foto maksimal adalah 2MB.');
        return;
      }
      setErrorMessage('');
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Handler simpan form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email instansi tidak valid.');
      return;
    }

    // Validasi password jika diisi
    if (password && password.length < 6) {
      setErrorMessage('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    setIsSubmitting(true);

    // Simulasi proses update data ke API / LocalStorage
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);

      // Simpan perubahan ke callback jika tersedia
      if (onSave) {
        onSave({
          email,
          newPassword: password || undefined,
          avatarUrl: avatarPreview || undefined
        });
      }

      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        setShowSuccessToast(false);
        if (isModal && onClose) {
          // Opsi tutup otomatis setelah sukses
        }
      }, 3000);
    }, 700);
  };

  return (
    <div className="w-full bg-white text-slate-800 text-sm">
      {/* Toast Notifikasi Berhasil */}
      {showSuccessToast && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Profil Berhasil Diperbarui!</span> Perubahan email dan konfigurasi akun telah tersimpan secara aman.
          </div>
        </div>
      )}

      {/* Alert Error jika validasi gagal */}
      {errorMessage && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-medium">{errorMessage}</p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BAGIAN FOTO & JABATAN (HEADER PROFIL)                   */}
      {/* ========================================================= */}
      <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-slate-100">
        {/* Lingkaran Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-[#1B365D] border-4 border-white shadow-lg ring-2 ring-slate-200/90 flex items-center justify-center text-white transition-all">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Foto Profil" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {getInitials(initialProfile.namaLengkap)}
                </span>
                <span className="text-[10px] text-slate-300 font-semibold mt-0.5 uppercase tracking-wider">
                  Bapenda
                </span>
              </div>
            )}
          </div>

          {/* Tombol Kamera Unggah Foto */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-full shadow-md border-2 border-white transition-transform active:scale-95 cursor-pointer"
            title="Ubah foto profil"
          >
            <Camera className="w-4 h-4" />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Nama Lengkap ASN */}
        <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>{initialProfile.namaLengkap}</span>
          <BadgeCheck className="w-4 h-4 text-blue-600 inline shrink-0" />
        </h3>

        {/* Teks Jabatan Pengguna (Kecil, Tebal, dan Abu-abu Profesional) */}
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
          {initialProfile.jabatan}
        </p>

        {/* Informasi Instansi & Badge Hak Akses */}
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <Building2 className="w-3 h-3 text-slate-500" />
            <span>{initialProfile.instansi}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verifikator Kas Daerah</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FORMULIR DATA AKUN                                     */}
      {/* ========================================================= */}
      <form onSubmit={handleSubmit} className="pt-6 space-y-4">
        
        {/* Field 1: Username / NIP (Read-Only / Disabled) */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>Username / NIP</span>
              <span className="text-[10px] font-normal text-slate-400">(Nomor Induk Pegawai)</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>Identitas Tetap</span>
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={initialProfile.nip}
              disabled
              readOnly
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed select-none focus:outline-hidden"
              title="NIP tidak dapat diubah karena merupakan identitas tetap kepegawaian"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
            <span>NIP terdaftar pada sistem BKN dan SIPD Kota Cimahi.</span>
          </p>
        </div>

        {/* Field 2: Password (Kondisi Kosong / Opsional Ganti Password) */}
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Password Baru</span>
            <span className="text-[11px] font-normal text-slate-400 italic">
              (Kosongkan jika tidak ingin mengubah)
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (Masukkan kata sandi baru)"
              autoComplete="new-password"
              className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 transition-all focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Gunakan kombinasi minimal 6 karakter demi menjaga keamanan akun.
          </p>
        </div>

        {/* Field 3: Email Resmi Instansi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Alamat Email Resmi Instansi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh: nama.asn@cimahikota.go.id"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 transition-all focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 focus:outline-hidden"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Digunakan untuk menerima rekap notifikasi transaksi pajak daerah & SSPD.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 3. TOMBOL AKSI                                            */}
        {/* ========================================================= */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-2xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
          )}

          {/* Tombol Simpan Perubahan / Perbarui Profil (#1E293B, rounded-2xl, teks putih) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Perbarui Profil</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

/**
 * Komponen Modal Dialog Profil Akun
 * Membungkus ProfileCard dalam popup modal yang elegan dengan backdrop blur
 */
export const Profile: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
  title = 'Profil Akun Pegawai'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop redup dengan efek blur halus */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Kontainer Modal Box */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-profile-title"
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header Modal Bar */}
        <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-profile-title" className="text-sm font-bold text-slate-900 leading-tight">
                {title}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Manajemen Pajak Daerah Kota Cimahi
              </p>
            </div>
          </div>

          {/* Tombol Tutup X */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
          <ProfileCard
            currentUser={currentUser}
            onSave={onSave}
            onClose={onClose}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
