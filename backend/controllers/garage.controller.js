
import Garage from "../models/garage.model.js";


// =========================
//  GÉOCODAGE AUTOMATIQUE
// =========================
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    const res = await fetch(url, {
        headers: { "User-Agent": "Boxeo-App" }
    });

    const data = await res.json();

    if (!data || data.length === 0) {
        throw new Error("Adresse introuvable");
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        formatted: data[0].display_name
    };
}

// =========================
//  CRÉER UN GARAGE
// =========================
export const createGarage = async (req, res) => {
    try {
        const { name, address, type, places } = req.body;

        if (!name || !address || !places) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        // Géocodage auto
        const geo = await geocodeAddress(address);

        const garage = await Garage.create({
            name,
            address: geo.formatted,
            lat: geo.lat,
            lng: geo.lng,
            type: type || "all",
            places
        });

        res.json(garage);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  RÉCUPÉRER TOUS LES GARAGES
// =========================
export const getGarages = async (req, res) => {
    try {
        const garages = await Garage.find();
        res.json(garages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  RÉCUPÉRER UN GARAGE
// =========================
export const getGarage = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);

        if (!garage) {
            return res.status(404).json({ message: "Garage introuvable" });
        }

        res.json(garage);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  MODIFIER UN GARAGE
// =========================
export const updateGarage = async (req, res) => {
    try {
        const { name, address, type, places } = req.body;

        let updateData = { name, type, places };

        // Si l'adresse change → regéocodage
        if (address) {
            const geo = await geocodeAddress(address);
            updateData.address = geo.formatted;
            updateData.lat = geo.lat;
            updateData.lng = geo.lng;
        }

        const garage = await Garage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!garage) {
            return res.status(404).json({ message: "Garage introuvable" });
        }

        res.json(garage);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  SUPPRIMER UN GARAGE
// =========================
export const deleteGarage = async (req, res) => {
    try {
        const deleted = await Garage.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Garage introuvable" });
        }

        res.json({ message: "Garage supprimé" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
