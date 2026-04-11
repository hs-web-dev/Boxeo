import express from "express";
import { 
    register, 
    login, 
    me, 
    deleteAccount, 
    makeStaff 
} from "../controllers/auth.controller.js";

import { protect, staffOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// ME
router.get("/me", protect, me);

// DELETE ACCOUNT
router.delete("/delete", protect, deleteAccount);

// PROMOTE STAFF
router.post("/make-staff", protect, staffOnly, makeStaff);

// STAFF ZONE TEST
router.get("/staff-zone", protect, staffOnly, (req, res) => {
    res.json({ message: "Bienvenue dans la zone staff" });
});

export default router;
