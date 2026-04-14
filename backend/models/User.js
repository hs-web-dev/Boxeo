import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        required: true 
    },

    // Rôle utilisateur
    role: { 
        type: String, 
        enum: ["user", "staff"], 
        default: "user" 
    },

    // Numéro staff (optionnel)
    staffNumber: { 
        type: Number, 
        default: null 
    },

    // Code envoyé par email (6 chiffres)
    emailCode: {
        type: String,
        default: null
    },

    // Email vérifié ?
    emailVerified: {
        type: Boolean,
        default: false
    },

    // Staff master (super admin)
    staffMaster: {
        type: Boolean,
        default: false
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("User", userSchema);
