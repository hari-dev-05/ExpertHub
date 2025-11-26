const express = require('express');
const cors = require('cors');
const User = require('./mongo');
const Message = require("./message");
const nodemailer = require("nodemailer");

require("dotenv").config();

const bcrypt = require('bcrypt');
const Profile = require('./profile');
const multer = require('multer');
const path = require('path');

const app = express();

const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://expert-hub-three.vercel.app"   // ONLY production URL!
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Configure CORS with specific options
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://expert-hub-three.vercel.app"   // ONLY production URL!
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// ----- Community Uploads (Posts) -----
const Post = require("./post");
const fs = require("fs");

// Multer setup for posts (images/videos)
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/posts";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const postUpload = multer({
  storage: postStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/", "video/"];
    if (allowed.some((t) => file.mimetype.startsWith(t))) cb(null, true);
    else cb(new Error("Only images and videos are allowed"));
  },
});

// Serve uploaded posts publicly
app.use("/public", express.static("public"));

/* =======================================================
   📤 Upload Post (Image/Video + Description)
   Endpoint: POST /profile/:userId/uploadPost
   ======================================================= */
app.post("/profile/:userId/uploadPost", postUpload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";
    const fileUrl = `/public/uploads/posts/${req.file.filename}`;

    const newPost = new Post({
      userId,
      fileUrl,
      fileType,
      description,
    });

    await newPost.save();
    res.status(201).json({ message: "Post uploaded successfully", post: newPost });
  } catch (err) {
    console.error("Error uploading post:", err);
    res.status(500).json({ message: "Server error while uploading post" });
  }
});

/* =======================================================
   📥 Get All Posts by a User
   Endpoint: GET /profile/:userId/posts
   ======================================================= */
app.get("/profile/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});
// 📸 Get all posts (for community feed)
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // newest first
    res.json(posts);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});





// ========================= PROFILE ROUTES ========================= //

// Get or create profile by userId
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find({ name: { $ne: "" } });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// DELETE empty profiles
app.delete("/cleanup-empty-profiles", async (req, res) => {
  try {
    const result = await Profile.deleteMany({ name: "" });
    res.status(200).json({ message: "Empty profiles deleted", deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete empty profiles" });
  }
});

// Update email
app.put('/user/email/:userId', async (req, res) => {
  const { email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { email },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await Profile.findOneAndUpdate({ userId }, req.body, { new: true, upsert: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile image
app.post('/profile/upload/:userId', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.image = req.file.path;
    await profile.save();
    res.status(200).json({ message: 'Image uploaded', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "demproj8@gmail.com", // your Gmail
        pass: "ctjajkkdxisqcfwz",    // your 16-character app password
      },
    });
    // ========================= RESET PASSWORD ========================= //
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password required" });
  }

  try {
    // Find existing user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user password
    user.password = hashedPassword;
    await user.save();

    console.log(`🔑 Password updated for ${email}`);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Server error while resetting password" });
  }
});


    // Define email content
    const mailOptions = {
      from: "demproj8@gmail.com",
      to: email,
      subject: "Your ExpertHub OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully", otp }); // return OTP for now (testing)
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});








// ========================= AUTH ROUTES ========================= //

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
        error: 'USER_EXISTS'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
        error: 'WEAK_PASSWORD'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const { password: pwd, ...safeUser } = newUser._doc;

    const profile = new Profile({ userId: newUser._id, email: newUser.email });
    await profile.save();

    res.status(201).json({ message: 'User registered', user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: 'SERVER_ERROR' });
  }
});
//socket
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});


// 🧹 Delete all messages between two users
app.delete("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const result = await Message.deleteMany({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    });
    res.json({ message: "Chat cleared successfully", deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing chat" });
  }
});



// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const { password: pwd, ...safeUser } = user._doc;

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = new Profile({ userId: user._id, email: user.email });
      await profile.save();
    }

    res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const connectedUsers = {}; // userId => [socketId, ...]

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

socket.on("join", async (userId) => {
  if (!connectedUsers[userId]) connectedUsers[userId] = [];
  connectedUsers[userId].push(socket.id);
  console.log(`User ${userId} connected with socket ${socket.id}`);

  // Send undelivered messages
  const undelivered = await Message.find({ receiverId: userId, delivered: false });
  undelivered.forEach(async (msg) => {
    io.to(socket.id).emit("receiveMessage", { senderId: msg.senderId, text: msg.text });
    msg.delivered = true;
    await msg.save();
  });
});


socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
  console.log(`Message from ${senderId} to ${receiverId}: ${text}`);

  // 1️⃣ Save to database
  const newMsg = new Message({ senderId, receiverId, text });
  await newMsg.save();

  // 2️⃣ If receiver is online, deliver instantly
  const receiverSockets = connectedUsers[receiverId] || [];
  if (receiverSockets.length > 0) {
    receiverSockets.forEach(sockId => {
      io.to(sockId).emit("receiveMessage", { senderId, text });
    });

    // mark as delivered
    newMsg.delivered = true;
    await newMsg.save();
  }
});

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);

    // Remove socket from all users
    for (const [userId, sockets] of Object.entries(connectedUsers)) {
      connectedUsers[userId] = sockets.filter(id => id !== socket.id);
      if (connectedUsers[userId].length === 0) delete connectedUsers[userId];
    }
  });
});



// ========================= START SERVER ========================= //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
