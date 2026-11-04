/* Live previews: every project image becomes a scaled, non-interactive iframe of the real site. */
(function () {
  var MAP = {
    'muna-haqi-portfolio':'muna-haqi-portfolio.vercel.app','muna-226':'muna-226.netlify.app','muneeb-portfolio-50':'muneeb-portfolio-50.netlify.app',
    'muneeb-rehman-portfolio-darw':'muneeb-rehman-portfolio-darw.vercel.app','muneeb-rehman-40':'muneeb-rehman-40.vercel.app',
    'muneeb-rehman-portfolio-30':'muneeb-rehman-portfolio-30.vercel.app','muneeb-rehman-portfolio-20':'muneeb-rehman-portfolio-20.vercel.app',
    'muna-portfolio-2k26':'muna-portfolio-2k26.netlify.app','muna-portfolio-2k26-vercel':'muna-portfolio-2k26.vercel.app','muneeb-dev':'muneeb-dev.netlify.app',
    'muneeb-dev-portfolio':'muneeb-dev-portfolio.netlify.app','muneeb-port-folio':'muneeb-port-folio.netlify.app','muna-movie':'muna-movie.netlify.app',
    'muna-voices':'muna-voices.netlify.app','muna-dev2':'muna-dev2.netlify.app','muneeb-portfolio-1':'muneeb-portfolio-1.netlify.app','muneeb-portfoli0':'muneeb-portfoli0.netlify.app'
  };
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); queue(e.target); } });
  }, { rootMargin: '1200px' }) : null;
  var q = [], busy = false;
  function queue(b) { q.push(b); if (!busy) next(); }
  function next() { var b = q.shift(); if (!b) { busy = false; return; } busy = true; load(b); setTimeout(next, 250); }
  function load(box) {
    if (box._f) return;
    var f = document.createElement('iframe');
    f.src = 'https://' + box.getAttribute('data-host') + '/';
    f.title = 'Live preview: ' + box.getAttribute('data-host');
    f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true'); f.setAttribute('referrerpolicy', 'no-referrer');
    f.style.cssText = 'position:absolute;left:0;top:0;border:0;background:#0a0c12;pointer-events:none;transform-origin:0 0;opacity:0;transition:opacity .4s';
    f.onload = function () { f.style.opacity = 1; };
    box.appendChild(f); box._f = f; fit(box);
  }
  function fit(box) {
    var f = box._f; if (!f) return;
    var w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
    var vw = w < 700 ? 420 : 1280, s = w / vw;
    f.style.width = vw + 'px'; f.style.height = Math.ceil(h / s) + 'px'; f.style.transform = 'scale(' + s + ')';
  }
  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (es) { es.forEach(function (e) { fit(e.target); }); }) : null;
  function slugOf(src) { var m = /\/images\/projects\/([^\/]+)\//.exec(decodeURIComponent(src || '')); return m && m[1]; }
  function scan(root) {
    (root || document).querySelectorAll('img').forEach(function (img) {
      if (img._lp) return;
      var src = img.currentSrc || img.getAttribute('src') || '';
      if (src.indexOf('/_next/image') > -1) { var u = /url=([^&]+)/.exec(src); if (u) src = decodeURIComponent(u[1]); }
      var slug = slugOf(src), host = slug && MAP[slug];
      if (!host) return;
      img._lp = 1;
      var p = img.parentElement; if (!p) return;
      if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
      var box = document.createElement('div');
      box.className = 'live-frame'; box.setAttribute('data-host', host);
      box.style.cssText = 'position:absolute;inset:0;overflow:hidden;background:#0a0c12;z-index:1;pointer-events:none';
      var ph = document.createElement('div');
      ph.textContent = host; ph.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.35);font:500 12px/1.2 sans-serif;letter-spacing:.04em;text-align:center;padding:8px';
      box.appendChild(ph);
      p.appendChild(box);
      if (ro) ro.observe(box);
      if (io) io.observe(box); else queue(box);
    });
  }
  function start() {
    scan();
    if ('MutationObserver' in window) {
      var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 150); }).observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener('resize', function () { document.querySelectorAll('.live-frame').forEach(fit); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
