'use strict';

const PASSWORD = 'iloveyouinay';
let current = 'gate';
let envOpened = false;
let currentReason = 0;

const REASONS = [
    "You always know how to make everything better.",
    "Your hugs feel like home — no matter where I am.",
    "You taught me to be kind, even when it's hard.",
    "You never gave up on me, not even once.",
    "Your cooking is the best thing in the world.",
    "You make ordinary days feel special.",
    "You always put everyone else before yourself.",
    "Your laugh is my favorite sound.",
    "You believed in me before I believed in myself.",
    "You showed me what real strength looks like.",
    "You make the world a better place just by being you.",
    "I am who I am because of your love."
];

const STICKER_BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest/';
const REASON_ICONS = [
    STICKER_BASE + '1f496/512.png',
    STICKER_BASE + '1f338/512.png',
    STICKER_BASE + '1f495/512.png',
    STICKER_BASE + '1f970/512.png',
    STICKER_BASE + '1f337/512.png',
    STICKER_BASE + '2728/512.png',
    STICKER_BASE + '1f497/512.png',
    STICKER_BASE + '1f98b/512.png',
    STICKER_BASE + '1f49d/512.png',
    STICKER_BASE + '1f490/512.png',
    STICKER_BASE + '1f33a/512.png',
    STICKER_BASE + '2764_fe0f/512.png'
];

const el = {
    gate: document.getElementById('gate'),
    tree: document.getElementById('tree-scene'),
    letter: document.getElementById('letter-scene'),
    gallery: document.getElementById('gallery-scene'),
    video: document.getElementById('video-scene'),
    reasons: document.getElementById('reasons-scene'),
};

/* ── SECTION TRANSITIONS ── */
function showSection(id) {
    if (id === current) return;
    const prev = el[current];
    const next = el[id];
    prev.classList.remove('active');
    prev.classList.add('exiting');
    setTimeout(() => prev.classList.remove('exiting'), 450);
    next.classList.add('active');
    current = id;

    if (id !== 'video') {
        const vid = document.getElementById('momVideo');
        if (vid && !vid.paused) vid.pause();
    }
}

function openSection(id) {
    showSection(id);
    if (id === 'gallery') resetGalleryAnimation();
    if (id === 'letter') closeEnvelope(true);
    if (id === 'reasons') showReason(currentReason);
}

function goBack() {
    const overlay = document.getElementById('letterOverlay');
    if (overlay && overlay.classList.contains('open')) {
        closeEnvelope();
        return;
    }
    showSection('tree');
}

/* ── PASSWORD ── */
function checkPassword() {
    const input = document.getElementById('pwInput');
    const err = document.getElementById('pwError');
    if (input.value.trim().toLowerCase() === PASSWORD) {
        err.classList.remove('show');
        input.style.background = 'rgba(212, 80, 100, .1)';
        launchConfetti();
        setTimeout(() => {
            showSection('tree');
            animateHearts();
        }, 380);
    } else {
        err.classList.add('show');
        input.style.animation = 'none';
        void input.offsetWidth;
        input.style.animation = 'shake .4s ease';
        input.value = '';
        setTimeout(() => { input.style.animation = ''; err.classList.remove('show'); }, 2400);
        input.focus();
    }
}

document.getElementById('pwInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
});

/* ── PASSWORD TOGGLE (SVG icons) ── */
function togglePassword() {
    const input = document.getElementById('pwInput');
    const svg = document.getElementById('pwEyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        input.type = 'password';
        svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

/* ── HEARTS ANIMATION ── */
function animateHearts() {
    const cards = document.querySelectorAll('.heart-card');
    cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 200);
        setTimeout(() => card.classList.add('beating'), 700 + i * 200);
    });
}

/* ── REASONS I LOVE YOU ── */
function showReason(index) {
    const card = document.getElementById('reasonsCard');
    const text = document.getElementById('reasonText');
    const num = document.getElementById('reasonNum');
    const icon = document.querySelector('.reason-icon');
    const total = document.getElementById('reasonTotal');
    if (!card || !text) return;

    total.textContent = REASONS.length;
    card.classList.add('switching');

    setTimeout(() => {
        text.textContent = REASONS[index];
        icon.innerHTML = '<img src="' + REASON_ICONS[index] + '" alt="sticker" class="sticker-img" />';
        num.textContent = index + 1;
        card.classList.remove('switching');
    }, 250);
}

function nextReason() {
    currentReason = (currentReason + 1) % REASONS.length;
    showReason(currentReason);
}

function prevReason() {
    currentReason = (currentReason - 1 + REASONS.length) % REASONS.length;
    showReason(currentReason);
}

function shuffleReason() {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * REASONS.length); }
    while (newIndex === currentReason && REASONS.length > 1);
    currentReason = newIndex;
    showReason(currentReason);
}

/* ── ENVELOPE / LETTER OVERLAY ── */
function buildLetterOverlay() {
    if (document.getElementById('letterOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'letterOverlay';
    overlay.className = 'letter-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Letter from the heart');
    overlay.innerHTML = `
    <div class="letter-overlay-close">
      <button class="letter-close-btn" onclick="closeEnvelope()" aria-label="Close letter">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M19 12H5M11 6l-6 6 6 6"/>
        </svg>
        Close the letter
      </button>
    </div>
    <div class="letter-overlay-body">
      <div class="letter-content">
        <p class="letter-greeting">Happy Mother’s day, Inay! </p>
        <p>Maraming salamat sa lahat-lahat ng sakripisyo na iyong ginawa para sa amin. Maraming salamat sa hindi pagsuko sa lahat ng bagay na nararanasan natin ng ating pamilya—sa mga pagsubok man o kasiyahan ay lagi kang nandiyan.</p>
        <p>Maraming salamat sa walang sawang pagmamahal at pag-aaruga mo sa amin, at sa pagmamahal na iyong ibinibigay.</p>
        <p>Nawa’y patuloy kang gamitin ng ating Panginoon upang Siya’y papurihan, at nawa’y patuloy ka ring gabayan at pagkaingatan ng ating Panginoon. God bless you always at mahal na mahal ka namin.</p>
        <p class="letter-sign">
          With all our Love,<br/>
          <em>-Bunso <3</em>
        </p>
        <p class="spacemen">
                                                         gahaahahhahahahahhahahahahahahahahahahahahah  
        </p>
      </div>
    </div>
    <div class="letter-swipe-hint" aria-hidden="true">
      <div class="swipe-bar"></div>
      <span>scroll to read</span>
    </div>`;
    document.body.appendChild(overlay);
}

function openEnvelope() {
    if (envOpened) return;
    envOpened = true;
    buildLetterOverlay();
    const envelope = document.getElementById('envelope');
    if (envelope) envelope.classList.add('opened');
    const openBtn = document.getElementById('openEnvBtn');
    if (openBtn) openBtn.classList.add('hidden');
    setTimeout(() => {
        const overlay = document.getElementById('letterOverlay');
        if (overlay) overlay.classList.add('open');
    }, 650);
    const music = document.getElementById('envMusic');
    if (music) { music.currentTime = 0; music.play().catch(() => { }); }
    // Pause bg music when envelope opens
    if (musicPlaying) {
        musicPausedByEnvelope = true;
        const bgAudio = document.getElementById('bgMusic');
        if (bgAudio) bgAudio.pause();
    }
}

function closeEnvelope(silent) {
    envOpened = false;
    const overlay = document.getElementById('letterOverlay');
    if (overlay) overlay.classList.remove('open');
    const envelope = document.getElementById('envelope');
    if (envelope) envelope.classList.remove('opened');
    const openBtn = document.getElementById('openEnvBtn');
    if (openBtn) openBtn.classList.remove('hidden');
    if (!silent) {
        const music = document.getElementById('envMusic');
        if (music && !music.paused) {
            let vol = music.volume;
            const fade = setInterval(() => {
                vol -= 0.08;
                if (vol <= 0) { music.pause(); music.currentTime = 0; music.volume = 1; clearInterval(fade); }
                else music.volume = vol;
            }, 80);
        }
    }
    // Resume bg music if it was paused by envelope
    if (musicPausedByEnvelope) {
        musicPausedByEnvelope = false;
        const bgAudio = document.getElementById('bgMusic');
        if (bgAudio) {
            bgAudio.volume = BG_VOLUME;
            bgAudio.play().catch(() => { });
        }
    }
}

/* ── GALLERY ── */
function resetGalleryAnimation() {
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
    });
}

/* ── INJECTED KEYFRAMES ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(style);

/* ── MOTHER'S DAY COUNTDOWN ── */
function getMothersDayDate(year) {
    const may1 = new Date(year, 4, 1);
    const dayOfWeek = may1.getDay();
    const secondSunday = 1 + ((7 - dayOfWeek) % 7) + 7;
    return new Date(year, 4, secondSunday, 0, 0, 0);
}

function updateCountdown() {
    const wrap = document.getElementById('countdownWrap');
    if (!wrap) return;

    const now = new Date();
    const year = now.getFullYear();
    let mothersDay = getMothersDayDate(year);
    const mothersDayEnd = new Date(year, 4, mothersDay.getDate(), 23, 59, 59);

    // It's Mother's Day today — hide the whole timer
    if (now >= mothersDay && now <= mothersDayEnd) {
        wrap.classList.add('hidden');
        return;
    }

    // Already past Mother's Day this year
    if (now > mothersDayEnd) {
        mothersDay = getMothersDayDate(year + 1);
    }

    wrap.classList.remove('hidden');
    const diff = mothersDay - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── VIRTUAL HUG (text burst with stickers) ── */
const HUG_STICKERS = [
    STICKER_BASE + '1f496/512.png',
    STICKER_BASE + '2764_fe0f/512.png',
    STICKER_BASE + '1f917/512.png',
    STICKER_BASE + '1f338/512.png',
    STICKER_BASE + '1f495/512.png',
    STICKER_BASE + '1f970/512.png',
    STICKER_BASE + '1f49d/512.png',
    STICKER_BASE + '1f490/512.png'
];
const HUG_TEXTS = [
    'I love you, Inay!', 'Ikaw po ang da best in the world!', 'Love love',
    'Mahal kita!', 'You are my everything!', 'Best Inay ever!',
    'Salamat po sa lahat!', 'Love you forever!'
];
let hugCooldown = false;

function sendVirtualMessage() {
    if (hugCooldown) return;
    hugCooldown = true;
    setTimeout(() => { hugCooldown = false; }, 2200);

    const container = document.getElementById('hugContainer');
    if (!container) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const count = 16;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'hug-heart';
        if (i % 2 === 0) {
            heart.innerHTML = '<img src="' + HUG_STICKERS[i % HUG_STICKERS.length] + '" class="hug-sticker" /> ' + HUG_TEXTS[i % HUG_TEXTS.length];
        } else {
            heart.textContent = HUG_TEXTS[i % HUG_TEXTS.length];
        }

        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
        const dist = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 30;
        const rot = (Math.random() - 0.5) * 40;
        const dur = 1.5 + Math.random() * 1;

        heart.style.cssText = `
            left:${cx}px;top:${cy}px;
            --tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;--dur:${dur}s;
            animation-delay:${i * 0.06}s;
        `;

        container.appendChild(heart);
        setTimeout(() => heart.remove(), (dur + 0.8) * 4000);
    }
}

/* ── PHOTO LIGHTBOX ── */
function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    if (!lb || !img) return;
    img.src = src;
    if (cap) cap.textContent = caption || '';
    lb.classList.add('open');
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
}

// Attach click to gallery photos
document.querySelectorAll('.gallery-card .gc-inner img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = img.closest('.gallery-card');
        const caption = card ? card.querySelector('.gc-caption') : null;
        openLightbox(img.src, caption ? caption.textContent : '');
    });
});

// Close lightbox with Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

/* ── SPARKLE CURSOR TRAIL ── */
const SPARKLE_CHARS = ['✦', '✧', '♡', '❀', '✿', '⋆', '˚'];
let lastSparkle = 0;

function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkle < 60) return; // throttle
    lastSparkle = now;

    const dot = document.createElement('span');
    dot.className = 'sparkle-dot';
    dot.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.color = `hsl(${340 + Math.random() * 30}, 70%, ${60 + Math.random() * 20}%)`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
}

document.addEventListener('mousemove', e => createSparkle(e.clientX, e.clientY));
document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) createSparkle(t.clientX, t.clientY);
}, { passive: true });

/* ── CONFETTI CELEBRATION ── */
const CONFETTI_COLORS = ['#ff6b8a', '#D94060', '#F2C4CE', '#ff4466', '#ffb3c6', '#fff', '#c04060'];

function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    const count = 60;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const left = Math.random() * 100;
        const dur = 2 + Math.random() * 2;
        const delay = Math.random() * 0.8;
        const rot = (Math.random() - 0.5) * 720;
        const w = 6 + Math.random() * 8;
        const h = 4 + Math.random() * 6;
        piece.style.cssText = 'left:' + left + '%;width:' + w + 'px;height:' + h + 'px;background:' + color + ';--dur:' + dur + 's;--delay:' + delay + 's;--rot:' + rot + 'deg;';
        container.appendChild(piece);
        setTimeout(() => piece.remove(), (dur + delay + 0.5) * 1000);
    }
}

/* ── FLOATING LOVE QUOTES (with stickers) ── */
const LOVE_QUOTES = [
    { text: 'Mahal kita, Inay!', sticker: '1f496' },
    { text: 'Best Inay in the world!', sticker: '1f451' },
    { text: 'Salamat sa lahat!', sticker: '1f338' },
    { text: 'You are our everything', sticker: '2764_fe0f' },
    { text: 'Inay kayo po ang aming superhero', sticker: '1f9b8' },
    { text: 'Love you forever!', sticker: '1f495' },
    { text: 'Thank you, Inay!', sticker: '1f337' },
    { text: "World's best Nanay!", sticker: '1f490' }
];

function spawnFloatingQuote() {
    if (current !== 'tree') return;
    const q = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];
    const quote = document.createElement('div');
    quote.className = 'float-quote';
    quote.innerHTML = '<img src="' + STICKER_BASE + q.sticker + '/512.png" class="quote-sticker" /> ' + q.text;
    const x = 5 + Math.random() * 75;
    const y = 10 + Math.random() * 65;
    const dur = 3.5 + Math.random() * 2;
    quote.style.cssText = 'left:' + x + '%;top:' + y + '%;--dur:' + dur + 's;--delay:0s;';
    document.body.appendChild(quote);
    setTimeout(() => quote.remove(), dur * 1000);
}

setInterval(spawnFloatingQuote, 4000);

/* ── BACKGROUND MUSIC SYSTEM ── */
const PLAYLIST = ['assets/generalmusic.mp3', 'assets/music1.mp3', 'assets/music2.mp3'];
const BG_VOLUME = 0.25;          // default gentle volume
const BG_VOLUME_DUCKED = 0.08;   // volume when video is playing
let musicPlaying = false;
let currentTrack = 0;
let musicPausedByEnvelope = false;

function loadTrack(index) {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    currentTrack = index % PLAYLIST.length;
    audio.src = PLAYLIST[currentTrack];
    audio.volume = BG_VOLUME;
}

function playMusic() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    if (!audio.src || audio.src === '') loadTrack(0);
    audio.volume = BG_VOLUME;
    audio.play().catch(() => { });
    musicPlaying = true;
    const icon = document.getElementById('musicIcon');
    const btn = document.getElementById('musicToggle');
    if (icon) icon.src = STICKER_BASE + '1f3b6/512.png';
    if (btn) btn.classList.add('playing');
}

function pauseMusic() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    audio.pause();
    musicPlaying = false;
    const icon = document.getElementById('musicIcon');
    const btn = document.getElementById('musicToggle');
    if (icon) icon.src = STICKER_BASE + '1f507/512.png';
    if (btn) btn.classList.remove('playing');
}

function toggleMusic() {
    if (musicPlaying) {
        pauseMusic();
    } else {
        const audio = document.getElementById('bgMusic');
        if (!audio.src || audio.src === window.location.href) loadTrack(0);
        playMusic();
    }
}

// Auto-advance to next track when current one ends
(function initPlaylist() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    audio.volume = BG_VOLUME;
    loadTrack(0);
    audio.addEventListener('ended', () => {
        loadTrack(currentTrack + 1);
        if (musicPlaying) {
            audio.play().catch(() => { });
        }
    });
})();

/* ── VIDEO DUCK (reduce bg music when video plays) ── */
(function initVideoDuck() {
    const video = document.querySelector('video');
    const audio = document.getElementById('bgMusic');
    if (!video || !audio) return;

    video.addEventListener('play', () => {
        if (musicPlaying) audio.volume = BG_VOLUME_DUCKED;
    });
    video.addEventListener('pause', () => {
        if (musicPlaying) audio.volume = BG_VOLUME;
    });
    video.addEventListener('ended', () => {
        if (musicPlaying) audio.volume = BG_VOLUME;
    });
})();