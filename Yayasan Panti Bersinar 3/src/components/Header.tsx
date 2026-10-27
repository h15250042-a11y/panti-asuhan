import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  HeartHandshake,
  MapPin,
  Phone,
  Menu,
  X,
  MoreVertical,
  Sun,
  Moon,
  Search,
  MessageCircle,
} from 'lucide-react';
import { FOUNDATION_INFO } from '../data/mockData';
import { RumahBersinarLogo } from './RumahBersinarLogo';
import { SiteSettings } from '../types';

interface HeaderProps {
  siteSettings: SiteSettings;
  onOpenDonation: () => void;
  onOpenVolunteer: () => void;
  onOpenAdmin: () => void;
  onOpenDonorTracker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteSettings,
  onOpenDonation,
  onOpenVolunteer,
  onOpenAdmin,
  onOpenDonorTracker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [threeDotsOpen, setThreeDotsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rumah_bersinar_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThreeDotsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Secret Hotkey: Ctrl+Shift+A or Cmd+Shift+A opens hidden admin modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rumah_bersinar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rumah_bersinar_theme', 'light');
    }
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 dark:bg-[#120d09]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Announcement Ribbon */}
      {siteSettings.showAnnouncement && siteSettings.announcementText && (
        <div className="bg-[#241708] text-amber-100 text-xs py-2 px-4 border-b border-amber-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="font-medium text-white">
                {siteSettings.announcementText}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-amber-200/80">
              <span className="hidden md:inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#f1b607]" />
                Surabaya & Sidoarjo (4 Orphanage Homes)
              </span>
              <a
                href={`https://wa.me/6281317000944?text=Hello%20Yayasan%20Rumah%20Bersinar`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#f1b607]" />
                <span>
                  WhatsApp:{' '}
                  <strong className="font-semibold text-white">
                    +62 813-1700-0944
                  </strong>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <RumahBersinarLogo variant="sekunder" size="md" />
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-subheading text-[#352106] dark:text-stone-200">
          <button
            onClick={() => scrollTo('story')}
            className="hover:text-[#ea580c] dark:hover:text-[#f1b607] transition-colors cursor-pointer font-medium"
          >
            Our Story
          </button>
          <button
            onClick={() => scrollTo('locations')}
            className="hover:text-[#ea580c] dark:hover:text-[#f1b607] transition-colors cursor-pointer font-medium"
          >
            Facilities & 4 Homes
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="hover:text-[#ea580c] dark:hover:text-[#f1b607] transition-colors cursor-pointer font-medium"
          >
            FAQ
          </button>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Direct Day / Night Mode Switch (Sun = Day, Moon = Night) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1a140e] text-[#352106] dark:text-amber-300 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer shadow-2xs"
            title={isDarkMode ? 'Mode Malam Aktif (Klik untuk Mode Terang)' : 'Mode Terang Aktif (Klik untuk Mode Malam)'}
            aria-label="Toggle Night or Day Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#352106] animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Volunteer Button */}
          <button
            onClick={onOpenVolunteer}
            className="px-3.5 py-2 text-xs font-semibold text-[#352106] dark:text-amber-100 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#f1b607]" />
            <span>Open Volunteer</span>
          </button>

          {/* Donate Button */}
          <button
            onClick={onOpenDonation}
            className="px-4 py-2 text-xs font-heading font-bold text-[#241708] bg-[#e8a70a] hover:bg-[#f1b607] shadow-xs hover:shadow rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-[#241708]" />
            <span>Donate Now</span>
          </button>

          {/* 3-Dots Menu Dropdown (...) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setThreeDotsOpen(!threeDotsOpen)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#352106] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Menu Tambahan"
              aria-label="Extra Options Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {threeDotsOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1f160e] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs font-medium text-stone-700 dark:text-stone-200">
                {/* 1. Track Donation Portal */}
                <button
                  onClick={() => {
                    setThreeDotsOpen(false);
                    onOpenDonorTracker();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer"
                >
                  <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="block font-semibold">Lacak Donasi Saya</span>
                    <span className="block text-[10px] text-stone-400">
                      Cek status verifikasi & cetak bukti
                    </span>
                  </div>
                </button>

                {/* 2. WhatsApp Help */}
                <a
                  href={`https://wa.me/6281317000944?text=${encodeURIComponent(
                    'Halo Yayasan Rumah Bersinar, saya ingin bertanya seputar panti asuhan dan kegiatan anak-anak.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setThreeDotsOpen(false)}
                  className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="block font-semibold">Konsultasi WhatsApp</span>
                    <span className="block text-[10px] text-stone-400">
                      Chat langsung pengurus panti
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Direct Theme button for mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
            title="Ganti Tema"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#352106]" />}
          </button>

          {/* Three Dots for mobile */}
          <button
            onClick={() => setThreeDotsOpen(!threeDotsOpen)}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
            aria-label="Extra Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#352106] dark:text-stone-200 hover:text-[#ea580c] rounded-lg focus:outline-none cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[#FFFDF9] dark:bg-[#120d09] px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-[#352106] dark:text-stone-200 font-subheading text-sm">
            <button
              onClick={() => scrollTo('story')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-lg font-medium cursor-pointer"
            >
              Our Story (Foundation & 5 Core Values)
            </button>
            <button
              onClick={() => scrollTo('locations')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-lg font-medium cursor-pointer"
            >
              Facilities & 4 Homes (Surabaya & Sidoarjo)
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-lg font-medium cursor-pointer"
            >
              Frequently Asked Questions (FAQ)
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVolunteer();
              }}
              className="w-full py-2.5 px-4 text-center font-subheading font-semibold text-xs text-[#352106] dark:text-amber-100 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#ea580c] dark:text-[#f1b607]" />
              <span>Open Volunteer Recruitment</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonation();
              }}
              className="w-full py-2.5 px-4 text-center font-heading font-bold text-xs text-[#241708] bg-[#e8a70a] hover:bg-[#f1b607] rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#241708]" />
              <span>Donate Now</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonorTracker();
              }}
              className="w-full py-2 px-4 text-center font-medium text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span>Lacak Donasi Saya</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
