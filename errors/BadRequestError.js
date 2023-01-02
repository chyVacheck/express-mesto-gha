class BadRequestError extends Error {
  constructor(errMessage) {
    super(errMessage);
    this.statusCode = 400;
    this.errorMessage = errMessage;
  }
}

module.exports = BadRequestError;
