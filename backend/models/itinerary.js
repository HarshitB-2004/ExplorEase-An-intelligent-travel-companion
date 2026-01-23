import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tripName: String,
  destination: String,
  startDate: String,
  endDate: String,
  budget: Number,
  itinerary: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Itinerary", itinerarySchema);
