// auth.js
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_ulsa';

function generateToken(user) {
  return jwt.sign({ id_usuario: user.id_usuario, correo: user.correo }, SECRET_KEY, {
    expiresIn: '1h'
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
