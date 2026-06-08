// Fade-in on scroll for elements with class .fade-in.
// Pairs with CSS rules in styles.css that handle the actual transition.
// Respects prefers-reduced-motion automatically (the CSS short-circuits).

(function () {
  // Fallback for browsers without IntersectionObserver: just show everything.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();
