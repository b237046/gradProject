const express = require('express');
const { body, query } = require('express-validator');
const userItemController = require('../controllers/userItem.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post(
  '/add',
  authenticateJWT,
  [
    body('itemId').isInt().withMessage('Valid item ID is required'),
    body('location').optional().isIn(['in_home', 'to_buy']).withMessage('Invalid location'),
    body('itemPhoto').optional().isURL().withMessage('Item photo must be a valid URL'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('expirationDate').optional().isDate().withMessage('Invalid expiration date')
  ],
  validateRequest,
  userItemController.addUserItem
);

router.patch(
  '/move',
  authenticateJWT,
  [
    body('userItemId').isInt().withMessage('Valid user item ID is required'),
    body('location').isIn(['in_home', 'to_buy']).withMessage('Invalid location')
  ],
  validateRequest,
  userItemController.moveItem
);

router.get(
  '/',
  authenticateJWT,
  [
    query('location').optional().isIn(['in_home', 'to_buy']).withMessage('Invalid location'),
    query('tag').optional().isString().withMessage('Invalid tag')
  ],
  validateRequest,
  userItemController.getUserItems
);

router.post(
  '/:userItemId/tags',
  authenticateJWT,
  [
    body('tag').trim().isLength({ min: 1, max: 50 }).withMessage('Tag must be between 1 and 50 characters')
  ],
  validateRequest,
  userItemController.addTag
);

router.get(
  '/:userItemId/tags',
  authenticateJWT,
  userItemController.getTags
);

module.exports = router;