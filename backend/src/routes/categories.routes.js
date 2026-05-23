const express = require('express');
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', categoryController.list);
router.post('/', categoryController.create);

module.exports = router;
