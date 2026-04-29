document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     MENÚ MÓVIL
  ====================================================== */
  const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const navLinks = document.querySelectorAll(".menu a");
const sections = document.querySelectorAll("main section[id]");
const navbar = document.querySelector(".navbar");

let scrollingByClick = false;

/* Abre y cierra el menú en celular */
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}

/* Calcula la altura del menú fijo */
function getNavbarOffset() {
  if (navbar) {
    return navbar.offsetHeight + 24;
  }

  return 110;
}

/* Activa visualmente el link correcto */
function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + sectionId) {
      link.classList.add("active");
    }
  });
}

/* Cuando das clic en el menú */
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    const targetSection = document.querySelector(href);

    if (!targetSection) {
      return;
    }

    event.preventDefault();

    if (menu) {
      menu.classList.remove("show");
    }

    const sectionId = href.replace("#", "");

    setActiveLink(sectionId);

    scrollingByClick = true;

    const targetPosition =
      targetSection.getBoundingClientRect().top +
      window.pageYOffset -
      getNavbarOffset();

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    history.replaceState(null, "", href);

    setTimeout(() => {
      scrollingByClick = false;
      updateActiveLinkOnScroll();
    }, 700);
  });
});

/* Detecta la sección visible cuando bajas o subes manualmente */
function updateActiveLinkOnScroll() {
  if (scrollingByClick) {
    return;
  }

  let currentSection = "inicio";
  const offset = getNavbarOffset() + 30;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - offset;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  setActiveLink(currentSection);
}

window.addEventListener("scroll", updateActiveLinkOnScroll, {
  passive: true,
});

updateActiveLinkOnScroll();

  /* ======================================================
     ANIMACIONES AL HACER SCROLL
  ====================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  /* ======================================================
     MODAL DE PROYECTOS
  ====================================================== */
  const projectModal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalCloseBottom = document.getElementById("modalCloseBottom");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPreview = document.getElementById("modalPreview");
  const modalList = document.getElementById("modalList");

  function money(value) {
    return `$${value.toLocaleString("es-MX")}`;
  }

  const demoData = {
    restaurante: {
      tag: "Restaurante / Delivery",
      title: "Restaurante digital",
      description:
        "Demo visual para un restaurante que necesita mostrar su menú, promociones, ubicación y recibir pedidos o mensajes por WhatsApp.",
      features: [
        "Menú digital por categorías",
        "Promociones destacadas",
        "Pedidos por WhatsApp",
        "Botones de llamada a la acción",
        "Galería de platillos",
        "Horario, mapa y contacto",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.saborurbano.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-hero-card">
                <span class="demo-badge">RESTAURANTE / DELIVERY</span>
                <h3 class="demo-title-xl">Comida que se antoja desde la primera vista</h3>
                <p class="demo-text">
                  Muestra tus platillos, promociones y recibe pedidos o mensajes
                  en segundos con una página visual y moderna.
                </p>

                <div class="demo-actions-inline">
                  <button class="demo-btn demo-btn-primary" id="restauranteOrderBtn">Ordenar ahora</button>
                  <button class="demo-btn demo-btn-secondary">Ver menú</button>
                </div>

                <div class="demo-list-inline">
                  <span class="demo-chip active" data-rest-filter="all">Todos</span>
                  <span class="demo-chip" data-rest-filter="hamburguesa">Hamburguesas</span>
                  <span class="demo-chip" data-rest-filter="pizza">Pizzas</span>
                  <span class="demo-chip" data-rest-filter="combo">Combos</span>
                </div>
              </div>

              <div class="demo-image-large">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" alt="Pizza" />
                <div class="demo-image-tag">Promo del día</div>
              </div>
            </div>

            <div class="demo-grid-4" id="restaurantProducts">
              <div class="demo-card restaurant-item" data-category="hamburguesa">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80" alt="Hamburguesa">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Hamburguesa especial</div>
                  <p class="demo-muted">Doble carne, queso, tocino y papas.</p>
                  <div class="demo-card-actions">
                    <span class="demo-price">${money(139)}</span>
                    <button class="demo-small-btn rest-add" data-name="Hamburguesa especial" data-price="139">Agregar</button>
                  </div>
                </div>
              </div>

              <div class="demo-card restaurant-item" data-category="pizza">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" alt="Pizza">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Pizza familiar</div>
                  <p class="demo-muted">Masa artesanal y mezcla de quesos.</p>
                  <div class="demo-card-actions">
                    <span class="demo-price">${money(249)}</span>
                    <button class="demo-small-btn rest-add" data-name="Pizza familiar" data-price="249">Agregar</button>
                  </div>
                </div>
              </div>

              <div class="demo-card restaurant-item" data-category="combo">
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80" alt="Combo">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Combo completo</div>
                  <p class="demo-muted">Hamburguesa, papas y bebida.</p>
                  <div class="demo-card-actions">
                    <span class="demo-price">${money(189)}</span>
                    <button class="demo-small-btn rest-add" data-name="Combo completo" data-price="189">Agregar</button>
                  </div>
                </div>
              </div>

              <div class="demo-summary" id="restaurantSummary">
                <div class="demo-subtitle">Resumen del pedido</div>
                <div class="demo-summary-row">
                  <span>Productos</span>
                  <strong id="restaurantCount">0</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Total estimado</span>
                  <strong id="restaurantTotal">${money(0)}</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Entrega</span>
                  <strong>30 min</strong>
                </div>
                <button class="demo-btn demo-btn-primary" style="margin-top:14px; width:100%;">
                  Enviar por WhatsApp
                </button>
                <div class="demo-toast" id="restaurantToast">Producto agregado al pedido</div>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    consultorio: {
      tag: "Consultorio / Citas",
      title: "Consultorio médico",
      description:
        "Demo visual para mostrar confianza, servicios, horarios y facilitar el agendado de citas en línea o por contacto.",
      features: [
        "Presentación profesional del consultorio",
        "Especialidades médicas",
        "Agenda de horarios",
        "Formulario de cita",
        "Atención por WhatsApp",
        "Mapa, ubicación y contacto",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.clinicaintegral.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-image-large">
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80" alt="Doctor">
                <div class="demo-image-tag">Atención profesional</div>
              </div>

              <div class="demo-panel">
                <span class="demo-badge">CONSULTORIO / CITAS</span>
                <h3 class="demo-title-xl">Atención profesional y cercana</h3>
                <p class="demo-text">
                  Un sitio pensado para mostrar confianza, especialidades, horarios
                  y facilitar el agendado de citas.
                </p>

                <div class="demo-list-inline">
                  <span class="demo-pill">Consulta general</span>
                  <span class="demo-pill">Cardiología</span>
                  <span class="demo-pill">Pediatría</span>
                </div>

                <div class="demo-stat-grid" style="margin-top:20px;">
                  <div class="demo-stat">
                    <strong>12+</strong>
                    <span>Años de experiencia</span>
                  </div>
                  <div class="demo-stat">
                    <strong>500+</strong>
                    <span>Pacientes atendidos</span>
                  </div>
                  <div class="demo-stat">
                    <strong>4.9</strong>
                    <span>Calificación</span>
                  </div>
                  <div class="demo-stat">
                    <strong>24h</strong>
                    <span>Respuesta rápida</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="demo-grid-2">
              <div class="demo-summary">
                <div class="demo-subtitle">Agenda tu cita</div>

                <div class="demo-form">
                  <input class="demo-input" type="text" placeholder="Nombre completo" />
                  <input class="demo-input" type="text" placeholder="Teléfono" />
                  <input class="demo-input" type="text" placeholder="Motivo de consulta" />
                </div>

                <div class="demo-subtitle" style="margin-top:18px;">Horarios disponibles</div>
                <div class="demo-times-grid">
                  <span class="demo-time consult-time active">10:00 AM</span>
                  <span class="demo-time consult-time">11:30 AM</span>
                  <span class="demo-time consult-time">1:00 PM</span>
                  <span class="demo-time consult-time">4:30 PM</span>
                </div>

                <button class="demo-btn demo-btn-primary" id="consultConfirmBtn" style="margin-top:18px; width:100%;">
                  Confirmar cita
                </button>

                <div class="demo-status-box" id="consultStatus">
                  Cita confirmada correctamente.
                </div>
              </div>

              <div class="demo-side">
                <div class="demo-subtitle">Lo que puede mostrar esta página</div>
                <div class="demo-room-list">
                  <div class="demo-service-option" style="cursor:default;">
                    <strong>Especialidades</strong>
                    <p class="demo-muted">Consulta general, cardiología, pediatría y más.</p>
                  </div>
                  <div class="demo-service-option" style="cursor:default;">
                    <strong>Horarios y ubicación</strong>
                    <p class="demo-muted">Horarios actualizados y mapa del consultorio.</p>
                  </div>
                  <div class="demo-service-option" style="cursor:default;">
                    <strong>Formulario y WhatsApp</strong>
                    <p class="demo-muted">Citas rápidas por formulario o botón directo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    inventario: {
      tag: "Sistema / Panel",
      title: "Sistema de inventario",
      description:
        "Demo visual tipo dashboard real con panel lateral, estadísticas, gráfico y tabla de productos para mostrar cómo se vería un sistema administrativo.",
      features: [
        "Dashboard administrativo",
        "Panel lateral",
        "Estadísticas y KPI",
        "Productos y existencias",
        "Entradas y salidas",
        "Control con MySQL y Laravel",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">app.stockflow.local</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2" style="grid-template-columns: 280px 1fr;">
              <div class="demo-side">
                <div class="demo-subtitle">Panel</div>
                <div class="demo-side-menu">
                  <div class="demo-side-link active">Dashboard</div>
                  <div class="demo-side-link">Productos</div>
                  <div class="demo-side-link">Entradas</div>
                  <div class="demo-side-link">Salidas</div>
                  <div class="demo-side-link">Reportes</div>
                </div>
              </div>

              <div class="demo-panel">
                <div class="demo-list-inline" style="margin-bottom:16px;">
                  <span class="demo-pill inventory-range active" data-range="hoy">Hoy</span>
                  <span class="demo-pill inventory-range" data-range="semana">Semana</span>
                  <span class="demo-pill inventory-range" data-range="mes">Mes</span>
                </div>

                <div class="demo-stat-grid">
                  <div class="demo-stat">
                    <strong id="invProducts">128</strong>
                    <span>Productos</span>
                  </div>
                  <div class="demo-stat">
                    <strong id="invLow">23</strong>
                    <span>Bajo stock</span>
                  </div>
                  <div class="demo-stat">
                    <strong id="invMoves">14</strong>
                    <span>Movimientos</span>
                  </div>
                  <div class="demo-stat">
                    <strong id="invSales">37</strong>
                    <span>Salidas</span>
                  </div>
                </div>

                <div class="demo-chart" id="inventoryChart" style="margin-top:18px;">
                  <div class="demo-bar" style="height:44%;"></div>
                  <div class="demo-bar" style="height:72%;"></div>
                  <div class="demo-bar" style="height:58%;"></div>
                  <div class="demo-bar" style="height:84%;"></div>
                  <div class="demo-bar" style="height:51%;"></div>
                </div>

                <div class="demo-table-wrap" style="margin-top:18px; padding:18px;">
                  <table class="demo-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Existencia</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody id="inventoryRows">
                      <tr>
                        <td>Cable HDMI</td>
                        <td>Accesorios</td>
                        <td>42</td>
                        <td>Normal</td>
                      </tr>
                      <tr>
                        <td>Mouse inalámbrico</td>
                        <td>Periféricos</td>
                        <td>12</td>
                        <td>Bajo</td>
                      </tr>
                      <tr>
                        <td>SSD 1TB</td>
                        <td>Almacenamiento</td>
                        <td>26</td>
                        <td>Normal</td>
                      </tr>
                      <tr>
                        <td>Memoria RAM</td>
                        <td>Componentes</td>
                        <td>9</td>
                        <td>Bajo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    tienda: {
      tag: "Tienda / Catálogo",
      title: "Tienda online básica",
      description:
        "Demo para una tienda con productos, filtros, carrito visual y un diseño listo para vender o mostrar catálogo de forma atractiva.",
      features: [
        "Catálogo de productos",
        "Secciones por categorías",
        "Carrito visual",
        "Botones de compra o WhatsApp",
        "Promociones destacadas",
        "Diseño responsive",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.tiendava.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-panel">
                <span class="demo-badge">TIENDA / CATÁLOGO</span>
                <h3 class="demo-title-xl">Productos modernos para vender mejor</h3>
                <p class="demo-text">
                  Un catálogo visual pensado para destacar productos, promociones
                  y facilitar compras o contacto rápido.
                </p>

                <div class="demo-list-inline">
                  <span class="demo-chip store-filter active" data-store-filter="all">Todos</span>
                  <span class="demo-chip store-filter" data-store-filter="moda">Moda</span>
                  <span class="demo-chip store-filter" data-store-filter="accesorios">Accesorios</span>
                  <span class="demo-chip store-filter" data-store-filter="ofertas">Ofertas</span>
                </div>
              </div>

              <div class="demo-summary">
                <div class="demo-subtitle">Carrito visual</div>
                <div class="demo-summary-row">
                  <span>Productos</span>
                  <strong id="storeCount">0</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Total</span>
                  <strong id="storeTotal">${money(0)}</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Envío</span>
                  <strong>Gratis</strong>
                </div>
                <button class="demo-btn demo-btn-primary" style="margin-top:14px; width:100%;">Finalizar pedido</button>
                <div class="demo-toast" id="storeToast">Producto agregado al carrito</div>
              </div>
            </div>

            <div class="demo-grid-4" id="storeProducts">
              <div class="demo-card store-item" data-category="moda">
                <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80" alt="Sudadera">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Sudadera urbana</div>
                  <p class="demo-price">${money(599)}</p>
                  <button class="demo-small-btn store-add" data-price="599">Agregar</button>
                </div>
              </div>

              <div class="demo-card store-item" data-category="accesorios">
                <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80" alt="Reloj">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Reloj clásico</div>
                  <p class="demo-price">${money(1299)}</p>
                  <button class="demo-small-btn store-add" data-price="1299">Agregar</button>
                </div>
              </div>

              <div class="demo-card store-item" data-category="ofertas">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80" alt="Tenis">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Tenis premium</div>
                  <p class="demo-price">${money(1499)}</p>
                  <button class="demo-small-btn store-add" data-price="1499">Agregar</button>
                </div>
              </div>

              <div class="demo-card store-item" data-category="moda">
                <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80" alt="Camisa">
                <div class="demo-card-body">
                  <div class="demo-subtitle">Camisa casual</div>
                  <p class="demo-price">${money(459)}</p>
                  <button class="demo-small-btn store-add" data-price="459">Agregar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    barberia: {
      tag: "Barbería / Agenda",
      title: "Barbería / Estética",
      description:
        "Demo para mostrar servicios, precios, personal, horarios y la posibilidad de agendar citas fácilmente.",
      features: [
        "Servicios y precios",
        "Agenda de citas",
        "Horarios disponibles",
        "Equipo de trabajo",
        "Promociones o paquetes",
        "Botón de WhatsApp",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.barberiablack.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-image-large">
                <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80" alt="Barbería">
                <div class="demo-image-tag">Cortes premium</div>
              </div>

              <div class="demo-panel">
                <span class="demo-badge">BARBERÍA / CITAS</span>
                <h3 class="demo-title-xl">Reserva tu estilo en minutos</h3>
                <p class="demo-text">
                  Un diseño elegante para mostrar servicios, paquetes, horarios
                  y agendar citas sin complicaciones.
                </p>

                <div class="demo-service-list" style="margin-top:18px;">
                  <div class="demo-service-option active" data-service-name="Corte clásico" data-service-price="180">
                    <strong>Corte clásico</strong>
                    <p class="demo-price">${money(180)}</p>
                  </div>
                  <div class="demo-service-option" data-service-name="Corte + barba" data-service-price="260">
                    <strong>Corte + barba</strong>
                    <p class="demo-price">${money(260)}</p>
                  </div>
                  <div class="demo-service-option" data-service-name="Paquete premium" data-service-price="320">
                    <strong>Paquete premium</strong>
                    <p class="demo-price">${money(320)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="demo-grid-2">
              <div class="demo-summary">
                <div class="demo-subtitle">Elige horario</div>
                <div class="demo-times-grid">
                  <span class="demo-time barber-time active">12:00 PM</span>
                  <span class="demo-time barber-time">1:00 PM</span>
                  <span class="demo-time barber-time">4:00 PM</span>
                  <span class="demo-time barber-time">6:00 PM</span>
                </div>

                <button class="demo-btn demo-btn-primary" id="barberConfirmBtn" style="margin-top:18px; width:100%;">
                  Agendar cita
                </button>

                <div class="demo-status-box" id="barberStatus">
                  Cita agendada correctamente.
                </div>
              </div>

              <div class="demo-summary">
                <div class="demo-subtitle">Resumen</div>
                <div class="demo-summary-row">
                  <span>Servicio</span>
                  <strong id="barberSelectedService">Corte clásico</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Horario</span>
                  <strong id="barberSelectedTime">12:00 PM</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Total</span>
                  <strong id="barberSelectedPrice">${money(180)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    inmobiliaria: {
      tag: "Inmobiliaria / Leads",
      title: "Inmobiliaria",
      description:
        "Demo para mostrar propiedades, destacar inmuebles, usar filtros visuales y captar clientes interesados con formularios.",
      features: [
        "Catálogo de propiedades",
        "Filtros por tipo o zona",
        "Fichas con detalles",
        "Formulario de contacto",
        "Captación de prospectos",
        "Galería de imágenes",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.espaciosprime.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-panel">
                <span class="demo-badge">INMOBILIARIA / PROPIEDADES</span>
                <h3 class="demo-title-xl">Encuentra el espacio ideal</h3>
                <p class="demo-text">
                  Página moderna para mostrar propiedades con fotos, detalles y
                  formularios para captar clientes potenciales.
                </p>

                <div class="demo-amenities">
                  <span>Casas</span>
                  <span>Departamentos</span>
                  <span>Locales</span>
                  <span>Renta / Venta</span>
                </div>
              </div>

              <div class="demo-summary">
                <img id="propertyFeaturedImage" class="demo-property-image" src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80" alt="Casa">
                <div style="margin-top:14px;">
                  <div class="demo-subtitle" id="propertyFeaturedTitle">Casa moderna en zona premium</div>
                  <p class="demo-price" id="propertyFeaturedPrice">${money(3850000)}</p>
                  <p class="demo-text" id="propertyFeaturedDesc">3 recámaras, jardín, cochera y acabados premium.</p>
                </div>
              </div>
            </div>

            <div class="demo-grid-3 demo-property-list">
              <div class="demo-property-card active" data-title="Casa moderna en zona premium" data-price="${money(3850000)}" data-desc="3 recámaras, jardín, cochera y acabados premium." data-img="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80">
                <strong>Casa moderna</strong>
                <p class="demo-muted">Zona norte · Venta</p>
              </div>

              <div class="demo-property-card" data-title="Departamento ejecutivo" data-price="${money(2490000)}" data-desc="2 recámaras, elevador y amenidades compartidas." data-img="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80">
                <strong>Departamento ejecutivo</strong>
                <p class="demo-muted">Centro · Venta</p>
              </div>

              <div class="demo-property-card" data-title="Local comercial" data-price="${money(28000)} / mes" data-desc="Excelente ubicación para negocio y amplio frente." data-img="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80">
                <strong>Local comercial</strong>
                <p class="demo-muted">Avenida principal · Renta</p>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    hotel: {
      tag: "Hotel / Reservas",
      title: "Hotel / Hospedaje",
      description:
        "Demo para hoteles o hospedajes que quieran mostrar habitaciones, paquetes, servicios y solicitud de reservación.",
      features: [
        "Habitaciones y suites",
        "Reservación visual",
        "Paquetes o promociones",
        "Servicios del hotel",
        "Galería y amenidades",
        "Formulario o WhatsApp",
      ],
      preview: () => `
        <div class="demo-browser">
          <div class="demo-topbar">
            <div class="demo-dots"><span></span><span></span><span></span></div>
            <div class="demo-url">www.hotelbrisa.com</div>
          </div>

          <div class="demo-screen">
            <div class="demo-grid-2">
              <div class="demo-image-large">
                <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80" alt="Hotel">
                <div class="demo-image-tag">Escápate este fin</div>
              </div>

              <div class="demo-panel">
                <span class="demo-badge">HOTEL / RESERVAS</span>
                <h3 class="demo-title-xl">Descanso y comodidad en un solo lugar</h3>
                <p class="demo-text">
                  Página pensada para mostrar habitaciones, paquetes, amenidades
                  y facilitar la reservación.
                </p>

                <div class="demo-amenities">
                  <span>Wi‑Fi</span>
                  <span>Piscina</span>
                  <span>Restaurante</span>
                  <span>Estacionamiento</span>
                </div>
              </div>
            </div>

            <div class="demo-grid-2">
              <div class="demo-room-list">
                <div class="demo-room-card-option active" data-room-name="Habitación estándar" data-room-price="${money(1350)}" data-room-capacity="2 personas">
                  <strong>Habitación estándar</strong>
                  <p class="demo-muted">Cómoda, moderna y funcional</p>
                </div>

                <div class="demo-room-card-option" data-room-name="Suite ejecutiva" data-room-price="${money(2190)}" data-room-capacity="2 a 3 personas">
                  <strong>Suite ejecutiva</strong>
                  <p class="demo-muted">Más espacio y mejor vista</p>
                </div>

                <div class="demo-room-card-option" data-room-name="Suite familiar" data-room-price="${money(2890)}" data-room-capacity="4 personas">
                  <strong>Suite familiar</strong>
                  <p class="demo-muted">Ideal para familias o grupos</p>
                </div>
              </div>

              <div class="demo-summary">
                <div class="demo-subtitle">Resumen de reservación</div>
                <div class="demo-summary-row">
                  <span>Habitación</span>
                  <strong id="hotelRoomName">Habitación estándar</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Capacidad</span>
                  <strong id="hotelRoomCapacity">2 personas</strong>
                </div>
                <div class="demo-summary-row">
                  <span>Precio por noche</span>
                  <strong id="hotelRoomPrice">${money(1350)}</strong>
                </div>
                <button class="demo-btn demo-btn-primary" id="hotelReserveBtn" style="margin-top:16px; width:100%;">
                  Reservar ahora
                </button>
                <div class="demo-status-box" id="hotelStatus">
                  Solicitud de reservación enviada.
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    },
  };

  function renderFeatureList(features) {
    return features
      .map((item) => `<div class="extra-service-item">✓ ${item}</div>`)
      .join("");
  }

  function openModal(key) {
    const data = demoData[key];
    if (!data || !projectModal) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalPreview.innerHTML = data.preview();
    modalList.innerHTML = renderFeatureList(data.features);

    projectModal.classList.add("active");
    document.body.classList.add("no-scroll");

    bindDemoInteractions(key);
  }

  function closeModalFn() {
    if (!projectModal) return;
    projectModal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  document.querySelectorAll(".project-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const modalKey = button.getAttribute("data-modal");
      openModal(modalKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModalFn);
  }

  if (modalCloseBottom) {
    modalCloseBottom.addEventListener("click", closeModalFn);
  }

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        closeModalFn();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModalFn();
    }
  });

  /* ======================================================
     FUNCIONES DE CADA DEMO
  ====================================================== */
  function bindDemoInteractions(key) {
    if (key === "restaurante") bindRestaurantDemo();
    if (key === "consultorio") bindConsultorioDemo();
    if (key === "inventario") bindInventarioDemo();
    if (key === "tienda") bindTiendaDemo();
    if (key === "barberia") bindBarberiaDemo();
    if (key === "inmobiliaria") bindInmobiliariaDemo();
    if (key === "hotel") bindHotelDemo();
  }

  function showToast(element) {
    if (!element) return;
    element.classList.add("show");
    setTimeout(() => {
      element.classList.remove("show");
    }, 1800);
  }

  function bindRestaurantDemo() {
    const chips = modalPreview.querySelectorAll("[data-rest-filter]");
    const items = modalPreview.querySelectorAll(".restaurant-item");
    const addButtons = modalPreview.querySelectorAll(".rest-add");
    const countEl = modalPreview.querySelector("#restaurantCount");
    const totalEl = modalPreview.querySelector("#restaurantTotal");
    const toast = modalPreview.querySelector("#restaurantToast");
    const orderBtn = modalPreview.querySelector("#restauranteOrderBtn");

    let count = 0;
    let total = 0;

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");

        const filter = chip.getAttribute("data-rest-filter");

        items.forEach((item) => {
          if (filter === "all" || item.dataset.category === filter) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    addButtons.forEach((button) => {
      button.addEventListener("click", () => {
        count += 1;
        total += Number(button.dataset.price);
        countEl.textContent = count;
        totalEl.textContent = money(total);
        showToast(toast);
      });
    });

    if (orderBtn) {
      orderBtn.addEventListener("click", () => showToast(toast));
    }
  }

  function bindConsultorioDemo() {
    const times = modalPreview.querySelectorAll(".consult-time");
    const confirmBtn = modalPreview.querySelector("#consultConfirmBtn");
    const status = modalPreview.querySelector("#consultStatus");

    times.forEach((time) => {
      time.addEventListener("click", () => {
        times.forEach((t) => t.classList.remove("active"));
        time.classList.add("active");
      });
    });

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        status.classList.add("show");
      });
    }
  }

  function bindInventarioDemo() {
    const ranges = modalPreview.querySelectorAll(".inventory-range");
    const invProducts = modalPreview.querySelector("#invProducts");
    const invLow = modalPreview.querySelector("#invLow");
    const invMoves = modalPreview.querySelector("#invMoves");
    const invSales = modalPreview.querySelector("#invSales");
    const bars = modalPreview.querySelectorAll(".demo-bar");

    const rangeData = {
      hoy: {
        products: "128",
        low: "23",
        moves: "14",
        sales: "37",
        heights: ["44%", "72%", "58%", "84%", "51%"],
      },
      semana: {
        products: "128",
        low: "19",
        moves: "73",
        sales: "146",
        heights: ["60%", "82%", "70%", "92%", "64%"],
      },
      mes: {
        products: "128",
        low: "16",
        moves: "214",
        sales: "528",
        heights: ["72%", "88%", "80%", "98%", "76%"],
      },
    };

    ranges.forEach((range) => {
      range.addEventListener("click", () => {
        ranges.forEach((r) => r.classList.remove("active"));
        range.classList.add("active");

        const key = range.dataset.range;
        const data = rangeData[key];

        invProducts.textContent = data.products;
        invLow.textContent = data.low;
        invMoves.textContent = data.moves;
        invSales.textContent = data.sales;

        bars.forEach((bar, index) => {
          bar.style.height = data.heights[index];
        });
      });
    });
  }

  function bindTiendaDemo() {
    const filters = modalPreview.querySelectorAll(".store-filter");
    const items = modalPreview.querySelectorAll(".store-item");
    const addButtons = modalPreview.querySelectorAll(".store-add");
    const countEl = modalPreview.querySelector("#storeCount");
    const totalEl = modalPreview.querySelector("#storeTotal");
    const toast = modalPreview.querySelector("#storeToast");

    let count = 0;
    let total = 0;

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("active"));
        filter.classList.add("active");

        const value = filter.dataset.storeFilter;

        items.forEach((item) => {
          if (value === "all" || item.dataset.category === value) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    addButtons.forEach((button) => {
      button.addEventListener("click", () => {
        count += 1;
        total += Number(button.dataset.price);
        countEl.textContent = count;
        totalEl.textContent = money(total);
        showToast(toast);
      });
    });
  }

  function bindBarberiaDemo() {
    const services = modalPreview.querySelectorAll(".demo-service-option");
    const times = modalPreview.querySelectorAll(".barber-time");
    const confirmBtn = modalPreview.querySelector("#barberConfirmBtn");
    const status = modalPreview.querySelector("#barberStatus");

    const selectedService = modalPreview.querySelector("#barberSelectedService");
    const selectedTime = modalPreview.querySelector("#barberSelectedTime");
    const selectedPrice = modalPreview.querySelector("#barberSelectedPrice");

    services.forEach((service) => {
      service.addEventListener("click", () => {
        services.forEach((s) => s.classList.remove("active"));
        service.classList.add("active");

        selectedService.textContent = service.dataset.serviceName;
        selectedPrice.textContent = money(Number(service.dataset.servicePrice));
      });
    });

    times.forEach((time) => {
      time.addEventListener("click", () => {
        times.forEach((t) => t.classList.remove("active"));
        time.classList.add("active");
        selectedTime.textContent = time.textContent;
      });
    });

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        status.classList.add("show");
      });
    }
  }

  function bindInmobiliariaDemo() {
    const cards = modalPreview.querySelectorAll(".demo-property-card");
    const title = modalPreview.querySelector("#propertyFeaturedTitle");
    const price = modalPreview.querySelector("#propertyFeaturedPrice");
    const desc = modalPreview.querySelector("#propertyFeaturedDesc");
    const image = modalPreview.querySelector("#propertyFeaturedImage");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        title.textContent = card.dataset.title;
        price.textContent = card.dataset.price;
        desc.textContent = card.dataset.desc;
        image.src = card.dataset.img;
      });
    });
  }

  function bindHotelDemo() {
    const rooms = modalPreview.querySelectorAll(".demo-room-card-option");
    const roomName = modalPreview.querySelector("#hotelRoomName");
    const roomCapacity = modalPreview.querySelector("#hotelRoomCapacity");
    const roomPrice = modalPreview.querySelector("#hotelRoomPrice");
    const reserveBtn = modalPreview.querySelector("#hotelReserveBtn");
    const status = modalPreview.querySelector("#hotelStatus");

    rooms.forEach((room) => {
      room.addEventListener("click", () => {
        rooms.forEach((r) => r.classList.remove("active"));
        room.classList.add("active");

        roomName.textContent = room.dataset.roomName;
        roomCapacity.textContent = room.dataset.roomCapacity;
        roomPrice.textContent = room.dataset.roomPrice;
      });
    });

    if (reserveBtn) {
      reserveBtn.addEventListener("click", () => {
        status.classList.add("show");
      });
    }
  }
});