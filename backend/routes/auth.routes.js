import express from "express";
import { register, login, me, deleteAccount } from "../controllers/auth.controller.js";
import { protect, staffOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// =========================
//  REGISTER
// =========================
router.post("/register", register);

// =========================
//  LOGIN
// =========================
router.post("/login", login);

// =========================
//  ME (profil utilisateur)
// =========================
router.get("/me", protect, me);

// =========================
//  DELETE ACCOUNT
// =========================
router.delete("/delete", protect, deleteAccount);

// =========================
//  STAFF ONLY
// =========================
router.get("/staff-zone", protect, staffOnly, (req, res) => {
    res.json({ message: "Bienvenue dans la zone staff" });
});

export default router;
