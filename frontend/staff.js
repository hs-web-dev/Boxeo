const API_URL = "https://boxeo-p8t4.onrender.com/api";
const token = localStorage.getItem("token");

// =========================
//  PROTECTION STAFF
// =========================
async function checkStaff() {
    if (!token) {
        alert("Accès refusé");
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.email || !(data.role === "staff" || data.staffMaster === true)) {
        alert("Accès refusé");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("staffEmail").innerHTML = "Connecté : " + data.email;
}

checkStaff();

// =========================
//  CHARGER LES GARAGES
// =========================
async function loadGarages() {
    const res = await fetch(`${API_URL}/garages`);
    const garages = await res.json();

    const list = document.getElementById("garageList");
    list.innerHTML = "";

    garages.forEach(g => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${g.name}</td>
            <td>${g.address}</td>
            <td>${g.type}</td>
            <td>${g.lat}</td>
            <td>${g.lng}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editGarage('${g._id}')">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteGarage('${g._id}')">Supprimer</button>
            </td>
        `;

        list.appendChild(row);
    });
}

loadGarages();

// =========================
//  AJOUT / MODIFICATION
// =========================
document.getElementById("garageForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("garageId").value;
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const type = document.getElementById("type").value;

    const body = { name, address, lat, lng, type };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/garages/${id}` : `${API_URL}/garages`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    alert("Garage enregistré !");
    loadGarages();
    document.getElementById("garageForm").reset();
    document.getElementById("formTitle").innerText = "Ajouter un garage";
});

// =========================
//  CHARGER UN GARAGE POUR MODIF
// =========================
async function editGarage(id) {
    const res = await fetch(`${API_URL}/garages/${id}`);
    const g = await res.json();

    document.getElementById("garageId").value = g._id;
    document.getElementById("name").value = g.name;
    document.getElementById("address").value = g.address;
    document.getElementById("lat").value = g.lat;
    document.getElementById("lng").value = g.lng;
    document.getElementById("type").value = g.type;

    document.getElementById("formTitle").innerText = "Modifier un garage";
}

// =========================
//  SUPPRESSION
// =========================
async function deleteGarage(id) {
    if (!confirm("Supprimer ce garage ?")) return;

    await fetch(`${API_URL}/garages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    alert("Garage supprimé !");
    loadGarages();
}

// =========================
//  LOGOUT
// =========================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
