const mongoose = require('mongoose');

// ✅ MongoDB connection
mongoose.connect("mongodb://localhost:27017/userDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Define Schema for Email and Password
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // prevents duplicate emails
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true }); // adds createdAt, updatedAt

// ✅ Create Model
const User = mongoose.model("User", userSchema);

// ✅ Export Model
module.exports = User;
