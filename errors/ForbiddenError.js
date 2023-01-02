const { STATUS } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = STATUS.ERROR.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
