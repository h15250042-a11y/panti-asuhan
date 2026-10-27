<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Yayasan Rumah Bersinar (Est. 2019)

**A home to grow. A community to belong.**

Website resmi Yayasan Rumah Bersinar menaungi 4 panti asuhan di Surabaya dan Sidoarjo untuk anak-anak prasejahtera dan daerah 3T (terdepan, terluar, tertinggal).

View your app in AI Studio: https://ai.studio/apps/6a8f2c97-40ac-4657-8165-9cd786674e88

## Supabase Realtime Setup

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Buka menu **SQL Editor**, buka file `supabase-schema.sql`, salin seluruh kodenya dan klik **Run**.
3. Di Supabase: masuk ke **Project Settings -> API**, salin:
   - `Project URL` ke `VITE_SUPABASE_URL`
   - `anon public key` ke `VITE_SUPABASE_ANON_KEY`
4. Tambahkan ke file `.env` atau environment variable platform deployment Anda.

## Run Locally

**Prerequisites:** Node.js (>= 18)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Build production:
   ```bash
   npm run build
   ```
