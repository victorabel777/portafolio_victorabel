const state = { certificates: [], filter: 'Todos', search: '' };
const chartData = {
  ventas: {
    title: 'Ventas mensuales', primaryLabel: 'TOTAL', primary: '$725k', average: '$121k',
    bestMonth: 'Jun', best: '$156k', delta: '↗ 18.4%', values: [78, 92, 108, 136, 155, 174],
    labels: ['$70k', '$82k', '$97k', '$118k', '$137k', '$156k'],
    insight: 'La tendencia mejora de forma sostenida y junio concentra el valor más alto del periodo.'
  },
  clientes: {
    title: 'Clientes activos', primaryLabel: 'CLIENTES', primary: '1,284', average: '214',
    bestMonth: 'May', best: '251', delta: '↗ 12.1%', values: [105, 121, 137, 148, 174, 162],
    labels: ['151', '174', '196', '213', '251', '234'],
    insight: 'Mayo fue el mes de mayor captación; junio conserva una base superior al inicio del periodo.'
  },
  conversion: {
    title: 'Tasa de conversión', primaryLabel: 'PROMEDIO', primary: '4.8%', average: '4.8%',
    bestMonth: 'Jun', best: '6.1%', delta: '↗ 1.7 pp', values: [82, 92, 104, 116, 140, 166],
    labels: ['3.0%', '3.4%', '3.8%', '4.3%', '5.2%', '6.1%'],
    insight: 'La conversión casi se duplicó; conviene revisar qué cambió en el recorrido durante mayo y junio.'
  }
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function safeUrl(value) {
  try {
    const parsed = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
}

function renderChart(metric = 'ventas') {
  const config = chartData[metric];
  document.querySelector('#chartTitle').textContent = config.title;
  document.querySelector('#primaryLabel').textContent = config.primaryLabel;
  document.querySelector('#primaryValue').textContent = config.primary;
  document.querySelector('#primaryDelta').textContent = config.delta;
  document.querySelector('#averageValue').textContent = config.average;
  document.querySelector('#bestMonth').textContent = config.bestMonth;
  document.querySelector('#bestValue').textContent = config.best;
  document.querySelector('#chartInsight').textContent = config.insight;
  document.querySelector('#interactiveChart').innerHTML = config.values.map((value, index) => `
    <div class="bar-column">
      <div class="bar" style="height:${value / 1.8}%;animation-delay:${index * 60}ms"><b>${escapeHtml(config.labels[index])}</b></div>
      <small>${['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'][index]}</small>
    </div>
  `).join('');
}

function renderCertificates() {
  const normalizedSearch = state.search.toLocaleLowerCase('es');
  const filtered = state.certificates.filter(certificate => {
    const matchesArea = state.filter === 'Todos' || certificate.area === state.filter;
    const searchable = `${certificate.name} ${certificate.issuer} ${certificate.area}`.toLocaleLowerCase('es');
    return matchesArea && searchable.includes(normalizedSearch);
  });
  const mosaic = document.querySelector('#certificateMosaic');
  const empty = document.querySelector('#emptyState');
  empty.hidden = filtered.length > 0;
  mosaic.innerHTML = filtered.map(certificate => {
    const preview = certificate.preview
      ? `<img src="${escapeHtml(safeUrl(certificate.preview))}" alt="" loading="lazy">`
      : `<div class="certificate-fallback"><span>${escapeHtml(certificate.name.slice(0, 1))}</span></div>`;
    return `
      <a class="certificate-card" href="${escapeHtml(safeUrl(certificate.url))}" target="_blank" rel="noopener">
        <div class="certificate-media">${preview}</div>
        <span class="certificate-open">↗</span>
        <div class="certificate-content">
          <div class="certificate-meta"><span class="certificate-area">${escapeHtml(certificate.area)}</span><span class="certificate-date">${escapeHtml(certificate.date)}</span></div>
          <h3>${escapeHtml(certificate.name)}</h3>
          <p>${escapeHtml(certificate.issuer)}</p>
        </div>
      </a>`;
  }).join('');
}

async function loadPortfolio() {
  try {
    const response = await fetch('../assets/data/portfolio.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No disponible');
    const data = await response.json();
    state.certificates = Array.isArray(data.certificates) ? data.certificates : [];
    document.querySelector('#credentialMetric').textContent = String(state.certificates.length).padStart(2, '0');
    renderCertificates();
  } catch {
    document.querySelector('#certificateMosaic').innerHTML = '<p class="loading">No fue posible cargar las credenciales. Intenta recargar la página.</p>';
  }
}

document.querySelectorAll('.metric-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.metric-tab').forEach(item => item.classList.toggle('active', item === button));
  renderChart(button.dataset.metric);
}));

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  state.filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  renderCertificates();
}));

document.querySelector('#certificateSearch').addEventListener('input', event => {
  state.search = event.target.value.trim();
  renderCertificates();
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.addEventListener('pointermove', event => {
    document.documentElement.style.setProperty('--x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--y', `${event.clientY}px`);
  }, { passive: true });
}

renderChart();
loadPortfolio();
