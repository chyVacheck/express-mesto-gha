const { STATUS } = require('../utils/constants');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = STATUS.ERROR.FORBIDDEN;
  }
}
