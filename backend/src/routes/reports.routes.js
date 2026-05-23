const express = require('express');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/export', reportController.exportCsv);
router.get('/summary', reportController.summary);

module.exports = router;
