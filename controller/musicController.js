// controllers/musicController.js
exports.uploadMusicFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No music files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      url: file.path,
      public_id: file.filename,
    }));

    res.status(200).json({
      message: "Music files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading music files",
      error: error.message,
    });
  }
};
