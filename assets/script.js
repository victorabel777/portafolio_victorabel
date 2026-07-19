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

hydratePublicData();
