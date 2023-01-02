const { STATUS } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = STATUS.ERROR.NOT_FOUND;
  }
}

module.exports = NotFoundError;
