# KILAP KEPRI

**Knowledge Inventory Laporan Informasi Publik Kepulauan Riau**

Platform Knowledge Inventory internal untuk SDM Kantor Perwakilan Bank Indonesia Provinsi Kepulauan Riau (KPw BI Kepri). Membantu memahami, mencari, dan mengelola pengetahuan serta FAQ layanan informasi publik Bank Indonesia.

Bukan situs permohonan publik baru dan bukan formulir pengaduan konsumen.

## Stack

- Next.js (App Router) + React + TypeScript + Tailwind CSS
- Data FAQ/kategori dari seed in-code + penyimpanan runtime di memori server (`globalThis`)
- Autentikasi admin dengan cookie sesi HttpOnly + bcrypt terhadap kredensial env

Tidak ada Postgres/Neon/SQLite sebagai persyaratan deploy.

## Deploy tanpa WSL (Windows PowerShell / GitHub)

Tidak perlu WSL atau Origin CLI. Unduh zip proyek (atau unduh sumber dari [Cursor Codebase](https://cursor.com/codebase/darren-megantoro/kilap-prompt) jika tombol Download tersedia), ekstrak, lalu pilih salah satu jalur di bawah.

### A. Tanpa CLI (paling mudah) — unggah via situs GitHub

1. Buka GitHub → buat repo baru (atau buka `darren-megantoro/kilap-prompt` jika sudah ada).
2. Pilih **Add file → Upload files**.
3. Seret **seluruh isi** folder hasil ekstrak zip (bukan folder luarnya saja) ke halaman upload.
4. Commit ke branch `main`.

### B. PowerShell + Git for Windows (setelah zip ada di PC)

Instal [Git for Windows](https://git-scm.com/download/win) jika belum ada. Ganti path zip/folder sesuai lokasi unduhan Anda.

```powershell
# Ekstrak zip (contoh: Downloads)
Expand-Archive -Path "$env:USERPROFILE\Downloads\kilap-prompt-for-github.zip" -DestinationPath "$env:USERPROFILE\Downloads\kilap-prompt" -Force
cd "$env:USERPROFILE\Downloads\kilap-prompt"

# Jika zip berisi subfolder, masuk ke folder yang berisi package.json
# cd .\nama-subfolder

git init
git add .
git commit -m "Initial commit: KILAP KEPRI"
git branch -M main
git remote add origin https://github.com/darren-megantoro/kilap-prompt.git
git push -u origin main
```

Jika remote sudah ada isi, gunakan `git pull origin main --allow-unrelated-histories` lalu resolve/commit sebelum push, atau force-push hanya jika Anda yakin ingin menimpa remote.

### C. Vercel — import dari GitHub + env vars

1. Buka [vercel.com](https://vercel.com) → **Add New Project** → **Import** repo GitHub di atas.
2. Set Environment Variables (Production):

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `AUTH_SECRET` | Ya | String acak ≥ 32 karakter |
| `ADMIN_EMAIL` | Ya | Email login admin |
| `ADMIN_PASSWORD` | Ya | Kata sandi login admin |
| `ADMIN_NAME` | Tidak | Default: `Admin KILAP KEPRI` |
| `NEXT_PUBLIC_APP_URL` | Tidak | URL publik aplikasi |

3. Deploy. Tidak perlu `DATABASE_URL`, migrate, atau seed di Vercel.

## Deploy ke Vercel (cara utama)

Jika kode sudah di GitHub: Import / hubungkan repositori `darren-megantoro/kilap-prompt` ke Vercel, set env vars di atas, lalu Deploy.

**Catatan jujur:** tanpa database eksternal, perubahan admin (CRUD FAQ) dan analitik dashboard tersimpan di memori instance server dan dapat hilang saat cold start / redeploy. Seed 5 kategori + 24 FAQ selalu kembali dari kode. Untuk penggunaan SDM internal singkat ini biasanya cukup; jika butuh persistensi permanen baru diperlukan database.

## Menjalankan secara lokal

```bash
cp .env.example .env
npm install
npm run dev
```

Aplikasi: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Login admin memakai `ADMIN_EMAIL` / `ADMIN_PASSWORD` dari `.env`.

## Skrip utama

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Server pengembangan (port 43127) |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Uji pencarian & batas waktu Asia/Jakarta |

## Rute

- `/` — Beranda
- `/knowledge-inventory` — Knowledge Inventory (pencarian FAQ grounded)
- `/admin/login` — Login admin
- `/admin` — Dashboard 6 metrik (interaksi Knowledge Inventory)
- `/admin/faq` — Kelola FAQ (CRUD, impor/ekspor)
- `/admin/riwayat` — Riwayat perubahan FAQ

## Logo

Aset resmi tersedia di `public/Logo KILAP KEPRI.png` (juga dilayani sebagai `/logo-kilap-kepri.png`) dan ditaruh di header publik, login, serta sidebar/header admin.

## Catatan privasi

- Pencarian FAQ deterministik dari data lokal; tidak memanggil LLM eksternal.
- Query pencarian di-redaksi (email/telepon disembunyikan) sebelum dicatat.
- Event analitik: `search_submit` dan `faq_open` saja; zona waktu pelaporan Asia/Jakarta.
