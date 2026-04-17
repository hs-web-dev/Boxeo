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
//  POPUP VERIFICATION EMAIL (6 CASES)
// =========================
let verifyEmailAddress = "";

function openVerifyPopup(email) {
    verifyEmailAddress = email;

    const modal = document.getElementById("verifyModal");
    modal.classList.add("visible");

    const boxes = document.querySelectorAll(".code-box");

    boxes.forEach(box => box.value = "");

    boxes.forEach((box, index) => {
        box.addEventListener("input", () => {
            if (box.value.length === 1 && index < boxes.length - 1) {
                boxes[index + 1].focus();
            }
        });

        box.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && box.value === "" && index > 0) {
                boxes[index - 1].focus();
            }
        });
    });

    boxes[0].focus();
}

function closeVerifyPopup() {
    document.getElementById("verifyModal").classList.remove("visible");
}

// =========================
//  SUBMIT VERIFICATION CODE
// =========================
function submitVerificationCode() {
    const boxes = document.querySelectorAll(".code-box");
    const code = Array.from(boxes).map(b => b.value).join("");

    if (code.length !== 6) {
        document.getElementById("verifyMessage").innerText = "Code incomplet";
        return;
    }

    fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmailAddress, code })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("verifyMessage").innerText = data.message;

        if (data.success) {

            const password = document.getElementById("password").value;

            fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: verifyEmailAddress, password })
            })
            .then(res => res.json())
            .then(loginData => {
                if (loginData.token) {
                    localStorage.setItem("token", loginData.token);
                    closeVerifyPopup();
                    checkLoginStatus();
                    window.location.reload();
                } else {
                    closeVerifyPopup();
                    openLogin();
                }
            });
        }
    });
}

// =========================
//  API URL
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

        if (data.needVerification === true) {
            closeLogin();
            openVerifyPopup(email);
            return;
        }

        alert(data.message);
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
            closeLogin();
            checkLoginStatus();
            window.location.reload();
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
    checkLoginStatus();
    window.location.reload();
}

// =========================
//  CHECK LOGIN + STAFF
// =========================
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const userStatus = document.getElementById("userStatus");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const nav = document.querySelector(".nav");

    const oldStaffBtn = document.querySelector(".staff-link");
    if (oldStaffBtn) oldStaffBtn.remove();

    if (!token) {
        if (userStatus) userStatus.innerHTML = "Non connecté";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        return;
    }

    fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {

        if (!data.email) return;

        if (userStatus) userStatus.innerHTML = `Connecté : ${data.email}`;
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";

        if (data.role === "staff" || data.staffMaster === true) {
            const staffBtn = document.createElement("a");
            staffBtn.href = "staff.html";
            staffBtn.innerText = "Espace Staff";
            staffBtn.classList.add("staff-link");
            nav.appendChild(staffBtn);
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

    if (!confirm("Voulez-vous vraiment supprimer votre compte ?")) return;

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
//  RESET SEARCHBAR
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.value = "";
        searchInput.setAttribute("autocomplete", "off");
    }
});

// =========================
//  CARTE LEAFLET
// =========================
L.Marker.prototype.options.renderer = L.canvas();

if (document.getElementById("map") && typeof L !== "undefined") {

    const map = L.map('map', {
        preferCanvas: true
    }).setView([48.8566, 2.3522], 12);

    const lightStyle = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { attribution: '© Carto', maxZoom: 19 }
    );

    lightStyle.addTo(map);

    const carIcon = L.icon({
        iconUrl: 'assets/icons/carpoint.png',
        iconSize: [50, 70],
        iconAnchor: [25, 55],
        popupAnchor: [0, -60]
    });

    const garagesLayer = L.layerGroup({
        renderer: L.canvas()
    }).addTo(map);

    let garages = [];

    async function loadGaragesFromBackend() {
        try {
            const res = await fetch(`${API_URL}/garages`);
            garages = await res.json();

            garages = garages.filter(g =>
                typeof g.lat === "number" &&
                typeof g.lng === "number"
            );

            refreshMarkers();
        } catch (err) {
            console.error("Erreur chargement garages :", err);
        }
    }

    function afficherGarages(filtreTexte = "", filtreType = "") {
        garagesLayer.clearLayers();

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

            const matchType =
                !filtreType ||
                g.type === filtreType;

            if (matchTexte && matchType) {
                const marker = L.marker([g.lat, g.lng], { icon: carIcon });

                marker.bindTooltip(
                    `<b>${g.name ?? "Garage"}</b><br>${g.address ?? ""}`
                );

                // 🔥 VERSION FINALE : redirection dynamique avec ID
                marker.on("click", () => {
                    window.location.href = `garage.html?id=${g._id}`;
                });

                marker.addTo(garagesLayer);
            }
        });
    }

    function refreshMarkers() {
        const searchInput = document.querySelector(".search-box input");
        const typeSelect = document.querySelector(".search-box select");

        afficherGarages(
            searchInput ? searchInput.value : "",
            typeSelect ? typeSelect.value : ""
        );
    }

    map.on("zoomend", refreshMarkers);
    map.on("moveend", refreshMarkers);

    map.whenReady(() => {
        refreshMarkers();
    });

    loadGaragesFromBackend();

    const searchInput = document.querySelector(".search-box input");
    const typeSelect = document.querySelector(".search-box select");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput) {
        searchInput.addEventListener("input", refreshMarkers);
    }

    if (typeSelect) {
        typeSelect.addEventListener("change", refreshMarkers);
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", refreshMarkers);
    }
}
