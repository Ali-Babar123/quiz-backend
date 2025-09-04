const express = require("express");
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompaniesByUser
} = require("../controller/CompanyController");
const {verifyToken} = require('../middleware/authmiddleware')

// Routes
router.post("/createCompany", verifyToken, createCompany);          // Create
router.get("/getAllCompanies", verifyToken, getCompanies);            // Get all
router.get("/getSingleCompany/:id", verifyToken, getCompanyById);       // Get one
router.put("/updateCompany/:id", verifyToken, updateCompany);        // Update
router.delete("/deleteCompany/:id",verifyToken, deleteCompany);     // Delete
router.get("/getCompaniesByUser/:userId",verifyToken,  getCompaniesByUser);
module.exports = router;
