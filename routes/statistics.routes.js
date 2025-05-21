const express = require('express');
const { body, query } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const rateLimiter = require('../middlewares/rateLimiter');
const authenticateJWT = require('../middlewares/authenticateJWT');
const statisticsController = require('../controllers/statistics.controller');
const householdItemController = require('../controllers/householdItem.controller');

const router = express.Router();

router.get(
  '/total_purchase_price-top',
  authenticateJWT,
  [
    query('householdId').isInt().withMessage('Valid household ID is required')
  ],
  validateRequest,
  statisticsController.getTopHouseholdItemsByTotalPurchasePrice
);

router.get(
  '/total_purchase_price-bottom',
  authenticateJWT,
  [
    query('householdId').isInt().withMessage('Valid household ID is required')
  ],
  validateRequest,
  statisticsController.getBottomHouseholdItemsByTotalPurchasePrice
);

router.get(
    '/purchase_counter-top',
    authenticateJWT,
    [
        query('householdId').isInt().withMessage('Valid household ID is required')
    ],
    validateRequest,
    statisticsController.getTopHouseholdItemsByPurchaseCounter
);

router.get(
    '/purchase_counter-bottom',
    authenticateJWT,
    [
        query('householdId').isInt().withMessage('Valid household ID is required')
    ],
    validateRequest,
    statisticsController.getBottomHouseholdItemsByPurchaseCounter
);

module.exports = router;