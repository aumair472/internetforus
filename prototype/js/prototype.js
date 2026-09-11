/* ==========================================================================
   Offline prototype — interactivity ported from ../js/main.js.
   Only what the flattened-image prototype actually needs: the HOTLINE
   constant + [data-hotline] wiring, the ZIP-checker + shared modal (both
   on-page instances), and Esc/focus-trap/backdrop modal handling. The
   live site's header-scroll and FAQ-accordion logic isn't needed here —
   there's no sticky header or expandable FAQ in this prototype.
   ========================================================================== */
(function () {
  'use strict';

  /* Keep in sync with ../js/main.js. */
  const HOTLINE = {
    tel: '+18888446168',
    display: '+1 (888) 844-6168'
  };

  function applyHotline() {
    document.querySelectorAll('[data-hotline]').forEach(function (el) {
      if (el.tagName === 'A') el.setAttribute('href', 'tel:' + HOTLINE.tel);
      if (el.hasAttribute('data-label-from-hotline')) el.textContent = HOTLINE.display;
    });
  }

  /* ======================================================================
     MODAL — the ZIP availability popup (identical to the live site)
     ====================================================================== */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
                    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let openModal = null;
  let lastFocused = null;

  function showModal(modal) {
    if (!modal || openModal === modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    openModal = modal;
    document.body.style.overflow = 'hidden';

    const first = modal.querySelector(FOCUSABLE);
    if (first) first.focus();
  }

  function hideModal(modal) {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    if (openModal === modal) openModal = null;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function trapFocus(container, event) {
    const items = Array.prototype.filter.call(
      container.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideModal(modal);
    });
    modal.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { hideModal(modal); });
    });
  });

  /* ======================================================================
     ZIP CHECKER — same validation as the live site.
     Both on-page instances share this one modal.
     ====================================================================== */
  const zipModal = document.getElementById('zip-modal');

  document.querySelectorAll('[data-zip-finder]').forEach(function (finder) {
    const input = finder.querySelector('[data-zip-input]');
    const button = finder.querySelector('[data-zip-btn]');
    const errorEl = finder.querySelector('[data-zip-error]');
    if (!input || !button || !errorEl) return;

    function clearError() {
      errorEl.textContent = '';
      input.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    function handleZip() {
      const zip = (input.value || '').trim();

      if (!/^\d{5}$/.test(zip)) {
        errorEl.textContent = 'Please enter a valid 5-digit ZIP code.';
        input.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }

      clearError();
      showModal(zipModal);
    }

    input.addEventListener('input', function () {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 5);
      clearError();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleZip();
      }
    });

    button.addEventListener('click', handleZip);
  });

  /* ======================================================================
     GLOBAL KEYBOARD HANDLING — Esc closes, Tab stays trapped
     ====================================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openModal) {
      hideModal(openModal);
      return;
    }
    if (e.key === 'Tab' && openModal) trapFocus(openModal, e);
  });

  /* ======================================================================
     Smooth scroll for the footer's in-page Privacy Policy hotspot
     ====================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  applyHotline();
})();
