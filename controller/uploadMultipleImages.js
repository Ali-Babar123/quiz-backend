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
// DELETE image by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id

    if (!id) {
      return res.status(400).json({ success: false, error: "Image ID is required" });
    }

    // Find image in DB
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from MongoDB
    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      id: id,
    });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};
// DELETE all images
exports.deleteAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    if (!images || images.length === 0) {
      return res.status(404).json({ success: false, message: "No images found" });
    }

    // Delete all images from Cloudinary
    await Promise.all(
      images.map(async (img) => {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      })
    );

    // Delete all from MongoDB
    await Image.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All images deleted successfully",
      count: images.length
    });
  } catch (error) {
    console.error("❌ Error deleting all images:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};
