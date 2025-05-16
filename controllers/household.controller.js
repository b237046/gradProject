const Household = require('../models/household.model');

exports.createHousehold = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const householdId = await Household.create(name);
    await Household.addMember(householdId, userId);

    const household = await Household.getByHouseholdId(householdId);
    
    res.status(201).json({
      message: 'Household created successfully',
      household
    });
  } catch (error) {
    next(error);
  }
};

exports.joinHousehold = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    const household = await Household.getByInviteCode(inviteCode);
    if (!household) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    await Household.addMember(household.household_id, userId);
    
    res.status(200).json({
      message: 'Joined household successfully',
      household
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserHouseholds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const households = await Household.getUserHouseholds(userId);
    
    res.status(200).json({ households });
  } catch (error) {
    next(error);
  }
};