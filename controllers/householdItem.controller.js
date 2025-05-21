const HouseholdItem = require('../models/householdItem.model');
const Household = require('../models/household.model');
const Item = require('../models/item.model');

exports.addExistingItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { householdId, itemId, location = 'in_house', price, expirationDate } = req.body;
    
    // Verify user is member of household
    const isMember = await Household.verifyMembership(userId, householdId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    // Verify item exists
    const item = await Item.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const householdItemId = await HouseholdItem.addHouseholdItem(
      householdId,
      itemId,
      location,
      null, // itemPhoto is not needed for existing items
      price,
      expirationDate
    );
    
    res.status(201).json({
      message: 'Item added to household successfully',
      householdItemId,
      item
    });
  } catch (error) {
    next(error);
  }
};

exports.moveItemToBuy = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { householdItemId, householdId } = req.body;
    
    // Verify user is member of household
    const isMember = await Household.verifyMembership(userId, householdId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    // Verify item is in 'in_house' location
    const item = await HouseholdItem.getHouseholdItemById(householdItemId);
    if (!item) {
      return res.status(404).json({ message: 'Household item not found' });
    }

    if (item.location !== 'in_house') {
      return res.status(400).json({ message: 'Item must be in house to move to shopping list' });
    }

    const success = await HouseholdItem.moveItem(householdItemId, householdId, 'to_buy');
    
    if (!success) {
      return res.status(404).json({ message: 'Failed to move item' });
    }
    
    res.json({ message: 'Item moved to shopping list successfully' });
  } catch (error) {
    next(error);
  }
};

exports.moveItemToHouse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { householdItemId, householdId, price, expirationDate } = req.body;
    
    // Verify user is member of household
    const isMember = await Household.verifyMembership(userId, householdId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    // Verify item is in 'to_buy' location
    const item = await HouseholdItem.getHouseholdItemById(householdItemId);
    if (!item) {
      return res.status(404).json({ message: 'Household item not found' });
    }

    if (item.location !== 'to_buy') {
      return res.status(400).json({ message: 'Item must be in shopping list to move to house' });
    }

    const success = await HouseholdItem.moveItemToHouse(
      householdItemId,
      householdId,
      price,
      expirationDate
    );
    
    if (!success) {
      return res.status(404).json({ message: 'Failed to move item' });
    }
    
    res.json({ message: 'Item moved to house successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseholdItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { householdId, location } = req.query;
    
    // Verify user is member of household
    const isMember = await Household.verifyMembership(userId, householdId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    const items = await HouseholdItem.getHouseholdItems(householdId, location);
    res.json({ items });
  } catch (error) {
    next(error);
  }
};