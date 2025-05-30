const express = require('express');
const { body, query } = require('express-validator');
const householdItemController = require('../controllers/householdItem.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post(
  '/add-existing',
  authenticateJWT,
  [
    body('householdId').isInt().withMessage('Valid household ID is required'),
    body('itemId').isInt().withMessage('Valid item ID is required'),
    body('location').isIn(['in_house']).withMessage('Location must be "in_house"'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date')
  ],
  validateRequest,
  householdItemController.addExistingItem
);

router.patch(
  '/move-to-buy',
  authenticateJWT,
  [
    body('householdItemId').isInt().withMessage('Valid household item ID is required'),
    body('householdId').isInt().withMessage('Valid household ID is required')
  ],
  validateRequest,
  householdItemController.moveItemToBuy
);

router.patch(
  '/move-to-house',
  authenticateJWT,
  [
    body('householdItemId').isInt().withMessage('Valid household item ID is required'),
    body('householdId').isInt().withMessage('Valid household ID is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date')
  ],
  validateRequest,
  householdItemController.moveItemToHouse
);

router.get(
  '/',
  authenticateJWT,
  [
    query('householdId').isInt().withMessage('Valid household ID is required'),
    query('location').optional().isIn(['in_house', 'to_buy']).withMessage('Invalid location')
  ],
  validateRequest,
  householdItemController.getHouseholdItems
);

router.get(
  '/all-to-buy-itmes-in-all-households-user-in',
  authenticateJWT,
  [
    query('userId').isInt().withMessage('Valid user ID is required'),
  ],
  validateRequest,
  householdItemController.getAllToBuyItemsUserIsPartOfItsHousehold
);

router.post(
  '/delete-household-item',
  authenticateJWT,
  [
    body('householdItemId').isInt().withMessage('Valid household item ID is required'),
  ],
  validateRequest,
  householdItemController.deleteHouseholdItem
);

router.post(
  '/edit-household-item',
  authenticateJWT,
  [
    body('householdItemId').isInt().withMessage('Valid household item ID is required'),
    body('itemName').optional().isString().withMessage('Item name must be a string'),
    body('category').optional().isString().withMessage('Category must be a string'),
    body('itemPhoto').optional().isString().withMessage('Item photo must be a string'),
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  validateRequest,
  householdItemController.editHouseholdItem
);

module.exports = router;