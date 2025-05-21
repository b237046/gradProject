const HouseholdItem = require('../models/householdItem.model');
const Household = require('../models/household.model');
const Item = require('../models/item.model');

exports.getTopHouseholdItemsByTotalPurchasePrice = async (req, res, next) => {   

    try {
        const userId = req.user.id;
        const { householdId } = req.query;

        // Verify user is member of household
        const isMember = await Household.verifyMembership(userId, householdId);
        if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this household' });
        }

        // Get top 5 items by total purchase price
        const items = await HouseholdItem.getTopHouseholdItemsByTotalPurchasePrice(householdId);
    
        res.status(200).json({
            message: 'Top 5 items by total purchase price retrieved successfully',
            items
        });
    } catch (error) {
        next(error);
    }
};

exports.getBottomHouseholdItemsByTotalPurchasePrice = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { householdId } = req.query;

        // Verify user is member of household
        const isMember = await Household.verifyMembership(userId, householdId);
        if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this household' });
        }

        // Get bottom 5 items by total purchase price
        const items = await HouseholdItem.getBottomHouseholdItemsByTotalPurchasePrice(householdId);
    
        res.status(200).json({
            message: 'Bottom 5 items by total purchase price retrieved successfully',
            items
        });
    } catch (error) {
        next(error);
    }
};

exports.getTopHouseholdItemsByPurchaseCounter = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { householdId } = req.query;

        // Verify user is member of household
        const isMember = await Household.verifyMembership(userId, householdId);
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this household'});
        }

        // Get top 5 items by purchase counter
        const items = await HouseholdItem.getTopHouseholdItemsByPurchaseCounter(householdId);
    
        res.status(200).json({
            message: 'Top 5 items by purchase counter retrieved successfully',
            items
        });
    } catch (error) {
        next(error);
    }
};

exports.getBottomHouseholdItemsByPurchaseCounter = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { householdId } = req.query;

        // Verify user is member of household
        const isMember = await Household.verifyMembership(userId, householdId);
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this household' });
        }

        // Get bottom 5 items by purchase counter
        const items = await HouseholdItem.getBottomHouseholdItemsByPurchaseCounter(householdId);
    
        res.status(200).json({
            message: 'Bottom 5 items by purchase counter retrieved successfully',
            items
        });
    } catch (error) {
        next(error);
    }
};