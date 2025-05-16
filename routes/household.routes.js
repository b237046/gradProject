const express = require('express');
const { body } = require('express-validator');
const householdController = require('../controllers/household.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post(
  '/create',
  authenticateJWT,
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Household name must be at least 2 characters long')
  ],
  validateRequest,
  householdController.createHousehold
);

router.post(
  '/join',
  authenticateJWT,
  [
    body('inviteCode')
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage('Invalid invite code format')
  ],
  validateRequest,
  householdController.joinHousehold
);

router.get(
  '/',
  authenticateJWT,
  householdController.getUserHouseholds
);

module.exports = router;