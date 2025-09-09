const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body; // frontend sends Google ID token

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Find or create user by email
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email,
        password: null,       // no password since it's Google login
        userType: "user",     // or set default role
        isVerified: true,     // Google already verified
        profileImage: picture // if you want to store Google avatar
      });
    }

    // Generate your own JWT
    const appToken = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      
    );

    // Response in same format as login/signup
    res.json({
      success: true,
      message: "Google login successful",
      token: appToken,
      googleToken, // optional: return Google ID token if you want
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        profileImage: user.profileImage || picture,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};
