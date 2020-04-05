require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = {
    getUserWithUserName(db, email) {
      return db('users')
        .where({ email })
        .first()
    },
    comparePasswords(password, hash) {
      return bcrypt.compare(password, hash)
    },

    createJwt(subject, payload) {
      return jwt.sign(payload, process.env.JWT_SECRET, {
        subject,
        expiresIn: process.env.JWT_EXPIRY,
        algorithm: 'HS256',
      })
    }, 
    verifyJwt(token) {
      return jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256']
      })
    }
  }
  
  module.exports = AuthService;