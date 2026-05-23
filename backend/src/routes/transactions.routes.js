const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth');
const {
  validateBody,
  validateQuery,
  validateParams,
} = require('../middleware/validate');
const {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
  upcomingBillsQuerySchema,
  idParamSchema,
} = require('../validators/transaction.validator');

const router = express.Router();

router.use(protect);

router.get(
  '/recurring/upcoming',
  validateQuery(upcomingBillsQuerySchema),
  transactionController.listUpcomingRecurring
);
router.get('/', validateQuery(transactionQuerySchema), transactionController.list);
router.get(
  '/:id',
  validateParams(idParamSchema),
  transactionController.getOne
);
router.post(
  '/',
  validateBody(createTransactionSchema),
  transactionController.create
);
router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateTransactionSchema),
  transactionController.update
);
router.delete(
  '/:id',
  validateParams(idParamSchema),
  transactionController.remove
);

module.exports = router;
