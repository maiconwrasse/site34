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
  }, 500);
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

/* ── MENU MOBILE: seção ativa (scroll-spy) ── */
(() => {
  const links = Array.from(document.querySelectorAll('.mobile-menu__nav a[href^="#"]'));
  if (!links.length) return;
  const map = new Map();
  links.forEach(a => {
    const sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;
  const setActive = a => {
    links.forEach(l => l.classList.remove('is-active'));
    if (a) a.classList.add('is-active');
  };
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(map.get(e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  map.forEach((_, sec) => spy.observe(sec));
})();

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
      // Mensagem de fechado conforme o dia/horário (domingo não abre)
      const fechado = () => {
        if (wd >= 1 && wd <= 6 && min < 480) return 'Murilo Pneus: abre às 8h';      // antes de abrir hoje
        if (wd === 0 || wd === 6) return 'Murilo Pneus: abre segunda às 8h';          // domingo, ou sáb após 12h
        return 'Murilo Pneus: abre amanhã às 8h';                                     // seg–sex após 18h
      };
      if (wd === 0) return { estado: 'closed', texto: fechado() };
      if (wd === 6) return seg(min, [
        [480, 660, 'open', 'Murilo Pneus: aberto'],
        [660, 720, 'soon', 'Murilo Pneus: fecha ao meio-dia']
      ], fechado());
      return seg(min, [
        [480, 660, 'open', 'Murilo Pneus: aberto'],
        [660, 720, 'soon', 'Murilo Pneus: fecha ao meio-dia'],
        [720, 810, 'closed', 'Murilo Pneus: retorna às 13h30'],
        [810, 1020, 'open', 'Murilo Pneus: aberto'],
        [1020, 1080, 'soon', 'Murilo Pneus: fecha às 18h']
      ], fechado());
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


/* ── CARROSSEL (serviços + avaliações): autoplay, arrasto, setas, dica ── */
(function () {
  document.querySelectorAll('.js-carousel').forEach(setup);
  window.__c34Carousel = setup;   // usado pelo módulo do blog

  function arrow(dir) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'carousel__arrow carousel__arrow--' + dir;
    b.setAttribute('aria-label', dir === 'prev' ? 'Anterior' : 'Próximo');
    b.innerHTML = '<span>' + (dir === 'prev' ? '\u2039' : '\u203A') + '</span>';
    return b;
  }

  function setup(track) {
    const box = document.createElement('div');
    box.className = 'carousel';
    track.parentNode.insertBefore(box, track);
    box.appendChild(track);
    track.classList.add('carousel__track');
    if (track.dataset.hint === 'top') box.classList.add('carousel--hint-top');

    // itens visíveis já de cara (não dependem do scroll-reveal)
    track.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

    const prev = arrow('prev'), next = arrow('next');
    const hint = document.createElement('div');
    hint.className = 'carousel__hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8l4 4-4 4"/><path d="M6 8l-4 4 4 4"/><line x1="3" y1="12" x2="21" y2="12"/></svg><span>arraste</span>';
    box.append(prev, next, hint);

    const gapPx = () => parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = () => { const it = track.children[0]; return it ? it.getBoundingClientRect().width + gapPx() : track.clientWidth; };
    const atStart = () => track.scrollLeft <= 4;
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const go = (d) => track.scrollBy({ left: d * step(), behavior: 'smooth' });

    function updateArrows() {
      box.classList.toggle('at-start', atStart());
      box.classList.toggle('at-end', atEnd());
    }
    track.addEventListener('scroll', updateArrows, { passive: true });
    setTimeout(updateArrows, 60);

    prev.addEventListener('click', () => { go(-1); nudge(); });
    next.addEventListener('click', () => { go(1); nudge(); });

    // autoplay (pausa: hover, interação, fora da tela)
    const interval = parseInt(track.dataset.autoplay || '5000', 10);
    let paused = false, inView = true, resumeTO = null;
    function tick() {
      if (paused || !inView) return;
      if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
      else go(1);
    }
    if (interval > 0) setInterval(tick, interval);
    function nudge() { paused = true; clearTimeout(resumeTO); resumeTO = setTimeout(() => { paused = false; }, 9000); }
    box.addEventListener('mouseenter', () => { paused = true; });
    box.addEventListener('mouseleave', () => { if (!resumeTO) paused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; }), { threshold: 0.15 }).observe(box);
    }

    // esconde a dica na 1ª interação
    const used = () => box.classList.add('is-used');
    ['pointerdown', 'wheel', 'touchstart'].forEach(ev => track.addEventListener(ev, used, { once: true, passive: true }));

    // arrasto com mouse (toque usa o scroll nativo)
    let down = false, sx = 0, sl = 0, moved = false, capturado = false;
    track.addEventListener('pointerdown', e => {
      nudge();
      if (e.pointerType === 'touch') return;
      down = true; moved = false; capturado = false;
      sx = e.clientX; sl = track.scrollLeft;
      // NAO entra em modo arrasto aqui: se entrar, o clique simples
      // nunca chega no link do card (is-dragging zera o pointer-events)
    });
    track.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved) {
        if (Math.abs(dx) <= 4) return;   // limiar: abaixo disso ainda e clique
        moved = true;
        track.classList.add('is-dragging');
        try { track.setPointerCapture(e.pointerId); capturado = true; } catch (_) {}
      }
      track.scrollLeft = sl - dx;
    });
    function endDrag(e) {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      if (capturado) {
        try { track.releasePointerCapture(e.pointerId); } catch (_) {}
        capturado = false;
      }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // impede que o arrasto do mouse dispare clique (ex.: abrir WhatsApp)
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }
})();

/* ── BLOG: chamadas na home (.js-blog-track) e listagem completa (.js-post-grid) ── */
(function () {
  const track = document.querySelector('.js-blog-track');
  const grid  = document.querySelector('.js-post-grid');
  if (!track && !grid) return;

  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  function dataBR(iso) {
    const p = String(iso || '').split('-');
    if (p.length !== 3) return '';
    return parseInt(p[2], 10) + ' ' + MESES[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function card(p, eager) {
    return '<a class="post-card" href="' + esc(p.url) + '">' +
      '<div class="post-card__img-wrap">' +
        '<img src="' + esc(p.imagem) + '" alt="' + esc(p.alt || p.titulo) + '" ' +
             'width="800" height="450" decoding="async" draggable="false" ' +
             'loading="' + (eager ? 'eager' : 'lazy') + '" ' +
             'onerror="this.style.display=\'none\'" />' +
        '<div class="post-card__img-ov"></div>' +
      '</div>' +
      '<div class="post-card__body">' +
        '<div class="post-card__meta">' +
          '<span class="post-card__tag">' + esc(p.categoria) + '</span>' +
          '<span class="post-card__date">' + dataBR(p.data) + '</span>' +
        '</div>' +
        '<h3 class="post-card__title">' + esc(p.titulo) + '</h3>' +
        '<p class="post-card__desc">' + esc(p.descricao) + '</p>' +
        '<span class="post-card__more">Ler matéria</span>' +
      '</div>' +
    '</a>';
  }

  function esconderSecao() {
    const sec = document.getElementById('blog');
    if (sec) sec.style.display = 'none';
  }

  fetch('/posts.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(dados => {
      const posts = (dados.posts || [])
        .filter(p => p && p.titulo && p.url)
        .sort((a, b) => String(b.data).localeCompare(String(a.data)));

      if (track) {
        const limite = parseInt(track.dataset.limit || '6', 10);
        const lista = posts.slice(0, limite);
        if (!lista.length) { esconderSecao(); }
        else {
          track.innerHTML = lista.map((p, i) => card(p, i < 2)).join('');
          track.classList.add('js-carousel');
          if (typeof window.__c34Carousel === 'function') window.__c34Carousel(track);
        }
      }

      if (grid) {
        grid.innerHTML = posts.length
          ? posts.map((p, i) => card(p, i < 3)).join('')
          : '<p class="blogpage__note">Nenhuma matéria publicada ainda.</p>';
      }
    })
    .catch(err => {
      console.warn('[Complexo 34] posts.json não carregou:', err.message);
      esconderSecao();
      if (grid) grid.innerHTML = '<p class="blogpage__note">Não foi possível carregar as matérias agora.</p>';
    });
})();