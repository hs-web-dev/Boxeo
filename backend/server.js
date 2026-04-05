import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import des routes API
import authRoutes from "./routes/auth.routes.js";
//import paymentRoutes from "./routes/payment.routes.js";
import staffRoutes from "./routes/staff.routes.js"; // <-- AJOUT
import mongoose from "mongoose";
import garageRoutes from "./routes/garage.routes.js";

dotenv.config();
connectDB();

const app = express();

// =========================
//  CONFIG PATH
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
//  MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/garages", garageRoutes);

// =========================
//  STATIC FILES (public)
// =========================

app.use(express.static("public"));

// =========================
//  ROUTES API
// =========================
app.use("/api/auth", authRoutes);
//app.use("/api/payment", paymentRoutes);

// =========================
//  ROUTE STAFF (ID secret)
// =========================
app.use("/staff", staffRoutes);

// =========================
//  SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend lancé sur le port ${PORT}`);
});