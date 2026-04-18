// staff.js
const API_URL = "https://boxeo-p8t4.onrender.com/api";
const token = localStorage.getItem("token");

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

async function checkStaff() {
  if (!token) {
    alert("Accès refusé");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  if (!data.email || !(data.role === "staff" || data.staffMaster === true)) {
    alert("Accès refusé");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("staffEmail").innerText = "Connecté : " + data.email;

  if (data.staffMaster === true) {
    document.getElementById("promotionZone").style.display = "block";
    loadStaffList();
  }
}

checkStaff();

// AUTOCOMP ADRESSE
const addressInput = document.getElementById("address");
const suggestionsBox = document.getElementById("addressSuggestions");

addressInput.addEventListener("input", async () => {
  const query = addressInput.value.trim();
  if (query.length < 3) {
    suggestionsBox.innerHTML = "";
    return;
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5`,
    { headers: { "User-Agent": "Boxeo-App" } }
  );

  const results = await res.json();
  suggestionsBox.innerHTML = "";

  results.forEach((r) => {
    const div = document.createElement("div");
    div.innerText = r.display_name;
    div.onclick = () => {
      addressInput.value = r.display_name;
      suggestionsBox.innerHTML = "";
    };
    suggestionsBox.appendChild(div);
  });
});

// PREVIEW IMAGES
const uploadInput = document.getElementById("photoUpload");
const previewContainer = document.getElementById("previewContainer");
let currentPhotos = [];

uploadInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";
  for (let file of uploadInput.files) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewContainer.appendChild(img);
  }
});

// LISTE GARAGES
let allGarages = [];

async function loadGarages() {
  const res = await fetch(`${API_URL}/garages`);
  allGarages = await res.json();

  const list = document.getElementById("garageList");
  list.innerHTML = "";

  allGarages.forEach((g) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${g.name}</td>
      <td>${g.address}</td>
      <td>${g.places}</td>
      <td>${g.type}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editGarage('${g._id}')">Modifier</button>
        <button class="action-btn delete-btn" onclick="deleteGarage('${g._id}')">Supprimer</button>
      </td>
    `;

    list.appendChild(row);
  });
}

loadGarages();

// AUTOCOMP GARAGES
const garageSearchInput = document.getElementById("garageSearchInput");
const garageSearchSuggestions = document.getElementById("garageSearchSuggestions");

garageSearchInput.addEventListener("input", () => {
  const q = garageSearchInput.value.toLowerCase();
  garageSearchSuggestions.innerHTML = "";

  if (q.length < 2) return;

  const matches = allGarages.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.address.toLowerCase().includes(q)
  );

  matches.forEach((g) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${g.name}</b><br>${g.address}`;
    div.onclick = () => {
      editGarage(g._id);
      garageSearchSuggestions.innerHTML = "";
    };
    garageSearchSuggestions.appendChild(div);
  });
});

// SUBMIT FORM
document.getElementById("garageForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("garageId").value;
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const places = parseInt(document.getElementById("places").value);
  const type = document.getElementById("type").value;
  const dimensions = document.getElementById("dimensions").value.trim();
  const description = document.getElementById("description").value.trim();

  let photos = [];

  if (uploadInput.files.length > 0) {
    const formData = new FormData();
    for (let file of uploadInput.files) {
      formData.append("photos", file);
    }

    const uploadRes = await fetch(`${API_URL}/garages/upload`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    const uploadData = await uploadRes.json();
    photos = uploadData.urls || [];
  } else if (id && currentPhotos.length > 0) {
    photos = currentPhotos;
  }

  const body = {
    name,
    address,
    places,
    type,
    dimensions,
    description,
    photos
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/garages/${id}` : `${API_URL}/garages`;

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  alert("Garage enregistré !");
  loadGarages();
  document.getElementById("garageForm").reset();
  previewContainer.innerHTML = "";
  currentPhotos = [];
  document.getElementById("formTitle").innerText = "Ajouter un garage";
});

// EDIT GARAGE
async function editGarage(id) {
  const res = await fetch(`${API_URL}/garages/${id}`);
  const g = await res.json();

  document.getElementById("garageId").value = g._id;
  document.getElementById("name").value = g.name;
  document.getElementById("address").value = g.address;
  document.getElementById("places").value = g.places;
  document.getElementById("type").value = g.type;
  document.getElementById("dimensions").value = g.dimensions || "";
  document.getElementById("description").value = g.description || "";

  currentPhotos = Array.isArray(g.photos) ? g.photos : [];

  uploadInput.value = "";
  previewContainer.innerHTML = "";

  document.getElementById("formTitle").innerText = "Modifier un garage";
}

// DELETE GARAGE
async function deleteGarage(id) {
  if (!confirm("Supprimer ce garage ?")) return;

  await fetch(`${API_URL}/garages/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  alert("Garage supprimé !");
  loadGarages();
}

// STAFF PROMO
async function promoteUser() {
  const email = document.getElementById("promoteEmail").value.trim();
  if (!email) return alert("Entrez un email");

  const res = await fetch(`${API_URL}/auth/make-staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message);
}

// STAFF LIST
let staffList = [];

async function loadStaffList() {
  const res = await fetch(`${API_URL}/staff/list`, {
    headers: { Authorization: "Bearer " + token }
  });

  staffList = await res.json();
}

const removeEmailInput = document.getElementById("removeEmail");
const removeStaffSuggestions = document.getElementById("removeStaffSuggestions");

removeEmailInput.addEventListener("input", () => {
  const q = removeEmailInput.value.toLowerCase();
  removeStaffSuggestions.innerHTML = "";

  if (q.length < 1) return;

  const matches = staffList.filter((u) =>
    u.email.toLowerCase().includes(q)
  );

  matches.forEach((u) => {
    const div = document.createElement("div");
    div.innerText = u.email;
    div.onclick = () => {
      removeEmailInput.value = u.email;
      removeStaffSuggestions.innerHTML = "";
    };
    removeStaffSuggestions.appendChild(div);
  });
});

// REMOVE STAFF
async function removeUser() {
  const email = removeEmailInput.value.trim();
  if (!email) return alert("Entrez un email");

  const res = await fetch(`${API_URL}/auth/remove-staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  alert(data.message);
}

function goHome() {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
