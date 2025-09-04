require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const sendVerificationEmail = require("./middleware/email");
const UserRoute = require('./routes/user');
const emailRoute = require('./routes/email')
const resetPasswordRoute = require('./routes/resetPassword')  
const quizRoutes = require('./routes/quizRoutes');
const newCateogryRoutes = require('./routes/NewCateogry');
const imageCategoryRoutes = require('./routes/imageCategoryRoutes')
const imageUpload = require('./routes/imageUploadRoute')
const jobRoute = require('./routes/job');
const ApplicationRoute = require('./routes/applicationRoute')
const bookmarkRoute = require('./routes/bookmark');
const companyRoute = require('./routes/company')

const app = express();
const port = process.env.PORT || 5000;



// Connect to DB
connectDB();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://nasir.temp2026.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use("/uploads", express.static("uploads"));

// Temporary store for OTPs before user is created
let otpStore = {};  
// { "email@example.com": { otp: "1234", expires: 123456789, fullName: "", password: "" } }

// ------------------ ROUTES ------------------

// Step 1: Request OTP (before signup)
// Step 1: Signup - Request OTP
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password, userType} = req.body;

    if (!fullName || !email || !password || !userType ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = Date.now() + 60 * 1000; // 60 sec

    // Send OTP
    try {
      await sendVerificationEmail(email, otp);
    } catch (err) {
      console.error("❌ OTP email failed:", err);
      return res.status(400).json({ success: false, message: "Failed to send OTP" });
    }

    // Store OTP temporarily (including userType)
    otpStore[email] = { otp, expires: otpExpires, fullName, password, userType};

    res.json({ success: true, message: "OTP sent to email. Please verify to complete signup." });

  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Step 2: Verify OTP and create user
app.post("/api/request-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request again." });
    }

    if (record.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired. Please request again." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP verified → create user in DB
    const hashedPassword = await bcrypt.hash(record.password, 10);

    const newUser = new User({
      fullName: record.fullName,
      email,
      password: hashedPassword,
      userType: record.userType,
      isVerified: true,
    });

    await newUser.save();
    console.log("✅ Creating user with type:", record.userType);
    delete otpStore[email]; // cleanup temp OTP

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, userType: newUser.userType }, // include userType in token too if needed
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Signup successful!",
      token,
      user: { 
        id: newUser._id, 
        fullName: newUser.fullName, 
        email: newUser.email, 
        userType: newUser.userType,
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Login
// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    // Include userType in JWT payload
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType, // ✅ Fixed: include userType in response
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
app.use('/api/users', UserRoute);
app.use('/api/email', emailRoute)
app.use('/api/auth', resetPasswordRoute);
app.use('/api', quizRoutes);
app.use('/api', newCateogryRoutes);
app.use('/api', imageCategoryRoutes);
app.use('/api', imageUpload);
app.use('/api', jobRoute);
app.use('/api', ApplicationRoute);
app.use('/api', bookmarkRoute)
app.use('/api', companyRoute);

// Default route
app.get("/", (req, res) => res.send("Running with OTP verification!"));


// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
