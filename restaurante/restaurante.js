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