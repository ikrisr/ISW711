const API_BASE = "http://localhost:3001";

//Inputs of the course form
const fId = document.getElementById("fId");
const fName = document.getElementById("fName");
const fCredits = document.getElementById("fCredits");
const fTeacherId = document.getElementById("fTeacherId"); // ✅ nuevo

//Buttons of the course form
const btnAdd = document.getElementById("btnAdd");
const btnUpdate = document.getElementById("btnUpdate");
const btnDelete = document.getElementById("btnDelete");
const btnClear = document.getElementById("btnClear");

//table elements
const count = document.getElementById("count");
const tableBody = document.getElementById("tableBody");


//Teachers form inputs

const tId = document.getElementById("tId");
const tName = document.getElementById("tName");
const tLastName = document.getElementById("tLastName");
const tIdNumber = document.getElementById("tIdNumber");
const tAge = document.getElementById("tAge");

//Buttons of the teacher form
const btnTeacherAdd = document.getElementById("btnTeacherAdd");
const btnTeacherUpdate = document.getElementById("btnTeacherUpdate");
const btnTeacherDelete = document.getElementById("btnTeacherDelete");
const btnTeacherClear = document.getElementById("btnTeacherClear");

const teacherCount = document.getElementById("teacherCount");
const teacherTableBody = document.getElementById("teacherTableBody");

let selectedTeacherId = null;


//Toast for messages
const toastEl = document.getElementById("toast");

//Status
let coursesCache = [];
let teachersCache = [];          
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


//Process fetch requests and responses, including error handling

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


function clearSelectionUI() {
  selectedRowId = null;
  document.querySelectorAll("tr.selected").forEach((tr) => tr.classList.remove("selected"));
}

//Render teachers in the select of the course form
function renderTeachersSelect(teachers) {
  if (!fTeacherId) return;

  fTeacherId.innerHTML = "";

  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "Seleccione un profesor...";
  fTeacherId.appendChild(opt0);

  for (const t of teachers) {
    const opt = document.createElement("option");
    opt.value = t._id;
    opt.textContent = `${t.name ?? ""} ${t.lastName ?? ""}`.trim();
    fTeacherId.appendChild(opt);
  }
}

async function loadTeachers() {
  try {
    teachersCache = await fetchJson(`${API_BASE}/teacher`);
    renderTeachersSelect(teachersCache);
  } catch (err) {
    console.error(err);
    showToast(`Error cargando profesores: ${err.message}`, true, 3000);
  }
}

//Charges the form with the selected course data
function fillForm(course) {
  fId.value = course?._id || "";
  fName.value = course?.name || "";
  fCredits.value = course?.credits ?? "";

  if (fTeacherId) {
    fTeacherId.value = course?.teacherId || "";
  }
}


function getTeacherFullNameById(teacherId) {
  const t = teachersCache.find(x => x._id === teacherId);
  if (!t) return teacherId || ""; 
  return `${t.name ?? ""} ${t.lastName ?? ""}`.trim();
}

// With the courses in cache, render the table
function renderTable(courses) {
  tableBody.innerHTML = "";
  count.textContent = `Total: ${courses.length}`;

  if (!courses.length) {
    tableBody.innerHTML = `<tr><td colspan="4" class="emptyCell">No hay cursos.</td></tr>`;
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

    const tdTeacher = document.createElement("td");
    tdTeacher.textContent = getTeacherFullNameById(c.teacherId);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCredits);
    tr.appendChild(tdTeacher);

    tr.addEventListener("click", () => {
      clearSelectionUI();
      selectedRowId = c._id;
      tr.classList.add("selected");
      fillForm(c);
    });

    tableBody.appendChild(tr);
  }
}


async function loadCourses() {
  try {
    coursesCache = await fetchJson(`${API_BASE}/course`);
    renderTable(coursesCache);
  } catch (err) {
    console.error(err);
    showToast(`Error cargando cursos: ${err.message}`, true, 3000);
  }
}


function clearTeacherSelectionUI() {
  selectedTeacherId = null;
  document
    .querySelectorAll("#teacherTableBody tr.selected")
    .forEach((tr) => tr.classList.remove("selected"));
}

function fillTeacherForm(teacher) {
  if (!tId) return;
  tId.value = teacher?._id || "";
  tName.value = teacher?.name || "";
  tLastName.value = teacher?.lastName || "";
  tIdNumber.value = teacher?.idNumber || "";
  tAge.value = teacher?.age ?? "";
}

//Render teachers in the table
function renderTeachersTable(teachers) {
  if (!teacherTableBody) return;

  teacherTableBody.innerHTML = "";
  if (teacherCount) teacherCount.textContent = `Total: ${teachers.length}`;

  if (!teachers.length) {
    teacherTableBody.innerHTML =
      `<tr><td colspan="5" class="emptyCell">No hay profesores registrados.</td></tr>`;
    return;
  }

  for (const t of teachers) {
    const tr = document.createElement("tr");
    tr.dataset.id = t._id;

    const tdId = document.createElement("td");
    tdId.textContent = t._id ?? "";

    const tdName = document.createElement("td");
    tdName.textContent = t.name ?? "";

    const tdLastName = document.createElement("td");
    tdLastName.textContent = t.lastName ?? "";

    const tdIdNumber = document.createElement("td");
    tdIdNumber.textContent = t.idNumber ?? "";

    const tdAge = document.createElement("td");
    tdAge.textContent = t.age ?? "";

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdLastName);
    tr.appendChild(tdIdNumber);
    tr.appendChild(tdAge);

   
    tr.addEventListener("click", () => {
      clearTeacherSelectionUI();
      selectedTeacherId = t._id;
      tr.classList.add("selected");
      fillTeacherForm(t);
      showToast("Profesor seleccionado");
    });

    teacherTableBody.appendChild(tr);
  }
}


//Create teacher
btnTeacherAdd?.addEventListener("click", async () => {
  try {
    const name = tName.value.trim();
    const lastName = tLastName.value.trim();
    const idNumber = tIdNumber.value.trim();
    const ageRaw = tAge.value;

    if (!name || !lastName || !idNumber || ageRaw === "") {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, lastName, idNumber, age: Number(ageRaw) };

    await fetchJson(`${API_BASE}/teacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    showToast("Profesor agregado exitosamente");
    fillTeacherForm(null);
    clearTeacherSelectionUI();

    await loadTeachers(); 
    await loadCourses();  
  } catch (err) {
    showToast(`Error al agregar profesor: ${err.message}`, true, 3000);
  }
});

//Update teacher
btnTeacherUpdate?.addEventListener("click", async () => {
  try {
    const id = tId.value.trim();
    const name = tName.value.trim();
    const lastName = tLastName.value.trim();
    const idNumber = tIdNumber.value.trim();
    const ageRaw = tAge.value;

    if (!id || !name || !lastName || !idNumber || ageRaw === "") {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, lastName, idNumber, age: Number(ageRaw) };

    await fetchJson(`${API_BASE}/teacher?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    showToast("Profesor actualizado");
    fillTeacherForm(null);
    clearTeacherSelectionUI();

    await loadTeachers();
    await loadCourses();
  } catch (err) {
    showToast(`Error al actualizar profesor: ${err.message}`, true, 3000);
  }
});

//Delete teacher
btnTeacherDelete?.addEventListener("click", async () => {
  try {
    const id = tId.value.trim();
    if (!id) return showToast("Selecciona un profesor para eliminar", true);

    const ok = confirm(`¿Seguro que querés eliminar el profesor con ID:\n${id}?`);
    if (!ok) return;

    await fetchJson(`${API_BASE}/teacher?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    showToast("Profesor eliminado");
    fillTeacherForm(null);
    clearTeacherSelectionUI();

    await loadTeachers();
    await loadCourses();
  } catch (err) {
    showToast(`Error al eliminar profesor: ${err.message}`, true, 3000);
  }
});


btnTeacherClear?.addEventListener("click", () => {
  fillTeacherForm(null);
  clearTeacherSelectionUI();
});



const _loadTeachersOld = loadTeachers;

loadTeachers = async function () {
  await _loadTeachersOld();          
  renderTeachersTable(teachersCache); 
};

//Create course
btnAdd.addEventListener("click", async () => {
  try {
    const name = fName.value.trim();
    const creditsRaw = fCredits.value;
    const teacherId = fTeacherId ? fTeacherId.value.trim() : "";

    if (!name || creditsRaw === "" || !teacherId) {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, credits: Number(creditsRaw), teacherId };

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

//Update course
btnUpdate.addEventListener("click", async () => {
  try {
    const id = fId.value.trim(); 
    const name = fName.value.trim();
    const creditsRaw = fCredits.value;
    const teacherId = fTeacherId ? fTeacherId.value.trim() : "";

    if (!id || !name || creditsRaw === "" || !teacherId) {
      return showToast("Complete los datos requeridos", true);
    }

    const payload = { name, credits: Number(creditsRaw), teacherId };

    await fetchJson(`${API_BASE}/course?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    showToast("Curso actualizado");
    fillForm(null);
    clearSelectionUI();
    await loadCourses();
  } catch (err) {
    showToast(`Error al actualizar: ${err.message}`, true, 3000);
  }
});

//Delete course
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


document.addEventListener("DOMContentLoaded", async () => {
  await loadTeachers();
  await loadCourses();
});

