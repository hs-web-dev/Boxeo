import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
//  PROTECT (auth obligatoire)
// =========================
export async function protect(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token manquant" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        req.user = user; // contient email, role, createdAt, id
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide" });
    }
}

// =========================
//  STAFF ONLY (admin)
// =========================
export function staffOnly(req, res, next) {
    if (req.user.role === "staff") return next();
    if (req.user.email === process.env.STAFF_MASTER_EMAIL) return next();
    return res.status(403).json({ message: "Accès réservé au staff" });
}

