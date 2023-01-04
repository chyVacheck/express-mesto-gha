const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotAuthorized = require('../errors/NotAuthorized');
const NotFoundError = require('../errors/NotFoundError');

module.exports = {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotAuthorized,
  NotFoundError,
};
