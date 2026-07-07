// ===== Mobile nav toggle =====
const burger = document.getElementById('burger');
const navlinks = document.getElementById('navlinks');
if (burger) {
  burger.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navlinks.classList.remove('open'))
  );
}

// ===== Active nav link based on current page =====
(function highlightActive() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a[data-page]').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });
})();

// ===== Scroll reveal animation =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

// ===== Copy to clipboard (contact page) =====
document.querySelectorAll('[data-copy]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const value = el.dataset.copy;
    navigator.clipboard.writeText(value).then(() => {
      const original = el.dataset.label || el.textContent;
      el.textContent = 'Copied ✓';
      setTimeout(() => { el.textContent = original; }, 1500);
    });
  });
});

// ===== Contact form (static — opens mail client) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    const subject = encodeURIComponent('Project Inquiry from ' + (name || 'Website'));
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = `mailto:likivonsystems@gmail.com?subject=${subject}&body=${body}`;
  });
}

// ===== Terminal boot sequence (home page only) =====
const term = document.getElementById('termBody');
if (term) {
  const lines = [
    { text: '$ likivon deploy --env=production', cls: '' },
    { text: '> resolving dependencies... ', ok: 'done' },
    { text: '> compiling secure modules (JWT, Laravel)... ', ok: 'ok' },
    { text: '> provisioning cloud infrastructure... ', ok: 'ok' },
    { text: '> running security audit... ', ok: '0 vulnerabilities' },
    { text: '> status: ', ok: 'ALL SYSTEMS OPERATIONAL' },
    { text: '$ _', raw: true }
  ];
  function renderLine(l) {
    const div = document.createElement('div');
    div.className = 'line';
    if (l.raw) { div.innerHTML = l.text.replace('_', '<span class="cursor"></span>'); return div; }
    div.innerHTML = l.text + (l.ok ? '<span class="ok path">' + l.ok + '</span>' : '');
    return div;
  }
  if (reduceMotion) {
    lines.forEach(l => term.appendChild(renderLine(l)));
  } else {
    let i = 0;
    (function step() {
      if (i < lines.length) {
        term.appendChild(renderLine(lines[i]));
        i++;
        setTimeout(step, i === lines.length ? 0 : 420);
      }
    })();
  }
}
