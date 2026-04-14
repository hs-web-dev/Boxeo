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

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/me", protect, me);
router.delete("/delete", protect, deleteAccount);
router.post("/make-staff", protect, staffMasterOnly, makeStaff);
router.post("/remove-staff", protect, staffMasterOnly, removeStaff);

router.get("/staff-zone", protect, staffOnly, (req, res) => {
    res.json({ message: "Bienvenue dans la zone staff" });
});

export default router;
