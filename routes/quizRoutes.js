const express = require('express');
const router = express.Router();
const {
  addQuestion,
  addCategory,
  getCategories,
  getQuestionsByCategory,
  deleteCategory,
  editQuestion, 
  editCategory,
  editCategoryWithQuestions,
} = require('../controller/quizController');

// Routes
router.get('/getCategories', getCategories);
router.get('/getQuestions/:categoryId', getQuestionsByCategory);
router.post('/addCategory', addCategory);
router.post('/addQuestion', addQuestion);
router.delete('/deleteCategory/:categoryId', deleteCategory);  // ✅ New route

router.put('/editCategory/:categoryId', editCategory);
router.put('/editQuestion/:questionId', editQuestion);
router.put('/editCategoryWithQuestions/:categoryId', editCategoryWithQuestions);


module.exports = router;
