import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Download,
  CreditCard,
  Building,
  Sparkles,
  Printer,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { DONATION_PROGRAMS, BANK_ACCOUNTS, FOUNDATION_INFO } from '../data/mockData';
import { DonationRecord } from '../types';
import { RumahBersinarLogo } from './RumahBersinarLogo';
import { CelebrationConfetti } from './CelebrationConfetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgramId?: string;
  initialAmount?: number;
  onDonationSuccess?: (record: DonationRecord) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialProgramId,
  initialAmount,
  onDonationSuccess,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    initialProgramId || DONATION_PROGRAMS[0].id
  );
  const [amount, setAmount] = useState<number>(initialAmount || 250000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');

  // Mandatory Donor Fields
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'bri' | 'card'>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  if (!isOpen) return null;

  const currentProgram =
    DONATION_PROGRAMS.find((p) => p.id === selectedProgramId) || DONATION_PROGRAMS[0];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmountStr('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation: All 4 fields are mandatory
    if (!donorName.trim()) {
      setValidationError('Mohon isi Nama Lengkap Anda (Your Full Name is required).');
      return;
    }
    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setValidationError('Mohon isi Email valid untuk pengiriman bukti & kwitansi resmi (Valid Email is required).');
      return;
    }
    if (!donorPhone.trim() || donorPhone.trim().length < 8) {
      setValidationError('Mohon isi Nomor WhatsApp / Telepon aktif (WhatsApp/Phone is required).');
      return;
    }
    if (!prayerMessage.trim()) {
      setValidationError('Mohon tuliskan Catatan Dedikasi / Doa bagi anak-anak asuh (Dedication message is required).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedReceipt: DonationRecord = {
        transactionId: `TXN-RB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim(),
        amount: amount,
        programId: currentProgram.id,
        programTitle: currentProgram.title,
        paymentMethod:
          paymentMethod === 'qris'
            ? 'QRIS Instant Payment'
            : paymentMethod === 'bca'
            ? 'BCA Virtual Account'
            : paymentMethod === 'mandiri'
            ? 'Bank Mandiri Transfer'
            : paymentMethod === 'bri'
            ? 'BRI Transfer'
            : 'Credit Card / Visa-Mastercard',
        prayerMessage: prayerMessage.trim(),
        isAnonymous: isAnonymous,
        timestamp: new Date().toISOString(),
        status: 'Verified',
      };

      setReceipt(generatedReceipt);
      setConfettiTrigger(Date.now());
      if (onDonationSuccess) {
        onDonationSuccess(generatedReceipt);
      }
      setIsSubmitting(false);
    }, 600);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleReset = () => {
    setReceipt(null);
    setValidationError(null);
    setCustomAmountStr('');
    setDonorName('');
    setDonorEmail('');
    setDonorPhone('');
    setPrayerMessage('');
    onClose();
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-[#1a140e] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 dark:border-stone-800 relative animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-h-none print:max-w-none print:overflow-visible">
        
        {/* Modal Header (Hidden during print) */}
        <div className="sticky top-0 bg-[#352106] text-white z-10 px-6 py-4 flex items-center justify-between border-b border-amber-900/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f1b607] to-[#ea580c] text-[#352106] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                {receipt ? 'Official Donation Receipt' : 'Make a Gift of Hope'}
              </h3>
              <p className="text-[11px] text-amber-200/80">
                Yayasan Rumah Bersinar · National Grade-A Accredited
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-[#352106] dark:text-stone-200">
          {receipt ? (
            /* ======================================================== */
            /* OFFICIAL PRINTABLE DONATION RECEIPT VIEW                */
            /* ======================================================== */
            <div className="space-y-6">
              
              {/* Success Banner (Hidden during print) */}
              <div className="text-center print:hidden space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h4 className="text-2xl font-heading font-bold text-[#352106] dark:text-amber-50">
                  Terima Kasih, {receipt.donorName}!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                  Donasi Anda telah terverifikasi dan tercatat resmi di buku kas yayasan. Anda dapat mencetak atau menyimpan bukti ini sebagai kwitansi resmi.
                </p>
              </div>

              {/* PRINTABLE RECEIPT CARD */}
              <div
                id="printable-receipt"
                className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] dark:bg-[#251b12] border-2 border-stone-300 dark:border-amber-900/60 text-left space-y-4 shadow-sm relative overflow-hidden print:border print:border-black print:bg-white print:text-black print:p-8"
              >
                {/* Official Header */}
                <div className="border-b-2 border-amber-900/20 dark:border-stone-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <RumahBersinarLogo variant="logogram" size="md" />
                    <div>
                      <span className="text-[10px] tracking-widest font-heading font-bold uppercase text-amber-800 dark:text-amber-400 block">
                        KWITANSI DONASI RESMI
                      </span>
                      <h5 className="font-heading font-extrabold text-[#352106] dark:text-amber-50 text-base leading-tight">
                        YAYASAN RUMAH BERSINAR INDONESIA
                      </h5>
                      <span className="text-[10px] text-stone-500 block">
                        SK Kemenkumham: AHU-0019284.AH.01.04 · NPWP: 91.824.112.5-604.000
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-stone-200 dark:sm:border-stone-700 sm:pl-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                      No. Transaksi
                    </span>
                    <span className="font-mono text-xs font-bold text-[#ea580c] dark:text-[#f1b607]">
                      {receipt.transactionId}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      {new Date(receipt.timestamp).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>

                {/* Donor & Transaction Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-stone-400 dark:text-stone-400 block text-[11px]">Nama Lengkap Donatur:</span>
                    <span className="font-bold text-[#352106] dark:text-amber-100 text-sm">
                      {receipt.donorName}
                    </span>
                    {receipt.isAnonymous && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                        (Nama Disamarkan di Feed Publik: Hamba Allah)
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-400 dark:text-stone-400 block text-[11px]">Metode Pembayaran:</span>
                    <span className="font-semibold text-[#352106] dark:text-amber-100">
                      {receipt.paymentMethod}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 dark:text-stone-400 block text-[11px]">Email Donatur:</span>
                    <span className="font-medium text-[#352106] dark:text-stone-200 font-mono text-[11px]">
                      {receipt.donorEmail}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 dark:text-stone-400 block text-[11px]">WhatsApp / Telepon:</span>
                    <span className="font-medium text-[#352106] dark:text-stone-200 font-mono text-[11px]">
                      {receipt.donorPhone}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-stone-400 dark:text-stone-400 block text-[11px]">Alokasi Program:</span>
                    <span className="font-semibold text-[#352106] dark:text-amber-100">
                      {receipt.programTitle}
                    </span>
                  </div>
                </div>

                {/* Amount Highlight */}
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#814f34] dark:text-amber-300 font-semibold uppercase block">
                      Jumlah Donasi Diterima
                    </span>
                    <span className="text-2xl font-serif font-extrabold text-[#ea580c] dark:text-[#f1b607]">
                      {formatIDR(receipt.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      LUNAS & TERCATAT
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      ≈ ${(receipt.amount / 15500).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Dedication / Prayer */}
                {receipt.prayerMessage && (
                  <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs italic text-stone-700 dark:text-stone-300">
                    <span className="not-italic font-bold text-[10px] text-stone-500 uppercase block mb-0.5">
                      Catatan Dedikasi & Doa Donatur:
                    </span>
                    &ldquo;{receipt.prayerMessage}&rdquo;
                  </div>
                )}

                {/* Bottom Signature / Stamp Note */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone-500">
                  <span>Dokumen elektronik sah dan diterbitkan resmi oleh Bendahara Yayasan Rumah Bersinar.</span>
                  <span className="font-semibold text-[#352106] dark:text-amber-200">Surabaya, Jawa Timur</span>
                </div>
              </div>

              {/* Action Buttons (Hidden during print) */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 bg-[#352106] hover:bg-[#4a2e16] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-[#241708] font-heading font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF (Print Receipt)</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Tutup / Selesai
                </button>
              </div>

            </div>
          ) : (
            /* ======================================================== */
            /* DONATION FORM VIEW (ALL 4 FIELDS MANDATORY)             */
            /* ======================================================== */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Validation Alert */}
              {validationError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Program Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-amber-100 mb-1">
                  Pilih Program Donasi / Cause:
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full text-xs bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-[#352106] dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                >
                  {DONATION_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  💡 {currentProgram.impactDescription}
                </p>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-amber-100 mb-1.5">
                  Nominal Donasi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 250000, 500000, 1000000, 2000000, 5000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountClick(amt)}
                      className={`p-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                        amount === amt && !customAmountStr
                          ? 'bg-[#352106] dark:bg-amber-500 text-[#f1b607] dark:text-[#241708] border-[#352106] dark:border-amber-400 shadow-xs font-bold'
                          : 'bg-white dark:bg-[#251b12] text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-semibold">Rp {amt.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] opacity-75">≈ ${(amt / 15500).toFixed(0)} USD</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5 relative">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-semibold">Rp</span>
                  <input
                    type="text"
                    placeholder="Atau masukkan nominal khusus (misal: 750,000)"
                    value={customAmountStr ? parseInt(customAmountStr, 10).toLocaleString('id-ID') : ''}
                    onChange={handleCustomAmountChange}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl text-[#352106] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] dark:text-amber-100 mb-1.5">
                  Metode Pembayaran:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-[#f1b607] bg-amber-50 dark:bg-amber-950/60 text-[#352106] dark:text-amber-100 font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#251b12] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-stone-700 dark:text-stone-300" />
                    <span>QRIS / E-Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bca')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'bca'
                        ? 'border-[#f1b607] bg-amber-50 dark:bg-amber-950/60 text-[#352106] dark:text-amber-100 font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#251b12] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold block text-blue-600 dark:text-blue-400 text-xs mb-0.5">BCA</span>
                    <span>Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mandiri')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mandiri'
                        ? 'border-[#f1b607] bg-amber-50 dark:bg-amber-950/60 text-[#352106] dark:text-amber-100 font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#251b12] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold block text-amber-700 dark:text-amber-400 text-xs mb-0.5">Mandiri</span>
                    <span>Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#f1b607] bg-amber-50 dark:bg-amber-950/60 text-[#352106] dark:text-amber-100 font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#251b12] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-stone-700 dark:text-stone-300" />
                    <span>Kartu Debit/Kredit</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs space-y-2">
                {paymentMethod === 'qris' ? (
                  <div className="flex items-center gap-3">
                    <QrCode className="w-9 h-9 text-[#352106] dark:text-amber-300 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#352106] dark:text-amber-100">QRIS Standar Pembayaran Nasional</div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Scan dengan aplikasi e-wallet apa saja (GoPay, OVO, ShopeePay, DANA, Livin, BCA Mobile).
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-[#352106] dark:text-amber-300 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#352106] dark:text-amber-100">Visa / Mastercard / JCB</div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Proses enkripsi aman SSL 256-bit standar internasional.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">Rekening Resmi Yayasan:</span>
                      <span className="font-mono text-sm font-bold text-[#352106] dark:text-amber-100">
                        {paymentMethod === 'bca' ? '822-091-7788' : '141-00-2288331-9'}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                        a.n. YAYASAN RUMAH BERSINAR INDONESIA
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          paymentMethod === 'bca' ? '8220917788' : '1410022883319',
                          'acc'
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-semibold text-[#352106] dark:text-stone-200"
                    >
                      {copiedText === 'acc' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* MANDATORY DONOR INFORMATION */}
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#352106] dark:text-amber-100 flex items-center gap-1">
                    <span>Identitas Donatur & Kwitansi:</span>
                    <span className="text-rose-500">*Wajib Lengkap</span>
                  </label>
                  
                  {/* Anonymous Toggle (keeps name hidden publicly) */}
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-[#f1b607] focus:ring-[#f1b607]"
                    />
                    <span className="font-medium text-[11px]">Sembunyikan nama di feed publik (Hamba Allah)</span>
                  </label>
                </div>

                {/* 1. Full Name (Required) */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-0.5">
                    Nama Lengkap <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / Dr. Maria Veronica"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl text-[#352106] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                  />
                  {isAnonymous && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                      ✓ Nama tetap tercatat untuk arsip kwitansi resmi, namun ditampilkan sebagai &ldquo;Hamba Allah&rdquo; di daftar donatur publik.
                    </span>
                  )}
                </div>

                {/* 2 & 3. Email & WhatsApp (Required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-0.5">
                      Email Aktif <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl text-[#352106] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-0.5">
                      No. WhatsApp Aktif <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+62 812-xxxx-xxxx"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl text-[#352106] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>
                </div>

                {/* 4. Dedication / Prayer Message (Required) */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-0.5">
                    Niat / Catatan Dedikasi & Doa bagi Anak Asuh <span className="text-rose-500">*</span>:
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Tuliskan doa atau pesan penyemangat bagi anak-anak asuh di 4 panti..."
                    value={prayerMessage}
                    onChange={(e) => setPrayerMessage(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 dark:bg-[#251b12] border border-stone-300 dark:border-stone-700 rounded-xl text-[#352106] dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#f1b607] resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || amount <= 0}
                  className="w-full py-3.5 bg-gradient-to-r from-[#f1b607] to-[#ea580c] hover:from-[#fdc502] hover:to-[#f35722] disabled:bg-stone-300 text-[#241708] font-heading font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>
                    {isSubmitting
                      ? 'Memproses & Menerbitkan Kwitansi...'
                      : `Konfirmasi Donasi ${formatIDR(amount)}`}
                  </span>
                </button>

                <div className="text-center text-[11px] text-stone-500 dark:text-stone-400 mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kwitansi resmi langsung terbit dan dapat dicetak / disimpan PDF setelah konfirmasi.</span>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
