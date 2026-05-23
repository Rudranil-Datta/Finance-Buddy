const express = require('express');
const budgetController = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth');
const {
  validateBody,
  validateParams,
} = require('../middleware/validate');
const {
  createBudgetSchema,
  updateBudgetSchema,
  idParamSchema,
} = require('../validators/budget.validator');

const router = express.Router();

router.use(protect);

router.get('/status', budgetController.getStatus);
router.get('/', budgetController.list);
router.get('/:id', validateParams(idParamSchema), budgetController.getOne);
router.post('/', validateBody(createBudgetSchema), budgetController.create);
router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateBudgetSchema),
  budgetController.update
);
router.delete(
  '/:id',
  validateParams(idParamSchema),
  budgetController.remove
);

module.exports = router;
