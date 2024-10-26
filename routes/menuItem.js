const menuItemController = require("../controllers/menuItemController");
const express = require('express');

const router = express.Router();

router.get('/menu/:id', menuItemController.getMenuByRestId);
router.get('/category/:id', menuItemController.getMenuCategoriesByRestId);
router.get('/:id', menuItemController.getMenuItemsByRestId);

router.post('/add', menuItemController.addMenuItem);

router.patch('/update/:id', menuItemController.updateMenuItem);

router.delete('/remove/:id', menuItemController.removeMenuItem);

module.exports = router;