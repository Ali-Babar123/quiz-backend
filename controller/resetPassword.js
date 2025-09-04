const User = require("../models/User");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email)

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, msg: "Email and new password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, msg: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = { resetPassword };
