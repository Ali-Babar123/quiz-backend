const NewCategory = require('../models/NewCategory');
const NewQuestion = require('../models/NewQuestion');
const cloudinary = require('../middleware/cloudinary');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await NewCategory.find();

    const categoriesWithQuestions = await Promise.all(
      categories.map(async (category) => {
        const questions = await NewQuestion.find({ Newcategory: category._id })
          .select('NewquestionText Newoptions NewcorrectAnswerIndex');
        return {
          ...category.toObject(),
          questions,
        };
      })
    );

    res.json(categoriesWithQuestions);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get questions by category
const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const questions = await NewQuestion.find({ Newcategory: categoryId })
      .populate('Newcategory', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Add a new category with Cloudinary icon upload
const addCategory = async (req, res) => {
  try {
    let { name, icon, desc } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // 🟢 DO NOT lowercase — store as entered
    name = name.trim();
    desc = desc?.trim() || '';

    let iconUrl = '';
    if (icon) {
      const result = await cloudinary.uploader.upload(icon, {
        folder: 'category_icons',
        upload_preset: 'quiz_preset',
        resource_type: 'image',
      });
      iconUrl = result.secure_url;
    }

    const category = new NewCategory({ name, desc, icon: iconUrl });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error in addCategory:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: `Category with the name "${req.body.name}" already exists.`,
      });
    }

    res.status(500).json({ message: 'Could not add category', error });
  }
};



// Add question to category
const addQuestion = async (req, res) => {
  try {
    const { Newcategory, NewquestionText, Newoptions, NewcorrectAnswerIndex } = req.body;

    const question = new NewQuestion({
      Newcategory,
      NewquestionText,
      Newoptions,
      NewcorrectAnswerIndex
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {

     if (error.code === 11000) {
      return res.status(409).json({
        message: `Question already exists in this category.`,
      });
    }

    res.status(500).json({ message: 'Could not add question', error });
  }
};

// DELETE category by ID
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    await NewQuestion.deleteMany({ Newcategory: categoryId });
    await NewCategory.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: 'Could not delete category', error });
  }
};



// EDIT category & its questions
const editNewCategoryWithQuestions = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, desc, iconBase64, questions } = req.body;

    let iconUrl;
    // Upload new icon if provided
    if (iconBase64 && iconBase64.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(iconBase64, {
        folder: "category_icons",
      });
      iconUrl = result.secure_url;
    }

    // Update category
    const updatedCategory = await NewCategory.findByIdAndUpdate(
      categoryId,
      {
        ...(name && { name }),
        ...(desc && { desc }),
        ...(iconUrl && { icon: iconUrl }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update each question
    if (Array.isArray(questions)) {
      for (const q of questions) {
        await NewQuestion.findByIdAndUpdate(
          q._id,
          {
            ...(q.NewquestionText && { NewquestionText: q.NewquestionText }),
            ...(q.Newoptions && { Newoptions: q.Newoptions }),
            ...(q.NewcorrectAnswerIndex !== undefined && {
              NewcorrectAnswerIndex: q.NewcorrectAnswerIndex,
            }),
          },
          { new: true }
        );
      }
    }

    res.json({ message: "Category & questions updated", updatedCategory });
  } catch (err) {
    console.error("Error editing category with questions:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getCategories,
  getQuestionsByCategory,
  addCategory,
  addQuestion,
  deleteCategory,
  editNewCategoryWithQuestions
};
