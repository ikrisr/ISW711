const API_BASE = "http://localhost:3001";

//Inputs del formulario 
const fId = document.getElementById("fId");
const fName = document.getElementById("fName");
const fCredits = document.getElementById("fCredits");

//Botones del formulario
const btnAdd = document.getElementById("btnAdd");
const btnUpdate = document.getElementById("btnUpdate");
const btnDelete = document.getElementById("btnDelete");
const btnClear = document.getElementById("btnClear");
;


//Tabla / contador
const count = document.getElementById("count");
const tableBody = document.getElementById("tableBody");

//Toast (del HTML)
const toastEl = document.getElementById("toast");

//Estado
let coursesCache = [];
let selectedRowId = null;


function showToast(text, isError = false, ms = 2200) {
  if (!toastEl) return;

  toastEl.textContent = text || "";
  toastEl.classList.toggle("error", isError);

  toastEl.classList.add("show");

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toastEl.classList.remove("show");
  }, ms);
}

//Procesa los request y respuestas al servidor, incluyendo manejo de errores
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();

  let data = null; 
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const m = data?.message || `${res.status} ${res.statusText}`;
    throw new Error(m);
  }

  return data;
}

// Limpia la selección en la tabla y el formulario
function clearSelectionUI() {
  selectedRowId = null;
  document.querySelectorAll("tr.selected").forEach((tr) => tr.classList.remove("selected"));
}

//Rellena el formulario con el curso seleccionado 
function fillForm(course) {
  fId.value = course?._id || "";
  fName.value = course?.name || "";
  fCredits.value = course?.credits ?? "";
}

// A partir de un array de cursos crea la tabla 
function renderTable(courses) {
  tableBody.innerHTML = "";
  count.textContent = `Total: ${courses.length}`;

  if (!courses.length) {
    tableBody.innerHTML = `<tr><td colspan="3" class="emptyCell">No hay cursos.</td></tr>`;
    return;
  }

  for (const c of courses) {
    const tr = document.createElement("tr");
    tr.dataset.id = c._id;

    const tdId = document.createElement("td");
    tdId.textContent = c._id ?? "";

    const tdName = document.createElement("td");
    tdName.textContent = c.name ?? "";

    const tdCredits = document.createElement("td");
    tdCredits.textContent = c.credits ?? "";

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCredits);

    tr.addEventListener("click", () => {
      clearSelectionUI();
      selectedRowId = c._id;
      tr.classList.add("selected");
      fillForm(c);
    });

    tableBody.appendChild(tr);
  }
}

//carga los cursos desde el backend y los muestra en la tabla
async function loadCourses() {
  try {
    coursesCache = await fetchJson(`${API_BASE}/course`);
    renderTable(coursesCache);
  } catch (err) {
    console.error(err);
    showToast(`Error cargando cursos: ${err.message}`, true, 3000);
  }
}

//Agrega un nuevo curso con los datos del formulario
btnAdd.addEventListener("click", async () => {
  try {
    const name = fName.value.trim();
    const creditsRaw = fCredits.value;

    if (!name || creditsRaw === "") {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, credits: Number(creditsRaw) }; //se convierte a número para el backend

    await fetchJson(`${API_BASE}/course`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    showToast("Curso agregado éxitosamente");
    fillForm(null);
    clearSelectionUI();
    await loadCourses();
  } catch (err) {
    showToast(`Error al agregar: ${err.message}`, true, 3000);
  }
});

//Actualizar
btnUpdate.addEventListener("click", async () => {
  try {
    const id = fId.value.trim(); 
    const name = fName.value.trim();
    const creditsRaw = fCredits.value;

    if (!id || !name || creditsRaw === "") {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, credits: Number(creditsRaw) };

    await fetchJson(`${API_BASE}/course?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    showToast("Curso actualizado ");
    fillForm(null);
    clearSelectionUI();
    await loadCourses();

  } catch (err) {
    showToast(`Error al actualizar: ${err.message}`, true, 3000);
  }
});

//Eliminar
btnDelete.addEventListener("click", async () => {
  try {
    const id = fId.value.trim(); 

    if (!id) return showToast("Selecciona un curso para eliminar", true);

    const ok = confirm(`¿Seguro que querés eliminar el curso con ID:\n${id}?`);
    if (!ok) return;
    await fetchJson(`${API_BASE}/course?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    showToast("Curso eliminado exitosamente");
    fillForm(null);
    clearSelectionUI();
    await loadCourses();

  } catch (err) {
    showToast(`Error al eliminar: ${err.message}`, true, 3000);
  }
});


btnClear.addEventListener("click", () => {
  fillForm(null);       
  clearSelectionUI();    
});


document.addEventListener("DOMContentLoaded", loadCourses);

