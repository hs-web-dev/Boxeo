const API_URL = "https://boxeo-p8t4.onrender.com/api";

const params = new URLSearchParams(window.location.search);
const garageId = params.get("id");

async function loadGarage() {
    try {
        const res = await fetch(`${API_URL}/garages/${garageId}`);
        const g = await res.json();

        document.getElementById("garageName").innerText = g.name;
        document.getElementById("garageAddress").innerText = "Adresse : " + g.address;
        document.getElementById("garagePlaces").innerText = "Places : " + g.places;
        document.getElementById("garageType").innerText = "Type : " + g.type;

        const map = L.map("map").setView([g.lat, g.lng], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
            .addTo(map);

        L.marker([g.lat, g.lng]).addTo(map);

    } catch (err) {
        document.getElementById("garageName").innerText = "Garage introuvable";
    }
}

loadGarage();

function goHome() {
    window.location.href = "index.html";
}
