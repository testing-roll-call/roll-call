require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

function requireAuth(req, res, next) {
  const { authorization } = req.headers;

  // authorization === 'Bearer ey234903e0sdfsd...'
  if (!authorization) {
    console.log('Unauthorized');
    return res.status(401).send({ error: 'You must be logged in.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.' });
    }

    // decoded claims, sort of
    req.user = payload;
    next();
  });
}

module.exports = requireAuth;
