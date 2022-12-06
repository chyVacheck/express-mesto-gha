
const MESSAGE = {
  ERROR: {
    BAD_REQUEST: 'BAD REQUEST',
    NOT_FOUND: 'NOT FOUND',
    SERVER: 'SERVER ERROR',
  },
  INFO: {
    CREATED: 'CREATED',
    DELETE: 'DELETED',
    PUT: 'PUTED',
    PATCH: 'PATCHED'
  }
}

const STATUS = {
  ERROR: {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER: 500,
  },
  INFO: {
    OK: 200,
    CREATED: 201,
  }
}

module.exports = { MESSAGE, STATUS }
