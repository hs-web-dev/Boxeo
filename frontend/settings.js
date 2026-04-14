const API_URL = "https://boxeo-p8t4.onrender.com/api";

// Afficher l'email de l'utilisateur
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté");
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    document.getElementById("userEmail").innerText = "Email : " + data.email;
});

// Retour à l'accueil
function goHome() {
    window.location.href = "index.html";
}

// Déconnexion
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// =========================
//  DELETE ACCOUNT (VERSION CORRECTE)
// =========================
function deleteAccount() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté");
        return;
    }

    if (!confirm("Voulez-vous vraiment supprimer votre compte ?")) return;

    // 🔥 IMPORTANT : supprimer le token AVANT l'appel backend
    localStorage.removeItem("token");

    fetch(`${API_URL}/auth/delete`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "index.html";
    })
    .catch(() => alert("Erreur serveur"));
}
