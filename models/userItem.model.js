const db = require('../config/database');

class UserItem {
  static async addUserItem(userId, itemId, location = 'in_home', itemPhoto = null, price = null, expirationDate = null) {
    try {
      const [result] = await db.query(
        `INSERT INTO user_items 
         (user_id, item_id, location, item_photo, price, expiration_date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, itemId, location, itemPhoto, price, expirationDate]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async moveItem(userItemId, userId, newLocation) {
    try {
      const [result] = await db.query(
        'UPDATE user_items SET location = ? WHERE user_item_id = ? AND user_id = ?',
        [newLocation, userItemId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getUserItems(userId, location = null, tag = null) {
    try {
      let query = `
        SELECT ui.*, i.item_name, i.item_photo as global_photo, i.user_created,
               GROUP_CONCAT(uit.tag) as tags
        FROM user_items ui
        JOIN items i ON ui.item_id = i.item_id
        LEFT JOIN user_item_tags uit ON ui.user_item_id = uit.user_item_id
        WHERE ui.user_id = ?
      `;
      
      const params = [userId];
      
      if (location) {
        query += ' AND ui.location = ?';
        params.push(location);
      }
      
      if (tag) {
        query += ' AND EXISTS (SELECT 1 FROM user_item_tags t WHERE t.user_item_id = ui.user_item_id AND t.tag = ?)';
        params.push(tag);
      }
      
      query += ' GROUP BY ui.user_item_id';
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async addTag(userItemId, userId, tag) {
    try {
      // Verify user owns the item
      const [userItem] = await db.query(
        'SELECT user_item_id FROM user_items WHERE user_item_id = ? AND user_id = ?',
        [userItemId, userId]
      );
      
      if (!userItem.length) {
        throw new Error('User item not found');
      }
      
      const [result] = await db.query(
        'INSERT INTO user_item_tags (user_item_id, tag) VALUES (?, ?)',
        [userItemId, tag]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getTags(userItemId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT t.* FROM user_item_tags t
         JOIN user_items ui ON t.user_item_id = ui.user_item_id
         WHERE ui.user_item_id = ? AND ui.user_id = ?`,
        [userItemId, userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserItem;