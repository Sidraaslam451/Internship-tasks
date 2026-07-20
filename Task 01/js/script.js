// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- Animated stat counters ----------
const counters = document.querySelectorAll('[data-count]');
counters.forEach(counter => {
  const target = parseInt(counter.getAttribute('data-count'), 10);
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = current;
    }, 30);
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { start(); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    obs.observe(counter);
  } else {
    start();
  }
});

// ---------- Live request ticker (home page only) ----------
const reqTicker = document.getElementById('reqTicker');
if (reqTicker) {
  let base = 128402119;
  setInterval(() => {
    base += Math.floor(Math.random() * 40) + 5;
    reqTicker.textContent = base.toLocaleString('en-US') + ' requests routed';
  }, 2200);
}

// ---------- Contact form validation + real submission (Formspree) ----------
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name', check: v => v.trim().length > 0 },
      { id: 'email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'message', check: v => v.trim().length > 0 }
    ];

    fields.forEach(({ id, check }) => {
      const input = document.getElementById(id);
      const errorEl = document.querySelector(`.field-error[data-for="${id}"]`);
      const ok = check(input.value);
      if (!ok) {
        valid = false;
        errorEl.style.display = 'block';
        input.style.borderColor = '#B03A2E';
      } else {
        errorEl.style.display = 'none';
        input.style.borderColor = '';
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('formSuccess');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      statusEl.style.display = 'block';
      if (res.ok) {
        statusEl.style.color = 'var(--moss-500)';
        statusEl.textContent = "Thanks — we'll be in touch within one business day.";
        form.reset();
      } else {
        statusEl.style.color = '#B03A2E';
        statusEl.textContent = 'Something went wrong — please email us directly.';
      }
    } catch (err) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#B03A2E';
      statusEl.textContent = 'Connection error — please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}