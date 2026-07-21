# Nusantara Heat - Backend (Laravel API)

Backend API untuk sistem penjualan Seblak "Nusantara Heat". Menyediakan endpoint untuk:
- Registrasi & login pelanggan (pakai No. HP + password)
- Menu/produk seblak (publik, bisa dilihat tanpa login)
- Checkout pesanan (wajib login)
- Riwayat pesanan & detail invoice pelanggan
- Dashboard admin: kelola pesanan, stok produk, dan bahan baku

## Cara Menjalankan (Local Development)

1. **Install dependency PHP** (butuh PHP >= 8.2 dan Composer):
   ```bash
   composer install
   ```

2. **Siapkan file environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database:** Secara default pakai SQLite (paling mudah untuk development).
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

   **Kalau mau pakai MySQL (misal dari Laragon):**
   - Buat database baru dulu lewat phpMyAdmin/HeidiSQL, misal namanya `seblak_db`
   - Edit `.env`, ubah bagian database jadi:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=seblak_db
     DB_USERNAME=root
     DB_PASSWORD=
     ```
     (username/password default Laragon biasanya `root` tanpa password)
   - Jalankan:
     ```bash
     php artisan migrate --seed
     ```

4. **Jalankan server:**
   ```bash
   php artisan serve
   ```
   API akan berjalan di `http://localhost:8000/api`.

## Akun Default (dari seeder)

| Role      | No. HP        | Password    |
|-----------|---------------|-------------|
| Admin     | 081200000000  | password123 |
| Pelanggan | 081211112222  | password123 |

## Konfigurasi CORS/Sanctum saat Deploy

Kalau frontend React di-deploy ke domain lain (misal Vercel), update:
- `config/cors.php` -> tambahkan domain frontend di `allowed_origins`
- `.env` -> `SANCTUM_STATEFUL_DOMAINS` dan `FRONTEND_URL`

## Struktur Endpoint Utama

```
GET    /api/products              (publik)
GET    /api/products/{id}         (publik)
POST   /api/register              (publik)
POST   /api/login                 (publik)

POST   /api/logout                (auth)
GET    /api/me                    (auth)
POST   /api/orders                (auth - checkout)
GET    /api/my-orders             (auth - riwayat pelanggan)
GET    /api/orders/{id}           (auth - detail invoice)

GET    /api/orders                (admin)
PATCH  /api/orders/{id}/status    (admin)
POST   /api/products              (admin)
PUT    /api/products/{id}         (admin)
DELETE /api/products/{id}         (admin)
GET    /api/ingredients           (admin)
POST   /api/ingredients           (admin)
PUT    /api/ingredients/{id}      (admin)
DELETE /api/ingredients/{id}      (admin)
GET    /api/dashboard/summary     (admin)
```
