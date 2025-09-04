const Category = require('../models/Category');
const Question = require('../models/Question');
const cloudinary = require('../middleware/cloudinary');

// Get all categories
const getCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // For each category, fetch related questions with correct index
    const categoriesWithQuestions = await Promise.all(
      categories.map(async (category) => {
        const questions = await Question.find({ category: category._id })
          .select('questionText options correctAnswerIndex'); // ✅ include correctAnswerIndex
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
    const questions = await Question.find({ category: categoryId })
      .populate('category', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Add a new category with Cloudinary icon upload
const addCategory = async (req, res) => {
  try {
    const { name, iconBase64 } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    let iconUrl = '';

    if (iconBase64) {
      const result = await cloudinary.uploader.upload(iconBase64, {
        folder: 'category_icons',
        upload_preset: 'quiz_preset', // Required preset
        resource_type: 'image',
      });
      iconUrl = result.secure_url;
    }

    const category = new Category({ name, icon: iconUrl });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error in addCategory:', error);
    // Duplicate key error (category already exists)
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Category with the name "${req.body.name}" already exists.`,
      });
    }
    res.status(500).json({ message: 'Could not add category', error });
  }
};
;
// Add question to category
const addQuestion = async (req, res) => {
  try {
    const { category, questionText, options, correctAnswerIndex } = req.body;

    if (!questionText || !category || !Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: "Invalid question data." });
    }

    const existing = await Question.findOne({
      category,
      questionText: { $regex: `^${questionText}$`, $options: 'i' } // case-insensitive exact match
    });

    if (existing) {
      return res.status(409).json({ message: 'Question already exists in this category.' });
    }

    const question = new Question({ category, questionText, options, correctAnswerIndex });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error in addQuestion:', error);
    res.status(500).json({ message: 'Could not add question', error });
  }
};
// DELETE category by ID
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Optionally: delete all questions linked to this category
    await Question.deleteMany({ category: categoryId });

    // Then delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: 'Could not delete category', error });
  }
};


// Get single category with all questions
// PUT /editCategoryWithQuestions/:categoryId
const editCategoryWithQuestions = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, iconBase64, questions } = req.body;

    let iconUrl;
    if (iconBase64 && iconBase64.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(iconBase64, {
        folder: "category_icons",
      });
      iconUrl = result.secure_url;
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, ...(iconUrl && { icon: iconUrl }) },
      { new: true }
    );

    // Update each question
    for (const q of questions) {
      await Question.findByIdAndUpdate(
        q._id,
        {
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
        },
        { new: true }
      );
    }

    res.json({ message: "Category & questions updated", updatedCategory });
  } catch (err) {
    console.error("Error editing category with questions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit category
const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, iconBase64 } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;

    if (iconBase64) {
      const result = await cloudinary.uploader.upload(iconBase64, {
        folder: 'category_icons',
        upload_preset: 'quiz_preset',
        resource_type: 'image',
      });
      category.icon = result.secure_url;
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error in editCategory:", error);
    res.status(500).json({ message: "Could not edit category", error });
  }
};

// Edit question
const editQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questionText, options, correctAnswerIndex, category } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (questionText) question.questionText = questionText;

    if (options) {
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ message: "Options must be an array of exactly 4 items" });
      }
      question.options = options;
    }

    if (typeof correctAnswerIndex === "number") {
      if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
        return res.status(400).json({ message: "Correct answer index must be 0-3" });
      }
      question.correctAnswerIndex = correctAnswerIndex;
    }

    if (category) question.category = category;

    await question.save();
    res.status(200).json(question);
  } catch (error) {
    console.error("Error in editQuestion:", error);
    res.status(500).json({ message: "Could not edit question", error });
  }
};

module.exports = {
  getCategories,
  getQuestionsByCategory,
  addCategory,
  addQuestion,
  deleteCategory,
  editCategory,
  editQuestion,
  editCategoryWithQuestions,
};
