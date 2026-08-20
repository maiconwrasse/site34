/* ═══════════════════════════════════════════════════════════
   RESTAURANTE.JS — Complexo 34 · página /restaurante/
   Herói animado:
   • preloader com contador 0→100 montando 3 painéis de foto
   • revelação full-bleed + entrada do wordmark
   • slideshow de 6 fotos com crossfade lento no herói em descanso
   Cuidados: roda 1x por sessão · respeita prefers-reduced-motion ·
   textos/H1 já no HTML (Google lê durante a animação) ·
   os slides seguintes só carregam depois da revelação (data-bg).
═══════════════════════════════════════════════════════════ */
(function () {
  var root = document.documentElement;
  var hero = document.querySelector('.rhero');
  var load = document.getElementById('rload');
  if (!hero) return;

  var reduce = false, seen = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { seen = sessionStorage.getItem('c34_rest_hero_seen') === '1'; } catch (e) {}

  // ── Slideshow (inicia após a revelação) ──
  var slidesStarted = false;
  function startSlides() {
    if (slidesStarted) return; slidesStarted = true;
    var slides = hero.querySelectorAll('.rhero__slide');
    if (!slides.length) return;

    // Carrega os fundos adiados (o 1º slide já vem inline no HTML)
    for (var i = 0; i < slides.length; i++) {
      var bg = slides[i].getAttribute('data-bg');
      if (bg) slides[i].style.backgroundImage = "url('" + bg + "')";
    }
    if (reduce || slides.length < 2) return; // mantém só o 1º slide

    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 4800);
  }

  function reveal() {
    hero.classList.add('is-revealed');
    root.classList.remove('is-loading');
    document.body.style.overflow = '';
    startSlides();
  }

  // Sem preloader: reduz movimento, já visto na sessão, ou markup ausente
  if (reduce || seen || !load) {
    if (load) load.style.display = 'none';
    reveal();
    return;
  }

  var num    = load.querySelector('.rload__num');
  var panels = load.querySelectorAll('.rload__panel');
  document.body.style.overflow = 'hidden';

  var DUR = 1200, start = null;
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var WIN = [[0.00, 0.55], [0.20, 0.78], [0.45, 1.00]];
  function panelInsetRight(p, i) {
    var w = WIN[i] || [0, 1];
    var t = (p - w[0]) / (w[1] - w[0]);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return (1 - t) * 100;
  }

  function frame(ts) {
    if (start === null) start = ts;
    var t = Math.min(1, (ts - start) / DUR);
    var p = easeOutCubic(t);

    if (num) num.textContent = Math.round(p * 100);
    for (var i = 0; i < panels.length; i++) {
      panels[i].style.clipPath = 'inset(0 ' + panelInsetRight(p, i) + '% 0 0)';
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      load.classList.add('is-done');
      reveal();
      try { sessionStorage.setItem('c34_rest_hero_seen', '1'); } catch (e) {}
      setTimeout(function () { load.style.display = 'none'; }, 700);
    }
  }
  requestAnimationFrame(frame);
})();

/* ── Cardápio: abrir/fechar (opcional para o cliente) ── */
(function () {
  var btn = document.getElementById('menuToggle');
  var full = document.getElementById('menuFull');
  if (!btn || !full) return;
  btn.addEventListener('click', function () {
    var open = full.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Ocultar cardápio' : 'Ver cardápio completo';
    if (open) { full.removeAttribute('inert'); }
    else { full.setAttribute('inert', ''); }
  });
})();

/* ── Galeria: carrossel 3D (coverflow) com auto-play + lightbox ── */
(function () {
  var ASSETS = '/assets/img/galeria/';
  var stage = document.getElementById('rgalStage');
  if (!stage) return;

  // slug + alt (as versões -full.webp abrem no lightbox)
  var PHOTOS = [
    ['ambiente-buffet', 'Área do buffet e salão do Restaurante 34'],
    ['alacarte-picanha', 'Carne grelhada na tábua com farofa e cebola'],
    ['lancheria-burger', 'Hambúrguer artesanal servido no complexo'],
    ['conv-mercado', 'Prateleiras da loja de conveniência'],
    ['ambiente-noite', 'Salão cheio durante música ao vivo'],
    ['prato-frango', 'Frango assado temperado no buffet'],
    ['banheiro', 'Banheiros amplos e higienizados'],
    ['prato-buffet-carne', 'Buffet com carnes e acompanhamentos'],
    ['conv-geladeiras', 'Geladeiras com bebidas geladas'],
    ['lancheria-pasteis', 'Pastéis fritos na vitrine da lancheria'],
    ['alacarte-carne', 'Prato à la carte de carne grelhada'],
    ['ambiente-dia', 'Salão do restaurante durante o dia'],
    ['prato-gratinado', 'Gratinado e salgados no buffet'],
    ['conv-chocolate', 'Chocolates importados na conveniência'],
    ['prato-feijao', 'Buffet servindo feijão, arroz e massas'],
    ['ambiente-show', 'Público curtindo show ao vivo no salão'],
    ['prato-isca', 'Iscas fritas com limão no buffet'],
    ['conv-doces', 'Doces e balas importados'],
    ['prato-caseiro', 'Feijoada, arroz e ovos no buffet'],
    ['prato-cremoso', 'Gratinado cremoso sendo servido']
  ];

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var slides = [], active = 0, timer = null;

  PHOTOS.forEach(function (p, i) {
    var b = document.createElement('button');
    b.className = 'rgal__slide';
    b.type = 'button';
    b.setAttribute('aria-label', 'Ampliar: ' + p[1]);
    b.innerHTML =
      '<img src="' + ASSETS + p[0] + '.webp" alt="' + p[1] + '" loading="lazy" decoding="async" />' +
      '<span class="rgal__zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>';
    b.addEventListener('click', function () { if (i === active) openLb(); else go(i); });
    stage.appendChild(b);
    slides.push(b);
  });

  function cfg() {
    if (window.innerWidth < 700) return { rot: 25, g1: 0.58, g2: 1.0, max: 1 };
    return { rot: 40, g1: 0.64, g2: 1.12, max: 2 };
  }

  function layout() {
    var n = slides.length, c = cfg();
    var W = slides[active] ? slides[active].offsetWidth : 320;
    slides.forEach(function (s, i) {
      var o = i - active;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      var a = Math.abs(o), t, op, z;
      s.classList.toggle('is-active', o === 0);
      s.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
      s.tabIndex = o === 0 ? 0 : -1;
      if (o === 0) { t = 'translate(-50%,-50%) scale(1)'; op = 1; z = 10; }
      else if (a === 1) { t = 'translate(-50%,-50%) translateX(' + (o * c.g1 * W) + 'px) rotateY(' + (-o * c.rot) + 'deg) scale(.86)'; op = .82; z = 6; }
      else if (a === 2 && c.max >= 2) { t = 'translate(-50%,-50%) translateX(' + (o * c.g2 * W) + 'px) rotateY(' + (-o * c.rot) + 'deg) scale(.7)'; op = .38; z = 4; }
      else { t = 'translate(-50%,-50%) translateX(' + ((o > 0 ? 1 : -1) * (c.g2 + .25) * W) + 'px) scale(.6)'; op = 0; z = 1; }
      s.style.transform = t; s.style.opacity = op; s.style.zIndex = z;
    });
  }

  function go(i) { active = (i + slides.length) % slides.length; layout(); restart(); }
  function next() { go(active + 1); }
  function prev() { go(active - 1); }
  function start() { if (!reduce && slides.length > 1 && !timer) timer = setInterval(next, 3500); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  document.getElementById('rgalNext').addEventListener('click', next);
  document.getElementById('rgalPrev').addEventListener('click', prev);
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  stage.addEventListener('focusin', stop);
  stage.addEventListener('focusout', start);

  var sx = 0;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  // lightbox
  var lb = document.getElementById('rgalLb');
  var lbImg = document.getElementById('rgalLbImg');
  var lbCount = document.getElementById('rgalLbCount');
  var lastFocus = null;
  function showLb() {
    var p = PHOTOS[active];
    lbImg.src = ASSETS + p[0] + '-full.webp';
    lbImg.alt = p[1];
    lbCount.textContent = (active + 1) + ' / ' + slides.length;
  }
  function openLb() { lastFocus = document.activeElement; showLb(); lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; stop(); document.getElementById('rgalLbClose').focus(); }
  function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; start(); if (lastFocus) lastFocus.focus(); }
  function lbStep(d) { go(active + d); showLb(); }

  document.getElementById('rgalLbClose').addEventListener('click', closeLb);
  document.getElementById('rgalLbNext').addEventListener('click', function () { lbStep(1); });
  document.getElementById('rgalLbPrev').addEventListener('click', function () { lbStep(-1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  var lx = 0;
  lb.addEventListener('touchstart', function (e) { lx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - lx;
    if (Math.abs(dx) > 45) { dx < 0 ? lbStep(1) : lbStep(-1); }
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
  });

  window.addEventListener('resize', layout);
  layout();
  start();
})();