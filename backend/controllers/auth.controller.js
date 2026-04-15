import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// =========================
//  SEND EMAIL VIA BREVO API (HTTP)
// =========================
async function sendVerificationEmail(to, code) {
    const payload = {
        sender: { email: process.env.MAIL_FROM },
        to: [{ email: to }],
        subject: "Votre code de vérification Boxeo",
        htmlContent: `
            <h2>Bienvenue sur Boxeo</h2>
            <p>Voici votre code de vérification :</p>
            <h1 style="font-size:32px; letter-spacing:4px;">${code}</h1>
        `
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Brevo error:", errorText);
        throw new Error("Erreur envoi email");
    }
}

// =========================
//  REGISTER
// =========================
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        await User.deleteOne({ email });

        const hashed = await bcrypt.hash(password, 10);
        const count = await User.countDocuments();

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await User.create({
            email,
            password: hashed,
            role: "user",
            staffNumber: count + 1,
            emailVerified: false,
            emailCode: code
        });

        // 🔥 ENVOI EMAIL VIA API HTTP
        await sendVerificationEmail(email, code);

        res.json({ needVerification: true });

    } catch (err) {
        console.log("Erreur REGISTER :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  VERIFY EMAIL
// =========================
export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "Utilisateur introuvable" });

        if (user.emailCode !== code)
            return res.json({ message: "Code incorrect" });

        user.emailVerified = true;
        user.emailCode = null;
        await user.save();

        res.json({ success: true, message: "Email vérifié ✔" });

    } catch (err) {
        console.log("Erreur VERIFY :", err);
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

        if (!user.emailVerified)
            return res.json({ message: "Email non vérifié" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: "Mot de passe incorrect" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Connexion réussie ✔", token });

    } catch (err) {
        console.log("Erreur LOGIN :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  ME
// =========================
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        const isMaster = user.email === process.env.STAFF_MASTER_EMAIL;

        res.json({
            email: user.email,
            role: user.role,
            staffNumber: user.staffNumber,
            staffMaster: isMaster
        });

    } catch (err) {
        console.log("Erreur ME :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
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
        console.log("Erreur MAKE STAFF :", err);
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
        console.log("Erreur REMOVE STAFF :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  DELETE ACCOUNT
// =========================
export const deleteAccount = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.userId });
        res.json({ message: "Compte supprimé avec succès" });
    } catch (err) {
        console.log("Erreur DELETE ACCOUNT :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
