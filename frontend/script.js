// =========================
//  POPUP LOGIN
// =========================
function openLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("visible");
}

function closeLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("visible");
}

// =========================
//  API URL (BACKEND RENDER)
// =========================
const API_URL = "https://boxeo-p8t4.onrender.com/api";

// =========================
//  REGISTER
// =========================
function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Compte créé !");
            closeLogin();
            checkLoginStatus();
        } else {
            alert(data.message);
        }
    });
}

// =========================
//  LOGIN
// =========================
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Connexion réussie !");
            closeLogin();
            checkLoginStatus();
        } else {
            alert(data.message);
        }
    });
}

// =========================
//  LOGOUT
// =========================
function logout() {
    localStorage.removeItem("token");
    alert("Déconnecté");
    checkLoginStatus();
}

// =========================
//  CHECK LOGIN
// =========================
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userStatus = document.getElementById("userStatus");
    const userEmail = document.getElementById("userEmail");

    if (!token) {
        if (userStatus) userStatus.innerHTML = "Non connecté";
        if (userEmail) userEmail.innerHTML = "";
        return;
    }

    fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        if (data.email) {
            if (userStatus) userStatus.innerHTML = `Connecté : ${data.email}`;
            if (userEmail) userEmail.innerHTML = data.email;

            const settingsEmail = document.getElementById("settingsEmail");
            if (settingsEmail) settingsEmail.innerHTML = "Connecté : " + data.email;
        } else {
            if (userStatus) userStatus.innerHTML = "Non connecté";
        }
    });
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);

// =========================
//  GO TO SETTINGS
// =========================
function goToSettings() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté");
        openLogin();
        return;
    }

    window.location.href = "settings.html";
}

// =========================
//  DELETE ACCOUNT
// =========================
function deleteAccount() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vous devez être connecté");
        return;
    }

    if (!confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.")) {
        return;
    }

    fetch(`${API_URL}/auth/delete`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    })
    .catch(() => alert("Erreur serveur"));
}

// =========================
//  NORMALISATION
// =========================
function normalize(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// =========================
//  LEVENSHTEIN
// =========================
function levenshtein(a, b) {
    const matrix = [];
    const alen = a.length;
    const blen = b.length;

    if (alen === 0) return blen;
    if (blen === 0) return alen;

    for (let i = 0; i <= alen; i++) matrix[i] = [i];
    for (let j = 0; j <= blen; j++) matrix[0][j] = j;

    for (let i = 1; i <= alen; i++) {
        for (let j = 1; j <= blen; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[alen][blen];
}

// =========================
//  ANIMATIONS
// =========================
const animatedElements = document.querySelectorAll(".fade-up, .fade-in");

function handleScrollAnimations() {
    animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", handleScrollAnimations);
window.addEventListener("load", handleScrollAnimations);

// =========================
//  RESET SEARCHBAR AU CHARGEMENT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.value = "";
        searchInput.setAttribute("autocomplete", "off");
    }
});

// =========================
//  CARTE LEAFLET (DYNAMIQUE)
// =========================
if (document.getElementById("map") && typeof L !== "undefined") {

    const map = L.map('map').setView([48.8566, 2.3522], 12);

    const lightStyle = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: '© Carto', maxZoom: 19 }
    );

    const esriStyle = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri', maxZoom: 19 }
    );

    lightStyle.addTo(map);
    let currentStyle = "light";

    const toggleBtn = document.getElementById("toggleMapStyle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (currentStyle === "light") {
                map.removeLayer(lightStyle);
                esriStyle.addTo(map);
                currentStyle = "esri";
            } else {
                map.removeLayer(esriStyle);
                lightStyle.addTo(map);
                currentStyle = "light";
            }
        });
    }

    const carIcon = L.icon({
        iconUrl: 'assets/icons/carpoint.png',
        iconSize: [50, 70],
        iconAnchor: [25, 70],
        popupAnchor: [0, -60]
    });

    // =========================
    //  GARAGES DYNAMIQUES
    // =========================
    let garages = [];
    let markers = [];

    async function loadGaragesFromBackend() {
        try {
            const res = await fetch(`${API_URL}/garages`);
            garages = await res.json();

            garages = garages.filter(g => 
                typeof g.lat === "number" && 
                typeof g.lng === "number" &&
                !isNaN(g.lat) && 
                !isNaN(g.lng)
            );

            afficherGarages();
        } catch (err) {
            console.error("Erreur chargement garages :", err);
        }
    }

    function afficherGarages(filtreTexte = "", filtreType = "") {
        if (!Array.isArray(garages) || garages.length === 0) return;

        markers.forEach(m => map.removeLayer(m));
        markers = [];

        const texte = normalize(filtreTexte);

        garages.forEach(g => {
            const name = normalize(g.name || "");
            const addr = normalize(g.address || "");

            const matchTexte =
                texte === "" ||
                name.includes(texte) ||
                addr.includes(texte) ||
                levenshtein(name, texte) <= 3 ||
                levenshtein(addr, texte) <= 3;

            const matchType = !filtreType || filtreType === "" || g.type === filtreType;

            if (matchTexte && matchType) {
                const marker = L.marker([g.lat, g.lng], { icon: carIcon }).addTo(map);

                marker.bindTooltip(
                    `<b>${g.name ?? "Garage"}</b><br>${g.address ?? ""}`,
                    { permanent: false, direction: "top", offset: [0, -10], opacity: 1, className: "custom-tooltip" }
                );

                marker.on("click", () => {
                    if (g._id) {
                        window.location.href = `garage.html?id=${g._id}`;
                    }
                });

                markers.push(marker);
            }
        });
    }

    map.on("zoomend", () => {
        const searchInput = document.querySelector(".search-box input");
        const typeSelect = document.querySelector(".search-box select");

        const currentText = searchInput ? searchInput.value : "";
        const currentType = typeSelect ? typeSelect.value : "";

        afficherGarages(currentText, currentType);
    });

    loadGaragesFromBackend();

    const searchInput = document.querySelector(".search-box input");
    const typeSelect = document.querySelector(".search-box select");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput) {
        searchInput.value = "";
        searchInput.addEventListener("input", () => {
            afficherGarages(searchInput.value, typeSelect ? typeSelect.value : "");
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener("change", () => {
            afficherGarages(searchInput ? searchInput.value : "", typeSelect.value);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            afficherGarages(
                searchInput ? searchInput.value : "",
                typeSelect ? typeSelect.value : ""
            );
        });
    }
}
