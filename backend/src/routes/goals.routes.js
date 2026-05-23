const express = require('express');
const goalController = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth');
const {
  validateBody,
  validateQuery,
  validateParams,
} = require('../middleware/validate');
const {
  createGoalSchema,
  updateGoalSchema,
  contributeSchema,
  goalQuerySchema,
  idParamSchema,
} = require('../validators/goal.validator');

const router = express.Router();

router.use(protect);

router.get('/', validateQuery(goalQuerySchema), goalController.list);
router.get('/:id', validateParams(idParamSchema), goalController.getOne);
router.post('/', validateBody(createGoalSchema), goalController.create);
router.post(
  '/:id/contribute',
  validateParams(idParamSchema),
  validateBody(contributeSchema),
  goalController.contribute
);
router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateGoalSchema),
  goalController.update
);
router.delete(
  '/:id',
  validateParams(idParamSchema),
  goalController.remove
);

module.exports = router;
