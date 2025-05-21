const db = require('../config/database');

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.is_verified = userData.is_verified || false;
    this.verification_code = userData.verification_code;
    this.code_expiry = userData.code_expiry;
  }

  async save() {
    try {
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, verification_code, code_expiry) VALUES (?, ?, ?, ?, ?)',
        [this.name, this.email, this.password, this.verification_code, this.code_expiry]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(email, code) {
    try {
      const [result] = await db.query(
        'UPDATE users SET is_verified = true, verification_code = NULL, code_expiry = NULL WHERE email = ? AND verification_code = ? AND code_expiry > NOW()',
        [email, code]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateVerificationCode(email, code, expiry) {
    try {
      const [result] = await db.query(
        'UPDATE users SET verification_code = ?, code_expiry = ? WHERE email = ?',
        [code, expiry, email]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const [rows] = await db.query('SELECT id, name, email, is_verified FROM users WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;