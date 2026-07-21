# Nusantara Heat - Frontend (React + Vite + Bootstrap)

Frontend untuk sistem penjualan Seblak "Nusantara Heat". Terhubung ke backend Laravel API secara terpisah.

## Fitur

- **Landing page publik** - bisa dilihat tanpa login, browse menu seblak
- **Login & Daftar** - pakai Nomor HP + password (daftar butuh nama, no hp, alamat, password)
- **Dashboard Pelanggan** (`/pesan`) - pilih menu, atur level pedas (1-5), keranjang, checkout
- **Riwayat Pesanan** (`/riwayat-pesanan`) - pesanan aktif & histori
- **Detail Invoice** (`/pesanan/:id`)
- **Dashboard Admin** (`/admin`) - ringkasan stats, pesanan terbaru, stok menipis
- **Kelola Pesanan** (`/admin/pesanan`) - ubah status pesanan
- **Kelola Menu** (`/admin/produk`) - CRUD menu seblak + stok porsi
- **Kelola Bahan Baku** (`/admin/bahan-baku`) - CRUD & pantau stok bahan baku

## Cara Menjalankan

1. **Install dependency:**
   ```bash
   npm install
   ```

2. **Siapkan environment:**
   ```bash
   cp .env.example .env
   ```
   Pastikan `VITE_API_URL` mengarah ke backend Laravel kamu (default: `http://localhost:8000/api`).

3. **Jalankan dev server:**
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`.

4. **Build untuk production:**
   ```bash
   npm run build
   ```
   Hasil build ada di folder `dist/`, siap di-deploy ke Vercel/Netlify/hosting statis lainnya.

## Catatan Deploy

Kalau frontend dan backend di domain berbeda saat production:
- Update `VITE_API_URL` di `.env` (atau environment variable di Vercel) ke URL backend production kamu.
- Pastikan domain frontend production sudah ditambahkan di `config/cors.php` backend Laravel.
