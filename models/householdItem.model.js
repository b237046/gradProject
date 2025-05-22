const db = require('../config/database');

class HouseholdItem {
  static async addHouseholdItem(householdId, itemId, location = 'in_house', category, itemPhoto, price, expirationDate = null) {
    try {
      const [result] = await db.query(
        `INSERT INTO household_items 
         (household_id, item_id, location, category, item_photo, expiration_date, price, total_purchase_price, purchase_counter) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [householdId, itemId, location, category, itemPhoto, expirationDate, price, price]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async moveItem(householdItemId, householdId, newLocation) {
    try {
      const [result] = await db.query(
        'UPDATE household_items SET location = ? WHERE household_item_id = ? AND household_id = ?',
        [newLocation, householdItemId, householdId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async moveItemToHouse(householdItemId, householdId, price, expirationDate) {
    try {
      const [result] = await db.query(
        `UPDATE household_items 
         SET location = 'in_house', 
             price = ?,
             total_purchase_price = COALESCE(total_purchase_price, 0) + ?,
             expiration_date = ?,
             purchase_counter = purchase_counter + 1
         WHERE household_item_id = ? AND household_id = ?`,
        [price, price, expirationDate, householdItemId, householdId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getHouseholdItemById(householdItemId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM household_items WHERE household_item_id = ?',
        [householdItemId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getHouseholdItems(householdId, location = null) {
    try {
      let query = `
        SELECT hi.*, i.item_name, i.item_photo as global_photo
        FROM household_items hi
        JOIN items i ON hi.item_id = i.item_id
        WHERE hi.household_id = ?
      `;
      
      const params = [householdId];
      
      if (location) {
        query += ' AND hi.location = ?';
        params.push(location);
      }
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

    static async getTopHouseholdItemsByTotalPurchasePrice(householdId) {
    try {
      const [rows] = await db.query(
        `SELECT i.item_name, hi.total_purchase_price
        FROM household_items hi
        JOIN items i ON hi.item_id = i.item_id
        WHERE hi.household_id = ?
        ORDER BY hi.total_purchase_price DESC
        LIMIT 5`,
        [householdId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getBottomHouseholdItemsByTotalPurchasePrice(householdId) {
    try {
      const [rows] = await db.query(
        `SELECT i.item_name, hi.total_purchase_price
        FROM household_items hi
        JOIN items i ON hi.item_id = i.item_id
        WHERE hi.household_id = ?
        ORDER BY hi.total_purchase_price ASC
        LIMIT 5`,
        [householdId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTopHouseholdItemsByPurchaseCounter(householdId) {
    try {
      const [rows] = await db.query(
        `SELECT i.item_name, hi.purchase_counter
        FROM household_items hi
        JOIN items i ON hi.item_id = i.item_id
        WHERE hi.household_id = ?
        ORDER BY hi.purchase_counter DESC
        LIMIT 5`,
        [householdId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async getBottomHouseholdItemsByPurchaseCounter(householdId) {
    try {
      const [rows] = await db.query(
        `SELECT i.item_name, hi.purchase_counter
        FROM household_items hi
        JOIN items i ON hi.item_id = i.item_id
        WHERE hi.household_id = ?
        ORDER BY hi.purchase_counter ASC
        LIMIT 5`,
        [householdId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTotalMoneySpent(householdId) {
    try {
      const [rows] = await db.query(
        `SELECT SUM(total_purchase_price) AS total_money_spent
        FROM household_items
        WHERE household_id = ?`,
        [householdId]
      );
      return rows[0].total_money_spent;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HouseholdItem;