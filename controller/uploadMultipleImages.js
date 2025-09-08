const { cloudinary } = require("../middleware/cloudinary");
const Image = require("../models/Image");

exports.uploadMultipleImages = async (req, res) => {
  try {
    const { images } = req.body; 
    // Expecting [{ id: "123", image: "base64/URL" }, { id: "456", image: "..." }]

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No images provided. Expecting array of {id, image}",
      });
    }

    // Upload images
    const uploadResults = await Promise.all(
      images.map(async ({ id, image }) => {
        const result = await cloudinary.uploader.upload(image, {
          folder: "my_custom_folder", // ← updated folder name
        });

        // Save to DB
        const savedImage = await Image.create({
          customId: id,
          url: result.secure_url,
          public_id: result.public_id,
        });

        return savedImage;
      })
    );

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully!",
      count: uploadResults.length,
      data: uploadResults,
    });
  } catch (error) {
    console.error("❌ Cloudinary multiple upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

// 🔹 Get all images
exports.getAllMultipleImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error("❌ Error fetching images:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};
