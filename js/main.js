// Feature clips load when they come near the viewport and play only while visible.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".hero-video");
  if (hero && reduceMotion) { hero.pause(); hero.removeAttribute("autoplay"); }

  var clips = Array.prototype.slice.call(document.querySelectorAll("video[data-src]"));
  if (!("IntersectionObserver" in window)) {
    clips.forEach(function (v) { v.src = v.dataset.src; v.controls = reduceMotion; });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; }
        if (reduceMotion) { v.controls = true; return; }
        var p = v.play();
        if (p && p.catch) { p.catch(function () { v.controls = true; }); }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.25 });

  clips.forEach(function (v) { observer.observe(v); });
})();
