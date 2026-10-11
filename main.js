(function () {
  'use strict';
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Show a "coming soon" placeholder when a demo video file is missing.
    document.querySelectorAll('.vid').forEach(function (box) {
      var v = box.querySelector('video');
      if (!v) return;
      var miss = function () { box.classList.add('missing'); };
      var s = v.querySelector('source');
      if (s) s.addEventListener('error', miss);
      v.addEventListener('error', miss);
      // No right-click "Save video as".
      v.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });

    // Play each demo only while it is on screen; pause it when scrolled away.
    var vids = document.querySelectorAll('.vid video');
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still && 'IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.5 });
      vids.forEach(function (v) { vio.observe(v); });
    }

    // Pop-in entrance, skipped for reduced-motion users.
    var els = document.querySelectorAll('.pop');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  });
})();
