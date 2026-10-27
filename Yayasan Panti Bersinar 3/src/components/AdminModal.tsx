import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  Image as ImageIcon,
  FileText,
  Sliders,
  Building2,
  HelpCircle,
  Phone,
  Users,
  DollarSign,
  CheckCircle2,
  Upload,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  History,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import {
  SiteSettings,
  PantiBranch,
  CoreValue,
  FaqItem,
  VolunteerApplication,
  DonationRecord,
  AdminAccessLog,
  FacilityItem,
  ActivityItem,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  PANTI_BRANCHES as DEFAULT_BRANCHES,
  CORE_VALUES as DEFAULT_CORE_VALUES,
  FAQS as DEFAULT_FAQS,
  DEFAULT_FACILITIES,
  DEFAULT_ACTIVITIES,
} from '../data/mockData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  branches: PantiBranch[];
  onUpdateBranches: (newBranches: PantiBranch[]) => void;
  facilities: FacilityItem[];
  onUpdateFacilities: (newFacilities: FacilityItem[]) => void;
  activities: ActivityItem[];
  onUpdateActivities: (newActivities: ActivityItem[]) => void;
  coreValues: CoreValue[];
  onUpdateCoreValues: (newValues: CoreValue[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (newFaqs: FaqItem[]) => void;
  volunteers: VolunteerApplication[];
  onUpdateVolunteers: (apps: VolunteerApplication[]) => void;
  donations: DonationRecord[];
  onUpdateDonations: (donations: DonationRecord[]) => void;
  adminLogs: AdminAccessLog[];
  onAddAdminLog: (log: AdminAccessLog) => void;
}

const PHOTO_PRESETS = [
  { label: 'Children Study Table', url: '/src/assets/images/hero_orphanage_hope_1790578628387.jpg' },
  { label: 'Caregiver & Toddler Nutrition', url: '/src/assets/images/caregiver_nutrition_care_1790578667798.jpg' },
  { label: 'Children Arts & Education', url: '/src/assets/images/children_education_art_1790578654362.jpg' },
  { label: 'Foster Family & Love', url: '/src/assets/images/adoption_family_love_1790578641380.jpg' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onUpdateSettings,
  branches,
  onUpdateBranches,
  facilities = [],
  onUpdateFacilities,
  activities = [],
  onUpdateActivities,
  coreValues,
  onUpdateCoreValues,
  faqs,
  onUpdateFaqs,
  volunteers,
  onUpdateVolunteers,
  donations,
  onUpdateDonations,
  adminLogs,
  onAddAdminLog,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeAdminUser, setActiveAdminUser] = useState('admin@rumahbersinar.org');
  const [loginTimestamp, setLoginTimestamp] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Auto-lock & Session Security State
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPinInput, setUnlockPinInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'photos'
    | 'branches'
    | 'facilities'
    | 'activities'
    | 'content'
    | 'values'
    | 'faq'
    | 'contact'
    | 'volunteers'
    | 'donations'
    | 'audit'
  >('photos');

  // Local Editable States
  const [tempSettings, setTempSettings] = useState<SiteSettings>({ ...siteSettings });
  const [tempBranches, setTempBranches] = useState<PantiBranch[]>([...branches]);
  const [tempFacilities, setTempFacilities] = useState<FacilityItem[]>([...facilities]);
  const [tempActivities, setTempActivities] = useState<ActivityItem[]>([...activities]);
  const [tempCoreValues, setTempCoreValues] = useState<CoreValue[]>([...coreValues]);
  const [tempFaqs, setTempFaqs] = useState<FaqItem[]>([...faqs]);

  // Toast / Notification
  const [saveToast, setSaveToast] = useState(false);
  const [volunteerFilter, setVolunteerFilter] = useState<'All' | 'Pending' | 'Contacted' | 'Approved'>('All');

  // Keep local copies updated when props change
  useEffect(() => {
    setTempSettings({ ...siteSettings });
  }, [siteSettings]);

  useEffect(() => {
    setTempBranches([...branches]);
  }, [branches]);

  useEffect(() => {
    setTempFacilities([...facilities]);
  }, [facilities]);

  useEffect(() => {
    setTempActivities([...activities]);
  }, [activities]);

  useEffect(() => {
    setTempCoreValues([...coreValues]);
  }, [coreValues]);

  useEffect(() => {
    setTempFaqs([...faqs]);
  }, [faqs]);

  // Inactivity Auto-Lock Timer: 3 minutes (180,000 ms)
  useEffect(() => {
    if (!isAuthenticated || isLocked) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const INACTIVITY_MS = 3 * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLocked(true);
        // Record auto-lock log in real database
        onAddAdminLog({
          id: `log-lock-${Date.now()}`,
          adminUser: activeAdminUser,
          action: 'Sesi Terkunci Otomatis (Inaktivitas 3 Menit)',
          timestamp: new Date().toISOString(),
          status: 'Auto-Locked',
          userAgent: navigator.userAgent.slice(0, 100),
          details: 'Sistem keamanan otomatis mengunci dashboard karena tidak ada interaksi pengguna.',
        });
      }, INACTIVITY_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [isAuthenticated, isLocked, activeAdminUser, onAddAdminLog]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usernameInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    if (
      (user === 'admin' || user === 'admin@rumahbersinar.org' || user === 'yayasan' || user === 'admin@gmail.com') &&
      (pass === 'admin123' || pass === 'admin' || pass === 'yayasan2019' || pass === 'bersinar2026')
    ) {
      const email = user.includes('@') ? user : `${user}@rumahbersinar.org`;
      const timeStr = new Date().toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'medium',
      });
      setIsAuthenticated(true);
      setIsLocked(false);
      setActiveAdminUser(email);
      setLoginTimestamp(timeStr);
      setAuthError(false);

      // Record login in Real Database Log
      onAddAdminLog({
        id: `log-login-${Date.now()}`,
        adminUser: email,
        action: 'Login Admin Berhasil',
        timestamp: new Date().toISOString(),
        status: 'Success',
        userAgent: navigator.userAgent.slice(0, 100),
        details: 'Admin masuk melalui autentikasi kredensial resmi Yayasan.',
      });
    } else {
      setAuthError(true);
    }
  };

  const handleQuickDemoFill = () => {
    setUsernameInput('admin@rumahbersinar.org');
    setPasswordInput('bersinar2026');
    const timeStr = new Date().toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    setIsAuthenticated(true);
    setIsLocked(false);
    setActiveAdminUser('admin@rumahbersinar.org');
    setLoginTimestamp(timeStr);
    setAuthError(false);

    onAddAdminLog({
      id: `log-login-${Date.now()}`,
      adminUser: 'admin@rumahbersinar.org',
      action: 'Login Admin Demo Cepat',
      timestamp: new Date().toISOString(),
      status: 'Success',
      userAgent: navigator.userAgent.slice(0, 100),
      details: 'Admin masuk menggunakan kredensial cepat.',
    });
  };

  // Handle Manual Lock Screen
  const handleManualLock = () => {
    setIsLocked(true);
    onAddAdminLog({
      id: `log-lock-${Date.now()}`,
      adminUser: activeAdminUser,
      action: 'Kunci Layar Manual oleh Admin',
      timestamp: new Date().toISOString(),
      status: 'Locked',
      userAgent: navigator.userAgent.slice(0, 100),
      details: 'Admin menekan tombol kunci layar manual untuk mengamankan sesi.',
    });
  };

  // Handle Unlock Screen
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = unlockPinInput.trim();
    if (pin === '2026' || pin === 'admin123' || pin === 'admin' || pin === 'bersinar2026') {
      setIsLocked(false);
      setUnlockPinInput('');
      setUnlockError(false);

      onAddAdminLog({
        id: `log-unlock-${Date.now()}`,
        adminUser: activeAdminUser,
        action: 'Buka Kunci Layar Admin Berhasil',
        timestamp: new Date().toISOString(),
        status: 'Unlocked',
        userAgent: navigator.userAgent.slice(0, 100),
        details: 'Admin memasukkan PIN/Password yang benar untuk melanjutkan sesi.',
      });
    } else {
      setUnlockError(true);
    }
  };

  // Handle Full Logout
  const handleLogout = () => {
    onAddAdminLog({
      id: `log-logout-${Date.now()}`,
      adminUser: activeAdminUser,
      action: 'Logout Sesi Penuh',
      timestamp: new Date().toISOString(),
      status: 'Success',
      userAgent: navigator.userAgent.slice(0, 100),
      details: 'Admin keluar dari sesi dashboard.',
    });
    setIsAuthenticated(false);
    setIsLocked(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Image Upload helper
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save All Changes
  const handleSaveAll = () => {
    onUpdateSettings(tempSettings);
    onUpdateBranches(tempBranches);
    onUpdateFacilities(tempFacilities);
    onUpdateActivities(tempActivities);
    onUpdateCoreValues(tempCoreValues);
    onUpdateFaqs(tempFaqs);
    setSaveToast(true);

    onAddAdminLog({
      id: `log-update-${Date.now()}`,
      adminUser: activeAdminUser,
      action: 'Pembaruan Foto, Logo & Konten Realtime',
      timestamp: new Date().toISOString(),
      status: 'Update',
      userAgent: navigator.userAgent.slice(0, 100),
      details: 'Pengaturan situs, 4 cabang panti, logo cabang, fasilitas, dan kegiatan berhasil diperbarui di database.',
    });

    setTimeout(() => setSaveToast(false), 3000);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm('Kembalikan semua teks, foto, fasilitas, kegiatan, dan FAQ website ke pengaturan awal resmi?')) {
      setTempSettings(DEFAULT_SITE_SETTINGS);
      setTempBranches(DEFAULT_BRANCHES);
      setTempFacilities(DEFAULT_FACILITIES);
      setTempActivities(DEFAULT_ACTIVITIES);
      setTempCoreValues(DEFAULT_CORE_VALUES);
      setTempFaqs(DEFAULT_FAQS);
      onUpdateSettings(DEFAULT_SITE_SETTINGS);
      onUpdateBranches(DEFAULT_BRANCHES);
      onUpdateFacilities(DEFAULT_FACILITIES);
      onUpdateActivities(DEFAULT_ACTIVITIES);
      onUpdateCoreValues(DEFAULT_CORE_VALUES);
      onUpdateFaqs(DEFAULT_FAQS);
      setSaveToast(true);

      onAddAdminLog({
        id: `log-reset-${Date.now()}`,
        adminUser: activeAdminUser,
        action: 'Reset Pengaturan ke Default Resmi',
        timestamp: new Date().toISOString(),
        status: 'Update',
        userAgent: navigator.userAgent.slice(0, 100),
        details: 'Semua foto, logo panti, fasilitas dan data dikembalikan ke setting pabrik.',
      });

      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const handleBranchPhotoChange = (branchId: string, newUrl: string) => {
    setTempBranches(
      tempBranches.map((b) => (b.id === branchId ? { ...b, imageUrl: newUrl } : b))
    );
  };

  // FAQ helpers
  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'Pertanyaan Baru',
      answer: 'Penjelasan atau jawaban rinci untuk pengunjung website.',
    };
    setTempFaqs([...tempFaqs, newFaq]);
  };

  const handleDeleteFaq = (id: string) => {
    setTempFaqs(tempFaqs.filter((f) => f.id !== id));
  };

  const handleUpdateVolunteerStatus = (id: string, status: 'Pending' | 'Contacted' | 'Approved') => {
    const updated = volunteers.map((v) => (v.id === id ? { ...v, status } : v));
    onUpdateVolunteers(updated);
    onAddAdminLog({
      id: `log-vol-${Date.now()}`,
      adminUser: activeAdminUser,
      action: `Ubah Status Relawan (${status})`,
      timestamp: new Date().toISOString(),
      status: 'Update',
      details: `Relawan ID: ${id} status diperbarui ke ${status}.`,
    });
  };

  const handleDeleteVolunteer = (id: string) => {
    if (confirm('Hapus lamaran relawan ini?')) {
      onUpdateVolunteers(volunteers.filter((v) => v.id !== id));
    }
  };

  const handleToggleDonation = (txnId: string) => {
    const updated = donations.map((d) =>
      d.transactionId === txnId
        ? { ...d, status: (d.status === 'Verified' ? 'Pending' : 'Verified') as 'Verified' | 'Pending' }
        : d
    );
    onUpdateDonations(updated);
    onAddAdminLog({
      id: `log-don-${Date.now()}`,
      adminUser: activeAdminUser,
      action: 'Verifikasi Kas Donasi',
      timestamp: new Date().toISOString(),
      status: 'Update',
      details: `Status donasi ${txnId} diubah.`,
    });
  };

  const filteredVolunteers = volunteers.filter((v) =>
    volunteerFilter === 'All' ? true : v.status === volunteerFilter
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-[#FFFDF9] dark:bg-[#18110a] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 text-ink dark:text-stone-100">
        
        {/* Top Header Bar */}
        <div className="bg-[#241708] text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e8a70a] to-[#ea580c] flex items-center justify-center text-[#241708] font-bold shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-heading font-bold text-white">
                  Yayasan Rumah Bersinar Admin CMS
                </h2>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active Session
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-200/80">
                Pusat Pengelolaan Foto, Konten, dan Database Realtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && !isLocked && (
              <>
                <button
                  onClick={handleManualLock}
                  className="text-xs text-amber-200 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 transition-colors"
                  title="Kunci Layar Admin"
                >
                  <Lock className="w-3.5 h-3.5 text-[#f1b607]" />
                  <span className="hidden sm:inline">Kunci Layar</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-stone-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CASE 1: UNLOCKED BUT NOT AUTHENTICATED -> LOGIN FORM */}
        {/* ---------------------------------------------------- */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto w-full">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-[#ea580c] dark:text-[#f1b607] mx-auto mb-4 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#352106] dark:text-amber-100 mb-1">
              Login Pengurus / Admin
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">
              Masukkan email/username dan password administrator untuk merubah foto, deskripsi, dan mengelola database donasi.
            </p>

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-stone-200 mb-1">
                  Email atau Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="admin@rumahbersinar.org"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white dark:bg-stone-900 text-ink dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-stone-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white dark:bg-stone-900 text-ink dark:text-white"
                  />
                </div>
                {authError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    Kredensial tidak cocok. Gunakan <strong>admin@rumahbersinar.org</strong> & <strong>bersinar2026</strong>.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-heading font-bold text-xs bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] shadow-sm transition-all cursor-pointer"
              >
                Masuk ke Admin Portal
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs text-[#814f34] dark:text-amber-400 hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f1b607]" />
                Demo 1-Klik: Masuk Cepat
              </button>
            </div>
          </div>
        ) : isLocked ? (
          /* ---------------------------------------------------- */
          /* CASE 2: AUTHENTICATED BUT LOCKED (AUTO-LOCK SCREEN) */
          /* ---------------------------------------------------- */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto w-full animate-in fade-in">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-full flex items-center justify-center text-[#ea580c] dark:text-[#f1b607] mx-auto mb-4 border-4 border-amber-200 dark:border-amber-800 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold mb-3 border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Sesi Admin Terkunci Otomatis
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#352106] dark:text-amber-100 mb-1">
              Keamanan Data Panti Aktif
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
              Sesi Anda telah dikunci secara otomatis demi mencegah akses tanpa izin jika ditinggalkan.
            </p>
            <div className="p-2.5 bg-stone-100 dark:bg-stone-900 rounded-xl mb-5 text-xs text-stone-700 dark:text-stone-300 font-mono">
              Admin Aktif: <strong className="text-[#ea580c] dark:text-[#f1b607]">{activeAdminUser}</strong>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-stone-200 mb-1">
                  Masukkan PIN (2026) atau Password:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Masukkan PIN 2026..."
                    value={unlockPinInput}
                    onChange={(e) => {
                      setUnlockPinInput(e.target.value);
                      if (unlockError) setUnlockError(false);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white dark:bg-stone-900 text-ink dark:text-white"
                  />
                </div>
                {unlockError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    PIN/Password salah! Gunakan PIN: <strong>2026</strong>.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg font-heading font-bold text-xs bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] shadow-sm transition-all cursor-pointer"
                >
                  Buka Kunci Layar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                >
                  Keluar Penuh
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500">
              PIN default buka kunci: <code className="text-[#ea580c] font-bold">2026</code>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* CASE 3: AUTHENTICATED & UNLOCKED -> FULL DASHBOARD */
          /* ---------------------------------------------------- */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Halo Greeting & Accountability Tracking Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-amber-100/40 to-stone-50 dark:from-stone-900 dark:via-amber-950/30 dark:to-stone-900 p-4 border-b border-amber-200/80 dark:border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-heading font-bold text-sm text-[#352106] dark:text-amber-50 block">
                      Halo, {activeAdminUser}!
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Sesi Admin Aktif · Terhubung Real Database Supabase
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 font-mono bg-white dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#f1b607]" />
                    <span>Akses Terakhir: <strong>{loginTimestamp || 'Sesi Saat Ini'}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualLock}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Kunci sesi admin agar aman saat ditinggalkan"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Kunci Sesi</span>
                  </button>
                </div>
              </div>

              {/* Prominent Accountability Card: Display List of Last Actions Taken in the System */}
              <div className="p-3 bg-white dark:bg-[#1a140e] rounded-xl border border-amber-200/80 dark:border-stone-800 text-xs space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#f1b607]">
                    <History className="w-3.5 h-3.5" />
                    <span>Daftar Akuntabilitas & Aksi Terakhir Petugas (Accountability Log)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('audit')}
                    className="text-[11px] font-semibold text-[#814f34] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Lihat Semua Log ({adminLogs.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {adminLogs.slice(0, 3).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-[#352106] dark:text-amber-100 truncate">
                            {log.adminUser}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              log.status === 'Success'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : log.status === 'Update'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <p className="font-semibold text-stone-700 dark:text-stone-300 line-clamp-1">
                          {log.action}
                        </p>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-1 pt-1 border-t border-stone-200/60 dark:border-stone-800">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB ·{' '}
                        {new Date(log.timestamp).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simple, Lightweight Tab Bar */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900 px-4 pt-2 overflow-x-auto gap-1 text-xs">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'photos'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Foto Website</span>
              </button>

              <button
                onClick={() => setActiveTab('branches')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'branches'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>4 Panti Asuhan & Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('facilities')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'facilities'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Fasilitas Panti ({tempFacilities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'activities'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Kegiatan & Rutinitas ({tempActivities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'content'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#f1b607]" />
                <span>Tagline & Deskripsi</span>
              </button>

              <button
                onClick={() => setActiveTab('values')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'values'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>5 Nilai Dasar</span>
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'faq'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>FAQ</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'contact'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kontak & Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('volunteers')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'volunteers'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Relawan ({volunteers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'donations'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Buku Donasi ({donations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x cursor-pointer shrink-0 ${
                  activeTab === 'audit'
                    ? 'bg-[#FFFDF9] dark:bg-[#18110a] border-stone-200 dark:border-stone-800 text-[#352106] dark:text-amber-100 shadow-2xs'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-[#352106]'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-500" />
                <span>Log Akuntabilitas ({adminLogs.length})</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              
              {/* Notification Toast */}
              {saveToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Perubahan berhasil disimpan! Database dan website langsung diperbarui realtime.</span>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 1: MERUBAH SEGALA SEMUA FOTO DI WEBSITE */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'photos' && (
                <div className="space-y-6 max-w-4xl">
                  
                  {/* Photo Section A: Hero Banner */}
                  <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-[#ea580c] tracking-wider block">
                          Bagian 1: Banner Utama
                        </span>
                        <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                          Foto Hero Background (Homepage Paling Atas)
                        </h3>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">Hero Section</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5 relative h-36 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100">
                        <img
                          src={tempSettings.heroImageUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[11px] font-medium">
                          Live Preview Hero
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Pilih Foto Preset Cepat:
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {PHOTO_PRESETS.map((p) => (
                              <button
                                key={p.url}
                                type="button"
                                onClick={() => setTempSettings({ ...tempSettings, heroImageUrl: p.url })}
                                className={`p-1.5 rounded-lg border text-left text-[10px] transition-all cursor-pointer ${
                                  tempSettings.heroImageUrl === p.url
                                    ? 'border-[#ea580c] bg-amber-50 dark:bg-amber-950/60 font-bold text-[#352106] dark:text-amber-200'
                                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                                }`}
                              >
                                <span className="block truncate">{p.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Atau Upload dari File Komputer:
                          </label>
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-[#352106] dark:text-stone-200 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#ea580c]" />
                            <span>Pilih Gambar File (JPG, PNG, WebP)</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (base64) =>
                                  setTempSettings({ ...tempSettings, heroImageUrl: base64 })
                                )
                              }
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Atau Masukkan URL Gambar:
                          </label>
                          <input
                            type="text"
                            value={tempSettings.heroImageUrl}
                            onChange={(e) => setTempSettings({ ...tempSettings, heroImageUrl: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-ink dark:text-stone-100"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo Section B: 4 Orphanage Branches Photos */}
                  <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#ea580c] tracking-wider block">
                        Bagian 2: Foto 4 Asrama Panti Asuhan
                      </span>
                      <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                        Foto Bangunan & Asrama (Surabaya & Sidoarjo)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Anda dapat mengubah foto untuk setiap cabang panti agar donatur dan calon relawan dapat melihat kondisi asrama.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tempBranches.map((branch, idx) => (
                        <div
                          key={branch.id}
                          className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#352106] dark:text-amber-100 truncate">
                              0{idx + 1}. {branch.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#814f34] dark:text-amber-300 font-semibold shrink-0">
                              {branch.city}
                            </span>
                          </div>

                          <div className="relative h-28 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-200">
                            <img
                              src={branch.imageUrl || PHOTO_PRESETS[idx % PHOTO_PRESETS.length].url}
                              alt={branch.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] bg-black/60 text-white font-mono">
                              Preview Asrama
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <label className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg text-[11px] font-medium text-[#352106] dark:text-stone-200 cursor-pointer transition-colors">
                                <Upload className="w-3 h-3 text-[#ea580c]" />
                                <span>Upload Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e, (base64) =>
                                      handleBranchPhotoChange(branch.id, base64)
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <input
                              type="text"
                              value={branch.imageUrl || ''}
                              onChange={(e) => handleBranchPhotoChange(branch.id, e.target.value)}
                              placeholder="Atau URL gambar asrama..."
                              className="w-full px-2.5 py-1 text-[11px] border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-ink dark:text-stone-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photo Section C: Our Story / Founder Photo */}
                  <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#ea580c] tracking-wider block">
                        Bagian 3: Foto Profil Yayasan / Pendiri
                      </span>
                      <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                        Foto Profil Section &ldquo;Our Story&rdquo;
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4 relative h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100">
                        <img
                          src={tempSettings.storyImageUrl || '/src/assets/images/children_education_art_1790578654362.jpg'}
                          alt="Story Section Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="md:col-span-8 space-y-2">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-[#352106] dark:text-stone-200 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>Upload Foto Profil Baru</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) =>
                                setTempSettings({ ...tempSettings, storyImageUrl: base64 })
                              )
                            }
                          />
                        </label>

                        <input
                          type="text"
                          value={tempSettings.storyImageUrl || ''}
                          onChange={(e) => setTempSettings({ ...tempSettings, storyImageUrl: e.target.value })}
                          placeholder="Atau masukkan URL gambar..."
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-ink dark:text-stone-100"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 2: HEADLINES & STORY CONTENT */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'content' && (
                <div className="space-y-5 max-w-3xl">
                  <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                      Hero Section Labels & Headlines
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Top Subtitle Label (e.g. A PLACE TO BELONG)
                      </label>
                      <input
                        type="text"
                        value={tempSettings.heroLabel}
                        onChange={(e) => setTempSettings({ ...tempSettings, heroLabel: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Main Display Tagline
                      </label>
                      <input
                        type="text"
                        value={tempSettings.tagline}
                        onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Subheadline Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={tempSettings.subheadline}
                        onChange={(e) => setTempSettings({ ...tempSettings, subheadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                      Our Story (Section 01)
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={tempSettings.storyHeadline}
                        onChange={(e) => setTempSettings({ ...tempSettings, storyHeadline: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Story Paragraph 1
                      </label>
                      <textarea
                        rows={3}
                        value={tempSettings.storyParagraph1}
                        onChange={(e) => setTempSettings({ ...tempSettings, storyParagraph1: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Story Paragraph 2
                      </label>
                      <textarea
                        rows={3}
                        value={tempSettings.storyParagraph2}
                        onChange={(e) => setTempSettings({ ...tempSettings, storyParagraph2: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          value={tempSettings.founderName}
                          onChange={(e) => setTempSettings({ ...tempSettings, founderName: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Founder Title
                        </label>
                        <input
                          type="text"
                          value={tempSettings.founderTitle}
                          onChange={(e) => setTempSettings({ ...tempSettings, founderTitle: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 3: 5 CORE VALUES */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'values' && (
                <div className="space-y-4 max-w-3xl">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Edit the 5 core philosophical pillars that represent Yayasan Rumah Bersinar.
                  </p>

                  <div className="space-y-3">
                    {tempCoreValues.map((val, idx) => (
                      <div
                        key={val.number}
                        className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-stone-500">
                            Pillar {val.number}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">Color Bar:</span>
                            <input
                              type="color"
                              value={val.color}
                              onChange={(e) => {
                                const updated = [...tempCoreValues];
                                updated[idx].color = e.target.value;
                                setTempCoreValues(updated);
                              }}
                              className="w-6 h-6 rounded cursor-pointer border-0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              English Name
                            </label>
                            <input
                              type="text"
                              value={val.name}
                              onChange={(e) => {
                                const updated = [...tempCoreValues];
                                updated[idx].name = e.target.value;
                                setTempCoreValues(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-serif"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              Indonesian Name
                            </label>
                            <input
                              type="text"
                              value={val.indonesianName}
                              onChange={(e) => {
                                const updated = [...tempCoreValues];
                                updated[idx].indonesianName = e.target.value;
                                setTempCoreValues(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={val.description}
                            onChange={(e) => {
                              const updated = [...tempCoreValues];
                              updated[idx].description = e.target.value;
                              setTempCoreValues(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB: 4 HOMES BRANCHES & LOGOS */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'branches' && (
                <div className="space-y-5 max-w-3xl">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-[#352106] dark:text-amber-200">
                    💡 <strong>Pengaturan 4 Cabang Panti:</strong> Anda dapat mengganti logo kecil di sebelah kiri dan foto utama untuk masing-masing cabang panti asuhan, serta memperbarui alamat, nomor telepon, dan fokus pembinaan.
                  </div>

                  {tempBranches.map((branch, idx) => (
                    <div
                      key={branch.id}
                      className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                        <div className="flex items-center gap-3">
                          {/* Live preview of small logo */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-200 bg-amber-50 dark:bg-stone-800 flex items-center justify-center">
                            {branch.logoUrl ? (
                              <img src={branch.logoUrl} alt={branch.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                              {branch.name}
                            </h4>
                            <span className="text-[11px] text-stone-500">{branch.subtitle}</span>
                          </div>
                        </div>

                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-[#814f34] dark:text-amber-200 font-semibold">
                          {branch.city}
                        </span>
                      </div>

                      {/* Logo & Photo Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700/60">
                        {/* Logo Left */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#352106] dark:text-amber-200 mb-1">
                            Logo Kecil Samping Kiri (Logo URL)
                          </label>
                          <input
                            type="text"
                            placeholder="URL gambar logo (misal: https://...)"
                            value={branch.logoUrl || ''}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].logoUrl = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                          <p className="text-[10px] text-stone-400 mt-1">
                            Tampil di sisi kiri judul kartu panti.
                          </p>
                        </div>

                        {/* Main Photo */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#352106] dark:text-amber-200 mb-1">
                            Foto Utama Cabang Panti (Photo URL)
                          </label>
                          <input
                            type="text"
                            placeholder="URL foto panti (misal: /assets/...)"
                            value={branch.imageUrl || ''}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].imageUrl = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                          <p className="text-[10px] text-stone-400 mt-1">
                            Foto lanskap gedung / asrama panti.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Nama Cabang Panti
                          </label>
                          <input
                            type="text"
                            value={branch.name}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].name = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Subtitle / Spesialisasi
                          </label>
                          <input
                            type="text"
                            value={branch.subtitle}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].subtitle = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Alamat Lengkap
                          </label>
                          <input
                            type="text"
                            value={branch.address}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].address = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            No. Telepon / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={branch.phone}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].phone = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Fokus Program
                          </label>
                          <input
                            type="text"
                            value={branch.focusArea}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].focusArea = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Kapasitas / Label
                          </label>
                          <input
                            type="text"
                            value={branch.capacityText}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx].capacityText = e.target.value;
                              setTempBranches(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB: FACILITIES MANAGER */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'facilities' && (
                <div className="space-y-5 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                        Kelola Fasilitas Panti Asuhan
                      </h3>
                      <p className="text-xs text-stone-500">
                        Perbarui nama, foto fasilitas, kapasitas, serta deskripsi fasilitas yang tampil di website.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFac: FacilityItem = {
                          id: `fac-${Date.now()}`,
                          name: 'Fasilitas Baru',
                          category: 'Umum',
                          description: 'Deskripsi fasilitas baru panti asuhan.',
                          imageUrl: '/src/assets/images/hero_orphanage_hope_1790578628387.jpg',
                          capacity: '20 Anak',
                          features: ['Standar Kebersihan Baik', 'Aman & Terawat'],
                        };
                        setTempFacilities([...tempFacilities, newFac]);
                      }}
                      className="px-3 py-1.5 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Fasilitas</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tempFacilities.map((fac, idx) => (
                      <div
                        key={fac.id}
                        className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
                          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                            Fasilitas #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus fasilitas "${fac.name}"?`)) {
                                setTempFacilities(tempFacilities.filter((f) => f.id !== fac.id));
                              }
                            }}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Hapus Fasilitas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Photo Preview & URL */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                          <img
                            src={fac.imageUrl}
                            alt={fac.name}
                            className="w-20 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div className="flex-1 w-full">
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-0.5">
                              URL Foto Fasilitas:
                            </label>
                            <input
                              type="text"
                              value={fac.imageUrl}
                              onChange={(e) => {
                                const updated = [...tempFacilities];
                                updated[idx].imageUrl = e.target.value;
                                setTempFacilities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              Nama Fasilitas
                            </label>
                            <input
                              type="text"
                              value={fac.name}
                              onChange={(e) => {
                                const updated = [...tempFacilities];
                                updated[idx].name = e.target.value;
                                setTempFacilities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              Kategori / Kapasitas
                            </label>
                            <input
                              type="text"
                              value={fac.category}
                              onChange={(e) => {
                                const updated = [...tempFacilities];
                                updated[idx].category = e.target.value;
                                setTempFacilities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Deskripsi Lengkap
                          </label>
                          <textarea
                            rows={2}
                            value={fac.description}
                            onChange={(e) => {
                              const updated = [...tempFacilities];
                              updated[idx].description = e.target.value;
                              setTempFacilities(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB: ACTIVITIES MANAGER */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'activities' && (
                <div className="space-y-5 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                        Kelola Kegiatan & Rutinitas Panti
                      </h3>
                      <p className="text-xs text-stone-500">
                        Perbarui judul kegiatan, jadwal, deskripsi, dan foto dokumentasi kegiatan anak asuh.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newAct: ActivityItem = {
                          id: `act-${Date.now()}`,
                          title: 'Kegiatan Baru',
                          category: 'Education',
                          schedule: 'Setiap Hari',
                          description: 'Deskripsi kegiatan baru untuk pembinaan anak.',
                          imageUrl: '/src/assets/images/children_education_art_1790578654362.jpg',
                          targetAudience: 'Seluruh Anak Asuh',
                        };
                        setTempActivities([...tempActivities, newAct]);
                      }}
                      className="px-3 py-1.5 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Kegiatan</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tempActivities.map((act, idx) => (
                      <div
                        key={act.id}
                        className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
                          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                            Kegiatan #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus kegiatan "${act.title}"?`)) {
                                setTempActivities(tempActivities.filter((a) => a.id !== act.id));
                              }
                            }}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Hapus Kegiatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Photo Preview & URL */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                          <img
                            src={act.imageUrl}
                            alt={act.title}
                            className="w-20 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div className="flex-1 w-full">
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-0.5">
                              URL Foto Kegiatan:
                            </label>
                            <input
                              type="text"
                              value={act.imageUrl}
                              onChange={(e) => {
                                const updated = [...tempActivities];
                                updated[idx].imageUrl = e.target.value;
                                setTempActivities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              Judul Kegiatan
                            </label>
                            <input
                              type="text"
                              value={act.title}
                              onChange={(e) => {
                                const updated = [...tempActivities];
                                updated[idx].title = e.target.value;
                                setTempActivities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                              Jadwal Rutin (Waktu)
                            </label>
                            <input
                              type="text"
                              value={act.schedule}
                              onChange={(e) => {
                                const updated = [...tempActivities];
                                updated[idx].schedule = e.target.value;
                                setTempActivities(updated);
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Deskripsi Lengkap
                          </label>
                          <textarea
                            rows={2}
                            value={act.description}
                            onChange={(e) => {
                              const updated = [...tempActivities];
                              updated[idx].description = e.target.value;
                              setTempActivities(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 5: FAQ MANAGER */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'faq' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      Kelola tanya jawab resmi Yayasan Rumah Bersinar.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tempFaqs.map((faq, idx) => (
                      <div
                        key={faq.id}
                        className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Question Title
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...tempFaqs];
                              updated[idx].question = e.target.value;
                              setTempFaqs(updated);
                            }}
                            className="w-full pr-8 px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                            Answer
                          </label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...tempFaqs];
                              updated[idx].answer = e.target.value;
                              setTempFaqs(updated);
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 6: CONTACTS & ANNOUNCEMENT */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'contact' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                      Announcement Ribbon (Top Bar)
                    </h3>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showAnnounce"
                        checked={tempSettings.showAnnouncement}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, showAnnouncement: e.target.checked })
                        }
                        className="rounded text-[#ea580c] focus:ring-[#f1b607]"
                      />
                      <label htmlFor="showAnnounce" className="text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                        Tampilkan Banner Pengumuman di Atas Website
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Teks Pengumuman
                      </label>
                      <input
                        type="text"
                        value={tempSettings.announcementText}
                        onChange={(e) => setTempSettings({ ...tempSettings, announcementText: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                      Kontak Resmi Yayasan
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Nomor WhatsApp
                        </label>
                        <input
                          type="text"
                          value={tempSettings.whatsappPhone}
                          onChange={(e) => setTempSettings({ ...tempSettings, whatsappPhone: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Email Resmi
                        </label>
                        <input
                          type="email"
                          value={tempSettings.contactEmail}
                          onChange={(e) => setTempSettings({ ...tempSettings, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Alamat Kantor Pusat
                      </label>
                      <input
                        type="text"
                        value={tempSettings.headquartersAddress}
                        onChange={(e) => setTempSettings({ ...tempSettings, headquartersAddress: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 7: VOLUNTEERS APPLICATIONS */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'volunteers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 dark:text-stone-400">
                      Total Pendaftar Relawan: <strong>{volunteers.length}</strong>
                    </span>
                    <div className="flex gap-1 text-xs">
                      {(['All', 'Pending', 'Contacted', 'Approved'] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setVolunteerFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            volunteerFilter === filter
                              ? 'bg-[#352106] text-[#f1b607]'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredVolunteers.length === 0 ? (
                      <p className="text-xs text-stone-500 text-center py-8">
                        Belum ada pelamar relawan pada status ini.
                      </p>
                    ) : (
                      filteredVolunteers.map((vol) => (
                        <div
                          key={vol.id}
                          className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100 block">
                                {vol.fullName}
                              </span>
                              <span className="text-[11px] text-stone-500">
                                {vol.email} · {vol.phone} · {vol.institution}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <select
                                value={vol.status}
                                onChange={(e) =>
                                  handleUpdateVolunteerStatus(
                                    vol.id,
                                    e.target.value as 'Pending' | 'Contacted' | 'Approved'
                                  )
                                }
                                className="text-xs px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Approved">Approved</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleDeleteVolunteer(vol.id)}
                                className="p-1 text-stone-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 text-xs text-stone-700 dark:text-stone-300">
                            <strong>Motivasi:</strong> {vol.motivation}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 8: DONATIONS LEDGER */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'donations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 dark:text-stone-400">
                      Buku Kas Donasi Realtime Database ({donations.length} Transaksi)
                    </span>
                    <span className="text-xs font-bold text-[#ea580c]">
                      Total Masuk: Rp{' '}
                      {donations
                        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {donations.map((don) => (
                      <div
                        key={don.transactionId}
                        className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#352106] dark:text-amber-100">
                              {don.isAnonymous ? 'Hamba Allah' : don.donorName}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {don.transactionId}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Program: {don.programTitle} · {don.paymentMethod} ·{' '}
                            {new Date(don.timestamp).toLocaleDateString('id-ID')}
                          </div>
                          {don.prayerMessage && (
                            <div className="text-[10px] text-stone-600 dark:text-stone-400 italic">
                              &ldquo;{don.prayerMessage}&rdquo;
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-[#ea580c] dark:text-[#f1b607] block">
                            Rp {Number(don.amount).toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleDonation(don.transactionId)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              don.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            {don.status}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 9: RIWAYAT AKSES ADMIN & AUDIT TRAIL (REAL DB) */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'audit' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-100">
                        Audit Trail & Log Akses Real Database
                      </h3>
                      <p className="text-xs text-stone-500">
                        Merekam secara akurat siapa yang mengakses admin portal, kapan diakses, dan riwayat keamanan sesi.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-[#814f34] font-mono font-bold">
                      {adminLogs.length} Entri Log
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {adminLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.status === 'Success'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : log.status === 'Auto-Locked' || log.status === 'Locked'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : log.status === 'Unlocked'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {log.status}
                            </span>
                            <span className="font-bold text-[#352106] dark:text-amber-100">
                              {log.action}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Admin: <strong className="text-stone-700 dark:text-stone-300">{log.adminUser}</strong>
                            {log.details && ` · ${log.details}`}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px] text-stone-400 dark:text-stone-500 shrink-0">
                          {new Date(log.timestamp).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'medium',
                          })} WIB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="px-5 py-3.5 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset ke Default</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex-1 sm:flex-none px-5 py-2 text-xs font-heading font-bold text-[#241708] bg-[#e8a70a] hover:bg-[#f1b607] shadow-sm hover:shadow rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan ke Database</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
