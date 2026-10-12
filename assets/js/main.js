(function () {
  'use strict';

  // ---- Settings: set the WhatsApp number (international format, digits only, e.g. 9665XXXXXXXX) ----
  var CONFIG = { whatsapp: '' };

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Screenshot tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowLeft') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowRight') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });

  // Client logo: show the image only if the file exists, otherwise keep the text mark
  document.querySelectorAll('[data-client]').forEach(function (box) {
    var img = box.querySelector('[data-client-img]');
    if (!img) return;
    var probe = new Image();
    probe.onload = function () { box.classList.add('has-img'); };
    probe.src = img.getAttribute('src');
  });

  // Play the animated mark when it scrolls into view
  var mark = document.querySelector('.final-mark[data-src]');
  if (mark && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          mark.src = mark.getAttribute('data-src');
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(mark);
  } else if (mark) {
    mark.src = mark.getAttribute('data-src');
  }

  // Sticky mobile button: show once the hero button has scrolled away, hide at the form
  var sticky = document.querySelector('.sticky-cta');
  var heroCta = document.querySelector('.hero-cta');
  var trial = document.getElementById('trial');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    var state = { hero: true, trial: false };
    var update = function () { sticky.classList.toggle('show', !state.hero && !state.trial); };
    new IntersectionObserver(function (en) { state.hero = en[0].isIntersecting; update(); }).observe(heroCta);
    if (trial) new IntersectionObserver(function (en) { state.trial = en[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(trial);
  } else if (sticky) {
    sticky.classList.add('show');
  }

  // Lead form -> WhatsApp message
  var form = document.getElementById('leadForm');
  var msg = document.getElementById('formMsg');
  function say(text, isErr) {
    msg.textContent = text;
    msg.className = 'form-msg' + (isErr ? ' err' : '');
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var bad = false;
      ['office', 'name', 'phone'].forEach(function (k) {
        var empty = !f[k].value.trim();
        f[k].setAttribute('aria-invalid', empty ? 'true' : 'false');
        if (empty) bad = true;
      });
      if (bad) { say('أكمل اسم المكتب واسمك ورقم الجوال.', true); return; }
      var digits = f.phone.value.replace(/[^\d+]/g, '');
      if (digits.replace(/\D/g, '').length < 9) {
        f.phone.setAttribute('aria-invalid', 'true');
        say('رقم الجوال غير مكتمل.', true);
        return;
      }
      if (!CONFIG.whatsapp) {
        say('استقبال الطلبات غير مفعّل بعد. تواصل معنا مباشرة.', true);
        return;
      }
      var text = [
        'السلام عليكم، أرغب بتجربة استقدام360 يومين مجاناً.',
        'المكتب: ' + f.office.value.trim(),
        'الاسم: ' + f.name.value.trim(),
        'الجوال: ' + f.phone.value.trim(),
        f.city.value.trim() ? 'المدينة: ' + f.city.value.trim() : ''
      ].filter(Boolean).join('\n');
      say('جارٍ فتح واتساب لإرسال طلبك.', false);
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
