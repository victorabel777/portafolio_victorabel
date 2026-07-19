const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-menu');
const menuLinks = [...document.querySelectorAll('.main-menu a')];
const sections = [...document.querySelectorAll('main section[id]')];

function closeMenu() {
  menu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const willOpen = !menu.classList.contains('open');
  menu.classList.toggle('open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  document.body.classList.toggle('menu-open', willOpen);
});

menuLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    menuLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

const playground = document.querySelector('.hero-playground');
if (playground && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  playground.addEventListener('pointermove', event => {
    const rect = playground.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    playground.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  playground.addEventListener('pointerleave', () => {
    playground.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  });
}

async function hydratePublicData() {
  try {
    const response = await fetch('assets/data/portfolio.json', { cache: 'no-store' });
    if (!response.ok) return;
    const portfolio = await response.json();
    const availability = document.querySelector('.status-pill');
    if (availability && portfolio.profile?.availability) {
      availability.innerHTML = `<span></span> ${escapeText(portfolio.profile.availability)}`;
    }
    (portfolio.projects || []).forEach(project => {
      const card = document.querySelector(`[data-project-id="${CSS.escape(project.id)}"]`);
      if (card && project.liveUrl) card.href = project.liveUrl;
    });
  } catch {
    // El contenido base permanece disponible si el archivo de datos no carga.
  }
}

function escapeText(value) {
  const temporary = document.createElement('span');
  temporary.textContent = String(value);
  return temporary.innerHTML;
}

if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('pointermove', event => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });
}

hydratePublicData();
