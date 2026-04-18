// controllers/garage.controller.js
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
        const {
            name,
            address,
            type,
            places,
            dimensions = "",
            description = "",
            photos = []
        } = req.body;

        if (!name || !address || !places) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        const geo = await geocodeAddress(address);

        const garage = await Garage.create({
            name,
            address: geo.formatted,
            lat: geo.lat,
            lng: geo.lng,
            type: type || "all",
            places,
            dimensions,
            description,
            photos
        });

        res.json(garage);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  RÉCUPÉRER TOUS LES GARAGES
// =========================
export const getGarages = async (req, res) => {
    try {
        const garages = await Garage.find().sort({ createdAt: -1 });
        res.json(garages);
    } catch (err) {
        console.error(err);
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
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// =========================
//  MODIFIER UN GARAGE
// =========================
export const updateGarage = async (req, res) => {
    try {
        const {
            name,
            address,
            type,
            places,
            dimensions,
            description,
            photos
        } = req.body;

        const garage = await Garage.findById(req.params.id);
        if (!garage) {
            return res.status(404).json({ message: "Garage introuvable" });
        }

        if (name) garage.name = name;
        if (typeof places !== "undefined") garage.places = places;
        if (type) garage.type = type;
        if (typeof dimensions !== "undefined") garage.dimensions = dimensions;
        if (typeof description !== "undefined") garage.description = description;

        // Si l'adresse change → regéocodage
        if (address) {
            const geo = await geocodeAddress(address);
            garage.address = geo.formatted;
            garage.lat = geo.lat;
            garage.lng = geo.lng;
        }

        // 🔥 ne pas écraser si pas de nouvelles photos
        if (Array.isArray(photos) && photos.length > 0) {
            garage.photos = photos;
        }

        await garage.save();
        res.json(garage);

    } catch (err) {
        console.error(err);
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
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
