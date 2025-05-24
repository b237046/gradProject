const Item = require('../models/item.model');
const HouseholdItem = require('../models/householdItem.model');
const Household = require('../models/household.model');

exports.searchItemsByName = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const items = await Item.searchItemsByName(name.trim());
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

exports.searchItemsByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    
    const items = await Item.searchItemsByBarcode(barcode.trim());
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

exports.createAndAddItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      itemName, 
      itemPhoto = 'https://i.pinimg.com/736x/82/be/d4/82bed479344270067e3d2171379949b3.jpg',
      location,
      price,
      expirationDate,
      householdId,
      barcode,
      category
    } = req.body;
    
    // Verify user is member of household
    const isMember = await Household.verifyMembership(userId, householdId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this household' });
    }

    // Create new item
    const itemId = await Item.createItem(itemName, category, itemPhoto, barcode);

    // Add item to household
    const householdItemId = await HouseholdItem.addHouseholdItem(
      householdId,
      itemId,
      location,
      price,
      expirationDate
    );
    
    const item = await Item.getItemById(itemId);
    
    res.status(201).json({ 
      message: 'Item created and added to household successfully',
      item,
      householdItemId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An item with this name or barcode already exists' });
    }
    next(error);
  }
};