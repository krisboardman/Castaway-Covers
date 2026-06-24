/*
 * fit-diagrams.js — shared print helper for the standalone cover calculators.
 *
 * Problem: a diagram's drawing often fills only part of its SVG canvas, so even
 * when the SVG element is sized to the page (see print.css), the drawing looks
 * small. This refits every SVG's viewBox to the actual drawn content right
 * before printing, so the drawing fills the page — then restores the on-screen
 * viewBox afterward so the screen view is unchanged.
 *
 * Link it once per calculator:  <script src="shared/fit-diagrams.js"></script>
 * Works for every calculator with no per-diagram code changes.
 */
(function () {
  var saved = [];

  function fitForPrint() {
    saved = [];
    var svgs = document.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) {
      var s = svgs[i];
      try {
        var bb = s.getBBox();
        if (!bb || !isFinite(bb.width) || bb.width <= 0 || bb.height <= 0) continue;
        saved.push([s, s.getAttribute('viewBox')]);
        var m = Math.max(8, bb.width * 0.02); // small breathing margin
        s.setAttribute('viewBox', (bb.x - m) + ' ' + (bb.y - m) + ' ' + (bb.width + 2 * m) + ' ' + (bb.height + 2 * m));
      } catch (e) { /* getBBox can throw on hidden SVGs — skip them */ }
    }
  }

  function restoreAfterPrint() {
    for (var i = 0; i < saved.length; i++) {
      var s = saved[i][0], v = saved[i][1];
      if (v === null) s.removeAttribute('viewBox');
      else s.setAttribute('viewBox', v);
    }
    saved = [];
  }

  window.addEventListener('beforeprint', fitForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);
})();
