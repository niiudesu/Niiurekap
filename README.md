# Rekap Order (sinkron antar perangkat)

Isi folder:
- public/index.html            : halaman website
- netlify/functions/orders.mjs : penyimpan data (Netlify Functions + Netlify Blobs)
- netlify.toml, package.json   : pengaturan deploy

## Cara deploy (disarankan: lewat GitHub)
1. Buat repository GitHub, upload seluruh isi folder ini.
2. Di Netlify: Add new site > Import an existing project > pilih repository tadi.
   Pengaturan build terbaca otomatis dari netlify.toml. Klik Deploy.
3. Site configuration > Environment variables > tambah:
   APP_PASSWORD = (password pilihanmu)
4. Deploys > Trigger deploy > Deploy site (supaya password terbaca).
5. Buka alamat situs, masukkan password. Lakukan hal yang sama di laptop/PC/HP lain.

## Alternatif: Netlify CLI
npm install
npx netlify-cli login
npx netlify-cli init            (hubungkan ke site baru)
npx netlify-cli env:set APP_PASSWORD "password-kamu"
npx netlify-cli deploy --prod

Catatan: jangan pakai drag and drop folder di Netlify Drop, karena fungsi
penyimpan data butuh paket npm yang harus di-install lewat Git atau CLI.

## Cara kerja sinkron
- Setiap perubahan langsung dikirim ke server, dan halaman menarik data terbaru tiap 30 detik
  serta saat tab dibuka kembali.
- Kalau dua perangkat mengubah order yang sama, perubahan terbaru yang dipakai.
- Data tetap tersimpan di perangkat bila internet putus, lalu disinkronkan ulang otomatis.
