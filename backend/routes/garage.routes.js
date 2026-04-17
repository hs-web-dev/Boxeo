import express from "express";
import multer from "multer";

import {
    createGarage,
    getGarages,
    getGarage,
    updateGarage,
    deleteGarage
} from "../controllers/garage.controller.js";

const router = express.Router();

// === MULTER CONFIG ===
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// === UPLOAD ROUTE ===
router.post("/upload", upload.array("photos", 5), (req, res) => {
    const urls = req.files.map(f => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`);
    res.json({ urls });
});

// === CRUD GARAGES ===
router.post("/", createGarage);
router.get("/", getGarages);
router.get("/:id", getGarage);
router.put("/:id", updateGarage);
router.delete("/:id", deleteGarage);

export default router;
