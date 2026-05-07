/* ═══════════════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
═══════════════════════════════════════════════════ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', theme);
}

function getTheme() {
  return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* System preference listener */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

/* ═══════════════════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 48);
}, { passive: true });

/* ═══════════════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMobile  = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMobile.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ═══════════════════════════════════════════════════
   TYPEWRITER EFFECT
═══════════════════════════════════════════════════ */
const phrases = [
  'Program Manager & Engineering Team Lead',
  'USMC Officer — Embassy Security Group',
  'Emerging Technology Evaluator',
  'AI-Native Workflow Architect',
  'Active Top Secret Clearance',
];

let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;
const typeEl   = document.getElementById('typewriter');

function type() {
  const current  = phrases[phraseIdx];
  const displayed = isDeleting
    ? current.slice(0, charIdx - 1)
    : current.slice(0, charIdx + 1);

  typeEl.innerHTML = displayed + '<span class="cursor-blink"></span>';
  charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

  let delay = isDeleting ? 40 : 75;

  if (!isDeleting && charIdx === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 420;
  }

  setTimeout(type, delay);
}
type();

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL — section containers
═══════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════════════
   STAGGER CHILDREN REVEAL
═══════════════════════════════════════════════════ */
const staggerParents = document.querySelectorAll(
  '.skills-grid, .about-stats, .projects-grid, .edu-grid, .timeline'
);
const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    Array.from(entry.target.children).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(22px)';
      child.style.transition = `opacity .55s ease ${i * 75}ms, transform .55s ease ${i * 75}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }));
    });
    staggerObs.unobserve(entry.target);
  });
}, { threshold: 0.08 });

staggerParents.forEach(el => staggerObs.observe(el));

/* ═══════════════════════════════════════════════════
   PROJECT CARD EXPAND / COLLAPSE
═══════════════════════════════════════════════════ */
document.querySelectorAll('.project-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card     = btn.closest('.project-card');
    const expanded = card.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', String(expanded));
    btn.setAttribute('aria-label', expanded ? 'Collapse details' : 'Expand details');
  });
});

/* ═══════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════ */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 420);
}, { passive: true });

/* ═══════════════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT
═══════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObs.observe(s));

/* ═══════════════════════════════════════════════════
   CONTACT FORM VALIDATION
═══════════════════════════════════════════════════ */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function setError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errorId).textContent = message;
  return false;
}
function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => clearError(id, id + 'Error'));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  clearError('name', 'nameError');
  clearError('email', 'emailError');
  clearError('message', 'messageError');

  if (!name)    valid = setError('name',    'nameError',    'Please enter your full name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                valid = setError('email',   'emailError',   'Please enter a valid email address.');
  if (!message) valid = setError('message', 'messageError', 'Please enter a message.');

  if (!valid) return;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  /* Simulated send — replace with Formspree endpoint when ready */
  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

/* ═══════════════════════════════════════════════════
   ROBOT MASCOT
═══════════════════════════════════════════════════ */
(function () {
  const wrap     = document.getElementById('mascotWrap');
  const textEl   = document.getElementById('mascotText');
  const dismissBtn = document.getElementById('mascotDismiss');
  const robot    = document.getElementById('mascotRobot');

  const message  = "Hi! 👋 My name is Yusef — welcome to my page! I'm happy to work with you!";

  let typed = false;

  function typeMessage() {
    if (typed) return;
    typed = true;
    textEl.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      textEl.textContent = message.slice(0, i);
      i++;
      if (i > message.length) clearInterval(iv);
    }, 36);
  }

  function showRobot() {
    wrap.classList.add('visible');
    setTimeout(typeMessage, 700);
  }

  function hideRobot() {
    wrap.classList.remove('visible');
  }

  /* Dismiss button */
  dismissBtn.addEventListener('click', hideRobot);

  /* Clicking the robot hides it */
  robot.addEventListener('click', hideRobot);

  /* Auto-appear after 1.6 s — once per session */
  if (!sessionStorage.getItem('robotSeen')) {
    setTimeout(() => {
      showRobot();
      sessionStorage.setItem('robotSeen', '1');
    }, 1600);
  }
})();

/* ═══════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (with navbar offset)
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
