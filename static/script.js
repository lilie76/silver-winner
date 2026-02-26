const proList = document.getElementById("proList");

const fZona = document.getElementById("fZona");
const fEsp = document.getElementById("fEsp");
const fModo = document.getElementById("fModo");
const fSearch = document.getElementById("fSearch");
const fSort = document.getElementById("fSort");
const btnReload = document.getElementById("btnReload");

let CACHE = [];

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function waLink(phone, text) {
  const msg = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${msg}`;
}

function mailLink(email, subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function matches(p) {
  const zona = fZona.value;
  const esp = fEsp.value;
  const modo = fModo.value;
  const q = (fSearch.value || "").trim().toLowerCase();

  if (zona !== "todas" && p.zona !== zona) return false;
  if (esp !== "todas" && p.esp !== esp) return false;

  if (modo !== "todas") {
    // Si el pro ofrece "Online y Domicilio", matchea con ambos
    if (p.modo !== modo && p.modo !== "Online y Domicilio") return false;
  }

  if (q && !String(p.nombre).toLowerCase().includes(q)) return false;
  return true;
}

function sortItems(items) {
  const key = fSort.value;
  const arr = [...items];

  if (key === "precio_asc") arr.sort((a,b) => (a.precio||0) - (b.precio||0));
  if (key === "precio_desc") arr.sort((a,b) => (b.precio||0) - (a.precio||0));
  if (key === "nombre_asc") arr.sort((a,b) => String(a.nombre).localeCompare(String(b.nombre), "es"));

  return arr;
}

function render() {
  const filtered = sortItems(CACHE.filter(matches));

  proList.innerHTML = filtered.length ? filtered.map(p => {
    const precio = Number(p.precio || 0).toLocaleString("es-AR");
    const nombre = escapeHtml(p.nombre);
    const desc = escapeHtml(p.desc);
    const exp = escapeHtml(p.experiencia || "");
    const disp = escapeHtml(p.disponibilidad || "");

    const msg = `Hola ${p.nombre}! Te contacto desde Salvabioverde. Necesito ayuda con una planta.`;
    let contactHtml = `<button disabled title="Este profesional no cargó WhatsApp ni Email">Contactar</button>`;

    if (p.wa) {
      contactHtml = `<a class="primary" target="_blank" rel="noreferrer" href="${waLink(p.wa, msg)}">Contactar (WA)</a>`;
    } else if (p.email) {
      contactHtml = `<a class="primary" href="${mailLink(p.email, "Consulta desde Salvabioverde", msg)}">Contactar (Email)</a>`;
    }

    return `
      <div class="item">
        <strong>${nombre}</strong>
        <div class="muted small">${escapeHtml(p.zona)} • ${escapeHtml(p.esp)} • ${escapeHtml(p.modo)}</div>
        <div class="tags">
          <span class="tag">Desde $ ${precio}</span>
          ${exp ? `<span class="tag">Exp: ${exp}</span>` : ""}
          ${disp ? `<span class="tag pink">Disp: ${disp}</span>` : ""}
        </div>
        <p class="muted" style="margin:10px 0 0; line-height:1.4">${desc}</p>

        <div class="actions">
          ${contactHtml}
          <a href="#pedir">Pedir ayuda</a>
        </div>
      </div>
    `;
  }).join("") : `<div class="item">No hay profesionales con esos filtros.</div>`;
}

async function cargarPros() {
  proList.innerHTML = "Cargando...";
  const res = await fetch("/api/profesionales");
  const data = await res.json();

  if (!data.ok) {
    proList.innerHTML = "Error cargando profesionales.";
    return;
  }

  CACHE = (data.items || []).map(p => ({
    ...p,
    wa: p.wa || "",
    email: p.email || "",
    experiencia: p.experiencia || "",
    disponibilidad: p.disponibilidad || "",
  }));

  render();
}

[fZona, fEsp, fModo, fSearch, fSort].forEach(el => el.addEventListener("input", render));
btnReload.addEventListener("click", cargarPros);

cargarPros();


// ---- Solicitud ----
document.getElementById("helpForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nombre: document.getElementById("hNombre").value.trim(),
    zona: document.getElementById("hZona").value.trim(),
    contacto: document.getElementById("hContacto").value.trim(),
    planta: document.getElementById("hPlanta").value.trim(),
    tipo: document.getElementById("hTipo").value,
    luz: document.getElementById("hLuz").value,
    riego: document.getElementById("hRiego").value,
    detalle: document.getElementById("hDetalle").value.trim(),
    urgente: document.getElementById("hUrgente").checked,
  };

  const res = await fetch("/api/solicitudes", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  document.getElementById("helpMsg").textContent = data.ok
    ? "✅ Solicitud guardada (solicitudes.json)."
    : "❌ " + (data.error || "Error.");

  if (data.ok) e.target.reset();
});


// ---- Profesional ----
document.getElementById("proForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nombre: document.getElementById("pNombre").value.trim(),
    zona: document.getElementById("pZona").value,
    esp: document.getElementById("pEsp").value,
    modo: document.getElementById("pModo").value,
    precio: Number(document.getElementById("pPrecio").value),
    experiencia: document.getElementById("pExp").value.trim(),
    wa: document.getElementById("pWa").value.trim(),
    email: document.getElementById("pEmail").value.trim(),
    disponibilidad: document.getElementById("pDisp").value.trim(),
    desc: document.getElementById("pDesc").value.trim(),
  };

  const res = await fetch("/api/profesionales", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  document.getElementById("proMsg").textContent = data.ok
    ? "✅ Profesional guardado (pros.json)."
    : "❌ " + (data.error || "Error.");

  if (data.ok) {
    e.target.reset();
    cargarPros();
    location.hash = "#buscar";
  }
});