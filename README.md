# 📊 Laporin

**Laporin** adalah aplikasi pencatatan laporan keuangan yang dirancang khusus untuk mendukung kebutuhan usaha mikro, kecil, dan menengah (UMKM) berbasis manufaktur. Aplikasi ini membantu pelaku usaha mengelola transaksi, akun, dan laporan keuangan secara efisien dan akurat menggunakan prinsip akuntansi double-entry.

---

## 🚀 Fitur Utama

-   ✅ Manajemen Akun (Chart of Accounts) — mendukung akun riil dan nominal
-   🧾 Jurnal Umum & Buku Besar — pencatatan transaksi debit/kredit secara otomatis
-   🏭 Modul Produksi — pencatatan bahan baku, proses produksi, dan hasil jadi
-   💰 Modul Kas & Bank — transaksi masuk/keluar kas dengan referensi jurnal
-   📦 Modul Pembelian & Penjualan — terintegrasi dengan vendor dan pelanggan
-   📈 Laporan Keuangan — Neraca, Laba Rugi, dan Arus Kas
-   👥 Multi-user & Multi-perusahaan (opsional)
-   🎨 UI responsif berbasis TailwindCSS dan SPA interaktif

---

## 🛠️ Teknologi yang Digunakan

| Layer      | Teknologi                        |
| ---------- | -------------------------------- |
| Backend    | Laravel 10, MySQL/PostgreSQL     |
| Frontend   | React + Inertia.js + TailwindCSS |
| Auth       | Laravel Breeze / Sanctum         |
| Deployment | Apache/XAMPP, Laravel Forge      |

---

## 📦 Instalasi Lokal

```bash
git clone https://github.com/username/laporin.git
cd laporin
composer install
npm install && npm run dev
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
