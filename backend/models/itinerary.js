import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itinerary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Itinerary", itinerarySchema);
