import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.json({ message: "Token manquant" });

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.json({ message: "Token invalide" });
    }
};

export const staffOnly = (req, res, next) => {
    if (req.user.role !== "staff") {
        return res.json({ message: "Accès réservé au staff" });
    }
    next();
};

export const staffMasterOnly = (req, res, next) => {
    if (req.user.email !== process.env.STAFF_MASTER_EMAIL) {
        return res.json({ message: "Accès réservé au Staff Master" });
    }
    next();
};
