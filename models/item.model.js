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

  static async createItem(itemName, category, itemPhoto, barcode = null) {
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

  static async editItem(itemId, itemName, category, itemPhoto) {
    try {

        const [existingResult] = await db.query(
          'SELECT item_name, category, item_photo FROM items WHERE item_id = ?',
          [itemId]
        );

        if (existingResult.length === 0) {
          throw new Error('Item not found.');
        }
  
        const existing = existingResult[0];
  
        // Use existing values if not provided
        const finalItemName = itemName ?? existing.item_name;
        const finalCategory = category ?? existing.category;
        const finalItemPhoto = itemPhoto ?? existing.item_photo;

      const [result] = await db.query(
        `UPDATE items SET item_name = ?, category = ?, item_photo = ? WHERE item_id = ?`,
        [finalItemName, finalCategory, finalItemPhoto, itemId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Item;