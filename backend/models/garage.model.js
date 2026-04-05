import mongoose from "mongoose";

const garageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    capacity: { type: Number, required: true }
});

const Garage = mongoose.model("Garage", garageSchema);

export default Garage;

