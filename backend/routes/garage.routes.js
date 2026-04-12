import express from "express";
import {
    createGarage,
    getGarages,
    getGarage,
    updateGarage,
    deleteGarage
} from "../controllers/garage.controller.js";

const router = express.Router();

router.post("/", createGarage);
router.get("/", getGarages);
router.get("/:id", getGarage);
router.put("/:id", updateGarage);
router.delete("/:id", deleteGarage);

export default router;
