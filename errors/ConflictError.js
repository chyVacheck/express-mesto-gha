class ConflictError extends Error {
  constructor(errMessage) {
    super(errMessage);
    this.statusCode = 409;
    this.errorMessage = errMessage;
  }
}

module.exports = ConflictError;
