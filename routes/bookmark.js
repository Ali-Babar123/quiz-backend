const express = require("express");
const router = express.Router();
const {
  createBookmark,
  getAllBookmarks,
  getBookmarksByUser,
  updateBookmark,
  deleteBookmark,
} = require("../controller/BookmarkController");

const { verifyToken } = require("../middleware/authmiddleware");

// CRUD Routes
router.post("/createBookmark", verifyToken, createBookmark);      // Create Bookmark
router.get("/getAllBookmarks", verifyToken, getAllBookmarks);         // Get All
router.get("/getBookmarkByUserId/:userId", verifyToken, getBookmarksByUser); // Get by User
router.put("/updateBookmark/:id", verifyToken, updateBookmark);   // Update
router.delete("/deleteBookmark/:id", verifyToken, deleteBookmark);// Delete

module.exports = router;
