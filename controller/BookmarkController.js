const Bookmark = require("../models/Bookmark");

// ✅ Create Bookmark
exports.createBookmark = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Prevent duplicate bookmark (same user bookmarking same job again)
    const existing = await Bookmark.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already bookmarked" });
    }

    const bookmark = new Bookmark({ userId, jobId });
    await bookmark.save();

    res.status(201).json({ success: true, message: "Bookmark added", bookmark });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get All Bookmarks
exports.getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get Bookmarks by User
exports.getBookmarksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await Bookmark.find({ userId });

    if (!bookmarks || bookmarks.length === 0) {
      return res.status(404).json({ success: false, message: "No bookmarks found" });
    }

    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Bookmark (change jobId if needed)
exports.updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Bookmark.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: "Bookmark not found" });

    res.status(200).json({ success: true, message: "Bookmark updated", updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Bookmark
exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bookmark.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ success: false, message: "Bookmark not found" });

    res.status(200).json({ success: true, message: "Bookmark deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
