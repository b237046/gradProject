const express = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/item.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post(
  '/search',
  authenticateJWT,
  [
    body('keyword').trim()
  ],
  validateRequest,
  itemController.searchItems
);

router.post(
  '/create',
  authenticateJWT,
  [
    body('itemName')
      .trim()
      .matches(/^[a-zA-Z0-9\s]{2,}$/)
      .withMessage('Item name must be at least 2 characters and contain only letters, numbers, and spaces'),
    body('itemPhoto').optional().isURL().withMessage('Item photo must be a valid URL'),
    body('householdId').isInt().withMessage('Valid household ID is required'),
    body('location').isIn(['in_house']).withMessage('Location must be "in_house"'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date')
  ],
  validateRequest,
  itemController.createAndAddItem
);

module.exports = router;