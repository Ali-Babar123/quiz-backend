const ImageCategory = require('../models/ImagesCategory');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');

// ✅ Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, coverImage } = req.body;
    if (!coverImage) return res.status(400).json({ error: 'Please provide a cover image (Base64).' });

    const result = await cloudinary.uploader.upload(coverImage, {
      folder: `categories/${name}`
    });

    const category = new ImageCategory({
      name,
      coverImage: { url: result.secure_url, public_id: result.public_id },
      images: []
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully!', category });
  } catch (error) {
    console.error(error);
     if (error.code === 11000) {
      return res.status(409).json({
        message: `Category with the name "${req.body.name}" already exists.`,
      });
    }
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ✅ Add Images to Category
exports.addImagesToCategory = async (req, res) => {
  try {
    const { images } = req.body;
    const category = await ImageCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    for (const img of images) {
      const result = await cloudinary.uploader.upload(img.base64, {
        folder: `categories/${category.name}`
      });

      category.images.push({
        url: result.secure_url,
        public_id: result.public_id,
        name: img.name
      });
    }

    await category.save();
    res.json({ message: 'Images added successfully!', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ✅ Get Images for a Specific Category
exports.getImagesByCategoryId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await ImageCategory.findById(req.params.id).select('name images');
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.json({
      categoryId: category._id,
      categoryName: category.name,
      images: category.images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ✅ Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ImageCategory.find().select('name coverImage images');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ✅ Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ImageCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// ✅ Delete Category
exports.deleteImageCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await ImageCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (category.coverImage?.public_id) {
      await cloudinary.uploader.destroy(category.coverImage.public_id);
    }
    for (const img of category.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
// ✅ Edit Image Category (Name + Cover Image)
exports.editImageCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, coverImageBase64 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await ImageCategory.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    let updatedCoverImage = category.coverImage;

    // If new cover image provided in Base64, upload to Cloudinary
    if (coverImageBase64 && coverImageBase64.startsWith("data:image")) {
      // Delete old cover image from Cloudinary if exists
      if (category.coverImage?.public_id) {
        await cloudinary.uploader.destroy(category.coverImage.public_id);
      }

      const result = await cloudinary.uploader.upload(coverImageBase64, {
        folder: `categories/${name || category.name}`,
      });

      updatedCoverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Update category
    category.name = name || category.name;
    category.coverImage = updatedCoverImage;

    const updatedCategory = await category.save();

    res.json({
      message: "Category updated successfully!",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error editing image category:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};


// ✅ Edit a Single Image in a Category
exports.editImageInCategory = async (req, res) => {
  try {
    const { categoryId, imageId } = req.params;
    const { name, newImageBase64 } = req.body;

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await ImageCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find the image inside category
    const image = category.images.id(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found in category" });
    }

    // If new image file provided, replace it in Cloudinary
    if (newImageBase64 && newImageBase64.startsWith("data:image")) {
      // Delete old one from Cloudinary
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      const result = await cloudinary.uploader.upload(newImageBase64, {
        folder: `categories/${category.name}`
      });

      image.url = result.secure_url;
      image.public_id = result.public_id;
    }

    // Update image name if provided
    if (name) {
      image.name = name;
    }

    await category.save();

    res.json({
      message: "Image updated successfully!",
      updatedImage: image
    });

  } catch (error) {
    console.error("Error editing image in category:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
