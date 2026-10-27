/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DonationProgressTracker } from './components/DonationProgressTracker';
import { AboutUsSection } from './components/AboutUsSection';
import { LocationsSection } from './components/LocationsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';
import { AdminModal } from './components/AdminModal';
import { DonorTrackerModal } from './components/DonorTrackerModal';

import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_DONATIONS,
  PANTI_BRANCHES as DEFAULT_BRANCHES,
  CORE_VALUES as DEFAULT_CORE_VALUES,
  FAQS as DEFAULT_FAQS,
  DEFAULT_FACILITIES,
  DEFAULT_ACTIVITIES,
} from './data/mockData';
import {
  SiteSettings,
  VolunteerApplication,
  DonationRecord,
  PantiBranch,
  CoreValue,
  FaqItem,
  AdminAccessLog,
  FacilityItem,
  ActivityItem,
} from './types';
import { supabase, isSupabaseConfigured, insertRecord } from './lib/supabase';

const STORAGE_KEY_SETTINGS = 'rumah_bersinar_site_settings_v5';
const STORAGE_KEY_BRANCHES = 'rumah_bersinar_branches_v5';
const STORAGE_KEY_FACILITIES = 'rumah_bersinar_facilities_v5';
const STORAGE_KEY_ACTIVITIES = 'rumah_bersinar_activities_v5';
const STORAGE_KEY_VALUES = 'rumah_bersinar_core_values_v5';
const STORAGE_KEY_FAQS = 'rumah_bersinar_faqs_v5';
const STORAGE_KEY_VOLUNTEERS = 'rumah_bersinar_volunteers_v5';
const STORAGE_KEY_DONATIONS = 'rumah_bersinar_donations_v5';
const STORAGE_KEY_ADMIN_LOGS = 'rumah_bersinar_admin_logs_v5';

const INITIAL_ADMIN_LOGS: AdminAccessLog[] = [
  {
    id: 'log-seed-1',
    adminUser: 'admin@rumahbersinar.org',
    action: 'Inisialisasi Sistem & Database Realtime',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Success',
    details: 'Koneksi ke Supabase dan sinkronisasi 4 panti, fasilitas, dan kegiatan aktif.',
  },
  {
    id: 'log-seed-2',
    adminUser: 'admin@rumahbersinar.org',
    action: 'Pembaruan Logo Cabang & Fasilitas',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'Success',
    details: 'Logo panti asuhan dan sarana belajar berhasil diverifikasi.',
  },
];

export default function App() {
  // 1. Site Settings State (Hero photo, Tagline, Story text, Contacts, Announcement)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // 2. Orphanage Branches State (Editable photos, addresses, capacities, small logos)
  const [branches, setBranches] = useState<PantiBranch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANCHES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading branches from localStorage', e);
    }
    return DEFAULT_BRANCHES;
  });

  // 3. Facilities State (Editable photo, category, description, capacity)
  const [facilities, setFacilities] = useState<FacilityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FACILITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading facilities from localStorage', e);
    }
    return DEFAULT_FACILITIES;
  });

  // 4. Activities State (Editable photo, schedule, description, category)
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading activities from localStorage', e);
    }
    return DEFAULT_ACTIVITIES;
  });

  // 5. 5 Core Values State
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VALUES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading core values from localStorage', e);
    }
    return DEFAULT_CORE_VALUES;
  });

  // 6. FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading FAQs from localStorage', e);
    }
    return DEFAULT_FAQS;
  });

  // 7. Volunteer Applicants State
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading volunteers from localStorage', e);
    }
    return INITIAL_VOLUNTEER_APPLICATIONS;
  });

  // 8. Donations Ledger State
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DONATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading donations from localStorage', e);
    }
    return INITIAL_DONATIONS;
  });

  // 9. Admin Access Logs State (Audit trail & accountability display)
  const [adminLogs, setAdminLogs] = useState<AdminAccessLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading admin logs from localStorage', e);
    }
    return INITIAL_ADMIN_LOGS;
  });

  // Modals state
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number | undefined>(undefined);

  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [targetBranchIdForVolunteer, setTargetBranchIdForVolunteer] = useState<string | undefined>(undefined);

  // Hidden Admin Modal (No visible trigger on website, accessed via Ctrl+Shift+A or #admin)
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [donorTrackerOpen, setDonorTrackerOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(siteSettings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(branches));
    } catch (e) {
      console.error('Error saving branches to localStorage', e);
    }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FACILITIES, JSON.stringify(facilities));
    } catch (e) {
      console.error('Error saving facilities to localStorage', e);
    }
  }, [facilities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities to localStorage', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VALUES, JSON.stringify(coreValues));
    } catch (e) {
      console.error('Error saving core values to localStorage', e);
    }
  }, [coreValues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error('Error saving FAQs to localStorage', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers));
    } catch (e) {
      console.error('Error saving volunteers to localStorage', e);
    }
  }, [volunteers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.error('Error saving donations to localStorage', e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_LOGS, JSON.stringify(adminLogs));
    } catch (e) {
      console.error('Error saving admin logs to localStorage', e);
    }
  }, [adminLogs]);

  // Hidden Admin Trigger Listeners: #admin, ?admin=true, or Ctrl+Shift+A
  useEffect(() => {
    const checkAdminTrigger = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true') ||
        window.location.search.includes('admin=1')
      ) {
        setAdminModalOpen(true);
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Supabase Realtime synchronization
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    // 1. Initial fetch from Supabase
    const initSupabaseData = async () => {
      try {
        const { data: settingsData } = await client
          .from('site_settings')
          .select('settings')
          .eq('id', 'current')
          .maybeSingle();

        if (settingsData && settingsData.settings) {
          setSiteSettings(settingsData.settings as SiteSettings);
        }

        const { data: volData } = await client
          .from('volunteers')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (volData && volData.length > 0) {
          const mappedVols: VolunteerApplication[] = volData.map((v: Record<string, unknown>) => ({
            id: String(v.id),
            fullName: String(v.full_name || ''),
            email: String(v.email || ''),
            phone: String(v.phone || ''),
            institution: String(v.institution || ''),
            preferredBranchId: String(v.preferred_branch_id || ''),
            preferredBranchName: String(v.preferred_branch_name || ''),
            role: String(v.role || 'Volunteer'),
            availability: (v.availability === 'Weekdays' || v.availability === 'Weekends' ? v.availability : 'Flexible') as 'Weekends' | 'Weekdays' | 'Flexible',
            motivation: String(v.motivation || ''),
            submittedAt: String(v.submitted_at || new Date().toISOString()),
            status: (v.status as 'Pending' | 'Approved' | 'Contacted') || 'Pending',
          }));
          setVolunteers(mappedVols);
        }

        const { data: donData } = await client
          .from('donations')
          .select('*')
          .order('timestamp', { ascending: false });

        if (donData && donData.length > 0) {
          const mappedDons: DonationRecord[] = donData.map((d: Record<string, unknown>) => ({
            transactionId: String(d.transaction_id || d.id),
            donorName: String(d.donor_name || 'Anonymous Donor'),
            donorEmail: String(d.donor_email || ''),
            donorPhone: String(d.donor_phone || ''),
            amount: Number(d.amount) || 0,
            programId: String(d.program_id || 'general'),
            programTitle: String(d.program_title || 'General Support'),
            paymentMethod: String(d.payment_method || 'Bank Transfer'),
            prayerMessage: d.prayer_message ? String(d.prayer_message) : undefined,
            isAnonymous: Boolean(d.is_anonymous),
            timestamp: String(d.timestamp || new Date().toISOString()),
            status: (d.status as 'Verified' | 'Pending') || 'Verified',
          }));
          setDonations(mappedDons);
        }

        const { data: logData } = await client
          .from('admin_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (logData && logData.length > 0) {
          const mappedLogs: AdminAccessLog[] = logData.map((l: Record<string, unknown>) => ({
            id: String(l.id),
            adminUser: String(l.admin_user || 'Admin'),
            action: String(l.action || 'Aksi Admin'),
            timestamp: String(l.timestamp || new Date().toISOString()),
            status: (l.status as 'Success' | 'Locked' | 'Auto-Locked' | 'Unlocked' | 'Failed' | 'Update') || 'Success',
            details: l.details ? String(l.details) : undefined,
            userAgent: l.user_agent ? String(l.user_agent) : undefined,
          }));
          setAdminLogs(mappedLogs);
        }
      } catch (err) {
        console.warn('[Supabase] Initial sync notice:', err);
      }
    };

    initSupabaseData();

    // 2. Realtime listener channel
    const realtimeChannel = client
      .channel('schema-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'volunteers' },
        (payload) => {
          const v = payload.new as Record<string, unknown>;
          if (v && v.id) {
            setVolunteers((prev) => {
              if (prev.some((item) => item.id === v.id)) return prev;
              const newApp: VolunteerApplication = {
                id: String(v.id),
                fullName: String(v.full_name || ''),
                email: String(v.email || ''),
                phone: String(v.phone || ''),
                institution: String(v.institution || ''),
                preferredBranchId: String(v.preferred_branch_id || ''),
                preferredBranchName: String(v.preferred_branch_name || ''),
                role: String(v.role || 'Volunteer'),
                availability: (v.availability === 'Weekdays' || v.availability === 'Weekends' ? v.availability : 'Flexible') as 'Weekends' | 'Weekdays' | 'Flexible',
                motivation: String(v.motivation || ''),
                submittedAt: String(v.submitted_at || new Date().toISOString()),
                status: (v.status as 'Pending' | 'Approved' | 'Contacted') || 'Pending',
              };
              return [newApp, ...prev];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'donations' },
        (payload) => {
          const d = payload.new as Record<string, unknown>;
          if (d && (d.transaction_id || d.id)) {
            const id = String(d.transaction_id || d.id);
            setDonations((prev) => {
              if (prev.some((item) => item.transactionId === id)) return prev;
              const newDon: DonationRecord = {
                transactionId: id,
                donorName: String(d.donor_name || 'Anonymous Donor'),
                donorEmail: String(d.donor_email || ''),
                donorPhone: String(d.donor_phone || ''),
                amount: Number(d.amount) || 0,
                programId: String(d.program_id || 'general'),
                programTitle: String(d.program_title || 'General Support'),
                paymentMethod: String(d.payment_method || 'Bank Transfer'),
                prayerMessage: d.prayer_message ? String(d.prayer_message) : undefined,
                isAnonymous: Boolean(d.is_anonymous),
                timestamp: String(d.timestamp || new Date().toISOString()),
                status: (d.status as 'Verified' | 'Pending') || 'Verified',
              };
              return [newDon, ...prev];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_logs' },
        (payload) => {
          const l = payload.new as Record<string, unknown>;
          if (l && l.id) {
            setAdminLogs((prev) => {
              if (prev.some((item) => item.id === l.id)) return prev;
              const newLog: AdminAccessLog = {
                id: String(l.id),
                adminUser: String(l.admin_user || 'Admin'),
                action: String(l.action || 'Aksi Admin'),
                timestamp: String(l.timestamp || new Date().toISOString()),
                status: (l.status as 'Success' | 'Locked' | 'Auto-Locked' | 'Unlocked' | 'Failed' | 'Update') || 'Success',
                details: l.details ? String(l.details) : undefined,
                userAgent: l.user_agent ? String(l.user_agent) : undefined,
              };
              return [newLog, ...prev];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          const s = payload.new as { id?: string; settings?: SiteSettings };
          if (s && s.id === 'current' && s.settings) {
            setSiteSettings(s.settings);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(realtimeChannel);
    };
  }, []);

  // Handlers
  const handleOpenDonation = (programId?: string, amount?: number) => {
    setSelectedProgramId(programId);
    setSelectedDonationAmount(amount);
    setDonationModalOpen(true);
  };

  const handleOpenVolunteer = (branchId?: string) => {
    setTargetBranchIdForVolunteer(branchId || (branches[0] ? branches[0].id : undefined));
    setVolunteerModalOpen(true);
  };

  const handleVolunteerSubmitted = async (newApp: VolunteerApplication) => {
    setVolunteers((prev) => [newApp, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await insertRecord('volunteers', {
        id: newApp.id,
        full_name: newApp.fullName,
        email: newApp.email,
        phone: newApp.phone,
        institution: newApp.institution || null,
        preferred_branch_id: newApp.preferredBranchId || null,
        preferred_branch_name: newApp.preferredBranchName || null,
        role: newApp.role || null,
        availability: newApp.availability || null,
        motivation: newApp.motivation || null,
        submitted_at: newApp.submittedAt,
        status: newApp.status,
      });
    }
  };

  const handleDonationSuccess = async (record: DonationRecord) => {
    setDonations((prev) => [record, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await insertRecord('donations', {
        transaction_id: record.transactionId,
        donor_name: record.donorName,
        donor_email: record.donorEmail || null,
        donor_phone: record.donorPhone || null,
        amount: record.amount,
        program_id: record.programId || null,
        program_title: record.programTitle || null,
        payment_method: record.paymentMethod || null,
        prayer_message: record.prayerMessage || null,
        is_anonymous: record.isAnonymous,
        timestamp: record.timestamp,
        status: record.status,
      });
    }
  };

  const handleAddAdminLog = async (log: AdminAccessLog) => {
    setAdminLogs((prev) => [log, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await insertRecord('admin_logs', {
        id: log.id,
        admin_user: log.adminUser,
        action: log.action,
        status: log.status,
        details: log.details || null,
        user_agent: log.userAgent || null,
        timestamp: log.timestamp,
      });
    }
  };

  const handleUpdateSiteSettings = async (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ id: 'current', settings: newSettings, updated_at: new Date().toISOString() });
      } catch (err) {
        console.warn('[Supabase] Failed to persist site_settings:', err);
      }
    }
  };

  const handleScrollToStory = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-body antialiased selection:bg-[#fdc502] selection:text-[#241708]">
      {/* Header with Direct Day/Night Switch and Hidden Admin Trigger via Hotkey */}
      <Header
        siteSettings={siteSettings}
        onOpenDonation={() => handleOpenDonation()}
        onOpenVolunteer={() => handleOpenVolunteer()}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenDonorTracker={() => setDonorTrackerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section matching Screenshot 1: Dynamic Photo, Tagline, & Discover our story */}
        <Hero
          siteSettings={siteSettings}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
          onScrollToStory={handleScrollToStory}
        />

        {/* Live Donation Feed & Progress Bar directly beneath Hero */}
        <DonationProgressTracker
          donations={donations}
          onOpenDonation={() => handleOpenDonation()}
          onOpenDonorTracker={() => setDonorTrackerOpen(true)}
        />

        {/* Section 1: Our Story (Screenshot 2) & What We Believe (Screenshot 3) */}
        <AboutUsSection
          siteSettings={siteSettings}
          coreValues={coreValues}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
        />

        {/* Section 2: Locations, Facilities & Activities (Interactive Tabs) */}
        <LocationsSection
          branches={branches}
          facilities={facilities}
          activities={activities}
          onSelectVolunteerBranch={(branchId) => handleOpenVolunteer(branchId)}
          onOpenDonationForBranch={(branch: PantiBranch) => handleOpenDonation(undefined, 250000)}
          onOpenGeneralDonation={() => handleOpenDonation()}
          onOpenGeneralVolunteer={() => handleOpenVolunteer()}
        />

        {/* Section 3: Frequently Asked Questions matching Screenshot 4 with WhatsApp CTA */}
        <FaqSection
          faqs={faqs}
          whatsappPhone={siteSettings.whatsappPhone}
        />
      </main>

      {/* Footer matching Screenshot 5 with Explore & Contact Us columns (Clean, no visible admin link) */}
      <Footer
        siteSettings={siteSettings}
        onOpenDonation={() => handleOpenDonation()}
        onOpenVolunteer={() => handleOpenVolunteer()}
      />

      {/* Public Donation Modal with mandatory fields & printable receipt */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        initialProgramId={selectedProgramId}
        initialAmount={selectedDonationAmount}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* Open Volunteer Application Modal */}
      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        onVolunteerSubmitted={handleVolunteerSubmitted}
        initialBranchId={targetBranchIdForVolunteer}
      />

      {/* Donor Tracking Modal (from 3-dots menu or live ledger) */}
      <DonorTrackerModal
        isOpen={donorTrackerOpen}
        onClose={() => setDonorTrackerOpen(false)}
        donations={donations}
        onOpenDonationModal={() => handleOpenDonation()}
      />

      {/* Protected Admin Dashboard Modal with Auto-Lock, Accountability Trail, Logos & Real Database */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        siteSettings={siteSettings}
        onUpdateSettings={handleUpdateSiteSettings}
        branches={branches}
        onUpdateBranches={setBranches}
        facilities={facilities}
        onUpdateFacilities={setFacilities}
        activities={activities}
        onUpdateActivities={setActivities}
        coreValues={coreValues}
        onUpdateCoreValues={setCoreValues}
        faqs={faqs}
        onUpdateFaqs={setFaqs}
        volunteers={volunteers}
        onUpdateVolunteers={setVolunteers}
        donations={donations}
        onUpdateDonations={setDonations}
        adminLogs={adminLogs}
        onAddAdminLog={handleAddAdminLog}
      />
    </div>
  );
}
