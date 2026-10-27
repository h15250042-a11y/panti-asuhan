import React, { useState } from 'react';
import { X, Search, CheckCircle2, ShieldCheck, Download, Printer, Heart, FileText, ArrowRight } from 'lucide-react';
import { DonationRecord } from '../types';
import { FOUNDATION_INFO } from '../data/mockData';

interface DonorTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  donations: DonationRecord[];
  onOpenDonationModal: () => void;
}

export const DonorTrackerModal: React.FC<DonorTrackerModalProps> = ({
  isOpen,
  onClose,
  donations,
  onOpenDonationModal,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<DonationRecord | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    setSearched(true);
    const found = donations.find(
      (d) =>
        d.transactionId.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        (d.donorEmail && d.donorEmail.toLowerCase().includes(q)) ||
        (d.donorPhone && d.donorPhone.includes(q))
    );
    setResult(found || null);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a130c] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-ink dark:text-stone-100">
        
        {/* Header */}
        <div className="bg-[#241708] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#f1b607] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Donatur & Transparansi</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Lacak Status Donasi Anda
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Cek keabsahan donasi, verifikasi kas masuk, dan unduh bukti terima resmi.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
              Masukkan Nomor Transaksi / Email / Nama Donatur:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: DON-2026 atau Budi..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Cari Donasi
              </button>
            </div>
          </form>

          {/* Quick Click Samples */}
          {!searched && donations.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-1.5 font-medium">
                Atau coba cek transaksi terkini:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {donations.slice(0, 3).map((d) => (
                  <button
                    key={d.transactionId}
                    type="button"
                    onClick={() => {
                      setQuery(d.transactionId);
                      setSearched(true);
                      setResult(d);
                    }}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    {d.transactionId.slice(-10)} ({d.isAnonymous ? 'Hamba Allah' : d.donorName})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result */}
          {searched && (
            <div className="pt-2">
              {result ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 dark:border-amber-800/80">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase block">
                        No. Transaksi Resmi
                      </span>
                      <span className="text-xs font-mono font-bold text-[#352106] dark:text-amber-100">
                        {result.transactionId}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      TERVERIFIKASI RESMI
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Nama Donatur</span>
                      <span className="font-bold text-[#352106] dark:text-stone-100">
                        {result.isAnonymous ? 'Hamba Allah (Anonim)' : result.donorName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Nominal Donasi</span>
                      <span className="font-bold text-base text-[#ea580c] dark:text-[#f1b607]">
                        {formatIDR(result.amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Program Penyaluran</span>
                      <span className="font-medium text-[#352106] dark:text-stone-200">
                        {result.programTitle}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Waktu Tercatat</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {new Date(result.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </span>
                    </div>
                  </div>

                  {result.prayerMessage && (
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                        Doa & Pesan Donatur:
                      </span>
                      <p className="italic text-stone-700 dark:text-stone-300 font-serif">
                        &ldquo;{result.prayerMessage}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Legal Trust Stamp */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                      {FOUNDATION_INFO.legalName}
                    </span>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1 text-[#ea580c] dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      Cetak Bukti Donasi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Tidak ditemukan data donasi dengan kata kunci <strong>&quot;{query}&quot;</strong>.
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-500">
                    Pastikan nomor transaksi atau nama yang Anda masukkan sesuai saat pengisian formulir.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDonationModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#241708]" />
                      Salurkan Donasi Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer close */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
