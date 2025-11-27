// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, default: "user" }, // admin or user
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
