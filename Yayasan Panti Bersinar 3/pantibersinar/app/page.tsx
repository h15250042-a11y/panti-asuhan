"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
};

type Donation = {
  id: string;
  organization_id: string;
  donor_name: string;
  amount: number;
  note: string | null;
  created_at: string;
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function HomePage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [donationsByOrg, setDonationsByOrg] = useState<Record<string, Donation[]>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [orgRes, donationRes] = await Promise.all([
      supabase.from("organizations").select("*").order("created_at", { ascending: false }),
      supabase.from("donations").select("*").order("created_at", { ascending: false }),
    ]);

    const orgData = orgRes.data || [];
    const donationData = donationRes.data || [];

    setOrganizations(orgData);

    const grouped: Record<string, Donation[]> = {};
    donationData.forEach((d) => {
      if (!grouped[d.organization_id]) grouped[d.organization_id] = [];
      grouped[d.organization_id].push(d);
    });

    setDonationsByOrg(grouped);
    setLoading(false);
  };

  const submitDonation = async (orgId: string, donorName: string, amount: string, note: string) => {
    const nominal = Number(amount);
    if (!donorName || !nominal || nominal <= 0) {
      alert("Nama donor dan nominal donasi harus diisi.");
      return;
    }

    const { error } = await supabase.from("donations").insert([
      {
        organization_id: orgId,
        donor_name: donorName,
        amount: nominal,
        note: note || null,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Donasi berhasil dikirim.");
    loadData();
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("public-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "organizations" },
        () => loadData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <h1>Pantibersinar</h1>
          <p>Platform donasi untuk organisasi yang membutuhkan bantuan dan dukungan publik.</p>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Semua Organisasi</h2>

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (
          <div className="grid">
            {organizations.length === 0 && (
              <div className="empty">Belum ada organisasi yang terdaftar.</div>
            )}

            {organizations.map((org) => {
              const donations = donationsByOrg[org.id] || [];
              const total = donations.reduce((sum, item) => sum + Number(item.amount || 0), 0);

              return (
                <article key={org.id} className="card">
                  <img
                    className="card-image"
                    src={org.banner_url || org.logo_url || "https://placehold.co/1200x600?text=No+Image"}
                    alt={org.name}
                  />

                  <div className="card-body">
                    <div className="card-head">
                      {org.logo_url ? (
                        <img className="logo-mini" src={org.logo_url} alt={org.name} />
                      ) : null}
                      <h3>{org.name}</h3>
                    </div>

                    <p>{org.description || "Belum ada deskripsi organisasi."}</p>

                    <div className="stat-row">
                      <div className="stat">{donations.length} Donasi</div>
                      <div className="stat">{formatRupiah(total)}</div>
                    </div>

                    <div className="history-list">
                      {donations.slice(0, 4).map((item) => (
                        <div key={item.id} className="history-item">
                          <div>
                            <strong>{item.donor_name || "Anonim"}</strong>
                            <br />
                            <small>{item.note || "Tidak ada catatan"}</small>
                          </div>
                          <strong>{formatRupiah(Number(item.amount || 0))}</strong>
                        </div>
                      ))}

                      {donations.length === 0 && (
                        <div className="empty">Belum ada riwayat donasi.</div>
                      )}
                    </div>

                    <div className="donation-box">
                      <h4>Form Donasi</h4>
                      <DonationForm
                        orgId={org.id}
                        onSubmit={submitDonation}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function DonationForm({
  orgId,
  onSubmit,
}: {
  orgId: string;
  onSubmit: (orgId: string, donorName: string, amount: string, note: string) => void;
}) {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="field">
      <div className="form-grid">
        <div className="field">
          <label>Nama Donatur</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Masukkan nama"
          />
        </div>

        <div className="field">
          <label>Nominal</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000"
          />
        </div>
      </div>

      <div className="field">
        <label>Catatan</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: untuk kebutuhan pangan"
        />
      </div>

      <button
        className="button"
        onClick={() => onSubmit(orgId, donorName, amount, note)}
      >
        Donasi Sekarang
      </button>
    </div>
  );
}
