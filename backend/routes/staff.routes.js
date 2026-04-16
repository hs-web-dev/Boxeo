import express from "express";
import User from "../models/User.js";
import { protect, staffMasterOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔥 Liste des utilisateurs STAFF
router.get("/list", protect, staffMasterOnly, async (req, res) => {
    try {
        const staff = await User.find({ role: "staff" }).select("email");
        res.json(staff);
    } catch (err) {
        console.log("Erreur STAFF LIST :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
