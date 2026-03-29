import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export async function register(req, res) {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    res.json({
        message: "Compte créé",
        token: generateToken(user)
    });
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Mot de passe incorrect" });

    res.json({
        message: "Connexion réussie",
        token: generateToken(user)
    });
}

export async function me(req, res) {
    res.json({ id: req.user.id, email: req.user.email });
}

