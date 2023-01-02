const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/NotAuthorized');
// ? из констант
const { MESSAGE } = require('../utils/constants');

// ! из env
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthorized(MESSAGE.ERROR.NOT_AUTHORIZED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return next(new NotAuthorized(MESSAGE.ERROR.NOT_AUTHORIZED));
  }

  req.user = payload;
  return next();
};
