/*
 * ============================================================
 *  KONFIGURASI — semua yang perlu kamu edit ada di file ini
 * ============================================================
 *  Foto lokal ditaruh di:  images/<slug-divisi>/1.jpg, 2.jpg, ...
 *  Contoh:  images/dance/1.jpg
 *
 *  pics('dance', 4)          -> images/dance/1.jpg ... 4.jpg
 *  pics('dance', 3, 'png')   -> images/dance/1.png ... 3.png
 *  Atau tulis daftar manual: ['images/dance/a.jpg', 'images/dance/b.webp']
 *
 *  Foto yang tidak ada akan dilewati otomatis (tidak error),
 *  jadi aman menulis jumlah lebih banyak dari foto yang ada.
 *  PENTING: GitHub Pages membedakan huruf besar/kecil (Dance.JPG ≠ dance.jpg).
 */
const pics = (slug, n = 4, ext = 'jpg') =>
    Array.from({ length: n }, (_, i) => `images/${slug}/${i + 1}.${ext}`);

const CONFIG = {
    driveLink: "https://drive.google.com/drive/folders/CONTOH_LINK_PLACEHOLDER",

    // File musik lokal, mis. "audio/bgm.mp3". Kosongkan jika tidak pakai musik.
    audioUrl: "",

    epid: {
        name: "Epid",
        role: "PIC Dokumentasi",
        photo: "images/header-img/evid-gif.gif"
    },

    // 2 foto kecil dekoratif di cover (opsional)
    coverPhotos: ["images/cover/1.jpg", "images/cover/2.jpg"],

    // Pesan pembuka (setiap item = satu paragraf, boleh <b>…</b> dan \n)
    intro: [
        "Terima kasih sudah menjadi bagian dari perjalanan acara ini.",
        "Mungkin selama acara kita sibuk dengan tugas masing-masing, mengejar waktu, memastikan semuanya berjalan, dan kadang bahkan lupa menikmati momennya.",
        "Tapi dari balik kamera, aku melihat banyak hal kecil yang menurutku layak untuk diingat.",
        "Senyum. Kepanikan kecil. Ketawa. Capek. Kerja sama.",
        "Dan semua momen random yang akhirnya justru jadi cerita.",
        "Jadi sebelum dokumentasinya aku bagikan...\naku mau menyampaikan sedikit pesan untuk kalian."
    ],

    // Pesan penutup
    closing: [
        "Setelah semua cerita, kerja keras, ketawa, capek, dan momen-momen random yang kita lewati bareng...",
        "akhirnya sampai juga di bagian terakhir.",
        "Terima kasih sudah memberikan waktu, tenaga, ide, dan energi kalian selama acara ini.",
        "<b>Mungkin nggak semua momen sempat kita sadari.</b>",
        "Tapi untungnya... ada dokumentasi yang menyimpannya.",
        "<b>Dan sekarang, saatnya aku berbagi semuanya.</b>"
    ],

    /*
     * Urutan divisi = urutan tampil (3-4 foto per divisi)
     * message: string atau array paragraf — GANTI dengan pesan aslimu.
     */
    divisions: [
        {
            slug: "tasya-patrick", name: "Tasya & Patrick", emoji: "🌟",
            tagline: "Dua bintang di balik cerita",
            message: ["[Edit: pesan untuk Tasya & Patrick]", "Terima kasih sudah menghidupkan karakter dan membuat semua orang tersenyum."],
            closing: "Kalian bikin ceritanya hidup. ✨",
            photos: pics("tasya-patrick", 4)
        },
        {
            slug: "musik-vocal", name: "Musik Vocal", emoji: "🎤",
            tagline: "Suara yang bikin merinding",
            message: ["[Edit: pesan untuk Musik Vocal]", "Setiap nada dan harmoni dari kalian bikin suasana jadi hangat."],
            closing: "Suara kalian terekam di hati. 🎶",
            photos: pics("musik-vocal", 3)
        },
        {
            slug: "dance", name: "Dance", emoji: "💃",
            tagline: "Setiap gerakan adalah cerita",
            message: ["[Edit: pesan untuk Dance]", "Latihan berjam-jam terbayar di atas panggung. Energi kalian luar biasa!"],
            closing: "Kalian menari, kami terpukau. 🔥",
            photos: pics("dance", 4)
        },
        {
            slug: "event", name: "Event", emoji: "🎪",
            tagline: "Dalang di balik rundown",
            message: ["[Edit: pesan untuk Event]", "Rundown yang rapi dan semua yang jalan mulus itu hasil kerja keras kalian."],
            closing: "Semua berjalan karena kalian. 🤍",
            photos: pics("event", 4)
        },
        {
            slug: "mulmed", name: "Mulmed", emoji: "🎬",
            tagline: "Visual & audio yang bikin acara hidup",
            message: ["[Edit: pesan untuk Mulmed]", "Layar, suara, dan visual dari kalian bikin acara terasa seperti film."],
            closing: "Kalian bikin momennya terlihat megah. 🎞️",
            photos: pics("mulmed", 3)
        },
        {
            slug: "marketing-usher", name: "Marketing & Usher", emoji: "📣",
            tagline: "Wajah pertama yang menyambut semua orang",
            message: ["[Edit: pesan untuk Marketing & Usher]", "Dari promosi sampai sambutan di pintu masuk, kalian jadi kesan pertama yang hangat."],
            closing: "Senyum pertama selalu dari kalian. 😊",
            photos: pics("marketing-usher", 4)
        },
        {
            slug: "perlengkapan", name: "Perlengkapan", emoji: "🛠️",
            tagline: "Yang memastikan semuanya ada",
            message: ["[Edit: pesan untuk Perlengkapan]", "Angkat, pasang, bongkar, cari barang yang hilang — kalian selalu sigap."],
            closing: "Kalian yang menopang semuanya. 💪",
            photos: pics("perlengkapan", 3)
        },
        {
            slug: "mc", name: "MC", emoji: "🎙️",
            tagline: "Pembawa energi di atas panggung",
            message: ["[Edit: pesan untuk MC]", "Kalian menjaga suasana tetap hidup dan alur tetap mengalir."],
            closing: "Suara yang menyatukan semua orang. ✨",
            photos: pics("mc", 3)
        },
        {
            slug: "bw-kids", name: "BW Kids", emoji: "🧸",
            tagline: "Tawa kecil, kenangan besar",
            message: ["[Edit: pesan untuk BW Kids]", "Keceriaan kalian jadi bagian paling menggemaskan dari acara ini."],
            closing: "Terima kasih sudah bikin hari kami ceria. 🌈",
            photos: pics("bw-kids", 4)
        },
        {
            slug: "dokumentasi", name: "Dokumentasi", emoji: "📸",
            tagline: "Para penjaga kenangan",
            message: ["[Edit: pesan khusus untuk timku sendiri]", "Kalian luar biasa. Dari balik lensa kita menyimpan semuanya."],
            closing: "The memory keepers. 📸🤍",
            photos: pics("dokumentasi", 4)
        }
    ]
};
