/*
 * ============================================================
 * SIGNALYSE — main.js
 * ============================================================
 * Behaviours:
 *   1. Sticky nav border    — appears at 80px scroll depth
 *   2. Mobile menu toggle   — hamburger → full-screen overlay
 *   3. Calendar modal       — focus-trapped, ESC closes
 *   4. Smooth scroll        — anchor links with nav-height offset
 *   5. Fade-in              — IntersectionObserver, reduced-motion safe
 *   6. Active nav highlight — reads current page filename
 *   7. Contact form         — mailto fallback
 *
 * EDIT ME: search "EDIT ME" to find the form endpoint swap point.
 * ============================================================
 */

(function () {
  'use strict';

  /* ── 1. Sticky nav border ── */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ── 2. Mobile menu ── */
  var hamburger  = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuClose  = document.getElementById('menu-close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('aria-hidden');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose && menuClose.focus();
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger && hamburger.focus();
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── 3. Calendar modal ── */
  var calModal     = document.getElementById('cal-modal');
  var calClose     = document.getElementById('cal-modal-close');
  var calTriggers  = document.querySelectorAll('[data-cal-trigger]');

  function openModal() {
    if (!calModal) return;
    calModal.classList.add('is-open');
    calModal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    calClose && calClose.focus();
  }

  function closeModal() {
    if (!calModal) return;
    calModal.classList.remove('is-open');
    calModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  calTriggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  if (calClose) calClose.addEventListener('click', closeModal);

  if (calModal) {
    calModal.addEventListener('click', function (e) {
      if (e.target === calModal) closeModal();
    });

    /* Focus trap inside modal */
    calModal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = Array.from(calModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ── Global ESC key handler ── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMenu();
    if (calModal  && calModal.classList.contains('is-open'))   closeModal();
  });

  /* ── 4. Smooth scroll with header offset ── */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var id = anchor.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    var navH = header ? header.offsetHeight : 64;
    var top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  /* ── 5. IntersectionObserver fade-in ── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── 6. Active nav highlight ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) link.setAttribute('aria-current', 'page');
  });

  /* ── 7. Contact form — mailto fallback ──
     EDIT ME: Replace the window.location.href line below with a
     fetch() POST to your Formspree or Web3Forms endpoint, e.g.:
       fetch('https://formspree.io/f/YOUR_ID', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
         body: JSON.stringify({ name: name, email: email, message: message })
       }).then(function(r) { if (r.ok) { showSuccess(); } });
       e.preventDefault();
  */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (contactForm.querySelector('[name="name"]').value    || '').trim();
      var email   = (contactForm.querySelector('[name="email"]').value   || '').trim();
      var message = (contactForm.querySelector('[name="message"]').value || '').trim();
      var subject = encodeURIComponent('Enquiry from ' + (name || 'your website'));
      var body    = encodeURIComponent(
        'Name: '  + name  + '\n' +
        'Email: ' + email + '\n\n' +
        message
      );
      window.location.href =
        'mailto:alex@signalyse.co.uk?subject=' + subject + '&body=' + body;
    });
  }

}());
