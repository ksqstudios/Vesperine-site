// Vesperine. Three small things, none of which store or send anything.
//
// 1. The candle burns down: the glow in the corner dims as you read toward
//    the end of the page.
// 2. An example evening in the hero: an entry writes itself, Commit is
//    pressed, and a reflection appears under the flame. The entries and
//    reflections are written ahead of time for this page.
// 3. Looking back: the lines arrive one at a time, and the two ranges
//    trade places.

(function () {
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // ---------- 1. The candle ----------

  function burn() {
    var max = root.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, scrollY / max) : 0;
    root.style.setProperty('--burn', (1 - 0.7 * p).toFixed(3));
  }
  if (document.querySelector('.candle')) {
    addEventListener('scroll', burn, { passive: true });
    addEventListener('resize', burn);
    burn();
  }

  // ---------- 2. An example evening ----------

  var fig = document.getElementById('tonight');
  if (fig) {
    var evenings = [
      {
        entry: 'Long drive back from the shore. Everyone slept except me. Stopped for gas somewhere outside Dover and stood in the lot a minute before getting back in.',
        reflection: 'You stood in the lot outside Dover while everyone else slept. For a minute the drive was only yours.'
      },
      {
        entry: 'Kids were loud all evening and I did not mind it as much as I usually do.',
        reflection: 'The noise was the same as most evenings. What changed tonight was how much of it you minded.'
      },
      {
        entry: 'Could not settle tonight. Kept picking up my phone and putting it down again.',
        reflection: 'You kept reaching for the phone and setting it back down. The evening did not settle, and you noticed that it didn’t.'
      }
    ];

    var text = document.getElementById('t-text');
    var reflection = document.getElementById('t-reflection');
    var commit = document.getElementById('t-commit');
    var again = document.getElementById('t-again');
    var n = 0, timers = [];

    // Today's date, the way the app writes it.
    var now = new Date();
    document.getElementById('t-date').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    document.getElementById('t-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }

    function show(evening) {
      clear();
      fig.classList.remove('is-reflecting', 'is-done');
      commit.classList.remove('is-pressed');
      again.hidden = true;
      reflection.textContent = '';

      if (still) {
        text.textContent = evening.entry;
        reflection.textContent = evening.reflection;
        fig.classList.add('is-done');
        again.hidden = false;
        return;
      }

      text.textContent = '';
      var i = 0, s = evening.entry;
      (function type() {
        if (i >= s.length) { later(press, 900); return; }
        text.textContent += s[i];
        var c = s[i++];
        var wait = 26 + Math.random() * 40;
        if (c === '.') wait += 380;
        else if (c === ',') wait += 160;
        later(type, wait);
      })();

      function press() {
        commit.classList.add('is-pressed');
        later(function () {
          commit.classList.remove('is-pressed');
          fig.classList.add('is-reflecting');
          later(reflect, 1100);
        }, 220);
      }

      function reflect() {
        var words = evening.reflection.split(' ');
        reflection.innerHTML = '';
        var spans = words.map(function (w, k) {
          var el = document.createElement('span');
          el.className = 'w';
          el.textContent = w + (k < words.length - 1 ? ' ' : '');
          reflection.appendChild(el);
          return el;
        });
        spans.forEach(function (el, k) {
          later(function () { el.classList.add('on'); }, k * 120);
        });
        later(function () {
          fig.classList.remove('is-reflecting');
          fig.classList.add('is-done');
          again.hidden = false;
        }, spans.length * 120 + 900);
      }
    }

    again.addEventListener('click', function () {
      n = (n + 1) % evenings.length;
      show(evenings[n]);
    });

    setTimeout(function () { show(evenings[0]); }, still ? 0 : 700);
  }

  // ---------- 3. Looking back ----------

  var look = document.getElementById('lookback');
  if (look) {
    var lists = look.querySelectorAll('.lines');
    var chips = look.querySelectorAll('.chip');
    var seen = false;

    function reveal(list) {
      list.classList.remove('is-shown');
      void list.offsetWidth;
      list.classList.add('is-shown');
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-selected', c === chip ? 'true' : 'false'); });
        lists.forEach(function (l) {
          var on = l.dataset.range === chip.dataset.range;
          l.hidden = !on;
          if (on) reveal(l);
        });
      });
    });

    if (still || !('IntersectionObserver' in window)) {
      lists.forEach(function (l) { l.classList.add('is-shown'); });
    } else {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting && !seen) {
          seen = true;
          reveal(look.querySelector('.lines:not([hidden])'));
          obs.disconnect();
        }
      }, { threshold: 0.35 }).observe(look.querySelector('.sheet'));
    }
  }
})();
