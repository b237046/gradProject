const express = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/item.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post(
  '/search-name',
  authenticateJWT,
  [
    body('name').trim()
  ],
  validateRequest,
  itemController.searchItemsByName
);

router.post(
  '/search-barcode',
  authenticateJWT,
  [
    body('barcode').trim().isString().withMessage('Barcode must be a string')
  ],
  validateRequest,
  itemController.searchItemsByBarcode
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
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date'),
    body('barcode').optional().isString().withMessage('Barcode must be a string'),
    body('category').isIn([
      'Fruits & Vegetables',
      'Dairy & Eggs',
      'Meat & Seafood',
      'Canned & Jarred',
      'Dry Goods & Pasta',
      'Others'
    ]).withMessage('Invalid category')
  ],
  validateRequest,
  itemController.createAndAddItem
);

module.exports = router;