const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Temporary in-memory OTP store (better: MongoDB/Redis with expiry)
let otpStore = {};

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "PASSWORD RECOVERY",
      html: `<div>
              <h2>${OTP}</h2>
              <p>Use this OTP to recover your password. Valid for 5 minutes.</p>
             </div>`
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) return reject({ message: "Email sending failed" });
      return resolve({ message: "Email sent successfully" });
    });
  });
}

// Step 1: Request password reset (generate + email OTP)
// Step 1: Request password reset (generate + email OTP)
router.post("/profile/send_recovery_email", async (req, res) => {
  try {
    const { recipient_email } = req.body;
    if (!recipient_email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // 4-digit OTP instead of 6
    const OTP = crypto.randomInt(1000, 9999).toString();

    otpStore[recipient_email] = { otp: OTP, expires: Date.now() + 5 * 60 * 1000 };

    await sendEmail({ recipient_email, OTP });
    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json(error);
  }
});


// Step 2: Verify OTP
router.post("/profile/verify_otp", (req, res) => {
  const { recipient_email, otp } = req.body;

  const record = otpStore[recipient_email];
  if (!record) return res.status(400).json({ success: false, message: "No OTP found. Request again." });

  if (record.expires < Date.now()) {
    delete otpStore[recipient_email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  res.json({ success: true, message: "OTP verified. You can now reset password." });
});

module.exports = router;
