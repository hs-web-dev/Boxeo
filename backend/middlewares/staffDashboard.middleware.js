import dotenv from "dotenv";
dotenv.config();

export function checkStaffId(req, res, next) {
    const staffIdFromEnv = process.env.STAFF_ID;
    const staffIdFromUrl = req.params.staffId;

    if (!staffIdFromEnv || staffIdFromUrl !== staffIdFromEnv) {
        return res.status(404).send("Page introuvable");
    }

    next();
}

export function checkStaffPassword(req, res, next) {
    const staffPasswordFromEnv = process.env.STAFF_PASSWORD;
    const { password } = req.body;

    if (!password || password !== staffPasswordFromEnv) {
        return res.status(401).send("Mot de passe incorrect");
    }

    next();
}