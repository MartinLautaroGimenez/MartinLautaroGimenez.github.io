/* Portafolio — Martín Gimenez
   Cabecera y pie compartidos, idioma, animaciones y fondo de pistas. */
(function () {
  var root = document.documentElement;
  var body = document.body;
  var R = body.dataset.root || '';        // ruta relativa a la raíz del sitio
  var page = body.dataset.page || '';     // página activa en el menú
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- cabecera y pie ---------- */
  function t(es, en) { return '<span lang="es">' + es + '</span><span lang="en">' + en + '</span>'; }
  function nav(key, href, es, en) {
    return '<a href="' + href + '"' + (page === key ? ' class="active"' : '') + '>' + t(es, en) + '</a>';
  }

  var header = document.createElement('header');
  header.innerHTML =
    '<div class="wrap">' +
      '<a href="' + (R || './') + '" class="brand">Martín Gimenez</a>' +
      '<nav>' +
        '<div class="links-nav">' +
          nav('proyectos', R + 'proyectos/', 'Proyectos', 'Projects') +
          nav('hiletsconnect', R + 'hiletsconnect/', 'HiletsConnect', 'HiletsConnect') +
          nav('trayectoria', R + 'trayectoria/', 'Trayectoria', 'Background') +
          '<a href="#contacto">' + t('Contacto', 'Contact') + '</a>' +
        '</div>' +
        '<button class="lang" type="button" aria-label="Cambiar idioma / Switch language">EN</button>' +
        '<button class="menu" type="button" aria-label="Menú">' + t('Menú', 'Menu') + '</button>' +
      '</nav>' +
    '</div>';
  body.insertBefore(header, body.firstChild);

  var canvas = document.createElement('canvas');
  canvas.id = 'bg';
  canvas.setAttribute('aria-hidden', 'true');
  body.insertBefore(canvas, body.firstChild);

  var footer = document.createElement('footer');
  footer.id = 'contacto';
  footer.innerHTML =
    '<div class="wrap">' +
      '<p class="label">' + t('Contacto', 'Contact') + '</p>' +
      '<h2>' + t('Si tenés un proyecto o una propuesta, escribime.', 'If you have a project or an opportunity, get in touch.') + '</h2>' +
      '<ul class="rows">' +
        '<li><span class="k">Email</span><span class="v"><a href="mailto:mgimenez@hiletsconnect.com.ar">mgimenez@hiletsconnect.com.ar</a></span></li>' +
        '<li><span class="k">GitHub</span><span class="v"><a href="https://github.com/MartinLautaroGimenez" target="_blank" rel="noopener">MartinLautaroGimenez</a></span></li>' +
        '<li><span class="k">LinkedIn</span><span class="v"><a href="https://www.linkedin.com/in/mart%C3%ADn-gimenez-747207352/" target="_blank" rel="noopener">Martín Gimenez</a></span></li>' +
        '<li><span class="k">Instagram</span><span class="v"><a href="https://www.instagram.com/_martingimeneez_/" target="_blank" rel="noopener">@_martingimeneez_</a></span></li>' +
      '</ul>' +
      '<p class="copy">Martín Gimenez · Mendoza, Argentina · ' + new Date().getFullYear() + '</p>' +
    '</div>';
  body.appendChild(footer);

  header.querySelector('.menu').addEventListener('click', function () { header.classList.toggle('open'); });
  header.querySelectorAll('.links-nav a').forEach(function (a) {
    a.addEventListener('click', function () { header.classList.remove('open'); });
  });

  /* ---------- idioma ---------- */
  var langBtn = header.querySelector('.lang');
  function setLang(l) {
    root.dataset.lang = l;
    root.lang = l;
    langBtn.textContent = l === 'es' ? 'EN' : 'ES';
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'es');
  langBtn.addEventListener('click', function () { setLang(root.dataset.lang === 'es' ? 'en' : 'es'); });

  /* ---------- nombre letra por letra (solo inicio) ---------- */
  var nameEl = document.getElementById('name');
  if (nameEl) {
    var txt = nameEl.textContent;
    nameEl.setAttribute('aria-label', txt);
    nameEl.textContent = '';
    txt.split('').forEach(function (c, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c === ' ' ? ' ' : c;
      s.style.animationDelay = (0.15 + i * 0.035) + 's';
      nameEl.appendChild(s);
    });
  }

  /* ---------- texto que se escribe (solo inicio) ---------- */
  var typed = document.getElementById('typed');
  if (typed) {
    var frases = {
      es: ['diseñando PCBs en KiCad', 'programando ESP32', 'levantando servidores', 'armando apps y sistemas web', 'soldando placas', 'entrenando modelos de visión', 'procesando imágenes satelitales'],
      en: ['designing PCBs in KiCad', 'programming ESP32s', 'running servers', 'building apps and web systems', 'soldering boards', 'training vision models', 'processing satellite imagery']
    };
    var fi = 0, pos = 0, borrando = false;
    var lista = function () { return frases[root.dataset.lang] || frases.es; };
    if (reduce) { typed.textContent = lista()[0]; }
    else {
      var tick = function () {
        var f = lista()[fi % lista().length];
        if (!borrando) {
          pos++;
          typed.textContent = f.slice(0, pos);
          if (pos >= f.length) { borrando = true; return setTimeout(tick, 1800); }
          setTimeout(tick, 55 + Math.random() * 60);
        } else {
          pos--;
          typed.textContent = f.slice(0, pos);
          if (pos <= 0) { borrando = false; fi++; return setTimeout(tick, 350); }
          setTimeout(tick, 28);
        }
      };
      setTimeout(tick, 900);
    }
  }

  /* ---------- aparición al hacer scroll ---------- */
  var items = document.querySelectorAll(
    'main .label, main section > h2, .prose > *, .card, .project, .rows li, .grid2 > div, .teaser, .gallery .ph, .flow, .stat, .tags, footer h2, .pager'
  );
  items.forEach(function (el) { el.classList.add('reveal'); });
  document.querySelectorAll('.rows, .cards, .grid2, .gallery, .stats').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) { el.style.transitionDelay = (i * 0.06) + 's'; });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
          // quitar el retraso después de aparecer para que el hover responda rápido
          setTimeout(function () { e.target.style.transitionDelay = ''; }, 1200);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- fondo: pistas de PCB con señales ---------- */
  var ctx = canvas.getContext('2d');
  var G = 26;
  var DIRS = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  var W, H, dpr, traces = [], pulses = [], base = null, col = {};
  var mouse = { x: -9999, y: -9999 };

  function readColors() {
    var s = getComputedStyle(root);
    col.trace = s.getPropertyValue('--trace').trim();
    col.accent = s.getPropertyValue('--accent').trim();
    col.bg = s.getPropertyValue('--bg').trim();
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';

    var cols = Math.ceil(W / G) + 1, rows = Math.ceil(H / G) + 1;
    var used = {};
    traces = [];
    var n = Math.round(cols * rows / 11);
    for (var k0 = 0; k0 < n; k0++) {
      var x = Math.floor(Math.random() * cols), y = Math.floor(Math.random() * rows);
      if (used[x + ',' + y]) continue;
      var d = Math.floor(Math.random() * 4) * 2;
      var steps = 4 + Math.floor(Math.random() * 14);
      var pts = [[x, y]];
      used[x + ',' + y] = 1;
      for (var k = 0; k < steps; k++) {
        var r = Math.random();
        if (d % 2 === 1 && r < 0.5) d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8;
        else if (d % 2 === 0 && r < 0.18) d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8;
        var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || used[nx + ',' + ny]) break;
        x = nx; y = ny; used[x + ',' + y] = 1;
        pts.push([x, y]);
      }
      if (pts.length < 4) continue;
      var simple = [pts[0]];
      for (var j = 1; j < pts.length - 1; j++) {
        var a = pts[j - 1], b = pts[j], c = pts[j + 1];
        if ((b[0] - a[0]) !== (c[0] - b[0]) || (b[1] - a[1]) !== (c[1] - b[1])) simple.push(b);
      }
      simple.push(pts[pts.length - 1]);
      var px = simple.map(function (p) { return [p[0] * G, p[1] * G]; });
      var cum = [0], sx = 0, sy = 0;
      for (var m = 0; m < px.length; m++) {
        if (m > 0) cum.push(cum[m - 1] + Math.hypot(px[m][0] - px[m - 1][0], px[m][1] - px[m - 1][1]));
        sx += px[m][0]; sy += px[m][1];
      }
      traces.push({ p: px, cum: cum, len: cum[cum.length - 1], cx: sx / px.length, cy: sy / px.length });
    }
    pulses = [];
    drawBase();
  }

  function path(c, tr) {
    c.beginPath();
    c.moveTo(tr.p[0][0], tr.p[0][1]);
    for (var i = 1; i < tr.p.length; i++) c.lineTo(tr.p[i][0], tr.p[i][1]);
  }
  function pads(c, tr, color) {
    [tr.p[0], tr.p[tr.p.length - 1]].forEach(function (p) {
      c.beginPath();
      c.arc(p[0], p[1], 3.2, 0, Math.PI * 2);
      c.fillStyle = col.bg; c.fill();
      c.lineWidth = 1.4; c.strokeStyle = color; c.stroke();
    });
  }
  function drawBase() {
    if (!canvas.width) return;
    base = document.createElement('canvas');
    base.width = canvas.width; base.height = canvas.height;
    var b = base.getContext('2d');
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    b.lineCap = 'round'; b.lineJoin = 'round';
    traces.forEach(function (tr) {
      path(b, tr);
      b.lineWidth = 1.4; b.strokeStyle = col.trace; b.stroke();
      pads(b, tr, col.trace);
    });
  }
  function pointAt(tr, d) {
    for (var i = 1; i < tr.cum.length; i++) {
      if (d <= tr.cum[i]) {
        var f = (d - tr.cum[i - 1]) / (tr.cum[i] - tr.cum[i - 1] || 1);
        var a = tr.p[i - 1], b = tr.p[i];
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
    }
    return tr.p[tr.p.length - 1];
  }
  function spawn(tr) {
    if (!tr) tr = traces[Math.floor(Math.random() * traces.length)];
    if (!tr) return;
    pulses.push({ tr: tr, d: 0, v: 70 + Math.random() * 90 });
  }

  var last = 0, acc = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!base) return;
    acc += dt;
    if (acc > 0.35) { acc = 0; spawn(); }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    traces.forEach(function (tr) {
      var dist = Math.hypot(tr.cx - mouse.x, tr.cy - mouse.y);
      if (dist < 170) {
        ctx.globalAlpha = (1 - dist / 170) * 0.55;
        path(ctx, tr);
        ctx.lineWidth = 1.4; ctx.strokeStyle = col.accent; ctx.stroke();
        pads(ctx, tr, col.accent);
      }
    });

    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.d += p.v * dt;
      if (p.d > p.tr.len + 40) { pulses.splice(i, 1); continue; }
      for (var s = 0; s < 8; s++) {
        var dd = p.d - (40 * s / 8);
        if (dd < 0 || dd > p.tr.len) continue;
        var q = pointAt(p.tr, dd);
        ctx.globalAlpha = (1 - s / 8) * 0.8;
        ctx.beginPath();
        ctx.arc(q[0], q[1], s === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fillStyle = col.accent; ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  readColors();
  build();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (reduce && base) ctx.drawImage(base, 0, 0); }, 200);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    readColors(); drawBase(); if (reduce && base) ctx.drawImage(base, 0, 0);
  });

  if (reduce) { if (base) ctx.drawImage(base, 0, 0); return; }

  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
  window.addEventListener('click', function (e) {
    traces.forEach(function (tr) {
      if (Math.hypot(tr.cx - e.clientX, tr.cy - e.clientY) < 150) spawn(tr);
    });
  });
  for (var k1 = 0; k1 < 6; k1++) spawn();
  requestAnimationFrame(function (ts) { last = ts; frame(ts); });
})();
