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

/* ── ABERTO AGORA — status por unidade e faixa de horário (fuso America/Sao_Paulo) ── */
(function () {
  const panel = document.getElementById('hero-status');
  if (!panel) return;

  // seg = [ [iniMin, fimMin, estado, texto], ... ] ; fora das faixas => {closed, textoFechado}
  // estados: 'open' (verde) | 'soon' (âmbar, última 1h) | 'closed' (vermelho)
  function seg(min, faixas, txtFechado) {
    const f = faixas.find(([a, b]) => min >= a && min < b);
    return f ? { estado: f[2], texto: f[3] } : { estado: 'closed', texto: txtFechado };
  }

  const SCHED = {
    posto: (wd, min) => seg(min, [
      [300, 1380, 'open', 'Posto: aberto'],
      [1380, 1440, 'soon', 'Posto: fecha à meia-noite']
    ], 'Posto: abre às 5h'),

    gas: (wd, min) => seg(min, [
      [450, 1260, 'open', 'Ultragaz: aberto'],
      [1260, 1320, 'soon', 'Ultragaz: entrega até 22h']
    ], 'Ultragaz: abre às 7h30'),

    murilo: (wd, min) => {
      if (wd === 0) return { estado: 'closed', texto: 'Murilo Pneus: abre às 8h' };
      if (wd === 6) return seg(min, [
        [480, 660, 'open', 'Murilo Pneus: aberto'],
        [660, 720, 'soon', 'Murilo Pneus: fecha ao meio-dia']
      ], 'Murilo Pneus: abre às 8h');
      return seg(min, [
        [480, 660, 'open', 'Murilo Pneus: aberto'],
        [660, 720, 'soon', 'Murilo Pneus: fecha ao meio-dia'],
        [720, 810, 'closed', 'Murilo Pneus: retorna às 13h30'],
        [810, 1020, 'open', 'Murilo Pneus: aberto'],
        [1020, 1080, 'soon', 'Murilo Pneus: fecha às 18h']
      ], 'Murilo Pneus: abre às 8h');
    },

    rest: (wd, min) => {
      if (wd === 0) return seg(min, [
        [360, 600, 'open', 'Restaurante: servindo café da manhã'],
        [600, 690, 'open', 'Restaurante: próximo de servir almoço'],
        [690, 780, 'open', 'Restaurante: servindo almoço'],
        [780, 810, 'open', 'Restaurante: almoço até 13h30'],
        [810, 1020, 'open', 'Restaurante: servindo lanches'],
        [1020, 1080, 'soon', 'Restaurante: atende até 18h']
      ], 'Restaurante: abre às 6h');
      return seg(min, [
        [360, 600, 'open', 'Restaurante: servindo café da manhã'],
        [600, 690, 'open', 'Restaurante: próximo de servir almoço'],
        [690, 780, 'open', 'Restaurante: servindo almoço'],
        [780, 810, 'open', 'Restaurante: almoço até 13h30'],
        [810, 1080, 'open', 'Restaurante: servindo lanches'],
        [1080, 1320, 'open', 'Restaurante: servindo janta (à la carte)'],
        [1320, 1350, 'soon', 'Restaurante: cozinha encerra às 22h30'],
        [1350, 1410, 'soon', 'Restaurante: atendendo até 23h30']
      ], 'Restaurante: abre às 6h');
    }
  };

  const CHIP = { posto: 'st-posto', rest: 'st-rest', gas: 'st-gas', murilo: 'st-murilo' };

  function nowBSB() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const m = {}; parts.forEach(p => m[p.type] = p.value);
    const wd = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 }[m.weekday];
    let h = parseInt(m.hour, 10); if (h === 24) h = 0;
    return { wd, min: h * 60 + parseInt(m.minute, 10) };
  }

  function update() {
    const { wd, min } = nowBSB();
    Object.keys(CHIP).forEach(k => {
      const chip = document.getElementById(CHIP[k]);
      if (!chip) return;
      const { estado, texto } = SCHED[k](wd, min);
      chip.classList.remove('is-open', 'is-soon', 'is-closed');
      chip.classList.add(estado === 'open' ? 'is-open' : estado === 'soon' ? 'is-soon' : 'is-closed');
      chip.querySelector('.status-chip__txt').textContent = texto;
    });
    panel.classList.add('is-ready');
  }
  update();
  setInterval(update, 60000);
})();