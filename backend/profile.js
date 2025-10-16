const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" }, // ✅ Add email here
  city: { type: String, default: "" },
  skills: { type: String, default: "" },
  image: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
