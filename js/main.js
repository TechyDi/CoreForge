/* ============================================================
   CoreForge v3.0 — Main JavaScript
   Author : Dinesh Kumar Mohanta
   Updated: 2026
   ============================================================

   TABLE OF CONTENTS
   -----------------
   1.  EmailJS Configuration   ← EDIT HERE to enable live email
   2.  Futuristic Cursor
   3.  Spotlight Effect
   4.  Scroll Progress Bar + Nav Slim + Scroll-to-Top
   5.  Particle Canvas
   6.  Typing Animation
   7.  Scroll Reveal (IntersectionObserver)
   8.  3D Tilt on Project Cards
   9.  Certificate Slider
   10. Contact Form (EmailJS + mailto fallback)
   11. Nav Active State on Scroll
   ============================================================ */


/* ── 1. EMAILJS CONFIGURATION ────────────────────────────────────
   Sign up free at https://emailjs.com (200 emails/month)
   Then replace the three values below with your own credentials.
   In your EmailJS template use variables:
     {{from_name}}, {{from_email}}, {{subject}}, {{message}}
   ──────────────────────────────────────────────────────────── */
const EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

// Initialise EmailJS (safe — skips gracefully if SDK fails to load)
try {
  if (window.emailjs) emailjs.init({ publicKey: EJS_PUBLIC_KEY });
} catch (e) { /* EmailJS not loaded */ }


/* ── 2. FUTURISTIC CURSOR ────────────────────────────────────── */
const cc = document.getElementById('cc');   // crosshair element
const cr = document.getElementById('cr');   // outer ring
const cd = document.getElementById('cd');   // center dot

let mouseX = 0, mouseY = 0;   // live mouse position
let ringX  = 0, ringY  = 0;   // lerped ring position

// Snap crosshair + dot to cursor instantly
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cc.style.left = mouseX + 'px';
  cc.style.top  = mouseY + 'px';
  cd.style.left = mouseX + 'px';
  cd.style.top  = mouseY + 'px';
});

// Lag the ring slightly behind for depth effect (lerp)
(function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cr.style.left = ringX + 'px';
  cr.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Morph cursor on interactive elements
const HOVER_TARGETS = 'a, button, .proj-card, .cert-slide, .skill-card, .exp-card, .pill, .c-link, .edu-card, .float-card, .stag';
document.querySelectorAll(HOVER_TARGETS).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cc.classList.add('hov');
    cr.classList.add('hov');
    cd.classList.add('hov');
  });
  el.addEventListener('mouseleave', () => {
    cc.classList.remove('hov');
    cr.classList.remove('hov');
    cd.classList.remove('hov');
  });
});


/* ── 3. SPOTLIGHT EFFECT ─────────────────────────────────────── */
const spotlight = document.getElementById('spl');
document.addEventListener('mousemove', e => {
  spotlight.style.background =
    `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px,
     rgba(0,102,255,.05), transparent 70%)`;
});


/* ── 4. SCROLL PROGRESS BAR + NAV SLIM + SCROLL-TO-TOP ──────── */
const progressBar = document.getElementById('spb');
const nav         = document.getElementById('nav');
const toTopBtn    = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  const s = document.documentElement;
  // Progress bar width
  const scrolled = s.scrollTop / (s.scrollHeight - s.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
  // Compact nav + show scroll-to-top button after 80px
  if (window.scrollY > 80) {
    nav.classList.add('slim');
    toTopBtn.classList.add('vis');
  } else {
    nav.classList.remove('slim');
    toTopBtn.classList.remove('vis');
  }
});


/* ── 5. PARTICLE CANVAS ──────────────────────────────────────── */
const canvas = document.getElementById('bgc');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = innerWidth;
  H = canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

/** A single floating particle */
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .3;
    this.vy = (Math.random() - .5) * .3;
    this.a  = Math.random() * .22 + .05;  // opacity
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Reset if out of bounds
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    // Mouse repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.hypot(dx, dy);
    if (dist < 90) {
      this.x += dx / dist;
      this.y += dy / dist;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,240,255,${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 70; i++) particles.push(new Particle());
}
initParticles();

/** Draw connecting lines between nearby particles */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,240,255,${.07 * (1 - d / 130)})`;
        ctx.lineWidth   = .5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

(function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
})();


/* ── 6. TYPING ANIMATION ─────────────────────────────────────── */
// ── EDIT HERE: Change roles array to update the typed text ──
const ROLES = [
  'Java Backend Developer',
  'Swing GUI Engineer',
  'OOP & DSA Practitioner',
  'AI Explorer & Builder',
  'MNC-Ready Engineer',
];

let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = ROLES[roleIndex];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1800);   // pause at full string
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % ROLES.length;
    }
  }
  setTimeout(type, isDeleting ? 52 : 90);
}
type();


/* ── 7. SCROLL REVEAL ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('up');
      // Animate skill bars when the card scrolls into view
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.1 });

// Stagger delay: each element gets 0–0.35s based on its position mod 6
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 6) * 0.07 + 's';
  revealObserver.observe(el);
});


/* ── 8. 3D TILT ON PROJECT CARDS ─────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - .5) * 14;
    const y = -((e.clientY - rect.top)  / rect.height - .5) * 14;
    card.style.transform = `translateY(-10px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ── 9. CERTIFICATE SLIDER ───────────────────────────────────── */
const certTrack   = document.getElementById('certTrack');
const certSlides  = certTrack.querySelectorAll('.cert-slide');
const TOTAL       = certSlides.length;
const VISIBLE     = 3;     // cards visible at once
const SLIDE_W     = 320;   // card width (px) + gap
let currentIdx    = 0;

// Build dot navigation
const dotsContainer = document.getElementById('sliderDots');
const pageCount     = Math.ceil(TOTAL / VISIBLE);

for (let i = 0; i < pageCount; i++) {
  const dot = document.createElement('button');
  dot.className  = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
  dot.onclick    = () => goTo(i * VISIBLE);
  dotsContainer.appendChild(dot);
}

function updateDots() {
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === Math.floor(currentIdx / VISIBLE));
  });
}

function goTo(idx) {
  currentIdx = Math.max(0, Math.min(idx, TOTAL - VISIBLE));
  certTrack.style.transform = `translateX(-${currentIdx * SLIDE_W}px)`;
  updateDots();
}

document.getElementById('slPrev').onclick = () => goTo(currentIdx - 1);
document.getElementById('slNext').onclick = () => goTo(currentIdx + 1);

// Auto-advance every 3.5 s; pause on hover
let autoSlide = setInterval(() => {
  const next = currentIdx + 1 > TOTAL - VISIBLE ? 0 : currentIdx + 1;
  goTo(next);
}, 3500);

const sliderArea = certTrack.parentElement;
sliderArea.addEventListener('mouseenter', () => clearInterval(autoSlide));
sliderArea.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => {
    const next = currentIdx + 1 > TOTAL - VISIBLE ? 0 : currentIdx + 1;
    goTo(next);
  }, 3500);
});


/* ── 10. CONTACT FORM (EmailJS + mailto fallback) ────────────── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');

  // Build params from form fields
  const params = {
    from_name:  document.getElementById('cf_name').value,
    from_email: document.getElementById('cf_email').value,
    subject:    document.getElementById('cf_subject').value,
    message:    document.getElementById('cf_message').value,
    to_email:   'dineshkmohanta@gmail.com',
  };

  btn.classList.add('loading');

  try {
    if (EJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && window.emailjs) {
      // ── Live send via EmailJS ──
      await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, params);
      showResult(btn, 'ok', '✓ SENT TO DINESH!');
    } else {
      // ── Fallback: open default mail client ──
      const body = encodeURIComponent(
        `Name: ${params.from_name}\nEmail: ${params.from_email}\n\n${params.message}`
      );
      window.open(
        `mailto:dineshkmohanta@gmail.com?subject=${encodeURIComponent(params.subject)}&body=${body}`
      );
      showResult(btn, 'ok', '✓ EMAIL CLIENT OPENED!');
    }
    setTimeout(() => resetBtn(btn, this), 3500);
  } catch (err) {
    showResult(btn, 'err', '✗ ERROR — TRY EMAIL DIRECTLY');
    setTimeout(() => resetBtn(btn), 3500);
  }
});

function showResult(btn, state, text) {
  btn.classList.remove('loading');
  btn.classList.add(state);
  btn.querySelector('.stxt').style.display = 'flex';
  btn.querySelector('.stxt').textContent = text;
}
function resetBtn(btn, form) {
  btn.classList.remove('ok', 'err');
  btn.querySelector('.stxt').textContent = 'SEND MESSAGE ✦';
  if (form) form.reset();
}


/* ── 11. NAV ACTIVE STATE ON SCROLL ─────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 220) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--c1)' : '';
  });
});
