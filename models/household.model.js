const db = require('../config/database');
const { generateVerificationCode } = require('../utils/helpers');

class Household {
  static async create(name) {
    try {
      const inviteCode = generateVerificationCode();
      const [result] = await db.query(
        'INSERT INTO households (name, invite_code) VALUES (?, ?)',
        [name, inviteCode]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async addMember(householdId, userId) {
    try {
      await db.query(
        'INSERT INTO household_users (household_id, user_id) VALUES (?, ?)',
        [householdId, userId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getByInviteCode(inviteCode) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM households WHERE invite_code = ?',
        [inviteCode]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByHouseholdId(householdId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM households WHERE household_id = ?',
        [householdId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUserHouseholds(userId) {
    try {
      const [rows] = await db.query(
        `SELECT h.* FROM households h
         JOIN household_users uh ON h.household_id = uh.household_id
         WHERE uh.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async verifyMembership(userId, householdId) {
    try {
      const [rows] = await db.query(
        'SELECT 1 FROM household_users WHERE user_id = ? AND household_id = ?',
        [userId, householdId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Household;