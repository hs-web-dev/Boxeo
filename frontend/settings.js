const API_URL = "https://boxeo-p8t4.onrender.com/api";
const token = localStorage.getItem("token");

// =========================
//  PROTECTION
// =========================
async function checkSettingsAccess() {
    if (!token) {
        alert("Vous devez être connecté");
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.email) {
        alert("Accès refusé");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userEmail").innerText = "Connecté : " + data.email;
}

checkSettingsAccess();

// =========================
//  SUPPRESSION COMPTE
// =========================
async function deleteAccount() {
    if (!confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.")) {
        return;
    }

    const res = await fetch(`${API_URL}/auth/delete`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    alert(data.message);

    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// =========================
//  RETOUR ACCUEIL
// =========================
function goHome() {
    window.location.href = "index.html";
}

// =========================
//  LOGOUT
// =========================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
