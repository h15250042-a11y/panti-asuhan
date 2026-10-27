import React from 'react';
import { Heart, TrendingUp, Users, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { DonationRecord } from '../types';

interface DonationProgressTrackerProps {
  donations: DonationRecord[];
  onOpenDonation: () => void;
  onOpenDonorTracker?: () => void;
}

export const DonationProgressTracker: React.FC<DonationProgressTrackerProps> = ({
  donations,
  onOpenDonation,
  onOpenDonorTracker,
}) => {
  // Campaign target: Rp 150.000.000 (Target Dana Nutrisi & Pendidikan 2026)
  const TARGET_AMOUNT = 150000000;

  // Calculate total collected from real donation records
  const totalCollected = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const percentage = Math.min(100, Math.round((totalCollected / TARGET_AMOUNT) * 100));

  // Sort latest 4 donations
  const latestDonations = [...donations]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      return `${diffDays} hari lalu`;
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 dark:bg-[#1f160e]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-stone-200/90 dark:border-stone-800 transition-colors">
        
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#f1b607] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Realtime Transparency Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#352106] dark:text-amber-50 tracking-tight">
              Aksi Bersama: Dana Pendidikan & Gizi 4 Panti 2026
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-body mt-1">
              Setiap rupiah donasi langsung terverifikasi, tercatat otomatis, dan disalurkan langsung bagi kebutuhan 86 anak asuh.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenDonorTracker && (
              <button
                onClick={onOpenDonorTracker}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-amber-400 text-stone-700 dark:text-stone-300 hover:text-[#352106] dark:hover:text-amber-100 text-xs font-semibold font-subheading transition-colors cursor-pointer"
              >
                Lacak Donasi Saya
              </button>
            )}
            <button
              onClick={onOpenDonation}
              className="px-5 py-2.5 rounded-xl bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Heart className="w-4 h-4 fill-[#241708]" />
              <span>Donasi Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Stats */}
        <div className="py-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                Total Donasi Terkumpul
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#352106] dark:text-amber-100 tracking-tight">
                  {formatIDR(totalCollected)}
                </span>
                <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
                  dari target {formatIDR(TARGET_AMOUNT)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl px-3.5 py-1.5">
                <span className="text-[11px] text-[#814f34] dark:text-amber-300 font-medium block">
                  Pencapaian Target
                </span>
                <span className="text-lg font-heading font-extrabold text-[#ea580c] dark:text-[#f1b607]">
                  {percentage}%
                </span>
              </div>
              <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3.5 py-1.5">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium block">
                  Donatur Terverifikasi
                </span>
                <span className="text-lg font-heading font-extrabold text-[#352106] dark:text-stone-200">
                  {donations.length} Orang
                </span>
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-3.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e8a70a] via-[#f1b607] to-[#ea580c] transition-all duration-1000 relative shadow-inner"
              style={{ width: `${Math.max(percentage, 4)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Live Recent Donors Ticker */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8a70a]" />
              <h3 className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#352106] dark:text-amber-100">
                Aktivitas Donasi Terkini (Live Feed)
              </h3>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Menampilkan {latestDonations.length} donasi terbaru
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {latestDonations.map((don) => (
              <div
                key={don.transactionId}
                className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#251b12] border border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-heading font-bold text-[#352106] dark:text-amber-100 truncate">
                      {don.isAnonymous ? 'Hamba Allah' : don.donorName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Lunas
                    </span>
                  </div>

                  <div className="text-base font-serif font-extrabold text-[#ea580c] dark:text-[#f1b607] mb-1">
                    {formatIDR(don.amount)}
                  </div>

                  <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mb-2 font-medium">
                    Program: {don.programTitle || 'Kebutuhan Umum Panti'}
                  </div>

                  {don.prayerMessage && (
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 italic font-body bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-100/80 dark:border-amber-900/30 line-clamp-2">
                      &ldquo;{don.prayerMessage}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(don.timestamp)}
                  </span>
                  <span className="font-mono text-[9px] uppercase">
                    ID: {don.transactionId.slice(-6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
