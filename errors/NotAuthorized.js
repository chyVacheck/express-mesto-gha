const { STATUS } = require('../utils/constants');

class NotAuthorized extends Error {
  constructor(errMessage) {
    super(errMessage);
    this.statusCode = STATUS.ERROR.NOT_AUTHORIZED;
    this.errorMessage = errMessage;
  }
}

module.exports = NotAuthorized;
