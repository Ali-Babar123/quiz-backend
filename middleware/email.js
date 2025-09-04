const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, otp) {
      if (!email) {
    throw new Error("❌ No recipient email provided");
  }
  console.log("📧 Sending OTP to:", email, "OTP:", otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Email Verification</h2>
        <p>Use the following OTP to verify your account:</p>
        <h3 style="background:#00466a;color:#fff;display:inline-block;padding:8px 16px;border-radius:4px;">
          ${otp}
        </h3>
        <p>This OTP will expire in 60 sec.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
