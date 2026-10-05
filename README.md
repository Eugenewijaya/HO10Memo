# A Golden Appreciation Letter ✨

Website statis (tanpa build, tanpa dependensi) — langsung jalan di GitHub Pages.

## Struktur
```
index.html
css/style.css
js/config.js     ← EDIT DI SINI: teks, link Drive, daftar divisi & foto
js/app.js        ← logika (tidak perlu diubah)
images/
  cover/         epid.jpg (foto profil), 1.jpg, 2.jpg (hiasan cover, opsional)
  tasya-patrick/ 1.jpg 2.jpg ...
  musik-vocal/   dance/   event/   mulmed/   marketing-usher/
  perlengkapan/  mc/      bw-kids/ dokumentasi/
```

## Menambah foto
Taruh foto di `images/<divisi>/` dengan nama `1.jpg`, `2.jpg`, … (default 5 foto per divisi).
Ubah jumlah/format di `js/config.js`, mis. `pics("dance", 8)` atau `pics("dance", 6, "png")`.
Foto yang tidak ada dilewati otomatis. Foto-foto itu juga jadi background slideshow (zoom-out + fade) di halaman divisinya.

> Tips: kecilkan foto dulu (±1600px sisi terpanjang, < 400 KB) supaya cepat di HP.
> GitHub Pages **membedakan huruf besar/kecil**: `Dance.JPG` ≠ `dance.jpg`.

## Jalankan lokal
```
python -m http.server 8000     # lalu buka http://localhost:8000
```
(Jangan buka `index.html` via double-click — pengecekan foto butuh server.)

## Deploy ke GitHub Pages
Push → repo **Settings → Pages → Deploy from a branch → main / (root)**.
