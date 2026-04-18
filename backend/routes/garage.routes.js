// routes/garage.routes.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

import {
    createGarage,
    getGarages,
    getGarage,
    updateGarage,
    deleteGarage
} from "../controllers/garage.controller.js";

const router = express.Router();

// === MULTER EN MÉMOIRE (pour Cloudinary) ===
const upload = multer({ storage: multer.memoryStorage() });

// === UPLOAD VERS CLOUDINARY ===
router.post("/upload", upload.array("photos"), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({ urls: [] });
        }

        const uploads = await Promise.all(
            req.files.map(
                (file) =>
                    new Promise((resolve, reject) => {
                        cloudinary.uploader
                            .upload_stream(
                                { folder: "boxeo_garages" },
                                (error, result) => {
                                    if (error) return reject(error);
                                    resolve(result.secure_url);
                                }
                            )
                            .end(file.buffer);
                    })
            )
        );

        res.json({ urls: uploads });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur upload Cloudinary" });
    }
});

// === CRUD GARAGES ===
router.post("/", createGarage);
router.get("/", getGarages);
router.get("/:id", getGarage);
router.put("/:id", updateGarage);
router.delete("/:id", deleteGarage);

export default router;
