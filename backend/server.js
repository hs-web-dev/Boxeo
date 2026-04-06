import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import des routes API
import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";
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
//  CORS (IMPORTANT POUR RENDER)
// =========================
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5500",
        "https://boxeo-frontend.onrender.com"
    ],
    credentials: true
}));

// =========================
//  MIDDLEWARES
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// =========================
//  ROUTES API
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/garages", garageRoutes);
app.use("/staff", staffRoutes);

// =========================
//  ROUTE PAR DÉFAUT
// =========================
app.get("/", (req, res) => {
    res.send("Boxeo backend is running");
});

// =========================
//  SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend lancé sur le port ${PORT}`);
});
