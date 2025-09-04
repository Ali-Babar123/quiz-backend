const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {verifyToken} = require('../middleware/authmiddleware')

router.post("/create", userController.createUser);   // Signup / Create
router.get("/getAllUsers", verifyToken, userController.getUsers);      // Get all users
router.get("/getSingleUser/:id", verifyToken, userController.getUserById); // Get single user
router.put("/updateUser/:id", verifyToken, userController.updateUser);  // Update user
router.delete("/deleteUser/:id", verifyToken, userController.deleteUser); // Delete user
router.put("/changePassword", verifyToken, userController.changePassword);
router.get("/getMultipleUsers", verifyToken, userController.getMultipleUsers);



module.exports = router;