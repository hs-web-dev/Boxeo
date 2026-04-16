// =========================
//  API URL
// =========================
const API_URL = "https://boxeo-p8t4.onrender.com/api";

// =========================
//  CHECK LOGIN STATUS
// =========================
function checkLoginStatus() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        if (!data.email) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        }

        // Affichage email dans settings
        const emailField = document.getElementById("settingsEmail");
        if (emailField) emailField.innerText = data.email;
    });
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);

// =========================
//  LOGOUT
// =========================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// =========================
//  DELETE ACCOUNT (NOUVEAU SYSTÈME)
// =========================
let deleteStep = 0;

function deleteAccount() {
    const warning = document.getElementById("deleteWarning");
    const buttons = document.getElementById("deleteConfirmButtons");

    // Première pression → afficher la confirmation
    if (deleteStep === 0) {
        warning.style.display = "block";
        buttons.style.display = "flex";
        deleteStep = 1;
        return;
    }
}

// =========================
//  CONFIRMATION BOUTONS
// =========================
document.getElementById("confirmDeleteYes").addEventListener("click", () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/auth/delete`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(() => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
});

document.getElementById("confirmDeleteNo").addEventListener("click", () => {
    document.getElementById("deleteWarning").style.display = "none";
    document.getElementById("deleteConfirmButtons").style.display = "none";
    deleteStep = 0;
});
