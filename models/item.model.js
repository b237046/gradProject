const db = require('../config/database');

class Item {
  static async searchItems(keyword) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM items 
         WHERE item_name LIKE ? 
         ORDER BY item_name ASC`,
        [`%${keyword}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async createItem(itemName, itemPhoto = null) {
    try {
      const [result] = await db.query(
        'INSERT INTO items (item_name, item_photo) VALUES (?, ?)',
        [itemName, itemPhoto]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getItemById(itemId) {
    try {
      const [rows] = await db.query('SELECT * FROM items WHERE item_id = ?', [itemId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Item;