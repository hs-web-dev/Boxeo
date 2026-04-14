import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// =========================
//  REGISTER (SIMPLE, SANS EMAIL)
// =========================
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔥 Si un compte existe déjà avec cet email, on le supprime
        await User.deleteOne({ email });

        const hashed = await bcrypt.hash(password, 10);
        const count = await User.countDocuments();

        const user = await User.create({
            email,
            password: hashed,
            role: "user",
            staffNumber: count + 1,
            emailVerified: true
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Compte créé ✔", token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  LOGIN
// =========================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "Utilisateur introuvable" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: "Mot de passe incorrect" });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Connexion réussie ✔", token });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  ME
// =========================
export const me = async (req, res) => {
    const isMaster = req.user.email === process.env.STAFF_MASTER_EMAIL;

    res.json({
        email: req.user.email,
        role: req.user.role,
        staffNumber: req.user.staffNumber,
        staffMaster: isMaster
    });
};

// =========================
//  VERIFY EMAIL (VIDE MAIS EXPORTÉ POUR ÉVITER L'ERREUR)
// =========================
export const verifyEmail = async (req, res) => {
    res.json({ message: "Vérification désactivée ✔" });
};

// =========================
//  PROMOTE STAFF
// =========================
export const makeStaff = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "Utilisateur introuvable" });

        user.role = "staff";
        await user.save();

        res.json({ message: `${email} est maintenant STAFF ✔` });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  REMOVE STAFF
// =========================
export const removeStaff = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "Utilisateur introuvable" });

        user.role = "user";
        await user.save();

        res.json({ message: `${email} n'est plus STAFF ❌` });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  DELETE ACCOUNT
// =========================
export const deleteAccount = async (req, res) => {
    try {
        await User.deleteOne({ email: req.user.email });
        res.json({ message: "Compte supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
