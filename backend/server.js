// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import garageRoutes from "./routes/garage.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://boxeo-frontend.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (optionnel) si tu gardes encore des fichiers locaux
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/garages", garageRoutes);
app.use("/api/staff", staffRoutes);

app.get("/", (req, res) => {
  res.send("Boxeo backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
