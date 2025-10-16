const express = require('express');
const cors = require('cors');
const User = require('./mongo');
const bcrypt = require('bcrypt');
const Profile = require('./profile');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ========================= PROFILE ROUTES ========================= //

// Get or create profile by userId
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Create default profile if it doesn't exist
      profile = new Profile({ userId, name: "", email: "", phone: "", city: "", skills: "" });
      await profile.save();
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// ========================= AUTH ROUTES ========================= //

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const { password: pwd, ...safeUser } = newUser._doc;

    // Also create profile automatically
    const profile = new Profile({ userId: newUser._id, email: newUser.email });
    await profile.save();

    res.status(201).json({ message: 'User registered', user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    // Ensure profile exists
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

// ========================= START SERVER ========================= //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
