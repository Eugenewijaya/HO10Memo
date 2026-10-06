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
const pics = (slug, n = 5, ext = 'webp') =>
    Array.from({ length: n }, (_, i) => `images/${slug}/${i + 1}.${ext}`);

const CONFIG = {
    driveLink: "https://drive.google.com/drive/folders/1y-hR4WboimVdemNvkV1tGkoFsX_KmtJ2?usp=sharing",

    // File musik lokal di folder audio
    audioUrl: "audio/bgaudio.ogg",

    epid: {
        name: "Epid",
        role: "PIC Dokumentasi",
        photo: "images/header-img/evid-gif.gif"
    },

    // 2 foto kecil dekoratif di cover (format .webp / .jpg / .png)
    coverPhotos: ["images/cover/1.webp", "images/cover/2.webp"],

    // Pesan pembuka (setiap item = satu paragraf, boleh <b>…</b> dan \n)
    intro: [
        "Hallo Semuanya, Aku mau say thankyouu karena kalian udah jadi bagian dari acara ini.",
        "Mungkin selama persiapan acara sampe hari H kita sibuk dengan tugas masing-masing, ngejar waktu, meeting terus buat mastiin semuanya berjalan.",
        "Tapi apa kamu tau?, Dokum melihat segalanya mulai dari hal yang kamu notice, ngga notice atau sempet notice ga yaaa.",
        "Kayak pas lagi serius. Lagi panik dikit. Ketawa. Becanda. dan juga lagi capek-capeknya.",
        "Semua momen random yang akhirnya justru jadi cerita di event kita kali ini.",
        "Jadi sebelum link dokumentasinya aku bagiin...\naku mau menyampaikan sedikit afirmasi kecil untuk kalian. yaa walau aku ga pandai merangkai kata kata hehehe"
    ],

    // Pesan penutup
    closing: [
        "Setelah semua cerita, kerja keras, ketawa, capek, dan momen-momen kocak yang kita lewati bareng bareng...",
        "akhirnya sampai juga di bagian terakhir.",
        "Makasih bangettt udah mau ngebagi waktu, tenaga, ide, dan energi kalian selama acara ini.",
        "<b>Mungkin nggak semua momen sempat kita sadari.</b>",
        "Tapi untungnya... ada aku dan tim dokumentasi yang udah nyimpen baik baik recapnya.",
        "<b>Dan sekarang, saatnya aku bagiin ke kalian semua.</b>"
    ],

    /*
     * Urutan divisi = urutan tampil (1-5 foto format .webp per divisi)
     * Foto otomatis dimuat jika ada (1.webp, 2.webp, 3.webp, 4.webp, 5.webp).
     * Jika hanya ada 3 foto, foto ke-4 dan ke-5 otomatis dilewati tanpa error.
     */
    divisions: [
        {
            slug: "tasya-patrick", name: "Tasya & Patrick", emoji: "🌟",
            tagline: "Dua bintang di balik cerita",
            message: ["Allooo aku mau ngucapin makasih ya udah direct acaranya sampe finish, tentu saja anda kan yang pusing, ngurusin ini itu dari nol dan sabar ngadepin kita semua, udah emang paling gokill dahhh"],
            closing: "Hidup memang mudah, mudah mudahan survive. ✨",
            photos: pics("tasya-patrick", 1)
        },
        {
            slug: "musik-vocal", name: "Musik Vocal", emoji: "🎤",
            tagline: "Bilangin ke matahari ini yang paling terang",
            message: ["Aku tau di balik kerennya penampilan kalian di panggung pasti banyak banget latihannya, ga cuma di studio aja kann siapa tau di kamar mandi atau di depan kaca, terus belum lagi rasa deg-degan pas mau naik panggung tapi kalian berhasil ngebuktiin kalo semuanya worth it bangett wkwkwk"],
            closing: " Gue apresiasi kalian segede gedenyaaa",
            photos: pics("musik-vocal", 3)
        },
        {
            slug: "dance", name: "Dance", emoji: "💃",
            tagline: "Ini sih yang bikin makin seru",
            message: ["Sebelumnya maaf yaa, aku pas latihan ngga sempet dateng ke studio dance hehe, tapi pas hari H aslii keren banget coyy, penampilan kalian bener bener jadi salah satu highlight utama yang bikin acaranya makin meledakkk"],
            closing: "Proud bangett WKKWKWK. 🔥",
            photos: pics("dance", 3)
        },
        {
            slug: "event", name: "Event", emoji: "🎪",
            tagline: "Ini nih yang kabur semua pas di rekam",
            message: ["Gaiss Thankyou yaa, udah ngerangkai acaranya sampai berjalan bener bener tuntas, ngeliat kalian yang repot banget ngurusin banyak hal yang complicated, itu bikin salute banget sihh asli sumpah ini aja ngetik ga pake AI"],
            closing: "Maju lo semua gue beliin teazzi.",
            photos: pics("event", 3)
        },
        {
            slug: "mulmed", name: "Mulmed", emoji: "🎬",
            tagline: "Masih kerabat lah sama dokum yak",
            message: ["Kita tau jadi anak mulmed itu riwehnya minta ampun,harus stay terus, mata ga boleh lepas dari monitor dan pasang kuping biar cuenya ga meleset wkwkwk, Makasih udah bantu manage visual sebaik baiknya, ayam jago aja minder liat anak mulmed"],
            closing: "Kelasss Kinggg",
            photos: pics("mulmed", 3)
        },
        {
            slug: "marketing-usher", name: "Marketing & Usher", emoji: "📣",
            tagline: "Wajah pertama yang menyambut semua orang",
            message: ["Dari promosi sampai sambutan di pintu masuk, paling gokil sihh apalagi bisa dapetin peserta lebih dari 230+ orang, tolong dong konsumsi mereka x2 di next event Wkwkwkwk"],
            closing: "Semoga lelahmu menjadi civic turbo",
            photos: pics("marketing-usher", 3)
        },
        {
            slug: "perlengkapan", name: "Perlengkapan", emoji: "🛠️",
            tagline: "Semuanya ada kalo dia ada",
            message: ["Angkat, pasang, bongkar, cari barang yang hilang sampe nyediain konsumsi buat tim, itu capeknya kalo di convert jadi saldo gopay bisa kebeli nasi kuning sama siomay lagi."],
            closing: "The Real Act of Service gasihhh",
            photos: pics("perlengkapan", 3)
        },
        {
            slug: "mc", name: "MC", emoji: "🎙️",
            tagline: "Pembawa energi di atas panggung",
            message: ["Makasih banyak udah ngebawain acara dari awal sampe kelar, Sumpah jadi MC yang harus tetep keliatan seru dan senyum terus itu bingung juga sih naro space buat nervousnya dimana? apalagi mikirin jokes dadakan wkwkwk"],
            closing: "Pokoknya kalian gokill abiss. ✨",
            photos: pics("mc", 2)
        },
        {
            slug: "bw-kids", name: "BW Kids", emoji: "🧸",
            tagline: "Tawa kecil, kenangan besar",
            message: ["Alloo adik adik BW Kids, Aku mau ucapin makasih yaa udah rajin, berani tampil di depan banyak orang, dan bikin suasana Hangout jadi lebih seruu, Buat Papi dan Mami Nanti di save ya foto foto yang ada di drivenya hahaha"],
            closing: "Asli lebih jago mereka nyanyinya dari pada aku wkwkwk",
            photos: pics("bw-kids", 2)
        },
        {
            slug: "dokumentasi", name: "Dokumentasi", emoji: "📸",
            tagline: "Dokum juga mau di dokumin",
            message: ["Gaiss makasih banget yaa, sumpah aku terbantu sekali di event ini buat foto foto dan bikin konten ya walau sebagian memang ada sedikit kendala tapi gapapa, kalian keren banget udah bantu capture semua momen dari awal sampe akhir, sangat appreciate ke kalian semua hehehe"],
            closing: "The memory keepers. 📸🤍",
            photos: pics("dokumentasi", 3)
        }
    ]
};
