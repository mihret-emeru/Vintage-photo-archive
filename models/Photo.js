// models/Photo.js
import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  imageUrl: String,
  title: { type: String, default: "" },
  history: { type: String, default: "" },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);
