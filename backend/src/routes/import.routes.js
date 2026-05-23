const express = require('express');
const importController = require('../controllers/import.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/csv', importController.csv);

module.exports = router;
