/* Live previews: project images -> scaled, non-interactive iframes of the real sites.
   Fast loading: visible ones first, limited concurrency, preconnect, skeleton while loading. */
(function () {
  var HOSTS = {
    'muna-haqi-portfolio':'muna-haqi-portfolio.vercel.app','muna-226':'muna-226.netlify.app','muneeb-portfolio-50':'muneeb-portfolio-50.netlify.app',
    'muneeb-rehman-portfolio-darw':'muneeb-rehman-portfolio-darw.vercel.app','muneeb-rehman-40':'muneeb-rehman-40.vercel.app',
    'muneeb-rehman-portfolio-30':'muneeb-rehman-portfolio-30.vercel.app','muneeb-rehman-portfolio-20':'muneeb-rehman-portfolio-20.vercel.app',
    'muna-portfolio-2k26':'muna-portfolio-2k26.netlify.app','muna-portfolio-2k26-vercel':'muna-portfolio-2k26.vercel.app','muneeb-dev':'muneeb-dev.netlify.app',
    'muneeb-dev-portfolio':'muneeb-dev-portfolio.netlify.app','muneeb-port-folio':'muneeb-port-folio.netlify.app','muna-movie':'muna-movie.netlify.app',
    'muna-voices':'muna-voices.netlify.app','muna-dev2':'muna-dev2.netlify.app','muneeb-portfolio-1':'muneeb-portfolio-1.netlify.app','muneeb-portfoli0':'muneeb-portfoli0.netlify.app'
  };
  var TITLES = { 'muna-haqi-portfolio':'Haqi Portfolio','muna-226':'Muna 226','muneeb-portfolio-50':'Portfolio 50','muneeb-rehman-portfolio-darw':'Portfolio Darw','muneeb-rehman-40':'Rehman 40','muneeb-rehman-portfolio-30':'Portfolio 30' };
  /* other pictures that should show a live site instead of an illustration */
  var BY_IMAGE = [
    [/service-web-development/, 'muna-haqi-portfolio'], [/service-website-mobile-design/, 'muna-226'], [/service-product-design/, 'muneeb-portfolio-50'], [/service-branding/, 'muneeb-rehman-portfolio-darw'],
    [/Brandshowcase\/luxury-presence/, 'muna-haqi-portfolio'], [/Brandshowcase\/credible/, 'muna-226'], [/Brandshowcase\/yellowtail/, 'muneeb-portfolio-50'], [/Brandshowcase\/my-worker-ai/, 'muneeb-rehman-portfolio-darw'],
    [/Brandshowcase\/criss-cross/, 'muneeb-rehman-40'], [/Brandshowcase\/ockto/, 'muneeb-rehman-portfolio-30'], [/Brandshowcase\/technis/, 'muneeb-rehman-portfolio-20'], [/Brandshowcase\/ubiqu/, 'muna-portfolio-2k26']
  ];
  var MAX = 4, active = 0, q = [];
  function pump() {
    while (active < MAX && q.length) {
      var vy = window.innerHeight; q.sort(function (a, b) { return dist(a, vy) - dist(b, vy); });
      var b = q.shift(); active++; load(b);
    }
  }
  function dist(b, vy) { var r = b.getBoundingClientRect(); return r.top > vy ? r.top - vy : (r.bottom < 0 ? -r.bottom : 0); }
  function load(box) {
    if (box._f) { active--; return; }
    var f = document.createElement('iframe'), done = false;
    function fin() { if (done) return; done = true; active--; f.style.opacity = 1; var p = box.querySelector('.lf-ph'); if (p) p.style.opacity = 0; pump(); }
    f.src = 'https://' + box.getAttribute('data-host') + '/';
    f.title = 'Live preview: ' + box.getAttribute('data-host');
    f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true'); f.setAttribute('referrerpolicy', 'no-referrer'); f.setAttribute('loading', 'eager');
    f.style.cssText = 'position:absolute;left:0;top:0;border:0;background:#0a0c12;pointer-events:none;transform-origin:0 0;opacity:0;transition:opacity .35s';
    f.onload = fin; setTimeout(fin, 7000);
    box.appendChild(f); box._f = f; fit(box);
  }
  function fit(box) {
    var f = box._f; if (!f) return;
    var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
    var vw = w < 700 ? 420 : 1280, s = w / vw;
    f.style.width = vw + 'px'; f.style.height = Math.ceil(h / s) + 'px'; f.style.transform = 'scale(' + s + ')';
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); q.push(e.target); } }); pump();
  }, { rootMargin: '500px' }) : null;
  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (es) { es.forEach(function (e) { if (e.target._sync) e.target._sync(); else fit(e.target); }); }) : null;
  function register(box) { if (ro) ro.observe(box); if (io) io.observe(box); else { q.push(box); pump(); } }
  function makeBox(host, extra) {
    var box = document.createElement('div');
    box.className = 'live-frame'; box.setAttribute('data-host', host);
    box.style.cssText = 'position:absolute;inset:0;overflow:hidden;background:#0a0c12;z-index:1;pointer-events:none;' + (extra || '');
    var ph = document.createElement('div'); ph.className = 'lf-ph';
    ph.textContent = host; ph.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.4);font:500 12px/1.2 sans-serif;letter-spacing:.04em;text-align:center;padding:8px;background:linear-gradient(110deg,#0f121b 30%,#1a1f2e 50%,#0f121b 70%);background-size:200% 100%;animation:lfsk 1.4s linear infinite;transition:opacity .35s';
    box.appendChild(ph); return box;
  }
  function hostFor(src) {
    var m = /\/images\/projects\/([^\/]+)\//.exec(src); if (m && HOSTS[m[1]]) return HOSTS[m[1]];
    for (var i = 0; i < BY_IMAGE.length; i++) if (BY_IMAGE[i][0].test(src)) return HOSTS[BY_IMAGE[i][1]];
  }
  function scan() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img._lp) return;
      if (!img.offsetWidth && !img.offsetHeight) return;
      var src = img.currentSrc || img.getAttribute('src') || '';
      if (src.indexOf('/_next/image') > -1) { var u = /url=([^&]+)/.exec(src); if (u) src = decodeURIComponent(u[1]); }
      var host = hostFor(decodeURIComponent(src)); if (!host) return;
      img._lp = 1;
      var p = img.parentElement; if (!p) return;
      if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
      var isProject = /\/images\/projects\//.test(src), box = makeBox(host);
      if (!isProject) {
        var sync = function () { box.style.inset = 'auto'; box.style.left = img.offsetLeft + 'px'; box.style.top = img.offsetTop + 'px'; box.style.width = img.offsetWidth + 'px'; box.style.height = img.offsetHeight + 'px'; box.style.borderRadius = '4px'; fit(box); };
        sync(); if (ro) ro.observe(img); img._sync = sync; box._sync = sync; (window._lpSync = window._lpSync || []).push(sync);
      }
      p.appendChild(box); register(box);
    });
  }
  /* contact page: fill the empty area with a "recent live work" grid + map */
  function contactExtras() {
    if (!/\/contact\/?$/.test(location.pathname) || document.getElementById('lp-contact')) return;
    var main = document.querySelector('main'); if (!main) return;
    var sec = document.createElement('section'); sec.id = 'lp-contact';
    sec.style.cssText = 'position:relative;z-index:5;background:#040508;color:#fff;padding:96px 24px 80px';
    var html = '<div style="max-width:1280px;margin:0 auto"><p style="opacity:.5;letter-spacing:.12em;font-size:12px;text-transform:uppercase;margin:0 0 12px">Recent live work</p><h2 style="font-size:clamp(34px,5vw,64px);line-height:1.05;margin:0 0 40px;font-weight:500;letter-spacing:-.03em">Websites you can open right now.</h2><div id="lp-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px"></div>';
    html += '<div style="margin-top:48px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px"><div style="border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;min-height:280px"><iframe title="Map of Pakistan" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;min-height:280px;border:0;filter:invert(.9) hue-rotate(180deg) grayscale(.4)" src="https://www.openstreetmap.org/export/embed.html?bbox=60.5%2C23.0%2C77.5%2C37.2&layer=mapnik"></iframe></div>';
    html += '<div style="border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:28px;display:flex;flex-direction:column;gap:14px"><span style="opacity:.5;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Find me</span><a href="mailto:muneebrahman500@gmail.com" style="color:#fff;font-size:22px">muneebrahman500@gmail.com</a><a href="https://github.com/muneebrahmancmd" style="color:#fff">GitHub - muneebrahmancmd</a><a href="https://www.linkedin.com/in/muneeb-soomro-887925333/" style="color:#fff">LinkedIn - muneeb-soomro-887925333</a><a href="https://x.com/Muneeb455365487" style="color:#fff">X - @Muneeb455365487</a><a href="https://www.instagram.com/he__muneeb/" style="color:#fff">Instagram - @he__muneeb</a><span style="opacity:.6;margin-top:auto">Based in Pakistan, working with people worldwide.</span></div></div></div>';
    sec.innerHTML = html; main.appendChild(sec);
    var grid = sec.querySelector('#lp-grid'), n = 0;
    Object.keys(HOSTS).slice(0, 6).forEach(function (s) {
      var a = document.createElement('a'); a.href = '/work/' + s; a.style.cssText = 'display:block;color:#fff;text-decoration:none';
      var frame = document.createElement('div'); frame.style.cssText = 'position:relative;aspect-ratio:16/10;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#0a0c12';
      frame.appendChild(makeBox(HOSTS[s])); a.appendChild(frame);
      var t = document.createElement('div'); t.style.cssText = 'margin-top:10px;display:flex;justify-content:space-between;font-size:15px'; t.innerHTML = '<span>' + (TITLES[s] || s) + '</span><span style="opacity:.5">' + HOSTS[s] + '</span>'; a.appendChild(t);
      grid.appendChild(a); register(frame.firstChild);
    });
  }
  function start() {
    var st = document.createElement('style'); st.textContent = '@keyframes lfsk{0%{background-position:200% 0}100%{background-position:-200% 0}}'; document.head.appendChild(st);
    scan(); contactExtras();
    if ('MutationObserver' in window) { var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { scan(); contactExtras(); }, 120); }).observe(document.body, { childList: true, subtree: true }); }
    window.addEventListener('resize', function () { scan(); (window._lpSync || []).forEach(function (f) { f(); }); document.querySelectorAll('.live-frame').forEach(fit); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
