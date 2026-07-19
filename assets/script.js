const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-menu');
const menuLinks = [...document.querySelectorAll('.main-menu a[href^="#"]')];
const header = document.querySelector('.site-header');
const sections = [...document.querySelectorAll('main section[id]')];
const projectCases = [...document.querySelectorAll('.project-case')];
const filterButtons = [...document.querySelectorAll('.filter-button')];

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

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 65}ms`;
  revealObserver.observe(element);
});

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    menuLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-34% 0px -58%', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    projectCases.forEach(project => {
      const categories = project.dataset.category?.split(' ') || [];
      project.hidden = filter !== 'all' && !categories.includes(filter);
    });
  });
});

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
      const liveLink = card?.querySelector('.case-actions .button');
      if (liveLink && project.liveUrl) liveLink.href = project.liveUrl;
    });
  } catch {
    // El contenido base sigue disponible si el archivo de datos no carga.
  }
}

function escapeText(value) {
  const temporary = document.createElement('span');
  temporary.textContent = String(value);
  return temporary.innerHTML;
}

hydratePublicData();
