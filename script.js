// ============ CONFETTI ============
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const COLORS = ['#ff3d71', '#ffd447', '#4dff88', '#36b3ff', '#b97cf0', '#ff8c42', '#fff'];
const confetti = [];

function makeConfetti(x, y, n) {
  for (let i = 0; i < n; i++) {
    confetti.push({
      x: x !== undefined ? x : Math.random() * W,
      y: y !== undefined ? y : -20,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 14,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, W, H);
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx; c.y += c.vy;
    c.vy += 0.04;
    c.rot += c.vr;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
    if (c.y > H + 40 || c.x < -40 || c.x > W + 40) confetti.splice(i, 1);
  }
  if (confetti.length < 140) makeConfetti(undefined, undefined, 2);
  requestAnimationFrame(drawConfetti);
}
drawConfetti();
setTimeout(() => makeConfetti(W / 2, 60, 90), 400);

function bigBurst(x, y) { makeConfetti(x, y, 120); }

// ============ CANDLES ============
const candles = document.querySelectorAll('.candle');
candles.forEach(c => c.addEventListener('click', () => {
  if (c.classList.contains('out')) return;
  c.classList.add('out');
  const rect = c.getBoundingClientRect();
  bigBurst(rect.left + rect.width / 2, rect.top);
  if (candles.every(x => x.classList.contains('out'))) {
    setTimeout(() => { const h = document.getElementById('unmuteHint'); if (h) h.textContent = 'Sab candles bujh gayi! Wish karo! 🙏✨'; }, 300);
    bigBurst(W / 2, H / 2);
  }
}));

// ============ BACKGROUND MUSIC (a.mp3, looped) ============
const bgmusic = document.getElementById('bgmusic');

function setStatus(msg) {
  const el = document.getElementById('musicStatus');
  if (el) el.textContent = msg;
}

function enableSound() {
  if (!bgmusic) return;
  bgmusic.muted = false;
  bgmusic.volume = 1;
  const p = bgmusic.play();
  if (p && typeof p.then === 'function') p.catch(() => {});
  setStatus('🔊 Music on!');
}

function startMusic() {
  if (!bgmusic) return;
  bgmusic.loop = true;
  bgmusic.volume = 1;

  // 1) Try real autoplay WITH sound on page load.
  //    Succeeds in browsers where autoplay is allowed (e.g. some file://
  //    setups, Opera, Brave, or sites the user allowed autoplay for).
  const p = bgmusic.play();
  if (p && typeof p.then === 'function') {
    p.then(() => setStatus('🔊 Music on!')).catch(() => {
      // 2) Blocked by browser policy → play muted (always allowed) and
      //    enable sound the moment the user interacts anywhere.
      bgmusic.muted = true;
      bgmusic.play().then(() => setStatus('🔇 Tap anywhere for sound')).catch(() => {});
      document.addEventListener('pointerdown', enableSound);
      document.addEventListener('keydown', enableSound);
    });
  } else {
    setStatus('🔊 Music on!');
  }
}
startMusic();

bgmusic.addEventListener('ended', () => {
  bgmusic.currentTime = 0;
  enableSound();
});