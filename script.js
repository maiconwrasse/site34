/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — Complexo 34
═══════════════════════════════════════════════════════════ */

/* ── NAVBAR: frosted glass ao rolar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER / MENU MOBILE ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
function openMenu() {
  mobileMenu.style.display = 'flex';
  requestAnimationFrame(() => {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) mobileMenu.style.display = 'none';
  }, 400);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── HERO PARALLAX ── */
const heroContent = document.querySelector('.hero__content');
const glowL       = document.querySelector('.hero__glow-l');
const glowR       = document.querySelector('.hero__glow-r');

window.addEventListener('scroll', () => {
  const y = window.scrollY, h = window.innerHeight;
  if (y < h) {
    const f = y / h;
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * 0.20}px)`;
      heroContent.style.opacity   = `${1 - f * 1.5}`;
    }
    if (glowL) glowL.style.transform = `translateY(${y * 0.10}px)`;
    if (glowR) glowR.style.transform = `translateY(${-y * 0.07}px)`;
  }
}, { passive: true });

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── CARD TILT 3D (cards do Sobre) ── */
document.querySelectorAll('.card-unit').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── SERVICE BLOCK: iluminação dinâmica ao hover ── */
document.querySelectorAll('.srv-block').forEach(block => {
  block.addEventListener('mousemove', e => {
    const r = block.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    block.style.setProperty('--mx', `${x}%`);
    block.style.setProperty('--my', `${y}%`);
    block.style.backgroundImage =
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.025) 0%, transparent 60%),
       linear-gradient(transparent, transparent)`;
  });
  block.addEventListener('mouseleave', () => {
    block.style.backgroundImage = '';
  });
});

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});