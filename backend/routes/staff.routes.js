import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { checkStaffId, checkStaffPassword } from "../middlewares/staffDashboard.middleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PAGE LOGIN STAFF (protégée par ID)
router.get("/:staffId", checkStaffId, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/staff-login.html"));
});

// VALIDATION MOT DE PASSE STAFF
router.post("/:staffId/login", checkStaffId, express.urlencoded({ extended: true }), checkStaffPassword, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/staff-dashboard.html"));
});

export default router;