const Company = require("../models/Company");
const cloudinary = require("../middleware/cloudinary");

// Create company
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      industry,
      website,
      headOffice,
      employeeSize,
      companyCreatedByUserId,
      about,
      foundingYear,
      ceoName,
      benefits,
      awards,
      specializations,
      cultureTags,
      missionStatement,
      coreValues,
    } = req.body;

    let logoUrl = "";
    let galleryImages = [];

    // Upload logo if provided
    if (req.body.logoBase64) {
      const uploadRes = await cloudinary.uploader.upload(req.body.logoBase64, {
        folder: "companies/logos",
      });
      logoUrl = uploadRes.secure_url;
    }

    // Upload gallery images if provided
    if (req.body.galleryBase64 && Array.isArray(req.body.galleryBase64)) {
      for (let img of req.body.galleryBase64) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "companies/gallery",
        });
        galleryImages.push(uploadRes.secure_url);
      }
    }

    const company = new Company({
      name,
      industry,
      website,
      headOffice,
      employeeSize,
      companyCreatedByUserId,
      about,
      foundingYear,
      ceoName,
      benefits,
      awards,
      specializations,
      cultureTags,
      missionStatement,
      coreValues,
      logoUrl,
      galleryImages,
    });

    await company.save();
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.error("❌ Error creating company:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };

    // Handle logo update
    if (req.body.logoBase64) {
      const uploadRes = await cloudinary.uploader.upload(req.body.logoBase64, {
        folder: "companies/logos",
      });
      updateData.logoUrl = uploadRes.secure_url;
    }

    // Handle gallery update
    if (req.body.galleryBase64 && Array.isArray(req.body.galleryBase64)) {
      let galleryImages = [];
      for (let img of req.body.galleryBase64) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "companies/gallery",
        });
        galleryImages.push(uploadRes.secure_url);
      }
      updateData.galleryImages = galleryImages;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompaniesByUser = async (req, res) => {
  try {
    const companies = await Company.find({ companyCreatedByUserId: req.params.userId });
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
