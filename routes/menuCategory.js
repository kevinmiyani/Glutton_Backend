const menuCategoryController = require("../controllers/menuCategoryController");
const express = require('express');

const router = express.Router();

router.get('/', menuCategoryController.getAllMenuCategories);

router.post('/add', menuCategoryController.addMenuCategory);

router.patch('/update/:id', menuCategoryController.updateMenuCategoryByID);

module.exports = router;