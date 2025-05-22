const db = require('../config/database');

class Item {
  static async searchItemsByName(name) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM items 
         WHERE item_name LIKE ? 
         ORDER BY item_name ASC`,
        [`%${name}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async searchItemsByBarcode(barcode) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM items 
         WHERE barcode = ? 
         ORDER BY item_name ASC`,
        [barcode]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async createItem(itemName, category, itemPhoto = null, barcode = null) {
    try {
      const [result] = await db.query(
        'INSERT INTO items (item_name, category, item_photo, barcode) VALUES (?, ?, ?, ?)',
        [itemName, category, itemPhoto, barcode]
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