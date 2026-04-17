import mongoose from "mongoose";

const garageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },

    lat: { type: Number, required: true },
    lng: { type: Number, required: true },

    places: { type: Number, required: true },

    type: { 
        type: String, 
        enum: ["mensuel", "heure", "jour", "all"], 
        default: "all" 
    },

    dimensions: { type: String, default: "" },

    description: { type: String, default: "" },

    photos: { type: [String], default: [] },

    createdAt: { type: Date, default: Date.now }
});

const Garage = mongoose.model("Garage", garageSchema);

export default Garage;
