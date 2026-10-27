import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface SecretAdminDoorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSecretKeyAccepted: () => void;
}

export const SecretAdminDoorModal: React.FC<SecretAdminDoorModalProps> = ({
  isOpen,
  onClose,
  onSecretKeyAccepted,
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);

  // Accepted secret keys (Case-insensitive)
  const VALID_KEYS = ['BERSINAR2026', 'BERSINAR-ADMIN', 'ADMIN2026', 'YAYASAN2019', 'RUMAHBERSINAR'];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = secretKey.trim().toUpperCase();

    if (VALID_KEYS.includes(cleanKey)) {
      setErrorMessage('');
      onSecretKeyAccepted();
      onClose();
    } else {
      setErrorMessage('Kunci akses rahasia tidak valid! Akses ditolak.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleQuickDemoCode = () => {
    setSecretKey('BERSINAR2026');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-md bg-[#16100a] text-amber-50 rounded-3xl shadow-2xl border border-amber-900/40 overflow-hidden ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-stone-800 relative bg-[#241708]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#f1b607] uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Pintu Keamanan Khusus</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Portal Tersembunyi Administrator
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Halaman ini tidak terbuka untuk umum. Masukkan kunci akses rahasia (Secret Key) untuk melanjutkan ke panel login.
          </p>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Secret Access Code:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#f1b607] absolute left-3.5 top-3" />
              <input
                type={showKey ? 'text' : 'password'}
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan kode rahasia..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-900/90 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#f1b607] font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>

          {/* Discreet Developer / Foundation Hint */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-center justify-between text-xs text-amber-200/80">
            <span>
              Kode Rahasia Resmi: <code className="font-mono text-[#f1b607] font-bold">BERSINAR2026</code>
            </span>
            <button
              type="button"
              onClick={handleQuickDemoCode}
              className="text-[11px] underline text-[#f1b607] hover:text-white cursor-pointer ml-2"
            >
              Gunakan
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Panel Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
