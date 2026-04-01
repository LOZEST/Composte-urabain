document.documentElement.classList.add('js-enabled');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const topProgress = document.getElementById('topProgress');
const topbar = document.querySelector('.topbar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (topProgress) topProgress.style.width = ratio + '%';
  if (topbar) topbar.classList.toggle('scrolled', scrollTop > 12);
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('load', updateProgress);

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

const tiltTargets = document.querySelectorAll('[data-tilt]');

tiltTargets.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.innerWidth < 981) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
