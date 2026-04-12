import mongoose from "mongoose";

const garageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },

    // Auto‑géocodés
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },

    // Nombre de places
    places: { type: Number, required: true },

    // Type de location
    type: { 
        type: String, 
        enum: ["mensuel", "heure", "jour", "all"], 
        default: "all" 
    },

    createdAt: { type: Date, default: Date.now }
});

const Garage = mongoose.model("Garage", garageSchema);

export default Garage;
