const { cloudinary } = require("../middleware/cloudinary");

exports.uploadMultipleImages = async (req, res) => {
  try {
    const { images } = req.body; // Expecting an array of base64 strings or URLs

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No images provided (Array of Base64 strings or URLs required).",
      });
    }

    // Upload images one by one (in parallel)
    const uploadResults = await Promise.all(
      images.map((img) =>
        cloudinary.uploader.upload(img, {
          folder: "uploads", // Change folder if needed
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully!",
      count: uploadResults.length,
      data: uploadResults.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
    });
  } catch (error) {
    console.error("❌ Cloudinary multiple upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};
