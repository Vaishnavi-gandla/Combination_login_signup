const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs"); // Add bcryptjs for password hashing
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// MongoDB URI
const mongo_uri = "mongodb+srv://gandlavaishnavi19:vaishu123@cluster0.xyp9jlc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Define Mongoose schema/model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String, // Add password field for signup
});

const User = mongoose.model("User", userSchema);

// Manual Signup Route with Password Hashing
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route with Password Verification
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, username: `${user.firstName} ${user.lastName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Signup Route
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/signup/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || '';
    const [firstName = '', lastName = ''] = name.split(' ');

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ firstName, lastName, email });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ message: "User already exists", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify token", details: err.message });
  }
});

// LinkedIn Signup Route
const axios = require("axios");

app.post("/signup/linkedin", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Authorization code required" });
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Fetch profile info
    const profileRes = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emailRes = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const firstName = profileRes.data.localizedFirstName;
    const lastName = profileRes.data.localizedLastName;
    const email = emailRes.data.elements[0]["handle~"].emailAddress;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ firstName, lastName, email });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ message: "User already exists", user });
  } catch (err) {
    console.error("LinkedIn signup error:", err.response?.data || err.message);
    res.status(500).json({ error: "LinkedIn signup failed" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🔥 Server is running!");
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
