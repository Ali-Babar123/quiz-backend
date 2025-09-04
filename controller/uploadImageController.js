const cloudinary = require("../middleware/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "No image provided (Base64 or URL required)."
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "uploads", // you can change folder name
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};
