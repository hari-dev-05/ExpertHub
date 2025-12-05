const express = require('express');
const cors = require('cors');
const User = require('./mongo');
const Message = require("./message");
const nodemailer = require("nodemailer");

const upload = require("./multer");
const cloudinary = require("./cloudinary");


const bcrypt = require('bcrypt');
const Profile = require('./profile');
const Post = require("./post");



const app = express();

const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174","https://expert-hub-three.vercel.app"], // frontend URLs
    methods: ["GET", "POST"]
  }
});

// Configure CORS with specific options
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174","https://expert-hub-three.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());




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

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name image") // Get user name + image
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// Upload profile image to Cloudinary
app.post('/profile/upload/:userId', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload buffer to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "expert-hub/profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const cloudinaryResult = await uploadToCloudinary();

    // Save Cloudinary URL in MongoDB
    profile.image = cloudinaryResult.secure_url;
    await profile.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url,
      profile,
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});



// Upload posts (image/video) to Cloudinary
// ========= UPLOAD POST (IMAGE/VIDEO) ========= //
app.post("/profile/:userId/uploadPost", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "expert-hub/posts",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Save post in Post collection
    const newPost = new Post({
      userId,
      fileUrl: uploaded.secure_url,
      fileType: req.body.type,
      description: req.body.description,
    });

    await newPost.save();

    res.status(200).json({
      message: "Post uploaded successfully",
      post: newPost,
    });

  } catch (error) {
    console.error("UploadPost error:", error);
    res.status(500).json({ message: "Upload failed" });
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
