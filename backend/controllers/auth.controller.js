import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// =========================
//  GENERATE 6 DIGIT CODE
// =========================
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// =========================
//  SEND EMAIL
// =========================
async function sendVerificationEmail(to, code) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: "Votre code de vérification Boxeo",
        text: `Votre code de vérification est : ${code}`
    });
}

// =========================
//  REGISTER
// =========================
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.json({ message: "Email déjà utilisé" });

        const hashed = await bcrypt.hash(password, 10);
        const count = await User.countDocuments();

        const code = generateCode();

        const user = await User.create({
            email,
            password: hashed,
            role: "user",
            staffNumber: count + 1,
            emailCode: code,
            emailVerified: false
        });

        await sendVerificationEmail(email, code);

        res.json({ 
            message: "Compte créé ✔ Vérifiez votre email.",
            needVerification: true 
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// =========================
//  VERIFY EMAIL
// =========================
export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "Utilisateur introuvable" });

    if (user.emailCode !== code) {
        return res.json({ message: "Code incorrect ❌" });
    }

    user.emailVerified = true;
    user.emailCode = null;
    await user.save();

    res.json({ message: "Email vérifié ✔" });
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
            return res.json({ message: "Veuillez vérifier votre email avant de vous connecter." });

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
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "Compte supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
