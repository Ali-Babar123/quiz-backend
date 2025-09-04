const express = require('express');
const router = express.Router();
const {
  addQuestion,
  addCategory,
  getCategories,
  getQuestionsByCategory,
  deleteCategory,
  editNewCategoryWithQuestions
} = require('../controller/NewCateogryController');

// Routes
router.get('/getNewCategories', getCategories);
router.get('/getNewQuestions/:categoryId', getQuestionsByCategory);
router.post('/addNewCategory', addCategory);
router.post('/addNewQuestion', addQuestion);
router.delete('/deleteNewCategory/:categoryId', deleteCategory);  // ✅ New route
router.put("/editNewCategoryWithQuestions/:categoryId", editNewCategoryWithQuestions);

module.exports = router;
