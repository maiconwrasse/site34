/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — Complexo 34
═══════════════════════════════════════════════════════════ */

/* ── NAVBAR: frosted glass ao rolar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── FIX VÍDEO MOBILE (iOS / Android) ── */
(function () {
  const video = document.querySelector('.hero__video');
  if (!video) return;
  // Garante atributos obrigatórios para autoplay no iOS
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.muted = true;
  const tryPlay = () => {
    const p = video.play();
    if (p !== undefined) {
      p.catch(() => {
        // Se bloqueado, tenta novamente no primeiro toque/scroll
        const unlock = () => { video.play(); document.removeEventListener('touchstart', unlock); window.removeEventListener('scroll', unlock); };
        document.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('scroll', unlock, { once: true, passive: true });
      });
    }
  };
  if (document.readyState === 'complete') { tryPlay(); }
  else { window.addEventListener('load', tryPlay, { once: true }); }
})();

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
// Fecha o menu ao tocar em área vazia (fora dos links)
mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });

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
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
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

/* ── WA CARDS: iluminação dinâmica ao hover ── */
document.querySelectorAll('.wa-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    const glow = card.querySelector('.wa-card__glow');
    if (glow) {
      glow.style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${
          card.classList.contains('wa-card--blue')
            ? 'rgba(65,121,196,.25)'
            : 'rgba(249,100,11,.22)'
        } 0%, transparent 65%)`;
    }
  });
});

/* ── SERVICE BLOCK: iluminação dinâmica ── */
document.querySelectorAll('.srv-block').forEach(block => {
  block.addEventListener('mousemove', e => {
    const r = block.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    block.style.backgroundImage =
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.022) 0%, transparent 55%)`;
  });
  block.addEventListener('mouseleave', () => { block.style.backgroundImage = ''; });
});

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── POP-UP DIA DOS NAMORADOS ── */
(function () {
  const overlay  = document.getElementById('popup-overlay');
  const btnClose = document.getElementById('popup-close');
  const btnDismiss = document.getElementById('popup-dismiss');

  if (!overlay) return;

  function openPopup() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Abrir após 1.8s do carregamento
  // ⏸️ POP-UP DESATIVADO TEMPORARIAMENTE — para religar, descomente a linha abaixo:
  // setTimeout(openPopup, 1800);

  btnClose.addEventListener('click', closePopup);
  btnDismiss.addEventListener('click', closePopup);

  // Fechar ao clicar fora do card
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  // Fechar com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });
})();

/* ── ABERTO AGORA — status por unidade (fuso America/Sao_Paulo) ── */
(function () {
  const panel = document.getElementById('hero-status');
  if (!panel) return;

  // Horários em minutos-do-dia. Índice do dia: 0=domingo … 6=sábado
  const H = {
    posto:  { el: 'st-posto',  aberto: 'Posto aberto',       fechado: 'Posto fechado',
              hor: {0:[[300,1440]],1:[[300,1440]],2:[[300,1440]],3:[[300,1440]],4:[[300,1440]],5:[[300,1440]],6:[[300,1440]]} },
    rest:   { el: 'st-rest',   aberto: 'Restaurante aberto', fechado: 'Restaurante fechado',
              hor: {0:[[360,1080]],1:[[360,1410]],2:[[360,1410]],3:[[360,1410]],4:[[360,1410]],5:[[360,1410]],6:[[360,1410]]} },
    gas:    { el: 'st-gas',    aberto: 'Gás entregando',     fechado: 'Gás encerrado',
              hor: {0:[[450,1320]],1:[[450,1320]],2:[[450,1320]],3:[[450,1320]],4:[[450,1320]],5:[[450,1320]],6:[[450,1320]]} },
    murilo: { el: 'st-murilo', aberto: 'Murilo Pneus aberta', fechado: 'Murilo Pneus fechada',
              hor: {1:[[480,720],[810,1080]],2:[[480,720],[810,1080]],3:[[480,720],[810,1080]],4:[[480,720],[810,1080]],5:[[480,720],[810,1080]],6:[[480,720]]} }
  };

  function nowBSB() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const m = {}; parts.forEach(p => m[p.type] = p.value);
    const wd = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 }[m.weekday];
    let h = parseInt(m.hour, 10); if (h === 24) h = 0;
    return { wd, min: h * 60 + parseInt(m.minute, 10) };
  }
  const isOpen = (hor, wd, min) => (hor[wd] || []).some(([a, b]) => min >= a && min < b);

  function update() {
    const { wd, min } = nowBSB();
    Object.values(H).forEach(u => {
      const chip = document.getElementById(u.el);
      if (!chip) return;
      const open = isOpen(u.hor, wd, min);
      chip.classList.remove('is-open', 'is-closed');
      chip.classList.add(open ? 'is-open' : 'is-closed');
      chip.querySelector('.status-chip__txt').textContent = open ? u.aberto : u.fechado;
    });
    panel.classList.add('is-ready');
  }
  update();
  setInterval(update, 60000);
})();