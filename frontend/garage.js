const API_URL = "https://boxeo-p8t4.onrender.com/api";

const params = new URLSearchParams(window.location.search);
const garageId = params.get("id");

async function loadGarage() {
    try {
        const res = await fetch(`${API_URL}/garages/${garageId}`);
        const g = await res.json();

        if (!g || !g._id) {
            document.querySelector(".container").innerHTML = "<h1>Garage introuvable</h1>";
            return;
        }

        document.getElementById("garageName").innerText = g.name;
        document.getElementById("garageAddress").innerText = "Adresse : " + g.address;
        document.getElementById("garagePlaces").innerText = "Places : " + g.places;
        document.getElementById("garageType").innerText = "Type : " + g.type;
        document.getElementById("garageDimensions").innerText = g.dimensions ? "Dimensions : " + g.dimensions : "";
        document.getElementById("garageDescription").innerText = g.description || "";

        const mainImage = document.getElementById("mainImage");
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const img3 = document.getElementById("img3");

        // ============================
        //     AFFICHAGE DES PHOTOS
        // ============================
        if (g.photos && g.photos.length > 0) {
            mainImage.src = g.photos[0];

            img1.src = g.photos[1] || g.photos[0];
            img2.src = g.photos[2] || g.photos[0];
            img3.src = g.photos[3] || g.photos[0];
        }

        img1.onclick = () => mainImage.src = img1.src;
        img2.onclick = () => mainImage.src = img2.src;
        img3.onclick = () => mainImage.src = img3.src;

        // ============================
        //     CARTE LEAFLET
        // ============================
        const map = L.map("map").setView([g.lat, g.lng], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(map);

        L.marker([g.lat, g.lng]).addTo(map);

        document.getElementById("reserveBtn").onclick = () => {
            alert("Système de réservation à venir.");
        };

    } catch (err) {
        console.error(err);
        document.querySelector(".container").innerHTML = "<h1>Garage introuvable</h1>";
    }
}

function goHome() {
    window.location.href = "index.html";
}

loadGarage();
