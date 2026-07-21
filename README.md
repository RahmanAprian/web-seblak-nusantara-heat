# Nusantara Heat - Sistem Penjualan Seblak

Aplikasi web penjualan seblak dengan dua aktor: **Admin** dan **Pelanggan**. Dibangun dengan
Laravel 12 (backend API) dan React + Bootstrap (frontend), terpisah menjadi 2 folder agar mudah
dikembangkan dan di-deploy secara independen (misal backend ke Railway, frontend ke Vercel).

```
seblak-app/
├── backend/    <- Laravel 12 API (auth, produk, pesanan, bahan baku)
└── frontend/   <- React + Vite + Bootstrap (UI publik, pelanggan, admin)
```

## Fitur Utama

- ✅ Landing page bisa dilihat **tanpa login** (browse menu seblak)
- ✅ **Login wajib** saat mau checkout/memesan
- ✅ Daftar akun cukup: **Nama, No. HP, Alamat, Password** (tanpa email wajib)
- ✅ Dashboard Pelanggan: pilih menu, atur level pedas, keranjang, checkout, riwayat pesanan
- ✅ Dashboard Admin: ringkasan statistik, kelola status pesanan, kelola menu & stok, kelola bahan baku
- ✅ Stok produk otomatis berkurang saat ada pesanan masuk
- ✅ Desain terinspirasi dari referensi yang dikirim, dengan tema pedas (merah-oranye), rounded card, dan level pedas interaktif

## Quick Start (Development Local)

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```
Backend jalan di `http://localhost:8000`, API di `http://localhost:8000/api`.

### 2. Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend jalan di `http://localhost:5173`.

## Akun Default (hasil seeder)

| Role      | No. HP        | Password    |
|-----------|---------------|-------------|
| Admin     | 081200000000  | password123 |
| Pelanggan | 081211112222  | password123 |

Detail lebih lanjut ada di `backend/README.md` dan `frontend/README.md`.

## Yang Perlu Disesuaikan Sendiri

- **Gambar produk**: seeder belum menyertakan URL gambar asli, jadi frontend akan menampilkan
  gambar fallback. Kamu bisa tambahkan `image` (URL) saat menambah/edit menu lewat dashboard admin.
- **Ongkos kirim**: saat ini flat Rp 5.000 di frontend (`CustomerDashboard.jsx`), sesuaikan kalau
  perlu logika ongkir per area.
- **Metode pembayaran**: saat ini hanya dicatat sebagai teks bebas (default "cod"), belum ada
  integrasi payment gateway.
