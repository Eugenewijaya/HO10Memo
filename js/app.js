/* ============================================================
   App logic — background fx, slideshow, navigasi, lightbox
   Semua teks/foto diatur di js/config.js
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const isSmall = () => innerWidth < 640;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= PARTIKEL EMAS (canvas) =================
 * - bintang berkelip (hanya di mode "space": cover, pesan, penutup)
 * - percikan memancar dari pusat cahaya
 * - debu emas naik pelan (mode "photos")
 */
const fx = (() => {
    const cv = $('#fx'), g = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, parts = [], stars = [], blend = 1, target = 1, last = 0, acc = 0, mode = 'space';

    const sprite = draw => { const s = document.createElement('canvas'); s.width = s.height = 64; draw(s.getContext('2d')); return s; };
    const glow = sprite(c => {
        const r = c.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0, 'rgba(255,248,215,1)'); r.addColorStop(.2, 'rgba(255,220,120,.85)');
        r.addColorStop(.55, 'rgba(245,170,40,.25)'); r.addColorStop(1, 'rgba(245,170,40,0)');
        c.fillStyle = r; c.fillRect(0, 0, 64, 64);
    });
    const star = sprite(c => { // kilau 4 sudut
        c.translate(32, 32); c.shadowColor = '#ffb81f'; c.shadowBlur = 10;
        const gr = c.createRadialGradient(0, 0, 0, 0, 0, 28); gr.addColorStop(0, '#fff2b8'); gr.addColorStop(.4, '#ffc93c'); gr.addColorStop(1, '#f0a30f');
        c.fillStyle = gr;
        c.beginPath(); c.moveTo(0, -28);
        c.quadraticCurveTo(2, -2, 28, 0); c.quadraticCurveTo(2, 2, 0, 28);
        c.quadraticCurveTo(-2, 2, -28, 0); c.quadraticCurveTo(-2, -2, 0, -28); c.fill();
    });

    function resize() {
        const w = innerWidth, h = innerHeight;
        // abaikan perubahan tinggi kecil (address bar mobile) agar bintang tidak "lompat"
        if (stars.length && w === W && Math.abs(h - H) < 140) return;
        W = w; H = h; dpr = Math.min(devicePixelRatio || 1, 2);
        cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(130, (W * H / 8000) | 0);
        stars = Array.from({ length: n }, () => ({
            x: rand(0, W), y: rand(0, H), s: rand(5, 15), p: rand(0, 6.28), sp: rand(.6, 2.6),
            spr: Math.random() < .35 ? star : glow
        }));
    }

    const ox = () => W / 2, oy = () => H * .4;

    function radial() {
        const a = rand(0, 6.28), v = (isSmall() ? 55 : 90) * rand(.5, 1.4), isStar = Math.random() < .3;
        parts.push({ x: ox(), y: oy(), vx: Math.cos(a) * v, vy: Math.sin(a) * v, acc: .25,
            size: rand(10, isStar ? 30 : 22), grow: 1.1, age: 0, life: rand(2.8, 5.5),
            spr: isStar ? star : glow, rot: rand(0, 6.28), vr: rand(-1, 1) });
    }
    function dust() {
        parts.push({ x: rand(0, W), y: H + 10, vx: rand(-12, 12), vy: -rand(18, 50), acc: 0,
            size: rand(5, 14), grow: 0, age: 0, life: rand(6, 12), spr: glow, rot: 0, vr: 0, sway: rand(0, 6.28) });
    }
    function burst(x, y, n = 10) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
            const a = rand(0, 6.28), v = rand(70, 240), isStar = Math.random() < .5;
            parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, acc: -.9,
                size: rand(8, 22), grow: .2, age: 0, life: rand(.8, 1.7),
                spr: isStar ? star : glow, rot: rand(0, 6.28), vr: rand(-4, 4) });
        }
    }

    function frame(ts) {
        const dt = Math.min((ts - last) / 1000 || 0, .05); last = ts;
        blend = 1; // bintang dan partikel stabil bersinar di background

        // pemancar partikel emas konstan & halus
        if (!reduceMotion && parts.length < 150) {
            const k = isSmall() ? .7 : 1;
            acc += dt * 16 * k; while (acc >= 1) { radial(); acc--; }
            if (Math.random() < dt * 5) dust();
        }

        g.clearRect(0, 0, W, H);
        g.globalCompositeOperation = 'lighter';

        const t = ts / 1000;
        for (const s of stars) {
            g.globalAlpha = .25 + .75 * (.5 + .5 * Math.sin(t * s.sp + s.p));
            g.drawImage(s.spr, s.x - s.s / 2, s.y - s.s / 2, s.s, s.s);
        }

        for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i]; p.age += dt;
            const t = p.age / p.life;
            if (t >= 1) { parts.splice(i, 1); continue; }
            const f = 1 + p.acc * dt; p.vx *= f; p.vy *= f;
            p.x += p.vx * dt + (p.sway !== undefined ? Math.sin(p.age + p.sway) * .35 : 0); p.y += p.vy * dt;
            p.rot += p.vr * dt;
            const a = t < .15 ? t / .15 : 1 - (t - .15) / .85;
            const sz = p.size * (.45 + p.grow * t * .7 + (p.grow ? 0 : .55));
            g.globalAlpha = a * a * (p.spr === star ? 1 : .9);
            if (p.spr === star) {
                g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.drawImage(p.spr, -sz / 2, -sz / 2, sz, sz); g.restore();
            } else g.drawImage(p.spr, p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
        g.globalAlpha = 1;
        requestAnimationFrame(frame);
    }

    addEventListener('resize', resize);
    resize(); requestAnimationFrame(frame);

    // percikan kecil hanya ketika mengetuk foto polaroid
    document.addEventListener('pointerdown', e => {
        if (e.target.closest('.pol-in')) burst(e.clientX, e.clientY, 10);
    });

    return { setMode() {}, burst };
})();

/* ================= LOADER FOTO LOKAL ================= */
const imgCache = new Map();
const canLoad = src => {
    if (!imgCache.has(src)) imgCache.set(src, new Promise(res => {
        const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src;
    }));
    return imgCache.get(src);
};
const validOnly = async list => {
    const checked = await Promise.all(list.map(async src => {
        if (await canLoad(src)) return src;
        if (src.endsWith('.webp')) {
            const jpg = src.replace(/\.webp$/, '.jpg');
            if (await canLoad(jpg)) return jpg;
            const png = src.replace(/\.webp$/, '.png');
            if (await canLoad(png)) return png;
        }
        return null;
    }));
    return checked.filter(Boolean);
};

/* ================= SLIDESHOW BACKGROUND (DILEWATI: BACKGROUND TETAP STABIL) ================= */
const slides = { play() {}, stop() {} };

/* ================= NAVIGASI ================= */
const DIVS = CONFIG.divisions;
let current = 'view-cover', divIdx = 0, busy = false, renderToken = 0;

function goTo(id, after) {
    if (busy || id === current) return;
    busy = true;
    const from = $('#' + current);
    from.classList.add('leaving');
    setTimeout(() => {
        from.classList.remove('active', 'leaving');
        current = id;
        $('#' + id).classList.add('active');
        scrollTo({ top: 0 });
        after && after();
        busy = false;
    }, reduceMotion ? 0 : 450);
}

const para = (arr, from = 1) => arr.map((t, i) => `<p class="rv" style="--i:${i + from}">${t.replace(/\n/g, '<br>')}</p>`).join('');

async function renderDivision() {
    const d = DIVS[divIdx], token = ++renderToken, n = DIVS.length;
    $('#div-counter').textContent = `${String(divIdx + 1).padStart(2, '0')} / ${n}`;
    $('#div-bar').style.width = `${((divIdx + 1) / n) * 100}%`;
    $('#btn-prev').setAttribute('aria-label', divIdx ? 'Sebelumnya' : 'Kembali ke pesan');
    $('#btn-next').setAttribute('aria-label', divIdx < n - 1 ? 'Berikutnya' : 'Ke penutup');

    // Update Header Divisi & trigger animasi judul
    const emEl = $('#div-emoji'); if (emEl) emEl.textContent = d.emoji || '✨';
    const tiEl = $('#div-title'); if (tiEl) tiEl.textContent = d.name;
    const tgEl = $('#div-tag');
    if (tgEl) {
        tgEl.textContent = d.tagline || '';
        tgEl.style.display = d.tagline ? '' : 'none';
    }
    const head = $('.div-head');
    if (head) {
        head.classList.remove('title-anim');
        void head.offsetWidth; // force reflow untuk re-trigger animasi
        head.classList.add('title-anim');
    }

    const photos = await validOnly(d.photos || []);
    if (token !== renderToken) return;           // user sudah pindah divisi

    const animList = [
        'enterDrop', 'enterFlip', 'enterSwing', 'enterSettle', 'enterSnap',
        'enterSlide', 'enterStamp', 'enterPop', 'enterBounce', 'enterDarkroom'
    ];
    const enterPol = animList[divIdx % animList.length];
    const enterPaper = animList[(divIdx + 3) % animList.length];
    const m = photos.length;
    const pols = m ? photos.map((src, i) => {
        let x = 50, y = 2, rot = 0;
        if (m === 1) {
            x = 50; y = 2; rot = -2;
        } else if (m === 2) {
            x = i === 0 ? 35 : 65;
            y = i === 0 ? 3 : 5;
            rot = i === 0 ? -6 : 6;
        } else if (m === 3) {
            // 3 Foto: lengkungan scrapbook manis & seimbang
            x = i === 0 ? 22 : (i === 1 ? 50 : 78);
            y = i === 1 ? 0 : 4;
            rot = i === 0 ? -7 : (i === 1 ? 2 : 7);
        } else if (m === 4) {
            // 4 Foto: cluster scrapbook bertumpuk rapi
            const step = 66 / 3;
            x = 17 + (i * step);
            y = (i === 1 || i === 2) ? (i === 1 ? 0 : 2) : 5;
            rot = i === 0 ? -8 : (i === 1 ? 3 : (i === 2 ? -4 : 7));
        } else {
            // 5 Foto: lengkungan scrapbook 5 foto seimbang
            const step = 68 / (m - 1);
            x = 16 + (i * step);
            const yMap = [5, 2, 0, 2, 5];
            const rotMap = [-9, -4, 1, 5, 8];
            y = yMap[i] ?? 3;
            rot = rotMap[i] ?? (i % 2 === 0 ? -5 : 5);
        }

        let zIndex = 10 + i;
        if (m === 3 && i === 1) zIndex = 25;
        else if (m === 4 && (i === 1 || i === 2)) zIndex = 22 + i;
        else if (m >= 5 && i === 2) zIndex = 28;
        else if (m >= 5 && (i === 1 || i === 3)) zIndex = 24;
        const floatDelay = (i * 0.45).toFixed(2);
        const rotDrift = (i % 2 === 0 ? 1.5 : -1.5);

        return `<div class="pol-pos" style="left:${x}%;top:${y}%;z-index:${zIndex}">
            <div class="pol" style="--enter:${enterPol};animation-delay:${(i * 0.12).toFixed(2)}s">
                <button class="pol-in" data-i="${i}" style="--rot:${rot}deg;--float-delay:${floatDelay}s;--rot-drift:${rotDrift}deg" aria-label="Lihat foto ${i + 1}">
                    <img src="${src}" alt="${d.name} ${i + 1}" loading="eager" decoding="async" onload="if(this.naturalWidth&&this.naturalHeight)this.style.setProperty('--ar',this.naturalWidth+'/'+this.naturalHeight)">
                </button>
            </div>
        </div>`;
    }).join('')
    : [
        { x: 22, y: 4, rot: -7, z: 10, label: 'slot 1' },
        { x: 50, y: 0, rot: 2, z: 25, label: 'segera hadir' },
        { x: 78, y: 4, rot: 7, z: 12, label: 'slot 2' }
    ].map((ph, i) => `
        <div class="pol-pos" style="left:${ph.x}%;top:${ph.y}%;z-index:${ph.z}">
            <div class="pol" style="--enter:${enterPol};animation-delay:${(i * 0.12).toFixed(2)}s">
                <div class="pol-in" style="--rot:${ph.rot}deg;cursor:default">
                    <div class="pol-empty">
                        <div>
                            <span>${i === 1 ? (d.emoji || '✨') : '📸'}</span>
                            <small>${ph.label}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Konten yang dirender HANYA foto dan kertas pesan
    $('#division-content').innerHTML = `
        <div class="pol-stage">${pols}</div>
        <article class="paper div-paper" style="--enter:${enterPaper};--tilt:${rand(-.8, .8).toFixed(2)}deg">
            <div class="tape" style="left:50%;top:-14px;transform:translateX(-50%) rotate(${rand(-3, 3).toFixed(1)}deg)"></div>
            <p class="p-label rv" style="--i:1">Untuk ${d.name}</p>
            ${para([].concat(d.message), 2)}
            <div class="div-closing rv" style="--i:${[].concat(d.message).length + 3}">${d.closing || ''}</div>
            <div class="paper-actions rv" style="--i:${[].concat(d.message).length + 4}">
                <button class="btn-share-story" data-div="${divIdx}" aria-label="Share Story 9:16">
                    <span>📸</span>
                    <span>Bagikan Story (9:16)</span>
                    <span>✨</span>
                </button>
            </div>
        </article>`;

    $('#division-content').onclick = e => {
        const shareBtn = e.target.closest('.btn-share-story');
        if (shareBtn) {
            storyModal.open(divIdx, photos);
            return;
        }
        const b = e.target.closest('.pol-in[data-i]');
        if (b) lightbox.open(photos, +b.dataset.i, d.name);
    };
}

function changeDivision(step) {
    const next = divIdx + step;
    if (next < 0) return goTo('view-message');
    if (next >= DIVS.length) return goTo('view-closing');
    if (busy) return;
    busy = true;

    const box = $('#division-content');
    // Transisi halus in-place (tidak ada pergeseran horizontal yang menggeser background/viewport)
    box.style.transition = 'transform .22s cubic-bezier(.4, 0, .2, 1), opacity .20s ease';
    box.style.transform = `translateY(${step > 0 ? '12px' : '-12px'}) scale(.97)`;
    box.style.opacity = '0';

    setTimeout(() => {
        divIdx = next;
        renderDivision();
        box.style.transition = 'none';
        box.style.transform = `translateY(${step > 0 ? '-12px' : '12px'}) scale(.97)`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            box.style.transition = 'transform .35s cubic-bezier(.16, 1, .3, 1), opacity .30s ease';
            box.style.transform = 'none';
            box.style.opacity = '1';
            busy = false;
        }));
    }, 220);
}

/* ================= LIGHTBOX ================= */
const lightbox = (() => {
    const box = $('#lightbox'), img = $('#lb-img'), cap = $('#lb-cap');
    let list = [], i = 0, title = '', x0 = null;
    const show = () => {
        img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
        img.src = list[i]; cap.textContent = `${title} · ${i + 1}/${list.length}`;
    };
    const step = d => { i = (i + d + list.length) % list.length; show(); };
    const close = () => { box.hidden = true; };
    $('.lb-close').onclick = close;
    $('.lb-prev').onclick = () => step(-1);
    $('.lb-next').onclick = () => step(1);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
    addEventListener('keydown', e => {
        if (box.hidden) return;
        if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
    });
    return { open(l, idx, t) { list = l; i = idx; title = t; box.hidden = false; show(); } };
})();

/* ================= MODAL & GENERATOR STORY CARD 9:16 ================= */
const storyModal = (() => {
    const modal = $('#share-modal');
    if (!modal) return { open() {} };

    const loading = $('#share-loading');
    const previewImg = $('#share-preview-img');
    const btnDownload = $('#btn-download-story');
    const btnNative = $('#btn-native-share');
    const btnClose = $('.share-modal-close');
    const backdrop = $('.share-modal-backdrop');

    let currentBlob = null;
    let currentDataUrl = null;
    let currentDivisionName = '';

    const close = () => { modal.hidden = true; };
    if (btnClose) btnClose.onclick = close;
    if (backdrop) backdrop.onclick = close;
    addEventListener('keydown', e => { if (!modal.hidden && e.key === 'Escape') close(); });

    function wrapLines(ctx, text, maxWidth) {
        const words = text.split(/\s+/);
        const lines = [];
        let cur = '';
        for (const w of words) {
            const test = cur ? cur + ' ' + w : w;
            if (ctx.measureText(test).width > maxWidth && cur) {
                lines.push(cur);
                cur = w;
            } else {
                cur = test;
            }
        }
        if (cur) lines.push(cur);
        return lines;
    }

    function loadImageHelper(src) {
        return new Promise(res => {
            if (!src) return res(null);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => res(img);
            img.onerror = () => res(null);
            img.src = src;
        });
    }

    async function drawStory(d, photos) {
        const W = 1080, H = 1920;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const g = cv.getContext('2d');

        // Pastikan Google Fonts sudah ter-render sempurna
        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (e) {}
        }

        // Muat logo & foto
        const [logoBw, logoHo, heroPhoto] = await Promise.all([
            loadImageHelper('images/header-img/BW LOGO ORIGINAL.png'),
            loadImageHelper('images/header-img/HANGOUT LOGO.png'),
            photos && photos.length ? loadImageHelper(photos[0]) : null
        ]);

        // 1. Background gradient kosmik
        const bgGrad = g.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#130528');
        bgGrad.addColorStop(0.35, '#260e4c');
        bgGrad.addColorStop(0.7, '#180733');
        bgGrad.addColorStop(1, '#0d021c');
        g.fillStyle = bgGrad;
        g.fillRect(0, 0, W, H);

        // 2. Pancaran sinar keemasan (sunburst rays dari x: 540, y: 520)
        g.save();
        g.translate(540, 520);
        for (let i = 0; i < 36; i++) {
            g.beginPath();
            g.moveTo(0, 0);
            const a1 = (i * 10) * Math.PI / 180;
            const a2 = (i * 10 + 4.2) * Math.PI / 180;
            g.arc(0, 0, 1600, a1, a2);
            g.closePath();
            g.fillStyle = 'rgba(255, 215, 120, 0.05)';
            g.fill();
        }
        g.restore();

        // 3. Inti cahaya emas radial (golden core glow)
        const core = g.createRadialGradient(540, 520, 40, 540, 520, 650);
        core.addColorStop(0, 'rgba(255, 225, 130, 0.28)');
        core.addColorStop(0.45, 'rgba(245, 185, 50, 0.10)');
        core.addColorStop(1, 'rgba(245, 185, 50, 0)');
        g.fillStyle = core;
        g.fillRect(0, 0, W, H);

        // 4. Bintang-bintang emas berkelip
        const stars = [
            [120, 180, 14], [940, 160, 18], [160, 480, 20], [920, 520, 16],
            [90, 880, 14], [970, 930, 22], [140, 1720, 18], [930, 1750, 20],
            [320, 310, 12], [760, 320, 12], [220, 780, 15], [860, 790, 15]
        ];
        g.fillStyle = '#fff4ba';
        for (const [sx, sy, sz] of stars) {
            g.save();
            g.translate(sx, sy);
            g.shadowColor = '#ffc83b';
            g.shadowBlur = 12;
            g.beginPath();
            g.moveTo(0, -sz);
            g.quadraticCurveTo(sz * 0.1, -sz * 0.1, sz, 0);
            g.quadraticCurveTo(sz * 0.1, sz * 0.1, 0, sz);
            g.quadraticCurveTo(-sz * 0.1, sz * 0.1, -sz, 0);
            g.quadraticCurveTo(-sz * 0.1, -sz * 0.1, 0, -sz);
            g.fill();
            g.restore();
        }

        // 5. Header Capsule: Logo BW & Hangout (y: 80, h: 80)
        const pillW = 280, pillH = 80, pillX = (W - pillW) / 2, pillY = 80;
        g.save();
        g.beginPath();
        g.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
        g.fillStyle = 'rgba(24, 10, 52, 0.88)';
        g.fill();
        g.lineWidth = 1.8;
        g.strokeStyle = 'rgba(245, 196, 81, 0.65)';
        g.shadowColor = 'rgba(245, 196, 81, 0.35)';
        g.shadowBlur = 16;
        g.stroke();
        g.restore();

        const logoSize = 56;
        const logoGap = 40;
        const totalLogoW = logoSize * 2 + logoGap;
        const startX = (W - totalLogoW) / 2;
        const logoY = pillY + (pillH - logoSize) / 2;

        if (logoBw) {
            g.drawImage(logoBw, startX, logoY, logoSize, logoSize);
        }

        g.font = '22px serif';
        g.fillStyle = 'rgba(245, 196, 81, 0.75)';
        g.textAlign = 'center';
        g.fillText('✕', startX + logoSize + logoGap / 2, logoY + logoSize / 2 + 7);

        if (logoHo) {
            g.drawImage(logoHo, startX + logoSize + logoGap, logoY, logoSize, logoSize);
        }

        // 6. Header Event Title
        g.textAlign = 'center';
        g.font = '700 24px "Playfair Display", serif';
        g.fillStyle = '#f5c451';
        g.fillText('✦ HANGOUT 10 · MEMORY JOURNAL ✦', 540, 205);

        const goldGrad = g.createLinearGradient(200, 0, 880, 0);
        goldGrad.addColorStop(0, '#fcedc7');
        goldGrad.addColorStop(0.5, '#f5c451');
        goldGrad.addColorStop(1, '#ffdf88');

        g.font = 'italic 800 46px "Playfair Display", serif';
        g.fillStyle = goldGrad;
        g.shadowColor = 'rgba(245, 196, 81, 0.4)';
        g.shadowBlur = 18;
        g.fillText('A Glimpse of Our Journey Together', 540, 268);
        g.shadowBlur = 0;

        // 7. Divisi Badge & Judul
        g.font = '54px serif';
        g.fillText(d.emoji || '✨', 540, 348);

        g.font = '800 62px "Playfair Display", serif';
        g.fillStyle = goldGrad;
        g.shadowColor = 'rgba(245, 196, 81, 0.5)';
        g.shadowBlur = 20;
        g.fillText(d.name, 540, 424);
        g.shadowBlur = 0;

        if (d.tagline) {
            g.font = '28px "Patrick Hand", cursive';
            g.fillStyle = '#ffe8a3';
            g.fillText(d.tagline, 540, 468);
        }

        // 8. Polaroid Frame Cantik (y: 505 - 890)
        const pw = 400, ph = 390;
        g.save();
        g.translate(540, 680);
        g.rotate(-2.2 * Math.PI / 180);
        g.shadowColor = 'rgba(8, 2, 24, 0.65)';
        g.shadowBlur = 32;
        g.shadowOffsetY = 14;

        // Kartu kertas polaroid krem
        g.fillStyle = '#f7ecd2';
        g.beginPath();
        g.roundRect(-pw / 2, -ph / 2, pw, ph, 8);
        g.fill();
        g.shadowColor = 'transparent';
        g.lineWidth = 1.2;
        g.strokeStyle = 'rgba(245, 196, 81, 0.5)';
        g.stroke();

        // Area Foto di dalam polaroid (w: 360, h: 295)
        const imgBoxW = 360, imgBoxH = 295;
        const imgBoxX = -imgBoxW / 2, imgBoxY = -ph / 2 + 20;

        g.save();
        g.beginPath();
        g.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 4);
        g.clip();

        if (heroPhoto) {
            const pRatio = heroPhoto.naturalWidth / heroPhoto.naturalHeight;
            const bRatio = imgBoxW / imgBoxH;
            let dw = imgBoxW, dh = imgBoxH, dx = imgBoxX, dy = imgBoxY;
            if (pRatio > bRatio) {
                dw = imgBoxH * pRatio;
                dx = imgBoxX - (dw - imgBoxW) / 2;
            } else {
                dh = imgBoxW / pRatio;
                dy = imgBoxY - (dh - imgBoxH) / 2;
            }
            g.drawImage(heroPhoto, dx, dy, dw, dh);
        } else {
            const polGrad = g.createLinearGradient(imgBoxX, imgBoxY, imgBoxX + imgBoxW, imgBoxY + imgBoxH);
            polGrad.addColorStop(0, '#2b1254');
            polGrad.addColorStop(1, '#1b0936');
            g.fillStyle = polGrad;
            g.fillRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);

            g.font = '68px serif';
            g.textAlign = 'center';
            g.fillText(d.emoji || '📸', 0, imgBoxY + 120);

            g.font = '28px "Patrick Hand", cursive';
            g.fillStyle = '#f5c451';
            g.fillText('Momen Tak Terlupakan', 0, imgBoxY + 175);

            g.font = '22px "Patrick Hand", cursive';
            g.fillStyle = '#e8d2a6';
            g.fillText('HO10 · Hangout x BW', 0, imgBoxY + 215);
        }
        g.restore();

        // Tulisan di bawah foto polaroid (chin)
        g.font = '600 28px "Caveat", cursive';
        g.fillStyle = '#422415';
        g.textAlign = 'center';
        g.fillText(`${d.name} · Memories`, 0, ph / 2 - 24);
        g.restore();

        // 9. Kertas Memo Pesan (y: 920 - 1700)
        const paperW = 920, paperH = 750, paperX = (W - paperW) / 2, paperY = 925;
        g.save();
        g.shadowColor = 'rgba(8, 2, 24, 0.65)';
        g.shadowBlur = 35;
        g.shadowOffsetY = 16;

        g.beginPath();
        g.roundRect(paperX, paperY, paperW, paperH, 20);
        const pGrad = g.createLinearGradient(paperX, paperY, paperX + paperW, paperY + paperH);
        pGrad.addColorStop(0, '#240f44');
        pGrad.addColorStop(1, '#17062e');
        g.fillStyle = pGrad;
        g.fill();

        g.shadowColor = 'transparent';
        g.lineWidth = 1.5;
        g.strokeStyle = 'rgba(245, 196, 81, 0.42)';
        g.stroke();

        // Masking tape emas di tengah atas memo
        g.save();
        g.translate(540, paperY);
        g.rotate(-1.5 * Math.PI / 180);
        g.fillStyle = 'rgba(245, 196, 81, 0.32)';
        g.fillRect(-65, -16, 130, 32);
        g.strokeStyle = 'rgba(245, 196, 81, 0.48)';
        g.strokeRect(-65, -16, 130, 32);
        g.restore();

        // Garis-garis ruled berbaris halus
        g.strokeStyle = 'rgba(245, 196, 81, 0.12)';
        g.lineWidth = 1;
        for (let ly = paperY + 110; ly < paperY + paperH - 120; ly += 42) {
            g.beginPath();
            g.moveTo(paperX + 45, ly);
            g.lineTo(paperX + paperW - 45, ly);
            g.stroke();
        }

        // Label memo
        g.textAlign = 'left';
        g.font = '700 24px "Playfair Display", serif';
        g.fillStyle = '#f5c451';
        g.fillText(`SEBUAH PESAN UNTUK ${d.name.toUpperCase()}`, paperX + 55, paperY + 70);

        // Garis batas label
        g.strokeStyle = 'rgba(245, 196, 81, 0.35)';
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(paperX + 55, paperY + 86);
        g.lineTo(paperX + paperW - 55, paperY + 86);
        g.stroke();

        // Teks pesan (Paragraf demi paragraf)
        const msgList = [].concat(d.message);
        const maxTextW = paperW - 110;
        let textY = paperY + 140;
        const fontSize = msgList.length > 3 ? 28 : 31;
        const lineH = fontSize + 16;
        g.font = `${fontSize}px "Patrick Hand", cursive`;
        g.fillStyle = '#fff4db';

        for (const p of msgList) {
            const clean = p.replace(/<[^>]+>/g, '');
            const pLines = wrapLines(g, clean, maxTextW);
            for (const l of pLines) {
                if (textY < paperY + paperH - 170) {
                    g.fillText(l, paperX + 55, textY);
                    textY += lineH;
                }
            }
            textY += 12; // spasi antar paragraf
        }

        // Garis pemisah sebelum penutup memo
        const footLineY = paperY + paperH - 130;
        g.strokeStyle = 'rgba(245, 196, 81, 0.28)';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(paperX + 55, footLineY);
        g.lineTo(paperX + paperW - 55, footLineY);
        g.stroke();

        // Closing & Signature
        if (d.closing) {
            g.font = 'italic 26px "Patrick Hand", cursive';
            g.fillStyle = '#ffd875';
            g.textAlign = 'left';
            g.fillText(d.closing, paperX + 55, footLineY + 40);
        }

        g.textAlign = 'right';
        g.font = '600 36px "Caveat", cursive';
        g.fillStyle = '#ffe8a3';
        g.fillText('Salam hangat, Epid ✨', paperX + paperW - 55, footLineY + 80);
        g.font = '22px "Patrick Hand", cursive';
        g.fillStyle = '#f5c451';
        g.fillText('PIC Dokumentasi', paperX + paperW - 55, footLineY + 110);

        g.restore();

        // 10. Footer (y: 1720 - 1880)
        g.textAlign = 'center';
        g.font = '700 26px "Playfair Display", serif';
        g.fillStyle = 'rgba(245, 196, 81, 0.95)';
        g.fillText('✦ Hangout Buddhist Worship ✦', 540, 1782);

        g.font = 'italic 30px "Playfair Display", serif';
        g.fillStyle = '#fff2cb';
        g.fillText('"A Journey Together"', 540, 1828);

        return new Promise(resolve => {
            cv.toBlob(blob => {
                const dataUrl = cv.toDataURL('image/png');
                resolve({ blob, dataUrl });
            }, 'image/png', 0.95);
        });
    }

    async function open(idx, photos) {
        modal.hidden = false;
        loading.hidden = false;
        previewImg.hidden = true;
        btnDownload.disabled = true;
        btnNative.hidden = true;

        const d = DIVS[idx];
        currentDivisionName = d ? d.name.replace(/[^a-zA-Z0-9]/g, '-') : 'Divisi';

        try {
            const { blob, dataUrl } = await drawStory(d, photos);
            currentBlob = blob;
            currentDataUrl = dataUrl;

            previewImg.src = dataUrl;
            previewImg.hidden = false;
            loading.hidden = true;
            btnDownload.disabled = false;

            // Periksa dukungan Web Share API untuk file foto
            if (navigator.canShare && blob) {
                const testFile = new File([blob], `HO10-${currentDivisionName}-Story.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [testFile] })) {
                    btnNative.hidden = false;
                }
            }
        } catch (err) {
            console.error('Error generating story card:', err);
            loading.innerHTML = `<p style="color:#ff8080">Gagal membuat story card.<br>${err.message}</p>`;
        }
    }

    btnDownload.onclick = () => {
        if (!currentDataUrl) return;
        const a = document.createElement('a');
        a.href = currentDataUrl;
        a.download = `HO10-${currentDivisionName}-Story.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast();
        $('#toast').textContent = 'Foto Story 9:16 berhasil diunduh! 📸✨';
    };

    btnNative.onclick = async () => {
        if (!currentBlob) return;
        try {
            const file = new File([currentBlob], `HO10-${currentDivisionName}-Story.png`, { type: 'image/png' });
            await navigator.share({
                title: `A Golden Appreciation Letter - ${currentDivisionName}`,
                text: `Pesan apresiasi untuk ${currentDivisionName} di HO10 ✨`,
                files: [file]
            });
        } catch (e) {
            if (e.name !== 'AbortError') console.error('Share error:', e);
        }
    };

    return { open };
})();

/* ================= UTIL ================= */
function toast() {
    const t = $('#toast'); t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
}
function copyDrive() {
    const done = () => toast();
    if (navigator.clipboard && isSecureContext) return navigator.clipboard.writeText(CONFIG.driveLink).then(done);
    const ta = Object.assign(document.createElement('textarea'), { value: CONFIG.driveLink });
    ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { console.error(e); }
    ta.remove();
}

/* ================= AUDIO (AUTOPLAY LOOP TANPA TOMBOL NAVIGASI) ================= */
const audio = (() => {
    const a = $('#bg-music');
    if (!a) return { start() {} };
    a.loop = true;

    let isPlaying = false;
    let chosenSrc = null;

    async function pickAudioSource() {
        const candidates = [
            CONFIG.audioUrl,
            'audio/bgaudio.ogg',
            'audio/bgaudio.mp3',
            'audio/bgm.ogg',
            'audio/bgm.mp3',
            'audio/lagu.mp3',
            'audio/music.mp3',
            'audio/song.mp3',
            'audio/backsound.mp3',
            'audio/audio.mp3',
            'audio/bgm.m4a',
            'audio/bgm.wav',
            'audio/bgm.aac',
            'audio/bgm.ogg'
        ].filter(Boolean);

        const unique = [...new Set(candidates)];
        for (const url of unique) {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) { chosenSrc = url; break; }
            } catch (e) {}
        }
        if (!chosenSrc && unique.length) chosenSrc = unique[0];
        if (chosenSrc) {
            a.src = chosenSrc;
            a.load();
        }
    }

    const playSafe = () => {
        if (!a.src && chosenSrc) a.src = chosenSrc;
        if (!a.src || isPlaying) return;
        a.play().then(() => {
            isPlaying = true;
            ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(ev => {
                document.removeEventListener(ev, playSafe);
            });
        }).catch(() => {
            // Autoplay ditahan sementara oleh browser hingga gestur sentuhan pertama
        });
    };

    // Jalankan deteksi sumber dan coba autoplay dari awal
    pickAudioSource().then(() => {
        playSafe();
    });

    // Menjamin musik otomatis menyala pada sentuhan/klik pertama di mana saja di layar
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(ev => {
        document.addEventListener(ev, playSafe, { passive: true });
    });

    return {
        start() {
            playSafe();
        }
    };
})();

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', async () => {
    const e = CONFIG.epid;
    $('#sign-name').textContent = e.name; // teks cover (untuk Semua Tim) diatur langsung di index.html
    const av = $('.avatar'); if (av) av.dataset.initial = (e.name || '?')[0];
    const ph = $('#epid-photo'); if (ph) { ph.onerror = () => ph.remove(); ph.src = e.photo; }
    $('#link-drive-btn').href = CONFIG.driveLink;

    $('#intro-text').innerHTML = para(CONFIG.intro, 1);
    $('#closing-text').innerHTML = para(CONFIG.closing, 1);

    (CONFIG.coverPhotos || []).forEach(async (src, i) => {
        const box = $(`.cover-pol-${i + 1}`);
        if (!box) return;
        let finalSrc = null;
        if (await canLoad(src)) finalSrc = src;
        else if (await canLoad(src.replace(/\.webp$/, '.jpg'))) finalSrc = src.replace(/\.webp$/, '.jpg');
        else if (await canLoad(src.replace(/\.webp$/, '.png'))) finalSrc = src.replace(/\.webp$/, '.png');
        if (finalSrc) { box.querySelector('img').src = finalSrc; box.hidden = false; }
    });

    $('#btn-open').onclick = () => { audio.start(); goTo('view-message'); };
    $('#btn-start').onclick = () => { divIdx = 0; renderDivision(); goTo('view-division'); };
    $('#btn-prev').onclick = () => changeDivision(-1);
    $('#btn-next').onclick = () => changeDivision(1);
    $('#btn-to-drive').onclick = () => goTo('view-drive');
    $('#btn-copy').onclick = copyDrive;

    // prioritaskan foto divisi pertama agar slideshow langsung siap
    validOnly(DIVS[0].photos || []);
});
