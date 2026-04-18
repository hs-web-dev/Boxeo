const API_URL = "https://boxeo-p8t4.onrender.com/api";

const params = new URLSearchParams(window.location.search);
const garageId = params.get("id");

let sliderIndex = 0;
let sliderInterval;

async function loadGarage() {
    try {
        const res = await fetch(`${API_URL}/garages/${garageId}`);
        const g = await res.json();

        if (!g || !g._id) {
            document.querySelector(".garage-wrapper").innerHTML = "<h1>Garage introuvable</h1>";
            return;
        }

        document.getElementById("garageName").innerText = g.name;
        document.getElementById("garageAddress").innerText = "Adresse : " + g.address;
        document.getElementById("garagePlaces").innerText = "Places : " + g.places;
        document.getElementById("garageType").innerText = "Type : " + g.type;
        document.getElementById("garageDimensions").innerText = g.dimensions ? "Dimensions : " + g.dimensions : "";
        document.getElementById("garageDescription").innerText = g.description || "";

        const mainImage = document.getElementById("mainImage");
        const thumbContainer = document.getElementById("thumbContainer");

        let photos = g.photos || [];

        if (photos.length > 0) {
            mainImage.src = photos[0];

            photos.forEach((url, index) => {
                if (index === 0) return;

                const img = document.createElement("img");
                img.src = url;

                img.onclick = () => {
                    const temp = mainImage.src;
                    mainImage.src = img.src;
                    img.src = temp;
                };

                thumbContainer.appendChild(img);
            });
        }

        // SLIDER AUTO
        if (photos.length > 1) {
            sliderInterval = setInterval(() => {
                sliderIndex = (sliderIndex + 1) % photos.length;
                mainImage.src = photos[sliderIndex];
            }, 3500);
        }

        // MAP
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
        document.querySelector(".garage-wrapper").innerHTML = "<h1>Garage introuvable</h1>";
    }
}

function goHome() {
    window.location.href = "index.html";
}

loadGarage();
