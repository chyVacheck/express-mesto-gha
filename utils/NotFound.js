
const { MESSAGE, STATUS } = require('./constants.js');

function NotFound(req, res) {
  res.status(STATUS.ERROR.NOT_FOUND).send({ message: MESSAGE.ERROR.NOT_FOUND});
};

module.exports = { NotFound }