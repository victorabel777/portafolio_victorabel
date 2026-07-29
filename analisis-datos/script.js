const chartData = {
  ventas: {
    title: 'Ventas mensuales',
    primaryLabel: 'INGRESOS',
    primary: '$725k',
    average: '$121k',
    bestMonth: 'Junio',
    best: '$156k',
    delta: '+18.4%',
    values: [70, 82, 97, 118, 137, 156],
    labels: ['$70k', '$82k', '$97k', '$118k', '$137k', '$156k'],
    insight: 'El crecimiento se acelera durante el segundo trimestre y junio concentra el mayor valor del periodo.'
  },
  clientes: {
    title: 'Clientes activos',
    primaryLabel: 'CLIENTES',
    primary: '1,284',
    average: '214',
    bestMonth: 'Mayo',
    best: '251',
    delta: '+12.1%',
    values: [151, 174, 196, 213, 251, 234],
    labels: ['151', '174', '196', '213', '251', '234'],
    insight: 'Mayo registra la captación más alta; junio conserva una base 55% superior al inicio del periodo.'
  },
  conversion: {
    title: 'Tasa de conversión',
    primaryLabel: 'PROMEDIO',
    primary: '4.8%',
    average: '4.8%',
    bestMonth: 'Junio',
    best: '6.1%',
    delta: '+1.7 pp',
    values: [3, 3.4, 3.8, 4.3, 5.2, 6.1],
    labels: ['3.0%', '3.4%', '3.8%', '4.3%', '5.2%', '6.1%'],
    insight: 'La conversión casi se duplicó. Conviene aislar los cambios de canal, oferta y recorrido aplicados desde mayo.'
  }
};

const certificateState = { certificates: [], filter: 'Todos', search: '' };
const monthLabels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
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
  const max = Math.max(...config.values);
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
      <div class="bar" style="height:${Math.max(12, value / max * 82)}%;animation-delay:${index * 55}ms">
        <b>${escapeHtml(config.labels[index])}</b>
      </div>
      <small>${monthLabels[index]}</small>
    </div>
  `).join('');
}

document.querySelectorAll('.metric-tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.metric-tab').forEach(item => item.classList.toggle('active', item === button));
    renderChart(button.dataset.metric);
  });
});

function formatMoney(value) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(value || 0);
}

function calculateKpis() {
  const revenue = Math.max(0, Number(document.querySelector('#revenueInput').value) || 0);
  const orders = Math.max(1, Number(document.querySelector('#ordersInput').value) || 1);
  const leads = Math.max(1, Number(document.querySelector('#leadsInput').value) || 1);
  const conversions = Math.max(0, Number(document.querySelector('#conversionsInput').value) || 0);
  const ticket = revenue / orders;
  const conversion = conversions / leads * 100;
  const leadValue = revenue / leads;

  document.querySelector('#ticketResult').textContent = formatMoney(ticket);
  document.querySelector('#conversionResult').textContent = `${conversion.toFixed(2)}%`;
  document.querySelector('#leadValueResult').textContent = formatMoney(leadValue);

  let recommendation = 'La conversión es saludable. El siguiente análisis debe comparar canales y costo de adquisición.';
  if (conversion < 2) recommendation = 'La conversión es baja. Conviene revisar la calidad de los leads, el mensaje y los puntos de abandono.';
  if (conversion >= 10) recommendation = 'La conversión es alta. Conviene validar la calidad de los datos y escalar primero el canal con mejor margen.';
  document.querySelector('#kpiRecommendation').textContent = recommendation;
}

document.querySelector('#kpiForm').addEventListener('input', calculateKpis);

function detectDelimiter(line) {
  const candidates = [',', ';', '\t'];
  return candidates.sort((a, b) => line.split(b).length - line.split(a).length)[0];
}

function parseCsvLine(line, delimiter) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      values.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCsv(text) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) throw new Error('El archivo está vacío.');
  const lines = normalized.split('\n').filter(line => line.trim());
  const delimiter = detectDelimiter(lines[0]);
  const rows = lines.map(line => parseCsvLine(line, delimiter));
  const width = Math.max(...rows.map(row => row.length));
  return rows.map(row => [...row, ...Array(Math.max(0, width - row.length)).fill('')]);
}

function isNumericColumn(values) {
  const populated = values.filter(value => value !== '');
  if (!populated.length) return false;
  const numeric = populated.filter(value => Number.isFinite(Number(value.replace(',', '.'))));
  return numeric.length / populated.length >= .8;
}

function renderCsvAnalysis(rows, fileName) {
  const headers = rows[0].map((header, index) => header || `Columna ${index + 1}`);
  const data = rows.slice(1);
  const missing = data.reduce((total, row) => total + row.filter(value => value === '').length, 0);
  const numericFlags = headers.map((_, index) => isNumericColumn(data.map(row => row[index])));
  const completeness = data.length && headers.length
    ? Math.max(0, 100 - missing / (data.length * headers.length) * 100)
    : 100;

  document.querySelector('#csvRows').textContent = data.length.toLocaleString('es-MX');
  document.querySelector('#csvColumns').textContent = headers.length.toLocaleString('es-MX');
  document.querySelector('#csvMissing').textContent = missing.toLocaleString('es-MX');
  document.querySelector('#csvNumeric').textContent = numericFlags.filter(Boolean).length.toLocaleString('es-MX');
  document.querySelector('#fileStatus').textContent = `${fileName} · análisis completado en tu navegador`;
  document.querySelector('#csvResults').hidden = false;

  const qualityItems = [
    ['Completitud', `${completeness.toFixed(1)}%`],
    ['Columnas numéricas', `${numericFlags.filter(Boolean).length} de ${headers.length}`],
    ['Filas para vista previa', `${Math.min(data.length, 8)} de ${data.length}`]
  ];
  document.querySelector('#qualityList').innerHTML = qualityItems.map(([label, value]) =>
    `<div class="quality-item"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`
  ).join('');

  const previewRows = data.slice(0, 8);
  document.querySelector('#csvPreview').innerHTML = `
    <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
    <tbody>${previewRows.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value || '—')}</td>`).join('')}</tr>`).join('')}</tbody>
  `;
}

async function handleCsv(file) {
  const status = document.querySelector('#fileStatus');
  document.querySelector('#csvResults').hidden = true;
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    status.textContent = 'El archivo supera el límite de 4 MB.';
    return;
  }
  if (!file.name.toLocaleLowerCase('es').endsWith('.csv')) {
    status.textContent = 'Selecciona un archivo con extensión .csv.';
    return;
  }
  status.textContent = 'Analizando estructura…';
  try {
    const rows = parseCsv(await file.text());
    if (rows.length < 2) throw new Error('Se requiere una fila de encabezados y al menos una fila de datos.');
    renderCsvAnalysis(rows, file.name);
  } catch (error) {
    status.textContent = error.message || 'No fue posible interpretar el archivo.';
  }
}

const csvInput = document.querySelector('#csvInput');
const dropZone = document.querySelector('#dropZone');
csvInput.addEventListener('change', () => handleCsv(csvInput.files[0]));
['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, event => {
  event.preventDefault();
  dropZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, event => {
  event.preventDefault();
  dropZone.classList.remove('dragging');
}));
dropZone.addEventListener('drop', event => handleCsv(event.dataTransfer.files[0]));

function renderCertificates() {
  const search = certificateState.search.toLocaleLowerCase('es');
  const filtered = certificateState.certificates.filter(certificate => {
    const matchesArea = certificateState.filter === 'Todos' || certificate.area === certificateState.filter;
    const searchable = `${certificate.name} ${certificate.issuer} ${certificate.area}`.toLocaleLowerCase('es');
    return matchesArea && searchable.includes(search);
  });

  const container = document.querySelector('#certificateMosaic');
  document.querySelector('#emptyState').hidden = filtered.length > 0;
  container.innerHTML = filtered.map(certificate => {
    const verification = certificate.verificationUrl
      ? `<a class="secondary-link" href="${escapeHtml(safeUrl(certificate.verificationUrl))}" target="_blank" rel="noopener">Verificar ↗</a>`
      : '';
    const documentLabel = certificate.url.toLocaleLowerCase('es').endsWith('.pdf') ? 'Abrir PDF' : 'Ver insignia';
    const cardClass = certificate.id === 'fundamentos-ia-generativa' ? ' certificate-card-badge' : '';
    return `
      <article class="certificate-card${cardClass}">
        <div class="certificate-media"><img src="${escapeHtml(safeUrl(certificate.preview))}" alt="Vista previa de ${escapeHtml(certificate.name)}" loading="lazy"></div>
        <div class="certificate-content">
          <div class="certificate-meta"><span>${escapeHtml(certificate.area)}</span><span>${escapeHtml(certificate.date)}</span></div>
          <h3>${escapeHtml(certificate.name)}</h3>
          <p>${escapeHtml(certificate.issuer)}</p>
          <div class="certificate-actions">
            <a href="${escapeHtml(safeUrl(certificate.url))}" target="_blank" rel="noopener">${documentLabel} ↗</a>
            ${verification}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function loadCertificates() {
  try {
    const response = await fetch('../assets/data/portfolio.json', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    const data = await response.json();
    certificateState.certificates = Array.isArray(data.certificates) ? data.certificates : [];
    renderCertificates();
  } catch {
    document.querySelector('#certificateMosaic').innerHTML = '<p class="loading">No fue posible cargar las credenciales. Recarga la página.</p>';
  }
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  certificateState.filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  renderCertificates();
}));

document.querySelector('#certificateSearch').addEventListener('input', event => {
  certificateState.search = event.target.value.trim();
  renderCertificates();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .1 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 60}ms`;
  observer.observe(element);
});

renderChart();
calculateKpis();
loadCertificates();
