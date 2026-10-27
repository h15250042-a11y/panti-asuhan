import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Building2,
  ExternalLink,
  HeartHandshake,
  Heart,
  Clock,
  Navigation,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { PantiBranch, FacilityItem, ActivityItem } from '../types';

interface LocationsSectionProps {
  branches: PantiBranch[];
  facilities?: FacilityItem[];
  activities?: ActivityItem[];
  onSelectVolunteerBranch: (branchId: string) => void;
  onOpenDonationForBranch: (branch: PantiBranch) => void;
  onOpenGeneralDonation?: () => void;
  onOpenGeneralVolunteer?: () => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  branches,
  facilities = [],
  activities = [],
  onSelectVolunteerBranch,
  onOpenDonationForBranch,
  onOpenGeneralDonation,
  onOpenGeneralVolunteer,
}) => {
  // Main Navigation View: 'branches' | 'facilities' | 'activities'
  const [activeMainView, setActiveMainView] = useState<'branches' | 'facilities' | 'activities'>('branches');
  const [selectedBranchTab, setSelectedBranchTab] = useState<string>('all');

  const filteredBranches =
    selectedBranchTab === 'all'
      ? branches
      : branches.filter((b) => b.city.toLowerCase() === selectedBranchTab.toLowerCase());

  return (
    <section id="locations" className="py-20 bg-stone-50/70 dark:bg-[#120d09] relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-[#352106] dark:text-amber-200 text-xs font-semibold mb-3 border border-amber-200/60 dark:border-amber-800/60">
            <Building2 className="w-3.5 h-3.5 text-[#f1b607]" />
            <span>Yayasan Rumah Bersinar · Surabaya & Sidoarjo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#352106] dark:text-amber-50 tracking-tight mb-4">
            Locations, Facilities & Daily Activities
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-body">
            Jelajahi 4 cabang panti asuhan, sarana prasarana penunjang tumbuh kembang anak, serta rutinitas harian dan pembinaan karakter di Yayasan Rumah Bersinar.
          </p>

          {/* Primary View Switcher: 4 Homes / Facilities / Activities */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 p-1.5 bg-stone-200/70 dark:bg-stone-900/80 rounded-2xl max-w-md mx-auto border border-stone-300/60 dark:border-stone-800">
            <button
              onClick={() => setActiveMainView('branches')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainView === 'branches'
                  ? 'bg-white dark:bg-[#251b12] text-[#352106] dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#352106] dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#e8a70a]" />
              <span>4 Homes ({branches.length})</span>
            </button>

            <button
              onClick={() => setActiveMainView('facilities')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainView === 'facilities'
                  ? 'bg-white dark:bg-[#251b12] text-[#352106] dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#352106] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e8a70a]" />
              <span>Facilities ({facilities.length})</span>
            </button>

            <button
              onClick={() => setActiveMainView('activities')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainView === 'activities'
                  ? 'bg-white dark:bg-[#251b12] text-[#352106] dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#352106] dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#e8a70a]" />
              <span>Activities ({activities.length})</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: 4 ORPHANAGE HOMES */}
        {/* ======================================================== */}
        {activeMainView === 'branches' && (
          <div>
            {/* City Filter Pills */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedBranchTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedBranchTab === 'all'
                    ? 'bg-[#352106] dark:bg-amber-500 text-[#f1b607] dark:text-[#241708] shadow-xs'
                    : 'bg-white dark:bg-[#1f160e] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                All Homes ({branches.length})
              </button>
              <button
                onClick={() => setSelectedBranchTab('surabaya')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedBranchTab === 'surabaya'
                    ? 'bg-[#352106] dark:bg-amber-500 text-[#f1b607] dark:text-[#241708] shadow-xs'
                    : 'bg-white dark:bg-[#1f160e] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                Surabaya ({branches.filter((b) => b.city.toLowerCase() === 'surabaya').length})
              </button>
              <button
                onClick={() => setSelectedBranchTab('sidoarjo')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedBranchTab === 'sidoarjo'
                    ? 'bg-[#352106] dark:bg-amber-500 text-[#f1b607] dark:text-[#241708] shadow-xs'
                    : 'bg-white dark:bg-[#1f160e] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                Sidoarjo ({branches.filter((b) => b.city.toLowerCase() === 'sidoarjo').length})
              </button>
            </div>

            {/* Location Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
              {filteredBranches.map((branch, index) => (
                <div
                  key={branch.id}
                  className="bg-white dark:bg-[#1a140e] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Branch Photo with subtle zoom on hover */}
                    {branch.imageUrl && (
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-stone-100 dark:border-stone-800">
                        <img
                          src={branch.imageUrl}
                          alt={branch.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#352106]/85 text-[#f1b607] backdrop-blur-xs shadow-xs">
                          Branch 0{index + 1} · {branch.city}
                        </div>
                      </div>
                    )}

                    {/* Card Header with Small Logo on Left */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Small Logo on the Left (customizable in admin) */}
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-amber-200 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/60 shadow-xs flex items-center justify-center">
                          {branch.logoUrl ? (
                            <img
                              src={branch.logoUrl}
                              alt={`Logo ${branch.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-[#ea580c] dark:text-[#f1b607]" />
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 block mb-0.5">
                            Branch 0{index + 1} · {branch.city}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#352106] dark:text-amber-50 group-hover:text-[#814f34] dark:group-hover:text-[#f1b607] transition-colors leading-tight">
                            {branch.name}
                          </h3>
                          <p className="text-xs text-[#814f34] dark:text-amber-300 font-medium mt-0.5">
                            {branch.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${branch.bgBadge}`}>
                        {branch.capacityText}
                      </span>
                    </div>

                    {/* Focus Area Pill */}
                    <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-100/80 dark:border-amber-900/40">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider block">
                        Specialized Focus
                      </span>
                      <span className="text-xs font-semibold text-[#352106] dark:text-amber-100">
                        {branch.focusArea}
                      </span>
                    </div>

                    {/* Address & Contact Info */}
                    <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="leading-relaxed text-stone-700 dark:text-stone-200">
                            {branch.address}
                          </p>
                          {branch.postalCode && (
                            <p className="text-stone-400 text-[11px]">Postal Code: {branch.postalCode}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <a
                          href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`}
                          className="font-medium text-[#352106] dark:text-amber-100 hover:underline"
                        >
                          {branch.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2.5 text-[11px] text-stone-500 dark:text-stone-400">
                        <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Visiting Hours: 09:00 AM – 05:00 PM (Reservation Required)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(branch.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#814f34] dark:text-amber-300 hover:text-[#352106] dark:hover:text-amber-100 py-1.5 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#f1b607]" />
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectVolunteerBranch(branch.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-[#352106] dark:text-amber-100 font-semibold text-xs border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#f1b607]" />
                        <span>Volunteer</span>
                      </button>
                      <button
                        onClick={() => onOpenDonationForBranch(branch)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#241708]/20" />
                        <span>Donate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: FACILITIES & INFRASTRUCTURE */}
        {/* ======================================================== */}
        {activeMainView === 'facilities' && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white dark:bg-[#1a140e] rounded-3xl p-5 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    {/* Facility Photo */}
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800">
                      <img
                        src={fac.imageUrl}
                        alt={fac.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#352106]/85 text-[#f1b607] backdrop-blur-xs">
                        {fac.category}
                      </div>
                      {fac.capacity && (
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-stone-900/90 text-[#352106] dark:text-stone-200">
                          {fac.capacity}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-base text-[#352106] dark:text-amber-100 group-hover:text-[#ea580c] dark:group-hover:text-[#f1b607] transition-colors">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-body leading-relaxed mt-1.5">
                        {fac.description}
                      </p>
                    </div>

                    {fac.features && fac.features.length > 0 && (
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1">
                        {fac.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={onOpenGeneralDonation}
                      className="w-full py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-[#352106] dark:text-amber-200 font-semibold text-xs rounded-xl border border-amber-200 dark:border-amber-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3 h-3 text-[#ea580c]" />
                      <span>Dukung Fasilitas Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: DAILY ACTIVITIES & ROUTINES */}
        {/* ======================================================== */}
        {activeMainView === 'activities' && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white dark:bg-[#1a140e] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col sm:flex-row gap-5 group shadow-sm hover:shadow-md"
                >
                  {/* Activity Photo */}
                  <div className="sm:w-44 h-40 rounded-2xl overflow-hidden shrink-0 border border-stone-100 dark:border-stone-800 relative">
                    <img
                      src={act.imageUrl}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#352106]/85 text-[#f1b607] backdrop-blur-xs">
                      {act.category}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{act.schedule}</span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-[#352106] dark:text-amber-100 group-hover:text-[#ea580c] dark:group-hover:text-[#f1b607] transition-colors leading-snug">
                        {act.title}
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-300 font-body leading-relaxed mt-2">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      {act.targetAudience && (
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{act.targetAudience}</span>
                        </div>
                      )}

                      <button
                        onClick={onOpenGeneralVolunteer}
                        className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-[#352106] dark:text-amber-200 text-xs font-semibold rounded-lg border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <HeartHandshake className="w-3 h-3 text-[#ea580c]" />
                        <span>Daftar Relawan Kegiatan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visiting & Physical Drop-off Notice */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f160e] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-[#352106] dark:text-amber-200 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#ea580c] dark:text-[#f1b607]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#352106] dark:text-amber-50">
                Planning to visit or deliver physical donations (groceries, books, formula)?
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Please notify our secretariat in advance so our caregivers can prepare a warm welcome for your visit.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/6281317000944?text=Hello%20Yayasan%20Rumah%20Bersinar,%20I%20would%20like%20to%20schedule%20a%20visit%20to%20one%20of%20your%20orphanage%20branches."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Schedule Visit via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
