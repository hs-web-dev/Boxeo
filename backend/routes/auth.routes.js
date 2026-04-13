import express from "express";
import { 
    register, 
    login, 
    me, 
    deleteAccount, 
    makeStaff,
    removeStaff,
    verifyEmail
} from "../controllers/auth.controller.js";

import { protect, staffOnly, staffMasterOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// VERIFY EMAIL
router.post("/verify-email", verifyEmail);

// LOGIN
router.post("/login", login);

// ME
router.get("/me", protect, me);

// DELETE ACCOUNT
router.delete("/delete", protect, deleteAccount);

// PROMOTE STAFF (MASTER ONLY)
router.post("/make-staff", protect, staffMasterOnly, makeStaff);

// REMOVE STAFF (MASTER ONLY)
router.post("/remove-staff", protect, staffMasterOnly, removeStaff);

// STAFF ZONE TEST
router.get("/staff-zone", protect, staffOnly, (req, res) => {
    res.json({ message: "Bienvenue dans la zone staff" });
});

export default router;
