import express from "express";
import Garage from "../models/garage.model.js";

const router = express.Router();

// Créer un garage
router.post("/", async (req, res) => {
    try {
        const garage = await Garage.create(req.body);
        res.json(garage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les garages
router.get("/", async (req, res) => {
    try {
        const garages = await Garage.find();
        res.json(garages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un garage
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Garage.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Garage introuvable" });
        }

        res.json({ message: "Garage supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
