/* ═══════════════════════════════════════
   AQUILA — script.js
   Logica condivisa tra tutte le pagine
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Anno nel footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Custom Cursor (solo desktop)
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (cursor && ring && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .portfolio-card, .s2i-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform = 'translate(-50%, -50%) scale(3)';
        ring.style.borderColor = 'rgba(200,169,110,1)';
        ring.style.width = '48px';
        ring.style.height = '48px';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.borderColor = 'rgba(200,169,110,0.7)';
        ring.style.width = '36px';
        ring.style.height = '36px';
      });
    });
  }

  // ── Navbar sticky scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── Mobile menu toggle
  const toggler = document.getElementById('navToggler');
  const navLinks = document.getElementById('navLinks');
  if (toggler && navLinks) {
    toggler.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      toggler.classList.toggle('open', open);
      toggler.setAttribute('aria-expanded', open);
    });
    // Chiudi menu al click su link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggler.classList.remove('open');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Fade-up on scroll
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ── Skill bars animate on scroll (pagina CV)
  var skillFills = document.querySelectorAll('.cv-skill-fill');
  if (skillFills.length) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(function (el) { skillObserver.observe(el); });
  }

  // ── Portfolio Filter (pagina portfolio)
  var filterBtns = document.querySelectorAll('.portfolio-filter button');
  var portfolioCards = document.querySelectorAll('.portfolio-card');
  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        portfolioCards.forEach(function (card) {
          var match = filter === 'all' || card.dataset.category === filter;
          card.style.transition = 'opacity 0.35s, transform 0.35s';
          if (match) {
            card.style.display = '';
            setTimeout(function () { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.97)';
            setTimeout(function () { card.style.display = 'none'; }, 360);
          }
        });
      });
    });
  }

  // ── Portfolio Tabs (pagina portfolio)
  var tabs = document.querySelectorAll('.portfolio-tab');
  var panels = document.querySelectorAll('.portfolio-panel');
  var generalGrid = document.getElementById('generalGrid');
  var generalCta = document.getElementById('generalCta');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var panelId = tab.getAttribute('aria-controls');
        document.getElementById(panelId).classList.add('active');
        var isGeneral = panelId === 'panel-general';
        if (generalGrid) generalGrid.style.display = isGeneral ? '' : 'none';
        if (generalCta) generalCta.style.display = isGeneral ? '' : 'none';
      });
    });
  }

  // ── Form contatti (pagina contatti)
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {

    function validateField(id, errorId, checkFn, message) {
      var el = document.getElementById(id);
      var err = document.getElementById(errorId);
      if (!el || !err) return true;
      if (!checkFn(el)) {
        err.textContent = message;
        el.style.borderBottomColor = '#ef4444';
        return false;
      }
      err.textContent = '';
      el.style.borderBottomColor = '#c8a96e';
      return true;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      valid &= validateField('nome', 'nome-error', function (el) { return el.value.trim().length >= 2; }, 'Inserisci il tuo nome (almeno 2 caratteri)');
      valid &= validateField('email', 'email-error', function (el) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()); }, 'Inserisci un indirizzo email valido');
      valid &= validateField('oggetto', 'oggetto-error', function (el) { return el.value.trim().length >= 3; }, 'Inserisci un oggetto');
      valid &= validateField('messaggio', 'messaggio-error', function (el) { return el.value.trim().length >= 20; }, 'Il messaggio deve essere di almeno 20 caratteri');

      var privacy = document.getElementById('privacy');
      var privacyErr = document.getElementById('privacy-error');
      if (privacy && !privacy.checked) {
        privacyErr.textContent = 'Devi accettare la privacy policy per proseguire';
        valid = false;
      } else if (privacyErr) {
        privacyErr.textContent = '';
      }

      if (!valid) return;

      var btn = document.getElementById('submitBtn');
      var status = document.getElementById('submitStatus');
      btn.disabled = true;
      btn.textContent = 'invio in corso...';

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = 'invia messaggio';
        status.textContent = '✓ Messaggio inviato. Ti risponderò entro 24 ore.';
        status.style.color = '#4ade80';
        contactForm.reset();
        document.querySelectorAll('.form-control').forEach(function (el) { el.style.borderBottomColor = ''; });
      }, 1800);
    });

    // Validazione real-time su blur
    var realtimeFields = [
      ['nome', 'nome-error', function (el) { return el.value.trim().length >= 2; }, 'Inserisci il tuo nome'],
      ['email', 'email-error', function (el) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()); }, 'Email non valida'],
      ['messaggio', 'messaggio-error', function (el) { return el.value.trim().length >= 20; }, 'Messaggio troppo breve']
    ];
    realtimeFields.forEach(function (args) {
      var el = document.getElementById(args[0]);
      if (el) el.addEventListener('blur', function () { validateField(args[0], args[1], args[2], args[3]); });
    });
  }

});