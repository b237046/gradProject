const UserItem = require('../models/userItem.model');

exports.addUserItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId, location, itemPhoto, price, expirationDate } = req.body;
    
    const userItemId = await UserItem.addUserItem(
      userId,
      itemId,
      location,
      itemPhoto,
      price,
      expirationDate
    );
    
    res.status(201).json({
      message: 'Item added to your list',
      userItemId
    });
  } catch (error) {
    next(error);
  }
};

exports.moveItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userItemId, location } = req.body;
    
    if (!['in_home', 'to_buy'].includes(location)) {
      return res.status(400).json({ message: 'Invalid location' });
    }
    
    const success = await UserItem.moveItem(userItemId, userId, location);
    
    if (!success) {
      return res.status(404).json({ message: 'User item not found' });
    }
    
    res.json({ message: 'Item moved successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getUserItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { location, tag } = req.query;
    
    const items = await UserItem.getUserItems(userId, location, tag);
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

exports.addTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userItemId } = req.params;
    const { tag } = req.body;
    
    if (!tag || tag.length < 1 || tag.length > 50) {
      return res.status(400).json({ message: 'Tag must be between 1 and 50 characters' });
    }
    
    await UserItem.addTag(userItemId, userId, tag);
    res.status(201).json({ message: 'Tag added successfully' });
  } catch (error) {
    if (error.message === 'User item not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userItemId } = req.params;
    
    const tags = await UserItem.getTags(userItemId, userId);
    res.json({ tags });
  } catch (error) {
    next(error);
  }
};