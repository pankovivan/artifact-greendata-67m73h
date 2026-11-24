(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 940) closeNav();
    });
  }

  /* ---------- gate tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.rail__item'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.gpanel'));

  function activate(tab) {
    var id = tab.getAttribute('data-gate');
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.setAttribute('tabindex', on ? '0' : '-1');
    });
    panels.forEach(function (p) {
      var on = p.getAttribute('data-panel') === id;
      p.hidden = !on;
      p.classList.toggle('is-active', on);
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      activate(next);
      next.focus();
    });
  });

  /* ---------- faq accordion ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- demo form ---------- */
  var form = document.getElementById('demoForm');
  var done = document.getElementById('formDone');
  var error = document.getElementById('formError');
  var reset = document.getElementById('formReset');

  function markError(input, state) {
    if (!input) return;
    input.classList.toggle('is-error', state);
    input.setAttribute('aria-invalid', state ? 'true' : 'false');
  }

  if (form) {
    var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));

    required.forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.type === 'checkbox') return;
        if (el.value.trim()) markError(el, false);
      });
      el.addEventListener('change', function () {
        if (el.type === 'checkbox') markError(el, false);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];

      required.forEach(function (el) {
        if (el.type === 'checkbox') {
          if (!el.checked) bad.push(el);
          return;
        }
        var v = el.value.trim();
        var ok = v.length > 0;
        if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        if (ok && el.type === 'tel') ok = v.replace(/\D/g, '').length >= 10;
        if (!ok) bad.push(el);
      });

      if (bad.length) {
        if (error) error.hidden = false;
        bad.forEach(function (el) { markError(el, true); });
        bad[0].focus({ preventScroll: true });
        bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (error) error.hidden = true;
      if (done) {
        form.hidden = true;
        done.hidden = false;
        done.setAttribute('tabindex', '-1');
        done.focus({ preventScroll: true });
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (reset && done) {
      reset.addEventListener('click', function () {
        form.reset();
        required.forEach(function (el) { markError(el, false); });
        done.hidden = true;
        form.hidden = false;
        var first = form.querySelector('input');
        if (first) first.focus({ preventScroll: true });
      });
    }
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- active nav link ---------- */
  var sections = ['values', 'gates', 'phases', 'features', 'portfolio', 'faq']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length && nav) {
    var links = {};
    Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          links[id].style.color = id === entry.target.id ? 'var(--green-3)' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navIo.observe(s); });
  }
})();
