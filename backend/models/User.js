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

    role: { 
        type: String, 
        enum: ["user", "staff"], 
        default: "user" 
    },

    staffNumber: { 
        type: Number, 
        default: null 
    },

    emailCode: {
        type: String,
        default: null
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("User", userSchema);
