const express = require('express');
const router = express.Router();
const {
  createCategory,
  addImagesToCategory,
  getCategories,
  getCategoryById,
  deleteImageCategory,
  getImagesByCategoryId,
  editImageCategory,
  editImageInCategory,
  deleteImageInCategory
} = require('../controller/imageCategoryContoller');

router.post('/createCategory', createCategory);
router.put('/addImagesToCategory/:id', addImagesToCategory);
router.get('/getImageCategories', getCategories);
router.get('/getCategoryById/:id', getCategoryById);
router.delete('/deleteImageCategory/:id', deleteImageCategory);
router.get('/getImagesByCategory/:id', getImagesByCategoryId);
router.put('/editImageCategory/:id', editImageCategory);

router.put('/editImageInCategory/:categoryId/:imageId', editImageInCategory);
router.delete('/deleteImageInCategory/:categoryId/:imageId', deleteImageInCategory);
module.exports = router;
